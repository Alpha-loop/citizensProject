import * as React from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions, StatusBar } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import FirstScreen from './FirstScreen';
import SecondScreen from './SecondScreen';
import ThirdScreen from './ThirdScreen';
import { COLORS, Fonts } from '../../assets/Theme';
import { TouchableRipple } from "react-native-paper";
import { useSelector, useDispatch } from 'react-redux';
import usePushNotification from '../../utils/usePushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setChurch } from '../../redux/userSlice';


const renderScene = SceneMap({
    first: FirstScreen,
    second: SecondScreen,
    third: ThirdScreen,
});

export default function OnboardTabs({ navigation }) {
    const layout = useWindowDimensions();
    const dispatch = useDispatch()
    const { subscribeTopic } = usePushNotification();
    const [index, setIndex] = React.useState(0);
    const [intervalId, setIntervalId] = React.useState(null);
    const [routes] = React.useState([
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
        { key: 'third', title: 'Third' },
    ]);

    React.useEffect(() => {
        // Start auto-swiping tabs
        const id = setInterval(() => {
          // Calculate next index, looping back to 0 if at the end
          const nextIndex = (index + 1) % routes.length;
          setIndex(nextIndex);
        }, 3000); // Change 5000 to the desired interval in milliseconds
    
        // Save the interval ID for cleanup
        setIntervalId(id);
    
        // Clear the interval when the component unmounts
        return () => clearInterval(id);
      }, [index]); // Include index in the dependencies to trigger effect on index change
    
      const onProceed = async () => {
        try {
            clearInterval(intervalId);
            const tenantId = "b2d434ab-970d-477f-a2aa-4090d499f2e7";

            // Handle both subscriptions
            await Promise.allSettled([
            subscribeTopic(`media${tenantId}`),
            subscribeTopic(`feed${tenantId}`)
            ]);

            // Sequential operations
            await AsyncStorage.setItem("church", JSON.stringify({ tenantId }));
            dispatch(setChurch({ tenantId }));
            navigation.navigate("Login");
        } catch (error) {
            console.error('Proceed failed:', error);
            // Consider showing an alert to the user
            Alert.alert('Error', 'Failed to proceed: ' + error.message);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <StatusBar backgroundColor="#124191" />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                tabBarPosition='none'
                initialLayout={{ width: layout.width }}
            />
            <TouchableRipple rippleColor="rgba(0, 0, 0, 0.1)" borderLess={true} style={{ backgroundColor: COLORS.white, borderRadius: 15, marginHorizontal: 20, marginBottom: 20, paddingVertical: 13 }} onPress={onProceed}>
                <Text style={{ textAlign: 'center', fontFamily: Fonts.semibold, color: COLORS.black }}>Get Started</Text>
            </TouchableRipple>
            {/* <View style={{ flexDirection: "row", paddingHorizontal: 20, justifyContent: "space-between", gap: 5 }}>
                <Text style={{ fontFamily: Fonts.regular, color: "white", fontSize: 12, marginBottom: 10 }}>
                    By Creating account, you are giving The Citizens Church Right to use your information Lawfully and also Agree to our Terms and Conditions.
                </Text>
                <CheckConfirm size={20} />
            </View> */}
        </View>

    );
}