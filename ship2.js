import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipaddress } from './ipaddress';
import RazorpayCheckout from 'react-native-razorpay';

const Ship2 = ({ route, navigation }) => {
    const { totalItem, totalQty, totalPrice } = route.params;
    const [userid, setUserId] = useState(null);
    const [data, setData] = useState([]);
    const [shipdata, setShipdata] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    // Function to get user id from AsyncStorage
    const getid = async () => {
        var value = await AsyncStorage.getItem('user');
        setUserId(value);
    };

    useEffect(() => {
        const listener = navigation.addListener('focus', () => {
            getid();
        });
        return listener;
    }, [navigation]);


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

    const fetchCartData = () => {
        if (userid) {
            fetch(`${ipaddress}/showuser/${userid}`)
                .then(res => res.json())
                .then(data => {
                    setCartItems(data.data);
                })
                .catch(error => console.error('Error fetching cart data:', error));
        } else {
            console.log('User ID not found');
        }
    };

    // Fetch cart data after userid is retrieved
    useEffect(() => {
        if (userid) {
            fetchCartData();
        }
    }, [userid]);


    // const deleteCartItems = () => {
    // console.log('press')
    // for (let i = 0; i < cartItems.length; i++) {
    //     fetch(`${ipaddress}/deletecart/${cartItems[i]._id}`, {
    //         method: 'GET',
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(`Deleted item with ID: ${cartItems[i]._id}`);
    //         })
    //         .catch(error => console.error('Error deleting cart item:', error));
    // }
    // navigation.navigate('pay')
    // };

    const payNowBtnClick = () => {
        // let options = {
        //     description: 'Credits towards consultation',
        //     image: require('./img/camera/c1.jpg'), //require('../../images.png')
        //     currency: 'INR', //In USD - only card option will exist rest(like wallet, UPI, EMI etc) will hide
        //     key: 'rzp_test_KW4pxYgx85PfXU',
        //     amount: '10000',
        //     name: 'Acme Corp',
        //     order_id: 'order_P2ZY0rEmTe2J5P', //Replace this with an order_id(response.data.orderId) created using Orders API.
        //     prefill: {
        //         email: 'malaviyagaurav879@gmail.com',
        //         contact: '8200491979',
        //         name: 'Gaurav',
        //     }, //if prefill is not provided then on razorpay screen it has to be manually entered.
        //     theme: { color: '#53a20e' },
        // };
        // RazorpayCheckout.open(options)
        //     .then(data => {
        //         // handle success
        //         alert(`Success: ${data.razorpay_payment_id}`);
        //     })
        //     .catch(error => {
        //         // handle failure
        //         console.log(`Error: ${error.code} | ${error.description}`);
        //     });

        navigation.navigate('home')
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
                                <Text style={styles.inputtxt}>{shipdata.firstname}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Last Name:</Text>
                                <Text style={styles.inputtxt}>{shipdata.lastname}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Address:</Text>
                                <Text style={styles.inputtxt}>{shipdata.address}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Country:</Text>
                                <Text style={styles.inputtxt}>{shipdata.country}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Email:</Text>
                                <Text style={styles.inputtxt}>{shipdata.email}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Mobile:</Text>
                                <Text style={styles.inputtxt}>{shipdata.phone}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>PinCode:</Text>
                                <Text style={styles.inputtxt}>{shipdata.pincode}</Text>
                            </View>
                        </>
                    ) : (
                        <Text>Loading shipping data...</Text>
                    )}
                </View>
                <View style={styles.lastrow}>

                    <Pressable style={styles.btn} onPress={() => {
                        navigation.navigate('ship3', {
                            totalItem: totalItem,
                            totalQty: totalQty,
                            totalPrice: totalPrice
                        });
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>Edit</Text>
                    </Pressable>
                    <Pressable style={styles.btn} onPress={payNowBtnClick}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>ok</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default Ship2;

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
});
