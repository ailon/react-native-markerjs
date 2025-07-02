import { SafeAreaView, StyleSheet } from 'react-native';
import { MarkerView } from '@markerjs/react-native-markerjs';
import { useAnnotationContext } from '@markerjs/react-native-markerjs';

const Viewer = () => {
  const { annotation } = useAnnotationContext();
  return (
    <SafeAreaView style={styles.container}>
      {annotation && (
        <MarkerView
          targetSrc={require('../../assets/sample-images/landscape_sm.jpg')}
          annotation={annotation}
          // scaleStroke={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Viewer;

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
