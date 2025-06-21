import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack";
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigation, CommonActions } from "@react-navigation/native";
import LoginScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/SplashScreen'
import MediaScreen from '../screens/MediaScreen';
import StoreScreen from '../screens/StoreScreen';
import GiveScreen from '../screens/GiveScreen';
import MoreScreen from '../screens/MoreScreen';
import FeedDetailScreen from '../screens/FeedDetailScreen';
import { Fonts, height, Light, width } from '../assets/Theme';
import JoinChurch from '../screens/churchdetails/JoinChurch';
import ChurchProfiles from '../screens/churchdetails/ChurchProfile';
import OnboardTabs from '../screens/onboard/OnboardTabs';
import DetailsScreen from '../screens/media/DetailsScreen';
import HomeScreen, { HomeHeaders } from '../screens/HomeScreen';
import AllCelebrants from '../screens/celebrations/CelebrationList';
import { useState } from 'react';
import OnlineGive from '../screens/give/OnlineGive';
import GiveSummary from '../screens/give/GiveSummary';
import BankAccount from '../screens/give/BankAccount';
import { COLORS } from '../assets/Theme';
import SendGift from '../screens/celebrations/SendGift';
import CreatePost from '../screens/socials/CreatePost';
import Register from '../screens/auth/Register';
import VideoDetails from '../screens/media/VideoDetails';
import Profile from '../screens/profile/Profile';
import QRScannerScreen from '../screens/QRScannerScreen';
import RegisterEvent from '../screens/event/RegisterEvent';
import { TouchableRipple } from 'react-native-paper';
import { CartIcon, CloseIcon, Gift3, House, Media, ThreeDots } from '../assets/img/icons';
import TodayDevotional from '../screens/devotional/TodaysDevotional';
import DevotionLibrary from '../screens/devotional/DevotionalLibrary';
import SendCelebrantMessage from '../screens/celebrations/SendMessage';
import ManageProfile from '../screens/profile/ManageProfile';
import Verification from '../screens/onboard/VerifyCode';
import EventDetails from '../screens/event/SingleEvent';
import { NavigationModal, SwipeModal } from '../screens/reusables/Modal';
import HeaderTabs from '../screens/MainTabs';
import AudioScreen from '../screens/media/AudioScreen';
import AudioDetails from '../screens/media/AudioDetails';
import { navigationRef } from '../utils/navigationRef';
import AudioCategories from '../screens/media/AudioCategory';
import SocialFeeds from '../screens/socials/Feeds';
import { SocialTabs } from './SocialTabs';
import SocialFeedsDetails from '../screens/socials/SocialFeedsDetails';
import FullConnections from '../screens/socials/FullConnections';
import UserChat from '../screens/socials/UserChat';
import ConnectionProfile from '../screens/socials/UserProfile';
import DeleteAccountTerms from '../screens/profile/DeleteAccountTerms';
import ExternalUrlFrame from '../screens/ExternalUrlFrame';
import MyConnections from '../screens/socials/MyConnections';
import CustomStatusBar from '../screens/reusables/StatusBar';
import StoreHomePage from '../screens/store/StoreHomePage';
import PledgesAndDonation from '../screens/give/PledgesAndDonation';
import MyPledges from '../screens/Pledges/MyPledges';
import PledgeDetails from '../screens/Pledges/PledgeDetails';
import SuccessProfileUpdate from '../screens/profile/SuccessProfileUpdate';
import ForgotPassword from '../screens/auth/ForgotPassword';
import SuccessCheckin from '../screens/event/SuccessCheckin';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function StackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="First" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='details' component={DetailsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
function GiveStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Givedefault' component={GiveScreen} options={{ headerShown: false }} />
            <Stack.Screen name='GiveSummary' component={GiveSummary} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
function ProfileStackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name='QRScanner' component={QRScannerScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


export const AppTabs = () => {
    const [displayNavDialog, setDisplayNavDialog] = useState(false);
    return (
        <>

            <StatusBar backgroundColor={COLORS.primary} />
            <Tab.Navigator
                screenOptions={({ focused, route }) => ({
                    headerShown: false,
                    tabBarShowLabel: true,
                    tabBarStyle: {
                        shadowColor: 'black',
                        backgroundColor: '#FFFFFF',
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                        elevation: 10,
                        color: Light.black,
                        // height: 55
                    },
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarLabelStyle: {
                        marginBottom: 6,
                        fontSize: 12,
                        fontFamily: Fonts.medium
                    },
                    tabBarButton: (props) => <TouchableRipple rippleColor="rgba(0, 0, 0, .1)" {...props} />,
                    tabBarIconStyle: {
                        marginTop: 8
                    },
                    tabBarIcon: ({ focused }) => {
                        let colo = "";

                        if (route.name === 'Home') {
                            colo = focused ? COLORS.primary : "#999999";
                        } else if (route.name === 'Media') {
                            colo = focused ? COLORS.primary : "#808080";
                        } else if (route.name === 'Store') {
                            colo = focused ? COLORS.primary : "#808080";
                        } else if (route.name === 'Give') {
                            colo = focused ? COLORS.primary : "#808080";
                        } else if (route.name === 'More') {
                            colo = focused ? COLORS.primary : "#808080";
                        }
                        else if (route.name === 'ProfileStack') {
                            colo = focused ? COLORS.primary : "#808080";
                        }

                        return (
                            <View>
                                {
                                    route.name === "Home" ? (
                                        <House width={26} height={26} color={colo} />
                                    ) : route.name === "Media" ? (
                                        <Media width={24} height={24} color={colo} />
                                    ) : route.name === "Give" ? (
                                        <Gift3 width={24} height={24} color={colo} />
                                    ) : route.name === "More" ? (
                                        <ThreeDots color={colo} size={25} />
                                    ) : 
                                    // route.name === "Store" ? (
                                    //     <CartIcon color={colo} size={25} />
                                    // ) :
                                    null
                                }
                            </View>
                        )
                    }
                })}
            >
                <Tab.Screen name="Home" component={StackScreen} />
                <Tab.Screen name="Media" component={MediaScreen} />
                {/* <Tab.Screen name="Store" component={StoreHomePage} /> */}
                <Tab.Screen name="Give" component={GiveStackScreen} />
                <Tab.Screen name="More" component={MoreScreen}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault(); // Prevent default action
                            // openDrawer(); // Call your function to open the drawer
                            setDisplayNavDialog(true);
                        },
                    }} />
            </Tab.Navigator>

            <NavigationModal visible={displayNavDialog} closeModal={() => setDisplayNavDialog(false)} height="100%">
                <View style={styles.navcontentStyles}>
                    <MoreScreen closeNav={() => setDisplayNavDialog(false)} />
                </View>
            </NavigationModal>
        </>
    );
}


function AppRoute() {
    return (
        <>
        <CustomStatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
                    <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
                    <Stack.Screen name='First' component={OnboardTabs} options={{ headerShown: false }} />
                    <Stack.Screen name='Join' component={JoinChurch} options={{ headerShown: false }} />
                    <Stack.Screen name='ChurchProfile' component={ChurchProfiles} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                    <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false }} />
                    <Stack.Screen name="MainHeaderTabs" component={HeaderTabs} options={{ headerShown: false }}/>
                    <Stack.Screen name="Celebrants" component={AllCelebrants} options={{ headerShown: false }} />
                    <Stack.Screen name="SendGift" component={SendGift} options={{ headerShown: false }} />
                    <Stack.Screen name="SendCelebrantMessage" component={SendCelebrantMessage} options={{ headerShown: false }} />
                    <Stack.Screen name="CreatePost" component={CreatePost} options={{ headerShown: false }} />
                    <Stack.Screen name="ViewVideoDetails" component={VideoDetails} options={{ headerShown: false }} />
                    <Stack.Screen name='RegisterEvent' component={RegisterEvent} options={{ headerShown: false }} />
                    <Stack.Screen name='ProfileScreen' component={ProfileStackScreen} options={{ headerShown: false }} />
                    <Stack.Screen name='VerifyUser' component={Verification} options={{ headerShown: false }} />
                    <Stack.Screen name='EventDetails' component={EventDetails} options={{ headerShown: false }} />
                    <Stack.Screen name='TodayDevotional' component={TodayDevotional} options={{ headerShown: false }} />
                    <Stack.Screen name='DevotionalLibrary' component={DevotionLibrary} options={{ headerShown: false }} />
                    <Stack.Screen name='FeedsDetail' component={FeedDetailScreen} options={{ headerShown: false }} />
                    <Stack.Screen name='Onlingive' component={OnlineGive} options={{ headerShown: false }} />
                    <Stack.Screen name='BankAccount' component={BankAccount} options={{ headerShown: false }} />
                    <Stack.Screen name='AudioScreen' component={AudioScreen} options={{ headerShown: false }} />
                    <Stack.Screen name='AudioDetails' component={AudioDetails} options={{ headerShown: false }} />
                    <Stack.Screen name='AudioCategories' component={AudioCategories} options={{ headerShown: false }} />
                    <Stack.Screen name='ManageProfile' component={ManageProfile} options={{ headerShown: false }} />
                    <Stack.Screen name='SocialTabs' component={SocialTabs} options={{ headerShown: false }} />
                    <Stack.Screen name='SocialFeedDetails' component={SocialFeedsDetails} options={{ headerShown: false }} />
                    <Stack.Screen name='FullConnections' component={FullConnections} options={{ headerShown: false }} />
                    <Stack.Screen name='MyConnections' component={MyConnections} options={{ headerShown: false }} />
                    <Stack.Screen name='UserChat' component={UserChat} options={{ headerShown: false }} />
                    <Stack.Screen name='ConnectionProfile' component={ConnectionProfile} options={{ headerShown: false }} />
                    <Stack.Screen name='DeleteAccountTerms' component={DeleteAccountTerms} options={{ headerShown: false }} />
                    <Stack.Screen name='ExternalUrlFrame' component={ExternalUrlFrame} options={{ headerShown: false }} />
                    <Stack.Screen name='PledgesAndDonation' component={PledgesAndDonation} options={{ headerShown: false }} /> 
                    <Stack.Screen name='MyPledges' component={MyPledges} options={{ headerShown: false }} /> 
                    <Stack.Screen name='PledgeDetails' component={PledgeDetails} options={{ headerShown: false }} /> 
                    <Stack.Screen name='SuccessProfileUpdate' component={SuccessProfileUpdate} options={{ headerShown: false }} /> 
                    <Stack.Screen name='SuccessCheckin' component={SuccessCheckin} options={{ headerShown: false }} /> 
                </Stack.Navigator>
            </NavigationContainer>

        </>
    );
}

const styles = StyleSheet.create({
    footerIconStyle: {},
    footerMainButton: {
        position: 'absolute',
        top: -30,
        width: 65,
        height: 65,
        borderWidth: 4,
        borderColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '100%',
        backgroundColor: '#FF0000',
    },
    navcontentStyles: {
        backgroundColor: 'white',
        height: height,
        width: width / 1.3,
        // padding: 20,
    }
});

export default AppRoute