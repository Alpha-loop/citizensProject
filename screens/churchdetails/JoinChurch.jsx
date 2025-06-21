import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, Fonts, height } from '../../assets/Theme'
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { TextInput } from 'react-native-gesture-handler';
import { Onboard } from '../../services/service';
import { StackHeader } from '../reusables/index';
import Input from '../reusables/Input';

const JoinChurch = ({ navigation }) => {
    const [churchData, setChurchData] = useState([])
    const [churchName, setChurchName] = useState("")
    const [churchLocation, setChurchLocation] = useState("")

    useEffect(() => {
        getChurches();
    }, [])

    const [loading, setLoading] = useState(false)
    const getChurches = async () => {
        setLoading(true)
        await Onboard().then((response) => {
            console.log(response.data)
            setChurchData(response.data)
        }).catch(err => console.log(err))
            .finally(() => setLoading(false))
    }

    const filteredChurchData = churchData?.filter(item => (
        (churchName === '' || item.churchName?.toLowerCase().includes(churchName.toLowerCase())) &&
        (churchLocation === '' || item.churchAddress?.toLowerCase().includes(churchLocation.toLowerCase()))
        // Add more conditions as needed for other fields
    ));

    if (loading) {
        return (
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: height }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        )
    }

    const goBack = () => {
        navigation.goBack();
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(223, 239, 255, 0.34)' }}>
            <StackHeader goBack={goBack} title="Join a church" />
            <View style={{ backgroundColor: COLORS.white, paddingBottom: 20 }}>
                {/* <View style={styles.searchForm}>
                    <Icon name={"search"} color={'#eee'} size={30} />
                    <TextInput placeholder='Search for a church' onChangeText={setChurchName} value={churchName} style={{ width: "100%" }} />
                </View> */}
                <View style={styles.searchForm}>
                    <Input placeholder="Search for a church" icon="search" onChangeText={setChurchName} value={churchName} />
                </View>
                <View style={{ ...styles.searchForm, marginTop: 20 }}>
                    <Input placeholder="Location" icon="location-on" onChangeText={setChurchLocation} value={churchLocation} />
                </View>
                {/* <View style={styles.searchForm}>
                    <Icon name={"location-on"} color={'#eee'} size={30} />
                    <TextInput placeholder='Location' onChangeText={setChurchLocation} value={churchLocation} style={{ width: "100%" }} />
                </View> */}

                {/* <TouchableOpacity style={{ marginVertical: 15, marginHorizontal: 20, borderWidth: 1, borderColor: COLORS.black, padding: 10, borderRadius: 15 }}>
                    <Text style={{ fontFamily: Fonts.medium, color: COLORS.black, textAlign: 'center' }}>Search Church</Text>
                </TouchableOpacity> */}
            </View>
            <Text style={{ fontFamily: Fonts.medium, color: COLORS.black, fontSize: 12, marginHorizontal: 20, marginVertical: 10 }}>Location Based Suggestions</Text>

            {/* results */}
            <ScrollView>
                <View style={{ flexDirection: 'row', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', width: '100%', paddingHorizontal: 16 }}>
                    {filteredChurchData.length > 0 ? (filteredChurchData?.map((item, index) => (
                        <TouchableOpacity
                            style={styles.churchCards}
                            key={index}
                            onPress={() => navigation.navigate("ChurchProfile", { data: item })}
                        >
                            <Image source={{ uri: item.churchLogo || 'https://placeholder.com/68x68' }} style={{ height: 68, width: 68, alignSelf: 'center' }} />
                            <Text style={{ fontSize: 11, color: COLORS.black, textAlign: 'center' }}>{item?.churchName.length > 25 ? `${item.churchName.slice(0, 25)}...` : item.churchName}</Text>
                        </TouchableOpacity>
                    ))) : (
                        churchData?.map((item, index) => (
                            <TouchableOpacity style={{ backgroundColor: COLORS.white, padding: 5, width: '30%', borderRadius: 10, marginTop: 10 }} key={index} onPress={() => navigation.navigate("ChurchProfile", { data: item })}>
                                <Image source={{ uri: item.churchLogo || 'https://placeholder.com/68x68' }} style={{ height: 68, width: 68, alignSelf: 'center' }} />
                                <Text style={{ fontSize: 11, color: COLORS.black, textAlign: 'center' }}>{item.churchName}</Text>
                            </TouchableOpacity>
                        ))
                    )}


                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default JoinChurch

const styles = StyleSheet.create({
    searchForm: {
        // borderWidth: 1,
        // borderColor: '#eee',
        marginHorizontal: 15,
        marginTop: 30
        // paddingHorizontal: 15,
        // borderRadius: 10,
        // flexDirection: 'row',
        // marginTop: 20,
        // alignItems: 'center'
    },
    churchCards: {
        backgroundColor: COLORS.white,
        padding: 5,
        width: '30%',
        borderRadius: 10,
        marginTop: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 5
    }
})