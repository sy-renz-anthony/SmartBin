import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, Redirect } from "expo-router";
import loadingOverlay from "../components/LoadingOverlay";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";

const ProfileTab =()=>{
    const [isLoading, setIsLoading] = useState(false);
    

    useEffect(()=>{
        setIsLoading(true);
        const reloadData = async()=>{
           
        }
        
        reloadData();
        setIsLoading(false);
    }, []);

    

    return(
        <SafeAreaView className="flex-1 bg-gray-100">
            {isLoading && loadingOverlay()}
            <ScrollView
                      showsVerticalScrollIndicator={false}
                      className="w-full flex flex-col"
            >
                
                <View className="p-4 bg-white shadow-sm border-b border-gray-100 pt-10">
                    <Text className="text-3xl font-extrabold text-teal-800">Usages</Text>
                </View>

                <View className="px-7 py-10 mx-5 my-5 bg-white shadow-sm border-b border-gray-100 rounded-lg">
                    <View className="flex-row border-b border-b-gray-800 mb-5">
                        <Text className="flex-1 text-xl font-bold text-gray-800 align-middle">
                            Search Usage Records
                        </Text>              
                    </View>
                    
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

export default ProfileTab;
