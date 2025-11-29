/**
 * VARIANTS DU WEATHER WIDGET
 * 
 * Ce fichier contient 3 variantes créatives d'intégration du widget météo :
 * 
 * 1. Variante Compact (badge minimaliste) - À utiliser dans la barre d'actions
 * 2. Variante Glassmorphism (flottant moderne) - Implémentée par défaut
 * 3. Variante Premium (gradient dynamique) - Intégration artistique
 * 
 * Pour changer de variante, modifiez le prop `variant` dans ParallaxScrollView
 */

import { useThemeColor } from "@/hooks/useThemeColor";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface WeatherData {
  temperature: number;
  description: string;
  city: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || "";
const USE_FALLBACK_API = !WEATHER_API_KEY;

const getWeatherEmoji = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes("clear") || desc.includes("sun")) return "☀️";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("storm")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("mist") || desc.includes("fog")) return "🌫️";
  return "🌤️";
};

// Palette de gradients selon la météo (Variante Premium)
const getWeatherGradient = (icon: string): string[] => {
  if (icon.includes("☀️")) return ["#FFD89B", "#19547B"]; // Soleil → Bleu ciel
  if (icon.includes("🌧️")) return ["#667EEA", "#764BA2"]; // Pluie → Violet
  if (icon.includes("⛈️")) return ["#4A5568", "#2D3748"]; // Orage → Gris foncé
  if (icon.includes("☁️")) return ["#B2B2B2", "#6C7A89"]; // Nuage → Gris
  if (icon.includes("❄️")) return ["#E0F2FE", "#B3E5FC"]; // Neige → Bleu clair
  return ["#E0E0E0", "#BDBDBD"]; // Par défaut
};

type WeatherVariant = "compact" | "glassmorphism" | "premium";

export function WeatherWidgetVariant({
  variant = "glassmorphism",
}: {
  variant?: WeatherVariant;
}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const surface = useThemeColor({}, "surface") as string;
  const muted = useThemeColor({}, "muted") as string;
  const accent = useThemeColor({}, "accent") as string;

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission refusée");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let weatherData: WeatherData;

      if (USE_FALLBACK_API) {
        const response = await fetch(
          `https://wttr.in/?lat=${latitude}&lon=${longitude}&format=j1&lang=fr`
        );
        if (!response.ok) throw new Error("Erreur API météo");
        const data = await response.json();
        weatherData = {
          temperature: parseInt(data.current_condition[0].temp_C),
          description: data.current_condition[0].weatherDesc[0].value,
          city: data.nearest_area[0].areaName[0].value,
          icon: getWeatherEmoji(data.current_condition[0].weatherDesc[0].value),
          humidity: parseInt(data.current_condition[0].humidity),
          windSpeed: parseInt(data.current_condition[0].windspeedKmph),
        };
      } else {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
        );
        if (!response.ok) throw new Error("Erreur API météo");
        const data = await response.json();
        weatherData = {
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          city: data.name,
          icon: getWeatherEmoji(data.weather[0].description),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind?.speed * 3.6),
        };
      }

      setWeather(weatherData);
    } catch (err) {
      console.error("❌ Erreur météo:", err);
      setError("Météo indisponible");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={variant === "compact" ? styles.compactLoading : styles.loading}>
        <ActivityIndicator size="small" color={accent} />
      </View>
    );
  }

  if (error || !weather) return null;

  // VARIANTE 1: Compact (badge minimaliste)
  if (variant === "compact") {
    return (
      <View style={[styles.compactContainer, { backgroundColor: surface + "E6" }]}>
        <ThemedText style={styles.compactEmoji}>{weather.icon}</ThemedText>
        <View style={styles.compactInfo}>
          <ThemedText style={styles.compactTemp}>{weather.temperature}°</ThemedText>
          <ThemedText style={[styles.compactCity, { color: muted }]}>
            {weather.city.split(",")[0]}
          </ThemedText>
        </View>
      </View>
    );
  }

  // VARIANTE 2: Glassmorphism (flottant moderne) - Déjà implémentée
  if (variant === "glassmorphism") {
    return (
      <ThemedView
        style={[
          styles.glassContainer,
          {
            backgroundColor: surface + "E6",
            borderWidth: 1,
            borderColor: surface + "40",
          },
        ]}
      >
        <View style={styles.weatherContent}>
          <View style={styles.mainInfo}>
            <ThemedText style={styles.emoji}>{weather.icon}</ThemedText>
            <View style={styles.tempContainer}>
              <ThemedText style={styles.temperature}>{weather.temperature}°</ThemedText>
              <ThemedText style={[styles.description, { color: muted }]}>
                {weather.description}
              </ThemedText>
            </View>
          </View>
          <View style={styles.locationContainer}>
            <ThemedText style={[styles.city, { color: muted }]}>
              📍 {weather.city.split(",")[0]}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }

  // VARIANTE 3: Premium (gradient dynamique)
  if (variant === "premium") {
    const gradient = getWeatherGradient(weather.icon);
    return (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.premiumContainer}
      >
        <View style={styles.weatherContent}>
          <View style={styles.mainInfo}>
            <ThemedText style={styles.emoji}>{weather.icon}</ThemedText>
            <View style={styles.tempContainer}>
              <ThemedText style={[styles.temperature, { color: "#FFFFFF" }]}>
                {weather.temperature}°
              </ThemedText>
              <ThemedText style={[styles.description, { color: "#FFFFFFCC" }]}>
                {weather.description}
              </ThemedText>
            </View>
          </View>
          <View style={styles.locationContainer}>
            <ThemedText style={[styles.city, { color: "#FFFFFFE6" }]}>
              📍 {weather.city.split(",")[0]}
            </ThemedText>
            {weather.humidity && weather.windSpeed && (
              <ThemedText style={[styles.detailText, { color: "#FFFFFFCC" }]}>
                💧 {weather.humidity}% • 💨 {weather.windSpeed} km/h
              </ThemedText>
            )}
          </View>
        </View>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  // Variante Compact
  compactContainer: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  compactLoading: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  compactEmoji: {
    fontSize: 18,
  },
  compactInfo: {
    gap: 0,
  },
  compactTemp: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16,
  },
  compactCity: {
    fontSize: 10,
    lineHeight: 12,
  },
  // Variante Glassmorphism
  glassContainer: {
    borderRadius: 16,
    padding: 14,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  // Variante Premium
  premiumContainer: {
    borderRadius: 20,
    padding: 16,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  // Styles communs
  loading: {
    padding: 14,
    borderRadius: 16,
  },
  weatherContent: {
    gap: 10,
  },
  mainInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  emoji: {
    fontSize: 32,
  },
  tempContainer: {
    flex: 1,
    gap: 3,
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 28,
  },
  description: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  locationContainer: {
    gap: 3,
    marginTop: 2,
  },
  city: {
    fontSize: 12,
    fontWeight: "600",
  },
  detailText: {
    fontSize: 10,
    marginTop: 4,
  },
});

