import { Circle, G, type GProps } from 'react-native-svg';

interface GripProps extends GProps {
  x: number;
  y: number;
  strokeColor?: string;
  fillColor?: string;
  flipColors?: boolean;
}

const Grip: React.FC<GripProps> = ({
  x,
  y,
  strokeColor = '#0ea5e9',
  fillColor = 'rgba(255,255,255,0.9)',
  flipColors = false,
  ...props
}: GripProps) => {
  return (
    <G {...props}>
      {/* larger circle for touch target */}
      <Circle
        cx={x}
        cy={y}
        r={10}
        fill="transparent"
        stroke="transparent"
        strokeWidth={0}
      />
      <Circle
        cx={x}
        cy={y}
        r={5}
        fill={flipColors ? strokeColor : fillColor}
        stroke={flipColors ? fillColor : strokeColor}
        strokeWidth={1}
      />
    </G>
  );
};

export default Grip;
