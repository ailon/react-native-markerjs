import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Editor',
        }}
      />
      <Tabs.Screen
        name="viewer"
        options={{
          title: 'Viewer',
        }}
      />
      <Tabs.Screen
        name="renderer"
        options={{
          title: 'Renderer',
        }}
      />
    </Tabs>
  );
}
