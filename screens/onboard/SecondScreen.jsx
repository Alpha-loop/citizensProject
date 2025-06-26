import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, Fonts } from '../../assets/Theme';
import LinearGradient from 'react-native-linear-gradient';

const first = require("../../assets/img/imgbg2.jpg");

const SecondScreen = ({ navigation }) => {

    return (
        <SafeAreaView>
            <View>
                <View style={{ position: 'relative' }}>
                    <Image source={first} style={{ width: '100%', resizeMode: 'cover' }} />
                    <LinearGradient
                        colors={['rgba(79, 87, 101, 0)', COLORS.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                </View>

                <View style={{ backgroundColor: COLORS.primary, height: '100%' }}>
                    <View style={{ width: '70%', alignSelf: 'center' }}>
                        <Text style={{ fontFamily: Fonts.black, fontSize: 28, textAlign: 'center', color: '#65B5FF' }}>Daily Devotion</Text>
                        <Text style={{ fontFamily: Fonts.black, fontSize: 28, textAlign: 'center', color: COLORS.white }}>for Your Spiritual Growth</Text>
                    </View>
                    <View style={{ width: '70%', alignSelf: 'center', marginVertical: 20 }}>
                        <Text style={{ fontFamily: Fonts.light, fontSize: 14, textAlign: 'center', color: COLORS.white }}>The Cititzens Church Connects you with People and Contents that matter to your spiritual growth</Text>
                    </View>
                    <View style={{ width: '20%', alignSelf: 'center', marginBottom: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ height: 12, width: 12, backgroundColor: '#65B5FF', opacity: 0.4, borderRadius: 8 }}></View>
                        <View style={{ height: 12, width: 12, backgroundColor: '#65B5FF', borderRadius: 8 }}></View>
                        <View style={{ height: 12, width: 12, backgroundColor: '#65B5FF', opacity: 0.4, borderRadius: 8 }}></View>
                    </View>

                    {/* <TouchableOpacity style={{ backgroundColor: COLORS.white, borderRadius: 15, marginHorizontal: 20, paddingVertical: 10 }} onPress={() => navigation.navigate("Join")}>
                        <Text style={{ textAlign: 'center', fontFamily: Fonts.regular, color: COLORS.black }}>Connect to a Church</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SecondScreen

const styles = StyleSheet.create({})