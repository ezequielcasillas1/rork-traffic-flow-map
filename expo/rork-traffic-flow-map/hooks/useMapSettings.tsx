import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MapSettings {
  showTraffic: boolean;
  setShowTraffic: (show: boolean) => void;
  mapType: 'standard' | 'satellite' | 'hybrid';
  setMapType: (type: 'standard' | 'satellite' | 'hybrid') => void;
  showLegend: boolean;
  setShowLegend: (show: boolean) => void;
  alertRadius: number;
  setAlertRadius: (radius: number) => void;
  trafficAlertsEnabled: boolean;
  setTrafficAlertsEnabled: (enabled: boolean) => void;
  roadClosuresEnabled: boolean;
  setRoadClosuresEnabled: (enabled: boolean) => void;
  accidentsEnabled: boolean;
  setAccidentsEnabled: (enabled: boolean) => void;
}

const MapSettingsContext = createContext<MapSettings | undefined>(undefined);

const STORAGE_KEYS = {
  SHOW_TRAFFIC: '@show_traffic',
  MAP_TYPE: '@map_type',
  SHOW_LEGEND: '@show_legend',
  ALERT_RADIUS: '@alert_radius',
  TRAFFIC_ALERTS: '@traffic_alerts',
  ROAD_CLOSURES: '@road_closures',
  ACCIDENTS: '@accidents',
};

export function MapSettingsProvider({ children }: { children: React.ReactNode }) {
  const [showTraffic, setShowTraffic] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [showLegend, setShowLegend] = useState(true);
  const [alertRadius, setAlertRadius] = useState(2);
  const [trafficAlertsEnabled, setTrafficAlertsEnabled] = useState(true);
  const [roadClosuresEnabled, setRoadClosuresEnabled] = useState(true);
  const [accidentsEnabled, setAccidentsEnabled] = useState(true);

  // Load settings from storage
  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [
        storedShowTraffic,
        storedMapType,
        storedShowLegend,
        storedAlertRadius,
        storedTrafficAlerts,
        storedRoadClosures,
        storedAccidents,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SHOW_TRAFFIC),
        AsyncStorage.getItem(STORAGE_KEYS.MAP_TYPE),
        AsyncStorage.getItem(STORAGE_KEYS.SHOW_LEGEND),
        AsyncStorage.getItem(STORAGE_KEYS.ALERT_RADIUS),
        AsyncStorage.getItem(STORAGE_KEYS.TRAFFIC_ALERTS),
        AsyncStorage.getItem(STORAGE_KEYS.ROAD_CLOSURES),
        AsyncStorage.getItem(STORAGE_KEYS.ACCIDENTS),
      ]);

      if (storedShowTraffic !== null) setShowTraffic(storedShowTraffic === 'true');
      if (storedMapType && ['standard', 'satellite', 'hybrid'].includes(storedMapType)) {
        setMapType(storedMapType as 'standard' | 'satellite' | 'hybrid');
      }
      if (storedShowLegend !== null) setShowLegend(storedShowLegend === 'true');
      if (storedAlertRadius !== null) setAlertRadius(parseFloat(storedAlertRadius));
      if (storedTrafficAlerts !== null) setTrafficAlertsEnabled(storedTrafficAlerts === 'true');
      if (storedRoadClosures !== null) setRoadClosuresEnabled(storedRoadClosures === 'true');
      if (storedAccidents !== null) setAccidentsEnabled(storedAccidents === 'true');
    } catch (error) {
      console.error('Failed to load map settings:', error);
    }
  };

  // Save settings to storage
  const saveSetting = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to save setting ${key}:`, error);
    }
  };

  const wrappedSetShowTraffic = (show: boolean) => {
    setShowTraffic(show);
    saveSetting(STORAGE_KEYS.SHOW_TRAFFIC, show.toString());
  };

  const wrappedSetMapType = (type: 'standard' | 'satellite' | 'hybrid') => {
    setMapType(type);
    saveSetting(STORAGE_KEYS.MAP_TYPE, type);
  };

  const wrappedSetShowLegend = (show: boolean) => {
    setShowLegend(show);
    saveSetting(STORAGE_KEYS.SHOW_LEGEND, show.toString());
  };

  const wrappedSetAlertRadius = (radius: number) => {
    setAlertRadius(radius);
    saveSetting(STORAGE_KEYS.ALERT_RADIUS, radius.toString());
  };

  const wrappedSetTrafficAlertsEnabled = (enabled: boolean) => {
    setTrafficAlertsEnabled(enabled);
    saveSetting(STORAGE_KEYS.TRAFFIC_ALERTS, enabled.toString());
  };

  const wrappedSetRoadClosuresEnabled = (enabled: boolean) => {
    setRoadClosuresEnabled(enabled);
    saveSetting(STORAGE_KEYS.ROAD_CLOSURES, enabled.toString());
  };

  const wrappedSetAccidentsEnabled = (enabled: boolean) => {
    setAccidentsEnabled(enabled);
    saveSetting(STORAGE_KEYS.ACCIDENTS, enabled.toString());
  };

  return (
    <MapSettingsContext.Provider
      value={{
        showTraffic,
        setShowTraffic: wrappedSetShowTraffic,
        mapType,
        setMapType: wrappedSetMapType,
        showLegend,
        setShowLegend: wrappedSetShowLegend,
        alertRadius,
        setAlertRadius: wrappedSetAlertRadius,
        trafficAlertsEnabled,
        setTrafficAlertsEnabled: wrappedSetTrafficAlertsEnabled,
        roadClosuresEnabled,
        setRoadClosuresEnabled: wrappedSetRoadClosuresEnabled,
        accidentsEnabled,
        setAccidentsEnabled: wrappedSetAccidentsEnabled,
      }}
    >
      {children}
    </MapSettingsContext.Provider>
  );
}

export function useMapSettings() {
  const context = useContext(MapSettingsContext);
  if (context === undefined) {
    throw new Error('useMapSettings must be used within a MapSettingsProvider');
  }
  return context;
}
