import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
    createStackNavigator
  } from "@react-navigation/stack";
import { SearchHomePageScreen } from "../../features/screen/SearchHomePageScreen";

const AppStack = createStackNavigator();

export const Navigation = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator>
                <AppStack.Screen
                     options={{
                        headerShown: false
                      }}
                      name="HomePage"
                      component={SearchHomePageScreen}
                />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}