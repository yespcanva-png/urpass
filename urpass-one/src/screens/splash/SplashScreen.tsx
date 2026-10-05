import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Animated,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { COLORS } from "../../constants/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish?: () => void;
  isLoading?: boolean;
}

export function SplashScreen({ onFinish, isLoading = true }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // 1. Smooth fade in for the splash image
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 2. Subtle delay before showing loader indicator (~800ms)
    const loaderTimer = setTimeout(() => {
      setShowLoader(true);
    }, 800);

    return () => clearTimeout(loaderTimer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Full screen splash image: UrPass Minimal Purple Splash Screen.png */}
      <Animated.Image
        source={require("../../../assets/splash.png")}
        style={[styles.splashImage, { opacity: fadeAnim }]}
        resizeMode="contain"
      />

      {/* Subtle bottom loader indicator */}
      {showLoader && isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={COLORS.brand} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  splashImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loaderContainer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
