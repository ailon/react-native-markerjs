import { StyleSheet, View } from 'react-native';
import type { AnnotationState } from '../core/AnnotationState';
import Svg, { Image } from 'react-native-svg';
import { markerComponentMap } from './core/markerComponentMap';

interface MarkerViewProps {
  targetSrc: string;
  annotation: AnnotationState;
}

const MarkerView: React.FC<MarkerViewProps> = ({ targetSrc, annotation }) => {
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
        {annotation.markers.map((marker, index) => {
          const MarkerComponent = markerComponentMap[marker.typeName];
          return MarkerComponent ? (
            <MarkerComponent key={index} {...marker} />
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
