import NativeDateTimePicker from "@/components/NativeDateTimePicker";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function DateTimeTestScreen() {
  const [wakeTime, setWakeTime] = useState("");
  const [bedTime, setBedTime] = useState("");

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="clock"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Test DateTimePicker Natif</ThemedText>
        <ThemedText type="subtitle">
          Test du composant DateTimePicker natif de React Native Community
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">⏰ Heure de réveil</ThemedText>
        <ThemedText style={styles.description}>
          Utilisez le sélecteur natif pour choisir votre heure de réveil
        </ThemedText>
        <NativeDateTimePicker
          value={wakeTime}
          onTimeChange={setWakeTime}
          placeholder="Choisir l'heure de réveil"
          label="Heure de réveil désirée"
        />
        {wakeTime && (
          <ThemedText style={styles.selectedTime}>
            Heure sélectionnée : {wakeTime}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🛏️ Heure de coucher</ThemedText>
        <ThemedText style={styles.description}>
          Choisissez votre heure de coucher avec le picker natif
        </ThemedText>
        <NativeDateTimePicker
          value={bedTime}
          onTimeChange={setBedTime}
          placeholder="Choisir l'heure de coucher"
          label="Heure de coucher recommandée"
        />
        {bedTime && (
          <ThemedText style={styles.selectedTime}>
            Heure sélectionnée : {bedTime}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          📱 Caractéristiques du picker natif
        </ThemedText>
        <ThemedText style={styles.description}>
          • Support automatique iOS/Android{"\n"}• Interface native pour chaque
          plateforme{"\n"}• Intégration avec le thème sombre/clair{"\n"}•
          Spinner sur iOS, dialogue sur Android{"\n"}• Gestion automatique du
          format 24h{"\n"}• Aucune dépendance externe lourde
        </ThemedText>
      </ThemedView>

      {wakeTime && bedTime && (
        <ThemedView style={styles.summaryContainer}>
          <ThemedText type="subtitle">📊 Résumé</ThemedText>
          <ThemedText style={styles.summary}>
            Réveil : {wakeTime}
            {"\n"}
            Coucher : {bedTime}
          </ThemedText>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 12,
  },
  selectedTime: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  summaryContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0, 122, 255, 0.05)",
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    fontWeight: "500",
  },
});
