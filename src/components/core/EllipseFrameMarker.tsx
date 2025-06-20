import type { RectangularBoxMarkerBaseProps } from './RectangularBoxMarkerBase';
import ShapeOutlineMarkerBase from './ShapeOutlineMarkerBase';

interface EllipseFrameMarkerProps extends RectangularBoxMarkerBaseProps {}

const EllipseFrameMarker: React.FC<EllipseFrameMarkerProps> = (
  props: EllipseFrameMarkerProps
) => {
  const { width, height } = props;
  const d = `M ${width / 2} 0 
       a ${width / 2} ${height / 2} 0 1 0 0 ${height} 
       a ${width / 2} ${height / 2} 0 1 0 0 -${height} z`;

  return (
    <ShapeOutlineMarkerBase {...props} typeName="EllipseFrameMarker" d={d} />
  );
};

export default EllipseFrameMarker;
