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
import {
  addMarkerToAnnotation,
  createNewAnnotationState,
  updateMarkerInAnnotation,
} from '../utils/stateHelpers';
import Logo from './core/Logo';
import { Activator } from '../core/Activator';

export interface MarkerAreaHandle {
  createMarker: (markerType: string, params?: Partial<MarkerBaseState>) => void;
  switchToSelectMode: () => void;
  deleteSelectedMarker: () => void;
}

interface MarkerAreaProps {
  targetSrc: string;
  annotation: AnnotationState | null;
  scaleStroke?: boolean;
  onSelectedMarkerChange?: (marker: MarkerBaseState | null) => void;
  onAnnotationChange?: (annotation: AnnotationState) => void;
}

type MarkerAreaMode = 'create' | 'select';

const MarkerArea = forwardRef<MarkerAreaHandle, MarkerAreaProps>(
  (
    {
      targetSrc,
      annotation,
      scaleStroke = true,
      onAnnotationChange,
      onSelectedMarkerChange,
    },
    ref
  ) => {
    const [mode, setMode] = useState<MarkerAreaMode>('select');

    // selected marker ID
    const [selectedMarker, setSelectedMarker] =
      useState<MarkerBaseState | null>(null);

    // type of marker to create in "create" mode
    const [markerTypeToCreate, setMarkerTypeToCreate] = useState<string | null>(
      null
    );
    const [markerTypeToCreateParams, setMarkerTypeToCreateParams] =
      useState<Partial<MarkerBaseState> | null>(null);

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

    const [zoomGestureStartLocation, setZoomGestureStartLocation] = useState<
      [GestureLocation, GestureLocation] | null
    >(null);
    const [zoomGestureStartZoomFactor, setZoomGestureStartZoomFactor] =
      useState<number | null>(null);

    const [annotatedImageSize, setAnnotatedImageSize] = useState<{
      width: number;
      height: number;
    } | null>(null);
    const [layoutSize, setLayoutSize] = useState<{
      width: number;
      height: number;
    } | null>(null);

    const [manualZoomFactor, setManualZoomFactor] = useState<number | null>(
      null
    );

    const zoomFactor = useMemo(() => {
      if (manualZoomFactor !== null) {
        return manualZoomFactor;
      }

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
    }, [
      manualZoomFactor,
      annotatedImageSize,
      layoutSize,
      annotation?.width,
      annotation?.height,
    ]);

    // initiates marker creation
    const createMarker = (
      markerType: string,
      params?: Partial<MarkerBaseState>
    ) => {
      setMarkerTypeToCreate(markerType);
      setMarkerTypeToCreateParams(params ?? null);
      setMode('create');
    };

    // Expose methods to the parent component via ref
    useImperativeHandle(ref, () => ({
      createMarker,
      switchToSelectMode: () => setMode('select'),
      deleteSelectedMarker: () => {
        if (annotation && selectedMarker && onAnnotationChange) {
          const updatedMarkers = annotation.markers.filter(
            (marker) =>
              marker[markerIdSymbol] !== selectedMarker[markerIdSymbol]
          );
          onAnnotationChange({ ...annotation, markers: updatedMarkers });
          setSelectedMarker(null);
          onSelectedMarkerChange?.(null);
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
    const handleStartShouldSetResponder = (ev: GestureResponderEvent) => {
      console.log(
        'handleStartShouldSetResponder',
        ev.nativeEvent.touches.length
      );
      return mode === 'create' || ev.nativeEvent.touches.length === 2;
    };

    const handleResponderGrant = (ev: GestureResponderEvent) => {
      console.log('handleResponderGrant', ev.nativeEvent);
      if (mode === 'select' && ev.nativeEvent.touches.length > 1) {
        const [touch1, touch2] = ev.nativeEvent.touches;
        if (!touch1 || !touch2) {
          console.warn('Not enough touches for zoom gesture');
          return;
        }
        setZoomGestureStartLocation([
          {
            touchId: touch1.identifier,
            pageX: touch1.pageX,
            pageY: touch1.pageY,
            locationX: touch1.locationX,
            locationY: touch1.locationY,
          },
          {
            touchId: touch2.identifier,
            pageX: touch2.pageX,
            pageY: touch2.pageY,
            locationX: touch2.locationX,
            locationY: touch2.locationY,
          },
        ]);
        setZoomGestureStartZoomFactor(zoomFactor);
      } else if (mode === 'create' && markerTypeToCreate) {
        // console.log('Creating marker of type:', markerTypeToCreate);

        setCreatingEditorMode('create');

        setGestureStartLocation({
          pageX: ev.nativeEvent.pageX,
          pageY: ev.nativeEvent.pageY,
          locationX: ev.nativeEvent.locationX,
          locationY: ev.nativeEvent.locationY,
        });

        const markerFactory = markerFactoryMap[markerTypeToCreate];
        if (markerFactory) {
          // console.log(`Using marker factory for type: ${markerTypeToCreate}`);
          const newMarker = markerFactory.createMarker(
            markerTypeToCreateParams ?? undefined
          );
          setCreatingMarker(newMarker);
        }
      }
    };

    const handleResponderMove = (ev: GestureResponderEvent) => {
      if (mode === 'select' && ev.nativeEvent.touches.length > 1) {
        const [touch1, touch2] = ev.nativeEvent.touches;
        const [startTouch1, startTouch2] = zoomGestureStartLocation ?? [];

        if (
          !touch1 ||
          !touch2 ||
          !startTouch1 ||
          !startTouch2 ||
          !zoomGestureStartZoomFactor
        ) {
          console.warn('Not enough data for zoom gesture');
          return;
        }

        const initialDistance = Math.sqrt(
          Math.pow(startTouch1.pageX - startTouch2.pageX, 2) +
            Math.pow(startTouch1.pageY - startTouch2.pageY, 2)
        );
        const currentDistance = Math.sqrt(
          Math.pow(touch1.pageX - touch2.pageX, 2) +
            Math.pow(touch1.pageY - touch2.pageY, 2)
        );
        // Prevent division by zero
        if (initialDistance === 0) return;

        // Calculate zoom factor change as the ratio of current to initial distance
        let zoomFactorChange = currentDistance / initialDistance;

        // Optionally, clamp the zoom factor to reasonable bounds
        zoomFactorChange = Math.max(0.2, Math.min(zoomFactorChange, 5));

        setManualZoomFactor(zoomGestureStartZoomFactor * zoomFactorChange);
      } else {
        setGestureMoveLocation({
          pageX: ev.nativeEvent.pageX,
          pageY: ev.nativeEvent.pageY,
          locationX: ev.nativeEvent.locationX,
          locationY: ev.nativeEvent.locationY,
        });
      }
    };

    const handleResponderRelease = (_ev: GestureResponderEvent) => {
      console.log('handleResponderRelease', _ev.nativeEvent.touches.length);
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
        setAnnotatedImageSize({ width, height });
        if (onAnnotationChange) {
          onAnnotationChange(createNewAnnotationState(width, height));
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

    const handleMarkerCreate = (m: MarkerBaseState, continuous = false) => {
      if (!annotation || !onAnnotationChange) return;

      onAnnotationChange(addMarkerToAnnotation(annotation, m));

      setCreatingMarker(null);
      setMode('select');
      setSelectedMarker(m ?? null);
      onSelectedMarkerChange?.(m ?? null);

      if (continuous) {
        createMarker(m.typeName);
      }
    };

    return (
      <View
        style={{ ...styles.container, opacity: annotation ? 1 : 0 }}
        onLayout={handleAnnotationLayout}
      >
        {annotation === null && (
          <Svg>
            <Image href={targetSrc} onLoad={handleInitialImageLoad} />
          </Svg>
        )}
        {annotation && (
          <>
            <Svg
              width={annotation.width * zoomFactor}
              height={annotation.height * zoomFactor}
              viewBox={`0 0 ${annotation.width} ${annotation.height}`}
              onStartShouldSetResponder={handleStartShouldSetResponder}
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
                    disableInteraction={mode === 'create'}
                    selected={
                      selectedMarker !== null &&
                      selectedMarker[markerIdSymbol] === marker[markerIdSymbol]
                    }
                    onSelect={(m: MarkerBaseState) => {
                      if (
                        selectedMarker?.[markerIdSymbol] !== m[markerIdSymbol]
                      ) {
                        setSelectedMarker(m ?? null);
                        onSelectedMarkerChange?.(m ?? null);
                      }
                    }}
                    onMarkerChange={(m: MarkerBaseState) => {
                      if (onAnnotationChange) {
                        onAnnotationChange(
                          updateMarkerInAnnotation(annotation, m)
                        );
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
                  onMarkerCreate={handleMarkerCreate}
                />
              )}
            </Svg>
            {!Activator.isLicensed('MJSRN') && <Logo />}
          </>
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
