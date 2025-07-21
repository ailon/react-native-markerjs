import type { ShapeMarkerBaseState } from '../core/ShapeMarkerBaseState';
import { ShapeMarkerBaseFactory } from './ShapeMarkerBaseFactory';

export class EllipseMarkerFactory extends ShapeMarkerBaseFactory {
  public static typeName = 'EllipseMarker';
  public static override createMarker(): ShapeMarkerBaseState {
    return {
      ...super.createMarker(),
      strokeColor: '#ff0000',
      strokeWidth: 1,
      fillColor: '#ff0000',
    };
  }
}
