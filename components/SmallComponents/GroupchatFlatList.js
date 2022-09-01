import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from 'react-native'
const data = [
  { id: 1, title: 'Apples', number: '1' },
  { id: 2, title: 'Pears', number: '3' },
  { id: 3, title: 'Oranges', number: '2' },
  { id: 4, title: 'Bananas', number: '0' },
  { id: 5, title: 'Kiwis', number: '0' },
  { id: 6, title: 'Peaches', number: '4' },
  { id: 7, title: 'Grapes', number: '3' },
  { id: 8, title: 'Apricots', number: '1' },
]
const Item = ({ title, number }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '2%',
    }}
  >
    <TouchableOpacity onPress={() => alert(title + ' was pressed')}>
      <Text style={styles.title}># {title}</Text>
    </TouchableOpacity>
    <Text style={styles.title}> {number}/4</Text>
  </View>
)

const renderItem = ({ item }) => (
  <Item title={item.title} number={item.number} />
)
const GroupchatFlatList = () => {
  return (
    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
      {data && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
})
export default GroupchatFlatList
