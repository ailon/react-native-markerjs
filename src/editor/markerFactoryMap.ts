import { FrameMarkerFactory } from './FrameMarkerFactory';
import type { MarkerBaseFactory } from './MarkerBaseFactory';
import { EllipseFrameMarkerFactory } from './EllipseFrameMarkerFactory';
import { LineMarkerFactory } from './LineMarkerFactory';
import { FreehandMarkerFactory } from './FreehandMarkerFactory';
import { CustomImageMarkerFactory } from './CustomImageMarkerFactory';
import { PolygonMarkerFactory } from './PolygonMarkerFactory';
import { TextMarkerFactory } from './TextMarkerFactory';
import { ArrowMarkerFactory } from './ArrowMarkerFactory';

export const markerFactoryMap: Record<string, typeof MarkerBaseFactory> = {
  FrameMarker: FrameMarkerFactory,
  EllipseFrameMarker: EllipseFrameMarkerFactory,
  LineMarker: LineMarkerFactory,
  FreehandMarker: FreehandMarkerFactory,
  CustomImageMarker: CustomImageMarkerFactory,
  PolygonMarker: PolygonMarkerFactory,
  TextMarker: TextMarkerFactory,
  ArrowMarker: ArrowMarkerFactory,
  // Add more mappings here as you add more marker types
};
