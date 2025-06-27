import { type MarkerBaseState } from '../../core/MarkerBaseState';
import React from 'react';
import type { LayoutRectangle } from 'react-native';
import { G } from 'react-native-svg';

interface MarkerBaseProps extends MarkerBaseState {
  zoomFactor?: number;
  scaleStroke?: boolean;
  children?: React.ReactNode;
  onLayout?: (layout: LayoutRectangle) => void;
}

const MarkerBase: React.FC<MarkerBaseProps> = ({
  children,
}: MarkerBaseProps) => {
  return <G>{children}</G>;
};

export default MarkerBase;
export type { MarkerBaseProps };
