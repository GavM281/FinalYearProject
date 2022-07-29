import React, {useState} from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

/*
Gets Bundle identifer and displays it when app runs

import DeviceInfo from 'react-native-device-info';
console.log('@ device   ', DeviceInfo.getBundleId());
*/
/*
Components
 */
import SignInScreen from './components/SignInScreen';
import {AuthContextProvider} from './context/AuthContext';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import GroupHomeScreen from './components/GroupHomeScreen';
import WikiScreen from './components/WikiScreen';
import HamburgerMenu from './components/HamburgerMenu';
import GroupScreen from './components/GroupScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Hamburger"
            component={HamburgerMenu}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Sign In" component={SignInScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="GroupHome" component={GroupHomeScreen} />
          <Stack.Screen name="Group" component={GroupScreen} />
          <Stack.Screen name="Wiki" component={WikiScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
};
/*

 */
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default App;
