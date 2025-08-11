import { Tabs } from "expo-router";
import { Map, Menu } from "lucide-react-native";
import React from "react";
import { useMapSettings } from "@/hooks/use-map-settings";
import { lightTheme, darkTheme } from "@/constants/theme";

export default function TabLayout() {
  const { darkMode } = useMapSettings();
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.text,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Traffic Map",
          tabBarIcon: ({ color }) => <Map color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Menu color={color} />,
        }}
      />
    </Tabs>
  );
}