import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import type { Database } from '@/lib/types/database';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  source_url: z.string().url('Enter a valid URL').nullable().optional().or(z.literal('')),
  steps: z.string().nullable().optional(),
  flour_type: z.string().nullable().optional(),
  hydration_percent: z.coerce.number().int().min(50).max(200).nullable().optional(),
  grade: z.coerce.number().int().min(1).max(5).nullable().optional(),
  notes: z.string().nullable().optional(),
  visibility: z.enum(['private', 'public']).default('private'),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

export const recipeKeys = {
  all: ['recipes'] as const,
  list: () => [...recipeKeys.all, 'list'] as const,
  detail: (id: string) => [...recipeKeys.all, 'detail', id] as const,
};

export function useRecipes() {
  const { user } = useAuth();

  return useQuery({
    queryKey: recipeKeys.list(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Recipe[];
    },
    enabled: !!user,
  });
}

export function useRecipe(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Recipe;
    },
    enabled: !!user && !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (values: RecipeFormValues) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          ...values,
          source_url: values.source_url || null,
          user_id: user.id,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Recipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.list() });
    },
  });
}

export function useUpdateRecipe(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Partial<RecipeFormValues>) => {
      const { data, error } = await supabase
        .from('recipes')
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Recipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recipeKeys.list() });
    },
  });
}

export function useDeleteRecipe(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.list() });
    },
  });
}
