import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { WebView } from "react-native-webview";
import axiosInstance from "../axiosConfig.js";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function NewDeviceScreen() {
  const [deviceID, setDeviceID] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [displayAdd, setDisplayAdd] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Replicating your React Web Effect for Reverse Geocoding
  useEffect(() => {
    const reloadDisplayAdd = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coordinates.lat}&lon=${coordinates.lng}`;
        const addData = await axios.get(url, {
          headers: { "User-Agent": "SmartBin/1.0 (sy.renz.anthony@gmail.com)" },
        });

        const addr = addData.data.address;
        const strBrgy = addr.village || addr.quarter || addr.suburb || "";
        const strTown = addr.town || addr.city || "";
        const strProvince = addr.state || "";
        const strRegion = addr.region || "";

        setDisplayAdd(`${strBrgy}, ${strTown}, ${strProvince} - Region: ${strRegion}`);
      } catch (err) {
        console.error("Geocoding error:", err.message);
      }
    };

    if (coordinates !== null) {
      reloadDisplayAdd();
    }
  }, [coordinates]);

  const handleSubmit = async () => {
    if (!deviceID || deviceID.length < 1) {
      Toast.show({ type: 'error', text1: '❌ Device ID Required' });
      return;
    }
    if (coordinates === null) {
      Toast.show({ type: 'error', text1: '❌ Select location on map' });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        deviceID: deviceID,
        location: locationDescription,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      };

      const response = await axiosInstance.post("/devices/register", payload, { withCredentials: true });
      
      if (!response.data.success) {
        Toast.show({ type: 'error', text1: '❌ Error', text2: response.data.message });
      } else {
        Toast.show({ type: 'success', text1: '✅ Success', text2: "Device registered!" });
        router.push('/(tabs)/Devices');
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: '❌ Network Error', text2: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([9.061952, 123.034009], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        var marker;
        map.on('click', function(e) {
          if (marker) { map.removeLayer(marker); }
          marker = L.marker(e.latlng).addTo(map);
          
          // Communicating back to React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }));
        });
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View className="p-4 bg-white shadow-sm border-b border-gray-100 pt-10">
            <Text className="text-3xl font-extrabold text-teal-900">Devices</Text>
          </View>

          <View className="px-7 py-10 mx-5 my-5 bg-white shadow-sm border-b border-gray-100 rounded-lg">
            <Text className="text-xl font-bold text-gray-800 border-b border-b-gray-800 mb-5">
              Add New Device
            </Text>

            {/* Device ID Input */}
            <View className="flex-row mb-4">
              <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                <AntDesign name={"barcode"} size={24} color="purple" />
              </View>
              <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                <TextInput
                  value={deviceID}
                  onChangeText={setDeviceID}
                  placeholder="Device ID#"
                  className="text-gray-800 py-2"
                />
              </View>
            </View>

            {/* Location Description Input */}
            <View className="flex-row mb-4">
              <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                <FontAwesome6 name={"map-location-dot"} size={24} color="purple" />
              </View>
              <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                <TextInput
                  value={locationDescription}
                  onChangeText={setLocationDescription}
                  placeholder="Location Description"
                  className="text-gray-800 py-2"
                />
              </View>
            </View>

            {/* Coordinate Display (Matching your Web UI) */}
            <View className="mb-4">
              <Text className="text-gray-500 font-bold text-xs uppercase">Selected Location:</Text>
              <Text className="text-gray-800 mt-1">
                {coordinates === null 
                  ? "Tap the map below to set device location" 
                  : `[${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}]`}
              </Text>
              {displayAdd && (
                <Text className="text-teal-700 italic text-xs mt-2">{displayAdd}</Text>
              )}
            </View>

            {/* The Map (WebView) */}
            <View className="h-80 w-full rounded-xl overflow-hidden border border-gray-300 mt-2 mb-6">
              <WebView
                originWhitelist={['*']}
                source={{ html: leafletHTML }}
                onMessage={(event) => {
                  const data = JSON.parse(event.nativeEvent.data);
                  setCoordinates(data);
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                userAgent="Rain2Cane-App/1.0 (Contact: sy.renz.anthony@gmail.com)"
                renderLoading={() => <ActivityIndicator size="large" color="#0000ff" style={{flex: 1}} />}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`py-4 rounded-lg mt-4 mb-6 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? "Registering..." : "Submit"}
              </Text>
            </TouchableOpacity>

            <Link href="/(tabs)/Devices" asChild>
              <TouchableOpacity className="self-center">
                <Text className="text-blue-600 font-semibold">Back</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}