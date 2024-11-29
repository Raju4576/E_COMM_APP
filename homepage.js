import { Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, Text, TextInput, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipaddress } from './ipaddress'
import MenuDrawer from 'react-native-side-drawer';


const Homepage = ({ navigation }) => {
    const [, setUid] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen((prev) => !prev);
        // console.log('Drawer State:', !isOpen);
    };


    const drawerContent = () => {
        return (
            <View style={styles.drawerContent}>
                <Text style={styles.drawerText}>Side Menu</Text>
                <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
                    <Text style={styles.buttonText}>Close Drawer</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const getid = async () => {
        try {
            const value = await AsyncStorage.getItem('user');
            if (value !== null) {
                setUid(value);
                console.log("UID retrieved and set:", value);
            } else {
                console.log('ID not found');
            }
        } catch (error) {
            console.log("Error retrieving UID:", error);
        }
    };
    useEffect(() => {
        const focusListener = navigation.addListener('focus', () => {
            getid();
        });

        // Cleanup the listener on component unmount
        return () => {
            focusListener();
        };
    }, [navigation]);
    // useEffect(() => {
    //     if (uid !== null) {
    //         console.log("Homepage UID updated:", uid);
    //     }
    // }, [uid]);

    const logout = () => {
        navigation.navigate('login')
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'My E-Comm APP',
            headerTitleAlign: 'center',
            headerLeft: () => (
                <TouchableOpacity onPress={toggleDrawer}>
                    <Image source={require('./img/menu.png')} style={styles.menu}></Image>
                </TouchableOpacity>
            ),
            // headerRight: () => (
            //     <TouchableOpacity onPress={logout}>
            //         <Image source={require('./img/search.jpg')} style={styles.searchicon}></Image>
            //     </TouchableOpacity>
            // ),
            headerStyle: {
                backgroundColor: 'white',
            },
        })
    }, [navigation])
    const [cats, setCats] = useState([])
    // const images = [
    //     {
    //         img: require('./img/game.png'),
    //         text: 'games'
    //     },
    //     {
    //         img: require('./img/mobile.png'),
    //         text: 'Mobile'
    //     },
    //     {
    //         img: require('./img/cat4.png'),
    //         text: 'Camera'
    //     },
    //     {
    //         img: require('./img/clothe.png'),
    //         text: 'Clothes'
    //     },
    //     {
    //         img: require('./img/mobileacc.jpeg'),
    //         text: 'Mobile Accessories'
    //     },
    //     {
    //         img: require('./img/music.png'),
    //         text: 'Music'
    //     },
    // ]

    // const product = [
    //     {
    //         img: require('./img/p1.jpg'),
    //         des: 'motorola mobile trending phone in the market ',
    //         newprice: 100, oldprice: 150,
    //         name: 'MotoRola 5G'
    //     },
    //     {
    //         img: require('./img/p2.jpg'),
    //         des: 'redmi mobile trending phone in the market ',
    //         newprice: 200,
    //         oldprice: 250,
    //         name: 'redmi 5G'
    //     },
    //     {
    //         img: require('./img/p5.jpg'),
    //         des: 'Best bat in sale For play cricket In market ',
    //         newprice: 100,
    //         oldprice: 150,
    //         name: 'sport bat'
    //     },
    //     {
    //         img: require('./img/p6.jpg'),
    //         des: 'Best bat in sale For play cricket In market ',
    //         newprice: 100,
    //         oldprice: 150,
    //         name: 'runnig bat'
    //     },
    //     {
    //         img: require('./img/p7.jpg'),
    //         des: 'Best Laptop in sale For Coding  In market ',
    //         newprice: 300,
    //         oldprice: 350,
    //         name: 'coding laptop'
    //     },
    //     {
    //         img: require('./img/p8.jpg'),
    //         des: 'Best Laptop in sale For Coding  In market ',
    //         newprice: 475,
    //         oldprice: 500,
    //         name: 'tradig laptop'
    //     },
    //     {
    //         img: require('./img/p9.jpg'),
    //         des: 'Best T.V. in sale For Entertainment  In market ',
    //         newprice: 475,
    //         oldprice: 500,
    //         name: 'cinema tv'
    //     },
    //     {
    //         img: require('./img/p10.jpg'),
    //         des: 'Best T.V. in sale For Entertainment  In market ',
    //         newprice: 475,
    //         oldprice: 500,
    //         name: 'sony tv'
    //     },
    //     {
    //         img: require('./img/p11.jpg'),
    //         des: 'Best Ronaldo jercy in discound  In market ',
    //         newprice: 600,
    //         oldprice: 900,
    //         name: 'cotton t-shirt'
    //     },
    //     {
    //         img: require('./img/p12.jpg'),
    //         des: 'Best Ronaldo jercy in discound  In market ',
    //         newprice: 600,
    //         oldprice: 900,
    //         name: 'runnig t-shirt'
    //     },
    // ]
    const [product, setProducts] = useState([])
    const productmethod = (id) => {
        // console.log(id)
        navigation.navigate('detail', { 'pid': id })
    }

    const cat_method = (id) => {
        console.log(id)
        navigation.navigate('cat', { 'cid': id })
    }
    useEffect(() => {
        // fetch('https://dummyjson.com/products/categories')
        // .then(res => res.json())
        // .then(data=>setCats(data));
        fetch(ipaddress + '/v_cat')
            .then(res => res.json())
            .then(data => setCats(data.data));

        fetch(ipaddress + `/v_product`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.data)
            })
    }, [])
    return (
        <>

            <View style={styles.container}>
                <MenuDrawer
                    open={isOpen}
                    position={'left'} // Drawer opens from the left
                    drawerContent={drawerContent()} // Drawer content
                    drawerPercentage={60} // Percentage width of the drawer
                    animationTime={300} // Animation duration
                    overlay={true} // Overlay for the main screen
                    opacity={0.4} // Opacity of overlay
                ></MenuDrawer>
                {/* <TextInput style={styles.search} placeholder='Search Your Item' /> */}
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.imgrowContent}>
                    <View style={styles.catrow}>
                        <Text style={styles.txtcategories}>Categories</Text>
                        <View style={styles.sirow}>
                            <Text style={styles.seeall}>See All</Text>
                            <Image source={require('./img/catarrow.png')} style={styles.catimg} />
                        </View>
                    </View>
                    <ScrollView style={styles.imgrow} horizontal={true}>
                        {cats.map((item, index) => (
                            <Pressable style={styles.column} key={index}>
                                <Pressable style={styles.imgcont} onPress={() => cat_method(item._id)}>
                                    <Image style={styles.imgcat} source={{ uri: `${ipaddress}/images/${item.image}` }} />
                                </Pressable>
                                <Text style={{ margin: 5 }}>{item.cat_name}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                    <View style={styles.catrow}>
                        <Text style={styles.txtcategories}>Discount Products</Text>
                        <View style={styles.sirow}>
                            <Text style={styles.seeall}>See All</Text>
                            <Image source={require('./img/catarrow.png')} style={styles.catimg} />
                        </View>
                    </View>
                    <View style={styles.produtrow}>
                        {product.map((item, index) => (
                            <Pressable style={styles.productCard} key={index} onPress={() => productmethod(item._id)}>
                                <Image source={{ uri: `${ipaddress}/images/${item.image}` }} resizeMode='stretch' style={styles.productImage}></Image>
                                <Text style={styles.productDescription}>{item.p_desc}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.newPrice}>${(item.p_price - (item.p_price * item.p_dis / 100)).toFixed(2)}</Text>
                                    <Text style={styles.oldPrice}>${item.p_price}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 10, alignItems: 'center', width: '100%', backgroundColor: 'white' }}>
                    <View>
                        <Pressable onPress={() => navigation.navigate('home')}>
                            <Image source={require('./img/home.webp')} style={styles.bottomicon}></Image>
                        </Pressable>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>Home</Text>
                    </View>
                    <View>
                        <Pressable onPress={() => navigation.navigate('cart')}>
                            <Image source={require('./img/cart.png')} style={styles.bottomicon}></Image>
                        </Pressable>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>Cart</Text>
                    </View>
                    <View>
                        <Pressable onPress={() => navigation.navigate('profile')}>
                            <Image source={require('./img/profile.webp')} style={styles.bottomicon}></Image>
                        </Pressable>
                        <Text style={{ fontWeight: 'bold', color: 'black' }}>Profile</Text>
                    </View>
                </View>
            </View>
        </>
    )
}

export default Homepage

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
    },
    searchicon: {
        height: 55,
        width: 55,
    },
    bottomicon: {
        height: 35,
        width: 35
    },
    menu: {
        height: 20,
        width: 20,
    },
    productCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
        width: '47%',
        padding: 10,
        borderWidth:1,
        borderColor:'black'
    },
    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        marginBottom: 10
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginBottom: 5
    },
    productDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    newPrice: {
        fontWeight: 'bold',
        color: '#27AE60'
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        color: 'red'
    },

    search: {
        borderColor: 'black',
        borderRadius: 20,
        borderWidth: 1,
        width: '90%',
        padding: 10,
        fontSize: 18,
        alignSelf: 'center',
        position: 'absolute',
        top: 20,
        zIndex: 1,
        backgroundColor: '#ddadaf',
    },
    scrollView: {
        // flex: 1,
        marginTop: 20, // Adjust according to the height of the search bar and top margin
    },
    catrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        // backgroundColor: '#D2DCE7',
        // backgroundColor: '#ddadaf',
        backgroundColor:'white',
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        alignSelf: 'center',

    },
    txtcategories: {
        fontSize: 20,
        color: 'black'
    },
    catimg: {
        width: 20,
        height: 20,
    },
    sirow: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
    seeall: {
        marginRight: 10,
        color: 'black'
    },
    imgrow: {
        marginTop: 10,
        width: '90%',
        marginBottom: 20
    },
    imgrowContent: {
        alignItems: 'center',
    },
    imgcont: {
        height: 70,
        width: 70,
        borderWidth: 1,
        borderRadius: 35,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    imgcat: {
        height: 40,
        width: 40,
        resizeMode: 'stretch'
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        // backgroundColor: "#ddadaf",
        // width:'100%'
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5

    },
    produtrow: {
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',

    },
    // productcont: {
    //     height: 400,
    //     width: 160,
    //     marginTop: 10,
    //     backgroundColor: '#ddadaf',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     overflow: 'scroll',
    //     flexDirection: 'column',
    //     borderRadius: 10,
    // },
    // product: {
    //     height: 250,
    //     width: 160
    // },
    // desc: {
    //     fontStyle: 'normal',
    //     fontSize: 17,
    //     color: 'black',
    //     fontWeight: 'bold',
    //     margin: 10,
    //     textAlign: 'justify'
    // },
    // pricerow: {
    //     flexDirection: 'row',
    //     width: '100%',
    //     justifyContent: 'space-around',
    //     alignItems: 'center',
    //     marginBottom: 20,
    // },
    // newprice: {
    //     color: 'black',
    //     fontSize: 17,
    //     fontWeight: 'bold'
    // },
    // oldprice: {
    //     fontSize: 16,
    //     // textDecorationLine: 'line-through',
    //     fontWeight: 'bold',
    //     color: 'black'
    // },


    //drawer


    // container: {
    //     flex: 1,
    // },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    openButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    drawerContent: {
        height: '82.5%',
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderColor: 'black',
        borderWidth: 1,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },
    drawerText: {
        fontSize: 22,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#FF5722',
        padding: 10,
        borderRadius: 5,
    },
})
