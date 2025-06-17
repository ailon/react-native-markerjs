import React from 'react';
import { G, Line, Rect } from 'react-native-svg';
import type { RectangularBoxMarkerBaseState } from '../../core/RectangularBoxMarkerBaseState';
import FrameMarker from '../core/FrameMarker';
import Grip from './Grip';
import MarkerBaseEditor, {
  type MarkerBaseEditorProps,
} from './MarkerBaseEditor';

interface RectangularBoxMarkerBaseEditorProps extends MarkerBaseEditorProps {
  marker: RectangularBoxMarkerBaseState;
}

const RectangularBoxMarkerBaseEditor: React.FC<
  RectangularBoxMarkerBaseEditorProps
> = ({ marker, selected, onSelect }) => {
  const rotatorOffset = -30;
  return (
    <MarkerBaseEditor marker={marker} onSelect={onSelect}>
      {marker.typeName === 'FrameMarker' && (
        <FrameMarker {...marker}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <G style={{ display: selected ? 'flex' : 'none' }}>
            {/* control box */}
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
              y2={rotatorOffset}
              stroke="black"
              strokeWidth="0.5"
              strokeDasharray="3, 2"
            />
            <G>
              {/* grips */}
              <Grip x={0} y={0} />
              <Grip x={marker.width} y={0} />
              <Grip x={0} y={marker.height} />
              <Grip x={marker.width} y={marker.height} />
              <Grip flipColors x={marker.width / 2} y={rotatorOffset} />
            </G>
          </G>
        </FrameMarker>
      )}
    </MarkerBaseEditor>
  );
};

export default RectangularBoxMarkerBaseEditor;
