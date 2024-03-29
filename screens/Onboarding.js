import * as React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { View, Image, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../utils/utils';
import { AuthContext } from '../contexts/AuthContext';

const Onboarding = ({ navigation }) => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [valid, setValid] = useState(false);
    const { logIn } = useContext(AuthContext);

    const validate = () => {
        if (user.firstName.length > 0 && user.lastName.length > 0 && validateEmail(user.email)) {
            setValid(true);
        } else {
            setValid(false);
        }
    }

    const handleChange = (name, value) => {
        setUser({ ...user, [name]: value });
    };

    const onboard = () => {
        logIn({ ...user });
    }

    const [fontsLoaded, fontError] = useFonts({
        'Karla-Medium': require('../assets/fonts/Karla-Medium.ttf'),
        'Karla-Bold': require('../assets/fonts/Karla-Bold.ttf'),
        'MarkaziText-Medium': require('../assets/fonts/MarkaziText-Medium.ttf'),
      })
    
      const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded, fontError]);
    
      if (!fontsLoaded && !fontError) {
        return null;
      }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <View style={styles.headerWrapper}>
                <Image
                style={styles.image}
                source={require('../assets/little-lemon-logo.png')}
                resizeMode='contain'
                accessible={true}
                accessibilityLabel={'Little Lemon Logo'}
                />
            </View>

            <View style={styles.heroSection}>
                <Text style={styles.heroHeader}>
                    Little Lemon
                </Text>
                <Text style={styles.heroSubheader}>
                    Chicago
                </Text>
                <Text style={styles.heroText}>
                    We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                </Text>
            </View>

            <Text style={styles.regularText}>
                Let us get to know you!
            </Text>
            <TextInput 
                style={styles.inputBox}
                value={user.firstName}
                onChangeText={(newValue) => handleChange('firstName', newValue)}
                placeholder={'First name'}
                onBlur={validate}
            />
            <TextInput 
                style={styles.inputBox}
                value={user.lastName}
                onChangeText={(newValue) => handleChange('lastName', newValue)}
                placeholder={'Last name'}
                onBlur={validate}
            />
            <TextInput 
                style={styles.inputBox}
                value={user.email}
                onChangeText={(newValue) => handleChange('email', newValue)}
                placeholder={'Email address'}
                keyboardType={'email-address'}
                onBlur={validate}
            />
            <Pressable
                style={valid ? styles.buttonEnabled : styles.buttonDisabled}
                disabled={valid ? false : true}
                onPress={onboard}
            >
                <Text style={styles.buttonText}>Next</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
    },
    image: {
        width: 150,
        height: 150,
    },
    heroSection: {
        backgroundColor: '#495E57',
        padding: 8,
    },
    heroHeader: {
        color: '#F4CE14',
        fontSize: 32,
        fontFamily: 'MarkaziText-Medium',
    },
    heroSubheader: {
        color: '#FFF',
        fontFamily: 'Karla-Medium',
        fontSize: 18,
        marginBottom: 8,
    },
    heroText: {
        color: '#FFF',
        fontFamily: 'Karla-Medium',
    },
    regularText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Karla-Bold',
        padding: 50,
        marginVertical: 8,
        textAlign: 'center',
        color: 'black',
    },
    inputBox: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: '#EDEFEE',
        backgroundColor: '#EDEFEE',
    },
    buttonEnabled: {
        fontSize: 22,
        padding: 10,
        marginVertical: 8,
        margin: 20,
        backgroundColor: '#495E57',
        borderRadius: 10,
    },
    buttonDisabled: {
        fontSize: 22,
        padding: 10,
        marginVertical: 8,
        margin: 20,
        backgroundColor: '#a3a5a8',
        borderRadius: 10,
    },
    buttonText: {
        color: '#EDEFEE',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'Karla-Medium',
    }
})

export default Onboarding;