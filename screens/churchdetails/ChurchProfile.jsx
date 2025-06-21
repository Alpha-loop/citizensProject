import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, Linking, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, Fonts, height, Light, width } from '../../assets/Theme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChurchProfile } from '../../services/dashboard';
import { useDispatch } from 'react-redux';
import { setChurch, login } from '../../redux/userSlice';
import { StackHeader } from '../reusables/index';
import { TouchableRipple } from "react-native-paper";
import { setUserAuthToken } from '../../backendapi/index';
import usePushNotification from '../../utils/usePushNotification';

const ChurchProfiles = ({ navigation, route }) => {
    const { data } = route.params;
    const dispatch = useDispatch()
    const { subscribeTopic } = usePushNotification();
    // const tabs = fullProfile?.customAbouts?.length > 0 ? ['Pastors'].concat(fullProfile?.customAbouts.map(i => i.title)) : []

    useEffect(() => {
        getChurchProfile()
    }, [])

    const [services, setServices] = useState([])
    const [churchAbout, setChurchAbout] = useState([])
    const [churchPastors, setChurchPastors] = useState([])
    const [churchLocation, setchurchLocation] = useState([])
    const [websiteUrl, setWebsiteUrl] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const getChurchProfile = async () => {
        setIsLoading(true)
        try {
            let { data } = await ChurchProfile(datas.tenantId);
            console.log(data.returnObject.churchBranches, "churchBranches");
            setchurchLocation(data.returnObject.churchBranches)
            setChurchAbout(data.returnObject.customAbouts)
            setChurchPastors(data.returnObject.pastors)
            setWebsiteUrl(data.returnObject.websiteUrl)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    const menus = churchAbout?.length > 0 ? ['Pastors', 'Locations'].concat(churchAbout?.map(i => i.title)) : []
    const [selectedTab, setSelectedTab] = useState('Pastors')
    const [datas, setDatas] = useState(data)

    const tabData = churchAbout?.length > 0 ? churchAbout?.find(i => i.title === selectedTab) : "";

    const handleSaveChurch = async (item) => {
        console.log(item)
        try {
            await AsyncStorage.setItem("church", JSON.stringify(item))

            // Subscribe to push notification topics
            const mediaTopic = `media${item.tenantId}`
            const feedTopic = `feed${item.tenantId}`
            subscribeTopic(mediaTopic);
            subscribeTopic(feedTopic);
        } catch (error) {
            console.error(`useAsyncStorage setItem error:`, error)
        }

        // Save church details to state
        dispatch(setChurch(item))

        // Check if user is already logged in
        const user = await AsyncStorage.getItem("user")
        if (user) {
            const userInfo = JSON.parse(user)
            dispatch(login(userInfo))
            setUserAuthToken(userInfo.token)
            setTimeout(() => {
                navigation.navigate("MainHeaderTabs")
            }, 500);
        } else {
            setTimeout(() => {
                navigation.navigate("Login")
            }, 500);

        }
    }

    const goBack = () => {
        navigation.goBack();
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ backgroundColor: COLORS.primary, height: 50 }}>
                <StackHeader goBack={goBack} title="Church Profile" />
            </View>

            <View style={{ marginVertical: 20, width: '40%', alignSelf: 'center' }}>
                <Image source={{ uri: data.churchLogo || "https://placeholder.com/68x68" }} resizeMode='contain' height={100} />
                <Text style={{ color: Light.textColor, fontFamily: Fonts.medium, textAlign: 'center', marginTop: 5 }}>{data?.churchName}</Text>
            </View>

            {
                isLoading ? (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 400 }}>
                        <ActivityIndicator color={COLORS.primary} size={25} />
                    </View>
                ) : (
                    <>

                        {/* tabs */}
                        <View style={{ height: 45, flexDirection: 'row', backgroundColor: 'rgba(223, 239, 255, 0.2)', alignItems: "center" }}>
                            <FlatList
                                data={menus}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity key={index} style={styles.menuTab(selectedTab, item)} onPress={() => setSelectedTab(item)}>
                                        <Text style={styles.menuText(selectedTab, item)}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                // contentContainerStyle={{ columnGap:  }}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                            />
                            {/* {menus?.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuTab(selectedTab, item)} onPress={() => setSelectedTab(item)}>
                        <Text style={styles.menuText(selectedTab, item)}>{item}</Text>
                    </TouchableOpacity>
                ))} */}
                        </View>

                        {/* content */}
                        {tabData && (
                            <View>
                                <View style={{ margin: 15 }}>
                                    <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19 }}>
                                        {tabData.details}
                                    </Text>
                                </View>
                            </View>)
                        }
                        {selectedTab.toLowerCase() === 'pastors' && (
                            <View style={{ paddingBottom: 340 }}>
                                <View style={{ paddingHorizontal: 15 }}>
                                    {
                                        churchPastors.length > 0 ? (
                                            <FlatList
                                                data={churchPastors}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item, index }) => (
                                                    <View key={index}>
                                                        <Image source={{ uri: item.photoUrl || "https://placeholder.com/68x68" }} resizeMode='cover' style={{ height: 170, width: (width / 2) - 25, marginTop: 20, borderRadius: 10 }} />
                                                        <Text style={{ fontFamily: Fonts.bold, color: COLORS.black, marginTop: 10, fontSize: 11 }}>{item.name}</Text>
                                                    </View>
                                                )}
                                                numColumns={2}
                                                columnWrapperStyle={{ flex: 1, justifyContent: 'space-between' }}
                                            />
                                        ) : (
                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19, marginTop: 10 }}>No pastors yet</Text>
                                        )
                                    }
                                </View>
                            </View>)}
                        {selectedTab.toLowerCase() === 'locations' && (
                            <View style={{ paddingBottom: 340 }}>
                                <View style={{ paddingHorizontal: 15 }}>
                                    {
                                        churchLocation.length > 0 ? (
                                            <FlatList
                                                data={churchLocation}
                                                keyExtractor={(item, index) => index.toString()}
                                                renderItem={({ item, index }) => (
                                                    <View style={{ backgroundColor: "#D9D9D933", borderColor: "#0000001A", borderWidth: 1, marginTop: 20, padding: 10 }} key={index}>
                                                        <Text style={{ fontFamily: Fonts.bold, fontSize: 13, color: COLORS.black, lineHeight: 19, marginTop: 10 }}>{item.branchName}</Text>
                                                        <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19, marginTop: 10 }}>{item.address}</Text>
                                                    </View>
                                                )}
                                            />
                                        ) : (
                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19, marginTop: 10 }}>No branches yet</Text>
                                        )
                                    }
                                </View>
                            </View>)}
                        <TouchableRipple rippleColor="#eee" style={{ backgroundColor: COLORS.primary, borderRadius: 15, padding: 13, position: 'absolute', bottom: 20, width: width - 20, alignSelf: 'center' }} onPress={() => handleSaveChurch(data)}>
                            <Text style={{ textAlign: 'center', color: COLORS.white }}>This is my church</Text>
                        </TouchableRipple>

                    </>
                )
            }
        </SafeAreaView>
    )
}

export default ChurchProfiles

const styles = StyleSheet.create({
    menuTab: (selectedTab, itemTab) => ({
        backgroundColor: "transparent",
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginHorizontal: 6,
        borderBottomWidth: 2,
        borderBottomColor: selectedTab == itemTab ? COLORS.primary : "transparent",
        transition: "all .5 ease-in-out"
    }),
    menuText: (selectedTab, itemTab) => ({
        fontFamily: Fonts.medium,
        textAlign: 'center',
        alignItems: 'center',
        fontSize: selectedTab == itemTab ? 17 : 13,
        fontWeight: selectedTab == itemTab ? 700 : 600,
        color: selectedTab == itemTab ? COLORS.primary : "rgba(0,0,0,.8)"
    })
})