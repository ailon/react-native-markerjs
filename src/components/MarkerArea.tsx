import { StyleSheet, View } from 'react-native';
import type { AnnotationState } from '../core/AnnotationState';
import Svg, { Image } from 'react-native-svg';
import RectangularBoxMarkerBaseEditor from './editor/RectangularBoxMarkerBaseEditor';
import type { RectangularBoxMarkerBaseState } from '../core/RectangularBoxMarkerBaseState';
import { useEffect, useState } from 'react';
import { markerIdSymbol } from '../core/MarkerBaseState';
import { generateMarkerId } from '../core/markerIdGenerator';

interface MarkerAreaProps {
  targetSrc: string;
  annotation: AnnotationState;
  onAnnotationChange?: (annotation: AnnotationState) => void;
}

const MarkerArea: React.FC<MarkerAreaProps> = ({
  targetSrc,
  annotation,
  onAnnotationChange,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  useEffect(() => {
    const missingIdIndex = annotation.markers.findIndex((marker) => {
      return marker[markerIdSymbol] === undefined;
    });

    if (missingIdIndex > -1) {
      const newMarkers = annotation.markers.map((marker) => {
        const newMarker = {
          ...marker,
          [markerIdSymbol]: marker[markerIdSymbol] ?? generateMarkerId(),
        };
        return newMarker;
      });

      if (onAnnotationChange) {
        onAnnotationChange({
          ...annotation,
          markers: newMarkers,
        });
      }
    }
  }, [onAnnotationChange, annotation]);

  return (
    <View style={styles.container}>
      <Svg
        width={annotation.width}
        height={annotation.height}
        viewBox={`0 0 ${annotation.width} ${annotation.height}`}
      >
        <Image
          href={targetSrc}
          width={annotation.width}
          height={annotation.height}
        />
        {annotation.markers.map((marker, index) =>
          marker.typeName === 'FrameMarker' ? (
            <RectangularBoxMarkerBaseEditor
              key={marker[markerIdSymbol] ?? index}
              marker={marker as RectangularBoxMarkerBaseState}
              selected={selectedMarker === marker[markerIdSymbol]}
              onSelect={(m) => setSelectedMarker(m[markerIdSymbol] ?? null)}
              onMarkerChange={(m) => {
                if (onAnnotationChange) {
                  const updatedAnnotation = {
                    ...annotation,
                    markers: annotation.markers.map((mark) =>
                      mark[markerIdSymbol] === m[markerIdSymbol]
                        ? { ...mark, ...m }
                        : mark
                    ),
                  };
                  onAnnotationChange(updatedAnnotation);
                }
              }}
            />
          ) : null
        )}
      </Svg>
    </View>
  );
};

export default MarkerArea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#61dafb',
  },
});
