import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { COLORS, Fonts, height, width } from "../../assets/Theme";
import { GetAllAudios } from "../../services/media";
import { StackHeader } from "../reusables/index";
import Input from "../reusables/Input";
import { useSelector } from 'react-redux';

const AudioScreen = ({ navigation }) => {
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const [searchText, setSearchText] = useState("")
    const [categories, setCategories] = useState([]);
    const [allAudios, setAllAudios] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    useEffect(() => {
        if (userInfo?.userId) {
            getAllAudios();
        }
    }, [])

    const getAllAudios = async () => {
        setisLoading(true);
        try {
            let { data } = await GetAllAudios(churchInfo.tenantId);
            setisLoading(false);
            setAllAudios(data)
            const uniqueCategories = data.reduce((acc, obj) => {
                if (!acc.find(item => item.category === obj.category)) {
                    acc.push(obj);
                }
                return acc;
            }, []);
            const filtered = uniqueCategories.filter(i => i.category)
            setCategories(filtered)
        } catch (error) {
            setisLoading(false);
            console.log(error)
        }
    }

    const filteredMediaAudio = allAudios?.filter(item => (
        (searchText === '' || item?.name?.toLowerCase()?.includes(searchText.toLowerCase()))
        // Add more conditions as needed for other fields
    ));
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StackHeader title="Audios" goBack={() => navigation.goBack()} />
            <View style={{ backgroundColor: COLORS.white, paddingBottom: 20 }}>
                <View style={styles.searchForm}>
                    <Input placeholder="Search for audios" icon={'search'} onChangeText={setSearchText} value={searchText} />
                </View>
                {
                    categories.length > 0 ? (
                        <>
                            <View style={{ marginHorizontal: 15, marginTop: 20 }}>
                                <Text style={{ fontFamily: Fonts.bold, fontSize: 15, color: COLORS.black }}>Category</Text>
                            </View>
                            <View style={{ backgroundColor: "#F6F6F6", paddingHorizontal: 15, marginTop: 10, paddingVertical: 20 }}>
                                <FlatList
                                    data={categories}
                                    keyExtractor={(item, index) => index}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => navigation.navigate("AudioCategories", { category: item.category, allAudios })}>
                                            <Image source={{ uri: item.imagePath || "https://placeholder.com/68x68" }} style={{ width: 80, height: 80, borderRadius: 10 }} />
                                            <Text style={{ color: "#272727CC", fontSize: 11, fontWeight: 500, width: 80, marginTop: 5 }}>{item.category.length > 12 ? `${item.category.slice(0, 12)}...` : `${item.category}`}</Text>
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={{ columnGap: 15 }}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                />
                            </View>
                        </>
                    ) : null
                }
                {
                    isLoading ? (
                        <View style={{ height: height - 200, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size={25} color={COLORS.primary} />
                        </View>
                    ) : (
                        filteredMediaAudio.length > 0 ? (

                            <View style={{ backgroundColor: "#F6F6F6", padding: 15, marginTop: 25, height: 450, }}>
                                <Text style={{ fontFamily: Fonts.bold, fontSize: 15, color: COLORS.black, marginBottom: 10 }}>Recommended</Text>
                                <FlatList
                                    data={filteredMediaAudio}
                                    keyExtractor={(item, index) => index}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => navigation.navigate("AudioDetails", { id: item.id })}>
                                            <View style={{ width: (width / 2) - 30 }}>
                                                {
                                                    item.imagePath ? <Image source={{ uri: item.imagePath || "https://placeholder.com/68x68" }} style={{ width: (width / 2) - 30, height: 200, borderRadius: 10 }} resizeMode="cover" /> :  <Image source={require("../../assets/img/splash.jpg")} style={{ width: (width / 2) - 30, height: 200, borderRadius: 10 }} resizeMode="cover" />
                                                }
                                               
                                                <View style={{ marginTop: 10 }}>
                                                    <Text style={{ fontFamily: Fonts.bold, color: COLORS.black, fontSize: 12 }}>{item.name}</Text>
                                                    <Text style={{ fontFamily: Fonts.semibold, color: "#00000080", fontSize: 11 }}>{item.viewCount == 0 ? 'No views yet' : item.viewCount == 1 ? '1 View' : `${item.viewCount} view`}</Text>
                                                    {
                                                        item.isFree ? (
                                                            <Text style={{ fontFamily: Fonts.semibold, color: "#E27F06", fontSize: 11 }}>FREE</Text>
                                                        ) : (
                                                            <Text style={{ fontFamily: Fonts.semibold, color: "#124191", fontSize: 11 }}>{item.price}</Text>
                                                        )
                                                    }
                                                </View>
                                            </View>
                                            <Image source={require("../../assets/img/audio_pre.png")} style={{ position: 'absolute', top: '25%', left: '35%' }} />
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={{ rowGap: 15 }}
                                    numColumns={2}
                                    columnWrapperStyle={{ flex: 1, justifyContent: 'space-between' }}
                                />
                            </View>
                        ) : (
                            <View style={{ height: height - 200, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: Fonts.bold, fontSize: 15, color: COLORS.black, marginBottom: 10 }}>No audio yet</Text>
                            </View>
                        )
                    )
                }
            </View>
        </SafeAreaView>
    )
}

export default AudioScreen;

const styles = StyleSheet.create({
    searchForm: {
        marginHorizontal: 15,
        borderRadius: 10,
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center'
    }
})