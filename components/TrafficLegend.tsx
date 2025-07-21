import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useMapSettings } from "@/hooks/use-map-settings";

export default function TrafficLegend() {
  const { showLegend } = useMapSettings();
  
  if (!showLegend) return null;
  
  return (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Traffic Conditions</Text>
      <View style={styles.legendItem}>
        <View style={[styles.legendLine, styles.lightTraffic]} />
        <Text style={styles.legendText}>Light</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendLine, styles.mediumTraffic]} />
        <Text style={styles.legendText}>Medium</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendLine, styles.heavyTraffic]} />
        <Text style={styles.legendText}>Heavy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendContainer: {
    position: "absolute",
    left: 16,
    bottom: 30,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  legendLine: {
    width: 30,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#555",
  },
  lightTraffic: {
    backgroundColor: "#4CAF50", // Green
  },
  mediumTraffic: {
    backgroundColor: "#FF9800", // Orange
  },
  heavyTraffic: {
    backgroundColor: "#F44336", // Red
  },
});