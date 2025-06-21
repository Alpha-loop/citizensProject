import { Text, View, SafeAreaView, Image, ScrollView, TouchableOpacity, StyleSheet, PermissionsAndroid, FlatList, Platform } from "react-native";
import { COLORS, Fonts, width } from "../../assets/Theme";
import { StackHeader } from "../reusables/index";
import { ActivityIndicator, Button, Checkbox, Chip } from "react-native-paper";
import Input from "../reusables/Input";
import { useEffect, useMemo, useState } from "react";
import Dropdown from "../reusables/Dropdown";
import dayjs from 'dayjs';
import DatePicker from "../reusables/DatePicker";
import { CenteredModal } from "../reusables/Modal";
import TextArea from "../reusables/TextArea";
import { CheckUserSyncedData, GetAllCustomFields, GetChurchGroups, GetLookUps, GetUserProfile, SendUserOTP, SyncAndUpdateData } from "../../services/service";
import { useSelector, useDispatch } from "react-redux";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { updateUserInfo } from "../../redux/userSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TreeSelect from "../reusables/TreeSelect";
import dateFormatter from "../../utils/dateFormatter";
import SelectDropdown from "../reusables/SelectDropdown";


const ManageProfile = ({ route, navigation }) => {
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState(userInfo?.fullname ?? "")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [email, setEmail] = useState(userInfo.email)
    const [occupation, setOccupation] = useState("")
    const [address, setAddress] = useState("")
    const [birthday, setBirthday] = useState("")
    const [birthMonth, setBirthMonth] = useState("")
    const [birthYear, setBirthYear] = useState("")
    const [weddingDay, setWeddingDay] = useState("")
    const [weddingMonth, setWeddingMonth] = useState("")
    const [weddingYear, setWeddingYear] = useState("")
    const [commentMessage, setCommentMessage] = useState("")
    const [gender, setGender] = useState([])
    const [selectedGenderValue, setSelectedGenderValue] = useState({})
    const [selectedGender, setSelectedGenderData] = useState(null)
    const [maritalStatus, setMaritalStatus] = useState([])
    const [selectedMaritalStatusData, setSelectedMaritalStatusData] = useState(null);
    const [selectedMaritalStatus, setSelectedMaritalStatusValue] = useState({})

    const [birthDate, setBirthDate] = useState(dayjs())
    const [weddingDate, setWeddingDate] = useState(dayjs())
    const [churchGroups, setChurchGroups] = useState([])
    const [selectedGroupValue, setSelectedGroupValue] = useState([])
    const [loading, setloading] = useState(false)
    const [imageValue, setimageValue] = useState("")
    const [groupDialog, setGroupDialog] = useState(false)
    const [customFields, setCustomFields] = useState([])
    const [customDateDialog, setCustomDateDialog] = useState(false);
    const [pageloading, setPageLoading] = useState(false)

    const { 
      toggleSwitch = () => console.log('toggleSwitch not provided'), 
      isSwitchOn = false 
    } = route.params || {};

    const daysinMonth = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
    ];

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const birthYearsArr = useMemo(() => {
        const arrOfYears = [];
        let currentYear = new Date().getFullYear();
        while (arrOfYears.length <= 100) {
            arrOfYears.push(currentYear);
            currentYear = currentYear - 1;
        }
        return arrOfYears;
    });






    // useEffect(() => {
    //     if (new Date(birthDate).toLocaleDateString() !== new Date(dayjs()).toLocaleDateString()) {
    //         const newBirthDate = birthDate;
    //         setBirthDate(newBirthDate)
    //         const dateString = birthDate;
    //         const datee = new Date(dateString);
    //         const options = { day: '2-digit', month: 'short', year: 'numeric' };
    //         const formatted = datee.toLocaleDateString('en-GB', options);
    //         setFormattedBirthDate(formatted)
    //         setBirthDateDialog(false)
    //     }
    //     if (new Date(weddingDate).toLocaleDateString() !== new Date(dayjs()).toLocaleDateString()) {
    //         // const newWeddingDate = weddingDate;
    //         // setWeddingDate(newWeddingDate)
    //         const dateWeddingString = weddingDate;
    //         const weddingdatee = new Date(dateWeddingString);
    //         const weddingoptions = { day: '2-digit', month: 'short', year: 'numeric' };
    //         const weddingformatted = weddingdatee.toLocaleDateString('en-GB', weddingoptions);
    //         setFormattedWeddingDate(weddingformatted)
    //         setWeddingDateDialog(false)
    //     }

    // }, [birthDate, weddingDate])

    // useEffect(() => {
    //     const day = fullData.dayOfBirth
    //     const month = fullData.monthOfBirth
    //     const year = fullData.yearOfBirth
    //     console.log(year, month - 1, day)
    //     // const birth = new Date(year, month - 1, day).toISOString();
    //     // setBirthDate(birth)
    // }, [fullData])

    useEffect(() => {
        getLookUps();
        getChurchGroups();
        getCustomFields();
    }, [])

    const setSelectedGender = (value) => {
        const pickedgender = gender.find(i => i.id === value)
        setSelectedGenderData({
            label: pickedgender.value,
            value: pickedgender.id
        })
        setSelectedGenderValue(pickedgender)
    }

    const setSelectedMaritalStatus = (value) => {
        const pickedmaritalstatus = maritalStatus.find(i => i.id === value)
        setSelectedMaritalStatusValue(pickedmaritalstatus)
        setSelectedMaritalStatusData({
            label: pickedmaritalstatus.value,
            value: pickedmaritalstatus.id
        })
    }

    // const setSelectedGroup = (value) => {
    //     const pickedGroup = churchGroups.find(i => i.id === value)
    //     setSelectedGroupValue(pickedGroup)
    // }

    const checkUserSyncedData = async () => {
        setloading(true)
        let payload = {
            email,
            phoneNumber: phoneNumber,
            tenantId: churchInfo.tenantId
        }

        try {
            const { data } = await CheckUserSyncedData(payload);
            if (data.returnObject.isNewUser) {
                syncAndUpdateData();
            } else {
                sendOTP()
            }
        }
        catch (err) {
            console.error(err)
            setloading(false)
        }
    }

    const requestCameraPermission = async (type, index) => {

        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera ",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera permission given");
                    if (type === 'custom') {
                        console.log('launchimage')
                        fileCustomData(index)
                        return;
                    }
                    addImage();
                } else {
                    console.log("Camera permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            addImage();
        }
    };
    const addImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        }

        // launchCamera(options, response => {
        //     if (response.didCancel) {
        //       console.log('User cancelled camera');
        //     } else if (response.error) {
        //       console.log('Camera Error: ', response.error);
        //     } else {
        //       let imageUri = response.uri || response.assets?.[0]?.uri;
        //       setImage(imageUri);
        //       console.log(response);
        //     }
        //   });

        launchImageLibrary(options, response => {
            // console.log(response, 'reaching')
            if (response.assets && response.assets[0].uri) {
                // console.log(response.assets[0], 'here')
                setimageValue(response.assets[0])
                // imageUrl(response.assets[0])
            }
        })

    }

    const fileCustomData = (index) => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        }

        launchImageLibrary(options, response => {
            if (response?.assets[0]?.uri) {
                const value = response?.assets[0]
                setCustomDataValue(value, index)
            }
        })

    }

    const sendOTP = async () => {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("mobilePhone", phoneNumber);
        formData.append("homeAddress", address);
        formData.append("occupation", occupation);
        formData.append("dayOfBirth", birthday ? birthday : '');
        formData.append("monthOfBirth", months.indexOf(birthMonth) + 1);
        formData.append("yearOfBirth", birthYear ? birthYear : '');
        formData.append("dayOfWedding", weddingDay ? weddingDay : '');
        formData.append("monthOfWedding", months.indexOf(weddingMonth) + 1);
        formData.append("yearOfWedding", weddingYear);
        formData.append("genderId", selectedGenderValue.id ? selectedGenderValue.id : "");
        formData.append("maritalStatusId", selectedMaritalStatus.id ? selectedMaritalStatus.id : "");
        formData.append("about", commentMessage);
        formData.append("tenantId", churchInfo.tenantId);
        formData.append("userId", userInfo.userId);
        formData.append("customAttributeDataString", JSON.stringify(customFields.map((i) => ({ customAttributeID: i.id, data: i.data }))));
        selectedGroupValue && selectedGroupValue.length > 0 ? formData.append("personGroups", JSON.stringify(selectedGroupValue.map(i => ({ groupId: i.id })))) : null
        if (imageValue) {
            formData.append("picture", {
                uri: imageValue.uri,
                type: imageValue.type,
                name: imageValue.fileName
            });
        } else if (pictureUrl) {
            formData.append("pictureUrl", pictureUrl);
        }

        try {
            const { data } = await SendUserOTP({ email, phoneNumber, tenantId: churchInfo.tenantId })
            setloading(false)
            navigation.navigate("VerifyUser", { formData, code: data.returnObject.token })
        }
        catch (err) {
            setloading(false)
            console.error(err)
        }
    }

    const syncAndUpdateData = async () => {

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("mobilePhone", phoneNumber);
        formData.append("homeAddress", address);
        formData.append("occupation", occupation);
        formData.append("dayOfBirth", birthday);
        formData.append("monthOfBirth", months.indexOf(birthMonth + 1));
        formData.append("yearOfBirth", birthYear);
        formData.append("dayOfWedding", weddingDay);
        formData.append("monthOfWedding", months.indexOf(weddingMonth + 1));
        formData.append("yearOfWedding", weddingYear);
        formData.append("genderId", selectedGenderValue.id ? selectedGenderValue.id : "");
        formData.append("maritalStatusId", selectedMaritalStatus.id ? selectedMaritalStatus.id : "");
        formData.append("about", commentMessage);
        formData.append("tenantId", churchInfo.tenantId);
        formData.append("userId", userInfo.userId);
        formData.append("customAttributeDataString", JSON.stringify(customFields.map((i) => ({ customAttributeID: i.id, data: i.data }))));
        selectedGroupValue && selectedGroupValue.length > 0 ? formData.append("personGroups", JSON.stringify(selectedGroupValue.map(i => ({ groupId: i.id })))) : null
        if (imageValue) {
            formData.append("picture", {
                uri: imageValue.uri,
                type: imageValue.type,
                name: imageValue.fileName
            });
        } else if (pictureUrl) {
            formData.append("pictureUrl", pictureUrl);
        }

        try {
            let { data } = await SyncAndUpdateData(formData);
            setloading(false)

            if (data.status) {
                // update the state with the personID
                dispatch(updateUserInfo({ personID: data.returnObject.person.personId }))

                // Update the user data in localstorage with the personID
                const value = await AsyncStorage.getItem("user")
                const parsedValue = JSON.parse(value);
                parsedValue.personID = data.returnObject.person.personId;
                const stringified = JSON.stringify(parsedValue)
                await AsyncStorage.setItem("user", stringified)
                navigation.navigate('SuccessProfileUpdate');
            }
        } catch (error) {
            console.error(error)
            setloading(false)
        }
    }

    const handleSubmit = () => {
        checkUserSyncedData();
        toggleSwitch(true); // Now this will use the passed function
    }

    const getLookUps = async () => {
        try {
            let { data } = await GetLookUps();
            const findGender = data.find(i => i.type.toLowerCase() === 'gender').lookUps
            const findMaritalStatus = data.find(i => i.type.toLowerCase() === 'maritalstatus').lookUps
            setGender(findGender)
            setMaritalStatus(findMaritalStatus)

            if (userInfo?.personID) {
                getUserProfile();
            }
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

    const [fullData, setFullData] = useState("")
    const [defaultGender, setDefaultGender] = useState({})
    const [defaultMaritalStatus, setDefaultMaritalStatus] = useState({})
    const [defaultGroup, setDefaultGroup] = useState({})
    const [pictureUrl, setPictureUrl] = useState("")
    const [defaultBirthDay, setDefaultBirthDay] = useState("")
    const [defaultBirthMonth, setDefaultBirthMonth] = useState(null)
    const [defaultBirthYear, setDefaultBirthYear] = useState(null)
    const [defaultWeddingDay, setDefaultWeddingDay] = useState("")
    const [defaultWeddingMonth, setDefaultWeddingMonth] = useState("")
    const [defaultWeddingYear, setDefaultWeddingYear] = useState("")

    useEffect(() => {
        if (birthday) {
            setDefaultBirthDay({
                label: birthday,
                value: birthday
            })
        }
        if (birthMonth) {
            setDefaultBirthMonth({
                label: birthMonth,
                value: birthMonth
            })
        }
        if (birthYear) {
            setDefaultBirthYear({
                label: birthYear,
                value: birthYear
            })
        }

        if (weddingDay) {
            setDefaultWeddingDay({
                key: weddingDay,
                value: weddingDay
            })
        }

        if (weddingMonth) {
            setDefaultWeddingMonth({
                key: weddingMonth,
                value: weddingMonth
            })
        }

        if (weddingYear) {
            setDefaultWeddingYear({
                key: weddingYear,
                value: weddingYear
            })
        }


        if (fullData.maritalStatusID) {
            const pickedmaritalstatus = maritalStatus.find(i => i.id === fullData.maritalStatusID);
            setSelectedMaritalStatusData({
                label: pickedmaritalstatus?.value,
                value: pickedmaritalstatus?.id
            })
            setSelectedMaritalStatusValue(pickedmaritalstatus)
        }
    }, [birthday, birthMonth, birthYear, weddingDay, weddingMonth, weddingYear, gender, maritalStatus, fullData.genderID, selectedGenderValue])

    useEffect(() => {
        const value = fullData && fullData?.peopleInGroups[0] && fullData?.peopleInGroups[0]?.groupId
        const pickedgroup = churchGroups.find(i => i.id == value)
        setDefaultGroup({
            label: pickedgroup?.name,
            value: pickedgroup?.id
        })
        setSelectedGroupValue(pickedgroup)

        if (fullData?.genderID) {
            const pickedgender = gender.find(i => i.id == fullData?.genderID)
            setSelectedGenderData({
                label: pickedgender?.value,
                value: pickedgender?.id
            })
            setSelectedGenderValue(pickedgender)
        }
    }, [churchGroups, fullData])

    const getUserProfile = async () => {
        setPageLoading(true);
        try {
            const { data } = await GetUserProfile(userInfo?.personID);
            setPageLoading(false);
            setFullData(data)
            setCommentMessage(data.about || "")
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "")
            setPhoneNumber(data.mobilePhone || "");
            setAddress(data.homeAddress || "")
            setOccupation(data.occupation || "")
            setPictureUrl(data.pictureUrl || "")
            setSelectedGroupValue(data.peopleInGroups)
            setBirthday(data.dayOfBirth?.toString())
            setBirthMonth(months[data?.monthOfBirth - 1])
            setBirthYear(data.yearOfBirth?.toString())
            setWeddingDay(data.dayOfWedding?.toString())
            setWeddingMonth(months[data?.monthOfWedding - 1])
            setWeddingYear(data.yearOfWedding?.toString())
        }
        catch (error) {
            setPageLoading(false);
            console.error(error)
        }
    }

    const getCustomFields = async () => {
        try {
            const { data } = await GetAllCustomFields(churchInfo.tenantId);
            setCustomFields(data.sort((a, b) => a.order - b.order))
        }
        catch (error) {
            console.error(error)
        }
    }

    // useEffect(() => {
    //     const customValue = fullData && JSON.parse(fullData?.customAttributeDataString)
    //     if (customValue && customValue.length > 0 && customFields.length > 0) {
    //         const updateCustomFieldData = customFields.map(i => {
    //             const item = customValue.find(j => j.customAttributeID === i.id);
    //             i.data = item.data
    //             return i;
    //         })
    //         setCustomFields(updateCustomFieldData.sort((a, b) => a.order - b.order))
    //         console.log(customFields, 'updatedcustomefield')
    //     }
    // }, [fullData, customFields])

    const setCustomDataValue = (value, index) => {
        const copy = [...customFields];
        copy[index].data = value;
        setCustomFields(copy);
        setCustomDateDialog(false)
    }

    const setCheckBoxValue = (value) => {
        setSelectedGroupValue(value)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
                <View style={{ paddingBottom: 80 }}>
                    <StackHeader title="Manage Info" goBack={() => navigation.goBack()} />
                    <View>
                        <View style={{ position: "relative", alignSelf: "center", marginTop: 20 }}>
                            <Image source={{ uri: imageValue.uri ? imageValue.uri : pictureUrl ? pictureUrl : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/640px-No-Image-Placeholder.svg.png' }} resizeMode='cover' style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center' }} />
                            <Button buttonColor="#F7F7F7" textColor="#7C7C7C" icon="camera-outline" style={{ marginTop: 15, borderRadius: 10 }} mode="contained" onPress={requestCameraPermission}>
                                Select picture
                            </Button>
                        </View>
                        {
                            pageloading ? (
                                <View style={{ marginTop: 15 }}>
                                    <ActivityIndicator size={25} color={COLORS.primary} />
                                </View>
                            ) : null
                        }
                        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                            <Text style={{ fontFamily: Fonts.bold, color: COLORS.black, marginBottom: 10 }}>Bio:</Text>
                            <TextArea placeholder="Write your bio here..." onChangeText={setCommentMessage} value={commentMessage} multiline={true} numberOfLines={3} style={{ backgroundColor: "#F3F3F3", padding: 10 }} noOutline />

                            <Text style={{ fontFamily: Fonts.bold, color: COLORS.black, marginBottom: 10, marginTop: 20 }}>Personal Information</Text>
                            <Input placeholder="First name" onChangeText={setFirstName} value={firstName} style={{ backgroundColor: '#F3F3F3' }} noOutline />
                            <Input placeholder="Last name" onChangeText={setLastName} value={lastName} style={{ backgroundColor: '#F3F3F3', marginTop: 15 }} noOutline />
                            <Input placeholder="Phone Number" onChangeText={setPhoneNumber} value={phoneNumber} style={{ backgroundColor: '#F3F3F3', marginTop: 15 }} noOutline />
                            <Input placeholder="Email" onChangeText={setEmail} value={email} style={{ backgroundColor: '#F3F3F3', marginTop: 15 }} noOutline disabled />
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                                <SelectDropdown
                                    data={gender.map(i => ({ label: i.value, value: i.id }))}
                                    search={false}
                                    value={selectedGender}
                                    placeholder={"Gender"}
                                    setValue={(value) => setSelectedGender(value)}
                                    selectStyles={{ width: (width / 2) - 30, backgroundColor: '#F3F3F3', borderWidth: 0 }}
                                />
                                <SelectDropdown
                                    data={maritalStatus.map(i => ({ label: i.value, value: i.id }))}
                                    search={false}
                                    value={selectedMaritalStatusData}
                                    placeholder={"Marital Status"}
                                    setValue={(value) => setSelectedMaritalStatus(value)}
                                    selectStyles={{ width: (width / 2) - 30, backgroundColor: '#F3F3F3', borderWidth: 0 }}
                                />
                                {/* <Dropdown data={gender.map(i => ({ key: i.id, value: i.value }))} placeholder="Gender" search={false} styles={{ width: (width / 2) - 30, backgroundColor: '#F3F3F3', borderWidth: 0 }} setSelected={setSelectedGender} defaultOption={defaultGender} /> */}
                                {/* <Dropdown data={maritalStatus.map(i => ({ key: i.id, value: i.value }))} placeholder="Marital status" search={false} styles={{ width: (width / 2) - 30, backgroundColor: '#F3F3F3', borderWidth: 0 }} setSelected={setSelectedMaritalStatus} defaultOption={defaultMaritalStatus} /> */}
                            </View>
                            <Input placeholder="Address" onChangeText={setAddress} value={address} style={{ backgroundColor: '#F3F3F3', marginTop: 15 }} noOutline />
                            <Input placeholder="Occupation" onChangeText={setOccupation} value={occupation} style={{ backgroundColor: '#F3F3F3', marginTop: 15 }} noOutline />
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                            <Text style={{ fontFamily: Fonts.bold, color: COLORS.black, marginBottom: 10 }}>Birthday</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <SelectDropdown
                                    data={daysinMonth.map(i => ({ label: i.toString(), value: i.toString() }))}
                                    search={false}
                                    value={defaultBirthDay}
                                    placeholder={"Day"}
                                    setValue={(value) => setBirthday(value)}
                                    selectStyles={{ backgroundColor: '#F3F3F3', borderWidth: 0, width: "33%" }}
                                />
                                <SelectDropdown
                                    data={months.map(i => ({ label: i, value: i }))}
                                    search={false}
                                    value={defaultBirthMonth}
                                    placeholder={"Month"}
                                    setValue={(value) => setBirthMonth(value)}
                                    selectStyles={{ backgroundColor: '#F3F3F3', borderWidth: 0, width: "33%" }}
                                />
                                <SelectDropdown
                                    data={birthYearsArr.map(i => ({ label: i.toString(), value: i.toString() }))}
                                    search={false}
                                    value={defaultBirthYear}
                                    placeholder={"Year"}
                                    setValue={(value) => setBirthYear(value)}
                                    selectStyles={{ backgroundColor: '#F3F3F3', borderWidth: 0, width: "33%" }}
                                />
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                            <Text style={{ fontFamily: Fonts.bold, color: COLORS.black, marginBottom: 10 }}>Wedding Anniversary</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <SelectDropdown
                                    data={daysinMonth.map(i => ({ label: i.toString(), value: i.toString() }))}
                                    search={false}
                                    value={defaultWeddingDay}
                                    placeholder={"Day"}
                                    setValue={(value) => setWeddingDay(value)}
                                    selectStyles={{ backgroundColor: '#F3F3F3', borderWidth: 0, width: "33%" }}
                                />
                                <SelectDropdown
                                    data={months.map(i => ({ label: i, value: i }))}
                                    search={false}
                                    value={defaultWeddingMonth}
                                    placeholder={"Month"}
                                    setValue={(value) => setWeddingMonth(value)}
                                    selectStyles={{ backgroundColor: '#F3F3F3', borderWidth: 0, width: "33%" }}
                                />
                                <SelectDropdown
                                    data={birthYearsArr.map(i => ({ label: i.toString(), value: i.toString() }))}
                                    search={false}
                                    value={defaultWeddingYear}
                                    placeholder={"Year"}
                                    setValue={(value) => setWeddingYear(value)}
                                    selectStyles={{ backgroundColor: '#F3F3F3', borderWidth: 0, width: "33%" }}
                                />
                                {/* <Dropdown
                                        data={daysinMonth.map(i => ({ key: i, value: i }))}
                                        placeholder="Day"
                                        search={false}
                                        styles={{ backgroundColor: '#F3F3F3', borderWidth: 0 }}
                                        setSelected={(value) => setWeddingDay(value)}
                                        defaultOption={defaultWeddingDay}
                                    /> */}
                                {/* <Dropdown
                                        data={months.map(i => ({ key: i, value: i }))}
                                        placeholder="Month"
                                        search={false}
                                        styles={{ backgroundColor: '#F3F3F3', borderWidth: 0 }}
                                        setSelected={(value) => setWeddingMonth(value)}
                                        defaultOption={defaultWeddingMonth}
                                    /> */}
                                {/* <Dropdown
                                        data={birthYearsArr.map(i => ({ key: i, value: i }))}
                                        placeholder="Year"
                                        search={false}
                                        styles={{ backgroundColor: '#F3F3F3', borderWidth: 0 }}
                                        setSelected={(value) => setWeddingYear(value)}
                                        defaultOption={defaultWeddingYear}
                                    /> */}
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                            <Text style={{ fontFamily: Fonts.bold, color: COLORS.black, marginBottom: 10 }}>Others</Text>
                            {/* <SelectDropdown
                                    data={churchGroups.map(i => ({ label: i.name, value: i.id }))}
                                    search={true}
                                    value={defaultGroup}
                                    placeholder={"Choose Group"}
                                    setValue={setSelectedGroup}
                                    selectStyles={{ backgroundColor: '#F3F3F3', borderWidth: 0 }}
                                /> */}
                            {/* <Dropdown data={churchGroups.map(i => ({ key: i.id, value: i.name }))} placeholder="Choose Group" search={true} styles={{ width: "100%", backgroundColor: '#F3F3F3', borderWidth: 0 }} setSelected={setSelectedGroup} defaultOption={defaultGroup} /> */}
                            {/* <TouchableRipple rippleColor="#eee" style={{ marginTop: 30, marginBottom: 15, padding: 13, borderRadius: 15, backgroundColor: COLORS.primary }} onPress={handleSubmit}>
                                <Text style={{ fontFamily: Fonts.medium, color: COLORS.white, textAlign: 'center' }}>Save</Text>
                            </TouchableRipple> */}
                            {
                                selectedGroupValue?.length > 0 ?
                                    selectedGroupValue.map((item, index) => (
                                        <Chip icon="circle" textStyle={{ color: COLORS.black }} style={{ backgroundColor: '#F3F3F3', marginTop: 5 }} onPress={() => console.log('Pressed')} key={index}>{item.name}</Chip>
                                    )) : null
                            }
                            <TouchableOpacity style={{ ...styles.button, marginTop: 15 }} onPress={() => setGroupDialog(true)}>
                                <Text>Choose group</Text>
                            </TouchableOpacity>
                            <CenteredModal visible={groupDialog} closeModal={() => setGroupDialog(false)}>
                                <View style={styles.groupModal}>
                                    <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center", marginTop: 10 }}>Choose your group</Text>
                                    <FlatList
                                        data={[1]}
                                        renderItem={() => (
                                            <View style={{ padding: 10, paddingTop: 15 }}>
                                                <TreeSelect
                                                    data={churchGroups}
                                                    setCheckBoxValue={setCheckBoxValue}
                                                />
                                            </View>
                                        )}
                                        keyExtractor={(_, index) => index}
                                    />
                                </View>
                            </CenteredModal>
                            <View>
                                {
                                    customFields.length > 0 ?
                                        customFields.map((item, index) => (
                                            item.controlType == 0 || item.controlType == 8 || item.controlType == 4 ?
                                                <Input placeholder={item.label} onChangeText={(value) => setCustomDataValue(value, index)} value={item.data} style={{ backgroundColor: '#F3F3F3', marginTop: 15 }} noOutline key={index} />
                                                : item.controlType == 1 ?
                                                    <SelectDropdown
                                                        data={item?.parameterValues?.split(",").map(i => ({ label: i, value: i }))}
                                                        search={false}
                                                        value={item.data}
                                                        placeholder={item.label}
                                                        setValue={(value) => setCustomDataValue(value, index)}
                                                        selectStyles={{ backgroundColor: '#F3F3F3', borderWidth: 0, marginTop: 15 }}
                                                        key={index}
                                                    />
                                                    // <Dropdown data={item?.parameterValues?.split(",").map(i => ({ key: i, value: i }))} placeholder={item.label} search={true} styles={{ width: "100%", backgroundColor: '#F3F3F3', borderWidth: 0, marginTop: 15 }} key={index} setSelected={(value) => setCustomDataValue(value, index)} />
                                                    : item.controlType == 3 ?
                                                        <View key={index}>
                                                            <TouchableOpacity style={{ ...styles.button, marginTop: 15 }} onPress={() => setCustomDateDialog(true)}>
                                                                <Text>{item.data ? dateFormatter.monthDayYear(item.data) : item.label}</Text>
                                                                {/* <Text>{item.data ? item.data : item.label}</Text> */}
                                                            </TouchableOpacity>
                                                            <CenteredModal visible={customDateDialog} closeModal={() => setCustomDateDialog(false)}>
                                                                <View style={styles.datePicker}>
                                                                    <DatePicker date={item.data} setDate={(value) => setCustomDataValue(value, index)} selectedItemColor={COLORS.primary} />
                                                                </View>
                                                            </CenteredModal>
                                                        </View>
                                                        : item.controlType == 7 ?
                                                            <Button buttonColor="#F7F7F7" textColor="#7C7C7C" icon="camera-outline" style={{ marginTop: 15, borderRadius: 10 }} mode="contained" onPress={() => requestCameraPermission('custom', index)} key={index}>
                                                                {item.label}
                                                            </Button>
                                                            : item.controlType == 2 ?
                                                                <View style={{ marginTop: 15, flexDirection: "row", alignItems: "center" }} key={index}>
                                                                    <View style={{ borderWidth: Platform.OS == 'ios' ? 1 : 0, borderColor: COLORS.primary, borderRadius: 50, marginRight: Platform.OS == 'ios' ? 5 : 0 }}>
                                                                    <Checkbox
                                                                        status={item.data ? 'checked' : 'unchecked'}
                                                                        color={COLORS.primary}
                                                                        onPress={() => {
                                                                            setCustomDataValue(!item.data, index)
                                                                        }}
                                                                    />
                                                                    </View>
                                                                    <Text>{item.label}</Text>
                                                                </View>
                                                                : null
                                        )) : null
                                }
                            </View>
                            <Button textColor="#FFFFFF" loading={loading} style={{ marginTop: 30, marginBottom: 15, padding: 3, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={handleSubmit}>
                                <Text style={styles.textmedium}>Save</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#F3F3F3",
        padding: 13,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    datePicker: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        backgroundColor: 'white'
    },
    groupModal: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 15,
        paddingBottom: 0,
        backgroundColor: 'white',
        height: "70%",
    }
})

export default ManageProfile;