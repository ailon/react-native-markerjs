import { Circle, G, type GProps } from 'react-native-svg';

interface GripProps extends GProps {
  x: number;
  y: number;
  strokeColor?: string;
  fillColor?: string;
  flipColors?: boolean;
  zoomFactor?: number;
}

const Grip: React.FC<GripProps> = ({
  x,
  y,
  strokeColor = '#0ea5e9',
  fillColor = 'rgba(255,255,255,0.9)',
  flipColors = false,
  zoomFactor = 1,
  ...props
}: GripProps) => {
  return (
    <G {...props}>
      {/* larger circle for touch target */}
      <Circle
        cx={x}
        cy={y}
        r={10 / zoomFactor}
        fill="transparent"
        stroke="transparent"
        strokeWidth={0}
      />
      <Circle
        cx={x}
        cy={y}
        r={5 / zoomFactor}
        fill={flipColors ? strokeColor : fillColor}
        stroke={flipColors ? fillColor : strokeColor}
        strokeWidth={1 / zoomFactor}
      />
    </G>
  );
};

export default Grip;
