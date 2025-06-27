/* eslint-disable @typescript-eslint/no-unused-vars */
import { Text, TSpan } from 'react-native-svg';
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
  onLayout,
  ...props
}: TextMarkerProps) => {
  const LINE_SIZE = '1em';

  const lines = text.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);

  return (
    <RectangularBoxMarkerBase {...props}>
      <Text
        textAnchor="middle"
        onLayout={(ev) => {
          onLayout?.(ev.nativeEvent.layout);
        }}
      >
        {lines.map((line, lineno) => (
          <TSpan
            key={lineno}
            fill={color}
            fontFamily={fontFamily}
            fontSize={`${fontSize.value}${fontSize.units}`}
            x={props.width / 2}
            dy={LINE_SIZE}
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
