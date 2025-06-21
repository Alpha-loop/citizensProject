import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, Modal, StyleSheet, Platform, PermissionsAndroid, ActivityIndicator } from "react-native";
import { COLORS, Fonts, width } from "../../assets/Theme";
import { StackHeader } from "../reusables/index";
import { TouchableRipple } from "react-native-paper";
import { BarcodeIcon, CloseIcon, MapPin } from "../../assets/img/icons";
import dateFormatter from "../../utils/dateFormatter";
import AutoHeightImage from 'react-native-auto-height-image';
import { useEffect, useState } from "react";
import { SwipeModal } from "../reusables/Modal";
import { CheckUserSyncedData, GetAttendanceQRCode } from "../../services/service";
import { useSelector } from "react-redux";
import { Button } from "react-native-paper";
import Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CheckinAttendanceByLocation } from "../../services/service";

const EventDetails = ({ navigation, route }) => {
    const { data } = route.params;
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const [displayQRCode, setDisplayQRCode] = useState(false);
    const [QRCode, setQRCode] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [locationModalVisible, setLocationModalVisible] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const [profileUpdated, setProfileUpdated] = useState(false);
    const [checkingProfileStatus, isCheckingProfileStatus] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [personId, setPersonId] = useState(null);
    let checkinAttendanceId = data.id;

    console.log("This is data: ", data);

    useEffect(() => {
        getQRCode();
    }, []);

    const getQRCode = async () => {
        let payload = {
            userId: userInfo.userId,
            attendanceCode: data.attendanceCode,
            tenantId: churchInfo.tenantId
        };
        try {
            let { data } = await GetAttendanceQRCode(payload);
            setQRCode(data.returnObject);
        } catch (error) {
            console.error(error);
        }
    };

    const ScanCode = () => {
        setDisplayQRCode(true);
    };

    const getUserLocation = async () => {
        try {
            // 1. Check/Request Location Permission
            let hasPermission = false;
            
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location',
                        buttonPositive: 'OK',
                    }
                );
                hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
            } else { // iOS
                const status = await Geolocation.requestAuthorization('whenInUse');
                hasPermission = status === 'granted';
            }

            if (!hasPermission) {
                throw new Error('Location permission denied');
            }

            // 2. Get Current Position
            return new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            success: true,
                            coords: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy
                            }
                        });
                    },
                    (error) => {
                        let errorMessage = 'Failed to get location';
                        switch(error.code) {
                            case 1: errorMessage = 'Permission denied'; break;
                            case 2: errorMessage = 'Position unavailable'; break;
                            case 3: errorMessage = 'Timeout - try moving outdoors'; break;
                        }
                        reject(new Error(errorMessage));
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000
                    }
                );
            });
            
        } catch (error) {
            throw error; // Re-throw any errors
        }
    };

    const handleGetLocation = async () => {
        setIsLoadingLocation(true);
        setLocationModalVisible(true);
        setError(null);

        try {
            const result = await getUserLocation();
            if (result.success) {
                const userLat = result.coords.latitude;
                const userLon = result.coords.longitude;

                console.log("User Location:", userLat, userLon);

                setUserLocation({
                    latitude: userLat,
                    longitude: userLon,
                    accuracy: result.coords.accuracy,
                });

                // Assuming event location is available in data.latitude and data.longitude
                const eventLat = data.latitude; // Adjust field name if different
                const eventLon = data.longitude; // Adjust field name if different

                if (!eventLat || !eventLon) {
                    throw new Error("Event location data is missing");
                }

                // Calculate distance using Haversine formula
                const distance = calculateDistance(userLat, userLon, eventLat, eventLon);

                // Check if user is within 30 meters
                // if (distance <= 30) {
                //     console.log("You are within the vicinity of this event...please check in");
                    
                // } else {
                //     console.log("You are not within the vicinity of the event please get to the event location");
                //     alert("You are not within the vicinity of the event please get to the event location");
                // }
            }
        } catch (error) {
            console.error('Location error:', error.message);
            setError(error.message);
        } finally {
            setIsLoadingLocation(false);
        }
    };

    // Haversine formula to calculate distance between two points (in meters)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180; // Latitude 1 in radians
        const φ2 = (lat2 * Math.PI) / 180; // Latitude 2 in radians
        const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Difference in latitude
        const Δλ = ((lon2 - lon1) * Math.PI) / 180; // Difference in longitude

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in meters
        return distance;
    };
    

    const checkUserSyncedData = async () => {
        isCheckingProfileStatus(true);
        let payload = {
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber, // You might want this too
            tenantId: churchInfo.tenantId
        };

        try {
            const { data } = await CheckUserSyncedData(payload);
            console.log("CheckUserSyncedData response: ", data);

            setIsNewUser(data.returnObject.isNewUser);
            
            if (data.returnObject.personId) {
                setPersonId(data.returnObject.personId); // Update state instead
            }
            
            isCheckingProfileStatus(false);
            return data.returnObject.personId; // Return the value for optional chaining
        } catch (err) {
            console.error(err);
            isCheckingProfileStatus(false);
            return null;
        }
    };

    const handleCheckIn = async () => {
        // Wait for the check to complete
        const personId = await checkUserSyncedData();

        // Only proceed if we have a personId
        if (!personId) {
            alert("Unable to verify user information");
            navigateToProfile();
            return;
        }

        try {
            let payload = {
                person: { personId: personId }, // Use the returned value
                checkinAttendanceId: checkinAttendanceId,
                checkinChannel: 6
            };

            console.log('payload: ', payload);
            await CheckinAttendanceByLocation(payload);
            navigation.navigate('SuccessCheckin');
        } catch (err) {
            console.error(err);
            isCheckingProfileStatus(false);
            alert("Check-in failed. Please try again.");
        }
    };

    const navigateToProfile = () => {
        setTimeout(() => {
            navigation.navigate('ManageProfile');
        }, 400);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <ScrollView>
                <View>
                    <StackHeader title="Check In" goBack={() => navigation.goBack()} />
                    {data.uri && (
                        <View>
                            <AutoHeightImage width={width} source={{ uri: data.bannerUrl }} />
                        </View>
                    )}
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontFamily: Fonts.medium, fontSize: 16, color: "rgba(0, 0, 0, 0.8)", fontWeight: 700, marginTop: 2 }}>{data.fullEventName}</Text>
                        <Text style={{ fontFamily: Fonts.light, color: "rgba(2, 2, 2, 0.6)", fontSize: 13, marginTop: 10 }}>{data.eventDetails}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
                            <View>
                                <Text style={{ fontFamily: Fonts.light, color: COLORS.black, fontSize: 13 }}>group</Text>
                                <Text style={{ fontFamily: Fonts.medium, fontSize: 15, color: "rgba(0, 0, 0, 0.8)", fontWeight: 600, marginTop: 1 }}>{data.fullGroupName}</Text>
                            </View>
                            <View>
                                <Text style={{ fontFamily: Fonts.light, color: COLORS.black, fontSize: 13 }}>Date</Text>
                                <Text style={{ fontFamily: Fonts.medium, fontSize: 15, color: "rgba(0, 0, 0, 0.8)", fontWeight: 600, marginTop: 1 }}>{dateFormatter.monthDayYear(data.eventDate)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
                <TouchableOpacity onPress={handleGetLocation}>
                    <TouchableRipple rippleColor="#eee" style={{ marginTop: 30, padding: 13, borderRadius: 10, backgroundColor: "rgba(3, 157, 244, 0.8)" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 }}>
                            <MapPin size={30} color={'white'} />
                            <Text style={{ fontFamily: Fonts.medium, color: COLORS.white, textAlign: 'center' }}>Location based check-in</Text>
                        </View>
                    </TouchableRipple>
                </TouchableOpacity>

                <TouchableRipple rippleColor="#eee" style={{ marginTop: 10, padding: 13, marginBottom: 15, borderRadius: 10, backgroundColor: "rgba(4, 54, 81, 1)" }} onPress={ScanCode}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 }}>
                        <BarcodeIcon size={30} color={'white'} />
                        <Text style={{ fontFamily: Fonts.medium, color: COLORS.white, textAlign: 'center' }}> Scan a QRcode</Text>
                    </View>
                </TouchableRipple>
            </View>
            
            <ScanQRModal 
                scanQRModal={displayQRCode} 
                setScanQRModal={() => setDisplayQRCode(false)} 
                data={QRCode} 
                userInfo={userInfo} 
                churchInfo={churchInfo} 
                navigation={navigation} 
            />
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={locationModalVisible}
                onRequestClose={() => setLocationModalVisible(false)}
                userInfo={userInfo} 
                churchInfo={churchInfo}
                navigation={navigation}
                isNewUser={isNewUser}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity 
                            onPress={() => setLocationModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <CloseIcon />
                        </TouchableOpacity>
                        
                        {error ? (
                            <View style={styles.errorContainer}>
                                <MaterialIcons name="gps-off" size={50} color={COLORS.error} />
                                <Text style={styles.errorText}>{error}</Text>
                                
                                {error.includes('timed out') && (
                                    <View style={styles.tipsContainer}>
                                        <Text style={styles.tipsTitle}>Troubleshooting Tips:</Text>
                                        <Text style={styles.tip}>• Ensure Location is set to "High Accuracy" mode</Text>
                                        <Text style={styles.tip}>• Disable battery saver/power saving mode</Text>
                                        <Text style={styles.tip}>• Move to an open area with clear sky view</Text>
                                        <Text style={styles.tip}>• Restart your device if problem persists</Text>
                                    </View>
                                )}
                                
                                <TouchableOpacity 
                                    style={styles.tryAgainButton}
                                    onPress={getUserLocation}
                                >
                                    <Text style={styles.tryAgainText}>Try Again</Text>
                                </TouchableOpacity>
                            </View>
                        ) : isLoadingLocation ? (
                            <>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={styles.loadingText}>Acquiring GPS signal...</Text>
                                <Text style={styles.loadingSubtext}>This may take a few moments</Text>
                            </>
                        ) : userLocation ? (
                            <>
                                <MapPin size={50} color={COLORS.primary} />
                                <Text style={styles.locationTitle}>Location Based</Text>
                                <View style={styles.locationDetails}>
                                    {/* <Text style={styles.locationDetail}>
                                        <Text style={styles.detailLabel}>Latitude: </Text>
                                        {userLocation.latitude.toFixed(6)}
                                    </Text>
                                    <Text style={styles.locationDetail}>
                                        <Text style={styles.detailLabel}>Longitude: </Text>
                                        {userLocation.longitude.toFixed(6)}
                                    </Text> */}
                                    {userLocation.accuracy && (
                                        <Text style={styles.locationDetail}>
                                            <Text style={styles.detailLabel}>Accuracy: </Text>
                                            {userLocation.accuracy.toFixed(2)} meters
                                        </Text>
                                    )}
                                    <Text style={styles.locationDetail}>
                                        <Text style={styles.detailLabel}>Distance to event: </Text>
                                        {calculateDistance(userLocation.latitude, userLocation.longitude, data.latitude, data.longitude).toFixed(2)} meters
                                    </Text>
                                    <Text style={[styles.locationDetail, { color: calculateDistance(userLocation.latitude, userLocation.longitude, data.latitude, data.longitude) <= 30 ? COLORS.green : COLORS.red }]}>
                                        {calculateDistance(userLocation.latitude, userLocation.longitude, data.latitude, data.longitude) <= 30
                                            ? "You are within the vicinity of this event...please check in"
                                            : "You are not within the vicinity of the event please get to the event location"}
                                    </Text>

                                    <TouchableOpacity 
                                        onPress={calculateDistance(userLocation.latitude, userLocation.longitude, data.latitude, data.longitude) <= 30 ? handleCheckIn : null}
                                        disabled={calculateDistance(userLocation.latitude, userLocation.longitude, data.latitude, data.longitude) > 30}
                                        >
                                        <View style={[
                                            styles.checkInButtonContainer,
                                            {
                                            backgroundColor: calculateDistance(userLocation.latitude, userLocation.longitude, data.latitude, data.longitude) <= 30 
                                                ? "rgba(3, 157, 244, 0.8)" 
                                                : "rgba(200, 200, 200, 0.8)",
                                            opacity: calculateDistance(userLocation.latitude, userLocation.longitude, data.latitude, data.longitude) <= 30 ? 1 : 0.6
                                            }
                                        ]}>
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 }}>
                                                {/* <Icon name="check-circle" size={24} color="white" /> */}
                                                <Text style={styles.checkInButtonText}>Check-in to this event</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : isNewUser ? (
                            <>
                                <View>
                                    <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', marginTop: 20 }}>To scan the code, kindly update your profile</Text>
                                    <Button textColor="#FFFFFF" style={{ marginTop: 20, marginBottom: 15, padding: 3, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={navigateToProfile}>
                                        <Text>Update your profile</Text>
                                    </Button>
                                </View>
                            </>
                        ): null}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        paddingBottom: 40,
        minHeight: 300,
    },
    locationTitle: {
        fontSize: 20,
        color: COLORS.primary,
        fontFamily: Fonts.bold,
        marginVertical: 10,
    },
    locationDetails: {
        marginTop: 15,
        width: '100%',
        paddingHorizontal: 20,
    },
    locationDetail: {
        fontSize: 16,
        color: '#555',
        fontFamily: Fonts.medium,
        marginVertical: 8,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: COLORS.black,
    },
    errorContainer: {
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 16,
        fontFamily: Fonts.medium,
        textAlign: 'center',
        marginVertical: 20,
        maxWidth: '80%',
    },
    tipsContainer: {
        marginTop: 15,
        width: '100%',
        paddingHorizontal: 20,
    },
    tipsTitle: {
        fontFamily: Fonts.bold,
        marginBottom: 8,
        color: COLORS.black,
    },
    tip: {
        fontFamily: Fonts.regular,
        marginLeft: 10,
        marginBottom: 5,
        color: '#555',
    },
    loadingText: {
        fontSize: 16,
        color: '#555',
        fontFamily: Fonts.medium,
        marginTop: 20,
    },
    loadingSubtext: {
        fontSize: 14,
        color: '#888',
        fontFamily: Fonts.light,
        marginTop: 5,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 15,
    },
    tryAgainButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        minWidth: 120,
    },
    tryAgainText: {
        color: 'white',
        fontFamily: Fonts.medium,
        textAlign: 'center',
    },
    checkInButtonContainer: {
    marginTop: 10,
    marginBottom: 15,
    padding: 13,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  checkInButtonText: {
    fontFamily: Fonts.medium, 
    color: COLORS.white, 
    textAlign: 'center',
    fontSize: 16
  }
});

const ScanQRModal = ({ scanQRModal, setScanQRModal, data, userInfo, churchInfo, navigation }) => {
    const [profileUpdated, setProfileUpdated] = useState(false);
    const [checkingProfileStatus, isCheckingProfileStatus] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);


    useEffect(() => {
        checkUserSyncedData();
    }, [userInfo, churchInfo]);

    const checkUserSyncedData = async () => {
        isCheckingProfileStatus(true);
        let payload = {
            email: userInfo.email,
            tenantId: churchInfo.tenantId
        };

        try {
            const { data } = await CheckUserSyncedData(payload);
            console.log("CheckUserSyncedData response: ", data);

            if (data.returnObject.isNewUser) {
                setIsNewUser(true);
            } else {
                setIsNewUser(false);
            }
            isCheckingProfileStatus(false);
        }
        catch (err) {
            console.error(err);
            isCheckingProfileStatus(false);
        }
    };

    const navigateToProfile = () => {
        setScanQRModal();
        setTimeout(() => {
            navigation.navigate('ManageProfile');
        }, 400);
    };
    
    return (
        <SwipeModal visible={scanQRModal} closeModal={setScanQRModal} height="80%">
            <TouchableOpacity onPress={setScanQRModal} style={{ position: "absolute", right: 30, top: 15 }}>
                <CloseIcon />
            </TouchableOpacity>
            <View style={{ alignItems: "center", height: "100%", marginTop: -10 }}>
                {!isNewUser ? (
                    <View>
                        <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center" }}>Show this QR Code</Text>
                        <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center", marginTop: -5 }}>at the venue</Text>
                        <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', marginTop: 5 }}>Scan the QR Code Below</Text>
                        <View style={{ marginTop: 20 }}>
                            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
                                {data && (
                                    <Image style={{ width: 250, height: 250, resizeMode: "contain" }} source={{ uri: data }} />
                                )}
                            </View>
                        </View>
                    </View>
                ) : (
                    <>
                        <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', marginTop: 20 }}>To scan the code, kindly update your profile</Text>
                        <Button textColor="#FFFFFF" style={{ marginTop: 20, marginBottom: 15, padding: 3, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={navigateToProfile}>
                            <Text>Update your profile</Text>
                        </Button>
                    </>
                )}
            </View>
        </SwipeModal>
    );
};

export default EventDetails;