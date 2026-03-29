import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

const MetricCard = ({ title, value,  iconName, color }) => (
  <View className="w-1/2 p-2 mt-2">
    <View className={`flex-col items-center p-3 rounded-xl shadow-sm border border-gray-100 ${color}`}>
      <MaterialCommunityIcons name={iconName} size={24} color="#374151" />
      <View className="ml-3">
        <Text className="text-lg font-bold text-gray-800">
          {value? "Full!" : "Ok!"}
        </Text>
        
      </View>
      <Text className="text-xs text-center text-gray-700">{title}</Text>
    </View>
  </View>
);

const DeviceCard = ({ device, pressEventHandler }) => {
  //console.log(JSON.stringify(device));
  return (
    <TouchableOpacity
      className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md border border-gray-100 active:bg-gray-50"
      onPress={() => pressEventHandler(device)}
      activeOpacity={0.8}
    >

      <View className="flex-row justify-between items-start pb-3 mb-3 border-b border-gray-100">
        <Text className="text-xl font-extrabold text-gray-900">
          {device.deviceID}
        </Text>
        <Octicons
          name="dot-fill"
          size={30}
          color={device.isOnline ? 'green' : 'red'}
        />
      </View>
        <Text className="text-md text-gray-500">
          {device.location}
        </Text>
      <View className="flex-row flex-wrap -m-2">
        
        <MetricCard
          title="Bio-Degradable"
          value={device.isBiodegradableBinFull}
          unit=""
          iconName="leaf"
          color="bg-green-50"
        />
        <MetricCard
          title="Non-Biodegradable"
          value={device.isNonBiodegradableBinBull}
          unit=""
          iconName="bottle-soda"
          color="bg-orange-50"
        />
        <MetricCard
          title="Hazardous"
          value={device.isHazardousBinFull}
          unit=""
          iconName="alert"
          color="bg-red-50"
        />
      </View>
    </TouchableOpacity>
  );
};

export default DeviceCard;