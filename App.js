import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {HeaderBackButton} from '@react-navigation/elements';
import {RootSiblingParent} from 'react-native-root-siblings';
/*
Gets Bundle identifier and displays it when app runs

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
import NoteScreen from './components/NoteScreen';
import ListNotes from './components/ListNotes';
import CreateNoteScreen from './components/CreateNoteScreen';
import CommentsScreen from './components/CommentsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <RootSiblingParent>
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
            <Stack.Screen name="Comments" component={CommentsScreen} />
            <Stack.Screen
              name="ListNotes"
              component={ListNotes}
              options={({navigation}) => ({
                title: 'Notes',
              })}
            />
            <Stack.Screen
              name="NoteScreen"
              component={NoteScreen}
              options={({navigation}) => ({
                title: 'Notes',
                headerLeft: () => (
                  <HeaderBackButton
                    onPress={() => {
                      navigation.navigate('ListNotes');
                    }}
                  />
                ),
              })}
            />
            <Stack.Screen name="CreateNote" component={CreateNoteScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContextProvider>
    </RootSiblingParent>
  );
};

export default App;
