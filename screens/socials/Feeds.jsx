import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Comment } from "../../assets/img/comment";
import { Like, Unlike } from "../../assets/img/like";
import { COLORS, Fonts, height, width } from "../../assets/Theme";
import Input from "../reusables/Input";
import { Divider, TouchableRipple } from "react-native-paper";
import { FAB } from 'react-native-paper';
import { GetAllSocialPost, LikeSocialPost } from "../../services/social";
import { useSelector } from "react-redux";
import dateFormatter from "../../utils/dateFormatter";
import AutoHeightImage from 'react-native-auto-height-image';
import { useIsFocused } from "@react-navigation/native";

const SocialFeeds = ({ navigation }) => {
    const [searchText, setSearchText] = useState("")
    const [feedPost, setFeedPost] = useState([])
    const [loading, setLoading] = useState(false)
    const userInfo = useSelector((state) => state.user.userInfo);
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        getAllSocialPost()
    }, [isFocused])

    const getAllSocialPost = async () => {
        setLoading(true);
        try {
            let { data } = await GetAllSocialPost(userInfo.userId);
            setFeedPost(data.reverse());
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        getAllSocialPost()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // Simulating a delay
    };

    const likePost = async (item, index) => {
        let payload = {
            mobileUserID: userInfo.userId,
            postId: item.postId
        }

        if (item.isLiked) {
            let copy = [...feedPost]
            copy[index].isLiked = false
            copy[index].likeCount -= 1
            setFeedPost(copy)
        } else {
            let copy = [...feedPost]
            copy[index].isLiked = true
            copy[index].likeCount += 1
            setFeedPost(copy)
        }

        try {
            let response = await LikeSocialPost(payload);
            if (response.data) {
                console.log('liked')
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
            >
                <View style={styles.sidecontainer}>
                    <Input placeholder={'Search'} icon="search" outlineStyle={{ borderRadius: 20, borderWidth: 1 }} value={searchText} onChangeText={setSearchText} />
                    <View style={{ marginTop: 20 }}>
                        {
                            loading ? (
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 280 }}>
                                    <ActivityIndicator color={COLORS.primary} size={25} />
                                </View>
                            ) : feedPost.length > 0 ?
                                feedPost.map((item, index) => (
                                    <View key={index}>
                                    <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                                            <TouchableOpacity onPress={() => navigation.navigate("SocialFeedDetails", { data: item?.poster?.id, postId: item.postId })}>
                                            {
                                                item?.poster?.pictureUrl && item?.poster?.pictureUrl !== "#" ? (
                                                    <Image source={{ uri: item?.poster?.pictureUrl }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                                                ) : (
                                                    <Image source={require("../../assets/img/avatar.png")} style={{ width: 50, height: 50 }} resizeMode="cover" />
                                                )
                                            }
                                            </TouchableOpacity>
                                            <View style={{ width: width - 90 }}>
                                            <TouchableOpacity onPress={() => navigation.navigate("SocialFeedDetails", { data: item?.poster?.id, postId: item.postId })}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <View>
                                                        <Text style={{ fontFamily: Fonts.bold, color: "#1F1E1E" }}>{item?.poster?.name}</Text>
                                                        <Text style={{ fontFamily: Fonts.regular, color: "#1F1E1E99", fontSize: 12 }}>{item?.poster?.about || item?.poster?.ministry}</Text>

                                                    </View>
                                                    {
                                                        item.dateEntered ? (
                                                            <Text style={{ fontFamily: Fonts.regular, color: "#1F1E1E99", fontSize: 12 }}>{dateFormatter.relativeDate(dateFormatter.getISOStringGMT(item.dateEntered))}</Text>
                                                        ) : null
                                                    }
                                                </View>
                                                <Text style={{ fontFamily: Fonts.regular, fontSize: 14, color: "#1F1E1E", marginVertical: 5 }}>{item.content}</Text>
                                                {
                                                    item.mediaUrl && item.mediaUrl !== "#" ? (
                                                        <AutoHeightImage width={width - 90} source={{ uri: item?.mediaUrl }} style={{ borderRadius: 10 }} />
                                                    ) : null
                                                }
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
                                                    {
                                                        item.isLiked ? (
                                                            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                                                <TouchableRipple onPress={() => likePost(item, index)}>
                                                                    <Like color={"#3799F3"} size={28} />
                                                                </TouchableRipple>
                                                                <Text style={{ color: "#1F1E1E99", fontFamily: Fonts.regular, fontSize: 13 }}>{item.likeCount}</Text>
                                                            </View>
                                                        ) : (
                                                            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                                                <TouchableRipple onPress={() => likePost(item, index)}>
                                                                    <Unlike color={"#3799F3"} size={28} />
                                                                </TouchableRipple>
                                                                <Text style={{ color: "#1F1E1E99", fontFamily: Fonts.regular, fontSize: 13 }}>{item.likeCount}</Text>
                                                            </View>
                                                        )
                                                    }
                                                    {/* <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                                        <TouchableOpacity>
                                                            <Comment color={"#555555CC"} size={28} />
                                                        </TouchableOpacity>
                                                        <Text style={{ color: "#1F1E1E99", fontFamily: Fonts.regular, fontSize: 13 }}>2.5K</Text>
                                                    </View> */}

                                                </View>
                                            </View>
                                        </View>
                                            {
                                                index !== feedPost.length - 1 ? (
                                                    <Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 15 }} bold />
                                                ) : null
                                            } 
                                            </View>
                                    
                                )) : (
                                    <View style={styles.parent}>
                                        <View>
                                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: "#000000", textAlign: 'center' }}>No post yet.</Text>
                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 15, color: "rgba(31, 30, 30, 1)" }}>Be the first to make a post.</Text>
                                        </View>
                                    </View>
                                )
                        }
                    </View>
                </View>
            </ScrollView>
            <View>
                <FAB
                    icon="plus"
                    style={styles.fab}
                    customSize={70}
                    color={COLORS.white}
                    rippleColor={"#fff"}
                    onPress={() => navigation.navigate("CreatePost")}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sidecontainer: {
        paddingHorizontal: 15,
        marginTop: 15,
        paddingBottom: 60
    },
    fab: {
        borderRadius: 50,
        position: "absolute",
        bottom: 80,
        right: 20,
        backgroundColor: '#F76976'
    },
    parent: {
        flexDirection: "row",
        gap: 10,
        height: height - 200,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default SocialFeeds