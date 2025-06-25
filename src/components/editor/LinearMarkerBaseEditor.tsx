import React, { useEffect, useState } from 'react';
import { G } from 'react-native-svg';
import type { LinearMarkerBaseState } from '../../core/LinearMarkerBaseState';
import Grip from './Grip';
import MarkerBaseEditor, {
  type MarkerBaseEditorProps,
} from './MarkerBaseEditor';
import { type GestureResponderEvent } from 'react-native';
import type { GestureLocation } from '../../editor/GestureLocation';
import { markerComponentMap } from '../core/markerComponentMap';

interface LinearMarkerBaseEditorProps extends MarkerBaseEditorProps {
  marker: LinearMarkerBaseState;
}

type ManipulationMode = 'move' | 'resize';
type GripLocation = 'start' | 'end';

const LinearMarkerBaseEditor: React.FC<LinearMarkerBaseEditorProps> = ({
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
  // what type of manipulation is currently active
  const [manipulationMode, setManipulationMode] =
    useState<ManipulationMode>('move');
  const [activeGrip, setActiveGrip] = useState<GripLocation | null>(null);

  // Initial positions and sizes for the marker
  // These are used to calculate the changes during manipulation
  const [markerStartPosition, setMarkerStartPosition] = useState({
    x1: marker.x1,
    y1: marker.y1,
    x2: marker.x2,
    y2: marker.y2,
  });

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
      const updatedMarker: LinearMarkerBaseState = {
        ...marker,
      };

      switch (manipulationMode) {
        case 'resize':
          switch (activeGrip) {
            case 'start':
              updatedMarker.x1 = markerStartPosition.x1 + dx;
              updatedMarker.y1 = markerStartPosition.y1 + dy;
              break;
            case 'end':
              updatedMarker.x2 = markerStartPosition.x2 + dx;
              updatedMarker.y2 = markerStartPosition.y2 + dy;
              break;
          }
          break;
        case 'move':
          updatedMarker.x1 = markerStartPosition.x1 + dx;
          updatedMarker.y1 = markerStartPosition.y1 + dy;
          updatedMarker.x2 = markerStartPosition.x2 + dx;
          updatedMarker.y2 = markerStartPosition.y2 + dy;
          break;
      }
      onMarkerChange(updatedMarker);
    }
  };
  const handleResponderRelease = () => {
    setManipulationMode('move');

    const updatedMarker: LinearMarkerBaseState = {
      ...marker,
    };
    setMarkerStartPosition({
      x1: updatedMarker.x1,
      y1: updatedMarker.y1,
      x2: updatedMarker.x2,
      y2: updatedMarker.y2,
    });
    setManipulationStartPosition({ x: 0, y: 0 });
    onMarkerChange?.(updatedMarker);
  };

  // handle start of the creation of a new marker
  useEffect(() => {
    if (gestureStartLocation) {
      startManipulation(gestureStartLocation);
      // Only update if the gestureStartLocation is different from marker's current position
      const newX1 = gestureStartLocation.locationX / zoomFactor;
      const newY1 = gestureStartLocation.locationY / zoomFactor;
      if (marker.x1 !== newX1 || marker.y1 !== newY1) {
        const updatedMarker: LinearMarkerBaseState = {
          ...marker,
          x1: newX1,
          y1: newY1,
          x2: newX1,
          y2: newY1,
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
      if (marker.x2 !== marker.x1 + dx || marker.y2 !== marker.y1 + dy) {
        const updatedMarker: LinearMarkerBaseState = {
          ...marker,
          x2: marker.x1 + dx,
          y2: marker.y1 + dy,
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
      const sanitizedMarker: LinearMarkerBaseState = {
        ...marker,
        x2: marker.x2,
        y2: marker.y2,
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
            {/* grips */}
            <Grip
              x={marker.x1}
              y={marker.y1}
              zoomFactor={zoomFactor}
              onStartShouldSetResponder={() => {
                setManipulationMode('resize');
                setActiveGrip('start');
                return true;
              }}
              onResponderGrant={handleResponderGrant}
              onResponderMove={handleResponderMove}
              onResponderRelease={handleResponderRelease}
              onResponderTerminate={handleResponderRelease}
            />
            <Grip
              x={marker.x2}
              y={marker.y2}
              zoomFactor={zoomFactor}
              onStartShouldSetResponder={() => {
                setManipulationMode('resize');
                setActiveGrip('end');
                return true;
              }}
              onResponderGrant={handleResponderGrant}
              onResponderMove={handleResponderMove}
              onResponderRelease={handleResponderRelease}
              onResponderTerminate={handleResponderRelease}
            />
          </G>
        )}
      </MarkerComponent>
    </MarkerBaseEditor>
  );
};

export default LinearMarkerBaseEditor;
