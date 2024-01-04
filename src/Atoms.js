import { atom } from "recoil";
const colors = ["#000", "#00f", "#0f0", "#f00", "#ff7c25"];
const backgroundOptions = [
  "transparent",
  "#8080ff",
  "#79ff90",
  "#63f7ff",
  "#fca2ff",
];

export const activeState = atom({
  key: "activeState",
  default: "hand-paper",
});
export const selectedState = atom({
  key: "selectedState",
  default: null,
  dangerouslyAllowMutability: true,
});
export const shapesState = atom({
  key: "shapesState",
  default: [],
});
export const propsState = atom({
  key: "propsState",
  default: {
    stroke: colors[0],
    background: backgroundOptions[0],
    strokeWidth: 2,
    strokeStyle: "solid",
    corners: "round",
    opacity: 1,
  },
});
