import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../utils';

const Profile = ({ navigation }) => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    const saveData = async () => {
        try {
            const jsonValue = JSON.stringify(user);
            await AsyncStorage.setItem('user', jsonValue);
        } catch (e) {
            console.error();
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const getUser = await AsyncStorage.getItem('user');
                setUser(JSON.parse(getUser));

                console.log('1')
                console.log(user);
            } catch (e) {
                console.error();
            }
        })();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        console.log(user);
    }

    const handleChangeImage = () => {

    }

    const handleRemoveImage = () => {

    }

    const handleLogout = () => {
        AsyncStorage.clear();
        navigation.navigate('Onboarding');
    }

    const handleDiscard = () => {
        
    }

    const handleSave = () => {
        saveData(user);
    }

    return (
        <View style={styles.container} behavior={'height'}>
            <View style={styles.headerWrapper}>
                <Image
                    style={styles.image}
                    source={require('../assets/little-lemon-logo.png')}
                    resizeMode='contain'
                    accessible={true}
                    accessibilityLabel={'Little Lemon Logo'}
                />
            </View>
            <ScrollView>
                <Text style={styles.regularText}>
                    Personal information
                </Text>
                <View style={styles.headerWrapper}>
                    <Text style={styles.regularText}>
                        Avatar
                    </Text>
                    <Image
                        style={styles.image}
                        source={require('../assets/little-lemon-logo.png')}
                        resizeMode='contain'
                        accessible={true}
                        accessibilityLabel={'User profile image'}
                    />
                    <Pressable
                        style={styles.buttonEnabled}
                        onPress={handleChangeImage}
                    >
                        <Text style={styles.buttonText}>
                            Change
                        </Text>
                    </Pressable>
                    <Pressable
                        style={styles.buttonEnabled}
                        onPress={handleRemoveImage}
                    >
                        <Text style={styles.buttonText}>
                            Remove
                        </Text>
                    </Pressable>
                </View>

                <Text style={styles.regularText}>
                    First name
                </Text>
                <TextInput 
                    style={styles.inputBox}
                    value={user.firstName}
                    onChangeText={handleChange}
                />
                <Text style={styles.regularText}>
                    Last name
                </Text>
                <TextInput 
                    style={styles.inputBox}
                    value={user.lastName}
                    onChangeText={handleChange}
                />
                <Text style={styles.regularText}>
                    Email
                </Text>
                <TextInput 
                    style={styles.inputBox}
                    value={user.email}
                    onChangeText={handleChange}
                    onBlur={() => setValid(validateEmail(email))}
                    keyboardType={'email-address'}
                />
                <Text style={styles.regularText}>
                    Phone number
                </Text>
                <TextInput 
                    style={styles.inputBox}
                    value={user.phoneNumber}
                    onChangeText={handleChange}
                    onBlur={() => setValid(validateNumber(email))}
                    keyboardType={'phone-pad'}
                />

                <Text style={styles.regularText}>
                    Email notifications
                </Text>

                <Pressable
                    style={styles.buttonEnabled}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>
                        Log out
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.buttonDisabled}
                    disabled={true}
                    onPress={handleDiscard}
                >
                    <Text style={styles.buttonText}>
                        Discard changes
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.buttonEnabled}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>
                        Save changes
                    </Text>
                </Pressable>
            </ScrollView>
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
    regularText: {
        fontSize: 18,
        fontWeight: 'bold',
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
    }
})

export default Profile;