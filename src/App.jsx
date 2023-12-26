import { useEffect, useRef } from "react";
import Canvas from "./components/Canvas";
import TopPanel from "./components/TopPanel";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <>
      <TopPanel />
      <Canvas ref={canvasRef} />
    </>
  );
}

export default App;
