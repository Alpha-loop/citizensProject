import { Image, Linking, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, Fonts } from '../../assets/Theme'


const OnlineGive = ({ navigation, route }) => {
    const { data } = route.params;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
            <View style={{ backgroundColor: COLORS.primary, height: 50, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name={"arrow-back-ios"} color={COLORS.white} size={20} />
                </TouchableOpacity>
                <Text style={{ fontFamily: Fonts.bold, fontSize: 16, color: COLORS.white, alignItems: 'center', textAlign: 'center', justifyContent: 'space-around' }}>Online Giving</Text>
                <Text style={{}}></Text>
            </View>

            <View style={{ marginVertical: 30, marginHorizontal: 20 }}>
                <Image source={require('../../assets/img/giftbox.png')} resizeMode='contain' style={{ alignSelf: 'center' }} />

                <View style={{ paddingBottom: 60 }}>
                    <Text style={{ color: COLORS.black, fontFamily: Fonts.bold, fontSize: 12 }}></Text>
                    {
                        data.map((item, i) => (
                            <TouchableOpacity key={i} onPress={() => {
                                Platform.OS === 'android' ? 
                                navigation.navigate("ExternalUrlFrame", { title: item.name, uri: `https://my.churchplus.co/give/${item?.id}` }) :
                                Linking.openURL(`https://my.churchplus.co/give/${item?.id}`)
                            }}>
                                <View style={{ backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: COLORS.gray, borderRadius: 10, padding: 15, marginTop: 20 }} key={i}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../assets/img/donation.png')} style={{ width: 20, height: 20 }} />
                                        <Text style={{ fontFamily: Fonts.light, color: COLORS.black, fontSize: 12, marginLeft: 20 }}>Donation Name:</Text>
                                    </View>
                                    <Text style={{ fontFamily: Fonts.bold, color: COLORS.black, fontSize: 18, textAlign: 'center', marginVertical: 15 }}>{item.name}</Text>
                                    <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                                        <Image source={require('../../assets/img/fw.png')} style={{ width: 80, height: 15 }} />
                                        <Image source={require('../../assets/img/paystacklogo.png')} style={{ width: 80, height: 15 }} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default OnlineGive

const styles = StyleSheet.create({})