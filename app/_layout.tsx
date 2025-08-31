import { AppThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AppThemeProvider>
      <ThemeWrapper>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeWrapper>
    </AppThemeProvider>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  // use the system hook for initial mapping to react-navigation themes
  const { theme } = useAppTheme();
  const navTheme = theme === "dark" ? DarkTheme : DefaultTheme;
  return <ThemeProvider value={navTheme}>{children}</ThemeProvider>;
}
