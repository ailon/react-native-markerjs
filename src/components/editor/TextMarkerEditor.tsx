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
  return (
    <RectangularBoxMarkerBaseEditor
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
    />
  );
};

export default TextMarkerEditor;
