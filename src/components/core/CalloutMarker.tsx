import { Path } from 'react-native-svg';
import type { CalloutMarkerState } from '../../core/CalloutMarkerState';
import type { TextMarkerProps } from './TextMarker';
import TextMarker from './TextMarker';

interface CalloutMarkerProps extends TextMarkerProps, CalloutMarkerState {}

const CalloutMarker: React.FC<CalloutMarkerProps> = ({
  tipPosition,
  ...props
}: CalloutMarkerProps) => {
  const {
    width,
    height,
    fillColor,
    strokeColor,
    strokeWidth,
    strokeDasharray,
    scaleStroke = true,
    zoomFactor = 1,
    children,
  } = props;

  const getTipPoints = () => {
    let offset = Math.min(height / 2, 15);
    let baseWidth = height / 5;

    let tipBase1Position = { x: 0, y: 0 };
    let tipBase2Position = { x: 0, y: 0 };

    const cornerAngle = Math.atan(height / 2 / (width / 2));
    if (tipPosition.x < width / 2 && tipPosition.y < height / 2) {
      // top left
      const tipAngle = Math.atan(
        (height / 2 - tipPosition.y) / (width / 2 - tipPosition.x)
      );
      if (cornerAngle < tipAngle) {
        baseWidth = width / 5;
        offset = Math.min(width / 2, 15);
        tipBase1Position = { x: offset, y: 0 };
        tipBase2Position = { x: offset + baseWidth, y: 0 };
      } else {
        tipBase1Position = { x: 0, y: offset };
        tipBase2Position = { x: 0, y: offset + baseWidth };
      }
    } else if (tipPosition.x >= width / 2 && tipPosition.y < height / 2) {
      // top right
      const tipAngle = Math.atan(
        (height / 2 - tipPosition.y) / (tipPosition.x - width / 2)
      );
      if (cornerAngle < tipAngle) {
        baseWidth = width / 5;
        offset = Math.min(width / 2, 15);
        tipBase1Position = { x: width - offset - baseWidth, y: 0 };
        tipBase2Position = { x: width - offset, y: 0 };
      } else {
        tipBase1Position = { x: width, y: offset };
        tipBase2Position = { x: width, y: offset + baseWidth };
      }
    } else if (tipPosition.x >= width / 2 && tipPosition.y >= height / 2) {
      // bottom right
      const tipAngle = Math.atan(
        (tipPosition.y - height / 2) / (tipPosition.x - width / 2)
      );
      if (cornerAngle < tipAngle) {
        baseWidth = width / 5;
        offset = Math.min(width / 2, 15);
        tipBase1Position = {
          x: width - offset - baseWidth,
          y: height,
        };
        tipBase2Position = { x: width - offset, y: height };
      } else {
        tipBase1Position = {
          x: width,
          y: height - offset - baseWidth,
        };
        tipBase2Position = { x: width, y: height - offset };
      }
    } else {
      // bottom left
      const tipAngle = Math.atan(
        (tipPosition.y - height / 2) / (width / 2 - tipPosition.x)
      );
      if (cornerAngle < tipAngle) {
        baseWidth = width / 5;
        offset = Math.min(width / 2, 15);
        tipBase1Position = { x: offset, y: height };
        tipBase2Position = { x: offset + baseWidth, y: height };
      } else {
        tipBase1Position = { x: 0, y: height - offset - baseWidth };
        tipBase2Position = { x: 0, y: height - offset };
      }
    }

    return { tipBase1Position, tipBase2Position };
  };

  const r = 5 / (scaleStroke ? zoomFactor : 1);
  const { tipBase1Position, tipBase2Position } = getTipPoints();

  const d = `M ${r} 0 
      ${
        tipBase1Position.y === 0
          ? `H ${tipBase1Position.x} L ${tipPosition.x} ${tipPosition.y} L ${tipBase2Position.x} 0`
          : ''
      }
      H ${width - r} 
      A ${r} ${r} 0 0 1 ${width} ${r} 
      ${
        tipBase1Position.x === width
          ? `V ${tipBase1Position.y} L ${tipPosition.x} ${tipPosition.y} L  ${tipBase2Position.x} ${tipBase2Position.y}`
          : ''
      }
      V ${height - r} 
      A ${r} ${r} 0 0 1 ${width - r} ${height} 
      ${
        tipBase1Position.y === height
          ? `H ${tipBase2Position.x} L ${tipPosition.x} ${tipPosition.y} L ${tipBase1Position.x} ${height}`
          : ''
      }
      H ${r}
      A ${r} ${r} 0 0 1 0 ${height - r} 
      ${
        tipBase1Position.x === 0
          ? `V ${tipBase2Position.y} L ${tipPosition.x} ${tipPosition.y} L  ${tipBase1Position.x} ${tipBase1Position.y}`
          : ''
      }
      V ${r} 
      A ${r} ${r} 0 0 1 ${r} 0 
      Z`;

  return (
    <TextMarker {...props}>
      <Path
        d={d}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={(strokeWidth ?? 1) / (scaleStroke ? zoomFactor : 1)}
        strokeDasharray={strokeDasharray}
      />
      {children}
    </TextMarker>
  );
};

export default CalloutMarker;
export type { CalloutMarkerProps };
