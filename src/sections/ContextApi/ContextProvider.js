import React from "react";
import { SwalCloseProvider } from "./WorkOrder/SwalCloseContext";
import { WorkOrderTableHeaderProvider } from "./WorkOrder/WorkOrderTableHeader";
import {CreateSelectQueryContextProvider } from "./WorkOrder/SelectQueryContextApi";

const CombinedProvider = ({ children }) => {
  return (
<SwalCloseProvider>
      <WorkOrderTableHeaderProvider>
        
        <CreateSelectQueryContextProvider>
          {children}
        </CreateSelectQueryContextProvider>
      </WorkOrderTableHeaderProvider>
    </SwalCloseProvider>
  );
};

export default CombinedProvider;
