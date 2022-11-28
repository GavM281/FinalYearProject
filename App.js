import React, {useState} from 'react';
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';

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
const Stack = createNativeStackNavigator();

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

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
          <Stack.Screen
            name="ListNotes"
            component={ListNotes}
            options={({navigation}) => ({
              title: 'Notes',
              headerRight: () => (
                <View>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={{color: 'blue'}}>New</Text>
                  </TouchableOpacity>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      Alert.alert('Modal has been closed.');
                      setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Text style={styles.modalText}>Name</Text>
                        <Pressable
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => setModalVisible(!modalVisible)}>
                          <Text style={styles.textStyle}>Hide Modal</Text>
                        </Pressable>
                      </View>
                    </View>
                  </Modal>
                </View>
              ),
            })}
          />
          <Stack.Screen name="NoteScreen" component={NoteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
/*


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
*/
export default App;
