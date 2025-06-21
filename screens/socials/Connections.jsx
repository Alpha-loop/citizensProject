import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList } from "react-native";
import { ChatDotIcon, GroupUsersIcon, RoundAddOutline, RoundCheckFilled } from "../../assets/img/icons";
import { COLORS, Fonts, height } from "../../assets/Theme";
import Input from "../reusables/Input";
import { Divider } from "react-native-paper";
import { GetChurchUsers, RequestConnection, GetOrgSpecificConnections } from "../../services/social";
import { useSelector } from 'react-redux';
import { GetLookUps } from '../../services/service';
import { Button, Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"
import { SocialTabs } from "../../navigation/SocialTabs";

const ConnectionList = ({ isNew }) => {
    const [searchText, setSearchText] = useState("")
    const userInfo = useSelector((state) => state.user.userInfo);
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const [organisationConnections, setOrganisationConnections] = useState([]);
    const [loading, setloading] = useState(false);
    const navigation = useNavigation();
    const [displaySnack, setDisplaySnack] = useState(false)

    useEffect(() => {
        getChurchUsers();
    }, [])

    const getChurchUsers = async () => {
        setloading(true);
        try {
            let { data } = await GetOrgSpecificConnections(userInfo.userId, churchInfo.tenantId);
            setOrganisationConnections(data);
            setloading(false);
        }
        catch (error) {
            console.error(error);
            setloading(false);
        }
    }

    const connectWithUsers = async (item, index) => {
        let payload = {
            FriendRequesterID: userInfo.userId,
            FriendApproverID: item.id
        }

        const usersCopy = [...organisationConnections];
        usersCopy[index].requestConnectionLoading = true;
        setOrganisationConnections(usersCopy)

        console.log(payload)

        try {
            let { data } = await RequestConnection(payload);
            if (data) {
                usersCopy[index].requestConnectionLoading = false;
                usersCopy[index].friendshipRequest = "Pending";
                setOrganisationConnections(usersCopy)
                setDisplaySnack(true)
            }
        }
        catch (error) {
            console.error(error);
            usersCopy[index].requestConnectionLoading = false;
            setOrganisationConnections(usersCopy)
        }
    }

    const filterConnections = organisationConnections.filter(item => (
        (searchText === '' || (item?.name?.toLowerCase().includes(searchText.toLowerCase())))
        // Add more conditions as needed for other fields
    ));

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                {/* <ScrollView> */}
                <View style={styles.sidecontainer}>
                    {
                        loading ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 200 }}>
                                <ActivityIndicator color={COLORS.primary} size={25} />
                            </View>
                        ) : (
                            <>
                                <Input placeholder={'Search'} icon="search" outlineStyle={{ borderRadius: 20, borderWidth: 1 }} value={searchText} onChangeText={setSearchText} />
                                {
                                    isNew ? (
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={{ color: "rgba(31, 30, 30, 0.8)", fontSize: 17, textAlign: "center", fontFamily: Fonts.bold }}>Build Your Connection</Text>
                                            <Text style={{ color: "rgba(31, 30, 30, 1)", fontSize: 13, textAlign: "center", marginTop: 0, fontFamily: Fonts.regular }}>Connect with at least 5 people</Text>
                                        </View>
                                    ) : null
                                }
                                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                    <Button textColor={COLORS.primary} style={{ marginTop: 15, marginBottom: 15, borderRadius: 5, borderColor: COLORS.primary }} mode="outlined" onPress={() => navigation.navigate("MyConnections", { data: 'explore' })}>
                                        <Text style={{ fontFamily: Fonts.medium }}>My connections</Text>
                                    </Button>
                                </View>
                                <View>
                                    {

                                        filterConnections.length > 0 ?
                                            <View style={{ height: height - 268 }}>
                                                <FlatList
                                                    data={filterConnections}
                                                    keyExtractor={(item, index) => index}
                                                    renderItem={({ item, index }) => (
                                                        <View>
                                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                                                                <View style={{ flexDirection: 'row', gap: 10, alignItems: "center" }}>
                                                                    <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item.id })}>
                                                                        <View>
                                                                            {
                                                                                item.pictureUrl ? (
                                                                                    <Image source={{ uri: item.pictureUrl }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                                ) : (
                                                                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 30, height: 30, borderRadius: 50 }} />
                                                                                )
                                                                            }
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item.id })}>
                                                                        <View>
                                                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 15, color: "rgba(31, 30, 30, 1)" }}>{item.name} {item.lastName ? item.lastName : ""}</Text>
                                                                            <Text style={{ fontFamily: Fonts.regular, fontSize: 10 }}>{item.occupation} {item.occupation && item.maritalStatus ? `|` : ""} {item.maritalStatus}</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                </View>
                                                                {
                                                                    item.requestConnectionLoading ? (
                                                                        <ActivityIndicator color={COLORS.primary} size={25} />
                                                                    ) : !item?.friendshipRequest || item?.friendshipRequest?.toLowerCase() === 'declined' ? (
                                                                        <TouchableOpacity onPress={() => connectWithUsers(item, index)}>
                                                                            <RoundAddOutline size={35} />
                                                                        </TouchableOpacity>
                                                                    ) : item?.friendshipRequest?.toLowerCase() === 'pending' ? (
                                                                        <RoundCheckFilled size={30} />
                                                                    ) : null
                                                                }

                                                            </View>
                                                            {
                                                                index !== organisationConnections.length - 1 ? (
                                                                    <Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 15 }} bold />
                                                                ) : null
                                                            }
                                                        </View>
                                                    )}
                                                    contentContainerStyle={{ flexGrow: 1 }}
                                                    showsVerticalScrollIndicator={true}
                                                />
                                            </View>
                                            : (
                                                <View style={styles.sidecontainer}>
                                                    <View style={styles.centeritem}>
                                                        <View style={styles.NoMessageCard}>
                                                            <GroupUsersIcon size="40" color={"#555555CC"} />
                                                            <Text style={styles.NoMessageText}>No connections from {churchInfo.churchName} yet, Explore more connections from {churchInfo.churchName} ministries.</Text>
                                                        {/* <View style={{ flexDirection: "row", justifyContent: "center", backgroundColor: "#ffffff" }}>
                                                            <Button textColor="#FFFFFF" style={{ marginTop: 15, marginBottom: 15, borderRadius: 5, backgroundColor: COLORS.primary }} mode="contained" onPress={() => navigation.navigate("FullConnections", { data: 'explore' })}>
                                                                <Text style={{ fontFamily: Fonts.medium }}>Explore more</Text>
                                                            </Button>
                                                        </View> */}
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                    }
                                </View>

                                {
                                    isNew ? (
                                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                                            <Button textColor="#FFFFFF" style={{ marginTop: 15, marginBottom: 15, padding: 5, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={() => navigation.navigate("SocialTabs")}>
                                                <Text style={styles.buttontext}>Go to Feeds</Text>
                                            </Button>
                                        </View>
                                    ) : null
                                }
                            </>
                        )
                    }
                </View>
                {/* </ScrollView> */}
            </SafeAreaView>
            <Snackbar
                visible={displaySnack}
                duration={4000}
                style={{ backgroundColor: "#3CBF98" }}
                onDismiss={() => setDisplaySnack(false)}
            >
                <Text style={{ color: "#FFFFFF" }}>Your connection request has been sent 🎉</Text>
            </Snackbar>
        </>
    );
}

const styles = StyleSheet.create({
    sidecontainer: {
        paddingHorizontal: 15,
        marginTop: 15
    },
    buttontext: {
        fontFamily: Fonts.semibold
    },
    centeritem: {
        // height: height - 180,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center"
    },
    NoMessageCard: {
        width: 220,
        height: 220,
        borderRadius: 30,
        borderColor: "#0000001A",
        borderWidth: 1,
        backgroundColor: "#F6F6F680",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        gap: 10
    },
    NoMessageText: {
        textAlign: "center",
        fontFamily: Fonts.regular,
        color: "#8D8D8D",
        fontSize: 13,
    }
})

export default ConnectionList;