import React from 'react';
import { G, Line, Rect } from 'react-native-svg';
import type { RectangularBoxMarkerBaseState } from '../../core/RectangularBoxMarkerBaseState';
import FrameMarker from '../core/FrameMarker';

interface RectangularBoxMarkerBaseEditorProps {
  marker: RectangularBoxMarkerBaseState;
}

const RectangularBoxMarkerBaseEditor: React.FC<
  RectangularBoxMarkerBaseEditorProps
> = ({ marker }) => {
  return (
    <G>
      {marker.typeName === 'FrameMarker' && (
        <FrameMarker {...marker}>
          <Rect
            x="0"
            y="0"
            width={marker.width}
            height={marker.height}
            fill="transparent"
            stroke="black"
            strokeWidth="0.5"
            strokeDasharray="3, 2"
          />
          <Line
            x1={marker.width / 2}
            y1="0"
            x2={marker.width / 2}
            y2={-20}
            stroke="black"
            strokeWidth="0.5"
            strokeDasharray="3, 2"
          />
        </FrameMarker>
      )}
    </G>
  );
};

export default RectangularBoxMarkerBaseEditor;
