import React, { createContext, useContext, useState } from "react";

// Create the context
const SwalCloseContext = createContext();

// Create a provider component
export const SwalCloseProvider  = ({ children }) => {
  // Shared state
  const [swalCloseTime, setSwalCloseTime] = useState("2");

  const updateSwalCloseTime = (newData) => {
    setSwalCloseTime(newData);
  };

  return (
    <SwalCloseContext.Provider value={{ swalCloseTime, updateSwalCloseTime }}>
      {children}
    </SwalCloseContext.Provider>
  );
};

// Custom hook to use the context
export const useSwalCloseContext  = () => {
  return useContext(SwalCloseContext);
};
