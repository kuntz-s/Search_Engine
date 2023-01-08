import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
    createStackNavigator
  } from "@react-navigation/stack";
import { SearchHomePageScreen } from "../../features/screen/SearchHomePageScreen";
import { ResultScreen } from "../../features/screen/ResultScreen";
import { LossInternetScreen } from "../../features/screen/LossInternetScreen";

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
                 <AppStack.Screen
                     options={{
                        headerShown: false
                      }}
                      name="Result"
                      component={ResultScreen}
                />
                 <AppStack.Screen
                     options={{
                        headerShown: false
                      }}
                      name="LossInternet"
                      component={LossInternetScreen}
                />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}