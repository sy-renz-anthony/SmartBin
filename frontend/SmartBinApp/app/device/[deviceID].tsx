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
import axiosInstance from "../../axiosConfig.js";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function NewDeviceScreen() {
  const [deviceID, setDeviceID] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  
  const handleSubmit = async () => {
    if (!deviceID || deviceID.length < 1) {
      Toast.show({ type: 'error', text1: '❌ Device ID Required' });
      return;
    }

    setIsLoading(true);

    setIsLoading(false);
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View className="p-4 bg-white shadow-sm border-b border-gray-100 pt-10">
            <Text className="text-3xl font-extrabold text-teal-900">Devices</Text>
          </View>

          <View className="px-7 py-10 mx-5 my-5 bg-white shadow-sm border-b border-gray-100 rounded-lg">
            <Text className="text-xl font-bold text-gray-800 border-b border-b-gray-800 mb-5">
              Update Device Info
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

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`py-4 rounded-lg mt-4 mb-6 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? "Updating..." : "Submit"}
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