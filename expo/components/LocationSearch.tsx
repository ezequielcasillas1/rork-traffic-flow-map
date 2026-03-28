import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Search, X, MapPin, AlertCircle } from "lucide-react-native";
import { searchPlaces, GoogleSearchResult } from "@/lib/google-maps";
import { useMapSettings } from "@/hooks/use-map-settings";
import { lightTheme, darkTheme } from "@/constants/theme";

type LocationSearchProps = {
  onSelectLocation: (location: { lat: number; lng: number; name?: string }) => void;
};

export function LocationSearch({ onSelectLocation }: LocationSearchProps) {
  const { darkMode } = useMapSettings();
  const theme = darkMode ? darkTheme : lightTheme;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleSearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    setSearchError(null);
    
    if (text.length > 2) {
      setIsSearching(true);
      setShowResults(true);
      
      try {
        const results = await searchPlaces(text);
        setSearchResults(results);
        
        if (results.length === 0) {
          setSearchError('No locations found. Try a different search term.');
        } else {
          setSearchError(null);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        setSearchError('Search failed. Please try again.');
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      setSearchError(null);
    }
  };

  const handleSelectLocation = (location: GoogleSearchResult) => {
    onSelectLocation({ 
      lat: location.lat, 
      lng: location.lng, 
      name: location.name 
    });
    setSearchQuery(location.name);
    setShowResults(false);
    setSearchResults([]);
    setSearchError(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setIsSearching(false);
    setSearchError(null);
  };

  // Don't render search on web for now
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search for a location..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {isSearching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Searching...</Text>
          </View>
        )}
      </View>

      {showResults && searchResults.length > 0 && (
        <View style={[styles.resultsContainer, { backgroundColor: theme.surface }]}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.resultItem, { borderBottomColor: theme.border }]}
                onPress={() => handleSelectLocation(item)}
              >
                <MapPin size={16} color={theme.textSecondary} style={styles.resultIcon} />
                <View style={styles.resultTextContainer}>
                  <Text style={[styles.resultName, { color: theme.text }]}>{item.name}</Text>
                  {item.address && item.address !== item.name && (
                    <Text style={[styles.resultAddress, { color: theme.textSecondary }]}>{item.address}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            style={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {showResults && searchError && (
        <View style={[styles.errorContainer, { backgroundColor: theme.error + '20' }]}>
          <AlertCircle size={16} color={theme.error} style={styles.errorIcon} />
          <Text style={[styles.errorText, { color: theme.error }]}>{searchError}</Text>
        </View>
      )}

      {showResults && searchResults.length === 0 && !isSearching && !searchError && searchQuery.length > 2 && (
        <View style={[styles.noResultsContainer, { backgroundColor: theme.surface }]}>
          <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>No locations found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: "5%",
    right: "5%",
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: "column",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    alignSelf: "center",
    width: "100%",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
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
    marginLeft: 8,
    fontSize: 14,
  },
  resultsContainer: {
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
  resultsList: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultIcon: {
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultAddress: {
    fontSize: 14,
    marginTop: 2,
  },
  noResultsContainer: {
    padding: 16,
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
  noResultsText: {
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 1,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },

});