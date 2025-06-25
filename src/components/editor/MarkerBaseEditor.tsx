/* eslint-disable @typescript-eslint/no-unused-vars */
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
  scaleStroke?: boolean;
  disableInteraction?: boolean;
  onMarkerChange?: (marker: MarkerBaseState) => void;
  onMarkerCreate?: (marker: MarkerBaseState) => void;
  onSelect?: (marker: MarkerBaseState) => void;
}

const MarkerBaseEditor: React.FC<MarkerBaseEditorProps> = ({
  marker,
  mode = 'select',
  zoomFactor = 1,
  scaleStroke = true,
  disableInteraction = false,
  children,
  onSelect,
  ...props
}: MarkerBaseEditorProps) => {
  return (
    <G onStartShouldSetResponder={() => !disableInteraction} {...props}>
      {children}
    </G>
  );
};

export default MarkerBaseEditor;
export type { MarkerBaseEditorProps };
