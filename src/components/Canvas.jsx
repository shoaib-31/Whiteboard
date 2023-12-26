import { Stage, Layer, Rect } from "react-konva";
import { useGlobalState } from "../hooks/useGlobalState";
import { useRef } from "react";
import { icons } from "../assets/TopPanelElements";
import useLocalStorageState from "use-local-storage-state";

function Canvas() {
  const { state } = useGlobalState();
  const stageRef = useRef(null);
  const [shapes, setShapes] = useLocalStorageState("allShapes", {
    defaultValue: [
      {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fill: "red",
        name: "rect",
      },
    ],
  });

  const handleMouseEnter = () => {
    if (stageRef.current) {
      const activeIcon = icons.find((icon) => icon.id === state.active);
      if (activeIcon) {
        stageRef.current.container().style.cursor = activeIcon.cursor;
      }
    }
  };

  const handleMouseLeave = () => {
    if (stageRef.current) {
      stageRef.current.container().style.cursor = "default";
    }
  };
  const handleMouseUpElement = () => {
    const activeIcon = icons.find((icon) => icon.id === state.active);
    if (stageRef.current) {
      stageRef.current.container().style.cursor = activeIcon
        ? activeIcon.cursor
        : "default";
    }
  };
  const handleMouseDownElement = () => {
    if (state.active == "hand-paper") {
      stageRef.current.container().style.cursor = "grabbing";
    }
    if (state.active == "selection") {
      stageRef.current.container().style.cursor = "all-scroll";
    }
  };
  const handleMouseEnterELement = () => {
    if (state.active == "selection") {
      stageRef.current.container().style.cursor = "all-scroll";
    }
  };
  const handleClick = (e) => {
    if (state.active == "rectangle") {
      const newShapes = [...shapes];
      newShapes.push({
        x: e.evt.layerX,
        y: e.evt.layerY,
        width: 100,
        height: 100,
        fill: "red",
        name: "rect",
      });
      setShapes(newShapes);
    }
  };
  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      height={window.innerHeight}
      onClick={handleClick}
    >
      <Layer>
        {shapes.map((shape, i) => {
          if (shape.name === "rect") {
            return (
              <Rect
                key={i}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.fill}
                draggable
                onMouseUp={handleMouseUpElement}
                onMouseDown={handleMouseDownElement}
                onMouseEnter={handleMouseEnterELement}
                onDragEnd={(e) => {
                  const index = i;
                  const newShapes = [...shapes];
                  newShapes[index] = {
                    ...shape,
                    x: e.target.x(),
                    y: e.target.y(),
                  };
                  setShapes(newShapes);
                }}
              />
            );
          }
        })}
      </Layer>
    </Stage>
  );
}

export default Canvas;
