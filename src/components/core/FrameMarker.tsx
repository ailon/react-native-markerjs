import type { RectangularBoxMarkerBaseProps } from './RectangularBoxMarkerBase';
import ShapeOutlineMarkerBase from './ShapeOutlineMarkerBase';

interface FrameMarkerProps extends RectangularBoxMarkerBaseProps {}

const FrameMarker: React.FC<FrameMarkerProps> = (props: FrameMarkerProps) => {
  const { width, height } = props;
  const d = `M 0 0 
      H ${width} 
      V ${height} 
      H 0 
      V 0 Z`;

  console.log('FrameMarker size:', width, height, 'd:', d);
  return <ShapeOutlineMarkerBase {...props} typeName="FrameMarker" d={d} />;
};

export default FrameMarker;
