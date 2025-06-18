import { SafeAreaView, StyleSheet } from 'react-native';
import {
  MarkerArea,
  type AnnotationState,
} from '@markerjs/react-native-markerjs';
import { testState } from '../../sample-data/sample-state';
import { useState } from 'react';

const Editor = () => {
  const [annotation, setAnnotation] = useState(testState);

  const handleAnnotationChange = (newAnnotation: AnnotationState) => {
    setAnnotation(newAnnotation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MarkerArea
        targetSrc={require('../../assets/sample-images/landscape_sm.jpg')}
        annotation={annotation}
        onAnnotationChange={handleAnnotationChange}
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
