import {
  Stage,
  Layer,
  Rect,
  Ellipse,
  Line,
  Image,
  Arrow,
  Transformer,
  Text,
} from "react-konva";
import { useEffect, useRef, useState } from "react";
import {
  handleMouseUp,
  handleMouseMove,
  handleMouseDown,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
} from "../events/canvasEvents";
import {
  handleMouseDownElement,
  handleMouseEnterElement,
  handleMouseUpElement,
  handleDragEndElement,
  handleDragStartElement,
  handleTransformer,
} from "../events/elementEvents";
import {
  activeState,
  optionsState,
  propsState,
  selectedState,
  shapesState,
} from "../Atoms";
import { useRecoilState } from "recoil";

function Canvas() {
  const stageRef = useRef(null);
  const [tempShapes, setTempShapes] = useState({});
  const [history, setHistory] = useState([{ shapes: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [shapes, setShapes] = useRecoilState(shapesState);
  const [optionsActive, setOptionsActive] = useRecoilState(optionsState);
  /* eslint-disable */
  const [isSelected, setIsSelected] = useRecoilState(selectedState);
  const [state, setState] = useRecoilState(activeState);
  const [selectedProps, setSelectedProps] = useRecoilState(propsState);
  /* eslint-disable */
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(null);

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
          const konvaImage = {
            x: 800 + Math.random() * 100,
            y: 800 + Math.random() * 100,
            width: img.width,
            height: img.height,
            name: "image",
            src: reader.result,
          };

          setShapes((prevShapes) => [...prevShapes, konvaImage]);
        };
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <input
        type="file"
        style={{ position: "absolute", zIndex: -1, visibility: "hidden" }}
        id="imageUpload"
        onChange={handleFileChange}
      />
      <input
        type="text"
        id="textInput"
        style={{
          position: "absolute",
          zIndex: -1,
          pointerEvents: "none",
          top: "-10rem",
        }}
        onChange={(e) => {
          if (isEditing === null) return;
          const index = isEditing;
          setShapes((prevShapes) => {
            const updatedShapes = [...prevShapes];
            updatedShapes[index] = {
              ...prevShapes[index],
              text: e.target.value,
            };
            return updatedShapes;
          });
        }}
      />
      <Stage
        ref={stageRef}
        width={window.innerWidth * 2}
        onClick={(e) =>
          handleClick(
            e,
            state,
            setShapes,
            setIsSelected,
            setIsEditing,
            stageRef,
            setState,
            selectedProps,
            optionsActive,
            setOptionsActive
          )
        }
        onMouseEnter={() => handleMouseEnter(stageRef, state)}
        onMouseLeave={() => handleMouseLeave(stageRef)}
        height={window.innerHeight * 2}
        onMouseDown={(e) =>
          handleMouseDown(e, state, setTempShapes, setInitialPos, selectedProps)
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
            state === "rectangle" ||
            state === "ellipse" ||
            state === "line" ||
            state === "arrow" ||
            state === "pencil" ||
            state === "image"
          ) {
            handleMouseUp(
              shapes,
              setShapes,
              tempShapes,
              setTempShapes,
              stageRef,
              setState
            );
          }
        }}
      >
        <Layer>
          {shapes.map((shape, i) => {
            if (shape.name === "rectangle") {
              return (
                <Rect
                  key={i}
                  x={shape.x}
                  y={shape.y}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.background || "transparent"}
                  cornerRadius={shape.corners == "round" ? 10 : 0}
                  dash={
                    shape.strokeStyle == "dashed"
                      ? [10, 5]
                      : shape.strokeStyle == "dotted"
                      ? [2, 5]
                      : null
                  }
                  opacity={shape.opacity || 1}
                  width={shape.width}
                  rotation={shape.rotation || 0}
                  height={shape.height}
                  draggable={state === "selection" || state === "hand-paper"}
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes)
                  }
                  onClick={(e) => {
                    handleTransformer(e, setIsSelected, state);
                  }}
                  onTransformEnd={() => {
                    const node = isSelected;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const rotation = node.rotation();
                    node.scaleX(1);
                    node.scaleY(1);
                    const updatedShapes = shapes;
                    updatedShapes[i].x = node.x();
                    updatedShapes[i].y = node.y();
                    updatedShapes[i].width = Math.max(5, node.width() * scaleX);
                    updatedShapes[i].height = Math.max(node.height() * scaleY);
                    updatedShapes[i].rotation = rotation;
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if (shape.name === "ellipse") {
              return (
                <Ellipse
                  key={i}
                  x={shape.x + shape.width / 2}
                  y={shape.y + shape.height / 2}
                  rotation={shape.rotation || 0}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.background || "transparent"}
                  dash={
                    shape.strokeStyle == "dashed"
                      ? [10, 5]
                      : shape.strokeStyle == "dotted"
                      ? [2, 5]
                      : null
                  }
                  opacity={shape.opacity || 1}
                  radiusX={shape.width / 2}
                  radiusY={shape.height / 2}
                  draggable={state === "selection" || state === "hand-paper"}
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes)
                  }
                  onClick={(e) => handleTransformer(e, setIsSelected, state)}
                  onTransformEnd={() => {
                    const node = isSelected;
                    const rotation = node.rotation();
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);
                    setShapes((prevShapes) => {
                      const updatedShapes = [...prevShapes];
                      updatedShapes[i] = {
                        ...updatedShapes[i],
                        x: node.x() - node.radiusX() * scaleX,
                        y: node.y() - node.radiusY() * scaleY,
                        width: Math.max(5, node.radiusX() * 2 * scaleX),
                        height: Math.max(5, node.radiusY() * 2 * scaleY),
                        rotation: rotation,
                      };
                      return updatedShapes;
                    });
                  }}
                />
              );
            } else if (shape.name === "line") {
              return (
                <Line
                  x={shape.x}
                  y={shape.y}
                  key={i}
                  points={shape.points}
                  rotation={shape.rotation || 0}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.stroke}
                  dash={
                    shape.strokeStyle == "dashed"
                      ? [10, 5]
                      : shape.strokeStyle == "dotted"
                      ? [2, 5]
                      : null
                  }
                  opacity={shape.opacity || 1}
                  draggable={state === "selection" || state === "hand-paper"}
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes)
                  }
                  onClick={(e) => handleTransformer(e, setIsSelected, state)}
                  onTransformEnd={() => {
                    const node = isSelected;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const rotation = node.rotation();

                    node.scaleX(1);
                    node.scaleY(1);
                    const updatedShapes = shapes;
                    updatedShapes[i].x = node.x();
                    updatedShapes[i].y = node.y();
                    updatedShapes[i].width = Math.max(5, node.width() * scaleX);
                    updatedShapes[i].height = Math.max(node.height() * scaleY);
                    updatedShapes[i].rotation = rotation;
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if (shape.name === "arrow") {
              return (
                <Arrow
                  x={shape.x}
                  y={shape.y}
                  key={i}
                  rotation={shape.rotation || 0}
                  points={shape.points}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.stroke}
                  dash={
                    shape.strokeStyle == "dashed"
                      ? [10, 5]
                      : shape.strokeStyle == "dotted"
                      ? [2, 5]
                      : null
                  }
                  opacity={shape.opacity || 1}
                  draggable={state === "selection" || state === "hand-paper"}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes, initialPos)
                  }
                  onDragStart={(e) => handleDragStartElement(e, setInitialPos)}
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onClick={(e) => handleTransformer(e, setIsSelected, state)}
                  onTransformEnd={() => {
                    const node = isSelected;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const rotation = node.rotation();

                    node.scaleX(1);
                    node.scaleY(1);
                    const updatedShapes = shapes;
                    updatedShapes[i].x = node.x();
                    updatedShapes[i].y = node.y();
                    updatedShapes[i].width = Math.max(5, node.width() * scaleX);
                    updatedShapes[i].height = Math.max(node.height() * scaleY);
                    updatedShapes[i].rotation = rotation;
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if (shape.name === "pencil") {
              return (
                <Line
                  x={shape.x}
                  y={shape.y}
                  points={shape.points}
                  key={i}
                  rotation={shape.rotation || 0}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth || 2}
                  fill={shape.background || "transparent"}
                  dash={
                    shape.strokeStyle == "dashed"
                      ? [10, 5]
                      : shape.strokeStyle == "dotted"
                      ? [2, 5]
                      : null
                  }
                  opacity={shape.opacity || 1}
                  draggable={state === "selection" || state === "hand-paper"}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes, initialPos)
                  }
                  onDragStart={(e) => handleDragStartElement(e, setInitialPos)}
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onClick={(e) => handleTransformer(e, setIsSelected, state)}
                  onTransformEnd={() => {
                    const node = isSelected;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const rotation = node.rotation();

                    node.scaleX(1);
                    node.scaleY(1);
                    const updatedShapes = shapes;
                    updatedShapes[i].x = node.x();
                    updatedShapes[i].y = node.y();
                    updatedShapes[i].width = Math.max(5, node.width() * scaleX);
                    updatedShapes[i].height = Math.max(node.height() * scaleY);
                    updatedShapes[i].rotation = rotation;
                    setShapes(updatedShapes);
                  }}
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
                  rotation={shape.rotation || 0}
                  width={shape.width}
                  cornerRadius={shape.corners == "round" ? 10 : 0}
                  opacity={shape.opacity || 1}
                  height={shape.height}
                  draggable={state === "selection" || state === "hand-paper"}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes, initialPos)
                  }
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onClick={(e) => handleTransformer(e, setIsSelected, state)}
                  onTransformEnd={() => {
                    const node = isSelected;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    const rotation = node.rotation();

                    node.scaleX(1);
                    node.scaleY(1);
                    const updatedShapes = shapes;
                    updatedShapes[i].x = node.x();
                    updatedShapes[i].y = node.y();
                    updatedShapes[i].width = Math.max(5, node.width() * scaleX);
                    updatedShapes[i].height = Math.max(node.height() * scaleY);
                    updatedShapes[i].rotation = rotation;
                    setShapes(updatedShapes);
                  }}
                />
              );
            } else if (shape.name === "text") {
              return (
                <Text
                  key={i}
                  x={shape.x}
                  y={shape.y}
                  rotation={shape.rotation || 0}
                  scaleX={shape.scaleX || 1}
                  fill={shape.background || "black"}
                  stroke={shape.stroke || "black"}
                  strokeWidth={shape.strokeWidth}
                  strokeStyle={shape.strokeStyle || "solid"}
                  fontFamily={shape.fontFamily || "Arial"}
                  opacity={shape.opacity || 1}
                  scaleY={shape.scaleY || 1}
                  text={isEditing == i ? shape.text + "|" : shape.text}
                  fontSize={shape.fontSize || 25}
                  draggable
                  onDblClick={() => {
                    const inputElement = document.getElementById("textInput");
                    inputElement.value = shape.text;
                    inputElement.click();
                    inputElement.focus();
                    setIsEditing(i);
                    setIsSelected(null);
                  }}
                  onMouseUp={() => handleMouseUpElement(stageRef, state)}
                  onMouseDown={() => handleMouseDownElement(stageRef, state)}
                  onMouseEnter={() => handleMouseEnterElement(stageRef, state)}
                  onDragEnd={(e) =>
                    handleDragEndElement(e, i, shapes, setShapes)
                  }
                  onClick={(e) => handleTransformer(e, setIsSelected, state)}
                  onTransformEnd={() => {
                    setShapes((prevShapes) => {
                      const updatedShapes = [...prevShapes];
                      const node = isSelected;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      const rotation = node.rotation();
                      node.scaleX(1);
                      node.scaleY(1);

                      updatedShapes[i] = {
                        ...prevShapes[i],
                        x: node.x(),
                        y: node.y(),
                        scaleX,
                        scaleY,
                        rotation,
                      };

                      return updatedShapes;
                    });
                  }}
                />
              );
            }
          })}
          {isSelected && (
            <Transformer
              anchorCornerRadius={5}
              rotateAnchorOffset={30}
              padding={5}
              nodes={[isSelected]}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
              keepRatio={false}
              boundBoxFunc={(oldBox, newBox) => {
                if (
                  Math.abs(newBox.width) < 10 ||
                  Math.abs(newBox.height) < 10
                ) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
          {tempShapes && tempShapes.name === "rectangle" ? (
            <Rect
              x={tempShapes.x}
              y={tempShapes.y}
              stroke={tempShapes.stroke || "black"}
              strokeWidth={tempShapes.strokeWidth || 2}
              fill={tempShapes.background || "transparent"}
              cornerRadius={tempShapes.corners == "round" ? 10 : 0}
              dash={
                tempShapes.strokeStyle == "dashed"
                  ? [10, 5]
                  : tempShapes.strokeStyle == "dotted"
                  ? [2, 5]
                  : null
              }
              opacity={tempShapes.opacity || 1}
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
              fill={tempShapes.background || "transparent"}
              dash={
                tempShapes.strokeStyle == "dashed"
                  ? [10, 5]
                  : tempShapes.strokeStyle == "dotted"
                  ? [2, 5]
                  : null
              }
              opacity={tempShapes.opacity || 1}
              radiusX={tempShapes.width / 2}
              radiusY={tempShapes.height / 2}
              draggable
            />
          ) : tempShapes.name === "line" ? (
            <Line
              points={tempShapes.points}
              stroke={tempShapes.stroke || "black"}
              strokeWidth={tempShapes.strokeWidth || 2}
              cornerRadius={tempShapes.corners == "round" ? 10 : 0}
              dash={
                tempShapes.strokeStyle == "dashed"
                  ? [10, 5]
                  : tempShapes.strokeStyle == "dotted"
                  ? [2, 5]
                  : null
              }
              opacity={tempShapes.opacity || 1}
              draggable
            />
          ) : tempShapes.name === "arrow" ? (
            <Arrow
              x={tempShapes.x}
              y={tempShapes.y}
              points={tempShapes.points}
              stroke={tempShapes.stroke || "black"}
              strokeWidth={tempShapes.strokeWidth || 2}
              dash={
                tempShapes.strokeStyle == "dashed"
                  ? [10, 5]
                  : tempShapes.strokeStyle == "dotted"
                  ? [2, 5]
                  : null
              }
              opacity={tempShapes.opacity || 1}
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
                dash={
                  tempShapes.strokeStyle == "solid"
                    ? null
                    : tempShapes.strokeStyle == "dashed"
                    ? [10, 5]
                    : [2, 5]
                }
                opacity={tempShapes.opacity || 1}
              />
            )
          )}
        </Layer>
      </Stage>
    </>
  );
}

export default Canvas;
