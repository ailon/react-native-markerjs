import React, { useEffect, useState } from 'react';
import { G, Line, Rect } from 'react-native-svg';
import type { RectangularBoxMarkerBaseState } from '../../core/RectangularBoxMarkerBaseState';
import Grip from './Grip';
import MarkerBaseEditor, {
  type MarkerBaseEditorProps,
} from './MarkerBaseEditor';
import { type GestureResponderEvent } from 'react-native';
import type { GestureLocation } from '../../editor/GestureLocation';
import { markerComponentMap } from '../core/markerComponentMap';

interface RectangularBoxMarkerBaseEditorProps extends MarkerBaseEditorProps {
  marker: RectangularBoxMarkerBaseState;
}

type ManipulationMode = 'move' | 'resize' | 'rotate';

const rotatorOffset = -30 as const;
const minWidth = 10 as const;
const minHeight = 10 as const;

const RectangularBoxMarkerBaseEditor: React.FC<
  RectangularBoxMarkerBaseEditorProps
> = ({
  marker,
  mode,
  selected,
  gestureStartLocation,
  gestureMoveLocation,
  onSelect,
  onMarkerChange,
  onMarkerCreate,
}) => {
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
  const [
    manipulationStartCenterPagePosition,
    setManipulationStartCenterPagePosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const startManipulation = (location: GestureLocation) => {
    setManipulationStartPosition({
      x: location.pageX,
      y: location.pageY,
    });
  };

  const handleResponderGrant = (ev: GestureResponderEvent) => {
    console.log('Manipulation mode:', manipulationMode);

    startManipulation({
      pageX: ev.nativeEvent.pageX,
      pageY: ev.nativeEvent.pageY,
      locationX: ev.nativeEvent.locationX,
      locationY: ev.nativeEvent.locationY,
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

          const newWidth = Math.max(markerStartSize.width + widthChange, 0);
          const newHeight = Math.max(markerStartSize.height + heightChange, 0);

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
          const centerDx =
            ev.nativeEvent.pageX - manipulationStartCenterPagePosition.x;
          const centerDy =
            ev.nativeEvent.pageY - manipulationStartCenterPagePosition.y;
          let newAngle = Math.atan2(centerDy, centerDx) * (180 / Math.PI) + 90;

          // Normalize the angle to 0-360 range
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

    const updatedMarker: RectangularBoxMarkerBaseState = {
      ...marker,
      width: Math.max(marker.width, minWidth),
      height: Math.max(marker.height, minHeight),
    };
    setMarkerStartPosition({
      left: updatedMarker.left,
      top: updatedMarker.top,
    });
    setMarkerStartSize({
      width: updatedMarker.width,
      height: updatedMarker.height,
    });
    setMarkerStartAngle(updatedMarker.rotationAngle || 0);
    setManipulationStartPosition({ x: 0, y: 0 });
    onMarkerChange?.(updatedMarker);
  };

  const handleRotatorShouldSetResponder = (ev: GestureResponderEvent) => {
    setManipulationMode('rotate');

    const radius = marker.height / 2 + Math.abs(rotatorOffset);

    console.log('Rotator grip pressed:', {
      pageX: ev.nativeEvent.pageX,
      pageY: ev.nativeEvent.pageY,
      locationX: ev.nativeEvent.locationX,
      locationY: ev.nativeEvent.locationY,
      markerHeight: marker.height,
      radius,
    });

    const angleRad = (markerStartAngle * Math.PI) / 180;

    const centerX = ev.nativeEvent.pageX - radius * Math.sin(angleRad);
    const centerY = ev.nativeEvent.pageY + radius * Math.cos(angleRad);

    setManipulationStartCenterPagePosition({
      x: centerX,
      y: centerY,
    });

    console.log('Manipulation start center position:', {
      x: centerX,
      y: centerY,
    });
    return true;
  };

  useEffect(() => {
    if (gestureStartLocation) {
      startManipulation(gestureStartLocation);
      // Only update if the gestureStartLocation is different from marker's current position
      const newLeft = gestureStartLocation.locationX;
      const newTop = gestureStartLocation.locationY;
      if (marker.left !== newLeft || marker.top !== newTop) {
        const updatedMarker: RectangularBoxMarkerBaseState = {
          ...marker,
          left: newLeft,
          top: newTop,
        };
        if (onMarkerChange) {
          onMarkerChange(updatedMarker);
        }
      }
    }
    // Only depend on gestureStartLocation and onMarkerChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gestureStartLocation, onMarkerChange]);

  useEffect(() => {
    if (gestureMoveLocation) {
      const dx = Math.max(
        gestureMoveLocation.pageX - manipulationStartPosition.x,
        0
      );
      const dy = Math.max(
        gestureMoveLocation.pageY - manipulationStartPosition.y,
        0
      );
      if (marker.width !== dx || marker.height !== dy) {
        const updatedMarker: RectangularBoxMarkerBaseState = {
          ...marker,
          width: dx,
          height: dy,
        };
        if (onMarkerChange) {
          onMarkerChange(updatedMarker);
        }
      }
    }
    // Only depend on gestureMoveLocation and onMarkerChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gestureMoveLocation, onMarkerChange]);

  useEffect(() => {
    if (mode === 'finishCreation') {
      const sanitizedMarker: RectangularBoxMarkerBaseState = {
        ...marker,
        width: Math.max(marker.width, minWidth),
        height: Math.max(marker.height, minHeight),
      };
      if (onMarkerCreate) {
        onMarkerCreate(sanitizedMarker);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, onMarkerCreate]);

  const MarkerComponent = markerComponentMap[marker.typeName];
  if (!MarkerComponent) {
    console.warn(`No marker component found for type: ${marker.typeName}`);
    return null;
  }

  return (
    <MarkerBaseEditor
      marker={marker}
      onSelect={onSelect}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
      onResponderRelease={handleResponderRelease}
      onResponderTerminate={handleResponderRelease}
    >
      <MarkerComponent {...marker}>
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
              onStartShouldSetResponder={handleRotatorShouldSetResponder}
              onResponderGrant={handleResponderGrant}
              onResponderMove={handleResponderMove}
              onResponderRelease={handleResponderRelease}
              onResponderTerminate={handleResponderRelease}
            />
          </G>
        </G>
      </MarkerComponent>
    </MarkerBaseEditor>
  );
};

export default RectangularBoxMarkerBaseEditor;
