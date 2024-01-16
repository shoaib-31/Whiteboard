import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import RecoilizeDebugger from "recoilize";
import { RecoilRoot } from "recoil";
import Room from "./Room.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilizeDebugger />
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:roomId" element={<Room />} />
        </Routes>
      </Router>
    </RecoilRoot>
  </React.StrictMode>
);
