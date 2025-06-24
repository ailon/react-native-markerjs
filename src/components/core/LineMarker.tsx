import type { LinearMarkerBaseProps } from './LinearMarkerBase';
import LinearMarkerBase from './LinearMarkerBase';

interface LineMarkerProps extends LinearMarkerBaseProps {}

const LineMarker: React.FC<LineMarkerProps> = (props: LineMarkerProps) => {
  const { x1, y1, x2, y2 } = props;
  const d = `M ${x1} ${y1} L ${x2} ${y2}`;

  return <LinearMarkerBase {...props} typeName="LineMarker" d={d} />;
};

export default LineMarker;
