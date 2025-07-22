import type { GestureResponderEvent } from 'react-native';
import type { CalloutMarkerState } from '../../core/CalloutMarkerState';
import type { MarkerBaseState } from '../../core/MarkerBaseState';
import Grip from './Grip';
import type { MarkerBaseEditorProps } from './MarkerBaseEditor';
import TextMarkerEditor from './TextMarkerEditor';
import { useState } from 'react';

interface CalloutMarkerEditorProps extends MarkerBaseEditorProps {
  marker: CalloutMarkerState;
}

const CalloutMarkerEditor: React.FC<CalloutMarkerEditorProps> = ({
  marker,
  onMarkerCreate,
  ...props
}: CalloutMarkerEditorProps) => {
  const {
    selected,
    disableInteraction,
    onMarkerChange,
    scaleStroke = true,
    zoomFactor = 1,
  } = props;

  const [manipulationStartPosition, setManipulationStartPosition] = useState({
    x: 0,
    y: 0,
  });
  const [manipulationStartTipPosition, setManipulationStartTipPosition] =
    useState({
      x: marker.tipPosition.x,
      y: marker.tipPosition.y,
    });

  const handleMarkerCreate = (newMarker: MarkerBaseState) => {
    const newCalloutMarker = newMarker as CalloutMarkerState;
    const defaultTipPosition = {
      x: newCalloutMarker.width / 4,
      y: newCalloutMarker.height + 20 / (scaleStroke ? zoomFactor : 1),
    };
    onMarkerCreate?.({
      ...newCalloutMarker,
      tipPosition: defaultTipPosition,
    } as MarkerBaseState);
  };

  const handleResponderGrant = (ev: GestureResponderEvent) => {
    setManipulationStartPosition({
      x: ev.nativeEvent.pageX / zoomFactor,
      y: ev.nativeEvent.pageY / zoomFactor,
    });
    setManipulationStartTipPosition({
      x: marker.tipPosition.x,
      y: marker.tipPosition.y,
    });
  };

  const handleResponderMove = (ev: GestureResponderEvent) => {
    // Get absolute movement in screen coordinates
    const dx = ev.nativeEvent.pageX / zoomFactor - manipulationStartPosition.x;
    const dy = ev.nativeEvent.pageY / zoomFactor - manipulationStartPosition.y;

    // Convert rotation to radians
    const angle = ((marker.rotationAngle || 0) * Math.PI) / 180;

    // Transform the movement according to rotation
    const rotatedDx = dx * Math.cos(angle) + dy * Math.sin(angle);
    const rotatedDy = -dx * Math.sin(angle) + dy * Math.cos(angle);

    // Update the tip position based on the movement
    const newTipPosition = {
      x: manipulationStartTipPosition.x + rotatedDx,
      y: manipulationStartTipPosition.y + rotatedDy,
    };
    const updatedMarker: CalloutMarkerState = {
      ...marker,
      tipPosition: newTipPosition,
    };
    onMarkerChange?.(updatedMarker);
  };

  return (
    <TextMarkerEditor
      marker={marker}
      onMarkerCreate={handleMarkerCreate}
      {...props}
    >
      {selected && !disableInteraction && (
        <Grip
          x={marker.tipPosition.x}
          y={marker.tipPosition.y}
          zoomFactor={zoomFactor}
          onStartShouldSetResponder={() => {
            //setManipulationMode('resize');
            return true;
          }}
          onResponderGrant={handleResponderGrant}
          onResponderMove={handleResponderMove}
        />
      )}
    </TextMarkerEditor>
  );
};

export default CalloutMarkerEditor;
