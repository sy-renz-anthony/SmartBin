import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground
} from "react-native";
import assets from '../assets/images/assets.js';
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, Redirect } from "expo-router";
import loadingOverlay from "./components/LoadingOverlay";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const [employeeID, setEmployeeID] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { token, isLoading: authLoading, login } = useAuth();

  if (authLoading) return null;

  if (token) {
    return <Redirect href="/(tabs)/Home" />;
  }

  const handleLogin = async() => {
      setIsLoading(true);
        if(!employeeID||employeeID.length<1){
            Toast.show({
                type: 'error',
                text1: '❌ Invalid Employee ID!',
                text2: 'Please Input your Employee ID'
            });
            setIsLoading(false);
            return;
        }
        if(!password||password.length<1){
            Toast.show({
                type: 'error',
                text1: '❌ Invalid Password!',
                text2: 'Please Input your Password'
            });
            setIsLoading(false);
            return;
        }
        try{
        const data={
            "employeeID": employeeID,
            "password": password
        }
        const response = await axiosInstance.post("/user/login", data, {withCredentials: true});
            if(!response.data.success){
                Toast.show({
                type: 'error',
                text1: '❌ Error while trying to login!',
                text2: response.data.message
                });
            }else{
                Toast.show({
                type: 'success',
                text1: '✅ Login successfully!',
                text2: ""
                });
                await login(response.data.token);
                router.push("/(tabs)/Home");
                router.replace('/(tabs)/Home');
            }
        }catch(error){
            console.log("Error while logging in! - "+error.message);
            Toast.show({
                type: 'error',
                text1: '❌ Error while logging in!',
                text2: error.message
            });
        }
        setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 w-full min-w-full bg-white">
      <ImageBackground
        source={assets.loginPic}
        resizeMode="cover"
        className="flex-1"
      >
      {isLoading && loadingOverlay()}
      <KeyboardAvoidingView
        className="flex-1 justify-center px-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <View className="flex px-5 pt-5 pb-10 bg-white border-gray-300 border-r border-b rounded-3xl">
        <View className="mb-10">
          <View className="flex flex-row items-center justify-center gap-5">
            <Text className="text-2xl font-bold text-center text-teal-800 mb-2">
                Siaton SmartBin Login
            </Text>
            <Image source={assets.logo} style={{ width: 70, height: 70 }} />
          </View>
            
          <Text className="text-teal-800 mt-2">
            Welcome Back!
          </Text>
          <Text className="text-gray-500 text-sm mt-2">
            Sign in to access your dashboard and continue managing the SmartBins deployed accross our town and keep our community clean and healthy.
          </Text>
        </View>

        <View className="relative w-full h-auto flex flex-row mb-4">
            <View className="border border-gray-300 border-l-1 mr-[-3] rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                <FontAwesome6 name="id-card-clip" size={30} color="purple" />
            </View>
          
          <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
            <TextInput
                value={employeeID}
                onChangeText={setEmployeeID}
                placeholder="Enter your Employee ID#"
                keyboardType="default"
                autoCapitalize="none"
                className="w-full mx-auto text-gray-800"
            />
          </View>
          
        </View>

        <View className="relative w-full h-auto flex flex-row mb-4">
            <View className="border border-gray-300 border-l-1 mr-[-3] rounded-tl-lg rounded-bl-lg justify-center items-center px-2">
                <FontAwesome6 name="lock" size={30} color="purple" />
            </View>
          <View className="flex-1 border border-gray-300 border-l-0 rounded-lg px-4 py-1">
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                className="w-full mx-auto text-gray-800"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-600 py-4 rounded-lg mb-6 mt-10"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Login
          </Text>
        </TouchableOpacity>
        <Link href="/OTPRequestScreen" asChild>
          <TouchableOpacity className="self-end mb-6">
            <Text className="text-blue-500">
              Reset my Password
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}