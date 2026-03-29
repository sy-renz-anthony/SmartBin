import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import loadingOverlay from "./components/LoadingOverlay.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import axiosInstance from "../axiosConfig.js";
import Toast from "react-native-toast-message";
import Checkbox from "expo-checkbox";


const InputWithIcon = ({ icon, placeholder, value, setValue, secure = false, keyboardType = "default" }) => (
  <View className="flex-row mb-4">
    <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
      <MaterialIcons name={icon} size={28} color="green" />
    </View>
    <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize="none"
        className="text-gray-800"
      />
    </View>
  </View>
);

export default function NewDeviceScreen() {
  const [deviceID, setDeviceID] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async() => {
    setIsLoading(true);
    
    if(!deviceID || deviceID.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Device ID!',
        text2: 'Please input the new Device\'s ID!'
      });
      setIsLoading(false);
      return;
    }
    if(!locationDescription || locationDescription.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Device\'s Location Descritpion!',
        text2: 'Please input the Device\'s Location Descritpion'
      });
      setIsLoading(false);
      return;
    }

    /*
    try{
      const data={
        "employeeID": employeeID,
        "emailAddress": email,
        "firstName": firstName,
        "middleName": middleName,
        "lastName": lastName,
        "contactNumber": contact,
        "address": address,
        "sendSmsNotification": sendSmsNotification
      }
      const response = await axiosInstance.post("/users/register", data, {withCredentials: true});
        if(!response.data.success){
            Toast.show({
              type: 'error',
              text1: '❌ Error while registering new User Account!',
              text2: response.data.message
            });
        }else{
            Toast.show({
              type: 'success',
              text1: '✅ User Account registered!',
              text2: ""
            });
            router.push('/');
        }
    }catch(error){
      console.log("Error while registering new User Account! - "+error.message);
      Toast.show({
        type: 'error',
        text1: '❌ Error while registering new User Account!',
        text2: error.message
      });
    }
      */
    setIsLoading(false);
  };

  return (
    
    <SafeAreaView className="flex-1 bg-white">
      {isLoading && loadingOverlay()}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          
        <View className="p-4 bg-white shadow-sm border-b border-gray-100 pt-10">
          <Text className="text-3xl font-extrabold text-teal-900">Devices</Text>
        </View>
          
                <View className="px-7 py-10 mx-5 my-5 bg-white shadow-sm border-b border-gray-100 rounded-lg">
                    <Text className="text-xl font-bold text-gray-800 border-b border-b-gray-800 mb-5">
                        Add New Device
                    </Text>
                    <View className="flex-row mb-4">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <FontAwesome6 name={"id-card-clip"} size={28} color="purple" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={deviceID}
                                onChangeText={setDeviceID}
                                placeholder="Device ID#"
                                keyboardType="default"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>
                    <View className="flex-row mb-4">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <MaterialIcons name={"person"} size={28} color="purple" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={locationDescription}
                                onChangeText={setLocationDescription}
                                placeholder="Location Description"
                                keyboardType="default"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>
                    

                    <TouchableOpacity
                                onPress={handleSubmit}
                                className="bg-blue-600 py-4 rounded-lg mt-4 mb-6"
                              >
                                <Text className="text-white text-center font-semibold text-lg">
                                  Submit
                                </Text>
                    </TouchableOpacity>

                    <View className="flex flex-col relative self-start items-center mt-10">
                        <Link href="/(tabs)/Devices" asChild>
                            <TouchableOpacity>
                                <Text className="text-blue-600 font-semibold">
                                    Back
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    
    
  );
}
