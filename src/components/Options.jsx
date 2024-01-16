import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import { OptionsElements } from "../assets/OptionsElements";
import { useRecoilState } from "recoil";
import { collabModalState, optionsState, shapesState } from "../Atoms";
import { useParams } from "react-router-dom";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import Collaborate from "./Collaborate";
const Options = () => {
  const { roomId } = useParams();
  const [active, setActive] = useRecoilState(optionsState);
  //eslint-disable-next-line
  const [shapes, setShapes] = useRecoilState(shapesState);
  const [collabModalActive, setCollabModalActive] =
    useRecoilState(collabModalState);

  const handleClick = (item) => {
    switch (item) {
      case "Clear Canvas":
        if (!roomId) {
          localStorage.setItem("shapes", JSON.stringify([]));
        }
        setShapes([]);
        break;
      case "Live Collaboration":
        setCollabModalActive(true);
        break;
      case "Github":
        window.open("https://github.com/shoaib-31/Whiteboard", "_blank");
        break;
      default:
        break;
    }
    handleToggle();
  };
  const handleToggle = () => {
    setActive(!active);
  };
  return (
    <Main>
      <Bars onClick={handleToggle}>
        <FaBars />
      </Bars>
      {active && (
        <List>
          {OptionsElements.map((item, index) => {
            return (
              <Item key={index} onClick={() => handleClick(item.name)}>
                {item.icon}
                {item.name}
              </Item>
            );
          })}
        </List>
      )}
      <Modal
        open={collabModalActive}
        onClose={() => setCollabModalActive(false)}
        center
      >
        <Collaborate />
      </Modal>
    </Main>
  );
};

export default Options;
const Main = styled.div`
  top: 1rem;
  left: 1rem;
  position: fixed;
  z-index: 10;
`;
const Bars = styled.div`
  font-size: 1rem;
  background-color: white;
  border-radius: 4px;
  border: none;
  background-color: #e6e6e6;
  cursor: pointer;
  position: relative;
  padding: 0.5rem 0.5rem 0.25rem 0.5rem;
  &:active {
    outline: 1px solid #5a47ff;
  }
`;
const List = styled.div`
  position: absolute;
  z-index: 10;
  width: 10rem;
  background-color: white;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  top: 2.5rem;
  padding: 0.5rem;
`;
const Item = styled.div`
  border-radius: 4px;
  padding: 0.5rem;
  font-weight: 500;
  display: flex;
  gap: 5px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #f2f1f1;
  }
`;
