import Constants from 'expo-constants';
import { reverseGeocode } from './google-maps';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyCYObeujRbMi5mXvhEtGbR8KaYp61PYHPo';

export interface RealTrafficData {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  timeAway: string;
  estimatedDuration: string;
  speedReduction: number;
  trafficLevel: 'low' | 'medium' | 'high';
  congestion: string[];
  createdAt: Date;
}

// Get real traffic data using Google Routes API
export const getRealTrafficData = async (
  userLocation: { lat: number; lng: number },
  alertRadius: number = 5
): Promise<RealTrafficData[]> => {
  try {
    // Generate destination points around user location
    const destinations = generateDestinationsAround(userLocation, alertRadius);
    
    const trafficData = await Promise.all(
      destinations.map(async (destination, index) => {
        try {
          const data = await getTrafficDataFromRoutesAPI(userLocation, destination);
          const locationName = await reverseGeocode(destination.lat, destination.lng) || 
                              `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`;
          
          return {
            id: `traffic_${Date.now()}_${index}`,
            title: `Traffic Alert: ${data.trafficLevel.toUpperCase()} Congestion`,
            description: `Traffic conditions on route to ${locationName}`,
            severity: data.trafficLevel === 'high' ? 'high' : data.trafficLevel === 'medium' ? 'medium' : 'low',
            location: {
              name: locationName,
              coordinates: destination
            },
            timeAway: `${Math.round(data.duration / 60)} min`,
            estimatedDuration: `${Math.round(data.durationInTraffic / 60)} min`,
            speedReduction: data.speedReduction,
            trafficLevel: data.trafficLevel,
            congestion: data.congestion,
            createdAt: new Date()
          };
        } catch (error) {
          console.error('Error getting traffic data for route:', error);
          return null;
        }
      })
    );
    
    return trafficData.filter(Boolean) as RealTrafficData[];
  } catch (error) {
    console.error('Error getting real traffic data:', error);
    throw error;
  }
};

// Enhanced Directions API call with traffic model
const getTrafficDataFromRoutesAPI = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{
  duration: number;
  durationInTraffic: number;
  trafficLevel: 'low' | 'medium' | 'high';
  speedReduction: number;
  congestion: string[];
}> => {
  const originStr = `${origin.lat},${origin.lng}`;
  const destinationStr = `${destination.lat},${destination.lng}`;
  
  // Use Routes API with traffic model
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&traffic_model=best_guess&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
    throw new Error(`Routes API error: ${data.status}`);
  }
  
  const route = data.routes[0];
  const leg = route.legs[0];
  
  // Calculate traffic metrics
  const duration = leg.duration.value; // Normal duration (seconds)
  const durationInTraffic = leg.duration_in_traffic?.value || duration; // Duration with traffic (seconds)
  const speedReduction = ((durationInTraffic - duration) / duration) * 100;
  
  // Determine traffic level
  let trafficLevel: 'low' | 'medium' | 'high';
  if (speedReduction < 20) {
    trafficLevel = 'low';
  } else if (speedReduction < 50) {
    trafficLevel = 'medium';
  } else {
    trafficLevel = 'high';
  }
  
  // Extract congestion information
  const congestion: string[] = [];
  if (leg.steps) {
    leg.steps.forEach((step: any) => {
      if (step.duration_in_traffic && step.duration_in_traffic.value > step.duration.value * 1.2) {
        congestion.push(step.html_instructions.replace(/<[^>]*>/g, ''));
      }
    });
  }
  
  return {
    duration,
    durationInTraffic,
    trafficLevel,
    speedReduction: Math.max(0, speedReduction),
    congestion
  };
};

// Helper functions
const generateDestinationsAround = (
  center: { lat: number; lng: number },
  radiusMiles: number
): Array<{ lat: number; lng: number }> => {
  const destinations = [];
  const directions = [
    { lat: 1, lng: 0 }, { lat: -1, lng: 0 }, { lat: 0, lng: 1 }, { lat: 0, lng: -1 },
    { lat: 0.7, lng: 0.7 }, { lat: 0.7, lng: -0.7 }, { lat: -0.7, lng: 0.7 }, { lat: -0.7, lng: -0.7 }
  ];
  
  const milesToDegrees = radiusMiles / 69; // 1 degree ≈ 69 miles
  
  directions.forEach((direction) => {
    destinations.push({
      lat: center.lat + (direction.lat * milesToDegrees),
      lng: center.lng + (direction.lng * milesToDegrees)
    });
  });
  
  return destinations;
};

export const getLocalTrafficData = getRealTrafficData;
export const getActiveTrafficData = (data: RealTrafficData[]) => data.filter(item => item.trafficLevel !== 'low');
export const getSignificantTrafficAlerts = (data: RealTrafficData[]) => data.filter(item => item.trafficLevel === 'high');

export const monitorTrafficConditions = async (
  userLocation: { lat: number; lng: number },
  callback: (alerts: RealTrafficData[]) => void,
  alertRadius: number = 5
) => {
  try {
    const trafficData = await getRealTrafficData(userLocation, alertRadius);
    const significantAlerts = getSignificantTrafficAlerts(trafficData);
    callback(significantAlerts);
  } catch (error) {
    console.error('Error monitoring traffic conditions:', error);
  }
}; 