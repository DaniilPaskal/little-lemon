import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home'
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const values = await AsyncStorage.multiGet(Object.keys(user));
                const user = values.reduce((acc, curr) => {
                    acc[curr[0]] = JSON.parse(curr[1]);
                    return acc;
                }, {});
                setUser(user);
            } catch (e) {
                console.error();
            }
        })
    })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user.name &&
          <Stack.Screen name='Onboarding' component={Onboarding} />
        }
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Profile' component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
