import { Path } from 'react-native-svg';
import RectangularBoxMarkerBase, {
  type RectangularBoxMarkerBaseProps,
} from './RectangularBoxMarkerBase';
import type { ShapeMarkerBaseState } from '../../core/ShapeMarkerBaseState';

interface ShapeMarkerBaseProps
  extends RectangularBoxMarkerBaseProps,
    ShapeMarkerBaseState {
  d: string;
}

const ShapeMarkerBase: React.FC<ShapeMarkerBaseProps> = ({
  d,
  fillColor,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  children,
  zoomFactor = 1,
  scaleStroke = true,
  ...props
}: ShapeMarkerBaseProps) => {
  return (
    <RectangularBoxMarkerBase {...props}>
      <Path
        d={d}
        {...props}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
        strokeDasharray={strokeDasharray}
      />
      {children}
    </RectangularBoxMarkerBase>
  );
};

export default ShapeMarkerBase;
export type { ShapeMarkerBaseProps };
