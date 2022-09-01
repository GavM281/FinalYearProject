import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const { width } = Dimensions.get('window')
const HeaderLine = () => {
  return (
    <View style={styles.PageFitter}>
      <View style={styles.divider}>
        <View style={styles.hrLine} />
        <View style={styles.hrLine} />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  PageFitter: {
    justifyContent: 'center',
    margin: '-25%',
    paddingBottom: '6%',
  },
  divider: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  hrLine: {
    width: width / 2.1,
    backgroundColor: 'black',
    height: 1,
  },
})

export default HeaderLine
