import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { StackHeader } from "../reusables";
import { COLORS, Fonts } from "../../assets/Theme";
import Input from "../reusables/Input";
import { useState } from "react";
import { Button, Snackbar } from "react-native-paper";
import { ForgotPasswordRequest, ResetPasswordRequest, SendUserOTP } from "../../services/service";
import { useSelector } from "react-redux";
import * as Animatable from 'react-native-animatable';

const ForgotPassword = ({ navigation, route }) => {
    const [email, setEmail] = useState("");
    const [loadingAccountCheck, setLoadingAccountCheck] = useState(false);
    const [displaySnack, setDisplaySnack] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const [type, setType] = useState(1);
    const [password, setPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const [resetToken, setResetToken] = useState("")
    const [passwordVisibility, setpasswordVisibility] = useState(true)
    const [confirmpasswordVisibility, setconfirmpasswordVisibility] = useState(true)
    const [successInfo, setSuccessInfo] = useState(false)

    const resetPassword = async () => {
        if (type === 1) {
            if (!email) {
                setDisplaySnack(true);
                setResponseMessage("Enter your email in the input box provided above.")
                return;
            }
            setLoadingAccountCheck(true);
    
            try {
                let { data } = await ForgotPasswordRequest(email);
                setLoadingAccountCheck(false);
                if (data.status) {
                    setType(2);
                } else {
                    setDisplaySnack(true);
                    setResponseMessage(data.response ?? 'Please try again')
                }
            }
            catch (error) {
                setDisplaySnack(true);
                setResponseMessage(error?.response?.data?.response ?? 'Please try again')
                setLoadingAccountCheck(false);
                console.log(error, 'errro');
            }
        } else {
            // Check is the states are empty
            if (!password || !resetToken) {
                setDisplaySnack(true);
                setResponseMessage("Fill all fields correctly.")
                return;
            }
            // Check if password matches
            if (password !== confirmPassword) {
                setDisplaySnack(true);
                setResponseMessage("Password do not match.")
                return;
            }
            
            let payload = {
                email,
                password,
                resetToken
            }

            setLoadingAccountCheck(true);
            try {
                let { data } = await ResetPasswordRequest(payload);
                setLoadingAccountCheck(false);
                if (data.status) {
                    setSuccessInfo(true);
                    setDisplaySnack(true);
                    setResponseMessage('🥳 Password reset successful');
                    setTimeout(() => {
                        navigation.navigate("Login");
                    }, 2000);
                }
            }
            catch (error) {
                setDisplaySnack(true);
                setResponseMessage(error?.response?.data?.response ?? 'Please try again')
                setLoadingAccountCheck(false);
                console.log(error, 'errro');
            }
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
                <StackHeader title="Reset Password" goBack={() => navigation.goBack()} />
                <View style={styles.sideContainer}>


                    <View>
                        <Text style={styles.selecttextheader}>Forgot password? No worries.</Text>
                        <Text style={styles.selecttext}>Enter your email to check your account</Text>
                        <Input placeholder="Email address" onChangeText={setEmail} disabled={type === 2} value={email} outlineStyle={{ borderColor: "#939393" }} />
                        {
                            type == 2 ? (
                                <Animatable.View
                                    animation={"fadeInDown"}
                                    duration={700}
                                >
                                    <Input placeholder="OTP" onChangeText={setResetToken} value={resetToken} style={{ marginTop: 20 }} outlineStyle={{ borderColor: "#939393" }} />
                                    <Input placeholder="Enter new password" onChangeText={setPassword} iconRight={'eye'} secureTextEntry={passwordVisibility} setpasswordVisibility={() => setpasswordVisibility(!passwordVisibility)} value={password} style={{ marginTop: 20 }} outlineStyle={{ borderColor: "#939393" }} />
                                    <Input placeholder="Confirm new password" onChangeText={setconfirmPassword} iconRight={'eye'} secureTextEntry={confirmpasswordVisibility} setpasswordVisibility={() => setconfirmpasswordVisibility(!confirmpasswordVisibility)} value={confirmPassword} style={{ marginTop: 20 }} outlineStyle={{ borderColor: "#939393" }} />
                                </Animatable.View>
                            ) : null
                        }
                        <Animatable.View
                            duration={700}
                        >
                        <Button textColor="#FFFFFF" loading={loadingAccountCheck} buttonColor={COLORS.primary} style={{ marginTop: 30, borderRadius: 20 }} contentStyle={{ paddingVertical: 8 }} onPress={resetPassword} mode="contained">
                            <Animatable.Text style={{ fontSize: 14, fontFamily: Fonts.semibold, marginVertical: 20 }}>{ type === 1 ? 'Check' : 'Reset Password' }</Animatable.Text>
                        </Button>

                        </Animatable.View>
                    </View>


                </View>
            </ScrollView>
            <Snackbar
                visible={displaySnack}
                duration={4000}
                style={{ backgroundColor: successInfo ? "#3CBF98" : "#000000" }}
                onDismiss={() => setDisplaySnack(false)}
            >
                <Text style={{ color: "#FFFFFF" }}>{responseMessage}</Text>
            </Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15
    },
    selecttextheader: {
        color: "#000000CC",
        fontFamily: Fonts.bold,
        fontSize: 20,
        marginTop: 20
    },
    selecttext: {
        color: "#000000AA",
        fontFamily: Fonts.medium,
        fontSize: 13,
        marginBottom: 40,
        marginTop: 5
    },
})

export default ForgotPassword;