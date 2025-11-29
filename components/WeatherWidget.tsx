import { useThemeColor } from "@/hooks/useThemeColor";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
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

// Clé API OpenWeatherMap - À remplacer par votre propre clé
// Obtenez une clé gratuite sur https://openweathermap.org/api
const WEATHER_API_KEY =
  process.env.EXPO_PUBLIC_WEATHER_API_KEY || "7b854612fd5f633cb2b6fb9f79c24bce";

// Fallback si pas de clé API (utilise une API publique alternative)
const USE_FALLBACK_API = !WEATHER_API_KEY;

// Intervalle de rafraîchissement automatique (30 minutes)
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes en millisecondes

// Délai minimum entre deux appels API (évite les appels trop fréquents)
const MIN_REFRESH_DELAY = 60 * 1000; // 1 minute

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

export default function WeatherWidget({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Référence pour suivre le dernier rafraîchissement
  const lastRefreshRef = useRef<number>(0);

  const surface = useThemeColor({}, "surface") as string;
  const muted = useThemeColor({}, "muted") as string;
  const accent = useThemeColor({}, "accent") as string;

  // Rafraîchir à chaque fois que l'écran devient actif
  useFocusEffect(
    React.useCallback(() => {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshRef.current;

      // Rafraîchir uniquement si assez de temps s'est écoulé
      if (timeSinceLastRefresh >= MIN_REFRESH_DELAY) {
        console.log("🔄 Rafraîchissement météo (focus écran)");
        fetchWeather();
      } else {
        console.log(
          `⏭️ Rafraîchissement ignoré (dernier: ${Math.round(
            timeSinceLastRefresh / 1000
          )}s)`
        );
      }
    }, [])
  );

  // Rafraîchissement automatique toutes les 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Rafraîchissement météo automatique (15 min)");
      fetchWeather();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Enregistrer le moment du rafraîchissement
      lastRefreshRef.current = Date.now();

      // Demander la permission de localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission refusée");
        setLoading(false);
        return;
      }

      // Obtenir la position actuelle
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let weatherData: WeatherData;

      if (USE_FALLBACK_API) {
        // API alternative gratuite (wttr.in) avec coordonnées
        const response = await fetch(
          `https://wttr.in/?lat=${latitude}&lon=${longitude}&format=j1&lang=fr`
        );

        console.log("response", response);

        if (!response.ok) {
          throw new Error("Erreur API météo");
        }

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
        // OpenWeatherMap API avec fallback automatique
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.warn(
              "⚠️ OpenWeatherMap API error:",
              response.status,
              errorData.message || "Unknown error"
            );
            // Fallback vers wttr.in si OpenWeatherMap échoue
            throw new Error("OpenWeatherMap failed, using fallback");
          }

          const data = await response.json();
          weatherData = {
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            city: data.name,
            icon: getWeatherEmoji(data.weather[0].description),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind?.speed * 3.6), // Conversion m/s vers km/h
          };
        } catch (openWeatherError) {
          // Fallback automatique vers wttr.in si OpenWeatherMap échoue
          console.log(
            "🔄 Fallback vers API wttr.in...",
            openWeatherError instanceof Error ? openWeatherError.message : ""
          );
          const fallbackResponse = await fetch(
            `https://wttr.in/?lat=${latitude}&lon=${longitude}&format=j1&lang=fr`
          );

          if (!fallbackResponse.ok) {
            throw new Error("Les deux APIs météo ont échoué");
          }

          const fallbackData = await fallbackResponse.json();
          weatherData = {
            temperature: parseInt(fallbackData.current_condition[0].temp_C),
            description: fallbackData.current_condition[0].weatherDesc[0].value,
            city: fallbackData.nearest_area[0].areaName[0].value,
            icon: getWeatherEmoji(
              fallbackData.current_condition[0].weatherDesc[0].value
            ),
            humidity: parseInt(fallbackData.current_condition[0].humidity),
            windSpeed: parseInt(
              fallbackData.current_condition[0].windspeedKmph
            ),
          };
        }
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
      <View style={styles.container}>
        <ActivityIndicator size="small" color={accent} />
      </View>
    );
  }

  if (error || !weather) {
    return null; // Masquer silencieusement en cas d'erreur
  }

  // Version compacte pour intégration dans la barre d'actions
  if (compact) {
    return (
      <ThemedView
        style={[styles.compactContainer, { backgroundColor: surface + "E6" }]}
      >
        <ThemedText style={styles.compactEmoji}>{weather.icon}</ThemedText>
        <View style={styles.compactInfo}>
          <ThemedText style={styles.compactTemp}>
            {weather.temperature}°
          </ThemedText>
          <ThemedText style={[styles.compactCity, { color: muted }]}>
            {weather.city.split(",")[0]}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Version complète intégrée sans fond ni bordure
  return (
    <View style={styles.container}>
      <View style={styles.weatherContent}>
        {/* Informations météo compactes */}
        <View style={styles.mainInfo}>
          <ThemedText style={styles.emoji}>{weather.icon}</ThemedText>
          <View style={styles.tempContainer}>
            <ThemedText style={styles.temperature}>
              {weather.temperature}°
            </ThemedText>
            <ThemedText style={[styles.city, { color: muted }]}>
              📍 {weather.city.split(",")[0]}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Version compacte (badge)
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
  // Version complète intégrée (compacte pour le header)
  container: {
    minWidth: 140,
    maxWidth: 180,
    alignSelf: "center",
    overflow: "visible", // Permet à l'emoji de ne pas être coupé
    // Pas de fond, pas de bordure, pas d'ombre - intégration pure
  },
  weatherContent: {
    alignItems: "center",
    overflow: "visible", // Permet à l'emoji de ne pas être coupé
  },
  // Informations principales compactes
  mainInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    overflow: "visible", // Permet à l'emoji de ne pas être coupé
  },
  emoji: {
    fontSize: 32,
    lineHeight: 36, // Ajout du lineHeight pour éviter la troncature
    textAlign: "center",
    minWidth: 36, // Largeur minimale pour éviter la compression
    minHeight: 36, // Hauteur minimale pour éviter la troncature
  },
  tempContainer: {
    alignItems: "flex-start",
    gap: 2,
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 28,
  },
  // Location sous la température
  city: {
    fontSize: 11,
    fontWeight: "500",
    opacity: 0.8,
  },
  // Styles non utilisés mais conservés pour compatibilité
  locationContainer: {
    marginBottom: 4,
    alignItems: "center",
  },
  description: {
    fontSize: 13,
    textTransform: "capitalize",
  },
  details: {
    marginTop: 4,
    alignItems: "center",
  },
  detailText: {
    fontSize: 11,
    textAlign: "center",
  },
});
