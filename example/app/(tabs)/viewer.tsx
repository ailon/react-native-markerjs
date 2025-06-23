import { SafeAreaView, StyleSheet } from 'react-native';
import { MarkerView } from '@markerjs/react-native-markerjs';
import { useAnnotationContext } from '../context/AnnotationContext';

const Viewer = () => {
  const { annotation } = useAnnotationContext();
  return (
    <SafeAreaView style={styles.container}>
      {annotation && (
        <MarkerView
          targetSrc={require('../../assets/sample-images/landscape_sm.jpg')}
          annotation={annotation}
        />
      )}
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
