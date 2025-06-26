import type { FreehandMarkerState } from '../core/FreehandMarkerState';
import { MarkerBaseFactory } from './MarkerBaseFactory';

export class FreehandMarkerFactory extends MarkerBaseFactory {
  public static typeName = 'FreehandMarker';
  public static override createMarker(): FreehandMarkerState {
    return {
      ...super.createMarker(),
      points: [],
    };
  }
}
