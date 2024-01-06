import { useEffect, useState, useRef } from "react";
import Canvas from "./components/Canvas";
import SidePanel from "./components/SidePanel";
import TopPanel from "./components/TopPanel";
import { useRecoilState } from "recoil";
import { shapesState } from "./Atoms";
import { debounce } from "lodash";

function App() {
  const [shapes, setShapes] = useRecoilState(shapesState);
  const [socket, setSocket] = useState(null);
  const incomingShapesRef = useRef(false);
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsProtocol}://localhost:8080`;

  useEffect(() => {
    if (!socket) {
      const newSocket = new WebSocket(wsUrl);
      setSocket(newSocket);
    }

    if (socket) {
      socket.addEventListener("open", () => {
        console.log("WebSocket connection opened");
      });

      socket.addEventListener("message", async (event) => {
        incomingShapesRef.current = true;
        const message = await JSON.parse(event.data);
        setShapes(message.payload);
        console.log("WebSocket message received:", message);
      });

      socket.addEventListener("close", () => {
        console.log("WebSocket connection closed");
      });
    }

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
  }, [socket]);

  const handleShapeChangeDebounced = debounce(() => {
    if (socket && !incomingShapesRef.current) {
      socket.send(JSON.stringify({ type: "UPDATE_SHAPES", payload: shapes }));
    } else {
      incomingShapesRef.current = false;
    }
  }, 100);

  useEffect(() => {
    console.log("shape changed", shapes);
    handleShapeChangeDebounced();
  }, [shapes]);

  return (
    <>
      <SidePanel />
      <TopPanel />
      <Canvas />
    </>
  );
}

export default App;
