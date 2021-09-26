import { useEffect, useState } from "react";
import { Flask } from "./components";
import { removeTop } from "./engine";
import { Colors, Flasks } from "./types";
import levels from "./levels";
import { ReactComponent as ChevronRight } from "./icons/chevron-right.svg";

function Game() {
  const [selectedFlasks, setSelectedFlasks] = useState<Array<number | null>>([
    null,
    null,
  ]);
  const [level, setLevel] = useState(0);
  const [flasks, setFlasks] = useState<Flasks>(levels[level]);
  const [removedColors, setRemovedColors] = useState<Colors[] | null>(null);
  const [removedFlasks, setRemovedFlasks] = useState<Flasks | null>(null);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [nextLevelExists, setNextLevelExists] = useState(true);

  const onSelect = (id: number) => {
    setSelectedFlasks((prev) => {
      console.log("prev", prev[0]);
      return prev[0] !== null ? [prev[0], id] : [id, null];
    });
  };

  useEffect(() => {
    if (
      selectedFlasks.every((slot) => slot !== null) &&
      selectedFlasks[0] !== selectedFlasks[1] &&
      selectedFlasks[0] !== null
    ) {
      for (const flask of flasks) {
        const first = selectedFlasks[0];

        if (first === flask.id) {
          console.log(flask, "first");
          const { removedItems, timesRemoved } = removeTop(flask.colors);
          let newFlask = {
            colors: flask.colors.slice(timesRemoved),
            id: flask.id,
          };

          setRemovedFlasks(
            flasks.map((f) => (f.id === newFlask.id ? newFlask : f))
          );
          setRemovedColors(removedItems);
        }
      }
    }

    if (
      selectedFlasks[0] === selectedFlasks[1] &&
      selectedFlasks.every((item) => !!item)
    ) {
      setSelectedFlasks([null, null]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlasks]);

  useEffect(() => {
    console.log(removedColors);
    if (!!selectedFlasks[1]) {
      console.log("inside useeffect2 and selected 2");

      let newFlasks = flasks;

      for (const flask of flasks) {
        const second = selectedFlasks[1];
        if (second === flask.id && removedColors?.length) {
          if (
            (removedColors[0] === flask.colors[0] ||
              flask.colors.length === 0) &&
            removedFlasks?.length &&
            flask.colors.length + removedColors.length <= 4
          ) {
            let newFlask = {
              colors: removedColors?.concat(flask.colors) || [],
              id: flask.id,
            };

            newFlasks = removedFlasks!.map((f) =>
              f.id === newFlask.id ? newFlask : f
            );
          }
        }
      }

      console.log(newFlasks, "newFlasks");

      setFlasks(newFlasks);

      setSelectedFlasks([null, null]);
    }
    if (selectedFlasks[0] === selectedFlasks[1]) {
      setSelectedFlasks([null, null]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removedColors]);

  useEffect(() => {
    if (
      flasks.every(
        (flask) =>
          flask.colors.every((color) => color === flask.colors[0]) &&
          (flask.colors.length === 0 || flask.colors.length === 4)
      )
    )
      setIsLevelCompleted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlasks]);

  const startNextLevel = () => {
    console.log(levels.length, "levels length");
    console.log(level, "current level");

    setLevel(nextLevelExists ? level + 1 : level);
    setIsLevelCompleted(false);
  };

  useEffect(() => {
    if (levels.length - 1 === level) {
      setNextLevelExists(false);
    }
  }, [level]);

  useEffect(() => {
    setFlasks(levels[level]);
  }, [level]);

  return (
    <div className="game">
      <div className="container">
        {flasks.map(({ colors, id }) => (
          <Flask
            colors={colors}
            key={id}
            onClick={() => onSelect(id)}
            active={selectedFlasks[0] === id}
          />
        ))}
      </div>
      {isLevelCompleted && (
        <div className="level-info">
          <p className="success">
            {nextLevelExists
              ? "Congratuilations! You have completed this level!"
              : "You have completed all levels!"}
          </p>
          {nextLevelExists && (
            <div className="next-level" onClick={startNextLevel}>
              <ChevronRight />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;
