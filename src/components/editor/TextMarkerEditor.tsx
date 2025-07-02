import {
  Button,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import type { TextMarkerState } from '../../core/TextMarkerState';
import type { MarkerBaseEditorProps } from './MarkerBaseEditor';
import RectangularBoxMarkerBaseEditor from './RectangularBoxMarkerBaseEditor';
import { useState } from 'react';

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
  const [editorVisible, setEditorVisible] = useState(false);

  const handleTextChange = (text: string) => {
    const updatedMarker = {
      ...marker,
      text,
    };
    onMarkerChange?.(updatedMarker);
  };

  return (
    <>
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
        onLongPress={() => {
          setEditorVisible(true);
          console.log('Long press on TextMarkerEditor');
        }}
      />
      <Modal
        visible={editorVisible}
        onRequestClose={() => setEditorVisible(false)}
      >
        <SafeAreaView style={styles.textEditor}>
          <TextInput
            value={marker.text}
            multiline={true}
            onChangeText={handleTextChange}
          />
          <Button title="Done" onPress={() => setEditorVisible(false)} />
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default TextMarkerEditor;

const styles = StyleSheet.create({
  textEditor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
