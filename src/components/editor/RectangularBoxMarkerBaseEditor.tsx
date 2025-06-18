import React, { useEffect, useRef } from 'react';
import { G, Line, Rect } from 'react-native-svg';
import type { RectangularBoxMarkerBaseState } from '../../core/RectangularBoxMarkerBaseState';
import FrameMarker from '../core/FrameMarker';
import Grip from './Grip';
import MarkerBaseEditor, {
  type MarkerBaseEditorProps,
} from './MarkerBaseEditor';
import { PanResponder } from 'react-native';
import { markerIdSymbol } from '../../core/MarkerBaseState';

interface RectangularBoxMarkerBaseEditorProps extends MarkerBaseEditorProps {
  marker: RectangularBoxMarkerBaseState;
}

const RectangularBoxMarkerBaseEditor: React.FC<
  RectangularBoxMarkerBaseEditorProps
> = ({ marker, selected, onSelect, onMarkerChange }) => {
  const rotatorOffset = -30;

  console.log(`Marker ${marker[markerIdSymbol]} left position: ${marker.left}`);

  const manipulationStartX = useRef(0);
  const manipulationStartY = useRef(0);
  const isGestureActive = useRef(false);

  // Keep a reference to the current marker to avoid stale closures
  const markerRef = useRef(marker);

  // Update marker ref whenever the marker prop changes
  useEffect(() => {
    markerRef.current = marker;
  }, [marker]);

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started
        const currentMarker = markerRef.current;
        console.log(
          `Gesture started: marker: ${currentMarker.left}, ${currentMarker.top}`
        );

        // Store the current position when gesture starts
        manipulationStartX.current = currentMarker.left;
        manipulationStartY.current = currentMarker.top;
        isGestureActive.current = true;

        onSelect?.(currentMarker);
      },

      onPanResponderMove: (evt, gestureState) => {
        if (!isGestureActive.current) return;

        const currentMarker = markerRef.current;
        console.log(`Gesture moved: ${gestureState.dx}, ${gestureState.dy}`);

        const movedMarker: RectangularBoxMarkerBaseState = {
          ...currentMarker,
          left: manipulationStartX.current + gestureState.dx,
          top: manipulationStartY.current + gestureState.dy,
        };

        if (onMarkerChange) {
          onMarkerChange(movedMarker);
        }
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches
        if (!isGestureActive.current) return;

        const currentMarker = markerRef.current;
        const newLeft = manipulationStartX.current + gestureState.dx;
        const newTop = manipulationStartY.current + gestureState.dy;

        console.log(
          `Gesture released: ${gestureState.dx}, ${gestureState.dy}, marker left: ${newLeft}`
        );

        // Update our refs to the final position for the next gesture
        manipulationStartX.current = newLeft;
        manipulationStartY.current = newTop;

        const movedMarker: RectangularBoxMarkerBaseState = {
          ...currentMarker,
          left: newLeft,
          top: newTop,
        };

        if (onMarkerChange) {
          onMarkerChange(movedMarker);
        }

        isGestureActive.current = false;
        console.log(`gesture state:`, gestureState);
      },

      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder
        isGestureActive.current = false;
      },

      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  return (
    <MarkerBaseEditor
      marker={marker}
      onSelect={onSelect}
      {...panResponder.panHandlers}
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
