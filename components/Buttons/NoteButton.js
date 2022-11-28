import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

const NoteButton = ({
  title,
  Notes,
  onPress,
  buttonColour,
  titleColour,
  buttonStyle,
  textStyle,
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
          // marginTop: '-10%',
        }}>
        <Text
          style={{
            ...styles.appButtonText,
            ...textStyle,
            color: titleColour || '#FFF6F6',
            fontSize: 25,
          }}>
          {title}
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
    // margin: '2%',
  },

  appButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
});

export default NoteButton;
