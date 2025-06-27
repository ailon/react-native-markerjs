import type { RectangularBoxMarkerBaseState } from '../core/RectangularBoxMarkerBaseState';
import { MarkerBaseFactory } from './MarkerBaseFactory';

export class RectangularBoxMarkerBaseFactory extends MarkerBaseFactory {
  public static typeName = 'RectangularBoxMarkerBase';
  public static override createMarker(): RectangularBoxMarkerBaseState {
    return {
      ...super.createMarker(),
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      strokeDasharray: '',
      rotationAngle: 0,
    };
  }
}
