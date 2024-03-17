import styled from "styled-components";
import { IoCopyOutline } from "react-icons/io5";
import { LuCopyCheck } from "react-icons/lu";
import { useState } from "react";

const Clipboard = ({ roomId }) => {
  const [copied, setCopied] = useState(false);
  const url = `http://${import.meta.env.VITE_HOST}:5173/${roomId}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };
  return (
    <Main>
      <URL>{url}</URL>
      <Copy
        onClick={() => {
          copyToClipboard();
          setCopied(true);
        }}
      >
        {copied ? <LuCopyCheck /> : <IoCopyOutline />}
      </Copy>
    </Main>
  );
};

export default Clipboard;
const Main = styled.div`
  width: 100%;
  display: flex;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #9b9b9b;
`;
const URL = styled.div`
  flex: 1;
  padding: 0.5rem;
`;
const Copy = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 0.5rem;
  background-color: #f0f0f0;
  cursor: pointer;
`;
