import React, { useState, useEffect} from "react";
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList
} from "react-native";
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, Redirect } from "expo-router";
import loadingOverlay from "../components/LoadingOverlay";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";

import DeviceCard from "../components/DeviceCard.jsx";

const ProfileTab =()=>{
    const [isLoading, setIsLoading] = useState(false);
    const [devices, setDevices] = useState([]);

    const isFocused = useIsFocused();

    const reloadData = async()=>{
        try{
            const response = await axiosInstance.get("/devices/all", {withCredentials: true});
            //console.log(JSON.stringify(response.data.data));
            if(!response.data.success){
                Toast.show({
                    type: 'error',
                    text1: '❌ Error while retrieving your Devices!',
                    text2: response.data.message
                });
                setDevices([]);
            }else{
                setDevices(response.data.data);
            }
        }catch(error){
            console.log("Error while retrieving your Devices! - "+error.message);
            Toast.show({
                type: 'error',
                text1: '❌ Error while retrieving your Devices!',
                text2: error.message
            });
            setDevices([]);
        }
    }

    useEffect(() => {
        if (isFocused) {
            setIsLoading(true);
            reloadData();
            setIsLoading(false);
        }
    }, [isFocused]);

    useEffect(()=>{
        const interval = setInterval(() => {
            setIsLoading(true);
            reloadData();
            setIsLoading(false);
        }, 20000);
        
        return () => clearInterval(interval);
    }, []);
    
    const pressEventHandler = async(device)=>{
        router.push({
            pathname: "/device/[deviceID]",
            params: { deviceID: device.deviceID },
        }); 
        setDevices([]);
    }

    const addDeviceEventHandler = async()=>{
        console.log("Add New device!");
        router.push({
            pathname: "/NewDevice",
        }); 
        setDevices([]);
    }

    return(
        <SafeAreaView className="flex-1 bg-gray-100">
            {isLoading && loadingOverlay()}
            <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    className="flex-1"
            >
            
                
                <View className="p-4 bg-white shadow-sm border-b border-gray-100 pt-10">
                    <Text className="text-3xl font-extrabold text-teal-900">Devices</Text>
                </View>

                <View className="px-7 py-10 mx-5 my-5 bg-white shadow-sm border-b border-gray-100 rounded-lg">
                    <View className="flex-row border-b border-b-gray-800 mb-5">
                        <Text className="flex-1 text-xl font-bold text-gray-800 align-middle">
                            List of Devices
                        </Text>
                        <TouchableOpacity
                            onPress={addDeviceEventHandler}
                            className="flex flex-row w-fit gap-2 bg-blue-600 py-2 px-3 rounded-lg my-2"
                        >
                            <Entypo name={"plus"} size={20} color="white" />
                            <Text className="text-white text-center font-semibold text-sm">
                                New Device
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {devices.length>0 && <FlatList
                        data={devices}
                        keyExtractor={(item) => item.deviceID}
                        renderItem={({ item }) => <DeviceCard device={item} pressEventHandler={pressEventHandler} />}
                        contentContainerStyle={{ paddingBottom: 16 }}
                    >
                        
                    </FlatList>}
                </View>

        </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default ProfileTab;
