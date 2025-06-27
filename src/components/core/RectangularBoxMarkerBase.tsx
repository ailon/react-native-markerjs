import type React from 'react';
import type { RectangularBoxMarkerBaseState } from '../../core/RectangularBoxMarkerBaseState';
import MarkerBase, { type MarkerBaseProps } from './MarkerBase';
import { G, Rect } from 'react-native-svg';

interface RectangularBoxMarkerBaseProps
  extends MarkerBaseProps,
    RectangularBoxMarkerBaseState {}

const RectangularBoxMarkerBase: React.FC<RectangularBoxMarkerBaseProps> = (
  props: RectangularBoxMarkerBaseProps
) => {
  const { left, top, width, height, rotationAngle } = props;
  return (
    <MarkerBase {...props}>
      <G
        transform={`rotate(${rotationAngle ?? 0}, ${left + width / 2}, ${top + height / 2})`}
      >
        <G transform={`translate(${left}, ${top})`}>
          {props.children}
          {/* <Rect width={width} height={height} fill="rgba(0, 0, 255, 0.5)" /> */}
        </G>
      </G>
    </MarkerBase>
  );
};

export default RectangularBoxMarkerBase;
export type { RectangularBoxMarkerBaseProps };
