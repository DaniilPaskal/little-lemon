import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useReducer, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './contexts/AuthContext';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home'
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      if (action.type === 'LOG_IN') {
        return {
          ...prevState,
          isLoading: false,
          isOnboardingComplete: action.isOnboardingComplete
        };
      }
    },
    {
      isLoading: true,
      isOnboardingComplete: false
    }
  )
  
  const clearAsyncStorage = async() => {
    AsyncStorage.clear();
  }

  useEffect(() => {
    (async () => {
      var profile;

      try {
        const getUser = await AsyncStorage.getItem('user');
        profile = getUser;
      } catch (e) {
          console.error(e);
      } finally {
        if (profile) {
          dispatch({ type: 'LOG_IN', isOnboardingComplete: true });
        } else {
          dispatch({ type: 'LOG_IN', isOnboardingComplete: false });
        }
      }
    })();
  }, []);

  const authContext = useMemo(() => ({
    logIn: async (data) => {
      try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem('user', jsonData);
      } catch (e) {
        console.error(e);
      }

      dispatch({ type: 'LOG_IN', isOnboardingComplete: true});
    },
    logOut: async () => {
      try {
        await AsyncStorage.clear();
      } catch (e) {
        console.error(e);
      }

      dispatch({ type: 'LOG_IN', isOnboardingComplete: false});
    },
    update: async (data) => {
      try {
        const jsonData = JSON.stringify(data);
        await AsyncStorage.setItem('user', jsonData);
      } catch (e) {
        console.error(e);
      }
    }
  }), []);

  if (state.isLoading) {
    return (
      <SplashScreen />
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isOnboardingComplete ? (
            <>
              <Stack.Screen name='Home' component={Home} />
              <Stack.Screen name='Profile' component={Profile} />
            </>
          ) : (
            <Stack.Screen name='Onboarding' component={Onboarding} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
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
