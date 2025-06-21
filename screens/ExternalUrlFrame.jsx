import { COLORS, height } from "../assets/Theme";
import { StackHeader } from "./reusables/index";
import { WebView } from 'react-native-webview';
import { SafeAreaView, View, ActivityIndicator } from "react-native";
import { useState } from "react";

const ExternalUrlFrame = ({ navigation, route }) => {
    const { title, uri } = route.params;
    const [visible, setVisible] = useState(true)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StackHeader title={title} goBack={() => navigation.goBack()} />
            <WebViewLoader uri={uri} setVisible={() => setVisible(false)} />
            {
                visible ? (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 50 }}>
                        <ActivityIndicator color={COLORS.primary} size={25} />
                    </View>
                ) : null
            }
        </SafeAreaView>
    );
}

const WebViewLoader = ({ uri, setVisible }) => <WebView source={{ uri: uri }} onLoad={setVisible} />

export default ExternalUrlFrame;