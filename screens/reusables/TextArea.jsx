import React from 'react';
import { View, Text } from "react-native"
import { TextInput } from 'react-native-paper';
import { COLORS } from '../../assets/Theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TextArea = ({  innerRef, placeholder, icon, doubleIcon, iconRight, onChangeText, value, secureTextEntry, multiline, numberOfLines, style, outlineRadius, textAlign, noOutline }) => {
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
            right={<TextInput.Icon
                style={{ width: doubleIcon ? 80 : 50, marginRight: doubleIcon ? 70 : 10, paddingLeft: 20 }}
                icon={() => <Text>{iconRight}</Text>}
            />}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            outlineColor={ noOutline ? 'transparent' : "rgba(0,0,0,.2)" }
            activeOutlineColor={COLORS.primary}
            textColor="rgba(0,0,0,.6)"
            placeholderTextColor='rgba(0,0,0,.4)'
            selectionColor={COLORS.primary}
            multiline={multiline ? multiline : false}
            numberOfLines={multiline ? numberOfLines : 0}
            outlineStyle={{
                borderWidth: 1,
                borderRadius: outlineRadius ? outlineRadius : 10
            }}
            contentStyle={{
                minHeight: 50,
                textAlignVertical: textAlign ? textAlign : 'top',
              }}
            style={{
                width: "100%",
                backgroundColor: 'white',
                ...style,
                // backgroundColor: 'rgba(223, 239, 255, 0.18)'
            }}
        />
    );
}

export default TextArea;