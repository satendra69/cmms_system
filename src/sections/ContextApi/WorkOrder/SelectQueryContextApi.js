import React, { createContext, useContext, useState  } from "react";

const CreateSelectQueryContext = createContext();

export const CreateSelectQueryContextProvider =({ children }) => {
    const [assetFilterDpd, setAssetFilterDpd] = useState([]);

    const updateAssetFilterDpd = (newData) => {
       
        setAssetFilterDpd(newData);
      };
    return(

        <CreateSelectQueryContext.Provider value ={{assetFilterDpd,updateAssetFilterDpd}} >
            {children}
         </CreateSelectQueryContext.Provider>
    );
};

// Custom hook to use the context
export const useCreateSelectQueryContext  = () => {
    return useContext(CreateSelectQueryContext);
  };
