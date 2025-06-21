import { Text, Animated, PanResponder, View } from "react-native";
import Modal from "react-native-modal";

export const SwipeModal = ({ visible, closeModal, children, height }) => {

    const panY = new Animated.Value(0);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            panY.setValue(gestureState.dy);
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy > 50) {
                // User swiped down
                closeModal;
            } else {
                // Reset the position if the swipe is not sufficient
                Animated.spring(panY, {
                    toValue: 0,
                    useNativeDriver: false,
                }).start();
            }
        },
    });

    const translateY = panY.interpolate({
        inputRange: [-300, 0],
        outputRange: [-300, 0],
        extrapolate: 'clamp',
    });

    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
            animationInTiming={500}
            animationOutTiming={500}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            // swipeDirection={['down']}
            onSwipeComplete={closeModal}
            onBackdropPress={closeModal}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            <Animated.View
                // {...panResponder.panHandlers}
                style={{
                    backgroundColor: "rgba(248, 248, 248, 1)",
                    height: height,
                    padding: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    // transform: [{ translateY }],
                }}
            >
                <View style={{ 
                    borderTopWidth: 8, 
                    borderTopColor: 'rgba(217, 217, 217, 1)', 
                    marginBottom: 30, 
                    width: "40%", 
                    marginLeft: "30%", 
                    borderRadius: 20 
                }}></View>
                {children}
            </Animated.View>
        </Modal>
    );
}

export const CenteredModal = ({ children, visible, closeModal }) => {
    
    return (
        <Modal
        transparent={true}
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
            animationInTiming={500}
            animationOutTiming={400}
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={400}
            // swipeDirection={['down']}
            onSwipeComplete={closeModal}
            onBackdropPress={closeModal}
            onBackButtonPress={closeModal}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
            }}
        >
            {children}
        </Modal>
    );
}

export const NavigationModal = ({ children, visible, closeModal }) => {
    return (
        <Modal
            isVisible={visible}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            backdropOpacity={0.5}
            animationInTiming={500}
            animationOutTiming={500}
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={500}
            // swipeDirection={['down']}
            onSwipeComplete={closeModal}
            onBackdropPress={closeModal}
            style={{
                justifyContent: 'flex-start',
                margin: 0
            }}
        >
            {children}
        </Modal>
    );
}

export const ImageModal = ({ children, visible, closeModal }) => {
    return (
        <Modal
            isVisible={visible}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.5}
            animationInTiming={500}
            animationOutTiming={500}
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={500}
            // swipeDirection={['down']}
            onSwipeComplete={closeModal}
            onBackdropPress={closeModal}
            style={{
                justifyContent: 'center',
                alignItems: "center",
                margin: 0
            }}
        >
            {children}
        </Modal>
    );
}