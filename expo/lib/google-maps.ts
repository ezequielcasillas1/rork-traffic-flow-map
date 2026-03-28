import Constants from 'expo-constants';

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyCYObeujRbMi5mXvhEtGbR8KaYp61PYHPo';

export interface GoogleMapStyle {
  id: string;
  name: string;
  style: any[];
  description: string;
}

export interface GoogleSearchResult {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

// Google Maps Styles
export const getGoogleMapStyles = (): GoogleMapStyle[] => {
  return [
    {
      id: 'standard',
      name: 'Standard',
      style: [],
      description: 'Default Google Maps style with roads and labels'
    },
    {
      id: 'satellite',
      name: 'Satellite',
      style: [],
      description: 'Satellite imagery without labels'
    },
    {
      id: 'hybrid',
      name: 'Hybrid',
      style: [],
      description: 'Satellite imagery with road labels'
    }
  ];
};

// Google Places API Search
export const searchPlaces = async (query: string): Promise<GoogleSearchResult[]> => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key not configured');
  }
  
  try {
    // First try Places Autocomplete API (more reliable for search suggestions)
    const autocompleteUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&types=geocode|establishment`;
    
    const autocompleteResponse = await fetch(autocompleteUrl);
    
    if (!autocompleteResponse.ok) {
      throw new Error(`Google Places Autocomplete API error: ${autocompleteResponse.status} ${autocompleteResponse.statusText}`);
    }
    
    const autocompleteData = await autocompleteResponse.json();
    
    if (autocompleteData.status !== 'OK' && autocompleteData.status !== 'ZERO_RESULTS') {
      // Fallback to Text Search API
      const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&types=geocode|establishment`;
      
      const textSearchResponse = await fetch(textSearchUrl);
      
      if (!textSearchResponse.ok) {
        throw new Error(`Google Places Text Search API error: ${textSearchResponse.status} ${textSearchResponse.statusText}`);
      }
      
      const textSearchData = await textSearchResponse.json();
      
      if (textSearchData.status !== 'OK' && textSearchData.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places Text Search API error: ${textSearchData.status} - ${textSearchData.error_message || 'Unknown error'}`);
      }
      
      if (textSearchData.results && textSearchData.results.length > 0) {
        const results = textSearchData.results.slice(0, 8).map((place: any) => ({
          id: place.place_id,
          name: place.name,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          address: place.formatted_address || place.vicinity || place.name,
        }));
        
        return results;
      }
    } else if (autocompleteData.predictions && autocompleteData.predictions.length > 0) {
      // Get place details for each prediction
      const results = await Promise.all(
        autocompleteData.predictions.slice(0, 8).map(async (prediction: any) => {
          try {
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${GOOGLE_MAPS_API_KEY}&fields=geometry,formatted_address,name`;
            const detailsResponse = await fetch(detailsUrl);
            
            if (detailsResponse.ok) {
              const detailsData = await detailsResponse.json();
              
              if (detailsData.status === 'OK' && detailsData.result && detailsData.result.geometry) {
                return {
                  id: prediction.place_id,
                  name: prediction.description,
                  lat: detailsData.result.geometry.location.lat,
                  lng: detailsData.result.geometry.location.lng,
                  address: detailsData.result.formatted_address || prediction.description,
                };
              }
            }
          } catch (error) {
            console.warn('Error fetching place details:', error);
          }
          
          return null;
        })
      );
      
      const validResults = results.filter(result => result !== null);
      return validResults;
    }
    
    return [];
    
    } catch (error) {
    console.error('Google Places search error:', error);
    
    // Fallback to Geocoding API if Places API fails
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      
      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.status === 'OK' && geocodeData.results && geocodeData.results.length > 0) {
          const result = geocodeData.results[0];
          return [{
            id: `geocode_${Date.now()}`,
            name: result.formatted_address,
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
            address: result.formatted_address,
          }];
        }
      }
    } catch (fallbackError) {
      console.error('Geocoding fallback also failed:', fallbackError);
    }
    
    throw error;
  }
};

// Google Directions API
export const getDirections = async (origin: string, destination: string): Promise<any> => {
  if (!GOOGLE_MAPS_API_KEY) return null;
  
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Google Directions error:', error);
    return null;
  }
};

// Google Geocoding API
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!GOOGLE_MAPS_API_KEY) return null;
  
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  } catch (error) {
    console.error('Google Geocoding error:', error);
    return null;
  }
};

// Google Reverse Geocoding API
export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  if (!GOOGLE_MAPS_API_KEY) return null;
  
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error('Google Reverse Geocoding error:', error);
    return null;
  }
};

 