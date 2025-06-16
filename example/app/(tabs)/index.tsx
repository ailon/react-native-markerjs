import { StyleSheet, Text, View } from 'react-native';

const Editor = () => {
  return (
    <View style={styles.container}>
      <Text>Editor</Text>
    </View>
  );
};

export default Editor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
