import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { CalendarCheck } from "../../assets/img/icons";
import { COLORS, Fonts, height, width } from "../../assets/Theme";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'
import { GetChurchEvents } from "../../services/service";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dateFormatter from "../../utils/dateFormatter";
import moment from "moment";

const UpcomingEvent = ({ closeModal }) => {
    const navigation = useNavigation();
    const churchInfo = useSelector((state) => state.user.churchInfo);
    const [churchEvent, setChurchEvent] = useState([])
    const [loading, setLoading] = useState(false)

    const singleEventView = (item) => {
        closeModal();
        setTimeout(() => {
            navigation.navigate("EventDetails", { data: item })
        }, 800)
    }

    useEffect(() => {
        getChurchEvents();
    }, [])

    const getChurchEvents = async () => {
        setLoading(true)
        try {
            let { data } = await GetChurchEvents(churchInfo.tenantId);
            console.log(data, 'church events')
            setChurchEvent(data)
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                loading ? (
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: height - 300 }}>
                        <ActivityIndicator color={COLORS.primary} size={25} />
                    </View>
                ) : null
            }
            {
                churchEvent.length > 0 ? (
                    <View>
                        <Text style={{ fontFamily: Fonts.extrabold, fontSize: 22, color: "rgba(0, 0, 0, 0.8)", textAlign: "center" }}>Events</Text>
                        <Text style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.8)", textAlign: 'center', marginTop: 15, width: width - 100, alignSelf: "center" }}>Check in to any of the events below via Qr code or Location based check in.</Text>
                    </View>
                ) : (
                    <View style={{ width: width - 40, height: height - 400, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <View>
                            <Text style={{ fontFamily: Fonts.black, fontSize: 20, textAlign: "center", color: COLORS.black }}>No event</Text>
                            <Text style={{ color: COLORS.black, textAlign: "center" }}>Check back later to see upcoming events.</Text>
                        </View>
                    </View>
                )
            }
            <View style={{ marginTop: 25, paddingBottom: 70 }}>
                <FlatList
                    data={churchEvent}
                    renderItem={({ item, i }) => (
                        <TouchableOpacity key={i} onPress={() => singleEventView(item)}>
                            <View style={{ backgroundColor: "#FFFFFF", padding: 20, borderRadius: 10 }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                                        <CalendarCheck size={13} color={'black'} />
                                        <Text style={{ fontSize: 13, color: COLORS.black }}>{moment(item.eventDate).format('dddd')}</Text>
                                    </View>
                                    <Icon name={"arrow-forward-ios"} color="#B3B3B3" size={20} />
                                </View>
                                <Text style={{ fontFamily: Fonts.medium, fontSize: 16, color: "rgba(0, 0, 0, 0.8)", fontWeight: 700, marginTop: 2 }}>{item.fullEventName}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
                                    <View>
                                        <Text style={{ fontFamily: Fonts.light, color: COLORS.black, fontSize: 13 }}>group</Text>
                                        <Text style={{ fontFamily: Fonts.medium, fontSize: 15, color: "rgba(0, 0, 0, 0.8)", fontWeight: 600, marginTop: 1 }}>{item.fullGroupName}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontFamily: Fonts.light, color: COLORS.black, fontSize: 13 }}>Date</Text>
                                        <Text style={{ fontFamily: Fonts.medium, fontSize: 15, color: "rgba(0, 0, 0, 0.8)", fontWeight: 600, marginTop: 1 }}>{dateFormatter.monthDayYear(item.eventDate)}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index}
                    contentContainerStyle={{ rowGap: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}



export default UpcomingEvent;