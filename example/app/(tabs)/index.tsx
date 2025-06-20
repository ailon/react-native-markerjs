import { Button, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  MarkerArea,
  type MarkerAreaHandle,
} from '@markerjs/react-native-markerjs';
import { useRef } from 'react';
import { useAnnotationContext } from '../context/AnnotationContext';

const Editor = () => {
  const { annotation, handleAnnotationChange } = useAnnotationContext();
  const markerAreaRef = useRef<MarkerAreaHandle>(null);

  const handleMarkerCreate = (markerType: string) => {
    markerAreaRef.current?.createMarker(markerType);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.markerAreaContainer}>
        <MarkerArea
          ref={markerAreaRef}
          targetSrc={require('../../assets/sample-images/landscape_sm.jpg')}
          annotation={annotation}
          onAnnotationChange={handleAnnotationChange}
        />
      </View>
      <View style={styles.toolbar}>
        <Button
          title="🖱️"
          onPress={() => markerAreaRef.current?.switchToSelectMode()}
        />
        <Button
          title="🗑️"
          onPress={() => markerAreaRef.current?.deleteSelectedMarker()}
        />
        <Button title="▭" onPress={() => handleMarkerCreate('FrameMarker')} />
        <Button
          title="⭕️"
          onPress={() => handleMarkerCreate('EllipseFrameMarker')}
        />
      </View>
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
  markerAreaContainer: {
    flex: 0.8,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ccc',
  },
});
