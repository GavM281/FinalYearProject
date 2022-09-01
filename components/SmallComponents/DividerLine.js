import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('window');
const DividerLine = ({title}) => {
  return (
    <View style={styles.PageFitter}>
      <View style={styles.divider}>
        <View style={styles.hrLine} />
        <Text style={styles.dividerText}>{title}</Text>
        <View style={styles.hrLine} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  PageFitter: {
    justifyContent: 'center',
    margin: '-25%',
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    padding: '2%',
  },
  hrLine: {
    width: width / 3.5,
    backgroundColor: 'black',
    height: 1,
  },
  dividerText: {
    color: 'black',
    textAlign: 'center',
    width: width / 3,
  },
});

export default DividerLine;
