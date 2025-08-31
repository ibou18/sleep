import ParallaxScrollView from "@/components/ParallaxScrollView";
import SleepCalculator from "@/components/SleepCalculator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet } from "react-native";

export default function SleepScreen() {
  const { theme } = useAppTheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#f9f9f9", dark: "#091e48" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="clock"
          style={styles.headerImage}
        />
      }
      title={
        <ThemedText
          style={{
            fontSize: 38,
            fontWeight: "bold",
            color: Colors[theme].text,
            textShadowColor:
              typeof Colors[theme].textShadow === "string"
                ? Colors[theme].textShadow
                : Colors[theme].textShadow.color,
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
            lineHeight: 52,
          }}
        >
          💤 Sleep Calculator
        </ThemedText>
      }
      subtitle="Optimisez vos cycles de sommeil"
      showThemeToggle={true}
      //   actionButtons={[
      //     {
      //       icon: "gear",
      //       onPress: () => console.log("Settings pressed"),
      //       label: "Settings",
      //     },
      //     {
      //       icon: "star.fill",
      //       onPress: () => console.log("Favorites pressed"),
      //       label: "Favorites",
      //     },
      //   ]}
    >
      <ThemedView style={styles.content}>
        <SleepCalculator />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 0, flex: 1 },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
