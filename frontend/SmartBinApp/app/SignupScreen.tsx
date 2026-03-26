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

export default function SignupScreen() {
  const [employeeID, setEmployeeID] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [sendSmsNotification, setSendSmsNotification] = useState(false);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async() => {
    setIsLoading(true);
    
    if(!address || address.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Address!',
        text2: 'Please Input your Address!'
      });
      setIsLoading(false);
      return;
    }
    if(!contact || contact.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Contact Number!',
        text2: 'Please input your Contact Number'
      });
      setIsLoading(false);
      return;
    }
    if(!lastName || lastName.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Last Name!',
        text2: 'Please input your Last Name'
      });
      setIsLoading(false);
      return;
    }
    if(!middleName || middleName.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Middle Name!',
        text2: 'Please input your Middle Name'
      });
      setIsLoading(false);
      return;
    }
    if(!firstName || firstName.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid First Name!',
        text2: 'Please input your First Name'
      });
      setIsLoading(false);
      return;
    }
    if(!email || email.length<1){
      Toast.show({
        type: 'error',
        text1: '❌ Invalid Email!',
        text2: 'Please input your email address'
      });
      setIsLoading(false);
      return;
    }

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
            <Text className="text-3xl font-extrabold text-teal-900">Add New User</Text>
          </View>
          
                <View className="px-7 py-10 mx-5 my-5 bg-white shadow-sm border-b border-gray-100 rounded-lg">
                    <Text className="text-xl font-bold text-gray-800 border-b border-b-gray-800 mb-5">
                        Add New User
                    </Text>
                    <View className="flex-row mb-4">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <FontAwesome6 name={"id-card-clip"} size={28} color="purple" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={employeeID}
                                onChangeText={setEmployeeID}
                                placeholder="Employee ID#"
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
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="First Name"
                                keyboardType="default"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>
                    <View className="flex-row mb-4">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <MaterialIcons name={"person-outline"} size={28} color="purple" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={middleName}
                                onChangeText={setMiddleName}
                                placeholder="Middle Name"
                                keyboardType="default"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>
                    <View className="flex-row mb-4">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <MaterialIcons name={"person-outline"} size={28} color="purple" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Last Name"
                                keyboardType="default"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>
                    <View className="flex-row mb-4">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <MaterialIcons name={"phone"} size={28} color="purple" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={contact}
                                onChangeText={setContact}
                                placeholder="Contact#"
                                secureTextEntry={true}
                                keyboardType="phone-pad"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>
                    <View className="flex-row mb-4">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <MaterialIcons name={"email"} size={28} color="purple" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email Address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="text-gray-800"
                            />
                        </View>
                    </View>
                    
                              
                                
                    <View className="flex-row mb-4">
                        <View className="border border-gray-300 rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                            <MaterialIcons name="home" size={28} color="purple" />
                        </View>
                        <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
                            <TextInput
                                multiline
                                numberOfLines={4}
                                value={address}
                                onChangeText={setAddress}
                                placeholder="Street / Block / House No. , Barangay, Municipality, Province"
                                autoCapitalize="none"
                                className="text-gray-800"
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                            
                    <View className="flex-row gap-2 mb-10">
                        <Text className="flex-1 justify-center">
                            Receive SMS Notification for Full SmartBins:
                        </Text>
                        <View className="flex-1 items-left justify-center ml-5">
                            <Checkbox
                                value={sendSmsNotification}
                                onValueChange={setSendSmsNotification}
                                className="h-10 w-10 rounded border border-gray-400"
                                color={sendSmsNotification ? "#22c55e" : undefined}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                                onPress={handleSignup}
                                className="bg-blue-600 py-4 rounded-lg mt-4 mb-6"
                              >
                                <Text className="text-white text-center font-semibold text-lg">
                                  Submit
                                </Text>
                    </TouchableOpacity>

                    <View className="flex flex-col relative self-start items-center mt-10">
                        <Link href="/(tabs)/Profile" asChild>
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
