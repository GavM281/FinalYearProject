import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {AuthContext} from '../context/AuthContext';
import DividerLine from './SmallComponents/DividerLine';
import HeaderLine from './SmallComponents/HeaderLine';
import BubbleButton from './Buttons/BubbleButton';
import ComingSoon from './Buttons/ComingSoon';
const GroupHomeScreen = ({navigation, route}) => {
  const {loggedIn, userData} = useContext(AuthContext);
  const {GroupName} = route.params;
  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);

  /*
   * This is the group list of modules screen
   * On this screen there should be an interactive button for the cs620c class and later an ability to add more classes
   * This button should lead to a list of socket rooms where they can join their labs
   */
  return (
    <View style={styles.screenContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '2%',
        }}>
        <Text style={styles.header}>{GroupName}</Text>
        <Text style={styles.header}>Members: 570</Text>
      </View>
      <HeaderLine />
      <BubbleButton
        title="Statistics"
        Groups="2"
        Messages="85"
        Notes="21"
        Days="7"
        buttonColour={'#1E1E1E'}
        //onPress={navigation.navigate('Chat')}
      />
      <DividerLine title={'Group Chats'} />
      {/*<GroupchatFlatList user={userData.email} />*/}
      <Text>Email: {userData.email}</Text>

      <DividerLine title={'Notes'} />
      <ComingSoon title="Coming soon" buttonColour={'#C4C4CA'} />
    </View>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 16,
    paddingHorizontal: 16,
    marginTop: '-20%',
  },
  header: {
    fontSize: 22,
    color: '#30B283',
  },
});

export default GroupHomeScreen;
/*
<View style={[styles.sectionContainer]}>
      <Pressable
        style={styles.button}
        onPress={() => {
          setButtonPresses(buttonPresses + 1);
        }}>
        <Text style={styles.sectionTitle}>press me</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          navigation.navigate('Group');
        }}>
        <Text style={styles.sectionTitle}>cs620c </Text>
      </Pressable>
      <Text>{buttonPresses}</Text>
    </View>
 */
