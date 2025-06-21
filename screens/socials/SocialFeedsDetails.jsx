import { SafeAreaView, ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Comment } from "../../assets/img/comment";
import { Like, Unlike } from "../../assets/img/like";
import { COLORS, Fonts, height, width } from "../../assets/Theme";
import { StackHeader } from "../reusables/index";
import { ImageModal } from "../reusables/Modal";
import AutoHeightImage from 'react-native-auto-height-image';
import { useEffect, useState } from "react";
import TextArea from "../reusables/TextArea";
import { Button, Divider, Snackbar, TouchableRipple } from "react-native-paper";
import { CreateSocialCommentOnPost, GetSingleUserPost, LikeSocialPost } from "../../services/social";
import dateFormatter from "../../utils/dateFormatter";
import { useSelector } from "react-redux";

const SocialFeedsDetails = ({ navigation, route }) => {
    const { data, postId } = route.params;
    const [showImage, setShowImage] = useState(false)
    const [commentMessage, setCommentMessage] = useState("")
    const [loadingComment, setLoadingComment] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [fullProfile, setFullProfile] = useState({});
    const userInfo = useSelector((state) => state.user.userInfo);
    const [displaySnack, setDisplaySnack] = useState(false)


    useEffect(() => {
        getSingleUserPost();
    }, [])

    const getSingleUserPost = async () => {
        setIsLoading(true)
        try {
            const response = await GetSingleUserPost(data, postId);
            setFullProfile(response.data)
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
            console.error(error)
        }
    }

    const likePost = async (status) => {
        let payload = {
            mobileUserID: userInfo.userId,
            postId: fullProfile.postId
        }

        if (status) {
            const copy = { ...fullProfile }
            copy.isLiked = false;
            copy.likeCount -= 1
            setFullProfile(copy)
        } else {
            const copy = { ...fullProfile }
            copy.isLiked = true;
            copy.likeCount += 1
            setFullProfile(copy)
        }

        try {
            let response = await LikeSocialPost(payload);
            if (response.data) {
                console.log('liked')
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const createComment = async () => {
        setLoadingComment(true)
        let payload = {
            commenterName: userInfo.fullname ? userInfo.fullname : "User",
            commentMessage: commentMessage,
            postId,
            commenterPicture: userInfo.pictureUrl ? userInfo.pictureUrl : "",
            mobileUserId: userInfo.userId
        }
        try {
            const response = await CreateSocialCommentOnPost(payload);
            let feedcopy = [...fullProfile.comments];
            feedcopy.unshift(response.data);
            let profileCopy = {
                ...fullProfile,
                comments: feedcopy
            }
            setFullProfile(profileCopy)
            setDisplaySnack(true);
            setCommentMessage("")
            setLoadingComment(false)
        }
        catch (error) {
            setLoadingComment(false)
            console.error(error)
        }
    }
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <ScrollView>
                    <View>
                        <StackHeader title="Feed" goBack={() => navigation.goBack()} />
                        <View style={styles.sideContainer}>
                            {
                                isLoading ? (
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 200 }}>
                                        <ActivityIndicator color={COLORS.primary} size={25} />
                                    </View>
                                ) : (
                                    <>
                                        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                                            {
                                                fullProfile?.poster?.pictureUrl && fullProfile?.poster?.pictureUrl !== "#" ? (
                                                    <Image source={{ uri: fullProfile?.poster?.pictureUrl }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                                                ) : (
                                                    <Image source={require("../../assets/img/avatar.png")} style={{ width: 50, height: 50 }} resizeMode="cover" />
                                                )
                                            }
                                            <View style={{ width: width - 90 }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                    <View>
                                                        <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: fullProfile?.poster?.id })}>
                                                            <Text style={{ fontFamily: Fonts.bold, color: "#1F1E1E" }}>{fullProfile?.poster?.name}</Text>
                                                        </TouchableOpacity>
                                                        <Text style={{ fontFamily: Fonts.regular, color: "#1F1E1E99", fontSize: 12 }}>{fullProfile?.poster?.about}</Text>

                                                    </View>
                                                    {
                                                        fullProfile?.dateEntered ? (
                                                            <Text style={{ fontFamily: Fonts.regular, color: "#1F1E1E99", fontSize: 12 }}>{dateFormatter.relativeDate(dateFormatter.getISOStringGMT(fullProfile?.dateEntered))}</Text>
                                                        ) : null
                                                    }
                                                </View>
                                                <Text style={{ fontFamily: Fonts.regular, fontSize: 14, color: "#1F1E1E", marginVertical: 10 }}>{fullProfile.content}</Text>
                                                {
                                                    fullProfile.mediaUrl && fullProfile.mediaUrl !== "#" ? (
                                                        <TouchableOpacity onPress={() => setShowImage(true)}>
                                                            <AutoHeightImage width={width - 90} source={{ uri: fullProfile?.mediaUrl }} style={{ borderRadius: 10 }} />
                                                        </TouchableOpacity>
                                                    ) : null
                                                }
                                                <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
                                                {
                                                        fullProfile.isLiked ? (
                                                            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                                                <TouchableRipple onPress={() => likePost(true)}>
                                                                    <Like color={"#3799F3"} size={28} />
                                                                </TouchableRipple>
                                                                <Text style={{ color: "#1F1E1E99", fontFamily: Fonts.regular, fontSize: 13 }}>{fullProfile.likeCount}</Text>
                                                            </View>
                                                        ) : (
                                                            <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
                                                                <TouchableRipple onPress={() => likePost(false)}>
                                                                    <Unlike color={"#3799F3"} size={28} />
                                                                </TouchableRipple>
                                                                <Text style={{ color: "#1F1E1E99", fontFamily: Fonts.regular, fontSize: 13 }}>{fullProfile.likeCount}</Text>
                                                            </View>
                                                        )
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                        <Divider style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginVertical: 15 }} bold />
                                        {/* Comment part */}
                                        <View style={{ marginTop: 20 }}>
                                            <Text style={{ fontFamily: Fonts.bold, fontSize: 16, color: "#2D2C2C", marginBottom: 8 }}>Add Comment</Text>
                                            <TextArea placeholder="Type something here" onChangeText={setCommentMessage} value={commentMessage} multiline={true} numberOfLines={5} style={styles.textArea} />
                                            <TouchableOpacity>
                                                <Button textColor="#FFFFFF" loading={loadingComment} style={{ marginTop: 20, marginBottom: 15, padding: 5, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={createComment}>
                                                    <Text>Post comment</Text>
                                                </Button>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ marginVertical: 30 }}>
                                            <Text style={{ color: COLORS.black, fontFamily: Fonts.medium }}>Showing all comments ({fullProfile?.comments?.length})</Text>
                                            {
                                                fullProfile?.comments?.length > 0 ? (
                                                    fullProfile?.comments?.reverse()?.map((item, index) => (
                                                        <View key={index} style={{ flexDirection: "row", gap: 10, marginTop: 15, paddingBottom: 15, borderBottomColor: "rgba(0, 0, 0, 0.15)", borderBottomWidth: 1 }}>
                                                            {
                                                                item.commenterPicture && item.commenterPicture !== null ? (
                                                                    <Image source={{ uri: item.commenterPicture }} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                ) : (
                                                                    <Image source={require("../../assets/img/avatar.png")} resizeMode="cover" style={{ width: 40, height: 40, borderRadius: 50 }} />
                                                                )
                                                            }
                                                            <View style={{ width: width - 80 }}>
                                                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                                    <TouchableOpacity onPress={() => navigation.navigate("ConnectionProfile", { data: item.mobileUserId })}>
                                                                        <Text style={{ fontFamily: Fonts.medium, color: COLORS.black }}>{item.commenterName}</Text>
                                                                    </TouchableOpacity>
                                                                    {
                                                                        item.commentDate ? (
                                                                            <Text style={{ fontFamily: Fonts.regular, color: "rgba(0, 0, 0, 0.4)", fontSize: 13 }}>{dateFormatter.relativeDate(dateFormatter.getISOStringGMT(item.commentDate))}</Text>
                                                                        ) : null
                                                                    }
                                                                </View>
                                                                <Text style={{ fontFamily: Fonts.regular, fontSize: 13, color: "rgba(0, 0, 0, 0.6)" }}>{item.commentMessage}</Text>
                                                            </View>
                                                        </View>
                                                    ))
                                                ) : (
                                                    <Text>No comments yet</Text>
                                                )
                                            }
                                            {
                                                fullProfile?.comments?.length > 5 ? (
                                                    <TouchableOpacity>
                                                        <Button textColor={"rgba(0, 0, 0, 0.7)"} style={{ borderRadius: 8, minWidth: 140, minHeight: 50, justifyContent: 'center' }} mode="text">
                                                            <Text style={{ textAlign: "center", fontWeight: "500", marginTop: 10 }}>'Show all comments'</Text>
                                                        </Button>
                                                    </TouchableOpacity>
                                                    // <Text style={{ textAlign: "center", fontWeight: "500", color: "rgba(0, 0, 0, 0.7)", marginTop: 10 }}>See all comments</Text>
                                                ) : null
                                            }
                                        </View>
                                    </>
                                )
                            }
                        </View>
                    </View>
                    <ImageModal visible={showImage} closeModal={() => setShowImage(false)}>
                        <AutoHeightImage width={width - 30} source={require("../../assets/img/imgbg2.jpg")} />
                    </ImageModal>
                </ScrollView>
            </SafeAreaView>
            <Snackbar
                visible={displaySnack}
                duration={4000}
                style={{ backgroundColor: "#3CBF98", marginBottom: 20 }}
                onDismiss={() => setDisplaySnack(false)}
            >
                <Text style={{ color: "#FFFFFF" }}>Comment posted successfully!</Text>
            </Snackbar>
        </>
    )
}

const styles = StyleSheet.create({
    sideContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        // paddingBottom: 60
    },
    textArea: {
        backgroundColor: "#D9D9D933",
        paddingTop: 5,
        textAlignVertical: 'top'
    },
})

export default SocialFeedsDetails;