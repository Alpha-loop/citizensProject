import { ScrollView, SafeAreaView, View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, Fonts, height } from '../../assets/Theme'
import { Button } from 'react-native-paper';
import moment from "moment";
import CountryPicker from 'react-native-country-picker-modal'
import { StackHeader } from "../reusables/index";
import { SwipeModal } from "../reusables/Modal";

const RegisterEvent = ({ navigation, route }) => {
    const { data } = route.params;
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('NG');
    const [selectedCallingCode, setSelectedCallingCode] = useState('');
    const [country, setCountry] = useState(null)
    const [pickerVisibility, setPickerVisibility] = useState(false)
    const [successDialog, setSuccessDialog] = useState(false);

    const onSelect = (country) => {
        setCountryCode(country.cca2)
        setCountry(country)
    }

    const displayPicker = () => {
        setPickerVisibility(true)
    }


    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <SafeAreaView>
                <StackHeader title="Event Registration" goBack={() => navigation.goBack()} />
                <View style={{ marginTop: 20, ...styles.sideContainer }}>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <View>
                            <Image source={{ uri: data.mediaUrl || "https://placeholder.com/68x68" }} style={{ width: 120, height: 130, backgroundColor: "black" }} resizeMode="contain" />
                            <Text style={{ ...styles.bold_headers, marginBottom: 5 }}>{data.title}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{ marginBottom: 15, textAlign: "center", fontSize: 13, color: COLORS.black }}>{moment(data._OrderDate).format('llll')}</Text>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={{ fontSize: 13, color: COLORS.black, fontWeight: 600 }}>Enter Your Information</Text>
                        <View style={styles.formControl}>
                            <TextInput placeholder='First Name' style={{ width: "100%" }} onChangeText={() => { }} value={""} />
                        </View>
                        <View style={styles.formControl}>
                            <TextInput placeholder='Last Name' style={{ width: "100%" }} onChangeText={() => { }} value={""} />
                        </View>
                        <View style={styles.formControl}>
                            <TextInput placeholder='Email' style={{ width: "100%" }} onChangeText={() => { }} value={""} />
                        </View>
                        <View style={{ ...styles.formControl }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <CountryPicker
                                    countryCode={countryCode}
                                    withFilter={true}
                                    withFlag={true}
                                    withCountryNameButton={false}
                                    withCallingCodeButton={true}
                                    withFlagButton
                                    withAlphaFilter={true}
                                    withCallingCode={true}
                                    withEmoji={true}
                                    onSelect={onSelect}
                                    visible={pickerVisibility}
                                />
                                <TouchableOpacity onPress={displayPicker}>
                                    <Icon name={"expand-more"} size={25} style={{ marginLeft: 3, marginRight: 5 }} />
                                </TouchableOpacity>
                            </View>
                            <TextInput placeholder="Enter your phone number" keyboardType='numeric' style={{ paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: "rgba(0, 0, 0, 0.3)" }} />
                        </View>
                        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => setSuccessDialog(true)}>
                            <Button style={styles.actionBtn}>
                                <View>
                                    <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: 700 }}>Register</Text>
                                </View>
                            </Button>
                        </TouchableOpacity>
                    </View>
                </View>
                <SwipeModal visible={successDialog} closeModal={() => setSuccessDialog(false)} height="70%">
                    <View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <Image source={require("../../assets/img/verified.gif")} style={{ width: 100, height: 100 }} resizeMode="contain" />
                        <Text style={styles.dialogTitle(Fonts)}>Your Registration is successful</Text>
                        <TouchableOpacity style={{ marginTop: 20, width: "100%" }} onPress={() => setSuccessDialog(false)}>
                            <Button style={styles.actionBtn}>
                                <View>
                                    <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: 700 }}>Done</Text>
                                </View>
                            </Button>
                        </TouchableOpacity>
                    </View>
                </SwipeModal>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    sideContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 60
    },
    bold_headers: {
        fontFamily: "Inter",
        fontSize: 18,
        fontWeight: "800",
        color: "#041395",
    },
    formControl: {
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 15,
        borderRadius: 5,
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center'
    },
    actionBtn: {
        backgroundColor: "rgba(49, 73, 210, 1)",
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 5,
        marginTop: 20
    },
    dialog: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#FFFFFF",
        height: 400
    },
    dialogTitle: (fonts) => ({
        fontFamily: fonts.bold,
        fontSize: 22,
        marginTop: 10,
        textAlign: "center",
        color: "rgba(0, 0, 0, 0.86)"
    })
})

export default RegisterEvent;