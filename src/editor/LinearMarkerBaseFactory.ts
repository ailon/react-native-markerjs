import type { LinearMarkerBaseState } from '../core/LinearMarkerBaseState';
import { MarkerBaseFactory } from './MarkerBaseFactory';

export class LinearMarkerBaseFactory extends MarkerBaseFactory {
  public static typeName = 'LinearMarkerBase';
  public static override createMarker(): LinearMarkerBaseState {
    return {
      ...super.createMarker(),
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    };
  }
}
