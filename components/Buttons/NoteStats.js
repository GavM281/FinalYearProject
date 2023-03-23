import {Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../../stylesheet';

const NoteStats = ({userEmail, privacy, numComments}) => {
  let icon;
  if (privacy !== 'private') {
    icon = 'public';
  } else {
    icon = 'lock';
  }
  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="person" size={20} style={[styles.icon]} />
        <Text>{userEmail}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name={icon} size={20} style={[styles.icon]} />
          <Text>{privacy} | </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="comment" size={15} style={[styles.icon]} />
          <Text>{numComments}</Text>
        </View>
      </View>
    </View>
  );
};

export default NoteStats;
