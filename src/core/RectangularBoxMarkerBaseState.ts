import type { MarkerBaseState } from '../core/MarkerBaseState';
import type { ITransformMatrix } from './TransformMatrix';

/**
 * Represents a state snapshot of a RectangularBoxMarkerBase.
 */
export interface RectangularBoxMarkerBaseState extends MarkerBaseState {
  /**
   * x coordinate of the top-left corner.
   */
  left: number;
  /**
   * y coordinate of the top-left corner.
   */
  top: number;
  /**
   * Marker's width.
   */
  width: number;
  /**
   * Marker's height.
   */
  height: number;
  /**
   * Marker's rotation angle.
   */
  rotationAngle: number;

  /**
   * Visual transform matrix.
   *
   * Used to correctly position and rotate marker.
   *
   * @remarks
   * Currently it isn't used in the React Native version but is included for compatibility with the web version.
   */
  visualTransformMatrix?: ITransformMatrix;
  /**
   * Container transform matrix.
   *
   * Used to correctly position and rotate marker.
   *
   * @remarks
   * Currently it isn't used in the React Native version but is included for compatibility with the web version.
   */
  containerTransformMatrix?: ITransformMatrix;
}
