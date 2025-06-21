import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import { Gift2, MessageIcon } from '../../assets/img/icons';
import { useNavigation } from "@react-navigation/native"
import moment from "moment";
import { StackHeader } from '../reusables/index';

const Celebrants = ({ data, navigation }) => {

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {
                    data.photo && data.photo !== null ? (
                        <Image source={{ uri: data.photo }} resizeMode="cover" style={{ width: 50, height: 50, borderRadius: 50 }} />
                    ) : (
                        <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 50, height: 50, borderRadius: 50 }} />
                    )
                }
                <View style={{ marginLeft: 15 }}>
                    <Text style={{ color: "rgba(0, 0, 0, 0.80)", fontSize: 17, fontWeight: 600 }}>{data.name}</Text>
                    <Text style={{ color: "rgba(0, 0, 0, 0.80)", fontSize: 14 }}>{moment(data.date).format('ll')}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <View style={{ marginRight: 15 }}>
                    <TouchableOpacity onPress={() => navigation.navigate("SendCelebrantMessage", data)}>
                        <View style={{ alignItems: "center" }}>
                            <MessageIcon />
                        </View>
                        <Text style={{ color: "#555", fontSize: 14 }}>Message</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate("SendGift", data)}>
                        <View style={{ alignItems: "center" }}>
                            <Gift2 />
                        </View>
                        <Text style={{ color: "#555", fontSize: 14 }}>Send Gift</Text>
                    </TouchableOpacity>

                </View> */}
            </View>
        </View>
    );
}

const AllCelebrants = ({ navigation, route }) => {
    const [birthdayActive, setBirthdayActive] = useState(true)
    const [weddingActive, setWeddingActive] = useState(false)
    const { data } = route.params;

    const setActive = (type) => {
        if (type === "birthday") {
            setBirthdayActive(true);
            setWeddingActive(false);
        } else {
            setWeddingActive(true);
            setBirthdayActive(false);
        }
    }

    const chunk = 4

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <SafeAreaView>
                <StackHeader title="This week celebrant" goBack={() => navigation.goBack()} />
                <View style={styles.sideContainer}>
                    {
                        birthdayActive ? (
                            <Image source={require("../../assets/img/birthday_banner.jpg")} style={{ width: '100%', marginTop: 15, marginBottom: 25 }} />
                        ) : (
                            <Image source={require("../../assets/img/wedding_anniversary_banner.jpg")} style={{ width: '100%', marginTop: 15, marginBottom: 25 }} />
                        )
                    }

                    <View style={styles.centralizedItem}>
                        <TouchableOpacity onPress={() => setActive("birthday")}>
                            <View style={styles.celebrationtab(birthdayActive)}>
                                <View style={{ flexDirection: "row" }}>
                                    <Image source={require("../../assets/img/birthday_cake.png")} resizeMode="contain" style={{ marginRight: 5 }} />
                                    <Text style={styles.tabText(birthdayActive)}>Birthday</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActive("wedding")}>
                            <View style={{ ...styles.celebrationtab(weddingActive), marginLeft: 10 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Image source={require("../../assets/img/wedding_anniversary.png")} resizeMode="contain" style={{ marginRight: 5 }} />
                                    <Text style={styles.tabText(weddingActive)}>Wedding</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        {

                            data.length > 0 ?
                                data.length > 4 ? (
                                    data
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .filter(i => birthdayActive ?
                                            i.celebration.toLowerCase().includes("birthday") :
                                            i.celebration.toLowerCase().includes("wedding")).slice(0, chunk).map((item, index) => (
                                                <Celebrants data={item} key={index} navigation={navigation} />
                                            ))
                                ) : (
                                    data
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .filter(i => birthdayActive ?
                                            i.celebration.toLowerCase().includes("birthday") :
                                            i.celebration.toLowerCase().includes("wedding")).map((item, index) => (
                                                <Celebrants data={item} key={index} navigation={navigation} />
                                            ))
                                ) : (
                                    <Text>No celebrant today</Text>
                                )
                        }
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Image source={require("../../assets/img/send_gift_banner.png")} style={{ width: "100%", borderRadius: 15 }} />
                    </View>
                    <View>
                        {

                            data.length > 0 ?
                                data.length > 4 ? (
                                    data
                                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                                        .filter(i => birthdayActive ?
                                            i.celebration.toLowerCase() === "birthday" :
                                            i.celebration.toLowerCase() === "wedding").slice(chunk, data.length).map((item, index) => (
                                                <Celebrants data={item} key={index} navigation={navigation} />
                                            ))
                                ) : null
                                : (
                                    <Text>No celebrant today</Text>
                                )
                        }
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

export default AllCelebrants

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15
    },
    centralizedItem: {
        flexDirection: "row",
        justifyContent: "center"
    },
    celebrationtab: (type) => ({
        borderRadius: 15,
        backgroundColor: type == true ? '#124191' : '#FFFFFF',
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 25,
        paddingRight: 25,
        borderWidth: 1,
        borderColor: type === true ? "#124191" : "rgba(0, 0, 0, 0.30)"
    }),
    tabText: (type) => ({
        color: type === true ? "#FFFFFF" : "rgba(0, 0, 0, 0.50)",
        fontWeight: "500",
        fontSize: 16
    })
})