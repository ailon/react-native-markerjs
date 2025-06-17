import { Circle } from 'react-native-svg';

interface GripProps {
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
}: GripProps) => {
  return (
    <Circle
      cx={x}
      cy={y}
      r={5}
      fill={flipColors ? strokeColor : fillColor}
      stroke={flipColors ? fillColor : strokeColor}
      strokeWidth={1}
    />
  );
};

export default Grip;
