import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Switch, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../../axiosConfig.js";
import loadingOverlay from "../components/LoadingOverlay";
import Toast from "react-native-toast-message";

const MapTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [showRoute, setShowRoute] = useState(true);

  const position = [9.061952, 123.034009];

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/devices/all", {withCredentials: true});
      if (response.data.success) {
        setDevices(response.data.data);
      } else {
        Toast.show({ type: "error", text1: response.data.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: "Network Error" });
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // The HTML Map Template
  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
      <script>
        const map = L.map('map').setView([${position[0]}, ${position[1]}], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const devices = ${JSON.stringify(devices)};
        const showRoute = ${showRoute};

        const waypoints = [];

        devices.forEach(device => {
          const coord = [device.coordinate[0], device.coordinate[1]];
          L.marker(coord).addTo(map)
            .bindPopup(device.deviceID + " - " + device.location);
          waypoints.push(L.latLng(coord[0], coord[1]));
        });

        if (showRoute && waypoints.length > 1) {
          L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            show: false, // Hide the text instructions panel
            createMarker: function() { return null; } // Don't double-draw markers
          }).addTo(map);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {isLoading && loadingOverlay()}

      <View className="p-4 bg-white shadow-sm border-b border-gray-100 pt-10">
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-3xl font-extrabold text-teal-900">Map</Text>
          
        </View>
      </View>

      <View className="flex-1 px-7 py-10 mx-5 my-5 bg-white shadow-sm border-b border-gray-100 rounded-lg">
        <View className="flex-row border-b border-b-gray-800 mb-5">
          <Text className="flex-1 text-xl font-bold text-gray-800 align-middle">
            Route to Collect Garbage
          </Text>   
          <View className="flex-row items-center justify-self-end">
            <Text className="mr-2 text-gray-600 text-sm">Show Route</Text>
            <Switch 
              value={showRoute} 
              onValueChange={setShowRoute} 
              trackColor={{ false: "#767577", true: "#15803d" }}
            />
          </View>           
        </View>
        <View className="flex-1 overflow-hidden border border shadow-xl bg-white">
          <WebView 
            originWhitelist={['*']}
            source={{ html: mapHTML }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            userAgent="Rain2Cane-App/1.0 (Contact: sy.renz.anthony@gmail.com)"
            startInLoadingState={true}
          />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default MapTab;