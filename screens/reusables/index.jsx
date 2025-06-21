import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../assets/Theme";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from "../../assets/Theme";

export const StackHeader = ({ goBack, title, newStack, headerRight }) => {
    return (
        <View style={{ backgroundColor: COLORS.primary, height: 50 }}>
            <View style={{ paddingVertical: 15, paddingHorizontal: newStack ? 15 : 0 }}>
                <Text style={{ fontFamily: Fonts.medium, color: COLORS.white, textAlign: newStack ? 'left' : 'center', fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>{title}</Text>
                {
                    !newStack ? (
                        <TouchableOpacity onPress={goBack} style={{ position: 'relative', bottom: 20, left: 20, width: 40 }}>
                            <Icon name={"arrow-back-ios"} color={COLORS.white} size={20} />
                        </TouchableOpacity>
                    ) : null
                }
                {
                    headerRight ? (
                        <View style={{ position: "absolute", right: 20, top: 17 }} >
                            {headerRight}
                        </View>
                    ) : null
                }
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 15 }}> */}
                    {/* <View style={{ width: 100 }}></View> */}
                {/* </View> .   */}
            </View>
        </View>
    );
}