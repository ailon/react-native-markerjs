import { MarkerBaseFactory } from './MarkerBaseFactory';
import type { ShapeOutlineMarkerBaseState } from '../core/ShapeOutlineMarkerBaseState';

export class FrameMarkerFactory extends MarkerBaseFactory {
  public static override createMarker(): ShapeOutlineMarkerBaseState {
    return {
      ...super.createMarker(),
      typeName: 'FrameMarker',
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      strokeDasharray: '',
      rotationAngle: 0,
    };
  }
}
