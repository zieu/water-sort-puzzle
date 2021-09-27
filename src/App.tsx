import { useEffect, useState } from "react";
import { Flask } from "./components";
import { removeTop } from "./engine";
import { Colors, Flasks, Flask as TFlask } from "./types";
import levels from "./levels";
import { ChevronRight, Close, Levels, Retry } from "./icons";

// icons

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

  const firstFlask = selectedFlasks[0];
  const secondFlask = selectedFlasks[1];

  const onSelect = (id: number) => {
    setSelectedFlasks((prev) => {
      return prev[0] !== null ? [prev[0], id] : [id, null];
    });
  };

  // ON FIRST FLASK SELECTION
  useEffect(() => {
    if (
      selectedFlasks.every((slot) => slot !== null) &&
      firstFlask !== secondFlask &&
      firstFlask !== null
    ) {
      for (const flask of flasks) {
        if (firstFlask === flask.id) {
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

    if (firstFlask === secondFlask && selectedFlasks.every((item) => !!item)) {
      setSelectedFlasks([null, null]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFlasks]);

  const validateFlasks = (flask: TFlask) => {
    const isSecondFlask = secondFlask === flask.id;
    const removedColorsExist = !!removedColors?.length;
    const doColorsMatch = removedColors && removedColors[0] === flask.colors[0];
    const isFlaskEmpty = flask.colors.length === 0;
    const canFit =
      removedFlasks?.length &&
      removedColors &&
      flask.colors.length + removedColors.length <= 4;

    return {
      isFlaskEmpty,
      canFit,
      isSecondFlask,
      removedColorsExist,
      doColorsMatch,
    };
  };

  // ON SECOND FLASK SELECTION
  useEffect(() => {
    if (!!secondFlask) {
      let newFlasks = flasks;

      for (const flask of flasks) {
        // conditions
        const {
          canFit,
          doColorsMatch,
          isFlaskEmpty,
          isSecondFlask,
          removedColorsExist,
        } = validateFlasks(flask);

        if (
          isSecondFlask &&
          removedColorsExist &&
          (doColorsMatch || isFlaskEmpty) &&
          canFit
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

      setFlasks(newFlasks);
      setSelectedFlasks([null, null]);
    }

    if (firstFlask === secondFlask) {
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
    setLevel(nextLevelExists ? level + 1 : level);
    setIsLevelCompleted(false);
  };

  useEffect(() => {
    if (levels.length - 1 === level) {
      setNextLevelExists(false);
    } else {
      setNextLevelExists(true);
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
    setLevel(level);
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
            <div
              className="menu-level"
              onClick={() => changeLevel(index)}
              key={index}
            >
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
          <div className="success">
            {nextLevelExists ? (
              <>
                <div>CONGRATULATIONS!</div>
                <div>YOU HAVE COMPLETED THIS LEVEL!</div>
              </>
            ) : (
              "YOU HAVE COMPLETED ALL LEVELS!"
            )}
          </div>
          {nextLevelExists && (
            <div className="button bg-magenta" onClick={startNextLevel}>
              <ChevronRight />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;
