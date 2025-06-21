import { BellDotIcon } from "../../assets/img/icons";
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { COLORS, Fonts, height } from "../../assets/Theme";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApproveConnectionRequest, DeclineConnectionRequest, GetConnectedFriends, GetPendingConnectionRequest } from "../../services/social";
import { userConnectedFriends } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

const Notifications = ({ navigation }) => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const [pendingRequest, setPendingRequest] = useState([])
    const [approveRequestLoading, setApproveRequestLoading] = useState(false)
    const [declineRequestLoading, setDeclineRequestLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const isFocused = useIsFocused();

    useEffect(() => {
        getPendingFriendRequest();
    }, [isFocused])

    const getPendingFriendRequest = async () => {
        setLoading(true);
        try {
            let { data } = await GetPendingConnectionRequest(userInfo.userId);
            setLoading(false);
            setPendingRequest(data);
        }
        catch (error) {
            setLoading(false);
            console.error(error);
        }
    }

    const approveConnectionRequest = async (item, index) => {

        const alertCopy = [...pendingRequest];
        alertCopy[index].approveConnectionLoading = true;
        setPendingRequest(alertCopy)

        let payload = {
            FriendRequesterID: item.friendRequesterID,
            FriendApproverID: userInfo.userId
        }
        try {
            await ApproveConnectionRequest(payload);

            const alertCopy = [...pendingRequest];
            alertCopy[index].approveConnectionLoading = false;
            setPendingRequest(alertCopy)

            getPendingFriendRequest();
            getConnectedFriends();
        }
        catch (error) {
            const alertCopy = [...pendingRequest];
            alertCopy[index].approveConnectionLoading = false;
            setPendingRequest(alertCopy)

            console.error(error);
        }
    }

    const declineConnectionRequest = async (item, index) => {

        const alertCopy = [...pendingRequest];
        alertCopy[index].declineConnectionLoading = true;
        setPendingRequest(alertCopy)

        let payload = {
            FriendRequesterID: item.friendRequesterID,
            FriendApproverID: userInfo.userId
        }
        try {
            await DeclineConnectionRequest(payload);

            const alertCopy = [...pendingRequest];
            alertCopy[index].declineConnectionLoading = false;
            setPendingRequest(alertCopy)

            getPendingFriendRequest();
            getConnectedFriends();
        }
        catch (error) {
            const alertCopy = [...pendingRequest];
            alertCopy[index].declineConnectionLoading = false;
            setPendingRequest(alertCopy)

            setDeclineRequestLoading(false)
            console.error(error);
        }
    }

    const getConnectedFriends = async () => {
        try {
            let { data } = await GetConnectedFriends(userInfo.userId)
            dispatch(userConnectedFriends(data))
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <ScrollView>
                    <View style={styles.sidecontainer}>
                        {
                            loading ? (
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 200 }}>
                                    <ActivityIndicator color={COLORS.primary} size={25} />
                                </View>
                            ) :
                                pendingRequest.length > 0 ? (
                                    <View>
                                        {/* <View style={[styles.flexBetween, { marginTop: 10 }]}>
                                            <Text style={styles.allText}>All(6)</Text>
                                            <Button icon="delete" textColor="#F76976" mode="text" onPress={() => console.log('Pressed')}>
                                                <Text style={styles.cleartext}>Clear all</Text>
                                            </Button>
                                        </View> */}
                                        {
                                            pendingRequest.map((item, index) => (
                                                <View style={[styles.notificationCard, { marginTop: 15 }]} key={index}>
                                                    <View style={styles.flexitem}>
                                                        <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item?.friendRequester?.id })}>
                                                            {
                                                                item?.friendRequester?.pictureUrl ? (
                                                                    <Image source={{ uri: item.friendRequester.pictureUrl }} resizeMode="cover" style={{ width: 50, height: 50, borderRadius: 50 }} />
                                                                ) : (
                                                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 50, height: 50, borderRadius: 50 }} />
                                                                )
                                                            }
                                                        </TouchableOpacity>
                                                        <View>
                                                            <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item?.friendRequester?.id })}>
                                                                <Text style={styles.username}>{item?.friendRequester?.name}</Text>
                                                            </TouchableOpacity>
                                                            <View style={[styles.flexitem, { marginTop: 10 }]}>
                                                                <Button buttonColor="#F76976" textColor="#FFFFFF" mode="contained" style={styles.button} loading={item.approveConnectionLoading} onPress={() => declineConnectionRequest(item, index)}>
                                                                    <Text style={styles.cleartext}>Decline</Text>
                                                                </Button>
                                                                <Button buttonColor="#124191" textColor="#FFFFFF" mode="contained" style={styles.button} loading={item.declineConnectionLoading} onPress={() => approveConnectionRequest(item, index)}>
                                                                    <Text style={styles.cleartext}>Accept</Text>
                                                                </Button>
                                                            </View>

                                                        </View>
                                                    </View>
                                                </View>
                                            ))
                                        }
                                    </View>
                                ) : (
                                    <View style={styles.centeritem}>
                                        <View style={styles.NoMessageCard}>
                                            <BellDotIcon color={"#555555CC"} size={45} />
                                            <Text style={styles.NoMessageText}>Your notifications will appear here</Text>
                                        </View>
                                    </View>
                                )
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>

        </>
    );
}

const styles = StyleSheet.create({
    sidecontainer: {
        paddingHorizontal: 15,
        marginTop: 15
    },
    centeritem: {
        height: height - 180,
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
        fontSize: 16,
    },
    allText: {
        fontFamily: Fonts.bold,
        color: "#1F1E1ECC"
    },
    cleartext: {
        fontFamily: Fonts.medium
    },
    flexBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    flexitem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    notificationCard: {
        borderColor: "#0000001A",
        borderWidth: 1,
        backgroundColor: "#F6F6F6B2",
        borderRadius: 10,
        padding: 15,
        // alignItems: "center"
    },
    username: {
        color: "#1F1E1E",
        fontFamily: Fonts.medium
    },
    button: {
        borderRadius: 10
    }
})

export default Notifications;