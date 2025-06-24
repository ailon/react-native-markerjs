import type { LinearMarkerBaseState } from '../core/LinearMarkerBaseState';
import { LinearMarkerBaseFactory } from './LinearMarkerBaseFactory';

export class LineMarkerFactory extends LinearMarkerBaseFactory {
  public static override createMarker(): LinearMarkerBaseState {
    return {
      ...super.createMarker(),
      typeName: 'LineMarker',
    };
  }
}
