import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking, Platform, Image } from "react-native"
import { StackHeader } from "../reusables"
import { COLORS, Fonts, width } from "../../assets/Theme"
import { GivingMoney, HandHeart, MakePledgeIcon, MoneyIcon, PledgeIcon, RedeemPledgeIcon } from "../../assets/img/icons"
import { useSelector } from "react-redux"
import * as Animatable from 'react-native-animatable';
import { useState } from "react"
import { SwipeModal } from "../reusables/Modal"
import { Badge, Button, Chip } from "react-native-paper"
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from "react-native-linear-gradient"

const PledgesAndDonation = ({ navigation, route }) => {
    const { makePledgeUrl, pledgeUrl } = route.params;
    const userInfo = useSelector((state) => state.user.userInfo);
    const [displayAuthModal, setDisplayAuthModal] = useState(false);
    const [displayPersonAuth, setDisplayPersonAuth] = useState(false);

    const [pledgeCards, setPledgeCards] = useState([
        {
            header: 'Make a new Pledge',
            subText: 'Click to make a new pledge',
        },
        {
            header: 'Redeem a Pledge',
            subText: 'Pay for Pledges you have made',
        },
    ])

    const hanglePledgeNavigation = (type) => {
        // console.log(`${makePledgeUrl}&personId=${userInfo.personID}`)
        if (!userInfo?.userId) {
            setDisplayAuthModal(true);
            return;
        }

        if (userInfo?.personID) {
            switch (type) {
                case 1:
                    Platform.OS === 'android' ?
                        navigation.navigate("ExternalUrlFrame", { title: "Pledge & Donations", uri: `${makePledgeUrl}&personId=${userInfo?.personID}` }) :
                        Linking.openURL(`${makePledgeUrl}&personId=${userInfo?.personID}`)
                    break;
                default:
                    Platform.OS === 'android' ?
                        navigation.navigate("ExternalUrlFrame", { title: "Pledge & Donations", uri: `${pledgeUrl}&personId=${userInfo?.personID}` }) :
                        Linking.openURL(`${pledgeUrl}&personId=${userInfo?.personID}`)
                    break;
            }
        } else {
            setDisplayPersonAuth(true);
        }
    }

    const authenticateUser = (type) => {
        setDisplayAuthModal(false)
        setTimeout(() => {
            type === 1 ? navigation.navigate("Login") : navigation.navigate("Register")
        }, 500);
    }

    const manageProfile = () => {
        setDisplayPersonAuth(false);
        setTimeout(() => {
            navigation.navigate("ManageProfile")
        }, 1000);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
                <StackHeader title="Pledges & Donation" goBack={() => navigation.goBack()} />
                <View style={styles.sidecontainer}>
                    <Text style={styles.selecttext}>Choose an action</Text>
                    {/* <Animatable.View
                        animation={"fadeInUp"}
                        duration={400}
                        delay={200}
                    >
                        <TouchableOpacity style={styles.pledgecard} onPress={() => hanglePledgeNavigation(1)}>
                            <Image source={require('../../assets/img/makepledge.png')} resizeMode="cover" style={styles.imagecard} />
                            <View style={styles.flexitem}>
                                <Text style={styles.cardtext}>Make a new pledge</Text>
                                
                                <PledgeIcon size={33} color={"#124191"} />
                            </View>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View
                        animation={"fadeInLeft"}
                        duration={400}
                        delay={400}
                    >
                        <TouchableOpacity style={styles.pledgecard} onPress={() => hanglePledgeNavigation(2)}>
                            <Image source={require('../../assets/img/redeempledge.png')} resizeMode="cover" style={styles.imagecard} />
                            <View style={styles.flexitem}>
                                <Text style={styles.cardtext}>Redeem a pledge</Text>
                                <RedeemPledgeIcon size={33} color={"#F83335"} />
                            </View>
                        </TouchableOpacity>
                    </Animatable.View> */}

                    {
                        pledgeCards.map((item, index) => (
                            <Animatable.View
                                animation={"fadeInUp"}
                                duration={400}
                                delay={index * 200}
                                key={index}
                            >
                                <TouchableOpacity key={index} onPress={() => hanglePledgeNavigation(index + 1)}>
                                    <LinearGradient
                                        colors={index == 0 ? ['#0889FF', '#124191'] : ['#FF3A3C', '#FF4C00C2']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        style={{ borderRadius: 15, padding: 20, marginTop: index === 0 ? 10 : 20 }}
                                    >
                                        <Image source={index == 0 ? require('../../assets/img/givingballs.png') : require('../../assets/img/pledgeballs.png')} resizeMode="cover" style={{ width: 100, height: 100, zIndex: 99, position: 'absolute', right: 80, top: 20 }} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {
                                                index === 0 ? (
                                                    <Badge style={styles.badge}>New pledge</Badge>
                                                ) : null
                                            }
                                            <View />
                                            {
                                                index == 0 ? (
                                                    <MoneyIcon size={35} />
                                                ) : (
                                                    <HandHeart size={35} />
                                                )
                                            }
                                        </View>
                                        <View style={{ marginBottom: 10, marginTop: 20 }}>
                                            <Text style={styles.header}>{item.header}</Text>
                                            <Text style={styles.subText}>{item.subText}</Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animatable.View>
                        ))
                    }
                </View>
                <SwipeModal visible={displayAuthModal} closeModal={() => setDisplayAuthModal(false)} height="20%">
                    <View style={{ alignItems: "center", height: "100%" }}>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Button icon="login" mode="contained" buttonColor={COLORS.primary} textColor="#FFFFFF" style={{ width: (width / 2) - 30 }} onPress={() => authenticateUser(1)}>
                                Login
                            </Button>
                            <Button icon="logout" mode="outlined" textColor={COLORS.primary} style={{ width: (width / 2) - 30 }} onPress={() => authenticateUser(2)}>
                                Signup
                            </Button>
                        </View>
                    </View>
                </SwipeModal>
            </ScrollView>
            <SwipeModal visible={displayPersonAuth} closeModal={() => setDisplayPersonAuth(false)} height="30%">
                <View style={{ justifyContent: "center" }}>
                    <Text style={{ fontFamily: Fonts.black, fontSize: 20, textAlign: "center", color: COLORS.black }}>Profile not updated</Text>
                    <Text style={{ color: COLORS.black, textAlign: "center" }}>Kindly update update profile to perform this operation.</Text>
                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
                        <Button mode="contained" buttonColor={COLORS.primary} textColor="#FFFFFF" onPress={manageProfile}>
                            <Text style={{ fontFamily: Fonts.semibold }}>Update profile</Text>
                        </Button>
                    </View>
                </View>
            </SwipeModal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sidecontainer: {
        paddingHorizontal: 15,
        marginTop: 15
    },
    selecttext: {
        color: "#000000CC",
        fontFamily: Fonts.bold,
        fontSize: 16,
        marginTop: 10
    },
    pledgecard: {
        // borderWidth: 1,
        // borderColor: "#FA8072",
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginBottom: 20,
        backgroundColor: "rgba(245, 66, 66, .06)",
    },
    cardtext: {
        fontFamily: Fonts.semibold,
        color: "#000000CC",
        fontSize: 16
    },
    imagecard: {
        width: '100%',
        borderRadius: 10
    },
    flexitem: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    header: {
        fontFamily: Fonts.semibold,
        fontSize: 19,
        color: COLORS.white
    },
    subText: {
        fontFamily: Fonts.light,
        color: COLORS.white,
        fontSize: 13
    },
    badge: {
        // borderRadius: 20,
        backgroundColor: "#FE293C",
        color: "#fff",
        paddingHorizontal: 5,
        alignSelf: "center"
    }
})

export default PledgesAndDonation