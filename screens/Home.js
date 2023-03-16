import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail } from '../utils';

const Profile = ({ navigation }) => {

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