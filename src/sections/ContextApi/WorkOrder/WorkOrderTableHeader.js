import React, { createContext, useContext, useState  } from "react";

// Create the context
const WorkOrderTableHeader = createContext();

// Create a provider component
export const WorkOrderTableHeaderProvider  = ({ children }) => {
  // Shared state
  const [StoreHeaderData, setStoreHeaderData] = useState([]);

  const updateWorkOrderHeader = (newData) => {
    setStoreHeaderData(newData);
  };

  return (
    <WorkOrderTableHeader.Provider value={{ StoreHeaderData, updateWorkOrderHeader }}>
      {children}
    </WorkOrderTableHeader.Provider>
  );
};

// Custom hook to use the context
export const useWorkOrderHeaderData  = () => {
  return useContext(WorkOrderTableHeader);
};
