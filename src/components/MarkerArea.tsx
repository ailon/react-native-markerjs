import { StyleSheet, View } from 'react-native';
import type { AnnotationState } from '../core/AnnotationState';
import Svg, { Image } from 'react-native-svg';
import RectangularBoxMarkerBaseEditor from './editor/RectangularBoxMarkerBaseEditor';
import type { RectangularBoxMarkerBaseState } from '../core/RectangularBoxMarkerBaseState';

interface MarkerAreaProps {
  targetSrc: string;
  annotation: AnnotationState;
}

const MarkerArea: React.FC<MarkerAreaProps> = ({ targetSrc, annotation }) => {
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
              key={index}
              marker={marker as RectangularBoxMarkerBaseState}
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
