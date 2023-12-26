import { FaRegCircle, FaRegSquare, FaPencil } from "react-icons/fa6";
import { FaLongArrowAltRight, FaRegHandPaper } from "react-icons/fa";
import { GoDash } from "react-icons/go";
import { CiText, CiImageOn } from "react-icons/ci";
import { LuEraser } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";

export const icons = [
  {
    id: "hand-paper",
    icon: <FaRegHandPaper />,
    title: "Hand (Panning Tool)",
    cursor: "grab",
  },
  {
    id: "selection",
    icon: <GiArrowCursor />,
    title: "Selection",
    cursor: "default",
  },
  { id: "circle", icon: <FaRegCircle />, title: "Circle", cursor: "crosshair" },
  {
    id: "rectangle",
    icon: <FaRegSquare />,
    title: "Rectangle",
    cursor: "crosshair",
  },
  {
    id: "arrow-right",
    icon: <FaLongArrowAltRight />,
    title: "Arrow",
    cursor: "crosshair",
  },
  { id: "dash", icon: <GoDash />, title: "Line", cursor: "crosshair" },
  { id: "text", icon: <CiText />, title: "Add Text", cursor: "text" },
  {
    id: "image-on",
    icon: <CiImageOn />,
    title: "Insert Image",
    cursor: "pointer",
  },
  {
    id: "pencil",
    icon: <FaPencil />,
    title: "Pencil",
    cursor: `url(/pencil.png), auto`,
  },
  {
    id: "eraser",
    icon: <LuEraser />,
    title: "Eraser",
    cursor: `url(/eraser.png), auto`,
  },
];
