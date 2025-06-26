import { type IPoint } from './IPoint';
import { type MarkerBaseState } from './MarkerBaseState';

/**
 * Represents polygon marker's state used to save and restore state.
 */
export interface PolygonMarkerState extends MarkerBaseState {
  /**
   * Polygon points.
   */
  points: Array<IPoint>;
  /**
   * Marker's fill color.
   */
  fillColor?: string;
}
