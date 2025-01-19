import { createContext, useState } from 'react';

export const ProContext = createContext();

export const ProProvider = ({ children }) => {
  const [call, setCall] = useState(false); 
  const [savedQuery, setSavedQuery] = useState([]);
  const [savedOptions, setSavedQptions] = useState("");
  const [rowsPromptGlobal,setRowsPromptGlobal] = useState({})

  const [rowsPromptSortGlobal,setRowsPromptSortGlobal] = useState({})

  const [defineQyeryRetrive,setDefineQueryRetrive] = useState(false)

  const [refresh,setRefresh] = useState(false)




  return (
    <ProContext.Provider value={{ call, setCall,savedQuery,setSavedQuery,savedOptions,setSavedQptions,rowsPromptGlobal,setRowsPromptGlobal,setRowsPromptSortGlobal,rowsPromptSortGlobal,defineQyeryRetrive,setDefineQueryRetrive,setRefresh,refresh }}>
      {children}
    </ProContext.Provider>
  );
};

export default ProProvider;
