export type Colors =
  | "green"
  | "magenta"
  | "pink"
  | "purple"
  | "yellow"
  | "gray"
  | "blue"
  | "orange"
  | "sky-blue";

export type Flask = { id: number; colors: Colors[] };
export type Flasks = Flask[];
