import { Stage, Layer, Rect, Ellipse, Line, Image, Arrow } from "react-konva";
import { useGlobalState } from "../hooks/useGlobalState";
import { useEffect, useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import {
  handleMouseUp,
  handleMouseMove,
  handleMouseDown,
  handleMouseEnter,
  handleMouseLeave,
} from "../events/canvasEvents";
import {
  handleMouseDownElement,
  handleMouseEnterElement,
  handleMouseUpElement,
  handleDragEndElement,
  handleDragStartElement,
} from "../events/elementEvents";
import Konva from "konva";

// ... (imports and other code)

function Canvas() {
  const { state } = useGlobalState();
  const stageRef = useRef(null);
  const layerRef = useRef();
  const [tempShapes, setTempShapes] = useState({});
  const [history, setHistory] = useState([{ shapes: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [shapes, setShapes] = useLocalStorageState("allShapes", {
    defaultValue: [],
  });

  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "z":
            handleUndo();
            break;
          case "y":
            handleRedo();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [history, historyIndex]);

  useEffect(() => {
    if (!isEqual(history[historyIndex].shapes, shapes)) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ shapes: shapes });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [shapes]);

  const isEqual = (arr1, arr2) => {
    return (
      arr1.length === arr2.length &&
      arr1.every(
        (val, index) => JSON.stringify(val) === JSON.stringify(arr2[index])
      )
    );
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      setShapes(history[historyIndex - 1].shapes);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      setShapes(history[historyIndex + 1].shapes);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result;

        img.onload = () => {
          const konvaImage = new Konva.Image({
            image: img,
            x: 800 + Math.random() * 100,
            y: 800 + Math.random() * 100,
            width: img.width,
            height: img.height,
            name: "image",
            src: reader.result,
          });

          setShapes((prevShapes) => [
            ...prevShapes,
            konvaImage.toObject().attrs,
          ]);
        };
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input type="file" id="imageUpload" onChange={handleFileChange} />
      <Stage
        ref={stageRef}
        width={window.innerWidth * 2}
        onMouseEnter={() => handleMouseEnter(stageRef, state)}
        onMouseLeave={() => handleMouseLeave(stageRef)}
        height={window.innerHeight * 2}
        onMouseDown={(e) =>
          handleMouseDown(
            e,
            state,
            setTempShapes,
            setInitialPos,
            shapes,
            setShapes
          )
        }
        onMouseMove={(e) =>
          handleMouseMove(
            e,
            state,
            tempShapes,
            setTempShapes,
            initialPos,
            shapes,
            setShapes
          )
        }
        onMouseUp={() => {
          if (
            state.active === "rectangle" ||
            state.active === "ellipse" ||
            state.active === "line" ||
            state.active === "arrow" ||
            state.active === "pencil" ||
            state.active === "image"
          ) {
            handleMouseUp(shapes, setShapes, tempShapes, setTempShapes);
          }
        }}
      >
        <Layer ref={layerRef}>
          {shapes.map((shape, i) => {
            if (shape.name === "rectangle") {
              return (
                <Rect
                  key={i}
                  x={shape.x}
                  y={shape.y}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.fill || "transparent"}
                  cornerRadius={shape.cornerRadius || 10}
                  width={shape.width}
                  height={shape.height}
                  draggable={
                    state.active === "selection" ||
                    state.active === "hand-paper"
                  }
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes)
                  }
                />
              );
            } else if (shape.name === "ellipse") {
              return (
                <Ellipse
                  key={i}
                  x={shape.x + shape.width / 2}
                  y={shape.y + shape.height / 2}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.fill || "transparent"}
                  cornerRadius={shape.cornerRadius || 10}
                  width={shape.width}
                  height={shape.height}
                  draggable={
                    state.active === "selection" ||
                    state.active === "hand-paper"
                  }
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes)
                  }
                />
              );
            } else if (shape.name === "line") {
              return (
                <Line
                  x={shape.x}
                  y={shape.y}
                  key={i}
                  points={shape.points}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.fill || "transparent"}
                  draggable={
                    state.active === "selection" ||
                    state.active === "hand-paper"
                  }
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes)
                  }
                />
              );
            } else if (shape.name === "arrow") {
              return (
                <Arrow
                  x={shape.x}
                  y={shape.y}
                  key={i}
                  points={shape.points}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.fill || "black"}
                  draggable={
                    state.active === "selection" ||
                    state.active === "hand-paper"
                  }
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes, initialPos)
                  }
                  onDragStart={(e) => handleDragStartElement(e, setInitialPos)}
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                />
              );
            } else if (shape.name === "pencil") {
              return (
                <Line
                  x={shape.x}
                  y={shape.y}
                  points={shape.points}
                  key={i}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  draggable={
                    state.active === "selection" ||
                    state.active === "hand-paper"
                  }
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes, initialPos)
                  }
                  onDragStart={(e) => handleDragStartElement(e, setInitialPos)}
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                />
              );
            } else if (shape.name === "image") {
              const img = new window.Image();
              img.src = shape.src;
              return (
                <Image
                  key={i}
                  image={img}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  draggable={
                    state.active === "selection" ||
                    state.active === "hand-paper"
                  }
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes, initialPos)
                  }
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                />
              );
            }
          })}
          {tempShapes && tempShapes.name === "rectangle" ? (
            <Rect
              x={tempShapes.x}
              y={tempShapes.y}
              stroke={tempShapes.stroke || "black"}
              strokeWidth={tempShapes.strokeWidth || 2}
              fill={tempShapes.fill || "transparent"}
              cornerRadius={tempShapes.cornerRadius || 10}
              width={tempShapes.width}
              height={tempShapes.height}
              draggable
            />
          ) : tempShapes.name === "ellipse" ? (
            <Ellipse
              x={tempShapes.x + tempShapes.width / 2}
              y={tempShapes.y + tempShapes.height / 2}
              stroke={tempShapes.stroke || "black"}
              strokeWidth={tempShapes.strokeWidth || 2}
              fill={tempShapes.fill || "transparent"}
              radiusX={tempShapes.width / 2}
              radiusY={tempShapes.height / 2}
              draggable
            />
          ) : tempShapes.name === "line" ? (
            <Line
              points={tempShapes.points}
              stroke={tempShapes.stroke || "black"}
              strokeWidth={tempShapes.strokeWidth || 2}
              fill={tempShapes.fill || "transparent"}
              draggable
            />
          ) : tempShapes.name === "arrow" ? (
            <Arrow
              x={tempShapes.x}
              y={tempShapes.y}
              points={tempShapes.points}
              stroke={tempShapes.stroke || "black"}
              strokeWidth={tempShapes.strokeWidth || 2}
              fill={tempShapes.fill || "black"}
              draggable
            />
          ) : (
            tempShapes.name === "pencil" && (
              <Line
                x={tempShapes.x}
                y={tempShapes.y}
                points={tempShapes.points}
                stroke={tempShapes.stroke || "black"}
                strokeWidth={tempShapes.strokeWidth || 2}
              />
            )
          )}
        </Layer>
      </Stage>
    </>
  );
}

export default Canvas;
