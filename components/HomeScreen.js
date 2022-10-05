import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {StackActions} from '@react-navigation/native';

import {AuthContext} from '../context/AuthContext';

import BubbleButton from './Buttons/BubbleButton';
import BubbleButton2 from './Buttons/BubbleButton2';
import DividerLine from './SmallComponents/DividerLine';
import ComingSoon from './Buttons/ComingSoon';

const HomeScreen = ({navigation}) => {
  const {loggedIn, userData} = useContext(AuthContext);
  const userName = useState('Welcome');
  useEffect(() => {
    if (loggedIn === false) {
      navigation.dispatch(StackActions.replace('Sign In'));
    }
  }, [loggedIn]);

  return (
    <View style={styles.screenContainer}>
      <BubbleButton
        title={userName || userData.nickname}
        Groups="2"
        Messages="85"
        Notes="21"
        Days="7"
        onPress={() => navigation.navigate('Profile')}
      />
      <DividerLine title={'Recent Groups'} />

      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <BubbleButton2
          title="CS620C"
          Students="32"
          Notes="45"
          buttonColour={'#30B283'}
          onPress={() => navigation.navigate('GroupHome')}
        />
        <BubbleButton2
          title="CS161"
          Students="540"
          Notes="320"
          buttonColour={'#30B283'}
        />
      </View>
      <DividerLine title={'Notes'} />
      <ComingSoon title="Coming soon" buttonColour={'#C4C4CA'} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  /*container: {
    flex: 1,
    paddingRight: 30,
    paddingLeft: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },*/
  screenContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
    marginTop: '-20%',
  },
});
/*
   <View style={[styles.container]}>
        <Text style={[styles.textContainer]}>
          This is the home screen navigate below
        </Text>
        <Button
          title={'Analytics'}
          onPress={() => navigation.navigate('Analytics')}
        />
        <Button title={'Wiki'} onPress={() => navigation.navigate('Wiki')} />
      </View>
 */
