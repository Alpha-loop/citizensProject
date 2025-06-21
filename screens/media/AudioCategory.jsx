import { useEffect, useState } from "react";
import { Text, SafeAreaView, View, FlatList, TouchableOpacity, Image } from "react-native"
import { COLORS, Fonts, width } from "../../assets/Theme";
import { StackHeader } from "../reusables/index";

const AudioCategories = ({ navigation, route }) => {
    const { category, allAudios } = route.params;
    const [filteredCategory, setFilteredCategory] = useState([])

    useEffect(() => {
        const data = allAudios.filter(i => i.category == category)
        setFilteredCategory(data)
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StackHeader title="Category" goBack={() => navigation.goBack()} />
            <View style={{ backgroundColor: COLORS.white, paddingBottom: 20 }}>
                <View style={{ paddingTop: 15, paddingHorizontal: 15, marginTop: 10 }}>
                    <Text style={{ fontFamily: Fonts.bold, fontSize: 15, color: COLORS.black, marginBottom: 10 }}>{category}</Text>
                </View>
                <View style={{ backgroundColor: "#F6F6F6", padding: 15 }}>
                    <FlatList
                        data={filteredCategory}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate("AudioDetails", { data: item })}>
                                <View style={{ width: (width / 2) - 30 }}>
                                    <Image source={{ uri: item.imagePath || "https://placeholder.com/68x68" }} style={{ width: (width / 2) - 30, height: 200, borderRadius: 10 }} resizeMode="cover" />
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontWeight: 700, color: COLORS.black, fontSize: 12 }}>{item.name}</Text>
                                        <Text style={{ fontWeight: 500, color: "#00000080", fontSize: 11 }}>{item.viewCount == 0 ? 'No views yet' : item.viewCount == 1 ? '1 View' : `${item.viewCount} view`}</Text>
                                        {
                                            item.isFree ? (
                                                <Text style={{ fontWeight: 700, color: "#E27F06", fontSize: 11 }}>FREE</Text>
                                            ) : (
                                                <Text style={{ fontWeight: 700, color: "#124191", fontSize: 11 }}>{item.price}</Text>
                                            )
                                        }
                                    </View>
                                </View>
                                <Image source={require("../../assets/img/audio_pre.png")} style={{ position: 'absolute', top: '35%', left: '35%' }} />
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ rowGap: 15 }}
                        numColumns={2}
                        columnWrapperStyle={{ flex: 1, justifyContent: 'space-between' }}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AudioCategories;