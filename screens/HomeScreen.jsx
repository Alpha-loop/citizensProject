import { StyleSheet, Text, Image, View, Linking, FlatList, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Share } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Like, Unlike } from '../assets/img/like'
import { Comment } from '../assets/img/comment'
import { BarcodeIcon, ChurchIcon, CloseIcon, Gift, GroupsIcon, HandsPraying, HeartIcon, InviteIcon, MapPin, Megaphone, MegaphoneII, NoteIcon, PersonIcon, PhoneIcon, PlaneIcon, PottedPlant, QRCodeIcon, Search, ShareIconII, StreamIcon, ThreeDots, UserPlus } from '../assets/img/icons';
import { useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from 'react-redux';
import { ChurchFeeds, YouTubeChannelVideoDetails, YouTubeChannelVideoIds, ChurchProfile, GetAllCelebrants } from '../services/dashboard';
import YoutubePlayer from 'react-native-youtube-iframe';
import { COLORS, Fonts, width } from '../assets/Theme';
import AutoHeightImage from 'react-native-auto-height-image';
import { SwipeModal } from './reusables/Modal';
import { Button } from "react-native-paper";
import LinearGradient from 'react-native-linear-gradient';
import UpcomingEvent from './event/UpcomingEvent';
import dateFormatter from '../utils/dateFormatter';
import { churchYoutubeMedia } from '../redux/userSlice';
import { LikePost } from '../services/social';


const TrendingMessages = ({ navigation, data, videoDetails }) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate("ViewVideoDetails", { data, videoDetails })}>
            <View>
                {
                    data.mediumThumbnailUrl ? (
                        <Image source={{ uri: data.mediumThumbnailUrl }} resizeMode="cover" style={{ width: 130, height: 130, borderRadius: 5 }} />
                    ) : null
                }
            </View>
        </TouchableOpacity>
    )
}

export const FeedsCard = ({ isLoadingFeeds, churchFeeds, navigation, scrollUp, userInfo, setChurchFeeds }) => {
    const [displayAuthModal, setDisplayAuthModal] = useState(false)

    const viewFeedsDetails = (item) => {
        navigation.navigate("FeedsDetail", { id: item.postId })
        if (scrollUp) {
            scrollUp();
        }
    }

    const likeFeed = async (item, index) => {
        if (!userInfo?.userId) {
            setDisplayAuthModal(true);
            return;
        }
        // Add code to like or unlike feed below
        let payload = {
            mobileUserID: userInfo.userId,
            postId: item.postId
        }

        if (item.isLiked) {
            let copy = [...churchFeeds]
            copy[index].isLiked = false
            copy[index].likeCount -= 1
            setChurchFeeds(copy)
        } else {
            let copy = [...churchFeeds]
            copy[index].isLiked = true
            copy[index].likeCount += 1
            setChurchFeeds(copy)
        }

        try {
            let response = await LikePost(payload);
            if (response.data) {
                console.log('liked')
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <View>

            {
                isLoadingFeeds ? (
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <ActivityIndicator size="large" color={COLORS.primary} style={{ position: 'absolute', bottom: '20%' }} />
                    </View>
                ) : churchFeeds && churchFeeds.length > 0 ? (
                    churchFeeds?.map((item, index) => (
                        <View style={[styles.eventCard, { marginTop: index !== 0 ? 20 : 0 }]} key={index} >
                            <View style={{ paddingTop: 20, paddingLeft: 15, paddingRight: 15, paddingBottom: 8, flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={{ color: "rgba(0, 0, 0, 0.60)", fontFamily: Fonts.bold, fontSize: 13 }}>{item.postCategoryName}</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.60)", fontFamily: Fonts.semibold, fontSize: 13 }}>{dateFormatter.relativeDate(item._OrderDate)}</Text>
                            </View>
                            {
                                item.mediaUrl ? (
                                    <AutoHeightImage width={width - 30} source={{ uri: item.mediaUrl }} />
                                ) : null
                            }
                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity onPress={() => viewFeedsDetails(item)}>
                                    <Text style={{ color: "rgba(0, 0, 0, 0.80)", fontFamily: Fonts.bold, fontSize: 16, paddingLeft: 15, paddingRight: 15 }}>{item.title}</Text>
                                    <Text style={{ color: "rgba(0, 0, 0, 0.50)", paddingLeft: 15, paddingRight: 15, marginTop: 5, lineHeight: 20, fontFamily: Fonts.regular }}>{item.content && item.content.length > 250 ? item.content.slice(0, 250) : item.content}
                                        {
                                            item?.content?.length > 250 ? (
                                                <Text style={{ color: 'rgba(18, 65, 145, 1)', fontStyle: 'italic' }}>...Read more</Text>
                                            ) : null
                                        }
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, paddingBottom: 20 }}>
                                    <>
                                        <View style={{ flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 15 }}>
                                            {
                                                item.isLiked ? (
                                                    <TouchableOpacity onPress={() => likeFeed(item, index)}>
                                                        <View style={{ marginRight: 3 }}>
                                                            <Like />
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity onPress={() => likeFeed(item, index)}>
                                                        <View style={{ marginRight: 3 }}>
                                                            <Unlike />
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                            <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.semibold }}>{item.likeCount}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ marginRight: 3 }}>
                                                <Comment />
                                            </View>
                                            <Text style={{ color: "#000", fontSize: 15, fontFamily: Fonts.semibold }}>{item.comments.length}</Text>
                                        </View>
                                    </>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={{ backgroundColor: "#F4F4F4", height: 325, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 60, borderRadius: 10 }}>
                        <Image source={require("../assets/img/NoFeeds.png")} />
                    </View>
                )
            }
            <SwipeModal visible={displayAuthModal} closeModal={() => setDisplayAuthModal(false)} height="20%">
                <View style={{ alignItems: "center", height: "100%" }}>
                    {/* <Image source={require("../assets/img/splash.jpg")} style={{ width: 50 }} /> */}
                    {/* <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.9)", marginBottom: 5 }}>Log into your account to interact with the app </Text> */}
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <Button icon="login" mode="contained" buttonColor={COLORS.primary} textColor="#FFFFFF" style={{ width: (width / 2) - 30 }} onPress={() => navigation.navigate("Login")}>
                            Login
                        </Button>
                        <Button icon="logout" mode="outlined" textColor={COLORS.primary} style={{ width: (width / 2) - 30 }} onPress={() => navigation.navigate("Register")}>
                            Signup
                        </Button>
                    </View>
                </View>
            </SwipeModal>
        </View>
    );
}

const Celebrants = ({ data, allCelebrants }) => {
    const navigation = useNavigation()
    return (
        <View>
            <TouchableOpacity onPress={() => navigation.navigate("Celebrants", { data: allCelebrants })}>
                {
                    data.photo && data.photo !== null ? (
                        <Image source={{ uri: data.photo }} resizeMode="cover" style={{ width: 70, height: 70, borderRadius: 50 }} />
                    ) : (
                        <Image source={require("../assets/img/avatar.png")} resizeMode="cover" style={{ width: 70, height: 70, borderRadius: 50 }} />
                    )
                }
                {
                    data.celebration.toLowerCase() == "birthday" ? (
                        <Image source={require('../assets/img/birthday_cake.png')} resizeMode="contain" style={styles.celebrationtype} />
                    ) : (
                        <Image source={require('../assets/img/wedding_anniversary.png')} resizeMode="contain" style={styles.celebrationtype} />
                    )
                }
            </TouchableOpacity>
        </View>
    )
}

const InviteModal = ({ inviteModal, setInviteModal, displayQRCode, youTubeId }) => {
    const inviteToFaithConnect = async () => {
        await Share.share({
            title: "Invite to Faith Connect",
            message: 'Invite your family and friends to use Faith Connect to seamlessly connect with your favorite Church services.' + '\n\n' + 'https://play.google.com/store/apps/details?id=com.faithconnect',
            url: 'https://play.google.com/store/apps/details?id=com.faithconnect'
        });
    }

    const liveServiceInvite = async () => {
        await Share.share({
            title: "*Live Streamed Service*",
            message: 'Join us on Youtube and let\'s enjoy God\'s presence.' + '\n\n' + `https://www.youtube.com/watch?v=${youTubeId}`,
            url: `https://www.youtube.com/watch?v=${youTubeId}`
        });
    }
    return (
        <SwipeModal visible={inviteModal} closeModal={setInviteModal} height="80%">
            <TouchableOpacity onPress={setInviteModal} style={{ position: "absolute", right: 30, top: 15 }}>
                <CloseIcon />
            </TouchableOpacity>
            <View style={{ alignItems: "center", height: "100%", marginTop: -10 }}>
                <View>
                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center" }}>Help Someone live</Text>
                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center", marginTop: -5 }}>better through fellowship</Text>
                    <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', marginTop: 5, fontFamily: Fonts.regular }}>Use any of the options below to invite</Text>
                    <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', fontFamily: Fonts.regular }}>your Friends and Family</Text>

                    <View style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                        <QRCodeIcon width={26} height={26} color="rgba(0, 0, 0, 1)" />
                        <TouchableOpacity onPress={displayQRCode}>
                            <View>
                                <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Invite with QR Code</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Show a QR code your invitee can Scan to join the Church</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                        <PhoneIcon />
                        <TouchableOpacity onPress={inviteToFaithConnect}>
                            <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Invite to The Citizens Church</Text>
                            <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Invite your Friends and Family to start enjoying</Text>
                            <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>the amazing features of The Citizens Church App</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        youTubeId ? (
                            <View style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                                <StreamIcon />
                                <TouchableOpacity onPress={liveServiceInvite}>
                                    <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Live Service Invitation</Text>
                                    <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Send an Invite to your Church Live Stream</Text>
                                    <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>right here on The Citizen Church</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }
                    {/* <View style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                        <ShareIconII />
                        <View>
                            <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Share Message Catalogue</Text>
                            <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11 }}>Send a Link to your Friends and Family to enjoy</Text>
                            <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11 }}>series of Messages from your Church</Text>
                        </View>
                    </View> */}
                </View>
            </View>
        </SwipeModal>
    );
}

const NextSteps = ({ nextStepsModal, setNextStepsModal, fullProfile, navigation }) => {
    const commitToChrist = async () => {
        const committochrist = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('new convert'));
        setNextStepsModal()
        setTimeout(() => {
            navigation.navigate("ExternalUrlFrame", { title: "Give Your Life To Christ", uri: committochrist?.url })
        }, 1000);
    }

    const joinGroup = async () => {
        const joingroup = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('join a group'));
        setNextStepsModal()
        setTimeout(() => {
            navigation.navigate("ExternalUrlFrame", { title: "Join a Group", uri: joingroup?.url })
        }, 1000);
    }

    const volunteer = async () => {
        const volunteer = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('volunteer'));
        setNextStepsModal()
        setTimeout(() => {
            navigation.navigate("ExternalUrlFrame", { title: "Volunteer to Serve", uri: volunteer?.url })
        }, 1000);
    }

    const counselling = async () => {
        const generalcounselling = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('general counseling'));
        setNextStepsModal()
        setTimeout(() => {
            navigation.navigate("ExternalUrlFrame", { title: "Request Personal Counsel", uri: generalcounselling?.url })
        }, 1000);
    }

    const makeannouncement = async () => {
        const announcement = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('contact church'));
        console.log('this is announcement', announcement)
        setNextStepsModal()
        setTimeout(() => {
            navigation.navigate("ExternalUrlFrame", { title: "Make an Anouncement", uri: announcement?.url })
        }, 1000);
    }

    const otherForms = fullProfile?.forms?.filter(i =>
        !i.name.toLowerCase().includes('new convert') &&
        !i.name.toLowerCase().includes('join a group') &&
        !i.name.toLowerCase().includes('volunteer') &&
        !i.name.toLowerCase().includes('general counseling') &&
        !i.name.toLowerCase().includes('contact church'))

    const otherFormsAction = async (item) => {
        setNextStepsModal()
        setTimeout(() => {
            navigation.navigate("ExternalUrlFrame", { title: "Others", uri: item?.url })
        }, 1000);
    }

    return (
        <SwipeModal visible={nextStepsModal} closeModal={setNextStepsModal} height="80%">
            <TouchableOpacity onPress={setNextStepsModal} style={{ position: "absolute", right: 30, top: 15 }}>
                <CloseIcon />
            </TouchableOpacity>
            <View style={{ alignItems: "center", height: "100%", marginTop: -10 }}>
                <View>
                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center" }}>Accelerate your</Text>
                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center", marginTop: -5 }}>Spiritual Fulfillment</Text>
                    <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', marginTop: 5, fontFamily: Fonts.regular }}>What would you like to do today as</Text>
                    <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', fontFamily: Fonts.regular }}>next steps to spiritual upliftment</Text>
                    <ScrollView>

                        <TouchableOpacity onPress={commitToChrist} style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                            <HandsPraying width="25" height="25" color="rgba(0, 0, 0, 1)" />
                            <View>
                                <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Give your Life to Christ</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Show a QR code your invitee can Scan to join the Church</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={joinGroup} style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                            <GroupsIcon />
                            <View>
                                <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Join a Group</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Become a Member of a Group in Church</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>this encourage Participation and growth.</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={volunteer} style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                            <HeartIcon />
                            <View>
                                <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Volunteer to Serve</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Serve in any Capacity in the Church</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Voluntarily, this can be very Fulfilling!</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={counselling} style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                            <PersonIcon />
                            <View>
                                <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Request Personal Counsel</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Personal Counsel can be requested for to enjoy</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}> a one-on-one Encouragement</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={makeannouncement} style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                            <MegaphoneII />
                            <View>
                                <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)" }}>Make an Announcement</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}>Inform the Leaders of the Church of A News,</Text>
                                <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular }}> Information or a Development</Text>
                            </View>
                        </TouchableOpacity>
                        {
                            otherForms && otherForms.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => otherFormsAction(item)} style={{ backgroundColor: COLORS.white, flexDirection: "row", gap: 10, alignItems: "center", paddingHorizontal: 13, paddingVertical: 15, marginTop: 15, borderRadius: 8 }}>
                                    <MegaphoneII />
                                    <View>
                                        <Text style={{ fontFamily: Fonts.bold, color: "rgba(0, 0, 0, 0.8)", width: width / 1.5 }}>{item?.name}</Text>
                                        <Text style={{ color: "rgba(0, 0, 0, 0.8)", fontSize: 11, fontFamily: Fonts.regular, width: width / 1.5 }}>{item?.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        </SwipeModal>
    );
}

const CheckinModal = ({ checkinModal, setCheckinModal }) => {
    return (
        <SwipeModal visible={checkinModal} closeModal={setCheckinModal} height="80%">
            <TouchableOpacity onPress={setCheckinModal} style={{ position: "absolute", right: 30, top: 15 }}>
                <CloseIcon />
            </TouchableOpacity>
            <View style={{ height: "100%", marginTop: -10 }}>
                <UpcomingEvent closeModal={setCheckinModal} />
            </View>
        </SwipeModal>
    );
}

const ScanQRModal = ({ scanQRModal, setScanQRModal, churchProfile }) => {
    
    return (
        <SwipeModal visible={scanQRModal} closeModal={setScanQRModal} height="80%">
            <TouchableOpacity onPress={setScanQRModal} style={{ position: "absolute", right: 30, top: 15 }}>
                <CloseIcon />
            </TouchableOpacity>
            <View style={{ alignItems: "center", height: "100%", marginTop: -10 }}>
                <View>
                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center" }}>Show this for a family </Text>
                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center", marginTop: -5 }}>or friend to scan</Text>
                    <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', marginTop: 5 }}>Scan the QR Code Below</Text>
                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
                            <Image style={{ width: 250, height: 250, resizeMode: "contain" }} source={{ uri: churchProfile?.invitePublicPageQRCode }} />
                        </View>
                    </View>

                </View>
            </View>
        </SwipeModal>
    );
}

const MinistryInfo = ({ ministryInformation, setMinistryInformation, fullProfile }) => {
    const tabs = fullProfile?.customAbouts?.length > 0 ? ['Pastors', 'Locations'].concat(fullProfile?.customAbouts?.map(i => i.title)) : fullProfile?.customAbouts?.map(i => i.title)
    const [activeTab, setActiveTab] = useState("");
    const tabData = fullProfile?.customAbouts?.find(i => i.title === activeTab);

    useEffect(() => {
        if (tabs?.length > 0) {
            setActiveTab(tabs[0])
        }
    }, [fullProfile])

    return (
        <SwipeModal visible={ministryInformation} closeModal={setMinistryInformation} height="80%">
            <TouchableOpacity onPress={setMinistryInformation} style={{ position: "absolute", right: 30, top: 15 }}>
                <CloseIcon />
            </TouchableOpacity>
            <View style={{ height: "100%", marginTop: -10 }}>
                <View>
                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center" }}>Ministry Info</Text>
                </View>
                <View style={{ backgroundColor: "#FFFFFF", width: '100%', alignItems: "center", marginTop: 10, paddingVertical: 15, borderRadius: 8 }}>
                    <Image source={{ uri: fullProfile?.logoUrl || 'https://placeholder.com/68x68' }} style={{ width: 80, height: 80 }} resizeMode="contain" />
                    <Text style={{ fontFamily: Fonts.medium, color: "rgba(0, 0, 0, 0.8)", fontSize: 15, marginTop: 5 }}>{fullProfile?.churchName}</Text>
                </View>
                <View style={{ marginTop: 10, height: 40 }}>
                    <FlatList
                        data={tabs}
                        renderItem={({ item, index }) => (
                            <Button textColor="rgba(0, 0, 0, 0.8)" style={{ borderBottomWidth: item === activeTab ? 3 : 0, borderColor: 'rgba(206, 206, 206, 1)', height: 40, borderRadius: 0 }} mode="text" onPress={() => setActiveTab(item)}>
                                <Text style={{ fontWeight: item === activeTab ? 700 : 400, fontSize: item === activeTab ? 17 : 14 }}>{item}</Text>
                            </Button>
                        )}
                        keyExtractor={(item, index) => index}
                        contentContainerStyle={{ columnGap: 7 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <View style={{ width: "100%" }}>
                    {tabData && (
                        <View>
                            <ScrollView style={{ maxHeight: 300 }}>
                                {
                                    <View style={{ marginVertical: 15, backgroundColor: "#FFFFFF", borderRadius: 3, padding: 15 }}>
                                        <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19 }}>
                                            {tabData.details}
                                        </Text>
                                    </View>
                                }

                            </ScrollView>
                        </View>)}
                </View>
                <View>
                    {activeTab?.toLowerCase().includes('pastors') && (
                        <ScrollView style={{ maxHeight: 300 }}>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                {
                                    fullProfile?.pastors?.length > 0 ?
                                        fullProfile?.pastors?.map((item, index) => (
                                            <View style={{ marginTop: 20 }} key={index}>
                                                <Image source={{ uri: item.photoUrl || 'https://placeholder.com/68x68' }} style={{ width: (width - 70) / 2, height: 170, borderRadius: 10 }} />
                                                <Text style={{ fontWeight: "700", color: "#000000", marginTop: 10, width: (width - 40) / 2 }}>{item.name}</Text>
                                                <Text style={{ fontFamily: Fonts.medium, color: "#000000", marginTop: 5, fontSize: 12, width: (width - 40) / 2 }}>{item.phone}</Text>
                                                <Text style={{ fontFamily: Fonts.medium, color: "#000000", marginTop: 5, fontSize: 12, width: (width - 40) / 2 }}>{item.details}</Text>
                                            </View>
                                        )) : (
                                            <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, marginTop: 20 }}>No pastor added yet</Text>
                                        )
                                }
                            </View>
                        </ScrollView>
                    )}
                </View>
                <View>
                    {activeTab.toLowerCase() === 'locations' && (
                        console.log(`fullProfile?.churchBranches`, fullProfile?.churchBranches),


                        <ScrollView style={{ maxHeight: 300 }}>
                            {fullProfile?.churchBranches?.length == 0 ? (
                                <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, marginTop: 20 }}>No location added yet</Text>
                            ) : fullProfile?.churchBranches?.map((item, i) => (
                                <View style={{ padding: 10, marginTop: 10, backgroundColor: "#FFFFFF" }} key={i}>
                                    <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19, flexWrap: 'wrap' }}>{item?.branchName}</Text>
                                    <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19, marginTop: 10, flexWrap: 'wrap' }}>{item?.address}</Text>
                                    <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19, marginTop: 10, flexWrap: 'wrap' }}>{item?.branchDetails}</Text>
                                    <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: COLORS.black, lineHeight: 19, marginTop: 10, flexWrap: 'wrap' }}>{item?.branchPhone}</Text>
                                </View>
                            ))}
                        </ScrollView>   
                    )}
                </View>
            </View>
        </SwipeModal>
    );
}

export const HomeScreen = ({ navigation }) => {
    const churchInfo = useSelector((state) => state.user.churchInfo);
    // console.log(churchInfo, 'churchInfo')
    const userInfo = useSelector((state) => state.user.userInfo);
    // console.log(userInfo, 'userInfo')
    const dispatch = useDispatch()
    const [churchFeeds, setChurchFeeds] = useState([]);
    const [isLoadingFeeds, setIsLoadingFeeds] = useState(false);
    const [videoDetails, setVideoDetails] = useState([]);
    const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
    const [devotional, setDevotional] = useState(null)
    const [inviteModal, setInviteModal] = useState(false)
    const [nextStepsModal, setNextStepsModal] = useState(false)
    const [checkinModal, setCheckinModal] = useState(false)
    const [scanQR, setScanQR] = useState(false)
    const [ministryInformation, setMinistryInformation] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    const FirstQuickActions = [
        'Invite',
        'Next Steps',
        'Ministry Info',
        'Check in'
    ]
    const SecondQuickActions = [
        { name: 'Prayer Request', subtitle: 'We\'d love to pray for you', theme: "rgba(254, 211, 102, 1)" },
        { name: 'Commit to Christ', subtitle: 'Let others be motivated', theme: "rgba(128, 47, 163, 1)" },
        { name: 'Share Testimony', subtitle: 'Let others be motivated', theme: "rgba(247, 105, 118, 1)" },
        { name: 'I Am New', subtitle: 'Let us treat you as a beloved guest', theme: "rgba(93, 177, 254, 1)" },
        { name: 'Book Appointment', subtitle: 'We\'d love to hear from you', theme: "rgba(23, 254, 142, 1)" },
    ]

    useEffect(() => {
        getChurchFeed();
        getChurchProfile();
        getCelebrants();
    }, [churchInfo, userInfo])

    const getChurchFeed = async () => {
        setIsLoadingFeeds(true)
        try {
            let response = await ChurchFeeds(churchInfo.tenantId, userInfo?.userId);
            if (!response) return;
            if (response.toString().includes('500') || response.toString().includes('401')) {
                navigation.navigate("Login");
                return;
            }
            let { data } = response;
            console.log(data, 'church feeds data')
            setIsLoadingFeeds(false)
            setChurchFeeds(data)
            const devotionObj = data && data.find(i => i.postCategoryName.toLowerCase().includes("devotional"));
            if (devotionObj) {
                setDevotional(devotionObj)
            } else {
                setDevotional(null)
            }
        } catch (error) {
            setIsLoadingFeeds(false)
            console.log(error);
        }
    }

    const [fullProfile, setFullProfile] = useState({});
    const getChurchProfile = async () => {
        try {
            let { data } = await ChurchProfile(churchInfo.tenantId);
            if (!data) return;

            // console.log(data.returnObject.invitePublicPageQRCode, 'full profile data')
            
            setFullProfile(data.returnObject)
            const channelId = data.returnObject.churchSocialMedia.find(i => i.name.toLowerCase().includes("channel id"));
            if (!channelId) setVideoDetails([])
            getVideoIds(channelId.url);

        } catch (error) {
            console.log(error);
        }
    }

    const getVideoIds = async (channelId) => {
        setIsLoadingYoutube(true)
        try {
            let { data } = await YouTubeChannelVideoIds(channelId);
            const videoIDs = data ? data.items.map(i => i.id.videoId) : []
            getVideoIdDetails(videoIDs);
            setIsLoadingYoutube(false)
        } catch (error) {
            console.log(error);
            setIsLoadingYoutube(false)
        }
    }

    const getVideoIdDetails = async (IDs) => {
        try {
            let { data } = await YouTubeChannelVideoDetails(IDs);
            let videoDetailsShallowCopy = new Array();
            if (data.items.length > 0) {
                data.items.forEach(item => {
                    videoDetailsShallowCopy.push({
                        title: item.snippet.title,
                        description: item.snippet.description,
                        channelTitle: item.snippet.channelTitle,
                        publishedAt: item.snippet.publishedAt,
                        videoId: item.id,
                        defaultThumbnailUrl: item.snippet?.thumbnails?.default?.url,
                        mediumThumbnailUrl: item.snippet?.thumbnails?.medium?.url,
                        highThumbnailUrl: item.snippet?.thumbnails?.high?.url,
                        standardThumbnailUrl: item.snippet?.thumbnails?.standard?.url,
                        maxResThumbnailUrl: item.snippet?.thumbnails?.maxres?.url,
                        statistics: item.statistics,
                        id: item.id
                    });
                })
                setVideoDetails(videoDetailsShallowCopy);
                if (videoDetailsShallowCopy.length > 0) {
                    dispatch(churchYoutubeMedia(videoDetailsShallowCopy))
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const [playing, setPlaying] = useState(false);


    const [celebrants, setCelebrants] = useState([]);
    const getCelebrants = async () => {
        // setIsLoadingYoutube(true)
        try {
            let { data } = await GetAllCelebrants(churchInfo.tenantId);
            setCelebrants(data)
        } catch (error) {
            console.log(error);
            // setIsLoadingYoutube(false)
        }
    }

    const firstActionSteps = (index) => {
        if (index == 0) {
            setInviteModal(true);
        } else if (index == 1) {
            setNextStepsModal(true);
        } else if (index == 2) {
            setMinistryInformation(true);
        } else if (index == 3) {
            setCheckinModal(true);
        }
    }

    const secondActionSteps = async (index) => {
        const prayer = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('prayer'))
        const testimony = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('testimony'))
        const committochrist = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('new convert'))
        const iamnew = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('first timer'))
        const bookappointment = fullProfile?.forms?.find(i => i.name.toLowerCase().includes('general counseling'))
        if (index == 0) {
            navigation.navigate("ExternalUrlFrame", { title: "Prayer Request", uri: prayer?.url })
        } else if (index == 1) {
            navigation.navigate("ExternalUrlFrame", { title: "Commit to Christ", uri: committochrist?.url })
        } else if (index == 2) {
            navigation.navigate("ExternalUrlFrame", { title: "Share Testimony", uri: testimony?.url })
        } else if (index == 3) {
            navigation.navigate("ExternalUrlFrame", { title: "I Am New", uri: iamnew?.url })
        } else {
            navigation.navigate("ExternalUrlFrame", { title: "Book Appointment", uri: bookappointment?.url })
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        getChurchProfile();
        getChurchFeed();
        getCelebrants();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000); // Simulating a delay
    };

    const setDisplayQRCode = () => {
        setInviteModal(false)
        setTimeout(() => {
            setScanQR(true)
        }, 1000)
    }

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: "#F4F4F4", }} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}>
                <SafeAreaView>
                    <View style={[styles.sideContainer, { paddingBottom: 10 }]}>
                        <View style={styles.devotionalContainer}>
                            <FlatList
                                data={FirstQuickActions}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => firstActionSteps(index)}>
                                        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 25 }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                {
                                                    index == 0 ? (
                                                        <InviteIcon />
                                                    ) : index == 1 ? (
                                                        <PlaneIcon />
                                                    ) : index == 2 ? (
                                                        <ChurchIcon width={15} height={15} color="black" />
                                                    ) : (
                                                        <QRCodeIcon width={14} height={14} color="black" />
                                                    )
                                                }
                                                <Text style={{ color: COLORS.black, fontFamily: Fonts.medium }}>{item}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index}
                                contentContainerStyle={{ columnGap: 7 }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            // style={{ marginTop: 10 }}

                            />
                        </View>
                        {
                            devotional ? (
                                <View style={{ marginTop: 15 }}>
                                    <LinearGradient
                                        colors={['rgba(168, 108, 37, 0)', '#B28E28']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 15 }}
                                    />
                                        {
                                            devotional.mediaUrl ? (
                                                <Image source={{ uri: devotional.mediaUrl || 'https://placeholder.com/68x68' }} style={{ width: "100%", height: 200, borderRadius: 15, zIndex: -1 }} />
                                            ) : (
                                                <Image source={require("../assets/img/familydevotion.png")} style={{ width: "100%", height: 200, borderRadius: 15, zIndex: -1 }} />
                                            )
                                        }
                                        <View style={{ position: "absolute", top: 70, alignItems: "center", width: "100%" }}>
                                            <View style={{ backgroundColor: COLORS.white, borderRadius: 15, paddingHorizontal: 15, paddingVertical: 5 }}>
                                                <Text style={{ color: COLORS.black, fontSize: 12, fontFamily: Fonts.semibold }}>Today's Devotion</Text>
                                            </View>
                                            <Text style={{ textAlign: "center", color: "rgba(244, 244, 244, 1)", fontSize: 16, fontFamily: Fonts.extrabold, marginTop: 5 }}>{devotional?.title}</Text>
                                            <TouchableOpacity onPress={() => navigation.navigate('TodayDevotional', { data: devotional })}>
                                                <View style={{ backgroundColor: "transparent", borderRadius: 20, paddingHorizontal: 20, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.white, marginTop: 9 }}>
                                                    <Text style={{ fontWeight: 600, color: COLORS.white }}>Read more</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                </View>
                            ) : churchFeeds && churchFeeds?.length > 0 ? (
                                <View style={{ marginTop: 20 }}>
                                    <FeedsCard isLoadingFeeds={isLoadingFeeds} churchFeeds={[churchFeeds[0]]} navigation={navigation} userInfo={userInfo} />
                                </View>
                            ) : null
                        }
                        {
                            videoDetails.length > 0 ? (
                                <>
                                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 15, color: "rgba(0, 0, 0, 0.80)", marginTop: 20 }}>Trending Messages</Text>
                                    <View style={{ marginTop: 10 }}>
                                        <FlatList
                                            data={videoDetails}
                                            renderItem={({ item }) => (
                                                <TrendingMessages navigation={navigation} data={item} videoDetails={videoDetails} />
                                            )}
                                            keyExtractor={(item, index) => index}
                                            contentContainerStyle={{ columnGap: 10 }}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        />
                                    </View>
                                </>
                            ) : null
                        }
                        <View style={{ marginTop: 20 }}>
                            <FlatList
                                data={SecondQuickActions}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 10 }} onPress={() => secondActionSteps(index)}>
                                        {
                                            index == 0 ? (
                                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: item.theme, width: 35, height: 35, borderRadius: 60 }}>
                                                    <HandsPraying />
                                                </View>
                                            ) : index == 1 ? (
                                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: item.theme, width: 35, height: 35, borderRadius: 60 }}>
                                                    <ChurchIcon />
                                                </View>
                                            ) : index == 2 ? (
                                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: item.theme, width: 35, height: 35, borderRadius: 60 }}>
                                                    <Megaphone />
                                                </View>
                                            ) : index == 3 ? (
                                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: item.theme, width: 35, height: 35, borderRadius: 60 }}>
                                                    <UserPlus />
                                                </View>
                                            ) : (
                                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: item.theme, width: 35, height: 35, borderRadius: 60 }}>
                                                    <NoteIcon />
                                                </View>
                                            )
                                        }
                                        <View>
                                            <Text style={{ fontFamily: Fonts.bold, fontSize: 15, color: "rgba(0, 0, 0, 0.80)" }}>{item.name}</Text>
                                            <Text style={{ fontSize: 12, color: "rgba(0, 0, 0, 0.8)", fontFamily: Fonts.medium }}>{item.subtitle}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item, index) => index}
                                contentContainerStyle={{ columnGap: 10 }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        {
                            isLoadingYoutube ? (
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            ) : videoDetails.length > 0 ? (
                                <View style={{ marginTop: 25 }}>
                                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 15, color: "rgba(0, 0, 0, 0.80)", marginBottom: 10 }}>{videoDetails[0]?.title}</Text>
                                    <YoutubePlayer
                                        height={200}
                                        play={playing}
                                        videoId={videoDetails[0]?.videoId}
                                    />
                                </View>
                            ) : null
                        }
                    </View>
                    {
                        celebrants?.length > 0 ? (
                            <View style={[styles.todayscelebrant]}>
                                <Text style={{ fontFamily: Fonts.extrabold, fontSize: 15, color: "#041395", marginBottom: 10 }}>Upcoming Celebrant</Text>
                                <FlatList
                                    data={celebrants}
                                    renderItem={({ item }) => (
                                        <Celebrants data={item} allCelebrants={celebrants} />
                                    )}
                                    keyExtractor={(item, index) => index}
                                    contentContainerStyle={{ columnGap: 10 }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{ marginTop: 10 }}
                                />
                            </View>
                        ) : null
                    }
                    <View style={[styles.sideContainer, { marginTop: 0 }]}>
                        <FeedsCard isLoadingFeeds={isLoadingFeeds} churchFeeds={churchFeeds} setChurchFeeds={setChurchFeeds} navigation={navigation} userInfo={userInfo} />
                    </View>
                    {/* Modals  */}
                    <InviteModal inviteModal={inviteModal} setInviteModal={() => setInviteModal(false)} displayQRCode={setDisplayQRCode} youTubeId={videoDetails[0]?.videoId} />
                    <NextSteps nextStepsModal={nextStepsModal} setNextStepsModal={() => setNextStepsModal(false)} fullProfile={fullProfile} navigation={navigation} />
                    <CheckinModal checkinModal={checkinModal} setCheckinModal={() => setCheckinModal(false)} />
                    <ScanQRModal scanQRModal={scanQR} setScanQRModal={() => setScanQR(false)} churchProfile={fullProfile} />
                    <MinistryInfo ministryInformation={ministryInformation} setMinistryInformation={() => setMinistryInformation(false)} fullProfile={fullProfile} />
                </SafeAreaView>
            </ScrollView>
            {/* <View style={styles.fabIcon}>
                <TouchableOpacity onPress={() => navigation.navigate("FeedsDetail")}>
                    <Image source={require("../assets/img/fabIcon.png")} />
                </TouchableOpacity>
            </View> */}
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15,
        paddingBottom: 60
    },
    devotionalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderWidth: 2,
        // borderColor: 'red',
        marginTop: 5
    },
    // devotionalFirstChild: {
    //     flexDirection: "row",
    //     // alignItems: "center",
    // },
    hero_img: {
        borderRadius: 5,
        borderWidth: 3,
        borderColor: "rgba(0, 0, 0, 0.60)",
        width: "100%"
    },
    // bold_headers: {
    //     fontFamily: "Inter-Bold",
    //     fontSize: 18,
    //     fontWeight: "bold"
    // },
    todayscelebrant: {
        marginTop: 10,

        backgroundColor: "rgba(217, 217, 217, 0.20)",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 15,
        paddingRight: 15
    },
    celebrationtype: {
        width: 21,
        height: 21,
        position: 'absolute',
        top: 50,
        right: 0
    },
    eventCard: {
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: "rgba(0, 0, 0, 0.10)",
        backgroundColor: "white",
        // marginTop: 20
    },
    fabIcon: {
        position: "absolute",
        bottom: 60,
        right: 15
    },
    backgroundVideo: {
        height: 200,
    }
})