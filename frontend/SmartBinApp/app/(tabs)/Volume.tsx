import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Ensure this is installed
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import loadingOverlay from "../components/LoadingOverlay";
import {router} from "expo-router";

const GROUP_CATEGORIES = ['Barangay', 'Municipality', 'Province', 'Region'];

const VolumeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  // Search States
  const [locationName, setLocationName] = useState("");
  const [selectedType, setSelectedType] = useState("Barangay");
  
  // Date States (Stored as Date objects for the picker)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  // Control visibility of the pickers
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Formatting helper for the display fields (YYYY-MM-DD)
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const onStartChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    if (selectedDate) {
      setStartDate(selectedDate);
      // Logic from your webapp: If start date is ahead of end date, sync them
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const onEndChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const searchParams={
                "startDate": formatDate(startDate),
                "endDate": formatDate(endDate)
      }
      if(selectedType == "Barangay"){
        searchParams["barangay"] = locationName;
      }else if(selectedType == "Municipality"){
        searchParams["municipality"] = locationName;
      }else if(selectedType == "Province"){
        searchParams["province"] = locationName;
      }else if(selectedType == "Region"){
        searchParams["region"] = locationName;
      }

      const response = await axiosInstance.post("volume-records/search-record/group-by/location", searchParams, {withCredentials: true});
      
      if (!response.data.success) {
        Toast.show({ type: 'error', text1: response.data.message });
        setData([]);
      } else {
        setData(response.data.data);
      }
    } catch (err) {
      console.error("Data retrieval error:", err.message);
      Toast.show({ type: 'error', text1: "Failed to fetch records" });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setLocationName("");
    setSelectedType("Barangay");
    setStartDate(new Date());
    setEndDate(new Date());
    setData([]);
  };

  const handleDownload = () => {
    Toast.show({ type: 'info', text1: "PDF Generation starting..." });
  };

  const eventButtonHandler = async()=>{
          router.push({
              pathname: "/(tabs)/Events",
          }); 
          setData([]);
      }
  const usageButtonHandler = async()=>{
          router.push({
              pathname: "/(tabs)/Log",
          }); 
          setData([]);
      }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {isLoading && loadingOverlay()}
      
      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        
        <View className="p-4 bg-white shadow-sm border-b border-gray-100 pt-10">
          <Text className="text-3xl font-extrabold text-teal-800">Usages</Text>
        </View>

        <View className="px-5 py-6 mx-4 my-5 bg-white shadow-md rounded-xl">
          <View className="flex-row border-b border-b-gray-800 mb-5">
            <Text className="flex-1 text-xl font-bold text-gray-800 align-middle">
              Search Volume Records
            </Text>   
            <View className="flex-row items-center justify-self-end">
              <TouchableOpacity
                  onPress={usageButtonHandler}
                  className="flex flex-row w-fit gap-2 py-2 px-3 rounded-lg my-2"
              >
                <Text className="text-blue-600 text-center font-semibold text-sm">
                  usage
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={eventButtonHandler}
                  className="flex flex-row w-fit gap-2 py-2 px-3 rounded-lg my-2"
              >
                <Text className="text-blue-600 text-center font-semibold text-sm">
                  event
                </Text>
              </TouchableOpacity>
            </View>           
          </View>

          <Text className="text-gray-600 mb-1 font-semibold">Location Name:</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-50"
            placeholder="Search location..."
            value={locationName}
            onChangeText={setLocationName}
          />

          {/* Picker / Dropdown */}
          <Text className="text-gray-600 mb-1 font-semibold">Group by:</Text>
          <View className="border border-gray-300 rounded-lg mb-4 bg-gray-50">
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
              style={{ height: Platform.OS === 'ios' ? 150 : 60, color: "black" }}
            >
              {GROUP_CATEGORIES.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>

          <View className="flex-row justify-between mb-6">
            <View className="w-[48%]">
              <Text className="text-gray-600 mb-1 font-semibold">From:</Text>
              <TouchableOpacity 
                onPress={() => setShowStartPicker(true)}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              >
                <Text>{formatDate(startDate)}</Text>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onStartChange}
                />
              )}
            </View>

            <View className="w-[48%]">
              <Text className="text-gray-600 mb-1 font-semibold">To:</Text>
              <TouchableOpacity 
                onPress={() => setShowEndPicker(true)}
                className="border border-gray-300 rounded-lg p-3 bg-gray-50"
              >
                <Text>{formatDate(endDate)}</Text>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  minimumDate={startDate}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onEndChange}
                />
              )}
            </View>
          </View>

          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={clearAll}
              className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Clear</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSubmit}
              className="flex-1 bg-blue-600 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {data.length > 0 && (
          <View className="mx-4 mb-10 p-4 bg-white rounded-xl shadow-md">
            {
            /* <Text className="font-bold text-lg mb-3 text-gray-700">Results ({data.length})</Text>*/}
            
            <View className="flex-row border-b border-gray-300 pb-2 mb-2">
              <Text className="flex-1 font-bold text-[10px]">{selectedType}</Text>
              <Text className="flex-1 font-bold text-[10px] text-center">Biodegradable</Text>
              <Text className="flex-1 font-bold text-[10px] text-center">Non-Biodegradable</Text>
              <Text className="flex-1 font-bold text-[10px] text-center">Hazardous</Text>
            </View>

            {
            data.map((item) => (
              <View key={item[(Object.keys(data[0])[0]).toLowerCase()]} className="flex-row py-3 border-b border-gray-100">
                <Text className="flex-1 text-[10px]">{item[(Object.keys(data[0])[0]).toLowerCase()]}</Text>
                <Text className="flex-1 text-[10px] text-center">{item.sum.BIODEGRADABLE != null ? (item.sum.BIODEGRADABLE).toFixed(6): 0}</Text>
                <Text className="flex-1 text-[8px] text-center">{item.sum["NON-BIODEGRADABLE"] != null ? (item.sum["NON-BIODEGRADABLE"]).toFixed(6) : 0}</Text>
                <Text className="flex-1 text-[8px] text-center">{item.sum.HAZARDOUS != null ? (item.sum.HAZARDOUS).toFixed(6) :0}</Text>
              </View>
            ))}

            {/*<TouchableOpacity 
              onPress={handleDownload}
              className="flex w-fit mt-5 bg-blue-600 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Report</Text>
            </TouchableOpacity>*/}
          </View>
        )}

      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default VolumeScreen;