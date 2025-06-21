import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Search } from '../../assets/img/icons';
import { Like } from '../../assets/img/like';
import { COLORS } from '../../assets/Theme';

const SelectDropdown = ({ data, search, value, setValue, renderLeftIcon, customToggle, renderRightIcon, selectStyles, placeholder }) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <Dropdown
          style={[styles.dropdown(customToggle, selectStyles), isFocus && { borderColor: !customToggle ? 'blue' : COLORS.primary }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search={search}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!customToggle ? !isFocus ? placeholder : '...' : ''}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderRightIcon={renderRightIcon}
          renderLeftIcon={() => (
            // <AntDesign
            //   style={styles.icon}
            //   color={isFocus ? 'blue' : 'black'}
            //   name="Safety"
            //   size={20}
            // />
            renderLeftIcon
          )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: (customToggle, selectStyles) => ({
      height: !customToggle ? 45 : 30,
      borderColor: !customToggle ? 'gray' : COLORS.primary,
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      width: !customToggle ? "100%" : 150,
      ...selectStyles
    }),
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });

export default SelectDropdown;