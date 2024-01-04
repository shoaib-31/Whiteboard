import { icons } from "../assets/TopPanelElements";

export const handleMouseUpElement = (stageRef, state) => {
  if (state === "hand-paper" || state === "selection") {
    if (stageRef.current) {
      const activeIcon = icons.find((icon) => icon.id === state);
      stageRef.current.container().style.cursor = activeIcon
        ? activeIcon.cursor
        : "default";
    }
  }
};

export const handleMouseDownElement = (stageRef, state) => {
  if (state === "hand-paper" || state === "selection") {
    if (state === "hand-paper") {
      stageRef.current.container().style.cursor = "grabbing";
    }
    if (state === "selection") {
      stageRef.current.container().style.cursor = "all-scroll";
    }
  }
};

export const handleMouseEnterElement = (stageRef, state) => {
  if (state === "selection") {
    if (stageRef.current) {
      stageRef.current.container().style.cursor = "all-scroll";
    }
  }
};

export const handleDragEndElement = (e, i, shapes, setShapes, initialPos) => {
  if (e.evt.buttons === 0) {
    const shape = shapes[i];
    let updatedShape = {};

    if (
      shape.name === "rectangle" ||
      shape.name === "image" ||
      shape.name === "text"
    ) {
      updatedShape = {
        ...shape,
        x: e.target.x(),
        y: e.target.y(),
      };
    } else if (shape.name === "ellipse") {
      updatedShape = {
        ...shape,
        x: e.target.x() - shape.width / 2,
        y: e.target.y() - shape.height / 2,
      };
    } else if (
      shape.name === "line" ||
      shape.name === "arrow" ||
      shape.name === "pencil"
    ) {
      const dx = e.target.x() - initialPos.x;
      const dy = e.target.y() - initialPos.y;
      updatedShape = {
        ...shape,
        x: shape.x + dx,
        y: shape.y + dy,
      };
    }
    setShapes((prevShapes) =>
      prevShapes.map((s, index) => (index === i ? updatedShape : s))
    );
  }
};

export const handleDragStartElement = (e, setInitialPos) => {
  if (e.evt.buttons === 1) {
    setInitialPos({ x: e.target.x(), y: e.target.y() });
  }
};
export const handleTransformer = (e, setIsSelected, state) => {
  if (state === "hand-paper") {
    setIsSelected(e.target);
  }
};
