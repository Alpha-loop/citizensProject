import { Text, View, StyleSheet, ScrollView, SafeAreaView, Image, FlatList, TouchableOpacity, Share } from "react-native";
import { BookIcon, Views } from "../../assets/img/icons";
import { COLORS, Fonts, width } from "../../assets/Theme";
import { StackHeader } from "../reusables/index";
import { Button, Divider } from 'react-native-paper';
import { useState, useEffect, useRef } from "react";
import { ChurchProfile, YouTubeChannelVideoDetails, YouTubeChannelVideoIds, ChurchFeeds } from "../../services/dashboard";
import { useSelector } from 'react-redux';
import moment from "moment";
import AutoHeightImage from 'react-native-auto-height-image';


const TodayDevotional = ({ navigation, route }) => {
    const [videoDetails, setVideoDetails] = useState([]);
    const churchInfo = useSelector((state) => state.user.churchInfo);
    let { data } = route.params;
    const [devotionLibrary, setDevotionLibrary] = useState([])
    const ref = useRef(null);

    const renderSermonVideos = ({ item, index }) => (
        <TouchableOpacity onPress={() => navigation.navigate("ViewVideoDetails", { data: item, videoDetails })} style={{ position: 'relative', marginBottom: 15 }}>
            <Image source={{ uri: item.highThumbnailUrl }} height={140} width={210} resizeMode='cover' style={{ borderRadius: 10 }} />
            <Text style={{ color: "black", fontFamily: Fonts.medium, fontSize: 13, marginTop: 3, width: 121 }}>{item.title?.length > 15 ? `${item.title.substr(0, 15)}...` : item.title}</Text>
            <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
                <Text style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 10 }}>{moment(item.publishedAt.split("T")[0].replaceAll("-", ""), "YYYYMMDD").fromNow()}</Text>
                <Text style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 10, marginTop: 3 }}>
                    <Views color="rgba(0, 0, 0, 0.6)" /> {item?.statistics?.viewCount}
                </Text>
            </View>
            <Image source={require("../../assets/img/play.png")} style={{ position: 'absolute', top: 50, left: '40%' }} />
        </TouchableOpacity>
    );

    useEffect(() => {
        getChurchProfile();
        getChurchFeed();
    }, [])



    const getChurchProfile = async () => {
        try {
            let { data } = await ChurchProfile(churchInfo.tenantId);
            if (!data) return;
            const channelId = data.returnObject.churchSocialMedia.find(i => i.name.toLowerCase().includes("channel id"));
            if (!channelId) return;
            getVideoIds(channelId.url);
        } catch (error) {
            console.log(error);
        }
    }

    const getVideoIds = async (channelId) => {
        try {
            let { data } = await YouTubeChannelVideoIds(channelId);
            const videoIDs = data ? data.items.map(i => i.id.videoId) : []
            getVideoIdDetails(videoIDs);
        } catch (error) {
            console.log(error);
        }
    }

    const getVideoIdDetails = async (IDs) => {
        try {
            let { data } = await YouTubeChannelVideoDetails(IDs);
            let videoDetailsShallowCopy = new Array();
            if (data.items.length > 0) {
                data.items.forEach(item => {
                    videoDetailsShallowCopy.push({
                        title: item.snippet.title,
                        description: item.snippet.description,
                        channelTitle: item.snippet.channelTitle,
                        publishedAt: item.snippet.publishedAt,
                        videoId: item.id,
                        defaultThumbnailUrl: item.snippet?.thumbnails?.default?.url,
                        mediumThumbnailUrl: item.snippet?.thumbnails?.medium?.url,
                        highThumbnailUrl: item.snippet?.thumbnails?.high?.url,
                        standardThumbnailUrl: item.snippet?.thumbnails?.standard?.url,
                        maxResThumbnailUrl: item.snippet?.thumbnails?.maxres?.url,
                        statistics: item.statistics
                    });
                })
                setVideoDetails(videoDetailsShallowCopy);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const share = async () => {
        await Share.share({
            title: data.title,
            message: '*' + data.title + '*' + '\n' + '\n' + data.content + '\n' + '\n' + data.mediaUrl,
            url: data.mediaUrl
        });
    }

    const getChurchFeed = async () => {
        try {
            let { data } = await ChurchFeeds(churchInfo.tenantId);
            if (!data) return;
            const devotions = data && data.filter(i => i.postCategoryName.toLowerCase().includes("devotional") && i.postCategoryId !== data.postCategoryId)
            setDevotionLibrary(devotions)
        } catch (error) {
            console.log(error);
        }
    }

    const viewDevotion = (item) => {
        navigation.navigate('TodayDevotional', { data: item })
        ref.current?.scrollTo({ x: 0, y: 0, animated: true });
    }

    return (
        <ScrollView ref={ref} style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <SafeAreaView>
                <StackHeader title="Today's Devotion" goBack={() => navigation.goBack()} />
                <View>
                    {
                        data.mediaUrl ? (
                            <AutoHeightImage width={width} source={{ uri: data.mediaUrl || 'https://placeholder.com/68x68' }} />
                        ) : (
                            <AutoHeightImage width={width} source={require("../../assets/img/familydevotion.png")} />
                        )
                    }
                </View>
                <View style={styles.sideContainer}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontFamily: Fonts.medium, fontSize: 15, textAlign: "center", paddingTop: 5, color: "#00000077" }}>{moment(data._OrderDate).format('dddd, MMMM Do YYYY')}</Text>
                        <Text style={{ fontFamily: Fonts.extrabold, fontSize: 20, textAlign: "center", color: "#124191", width: width / 1.5, marginTop: 7 }}>{data.title}</Text>
                        {
                            data?.bibleVerse ? (
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <BookIcon />
                                    <Text style={{ color: "rgba(0, 0, 0, 0.6)", marginLeft: 5, fontFamily: Fonts.regular }}>{data.bibleVerse}</Text>
                                </View>
                            ) : null
                        }
                        <View>
                            {/* // <Button icon="play-circle" mode="contained" buttonColor="rgba(47, 46, 65, 1)" textColor="#FFFFFF" labelStyle={{ fontWeight: 700 }} style={{ borderRadius: 10, paddingVertical: 4, marginTop: 20 }} onPress={() => console.log('Pressed')}>
                            //     Listen to devotion
                            // </Button> */}
                            {
                                data?.memoryVerse ? (
                                    <Text style={{ fontFamily: Fonts.aclonica, color: "rgba(0, 0, 0, 0.6)", marginTop: 10, lineHeight: 25, fontSize: 18 }}>“{data.memoryVerse}” <Text style={{ color: "rgba(22, 39, 69, 1)" }}>{data.bibleVerse ? data.bibleVerse : ""}</Text></Text>
                                ) : null
                            }
                            <Text style={{ color: "rgba(0, 0, 0, 0.7)", marginTop: 25, lineHeight: 24, fontFamily: Fonts.regular }}>{data.content}</Text>
                            {
                                data.memoryVerse ? (
                                    <Text style={{ fontFamily: Fonts.aclonica, color: "rgba(0, 0, 0, 0.6)", marginTop: 10, lineHeight: 25, marginTop: 50, fontSize: 18 }}>“{data.memoryVerse}” <Text style={{ color: "rgba(22, 39, 69, 1)" }}>{data.bibleVerse ? data.bibleVerse : ""}</Text></Text>
                                ) : null
                            }
                            <View style={{ marginTop: 30 }} >
                                <Divider />
                            </View>
                            {/* <View style={{ marginTop: 30, flexDirection: "row", gap: 15, alignItems: "center" }} >
                                <Image source={require("../../assets/img/cele2.jpg")} style={{ width: 80, height: 80 }} resizeMode="cover" />
                                <View>
                                    <Text style={{ fontSize: 13, fontWeight: 500, color: "rgba(0, 0, 0, 0.4)" }}>Author</Text>
                                    <Text style={{ color: "rgba(0, 0, 0, 1)", fontSize: 16, fontWeight: 500, marginTop: 6 }}>Pst Nelson</Text>
                                    <Text style={{ color: "rgba(0, 0, 0, 1)", fontSize: 12, fontWeight: 300 }}>Senior Branch Pastor</Text>
                                </View>
                            </View> */}
                            <View style={{ flexDirection: "row", gap: 15, alignItems: "center", marginTop: 20 }} >
                                {/* <Button icon="bookmark" mode="contained" buttonColor="rgba(20, 121, 193, 0.1)" textColor="rgba(0, 0, 0, 0.8)" labelStyle={{ fontWeight: 500 }} style={{ borderRadius: 10, paddingVertical: 4, marginTop: 20, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.2)" }} onPress={() => console.log('Pressed')}>
                                    Save for later
                                </Button> */}
                                <Button icon="share" mode="contained" buttonColor="rgba(20, 121, 193, 0.1)" textColor="rgba(0, 0, 0, 0.8)" labelStyle={{ fontFamily: Fonts.semibold }} style={{ borderRadius: 10, paddingVertical: 4, marginTop: 20, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.2)" }} onPress={share}>
                                    Share devotion
                                </Button>
                            </View>
                            <View style={{ marginTop: 50, height: 250 }}>
                                <Text style={{ color: "rgba(0, 0, 0, 1)", fontSize: 15, fontFamily: Fonts.medium }}>Previous devotions</Text>
                                <FlatList
                                    data={devotionLibrary}
                                    keyExtractor={(item, index) => index}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => viewDevotion(item)}>
                                            <View style={{ marginTop: 20 }}>
                                                <Image source={{ uri: item.mediaUrl || 'https://placeholder.com/68x68' }} style={{ width: 121, height: 121, borderRadius: 10 }} />
                                                <Text style={{ marginTop: 5, color: "rgba(0, 0, 0, 0.6)", fontSize: 10 }}>{moment(item._OrderDate.split("T")[0].replaceAll("-", ""), "YYYYMMDD").fromNow()}</Text>
                                                <Text style={{ color: "rgba(0, 0, 0, 1)", fontFamily: Fonts.medium, fontSize: 13, marginTop: 3, width: 121 }}>{item?.title}</Text>
                                                <Text style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 10 }}>{item?.posterDetails?.posterName}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={{ columnGap: 15 }}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                />
                            </View>
                            <View style={{ marginTop: 50, height: 250 }}>
                                <Text style={{ color: "rgba(0, 0, 0, 1)", fontSize: 15, fontFamily: Fonts.medium, marginBottom: 20 }}>Latest sermons</Text>
                                <FlatList
                                    data={videoDetails}
                                    keyExtractor={(item, index) => item.videoId}
                                    renderItem={renderSermonVideos}
                                    contentContainerStyle={{ columnGap: 15 }}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15,
        position: "relative",
        paddingBottom: 40,
        // bottom: 90,
        backgroundColor: "#FFFFFF"
    },
})

export default TodayDevotional