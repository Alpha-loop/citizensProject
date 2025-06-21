import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard"
import { COLORS, Fonts, width } from "../../assets/Theme";
import { StackHeader } from "../reusables/index";
import Input from "../reusables/Input";
import { useState, useRef, useEffect } from "react";
import { Snackbar, Button } from "react-native-paper";
import { ConfirmOTP, DeleteMobileUserAccount, SyncAndUpdateData } from "../../services/service";
import { useDispatch } from "react-redux";
import { logout, updateUserInfo } from "../../redux/userSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from "react-redux";

const Verification = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [code1, setCode1] = useState("")
    const [code2, setCode2] = useState("")
    const [code3, setCode3] = useState("")
    const [code4, setCode4] = useState("")
    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const ref4 = useRef();
    const [minute, setMinute] = useState(1)
    const [seconds, setSeconds] = useState(60);
    const [resendCode, setResendCode] = useState(false)
    const { formData, code } = route.params;
    const [loading, setloading] = useState(false)
    const [successSnack, setSuccessSnack] = useState(false)
    const [errorSnack, setErrorSnack] = useState(false);
    const userInfo = useSelector((state) => state.user.userInfo);
    const [successDelete, setSuccessDelete] = useState(false)

    useEffect(() => {
        if (seconds === 60) {
            setMinute(minute - 1)
        }
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds === 1) {
                    clearInterval(interval);
                    setResendCode(true)
                    // Timer reached 0, do something here
                }
                return prevSeconds - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const parseCode1 = async (value) => {
        if (value.length <= 1) {
            setCode1(value);
            return;
        }
        detectPasteAction();
    }

    const detectPasteAction = () => {
        Clipboard.getString().then((content) => {
            setCode1(content.slice(0, 1))
            setCode2(content.slice(1, 2))
            setCode3(content.slice(2, 3))
            setCode4(content.slice(3, 4))
        });
    }

    useEffect(() => {
        if (code1.length == 1) {
            ref2.current.focus();
        }
        if (code2.length == 1) {
            ref3.current.focus();
        }
        if (code3.length == 1) {
            ref4.current.focus();
        }
    }, [code1, code2, code3])

    const verifyOTP = async () => {
        setloading(true)
        try {
            let { data } = await ConfirmOTP(code, `${code1}${code2}${code3}${code4}`);
            setloading(false)
            if (data.status) {
                handleSubmit()
            } else {
                setloading(false)
                setErrorSnack(true)
            }
        } catch (error) {
            console.error(error)
            setloading(false)
        }
    }

    const handleSubmit = async () => {

        if (!code1 && !code2 && !code3 && !code4) {
            setloading(false)
            return;
        }

        if (formData === "DeleteUserAccount") {
            try {
                await DeleteMobileUserAccount(userInfo.userId);
                setloading(false)
                setSuccessDelete(true);
                await AsyncStorage.removeItem("user");
                dispatch(logout());
                setTimeout(() => {
                    navigation.navigate("MainHeaderTabs");
                }, 1000);
            } catch (error) {
                console.error(error)
                setloading(false)
            }
            return;
        }

        try {
            let { data, status } = await SyncAndUpdateData(formData);
            setloading(false)

            if (status) {
                setSuccessSnack(true)
                // update the state with the personID
                dispatch(updateUserInfo({ personID: data.returnObject.person.personId }))

                // Update the user data in localstorage with the personID
                const value = await AsyncStorage.getItem("user")
                const parsedValue = JSON.parse(value);
                parsedValue.personID = data.returnObject.person.personId;
                const stringified = JSON.stringify(parsedValue)
                await AsyncStorage.setItem("user", stringified)
                navigation.navigate('SuccessProfileUpdate');
            }
        } catch (error) {
            console.error(error)
            setloading(false)
        }
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <ScrollView>
                    <View>
                        <StackHeader title="Verification" goBack={() => navigation.goBack()} />
                        <View>
                            <Image source={require("../../assets/img/passwordlock.png")} style={{ alignSelf: "center", marginTop: 20 }} />
                            <Text style={{ fontFamily: Fonts.light, fontSize: 25, color: COLORS.black, width: width / 1.6, textAlign: "center", alignSelf: "center", marginTop: 20 }}>We sent a code to your email & phone</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 40 }}>
                                <Input value={code1} onChangeText={parseCode1} innerRef={ref1} style={{ width: 40 }} />
                                <Input value={code2} onChangeText={setCode2} innerRef={ref2} style={{ width: 40 }} />
                                <Input value={code3} onChangeText={setCode3} innerRef={ref3} style={{ width: 40 }} />
                                <Input value={code4} onChangeText={setCode4} innerRef={ref4} style={{ width: 40 }} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View>
                    <View style={{ marginHorizontal: 30, marginTop: 30, marginBottom: 40 }}>
                        <Button textColor="#FFFFFF" loading={loading} disabled={!code1 && !code2 && !code3 && !code4} style={{ marginTop: 30, marginBottom: 15, padding: 3, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={verifyOTP}>
                            <Text>Complete Verification</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
            <Snackbar
                visible={successSnack}
                duration={4000}
                style={{ backgroundColor: "#3CBF98" }}
                onDismiss={() => setSuccessSnack(false)}
            >
                <Text style={{ color: "#FFFFFF" }}>Your profile has been successfully updated</Text>
            </Snackbar>
            <Snackbar
                visible={errorSnack}
                duration={4000}
                style={{ backgroundColor: "#FF3C41" }}
                onDismiss={() => setErrorSnack(false)}
            >
                <Text style={{ color: "#FFFFFF" }}>Incorrect OTP kindly check your email</Text>
            </Snackbar>
            <Snackbar
                visible={successDelete}
                duration={4000}
                style={{ backgroundColor: "#3CBF98" }}
                onDismiss={() => setSuccessDelete(false)}
            >
                <Text style={{ color: "#FFFFFF" }}>Your account and data has been deleted successfully.</Text>
            </Snackbar>
        </>
    );
};

export default Verification;