import { FrameMarkerFactory } from './FrameMarkerFactory';
import type { MarkerBaseFactory } from './MarkerBaseFactory';
import { EllipseFrameMarkerFactory } from './EllipseFrameMarkerFactory';
import { LineMarkerFactory } from './LineMarkerFactory';
import { FreehandMarkerFactory } from './FreehandMarkerFactory';
import { CustomImageMarkerFactory } from './CustomImageMarkerFactory';

export const markerFactoryMap: Record<string, typeof MarkerBaseFactory> = {
  FrameMarker: FrameMarkerFactory,
  EllipseFrameMarker: EllipseFrameMarkerFactory,
  LineMarker: LineMarkerFactory,
  FreehandMarker: FreehandMarkerFactory,
  CustomImageMarker: CustomImageMarkerFactory,
  // Add more mappings here as you add more marker types
};
