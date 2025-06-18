import React, { useState } from 'react';
import { G, Line, Rect } from 'react-native-svg';
import type { RectangularBoxMarkerBaseState } from '../../core/RectangularBoxMarkerBaseState';
import FrameMarker from '../core/FrameMarker';
import Grip from './Grip';
import MarkerBaseEditor, {
  type MarkerBaseEditorProps,
} from './MarkerBaseEditor';
import { type GestureResponderEvent } from 'react-native';

interface RectangularBoxMarkerBaseEditorProps extends MarkerBaseEditorProps {
  marker: RectangularBoxMarkerBaseState;
}

const RectangularBoxMarkerBaseEditor: React.FC<
  RectangularBoxMarkerBaseEditorProps
> = ({ marker, selected, onSelect, onMarkerChange }) => {
  const rotatorOffset = -30;

  const [markerStartPosition, setMarkerStartPosition] = useState({
    left: marker.left,
    top: marker.top,
  });
  const [manipulationStartPosition, setManipulationStartPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleResponderGrant = (ev: GestureResponderEvent) => {
    setManipulationStartPosition({
      x: ev.nativeEvent.pageX,
      y: ev.nativeEvent.pageY,
    });

    onSelect?.(marker);
  };
  const handleResponderMove = (ev: GestureResponderEvent) => {
    const dx = ev.nativeEvent.pageX - manipulationStartPosition.x;
    const dy = ev.nativeEvent.pageY - manipulationStartPosition.y;

    if (onMarkerChange) {
      const movedMarker: RectangularBoxMarkerBaseState = {
        ...marker,
        left: markerStartPosition.left + dx,
        top: markerStartPosition.top + dy,
      };
      onMarkerChange(movedMarker);
    }
  };
  const handleResponderRelease = () => {
    setMarkerStartPosition({
      left: marker.left,
      top: marker.top,
    });
    setManipulationStartPosition({ x: 0, y: 0 });
  };

  return (
    <MarkerBaseEditor
      marker={marker}
      onSelect={onSelect}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
      onResponderRelease={handleResponderRelease}
      onResponderTerminate={handleResponderRelease}
    >
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
