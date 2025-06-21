import { SafeAreaView, ScrollView, StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Platform, Linking } from "react-native"
import { StackHeader } from "../reusables";
import { COLORS, Fonts, height } from "../../assets/Theme";
import { Button, SegmentedButtons } from "react-native-paper";
import { useEffect, useState } from "react";
import Input from "../reusables/Input";
import { AlarmIcon, CheckCircle } from "../../assets/img/icons";
import * as Animatable from 'react-native-animatable';
import { PersonPledges, SinglePledge } from "../../services/give";
import { useSelector } from "react-redux";
import dateFormatter from "../../utils/dateFormatter";
import { numberWithCommas } from "../../utils/config";

const MyPledges = ({ navigation }) => {
    const [value, setValue] = useState("all");
    const [searchText, setSearchText] = useState("");
    const userInfo = useSelector((state) => state.user.userInfo);
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const [loading, setLoading] = useState(false)
    const [pledges, setPledges] = useState([])
    const tablist = [
        {
            value: 'all',
            label: 'All Pledges',
            style: styles.tabs1(value),
            checkedColor: "#000",
            uncheckedColor: "#969696"
        },
        {
            value: 'partial',
            label: 'Active',
            style: styles.tabs2(value),
            checkedColor: "#000",
            uncheckedColor: "#969696"
        },
        {
            value: 'paid',
            label: 'Redeemed',
            style: styles.tabs3(value),
            checkedColor: "#000",
            uncheckedColor: "#969696"
        },
    ]

    const filterPledges = pledges.filter(item => (
        (value === 'all' || (item?.status.toLowerCase().includes(value.toLowerCase()))) &&
        (searchText === '' || (item?.pledgeItemName?.toLowerCase().includes(searchText.toLowerCase())))
    ))

    useEffect(() => {
        GetPersonPledges();
    }, [])

    const GetPersonPledges = async () => {
        setLoading(true);
        try {
            let { data } = await PersonPledges(userInfo.personID, churchInfo.tenantId); 
            setLoading(false);
            setPledges(data)
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const makePledge = () => {
        const makePledgeUrl = `https://my.churchplus.co/partnership/makepledge?tenantID=${churchInfo.tenantId}&personId=${userInfo.personID}`
        Platform.OS === 'android' ?
            navigation.navigate("ExternalUrlFrame", { title: "Pledge & Donations", uri: makePledgeUrl }) :
            Linking.openURL(makePledgeUrl)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
                <StackHeader title="My Pledges" goBack={() => navigation.goBack()} />
                <View style={styles.sideContainer}>
                    {
                        pledges.length > 0 ? (
                            <>
                                <View style={styles.section(10)}>
                                    <SegmentedButtons
                                        value={value}
                                        onValueChange={setValue}
                                        buttons={tablist}
                                    />
                                </View>
                                <View style={styles.section(15)}>
                                    <Input placeholder="Search pledge" outlineStyle={{ borderRadius: 20, borderWidth: 1 }} icon={'search'} onChangeText={setSearchText} value={searchText} />
                                </View>
                            </>
                        ) : null
                    }
                    <View>
                        {
                            loading ? (
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 200 }}>
                                    <ActivityIndicator color={COLORS.primary} size={25} />
                                </View>
                            ) : (
                                filterPledges.length > 0 ? (
                                    filterPledges.map((item, index) => (
                                        <Animatable.View
                                            animation={"fadeInUp"}
                                            duration={400}
                                            delay={index * 200}
                                            key={index}
                                        >
                                            <TouchableOpacity onPress={() => navigation.navigate("PledgeDetails", { id: item.id })}>
                                                <View style={[styles.card(item.status), styles.section(20)]}>
                                                    <View style={styles.flexitem}>
                                                        <Text style={styles.pledgename}>{item.pledgeItemName}</Text>
                                                        {
                                                            item.status === 'Paid' ?
                                                                <CheckCircle /> :
                                                                <AlarmIcon />
                                                        }
                                                    </View>
                                                    <View style={[styles.innercard, styles.section(10)]}>
                                                        <View style={styles.flexitem}>
                                                            <View>
                                                                <Text style={styles.innerheadertext}>Amount pledge</Text>
                                                                <Text style={styles.innersubtext}>{item.currencySymbol} {numberWithCommas(item.amount)}</Text>
                                                            </View>
                                                            <View>
                                                                <Text style={styles.innerheadertext}>Balance</Text>
                                                                <Text style={[styles.innersubtext, { fontFamily: Fonts.black}]}>{item.currencySymbol} {numberWithCommas(item.balance)}</Text>
                                                            </View>
                                                        </View>
                                                                <Text style={styles.centertext}>Paid: {item.currencySymbol} {numberWithCommas(item.amount - item.balance)}</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.datetext}>Date created: {dateFormatter.monthDayYear(item.date)}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    ))
                                ) : (
                                    <View style={{ height: height - 200, justifyContent: "center" }}>
                                        <Text style={{ color: COLORS.black, textAlign: "center", fontFamily: Fonts.bold }}>No pledge yet.</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                                            <Button textColor="#FFFFFF" style={{ marginTop: 15, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={makePledge}>
                                                <Text style={{ fontFamily: Fonts.medium }}>Make pledge</Text>
                                            </Button>
                                        </View>
                                    </View>
                                )
                            )
                        }

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15
    },
    tabs1: (value) => ({
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: value === 'all' ? '#ddd' : '#fff'
    }),
    tabs2: (value) => ({
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: value === 'partial' ? '#ddd' : '#fff'
    }),
    tabs3: (value) => ({
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: value === 'paid' ? '#ddd' : '#fff'
    }),
    section: (value) => ({
        marginTop: value
    }),
    flexitem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    card: (status) => ({
        borderRadius: 8,
        backgroundColor: status == 'Paid' ? "#CAF1C7" : "#FFE9CC",
        padding: 15
    }),
    pledgename: {
        fontFamily: Fonts.semibold,
        fontSize: 17,
        color: COLORS.black
    },
    innercard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 15
    },
    innerheadertext: {
        color: "#515151",
        fontFamily: Fonts.regular,
        fontSize: 13
    },
    innersubtext: {
        fontFamily: Fonts.medium,
        fontSize: 16,
        color: "#000000",
    },
    datetext: {
        textAlign: "center",
        marginTop: 10,
        fontFamily: Fonts.regular,
        color: "#000000",
        fontSize: 13
    },
    centertext: {
        textAlign: "center",
        fontFamily: Fonts.regular,
        color: "#000000",
    }
})

export default MyPledges;