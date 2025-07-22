import type { IPoint } from './IPoint';
import type { ShapeMarkerBaseState } from './ShapeMarkerBaseState';
import type { TextMarkerState } from './TextMarkerState';

/**
 * Represents the state of a callout marker.
 */
export interface CalloutMarkerState
  extends TextMarkerState,
    ShapeMarkerBaseState {
  /**
   * Coordinates of the position of the tip of the callout.
   */
  tipPosition: IPoint;
}
