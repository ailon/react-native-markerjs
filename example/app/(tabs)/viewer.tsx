import { SafeAreaView, StyleSheet } from 'react-native';
import { MarkerView } from '@markerjs/react-native-markerjs';

const Viewer = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MarkerView />
    </SafeAreaView>
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
