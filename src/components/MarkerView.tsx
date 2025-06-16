import { StyleSheet, Text, View } from 'react-native';

const MarkerView = () => {
  return (
    <View style={styles.container}>
      <Text>MarkerView</Text>
    </View>
  );
};

export default MarkerView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#da61fb',
  },
});
