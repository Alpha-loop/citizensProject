import { Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { COLORS, Fonts, height } from "../../assets/Theme";
import { Button } from "react-native-paper";

const SuccessCheckin = ({ navigation }) => {
    return (
        <>
            <StatusBar barStyle={"dark-content"} backgroundColor={COLORS.white} />
            <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
                <View style={styles.statuscontainer}>
                    <Image source={require("../../assets/img/verified.gif")} resizeMode="contain" style={{ width: 100, height: 100 }} />
                    <View>
                      <Text style={styles.statustext}>Your Check-in was</Text>
                      <Text style={[styles.statustext, { textAlign: "center" }]}>Successful</Text>

                      <View style={{ marginHorizontal: 30, marginTop: 30, marginBottom: 40 }}>
                        <Button textColor="#FFFFFF" style={{ marginTop: 30, marginBottom: 15, padding: 3, borderRadius: 60, backgroundColor: COLORS.primary }} mode="contained" onPress={() => navigation.navigate("Home")}>
                            <Text style={{ fontFamily: Fonts.medium}}>Done</Text>
                        </Button>
                      </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    statustext: {
        color: "#000000CC",
        fontFamily: Fonts.semibold,
        fontSize: 18,
        textAlign: "center"
    },
    statuscontainer: {
        alignItems: "center",
        justifyContent: "center",
        height: height
    }
})

export default SuccessCheckin;