import type { ShapeOutlineMarkerBaseState } from '../core/ShapeOutlineMarkerBaseState';
import { MarkerBaseFactory } from './MarkerBaseFactory';

export class ShapeOutlineMarkerBaseFactory extends MarkerBaseFactory {
  public static override createMarker(): ShapeOutlineMarkerBaseState {
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
