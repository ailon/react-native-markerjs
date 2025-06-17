import type { ShapeOutlineMarkerBaseState } from '../../core/ShapeOutlineMarkerBaseState';
import ShapeOutlineMarkerBase from './ShapeOutlineMarkerBase';

interface FrameMarkerProps extends ShapeOutlineMarkerBaseState {}

const FrameMarker: React.FC<FrameMarkerProps> = (props: FrameMarkerProps) => {
  const d = `M 0 0 
      H ${props.width} 
      V ${props.height} 
      H 0 
      V 0 Z`;

  return <ShapeOutlineMarkerBase {...props} typeName="FrameMarker" d={d} />;
};

export default FrameMarker;
