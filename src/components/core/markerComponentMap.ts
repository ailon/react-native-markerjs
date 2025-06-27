import FrameMarker from './FrameMarker';
import EllipseFrameMarker from './EllipseFrameMarker';
import LineMarker from './LineMarker';
import FreehandMarker from './FreehandMarker';
import CustomImageMarker from './CustomImageMarker';
import PolygonMarker from './PolygonMarker';
import TextMarker from './TextMarker';

export const markerComponentMap: Record<string, React.ComponentType<any>> = {
  FrameMarker: FrameMarker,
  EllipseFrameMarker: EllipseFrameMarker,
  LineMarker: LineMarker,
  FreehandMarker: FreehandMarker,
  CustomImageMarker: CustomImageMarker,
  PolygonMarker: PolygonMarker,
  TextMarker: TextMarker,
  // Add more mappings here as you add more marker types
};
