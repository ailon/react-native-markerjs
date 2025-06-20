import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { AnnotationProvider } from '../context/AnnotationContext';

export default function TabLayout() {
  return (
    <AnnotationProvider>
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
          sceneStyle: {
            padding: 20,
          },
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
    </AnnotationProvider>
  );
}
