import { SafeAreaView, StyleSheet } from 'react-native';
import { MarkerArea } from '@markerjs/react-native-markerjs';

const Editor = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MarkerArea />
    </SafeAreaView>
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
