import { createContext, useState } from 'react';

export const PeopleContext = createContext();

export const EmpProvider = ({ children }) => {
  const [call, setCall] = useState(false); 
  //const [savedQuery, setSavedQuery] = useState([]);
  const [savedOptions, setSavedQptions] = useState("");
  const [fullList, setFullList] = useState(false);
  const [rowsPromptGlobal,setRowsPromptGlobal] = useState({})

  const [rowsPromptSortGlobal,setRowsPromptSortGlobal] = useState({})

  const [defineQyeryRetrive,setDefineQueryRetrive] = useState(false)
  const [fixedTableData,setFixedTableData] = useState([]);
  const [GlobalRef,setGlobalRef] = useState([])


  return (
    <PeopleContext.Provider value={{ call, setCall,savedOptions,setSavedQptions,rowsPromptGlobal,setRowsPromptGlobal,setRowsPromptSortGlobal,rowsPromptSortGlobal,defineQyeryRetrive,setDefineQueryRetrive,fixedTableData,setFixedTableData }}>
      {children}
    </PeopleContext.Provider>
  );
};

export default EmpProvider;
