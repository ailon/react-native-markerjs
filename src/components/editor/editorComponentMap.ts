import RectangularBoxMarkerBaseEditor from './RectangularBoxMarkerBaseEditor';

export const editorComponentMap: Record<string, React.ComponentType<any>> = {
  FrameMarker: RectangularBoxMarkerBaseEditor,
  EllipseFrameMarker: RectangularBoxMarkerBaseEditor,
  // Add more mappings here as you add more marker types
};
