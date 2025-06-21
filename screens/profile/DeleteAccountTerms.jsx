import { COLORS, Fonts } from "../../assets/Theme";
import { SafeAreaView, ScrollView, View, Text, FlatList, StyleSheet } from "react-native";
import { StackHeader } from "../reusables/index";
import { Button } from "react-native-paper";
import { SendUserOTP } from "../../services/service";
import { useSelector } from 'react-redux';
import { useState } from "react";

const DeleteAccountTerms = ({ navigation }) => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const [loading, setloading] = useState(false);

    const terms = [
        'Data Deletion: By deleting your account, all your data associated with the account will be permanently removed from our system. This includes your profile information, preferences, and any content you\'ve created or shared.',
        'Irreversible Action: Deleting your account is irreversible. Once you confirm the deletion, there\'s no way to recover your account or any associated data. ',
        'Subscriptions and Purchases: Please note that deleting your account does not automatically cancel any active subscriptions or delete purchase history. If you have any subscriptions or outstanding purchases, you\'ll need to manage them separately.',
        'Feedback: We value your feedback. If there\'s anything specific that led you to delete your account, we\'d appreciate hearing about it. Your input helps us improve our service for others.'
    ]

    const verifyUser = async () => {
        const { email, phoneNumber } = userInfo;
        setloading(true)
        try {
            const { data } = await SendUserOTP({ email, phoneNumber, tenantId: churchInfo.tenantId })
            setloading(false)
            navigation.navigate("VerifyUser", { formData: "DeleteUserAccount", code: data.returnObject.token })
        }
        catch (err) {
            setloading(false)
            console.error(err)
        }
    }
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <View>
                    <StackHeader title="Delete Account" goBack={() => navigation.goBack()} />
                    <View style={{ padding: 15 }}>
                        <Text style={styles.bodyText}>
                            We're sorry to see you go. If you're sure about deleting your account,
                            we want to make the pfrocess as simple as possible for you. Please take
                            a moment to review the following information before proceeding.
                        </Text>
                        <Text style={styles.textHeader}>
                            Important Points to Consider:
                        </Text>
                        <FlatList
                            data={terms}
                            renderItem={({ item, i }) => (
                                <View style={styles.parent}>
                                    <View style={{ width: 5, height: 5, borderRadius: 50, backgroundColor: "black", marginTop: 5 }} />
                                    <Text style={styles.bodyText}>{item}</Text>
                                </View>
                            )}
                            keyExtractor={(item, index) => index}
                            contentContainerStyle={{ rowGap: 20 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </SafeAreaView>
            <View style={{ padding: 15, backgroundColor: COLORS.white }}>
                <Button textColor="#FFFFFF" style={{ borderRadius: 30, backgroundColor: 'red' }} loading={loading} mode="contained" onPress={verifyUser}>
                    <Text style={{ fontSize: 12 }}>I Agree</Text>
                </Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    bodyText: {
        color: "#000000B2",
        fontFamily: Fonts.regular
    },
    textHeader: {
        fontFamily: Fonts.semibold,
        color: "#000000",
        marginTop: 10,
        fontSize: 15,
        marginBottom: 5
    },
    parent: {
        flexDirection: 'row',
        gap: 7
    }
})

export default DeleteAccountTerms;