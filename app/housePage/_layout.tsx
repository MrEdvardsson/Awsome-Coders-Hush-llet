import { Tabs } from 'expo-router';
import IonIcons from '@expo/vector-icons/Ionicons';

export default function RootLayout() {

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="sysslor.tsx" options={{
        tabBarIcon: ({ color, size }) => (<IonIcons name="home" color={color} size={size} />),
      }}
      />
      <Tabs.Screen name="statistik.tsx" options={{
        tabBarIcon: ({ color, size }) => (<IonIcons name="stats-chart" color={color} size={size} />),
      }}
      />
    </Tabs>
  );
}