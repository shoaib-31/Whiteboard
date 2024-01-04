import styled from "styled-components";
import { useRecoilState } from "recoil";
import { activeState } from "../Atoms";

const PanelElement = ({ id, icon, title }) => {
  const [state, setState] = useRecoilState(activeState);
  const handleClick = () => {
    if (id == "image") {
      document.getElementById("imageUpload").click();
      setState("hand-paper");
    } else {
      setState(id);
    }
  };
  return (
    <SquareContainer title={title} active={state == id} onClick={handleClick}>
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
