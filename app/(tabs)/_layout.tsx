import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { fontSize } from '@/constants/spacing';
import { AppText } from '@/components/AppText';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.rye,
        tabBarInactiveTintColor: colors.warmGrayLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.creamBorder,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <AppText style={{ fontSize: 22, color }}>🏠</AppText>
          ),
        }}
      />
      <Tabs.Screen
        name="starters"
        options={{
          title: 'Starters',
          tabBarIcon: ({ color }) => (
            <AppText style={{ fontSize: 22, color }}>🫙</AppText>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => (
            <AppText style={{ fontSize: 22, color }}>📖</AppText>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <AppText style={{ fontSize: 22, color }}>⚙️</AppText>
          ),
        }}
      />
    </Tabs>
  );
}
