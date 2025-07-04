import ShapeMarkerBase, { type ShapeMarkerBaseProps } from './ShapeMarkerBase';

interface CoverMarkerProps extends ShapeMarkerBaseProps {}

const CoverMarker: React.FC<CoverMarkerProps> = (props: CoverMarkerProps) => {
  const { width, height } = props;
  const d = `M 0 0 
      H ${width} 
      V ${height} 
      H 0 
      V 0 Z`;

  return <ShapeMarkerBase {...props} typeName="CoverMarker" d={d} />;
};

export default CoverMarker;
