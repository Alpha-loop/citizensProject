
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { COLORS, Fonts } from "../../assets/Theme";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { updateNetworkStatus } from "../../redux/userSlice";
import { useDispatch } from 'react-redux';
import { Button } from "react-native-paper";


export const NoNetworkView = ({ triggerRequest }) => {
    return (
        <View>
            <Text style={{ fontFamily: Fonts.black, fontSize: 20, textAlign: "center", color: COLORS.black }}>No network</Text>
            <Text style={{ color: COLORS.black, textAlign: "center" }}>You dont have an internet connection,</Text>
            <Text style={{ color: COLORS.black, textAlign: "center" }}>click reload when connected to an internet.</Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button textColor="#FFFFFF" style={{ marginTop: 15, borderRadius: 15, backgroundColor: COLORS.primary }} mode="contained" onPress={() => triggerRequest()}>
                <Text style={{ fontFamily: Fonts.medium }}>Reload</Text>
            </Button>
            </View>
        </View>
    );
}

const NetworkConectivityStatus = () => {
    const [connectionStatus, setConnectionStatus] = useState(true);
    const [heightAnim] = useState(new Animated.Value(0));
    const dispatch = useDispatch();

    const handleNetworkChange = (state) => {
        dispatch(updateNetworkStatus(state.isConnected));
        setConnectionStatus(state.isConnected);
    };

    useEffect(() => {
        const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
        return () => {
            netInfoSubscription && netInfoSubscription();
        };
    }, []);

    useEffect(() => {
        // Update height animation when connectionStatus changes
        Animated.timing(
            heightAnim,
            {
                toValue: connectionStatus ? 0 : 30, // Change the height value as needed
                duration: 200, // Duration of the animation in milliseconds
                useNativeDriver: false // Specify if you want to use native driver
            }
        ).start();
    }, [connectionStatus]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.wrapper, { height: heightAnim }]}>
                <Text style={styles.text}>{!connectionStatus ? "🛑 You don't have a network connection" : null}</Text>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%'
    },
    wrapper: {
        paddingHorizontal: 15,
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        // position: 'absolute',
        // top: 10,
        // zIndex: 100,
        // elevation: 100
    },
    text: {
        fontFamily: Fonts.medium,
        fontSize: 12,
        color: COLORS.black,
        alignSelf: 'center',
        textAlign: 'center'
    }
});

export default NetworkConectivityStatus;