import { StyleSheet, View, type GestureResponderEvent } from 'react-native';
import type { AnnotationState } from '../core/AnnotationState';
import Svg, { Image } from 'react-native-svg';
import RectangularBoxMarkerBaseEditor from './editor/RectangularBoxMarkerBaseEditor';
import type { RectangularBoxMarkerBaseState } from '../core/RectangularBoxMarkerBaseState';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { markerIdSymbol, type MarkerBaseState } from '../core/MarkerBaseState';
import { generateMarkerId } from '../core/markerIdGenerator';
import { FrameMarkerFactory } from '../core/FrameMarkerFactory';
import type { GestureLocation } from '../editor/GestureLocation';
import type { EditorMode } from './editor/MarkerBaseEditor';

export interface MarkerAreaHandle {
  createMarker: (markerType: string) => void;
  switchToSelectMode: () => void;
  deleteSelectedMarker: () => void;
}

interface MarkerAreaProps {
  targetSrc: string;
  annotation: AnnotationState;
  onAnnotationChange?: (annotation: AnnotationState) => void;
}

type MarkerAreaMode = 'create' | 'select';

const MarkerArea = forwardRef<MarkerAreaHandle, MarkerAreaProps>(
  ({ targetSrc, annotation, onAnnotationChange }, ref) => {
    const [mode, setMode] = useState<MarkerAreaMode>('select');
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
    const [markerTypeToCreate, setMarkerTypeToCreate] = useState<string | null>(
      null
    );
    const [creatingMarker, setCreatingMarker] =
      useState<MarkerBaseState | null>(null);
    const [creatingEditorMode, setCreatingEditorMode] =
      useState<EditorMode>('select');

    const [gestureStartLocation, setGestureStartLocation] =
      useState<GestureLocation | null>(null);
    const [gestureMoveLocation, setGestureMoveLocation] =
      useState<GestureLocation | null>(null);

    const createMarker = (markerType: string) => {
      setMarkerTypeToCreate(markerType);
      setMode('create');
    };

    useImperativeHandle(ref, () => ({
      createMarker,
      switchToSelectMode: () => setMode('select'),
      deleteSelectedMarker: () => {
        if (selectedMarker && onAnnotationChange) {
          const updatedMarkers = annotation.markers.filter(
            (marker) => marker[markerIdSymbol] !== selectedMarker
          );
          onAnnotationChange({ ...annotation, markers: updatedMarkers });
          setSelectedMarker(null);
        }
      },
    }));

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

    const handleResponderGrant = (ev: GestureResponderEvent) => {
      if (mode === 'create' && markerTypeToCreate) {
        console.log('Creating marker of type:', markerTypeToCreate);

        setCreatingEditorMode('create');

        setGestureStartLocation({
          pageX: ev.nativeEvent.pageX,
          pageY: ev.nativeEvent.pageY,
          locationX: ev.nativeEvent.locationX,
          locationY: ev.nativeEvent.locationY,
        });

        if (markerTypeToCreate === 'FrameMarker') {
          const newMarker = FrameMarkerFactory.createMarker();
          setCreatingMarker(newMarker);
        }
      }
    };

    const handleResponderMove = (ev: GestureResponderEvent) => {
      setGestureMoveLocation({
        pageX: ev.nativeEvent.pageX,
        pageY: ev.nativeEvent.pageY,
        locationX: ev.nativeEvent.locationX,
        locationY: ev.nativeEvent.locationY,
      });
    };

    const handleResponderRelease = (_ev: GestureResponderEvent) => {
      setCreatingEditorMode('finishCreation');
      setGestureStartLocation(null);
      setGestureMoveLocation(null);
    };

    return (
      <View style={styles.container}>
        <Svg
          width={annotation.width}
          height={annotation.height}
          viewBox={`0 0 ${annotation.width} ${annotation.height}`}
          onStartShouldSetResponder={() => mode === 'create'}
          onResponderGrant={handleResponderGrant}
          onResponderMove={handleResponderMove}
          onResponderRelease={handleResponderRelease}
          onResponderTerminate={handleResponderRelease}
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

          {creatingMarker && (
            <RectangularBoxMarkerBaseEditor
              marker={creatingMarker as RectangularBoxMarkerBaseState}
              mode={creatingEditorMode}
              gestureStartLocation={gestureStartLocation ?? undefined}
              gestureMoveLocation={gestureMoveLocation ?? undefined}
              onMarkerChange={(m) => {
                setCreatingMarker(m);
              }}
              onMarkerCreate={(m) => {
                if (onAnnotationChange) {
                  const updatedAnnotation = {
                    ...annotation,
                    markers: [...annotation.markers, m],
                  };
                  onAnnotationChange(updatedAnnotation);
                }
                setCreatingMarker(null);
                setMode('select');
                setSelectedMarker(m[markerIdSymbol] ?? null);
              }}
            />
          )}
        </Svg>
      </View>
    );
  }
);

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
