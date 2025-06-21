import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TextInput, TouchableOpacity } from "react-native"
import { COLORS } from "../../assets/Theme";
import GiftBox from "../../navigation/giftbox";
import LinearGradient from 'react-native-linear-gradient';
import { FlutterwaveLogo } from "../../assets/img/icons";
import { StackHeader } from "../reusables/index";

const AmountToGive = ({ data, setDisplayPaymentOption }) => {
    return (
        <View>
            <Text style={{ color: COLORS.black, fontSize: 16, marginBottom: 5 }}>Recipient</Text>
            <View>
                <LinearGradient colors={['#0889FF', '#124191']} style={styles.recipientCard}>
                {
                    data.photo && data.photo !== null ? (
                        <Image source={{ uri: data.photo }} resizeMode="cover" style={{ width: 50, height: 50, borderRadius: 50 }} />
                    ) : (
                        <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 50, height: 50, borderRadius: 50 }} />
                    )
                }
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: COLORS.white, fontWeight: 600, fontSize: 17 }}>{data.name}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                            <Image source={require("../../assets/img/wedding_anniversary.png")} />
                            <Text style={{ marginLeft: 5, color: "rgba(255, 255, 255, 0.70)", fontSize: 15, fontWeight: 600 }}>{data.celebration} celebration</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
            <View style={{ marginTop: 30 }}>
                <Text style={{ color: COLORS.black, fontSize: 15, marginBottom: 5 }}>Enter Amount</Text>
                <TextInput placeholder="Enter amount" style={styles.textInput} />
            </View>
            <TouchableOpacity style={{ marginTop: 50 }} onPress={setDisplayPaymentOption}>
                <View style={styles.sendGiftBtn}>
                <Text style={{ fontSize: 19, fontWeight: 600, color: COLORS.white, textAlign: "center" }} multiline={true}>Send Gift</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const SelectPaymentOption = () => {
    return (
        <View>
            <Text style={{ fontWeight: 600, color: COLORS.black, textAlign: "center", marginTop: 20 }}>Select Payment Option</Text>
            <TouchableOpacity>
                <View style={styles.paymentOptionBtn}>
                    <FlutterwaveLogo />
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.paymentOptionBtn}>
                    <Image source={require("../../assets/img/paystacklogo.png")} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <View style={styles.paymentOptionBtn}>
                    <Image source={require("../../assets/img/alat_wema.png")} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const SendGift = ({ navigation, route }) => {
    const { params } = route;
    
    const [ displayPaymentOption, setDisplayPaymentOption ] = useState(false)
    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <SafeAreaView >
                <StackHeader title="Send gift" goBack={() => navigation.goBack()} />
                <View style={styles.sideContainer}>
                    <View style={{ marginTop: 30, ...styles.centralizeItem }}>
                        <GiftBox />
                    </View>
                    {
                        !displayPaymentOption ? (
                            <AmountToGive data={params} setDisplayPaymentOption={() => setDisplayPaymentOption(true)} />
                        ) : (
                            <SelectPaymentOption />
                        )
                    }
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15
    },
    centralizeItem: {
        flexDirection: "row",
        justifyContent: "center"
    },
    recipientCard: {
        borderRadius: 10,
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    textInput: {
        borderRadius: 5,
        borderColor: "rgba(0, 0, 0, 0.10)",
        borderWidth: 1,
        backgroundColor: "rgba(217, 217, 217, 0.20)",
        paddingLeft: 10,
        paddingRight: 10,
        color: "#050505",
    },
    sendGiftBtn: {
        borderRadius: 20,
        backgroundColor: '#124191',
        paddingTop: 15,
        paddingBottom: 15
    },
    paymentOptionBtn: {
        borderRadius: 20,
        borderColor: "rgba(0, 0, 0, 0.20)",
        borderWidth: 1,
        paddingTop: 14,
        paddingBottom: 14,
        alignItems: "center",
        marginTop: 20
    }
})

export default SendGift;
