// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// const NearbyMosque = () => {
//   return (
//     <View>
//       <Text>NearbyMosque</Text>
//     </View>
//   );
// };

// export default NearbyMosque;

// const styles = StyleSheet.create({});

//  --

import axios from "axios";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

const { width, height } = Dimensions.get("window");

const HalalFinderScreen = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  console.log("places --> ", JSON.stringify(places, null, 1));

  // 1. Get User Permission and Location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      // Once we have location, fetch places
      fetchNearbyPlaces(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
      );
    })();
  }, []);

  // 2. The Easy Function to Fetch Data from Overpass API
  const fetchNearbyPlaces = async (lat, lon) => {
    setLoading(true);

    // Overpass QL Query:
    // [out:json] -> We want JSON response
    // node -> We are looking for nodes (points)
    // ["amenity"="place_of_worship"] -> It's a mosque/church/etc
    // ["religion"="muslim"] -> Specifically Muslim
    // (around:5000, lat, lon) -> Search within 5000 meters (5km)
    const radius = 5000; // 5km radius

    const query = `
      [out:json]
      // [timeout:60]
      ;
      (
        node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
      );
      out body center;
    `;

    try {
      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        `data=${encodeURIComponent(query)}`,
      );
      console.log("response -->", JSON.stringify(response.data, null, 2));

      // Filter valid data
      const validPlaces = response.data.elements.filter(
        (el) => el.center && el.center.lat && el.center.lon,
      );
      console.log("validPlaces -> ", JSON.stringify(validPlaces));

      setPlaces(validPlaces);
    } catch (error) {
      console.error("Error fetching data: ", error, error?.response?.data);
      setErrorMsg("Could not load nearby places");
    } finally {
      setLoading(false);
    }
  };

  // 3. Open Directions in Maps App
  const openDirections = (lat, lon) => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const url = `${scheme}${lat},${lon}`;
    Linking.openURL(url);
  };

  // Waiting for Location
  if (!location) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT} // Works for both iOS and Android
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {/*
           OpenStreetMap Tiles
           This replaces Google Maps tiles with OSM tiles.
           Note: iOS MapView defaults to Apple Maps, Android defaults to Google Maps
           unless you override with UrlTile.
        */}
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {/* Markers for Masjids */}
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.center.lat,
              longitude: place.center.lon,
            }}
            title={place.tags?.name || "Masjid"}
            description={place.tags?.denomination || "Muslim Place of Worship"}
            onPress={() => openDirections(place.center.lat, place.center.lon)}
          />
        ))}
      </MapView>

      {/* Floating Info Panel */}
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Nearby Masjids</Text>
        {loading ? (
          <ActivityIndicator color="#2E8B57" />
        ) : (
          <Text style={styles.panelText}>
            Found: {places.length} places within 5km
          </Text>
        )}
        <TouchableOpacity
          onPress={() =>
            fetchNearbyPlaces(location.latitude, location.longitude)
          }
          style={styles.refreshBtn}
        >
          <Text style={styles.refreshText}>Refresh Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: width,
    height: height,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  panel: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  panelText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  refreshBtn: {
    backgroundColor: "#2E8B57",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  refreshText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HalalFinderScreen;
