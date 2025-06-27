import type { LayoutRectangle } from 'react-native';
import type { TextMarkerState } from '../../core/TextMarkerState';
import type { MarkerBaseEditorProps } from './MarkerBaseEditor';
import RectangularBoxMarkerBaseEditor from './RectangularBoxMarkerBaseEditor';

interface TextMarkerEditorProps extends MarkerBaseEditorProps {
  marker: TextMarkerState;
}

const TextMarkerEditor: React.FC<TextMarkerEditorProps> = ({
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
  const handleMarkerLayout = (layout: LayoutRectangle) => {
    if (
      onMarkerChange &&
      (Math.abs(layout.width - marker.width) > 1 ||
        Math.abs(layout.height - marker.height) > 1)
    ) {
      console.log('TextMarkerEditor handleMarkerLayout', layout);
      const updatedMarker: TextMarkerState = {
        ...marker,
        width: layout.width,
        height: layout.height,
      };
      onMarkerChange(updatedMarker);
    }
  };
  return (
    <RectangularBoxMarkerBaseEditor
      isResizable={false}
      marker={marker}
      mode={mode}
      selected={selected}
      gestureStartLocation={gestureStartLocation}
      gestureMoveLocation={gestureMoveLocation}
      zoomFactor={zoomFactor}
      scaleStroke={scaleStroke}
      disableInteraction={disableInteraction}
      onSelect={onSelect}
      onMarkerChange={onMarkerChange}
      onMarkerCreate={onMarkerCreate}
      onMarkerLayout={handleMarkerLayout}
    />
  );
};

export default TextMarkerEditor;
