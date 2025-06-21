import { TabsProvider, Tabs, TabScreen, useTabIndex, useTabNavigation } from 'react-native-paper-tabs';
import { AppTabs, SocTab } from '../navigation/AppTabs';
import { View, StyleSheet, StatusBar, Text } from "react-native";
import { Button } from "react-native-paper";
import { COLORS, height, width } from '../assets/Theme';
import { StackHeader } from './reusables/index';
import { SocialTabs } from '../navigation/SocialTabs';
import { useEffect, useState } from 'react';
import { GetConnectedFriends } from '../services/social';
import { useSelector, useDispatch } from 'react-redux';
import ConnectionList from './socials/Connections';
import { userConnectedFriends } from '../redux/userSlice';
import NetworkConectivityStatus from './reusables/NetworkConnectivity';

function HeaderTabs({ navigation }) {
    const userInfo = useSelector((state) => state.user.userInfo);
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const [displayApp, setDisplayApp] = useState(true)
    const [displaySoc, setDisplaySoc] = useState(false)
    const [friends, setFriends] = useState([])
    const dispatch = useDispatch();

    const getConnectedFriends = async () => {
        try {
            let { data } = await GetConnectedFriends(userInfo.userId)
            console.log(data.length, 'friend')
            setFriends(data)
            dispatch(userConnectedFriends(data))
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getConnectedFriends();
    }, [churchInfo, userInfo])
    return (
        <>
            <NetworkConectivityStatus />
            <StackHeader title={'The Citizens Church'} newStack />
            <TabsProvider
                defaultIndex={0}
            // onChangeIndex={handleChangeIndex} optional
            >
                <Tabs
                    // uppercase={false} // true/false | default=true (on material v2) | labels are uppercase
                    // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
                    // iconPosition // leading, top | default=leading
                    //   style={{ backgroundColor: COLORS.primary }} // works the same as AppBar in react-native-paper
                    // dark={false} // works the same as AppBar in react-native-paper
                    theme={{ colors: { surface: COLORS.primary, onSurface: 'white', onSurfaceVariant: 'white', primary: 'white' } }} // works the same as AppBar in react-native-paper
                    // mode="scrollable" // fixed, scrollable | default=fixed
                    // showLeadingSpace={true} //  (default=true) show leading space in scrollable tabs inside the header
                    disableSwipe={true} // (default=false) disable swipe to left/right gestures
                >
                    <TabScreen
                        label="Faith"
                        onPress={() => {
                            setDisplaySoc(false)
                            setDisplayApp(true)
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            {
                                displayApp ? (
                                    <AppTabs />
                                ) : null
                            }
                        </View>
                    </TabScreen>
                    <TabScreen
                        label="Socials"
                        // style={{ borderColor: 'red', borderWidth: 1 }}
                        // icon="bag-suitcase"
                        // optional props
                        // badge={true} // only show indicator
                        // badge="text"
                        // badge={1}
                        // onPressIn={() => {
                        //   console.log('onPressIn explore');
                        // }}
                        onPress={() => {
                            setDisplaySoc(true)
                            setDisplayApp(false)
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            {
                                displaySoc ?
                                    <SocialTabs />
                                    // !userInfo?.userId ? (
                                    //     <NoUserLoggedIn navigation={navigation} />
                                    // ) : friends.length > 0 ?
                                    //     <SocialTabs />
                                    //     : <ConnectionList isNew={true} />
                                    : null
                            }
                        </View>
                    </TabScreen>
                </Tabs>
            </TabsProvider>
        </>
    )
}

const NoUserLoggedIn = ({ navigation }) => (
    <View style={styles.parent}>
        <Button
            icon="login"
            mode="contained"
            buttonColor={COLORS.primary}
            textColor="#FFFFFF"
            style={{ width: (width / 2) - 30 }}
            onPress={() => navigation.navigate("Login")}>
            Login
        </Button>
        <Button
            icon="logout"
            mode="outlined"
            textColor={COLORS.primary}
            style={{ width: (width / 2) - 30 }}
            onPress={() => navigation.navigate("Register")}>
            Signup
        </Button>
    </View>
)

const styles = StyleSheet.create({
    parent: {
        flexDirection: "row",
        gap: 10,
        height: height - 200,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HeaderTabs;

