import React from "react";
import { View, Text } from "react-native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { JournalScreen } from "../../features/journal/JournalScreen";
import { FoodRegisterScreen } from "../../features/journal/screen/FoodRegisterScreen";
import { NutritionDetailScreen } from "../../features/journal/screen/NutritionDetailScreen";
import { WaterRegisterScreen } from "../../features/journal/screen/WaterRegisterScreen";
import { DrinkRegisterScreen } from "../../features/journal/screen/DrinkRegisterScreen";
import { FruitRegisterScreen } from "../../features/journal/screen/FruitRegisterScreen";
import { VegetableRegisterScreen } from "../../features/journal/screen/VegetableRegisterScreen";
import { BowelRegisterScreen } from "../../features/journal/screen/BowelRegisterScreen";
import { HealthRegisterScreen } from "../../features/journal/screen/HealthRegisterScreen";
import { ConfirmRegisterScreen } from "../../features/journal/screen/ConfirmRegisterScreen";

const JournalStack = createStackNavigator();

const TestScreen = () => {
  return (
    <View>
      <Text>Test </Text>
    </View>
  );
};

export const JournalNavigator = () => {
  return (
    <JournalStack.Navigator>
      <JournalStack.Screen
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS,
        }}
        name="JournalScreen"
        component={JournalScreen}
      />
      <JournalStack.Screen
        options={{ headerShown: false }}
        name="NutritionDetail"
        component={NutritionDetailScreen}
      />
      <JournalStack.Screen
        options={{ headerShown: false }}
        name="FoodRegister"
        component={FoodRegisterScreen}
      />

      <JournalStack.Screen
        options={{ headerShown: false }}
        name="WaterRegister"
        component={WaterRegisterScreen}
      />

      <JournalStack.Screen
        options={{ headerShown: false }}
        name="DrinkRegister"
        component={DrinkRegisterScreen}
      />

      <JournalStack.Screen
        options={{ headerShown: false }}
        name="FruitRegister"
        component={FruitRegisterScreen}
      />

      <JournalStack.Screen
        options={{ headerShown: false }}
        name="VegetableRegister"
        component={VegetableRegisterScreen}
      />

      <JournalStack.Screen
        options={{ headerShown: false }}
        name="BowelRegister"
        component={BowelRegisterScreen}
      />

      <JournalStack.Screen
        options={{ headerShown: false }}
        name="HealthRegister"
        component={HealthRegisterScreen}
      />

      <JournalStack.Screen
        options={{ headerShown: false }}
        name="ConfirmRegister"
        component={ConfirmRegisterScreen}
      />
    </JournalStack.Navigator>
  );
};
