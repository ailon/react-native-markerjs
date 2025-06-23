import {
  StyleSheet,
  View,
  type GestureResponderEvent,
  type ImageLoadEventData,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { AnnotationState } from '../core/AnnotationState';
import Svg, { Image } from 'react-native-svg';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { markerIdSymbol, type MarkerBaseState } from '../core/MarkerBaseState';
import { generateMarkerId } from '../editor/markerIdGenerator';
import type { GestureLocation } from '../editor/GestureLocation';
import type { EditorMode } from './editor/MarkerBaseEditor';
import { editorComponentMap } from './editor/editorComponentMap';
import { markerFactoryMap } from '../editor/markerFactoryMap';

export interface MarkerAreaHandle {
  createMarker: (markerType: string) => void;
  switchToSelectMode: () => void;
  deleteSelectedMarker: () => void;
}

interface MarkerAreaProps {
  targetSrc: string;
  annotation: AnnotationState | null;
  scaleStroke?: boolean;
  onAnnotationChange?: (annotation: AnnotationState) => void;
}

type MarkerAreaMode = 'create' | 'select';

const MarkerArea = forwardRef<MarkerAreaHandle, MarkerAreaProps>(
  ({ targetSrc, annotation, scaleStroke = true, onAnnotationChange }, ref) => {
    const [mode, setMode] = useState<MarkerAreaMode>('select');

    // selected marker ID
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

    // type of marker to create in "create" mode
    const [markerTypeToCreate, setMarkerTypeToCreate] = useState<string | null>(
      null
    );
    // marker being created in "create" mode
    const [creatingMarker, setCreatingMarker] =
      useState<MarkerBaseState | null>(null);
    // editor mode for the marker being created - this informs the editor component
    // about whether it's in the process of being created or finished creation
    const [creatingEditorMode, setCreatingEditorMode] =
      useState<EditorMode>('select');

    // locations for gesture handling passed down to the editor component
    const [gestureStartLocation, setGestureStartLocation] =
      useState<GestureLocation | null>(null);
    const [gestureMoveLocation, setGestureMoveLocation] =
      useState<GestureLocation | null>(null);

    const [annotatedImageSize, setAnnotatedImageSize] = useState<{
      width: number;
      height: number;
    } | null>(null);
    const [layoutSize, setLayoutSize] = useState<{
      width: number;
      height: number;
    } | null>(null);

    const zoomFactor = useMemo(() => {
      if (annotatedImageSize && layoutSize) {
        // fit the annotated image to the layout size

        // Calculate scale to fit the image within the layout while preserving aspect ratio
        const imgWidth = annotation?.width ?? annotatedImageSize.width;
        const imgHeight = annotation?.height ?? annotatedImageSize.height;
        const layoutAspect = layoutSize.width / layoutSize.height;
        const imgAspect = imgWidth / imgHeight;

        if (imgAspect > layoutAspect) {
          // Image is wider than layout, fit width
          return layoutSize.width / imgWidth;
        } else {
          // Image is taller than layout, fit height
          return layoutSize.height / imgHeight;
        }
      }
      return 1;
    }, [annotatedImageSize, layoutSize, annotation?.width, annotation?.height]);

    // initiates marker creation
    const createMarker = (markerType: string) => {
      setMarkerTypeToCreate(markerType);
      setMode('create');
    };

    // Expose methods to the parent component via ref
    useImperativeHandle(ref, () => ({
      createMarker,
      switchToSelectMode: () => setMode('select'),
      deleteSelectedMarker: () => {
        if (annotation && selectedMarker && onAnnotationChange) {
          const updatedMarkers = annotation.markers.filter(
            (marker) => marker[markerIdSymbol] !== selectedMarker
          );
          onAnnotationChange({ ...annotation, markers: updatedMarkers });
          setSelectedMarker(null);
        }
      },
    }));

    // Ensure all markers have a unique ID
    // This is important for the editor to track markers correctly
    useEffect(() => {
      if (!annotation) return;

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

    // Handle gestures on the marker area
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

        const markerFactory = markerFactoryMap[markerTypeToCreate];
        if (markerFactory) {
          const newMarker = markerFactory.createMarker();
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

    // If a marker is being created, we need to find its editor component
    const CreatingEditorComponent =
      creatingMarker && editorComponentMap[creatingMarker.typeName];

    if (creatingMarker && !CreatingEditorComponent) {
      console.warn(
        `No editor component found for type: ${creatingMarker.typeName}`
      );
      return null;
    }

    const handleInitialImageLoad = (
      ev: NativeSyntheticEvent<ImageLoadEventData>
    ) => {
      if (annotation === null) {
        const { width, height } = ev.nativeEvent.source;
        if (onAnnotationChange) {
          onAnnotationChange({
            version: 3,
            width,
            height,
            markers: [],
          });
        }
      }
    };

    const handleAnnotatedImageLoad = (
      ev: NativeSyntheticEvent<ImageLoadEventData>
    ) => {
      if (annotation) {
        const { width, height } = ev.nativeEvent.source;
        // Update the annotated image size
        setAnnotatedImageSize({ width, height });
      }
    };

    const handleAnnotationLayout = (ev: LayoutChangeEvent) => {
      const { width, height } = ev.nativeEvent.layout;
      setLayoutSize({ width, height });
    };

    return (
      <View
        style={{ ...styles.container, opacity: annotation ? 1 : 0 }}
        onLayout={handleAnnotationLayout}
      >
        {annotation === null && (
          <Image href={targetSrc} onLoad={handleInitialImageLoad} />
        )}
        {annotation && (
          <Svg
            width={annotation.width * zoomFactor}
            height={annotation.height * zoomFactor}
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
              onLoad={handleAnnotatedImageLoad}
            />
            {annotation.markers.map((marker, index) => {
              // find the editor component for the marker
              const EditorComponent = editorComponentMap[marker.typeName];
              if (!EditorComponent) {
                console.warn(
                  `No editor component found for type: ${marker.typeName}`
                );
                return null;
              }

              return (
                <EditorComponent
                  key={marker[markerIdSymbol] ?? index}
                  marker={marker}
                  zoomFactor={zoomFactor}
                  scaleStroke={scaleStroke}
                  selected={selectedMarker === marker[markerIdSymbol]}
                  onSelect={(m: MarkerBaseState) =>
                    setSelectedMarker(m[markerIdSymbol] ?? null)
                  }
                  onMarkerChange={(m: MarkerBaseState) => {
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
              );
            })}

            {creatingMarker && CreatingEditorComponent && (
              <CreatingEditorComponent
                marker={creatingMarker}
                mode={creatingEditorMode}
                zoomFactor={zoomFactor}
                scaleStroke={scaleStroke}
                gestureStartLocation={gestureStartLocation ?? undefined}
                gestureMoveLocation={gestureMoveLocation ?? undefined}
                onMarkerChange={(m: MarkerBaseState) => {
                  setCreatingMarker(m);
                }}
                onMarkerCreate={(m: MarkerBaseState) => {
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
        )}
      </View>
    );
  }
);

export default MarkerArea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#61dafb',
  },
});
