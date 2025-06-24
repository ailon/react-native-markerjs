import {
  type MarkerBaseState,
  type AnnotationState,
} from '@markerjs/react-native-markerjs';

export const testState: AnnotationState = {
  width: 427,
  height: 320,
  markers: [
    {
      typeName: 'FrameMarker',
      left: 50,
      top: 50,
      width: 200,
      height: 200,
      strokeColor: 'blue',
      strokeWidth: 2,
      strokeDasharray: '5,5',
      rotationAngle: 0,
    } as MarkerBaseState,
    {
      typeName: 'FrameMarker',
      left: 250,
      top: 80,
      width: 50,
      height: 50,
      strokeColor: 'red',
      strokeWidth: 2,
      rotationAngle: 45,
    } as MarkerBaseState,
    {
      typeName: 'LineMarker',
      x1: 100,
      y1: 100,
      x2: 300,
      y2: 200,
      strokeColor: 'green',
      strokeWidth: 3,
      rotationAngle: 45,
    } as MarkerBaseState,
  ],
};
