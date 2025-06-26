import type { ImageMarkerBaseProps } from './ImageMarkerBase';
import ImageMarkerBase from './ImageMarkerBase';

interface CustomImageMarkerProps extends ImageMarkerBaseProps {}

const CustomImageMarker: React.FC<CustomImageMarkerProps> = (
  props: CustomImageMarkerProps
) => {
  return <ImageMarkerBase {...props} typeName="CustomImageMarker" />;
};

export default CustomImageMarker;
