import { SafeAreaView, StyleSheet } from 'react-native';
import { MarkerArea } from '@markerjs/react-native-markerjs';
import { testState } from '../../sample-data/sample-state';
import { useState } from 'react';

const Editor = () => {
  const [annotation, setAnnotation] = useState(testState);

  return (
    <SafeAreaView style={styles.container}>
      <MarkerArea
        targetSrc={require('../../assets/sample-images/landscape_sm.jpg')}
        annotation={annotation}
        onAnnotationChange={setAnnotation}
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
