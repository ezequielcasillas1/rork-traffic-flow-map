import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import createContextHook from "@nkzw/create-context-hook";

// Define types for map settings
type MapType = "standard" | "satellite" | "hybrid";

export const [MapSettingsProvider, useMapSettings] = createContextHook(() => {
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [mapType, setMapType] = useState<MapType>("standard");
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
    if (!isLoading && Platform.OS !== 'web') {
      const saveSettings = async () => {
        try {
          const settings = {
            showTraffic,
            showLegend,
            mapType,
          };
          await AsyncStorage.setItem("mapSettings", JSON.stringify(settings));
        } catch (error) {
          console.error("Failed to save map settings:", error);
        }
      };

      saveSettings();
    }
  }, [showTraffic, showLegend, mapType, isLoading]);

  return {
    showTraffic,
    setShowTraffic,
    showLegend,
    setShowLegend,
    mapType,
    setMapType,
    isLoading,
  };
});