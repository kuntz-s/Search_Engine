import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { JournalNavigator } from "./JournalNavigator";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { DashboardScreen } from "../../features/dashboard/DashboardScreen";

export const Navigation = () => {
  const TAB_ICON = {
    Journal: { name: "book", ionicons: true },
    Dashboard: { name: "pie-chart", ionicons: true },
    Graph: { name: "graph", ionicons: false },
    Paramètres:{name:"settings", ionicons:true}
  };


  const colorParam = {active:colors.brand.primary, inactive:"gray"};

  const createScreenOptions = ({ route }) => {
    const icon = TAB_ICON[route.name];
    if (icon.ionicons) {
      return {
        tabBarIcon: ({ size, color }) => (
          <Ionicons name={icon.name} size={size} color={color} />
        ),
        tabBarActiveTintColor: colorParam.active,
        tabBarInactiveTintColor: colorParam.inactive,
      };
    } else {
      return {
        tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name={icon.name} size={size} color={color} />
        ),
        tabBarActiveTintColor: colorParam.active,
        tabBarInactiveTintColor: colorParam.inactive,
      };
    }
  };

  const Tab = createBottomTabNavigator();

  const GraphNavigator = () => {
    return (
      <View>
        <Text>stephane</Text>
      </View>
    );
  };
  
  const SettingsNavigator = () => {
    return (
      <View>
        <Text>stephane</Text>
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={createScreenOptions}>
        
      <Tab.Screen
          name="Journal"
          component={JournalNavigator}
          options={{ headerShown: false }}
        />
         <Tab.Screen
          name="Graph"
          component={GraphNavigator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
         <Tab.Screen
          name="Paramètres"
          component={SettingsNavigator}
          options={{ headerShown: false }}
        />
       
      </Tab.Navigator>
    </NavigationContainer>
  );
};
