import ShapeMarkerBase, { type ShapeMarkerBaseProps } from './ShapeMarkerBase';

interface EllipseMarkerProps extends ShapeMarkerBaseProps {}

const EllipseMarker: React.FC<EllipseMarkerProps> = (
  props: EllipseMarkerProps
) => {
  const { width, height } = props;
  const d = `M ${width / 2} 0 
       a ${width / 2} ${height / 2} 0 1 0 0 ${height} 
       a ${width / 2} ${height / 2} 0 1 0 0 -${height} z`;

  return <ShapeMarkerBase {...props} typeName="EllipseMarker" d={d} />;
};

export default EllipseMarker;
