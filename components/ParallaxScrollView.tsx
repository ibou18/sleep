import type { PropsWithChildren, ReactElement } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useAppTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";

// Imports conditionnels pour les icônes (à installer si nécessaire)
// import { Ionicons } from '@expo/vector-icons';
// import { LucideIcon } from 'lucide-react-native';

const HEADER_HEIGHT = 160;

// Configuration météo
const WEATHER_API_KEY =
  process.env.EXPO_PUBLIC_WEATHER_API_KEY || "7b854612fd5f633cb2b6fb9f79c24bce";
const USE_FALLBACK_API = !WEATHER_API_KEY;
const MIN_REFRESH_DELAY = 60 * 1000; // 1 minute

interface WeatherData {
  temperature: number;
  description: string;
  city: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

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

interface ActionButton {
  icon: any; // Pour supporter les icônes SF Symbols
  onPress: () => void;
  label?: string;
}

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerIcon?: {
    name: string;
    library: "ionicons" | "lucide";
    size?: number;
    color?: string;
  };
  headerBackgroundColor?: { dark: string; light: string };
  title?: string | ReactElement;
  subtitle?: string | ReactElement;
  actionButtons?: ActionButton[];
  showThemeToggle?: boolean;
  showWeather?: boolean;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerIcon,
  headerBackgroundColor,
  title,
  subtitle,
  actionButtons = [],
  showThemeToggle = false,
  showWeather = false,
}: Props) {
  const { theme, toggleTheme } = useAppTheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const surface = useThemeColor({}, "surface");
  const accent = useThemeColor({}, "accent");
  const muted = useThemeColor({}, "muted");

  // État météo
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const lastRefreshRef = useRef<number>(0);

  // Extract color string from accent object if it's an object
  const accentColor =
    typeof accent === "object" && "color" in accent ? accent.color : accent;

  // Couleur de fond par défaut basée sur le thème
  const defaultHeaderColor = theme === "dark" ? "#1e293b" : "#e2e8f0";
  const headerBgColor = headerBackgroundColor
    ? headerBackgroundColor[theme]
    : defaultHeaderColor;

  // Fonction pour récupérer la météo
  const fetchWeather = async () => {
    try {
      setWeatherLoading(true);
      lastRefreshRef.current = Date.now();

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setWeatherLoading(false);
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
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
          );

          if (!response.ok) {
            throw new Error("OpenWeatherMap failed, using fallback");
          }

          const data = await response.json();
          weatherData = {
            temperature: Math.round(data.main.temp),
            description: data.weather[0].description,
            city: data.name,
            icon: getWeatherEmoji(data.weather[0].description),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind?.speed * 3.6),
          };
        } catch {
          console.log("🔄 Fallback vers API wttr.in...");
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
    } finally {
      setWeatherLoading(false);
    }
  };

  // Rafraîchissement sur focus
  useFocusEffect(
    React.useCallback(() => {
      if (!showWeather) return;

      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefreshRef.current;

      if (timeSinceLastRefresh >= MIN_REFRESH_DELAY || !weather) {
        console.log("🔄 Rafraîchissement météo (focus écran)");
        fetchWeather();
      }
    }, [showWeather, weather])
  );

  // Fonction pour rendre le contenu du header
  const renderHeaderContent = () => {
    // Si météo activée, afficher l'icône météo en bas à gauche
    if (showWeather && weather) {
      return (
        <View style={styles.weatherIconContainer}>
          <View style={styles.weatherIconContent}>
            {weatherLoading ? (
              <ActivityIndicator size="small" color={accentColor} />
            ) : (
              <>
                <ThemedText style={styles.weatherEmoji}>
                  {weather.icon}
                </ThemedText>
                <View style={styles.weatherInfo}>
                  <ThemedText style={styles.weatherTemp}>
                    {weather.temperature}°
                  </ThemedText>
                  <ThemedText
                    style={[styles.weatherCity, { color: muted as any }]}
                  >
                    {weather.city.split(",")[0]}
                  </ThemedText>
                </View>
              </>
            )}
          </View>
        </View>
      );
    }

    if (headerImage) {
      return <View style={styles.headerImageWrapper}>{headerImage}</View>;
    }

    if (headerIcon) {
      const iconSize = headerIcon.size || 80;
      const iconColor =
        headerIcon.color || (theme === "dark" ? "#ffffff" : "#000000");

      return (
        <View style={styles.headerIconContainer}>
          {headerIcon.library === "ionicons" ? (
            <View
              style={[
                styles.iconPlaceholder,
                {
                  width: iconSize,
                  height: iconSize,
                  backgroundColor: iconColor + "20",
                  borderRadius: iconSize / 2,
                },
              ]}
            >
              <ThemedText
                style={[styles.iconPlaceholderText, { color: iconColor }]}
              >
                📱
              </ThemedText>
            </View>
          ) : headerIcon.library === "lucide" ? (
            <View
              style={[
                styles.iconPlaceholder,
                {
                  width: iconSize,
                  height: iconSize,
                  backgroundColor: iconColor + "20",
                  borderRadius: iconSize / 2,
                },
              ]}
            >
              <ThemedText
                style={[styles.iconPlaceholderText, { color: iconColor }]}
              >
                {/* <MoonStar /> */}
              </ThemedText>
            </View>
          ) : null}
        </View>
      );
    }

    return null;
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const titleOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
        [1, 0.8, 0]
      ),
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <Animated.View
          style={[
            styles.header,
            { backgroundColor: headerBgColor },
            headerAnimatedStyle,
          ]}
        >
          {renderHeaderContent()}

          {/* Overlay avec titre et actions */}
          <View style={styles.headerOverlay}>
            {/* Boutons d'action en haut à droite - zone de clic améliorée */}
            <View style={styles.actionButtonsContainer}>
              {actionButtons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={button.onPress}
                  style={[
                    styles.actionButton,
                    { backgroundColor: surface + "CC" },
                  ]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={button.icon}
                    size={20}
                    color={accentColor}
                  />
                </TouchableOpacity>
              ))}

              {showThemeToggle && (
                <TouchableOpacity
                  onPress={toggleTheme}
                  style={[
                    styles.actionButton,
                    { backgroundColor: surface + "CC" },
                  ]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.themeIcon}>
                    {theme === "dark" ? "☀️" : "🌙"}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            {/* Titre et sous-titre */}
            {(title || subtitle) && (
              <Animated.View style={[styles.titleContainer, titleOpacityStyle]}>
                {title && (
                  <View style={styles.titleWrapper}>
                    {typeof title === "string" ? (
                      <ThemedText style={styles.headerTitle}>
                        {title}
                      </ThemedText>
                    ) : (
                      title
                    )}
                  </View>
                )}
                {subtitle && (
                  <View style={styles.subtitleWrapper}>
                    {typeof subtitle === "string" ? (
                      <ThemedText
                        style={[styles.headerSubtitle, { color: muted as any }]}
                      >
                        {subtitle}
                      </ThemedText>
                    ) : (
                      subtitle
                    )}
                  </View>
                )}
              </Animated.View>
            )}
          </View>
        </Animated.View>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60, // Augmenté pour meilleure accessibilité
  },
  // Nouveau style pour l'icône météo en bas à gauche
  weatherIconContainer: {
    position: "absolute",
    bottom: 16,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weatherIconContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weatherEmoji: {
    fontSize: 56,
    lineHeight: 64,
    textAlign: "center",
    minWidth: 64,
    minHeight: 64,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  weatherInfo: {
    justifyContent: "center",
    gap: 0,
  },
  weatherTemp: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 32,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  weatherCity: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    gap: 10,
    zIndex: 100, // Priorité maximale pour les boutons
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  themeIcon: {
    fontSize: 20,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  titleWrapper: {
    alignItems: "center",
    marginBottom: 8,
  },
  subtitleWrapper: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
  headerImageWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: 0,
    paddingLeft: 10,
  },
  headerIconContainer: {
    position: "absolute",
    bottom: 16,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconPlaceholderText: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
