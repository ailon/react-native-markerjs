import { markerIdSymbol, type MarkerBaseState } from './MarkerBaseState';
import { generateMarkerId } from './markerIdGenerator';

export class MarkerBaseFactory {
  public static createMarker(): MarkerBaseState {
    return {
      typeName: 'MarkerBase',
      strokeColor: 'red',
      strokeWidth: 3,
      strokeDasharray: '',
      opacity: 1,
      [markerIdSymbol]: generateMarkerId(),
    };
  }
}
