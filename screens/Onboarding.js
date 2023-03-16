import * as React from 'react';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../utils';

const Onboarding = ({ navigation }) => {
    const [email, onChangeEmail] = useState('');
    const [firstName, onChangeName] = useState('');
    const [valid, setValid] = useState(false);

    const saveData = async (firstName, email) => {
        const user = {
            firstName: {firstName},
            email: {email},
        }

        try {
            const jsonValue = JSON.stringify(user);
            await AsyncStorage.setItem('user', jsonValue);
        } catch (e) {
            console.error();
        }
    }

    const onboard = () => {
        saveData(firstName, email);
        navigation.navigate('Profile');
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <Image
                style={styles.image}
                source={require('../assets/little-lemon-logo.png')}
                resizeMode='contain'
                accessible={true}
                accessibilityLabel={'Little Lemon Logo'}
                />
            </View>
            <Text style={styles.regularText}>
                Let us get to know you!
            </Text>
            <TextInput 
                style={styles.inputBox}
                value={firstName}
                onChangeText={onChangeName}
                placeholder={'Type your name'}
            />
                <TextInput 
                style={styles.inputBox}
                value={email}
                onChangeText={onChangeEmail}
                onBlur={() => setValid(validateEmail(email))}
                placeholder={'Type your email'}
                keyboardType={'email-address'}
            />
            <Pressable
                style={valid ? styles.buttonEnabled : styles.buttonDisabled}
                disabled={valid ? false : true}
                onPress={onboard()}
            >
                <Text style={styles.buttonText}>
                Next
                </Text>
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

export default Onboarding;