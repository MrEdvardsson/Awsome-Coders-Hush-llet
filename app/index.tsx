//Välj hushåll 
import { Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <TouchableOpacity onPress={() => router.push({ pathname: "/housePage/sysslor" })}>
      <Text>Välj hushåll</Text>
    </TouchableOpacity>
  );
}