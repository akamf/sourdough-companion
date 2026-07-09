import { Stack } from 'expo-router';

export default function StarterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="feed" options={{ presentation: 'modal' }} />
      <Stack.Screen name="event" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
