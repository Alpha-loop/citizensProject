import { StyleSheet, Text, View, ScrollView, SafeAreaView, Image, TextInput, TouchableOpacity, Share, Linking, ActivityIndicator } from 'react-native';
import { Button, TouchableRipple, Snackbar } from 'react-native-paper';
import React, { useState, useEffect } from 'react'
import { COLORS, width, Fonts, height } from '../assets/Theme'
import { BookmarkIcon, ShareIcon } from '../assets/img/icons';
import moment from "moment";
import { Like, Unlike } from '../assets/img/like'
// import { Comment } from '../assets/img/comment'
import { FeedsCard } from './HomeScreen';
import { ChurchFeeds, SingleChurchFeeds } from '../services/dashboard';
import { useSelector } from 'react-redux';
import { useRef } from "react";
import { CreatePostComment, LikePost } from '../services/social';
import { StackHeader } from './reusables/index';
import { SwipeModal } from './reusables/Modal';
import AutoHeightImage from 'react-native-auto-height-image';
import Input from "./reusables/Input"
import TextArea from './reusables/TextArea';
import dateFormatter from '../utils/dateFormatter';
import { deepLinkUrl } from '../utils/config';

const FeedDetailScreen = ({ navigation, route }) => {
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    let { id } = route.params;
    const [isLiked, setIsLiked] = useState(false);

    const ref = useRef(null);

    const [feedComments, setFeedComment] = useState([])
    const [churchFeeds, setChurchFeeds] = useState([]);
    const [isLoadingFeeds, setIsLoadingFeeds] = useState(false);
    const [displayAuthModal, setDisplayAuthModal] = useState(false);
    const [commentMessage, setCommentMessage] = useState("")
    const [loadingComment, setLoadingComment] = useState(false)
    const [displaySnack, setDisplaySnack] = useState(false)
    const [commentType, setCommentType] = useState(1)
    const [data, setdata] = useState({})

    useEffect(() => {
        getChurchFeed();
        getSingleFeed();
    }, [id])

    const getSingleFeed = async () => {
        setIsLoadingFeeds(true)
        try {
            let { data } = await SingleChurchFeeds(id, churchInfo.tenantId);
            setIsLoadingFeeds(false);
            setdata(data)
            setIsLiked(data.isLiked)
            if (data.comments && data.comments.length > 0) {
                const value = data.comments.reverse().slice(0, 5);
                setFeedComment(value)
            }
        } catch (error) {
            setIsLoadingFeeds(false)
            console.log(error);
        }
    }

    const getChurchFeed = async () => {
        try {
            let response = await ChurchFeeds(churchInfo.tenantId);
            const moreFeed = response.data.filter(i => i.postId !== data.postId).slice(0, 1)
            setChurchFeeds(moreFeed)
        } catch (error) {
            console.log(error);
        }
    }

    const share = async () => {
        console.log(data)
        await Share.share({
            title: data.title,
            message: deepLinkUrl('feeddetail', data.postId),
            url: data.mediaUrl
        });
    }

    const likeFeed = async (status) => {
        if (!userInfo?.userId) {
            setDisplayAuthModal(true);
            return;
        }
        // Add code to like or unlike feed below

        let payload = {
            mobileUserID: userInfo.userId,
            postId: data.postId
        }

        setIsLiked(status);
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

    const createComment = async () => {
        if (!userInfo?.userId) {
            setDisplayAuthModal(true);
            return;
        }

        setLoadingComment(true)
        let payload = {
            commenterName: userInfo.fullname ? userInfo.fullname : "User",
            commentMessage: commentMessage,
            postId: data.postId,
            commenterPicture: userInfo.pictureUrl ? userInfo.pictureUrl : "",
            mobileUserId: userInfo.userId
        }
        try {
            let response = await CreatePostComment(payload);
            setLoadingComment(false)
            if (response?.data?.isApproved) {
                let feedcopy = [...feedComments];
                feedcopy.unshift(response.data);
                setFeedComment(feedcopy)
                setDisplaySnack(true);
                setCommentMessage("")
            }
        }
        catch (error) {
            setLoadingComment(false)
            console.error(error)
        }
    }

    const back = () => {
        navigation.navigate("MainHeaderTabs")
    }

    const scrollUp = () => {
        ref.current?.scrollTo({ x: 0, y: 0, animated: true });
    }

    const showAllComments = () => {
        if (commentType == 1) {
            const value = data.comments;
            setFeedComment(value)
            setCommentType(2)
        } else {
            const value = data.comments.slice(0, 5);
            setFeedComment(value)
            setCommentType(1)
        }
    }

    return (
        <>
            <ScrollView ref={ref} style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
                <SafeAreaView>
                    <StackHeader title="Feeds" goBack={back} />
                    {
                        isLoadingFeeds ? (
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height }}>
                                <ActivityIndicator color={COLORS.primary} size={25} />
                            </View>
                        ) : (
                            <>
                                <View>
                                    <AutoHeightImage width={width} source={{ uri: data.mediaUrl || "https://placeholder.com/68x68" }} />
                                </View>
                                <View style={styles.sideContainer}>
                                    <Text style={{ ...styles.bold_headers, marginBottom: 15 }}>{data.title}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        {
                                            !data?.postCategoryName?.toLowerCase()?.includes("event") ? (
                                                <View>
                                                    <Text style={{ fontFamily: Fonts.semibold, fontSize: 18, color: "#2D2C2C" }}>{data.postCategoryName}</Text>
                                                    <Text style={{ color: "rgba(45, 44, 44, 0.7)", fontSize: 13, fontFamily: Fonts.regular }}>{dateFormatter.relativeDate(data?._OrderDate)}</Text>
                                                </View>

                                            ) : null
                                        }
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                                            <TouchableOpacity onPress={share}>
                                                <ShareIcon />
                                            </TouchableOpacity>
                                            {/* <BookmarkIcon /> */}
                                            {
                                                isLiked ? (
                                                    <TouchableOpacity onPress={() => likeFeed(false)}>
                                                        <View style={{ marginRight: 3 }}>
                                                            <Like />
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity onPress={() => likeFeed(true)}>
                                                        <View style={{ marginRight: 3 }}>
                                                            <Unlike />
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={{ marginTop: 20, color: COLORS.black, fontFamily: Fonts.regular }}>{data.content}</Text>
                                    </View>
                                    {
                                        <>
                                            {
                                                data?.postCategoryName?.toLowerCase()?.includes("event") ? (
                                                    <View>
                                                        {/* <TouchableOpacity>
                                                        <Button style={styles.secondaryBtn}>
                                                            <View>
                                                                <Text style={{ color: COLORS.black, fontSize: 17, fontWeight: 700 }}>Add event to calendar</Text>
                                                            </View>
                                                        </Button>
                                                    </TouchableOpacity> */}
                                                        {/* <TouchableOpacity onPress={() => navigation.navigate('RegisterEvent', { data })}>
                                                        <Button style={styles.postBtn}>
                                                            <View>
                                                                <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: 700 }}>Register Early</Text>
                                                            </View>
                                                        </Button>
                                                    </TouchableOpacity> */}
                                                        {
                                                            data?.checkInAttendance ? (
                                                                <TouchableRipple rippleColor="#eee" style={{ marginTop: 20, padding: 13, borderRadius: 15, backgroundColor: COLORS.primary }} onPress={() => Linking.openURL(`https://my.churchplus.co/event/${data?.checkInAttendance?.id}`)}>
                                                                    <Text style={{ fontFamily: Fonts.medium, color: COLORS.white, textAlign: 'center' }}>Register early</Text>
                                                                </TouchableRipple>
                                                            ) : null
                                                        }
                                                    </View>
                                                ) : null
                                            }
                                        </>
                                    }
                                    <>
                                        <View style={{ marginTop: 30 }}>
                                            <Text style={{ fontFamily: Fonts.semibold, fontSize: 16, color: "#2D2C2C" }}>Add Comment</Text>
                                            <TextArea placeholder="Type your comment..." onChangeText={setCommentMessage} value={commentMessage} multiline={true} numberOfLines={5} style={styles.textArea} />
                                            <TouchableOpacity>
                                                <Button textColor="#FFFFFF" loading={loadingComment} style={{ marginTop: 30, marginBottom: 15, padding: 3, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={createComment}>
                                                    <Text style={{ fontFamily: Fonts.medium }}>Post comment</Text>
                                                </Button>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginTop: 30 }}>
                                            <Text style={{ fontFamily: Fonts.medium, color: COLORS.black }}>Showing all comments ({feedComments.length})</Text>
                                            {
                                                feedComments.length > 0 ? (
                                                    feedComments.map((item, index) => (
                                                        <View key={index} style={{ flexDirection: "row", gap: 10, marginTop: 15, paddingBottom: 15, borderBottomColor: "rgba(0, 0, 0, 0.15)", borderBottomWidth: 1 }}>
                                                            {
                                                                item.commenterPicture && item.commenterPicture !== null ? (
                                                                    <Image source={{ uri: item.commenterPicture }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                ) : (
                                                                    <Image source={require("../assets/img/avatar.png")} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                )
                                                            }
                                                            <View style={{ width: width - 80 }}>
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                    {
                                                                        item.mobileUserId ? (
                                                                            <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item.mobileUserId })}>
                                                                                <Text style={{ fontFamily: Fonts.semibold, color: COLORS.black }}>{item.commenterName}</Text>
                                                                            </TouchableOpacity>
                                                                        ) : (
                                                                            <Text style={{ fontFamily: Fonts.semibold, color: COLORS.black }}>{item.commenterName}</Text>
                                                                        )
                                                                    }
                                                                    <Text style={{ color: "rgba(0, 0, 0, 0.4)", fontFamily: Fonts.regular, fontSize: 12 }}>{moment(item?.commentDate?.split("T")[0]?.replaceAll("-", ""), "YYYYMMDD").format("ll")}</Text>
                                                                    {/* <Text style={{ color: "rgba(0, 0, 0, 0.4)" }}>{moment(item.commentDate.split("T")[0].replaceAll("-", ""), "YYYYMMDD").fromNow()}</Text> */}
                                                                </View>
                                                                <Text style={{ fontSize: 15, color: "rgba(0, 0, 0, 0.6)", fontFamily: Fonts.regular }}>{item.commentMessage}</Text>
                                                            </View>
                                                        </View>
                                                    ))
                                                ) : (
                                                    <Text>No comments yet</Text>
                                                )
                                            }
                                            {
                                                data?.comments?.length > 5 ? (
                                                    <TouchableOpacity>
                                                        <Button textColor={"rgba(0, 0, 0, 0.7)"} style={{ borderRadius: 8, minWidth: 140, minHeight: 50, justifyContent: 'center' }} mode="text" onPress={showAllComments}>
                                                            <Text style={{ textAlign: "center",fontFamily: Fonts.medium, marginTop: 10 }}>{commentType == 1 ? 'Show all comments' : 'Show less comment'}</Text>
                                                        </Button>
                                                    </TouchableOpacity>
                                                    // <Text style={{ textAlign: "center", fontWeight: "500", color: "rgba(0, 0, 0, 0.7)", marginTop: 10 }}>See all comments</Text>
                                                ) : null
                                            }
                                        </View>
                                    </>
                                    <Text style={{ fontFamily: Fonts.semibold, fontSize: 18, color: COLORS.black, marginTop: 30 }}>Also from Feeds</Text>
                                </View>
                                <View style={{ borderTopColor: "rgba(0, 0, 0, 0.05)", borderTopWidth: 6, marginTop: 15 }}>
                                </View>
                                <View style={styles.sideContainer}>
                                    <FeedsCard isLoadingFeeds={isLoadingFeeds} churchFeeds={churchFeeds} navigation={navigation} scrollUp={scrollUp} userInfo={userInfo} />
                                </View>
                            </>
                        )
                    }
                    <View style={{ paddingBottom: 60 }}></View>
                    <SwipeModal visible={displayAuthModal} closeModal={() => setDisplayAuthModal(false)} height="20%">
                        <View style={{ alignItems: "center", height: "100%" }}>
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
                </SafeAreaView>
            </ScrollView>
            <Snackbar
                visible={displaySnack}
                duration={4000}
                style={{ backgroundColor: "#000000", marginBottom: 50 }}
                onDismiss={() => setDisplaySnack(false)}
            >
                <Text style={{ color: "#FFFFFF" }}>Comment posted successfully!</Text>
            </Snackbar>
        </>
    )
}

export default FeedDetailScreen

const styles = StyleSheet.create({
    sideContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        // paddingBottom: 60
    },
    bold_headers: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        color: "#041395",
    },
    textArea: {
        backgroundColor: "rgba(217, 217, 217, 0.2)",
        paddingTop: 5,
        marginTop: 7,
        textAlignVertical: 'top'
    },
    postBtn: {
        backgroundColor: "rgba(49, 73, 210, 1)",
        paddingTop: 7,
        paddingBottom: 7,
        borderRadius: 5,
        marginTop: 20
    },
    secondaryBtn: {
        paddingTop: 7,
        paddingBottom: 7,
        borderRadius: 5,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "black"
    },
})