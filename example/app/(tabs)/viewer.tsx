import { SafeAreaView, StyleSheet } from 'react-native';
import { MarkerView } from '@markerjs/react-native-markerjs';
import { testState } from '../../sample-data/sample-state';

const Viewer = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MarkerView
        targetSrc={require('../../assets/sample-images/landscape_sm.jpg')}
        annotation={testState}
      />
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
