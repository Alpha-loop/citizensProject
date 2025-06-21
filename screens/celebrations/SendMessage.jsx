import { View, Text, ScrollView, SafeAreaView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { StackHeader } from "../reusables/index";
import { Gift, SendIcon } from "../../assets/img/icons";
import Input from "../reusables/Input";
import TextArea from "../reusables/TextArea";
import { useRef, useState } from "react";
import { COLORS, height } from "../../assets/Theme";
import { Button } from "react-native-paper";

const SendCelebrantMessage = ({ navigation, route }) => {
    const { params } = route;
    const [chatMessage, setChatMessage] = useState("")
    const chatInputRef = useRef()
    const defaultMessage = [
        { text: 'Enjoy your Big day', color: "#F76976" },
        { text: 'I celebrate you always', color: "#0889FF" },
        { text: 'Happy Anniversary', color: "#124191" }
    ]
    const setInstantMessage = (item) => {
        setChatMessage(item.text);
        chatInputRef.current.focus();
    }

    const [chats, setChats] = useState([])

    const sendMessage = () => {
        const copy = [...chats];
        copy.push(chatMessage)
        setChats(copy)
        setChatMessage("");
    }

    const sendIcon = (
        <TouchableOpacity onPress={sendMessage}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 50, backgroundColor: COLORS.primary, width: 35, height: 35 }}>
                <SendIcon />
            </View>
        </TouchableOpacity>
    )
    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <SafeAreaView>
                    <StackHeader title="Send Message" headerRight={<Gift size={22} />} goBack={() => navigation.goBack()} />
                    <View>
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
                            {
                                params.photo && params.photo !== null ? (
                                    <Image source={{ uri: params.photo }} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: 50 }} />
                                ) : (
                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 80, height: 80, borderRadius: 50 }} />
                                )
                            }
                        </View>
                        <Text style={{ color: "rgba(0, 0, 0, 0.80)", fontSize: 16, fontWeight: 500, textAlign: "center", marginTop: 10 }}>{params.name}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                            {
                                params.celebration.toLowerCase() == "birthday" ? (
                                    <Image source={require('../../assets/img/birthday_cake.png')} resizeMode="contain" />
                                ) : (
                                    <Image source={require('../../assets/img/wedding_anniversary.png')} resizeMode="contain" />
                                )
                            }
                            <Text style={{ color: "rgba(246, 116, 127, 1)", fontSize: 13, fontWeight: 500 }}>2nd year birthday celebration</Text>
                            {/* <Text style={{ color: "rgba(246, 116, 127, 1)", fontSize: 13, fontWeight: 500 }}>{JSON.stringify(params)}</Text> */}
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
            <ScrollView style={{ backgroundColor: "#FFFFFF", height: chats.length == 0 ? height - 690 : height - 520, paddingHorizontal: 15 }}>
                <SafeAreaView>
                    <View>
                        {
                            chats.map((item, index) => (
                                <>
                                    <Text style={{ fontSize: 13, color: "rgba(0, 0, 0, 0.4)", marginBottom: 5, marginTop: 10 }}>Oladapo Daniel</Text>
                                    <View style={{ backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: 5 }}>
                                        <Text style={{ color: "white", textAlign: "center", fontWeight: 600 }}>{item}</Text>
                                    </View>
                                </>
                            ))
                        }
                    </View>
                </SafeAreaView>
            </ScrollView>
            <View style={{ paddingHorizontal: 15, paddingBottom: 20, backgroundColor: "#FFFFFF", }}>
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
                <TextArea iconRight={sendIcon} innerRef={chatInputRef} placeholder="Type your message here" onChangeText={setChatMessage} value={chatMessage} multiline={true} numberOfLines={1} style={styles.textArea} outlineRadius={20} textAlign="center" />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    textArea: {
        // backgroundColor: "rgba(217, 217, 217, 0.2)",
        // paddingTop: 10,
        marginTop: 7,
        borderRadius: 20,
        // textAlignVertical: 'center'
    },
})

export default SendCelebrantMessage;