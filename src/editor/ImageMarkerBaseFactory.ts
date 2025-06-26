import type { ImageMarkerBaseState } from '../core/ImageMarkerBaseState';
import { MarkerBaseFactory } from './MarkerBaseFactory';

export class ImageMarkerBaseFactory extends MarkerBaseFactory {
  public static typeName = 'ImageMarkerBase';
  public static override createMarker(
    params?: Partial<ImageMarkerBaseState>
  ): ImageMarkerBaseState {
    return {
      ...super.createMarker(),
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      strokeDasharray: '',
      rotationAngle: 0,
      ...params,
    };
  }
}
