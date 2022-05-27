import 'react-native-gesture-handler';
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { SignIn } from "../screens/SignIn";

const Navigation = createStackNavigator();

export function AuthRoutes() {
    return(
        <Navigation.Navigator headerMode="none">
            <Navigation.Screen
                name="SignIn"
                component={SignIn}
            >
            </Navigation.Screen>
        </Navigation.Navigator>
    )
}