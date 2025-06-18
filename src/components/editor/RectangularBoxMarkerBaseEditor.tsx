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

type ManipulationMode = 'move' | 'resize' | 'rotate';

const RectangularBoxMarkerBaseEditor: React.FC<
  RectangularBoxMarkerBaseEditorProps
> = ({ marker, selected, onSelect, onMarkerChange }) => {
  const rotatorOffset = -30 as const;

  const [manipulationMode, setManipulationMode] =
    useState<ManipulationMode>('move');

  const [markerStartPosition, setMarkerStartPosition] = useState({
    left: marker.left,
    top: marker.top,
  });
  const [markerStartSize, setMarkerStartSize] = useState({
    width: marker.width,
    height: marker.height,
  });
  const [markerStartAngle, setMarkerStartAngle] = useState(
    marker.rotationAngle || 0
  );
  const [manipulationStartPosition, setManipulationStartPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleResponderGrant = (ev: GestureResponderEvent) => {
    console.log('Manipulation mode:', manipulationMode);
    setManipulationStartPosition({
      x: ev.nativeEvent.pageX,
      y: ev.nativeEvent.pageY,
    });

    onSelect?.(marker);
  };
  const handleResponderMove = (ev: GestureResponderEvent) => {
    // Get absolute movement in screen coordinates
    const dx = ev.nativeEvent.pageX - manipulationStartPosition.x;
    const dy = ev.nativeEvent.pageY - manipulationStartPosition.y;

    // Convert rotation to radians
    const angle = ((marker.rotationAngle || 0) * Math.PI) / 180;

    // Transform the movement according to rotation
    const rotatedDx = dx * Math.cos(angle) + dy * Math.sin(angle);
    const rotatedDy = -dx * Math.sin(angle) + dy * Math.cos(angle);

    if (onMarkerChange) {
      const updatedMarker: RectangularBoxMarkerBaseState = {
        ...marker,
      };

      switch (manipulationMode) {
        case 'resize':
          // Calculate width and height changes
          const widthChange = rotatedDx;
          const heightChange = rotatedDy;

          const newWidth = markerStartSize.width + widthChange;
          const newHeight = markerStartSize.height + heightChange;

          // Calculate the position adjustment needed to keep top-left corner in place
          const widthDiff = newWidth - markerStartSize.width;
          const heightDiff = newHeight - markerStartSize.height;

          // Calculate the offset caused by rotation
          const offsetX =
            (widthDiff * (1 - Math.cos(angle)) + heightDiff * Math.sin(angle)) /
            2;
          const offsetY =
            (-widthDiff * Math.sin(angle) +
              heightDiff * (1 - Math.cos(angle))) /
            2;

          updatedMarker.width = newWidth;
          updatedMarker.height = newHeight;
          updatedMarker.left = markerStartPosition.left - offsetX;
          updatedMarker.top = markerStartPosition.top - offsetY;
          break;
        case 'rotate':
          let newAngle =
            markerStartAngle + Math.atan2(dy, dx) * (180 / Math.PI);

          // Normalize the angle to 0-360 range
          //newAngle = newAngle + 90;
          if (newAngle < 0) {
            newAngle += 360;
          }

          updatedMarker.rotationAngle = newAngle;
          break;
        case 'move':
          updatedMarker.left = markerStartPosition.left + dx;
          updatedMarker.top = markerStartPosition.top + dy;
          break;
      }
      onMarkerChange(updatedMarker);
    }
  };
  const handleResponderRelease = () => {
    setManipulationMode('move');
    setMarkerStartPosition({
      left: marker.left,
      top: marker.top,
    });
    setMarkerStartSize({
      width: marker.width,
      height: marker.height,
    });
    setMarkerStartAngle(marker.rotationAngle || 0);
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
              <Grip
                x={marker.width}
                y={marker.height}
                onStartShouldSetResponder={() => {
                  setManipulationMode('resize');
                  return true;
                }}
                onResponderGrant={handleResponderGrant}
                onResponderMove={handleResponderMove}
                onResponderRelease={handleResponderRelease}
                onResponderTerminate={handleResponderRelease}
              />
              <Grip
                flipColors
                x={marker.width / 2}
                y={rotatorOffset}
                onStartShouldSetResponder={() => {
                  setManipulationMode('rotate');
                  return true;
                }}
                onResponderGrant={handleResponderGrant}
                onResponderMove={handleResponderMove}
                onResponderRelease={handleResponderRelease}
                onResponderTerminate={handleResponderRelease}
              />
            </G>
          </G>
        </FrameMarker>
      )}
    </MarkerBaseEditor>
  );
};

export default RectangularBoxMarkerBaseEditor;
