import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import moment from 'moment';
import YoutubePlayer from 'react-native-youtube-iframe';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, Fonts, width } from '../../assets/Theme'

const DetailsScreen = ({ route }) => {
    const { data } = route.params;

    const [datas, setData] = useState([])

    const renderItem = ({ item, index, handlePress }) => (
        <TouchableOpacity onPress={() => { }} style={{ position: 'relative' }} key={index}>
            <Image source={{ uri: item.image }} height={140} width={140} resizeMode='cover' style={{ borderRadius: 10 }} />
            <Text style={{ fontFamily: Fonts.bold, fontSize: 11, color: COLORS.black, textAlign: 'center' }}>
                {item.title}
            </Text>
            <Text style={{ fontFamily: Fonts.light, textAlign: 'center', fontSize: 11, color: COLORS.black }}> {item.year} | 26 views </Text>
            <Image source={require("../../assets/img/play.png")} style={{ position: 'absolute', top: 50, left: '40%' }} />
        </TouchableOpacity>
    );

    const [playing, setPlaying] = useState(false);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ margin: 20 }}>
                <YoutubePlayer
                    height={180}
                    play={playing}
                    videoId={data.videoId}
                />
                <Text style={{ color: COLORS.black, fontFamily: Fonts.bold }}>{data?.title}</Text>
                <Text style={{ color: COLORS.black, fontFamily: Fonts.light, fontSize: 11 }}>{moment(data.publishedAt).format("Do MMM yyyy")} | {data.viewCount} views</Text>
            </View>
            <View style={{ marginHorizontal: 20, flexDirection: 'row', width: width - 40, justifyContent: 'space-around' }}>
                <TouchableOpacity style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: COLORS.primary, padding: 10, flexDirection: 'row', width: '33%' }}>
                    <Icon name={"thumb-up"} color={COLORS.white} size={20} />
                    <Text style={{ color: COLORS.white, fontFamily: Fonts.medium }}>{data.likeCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, padding: 10, flexDirection: 'row', width: '33%' }}>
                    <Icon name={"comment"} color={COLORS.white} size={20} />
                    <Text style={{ color: COLORS.white, fontFamily: Fonts.medium }}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20, backgroundColor: COLORS.primary, padding: 10, flexDirection: 'row', width: '33%' }}>
                    <Icon name={"share"} color={COLORS.white} size={20} />
                    <Text style={{ color: COLORS.white, fontFamily: Fonts.medium }}>0</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <>
                    <Text style={{ fontFamily: Fonts.black, color: COLORS.black, margin: 15 }}>
                        Similar Videos
                    </Text>

                    <View style={{ margin: 15 }}>
                        <FlatList
                            data={datas}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            numColumns={2}
                            columnWrapperStyle={{ flex: 1, justifyContent: 'space-around' }}
                        />
                    </View>

                    {/* post form */}
                    <View style={{ margin: 15 }}>
                        <Text style={{ color: COLORS.black, fontFamily: Fonts.medium }}>Add a comment</Text>
                        {/* <View style={{ height: 100, borderWidth: 1, borderColor: COLORS.gray, borderRadius: 20 }}>
                            <TextInput placeholder='Comment goes here' />
                        </View>

                        <TouchableOpacity style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 5, marginTop: 15 }}>
                            <Text style={{ color: COLORS.white, fontFamily: Fonts.medium, textAlign: 'center' }}>Post Comment</Text>
                        </TouchableOpacity> */}

                        <Text style={{ marginVertical: 20, fontFamily: Fonts.medium }}>All Comments (0)</Text>


                    </View>
                    <View style={{ backgroundColor: '#eee', paddingVertical: 20 }}>
                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Image source={{ uri: 'https://m.media-amazon.com/images/M/MV5BYjFkMTlkYWUtZWFhNy00M2FmLThiOTYtYTRiYjVlZWYxNmJkXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SY1000_CR0,0,666,1000_AL_.jpg' }} resizeMode='contain' height={60} borderRadius={40} width={60} />

                            <View >
                                <Text style={{ fontFamily: Fonts.black }}>James A</Text>
                                <Text style={{ fontFamily: Fonts.medium, fontSize: 12 }}>comment comment comment ....</Text>
                            </View>
                            <Text style={{ fontFamily: Fonts.light }}>3w</Text>
                        </View> */}
                        <Text style={{ fontFamily: Fonts.black }}>No Comment Yet</Text>
                    </View>
                    <View style={{ marginBottom: 100 }}></View>
                </>
            </ScrollView>
        </SafeAreaView>
    )
}

export default DetailsScreen

const styles = StyleSheet.create({})