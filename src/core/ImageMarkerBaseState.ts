import { type RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';

/**
 * The type of image (svg or bitmap).
 */
export type ImageType = 'svg' | 'bitmap';

/**
 * Represents image marker's state.
 */
export interface ImageMarkerBaseState extends RectangularBoxMarkerBaseState {
  /**
   * Type of the image: SVG or bitmap.
   */
  imageType?: ImageType;
  /**
   * SVG markup of the SVG image.
   */
  svgString?: string;
  /**
   * Image source (URL or base64 encoded image).
   */
  imageSrc?: string;
}
