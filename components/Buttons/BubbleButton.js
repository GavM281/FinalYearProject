import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

const BubbleButton = ({
  title,
  Groups,
  Messages,
  Notes,
  Days,
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
      <View
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginTop: '-10%',
        }}>
        <Text
          style={{
            ...styles.appButtonText,
            ...textStyle,
            color: titleColour || '#FFF6F6',
            fontSize: 18,
          }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}>
        <View>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              color: titleColour || '#FFF6F6',
              fontSize: 14,
            }}>
            Number of Groups
          </Text>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              color: titleColour || '#FFF6F6',
              fontSize: 14,
            }}>
            {Groups}
          </Text>
        </View>

        <View>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              color: titleColour || '#FFF6F6',
              fontSize: 14,
              flexDirection: 'row',
            }}>
            Messages sent
          </Text>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              color: titleColour || '#FFF6F6',
              fontSize: 14,
            }}>
            {Messages}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginBottom: '-10%',
        }}>
        <View>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              color: titleColour || '#FFF6F6',
              fontSize: 14,
            }}>
            Notes uploaded
          </Text>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              color: titleColour || '#FFF6F6',
              fontSize: 14,
            }}>
            {Notes}
          </Text>
        </View>
        <View>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              color: titleColour || '#FFF6F6',
              fontSize: 14,
            }}>
            Days spent learning
          </Text>
          <Text
            style={{
              ...styles.appButtonText,
              ...textStyle,
              color: titleColour || '#FFF6F6',
              fontSize: 14,
            }}>
            {Days}
          </Text>
        </View>
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
    padding: 16,
    paddingVertical: 40,
  },

  appButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'flex-start',
  },
});

export default BubbleButton;
