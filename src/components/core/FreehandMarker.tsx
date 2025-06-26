import { Path } from 'react-native-svg';
import type { MarkerBaseProps } from './MarkerBase';
import type { FreehandMarkerState } from '../../core/FreehandMarkerState';
import MarkerBase from './MarkerBase';

interface FreehandMarkerProps extends MarkerBaseProps, FreehandMarkerState {}

const FreehandMarker: React.FC<FreehandMarkerProps> = ({
  points,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  children,
  zoomFactor = 1,
  scaleStroke = true,
  ...props
}: FreehandMarkerProps) => {
  return (
    <MarkerBase {...props}>
      <Path
        d={`M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}`}
        {...props}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
        strokeDasharray={strokeDasharray}
      />
      {children}
    </MarkerBase>
  );
};

export default FreehandMarker;
export type { FreehandMarkerProps };
