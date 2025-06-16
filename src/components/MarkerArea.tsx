import { StyleSheet, Text, View } from 'react-native';

const MarkerArea = () => {
  return (
    <View style={styles.container}>
      <Text>MarkerArea</Text>
    </View>
  );
};

export default MarkerArea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#61dafb',
  },
});
