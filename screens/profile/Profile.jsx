import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, Fonts, width } from '../../assets/Theme'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux';
import { StackHeader } from '../reusables/index';
import { Switch, TouchableRipple } from "react-native-paper";
import { EditPen, ThreeDots } from '../../assets/img/icons';
import Dropdown from '../reusables/Dropdown';
import { GetChurchGroups, GetLookUps, GetUserProfile } from '../../services/service';
import { UpdateProfileVisibility } from '../../services/social';
import SnackbarToast from '../reusables/Snackbar';
import { updateUserInfo } from '../../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from '../reusables/SelectDropdown';
import { ImageModal } from '../reusables/Modal';
import AutoHeightImage from 'react-native-auto-height-image';

const Profile = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const userInfo = useSelector((state) => state.user.userInfo);
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const [isSwitchOn, setIsSwitchOn] = useState(userInfo?.makeProfileVisible ? userInfo?.makeProfileVisible : false);
    const [dropdownShown, setDropDown] = useState(false);
    const [fullProfile, setFullProfile] = useState({});
    const [toggleVisibility, setToggleVisibility] = useState(false);
    const [toggleMessage, setToggleMessage] = useState("");
    const [maritalStatus, setMaritalStatus] = useState([]);
    const [churchGroups, setChurchGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const profileOtherOptions = [
        'Manage profile',
        'Delete Account'
    ]

    useEffect(() => {
        if (isFocused) {
            getUserProfile();
        }
        getLookUps();
        getChurchGroups();
    }, [isFocused])

    const displayProfileOptions = (value) => {
        if (value.toLowerCase() === 'manage profile') {
            navigation.navigate("ManageProfile", { 
                isSwitchOn: isSwitchOn, 
                toggleSwitch: toggleSwitch
            })
        } else {
            navigation.navigate("DeleteAccountTerms")
        }
    }

    const otherOptions = (
        <SelectDropdown
            data={profileOtherOptions.map(i => ({ label: i, value: i }))}
            search={false}
            value={""}
            setValue={displayProfileOptions}
            renderRightIcon={() => <ThreeDots size={25} />}
            customToggle
        />
    )

    const getUserProfile = async () => {
        if (userInfo?.personID) {
            setIsLoading(true)
            try {
                const { data } = await GetUserProfile(userInfo?.personID);
                setFullProfile(data)
                setIsLoading(false)
            }
            catch (error) {
                setIsLoading(false)
                console.error(error)
            }
        }
    }

    const toggleSwitch = (newValue) => {

        const updatedValue = newValue !== null ? newValue : !isSwitchOn;
        setIsSwitchOn(updatedValue);
        setToggleVisibility(true);
        
        if (updatedValue) {
            setToggleMessage("🎉 Profile set to be visible");
        } else {
            setToggleMessage("🎉 Profile visibility revoked");
        }
        // setIsSwitchOn(!isSwitchOn)
        // setToggleVisibility(true)
        // if (!isSwitchOn) {
        //     setToggleMessage("🎉 Profile set to be visible")
        // } else {
        //     setToggleMessage("🎉 Profile visibility revoked")
        // }
    }

    useEffect(() => {
        const isSwitchCopy = isSwitchOn
        setIsSwitchOn(isSwitchCopy)
        if (userInfo?.userId) {
            setProfileVisibility(isSwitchCopy)
        }
    }, [isSwitchOn])

    const setProfileVisibility = async () => {
        try {
            await UpdateProfileVisibility({ userId: userInfo.userId, tenantId: churchInfo.tenantId, visibility: isSwitchOn });
            // Update the user state
            dispatch(updateUserInfo({ makeProfileVisible: isSwitchOn }))

            // Update the user data in localstorage
            const value = await AsyncStorage.getItem("user")
            const parsedValue = JSON.parse(value);
            parsedValue.makeProfileVisible = isSwitchOn;
            const stringified = JSON.stringify(parsedValue)
            await AsyncStorage.setItem("user", stringified)
        }
        catch (err) {
            console.error(err)
        }
    }

    const getLookUps = async () => {
        try {
            let { data } = await GetLookUps();
            // console.log(data, 'here')
            // const findGender = data.find(i => i.type.toLowerCase() === 'gender').lookUps
            const findMaritalStatus = data.find(i => i.type.toLowerCase() === 'maritalstatus').lookUps
            // console.log(findMaritalStatus)
            // setGender(findGender)
            setMaritalStatus(findMaritalStatus)
        } catch (err) {
            console.log(err)
        }
    }

    const getChurchGroups = async () => {
        try {
            let { data } = await GetChurchGroups(churchInfo.tenantId);
            setChurchGroups(data);
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
                <StackHeader title="Profile" goBack={() => navigation.goBack()} headerRight={otherOptions} />

                {userInfo ? (
                    <View>
                        <View>
                            <View style={{ borderRadius: 15, padding: 15 }}>
                                <View style={styles.card}>
                                    <TouchableOpacity onPress={() => setShowImage(true)}>
                                    <Image source={{ uri: fullProfile.pictureUrl ? fullProfile.pictureUrl : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/640px-No-Image-Placeholder.svg.png' }} resizeMode='cover' style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center' }} />
                                    </TouchableOpacity>
                                    <Text style={{ fontFamily: Fonts.bold, fontSize: 17, color: COLORS.black, marginTop: 7 }}>{fullProfile.firstName ? fullProfile.firstName : ""} {fullProfile.lastName ? fullProfile.lastName : ""}</Text>
                                    <Text style={{ color: COLORS.black, width: width - 100, textAlign: "center", marginTop: 5, fontSize: 13 }}>{fullProfile.about ? fullProfile.about : ""}</Text>
                                </View>
                            </View>

                            {
                                !userInfo.personID ? (
                                    <View>
                                        <Text style={{ fontFamily: Fonts.bold, fontSize: 18, color: COLORS.black, textAlign: "center" }}>Kindly update your profile information</Text>
                                        <Text style={{ fontFamily: Fonts.regular, fontSize: 12, color: COLORS.black, textAlign: "center" }}>Get started by clicking on the three dots icon at the top left</Text>
                                    </View>
                                ) : null
                            }
                            {
                                isLoading ? (
                                    <ActivityIndicator size={25} color={COLORS.primary} />
                                ) : null
                            }

                            <View style={{ paddingHorizontal: 20 }}>
                                <View style={{ backgroundColor: 'rgba(243, 243, 243, 1)', borderColor: "rgba(0, 0, 0, 0.25)", borderWidth: 1, borderColor: COLORS.gray, marginVertical: 20, borderRadius: 5, padding: 15 }}>
                                    {/* <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.cardTitle}>Date of Birth :</Text>
                                    <Text style={styles.cardValue}> {userInfo?.person?.dob}</Text>
                                </View> */}
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.cardTitle}>Occupation : </Text>
                                        <Text style={styles.cardValue}>{fullProfile.occupation ? fullProfile.occupation : ""}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.cardTitle}>Marital Status :</Text>
                                        <Text style={styles.cardValue}> {fullProfile.maritalStatusID ? maritalStatus?.find(i => i.id == fullProfile.maritalStatusID)?.value : ""}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.cardTitle}>Email :</Text>
                                        <Text style={styles.cardValue}> {fullProfile.email ? fullProfile.email : ""}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.cardTitle}>Phone Number :</Text>
                                        <Text style={styles.cardValue}> {fullProfile.mobilePhone ? fullProfile.mobilePhone : ""}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.cardTitle}>Address :</Text>
                                        <Text style={styles.cardValue}> {fullProfile.homeAddress ? fullProfile.homeAddress : ""}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Text style={styles.cardTitle}>Church Group :</Text>
                                        <Text style={styles.cardValue}> {churchGroups.find(i => i.id == (fullProfile && fullProfile?.peopleInGroups && fullProfile?.peopleInGroups.length > 0 && fullProfile?.peopleInGroups[0] && fullProfile.peopleInGroups[0]?.groupId))?.name}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text>Make profile searchable</Text>
                                    <Switch value={isSwitchOn} color={"rgba(0, 200, 32, 1)"} onValueChange={toggleSwitch} />
                                </View>

                                {/* <TouchableOpacity style={{ marginVertical: 10, backgroundColor: '#F3F3F3', padding: 10, borderRadius: 10 }} onPress={() => navigation.navigate("QRScanner")}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: COLORS.black, fontFamily: Fonts.medium, fontSize: 14 }}>
                                    Mark Attendance
                                </Text>
                                <Icon name={"navigate-next"} color={COLORS.black} size={20} />
                            </View>
                        </TouchableOpacity> */}

                                {/* <TouchableOpacity style={{ marginVertical: 10, backgroundColor: '#F3F3F3', padding: 10, borderRadius: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: COLORS.black, fontFamily: Fonts.medium, fontSize: 14 }}>
                                    Give History
                                </Text>
                                <Icon name={"navigate-next"} color={COLORS.black} size={20} />
                            </View>
                        </TouchableOpacity> */}

                                {/* <TouchableOpacity style={{ marginVertical: 10, backgroundColor: 'red', padding: 10, borderRadius: 10, position: 'absolute', bottom: -170, alignSelf: 'center' }} onPress={() => {
                                dispatch(logout())
                            }}>
                                <Text style={{ color: COLORS.white, fontFamily: Fonts.medium, fontSize: 14 }}>
                                    Logout
                                </Text>
                            </TouchableOpacity> */}

                            </View>

                        </View>

                    </View>
                ) : (
                    <TouchableOpacity style={{ marginVertical: 10, backgroundColor: COLORS.primary, padding: 10, borderRadius: 10, marginHorizontal: 20, position: 'absolute', bottom: 100, alignSelf: 'center' }} onPress={() => navigation.navigate("Login")}>
                        <Text style={{ color: COLORS.white, fontFamily: Fonts.medium, fontSize: 14, textAlign: 'center' }}>
                            Login Now!
                        </Text>
                    </TouchableOpacity>)}

                {/* <TouchableOpacity style={{ flexDirection: 'row', position: 'absolute', bottom: 70, alignSelf: 'center' }}>
                <Icon name={"power-settings-new"} color={'red'} size={20} />
                <Text style={{ color: COLORS.black, fontFamily: Fonts.medium, fontSize: 14 }}>
                    Switch Church
                </Text>
            </TouchableOpacity> */}
            </SafeAreaView>
            <ImageModal visible={showImage} closeModal={() => setShowImage(false)}>
                <AutoHeightImage width={width - 30} source={{ uri: fullProfile?.pictureUrl }} />
            </ImageModal>
            <SnackbarToast message={toggleMessage} type="success" visible={toggleVisibility} setDismiss={setToggleVisibility} />
        </>
    )
}

export default Profile

const styles = StyleSheet.create({
    card: {
        alignItems: "center"
    },
    cardTitle: {
        color: '#888', fontFamily: Fonts.medium,
        marginTop: 10
    },
    cardValue: {
        color: COLORS.black, fontFamily: Fonts.medium,
        marginTop: 10
    }
})