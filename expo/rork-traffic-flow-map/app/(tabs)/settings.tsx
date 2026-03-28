import React from "react";
import { StyleSheet, View, Text, Switch, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { ChevronRight, Moon, Sun, Map, Bell, Settings as SettingsIcon } from "lucide-react-native";
import { useMapSettings } from "@/hooks/useMapSettings";
import { useTheme } from "@/hooks/useTheme";
import { TransparentCard } from "@/components/TransparentCard";
import { TransparentButton } from "@/components/TransparentButton";
import { colors } from "@/constants/colors";

export default function SettingsScreen() {
  const { 
    showTraffic, 
    setShowTraffic,
    mapType,
    setMapType,
    showLegend,
    setShowLegend,
    alertRadius,
    setAlertRadius,
    trafficAlertsEnabled,
    setTrafficAlertsEnabled,
    roadClosuresEnabled,
    setRoadClosuresEnabled,
    accidentsEnabled,
    setAccidentsEnabled,
  } = useMapSettings();

  const { isDark, toggleTheme } = useTheme();

  const handleTermsOfService = () => {
    Alert.alert(
      "Terms of Use",
      "Effective Date: January 2025\n\n" +
      "These Terms govern your use of the Traffic Tracker mobile application. By using the app, you agree to these terms.\n\n" +
      "1. Eligibility\n" +
      "You must be at least 13 years old or have parental/guardian consent to use this app.\n\n" +
      "2. App Usage\n" +
      "• Use the app responsibly and in accordance with traffic laws.\n" +
      "• Do not use the app while operating a vehicle unless it's in hands-free mode.\n\n" +
      "3. License\n" +
      "You are granted a limited, non-exclusive, non-transferable license to use Traffic Tracker for personal use only.\n\n" +
      "4. Limitations\n" +
      "We do our best to ensure data accuracy, but Traffic Tracker is not liable for:\n" +
      "• Inaccurate or delayed alerts.\n" +
      "• Decisions made based on app information.\n" +
      "• Any direct or indirect damage resulting from app usage.\n\n" +
      "5. Updates and Changes\n" +
      "We may modify these Terms and the app features at any time. Continued use of the app indicates your acceptance of updated terms.",
      [{ text: "OK" }]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About Traffic Tracker",
      "Traffic Tracker is your real-time companion for safe and smart navigation. We provide users with timely alerts on traffic congestion, road closures, accidents, and hazards nearby. Whether you're commuting or planning a trip, Traffic Tracker helps you stay ahead of delays and drive with confidence.\n\n" +
      "Key Features:\n" +
      "• Live traffic notification alerts\n" +
      "• Real-time accident and hazard notifications\n" +
      "• Road closure updates\n" +
      "• Visual traffic heatmaps (color-coded by severity) - In Development\n\n" +
      "Traffic Tracker is built with user experience, safety, and accuracy in mind. Our mission is to make travel easier for everyone, using technology to keep you informed and on the move.",
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? colors.black.primary : colors.white.primary }]}>
      {/* Modern Header */}
      <TransparentCard variant="heavy" style={styles.header}>
        <View style={styles.headerContent}>
          <SettingsIcon size={32} color={isDark ? colors.white.primary : colors.black.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: isDark ? colors.white.primary : colors.black.primary }]}>Settings</Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? colors.white.primary : colors.black.primary }]}>
              Customize your experience
            </Text>
          </View>
        </View>
      </TransparentCard>

      {/* Appearance Section */}
      <TransparentCard variant="medium" style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionContent}>
            <View style={styles.sectionIcon}>
              {isDark ? <Moon size={24} color={isDark ? colors.white.primary : colors.black.primary} /> : <Sun size={24} color={isDark ? colors.white.primary : colors.black.primary} />}
            </View>
            <View style={styles.sectionText}>
              <Text style={[styles.sectionTitle, { color: isDark ? colors.white.primary : colors.black.primary }]}>Appearance</Text>
              <Text style={[styles.sectionDescription, { color: isDark ? colors.white.primary : colors.black.primary }]}>
                Dark mode and visual preferences
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.gray.primary, true: colors.accent.blue }}
            thumbColor={colors.white.primary}
            disabled={Platform.OS === 'web'}
            testID="theme-toggle"
          />
        </View>
      </TransparentCard>

      {/* Map Settings Section */}
      <TransparentCard variant="medium" style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionContent}>
                         <View style={styles.sectionIcon}>
               <Map size={24} color={isDark ? colors.white.primary : colors.black.primary} />
             </View>
             <View style={styles.sectionText}>
               <Text style={[styles.sectionTitle, { color: isDark ? colors.white.primary : colors.black.primary }]}>Map Settings</Text>
               <Text style={[styles.sectionDescription, { color: isDark ? colors.white.primary : colors.black.primary }]}>
                 Customize your map view and display options
               </Text>
             </View>
          </View>
        </View>
        
        <View style={styles.settingItems}>
                     <View style={[styles.settingItem, { borderBottomColor: isDark ? colors.glass.light : colors.gray.light }]}>
             <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Show Traffic</Text>
             <Switch
               value={showTraffic}
               onValueChange={setShowTraffic}
               trackColor={{ false: colors.gray.primary, true: colors.accent.blue }}
               thumbColor={colors.white.primary}
               testID="traffic-toggle"
               disabled={Platform.OS === 'web'}
             />
           </View>
           
           <View style={styles.settingItem}>
             <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Show Traffic Legend</Text>
             <Switch
               value={showLegend}
               onValueChange={setShowLegend}
               trackColor={{ false: colors.gray.primary, true: colors.accent.blue }}
               thumbColor={colors.white.primary}
               testID="legend-toggle"
               disabled={Platform.OS === 'web'}
             />
           </View>
        </View>

                 <View style={[styles.mapTypeSection, { borderTopColor: isDark ? colors.glass.light : colors.gray.light }]}>
           <Text style={[styles.mapTypeLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Map Type</Text>
          <View style={styles.mapTypeContainer}>
            {(["standard", "satellite", "hybrid"] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mapTypeButton,
                  { borderColor: colors.glass.medium },
                  mapType === type && { 
                    backgroundColor: colors.accent.blue, 
                    borderColor: colors.accent.blue 
                  },
                  Platform.OS === 'web' && { opacity: 0.6 }
                ]}
                onPress={() => Platform.OS !== 'web' && setMapType(type)}
                testID={`map-type-${type}`}
                disabled={Platform.OS === 'web'}
              >
                                 <Text
                   style={[
                     styles.mapTypeText,
                     { color: isDark ? colors.white.primary : colors.black.primary },
                     mapType === type && { color: colors.white.primary },
                     Platform.OS === 'web' && { color: colors.gray.primary }
                   ]}
                 >
                   {type.charAt(0).toUpperCase() + type.slice(1)}
                 </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TransparentCard>

      {/* Notifications Section */}
      <TransparentCard variant="medium" style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionContent}>
                         <View style={styles.sectionIcon}>
               <Bell size={24} color={isDark ? colors.white.primary : colors.black.primary} />
             </View>
             <View style={styles.sectionText}>
               <Text style={[styles.sectionTitle, { color: isDark ? colors.white.primary : colors.black.primary }]}>Notifications</Text>
               <Text style={[styles.sectionDescription, { color: isDark ? colors.white.primary : colors.black.primary }]}>
                 Choose what alerts you want to receive
               </Text>
             </View>
          </View>
        </View>
        
        <View style={styles.settingItems}>
                     <View style={[styles.settingItem, { borderBottomColor: isDark ? colors.glass.light : colors.gray.light }]}>
             <View style={styles.settingContent}>
               <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Traffic Alerts</Text>
               <Text style={[styles.settingDescription, { color: isDark ? colors.white.primary : colors.black.primary }]}>
                 Updates on nearby traffic jams
               </Text>
             </View>
             <Switch
               value={trafficAlertsEnabled}
               onValueChange={setTrafficAlertsEnabled}
               trackColor={{ false: colors.gray.primary, true: colors.accent.blue }}
               thumbColor={colors.white.primary}
               testID="traffic-alerts-toggle"
               disabled={Platform.OS === 'web'}
             />
           </View>
           
           <View style={[styles.settingItem, { borderBottomColor: isDark ? colors.glass.light : colors.gray.light }]}>
             <View style={styles.settingContent}>
               <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Road Closures</Text>
               <Text style={[styles.settingDescription, { color: isDark ? colors.white.primary : colors.black.primary }]}>
                 Alerts for closed or blocked roads
               </Text>
             </View>
             <Switch
               value={roadClosuresEnabled}
               onValueChange={setRoadClosuresEnabled}
               trackColor={{ false: colors.gray.primary, true: colors.accent.blue }}
               thumbColor={colors.white.primary}
               testID="road-closures-toggle"
               disabled={Platform.OS === 'web'}
             />
           </View>
           
           <View style={styles.settingItem}>
             <View style={styles.settingContent}>
               <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Accidents</Text>
               <Text style={[styles.settingDescription, { color: isDark ? colors.white.primary : colors.black.primary }]}>
                 Notifications about nearby accidents
               </Text>
             </View>
             <Switch
               value={accidentsEnabled}
               onValueChange={setAccidentsEnabled}
               trackColor={{ false: colors.gray.primary, true: colors.accent.blue }}
               thumbColor={colors.white.primary}
               testID="accidents-toggle"
               disabled={Platform.OS === 'web'}
             />
           </View>
        </View>
      </TransparentCard>

      {/* App Info Section */}
      <TransparentCard variant="medium" style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionContent}>
                         <View style={styles.sectionIcon}>
               <SettingsIcon size={24} color={isDark ? colors.white.primary : colors.black.primary} />
             </View>
             <View style={styles.sectionText}>
               <Text style={[styles.sectionTitle, { color: isDark ? colors.white.primary : colors.black.primary }]}>App Information</Text>
               <Text style={[styles.sectionDescription, { color: isDark ? colors.white.primary : colors.black.primary }]}>
                 Version details and legal information
               </Text>
             </View>
          </View>
        </View>
        
        <View style={styles.settingItems}>
                     <View style={[styles.settingItem, { borderBottomColor: isDark ? colors.glass.light : colors.gray.light }]}>
             <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Version</Text>
             <Text style={[styles.settingValue, { color: isDark ? colors.white.primary : colors.black.primary }]}>1.0.0</Text>
           </View>
           
           <View style={[styles.settingItem, { borderBottomColor: isDark ? colors.glass.light : colors.gray.light }]}>
             <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Last Updated</Text>
             <Text style={[styles.settingValue, { color: isDark ? colors.white.primary : colors.black.primary }]}>January 2025</Text>
           </View>
           
           <TouchableOpacity style={[styles.settingItem, { borderBottomColor: isDark ? colors.glass.light : colors.gray.light }]} onPress={handleTermsOfService}>
             <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>Terms of Service</Text>
             <ChevronRight size={20} color={isDark ? colors.white.primary : colors.black.primary} />
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
             <Text style={[styles.settingLabel, { color: isDark ? colors.white.primary : colors.black.primary }]}>About Traffic Tracker</Text>
             <ChevronRight size={20} color={isDark ? colors.white.primary : colors.black.primary} />
           </TouchableOpacity>
        </View>
      </TransparentCard>

      {/* Traffic Information Section */}
      <TransparentCard variant="medium" style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionContent}>
                         <View style={styles.sectionIcon}>
               <Map size={24} color={isDark ? colors.white.primary : colors.black.primary} />
             </View>
             <View style={styles.sectionText}>
               <Text style={[styles.sectionTitle, { color: isDark ? colors.white.primary : colors.black.primary }]}>Traffic Information</Text>
               <Text style={[styles.sectionDescription, { color: isDark ? colors.white.primary : colors.black.primary }]}>
                 Understanding traffic condition indicators
               </Text>
             </View>
          </View>
        </View>
        
        <View style={styles.trafficInfo}>
                     <View style={styles.trafficItem}>
             <View style={[styles.trafficIndicator, { backgroundColor: colors.accent.green }]} />
             <Text style={[styles.trafficText, { color: isDark ? colors.white.primary : colors.black.primary }]}>
               Light Traffic - Free flowing conditions
             </Text>
           </View>
           <View style={styles.trafficItem}>
             <View style={[styles.trafficIndicator, { backgroundColor: colors.accent.yellow }]} />
             <Text style={[styles.trafficText, { color: isDark ? colors.white.primary : colors.black.primary }]}>
               Medium Traffic - Moderate delays expected
             </Text>
           </View>
           <View style={styles.trafficItem}>
             <View style={[styles.trafficIndicator, { backgroundColor: colors.accent.red }]} />
             <Text style={[styles.trafficText, { color: isDark ? colors.white.primary : colors.black.primary }]}>
               Heavy Traffic - Significant delays
             </Text>
           </View>
        </View>
      </TransparentCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    margin: 20,
    marginBottom: 24,
    padding: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.glass.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  settingItems: {
    marginTop: 8,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
    marginRight: 20,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.7,
  },
  settingValue: {
    fontSize: 17,
    fontWeight: "500",
  },
     mapTypeSection: {
     marginTop: 24,
     paddingTop: 20,
     borderTopWidth: 1,
   },
  mapTypeLabel: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 16,
  },
     mapTypeContainer: {
     flexDirection: "row",
     gap: 6,
     justifyContent: "space-between",
   },
   mapTypeButton: {
     flex: 1,
     minWidth: 100,
     paddingVertical: 12,
     paddingHorizontal: 12,
     borderRadius: 8,
     borderWidth: 1,
     alignItems: "center",
     justifyContent: "center",
     backgroundColor: colors.transparent.secondary,
   },
     mapTypeText: {
     fontSize: 13,
     fontWeight: "500",
     textAlign: "center",
     flexShrink: 1,
   },
  trafficInfo: {
    marginTop: 20,
    gap: 16,
  },
  trafficItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  trafficIndicator: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  trafficText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
});
