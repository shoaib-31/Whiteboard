import { useState } from "react";
import Canvas from "./components/Canvas";
import SidePanel from "./components/SidePanel";
import TopPanel from "./components/TopPanel";
import { useGlobalState } from "./hooks/useGlobalState";
import useLocalStorageState from "use-local-storage-state";
const colors = ["#000", "#00f", "#0f0", "#f00", "#ff7c25"];
const backgroundOptions = [
  "transparent",
  "#8080ff",
  "#79ff90",
  "#63f7ff",
  "#fca2ff",
];

function App() {
  const { state } = useGlobalState();

  const [selectedProps, setSelectedProps] = useState({
    stroke: colors[0],
    background: backgroundOptions[0],
    strokeWidth: 2,
    strokeStyle: "solid",
    corners: "round",
    opacity: 1,
  });
  const [isSelected, setIsSelected] = useState(null);
  const [shapes, setShapes] = useLocalStorageState("allShapes", {
    defaultValue: [],
  });
  return (
    <>
      {(isSelected ||
        state.active == "rectangle" ||
        state.active == "ellipse" ||
        state.active == "line" ||
        state.active == "text" ||
        state.active == "arrow" ||
        state.active == "pencil") &&
        state.active != "eraser" && (
          <SidePanel
            selectedProps={selectedProps}
            setSelectedProps={setSelectedProps}
            isSelected={isSelected}
            shapes={shapes}
            setShapes={setShapes}
            state={state}
          />
        )}
      <TopPanel />
      <Canvas
        selectedProps={selectedProps}
        setIsSelected={setIsSelected}
        isSelected={isSelected}
        shapes={shapes}
        setShapes={setShapes}
      />
    </>
  );
}

export default App;
