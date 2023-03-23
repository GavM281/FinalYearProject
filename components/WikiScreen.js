import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import WikiModule from './Buttons/WikiModule';
import appStyles from '../stylesheet';
import axios from 'axios';

const WikiScreen = ({navigation}) => {
  const {loggedIn} = useContext(AuthContext);
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn, navigation]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // When the screen is focused (like loading from another screen), call function to refresh data
      console.log('');
      console.log('  || WIKISCREEN ||');
      getGroups();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getGroups = () => {
    axios
      .get('https://gavin-fyp.herokuapp.com/getModules')
      .then(response => {
        let responseData = JSON.parse(JSON.stringify(response.data));
        console.log('RESPONSE DATA: ', responseData);
        console.log();
        console.log('content', responseData[0].name);
        //List of rooms = responseData[0].Rooms
        setRooms(responseData);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={[styles.sectionContainer]}>
      <Text style={[appStyles.header]}>Modules</Text>
      <FlatList
        style={{...appStyles.flatList, ...appStyles.roundBottomCorners}}
        data={rooms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <WikiModule
            style={{elevation: 5}}
            title={item.name}
            onPress={() => navigation.navigate('ListNotes', {moduleCode: item.name, noteIDsList: item.notes, moduleID: item._id})}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default WikiScreen;
