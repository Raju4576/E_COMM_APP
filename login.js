import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipaddress } from './ipaddress';

const Login = ({ navigation }) => {

    const [uid, setUid] = useState(null);
    // const getid = async () => {
    //     var value = await AsyncStorage.getItem('user')
    //     if (value != null) {
    //         setUid(value);
    //     } else {
    //         console.log('id no found');
    //     }
    // }
    // useEffect(() => {
    //     navigation.addListener('focus', () => {
    //         getid()
    //     });
    //     console.log("id=" + uid);
    // }, [navigation]);
    const storeId = async (value) => {
        try {
            await AsyncStorage.setItem('user', value);
            console.log("Stored ID:", value);
        } catch (e) {
            console.log("Error storing the user ID:", e);
        }
    };
    

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const handleLogin = () => {
        let valid = true;

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (valid) {
            fetch(ipaddress + '/ulogin', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
            })
                .then(response => response.json())
                .then(async data => {
                    if (data.status === 'login success') {
                        Alert.alert("Login Success", "You have successfully logged in!");
                        const id = data.data._id;

                        // Store the user ID
                        await storeId(id);

                        // Confirm that the ID was stored
                        const storedId = await AsyncStorage.getItem('user');
                        console.log("Retrieved ID from storage:", storedId);

                        navigation.navigate('home');
                    } else {
                        Alert.alert("Login Failed", data.status);
                    }
                })
                .catch(error => {
                    console.error("Error during login:", error);
                    Alert.alert("Login Error", "An error occurred. Please try again later.");
                });
        }
    }


    return (
        <>
            <View style={styles.maincont}>
                <View style={styles.minicont}>
                    <Text style={styles.logintxt}>Login</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <TextInput
                        secureTextEntry={true}
                        keyboardType="default"
                        placeholder="Enter your password"
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

                    <Pressable style={styles.loginbtn} onPress={handleLogin}>
                        <Text style={styles.txtloginbtn}>Login</Text>
                    </Pressable>

                    <Pressable style={styles.forgotpasscnt}>
                        <Text style={styles.forgorpasstxt}>Forgot Password?</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('register')}>
                        <Text style={styles.signuptxt}>Don't have an account? Sign Up</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
}

export default Login;

const styles = StyleSheet.create({
    maincont: {
        flex: 1,
        backgroundColor: '#4d6285',
        justifyContent: 'center',
        alignItems: 'center',
    },
    minicont: {
        backgroundColor: 'white',
        width: '90%',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        borderRadius: 10
    },
    logintxt: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 50
    },
    input: {
        borderWidth: 1,
        padding: 10,
        width: '100%',
        marginTop: 30
    },
    loginbtn: {
        width: '100%',
        backgroundColor: 'orange',
        marginTop: 20,
        padding: 10,
        alignItems: 'center',
    },
    txtloginbtn: {
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    forgorpasstxt: {
        marginTop: 10,
        color: 'blue'
    },
    signuptxt: {
        marginTop: 10,
        color: 'blue',
        marginBottom: 70
    },
    forgotpasscnt: {
        marginBottom: 10
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginTop: 5
    }
});
