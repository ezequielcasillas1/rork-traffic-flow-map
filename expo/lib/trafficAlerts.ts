import { supabase } from './supabase';
import { RoadClosureData } from './roadClosureDetection';

export type TrafficAlertType = 'traffic' | 'road-closure' | 'accident';

export interface TrafficAlertData {
  locationName: string;
  timeAway: string;
  coordinates?: { lat: number; lng: number };
  severity?: 'low' | 'medium' | 'high';
  description?: string;
}

// Send traffic alert via Expo push notifications
export const sendTrafficAlert = async (
  expoPushToken: string,
  type: TrafficAlertType,
  data: TrafficAlertData
) => {
  let title = '';
  let body = '';

  switch (type) {
    case 'traffic':
      title = `🚦 Traffic Alert`;
      body = `Heavy Traffic on ${data.locationName}`;
      break;
    case 'road-closure':
      title = `🚧 Road Closure`;
      body = `Road Closed at ${data.locationName}`;
      break;
    case 'accident':
      title = `⚠️ Accident Alert`;
      body = `Accident Near ${data.locationName}`;
      break;
  }

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { 
      type: type,
      locationName: data.locationName,
      timeAway: data.timeAway,
      coordinates: data.coordinates,
      severity: data.severity,
      description: data.description
    },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    return result.data?.status === 'ok';
  } catch (error) {
    console.error('Failed to send traffic alert:', error);
    return false;
  }
};

// Send road closure alert via Expo push notifications
export const sendRoadClosureAlert = async (
  expoPushToken: string,
  closureData: RoadClosureData
) => {
  const title = `🚧 Road Closure Alert`;
  const body = `${closureData.title} on ${closureData.location.name}`;
  
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: { 
      type: 'road-closure',
      locationName: closureData.location.name,
      timeAway: closureData.timeAway,
      coordinates: closureData.location.coordinates,
      severity: closureData.severity,
      description: closureData.description,
      estimatedDuration: closureData.estimatedDuration,
      trafficImpact: closureData.trafficImpact
    },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    return result.data?.status === 'ok';
  } catch (error) {
    console.error('Failed to send road closure alert:', error);
    return false;
  }
};

// Save traffic alert to Supabase
export const saveTrafficAlert = async (alertData: {
  type: TrafficAlertType;
  locationName: string;
  timeAway: string;
  coordinates?: { lat: number; lng: number };
  severity?: 'low' | 'medium' | 'high';
  description?: string;
  userId?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('traffic_alerts')
      .insert([{
        type: alertData.type,
        location_name: alertData.locationName,
        time_away: alertData.timeAway,
        coordinates: alertData.coordinates,
        severity: alertData.severity,
        description: alertData.description,
        user_id: alertData.userId,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving traffic alert:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to save traffic alert:', error);
    return false;
  }
};

// Get traffic alerts from Supabase
export const getTrafficAlerts = async (userId?: string) => {
  try {
    let query = supabase
      .from('traffic_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching traffic alerts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch traffic alerts:', error);
    return [];
  }
};

// Check for nearby traffic alerts based on user location
export const checkNearbyAlerts = async (
  userLat: number,
  userLng: number,
  radiusMiles: number = 5
) => {
  try {
    // This is a simplified distance calculation
    // In production, you'd want to use PostGIS or a more sophisticated geospatial query
    const { data, error } = await supabase
      .from('traffic_alerts')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error checking nearby alerts:', error);
      return [];
    }

    // Filter by distance (simplified calculation)
    const nearbyAlerts = data?.filter(alert => {
      if (!alert.coordinates) return false;
      
      const distance = calculateDistance(
        userLat, userLng,
        alert.coordinates.lat, alert.coordinates.lng
      );
      
      return distance <= radiusMiles;
    }) || [];

    return nearbyAlerts;
  } catch (error) {
    console.error('Failed to check nearby alerts:', error);
    return [];
  }
};

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}; 