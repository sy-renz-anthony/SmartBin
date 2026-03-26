import { Tabs } from "expo-router";
import { MaterialIcons, FontAwesome5, Foundation, Entypo } from "@expo/vector-icons";

export default function _Layout() {
  return (
    <Tabs 
        screenOptions={{
            tabBarShowLabel: false,
            tabBarItemStyle: { 
                width: '100%', 
                height: '100%', 
                justifyContent: 'center', 
                alignItems: 'center',
                paddingVertical: 10,
            },
            tabBarStyle: {
                backgroundColor: '#111827',
                borderRadius: 45,
                marginHorizontal: 10,
                marginBottom: 36,
                height: 52,
                position: "absolute",
                overflow: "hidden",
                borderWidth: 1,
                borderColor: '#0F0D23',
            },
            tabBarLabelStyle: {
                fontSize: 2,
                fontWeight: '600'
            },
            tabBarActiveTintColor: '#22c55e',
            tabBarInactiveTintColor: '#9ca3af',
        }}
        
    >
        <Tabs.Screen 
            name="Home"
            options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({focused})=>(
                    <FontAwesome5 name={"home"} size={28} color={focused ? ("orange"): ("white")} />
                )
            }}
        />
        <Tabs.Screen 
            name="Devices"
            options={{
                title: 'Devices',
                headerShown: false,
                tabBarIcon: ({focused})=>(
                    <FontAwesome5 name={"trash"} size={28} color={focused ? ("orange"): ("white")} />
                )
            }}
        />
        <Tabs.Screen 
            name="Log"
            options={{
                title: 'Log',
                headerShown: false,
                tabBarIcon: ({focused})=>(
                    <Foundation name={"clipboard-notes"} size={30} color={focused ? ("orange"): ("white")} />
                )
            }}
        />
        <Tabs.Screen 
            name="Map"
            options={{
                title: 'Map',
                headerShown: false,
                tabBarIcon: ({focused})=>(
                    <Entypo name={"location"} size={28} color={focused ? ("orange"): ("white")} />
                )
            }}
        />
        <Tabs.Screen 
            name="Profile"
            options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({focused})=>(
                    <MaterialIcons name={"manage-accounts"} size={30} color={focused ? ("orange"): ("white")} />
                )
            }}
        />
        
    </Tabs>
  );
}
