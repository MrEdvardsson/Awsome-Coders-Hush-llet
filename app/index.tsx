import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.replace("./screens/login");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.first}>Awesome</Text>
          <Text style={styles.secnd}>Household</Text>
        </View>
        <LottieView
          style={styles.animation}
          source={require("../assets/images/Home.json")}
          loop
          autoPlay
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  first: {
    fontSize: 42,
    fontWeight: "900",
    color: "#1e293b",
    textAlign: "center",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  secnd: {
    fontSize: 24,
    fontWeight: "300",
    color: "#64748b",
    textAlign: "center",
    letterSpacing: 3,
    marginTop: -5,
  },
  animation: {
    width: Math.min(width * 0.8, 400),
    height: Math.min(height * 0.6, 400),
  },
});
