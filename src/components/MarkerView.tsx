import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
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

export interface MarkerViewHandle {
  visualRef: RefObject<View | null>;
}

interface MarkerViewProps {
  targetSrc: string;
  annotation: AnnotationState;
  scaleStroke?: boolean;
}

const MarkerView = forwardRef<MarkerViewHandle, MarkerViewProps>(
  ({ targetSrc, annotation, scaleStroke = true }, ref) => {
    const [layoutSize, setLayoutSize] = useState<{
      width: number;
      height: number;
    } | null>(null);

    const visualRef = useRef<View>(null);

    useImperativeHandle(ref, () => ({
      visualRef,
    }));

    const zoomFactor = useMemo(() => {
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
    }, [layoutSize, annotation.width, annotation.height]);

    const handleAnnotationLayout = (ev: LayoutChangeEvent) => {
      const { width, height } = ev.nativeEvent.layout;
      setLayoutSize({ width, height });
    };

    return (
      <View style={styles.container} onLayout={handleAnnotationLayout}>
        <View ref={visualRef} collapsable={false}>
          <Svg
            width={annotation.width * zoomFactor}
            height={annotation.height * zoomFactor}
            viewBox={`0 0 ${annotation.width} ${annotation.height}`}
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
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#da61fb',
    overflow: 'hidden',
  },
});
