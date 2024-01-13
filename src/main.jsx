import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App.jsx";
import AnotherApp from "./AnotherApp.jsx"; // Import your second App component
import "./index.css";
import RecoilizeDebugger from "recoilize";
import { RecoilRoot } from "recoil";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilizeDebugger />
      <Router>
        <Switch>
          <Route path="/" element={App} />
          <Route path="/:roomId" element={AnotherApp} />
        </Switch>
      </Router>
    </RecoilRoot>
  </React.StrictMode>
);
