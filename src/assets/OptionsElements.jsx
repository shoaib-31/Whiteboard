import { FaGithub, FaTrash } from "react-icons/fa6";
import { IoMdPeople } from "react-icons/io";
import { IoImageOutline } from "react-icons/io5";

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
  {
    name: "Export",
    icon: <IoImageOutline style={{ color: "black" }} />,
  },
];
