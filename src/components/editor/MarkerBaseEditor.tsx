import React from 'react';
import type { MarkerBaseState } from '../../core/MarkerBaseState';
import { G } from 'react-native-svg';
import type { ViewProps } from 'react-native';

interface MarkerBaseEditorProps extends ViewProps {
  marker: MarkerBaseState;
  selected?: boolean;
  children?: React.ReactNode;
  onMarkerChange?: (marker: MarkerBaseState) => void;
  onSelect?: (marker: MarkerBaseState) => void;
}

const MarkerBaseEditor: React.FC<MarkerBaseEditorProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  marker,
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
