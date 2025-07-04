import type { ShapeMarkerBaseState } from '../core/ShapeMarkerBaseState';
import { ShapeMarkerBaseFactory } from './ShapeMarkerBaseFactory';

export class CoverMarkerFactory extends ShapeMarkerBaseFactory {
  public static typeName = 'CoverMarker';
  public static override createMarker(): ShapeMarkerBaseState {
    return {
      ...super.createMarker(),
      strokeColor: 'black',
      strokeWidth: 1,
      fillColor: 'black',
    };
  }
}
