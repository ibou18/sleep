import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";

export default function TabLayout() {
  const { theme } = useAppTheme();
  const colors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: colors.surface + "95", // Semi-transparent
            borderTopColor: colors.muted + "30",
            borderTopWidth: 0.5,
          },
          default: {
            backgroundColor: colors.surface,
            borderTopColor: colors.muted + "30",
            borderTopWidth: 0.5,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Sommeil",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 24}
              name="moon.stars.fill"
              color={color}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="datetime-test"
        options={{
          title: "Test Natif",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 24}
              name="clock.fill"
              color={color}
            />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="explore"
        options={{
          title: "Info",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 24}
              name="info.circle"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
