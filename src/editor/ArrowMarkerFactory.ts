import type { ArrowMarkerState } from '../core/ArrowMarkerState';
import { LinearMarkerBaseFactory } from './LinearMarkerBaseFactory';

export class ArrowMarkerFactory extends LinearMarkerBaseFactory {
  public static typeName = 'ArrowMarker';

  public static override createMarker(): ArrowMarkerState {
    return {
      ...super.createMarker(),
      arrowType: 'end',
    };
  }
}
