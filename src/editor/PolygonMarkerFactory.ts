import type { PolygonMarkerState } from '../core/PolygonMarkerState';
import { MarkerBaseFactory } from './MarkerBaseFactory';

export class PolygonMarkerFactory extends MarkerBaseFactory {
  public static typeName = 'PolygonMarker';
  public static override createMarker(): PolygonMarkerState {
    return {
      ...super.createMarker(),
      points: [],
    };
  }
}
