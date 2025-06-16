import { StyleSheet, Text, View } from 'react-native';

const Viewer = () => {
  return (
    <View style={styles.container}>
      <Text>Viewer</Text>
    </View>
  );
};

export default Viewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
