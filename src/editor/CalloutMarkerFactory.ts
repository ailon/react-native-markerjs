import type { CalloutMarkerState } from '../core/CalloutMarkerState';
import { TextMarkerFactory } from './TextMarkerFactory';

export class CalloutMarkerFactory extends TextMarkerFactory {
  public static typeName = 'CalloutMarker';

  public static override createMarker(): CalloutMarkerState {
    return {
      ...super.createMarker(),
      tipPosition: { x: 0, y: 0 },
      color: '#ffffff',
      fillColor: '#ff0000',
      strokeColor: '#ffffff',
      strokeWidth: 3,
      padding: 20,
    };
  }
}
