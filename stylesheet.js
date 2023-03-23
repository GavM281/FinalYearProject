import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  screenContainer: {
    height: '100%',
    paddingHorizontal: 10,
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
    color: 'black',
    elevation: 6,
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 5,
  },
  flatList: {
    backgroundColor: 'white',
    elevation: 5,
    borderTopWidth: 0,
  },
  dropdown: {
    borderRadius: 0,
    borderWidth: 0,
    borderTopWidth: 1,
  },
  button: {
    fontSize: 20,
    alignItems: 'center',
    padding: 10,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'right',
    marginRight: 5,
  },
  roundTopCorners: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  roundBottomCorners: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default styles;
