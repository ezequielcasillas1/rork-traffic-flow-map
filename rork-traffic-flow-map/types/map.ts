export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type MapType = "standard" | "satellite" | "hybrid";

export type LocationResult = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type TrafficCondition = "light" | "medium" | "heavy" | "closed";