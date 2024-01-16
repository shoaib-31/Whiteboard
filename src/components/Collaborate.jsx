import styled from "styled-components";
import CollaborateImg from "/collaborate.png";
import { useState } from "react";
import Preloader from "/Preloader.gif";
import Clipboard from "./Clipboard";
const Collaborate = () => {
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const handleClick = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/create-room");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRoomId(data.roomId);
    } catch (error) {
      console.error("Error during fetch:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Main>
      <img src={CollaborateImg} />
      <Head>Collaborate on your ideas:</Head>
      <Button onClick={handleClick}>Live Collaboration</Button>
      {loading ? (
        <img src={Preloader} />
      ) : roomId ? (
        <Clipboard roomId={roomId} />
      ) : null}
    </Main>
  );
};

export default Collaborate;
const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;
const Head = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;
const Button = styled.button`
  background-color: #5a47ff;
  color: white;
  border: none;
  width: 100%;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #4630eb;
  }
`;
