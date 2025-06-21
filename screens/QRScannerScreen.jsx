import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, Fonts, width } from '../assets/Theme';

import { useEffect, useState } from 'react';

const QRScannerScreen = ({ navigation }) => {

    // Linking.openURL(e.data).catch(err =>
    //     console.error('An error occured', err)
    // );
    useEffect(() => {
        requestPermission()
    }, [])

    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');

    // const [dynamicHeight, setDynamicHeight] = useState(width);
    // const frameProcessor = useFrameProcessor((frame) => {
    //     'worklet';
    //     runOnJS(setDynamicHeight)('100%');
    // });


    // if (device == null) {
    //     console.log('device no found reaching')
    //     return (
    //         <View>
    //             <Text>Device not found</Text>
    //         </View>
    //     )
    // }
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            // console.log(codes)
            return Alert.alert(`Scanned ${codes[0].value} codes!`)
        }
    })
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ backgroundColor: COLORS.primary, height: 50, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name={"arrow-back-ios"} color={COLORS.white} size={20} />
                </TouchableOpacity>
                <Text style={{ fontFamily: Fonts.bold, fontSize: 16, color: COLORS.white, alignItems: 'center', textAlign: 'center', justifyContent: 'space-around' }}>Mark Attendance</Text>
                <Text style={{}}></Text>
            </View>

            {
                device ? (
                    <Camera style={{ height: 100, flex: 1, }} 
                    // frameProcessor={frameProcessor} 
                    resizeMode='contain' codeScanner={codeScanner} device={device} isActive={true} />
                ) : (
                    <View>
                        <Text>Device not found</Text>
                    </View>
                )
            }

        </SafeAreaView>
    )
}

export default QRScannerScreen

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
})