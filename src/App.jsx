import { useRecoilState } from "recoil";
import Canvas from "./components/Canvas";
import SidePanel from "./components/SidePanel";
import TopPanel from "./components/TopPanel";
import { shapesState } from "./Atoms";
import { useEffect } from "react";
import Options from "./components/Options";

function App() {
  const [shapes, setShapes] = useRecoilState(shapesState);
  const handleBeforeUnload = () => {
    localStorage.setItem("shapes", JSON.stringify(shapes));
  };

  const handleLoad = () => {
    const storedShapes = localStorage.getItem("shapes");
    if (storedShapes) {
      setShapes(JSON.parse(storedShapes));
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("load", handleLoad);
    };
  }, [shapes, setShapes]);
  return (
    <>
      <SidePanel />
      <TopPanel />
      <Canvas />
      <Options />
    </>
  );
}

export default App;
