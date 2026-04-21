import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import assets from "@/assets/images/assets";

// Placeholder components - Replace these with your actual RN Chart library (e.g., react-native-chart-kit)
const PieChartDashboard = ({ data }) => (
  <View className="h-48 bg-gray-50 items-center justify-center rounded-xl border border-gray-200">
    <Text className="text-gray-400 italic">Pie Chart Placeholder</Text>
  </View>
);

const BarChartDashboard = ({ data }) => (
  <View className="h-48 bg-gray-50 items-center justify-center rounded-xl border border-gray-200">
    <Text className="text-gray-400 italic">Bar Chart Placeholder</Text>
  </View>
);

const DashboardTab = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [deviceStatusCount, setDeviceStatusCount] = useState([]);
  const [numberDevicesNotOk, setNumberDevicesNotOk] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const reloadData = async () => {
    try {
      // 1. Chart Values
      const response1 = await axiosInstance.get("/usages/chart-values");
      if (response1.data.success) {
        setPieChartData(response1.data.data);
      } else {
        Toast.show({ type: 'error', text1: 'No Bin Usage record found!' });
      }

      // 2. Status Count
      const response2 = await axiosInstance.get("/devices/status-count");
      if (response2.data.success) {
        setDeviceStatusCount(response2.data.data);
      }

      // 3. Device Check
      const response3 = await axiosInstance.get("/devices/is-all-bin-ok");
      if (response3.data.success) {
        setNumberDevicesNotOk(response3.data.devicesNotOkCount);
      }
    } catch (err) {
      console.error("Dashboard error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    reloadData();
    const interval = setInterval(reloadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="p-6 bg-white shadow-sm border-b border-gray-100">
        <Text className="text-3xl font-extrabold text-green-700">Dashboard</Text>
        <Text className="text-base text-gray-500">View Device status in real time</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4">
        
        {/* Section 1: Pie Chart & Bin Alert */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-4 border border-gray-100">
          <Text className="text-lg font-bold mb-4 text-gray-800">Usage Overview</Text>
          <PieChartDashboard data={pieChartData} />
          
          <View className="flex-row items-center justify-center mt-6 p-4 rounded-xl bg-gray-50">
            <Image 
              source={numberDevicesNotOk > 0 ? assets.fullBinPic : assets.emptyBinPic} 
              className="w-16 h-16 mr-4"
              resizeMode="contain"
            />
            <Text className={`text-lg font-bold flex-1 ${numberDevicesNotOk > 0 ? 'text-orange-500' : 'text-violet-500'}`}>
              {numberDevicesNotOk > 0 
                ? (numberDevicesNotOk === 1 ? "A Bin needs emptying!" : "Several Bins need emptying!") 
                : "All Bins are good!"}
            </Text>
          </View>
        </View>

        {/* Section 2: Bar Chart & Navigation */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-8 border border-gray-100">
          <Text className="text-lg font-bold mb-4 text-gray-800">Device Status</Text>
          <BarChartDashboard data={deviceStatusCount} />

          <View className="flex-col gap-3 mt-6">
            <TouchableOpacity 
              onPress={() => router.push("/(tabs)/Log")}
              className="flex-row items-center justify-center bg-green-600 p-4 rounded-xl"
            >
              <MaterialIcons name="summarize" size={24} color="white" />
              <Text className="text-white font-bold ml-2 text-base">Check Usage Records</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/(tabs)/Devices")}
              className="flex-row items-center justify-center bg-gray-800 p-4 rounded-xl"
            >
              <FontAwesome5 name="trash" size={20} color="white" />
              <Text className="text-white font-bold ml-2 text-base">Check Devices</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default DashboardTab;