import { Tabs } from "expo-router";
import { Map, Settings } from "lucide-react-native";
import React from "react";

import { useTheme } from "@/hooks/useTheme";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  const { isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent.blue,
        tabBarInactiveTintColor: colors.gray.primary,
        tabBarStyle: {
          backgroundColor: isDark ? colors.transparent.primary : colors.glass.light,
          borderTopColor: isDark ? colors.glass.light : colors.gray.light,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}