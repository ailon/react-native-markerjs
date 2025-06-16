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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
