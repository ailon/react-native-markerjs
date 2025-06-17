import React from 'react';
import type { MarkerBaseState } from '../../core/MarkerBaseState';
import { G } from 'react-native-svg';

interface MarkerBaseEditorProps {
  marker: MarkerBaseState;
  selected?: boolean;
  children?: React.ReactNode;
  onSelect?: (marker: MarkerBaseState) => void;
}

const MarkerBaseEditor: React.FC<MarkerBaseEditorProps> = ({
  marker,
  children,
  onSelect,
}: MarkerBaseEditorProps) => {
  return (
    <G
      onStartShouldSetResponder={() => true}
      onResponderGrant={() => onSelect?.(marker)}
    >
      {children}
    </G>
  );
};

export default MarkerBaseEditor;
export type { MarkerBaseEditorProps };
