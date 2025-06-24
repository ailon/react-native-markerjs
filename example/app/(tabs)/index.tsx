import { Button, SafeAreaView, StyleSheet, View } from 'react-native';
import {
  MarkerArea,
  type MarkerAreaHandle,
  type MarkerBaseState,
} from '@markerjs/react-native-markerjs';
import { useRef } from 'react';
import { useAnnotationContext } from '../context/AnnotationContext';
import { testState } from '../../sample-data/sample-state';
import { markerIdSymbol } from '../../../src/core/MarkerBaseState';

const Editor = () => {
  const { annotation, handleAnnotationChange } = useAnnotationContext();
  const markerAreaRef = useRef<MarkerAreaHandle>(null);

  const handleMarkerCreate = (markerType: string) => {
    markerAreaRef.current?.createMarker(markerType);
  };

  const handleSelectedMarkerChange = (marker: MarkerBaseState | null) => {
    console.log('Selected marker changed:', marker);
    // randomly update the marker's stroke color and width as PoC
    if (marker && annotation) {
      const updatedMarker = {
        ...marker,
        strokeColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        strokeWidth: Math.floor(Math.random() * 5) + 2,
      };

      const updatedAnnotation = {
        ...annotation,
        markers: annotation.markers.map((mark) =>
          mark[markerIdSymbol] === marker[markerIdSymbol]
            ? { ...mark, ...updatedMarker }
            : mark
        ),
      };
      handleAnnotationChange(updatedAnnotation);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topToolbar}>
        <Button
          title="Load sample state"
          onPress={() => handleAnnotationChange(testState)}
        />
        <Button
          title="Reset state"
          onPress={() => handleAnnotationChange(null)}
        />
      </View>
      <View style={styles.markerAreaContainer}>
        <MarkerArea
          ref={markerAreaRef}
          targetSrc={require('../../assets/sample-images/landscape.jpg')}
          annotation={annotation}
          // scaleStroke={false}
          onSelectedMarkerChange={handleSelectedMarkerChange}
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
        <Button title="⎼" onPress={() => handleMarkerCreate('LineMarker')} />
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
    overflow: 'hidden',
    width: '100%',
  },
  topToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 10,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ccc',
  },
});
