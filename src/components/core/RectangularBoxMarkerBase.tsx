import type React from 'react';
import type { RectangularBoxMarkerBaseState } from '../../core/RectangularBoxMarkerBaseState';
import MarkerBase from './MarkerBase';
import { G } from 'react-native-svg';

interface RectangularBoxMarkerBaseProps extends RectangularBoxMarkerBaseState {
  children: React.ReactNode;
}

const RectangularBoxMarkerBase: React.FC<RectangularBoxMarkerBaseProps> = (
  props: RectangularBoxMarkerBaseProps
) => {
  return (
    <MarkerBase {...props}>
      <G
        transform={`rotate(${props.rotationAngle ?? 0}, ${props.left + props.width / 2}, ${props.top + props.height / 2})`}
      >
        <G transform={`translate(${props.left}, ${props.top})`}>
          {props.children}
        </G>
      </G>
    </MarkerBase>
  );
};

export default RectangularBoxMarkerBase;
