import { ActivityIndicator, Linking, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { StackHeader } from "../reusables";
import { COLORS, Fonts, height } from "../../assets/Theme";
import { AlarmIcon, CheckCircle, ClockIcon } from "../../assets/img/icons";
import * as Animatable from 'react-native-animatable';
import { useEffect, useState } from "react";
import { SinglePledge } from "../../services/give";
import { useSelector } from "react-redux";
import dateFormatter from "../../utils/dateFormatter";
import { Button } from "react-native-paper";
import { numberWithCommas } from "../../utils/config";

const PledgeDetails = ({ navigation, route }) => {
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const { id } = route.params;
    const item = {
        name: 'Building',
        type: 'active'
    }
    const [pledge, setPledge] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        GetSinglePledge();
    }, [])

    const GetSinglePledge = async () => {
        setLoading(true);
        try {
            let { data } = await SinglePledge(id, churchInfo.tenantId);
            setPledge(data)
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const redeemPledge = () => {
        const pledgeUrl = `https://my.churchplus.co/partnership/pay?pledgeID=${id}`
        Platform.OS === 'android' ?
            navigation.navigate("ExternalUrlFrame", { title: "Pledge & Donations", uri: pledgeUrl }) :
            Linking.openURL(pledgeUrl)
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
                <StackHeader title="Pledge Details" goBack={() => navigation.goBack()} />
                <View style={styles.sideContainer}>
                    {
                        loading ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 200 }}>
                                <ActivityIndicator color={COLORS.primary} size={25} />
                            </View>
                        ) : pledge ? (
                            <>
                                <Animatable.View
                                    animation={"fadeInLeft"}
                                    duration={700}
                                    style={[styles.card(pledge.status), styles.section(20)]}>
                                    <View style={[styles.flexitem, { paddingHorizontal: 10 }]}>
                                        <Text style={styles.pledgename}>{pledge.pledgeItemName}</Text>
                                        {
                                            pledge.status === 'Paid' ?
                                                <CheckCircle /> :
                                                <AlarmIcon />
                                        }
                                    </View>
                                    <View style={styles.innerbox}>
                                        <View style={[styles.flexitem, styles.section(10)]}>
                                            <Text style={styles.pledgeheader}>Amount Pledged:</Text>
                                            <Text style={styles.pledgevalue}>{pledge.currencySymbol} {numberWithCommas(pledge.amount)}</Text>
                                        </View>
                                        <View style={[styles.flexitem, styles.section(10)]}>
                                            <Text style={styles.pledgeheader}>Redeemed:</Text>
                                            <Text style={styles.pledgevalue}>{pledge.currencySymbol} {numberWithCommas(pledge.amount - pledge.balance)}</Text>
                                        </View>
                                        <View style={[styles.flexitem, styles.section(10)]}>
                                            <Text style={styles.pledgeheader}>Balance:</Text>
                                            <Text style={styles.pledgevalue}>{pledge.currencySymbol} {numberWithCommas(pledge.balance)}</Text>
                                        </View>
                                        <View style={[styles.flexitem, styles.section(10)]}>
                                            <Text style={styles.pledgeheader}>Date:</Text>
                                            <Text style={styles.pledgevalue}>{dateFormatter.monthDayYear(pledge.date)}</Text>
                                        </View>
                                    </View>
                                </Animatable.View>
                                {
                                    pledge.balance > 0 ? (
                                        <Button textColor="#FFFFFF" style={{ marginTop: 30, marginBottom: 15, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={redeemPledge}>
                                            <Text style={styles.textmedium}>Redeem</Text>
                                        </Button>
                                    ) : null
                                }
                                {
                                    pledge?.pledgePayments?.length > 0 ? (
                                        <Text style={[styles.pledgename, styles.section(30), { textAlign: "center", fontFamily: Fonts.semibold }]}>All Payments</Text>
                                    ) : null
                                }
                                {
                                    pledge?.pledgePayments?.length > 0 ? (
                                        pledge?.pledgePayments?.map((i, index) => (
                                            <Animatable.View
                                                animation={"fadeInUp"}
                                                duration={400}
                                                delay={100 + index * 200}
                                                style={[styles.cardtable, styles.section(10)]}
                                                key={index}
                                            >
                                                <View style={styles.flexitem}>
                                                    <Text style={styles.pledgeheader}>Channel:</Text>
                                                    <Text style={styles.pledgevalue}>{i.channel}</Text>
                                                </View>
                                                <View style={[styles.flexitem, styles.section(10)]}>
                                                    <Text style={styles.pledgeheader}>Amount:</Text>
                                                    <Text style={styles.pledgevalue}>{numberWithCommas(i.amount)}</Text>
                                                </View>
                                                <View style={[styles.flexitem, styles.section(10)]}>
                                                    <Text style={styles.pledgeheader}>Date:</Text>
                                                    <Text style={styles.pledgevalue}>{dateFormatter.monthDayYear(i.date)}</Text>
                                                </View>
                                            </Animatable.View>
                                        ))
                                    ) : (
                                        <View style={[styles.centralise, styles.section(70)]}>
                                            <Animatable.View
                                                animation={"swing"}
                                                duration={1000}
                                                delay={400}
                                            >

                                                <ClockIcon />
                                            </Animatable.View>
                                            <Animatable.View
                                                animation={"zoomIn"}
                                                duration={700}
                                                delay={400}
                                            >
                                                <Text style={styles.nopaymenttext}>Your Pledge payment</Text>
                                                <Text style={styles.nopaymenttext}>history will appear here</Text>
                                            </Animatable.View>
                                        </View>
                                    )
                                }
                            </>
                        ) : null
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15
    },
    flexitem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    card: (status) => ({
        // borderWidth: 1,
        // borderColor: "#DADADA",
        borderRadius: 8,
        backgroundColor: status === 'Paid' ? "#CAF1C7" : "#FFE9CC",
        padding: 10
    }),
    section: (value) => ({
        marginTop: value
    }),
    pledgename: {
        fontFamily: Fonts.bold,
        fontSize: 17,
        color: COLORS.black,
        marginVertical: 10,

    },
    flex: {
        flexDirection: "row"
    },
    pledgeheader: {
        color: "#515151",
        fontFamily: Fonts.regular,
        fontSize: 12
    },
    pledgevalue: {
        color: "#000000",
        fontFamily: Fonts.semibold,
        marginLeft: 10
    },
    datetext: {
        textAlign: "center",
        marginTop: 10,
        fontFamily: Fonts.regular,
        color: "#000000",
        fontSize: 13
    },
    innerbox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    centralise: {
        alignItems: "center",
    },
    nopaymenttext: {
        fontFamily: Fonts.light,
        fontSize: 13,
        color: "#000000"
    },
    cardtable: {
        backgroundColor: "#F3F3F3",
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 15
    }
})

export default PledgeDetails;