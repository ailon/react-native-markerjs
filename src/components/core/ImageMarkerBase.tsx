import { SvgXml } from 'react-native-svg';
import RectangularBoxMarkerBase, {
  type RectangularBoxMarkerBaseProps,
} from './RectangularBoxMarkerBase';
import type { ImageMarkerBaseState } from '../../core/ImageMarkerBaseState';

interface ImageMarkerBaseProps
  extends RectangularBoxMarkerBaseProps,
    ImageMarkerBaseState {}

const ImageMarkerBase: React.FC<ImageMarkerBaseProps> = ({
  svgString,
  children,
  ...props
}: ImageMarkerBaseProps) => {
  console.log('ImageMarkerBase props:', props);
  console.log('ImageMarkerBase svgString:', svgString);
  return (
    <RectangularBoxMarkerBase {...props}>
      {svgString && (
        <SvgXml xml={svgString} width={props.width} height={props.height} />
      )}
      {children}
    </RectangularBoxMarkerBase>
  );
};

export default ImageMarkerBase;
export type { ImageMarkerBaseProps };
