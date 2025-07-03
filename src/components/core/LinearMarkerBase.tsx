import type React from 'react';
import type { LinearMarkerBaseState } from '../../core/LinearMarkerBaseState';
import MarkerBase, { type MarkerBaseProps } from './MarkerBase';
import { G, Path } from 'react-native-svg';

interface LinearMarkerBaseProps extends MarkerBaseProps, LinearMarkerBaseState {
  d: string;
  startTerminatorD?: string;
  endTerminatorD?: string;
}

const LinearMarkerBase: React.FC<LinearMarkerBaseProps> = ({
  d,
  startTerminatorD,
  endTerminatorD,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  children,
  zoomFactor = 1,
  scaleStroke = true,
  ...props
}: LinearMarkerBaseProps) => {
  return (
    <MarkerBase {...props}>
      <G>
        {/* Transparent path for interaction */}
        <Path
          d={d}
          {...props}
          fill="transparent"
          stroke="transparent"
          strokeWidth={Math.max(
            (strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1),
            20 // ensure a minimum stroke width for interaction
          )}
        />
        <Path
          d={d}
          {...props}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
          strokeDasharray={strokeDasharray}
        />
        {startTerminatorD && (
          <Path
            d={startTerminatorD}
            {...props}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
          />
        )}
        {endTerminatorD && (
          <Path
            d={endTerminatorD}
            {...props}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
          />
        )}
        {children}
      </G>
    </MarkerBase>
  );
};

export default LinearMarkerBase;
export type { LinearMarkerBaseProps };
