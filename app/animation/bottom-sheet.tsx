import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = 400;

function SimpleBottomSheet({ visible, onClose, children }: any) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  // animating main view opacity is bad idea instead animate opacity of back drop button

  React.useEffect(() => {
    if (visible) {
      // Open: slide up + fade in backdrop
      translateY.value = withSpring(0, {
        damping: 25,
        stiffness: 300,
        mass: 0.8,
      });

      opacity.value = withTiming(0.5, { duration: 300 });
    } else {
      // Close: slide down + fade out backdrop
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 25,
        stiffness: 300,
      });

      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, translateY, opacity]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: visible ? "auto" : "none",
  }));

  return (
    <View style={styles.container} pointerEvents={visible ? "auto" : "none"}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      {/* Sheet */}
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.handle} />
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
}

// Demo
export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <View style={styles.app}>
      <TouchableWithoutFeedback onPress={() => setOpen(true)}>
        <View style={styles.button}>
          <Animated.Text style={styles.buttonText}>Open</Animated.Text>
        </View>
      </TouchableWithoutFeedback>

      <SimpleBottomSheet visible={open} onClose={() => setOpen(false)}>
        <Animated.Text style={styles.title}>Bottom Sheet</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Meta-style smooth animation
        </Animated.Text>
      </SimpleBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  app: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#1877F2",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#DADDE1",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1c1c1e",
  },
  subtitle: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 4,
  },
});
