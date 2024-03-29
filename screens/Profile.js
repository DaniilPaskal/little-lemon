import * as React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import { View, Image, Text, TextInput, Pressable, StyleSheet, ScrollView, Platform, ToastAndroid, AlertIOS } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import { validateEmail } from '../utils/utils';
import { AuthContext } from '../contexts/AuthContext';

const Profile = ({ navigation }) => {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        image: '',
        phoneNumber: '',
        notifications: false
    });
    const [valid, setValid] = useState(true);
    const [changed, setChanged] = useState(false);
    const { logOut } = useContext(AuthContext);
    const { update } = useContext(AuthContext);

    const loadUser = async () => {
        try {
            const getUser = await AsyncStorage.getItem('user');
            setUser(JSON.parse(getUser));
        } catch (e) {
            console.error();
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const validate = () => {
        if (user.firstName.length > 0 && user.lastName.length > 0 && validateEmail(user.email)) {
            setValid(true);
        } else {
            setValid(false);
        }
    }

    const notify = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            AlertIOS.alert(message);
        }
    }

    const handleChange = (name, value) => {
        setUser({ ...user, [name]: value });
        setChanged(true);
    };

    const handleChangeImage = async () => {
        var newImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true
        });

        setUser({ ...user, image: newImage.assets[0].uri});
    };

    const handleRemoveImage = () => {
        setUser({ ...user, image: ''});
    };

    const handleLogout = () => {
        logOut();
    };

    const handleDiscard = () => {
        loadUser();  
        setChanged(false);
        notify('Changes discarded.');
    };

    const handleSave = () => {
        update(user);
        setChanged(false);
        notify('Changes saved!');
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
        <View style={styles.container} behavior={'height'} onLayout={onLayoutRootView}>
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
                <Text style={styles.regularText}>
                        Avatar
                </Text>
                <View style={styles.avatarWrapper}>
                    {user.image ? (
                        <Image style={styles.avatar} source={{ uri: user.image }} />
                    ) : (
                        <View style={styles.emptyAvatar}>
                            <Text style={styles.emptyAvatarText}>
                                {user.firstName && user.firstName.charAt(0).toUpperCase()}
                                {user.firstName && user.lastName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                    <Pressable
                        style={styles.avatarButton}
                        onPress={handleChangeImage}
                    >
                        <Text style={styles.buttonText}>
                            Change
                        </Text>
                    </Pressable>
                    <Pressable
                        style={styles.avatarButton}
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
                    onChangeText={(newValue) => handleChange('firstName', newValue)}
                    onBlur={validate}
                />
                <Text style={styles.regularText}>
                    Last name
                </Text>
                <TextInput 
                    style={styles.inputBox}
                    value={user.lastName}
                    onChangeText={(newValue) => handleChange('lastName', newValue)}
                    onBlur={validate}
                />
                <Text style={styles.regularText}>
                    Email
                </Text>
                <TextInput 
                    style={styles.inputBox}
                    value={user.email}
                    onChangeText={(newValue) => handleChange('email', newValue)}
                    onBlur={validate}
                    keyboardType={'email-address'}
                />
                <Text style={styles.regularText}>
                    Phone number
                </Text>
                <TextInput 
                    style={styles.inputBox}
                    value={user.phoneNumber}
                    onChangeText={(newValue) => handleChange('phoneNumber', newValue)}
                    onBlur={() => setValid(validateNumber(email))}
                    keyboardType={'phone-pad'}
                />

                <Text style={styles.regularText}>
                    Email notifications
                </Text>
                <Checkbox
                    style={styles.checkbox}
                    value={user.notifications}
                    onValueChange={(newValue) => handleChange('notifications', newValue)}
                />

                <Pressable
                    style={styles.buttonEnabled}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>
                        Log out
                    </Text>
                </Pressable>
                <Pressable
                    style={changed ? styles.buttonEnabled : styles.buttonDisabled}
                    disabled={changed ? false : true}
                    onPress={handleDiscard}
                >
                    <Text style={styles.buttonText}>
                        Discard changes
                    </Text>
                </Pressable>
                <Pressable
                    style={valid ? styles.buttonEnabled : styles.buttonDisabled}
                    disabled={valid ? false : true}
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
        backgroundColor: '#FFF',
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    avatarWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    avatarButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#495E57',
        borderRadius: 50,
    }, 
    title: {
        fontSize: 20,
        color: 'white',
    },
    image: {
        width: 50,
        height: 150,
    },
    avatarContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    avatar: {
        width: 75,
        height: 75,
        borderRadius: 50,
    },
    emptyAvatar: {
        width: 75,
        height: 75,
        borderRadius: 50,
        backgroundColor: '#495E57',
    },
    emptyAvatarText: {
        fontSize: 36,
        fontFamily: 'Karla-Medium',
        color: '#FFF',
        textAlign: 'center',
        marginTop: 10
    },
    regularText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Karla-Bold',
        textAlign: 'center',
        color: 'black',
        marginVertical: 8
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
    checkbox: {
        alignSelf: 'center',
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

export default Profile;