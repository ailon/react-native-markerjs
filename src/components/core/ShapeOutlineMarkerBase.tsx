import { Path } from 'react-native-svg';
import type { ShapeOutlineMarkerBaseState } from '../../core/ShapeOutlineMarkerBaseState';
import RectangularBoxMarkerBase, {
  type RectangularBoxMarkerBaseProps,
} from './RectangularBoxMarkerBase';

interface ShapeOutlineMarkerBaseProps
  extends RectangularBoxMarkerBaseProps,
    ShapeOutlineMarkerBaseState {
  d: string;
}

const ShapeOutlineMarkerBase: React.FC<ShapeOutlineMarkerBaseProps> = ({
  d,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  children,
  zoomFactor = 1,
  scaleStroke = true,
  ...props
}: ShapeOutlineMarkerBaseProps) => {
  return (
    <RectangularBoxMarkerBase {...props}>
      <Path
        d={d}
        {...props}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
        strokeDasharray={strokeDasharray}
      />
      {children}
    </RectangularBoxMarkerBase>
  );
};

export default ShapeOutlineMarkerBase;
export type { ShapeOutlineMarkerBaseProps };
