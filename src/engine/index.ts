import { Colors } from "../types";

const removeTop = (colors: Colors[]) => {
  let top = null;
  let timesRemoved = 0;
  let duplicate = [...colors];

  for (let color of colors) {
    top = top ?? color;
    if (color === top) {
      timesRemoved++;
      duplicate.shift();
    } else {
      break;
    }
  }

  let removedItems: Colors[] = [];
  for (let i = 0; i < timesRemoved; i++) {
    removedItems.push(top!);
  }

  return { removed: top, timesRemoved, colors: duplicate, removedItems };
};

export { removeTop };
