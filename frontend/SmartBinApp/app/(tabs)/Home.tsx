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
import { PieChart } from 'react-native-gifted-charts';
import { useNotification } from "@/context/NotificationContext";


const PieChartDashboard = ({ data }) => {
    const chartData = data.map((item) => {
      let color = '#64748B';
      let dotClass = 'bg-slate-500';
      let label = item._id;

      if (item._id === 'BIODEGRADABLE') {
        color = '#34D399';      // Emerald
        dotClass = 'bg-emerald-500';
        label = 'Biodegradable';
      } else if (item._id === 'NON-BIODEGRADABLE') {
        color = '#60A5FA';      // Blue
        dotClass = 'bg-blue-500';
        label = 'Non-Biodegradable';
      } else if (item._id === 'HAZARDOUS') {
        color = '#FBBF24';      // Red
        dotClass = 'bg-yellow-500';
        label = 'Hazardous';
      }

      return {
        value: item.value,
        color: color,
        text: `${item.value}`, // Displays count inside the slice
        label: label,
        dotClass: dotClass,
      };
    });

    ///*
    return (
      <View className="p-5 bg-white items-center justify-center rounded-xl border border-gray-200 shadow-sm">
        <Text className="text-sm font-bold text-gray-700 mb-4 text-center">
          Garbage Types Distribution for the last 7 days
        </Text>

        <PieChart
          data={chartData}
          radius={55}          // Sized perfectly to fit a compact dashboard widget
          showText
          textColor="white"
          textSize={11}
          fontWeight="bold"
          labelsPosition="mid"
        />

        <View className="flex-row flex-wrap justify-center mt-4 gap-x-4 gap-y-2">
          {chartData.map((item, index) => (
            <View key={index} className="flex-row items-center">
              <View className={`w-2.5 h-2.5 rounded-full mr-1.5 ${item.dotClass}`} />
              <Text className="text-gray-600 text-xs font-medium">
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

        
    );//*/
};

/* 
const PieChartDashboard = ({ data }) => (
  <View className="h-48 bg-gray-50 items-center justify-center rounded-xl border border-gray-200">
    <Text className="text-gray-400 italic">Pie Chart Placeholder</Text>
  </View>
);*/


const DashboardTab = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [deviceStatusCount, setDeviceStatusCount] = useState([]);
  const [numberDevicesNotOk, setNumberDevicesNotOk] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { expoPushToken, error } = useNotification();

  const reloadData = async () => {
    try {
      const response1 = await axiosInstance.get("/usages/chart-values", {withCredentials: true});
      //console.log(JSON.stringify(response1.data));
      if (response1.data.success) {
        setPieChartData(response1.data.data);
        //setPieChartData(null);
      } else {
        setPieChartData(null);
        Toast.show({ type: 'error', text1: 'No Bin Usage record found!' });
      }

      // 2. Status Count
      const response2 = await axiosInstance.get("/devices/status-count", {withCredentials: true});
      if (response2.data.success) {
        setDeviceStatusCount(response2.data.data);
      }

      // 3. Device Check
      const response3 = await axiosInstance.get("/devices/is-all-bin-ok", {withCredentials: true});
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

  useEffect(() => {
    const checkNotificationToken = async () => {
      if (expoPushToken) {
        try {
          const data = { expoPushNotificationToken: expoPushToken };
          await axiosInstance.put("/users/set-notification-token", data, { withCredentials: true });
        } catch (e) {
          console.log("Notification token update failed", e);
        }
      }
    };
    checkNotificationToken();
  }, [expoPushToken]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-6 bg-white shadow-sm border-b border-gray-100">
        <Text className="text-3xl font-extrabold text-green-700">Dashboard</Text>
        <Text className="text-base text-gray-500">View Device status in real time</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4">
        
        {/* Section 1: Pie Chart & Bin Alert */}
        <View className="bg-white p-5 rounded-2xl shadow-sm mb-4 border border-gray-100">
          <Text className="text-lg font-bold mb-4 text-gray-800">Usage Overview</Text>
          {(!pieChartData || !pieChartData.length) ? (
            <View className="flex-row w-full h-48 bg-gray-50 items-center rounded-xl border border-gray-200 gap-x-5 px-3 py-2">
                <Image 
                    source={assets.cautionPic} 
                    className="flex resize-contain w-[110px] h-[100px] "
                />
              <Text className="flex-1 text-black font-bold w-full h-fit text-center">No Bin Usage record found from the last 7 days!</Text>
            </View>) : <PieChartDashboard data={pieChartData} />
          }
          
          
          <View className="flex-row items-center justify-center mt-6 p-4 rounded-xl bg-gray-50 gap-10">
            <Image 
              source={numberDevicesNotOk > 0 ? assets.fullBinPic : assets.emptyBinPic} 
              className="resize-contain w-[75px] h-[100px] "
            />
            <Text className={`text-lg font-bold flex-1 ${numberDevicesNotOk > 0 ? 'text-orange-500' : 'text-violet-500'}`}>
              {numberDevicesNotOk > 0 
                ? (numberDevicesNotOk === 1 ? "A Bin needs emptying!" : "Several Bins need emptying!") 
                : "All Bins are good!"}
            </Text>
          </View>
        </View>

        <View className="flex bg-white p-5 rounded-2xl shadow-sm mb-20 border border-gray-100">
          <Text className="text-lg font-bold mb-4 text-gray-800">Device Status</Text>
          <View className="flex flex-row gap-x-10 items-center justify-center mt-5">
            <View className="flex flex-col items-center gap-y-3">
              <Image source={assets.onlineBin} style={{ width: 100, height: 100 }} />
              <Text>Online: {deviceStatusCount[0] ? deviceStatusCount[0].value : 0}</Text>
            </View>
            <View className="flex flex-col items-center gap-y-3">
              <Image source={assets.offlineBin} style={{ width: 100, height: 100 }} />
              <Text>Offline: {deviceStatusCount[1] ? deviceStatusCount[1].value: 0}</Text>
            </View>
          </View>
          <View className="flex-col gap-3 mt-6">
            <TouchableOpacity 
              onPress={() => router.push("/(tabs)/Log")}
              className="flex-row items-center justify-center bg-blue-600 p-4 rounded-xl"
            >
              <MaterialIcons name="summarize" size={24} color="white" />
              <Text className="text-white font-bold ml-2 text-base">Check Usage Records</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/(tabs)/Devices")}
              className="flex-row items-center justify-center bg-blue-600 p-4 rounded-xl"
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