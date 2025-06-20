import type { ShapeOutlineMarkerBaseState } from '../core/ShapeOutlineMarkerBaseState';
import { ShapeOutlineMarkerBaseFactory } from './ShapeOutlineMarkerBaseFactory';

export class FrameMarkerFactory extends ShapeOutlineMarkerBaseFactory {
  public static override createMarker(): ShapeOutlineMarkerBaseState {
    return {
      ...super.createMarker(),
      typeName: 'FrameMarker',
    };
  }
}
