import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Define types for map settings - updated to match Google Maps styles
type MapType = "standard" | "satellite" | "hybrid";

export const [MapSettingsProvider, useMapSettings] = createContextHook(() => {
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [mapType, setMapType] = useState<MapType>("standard");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Notification settings
  const [alertRadius, setAlertRadius] = useState<number>(5); // in miles
  const [trafficAlertsEnabled, setTrafficAlertsEnabled] = useState<boolean>(true);
  const [roadClosuresEnabled, setRoadClosuresEnabled] = useState<boolean>(true);
  // Coming soon - disabled for now
  // const [accidentsEnabled, setAccidentsEnabled] = useState<boolean>(true);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Skip AsyncStorage on web to avoid errors
        if (Platform.OS === 'web') {
          setIsLoading(false);
          return;
        }

        const storedSettings = await AsyncStorage.getItem("mapSettings");
        if (storedSettings) {
                  const settings = JSON.parse(storedSettings);
        setShowTraffic(settings.showTraffic ?? true);
        setShowLegend(settings.showLegend ?? true);
        setMapType(settings.mapType ?? "standard");
        setDarkMode(settings.darkMode ?? false);
        setAlertRadius(settings.alertRadius ?? 5);
        setTrafficAlertsEnabled(settings.trafficAlertsEnabled ?? true);
        setRoadClosuresEnabled(settings.roadClosuresEnabled ?? true);
        // Coming soon - disabled for now
        // setAccidentsEnabled(settings.accidentsEnabled ?? true);
        }
      } catch (error) {
        console.error("Failed to load map settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        // Skip AsyncStorage on web to avoid errors
        if (Platform.OS === 'web') {
          return;
        }

        const settings = {
          showTraffic,
          showLegend,
          mapType,
          darkMode,
          alertRadius,
          trafficAlertsEnabled,
          roadClosuresEnabled,
          // Coming soon - disabled for now
          // accidentsEnabled,
        };
        await AsyncStorage.setItem("mapSettings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save map settings:", error);
      }
    };

    // Don't save on initial load
    if (!isLoading) {
      saveSettings();
    }
  }, [
    showTraffic,
    showLegend,
    mapType,
    darkMode,
    alertRadius,
    trafficAlertsEnabled,
    roadClosuresEnabled,
    // Coming soon - disabled for now
    // accidentsEnabled,
    isLoading,
  ]);

  return {
    showTraffic,
    setShowTraffic,
    showLegend,
    setShowLegend,
    mapType,
    setMapType,
    darkMode,
    setDarkMode,
    alertRadius,
    setAlertRadius,
    trafficAlertsEnabled,
    setTrafficAlertsEnabled,
    roadClosuresEnabled,
    setRoadClosuresEnabled,
    // Coming soon - disabled for now
    // accidentsEnabled,
    // setAccidentsEnabled,
    isLoading,
  };
});