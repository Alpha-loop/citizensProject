import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, Fonts } from '../../assets/Theme'
import Clipboard from '@react-native-clipboard/clipboard';
import { CopyIcon } from '../../assets/img/icons';
import * as Animatable from 'react-native-animatable';
import { bankLogo } from '../../utils/bankLogo';

const BankAccount = ({ navigation, route }) => {
    const { data } = route.params;

    const [banks, setBanks] = useState([]);

    const fetchCopiedText = async (text) => {
        console.log(data)
        try {
            await Clipboard.setString(text);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    useEffect (() => {
        const addbankurl = data.map(i => {
            const findBank = bankLogo.findIndex(j => j.name.toLowerCase().includes(i.bankName.toLowerCase()));
            if (findBank >= 0) {
                i.bankLogoSource = bankLogo[findBank].source;
            }
            return i
        })
        setBanks(addbankurl);
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ backgroundColor: COLORS.primary, height: 50, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Icon name={"arrow-back-ios"} color={COLORS.white} size={20} />
                </TouchableOpacity>
                <Text style={{ fontFamily: Fonts.bold, fontSize: 16, color: COLORS.white, alignItems: 'center', textAlign: 'center', justifyContent: 'space-around' }}>Bank Account</Text>
                <Text style={{}}></Text>
            </View>

            <ScrollView style={{ marginBottom: 20 }}>
                <View style={{ marginVertical: 30, marginHorizontal: 20 }}>
                    <Image source={require('../../assets/img/giftbox.png')} resizeMode='contain' style={{ alignSelf: 'center' }} />

                    {data.length > 0 ? (
                        <>
                            {banks?.map((item, i) => (
                                  <Animatable.View
                                  animation={"fadeInUp"}
                                  duration={400}
                                  delay={1 + i * 200}
                                  key={i}
                              >
                              <View style={{ backgroundColor: '#D9D9D94D', borderRadius: 15, padding: 15, marginVertical: 10, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.1)" }} key={i}>
                                  <View style={{ flexDirection: 'row', alignItems: "center", gap: 7 }}>
                                      {
                                          item.bankLogoSource ? (
                                              <Image source={item.bankLogoSource} style={{ width: 30, height: 30 }} resizeMode="contain" />
                                          ) : (
                                              <Image source={{ uri: "https://placeholder.com/68x68" }} height={30} width={30} />
                                          )
                                      }
                                      <View>
                                          <Text style={{ fontFamily: Fonts.regular, fontSize: 12, color: COLORS.black }}><Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black }}>{item.bankName}</Text></Text>
                                      </View>

                                  </View>
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                      <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: "rgba(16, 16, 16, 0.8)" }}>{item?.accountNumber}</Text>
                                      <TouchableOpacity onPress={() => fetchCopiedText(item?.accountNumber)}>
                                          <CopyIcon size={17} />
                                      </TouchableOpacity>
                                  </View>
                                  <Text style={{ fontFamily: Fonts.semibold, fontSize: 13 }}>{item.accountName}</Text>
                                  <Text style={{ fontFamily: Fonts.medium, color: COLORS.black, marginTop: 10 }}>{item.description}</Text>
                              </View>
                              </Animatable.View>
                            )) }
                        </>
                    ) : (
                        <Text style={{ fontWeight: 600, color: COLORS.black}}>No banks added yet</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BankAccount

const styles = StyleSheet.create({})