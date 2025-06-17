import { SafeAreaView, StyleSheet } from 'react-native';
import { MarkerArea } from '@markerjs/react-native-markerjs';
import { testState } from '../../sample-data/sample-state';

const Editor = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MarkerArea
        targetSrc={require('../../assets/sample-images/landscape_sm.jpg')}
        annotation={testState}
      />
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
