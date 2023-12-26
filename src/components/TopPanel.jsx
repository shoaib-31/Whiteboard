import styled from "styled-components";
import PanelElement from "./PanelElement";
import { icons } from "../assets/TopPanelElements";

const Panelprop = {
  size: 40,
  color: "black",
};

const TopPanel = () => {
  return (
    <RectangularComponent>
      {icons.map(({ id, icon, title }) => (
        <PanelElement
          key={id}
          id={id}
          title={title}
          icon={icon}
          {...Panelprop}
        />
      ))}
    </RectangularComponent>
  );
};

export default TopPanel;

const RectangularComponent = styled.div`
  position: absolute;
  margin: auto;
  width: fit-content;
  z-index: 10;
  padding: 0.5rem;
  background-color: white;
  height: fit-content;
  display: flex;
  margin-top: 1rem;
  box-shadow: 5px 5px 10px #d0d0d0, -5px -5px 10px #d0d0d0;
  border-radius: 10px;
`;
