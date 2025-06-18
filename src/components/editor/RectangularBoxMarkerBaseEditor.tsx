import React, { useRef, useState } from 'react';
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

  const [manipulationStartX, setManipulationStartX] = useState(marker.left);
  const [manipulationStartY, setManipulationStartY] = useState(marker.top);

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        setManipulationStartX(marker.left);
        setManipulationStartY(marker.top);
        onSelect?.(marker);
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        console.log(`Gesture moved: ${gestureState.dx}, ${gestureState.dy}`);
        const movedMarker: RectangularBoxMarkerBaseState = {
          ...marker,
          left: manipulationStartX + gestureState.dx,
          top: manipulationStartY + gestureState.dy,
        };
        if (onMarkerChange) {
          onMarkerChange(movedMarker);
        }
      },
      onPanResponderTerminationRequest: () => true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        // const movedMarker: RectangularBoxMarkerBaseState = {
        //   ...marker,
        //   left: manipulationStartX + gestureState.dx,
        //   top: manipulationStartY + gestureState.dy,
        // };
        // console.log(
        //   `Gesture released: ${gestureState.dx}, ${gestureState.dy}, marker left: ${movedMarker.left}`
        // );
        // setManipulationStartX(movedMarker.left);
        // setManipulationStartY(movedMarker.top);
        // if (onMarkerChange) {
        //   onMarkerChange(movedMarker);
        // }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: () => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
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
