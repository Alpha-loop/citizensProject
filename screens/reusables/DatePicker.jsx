import { View, StyleSheet } from "react-native";
import DateTimePicker from 'react-native-ui-datepicker';
import { COLORS, Fonts } from "../../assets/Theme";


const DatePicker = ({ date, setDate, selectedItemColor }) => {
    return (
        <View style={styles.calendarContainer}>
            <DateTimePicker
                mode="single"
                date={date}
                selectedItemColor={selectedItemColor}
                headerButtonColor={COLORS.primary}
                calendarTextStyle={{ color: COLORS.black }}
                weekDaysTextStyle={{ color: COLORS.black }}
                headerTextStyle={{ fontFamily: Fonts.extrabold, color: COLORS.black }}
                onChange={(params) => setDate(params.date)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    calendarContainer: {
        backgroundColor: "white",
    }
})

export default DatePicker;