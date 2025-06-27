import { Path } from 'react-native-svg';
import type { PolygonMarkerState } from '../../core/PolygonMarkerState';
import type { MarkerBaseProps } from './MarkerBase';
import MarkerBase from './MarkerBase';

interface PolygonMarkerProps extends MarkerBaseProps, PolygonMarkerState {}

const PolygonMarker: React.FC<PolygonMarkerProps> = ({
  points,
  fillColor,
  children,
  strokeWidth,
  strokeColor,
  strokeDasharray,
  scaleStroke = false,
  zoomFactor = 1,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLayout,
  ...props
}: PolygonMarkerProps) => {
  return (
    <MarkerBase {...props}>
      {points.length > 0 && (
        <>
          {/* Transparent path for interaction */}
          <Path
            d={`M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`}
            {...props}
            fill="transparent"
            stroke="transparent"
            strokeWidth={Math.max(
              (strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1),
              20 // ensure a minimum stroke width for interaction
            )}
          />

          <Path
            d={`M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`}
            {...props}
            fill={fillColor ?? 'transparent'}
            stroke={strokeColor}
            strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
            strokeDasharray={strokeDasharray}
          />
        </>
      )}
      {children}
    </MarkerBase>
  );
};

export default PolygonMarker;
