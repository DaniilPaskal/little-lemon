import * as React from 'react';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';

const Onboarding = ({ navigation }) => {
    const [email, onChangeEmail] = useState('');
    const [name, onChangeName] = useState('');
    const [valid, setValid] = useState(false);

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
            onBlur={() => setValid(validateName(firstName))}
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
            //onPress={() => navigation.navigate('Subscribe')}
        >
            <Text style={styles.buttonText}>
            Next
            </Text>
        </Pressable>
    </View>
    );
}