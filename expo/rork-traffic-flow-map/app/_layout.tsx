import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MapSettingsProvider } from "@/hooks/useMapSettings";
import { ThemeProvider, useTheme } from "@/hooks/useTheme";
import { colors } from "@/constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isDark } = useTheme();
  
  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: isDark ? colors.transparent.primary : colors.glass.light,
        },
        headerTintColor: isDark ? colors.white.primary : colors.black.primary,
        headerTitleStyle: {
          color: isDark ? colors.white.primary : colors.black.primary,
        },
        contentStyle: {
          backgroundColor: isDark ? colors.black.primary : colors.white.primary,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

function AppContent() {
  return (
    <MapSettingsProvider>
      <RootLayoutNav />
    </MapSettingsProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}