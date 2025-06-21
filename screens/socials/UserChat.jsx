import { useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, Keyboard, Platform, TouchableWithoutFeedback } from "react-native";
import { MessageIcon, PhotoIcon, PhotoIconII, SendIcon } from "../../assets/img/icons";
import { COLORS, Fonts, height } from "../../assets/Theme";
import { CreateNewChatMessage, GetSingleConnectionChatMessages } from "../../services/social";
import { StackHeader } from "../reusables/index";
import TextArea from "../reusables/TextArea";
import { useSelector } from "react-redux";
import dateFormatter from "../../utils/dateFormatter";
import { Button } from "react-native-paper";

const UserChat = ({ navigation, route }) => {
    const chatInputRef = useRef()
    const { data, name } = route.params
    const userInfo = useSelector((state) => state.user.userInfo);
    const [chatMessage, setChatMessage] = useState("")
    const [chats, setChats] = useState([])
    const [chatLoading, setChatLoading] = useState(false)
    const [getChatLoading, setGetChatLoading] = useState(false)
    const defaultMessage = [
        { text: 'Hello friend 👋🏼', color: "#F76976" },
        { text: 'Have a good day 🙂', color: "#0889FF" },
        { text: 'Good morning ☀️', color: "#124191" }
    ]
    const flatListRef = useRef(null);

    useEffect(() => {
        getSingleConnectionMessages();
    }, [userInfo])
    
    useEffect(() => {
        setTimeout(() => {
            scrollToEnd()
        }, 500);
    }, [chats])

    const getSingleConnectionMessages = async () => {
        setGetChatLoading(true);
        try {
            let response = await GetSingleConnectionChatMessages(userInfo.userId, data);
            setChats(response.data.reverse())
            setGetChatLoading(false);
        }
        catch (error) {
            console.error(error);
            setGetChatLoading(false);
        }
    }

    const createChatMessage = async () => {
        setChatLoading(true)
        let payload = {
            SenderId: userInfo.userId,
            RecieverId: data,
            text: chatMessage
        }
        try {
            let response = await CreateNewChatMessage(payload);
            setChatLoading(false)
            const chatCopy = [...chats];
            chatCopy.push(response.data)
            setChats(chatCopy)
            setChatMessage("")
            Keyboard.dismiss();
        }
        catch (error) {
            console.error(error);
            setChatLoading(false)
        }
    }

    const setInstantMessage = (item) => {
        setChatMessage(item.text);
        chatInputRef.current.focus();
    }

    const scrollToEnd = () => {
            flatListRef.current?.scrollToEnd({ animated: true });
      };

    const inputIcons = (
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", width: 70 }}>
            {/* <TouchableOpacity>
                <View>
                    <PhotoIconII />
                </View>
            </TouchableOpacity> */}
            {
                chatLoading ? (
                    <ActivityIndicator color={COLORS.primary} size={25} />
                ) : (
                    <TouchableOpacity onPress={createChatMessage}>
                        <View>
                            <SendIcon size={28} color={"black"} />
                        </View>
                    </TouchableOpacity>
                )
            }
        </View>
    )

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>

                <StackHeader title={name ? name : userInfo.userId == (chats.length > 0 && chats[0]?.sender?.id) ? chats[0]?.reciever?.name : chats[0]?.sender?.name} goBack={() => navigation.goBack()} />
                {
                    getChatLoading ? (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 50 }}>
                            <ActivityIndicator color={COLORS.primary} size={25} />
                        </View>
                    ) : (
                        // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={[styles.sidecontainer, { height: height - 100, flexDirection: "row", alignItems: "flex-end", paddingVertical: 20, paddingBottom: Platform.OS === 'android' ? 40 : 80 }]}>
                                <FlatList
                                    data={chats}
                                    renderItem={({ item, index }) => (
                                        <View key={index} style={{ marginTop: 10 }}>
                                            <View style={styles.messagecardWrapper(userInfo.userId, item.senderId)} >
                                                <View style={styles.messagecard}>
                                                    <Text style={styles.messagetext}>{item.text}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.messagecardWrapper(userInfo.userId, item.senderId)} >
                                                {userInfo.userId == item.senderId ? <Text style={styles.chatTime}>{dateFormatter.getTime(item.dateDelivered)}</Text> : null}
                                                {

                                                    item?.sender?.pictureUrl ? (
                                                        <Image source={{ uri: item?.sender?.pictureUrl }} resizeMode="cover" style={styles.userImage} />
                                                    )
                                                        // : (
                                                        //     <Image source={{ uri: item?.reciever?.pictureUrl }} resizeMode="cover" style={styles.userImage} />
                                                        // ) 
                                                        : (
                                                            <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={styles.userImage} />
                                                        )

                                                }
                                                {userInfo.userId !== item.senderId ? <Text style={styles.chatTime}>{dateFormatter.getTime(item.dateDelivered)}</Text> : null}
                                            </View>

                                        </View>
                                    )}
                                    keyExtractor={(item, index) => index}
                                    contentContainerStyle={{ rowGap: 10 }}
                                    showsVerticalScrollIndicator={false}
                                    onScrollBeginDrag={() => Keyboard.dismiss()}
                                    ref={flatListRef}
                                />
                            </View>
                        // {/* </TouchableWithoutFeedback> */}
                    )
                }
                {/* </ScrollView> */}
            </SafeAreaView>
            <View style={[styles.sidecontainer, { backgroundColor: COLORS.white }]}>
                {
                    chats.length == 0 ? (
                        <>
                            <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.4)", marginBottom: 5 }}>Try this instant message</Text>
                            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap", marginBottom: 15, backgroundColor: "#FFFFFF" }}>
                                {
                                    defaultMessage.map((item, index) => (
                                        <Button key={index} textColor="#FFFFFF" style={{ borderRadius: 5, backgroundColor: item.color }} mode="contained" onPress={() => setInstantMessage(item)}>
                                            <Text style={{ fontSize: 12 }}>{item.text}</Text>
                                        </Button>
                                    ))
                                }
                            </View>
                        </>
                    ) : null
                }
                <TextArea iconRight={inputIcons} innerRef={chatInputRef} doubleIcon={false} placeholder="Type your message here" onChangeText={setChatMessage} value={chatMessage} multiline={true} numberOfLines={1} style={styles.textArea} outlineRadius={20} textAlign="center" />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    sidecontainer: {
        paddingHorizontal: 15,
        // marginTop: 15
    },
    textArea: {
        // marginTop: 7,
        borderRadius: 20,
        marginBottom: 10,

        // textAlignVertical: 'center'
    },
    messagecardWrapper: (userId, senderId) => ({
        flexDirection: "row",
        justifyContent: userId !== senderId ? "flex-start" : "flex-end",
        alignItems: "center",
        gap: 5
    }),
    messagecard: {
        borderWidth: 1,
        borderColor: "#0000001A",
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#F6F6F6B2",
        maxWidth: "75%",
        // marginTop: 15
    },
    messagetext: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: "#000000",
    },
    userImage: {
        width: 23,
        height: 23,
        borderRadius: 20,
        marginTop: 8
    },
    chatTime: {
        fontSize: 10,
        color: "#1F1E1E99",
        marginTop: 5,
        fontFamily: Fonts.regular
    }
})

export default UserChat;