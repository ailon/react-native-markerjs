import type { ShapeMarkerBaseState } from '../core/ShapeMarkerBaseState';
import { ShapeOutlineMarkerBaseFactory } from './ShapeOutlineMarkerBaseFactory';

export class ShapeMarkerBaseFactory extends ShapeOutlineMarkerBaseFactory {
  public static typeName = 'ShapeMarkerBase';
  public static override createMarker(): ShapeMarkerBaseState {
    return {
      ...super.createMarker(),
      fillColor: 'red',
    };
  }
}
