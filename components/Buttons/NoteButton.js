import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const deleteNote = id => {
  axios
    .delete('https://gavin-fyp.herokuapp.com/deleteNote', {
      id: id,
    })
    .then(response => {
      console.log('Deleted ', id);
    })
    .catch(error => {
      console.log(error);
    });
};

const NoteButton = ({
  title,
  content,
  Notes,
  onPress,
  buttonColour,
  titleColour,
  buttonStyle,
  textStyle,
  navigation,
  id,
}) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.appButtonContainer,
        ...buttonStyle,
        backgroundColor: buttonColour || '#F29947',
      }}
      onPress={onPress}>
      {/*Module name*/}
      <View
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          // marginTop: '-10%',
        }}>
        <Text
          style={{
            ...styles.appButtonText,
            ...textStyle,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: titleColour || '#FFF6F6',
            fontSize: 25,
          }}>
          {title}
        </Text>
        <Icon
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'right',
          }}
          name="delete"
          color="#ccc"
          size={30}
          onPress={() => deleteNote(id)}
          // onPress={() => navigation.navigate('Wiki')}
        />
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          // marginTop: '-10%',
        }}>
        <Text>{id}</Text>
        <Text
          style={{
            ...styles.appButtonText,
            ...textStyle,
            color: '#d1d1d1',
            fontSize: 15,
            flex: 1,
            numberOfLines: 1,
          }}>
          {content}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 8,
    borderRadius: 14,
    shadowColor: '#000', // IOS
    shadowOffset: {height: 4, width: 0}, // IOS
    shadowOpacity: 0.3, // IOS
    shadowRadius: 4.5, //IOS
    // padding: 6,
    paddingVertical: 10,
    margin: '2%',
  },

  appButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
});

export default NoteButton;
