import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, Pressable, TextInput } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ipaddress } from './ipaddress';

const ImagePickerExample = ({ route, navigation }) => {
    const { userid } = route.params
    const [imageUri, setImageUri] = useState(null);
    const [userData, setUserData] = useState({});
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    const validate = () => {
        let valid = true;
        let errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = "*";
            valid = false;
        }
        if (!pass || pass.length < 6) {
            errors.pass = "*";
            valid = false;
        }
        const mobileRegex = /^\d{10}$/;
        if (!mobile || !mobileRegex.test(mobile)) {
            errors.mobile = "*";
            valid = false;
        }
        setErrors(errors);
        return valid;
    };




    // Open Camera
    const openCamera = () => {
        const options = {
            mediaType: 'photo',
            saveToPhotos: true,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const selectedImage = response.assets[0];
                setImageUri(selectedImage.uri);
                // console.log('Selected Image:', selectedImage); 
                console.log('Image Name:', selectedImage.fileName);
            }
        });
    };

    // Open Image Library
    const openGallery = () => {
        const options = {
            mediaType: 'photo',
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const selectedImage = response.assets[0]; // Get the first selected asset
                setImageUri(selectedImage.uri); // Set the image URI
                // console.log('Selected Image:', selectedImage);
                console.log('Image Name:', selectedImage.fileName); // 
            }
        });
    };
    const fetchuserData = async () => {
        if (userid) {
            try {
                const response = await fetch(`${ipaddress}/finduser/${userid}`);
                const data = await response.json();
                setUserData(data.data); // Assuming your API returns the data under "data"
                setEmail(data.data.email);
                setMobile(data.data.mobile);
                setPass(data.data.password);
                setName(data.data.name);
                console.log('Fetched user data:', data.data);
            } catch (error) {
                console.log('Error fetching user data:', error);
            }
        } else {
            console.log('No UID available to fetch user data');
        }
    }
    useEffect(() => {
        fetchuserData();
    }, [userid])

    const gotoupdate = async () => {
        if (validate()) {
            const mo=parseInt(mobile)
            const response = await fetch(`${ipaddress}/updateuser/${userid}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: pass,
                    mobile:mo
                }),
            });
            if (response.ok) {
                console.log('Profile update success');
                setEmail('');
                setMobile('');
                setPass('');
                navigation.navigate('profile')
            }
        }

    }

    return (
        <View style={styles.container}>
            {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
                <Image source={require('./img/profile1.webp')} style={styles.profileimage}></Image>
            )}
            <Text style={{ fontWeight: 'bold', fontSize: 20, margin: 5, color: 'black' }}>{name}</Text>

            <View style={styles.row}>
                <Pressable onPress={openCamera} >
                    <Image style={{ height: 40, width: 40 }} source={require('./img/camera/camera.png')}></Image>
                </Pressable>
                <Pressable onPress={openGallery}>
                    <Image style={{ height: 40, width: 40 }} source={require('./img/imagepicker.png')}></Image>
                </Pressable>
            </View>
            <View style={styles.col}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, margin: 5 }}>Your Email</Text>
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>
                <TextInput style={[styles.input, errors.email && { borderColor: 'red' }]}
                    value={email}
                    onChangeText={setEmail} />


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, margin: 5 }}>Your Mobile</Text>
                    {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
                </View>
                <TextInput style={[styles.input, errors.mobile && { borderColor: 'red' }]} value={mobile.toString()} onChangeText={setMobile}></TextInput>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 15, margin: 5 }}>Your Password</Text>
                    {errors.pass && <Text style={styles.errorText}>{errors.pass}</Text>}
                </View>
                <TextInput
                    style={[styles.input, errors.pass && { borderColor: 'red' }]}
                    value={pass}
                    onChangeText={setPass}
                />

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30, width: '95%' }}>
                <Pressable style={{ backgroundColor: 'black', padding: 10, borderRadius: 10, marginRight: 20 }}>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Cancel</Text>
                </Pressable>
                <Pressable style={{ backgroundColor: 'black', padding: 10, borderRadius: 10, marginLeft: 20 }} onPress={gotoupdate}>
                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Update</Text>
                </Pressable>

            </View>
        </View>
    );
};

export default ImagePickerExample;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        padding: 16,
    },

    profileimage: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderColor: 'black',
        borderWidth: 1,
        alignSelf: 'center',
        backgroundColor: 'black',
        marginTop: 30,
        marginBottom: 16
    },
    errorText: {
        color: 'red'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    placeholder: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 16,
    },
    row: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    col: {
        // flexDirection: 'column',
        marginTop: 50,
        // backgroundColor:'grey',
        width: '95%',
    },
    input: {
        // width: '95%',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 1,
        color: 'black',
        fontSize: 17,
        paddingHorizontal: 10
    }
});
