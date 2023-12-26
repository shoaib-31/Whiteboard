import styled from "styled-components";
import { useGlobalState } from "../hooks/useGlobalState";

const PanelElement = ({ id, icon, title }) => {
  const { state, dispatch } = useGlobalState();
  const handleClick = () => {
    dispatch({ type: "updateActive", payload: { active: id } });
  };
  return (
    <SquareContainer
      title={title}
      active={state.active == id}
      onClick={handleClick}
    >
      {icon}
    </SquareContainer>
  );
};

export default PanelElement;

const SquareContainer = styled.div`
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#d4ddff" : "white")};
  &:hover {
    background-color: ${(props) => (props.active ? "#d4ddff" : "#f0f0f0")};
  }
`;
