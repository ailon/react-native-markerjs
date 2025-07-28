import MarkerArea, {
  type MarkerAreaHandle,
  type MarkerAreaProps,
} from './components/MarkerArea';
import MarkerView, {
  type MarkerViewHandle,
  type MarkerViewProps,
} from './components/MarkerView';

export {
  MarkerArea,
  type MarkerAreaHandle,
  type MarkerAreaProps,
  MarkerView,
  type MarkerViewHandle,
  type MarkerViewProps,
};

export { Activator } from './core/Activator';

export type { AnnotationState } from './core/AnnotationState';
export { markerIdSymbol, type MarkerBaseState } from './core/MarkerBaseState';
export type { RectangularBoxMarkerBaseState } from './core/RectangularBoxMarkerBaseState';
export type { ShapeOutlineMarkerBaseState } from './core/ShapeOutlineMarkerBaseState';
export type { LinearMarkerBaseState } from './core/LinearMarkerBaseState';
export type { FreehandMarkerState } from './core/FreehandMarkerState';
export type { ImageMarkerBaseState } from './core/ImageMarkerBaseState';
export type { PolygonMarkerState } from './core/PolygonMarkerState';
export type { TextMarkerState } from './core/TextMarkerState';
export type { ArrowMarkerState, ArrowType } from './core/ArrowMarkerState';

export {
  AnnotationProvider,
  useAnnotationContext,
} from './contexts/AnnotationContext';

// state helpers
export {
  createNewAnnotationState,
  addMarkerToAnnotation,
  updateMarkerInAnnotation,
} from './utils/stateHelpers';
