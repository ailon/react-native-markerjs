import FrameMarker from './FrameMarker';
import EllipseFrameMarker from './EllipseFrameMarker';
import LineMarker from './LineMarker';

export const markerComponentMap: Record<string, React.ComponentType<any>> = {
  FrameMarker: FrameMarker,
  EllipseFrameMarker: EllipseFrameMarker,
  LineMarker: LineMarker,
  // Add more mappings here as you add more marker types
};
