/* eslint-disable @typescript-eslint/no-unused-vars */
import { G, Rect, SvgXml } from 'react-native-svg';
import RectangularBoxMarkerBase, {
  type RectangularBoxMarkerBaseProps,
} from './RectangularBoxMarkerBase';
import type { ImageMarkerBaseState } from '../../core/ImageMarkerBaseState';

interface ImageMarkerBaseProps
  extends RectangularBoxMarkerBaseProps,
    ImageMarkerBaseState {}

const ImageMarkerBase: React.FC<ImageMarkerBaseProps> = ({
  strokeColor,
  strokeWidth,
  strokeDasharray,
  zoomFactor = 1,
  scaleStroke = true,
  svgString,
  children,
  ...props
}: ImageMarkerBaseProps) => {
  return (
    <RectangularBoxMarkerBase {...props}>
      <G>
        {svgString && (
          <SvgXml xml={svgString} width={props.width} height={props.height} />
        )}
        <Rect
          x={0}
          y={0}
          width={props.width}
          height={props.height}
          fill="transparent"
          stroke="transparent"
        />
      </G>
      {children}
    </RectangularBoxMarkerBase>
  );
};

export default ImageMarkerBase;
export type { ImageMarkerBaseProps };
