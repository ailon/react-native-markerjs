import type React from 'react';
import type { RectangularBoxMarkerBaseState } from '../../core/RectangularBoxMarkerBaseState';
import MarkerBase, { type MarkerBaseProps } from './MarkerBase';
import { G } from 'react-native-svg';

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
        <G transform={`translate(${left}, ${top})`}>{props.children}</G>
      </G>
    </MarkerBase>
  );
};

export default RectangularBoxMarkerBase;
export type { RectangularBoxMarkerBaseProps };
