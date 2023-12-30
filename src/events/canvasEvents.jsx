import { icons } from "../assets/TopPanelElements";

export const handleMouseEnter = (stageRef, state) => {
  if (stageRef.current) {
    const activeIcon = icons.find((icon) => icon.id === state.active);
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

export const handleMouseDown = (e, state, setTempShapes, setInitialPos) => {
  if (e.evt.buttons === 1) {
    if (state.active === "rectangle") {
      setInitialPos({ x: e.evt.layerX, y: e.evt.layerY });
      setTempShapes((prevShapes) => ({
        ...prevShapes,
        x: e.evt.layerX,
        y: e.evt.layerY,
        width: 0,
        height: 0,
        name: "rectangle",
      }));
    } else if (state.active === "ellipse") {
      setInitialPos({ x: e.evt.layerX, y: e.evt.layerY });
      setTempShapes((prevShapes) => ({
        ...prevShapes,
        x: e.evt.layerX,
        y: e.evt.layerY,
        width: 0,
        height: 0,
        name: "ellipse",
      }));
    } else if (state.active === "line") {
      setInitialPos({ x: e.evt.layerX, y: e.evt.layerY });
      setTempShapes({
        points: [e.evt.layerX, e.evt.layerY, e.evt.layerX, e.evt.layerY],
        name: "line",
        x: 0,
        y: 0,
      });
    } else if (state.active === "arrow") {
      setInitialPos({ x: e.evt.layerX, y: e.evt.layerY });
      setTempShapes({
        points: [e.evt.layerX, e.evt.layerY, e.evt.layerX, e.evt.layerY],
        name: "arrow",
        x: 0,
        y: 0,
      });
    } else if (state.active === "pencil") {
      setTempShapes({
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
    if (state.active === "rectangle" || state.active === "ellipse") {
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
    if (state.active === "line") {
      newShapes.points = [initialX, initialY, e.evt.layerX, e.evt.layerY];
      setTempShapes((prevShapes) => {
        return {
          ...prevShapes,
          points: newShapes.points,
        };
      });
    }
    if (state.active === "arrow") {
      newShapes.points = [initialX, initialY, e.evt.layerX, e.evt.layerY];
      setTempShapes((prevShapes) => {
        return {
          ...prevShapes,
          points: newShapes.points,
        };
      });
    }
    if (state.active === "pencil") {
      newShapes.points = [...newShapes.points, e.evt.layerX, e.evt.layerY + 20];
      setTempShapes((prevShapes) => {
        return {
          ...prevShapes,
          points: newShapes.points,
        };
      });
    }
    if (state.active === "eraser" && e.target !== e.target.getStage()) {
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

export const handleMouseUp = (shapes, setShapes, tempShapes, setTempShapes) => {
  const newShapes = [...shapes];
  newShapes.push({ ...tempShapes });
  setShapes(newShapes);
  setTempShapes({});
};
export const handleClick = (
  e,
  state,
  setShapes,
  setIsSelected,
  setIsEditing
) => {
  if (state.active == "text") {
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
};
