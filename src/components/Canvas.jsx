import { Stage, Layer, Rect } from "react-konva";
import { useGlobalState } from "../hooks/useGlobalState";
import { useRef } from "react";
import { icons } from "../assets/TopPanelElements";

function Canvas() {
  const { state } = useGlobalState();
  const stageRef = useRef(null);
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
  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      height={window.innerHeight}
    >
      <Layer>
        <Rect
          x={20}
          y={20}
          width={100}
          height={100}
          fill="red"
          draggable={state.active === "hand-paper"}
        />
      </Layer>
    </Stage>
  );
}

export default Canvas;
