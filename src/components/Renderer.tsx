import { StyleSheet, Text, View } from 'react-native';

const Renderer = () => {
  return (
    <View style={styles.container}>
      <Text>Renderer</Text>
    </View>
  );
};

export default Renderer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#dafb61',
  },
});
