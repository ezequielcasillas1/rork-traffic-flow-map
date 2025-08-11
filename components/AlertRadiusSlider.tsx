import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import Slider from "@react-native-community/slider";
import { Theme } from "@/constants/theme";

type AlertRadiusSliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
  theme?: Theme;
};

export function AlertRadiusSlider({ value, onValueChange, disabled, theme }: AlertRadiusSliderProps) {
  // Don't render slider on web
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webContainer, { backgroundColor: theme?.borderLight || '#f5f5f5' }]}>
        <Text style={[styles.webText, { color: theme?.text || '#333' }]}>Alert radius: {value} miles</Text>
        <Text style={[styles.webSubtext, { color: theme?.textSecondary || '#666' }]}>Slider not available on web</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme?.textSecondary || '#666' }]}>1 mile</Text>
        <Text style={[styles.currentValue, { color: theme?.primary || '#2f95dc' }]}>{value} miles</Text>
        <Text style={[styles.label, { color: theme?.textSecondary || '#666' }]}>10 miles</Text>
      </View>
      
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={theme?.primary || "#2f95dc"}
        maximumTrackTintColor={theme?.borderLight || "#d3d3d3"}
        disabled={disabled}
        testID="alert-radius-slider"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#666",
  },
  currentValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2f95dc",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  webContainer: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
  },
  webText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  webSubtext: {
    fontSize: 12,
    color: "#666",
  },
});