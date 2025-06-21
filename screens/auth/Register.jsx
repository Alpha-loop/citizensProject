import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, Image } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Onboard, RegisterUser } from '../../services/service';
import { useSelector } from 'react-redux';
import { COLORS, Fonts, height } from '../../assets/Theme';
import { Button, Snackbar, TouchableRipple } from 'react-native-paper';
import Input from '../reusables/Input';
import { setUserAuthToken } from '../../backendapi/index';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/userSlice'

const Register = ({ navigation }) => {
    const dispatch = useDispatch();
    const info = useSelector((state) => state.user.churchInfo);
    const [name, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [displaySnack, setDisplaySnack] = useState(false)
    const [passwordVisibility, setpasswordVisibility] = useState(true)
    const [responseMessage, setResponseMessage] = useState("")
    const [successInfo, setSuccessInfo] = useState(false)


    const handleSubmit = async () => {
        const model = {
            name,
            // userId: "00000000-0000-0000-0000-000000000000",
            email,
            tenantID: info?.tenantId,
            password
        }

        if (!name || !email || !password) {
            setDisplaySnack(true)
            setResponseMessage("Kindly fill in all fields")
            return;
        }
        setLoading(true)
        await RegisterUser(model).then((response) => {
            setLoading(false);
            if (response.data.status) {
                if (!response.data.returnObject) {
                    setDisplaySnack(true)
                    setResponseMessage("This email already has an account created with us, kindly login instead")
                    return;
                }
                AsyncStorage.setItem("user", JSON.stringify(response.data.returnObject.value.returnObject))
                dispatch(login(response.data.returnObject.value.returnObject))
                setUserAuthToken(response.data.returnObject.value.returnObject.token)
                setSuccessInfo(true)
                setDisplaySnack(true)
                setResponseMessage("🎉   Your registration is successful.")
                setTimeout(() => {
                    navigation.navigate("MainHeaderTabs")
                }, 1500);
            }
        }).catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    if (loading) {
        return (
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: height }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }
    return (
        <>
            <StatusBar backgroundColor={COLORS.primary} />
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <View style={{ backgroundColor: COLORS.primary, height: 50, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => {
                        navigation.goBack()
                    }}>
                        <Icon name={"arrow-back-ios"} color={COLORS.white} size={20} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: Fonts.bold, fontSize: 16, color: COLORS.white, alignItems: 'center', textAlign: 'center', justifyContent: 'space-around' }}>Personal Details</Text>
                    <Text style={{}}></Text>
                </View>

                <View style={{ marginTop: 20 }}>
                    {/* <Icon name={'account-circle'} size={68} style={{ textAlign: 'center' }} /> */}
                    {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <View style={styles.container}>
                            {
                                image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                            }
                            <View style={styles.uploadBtnContainer}>
                                <TouchableOpacity onPress={requestCameraPermission} style={styles.uploadBtn} >
                                    <Text>{image ? 'Edit' : 'Upload'} Picture</Text>
                                    <Icon name="camera" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View> */}

                    {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Image source={require("../../assets/img/splash.jpg")} resizeMode='contain' style={{ height: 150 }} />
                    </View> */}

                    <View style={styles.formControl}>
                        <Input placeholder="Full Name" onChangeText={setFullName} value={name} />
                        {/* <TextInput placeholder='Full Name' onChangeText={setFullName} value={name} style={{ width: "100%" }} /> */}
                    </View>
                    <View style={styles.formControl}>
                        <Input placeholder="Your Email" onChangeText={setEmail} value={email} />
                        {/* <TextInput placeholder='Your Email' onChangeText={setEmail} value={email} style={{ width: "100%" }} /> */}
                    </View>
                    <View style={styles.formControl}>
                        <Input placeholder="Your Password" onChangeText={setPassword} value={password} iconRight={'eye'} secureTextEntry={passwordVisibility} setpasswordVisibility={() => setpasswordVisibility(!passwordVisibility)} />
                        {/* <TextInput placeholder='Your Password' onChangeText={setPassword} value={password} style={{ width: "100%" }} /> */}
                    </View>
                    <View style={styles.formControl}>
                        <Input placeholder="Phone Number" onChangeText={setPhoneNumber} value={phoneNumber} />
                        {/* <TextInput placeholder='Your Phone Number' onChangeText={setPhoneNumber} value={phoneNumber} style={{ width: "100%" }} /> */}
                    </View>

                    {/* <TouchableRipple rippleColor="rgba(0, 0, 0, 0.04)" style={{ marginTop: 30, marginBottom: 15, marginHorizontal: 20, padding: 13, borderRadius: 15, backgroundColor: COLORS.primary }} onPress={handleSubmit}>
                        <Text style={{ fontFamily: Fonts.medium, color: COLORS.white, textAlign: 'center' }}>Register</Text>
                    </TouchableRipple> */}
                    <Button textColor="#FFFFFF" buttonColor={COLORS.primary} style={{ marginTop: 30, marginHorizontal: 20, borderRadius: 15 }} contentStyle={{ paddingVertical: 5 }} onPress={handleSubmit} mode="contained">
                        <Text style={{ fontSize: 14, fontFamily: Fonts.semibold, marginVertical: 20 }}>Register</Text>
                    </Button>

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, marginTop: 20 }}>
                        <Text style={{ fontFamily: Fonts.medium, color: COLORS.black, marginRight: 10 }}>Already a user?</Text>
                        {/* <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={{ fontFamily: Fonts.bold, color: COLORS.primary }}>Login</Text>
                        </TouchableOpacity> */}
                        <Button mode="text" textColor={COLORS.primary} onPress={() => navigation.navigate("Login")}>
                            <Text style={{ fontFamily: Fonts.bold }}>Login</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
            <Snackbar
                visible={displaySnack}
                duration={4000}
                style={{ backgroundColor: successInfo ? "#3CBF98" : "#000000" }}
                onDismiss={() => setDisplaySnack(false)}
            >
                <Text style={{ color: "#FFFFFF" }}>{responseMessage}</Text>
            </Snackbar>
        </>
    )
}

export default Register

const styles = StyleSheet.create({
    formControl: {
        // borderWidth: 1,
        // borderColor: '#eee',
        marginHorizontal: 20,
        marginTop: 20
        // paddingHorizontal: 15,
        // borderRadius: 10,
        // flexDirection: 'row',
        // marginTop: 20,
        // alignItems: 'center'
    },
    container: {
        elevation: 2,
        height: 170,
        width: 170,
        backgroundColor: '#efefef',
        position: 'relative',
        borderRadius: 999,
        overflow: 'hidden',
    },
    uploadBtnContainer: {
        opacity: 0.7,
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: 'lightgrey',
        width: '100%',
        height: '25%',
    },
    uploadBtn: {
        display: 'flex',
        alignItems: "center",
        justifyContent: 'center'
    }
})