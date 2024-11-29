import { StyleSheet, Text, View, Pressable, Image, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipaddress } from './ipaddress';

const Profile = ({ navigation }) => {
    const [Uid, setUid] = useState(null);
    const [userData, setUserData] = useState({});
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');

    const getIdAndFetchData = async () => {
        try {
            const value = await AsyncStorage.getItem('user');
            if (value) {
                setUid(value);
                console.log('UID set on profile page:', value);

                // Fetch user data once Uid is set
                const response = await fetch(`${ipaddress}/finduser/${value}`);
                const data = await response.json();
                if (data && data.data) {
                    setUserData(data.data);
                    setEmail(data.data.email);
                    setMobile(data.data.mobile);
                    setPass(data.data.password);
                    setName(data.data.name);
                    console.log('Fetched user data:', data.data);
                } else {
                    console.log('API response format incorrect:', data);
                }
            } else {
                console.log('ID not found in AsyncStorage');
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const focusListener = navigation.addListener('focus', () => {
            getIdAndFetchData();
        });
        return () => {
            focusListener();
        };
    }, [navigation]);

    const gotoupdate = () => {
        navigation.navigate('image', { userid: Uid });
    };

    return (
        <>
            <View style={styles.cont}>
                <Image source={require('./img/profile1.webp')} style={styles.profileimage}></Image>
                <Text style={{ fontWeight: 'bold', fontSize: 20, margin: 5, color: 'black' }}>{name}</Text>
                <View style={styles.col}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, margin: 5 }}>Your Email</Text>
                    <TextInput style={styles.input} value={email} editable={false} />

                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, margin: 5, marginTop: 20 }}>Your Mobile</Text>
                    <TextInput style={styles.input} value={mobile.toString()} editable={false} />

                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, margin: 5, marginTop: 20 }}>Your Password</Text>
                    <TextInput style={styles.input} value={pass} editable={false} secureTextEntry={true} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30, width: '95%' }}>
                    <Pressable style={{ backgroundColor: 'black', padding: 10, borderRadius: 10, marginRight: 20 }}>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Ok</Text>
                    </Pressable>
                    <Pressable style={{ backgroundColor: 'black', padding: 10, borderRadius: 10, marginLeft: 20 }} onPress={gotoupdate}>
                        <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Update</Text>
                    </Pressable>
                </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        padding: 10,
                        alignItems: 'center',
                        width: '100%',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}>
                    <View>
                        <Pressable onPress={() => navigation.navigate('home')}>
                            <Image source={require('./img/home.webp')} style={styles.bottomicon}></Image>
                        </Pressable>
                        <Text style={{ fontWeight: 'bold' }}>Home</Text>
                    </View>
                    <View>
                        <Pressable onPress={() => navigation.navigate('cart')}>
                            <Image source={require('./img/cart.png')} style={styles.bottomicon}></Image>
                        </Pressable>
                        <Text style={{ fontWeight: 'bold' }}>Cart</Text>
                    </View>
                    <View>
                        <Pressable onPress={() => navigation.navigate('profile')}>
                            <Image source={require('./img/profile.webp')} style={styles.bottomicon}></Image>
                        </Pressable>
                        <Text style={{ fontWeight: 'bold' }}>Profile</Text>
                    </View>
                </View>
            </View>
        </>
    );
};

export default Profile;

const styles = StyleSheet.create({
    cont: {
        alignItems: 'center',
        flex: 1,
    },
    bottomicon: {
        height: 35,
        width: 35,
    },
    profileimage: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 1,
        alignSelf: 'center',
        backgroundColor: 'black',
        marginTop: 50,
    },
    col: {
        marginTop: 50,
        width: '95%',
    },
    input: {
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        color: 'black',
        fontSize: 17,
        paddingHorizontal: 10,
    },
});
