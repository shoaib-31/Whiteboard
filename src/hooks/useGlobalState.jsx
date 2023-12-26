import { createContext, useReducer, useContext } from "react";
import { icons } from "../assets/TopPanelElements.jsx";
const GlobalStateContext = createContext();

const globalStateReducer = (state, action) => {
  switch (action.type) {
    case "updateActive":
      state.active = action.payload;
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalStateReducer, {
    active: icons[0].id,
  });

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
