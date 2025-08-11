export interface MockTrafficIncident {
  id: string;
  type: 'traffic' | 'accident' | 'road-closure' | 'construction';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
    address: string;
  };
  estimatedDuration: string;
  timeAway: string;
  createdAt: Date;
  expiresAt: Date;
  affectedArea: number; // radius in miles
  trafficImpact: 'minimal' | 'moderate' | 'significant' | 'severe';
}

// Common road names for realistic mock data
const ROAD_NAMES = [
  'Main Street', 'Broadway', 'Park Avenue', '5th Avenue', 'Central Boulevard',
  'Highway 101', 'Interstate 95', 'Route 66', 'Pacific Coast Highway',
  'Sunset Boulevard', 'Hollywood Boulevard', 'Ventura Boulevard',
  'Wilshire Boulevard', 'Santa Monica Boulevard', 'La Cienega Boulevard',
  'Sepulveda Boulevard', 'Western Avenue', 'Crenshaw Boulevard',
  'Atlantic Boulevard', 'Olympic Boulevard', 'Pico Boulevard',
  'Venice Boulevard', 'Washington Boulevard', 'Adams Boulevard',
  'Jefferson Boulevard', 'Slauson Avenue', 'Florence Avenue'
];

// Common intersection names
const INTERSECTIONS = [
  'Main St & Broadway', '5th Ave & Park Ave', 'Sunset Blvd & Vine St',
  'Hollywood Blvd & Highland Ave', 'Wilshire Blvd & Western Ave',
  'Santa Monica Blvd & La Cienega Blvd', 'Ventura Blvd & Sepulveda Blvd',
  'Pico Blvd & Robertson Blvd', 'Olympic Blvd & Fairfax Ave',
  'Washington Blvd & Crenshaw Blvd', 'Adams Blvd & Western Ave',
  'Jefferson Blvd & La Brea Ave', 'Florence Ave & Normandie Ave'
];

// Mock incident descriptions
const INCIDENT_DESCRIPTIONS = {
  traffic: [
    'Heavy congestion due to rush hour traffic',
    'Slow moving traffic due to volume',
    'Traffic backed up from previous incident',
    'Congestion due to special event',
    'Heavy traffic flow in both directions',
    'Traffic moving slowly due to weather conditions',
    'Congestion from construction work ahead',
    'Heavy traffic due to school dismissal',
    'Traffic backed up from major intersection',
    'Slow moving traffic due to lane closure'
  ],
  accident: [
    'Multi-vehicle collision blocking lanes',
    'Vehicle overturned on roadway',
    'Accident involving multiple cars',
    'Vehicle collision with barrier',
    'Accident blocking right lane',
    'Multi-car pileup on highway',
    'Vehicle collision at intersection',
    'Accident involving truck and car',
    'Vehicle collision blocking traffic',
    'Accident with vehicle in ditch'
  ],
  'road-closure': [
    'Road closed due to flooding',
    'Street closed for special event',
    'Roadway closed for emergency repairs',
    'Street blocked due to fallen tree',
    'Road closed for utility work',
    'Street closed for parade',
    'Roadway blocked due to accident',
    'Street closed for construction',
    'Road blocked due to power lines down',
    'Street closed for filming'
  ],
  construction: [
    'Construction work reducing lanes',
    'Road work causing delays',
    'Construction blocking left lane',
    'Road work in progress',
    'Construction reducing traffic flow',
    'Road work causing congestion',
    'Construction blocking right lane',
    'Road work ahead',
    'Construction work in area',
    'Road work causing delays'
  ]
};

// Generate random coordinates within a reasonable area (Los Angeles area as example)
const generateRandomCoordinates = (): { lat: number; lng: number } => {
  // Los Angeles area bounds
  const minLat = 33.7;
  const maxLat = 34.3;
  const minLng = -118.7;
  const maxLng = -118.1;
  
  return {
    lat: minLat + Math.random() * (maxLat - minLat),
    lng: minLng + Math.random() * (maxLng - minLng)
  };
};

// Generate realistic time estimates
const generateTimeEstimate = (type: string, severity: string): string => {
  const baseTimes = {
    traffic: { low: 15, medium: 30, high: 45, critical: 60 },
    accident: { low: 30, medium: 60, high: 90, critical: 120 },
    'road-closure': { low: 60, medium: 120, high: 240, critical: 480 },
    construction: { low: 120, medium: 240, high: 480, critical: 720 }
  };
  
  const baseTime = baseTimes[type as keyof typeof baseTimes]?.[severity as keyof typeof baseTimes.traffic] || 30;
  const variation = Math.floor(Math.random() * 30) - 15; // ±15 minutes
  const totalMinutes = Math.max(5, baseTime + variation);
  
  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  } else if (totalMinutes < 120) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    return `${hours} hours`;
  }
};

// Generate time away from current location
const generateTimeAway = (): string => {
  const times = ['5 min', '10 min', '15 min', '20 min', '25 min', '30 min', '45 min', '1 hour'];
  return times[Math.floor(Math.random() * times.length)];
};

// Generate mock traffic incidents
export const generateMockIncidents = (count: number = 10): MockTrafficIncident[] => {
  const incidents: MockTrafficIncident[] = [];
  const types: Array<'traffic' | 'accident' | 'road-closure' | 'construction'> = ['traffic', 'accident', 'road-closure', 'construction'];
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const coordinates = generateRandomCoordinates();
    const locationName = Math.random() > 0.5 
      ? ROAD_NAMES[Math.floor(Math.random() * ROAD_NAMES.length)]
      : INTERSECTIONS[Math.floor(Math.random() * INTERSECTIONS.length)];
    
    const descriptions = INCIDENT_DESCRIPTIONS[type];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    const createdAt = new Date();
    const durationMinutes = type === 'traffic' ? 30 : type === 'accident' ? 60 : 120;
    const expiresAt = new Date(createdAt.getTime() + durationMinutes * 60 * 1000);
    
    const incident: MockTrafficIncident = {
      id: `incident_${Date.now()}_${i}`,
      type,
      severity,
      title: `${type === 'traffic' ? '🚦' : type === 'accident' ? '⚠️' : type === 'road-closure' ? '🚧' : '🏗️'} ${type.charAt(0).toUpperCase() + type.slice(1)} on ${locationName}`,
      description,
      location: {
        name: locationName,
        coordinates,
        address: `${locationName}, Los Angeles, CA`
      },
      estimatedDuration: generateTimeEstimate(type, severity),
      timeAway: generateTimeAway(),
      createdAt,
      expiresAt,
      affectedArea: severity === 'low' ? 0.5 : severity === 'medium' ? 1 : severity === 'high' ? 2 : 3,
      trafficImpact: severity === 'low' ? 'minimal' : severity === 'medium' ? 'moderate' : severity === 'high' ? 'significant' : 'severe'
    };
    
    incidents.push(incident);
  }
  
  return incidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Get active incidents (not expired)
export const getActiveIncidents = (incidents: MockTrafficIncident[]): MockTrafficIncident[] => {
  const now = new Date();
  return incidents.filter(incident => incident.expiresAt > now);
};

// Get incidents near a specific location
export const getNearbyIncidents = (
  incidents: MockTrafficIncident[],
  userLat: number,
  userLng: number,
  radiusMiles: number = 5
): MockTrafficIncident[] => {
  return incidents.filter(incident => {
    const distance = calculateDistance(
      userLat, userLng,
      incident.location.coordinates.lat,
      incident.location.coordinates.lng
    );
    return distance <= radiusMiles;
  });
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

// Generate a single random incident
export const generateRandomIncident = (): MockTrafficIncident => {
  const incidents = generateMockIncidents(1);
  return incidents[0];
};

// Update incident status (simulate real-time changes)
export const updateIncidentStatus = (incident: MockTrafficIncident): MockTrafficIncident => {
  const now = new Date();
  const timeElapsed = now.getTime() - incident.createdAt.getTime();
  const totalDuration = incident.expiresAt.getTime() - incident.createdAt.getTime();
  
  // Reduce severity over time for some incident types
  if (timeElapsed > totalDuration * 0.7 && incident.type !== 'construction') {
    const severityLevels: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
    const currentIndex = severityLevels.indexOf(incident.severity);
    if (currentIndex > 0) {
      incident.severity = severityLevels[currentIndex - 1];
    }
  }
  
  return incident;
}; 