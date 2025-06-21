import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, Fonts, width } from '../../assets/Theme'

const GiveSummary = ({ route }) => {
    const { data } = route.params;
    // console.log(data)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ backgroundColor: COLORS.primary, height: 50, padding: 15, flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity>
                    <Icon name={"arrow-back-ios"} color={COLORS.white} size={20} />
                </TouchableOpacity>
                <Text style={{ fontFamily: Fonts.bold, fontSize: 16, color: COLORS.white, alignItems: 'center', textAlign: 'center', justifyContent: 'space-around' }}>Online Giving</Text>
                <Text style={{}}></Text>
            </View>

            <View style={{ alignItems: 'center', marginVertical: 20, padding: 20, borderRadius: 20, shadowColor: '#000', borderWidth: 1, borderColor: '#eee', marginHorizontal: 20, }}>
                <Text style={{ color: COLORS.primary, fontFamily: Fonts.bold, fontSize: 16, marginBottom: 20 }}>Giving Summary</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontFamily: Fonts.bold, color: COLORS.black }}>Purpose</Text>
                    <Text style={{ fontFamily: Fonts.bold, color: COLORS.medium }}> | </Text>
                    <Text style={{ fontFamily: Fonts.medium, color: COLORS.black }}>{data?.option}</Text>
                </View>
                <View style={{ backgroundColor: '#eee', width: width, height: 1, marginVertical: 10 }}></View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontFamily: Fonts.bold, color: COLORS.black }}>Amount</Text>
                    <Text style={{ fontFamily: Fonts.bold, color: COLORS.medium }}> | </Text>
                    <Text style={{ fontFamily: Fonts.medium, color: COLORS.black }}>NGN {data?.amount}</Text>
                </View>
            </View>

            <View style={{ marginHorizontal: 20, marginVertical: 30 }}>
                <Text style={{ color: COLORS.black, fontFamily: Fonts.medium, textAlign: 'center', fontSize: 13, marginBottom: 15 }}>Select Payment Option</Text>
                <TouchableOpacity >
                    <Image source={require('../../assets/img/flutterw.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginVertical: 15 }}>
                    <Image source={require('../../assets/img/paystack.png')} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../../assets/img/alart.png')} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default GiveSummary

const styles = StyleSheet.create({})