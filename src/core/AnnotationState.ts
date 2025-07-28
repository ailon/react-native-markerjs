import type { MarkerBaseState } from './MarkerBaseState';

/**
 * Represents the state of the annotation.
 *
 * The state is used to store and pass around the annotation data.
 * Set it as the `annotation` prop of the {@link MarkerArea} and {@link MarkerView} components.
 */
export interface AnnotationState {
  /**
   * Version of the annotation state format.
   *
   * Equals to 3 for the current version.
   */
  version?: number;

  /**
   * Width of the annotation.
   */
  width: number;
  /**
   * Height of the annotation.
   */
  height: number;

  /**
   * Default SVG filter to apply to markers in the annotation.
   * (e.g. drop shadow, outline, glow)
   */
  defaultFilter?: string;

  /**
   * Array of marker states for markers in the annotation.
   */
  markers: MarkerBaseState[];
}
