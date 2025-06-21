import { SafeAreaView, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Badge } from 'react-native-paper';
import { COLORS, Fonts, height } from "../../assets/Theme";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ArchiveIcon, ChatDotIcon, Trash } from "../../assets/img/icons";
import { Comment } from "../../assets/img/comment";
import { useEffect, useState } from "react";
import { GetAllMessages } from "../../services/social";
import { useSelector } from "react-redux";
import dateFormatter from "../../utils/dateFormatter";
import { useIsFocused } from "@react-navigation/native";

const SocialMessages = ({ navigation }) => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const [messages, setMessages] = useState([])
    const [messagesLoading, setMessagesLoading] = useState(false)
    const isFocused = useIsFocused();

    useEffect(() => {
        getAllConnectionMessages();
    }, [isFocused])

    const getAllConnectionMessages = async () => {
        setMessagesLoading(true)

        try {
            let { data } = await GetAllMessages(userInfo.userId);
            setMessages(data)
            setMessagesLoading(false)
        }
        catch (error) {
            setMessagesLoading(false)
            console.error(error);
        }
    }

    const swipeFromRightOpen = () => {
        // alert('Swipe from right');
    };

    const rightSwipeActions = () => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: 'space-between',
                    //   gap: 10,
                    alignItems: 'center',
                    marginTop: 20,
                    marginLeft: 15
                }}
            >
                <TouchableOpacity style={styles.swipeOptionParent}>
                    <ArchiveIcon />
                    <Text style={styles.swipeOptions(1)}>Archive</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 10 }}>
                    <Trash />
                    <Text style={styles.swipeOptions(2)}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
                {
                    messagesLoading ? (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 200 }}>
                            <ActivityIndicator color={COLORS.primary} size={25} />
                        </View>
                    ) :
                        messages.length > 0 ? (
                            <View style={styles.sidecontainer}>
                                <View style={[styles.flexBetween, { marginTop: 10 }]}>
                                    <Text style={styles.allText}>All({messages.length})</Text>
                                    {/* <Text style={styles.archivedText}>Archived(0)</Text> */}
                                </View>
                                
                                {
                                    messages.map((item, index) => (
                                        <TouchableOpacity onPress={() => navigation.navigate("UserChat", { data: userInfo.userId == item.sender.id ? item.reciever.id : item.sender.id })} key={index}>
                                            {/* <Swipeable
                                                // renderLeftActions={LeftSwipeActions}
                                                renderRightActions={rightSwipeActions}
                                                onSwipeableRightOpen={swipeFromRightOpen}
                                            > */}
                                                <View style={[styles.flexBetween, styles.messageCard, { marginTop: 20 }]}>
                                                    <View style={styles.flexitem}>
                                                        {
                                                            userInfo.userId == item.sender.id ? item?.reciever?.pictureUrl ? (
                                                                <Image source={{ uri: item?.reciever?.pictureUrl }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                            ) : (
                                                                <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                            ) : item?.sender?.pictureUrl ? (
                                                                <Image source={{ uri: item?.sender?.pictureUrl }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                            ) : (
                                                                <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                            )
                                                        }
                                                        <View>
                                                            <Text style={styles.username}>{userInfo.userId == item.sender.id ? item.reciever.name : item.sender.name}</Text>
                                                            <Text style={{ fontFamily: Fonts.regular, fontSize: 12, marginTop: 3, fontStyle: 'italic' }}>{item?.messages?.text.length > 0 ? item.messages?.text.length > 35 ? `${item.messages?.text.slice(0, 35)}...` : item.messages?.text : 'Start a conversation'}</Text>
                                                        </View>
                                                    </View>
                                                    <View>
                                                        {
                                                            item.messages?.dateDelivered ? (
                                                                <Text style={{ fontFamily: Fonts.regular, fontSize: 12, marginTop: 3, color: "#000000" }}>{dateFormatter.relativeDate(dateFormatter.getISOStringGMT(item?.messages.dateDelivered))}</Text>
                                                            ) : null
                                                        }
                                                        {
                                                            item.unreadMessages > 0 ? (
                                                                <View style={{ marginTop: 7 }}>
                                                                    <Badge>{item.unreadMessages}</Badge>
                                                                </View>
                                                            ) : null
                                                        }
                                                    </View>
                                                </View>
                                            {/* </Swipeable> */}
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        ) : (
                            <View style={styles.sidecontainer}>
                                <View style={styles.centeritem}>
                                    <View style={styles.NoMessageCard}>
                                        <ChatDotIcon color={"#555555CC"} size={45} />
                                        <Text style={styles.NoMessageText}>Your messages will appear here</Text>
                                    </View>
                                </View>
                            </View>
                        )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sidecontainer: {
        paddingHorizontal: 15,
        marginTop: 15,
        paddingBottom: 60
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
    allText: {
        fontFamily: Fonts.bold,
        fontSize: 15,
        color: "#1F1E1ECC",
    },
    archivedText: {
        fontFamily: Fonts.bold,
        fontSize: 15,
        color: "#1F1E1E66"
    },
    date: {
        fontFamily: Fonts.light,
        fontSize: 12,
        marginTop: 15
    },
    messageCard: {
        borderColor: "#0000001A",
        borderWidth: 1,
        backgroundColor: "#F6F6F6B2",
        borderRadius: 10,
        padding: 15,
        alignItems: "center"
    },
    username: {
        color: "#1F1E1E",
        fontFamily: Fonts.medium
    },
    swipeOptions: (type) => ({
        color: type === 1 ? "#000000" : "#F76976",
        fontSize: 10
    }),
    swipeOptionParent: {
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: '#0000001A',
        paddingRight: 10
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
        fontSize: 13,
    }
})


export default SocialMessages;