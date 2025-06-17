import { Path } from 'react-native-svg';
import type { ShapeOutlineMarkerBaseState } from '../../core/ShapeOutlineMarkerBaseState';
import RectangularBoxMarkerBase from './RectangularBoxMarkerBase';

interface ShapeOutlineMarkerBaseProps extends ShapeOutlineMarkerBaseState {
  d: string;
}

const ShapeOutlineMarkerBase: React.FC<ShapeOutlineMarkerBaseProps> = ({
  d,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  ...props
}: ShapeOutlineMarkerBaseProps) => {
  return (
    <RectangularBoxMarkerBase {...props}>
      <Path
        d={d}
        {...props}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
    </RectangularBoxMarkerBase>
  );
};

export default ShapeOutlineMarkerBase;
