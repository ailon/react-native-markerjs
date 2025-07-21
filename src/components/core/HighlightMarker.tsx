import ShapeMarkerBase, { type ShapeMarkerBaseProps } from './ShapeMarkerBase';

interface HighlightMarkerProps extends ShapeMarkerBaseProps {}

const HighlightMarker: React.FC<HighlightMarkerProps> = (
  props: HighlightMarkerProps
) => {
  const { width, height } = props;
  const d = `M 0 0 
      H ${width} 
      V ${height} 
      H 0 
      V 0 Z`;

  return <ShapeMarkerBase {...props} typeName="HighlightMarker" d={d} />;
};

export default HighlightMarker;
