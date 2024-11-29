import { Image, Pressable, ScrollView, TextInput, StyleSheet, Text, View, BackHandler, Alert, Button } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useState, useEffect, useId } from 'react';
import { ipaddress } from './ipaddress';


const Addtocart = ({ route, navigation }) => {
    const [userid, setUserId] = useState(null);
    const [productdata, setProductsdata] = useState([])
    const [cart, setCart] = useState([])
    const [pids, setpids] = useState([])
    const [editValue, setEditValue] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [mainCartData, setMainCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalItem, setTotalItem] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const getid = async () => {
        var value = await AsyncStorage.getItem('user');
        // console.log('user id=' + value);
        setUserId(value);
    }
    useEffect(() => {
        const listener = navigation.addListener('focus', () => {
            getid();
        })
        return listener;
    })
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await fetch(`${ipaddress}/showcart`);
            const data = await res.json();
            setCart(data.data);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            fetchId();
        }
    }, [cart]);
    useEffect(() => {
        setLoading(true);
        fetch(ipaddress + `/v_product`)
            .then(res => res.json())
            .then(data => {
                setProductsdata(data.data)
            })
        setLoading(false);
    }, [pids]);
    useEffect(() => {
        if (productdata.length > 0 && pids.length > 0) {
            addtocartmethod();
        }
    }, [productdata, pids]);
    const fetchId = () => {
        const allpid = cart.map(item => item.p_id);
        setpids(allpid);
    };
    // const addtocartmethod = () => {
    //     let totalQuantities = 0;
    //     let totalPrices = 0;

    //     const matchedProducts = productdata.filter(product => {
    //         const cartItem = cart.find(item => item.p_id === product._id && item.u_id === userid);
    //         if (cartItem) {
    //             totalQuantities += cartItem.p_qty;
    //             totalPrices += cartItem.p_qty * product.p_price;
    //             return true;
    //         }
    //         return false;
    //     });

    //     setMainCartData(matchedProducts);
    //     setTotalQty(totalQuantities);
    //     setTotalPrice(totalPrices);
    //     setTotalItem(matchedProducts.length);
    // };

    const addtocartmethod = () => {
        let totalQuantities = 0;
        let totalPrices = 0;
        const matchedProducts = productdata.filter(product => {
            const cartItem = cart.find(item => item.p_id === product._id && item.u_id === userid);
            if (cartItem) {
                totalQuantities += cartItem.p_qty;
                totalPrices += cartItem.p_qty * product.p_price;
                return true;
            }
            return false;
        });
        setMainCartData(matchedProducts); // Only set state after filtering is done
        setTotalQty(totalQuantities);
        setTotalPrice(totalPrices);
        setTotalItem(matchedProducts.length);
    };

    useEffect(() => {
        const backAction = () => {
            navigation.replace('home');
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);


    const handleInputChange = (text) => {
        const parsedValue = parseInt(text, 10);
        if (!isNaN(parsedValue) && parsedValue > 0) {
            setEditValue(text);
        } else {
            setEditValue('1');
            Alert.alert('Qty', 'Enter valid qty otherwise your qty will 1');

        }
    };
    const editItem = (item) => {
        setSelectedItem(item);
        setEditValue(item ? item.p_qty.toString() : '1');
        setIsEditing(true);
    };
    const handleSave = async (id) => {
        const updatedQty = parseInt(editValue);

        // if (isNaN(updatedQty) || updatedQty <= 0) {
        //     setEditValue('1');
        // }

        const response = await fetch(`${ipaddress}/updatecart/${id}`, {

            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                p_qty: updatedQty,
            }),
        });

        if (response.ok) {

            console.log('Cart update success');
            setLoading(true);
            // Fetch updated cart data
            fetch(`${ipaddress}/showcart`)
                .then(res => res.json())
                .then(data => {
                    setCart(data.data);
                    setMainCartData(data.data.filter(item => pids.includes(item.p_id) && item.u_id === userid));
                });
            setLoading(false);
        } else {
            console.error('Failed to update cart:', response.statusText);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSelectedItem(null);
    };

    const deleteitem = async (id) => {
        try {
            const response = await fetch(`${ipaddress}/deletecart/${id}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Item deleted successfully');
                setLoading(true);
                // Fetch updated cart data
                fetch(`${ipaddress}/showcart`)
                    .then(res => res.json())
                    .then(data => {
                        setCart(data.data);
                        setMainCartData(data.data.filter(item => pids.includes(item.p_id) && item.u_id === userid));
                    });
                setLoading(false);
            } else {
                console.error('Failed to delete item:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    // if (loading) {
    //     return (
    //         <View style={styles.loadingContainer}>
    //             <Text style={styles.loadingText}>Loading...</Text>
    //         </View>
    //     );
    // }
    const checkAndNavigate = async () => {
        try {
            const response = await fetch(`${ipaddress}/showship`);
            const shipdata = await response.json();

            const userShipData = shipdata.data.find(item => item.u_id === userid);

            if (userShipData) {
                // If user shipping data exists, navigate to ship2
                navigation.navigate('ship2', {
                    totalItem: totalItem,
                    totalQty: totalQty,
                    totalPrice: totalPrice
                });
            } else {
                // Otherwise, navigate to the ship page
                navigation.navigate('ship', {
                    totalItem: totalItem,
                    totalQty: totalQty,
                    totalPrice: totalPrice
                });
            }
        } catch (error) {
            console.error('Error checking shipping data:', error);
        }
    };

    // Call checkAndNavigate when the user presses the checkout button
    const handleCheckout = () => {
        checkAndNavigate();
    };



    return (
        <>
            <ScrollView>
                <View style={styles.maincont}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    ) :
                        mainCartData.length === 0 ? (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={styles.txt}>No products found</Text>
                            </View>
                        ) : (
                            mainCartData.map((item, index) => {
                                const cartItem = cart.find(cartItem => cartItem.p_id === item._id && cartItem.u_id === userid);
                                return (

                                    <View style={{ flexDirection: 'column', backgroundColor: 'grey', marginTop: 10, borderRadius: 10 }} key={item._id}>
                                        <View style={styles.mainrow} key={index}>
                                            <Image style={styles.img1} source={{ uri: `${ipaddress}/images/${item.image}` }} />
                                            <View style={styles.col}>
                                                <Text style={styles.txt}>{item.p_name}</Text>
                                                <View style={styles.row}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={styles.txt}>Qty:</Text>
                                                        {/* Display the quantity from the cart item */}
                                                        <Text style={styles.txt}>{cartItem ? cartItem.p_qty : 'N/A'}</Text>
                                                    </View>

                                                    <View style={styles.smallrow}>
                                                        <Text style={styles.txt}>Total:</Text>
                                                        <Text style={styles.txt}>{((cartItem ? cartItem.p_qty : 'N/A') * item.p_price)}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.editdeleterow}>
                                            {/* <Text style={styles.txtaddtocart}>Check Out</Text> */}
                                            <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center' }}>
                                                <Pressable style={{ backgroundColor: 'green', padding: 5, borderRadius: 10 }} onPress={() => editItem(cartItem)} >
                                                    <Text style={styles.txtaddtocart}>Edit</Text>

                                                    {/* <Image source={require('./img/edit.jpg')} style={{ height: 50, width: 50 }} /> */}
                                                </Pressable>
                                                <Pressable style={{ backgroundColor: 'red', padding: 5, borderRadius: 10, marginLeft: 30 }} onPress={() => deleteitem(cartItem._id)}>
                                                    <Text style={styles.txtaddtocart}>Delete</Text>

                                                    {/* <Image source={require('./img/edit.jpg')} style={{ height: 50, width: 50 }} /> */}
                                                </Pressable>
                                            </View>
                                        </View>
                                        {isEditing && selectedItem === cartItem && (
                                            <View style={styles.editContainer}>
                                                <TextInput
                                                    style={styles.textInput}
                                                    placeholder="Enter quantity"
                                                    keyboardType="numeric"
                                                    // value={editValue}
                                                    onChangeText={handleInputChange}
                                                />
                                                <Pressable style={styles.saveButton} onPress={() => handleSave(cartItem._id)}>
                                                    <Text style={styles.saveButtonText}>Save</Text>
                                                </Pressable>
                                                <Pressable style={styles.cancelButton} onPress={handleCancel}>
                                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                                </Pressable>
                                            </View>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 5, backgroundColor: 'pink', alignSelf: 'center', padding: 5, width: '95%', borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Item:</Text>
                            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{totalItem}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Qty:</Text>
                            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{totalQty}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Price:</Text>
                            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>{totalPrice}</Text>
                        </View>
                    </View>

                    <Pressable
                        style={styles.addtocartrow}
                        onPress={handleCheckout}
                    >

                        <Text style={styles.txtaddtocart}>Check Out</Text>
                    </Pressable>


                </View>
            </ScrollView>
            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 10, alignItems: 'center', width: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
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

}

export default Addtocart

const styles = StyleSheet.create({
    img1: {
        height: 70,
        width: 70,
        resizeMode: 'stretch',

    },
    bottomicon: {
        height: 35,
        width: 35
    },
    addtocartrow: {
        flexDirection: 'row',
        width: '95%',
        backgroundColor: 'yellow',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 20
    },
    editdeleterow: {
        flexDirection: 'row',
        width: '95%',
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 20,
        alignSelf: 'center',
        marginBottom: 20
    },
    btn: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold'
    },
    txtaddtocart: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'

        // textAlign:'center'
    },
    cont: {
        backgroundColor: 'white',
        // padding:10,
        borderWidth: 1,
        borderRadius: 4,
        margin: 10,
        // height:30,

        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    smallrow: {
        flexDirection: 'row',
        // backgroundColor:'grey',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%'

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor:'yellow',
        width: '70%',
        marginTop: 10,
        marginLeft: 30
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    col: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor:'orange',
        // marginRight:20
        // height:'10%'
    },
    maincont: {
        flex: 1,
        // backgroundColor: 'white',
        padding: 5
    },
    mainrow: {
        flexDirection: 'row',
        padding: 10,
        alignContent: 'center',
        marginTop: 5
        // justifyContent:'space-between'
        // backgroundColor:'orange'
    },
    txt1: {
        marginLeft: 5
    },
    selectallrow: {
        flexDirection: 'row',
        // backgroundColor:'grey',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    minirow: {
        flexDirection: 'row',
        // justifyContent:'center'
        alignItems: 'center',
        // backgroundColor:'orange',
        // padding:10
    },
    txt: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        // marginLeft:20
        // marginRight:50
        // marginLeft:20

    },
    img: {
        height: 30,
        width: 30,
        resizeMode: 'stretch'
    },
    editContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    textInput: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
        padding: 5,
        marginRight: 10,
        width: '60%',
        marginBottom: 10
    },
    saveButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10

    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        marginBottom: 10

    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },


})