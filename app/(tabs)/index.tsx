import ParallaxScrollView from "@/components/ParallaxScrollView";
import SleepCalculator from "@/components/SleepCalculator";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
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
          color="#e27f4a"
          name="moon.circle.fill"
          style={styles.headerImage}
        />
      }
      // subtitle={<ThemedText>Optimisez vos cycles de sommeil</ThemedText>}
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
