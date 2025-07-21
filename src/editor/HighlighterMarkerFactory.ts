import type { FreehandMarkerState } from '../core/FreehandMarkerState';
import { FreehandMarkerFactory } from './FreehandMarkerFactory';

export class HighlighterMarkerFactory extends FreehandMarkerFactory {
  public static typeName = 'HighlighterMarker';
  public static override createMarker(): FreehandMarkerState {
    return {
      ...super.createMarker(),
      strokeColor: '#ffff00',
      strokeWidth: 20,
      opacity: 0.5,
    };
  }
}
