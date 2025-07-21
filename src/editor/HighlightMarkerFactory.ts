import type { ShapeMarkerBaseState } from '../core/ShapeMarkerBaseState';
import { ShapeMarkerBaseFactory } from './ShapeMarkerBaseFactory';

export class HighlightMarkerFactory extends ShapeMarkerBaseFactory {
  public static typeName = 'HighlightMarker';
  public static override createMarker(): ShapeMarkerBaseState {
    return {
      ...super.createMarker(),
      strokeColor: 'transparent',
      strokeWidth: 0,
      fillColor: '#ffff00',
      opacity: 0.5,
    };
  }
}
