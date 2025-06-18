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
  const rotatorOffset = -30 as const;

  const [activeGrip, setActiveGrip] = useState<string | null>(null);

  const [markerStartPosition, setMarkerStartPosition] = useState({
    left: marker.left,
    top: marker.top,
  });
  const [markerStartSize, setMarkerStartSize] = useState({
    width: marker.width,
    height: marker.height,
  });
  const [manipulationStartPosition, setManipulationStartPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleResponderGrant = (ev: GestureResponderEvent) => {
    console.log('Active grip:', activeGrip);
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
      const updatedMarker: RectangularBoxMarkerBaseState = {
        ...marker,
      };

      if (activeGrip !== null) {
        switch (activeGrip) {
          case 'bottom-right':
            updatedMarker.width = markerStartSize.width + dx;
            updatedMarker.height = markerStartSize.height + dy;
            break;
        }
      } else {
        updatedMarker.left = markerStartPosition.left + dx;
        updatedMarker.top = markerStartPosition.top + dy;
      }
      onMarkerChange(updatedMarker);
    }
  };
  const handleResponderRelease = () => {
    setActiveGrip(null);
    setMarkerStartPosition({
      left: marker.left,
      top: marker.top,
    });
    setMarkerStartSize({
      width: marker.width,
      height: marker.height,
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
              <Grip
                x={marker.width}
                y={marker.height}
                onStartShouldSetResponder={() => {
                  setActiveGrip('bottom-right');
                  return true;
                }}
                onResponderGrant={handleResponderGrant}
                onResponderMove={handleResponderMove}
                onResponderRelease={handleResponderRelease}
                onResponderTerminate={handleResponderRelease}
              />
              <Grip flipColors x={marker.width / 2} y={rotatorOffset} />
            </G>
          </G>
        </FrameMarker>
      )}
    </MarkerBaseEditor>
  );
};

export default RectangularBoxMarkerBaseEditor;
