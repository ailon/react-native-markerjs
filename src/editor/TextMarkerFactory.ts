import type { TextMarkerState } from '../core/TextMarkerState';
import { RectangularBoxMarkerBaseFactory } from './RectangularBoxMarkerBaseFactory';

export class TextMarkerFactory extends RectangularBoxMarkerBaseFactory {
  public static typeName = 'TextMarker';

  public static override createMarker(): TextMarkerState {
    return {
      ...super.createMarker(),
      text: 'Text',
      fontSize: { value: 12, units: 'px', step: 1 },
      fontFamily: 'Helvetica, Arial, sans-serif',
      color: 'red',
    };
  }
}
