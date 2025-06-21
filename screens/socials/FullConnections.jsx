import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList } from "react-native";
import { MessageConnection, RoundAddOutline, RoundCheckFilled } from "../../assets/img/icons";
import { COLORS, Fonts, height } from "../../assets/Theme";
import Input from "../reusables/Input";
import { Divider, Snackbar } from "react-native-paper";
import { GetChurchUsers, GetGlobalConnections, RequestConnection,GetOrgSpecificConnections  } from "../../services/social";
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native"
import { StackHeader } from "../reusables/index";

const FullConnections = ({ route }) => {
    const [searchText, setSearchText] = useState("")
    const userInfo = useSelector((state) => state.user.userInfo);
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const connectedFriends = useSelector((state) => state.user.connectedFriends);
    const [globalConnections, setGlobalConnections] = useState([]);
    const [loading, setloading] = useState(false);
    const navigation = useNavigation();
    const { data } = route.params;
    const [displaySnack, setDisplaySnack] = useState(false)

    useEffect(() => {
        getChurchUsers();
    }, [userInfo])

    const getChurchUsers = async () => {
        setloading(true);
        try {
            let { data } = await GetOrgSpecificConnections(userInfo.userId, churchInfo.tenantId);
            setGlobalConnections(data);
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

        const usersCopy = [...globalConnections];
        usersCopy[index].requestConnectionLoading = true;
        setGlobalConnections(usersCopy)

        try {
            let { data } = await RequestConnection(payload);
            if (data) {
                usersCopy[index].requestConnectionLoading = false;
                usersCopy[index].friendshipRequest = "Pending";
                setGlobalConnections(usersCopy)
                setDisplaySnack(true)
            }
        }
        catch (error) {
            console.error(error);
            usersCopy[index].requestConnectionLoading = false;
            setGlobalConnections(usersCopy)
        }
    }

    const filterConnections = globalConnections.filter(item => (
        (searchText === '' || (item?.name?.toLowerCase().includes(searchText.toLowerCase())))
        // Add more conditions as needed for other fields
    ));


    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <StackHeader title="All Connections" goBack={() => navigation.goBack()} />
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
                                        data === 'explore' ? (
                                            <Text style={{ fontFamily: Fonts.bold, color: "#1F1E1ECC", fontSize: 15, marginTop: 15 }}>Explore</Text>
                                        ) : (
                                            <Text style={{ fontFamily: Fonts.bold, color: "#1F1E1ECC", fontSize: 15, marginTop: 15 }}>Your Connects ({connectedFriends.length})</Text>
                                        )
                                    }
                                    {
                                        data === 'explore' ? (
                                            <View style={{ marginTop: 20 }}>
                                                <FlatList
                                                    data={filterConnections}
                                                    keyExtractor={(item, index) => index}
                                                    renderItem={({ item, index }) => (
                                                        <View key={index}>
                                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                                                                <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item.id })}>
                                                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: "center" }}>
                                                                        <View>
                                                                            {
                                                                                item.pictureUrl ? (
                                                                                    <Image source={{ uri: item.pictureUrl }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                                ) : (
                                                                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 30, height: 30, borderRadius: 50 }} />
                                                                                )
                                                                            }
                                                                        </View>
                                                                        <View>
                                                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 14, color: "rgba(31, 30, 30, 1)" }}>{item.name}</Text>
                                                                            <Text style={{ fontFamily: Fonts.regular, fontSize: 10 }}>{item.ministry} {item.occupation && item.ministry ? `| ` : ""}{item.occupation}</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
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
                                                                index !== globalConnections.length - 1 ? (
                                                                    <Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 15 }} bold />
                                                                ) : null
                                                            }
                                                        </View>
                                                    )}
                                                    contentContainerStyle={{ flexGrow: 1 }}
                                                    showsVerticalScrollIndicator={true}
                                                />
                                                {/* {
                                                    globalConnections.map((item, index) => (
                                                        <View key={index}>
                                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                                                                <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item.id })}>
                                                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: "center" }}>
                                                                        <View>
                                                                            {
                                                                                item.pictureUrl ? (
                                                                                    <Image source={{ uri: item.pictureUrl }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                                ) : (
                                                                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 30, height: 30, borderRadius: 50 }} />
                                                                                )
                                                                            }
                                                                        </View>
                                                                        <View>
                                                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 14, color: "rgba(31, 30, 30, 1)" }}>{item.name}</Text>
                                                                            <Text style={{ fontFamily: Fonts.regular, fontSize: 10 }}>{item.ministry} {item.occupation && item.ministry ? `| ` : ""}{item.occupation}</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
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
                                                                index !== globalConnections.length - 1 ? (
                                                                    <Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 15 }} bold />
                                                                ) : null
                                                            }
                                                        </View>
                                                    ))
                                                } */}
                                            </View>
                                        ) : (
                                            <View style={{ marginTop: 20 }}>
                                                {
                                                    connectedFriends.map((item, index) => (
                                                        <View key={index}>
                                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                                                                <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile")}>
                                                                    <View style={{ flexDirection: 'row', gap: 10, alignItems: "center" }}>
                                                                        <View>
                                                                            {
                                                                                item.pictureUrl ? (
                                                                                    <Image source={{ uri: item.pictureUrl }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                                ) : (
                                                                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 30, height: 30, borderRadius: 50 }} />
                                                                                )
                                                                            }
                                                                        </View>
                                                                        <View>
                                                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 14, color: "rgba(31, 30, 30, 1)" }}>{item.name}</Text>
                                                                            <Text style={{ fontFamily: Fonts.regular, fontSize: 10 }}>{item.ministry} {item.occupation && item.ministry ? `| ` : ""}{item.occupation}</Text>
                                                                        </View>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => navigation.navigate("Messages")}>
                                                                    <MessageConnection />
                                                                </TouchableOpacity>
                                                            </View>
                                                            {
                                                                index !== globalConnections.length - 1 ? (
                                                                    <Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 15 }} bold />
                                                                ) : null
                                                            }
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        )
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
    }
})

export default FullConnections;