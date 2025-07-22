import FrameMarker from './FrameMarker';
import EllipseFrameMarker from './EllipseFrameMarker';
import LineMarker from './LineMarker';
import FreehandMarker from './FreehandMarker';
import CustomImageMarker from './CustomImageMarker';
import PolygonMarker from './PolygonMarker';
import TextMarker from './TextMarker';
import ArrowMarker from './ArrowMarker';
import CoverMarker from './CoverMarker';
import EllipseMarker from './EllipseMarker';
import HighlightMarker from './HighlightMarker';
import HighlighterMarker from './HighlighterMarker';
import MeasurementMarker from './MeasurementMarker';
import CalloutMarker from './CalloutMarker';

export const markerComponentMap: Record<string, React.ComponentType<any>> = {
  FrameMarker: FrameMarker,
  EllipseFrameMarker: EllipseFrameMarker,
  LineMarker: LineMarker,
  FreehandMarker: FreehandMarker,
  CustomImageMarker: CustomImageMarker,
  PolygonMarker: PolygonMarker,
  TextMarker: TextMarker,
  ArrowMarker: ArrowMarker,
  CoverMarker: CoverMarker,
  EllipseMarker: EllipseMarker,
  HighlightMarker: HighlightMarker,
  HighlighterMarker: HighlighterMarker,
  MeasurementMarker: MeasurementMarker,
  CalloutMarker: CalloutMarker,
  // Add more mappings here as you add more marker types
};
