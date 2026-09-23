import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FavoritesProvider } from './src/context/FavoritesContext';
import MainTabs from './src/navigation/MainTabs';
import { RootStackParamList } from './src/navigation/types';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
