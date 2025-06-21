import { StyleSheet, View } from 'react-native';
import { TreeSelect } from 'react-native-tree-selection';
import { COLORS, Fonts } from '../../assets/Theme';
import { useEffect } from 'react';

const TreeSelectDropDown = ({ data, setCheckBoxValue }) => {
    useEffect(() => {
        // console.log(data)
    },[])

    return (
        // <View style={{ borderWidth: 1, borderColor: 'red', paddingBottom: 300}}>
            <TreeSelect
                data={data}
                childKey="children"
                titleKey="name"
                // onParentPress={onParentPress}
                // onChildPress={onChildPress}
                onCheckBoxPress={setCheckBoxValue}
                parentContainerStyles={styles.parentContainerStyles}
                parentTextStyles={styles.parentTextStyles}
                childContainerStyles={styles.childContainerStyles}
                childTextStyles={styles.childTextStyles}
                rightIconStyles={styles.rightIconStyles}
                leftIconStyles={styles.leftIconStyles}
                autoSelectChildren={true}
            />
        // </View>
    )
}

const styles = StyleSheet.create({
    parentContainerStyles: {
        flexDirection: "row",
        alignItems: 'center'
        // borderWidth: 1,
        // borderColor: 'red'
    },
    parentTextStyles: {
        color: 'black',
        fontFamily: Fonts.medium,
        fontSize: 14
    },
    childContainerStyles: {
        flexDirection: "row",
        alignItems: 'center',
        backgroundColor: "#ffffff"
    },
    childTextStyles: {
        color: 'black',
        fontFamily: Fonts.medium,
        fontSize: 14
    },
    rightIconStyles: {
        tintColor: 'gray',
        marginRight: 5
    },
    leftIconStyles: {
        tintColor: 'gray',
        marginLeft: 5
    }
})

export default TreeSelectDropDown;