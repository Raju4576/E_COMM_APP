import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native'
import React, { useId } from 'react'
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipaddress } from './ipaddress';


const Ship3 = ({ route, navigation }) => {
    const { totalItem, totalQty, totalPrice } = route.params;
    const [userid, setUserId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pincode, setPincode] = useState('');
    const [shipid, setshipid] = useState('');
    const [errors, setErrors] = useState({});
    const [data, setData] = useState([]);
    const [shipdata, setShipdata] = useState(null);


    const getid = async () => {
        var value = await AsyncStorage.getItem('user');
        setUserId(value);
    }

    useEffect(() => {
        const listener = navigation.addListener('focus', () => {
            getid();
        });
        return listener;
    }, [navigation]);
    const validateFields = () => {
        let isValid = true;
        let tempErrors = {};

        if (!firstName) {
            tempErrors.firstName = '*';
            isValid = false;
        }

        if (!lastName) {
            tempErrors.lastName = '*';
            isValid = false;
        }

        if (!address) {
            tempErrors.address = '*';
            isValid = false;
        }

        if (!country) {
            tempErrors.country = '*';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            tempErrors.email = '*';
            isValid = false;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phone || !phoneRegex.test(phone)) {
            tempErrors.phone = '*';
            isValid = false;
        }
        const pincoderegex = /^\d{6}$/;
        if (!pincode || !pincoderegex.test(pincode)) {
            tempErrors.pincode = '*';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const fetchShippingData = () => {
        fetch(`${ipaddress}/showship`)
            .then(res => res.json())
            .then(data => {
                setData(data.data);
            })
            .catch(error => console.error('Error fetching shipping data:', error));
    };

    useEffect(() => {
        const listener = navigation.addListener('focus', () => {
            fetchShippingData(); 
        });

        return listener;
    }, [navigation]);

    useEffect(() => {
    
        if (userid && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].u_id === userid) {
                    setShipdata(data[i]); 
                    break; 
                }
            }
        }
    }, [userid, data]);

    useEffect(() => {
        if (shipdata) {
            setFirstName(shipdata.firstname || '');
            setLastName(shipdata.lastname || '');
            setAddress(shipdata.address || '');
            setCountry(shipdata.country || '');
            setEmail(shipdata.email || '');
            setPhone(shipdata.phone ? shipdata.phone.toString() : '');
            setPincode(shipdata.pincode ? shipdata.pincode.toString() : '');
            setshipid(shipdata._id);
        }
    }, [shipdata]);
    const okpress = async () => {
        // console.log('ok press');
        // console.log(shipid)
        if (validateFields()) {

            const sephone = parseInt(phone);
            const sepincode = parseInt(pincode)
            // Alert.alert('Success', 'Shipping details are valid!');
            // navigation.navigate('home');
            const response = await fetch(`${ipaddress}/shipupdate/${shipid}`, {

                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    address: address,
                    country: country,
                    email: email,
                    phone: sephone,
                    pincode: sepincode,
                    u_id: userid
                }),
            });

            if (response.ok) {
                console.log('ship update success');
                navigation.navigate('ship2', {
                    totalItem: totalItem,
                    totalQty: totalQty,
                    totalPrice: totalPrice
                });
                setFirstName('');
                setLastName('')
                setAddress('')
                setCountry('')
                setEmail('')
                setPhone('')
                setPincode('')
            } else {
                console.error('Failed to update cart:', response.statusText);
            }
        } else {
            Alert.alert('Validation Error', 'Please fill all fields correctly.');
        }
    }

    return (
        <View style={styles.maincont}>
            <View style={styles.box}>
                <View style={styles.col}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Item:</Text>
                        <Text style={styles.inputtxt}>{totalItem}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Total Qty:</Text>
                        <Text style={styles.inputtxt}>{totalQty}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label1}>Total Payable Amt:</Text>
                        <Text style={styles.inputtxt1}>{totalPrice}</Text>
                    </View>

                    {shipdata ? (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>First Name:</Text>
                                <TextInput
                                    style={[styles.input, errors.firstName && { borderColor: 'red' }]}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    placeholder="First Name"
                                />
                                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Last Name:</Text>
                                <TextInput
                                    style={[styles.input, errors.lastName && { borderColor: 'red' }]}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    placeholder="Last Name"
                                />
                                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Address:</Text>
                                <TextInput
                                    style={[styles.input, errors.address && { borderColor: 'red' }]}
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="Address"
                                />
                                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Country:</Text>
                                <TextInput
                                    style={[styles.input, errors.country && { borderColor: 'red' }]}
                                    value={country}
                                    onChangeText={setCountry}
                                    placeholder="Country"
                                />
                                {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Email:</Text>
                                <TextInput
                                    style={[styles.input, errors.email && { borderColor: 'red' }]}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Email"
                                    keyboardType="email-address"
                                />
                                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Mobile:</Text>
                                <TextInput
                                    style={[styles.input, errors.phone && { borderColor: 'red' }]}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Phone Number"
                                    keyboardType="numeric"
                                />
                                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>PinCode:</Text>
                                <TextInput
                                    style={[styles.input, errors.pincode && { borderColor: 'red' }]}
                                    value={pincode}
                                    onChangeText={setPincode}
                                    placeholder="Pincode"
                                    keyboardType="numeric"
                                />
                                {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
                            </View>
                        </>
                    ) : (
                        <Text>Loading shipping data...</Text>
                    )}
                </View>
                <View style={styles.lastrow}>
                    {/* <Pressable style={styles.btn}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>Ok</Text>
                    </Pressable> */}
                    <Pressable style={styles.btn} onPress={okpress}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>ok</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default Ship3

const styles = StyleSheet.create({
    btn: {
        alignSelf: 'center',
        backgroundColor: '#a6c6d3',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        margin: 10,
    },
    lastrow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    maincont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    col: {
        flexDirection: 'column',
    },
    box: {
        backgroundColor: '#D2DCE7',
        borderRadius: 10,
        padding: 10,
        margin: 10,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: 90,
        textAlign: 'center',
        marginRight: 10,
        color: 'black',
        fontSize: 16,
    },
    label1: {
        width: 150,
        textAlign: 'center',
        marginRight: 10,
        color: 'black',
        fontSize: 16,
    },
    input: {
        color: 'black',
        width: 220,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: 'white'
    },
    inputtxt: {
        color: 'black',
        width: 220,
        padding: 10,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',

    },
    inputtxt1: {
        color: 'black',
        width: 135,
        padding: 10,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginLeft: 5,
    }
});