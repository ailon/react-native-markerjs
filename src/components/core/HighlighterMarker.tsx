import type { FreehandMarkerProps } from './FreehandMarker';
import FreehandMarker from './FreehandMarker';

interface HighlighterMarkerProps extends FreehandMarkerProps {}

const HighlighterMarker: React.FC<HighlighterMarkerProps> = (
  props: HighlighterMarkerProps
) => {
  return <FreehandMarker {...props} typeName="HighlighterMarker" />;
};

export default HighlighterMarker;
