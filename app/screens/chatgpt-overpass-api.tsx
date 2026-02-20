import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function NearbyMosques() {
  const [location, setLocation] = useState(null);
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  console.log("mosques -> ", JSON.stringify(mosques, null, 2));

  // Function to fetch mosques from Overpass API
  const fetchMosques = async (latitude, longitude) => {
    const radius = 10000; // 10km in meters
    const query = `
      [out:json];
      node
        ["amenity"="place_of_worship"]
        ["religion"="muslim"]
        (around:${radius},${latitude},${longitude});
      out;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("response --> ", data);

      setMosques(data.elements || []);
    } catch (error) {
      console.error("Error fetching mosques:", error);

      setErrorMsg("Failed to fetch mosques");
    } finally {
      setLoading(false);
    }
  };

  // Get user location and fetch mosques on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchMosques(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading nearby mosques...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Nearby Mosques (within 5km):</Text>
      <FlatList
        data={mosques}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>
              {item.tags?.name || "Unnamed Mosque"}
            </Text>
            <Text style={styles.coords}>
              Lat: {item.lat.toFixed(4)}, Lon: {item.lon.toFixed(4)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No mosques found nearby.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  name: {
    fontSize: 16,
  },
  coords: {
    fontSize: 12,
    color: "#555",
  },
});
