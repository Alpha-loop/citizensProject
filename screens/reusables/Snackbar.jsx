import { Snackbar } from "react-native-paper";
import { Text } from "react-native";

const SnackbarToast = ({ message, type, visible, setDismiss}) => {
    return (
        <Snackbar
            visible={visible}
            duration={4000}
            style={{ backgroundColor: type == 'success' ? "#3CBF98" : type == 'error' ? "#FF3C41" : "#FFFFFF" }}
            onDismiss={() => setDismiss(false)}
        >
            <Text style={{ color: "#FFFFFF" }}>{message}</Text>
        </Snackbar>
    );
}

export default SnackbarToast;