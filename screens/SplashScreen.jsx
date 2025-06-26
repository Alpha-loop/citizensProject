import { StyleSheet, Text, View, SafeAreaView, Image, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect } from 'react'
// import Icon from 'react-native-vector-icons/FontAwesom e';
import { COLORS } from '../assets/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout, setChurch } from '../redux/userSlice';
import { login } from '../redux/userSlice'
import { setUserAuthToken } from '../backendapi/index';
import { useIsFocused } from "@react-navigation/native";
import usePushNotification from '../utils/usePushNotification';

const logo = require("../assets/img/TCC_logo.png");

const SplashScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            fetchData()
        }
    }, [isFocused])
    const { subscribeTopic } = usePushNotification();

    const isDateTimeExpired = (dateTimeString) => {
        // Parse the provided date-time string
        const providedDateTime = new Date(dateTimeString);

        // Get the current date-time
        const currentDateTime = new Date();

        // Compare the provided date-time with the current date-time
        return currentDateTime > providedDateTime;
    }



    const logOut = async () => {
        await AsyncStorage.removeItem("user");
        dispatch(logout());
        navigation.navigate("Login");
    }

    const fetchData = async () => {
        try {
            const value = await AsyncStorage.getItem("church")
            if (value) {
                const parsedChurchInfo = JSON.parse(value)

                // Subscribe to push notification topics
                const mediaTopic = `media${parsedChurchInfo.tenantId}`
                const feedTopic = `feed${parsedChurchInfo.tenantId}`
                subscribeTopic(mediaTopic);
                subscribeTopic(feedTopic);

                // Save churchInfo to redux state
                dispatch(setChurch(parsedChurchInfo))

                // Open deep link if available
                try {
                    const url = await Linking.getInitialURL()
                        if (url) {
                            const route = url?.replace(/.*?:\/\//g, "");
                            const id = route.split('/').pop()
                            if (route.includes('feeddetail')) {
                                navigation.navigate('FeedsDetail', { id });
                            }
                            // Add other unique naviation screens here
                        } else {
                            const user = await AsyncStorage.getItem("user")
                            if (user) {
                                // if user exist check if its token has expired
                                if (isDateTimeExpired(user.expiryTime)) {
                                    // logout out user
                                    setTimeout(() => {
                                        logOut()
                                    }, 3000);
                                    return;
                                }
                                const userInfo = JSON.parse(user)
                                dispatch(login(userInfo))
                                setUserAuthToken(userInfo.token)
                                setTimeout(() => {
                                    navigation.navigate("MainHeaderTabs")
                                }, 3000);
                            } else {
                                setTimeout(() => {
                                    navigation.navigate("Login")
                                }, 3000);
                            }
                        }
                } catch(err) {
                    console.log(err, "Unable to open url")
                }
            } else {
                setTimeout(() => {
                    navigation.navigate("First")
                }, 3000);
            }
            // setData(JSON.parse(value) || initialValue)
        } catch (error) {
            console.error(`useAsyncStorage getItem} error:`, error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ alignItems: 'center', height: '100%' }}>
                <Image 
                    source={logo} 
                    style={{ 
                        position: 'absolute', 
                        top: '20%',
                        width: '80%',
                        height: undefined,
                        aspectRatio: 1 
                    }} 
                    resizeMode="contain"
                />
                <ActivityIndicator size="large" color={COLORS.primary} style={{ position: 'absolute', bottom: '20%' }} />
            </View>

        </SafeAreaView>
    )
}

export default SplashScreen

const styles = StyleSheet.create({})