import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  FlatList,
  Platform,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { useEffect } from "react";

type LocationSearchProps = {
  onSelectLocation: (location: { lat: number; lng: number; name?: string }) => void;
};

// Remove mockSearchResults and replace search logic
// Add import for useEffect
const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const fetchPlaces = async (query: string) => {
  if (!GOOGLE_PLACES_API_KEY) return [];
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === "OK") {
    return data.predictions.map((item: any) => ({
      id: item.place_id,
      name: item.description,
      lat: null,
      lng: null,
    }));
  }
  return [];
};

export function LocationSearch({ onSelectLocation }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
  }>>([]);
  const [showResults, setShowResults] = useState(false);

  // Replace mockSearchResults and handleSearch
  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    
    if (text.length > 2) {
      setIsSearching(true);
      setShowResults(true);
      
      // Simulate API call delay
      const results = await fetchPlaces(text);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  };

  // In handleSelectLocation, fetch place details for lat/lng
  const handleSelectLocation = async (location: { id: string; name: string; lat: number | null; lng: number | null; }) => {
    if (!GOOGLE_PLACES_API_KEY) return;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${location.id}&key=${GOOGLE_PLACES_API_KEY}`;
    const response = await fetch(detailsUrl);
    const data = await response.json();
    if (data.status === "OK") {
      const { lat, lng } = data.result.geometry.location;
      onSelectLocation({ lat, lng, name: location.name });
      setSearchQuery(location.name);
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setIsSearching(false);
  };

  // Don't render search on web
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search location..."
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => {
            if (searchQuery.length > 2) {
              setShowResults(true);
            }
          }}
          testID="location-search-input"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {isSearching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2f95dc" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {showResults && !isSearching && searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectLocation(item)}
                testID={`search-result-${item.id}`}
              >
                <Text style={styles.resultText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {showResults && !isSearching && searchResults.length === 0 && searchQuery.length > 2 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.noResultsText}>No locations found for "{searchQuery}"</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    backgroundColor: "white",
    padding: 15,
    alignItems: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  resultsContainer: {
    backgroundColor: "white",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 1,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resultItem: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  noResultsText: {
    padding: 16,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});