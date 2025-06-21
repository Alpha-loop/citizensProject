import { SelectList } from 'react-native-dropdown-select-list'

const Dropdown = ({ data, placeholder, styles, setSelected, search, dropdownShown, customToggler, defaultOption }) => {
    return (
        <SelectList
            setSelected={(val) => setSelected(val)}
            data={data}
            save="value"
            placeholder={placeholder}
            boxStyles={styles}
            search={search}
            dropdownShown={dropdownShown}
            dropdownStyles={customToggler ? selectOptions2 : selectOptions1}
            defaultOption={defaultOption}
            // dropdownItemStyles={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,.1)', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,.1)'}}
        />
    );
}

const selectOptions1 = { 
    position: "absolute", 
    top: 40, 
    zIndex: 10, 
    backgroundColor: 
    "white",
    width: "100%",
    borderWidth: 1,
    borderColor: "#F3F3F3"
}

const selectOptions2 = { 
    position: "absolute", 
    left: -105, 
    top: -5,
    zIndex: 100, 
    backgroundColor: 
    "white",
    width: 140,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.15)"
}

export default Dropdown;