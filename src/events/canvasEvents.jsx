import { icons } from "../assets/TopPanelElements";

export const handleMouseEnter = (stageRef, state) => {
  if (stageRef.current) {
    const activeIcon = icons.find((icon) => icon.id === state);
    if (activeIcon) {
      stageRef.current.container().style.cursor = activeIcon.cursor;
    }
  }
};

export const handleMouseLeave = (stageRef) => {
  if (stageRef.current) {
    stageRef.current.container().style.cursor = "default";
  }
};

export const handleMouseDown = (
  e,
  state,
  setTempShapes,
  setInitialPos,
  selectedProps
) => {
  if (e.evt.buttons === 1) {
    if (state === "rectangle") {
      setInitialPos({ x: e.evt.layerX, y: e.evt.layerY });
      setTempShapes((prevShapes) => ({
        ...prevShapes,
        ...selectedProps,
        x: e.evt.layerX,
        y: e.evt.layerY,
        width: 0,
        height: 0,
        name: "rectangle",
      }));
    } else if (state === "ellipse") {
      setInitialPos({ x: e.evt.layerX, y: e.evt.layerY });
      setTempShapes((prevShapes) => ({
        ...selectedProps,
        ...prevShapes,
        x: e.evt.layerX,
        y: e.evt.layerY,
        width: 0,
        height: 0,
        name: "ellipse",
      }));
    } else if (state === "line") {
      setInitialPos({ x: e.evt.layerX, y: e.evt.layerY });
      setTempShapes({
        ...selectedProps,
        fill: selectedProps.stroke,
        points: [e.evt.layerX, e.evt.layerY, e.evt.layerX, e.evt.layerY],
        name: "line",
        x: 0,
        y: 0,
      });
    } else if (state === "arrow") {
      setInitialPos({ x: e.evt.layerX, y: e.evt.layerY });
      setTempShapes({
        ...selectedProps,
        points: [e.evt.layerX, e.evt.layerY, e.evt.layerX, e.evt.layerY],
        name: "arrow",
        x: 0,
        y: 0,
      });
    } else if (state === "pencil") {
      setTempShapes({
        ...selectedProps,
        points: [e.evt.layerX, e.evt.layerY + 20],
        name: "pencil",
        x: 0,
        y: 0,
      });
    }
  }
};

export const handleMouseMove = (
  e,
  state,
  tempShapes,
  setTempShapes,
  initialPos,
  shapes,
  setShapes
) => {
  if (e.evt.buttons === 1) {
    const initialX = initialPos.x;
    const initialY = initialPos.y;
    const newShapes = { ...tempShapes };
    if (state === "rectangle" || state === "ellipse") {
      newShapes.width = e.evt.layerX - initialX;
      newShapes.height = e.evt.layerY - initialY;
      if (newShapes.width < 0) {
        newShapes.x = e.evt.layerX;
        newShapes.width = Math.abs(newShapes.width);
      }
      if (newShapes.height < 0) {
        newShapes.y = e.evt.layerY;
        newShapes.height = Math.abs(newShapes.height);
      }
      setTempShapes((prevShapes) => {
        return {
          ...prevShapes,
          x: newShapes.x,
          y: newShapes.y,
          width: newShapes.width,
          height: newShapes.height,
        };
      });
    }
    if (state === "line") {
      newShapes.points = [initialX, initialY, e.evt.layerX, e.evt.layerY];
      setTempShapes((prevShapes) => {
        return {
          ...prevShapes,
          points: newShapes.points,
        };
      });
    }
    if (state === "arrow") {
      newShapes.points = [initialX, initialY, e.evt.layerX, e.evt.layerY];
      setTempShapes((prevShapes) => {
        return {
          ...prevShapes,
          points: newShapes.points,
        };
      });
    }
    if (state === "pencil") {
      newShapes.points = [...newShapes.points, e.evt.layerX, e.evt.layerY + 20];
      setTempShapes((prevShapes) => {
        return {
          ...prevShapes,
          points: newShapes.points,
        };
      });
    }
    if (state === "eraser" && e.target !== e.target.getStage()) {
      const shapeToDelete = shapes.find((shape) => {
        if (shape.name === "ellipse") {
          return (
            shape.x === e.target.x() - shape.width / 2 &&
            shape.y === e.target.y() - shape.height / 2
          );
        }
        return shape.x === e.target.x() && shape.y === e.target.y();
      });

      if (shapeToDelete) {
        const updatedShapes = shapes.filter((shape) => shape !== shapeToDelete);
        setShapes(updatedShapes);
      }
    }
  }
};

export const handleMouseUp = (
  shapes,
  setShapes,
  tempShapes,
  setTempShapes,
  stageRef,
  setState
) => {
  const newShapes = [...shapes];
  newShapes.push({ ...tempShapes });
  setShapes(newShapes);
  setTempShapes({});
  stageRef.current.container().style.cursor = "grab";
  setState("hand-paper");
};
export const handleClick = (
  e,
  state,
  setShapes,
  setIsSelected,
  setIsEditing,
  stageRef,
  setState
) => {
  if (state == "text") {
    setShapes((prevShapes) => {
      return [
        ...prevShapes,
        {
          x: e.evt.layerX,
          y: e.evt.layerY,
          text: "Text",
          name: "text",
        },
      ];
    });
  } else if (e.target == e.target.getStage()) {
    setIsSelected(null);
    setIsEditing(null);
  }
  stageRef.current.container().style.cursor = "grab";
  setState("hand-paper");
};
