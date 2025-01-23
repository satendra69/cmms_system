import React, { createContext, useContext, useEffect, useState  } from "react";
import httpCommon from "src/http-common";

// Create the context
const SwalCloseContext = createContext();

// Create a provider component
export const SwalCloseProvider  = ({ children }) => {
  // Shared state
  const [swalCloseTime, setSwalCloseTime] = useState(null);
  const site_ID = localStorage.getItem("site_ID");

  useEffect(()=>{
    async function fetchDefaultPopupCloseTimeData() {
      try{
        const response = await httpCommon.get(
          `/get_default_popup_close_data.php?site_cd=${site_ID}`
        );
      //  console.log("getTime___",response);
        if(response.data.status === "SUCCESS"){
          const timeSet = response.data.data.DeafultCloseTime[0].dft_mst_clo_popup;
          const timerInMilliseconds = timeSet ? timeSet * 1000 : 3000;
          setSwalCloseTime(timerInMilliseconds);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchDefaultPopupCloseTimeData();
  },[])

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
