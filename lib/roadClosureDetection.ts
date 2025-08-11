import Constants from 'expo-constants';
import { reverseGeocode } from './google-maps';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyCYObeujRbMi5mXvhEtGbR8KaYp61PYHPo';

export interface RoadClosureData {
  id: string;
  type: 'road-closure' | 'construction' | 'accident';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
  estimatedDuration: string;
  timeAway: string;
  createdAt: Date;
  affectedArea: number; // radius in miles
  trafficImpact: 'minimal' | 'moderate' | 'significant' | 'severe';
}

// Detect road closures using Google Maps Directions API with traffic model
export const detectRoadClosures = async (
  userLocation: { lat: number; lng: number },
  alertRadius: number = 5
): Promise<RoadClosureData[]> => {
  try {
    // Generate routes in different directions to detect closures
    const directions = [
      { lat: 1, lng: 0 }, { lat: -1, lng: 0 }, { lat: 0, lng: 1 }, { lat: 0, lng: -1 },
      { lat: 0.7, lng: 0.7 }, { lat: 0.7, lng: -0.7 }, { lat: -0.7, lng: 0.7 }, { lat: -0.7, lng: -0.7 }
    ];
    
    const milesToDegrees = alertRadius / 69; // Use alert radius instead of fixed 5 miles
    const destinations = directions.map(dir => ({
      lat: userLocation.lat + (dir.lat * milesToDegrees),
      lng: userLocation.lng + (dir.lng * milesToDegrees)
    }));
    
    const closureData = await Promise.all(
      destinations.map(async (destination, index) => {
        try {
          const data = await getRouteWithTrafficAnalysis(userLocation, destination);
          
          // Check for signs of road closures
          if (data.hasClosure || data.severeCongestion) {
            const locationName = await reverseGeocode(destination.lat, destination.lng) || 
                                `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`;
            
            return {
              id: `closure_${Date.now()}_${index}`,
              type: data.hasClosure ? 'road-closure' : 'construction',
              severity: data.severity,
              title: data.hasClosure ? `🚧 Road Closure Detected` : `🚧 Construction Zone`,
              description: `Road closure detected on route to ${locationName}`,
              location: {
                name: locationName,
                coordinates: destination
              },
              estimatedDuration: `${Math.round(data.durationInTraffic / 60)} min`,
              timeAway: `${Math.round(data.duration / 60)} min`,
              createdAt: new Date(),
              affectedArea: alertRadius,
              trafficImpact: data.trafficImpact
            };
          }
          return null;
        } catch (error) {
          console.error('Error detecting road closure for route:', error);
          return null;
        }
      })
    );
    
    return closureData.filter(Boolean) as RoadClosureData[];
  } catch (error) {
    console.error('Error detecting road closures:', error);
    throw error;
  }
};

// Enhanced route analysis to detect closures
const getRouteWithTrafficAnalysis = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{
  duration: number;
  durationInTraffic: number;
  hasClosure: boolean;
  severeCongestion: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trafficImpact: 'minimal' | 'moderate' | 'significant' | 'severe';
}> => {
  const originStr = `${origin.lat},${origin.lng}`;
  const destinationStr = `${destination.lat},${destination.lng}`;
  
  // Use Directions API with traffic model
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&traffic_model=best_guess&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
    throw new Error(`Directions API error: ${data.status}`);
  }
  
  const route = data.routes[0];
  const leg = route.legs[0];
  
  const duration = leg.duration.value;
  const durationInTraffic = leg.duration_in_traffic?.value || duration;
  const speedReduction = ((durationInTraffic - duration) / duration) * 100;
  
  // Analyze route steps for closure indicators
  let hasClosure = false;
  let severeCongestion = false;
  let totalClosureTime = 0;
  
  if (leg.steps) {
    leg.steps.forEach((step: any) => {
      const stepDuration = step.duration.value;
      const stepDurationInTraffic = step.duration_in_traffic?.value || stepDuration;
      const stepSpeedReduction = ((stepDurationInTraffic - stepDuration) / stepDuration) * 100;
      
      // Check for severe delays that might indicate closures
      if (stepSpeedReduction > 80) {
        hasClosure = true;
        totalClosureTime += stepDurationInTraffic;
      } else if (stepSpeedReduction > 50) {
        severeCongestion = true;
      }
    });
  }
  
  // Determine severity and impact
  let severity: 'low' | 'medium' | 'high' | 'critical';
  let trafficImpact: 'minimal' | 'moderate' | 'significant' | 'severe';
  
  if (hasClosure) {
    severity = 'critical';
    trafficImpact = 'severe';
  } else if (severeCongestion) {
    severity = 'high';
    trafficImpact = 'significant';
  } else if (speedReduction > 30) {
    severity = 'medium';
    trafficImpact = 'moderate';
  } else {
    severity = 'low';
    trafficImpact = 'minimal';
  }
  
  return {
    duration,
    durationInTraffic,
    hasClosure,
    severeCongestion,
    severity,
    trafficImpact
  };
};

// Monitor for road closures and send notifications
export const monitorRoadClosures = async (
  userLocation: { lat: number; lng: number },
  callback: (closures: RoadClosureData[]) => void,
  alertRadius: number = 5
) => {
  try {
    const closures = await detectRoadClosures(userLocation, alertRadius);
    const significantClosures = closures.filter(closure => 
      closure.severity === 'high' || closure.severity === 'critical'
    );
    callback(significantClosures);
  } catch (error) {
    console.error('Error monitoring road closures:', error);
  }
}; 