import React from 'react';
import { TextInput, Text } from 'react-native-paper';
import { COLORS } from '../../assets/Theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Input = ({ innerRef, placeholder, icon, onChangeText, value, secureTextEntry, style, iconRight, noOutline, outlineStyle, disabled, setpasswordVisibility }) => {
    let focusedColor = 'red'
    return (
        <TextInput
            value={value}
            mode="outlined"
            ref={innerRef ? innerRef : null}
            onChangeText={onChangeText}
            left={icon ? <TextInput.Icon
                icon={() => <Icon name={icon} color={focusedColor} size={25} />}
                color={((isTextInputFocused) => isTextInputFocused ? focusedColor = COLORS.primary : focusedColor = 'rgba(0,0,0,.3)')}
            /> : ""}
            // right={<TextInput.Icon
            //     icon={() => <Text>{iconRight}</Text>}
            // />}
            right={<TextInput.Icon icon={iconRight} onPress={setpasswordVisibility} />}
            disabled={disabled}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            outlineColor={ noOutline ? 'transparent' : "rgba(0,0,0,.2)" }
            activeOutlineColor={COLORS.primary}
            textColor="rgba(0,0,0,.6)"
            placeholderTextColor='rgba(0,0,0,.4)'
            selectionColor={COLORS.primary}
            dense={true}
            outlineStyle={outlineStyle ? outlineStyle : {
                borderWidth: 1,
                borderRadius: 10
            }}
            style={{
                width: "100%",
                backgroundColor: 'white',
                ...style
                // backgroundColor: 'rgba(223, 239, 255, 0.18)'
            }}
        />
    );
}

export default Input;