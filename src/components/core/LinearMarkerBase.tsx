import type React from 'react';
import type { LinearMarkerBaseState } from '../../core/LinearMarkerBaseState';
import MarkerBase, { type MarkerBaseProps } from './MarkerBase';
import { G, Path } from 'react-native-svg';

interface LinearMarkerBaseProps extends MarkerBaseProps, LinearMarkerBaseState {
  d: string;
}

const LinearMarkerBase: React.FC<LinearMarkerBaseProps> = ({
  d,
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
        <Path
          d={d}
          {...props}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
          strokeDasharray={strokeDasharray}
        />
        {children}
      </G>
    </MarkerBase>
  );
};

export default LinearMarkerBase;
export type { LinearMarkerBaseProps };
