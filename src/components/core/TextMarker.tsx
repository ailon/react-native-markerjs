/* eslint-disable @typescript-eslint/no-unused-vars */
import { Rect, Text, TSpan } from 'react-native-svg';
import RectangularBoxMarkerBase, {
  type RectangularBoxMarkerBaseProps,
} from './RectangularBoxMarkerBase';
import type { TextMarkerState } from '../../core/TextMarkerState';

interface TextMarkerProps
  extends RectangularBoxMarkerBaseProps,
    TextMarkerState {}

const TextMarker: React.FC<TextMarkerProps> = ({
  strokeColor,
  strokeWidth,
  strokeDasharray,
  children,
  zoomFactor = 1,
  scaleStroke = true,
  text,
  fontFamily,
  fontSize,
  color,
  ...props
}: TextMarkerProps) => {
  const lines = text.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);

  const LINE_SPACING = 0.1;
  const lineHeight = (props.height - (props.padding ?? 0) * 2) / lines.length;
  const fontSizePx = lineHeight - lineHeight * LINE_SPACING;

  return (
    <RectangularBoxMarkerBase {...props}>
      {/* Transparent rectangle for interaction */}
      <Rect
        x={0}
        y={0}
        width={props.width}
        height={props.height}
        fill="transparent"
        stroke="transparent"
      />
      <Text textAnchor="middle">
        {lines.map((line, lineno) => (
          <TSpan
            key={lineno}
            fill={color}
            fontFamily={fontFamily}
            fontSize={`${fontSizePx}px`}
            x={props.width / 2}
            dy={lineHeight}
          >
            {line}
          </TSpan>
        ))}
      </Text>
      {children}
    </RectangularBoxMarkerBase>
  );
};

export default TextMarker;
export type { TextMarkerProps };
