import { View, Image, StyleSheet, ScrollView, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { ChurchSvg, HandsPray, HeartLove, PeaceDove } from "../../assets/img/icons";
import { COLORS, Fonts, height, width } from "../../assets/Theme";
import YoutubePlayer from 'react-native-youtube-iframe';
import { useRef } from "react";
import { StackHeader } from "../reusables/index";

const VideoDetails = ({ route, navigation }) => {
    const { data, videoDetails } = route.params;
    const ref = useRef(null);

    const viewVideo = (item) => {
        navigation.navigate("ViewVideoDetails", { data: item, videoDetails })
        ref.current?.scrollTo({ x: 0, y: 0, animated: true });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <StackHeader title={data?.videoId ? "Video Details" : "No Livestream"} goBack={() => navigation.goBack()} />
            {
                data?.videoId ? (
                    <>
                        <View>
                            <YoutubePlayer
                                height={220}
                                play={true}
                                videoId={data.videoId}
                            />
                        </View>
                        <ScrollView ref={ref}>
                            <View style={styles.sideContainer}>
                                <View>
                                    <Text style={styles.bold_headers}>{data.title}</Text>
                                    <Text style={{ fontFamily: Fonts.medium, color: "rgba(0, 0, 0, 0.5)" }}>{data.statistics.likeCount} like{data.statistics.likeCount >= 2 ? 's' : ''} | {data.statistics.viewCount} views</Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ color: COLORS.black, fontSize: 13, fontFamily: Fonts.medium }}>{data.description}</Text>
                                </View>
                            </View>
                            <View>
                                <View style={styles.sideContainer}>
                                    <View>
                                        <Text style={styles.bold_headers}>More videos</Text>
                                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                                            {
                                                videoDetails.filter(i => i.videoId !== data.videoId).map((item, index) => (
                                                    <TouchableOpacity onPress={() => viewVideo(item)} key={index}>
                                                        <View style={{ marginTop: 10 }} key={index}>
                                                            <Image source={{ uri: item.mediumThumbnailUrl }} style={{ width: (width - 40) / 2, height: 150, borderRadius: 10 }} />
                                                            <Text style={{ fontFamily: Fonts.semibold, color: "#000000", marginTop: 10, width: (width - 40) / 2 }}>{item?.title?.length > 35 ? `${item?.title?.slice(0, 35)}...` : item?.title}</Text>
                                                            <Text style={{ fontFamily: Fonts.medium, color: "rgba(0, 0, 0, 0.5)" }}>{item.statistics.likeCount} like{item.statistics.likeCount >= 2 ? 's' : ''} | {item.statistics.viewCount} views</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 50 }}>
                        <View>
                            <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: "#000000", textAlign: "center" }}>Oops! 😔</Text>
                            <Text style={{ fontFamily: Fonts.regular, color: "#000000" }}>No livestream yet, check back later.</Text>
                        </View>
                    </View>
                )
            }
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    sideContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        // paddingTop: 15,
    },
    bold_headers: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        color: "#000000",
        marginTop: 10
    },
    categoryheader: {
        color: "#272727",
        fontSize: 17,
        fontWeight: "500"
    },
    categoriesframe: {
        backgroundColor: "#DDDDDD",
        paddingTop: 20,
        paddingBottom: 20,
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    categoryplaceholder: {
        backgroundColor: "#3799F3",
        width: 60,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50

    }
})

export default VideoDetails