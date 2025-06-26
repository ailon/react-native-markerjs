import FreehandMarkerEditor from './FreehandMarkerEditor';
import LinearMarkerBaseEditor from './LinearMarkerBaseEditor';
import PolygonMarkerEditor from './PolygonMarkerEditor';
import RectangularBoxMarkerBaseEditor from './RectangularBoxMarkerBaseEditor';

export const editorComponentMap: Record<string, React.ComponentType<any>> = {
  FrameMarker: RectangularBoxMarkerBaseEditor,
  EllipseFrameMarker: RectangularBoxMarkerBaseEditor,
  LineMarker: LinearMarkerBaseEditor,
  FreehandMarker: FreehandMarkerEditor,
  CustomImageMarker: RectangularBoxMarkerBaseEditor,
  PolygonMarker: PolygonMarkerEditor,
  // Add more mappings here as you add more marker types
};
