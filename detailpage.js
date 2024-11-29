import { Image, Pressable, StyleSheet, Text, TextInput, View,ActivityIndicator } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ipaddress } from './ipaddress';

const Detailpage = ({ route, navigation }) => {
    const [product, setProduct] = useState(null);
    const [uid, setuId] = useState(null);
    const [cart, setCart] = useState([]);
    const [pids, setpids] = useState([]);
    const [qty, setQty] = useState(1);
    const { pid } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'DETAIL PAGE',
            headerTitleAlign: 'center',
        });
    });

    const getid = async () => {
        var value = await AsyncStorage.getItem('user');
        setuId(value);
        console.log('uid', value);
    };

    useEffect(() => {
        const listener = navigation.addListener('focus', () => {
            getid();
        });
        return listener;
    }, [navigation]);

    useEffect(() => {
        fetch(`${ipaddress}/product/${pid}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data.data);

                // Fetch the cart data
                fetch(`${ipaddress}/showcart`)
                    .then(res => res.json())
                    .then(cartData => {
                        setCart(cartData.data); // Update the cart state with fetched data
                    })
                    .catch(err => console.error('Error fetching cart data:', err));
            })
            .catch(err => console.error('Error fetching product data:', err));
    }, [pid]);

    useEffect(() => {
        if (cart.length > 0) {
            fetchId();
        }
    }, [cart]);

    const fetchId = () => {
        const allpid = cart.map(item => item.p_id);
        // console.log('All PIDs:', allpid);
        setpids(allpid);
    };

    if (!product) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const inc = () => {
        setQty(prev => prev + 1);
    };

    const dec = () => {
        setQty(prevQty => (prevQty > 1 ? prevQty - 1 : 1));
    };

    const buy = async () => {
        if (!uid) {
            console.error('User ID is not available');
            return;
        }

        try {
            // Check if the product already exists in the cart
            const existingCartItem = cart.find(item => item.p_id === pid && item.u_id === uid);

            if (existingCartItem) {
                // If the product exists in the cart, update the existing entry
                const updatedQty = existingCartItem.p_qty + qty;

                const response = await fetch(`${ipaddress}/updatecart/${existingCartItem._id}`, {
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
                    navigation.navigate('cart', { pid });
                } else {
                    console.error('Failed to update cart:', response.statusText);
                }
            } else {
                // If the product is not in the cart, insert a new entry
                const response = await fetch(`${ipaddress}/cinsert/${pid}`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        u_id: uid,
                        p_qty: qty,
                        p_id: pid,
                    }),
                });

                if (response.ok) {
                    console.log('Cart insert success');
                    navigation.navigate('cart', { pid });
                } else {
                    console.error('Failed to insert into cart:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error processing cart operation:', error);
        }
    };


    return (
        <View style={styles.maincont}>
            <View style={styles.minicont1}>
                <Image source={{ uri: `${ipaddress}/images/${product.image}` }} style={styles.mainimg} />
            </View>
            <View style={styles.minicont2}>
                <Text style={styles.txtname}>{product.p_name}</Text>
                <View style={styles.mainrow}>
                    <View style={styles.reterow}>
                        <Image source={require('./img/star.png')} style={styles.imgrate} />
                        <Text style={styles.txt}>4.5</Text>
                    </View>
                    <View style={styles.likerow}>
                        <Image source={require('./img/like2.png')} style={styles.imgrate} />
                        <Text style={styles.txt}>95%</Text>
                    </View>
                    <View style={styles.likerow}>
                        <Image source={require('./img/mess.png')} style={styles.imgrate} />
                        <Text style={styles.txt}>9</Text>
                    </View>
                </View>
                <View style={styles.pricerow}>
                    <View style={styles.row}>
                        <Text style={styles.newprice}>${(product.p_price - (product.p_price * product.p_dis / 100)).toFixed(2)}</Text>
                        <Text style={styles.oldprice}>${product.p_price}</Text>
                    </View>
                    <Image source={require('./img/info4.png')} style={styles.imginfo} />
                </View>
                <Text style={styles.text} numberOfLines={5}>{product.p_desc}</Text>

                <View style={{ flexDirection: 'row', width: '100%', backgroundColor: '#D2DCE7', justifyContent: 'space-between', alignSelf: 'center', marginTop: 20, alignItems: 'center', borderRadius: 10 }}>
                    <View style={styles.smallrow} >
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Enter Qty:</Text>

                        <Pressable style={styles.cont} onPress={inc}>
                            <Text style={styles.btn}>+</Text>
                        </Pressable>
                        <Text style={styles.btn}>{qty}</Text>
                        <Pressable style={styles.cont} onPress={dec}>
                            <Text style={styles.btn}>-</Text>
                        </Pressable>
                    </View>
                    <View style={styles.smallrow1} >
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>Total:</Text>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>{((product.p_price - (product.p_price * product.p_dis / 100)) * qty).toFixed(2)}</Text>


                    </View>
                </View>

                <Pressable style={styles.addtocartrow} onPress={() => buy(product._id)}>
                    <Text style={styles.txtaddtocart}>Add to Cart</Text>
                </Pressable>
                {/* <Text style={styles.lasttxt}>Delivery on 26th December</Text> */}
            </View>
        </View>
    );
};

export default Detailpage;

const styles = StyleSheet.create({
    lasttxt: {
        fontSize: 16,
        color: 'grey',
        textAlign: 'center',
        marginTop: 10,
    },
    smallrow: {
        flexDirection: 'row',
        // backgroundColor:'grey',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10

        // width: '90%',
        // marginTop: 20

    },
    smallrow1: {
        flexDirection: 'row',
        // backgroundColor:'grey',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10

        // width: '90%',
        // marginTop: 20

    },
    btn: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold'
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
    txtaddtocart: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    addtocartrow: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'yellow',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    text: {
        fontSize: 17,
        textAlign: 'justify',
        // lineHeight: 24,
        marginTop: 20,
        color: 'black'
    },
    more: {
        fontSize: 17,
        textAlign: 'justify',
        lineHeight: 24,
        // marginTop: 20,
        color: 'blue'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txt: {
        fontSize: 12,
        color: 'black',
        marginLeft: 10
    },
    maincont: {
        flex: 1,
        justifyContent: 'center',
        // alignItems:'center',

    },
    minicont1: {
        flex: 1,
        overflow: 'hidden',
        padding: 10,
        // marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius:30,
        // backgroundColor:'white'
    },
    minicont2: {
        flex: 1.0,
        padding: 10,
        backgroundColor: '#ddadaf',
        borderRadius: 30

    },
    mainimg: {
        resizeMode: 'contain',
        height: 340,
        width: 350,
        borderRadius: 10
    },
    imgrate: {
        height: 17,
        width: 17,
    },
    txtname: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'black'
    },
    mainrow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10
    },
    reterow: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 7,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    likerow: {
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 7,
        padding: 3,
        overflow: 'hidden'
    },
    oldprice: {
        fontSize: 13,
        color: 'white',
        margin: 5,
        textDecorationLine: 'line-through',
        // textDecorationColor:'red'
    },
    newprice: {
        fontSize: 17,
        color: 'black',
        fontWeight: 'bold',
        margin: 3
    },
    pricerow: {
        marginTop: 30,
        backgroundColor: '#D2DCE7',
        borderRadius: 10,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5
    },
    imginfo: {
        height: 20,
        width: 20,
        marginRight: 5
    }
});
