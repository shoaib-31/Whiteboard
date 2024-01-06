import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RecoilRoot } from "recoil";
import RecoilizeDebugger from "recoilize";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <RecoilizeDebugger />
    <App />
  </RecoilRoot>
);
