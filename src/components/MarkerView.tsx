import {
  StyleSheet,
  View,
  type ImageLoadEventData,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { AnnotationState } from '../core/AnnotationState';
import Svg, { Image } from 'react-native-svg';
import { markerComponentMap } from './core/markerComponentMap';
import { useMemo, useState } from 'react';

interface MarkerViewProps {
  targetSrc: string;
  annotation: AnnotationState;
  scaleStroke?: boolean;
}

const MarkerView: React.FC<MarkerViewProps> = ({
  targetSrc,
  annotation,
  scaleStroke = true,
}) => {
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
    <View style={styles.container} onLayout={handleAnnotationLayout}>
      <Svg
        width={annotation.width * zoomFactor}
        height={annotation.height * zoomFactor}
        viewBox={`0 0 ${annotation.width} ${annotation.height}`}
      >
        <Image
          href={targetSrc}
          width={annotation.width}
          height={annotation.height}
          onLoad={handleAnnotatedImageLoad}
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
  );
};

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
