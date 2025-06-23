import React from 'react';
import type { MarkerBaseState } from '../../core/MarkerBaseState';
import { G } from 'react-native-svg';
import type { ViewProps } from 'react-native';
import type { GestureLocation } from '../../editor/GestureLocation';

export type EditorMode = 'create' | 'finishCreation' | 'select';

interface MarkerBaseEditorProps extends ViewProps {
  marker: MarkerBaseState;
  mode?: EditorMode;
  selected?: boolean;
  children?: React.ReactNode;
  gestureStartLocation?: GestureLocation;
  gestureMoveLocation?: GestureLocation;
  zoomFactor?: number;
  onMarkerChange?: (marker: MarkerBaseState) => void;
  onMarkerCreate?: (marker: MarkerBaseState) => void;
  onSelect?: (marker: MarkerBaseState) => void;
}

const MarkerBaseEditor: React.FC<MarkerBaseEditorProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  marker,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mode = 'select',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  zoomFactor = 1,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelect,
  ...props
}: MarkerBaseEditorProps) => {
  return (
    <G onStartShouldSetResponder={() => true} {...props}>
      {children}
    </G>
  );
};

export default MarkerBaseEditor;
export type { MarkerBaseEditorProps };
