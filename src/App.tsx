import { useEffect, useState } from "react";
import { Flask } from "./components";
import { removeTop } from "./engine";
import { Colors, Flasks } from "./types";
import levels from "./levels";
import { ReactComponent as ChevronRight } from "./icons/chevron-right.svg";
import { ReactComponent as Retry } from "./icons/repeat.svg";
import { ReactComponent as Levels } from "./icons/levels.svg";
import { ReactComponent as Close } from "./icons/x.svg";

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
  const [levelModal, setLevelModal] = useState(false);

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

  const retry = () => {
    setFlasks(levels[level]);
    setIsLevelCompleted(false);
  };

  const chooseLevel = () => {
    setLevelModal(true);
  };

  const changeLevel = (level: number) => {
    setFlasks(levels[level]);
    setLevelModal(false);
    setIsLevelCompleted(false);
  };

  return (
    <div className="game">
      <div className="levels">
        <div className="button" onClick={chooseLevel}>
          <Levels />
        </div>
      </div>

      {levelModal && (
        <div className="levels-modal">
          <Close className="close" onClick={() => setLevelModal(false)} />
          {levels.map((lvl, index) => (
            <div className="menu-level" onClick={() => changeLevel(index)}>
              Level {index + 1}
            </div>
          ))}
        </div>
      )}

      <nav className="nav">
        <p className="level">Level {level + 1}</p>

        <div className="button" onClick={retry}>
          <Retry />
        </div>
      </nav>

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
        <div className="progress-info">
          <p className="success">
            {nextLevelExists
              ? "CONGRATULATIONS! YOU HAVE COMPLETED THIS LEVEL!"
              : "YOU HAVE COMPLETED ALL LEVELS!"}
          </p>
          {nextLevelExists && (
            <div className="button" onClick={startNextLevel}>
              <ChevronRight />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;
