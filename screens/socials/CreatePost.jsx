import { Text, View, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Image } from "react-native";
import { JetIcon, PhotoIcon, VideoIcon } from "../../assets/img/icons";
import { COLORS, Fonts } from "../../assets/Theme";
import { Modal, Portal } from 'react-native-paper';
import { useState } from "react";
import { Button } from 'react-native-paper';
import { CreateNewPost } from "../../services/social";
import { useSelector } from "react-redux";
import { StackHeader } from "../reusables";
// import {launchImageLibrary} from 'react-native-image-picker';

const CreatePost = ({ navigation }) => {
    const [visible, setVisible] = useState(false);
    const [postMessage, setPostMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const userInfo = useSelector((state) => state.user.userInfo);

    const handlePublish = async () => {
        if (!postMessage) return;
        setLoading(true)
        let payload = {
            content: postMessage,
            posterId: userInfo.userId
        }

        try {
            await CreateNewPost(payload);
            setVisible(true);
            setLoading(false)
            setPostMessage("")
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const handleDone = () => {
        setVisible(false);
        navigation.navigate("MainHeaderTabs")
    }

    const openImagePicker = () => {
        // console.log('reaching');
        // const options = {
        //   mediaType: 'photo',
        //   includeBase64: false,
        //   maxHeight: 2000,
        //   maxWidth: 2000,
        // };

        // launchImageLibrary(options, (response) => {
        //   if (response.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (response.error) {
        //     console.log('Image picker error: ', response.error);
        //   } else {
        //     let imageUri = response.uri || response.assets?.[0]?.uri;
        //     console.log(imageUri);
        //     // setSelectedImage(imageUri);
        //   }
        // });
    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView >
            <StackHeader title="Create your post" goBack={() => navigation.goBack()} />
                <View style={styles.sideContainer}>
                    <Text style={styles.shareText}>Share an idea</Text>
                    <TextInput multiline={true} onChangeText={setPostMessage} value={postMessage} numberOfLines={6} placeholder="Write up to 1,500 words" style={styles.textArea} />

                    {/* <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30, gap: 14 }}>
                            <TouchableOpacity style={styles.fileBtn} onPress={openImagePicker}>
                                <View style={styles.fileBtnContent}>
                                    <PhotoIcon />
                                    <Text style={{ color: "rgba(31, 30, 30, 0.80)", fontWeight: 600, fontSize: 15 }}>Add Photos</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.fileBtn}>
                                <View style={styles.fileBtnContent}>
                                    <VideoIcon />
                                    <Text style={{ color: "rgba(31, 30, 30, 0.80)", fontWeight: 600, fontSize: 15 }}>Add Videos</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30, gap: 10 }}>
                            <Image source={require("../../assets/img/image_thumbnail.png")} />
                            <Image source={require("../../assets/img/image_thumbnail.png")} />
                            <Image source={require("../../assets/img/image_thumbnail.png")} />
                            <Image source={require("../../assets/img/image_thumbnail.png")} />
                        </View> */}
                </View>
            </ScrollView>
            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                {/* <View > */}
                <Button style={styles.publishBtn} textColor="#FFFFFF" buttonColor={COLORS.primary} loading={loading} onPress={handlePublish}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <Text style={{ color: COLORS.white, fontSize: 16, fontFamily: Fonts.medium }}>Publish</Text>
                        <JetIcon />
                    </View>
                </Button>
                {/* </View> */}

            </View>
            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.containerStyle}>
                    <View style={{ alignItems: "center" }}>
                        <Image source={require("../../assets/img/success_notification.png")} />
                        <Text style={{ color: "#124191", fontSize: 23, fontWeight: 700, fontFamily: "Inter" }}>Great Job!</Text>
                        <Text style={{ color: "rgba(31, 30, 30, 0.80)", fontSize: 16, marginTop: 10, marginBottom: 20, textAlign: "center", fontFamily: "Inter" }}>
                            Your post is created successfully</Text>
                        <Button buttonColor={COLORS.primary} onPress={handleDone}>
                            <Text style={{ color: COLORS.white, fontSize: 16, fontFamily: Fonts.medium }}>OK</Text>
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    sideContainer: {
        padding: 15
    },
    shareText: {
        fontWeight: "700",
        fontSize: 17,
        color: "rgba(31, 30, 30, 0.80)",
        marginTop: 30,
        marginBottom: 10
    },
    textArea: {
        borderRadius: 2,
        borderColor: "rgba(0, 0, 0, 0.10)",
        borderWidth: 1,
        backgroundColor: "rgba(246, 246, 246, 0.50)",
        paddingLeft: 15,
        paddingBottom: 15,
        textAlignVertical: 'top'
    },
    fileBtn: {
        borderRadius: 10,
        borderColor: "rgba(0, 0, 0, 0.10)",
        borderWidth: 1,
        backgroundColor: "rgba(55, 153, 243, 0.20)",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 20,
        paddingRight: 20,
    },
    fileBtnContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    publishBtn: {
        borderRadius: 20,
        paddingTop: 3,
        paddingBottom: 3,
        marginBottom: 30,
    },
    containerStyle: {
        backgroundColor: 'white',
        padding: 20,
        width: "90%",
        alignSelf: "center"
    }
})

export default CreatePost;