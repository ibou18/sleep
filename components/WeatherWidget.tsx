import { useThemeColor } from "@/hooks/useThemeColor";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
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
  process.env.EXPO_PUBLIC_WEATHER_API_KEY || "7eb6d3789a22a1c76309e655eef1c866";

// Fallback si pas de clé API (utilise une API publique alternative)
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

export default function WeatherWidget({
  compact = false,
}: {
  compact?: boolean;
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
        // OpenWeatherMap API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la météo");
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
      <ThemedView
        style={[
          compact ? styles.compactContainer : styles.container,
          { backgroundColor: surface + "E6" },
        ]}
      >
        <ActivityIndicator size="small" color={accent} />
      </ThemedView>
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

  // Version complète avec glassmorphism
  return (
    <ThemedView
      style={[
        styles.container,
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
            <ThemedText style={styles.temperature}>
              {weather.temperature}°
            </ThemedText>
            <ThemedText style={[styles.description, { color: muted }]}>
              {weather.description}
            </ThemedText>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <ThemedText style={[styles.city, { color: muted }]}>
            📍 {weather.city.split(",")[0]}
          </ThemedText>
          {weather.humidity && weather.windSpeed && (
            <View style={styles.details}>
              <ThemedText style={[styles.detailText, { color: muted }]}>
                💧 {weather.humidity}% • 💨 {weather.windSpeed} km/h
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </ThemedView>
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
  // Version complète (glassmorphism)
  container: {
    borderRadius: 16,
    padding: 14,
    minWidth: 160,
    maxWidth: 220, // Largeur maximale pour un meilleur centrage
    alignSelf: "center", // Assure le centrage
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
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
  details: {
    marginTop: 2,
  },
  detailText: {
    fontSize: 10,
  },
});
