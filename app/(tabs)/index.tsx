import ParallaxScrollView from "@/components/ParallaxScrollView";
import SleepCalculator from "@/components/SleepCalculator";
import { ThemedView } from "@/components/ThemedView";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet } from "react-native";

export default function SleepScreen() {
  useAppTheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#f9f9f9", dark: "#091e48" }}
      showThemeToggle={true}
      showWeather={true}
    >
      <ThemedView style={styles.content}>
        <SleepCalculator />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 0, flex: 1 },
});
