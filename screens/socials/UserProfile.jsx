import { SafeAreaView, ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { COLORS, Fonts, width } from "../../assets/Theme";
import { StackHeader } from "../reusables/index";
import { Button, Divider } from "react-native-paper";
import { EnvelopIcon } from "../../assets/img/icons";
import { Unlike } from "../../assets/img/like";
import { Comment } from "../../assets/img/comment";
import { useEffect, useState } from "react";
import { ImageModal } from "../reusables/Modal";
import AutoHeightImage from 'react-native-auto-height-image';
import { useSelector } from 'react-redux';
import { GetLookUps, GetUserProfile } from "../../services/service";
import { GetUserSocialPost, GetUserSocialProfile, RequestConnection } from "../../services/social";
import dateFormatter from "../../utils/dateFormatter";

const ConnectionProfile = ({ navigation, route }) => {
    const [connectionstate, setConnectionState] = useState("not connected")
    const [showImage, setShowImage] = useState(false)
    const { data } = route.params;
    const userInfo = useSelector((state) => state.user.userInfo);
    const [fullProfile, setFullProfile] = useState({})
    const [maritalStatus, setMaritalStatus] = useState([]);
    const [requestingConnection, setRequestingConnection] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [feedPost, setUserPost] = useState([])

    useEffect(() => {
        getUserProfile();
        getAllUserPost();
    }, [])

    const getUserProfile = async () => {
        setIsLoading(true)
        console.log(data)
        try {
            const response = await GetUserSocialProfile(data);
            setIsLoading(false)
            // console.log(response.data)
            setFullProfile(response.data)
            response.data?.friendshipRequest?.toLowerCase() === 'pending' ? setConnectionState("requested") :
                !response.data?.friendshipRequest || response.data?.friendshipRequest?.toLowerCase() === 'declined' ? setConnectionState("not connected") :
                    response.data?.friendshipRequest?.toLowerCase() === 'approved' ? setConnectionState("connected") : null
        }
        catch (error) {
            setIsLoading(false)
            console.error(error)
        }
    }

    const getAllUserPost = async () => {
        setIsLoading(true)
        try {
            const response = await GetUserSocialPost(data);
            setUserPost(response.data)
        }
        catch (error) {
            console.error(error)
        }
    }

    const connectWithUsers = async () => {
        if (connectionstate !== "not connected") return;
        setRequestingConnection(true);
        let payload = {
            FriendRequesterID: userInfo.userId,
            FriendApproverID: data
        }

        try {
            let { data } = await RequestConnection(payload);
            if (data) {
                setConnectionState("requested");
            }
            setRequestingConnection(false);
        }
        catch (error) {
            console.error(error);
            setRequestingConnection(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
                <View>
                    <StackHeader title="Profile" goBack={() => navigation.goBack()} />
                    <View style={styles.sidecontainer}>
                        <View style={styles.centercontent}>
                            <TouchableOpacity onPress={() => setShowImage(true)}>
                                {
                                    fullProfile.pictureUrl ? (
                                        <Image source={{ uri: fullProfile?.pictureUrl }} style={styles.userImage} />
                                    ) : (
                                        <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={styles.userImage} />
                                    )
                                }
                            </TouchableOpacity>
                            {
                                isLoading ? (
                                    <ActivityIndicator color={COLORS.primary} size={25} />
                                ) : null
                            }
                            <Text style={styles.username}>{fullProfile.name ? fullProfile.name : ""}</Text>
                            <Text style={styles.bio}>{fullProfile.about ? fullProfile.about : ""}</Text>
                        </View>
                        <View style={styles.cardWrapper}>
                            <View style={styles.flexitem}>
                                <Text style={styles.cardTitle}>Occupation: </Text>
                                <Text style={styles.cardValue}>{fullProfile.occupation ? fullProfile.occupation : ""}</Text>
                            </View>
                            <View style={styles.flexitem}>
                                <Text style={styles.cardTitle}>Marital Status: </Text>
                                <Text style={styles.cardValue}>{fullProfile.maritalStatus ? fullProfile.maritalStatus?.name : ""}</Text>
                            </View>
                            <View style={styles.flexitem}>
                                <Text style={styles.cardTitle}>Ministry: </Text>
                                <Text style={styles.cardValue}>{fullProfile.ministry ? fullProfile.ministry : ""}</Text>
                            </View>
                        </View>
                        <View style={[styles.flexitem, styles.gap]}>
                            <Button
                                textColor="#FFFFFF"
                                buttonColor="#0871D1"
                                style={styles.sendmessagebtn()}
                                mode="contained"
                                icon="chat-outline"
                                contentStyle={styles.innerbutton}
                                onPress={() => navigation.navigate("UserChat", { data, name: fullProfile.name })}>
                                <Text style={{ fontFamily: Fonts.medium }}>Send message</Text>
                            </Button>
                            <Button
                                style={styles.sendmessagebtn(connectionstate)}
                                mode="contained"
                                buttonColor={connectionstate == 'not connected' ?
                                    '#FFFFFF' :
                                    connectionstate == 'requested' ? '#586A5E' :
                                        '#06AF3F'}
                                textColor={connectionstate == 'not connected' ?
                                    '#109655' :
                                    '#ffffff'}
                                icon={connectionstate == 'not connected' ?
                                    "plus-circle-outline" :
                                    connectionstate == "requested" ?
                                        "clock-time-three-outline" :
                                        "check-circle-outline"}
                                contentStyle={styles.innerbutton}
                                onPress={connectWithUsers}
                                loading={requestingConnection}
                            >
                                <Text style={{ fontFamily: Fonts.medium }}>{connectionstate == 'not connected' ? 'Connect' : connectionstate == 'requested' ? 'Requested' : 'Connected'}</Text>
                            </Button>
                        </View>
                        <Text style={styles.postheader}>Post ({feedPost.length})</Text>
                        <View style={{ marginTop: 10 }}>
                            {
                                feedPost.map((item, index) => (
                                    <TouchableOpacity onPress={() => navigation.navigate("SocialFeedDetails", { data })} key={index}>
                                        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                                            {
                                                fullProfile?.pictureUrl ? (
                                                    <Image source={{ uri: fullProfile?.pictureUrl }} style={{ width: 30, height: 30, borderRadius: 50 }} />
                                                ) : (
                                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 30, height: 30, borderRadius: 50 }} />
                                                )
                                            }
                                            <View style={{ width: width - 90 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <View>
                                                        <Text style={{ fontFamily: Fonts.bold, color: "#1F1E1E" }}>{item?.poster?.name}</Text>
                                                        <Text style={{ fontFamily: Fonts.regular, color: "#1F1E1E99", fontSize: 12 }}>{fullProfile?.about}</Text>

                                                    </View>
                                                    {/* <Text style={{ fontFamily: Fonts.regular, color: "#1F1E1E99", fontSize: 12 }}>{dateFormatter.relativeDate(item.dateEntered)}</Text> */}
                                                </View>
                                                <Text style={{ fontFamily: Fonts.regular, fontSize: 14, color: "#1F1E1E", marginTop: 10 }}>{item.content}</Text>
                                                {/* <Image source={require("../../assets/img/imgbg2.jpg")} style={{ width: "100%", height: 200, marginTop: 10 }} resizeMode="cover" />
                                                <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
                                                    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                                        <TouchableOpacity>
                                                            <Unlike color={"#3799F3"} size={28} />
                                                        </TouchableOpacity>
                                                        <Text style={{ color: "#1F1E1E99", fontFamily: Fonts.regular, fontSize: 13 }}>2.5K</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                                        <TouchableOpacity>
                                                            <Comment color={"#555555CC"} size={28} />
                                                        </TouchableOpacity>
                                                        <Text style={{ color: "#1F1E1E99", fontFamily: Fonts.regular, fontSize: 13 }}>2.5K</Text>
                                                    </View>
                                                </View> */}
                                            </View>
                                        </View>
                                        {
                                            index !== feedPost.length - 1 ? (
                                                <Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 15 }} bold />
                                            ) : null
                                        }
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        <ImageModal visible={showImage} closeModal={() => setShowImage(false)}>
                            <AutoHeightImage width={width - 30} source={{ uri: fullProfile?.pictureUrl }} />
                        </ImageModal>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sidecontainer: {
        paddingHorizontal: 15,
        marginTop: 15
    },
    centercontent: {
        alignItems: "center",
        marginTop: 10
    },
    userImage: {
        width: 90,
        height: 90,
        borderRadius: 50
    },
    username: {
        fontFamily: Fonts.semibold,
        marginTop: 10,
        color: "#0E5CBA",
        fontSize: 18
    },
    bio: {
        color: "#000000",
        fontFamily: Fonts.regular,
        fontSize: 13
    },
    flexitem: {
        flexDirection: "row",
        flexWrap: 'wrap'
    },
    gap: {
        gap: 5,
        justifyContent: "center"
    },
    cardWrapper: {
        borderWidth: 1,
        borderColor: "#00000040",
        backgroundColor: "#F3F3F3",
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20
    },
    cardTitle: {
        fontFamily: Fonts.regular,
        color: "#000000",
        marginVertical: 5
    },
    cardValue: {
        fontFamily: Fonts.semibold,
        color: "#000000",
        marginVertical: 5
    },
    sendmessagebtn: (connectionstate) => ({
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 30,
        minWidth: 150,
        borderWidth: connectionstate == 'not connected' ? 1 : 0,
        borderColor: connectionstate == 'not connected' ? '#109655' : ''
    }),
    innerbutton: {
        flexDirection: "row-reverse",
    },
    postheader: {
        fontFamily: Fonts.bold,
        fontSize: 15,
        color: "#1F1E1E",
        marginTop: 10
    },
})


export default ConnectionProfile;