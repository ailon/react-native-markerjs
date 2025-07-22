import {
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import type { AnnotationState } from '../core/AnnotationState';
import Svg, { Image } from 'react-native-svg';
import { markerComponentMap } from './core/markerComponentMap';
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import Logo from './core/Logo';
import { Activator } from '../core/Activator';
import type { GestureLocation } from '../editor/GestureLocation';

export interface MarkerViewHandle {
  visualRef: RefObject<View | null>;
}

interface MarkerViewProps {
  targetSrc: string;
  annotation: AnnotationState;
  scaleStroke?: boolean;
  disableManualZoom?: boolean;
}

const MarkerView = forwardRef<MarkerViewHandle, MarkerViewProps>(
  (
    { targetSrc, annotation, scaleStroke = true, disableManualZoom = false },
    ref
  ) => {
    const [layoutSize, setLayoutSize] = useState<{
      width: number;
      height: number;
    } | null>(null);

    const visualRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      visualRef,
    }));

    const [gestureStartLocation, setGestureStartLocation] =
      useState<GestureLocation | null>(null);

    const [zoomGestureStartLocation, setZoomGestureStartLocation] = useState<
      [GestureLocation, GestureLocation] | null
    >(null);
    const [zoomGestureStartZoomFactor, setZoomGestureStartZoomFactor] =
      useState<number | null>(null);

    const [gestureStartOffset, setGestureStartOffset] = useState<{
      x: number;
      y: number;
    }>({ x: 0, y: 0 });
    const [offsetX, setOffsetX] = useState<number>(0);
    const [offsetY, setOffsetY] = useState<number>(0);

    const [manualZoomFactor, setManualZoomFactor] = useState<number | null>(
      null
    );

    const zoomFactor = useMemo(() => {
      if (manualZoomFactor !== null) {
        return manualZoomFactor;
      }

      if (layoutSize) {
        // fit the annotated image to the layout size

        // Calculate scale to fit the image within the layout while preserving aspect ratio
        const imgWidth = annotation.width;
        const imgHeight = annotation.height;
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
    }, [manualZoomFactor, layoutSize, annotation.width, annotation.height]);

    const handleAnnotationLayout = (ev: LayoutChangeEvent) => {
      const { width, height } = ev.nativeEvent.layout;
      setLayoutSize({ width, height });
    };

    const handleStartShouldSetResponder = (ev: GestureResponderEvent) => {
      return ev.nativeEvent.touches.length === 2 && !disableManualZoom;
    };

    const handleResponderGrant = (ev: GestureResponderEvent) => {
      setGestureStartLocation({
        pageX: ev.nativeEvent.pageX,
        pageY: ev.nativeEvent.pageY,
        locationX: ev.nativeEvent.locationX,
        locationY: ev.nativeEvent.locationY,
      });
      setGestureStartOffset({
        x: offsetX,
        y: offsetY,
      });

      if (ev.nativeEvent.touches.length > 1) {
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
      }
    };

    const handleResponderMove = (ev: GestureResponderEvent) => {
      if (ev.nativeEvent.touches.length > 1) {
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

        const distanceX =
          ev.nativeEvent.pageX - (gestureStartLocation?.pageX ?? 0);
        const distanceY =
          ev.nativeEvent.pageY - (gestureStartLocation?.pageY ?? 0);

        if (Math.abs(distanceX) > 3 || Math.abs(distanceY) > 3) {
          // Only apply zoom and offset if the gesture has moved significantly
          setManualZoomFactor(zoomGestureStartZoomFactor * zoomFactorChange);

          setOffsetX((gestureStartOffset.x + distanceX) * zoomFactorChange);
          setOffsetY((gestureStartOffset.y + distanceY) * zoomFactorChange);
        }
      }
    };

    const handleResponderRelease = (_ev: GestureResponderEvent) => {
      setGestureStartLocation(null);
    };

    return (
      <View style={styles.container} onLayout={handleAnnotationLayout}>
        <View ref={visualRef} collapsable={false}>
          <Svg
            width={annotation.width * zoomFactor}
            height={annotation.height * zoomFactor}
            viewBox={`0 0 ${annotation.width} ${annotation.height}`}
            onStartShouldSetResponder={handleStartShouldSetResponder}
            onResponderGrant={handleResponderGrant}
            onResponderMove={handleResponderMove}
            onResponderRelease={handleResponderRelease}
            onResponderTerminate={handleResponderRelease}
            style={{ marginLeft: offsetX, marginTop: offsetY }}
          >
            <Image
              href={targetSrc}
              width={annotation.width}
              height={annotation.height}
            />
            {annotation.markers.map((marker, index) => {
              const MarkerComponent = markerComponentMap[marker.typeName];
              return MarkerComponent ? (
                <MarkerComponent
                  key={index}
                  zoomFactor={zoomFactor}
                  scaleStroke={scaleStroke}
                  {...marker}
                />
              ) : null;
            })}
          </Svg>
        </View>
        {!Activator.isLicensed('MJSRN') && <Logo />}
      </View>
    );
  }
);

export default MarkerView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
