import React, { useEffect, useRef, useState } from 'react';
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
  isResizable?: boolean;
  onLongPress?: () => void;
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
  zoomFactor = 1,
  scaleStroke = true,
  disableInteraction = false,
  isResizable = true,
  onSelect,
  onMarkerChange,
  onMarkerCreate,
  onLongPress,
}) => {
  // what type of manipulation is currently active
  const [manipulationMode, setManipulationMode] =
    useState<ManipulationMode>('move');

  // Initial positions and sizes for the marker
  // These are used to calculate the changes during manipulation
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

  // Manipulation start position in screen coordinates
  const [manipulationStartPosition, setManipulationStartPosition] = useState({
    x: 0,
    y: 0,
  });
  // Center position in page coordinates for rotation manipulation
  const [
    manipulationStartCenterPagePosition,
    setManipulationStartCenterPagePosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const LONG_PRESS_DELAY = 500;
  const longPressTimeout = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  const cancelLongPress = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  const startManipulation = (location: GestureLocation) => {
    setManipulationStartPosition({
      x: location.pageX / zoomFactor,
      y: location.pageY / zoomFactor,
    });
  };

  const handleResponderGrant = (ev: GestureResponderEvent) => {
    startManipulation({
      pageX: ev.nativeEvent.pageX,
      pageY: ev.nativeEvent.pageY,
      locationX: ev.nativeEvent.locationX,
      locationY: ev.nativeEvent.locationY,
    });

    longPressTriggered.current = false;
    longPressTimeout.current = setTimeout(() => {
      longPressTriggered.current = true;
      onLongPress?.();
    }, LONG_PRESS_DELAY);

    onSelect?.(marker);
  };

  const handleResponderMove = (ev: GestureResponderEvent) => {
    // Get absolute movement in screen coordinates
    const dx = ev.nativeEvent.pageX / zoomFactor - manipulationStartPosition.x;
    const dy = ev.nativeEvent.pageY / zoomFactor - manipulationStartPosition.y;

    // ignore movement if it is too small
    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
      return;
    }

    cancelLongPress();

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
    cancelLongPress();

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

    const angleRad = (markerStartAngle * Math.PI) / 180;

    const centerX = ev.nativeEvent.pageX - radius * Math.sin(angleRad);
    const centerY = ev.nativeEvent.pageY + radius * Math.cos(angleRad);

    setManipulationStartCenterPagePosition({
      x: centerX,
      y: centerY,
    });

    return true;
  };

  // handle start of the creation of a new marker
  useEffect(() => {
    if (gestureStartLocation) {
      startManipulation(gestureStartLocation);
      // Only update if the gestureStartLocation is different from marker's current position
      const newLeft = gestureStartLocation.locationX / zoomFactor;
      const newTop = gestureStartLocation.locationY / zoomFactor;
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

  // handle changes during the creation of a new marker
  useEffect(() => {
    if (gestureMoveLocation) {
      const dx = Math.max(
        gestureMoveLocation.pageX / zoomFactor - manipulationStartPosition.x,
        0
      );
      const dy = Math.max(
        gestureMoveLocation.pageY / zoomFactor - manipulationStartPosition.y,
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

  // handle the end of the creation of a new marker
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

  // find the marker component for the current marker type
  const MarkerComponent = markerComponentMap[marker.typeName];
  if (!MarkerComponent) {
    console.warn(`No marker component found for type: ${marker.typeName}`);
    return null;
  }

  return (
    <MarkerBaseEditor
      marker={marker}
      disableInteraction={disableInteraction}
      onSelect={onSelect}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
      onResponderRelease={handleResponderRelease}
      onResponderTerminate={handleResponderRelease}
    >
      <MarkerComponent
        zoomFactor={zoomFactor}
        scaleStroke={scaleStroke}
        {...marker}
      >
        {selected && !disableInteraction && (
          <G>
            {/* control box */}
            <Rect
              x="0"
              y="0"
              width={marker.width}
              height={marker.height}
              fill="transparent"
              stroke="black"
              strokeWidth={0.5 / zoomFactor}
              strokeDasharray="3, 2"
            />
            <Line
              x1={marker.width / 2}
              y1="0"
              x2={marker.width / 2}
              y2={rotatorOffset / zoomFactor}
              stroke="black"
              strokeWidth={0.5 / zoomFactor}
              strokeDasharray="3, 2"
            />
            <G>
              {/* grips */}
              {isResizable && (
                <Grip
                  x={marker.width}
                  y={marker.height}
                  zoomFactor={zoomFactor}
                  onStartShouldSetResponder={() => {
                    setManipulationMode('resize');
                    return true;
                  }}
                  onResponderGrant={handleResponderGrant}
                  onResponderMove={handleResponderMove}
                  onResponderRelease={handleResponderRelease}
                  onResponderTerminate={handleResponderRelease}
                />
              )}
              <Grip
                flipColors
                x={marker.width / 2}
                y={rotatorOffset / zoomFactor}
                zoomFactor={zoomFactor}
                onStartShouldSetResponder={handleRotatorShouldSetResponder}
                onResponderGrant={handleResponderGrant}
                onResponderMove={handleResponderMove}
                onResponderRelease={handleResponderRelease}
                onResponderTerminate={handleResponderRelease}
              />
            </G>
          </G>
        )}
      </MarkerComponent>
    </MarkerBaseEditor>
  );
};

export default RectangularBoxMarkerBaseEditor;
