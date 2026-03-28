import React, { useState } from "react";
import { StyleSheet, View, Text, Platform, TouchableOpacity, Animated } from "react-native";
import { useMapSettings } from "@/hooks/use-map-settings";
import { lightTheme, darkTheme } from "@/constants/theme";

export default function TrafficLegend() {
  const { darkMode } = useMapSettings();
  const theme = darkMode ? darkTheme : lightTheme;
  const [isExpanded, setIsExpanded] = useState(false);

  if (Platform.OS === 'web') {
    return null;
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, { color: theme.text }]}>🚦 Traffic Legend</Text>
        <Text style={[styles.expandIcon, { color: theme.text }]}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
            {isExpanded && (
        <>
          <View style={styles.legendSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Traffic Flow</Text>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: theme.trafficGreen }]} />
              <Text style={[styles.legendText, { color: theme.text }]}>Free Flow</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: theme.trafficOrange }]} />
              <Text style={[styles.legendText, { color: theme.text }]}>Moderate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: theme.trafficRed }]} />
              <Text style={[styles.legendText, { color: theme.text }]}>Heavy Congestion</Text>
            </View>
          </View>

          <View style={styles.legendSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Incident Types</Text>
            <View style={styles.legendItem}>
              <Text style={styles.incidentIcon}>🚦</Text>
              <Text style={[styles.legendText, { color: theme.text }]}>Traffic</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.incidentIcon}>🚧</Text>
              <Text style={[styles.legendText, { color: theme.text }]}>Road Closure</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    bottom: 30,
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  expandIcon: {
    fontSize: 12,
  },
  legendSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  colorBox: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 8,
  },
  incidentIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  severityBox: {
    width: 15,
    height: 15,
    borderRadius: 3,
    marginRight: 8,
  },
});