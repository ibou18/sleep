import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import NativeDateTimePicker from "./NativeDateTimePicker";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type Mode = "bedtime" | "waketime";

interface SleepResult {
  cycles: number;
  time: string;
  description: string;
  quality: "optimal" | "good" | "fair";
}

function parseTime(input: string): Date | null {
  const t = input.trim().replace(/[^\d:]/g, "");
  let parts = t.match(/^(\d{1,2}):(\d{2})$/);

  if (parts) {
    const h = parseInt(parts[1], 10);
    const m = parseInt(parts[2], 10);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    }
  }

  // Format HHmm
  const match = t.match(/^(\d{3,4})$/);
  if (match) {
    const s = match[1];
    const h = parseInt(s.slice(0, s.length - 2), 10);
    const m = parseInt(s.slice(-2), 10);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    }
  }

  return null;
}

function formatTime(d: Date): string {
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60000);
}

function getSleepQuality(cycles: number): "optimal" | "good" | "fair" {
  if (cycles === 5 || cycles === 6) return "optimal";
  if (cycles === 4) return "good";
  return "fair";
}

export default function SleepCalculator() {
  const [mode, setMode] = useState<Mode>("bedtime");
  const [input, setInput] = useState(() => {
    // Initialiser avec l'heure actuelle
    const now = new Date();
    return formatTime(now);
  });
  const [results, setResults] = useState<SleepResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const cycles = 90; // minutes per sleep cycle
  const sleepLatency = 14; // average minutes to fall asleep

  const surface = useThemeColor({}, "surface") as string;
  const muted = useThemeColor({}, "muted") as string;
  const accent = useThemeColor({}, "accent") as string;
  const danger = useThemeColor({}, "danger") as string;
  const success = useThemeColor({}, "success") as string;

  const calculate = () => {
    setError(null);
    setIsCalculating(true);

    const d = parseTime(input);

    if (!d) {
      setError("Format invalide. Utilisez HH:mm (ex: 23:30)");
      setResults([]);
      setIsCalculating(false);
      return;
    }

    const now = new Date();
    const currentTime = new Date();
    currentTime.setHours(now.getHours(), now.getMinutes(), 0, 0);

    const newResults: SleepResult[] = [];
    const cycleRange = mode === "bedtime" ? [3, 4, 5, 6] : [6, 5, 4, 3];

    cycleRange.forEach((i) => {
      const minutes = sleepLatency + i * cycles;
      let targetTime: Date;

      if (mode === "bedtime") {
        // Mode coucher : calculer l'heure de réveil à partir de l'heure de coucher
        targetTime = addMinutes(d, minutes);

        // Si l'heure de réveil est le lendemain (après minuit)
        if (targetTime.getTime() < d.getTime()) {
          targetTime = new Date(targetTime.getTime() + 24 * 60 * 60 * 1000);
        }
      } else {
        // Mode réveil : calculer l'heure de coucher à partir de l'heure de réveil
        targetTime = addMinutes(d, -minutes);

        // Si l'heure de coucher est la veille (avant l'heure de réveil)
        if (targetTime.getTime() > d.getTime()) {
          targetTime = new Date(targetTime.getTime() - 24 * 60 * 60 * 1000);
        }
      }

      const quality = getSleepQuality(i);
      const action = mode === "bedtime" ? "Réveil" : "Coucher";
      const duration =
        Math.floor(minutes / 60) + "h" + String(minutes % 60).padStart(2, "0");

      // Calculer le temps relatif par rapport à maintenant
      const timeDiff = targetTime.getTime() - currentTime.getTime();
      const hoursFromNow = Math.round(timeDiff / (1000 * 60 * 60));

      let relativeTime = "";
      if (hoursFromNow === 0) {
        relativeTime = " (maintenant)";
      } else if (hoursFromNow > 0) {
        relativeTime = ` (dans ${hoursFromNow}h)`;
      } else {
        relativeTime = ` (il y a ${Math.abs(hoursFromNow)}h)`;
      }

      newResults.push({
        cycles: i,
        time: formatTime(targetTime),
        description: `${action} recommandé • ${duration} de sommeil${relativeTime}`,
        quality,
      });
    });

    setResults(newResults);
    setIsCalculating(false);

    // Animation d'apparition avec un petit délai pour permettre le re-render
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 100);
  };

  const getQualityColor = (quality: "optimal" | "good" | "fair") => {
    switch (quality) {
      case "optimal":
        return success;
      case "good":
        return accent;
      case "fair":
        return muted;
    }
  };

  const getQualityIcon = (quality: "optimal" | "good" | "fair") => {
    switch (quality) {
      case "optimal":
        return "⭐";
      case "good":
        return "✨";
      case "fair":
        return "💤";
    }
  };

  useEffect(() => {
    fadeAnim.setValue(0);
  }, [results, fadeAnim]);

  return (
    <ThemedView style={styles.container}>
      {/* Header avec toggle thème */}
      <View style={styles.headerRow}>
        <View>
          <ThemedText type="title" style={styles.title}>
            Sleep
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: muted }]}>
            Calculateur de cycles de sommeil
          </ThemedText>
        </View>
        {/* <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeToggle, { backgroundColor: surface }]}
        >
          <ThemedText style={styles.themeIcon}>
            {theme === "dark" ? "☀️" : "🌙"}
          </ThemedText>
        </TouchableOpacity> */}
      </View>

      {/* Sélecteur de mode */}
      <View style={[styles.modeSelector, { backgroundColor: surface }]}>
        <TouchableOpacity
          onPress={() => setMode("bedtime")}
          style={[
            styles.modeBtn,
            mode === "bedtime" && { backgroundColor: accent },
          ]}
        >
          <ThemedText
            style={[
              styles.modeBtnText,
              mode === "bedtime" && { color: "#fff" },
            ]}
          >
            🛏️ Heure de coucher
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMode("waketime")}
          style={[
            styles.modeBtn,
            mode === "waketime" && { backgroundColor: accent },
          ]}
        >
          <ThemedText
            style={[
              styles.modeBtnText,
              mode === "waketime" && { color: "#fff" },
            ]}
          >
            ⏰ Heure de réveil
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Zone de saisie */}
      <View style={[styles.inputSection, { backgroundColor: surface }]}>
        <ThemedText style={styles.inputLabel}>
          {mode === "bedtime"
            ? "À quelle heure vous couchez-vous ?"
            : "À quelle heure voulez-vous vous réveiller ?"}
        </ThemedText>

        <View style={styles.inputRow}>
          <View style={styles.timeInputContainer}>
            <NativeDateTimePicker
              value={input}
              onTimeChange={setInput}
              placeholder={mode === "bedtime" ? "23:30" : "07:00"}
              label={
                mode === "bedtime" ? "Heure de coucher" : "Heure de réveil"
              }
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={calculate}
              disabled={isCalculating || !input.trim()}
              style={[
                styles.calculateBtn,
                {
                  backgroundColor:
                    !input.trim() || isCalculating ? muted : accent,
                  opacity: !input.trim() || isCalculating ? 0.6 : 1,
                },
              ]}
            >
              <ThemedText style={styles.calculateBtnText}>
                {isCalculating ? "⏳" : "🔮"}
                {isCalculating ? " Calcul..." : " Calculer"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View
            style={[styles.errorContainer, { backgroundColor: danger + "20" }]}
          >
            <ThemedText style={[styles.errorText, { color: danger }]}>
              ⚠️ {error}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Résultats */}
      <ScrollView
        style={styles.resultsContainer}
        showsVerticalScrollIndicator={false}
      >
        {isCalculating ? (
          <View style={[styles.emptyState, { backgroundColor: surface }]}>
            <ThemedText style={styles.emptyIcon}>⏳</ThemedText>
            <ThemedText style={[styles.emptyText, { color: muted }]}>
              Calcul en cours...
            </ThemedText>
          </View>
        ) : results.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: surface }]}>
            <ThemedText style={styles.emptyIcon}>😴</ThemedText>
            <ThemedText style={[styles.emptyText, { color: muted }]}>
              Entrez une heure pour découvrir vos cycles de sommeil optimaux
            </ThemedText>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            <ThemedText style={[styles.resultsTitle, { color: accent }]}>
              💫 Recommandations personnalisées
            </ThemedText>

            {results.map((result, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.resultCard,
                  {
                    backgroundColor: surface,
                    borderLeftColor: getQualityColor(result.quality),
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  // Petite animation de feedback visuel
                  const scale = new Animated.Value(1);
                  Animated.sequence([
                    Animated.timing(scale, {
                      toValue: 0.98,
                      duration: 100,
                      useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                      toValue: 1,
                      duration: 100,
                      useNativeDriver: true,
                    }),
                  ]).start();
                }}
              >
                <View style={styles.resultHeader}>
                  <View style={styles.resultTime}>
                    <ThemedText style={styles.timeText}>
                      {result.time}
                    </ThemedText>
                    <ThemedText style={styles.qualityIcon}>
                      {getQualityIcon(result.quality)}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.cyclesBadge,
                      {
                        backgroundColor: getQualityColor(result.quality) + "20",
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.cyclesText,
                        { color: getQualityColor(result.quality) },
                      ]}
                    >
                      {result.cycles} cycles
                    </ThemedText>
                  </View>
                </View>

                <ThemedText
                  style={[styles.resultDescription, { color: muted }]}
                >
                  {result.description}
                </ThemedText>

                {/* Indicateur de qualité textuel */}
                <View style={styles.qualityIndicator}>
                  <ThemedText
                    style={[
                      styles.qualityText,
                      { color: getQualityColor(result.quality) },
                    ]}
                  >
                    {result.quality === "optimal"
                      ? "Idéal"
                      : result.quality === "good"
                      ? "Bon"
                      : "Acceptable"}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}

            <View style={[styles.tipContainer, { backgroundColor: surface }]}>
              <ThemedText style={styles.tipIcon}>💡</ThemedText>
              <ThemedText style={[styles.tipText, { color: muted }]}>
                Un cycle de sommeil dure environ 90 minutes. 4-6 cycles sont
                idéaux pour un sommeil réparateur.
              </ThemedText>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  themeToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeIcon: {
    fontSize: 20,
  },
  modeSelector: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  modeBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  inputSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  timeInputContainer: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  calculateBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  calculateBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
  },
  resultsContainer: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    lineHeight: 52,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resultTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  qualityIcon: {
    fontSize: 20,
  },
  cyclesBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  cyclesText: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  qualityIndicator: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  qualityText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
