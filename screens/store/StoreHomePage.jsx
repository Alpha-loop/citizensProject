import { ScrollView, StyleSheet, Text, View, SafeAreaView, Image, FlatList } from "react-native";
import { COLORS, Fonts } from "../../assets/Theme";
import { useState } from "react";
import Input from "../reusables/Input";
import { StoreAudioIcon, StoreBookIcon, StoreVideoIcon } from "../../assets/img/icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const StoreHomePage = () => {
    const [searchText, setSearchText] = useState("")
    const list = [1, 2, 3, 4, 5, 6]
    const categorybutton = [
        { name: 'Video', icon: 'video' },
        { name: 'Audio', icon: 'audio' },
        { name: 'Book', icon: 'book' },
    ]
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, }}>
            <ScrollView>
                <View style={styles.sideContainer}>
                    <View style={styles.searchForm}>
                        <Input placeholder="Search for videos, audios, books..." icon={'search'} onChangeText={setSearchText} value={searchText} />
                    </View>
                    <View style={styles.herocontainer}>
                        <FlatList
                            data={list}
                            renderItem={({ item, index }) => (
                                <Image source={require("../../assets/img/storehero.png")} resizeMode="contain" />
                            )}
                            keyExtractor={(item, index) => index}
                            contentContainerStyle={{ columnGap: 7 }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    <View>
                        <Text style={styles.categoryheader}>Category</Text>
                        <View style={styles.categorycontainer}>
                            {
                                categorybutton.map(item => (
                                    <TouchableOpacity >
                                        <View style={styles.categorybutton}>
                                            {
                                                item.icon === 'video' ? 
                                                    <StoreVideoIcon /> :
                                                    item.icon === 'audio' ?
                                                        <StoreAudioIcon /> :
                                                            <StoreBookIcon />
                                                
                                            }
                                            <Text style={styles.categorybuttontext}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15,
        paddingBottom: 20
    },
    searchForm: {
        borderRadius: 10,
        flexDirection: 'row',
    },
    herocontainer: {
        marginTop: 15
    },
    categoryheader: {
        fontFamily: Fonts.semibold,
        marginTop: 20,
        color: "#000000"
    },
    categorycontainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        gap: 10
    },
    categorybutton: {
        borderWidth: 1,
        borderColor: "#0000001A",
        borderRadius: 10,
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 8,
        gap: 8,
        alignItems: "center"
    },
    categorybuttontext: {
        color: "#51618C",
        fontFamily: Fonts.medium
    }
})

export default StoreHomePage;