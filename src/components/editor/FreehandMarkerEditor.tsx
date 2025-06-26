import React, { useEffect, useState } from 'react';
import { G, Rect } from 'react-native-svg';
import MarkerBaseEditor, {
  type MarkerBaseEditorProps,
} from './MarkerBaseEditor';
import { type GestureResponderEvent } from 'react-native';
import type { GestureLocation } from '../../editor/GestureLocation';
import { markerComponentMap } from '../core/markerComponentMap';
import type { FreehandMarkerState } from '../../core/FreehandMarkerState';

interface FreehandMarkerEditorProps extends MarkerBaseEditorProps {
  marker: FreehandMarkerState;
}

const FreehandMarkerEditor: React.FC<FreehandMarkerEditorProps> = ({
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

  const handleResponderGrant = (ev: GestureResponderEvent) => {
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
    const dx = ev.nativeEvent.pageX / zoomFactor - manipulationStartPosition.x;
    const dy = ev.nativeEvent.pageY / zoomFactor - manipulationStartPosition.y;

    if (onMarkerChange) {
      const updatedMarker: FreehandMarkerState = {
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
  const handleResponderRelease = () => {
    const updatedMarker: FreehandMarkerState = {
      ...marker,
    };
    setMarkerStartPosition([...updatedMarker.points]);
    setManipulationStartPosition({ x: 0, y: 0 });
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
        const updatedMarker: FreehandMarkerState = {
          ...marker,
          points: [{ x: newX, y: newY }],
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
        marker.points.length > 0 &&
        marker.points[0] &&
        (marker.points[marker.points.length - 1]?.x !==
          marker.points[0].x + dx ||
          marker.points[marker.points.length - 1]?.y !==
            marker.points[0].y + dy);
      if (isMovedFromLastPoint) {
        const updatedMarker: FreehandMarkerState = {
          ...marker,
          points: marker.points[0]
            ? [
                ...marker.points,
                { x: marker.points[0].x + dx, y: marker.points[0].y + dy },
              ]
            : [],
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
      const sanitizedMarker: FreehandMarkerState = {
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

  const minX = Math.min(...marker.points.map((p) => p.x));
  const minY = Math.min(...marker.points.map((p) => p.y));
  const maxX = Math.max(...marker.points.map((p) => p.x));
  const maxY = Math.max(...marker.points.map((p) => p.y));

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
              x={minX}
              y={minY}
              width={maxX - minX}
              height={maxY - minY}
              fill="transparent"
              stroke="black"
              strokeWidth={0.5 / zoomFactor}
              strokeDasharray="3, 2"
            />
          </G>
        )}
      </MarkerComponent>
    </MarkerBaseEditor>
  );
};

export default FreehandMarkerEditor;
