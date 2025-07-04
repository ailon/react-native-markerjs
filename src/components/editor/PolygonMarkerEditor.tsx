import React, { useEffect, useRef, useState } from 'react';
import { G, Line } from 'react-native-svg';
import MarkerBaseEditor, {
  type MarkerBaseEditorProps,
} from './MarkerBaseEditor';
import { type GestureResponderEvent } from 'react-native';
import type { GestureLocation } from '../../editor/GestureLocation';
import { markerComponentMap } from '../core/markerComponentMap';
import type { PolygonMarkerState } from '../../core/PolygonMarkerState';
import Grip from './Grip';

interface PolygonMarkerEditorProps extends MarkerBaseEditorProps {
  marker: PolygonMarkerState;
}

const PolygonMarkerEditor: React.FC<PolygonMarkerEditorProps> = ({
  marker,
  mode,
  selected,
  gestureStartLocation,
  gestureMoveLocation,
  zoomFactor = 1,
  scaleStroke = true,
  disableInteraction = false,
  onSelect,
  onMarkerChange,
  onMarkerCreate,
}) => {
  // Initial positions and sizes for the marker
  // These are used to calculate the changes during manipulation
  const [markerStartPosition, setMarkerStartPosition] = useState([
    ...marker.points,
  ]);

  // Manipulation start position in screen coordinates
  const [manipulationStartPosition, setManipulationStartPosition] = useState({
    x: 0,
    y: 0,
  });

  const startManipulation = (location: GestureLocation) => {
    setManipulationStartPosition({
      x: location.pageX / zoomFactor,
      y: location.pageY / zoomFactor,
    });
  };

  const LONG_PRESS_DELAY = 500;
  const longPressTimeout = useRef<number | NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  const cancelLongPress = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  const handleResponderGrant = (ev: GestureResponderEvent) => {
    startManipulation({
      pageX: ev.nativeEvent.pageX,
      pageY: ev.nativeEvent.pageY,
      locationX: ev.nativeEvent.locationX,
      locationY: ev.nativeEvent.locationY,
    });

    onSelect?.(marker);
  };

  const handleGripResponderGrant = (
    ev: GestureResponderEvent,
    gripIndex: number
  ) => {
    longPressTriggered.current = false;
    longPressTimeout.current = setTimeout(() => {
      longPressTriggered.current = true;
      handleGripLongPress(gripIndex);
    }, LONG_PRESS_DELAY);

    startManipulation({
      pageX: ev.nativeEvent.pageX,
      pageY: ev.nativeEvent.pageY,
      locationX: ev.nativeEvent.locationX,
      locationY: ev.nativeEvent.locationY,
    });
  };

  const handleResponderMove = (ev: GestureResponderEvent) => {
    // Get absolute movement in screen coordinates
    const dx = ev.nativeEvent.pageX / zoomFactor - manipulationStartPosition.x;
    const dy = ev.nativeEvent.pageY / zoomFactor - manipulationStartPosition.y;

    if (onMarkerChange) {
      const updatedMarker: PolygonMarkerState = {
        ...marker,
        points: marker.points.map((point, index) => {
          return markerStartPosition[index]
            ? {
                x: markerStartPosition[index].x + dx,
                y: markerStartPosition[index].y + dy,
              }
            : point;
        }),
      };

      onMarkerChange(updatedMarker);
    }
  };

  const handleGripResponderMove = (
    ev: GestureResponderEvent,
    gripIndex: number
  ) => {
    // Get absolute movement in screen coordinates
    const dx = ev.nativeEvent.pageX / zoomFactor - manipulationStartPosition.x;
    const dy = ev.nativeEvent.pageY / zoomFactor - manipulationStartPosition.y;

    // ignore movement if it is too small
    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
      return;
    }

    cancelLongPress();

    if (onMarkerChange) {
      const updatedMarker: PolygonMarkerState = {
        ...marker,
        points: marker.points.map((point, index) => {
          if (index === gripIndex) {
            return markerStartPosition[index]
              ? {
                  x: markerStartPosition[index].x + dx,
                  y: markerStartPosition[index].y + dy,
                }
              : point;
          }
          return point;
        }),
      };

      onMarkerChange(updatedMarker);
    }
  };

  const handleResponderRelease = () => {
    cancelLongPress();

    const updatedMarker: PolygonMarkerState = {
      ...marker,
    };
    setMarkerStartPosition([...updatedMarker.points]);
    setManipulationStartPosition({ x: 0, y: 0 });
    onMarkerChange?.(updatedMarker);
  };

  const handleGripResponderRelease = () => {
    cancelLongPress();

    const updatedMarker: PolygonMarkerState = {
      ...marker,
    };
    setMarkerStartPosition([...updatedMarker.points]);
    setManipulationStartPosition({ x: 0, y: 0 });
    onMarkerChange?.(updatedMarker);
  };

  const handleGripLongPress = (gripIndex: number | null) => {
    // Handle long press on grip - remove the point
    if (gripIndex !== null) {
      const updatedMarker: PolygonMarkerState = {
        ...marker,
        points: marker.points.filter((_, index) => index !== gripIndex),
      };
      setMarkerStartPosition([...updatedMarker.points]);
      setManipulationStartPosition({ x: 0, y: 0 });
      onMarkerChange?.(updatedMarker);
    }
  };

  const handleLineLongPress = (
    _ev: GestureResponderEvent,
    lineIndex: number
  ) => {
    const point1 = marker.points[lineIndex];
    const point2 =
      lineIndex < marker.points.length - 1
        ? marker.points[lineIndex + 1]
        : marker.points[0];

    // Handle long press on line - add a new point
    if (!point1 || !point2) return;

    const newPoint = {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
    };
    const updatedPoints = [
      ...marker.points.slice(0, lineIndex + 1),
      newPoint,
      ...marker.points.slice(lineIndex + 1),
    ];
    const updatedMarker: PolygonMarkerState = {
      ...marker,
      points: updatedPoints,
    };
    setMarkerStartPosition([...updatedMarker.points]);
    onMarkerChange?.(updatedMarker);
  };

  // handle start of the creation of a new marker
  useEffect(() => {
    if (gestureStartLocation) {
      startManipulation(gestureStartLocation);
      // Only update if the gestureStartLocation is different from marker's current position
      const newX = gestureStartLocation.locationX / zoomFactor;
      const newY = gestureStartLocation.locationY / zoomFactor;
      if (marker.points.length === 0) {
        const updatedMarker: PolygonMarkerState = {
          ...marker,
          points: [
            { x: newX, y: newY },
            { x: newX, y: newY },
            { x: newX, y: newY },
          ],
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
      const dx =
        gestureMoveLocation.pageX / zoomFactor - manipulationStartPosition.x;
      const dy =
        gestureMoveLocation.pageY / zoomFactor - manipulationStartPosition.y;

      const isMovedFromLastPoint =
        marker.points &&
        marker.points.length === 3 &&
        (marker.points[2]!.x !== marker.points[0]!.x + dx ||
          marker.points[2]!.y !== marker.points[0]!.y + dy);
      if (isMovedFromLastPoint) {
        const updatedMarker: PolygonMarkerState = {
          ...marker,
          points: [
            { x: marker.points[0]!.x, y: marker.points[0]!.y },
            { x: marker.points[0]!.x, y: marker.points[0]!.y + dy },
            { x: marker.points[0]!.x + dx, y: marker.points[0]!.y + dy },
          ],
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
      // what is this for?
      const sanitizedMarker: PolygonMarkerState = {
        ...marker,
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
            {/* Lines for adding points */}
            {marker.points.map((point, index) => {
              const point2 =
                index < marker.points.length - 1
                  ? marker.points[index + 1]
                  : marker.points[0];
              return point2 ? (
                <Line
                  key={`line-${index}`}
                  x1={point.x}
                  y1={point.y}
                  x2={point2.x}
                  y2={point2.y}
                  stroke="transparent"
                  strokeWidth={10 / zoomFactor}
                  onLongPress={(ev) => handleLineLongPress(ev, index)}
                />
              ) : null;
            })}
            {/* Grips for resizing and removing points */}
            {marker.points.map((point, index) => (
              <Grip
                key={`grip-${index}`}
                x={point.x}
                y={point.y}
                zoomFactor={zoomFactor}
                onStartShouldSetResponder={() => {
                  return true;
                }}
                onResponderGrant={(ev) => handleGripResponderGrant(ev, index)}
                onResponderMove={(ev) => handleGripResponderMove(ev, index)}
                onResponderRelease={handleGripResponderRelease}
                onResponderTerminate={handleGripResponderRelease}
              />
            ))}
          </G>
        )}
      </MarkerComponent>
    </MarkerBaseEditor>
  );
};

export default PolygonMarkerEditor;
