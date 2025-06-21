import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, Fonts, height, width } from '../assets/Theme'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ChurchProfile, YouTubeChannelVideoDetails, YouTubeChannelVideoIds } from '../services/dashboard';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { StackHeader } from './reusables/index';
import Input from './reusables/Input';
import { AudioMediaIcon, VideoMediaIcon } from '../assets/img/icons';
import { GetAllAudios } from '../services/media';
import dateFormatter from '../utils/dateFormatter';

const MediaScreen = ({ navigation }) => {
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const churchMedia = useSelector((state) => state.user.churchMedia);
    const [searchText, setSearchText] = useState("")
    const [allAudios, setAllAudios] = useState([])
    const [mergedMedia, setMergedMedia] = useState([])

    useEffect(() => {
        getAllAudios();
    }, [churchInfo])
    useEffect(() => {
        if (allAudios.length > 0) {
            mergeMedia()
        }
    }, [churchInfo, allAudios])


    const renderItem = (item, index) => (
        <View key={index}>
            {
                item.typeMedia === 'audio' ? (
                    <TouchableOpacity onPress={() => navigation.navigate("AudioDetails", { id: item.id })}>
                        <ImageBackground source={{ uri: item.imagePath || "https://placeholder.com/68x68" }} style={{ height: 130, width: (width / 2) - 20, borderRadius: 10, overflow: 'hidden' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <Image source={require('../assets/img/audio_pre.png')} style={{ width: 40, height: 40 }} />
                            </View>
                        </ImageBackground>
                        <Text style={{ fontFamily: Fonts.bold, fontSize: 12, color: COLORS.black, marginTop: 5 }}>
                            {item.title ? item.title?.length > 20 ? `${item.title?.slice(0, 20)}...` : `${item.title}` : "No title"}
                        </Text>
                        <Text style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.6)" }}> {dateFormatter.relativeDate(item.dateAdded)} | {item?.viewCount} views </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => navigation.navigate("ViewVideoDetails", { data: item, videoDetails: churchMedia })} style={{ position: 'relative', marginBottom: 15 }}>
                        <ImageBackground source={{ uri: item.highThumbnailUrl }} style={{ height: 130, width: (width / 2) - 20, borderRadius: 10, overflow: 'hidden' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <Image source={require('../assets/img/play.png')} style={{ width: 40, height: 40 }} />
                            </View>
                        </ImageBackground>
                        <Text style={{ fontFamily: Fonts.bold, fontSize: 12, color: COLORS.black, marginTop: 5 }}>
                            {item.title ? item.title?.length > 20 ? `${item.title?.slice(0, 20)}...` : `${item.title}` : "No title"}
                        </Text>
                        <Text style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.6)" }}> {dateFormatter.relativeDate(item.publishedAt)} | {item?.statistics?.viewCount} views </Text>
                    </TouchableOpacity>
                )
            }
        </View>
    );

    const renderSermonVideos = ({ item, index }) => (
        <TouchableOpacity onPress={() => navigation.navigate("ViewVideoDetails", { data: item, videoDetails: churchMedia })} style={{ position: 'relative', marginBottom: 15 }}>
            <ImageBackground source={{ uri: item.highThumbnailUrl }} style={{ height: 120, width: 210, borderRadius: 10, overflow: 'hidden' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <Image source={require('../assets/img/play.png')} style={{ width: 40, height: 40 }} />
                </View>
            </ImageBackground>
            <Text style={{ color: "black", fontWeight: 600, fontSize: 13, marginTop: 3, width: 210 }}>{item.title?.length > 30 ? `${item.title.substr(0, 30)}...` : item.title}</Text>
            <View style={{ flexDirection: "row", gap: 15, alignItems: "center" }}>
                <Text style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.6)" }}> {moment(item.publishedAt.split("T")[0].replaceAll("-", ""), "YYYYMMDD").fromNow()} | {item?.statistics?.viewCount} views </Text>
            </View>
        </TouchableOpacity>
    );


    const filteredMediaVideos = mergedMedia.filter(item => (
        (searchText === '' || (item?.title?.toLowerCase().includes(searchText.toLowerCase())))
        // : (searchText === '' || item?.title?.toLowerCase().includes(searchText.toLowerCase()))
        // Add more conditions as needed for other fields
    ));

    const getAllAudios = async () => {
        try {
            let { data } = await GetAllAudios(churchInfo.tenantId);
            setAllAudios(data)
        } catch (error) {
            console.log(error)
        }
    }

    // Function to shuffle an array using Fisher-Yates algorithm
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const mergeMedia = () => {
        let mediacopy = [...churchMedia]
        let arr1 = mediacopy.length > 0 ? mediacopy.map(j => {
            return j
        }) : null;

        let arr2 = allAudios.length > 0 ? allAudios.map(i => {
            i.title = i.name
            i.typeMedia = 'audio'
            return i
        }) : null

        if (arr1 && arr1.length) {
            shuffleArray(arr1);
        } // Shuffle arr1

        if (arr2 && arr2.length > 0) {
            shuffleArray(arr2); // Shuffle arr2
        }

        if (!arr1 || !arr2) return;
        let arr3 = [];
        let index1 = 0;
        let index2 = 0;

        while (index1 < arr1.length || index2 < arr2.length) {
            if (Math.random() < 0.5 && index1 < arr1.length) {
                arr3.push(arr1[index1]);
                index1++;
            } else if (index2 < arr2.length) {
                arr3.push(arr2[index2]);
                index2++;
            }
        }
        setMergedMedia(arr3)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, }}>
            <ScrollView>
                <View style={{ backgroundColor: COLORS.white, paddingBottom: 20 }}>
                    <View style={styles.searchForm}>
                        <Input placeholder="Search media" icon={'search'} onChangeText={setSearchText} value={searchText} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15, marginTop: 5 }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: 'center', }} onPress={() => navigation.navigate("ViewVideoDetails", { data: churchMedia[0], videoDetails: churchMedia })}>
                            <View style={{ flexDirection: "row", alignItems: 'center', gap: 5, justifyContent: "center", backgroundColor: "#B2D4ED", borderWidth: 1, borderRadius: 10, borderColor: "#0000001A", paddingVertical: 8, width: (width / 2) - 20 }}>
                                <VideoMediaIcon />
                                <Text>Videos</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: 'center', }} onPress={() => navigation.navigate("AudioScreen")}>
                            <View style={{ flexDirection: "row", alignItems: 'center', gap: 5, justifyContent: "center", backgroundColor: "#B2D4ED", borderWidth: 1, borderRadius: 10, borderColor: "#0000001A", paddingVertical: 8, width: (width / 2) - 20 }}>
                                <AudioMediaIcon />
                                <Text>Audios</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    searchText === "" ? (
                        <View style={{ marginHorizontal: 15, }}>
                            {
                                churchMedia && churchMedia.length > 0 ? (
                                    <>
                                    {
                                        allAudios?.length > 0 ? (
                                            <FlatList
                                                data={churchMedia}
                                                keyExtractor={(item, index) => item.videoId}
                                                renderItem={renderSermonVideos}
                                                contentContainerStyle={{ columnGap: 15 }}
                                                showsHorizontalScrollIndicator={false}
                                                horizontal
                                            />
                                        ) : (
                                            <View style={{ flexDirection: "row", justifyContent: 'space-between', flexWrap: "wrap", gap: 10 }}>
                                                {churchMedia.map(renderItem)}
                                            </View>
                                        )
                                    }
                                    </>

                                ) : (
                                    <Text>No media video to display yet</Text>
                                )
                            }
                        </View>
                    ) : null
                }
                <View style={{ paddingHorizontal: 15, backgroundColor: "#f7f7f7", marginBottom: 150 }}>
                    {
                        filteredMediaVideos && filteredMediaVideos.length > 0 ? (
                            <>
                                <Text style={{ marginTop: 15, fontFamily: Fonts.bold, fontSize: 15, color: COLORS.black, marginBottom: 10 }}>{searchText ? "Searched result" : "Trending in Media"}</Text>
                                <View style={{ flexDirection: "row", justifyContent: 'space-between', flexWrap: "wrap", gap: 10 }}>
                                    {filteredMediaVideos.map(renderItem)}
                                </View>
                            </>
                        ) : null
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MediaScreen

const styles = StyleSheet.create({
    searchForm: {
        marginHorizontal: 15,
        borderRadius: 10,
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center'
    }
})