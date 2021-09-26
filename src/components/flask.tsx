import { WaterBlock } from ".";
import { Colors } from "../types";

type Props = {
  colors: Colors[];
  onClick: () => void;
  active: boolean;
};

const Flask = ({ colors, onClick, active }: Props) => {
  return (
    <div
      className={`flask ${active ? "flask--active" : ""}`}
      onClick={() => onClick()}
    >
      {colors.map((color, index) => (
        <WaterBlock color={color} key={index} />
      ))}
    </div>
  );
};

export default Flask;
