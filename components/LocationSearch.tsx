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

type LocationSearchProps = {
  onSelectLocation: (location: { lat: number; lng: number; name?: string }) => void;
};

// Mock search results for demo purposes
// In a real app, this would come from Google Places API
const mockSearchResults = [
  { id: "1", name: "New York City", lat: 40.7128, lng: -74.006 },
  { id: "2", name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { id: "3", name: "Chicago", lat: 41.8781, lng: -87.6298 },
  { id: "4", name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { id: "5", name: "Miami", lat: 25.7617, lng: -80.1918 },
];

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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.length > 2) {
      setIsSearching(true);
      // Simulate API call delay
      setTimeout(() => {
        const filteredResults = mockSearchResults.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        );
        setSearchResults(filteredResults);
        setIsSearching(false);
        setShowResults(true);
      }, 500);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleSelectLocation = (location: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  }) => {
    onSelectLocation({ lat: location.lat, lng: location.lng, name: location.name });
    setSearchQuery(location.name);
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
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
          onFocus={() => searchQuery.length > 2 && setShowResults(true)}
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
        </View>
      )}

      {showResults && searchResults.length > 0 && (
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
          />
        </View>
      )}

      {showResults && searchResults.length === 0 && searchQuery.length > 2 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.noResultsText}>No locations found</Text>
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
    padding: 20,
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
    paddingVertical: 12,
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
  },
});