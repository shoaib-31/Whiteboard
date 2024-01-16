import { FaGithub, FaTrash } from "react-icons/fa6";
import { IoMdPeople } from "react-icons/io";

export const OptionsElements = [
  {
    name: "Clear Canvas",
    icon: <FaTrash style={{ color: "red" }} />,
  },
  {
    name: "Live Collaboration",
    icon: <IoMdPeople style={{ color: "black" }} />,
  },
  {
    name: "Github",
    icon: <FaGithub style={{ color: "black" }} />,
  },
];
