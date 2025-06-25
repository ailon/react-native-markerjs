import type { AnnotationState } from '../core/AnnotationState';
import { markerIdSymbol, type MarkerBaseState } from '../core/MarkerBaseState';

export const createNewAnnotationState = (
  width: number,
  height: number
): AnnotationState => {
  return {
    version: 3,
    width,
    height,
    markers: [],
  };
};

export const addMarkerToAnnotation = (
  annotation: AnnotationState,
  newMarker: MarkerBaseState
): AnnotationState => {
  return {
    ...annotation,
    markers: [...annotation.markers, newMarker],
  };
};

export const updateMarkerInAnnotation = (
  annotation: AnnotationState,
  updatedMarker: MarkerBaseState
): AnnotationState => {
  const updatedAnnotation = {
    ...annotation,
    markers: annotation.markers.map((mark) =>
      mark[markerIdSymbol] === updatedMarker[markerIdSymbol]
        ? { ...mark, ...updatedMarker }
        : mark
    ),
  };
  return updatedAnnotation;
};
