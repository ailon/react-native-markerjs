import { markerIdSymbol, type MarkerBaseState } from '../core/MarkerBaseState';
import { generateMarkerId } from './markerIdGenerator';

export class MarkerBaseFactory {
  public static typeName = 'MarkerBase';

  public static createMarker<T>(
    params?: Partial<T extends MarkerBaseState ? T : MarkerBaseState>
  ): MarkerBaseState {
    return {
      typeName: this.typeName,
      strokeColor: 'red',
      strokeWidth: 3,
      strokeDasharray: '',
      opacity: 1,
      [markerIdSymbol]: generateMarkerId(),
      ...params,
    };
  }
}
