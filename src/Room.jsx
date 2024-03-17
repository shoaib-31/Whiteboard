import { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import Canvas from "./components/Canvas";
import SidePanel from "./components/SidePanel";
import TopPanel from "./components/TopPanel";
import { shapesState } from "./Atoms";

function Room() {
  const [shapes, setShapes] = useRecoilState(shapesState);
  const [socket, setSocket] = useState(null);
  const incomingShapesRef = useRef(false);

  const { roomId } = useParams();
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const wsUrl = `${wsProtocol}://${import.meta.env.VITE_HOST}:${
    import.meta.env.VITE_SERVER_PORT
  }`;

  //FUNCTIONS

  const handleShapeChangeDebounced = () => {
    if (socket && !incomingShapesRef.current) {
      console.log("WebSocket message sent:", shapes);
      socket.send(
        JSON.stringify({ type: "UPDATE_SHAPE", payload: { roomId, shapes } })
      );
    } else {
      incomingShapesRef.current = false;
    }
  };
  //USEEFFECTS

  useEffect(() => {
    if (!socket) {
      const newSocket = new WebSocket(wsUrl);
      setSocket(newSocket);
    }

    if (socket) {
      socket.addEventListener("open", () => {
        console.log("WebSocket connection opened");
        console.log(roomId);
        const storedShapes = localStorage.getItem("shapes");
        if (storedShapes) {
          setShapes(JSON.parse(storedShapes));
        }
        socket.send(
          JSON.stringify({
            type: "JOIN_ROOM",
            payload: { roomId, shapes: storedShapes },
          })
        );
      });

      socket.addEventListener("message", async (event) => {
        incomingShapesRef.current = true;
        const message = await JSON.parse(event.data);
        setShapes(message.payload.shapes);
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
  }, [socket, wsUrl]);

  useEffect(() => {
    console.log("shape changed", shapes);
    localStorage.setItem("shapes", JSON.stringify(shapes));
    handleShapeChangeDebounced(shapes);
  }, [shapes, setShapes]);

  return (
    <>
      <SidePanel />
      <TopPanel />
      <Canvas />
    </>
  );
}

export default Room;
