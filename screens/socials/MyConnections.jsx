import { Text, SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { COLORS, Fonts } from "../../assets/Theme";
import { StackHeader } from "../reusables/index";
import { useSelector } from 'react-redux';
import { MessageConnection } from "../../assets/img/icons";
import Input from "../reusables/Input";
import { useEffect, useState } from "react";

const MyConnections = ({ navigation }) => {
    const connectedFriends = useSelector((state) => state.user.connectedFriends);
    const [searchText, setSearchText] = useState("")

    const filterConnections = connectedFriends.filter(item => (
        (searchText === '' || (item?.name?.toLowerCase().includes(searchText.toLowerCase())))
        // Add more conditions as needed for other fields
    ));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StackHeader title="My Connections" goBack={() => navigation.goBack()} />
            {/* <ScrollView> */}
                <View style={styles.sidecontainer}>
                    <Input placeholder={'Search'} icon="search" outlineStyle={{ borderRadius: 20, borderWidth: 1 }} value={searchText} onChangeText={setSearchText} />
                    <View style={{ marginTop: 20 }}>
                        {
                            filterConnections.length > 0 ? (
                                <FlatList
                                    data={filterConnections}
                                    keyExtractor={(item, index) => index}
                                    renderItem={({ item, index }) => (
                                        <View key={index}>
                                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 10 }}>
                                                <View style={{ flexDirection: 'row', gap: 10, alignItems: "center" }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item.id })}>
                                                        <View>
                                                            {
                                                                item.pictureUrl ? (
                                                                    <Image source={{ uri: item.pictureUrl }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                ) : (
                                                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 30, height: 30, borderRadius: 50 }} />
                                                                )
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item.id })}>
                                                        <View>
                                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 15, color: "rgba(31, 30, 30, 1)" }}>{item.name} {item.lastName ? item.lastName : ""}</Text>
                                                            <Text style={{ fontFamily: Fonts.regular, fontSize: 10 }}>{item.occupation}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <TouchableOpacity onPress={() => navigation.navigate("UserChat", { data: item.id, name: item.name })}>
                                                    <MessageConnection />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    showsVerticalScrollIndicator={true}
                                />
                            ) : (
                                <Text style={{ fontFamily: Fonts.medium, fontSize: 15, color: "rgba(31, 30, 30, 1)" }}>No connection yet</Text>
                            )
                        }
                    </View>
                </View>
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    sidecontainer: {
        paddingHorizontal: 15,
        marginTop: 15
    },
})

export default MyConnections;