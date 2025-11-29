import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WeatherWidget from "@/components/WeatherWidget";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useAppTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";

// Imports conditionnels pour les icônes (à installer si nécessaire)
// import { Ionicons } from '@expo/vector-icons';
// import { LucideIcon } from 'lucide-react-native';

const HEADER_HEIGHT = 160;

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

  // Extract color string from accent object if it's an object
  const accentColor =
    typeof accent === "object" && "color" in accent ? accent.color : accent;

  // Couleur de fond par défaut basée sur le thème
  const defaultHeaderColor = theme === "dark" ? "#1e293b" : "#e2e8f0";
  const headerBgColor = headerBackgroundColor
    ? headerBackgroundColor[theme]
    : defaultHeaderColor;

  // Fonction pour rendre le contenu du header
  const renderHeaderContent = () => {
    if (headerImage) {
      return <View style={styles.headerImageWrapper}>{headerImage}</View>;
    }

    if (headerIcon) {
      const iconSize = headerIcon.size || 80;
      const iconColor =
        headerIcon.color || (theme === "dark" ? "#ffffff" : "#000000");

      // Conteneur positionné en bas à gauche pour l'icône
      return (
        <View style={styles.headerIconContainer}>
          {headerIcon.library === "ionicons" ? (
            // Placeholder pour Ionicons - nécessite @expo/vector-icons
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
            // Placeholder pour Lucide - nécessite lucide-react-native
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

    // Contenu par défaut si aucune image ni icône
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

  // Animation pour le widget météo (glassmorphism avec parallaxe)
  const weatherAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollOffset.value,
        [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
        [1, 0.85, 0.6]
      ),
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, HEADER_HEIGHT],
            [0, -15]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [0, HEADER_HEIGHT], [1, 0.95]),
        },
      ],
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
            {/* Widget météo centré horizontalement */}
            {showWeather && (
              <Animated.View
                style={[styles.weatherContainer, weatherAnimatedStyle]}
              >
                <WeatherWidget compact={false} />
              </Animated.View>
            )}

            {/* Boutons d'action en haut à droite */}
            <View style={styles.actionButtonsContainer}>
              {actionButtons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={button.onPress}
                  style={[
                    styles.actionButton,
                    { backgroundColor: surface + "CC" },
                  ]}
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
    paddingTop: 50, // Pour éviter la status bar
  },
  weatherContainer: {
    position: "absolute",
    top: 60, // Position sous la barre de statut
    left: 0,
    right: 0,
    alignItems: "center", // Centre horizontalement
    zIndex: 10,
    paddingHorizontal: 20, // Padding pour éviter les bords
    // Effet glassmorphism amélioré
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  themeIcon: {
    fontSize: 18,
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
