import { Colors } from "../types";

type Props = {
  color: Colors;
};

const COLORS: Record<Colors, string> = {
  "sky-blue": "#87CEEB",
  blue: "#2B40EC",
  gray: "#525252",
  green: "#2FD55A",
  magenta: "#D30F84",
  orange: "#F77922",
  pink: "#F7759A",
  purple: "#8947DD",
  yellow: "#F6C135",
};

const WaterBlock = ({ color }: Props) => {
  return (
    <div className="water-block" style={{ background: COLORS[color] }}></div>
  );
};

export default WaterBlock;
