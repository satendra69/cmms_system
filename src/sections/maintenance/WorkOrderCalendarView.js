import React, { useState, useEffect,useRef,useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useNavigate,useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { ThreeCircles } from 'react-loader-spinner';

import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox } from '@mui/material';
import Swal from "sweetalert2";
//import withReactContent from "sweetalert2-react-content";
// routes
import { useRouter } from "src/routes/hooks";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";
import Iconify from "src/components/iconify";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// import { useHistory } from 'react-router-dom';
import httpCommon from "src/http-common";
import PropTypes from "prop-types";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import ExportWorkOrderlistToExcel from "./ExportFIle/ExportWorkOrderlistToExcel";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const defaultFilters = {
  name: "",
  publish: [],
  stock: [],
};

const WorkOrderCalendarView = () => {
const site_ID = localStorage.getItem("site_ID");
const emp_owner = localStorage.getItem("emp_mst_empl_id");
const AuditUser = localStorage.getItem("emp_mst_login_id");
const navigate = useNavigate();
const location = useLocation();
// const history = useHistory();
const [isLoading, setIsLoading] = useState(false);
const [events2, setEvents] = useState([]);
const localizer = momentLocalizer(moment);
const popover = usePopover();
const [calendarFilterDpd, setCalendarFilterDpd] = useState([]);
const [isInputFocused, setInputFocused] = useState(false);
const inputRef = useRef(null);
const [filters, setFilters] = useState(defaultFilters);
const [selectDropRowID, setselectDropRowID] = useState("");
const [TitleAstReg, setTitleAstReg] = useState("");
const { selectDropRowID: returnedSelectedOption, selectedOptionBack,comeBack } = location.state || {};
const [selectedOption, setSelectedOption] = useState(selectedOptionBack || '');
const [showPromt, setShowPromt] = useState(false);
const [tempRowID, setTempRowID] = useState(null);
const [ExportExcelId, setExportExcelId] = useState("");
const [rowsDropdownPrompt, setRowsDropdownPrompt] = useState([
  {
    selectedOption: "",
    operator: "",
    logical: "",
    valuept: "",
    RowId:"",
    prompt:"",
    siteCd: site_ID,
    queryTypedd: "F",
  },
]);
const [currentPage, setCurrentPage] = useState(1);
const [DropListIdGet, setDropListIdGet] = useState(
  location.state?.DropListId || []
);
const [selectedOptionEmptyError, setSelectedOptionEmptyError] =
useState(false);
const [valueptEmptyError, setValueptEmptyError] = useState(false);
const [logicalEmptyError, setLogicalEmptyError] = useState(false);
const router = useRouter();
const [ignoreEffect, setIgnoreEffect] = useState(false);
const [DefineQueryBtn, setDefineQueryBtn] = useState("");
const [FilterShow, setFilterShow] = useState(false);

const [wkoFiledname, setwkoFiledname] = useState([]);
const [isChecked, setIsChecked] = useState(false);

const [showWordOrderQryList, setShowWordOrderQryList] = useState(false);
const handleShowWorkOrderQryList = () => setShowWordOrderQryList(true);
const [showSave, setShowSave] = useState(false);
const [selectedOptionEmptyErrorShort, setSelectedOptionEmptyErrorShort] =
useState(false);
const [selectedOptionValue, setselectedOptionValue] = useState();
const [showSaveAs, setShowSaveAs] = useState(false);
const [selectedOptionEmptyErrorQtr, setSelectedOptionEmptyErrorQtr] =
useState(false);

const [valueptEmptyErrorQtr, setValueptEmptyErrorQtr] = useState(false);
const [logicalEmptyErrorQtr, setLogicalEmptyErrorQtr] = useState(false);
const [
  selectedOptionEmptyErrorShortQtr,
  setSelectedOptionEmptyErrorShortQtr,
] = useState(false);
const [inputValueSearch, setInputValueSearch] = useState('');

  const [rows, setRows] = useState([
    {
      selectedOption: "",
      operator: "Like",
      logical: "AND",
      prompt: "0",
      valuept: "",
      siteCd: site_ID,
      queryTypedd: "F",
    },
  ]);
    // Short By State
  const [rowsort, setRowsort] = useState([
    {
      selectedOptionShort: "",
      promptAsd: "ASC",
      siteCd: site_ID,
      queryType: "S",
    },
  ]);

  const fetchEvents = async () => {
    try {
      const response = await httpCommon.get(
        `/get_work_order_calender_data.php?site_cd=${site_ID}`
      );
      console.log("response_____calendar",response);
      const formattedEvents = response.data.data.CalendarData.map((item) => ({
        start: new Date(item.wko_mst_org_date.date),
        end: new Date(item.wko_mst_org_date.date),
        title: `${item.wko_mst_wo_no}`,
        status: `${item.wko_mst_status}`,
        rowId: `${item.RowID}`,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  useEffect(() => {
    // if (ignoreEffect) {
    //   setIgnoreEffect(false); // Reset the flag
    //   return;
    // }
    if (selectDropRowID !== "" && selectDropRowID !== null) {
      // fetchData();
   //   console.log("Enter with selectDropDown id");
      getb();
      
     }else{

    
    fetchEvents();
    fetchFilterSubPopupSavedropdon();
  }
  }, [site_ID,selectDropRowID]);

  // Event click handler

  const handleEventClick = useCallback(
    
    (events2) => {
      const Rowid = events2.rowId;
      if (Rowid !== '' && Rowid !== null) {
        navigate(`/dashboard/work/neworder`, {
          state: {
            RowID:Rowid,
            currentPage,
            selectDropRowID,
            selectedOption,
            ModuleFrom:"CalendarModule",
          },
        });
      }
    },
    [router,currentPage, selectDropRowID,selectedOption]
  );

  const fetchFilterSubPopupSavedropdon = async () => {
    // Get dropdown value using api
   
    try {
      const response = await httpCommon.get(
        `/get_work_order_subsave_filter_dropdown.php?site_cd=${site_ID}&auditUser=${AuditUser}`
      );
    //  console.log("response____dropdown",response);
      setCalendarFilterDpd(response.data);
     
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    setInputValueSearch(e.target.value);
  };
  const handleResetFilters = useCallback(() => {
    setInputValueSearch('');
    if (inputRef.current) {
      inputRef.current.value = ''; 
    }
    fetchEvents();
  }, [fetchEvents]);

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const inputValue2 = inputRef.current.value;
      const newValue = inputValue2.slice(0, -1);
      inputRef.current.value = newValue;
      if (newValue === "") {
        handleResetFilters();
      }
    }
    if (event.key === 'Enter' && inputRef.current.value.trim() !== '') {

      handelSearchButton();
  
    }
  };
  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };
  const handleClearButton = () => {
    handleResetFilters();
    if (inputRef.current) {
      inputRef.current.focus(); // Refocus the input field
    }
  };
// Filter button funcation
  const handelFilterAction = () => {
    setIgnoreEffect(true); 
    setselectDropRowID("");
    setCurrentPage(1);
    const updatedEmptyRows = rows.map((row) => ({
      // empty state data
      ...row,
      selectedOption: "",
      logical: "",
      operator:"",
      valuept: "",
      logical:"",
    }));
    setRows(updatedEmptyRows);

  const updatedEmptyRowsort = rowsort.map((rowsort) => ({
      // empty state data
      ...rowsort,
      selectedOptionShort: "",
    }));
    setRowsort(updatedEmptyRowsort);
    setDefineQueryBtn("");
    if (rows.length > 1) {
      const newRows = [rows[0]]; // Keep only the first row
      setRows(newRows);
    }
  
    // Call handleDeleteRowShort to remove all rowsort except the first one
    if (rowsort.length >= 1) {
      const newRowsort = [rowsort[0]]; // Keep only the first row
      setRowsort(newRowsort);
    }
    setFilterShow(true);
    getWorkorderLebel();
  };

/* Filter Action Button code  */
const getWorkorderLebel = async () => {
  try {
    const response = await httpCommon.get("/get_work_order_filter_name.php");
    if (response.data.status == "SUCCESS") {
      setwkoFiledname(response.data.data);
      //setAstdetLabel(response.data.data.ast_det);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const handelQuryListpopup = () => {
  handleShowWorkOrderQryList();
};
  // Retrive button  funcation,setTableData
  const RetriveData = async () => {
       console.log("popup__retrive___enteer-__");
       let hasEmptyOperator = false;
       let hasEmptyValuept = false;
       let hasEmptyLogical  = false;
       for (const row of rows) {
         
         if (!row.operator) {
             hasEmptyOperator = true;
         }
         if (!row.valuept) {
             hasEmptyValuept = true;
         }
        
     }
     if(DefineQueryBtn === ""){
       console.log("Enter this code_____");
       if (hasEmptyOperator || hasEmptyValuept) {
         let fieldName = '';
         if (hasEmptyOperator && hasEmptyValuept && hasEmptyLogical) {
             fieldName = "Operator and Value";
         } else if (hasEmptyOperator) {
             fieldName = "Operator";
         } else if (hasEmptyValuept) {
             fieldName = "Value";
         }
         Swal.close();
         toast.error(`Please fill the required field: ${fieldName}`, {
             position: "top-center",
             autoClose: 5000,
             hideProgressBar: false,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
             progress: undefined,
             theme: "light",
             transition: Bounce,
             style: {
                 width: "400px", 
             }
         });
         return false;
       }
     }
     
       Swal.fire({
         title: "Please Wait !",
         allowOutsideClick: false,
         customClass: {
           container: "swalcontainercustom",
         },
       });
       Swal.showLoading();
   
       setCurrentPage(1);
       setTitleAstReg("");
       setEvents("");
       setDropListIdGet("");
     //  setDashbordDataGauge([]);
       setSelectedOption("");
       setselectDropRowID("");
   
     
       try {
         const response = await httpCommon.post(
           "/get_retrive_popup_filed_data.php?page=" + currentPage,
           {
             rows: rows,
             rowsort: rowsort,
             SiteCD: site_ID,
             admin: emp_owner,
           }
         );
         console.log("popup__retrive___",response);
         if (
           response.data.status === "SUCCESS"
         ) {
          // setTableData(response.data.data.result);
          // setTotalRow(response.data.total_count);
   
           setSelectedOption(response.data.titleName);
           setselectDropRowID(response.data.SelectId);
           setExportExcelId(response.data.SelectId);
           
           setDefineQueryBtn("RetriveData");
           const updatedEmptyRows = rows.map((row) => ({
             // empty state data
             ...row,
             selectedOption: "",
             logical: "",
             valuept: "",
           }));
           setRows(updatedEmptyRows);
   
         const updatedEmptyRowsort = rows.map((rowsort) => ({
             // empty state data
             ...rowsort,
             selectedOptionShort: "",
           }));
           setRowsort(updatedEmptyRowsort);
           Swal.close();
           FilterhandleClose();
       
         } else {
           const updatedEmptyRows = rows.map((row) => ({
             // empty state data
             ...row,
             selectedOption: "",
             logical: "",
             valuept: "",
           }));
           setRows(updatedEmptyRows);
   
         const updatedEmptyRowsort = rows.map((rowsort) => ({
             // empty state data
             ...rowsort,
             selectedOptionShort: "",
           }));
           setRowsort(updatedEmptyRowsort);
           Swal.fire({
             title: "Oops..!",
             text: "No Record Found!",
             icon: "success",
             customClass: {
               container: "swalcontainercustom",
             },
           }).then(() => {
             Swal.close();
             FilterhandleClose();
           });
         }
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
   const RetriveDataAllData = async () =>{
    // console.log("retrive_ All Data");
     setEvents("");
     setSelectedOption("");
     setTitleAstReg("");
     setselectDropRowID("");
     setDropListIdGet("");
   //  setDashbordDataGauge([]);
   
     Swal.fire({
       title: "Please Wait !",
       allowOutsideClick: false,
       customClass: {
         container: "swalcontainercustom",
       },
     });
       Swal.showLoading();
     try {
       const response = await httpCommon.post(
         "/get_retrive_all_data.php?page=" + currentPage,
         {
           SiteCD: site_ID,
           admin: emp_owner,
         }
       );
       console.log("response___getAll",response);
       if (
         response.data.data &&
         response.data.data.result &&
         response.data.data.result.length > 0
       ) {
        const formattedEvents = response.data.data.result.map((item) => ({
          start: new Date(item.col9),
          end: new Date(item.col9),
          title: `${item.col2}`,
          status: `${item.col6}`,
          rowId: `${item.col71}`,
        }));
        setEvents(formattedEvents);
         setSelectedOption(response.data.titleName);
         setselectDropRowID(response.data.titleRowId);
         setExportExcelId(response.data.titleRowId);
   
         Swal.close();
         FilterhandleClose();
         const updatedEmptyRows = rows.map((row) => ({
           // empty state data
           ...row,
           selectedOption: "",
           logical: "",
           valuept: "",
         }));
         setRows(updatedEmptyRows);
   
         const updatedEmptyRowsort = rows.map((rowsort) => ({
           // empty state data
           ...rowsort,
           selectedOptionShort: "",
         }));
         setRowsort(updatedEmptyRowsort);
       } else {
         Swal.fire({
           title: "Opps..!",
           text: "No Record Found!",
           icon: "success",
           customClass: {
             container: "swalcontainercustom",
           },
         });
       }
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   }
const retriveBtn = () => {
  if (rows.some((row) => row.selectedOption !== "")) {
    RetriveData();
 
  }else{
   // console.log("click to");
    RetriveDataAllData();
  
  }
};
const SaveRegTbl = () => {
  setShowSave(true);
};


const handleCloseSave = () => {
  setShowSave(false);
  setFormDataSv({
    queryName: "",
    description: "",
  });
};
const isButtonDisabled = rows.some((row) => row.selectedOption === "");

const Openbracket = [
  { value: "(", label: "(" },
  { value: "", label: "" },
];
const Closebracket = [
  { value: "(", label: ")" },
  { value: "", label: "" },
];

const oprt = [
  { value: "like", label: "Like" },
  { value: "not like", label: "Not Like" },
  { value: "I=", label: "Is" },
  { value: "!=", label: "Is not" },
  { value: "=", label: "Equal to" },
  { value: ">", label: "Greater than" },
  { value: "<", label: "Less than" },
  { value: ">=", label: "Greater than or equal to" },
  { value: "<=", label: "Less than or equal to" },
  { value: "<>", label: "Not equal to" },
];
const Logcl = [
  { value: "And", label: "And" },
  { value: "Or", label: "Or" },
];
const [QueryTitleRowId, setQueryTitleRowID] = useState("");
  // Handel Query List popup
  const [rowsQrt, setRowsQrt] = useState([
    {
      selectedOption: "",
      operator: "",
      logical: "",
      prompt: "",
      valuept: "",
      siteCd: site_ID,
      queryTypedd: "F",
    },
  ]);
  //Sorting data append rowsQrt rowsortQrt
  const [rowsortQrt, setRowsortQrt] = useState([
    {
      selectedOptionShort: "",
      promptAsd: "",
      siteCd: site_ID,
      queryType: "S",
    },
  ]);

  const RetriveDataQueryList = async () => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.post(
        "/get_retrive_popup_filed_data.php?page=" + currentPage,
        {
          rows: rowsQrt,
          rowsort: rowsortQrt,
          SiteCD:site_ID,
          admin:emp_owner
        }
      );
    // console.log("response___retrive first save button",response);
      //setTableData(response.data.data.result);
      //setTotalRow(response.data.total_count);

      setSelectedOption(response.data.titleName);
      setselectDropRowID(response.data.SelectId);
      setExportExcelId(response.data.SelectId);

      Swal.close();
      FilterhandleClose();
      const updatedEmptyRows = rowsQrt.map((row) => ({
        // empty state data
        ...row,
        selectedOption: "",
        logical: "",
        valuept: "",
      }));
      setRows(updatedEmptyRows);

      const updatedEmptyRowsort = rowsortQrt.map((rowsort) => ({
        // empty state data
        ...rowsort,
        selectedOptionShort: "",
      }));
      setRowsort(updatedEmptyRowsort);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

const handleOptionChange1 = (index, selectedOption) => {
  const updatedRows = [...rows];
  updatedRows[index].selectedOption = selectedOption;
  setSelectedOptionEmptyError(false);
  setRows(updatedRows);
};
const DeleteAssetRegQryList = async () => {
  const [cf_query_title, RowID] = selectedOptionValue.split("-");

  if (selectedOptionValue && RowID !== "") {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to delete " + cf_query_title + " query!",
        icon: "warning",
        customClass: {
          container: "swalcontainercustom",
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await httpCommon.get(
            "/WorkOrderQueryListDataDelete.php?value=" +
              RowID +
              "&siteId=" +
              site_ID
          );

          if (response.data.status == "SUCCESS") {

            fetchFilterSubPopupSavedropdon();
            //  setErrord(null);
            setselectedOptionValue("");
            setRowsQrt([]);
            setRowsortQrt([]);
          
            setEvents("");
            setSelectedOption("");
            setselectDropRowID("");
            handleCloseWorkQryList();

            Swal.fire("Deleted!", "Your query has been deleted.", "success");
          }
        }
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    console.log("empty");
  }
};
const SaveWorkOrderQryList = async () => {
  const [cf_query_title, RowID] = selectedOptionValue.split("-");
  const isAnySelectedOptionShortEmpty = rowsortQrt.some(
    (row) => !row.selectedOptionShort
  );
  if (isAnySelectedOptionShortEmpty && RowID != "") {
  } else {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    const combinedData = {
      rowsQrtData: rowsQrt,
      siteCd: site_ID,
      owner: emp_owner,
      mst_RowID: RowID,
      defaultFlag:isChecked,
      rowsortQrtData: rowsortQrt,
    };
    try {
      const response = await httpCommon.post(
        "/insert_work_order_query_listsave_data.php",
        combinedData
      );
      //  console.log("response__SaveBytncf__",response);
      if (response.data.status == "SUCCESS") {
      //  setSelectedOption(cf_query_title);
       // setselectDropRowID(RowID);

        Swal.close();
        Swal.fire({
          title: "Success!",
          text: "Your query update successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            container: "swalcontainercustom",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            setRows([
              {
                selectedOption: "", // Reset selected option or other fields accordingly
                operator: "",
                prompt: false,
                value: "",
                logical: "",
              },
            ]);
          
            // Resetting rowsort state to have only one empty row
            setRowsort([
              {
                selectedOptionShort: "",
                promptAsd: "ASC",
                siteCd: site_ID,
                queryType: "S",
              },
            ]);

            setIsChecked(false);
            setRowsQrt([]);
            setselectedOptionValue("");
            setRowsortQrt([]);
    
            RetriveDataQueryList();
            handleCloseWorkQryList();


          }
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
const SaveAsworkorderTbl = () => {
  setShowSaveAs(true);
};

// fetch data using dropdon
const handleClickOption = async (selectedOption) => {
  setselectedOptionValue(selectedOption);

  let cf_query_title, RowID;

  const hyphenCount = selectedOption.split("-").length - 1;

  if(hyphenCount === 1){
     [cf_query_title, RowID] = selectedOption.split("-")
  }else{
    const parts = selectedOption.split("-");
    cf_query_title = parts[0].trim();
    RowID = parts[parts.length - 1].trim();
  }

 // setTitleAstReg(cf_query_title);
  if(RowID !== "" && cf_query_title !==""){
    setQueryTitleRowID(RowID);
 // setIsChecked(true);
  const initialCheckedState = calendarFilterDpd.some(
    item => item.RowID === RowID && item.cf_query_title === cf_query_title && item.cf_query_default_flag === "1"
  );

  setIsChecked(initialCheckedState);

}else{
  setIsChecked(false);
}

  setRowsQrt([]);
  setRowsortQrt([]);
  if (selectedOption !== "") {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        "/get_work_order_filter_query_data.php?site_cd=" +
          site_ID +
          "&RowID=" +
          RowID
      );
      //  console.log("response____fluter___",response);
      if (response.data.data && response.data.data.list_typeF && response.data.data.list_typeF.length > 0) {
        const newRows = response.data.data.list_typeF.map((item) => ({
          selectedOption: item.cf_query_list_column,
          operator: item.cf_query_list_operator,
          prompt: item.cf_query_list_prompt,
          valuept: item.cf_query_list_value,
          logical: item.cf_query_list_logical,
          siteCd: site_ID,
          queryTypedd: "F",
        }));
        const timeoutId = setTimeout(() => {
          Swal.close();
          setRowsQrt((prevrowsQrt) => [...prevrowsQrt, ...newRows]);
        }, 3000);
        //setShowAssetByDescp(false);
      } else {
        Swal.fire({
          icon: "error",

          customClass: {
            container: "swalcontainercustom",
          },
          title: "Oops...",
          text: "No record found Please try again !",
        });
      }
      if (response.data.data && response.data.data.list_typeS.length > 0) {
        const newRows = response.data.data.list_typeS.map((item) => ({
          selectedOptionShort: item.cf_query_list_column,
          promptAsd: item.cf_query_list_order_by,
          queryType: "S",
          siteCd: site_ID,
        }));

        // Append newRows to the existing tableData

        const timeoutId = setTimeout(() => {
          Swal.close();
          setRowsortQrt((rowsortQrt) => [...rowsortQrt, ...newRows]);
        }, 3000);
        //setShowAssetByDescp(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};
const handleCheckboxClick = () => {
  setIsChecked(!isChecked);
};
const handleOptionChangeQtr = (index, selectedOption) => {
  const updatedRowsQtr = [...rowsQrt];
  updatedRowsQtr[index].selectedOption = selectedOption;
  setSelectedOptionEmptyErrorQtr(false);
  setRowsQrt(updatedRowsQtr);
};

const handleOptionChangeOprterQtr = (index, operator) => {
  const updatedRowsQtr = [...rowsQrt];
  updatedRowsQtr[index].operator = operator;
  setRowsQrt(updatedRowsQtr);
};
const handleOptionChangeSrtQtr = (index, selectedOptionShort) => {
  const updatedRowsQtr = [...rowsortQrt];
  updatedRowsQtr[index].selectedOptionShort = selectedOptionShort;
  setSelectedOptionEmptyErrorShortQtr(false);
  setRowsortQrt(updatedRowsQtr);
};
const handleSelectChangeshortQtr = (index, checked) => {
  const newRows = [...rowsortQrt];
  newRows[index].promptAsd = checked ? "ASC" : "DESC";
  setRowsortQrt(newRows);
};
const handleAddRowQrt = () => {
  const isLastRowEmpty =
    rowsQrt.length > 0 &&
    (!rowsQrt[rowsQrt.length - 1].selectedOption ||
      rowsQrt[rowsQrt.length - 1].selectedOption === "");

  if (isLastRowEmpty) {
    setSelectedOptionEmptyErrorQtr(!isLastRowEmpty.selectedOption);
    setValueptEmptyErrorQtr(!isLastRowEmpty.valuept);
    setLogicalEmptyErrorQtr(!isLastRowEmpty.logical);
  } else {
    // Add a new row
    setRowsQrt((prevRows) => [
      ...prevRows,
      {
        selectedOption: "",
        operator: "Like",
        logical: "",
        prompt: "0",
        valuept: "",
        siteCd: site_ID,
        queryTypedd: "F",
      },
    ]);
    setSelectedOptionEmptyErrorQtr(false);
    setValueptEmptyErrorQtr(false);
    setLogicalEmptyErrorQtr(false);
  }
};
const handleAddRowShortQrt = () => {
  const isLastRowEmpty =
    rowsortQrt.length > 0 &&
    (!rowsortQrt[rowsortQrt.length - 1].selectedOptionShort ||
      rowsortQrt[rowsortQrt.length - 1].selectedOptionShort === "");

  if (isLastRowEmpty) {
    setSelectedOptionEmptyErrorShortQtr(!isLastRowEmpty.selectedOptionShort);
    //  setSelectedCheckEmptyErrorShortQtr(!isLastRowEmpty.promptAsd);
  } else {
    // Add a new row
    setRowsortQrt((prevRows) => [
      ...prevRows,
      {
        selectedOptionShort: "",
        promptAsd: "",
        siteCd: site_ID,
        queryType: "S",
      },
    ]);
    setSelectedOptionEmptyErrorShortQtr(false);
    // setSelectedCheckEmptyErrorShortQtr(false);
  }
};
const handleSelectChangeQtr = (index, checked) => {
  const newRows = [...rowsQrt];
  newRows[index].prompt = checked ? "1" : "0";
  setRowsQrt(newRows);
};
const handleDeleteRowQrt = (index) => {
  if (rowsQrt.length > 1) {
    const newRows = [...rowsQrt];
    newRows.splice(index, 1);
    setRowsQrt(newRows);
  }
};
const handleDeleteRowShortQrt = (index) => {
  if (rowsortQrt.length > 1) {
    const newRows = [...rowsortQrt];
    newRows.splice(index, 1);
    setRowsortQrt(newRows);
  }
};
const handleInputValueChangeQtr2 = (index, newValue) => {
  const updatedRowsQtr = [...rowsQrt];
  updatedRowsQtr[index].valuept = newValue;
  //setValueptEmptyErrorQtr(false);
  setRowsQrt(updatedRowsQtr);
};

const handleCloseSaveAs = () => {
  setShowSaveAs(false);
  setFormDataSv({
    queryName: "",
    description: "",
  });
};
const handleCFQrySaveAsBtn = () => {
  if (formDataSv.queryName.trim() !== "") {
    const inputValue = formDataSv.queryName;
    const matchingOption = calendarFilterDpd.find(
      (option) => option.cf_query_title === inputValue
    );
    if (matchingOption) {
      //setMessage('Input value matches an option in the list.');
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to overwrite the query" + " " + inputValue,
        icon: "warning",
        customClass: {
          container: "swalcontainercustom",
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          if (
            rowsQrt?.selectedOption?.trim() !== "" &&
            rowsQrt?.logical?.trim() !== "" &&
            rowsQrt?.valuept?.trim() !== "" &&
            rowsortQrt?.selectedOptionShort?.trim() !== ""
          ) {
            InsertCf_queryListDataSavaAs();
          }
        }
      });
    } else {
      InsertCf_queryListDataSavaAs();
    }
  } else {
    console.log("empty__");
  }
};
const InsertCf_queryListDataSavaAs = async () => {
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");

  Swal.fire({
    title: "Please Wait !",
    allowOutsideClick: false,
    customClass: {
      container: "swalcontainercustom",
    },
  });
  Swal.showLoading();
  const combinedData = {
    formDataSv: formDataSv,
    rowsQrtData: rowsQrt,
    rowsortQrtData: rowsortQrt,
    SITE_CD: site_ID,
    OWNER_ID: emp_owner,
    availability: "G",
  };

  try {
    const response = await httpCommon.post(
      "/Insert_work_order_query_list_save_as_data.php",
      combinedData
    );
//console.log("savaAs resp____",response);
    if (response.data.status == "SUCCESS") {
    
    //  setSelectedOption(response.data.Title);
    //  setselectDropRowID(response.data.ROW_ID);
    //  setExportExcelId(response.data.ROW_ID);
      fetchFilterSubPopupSavedropdon();
      RetriveDataQueryList();
      setRowsQrt([]);
      setselectedOptionValue("");
      setRowsortQrt([]);
      Swal.close();
      handleCloseSave();
      FilterhandleClose();
      handleCloseSaveAs();
      handleCloseWorkQryList();
    }
  } catch (error) {
    Swal.close();
    console.error("Error fetching data:", error);
  }
};
const [formDataSv, setFormDataSv] = useState([
  {
    queryName: "",
    description: "",
    availability: "G",
    site_cd: site_ID,
    owner: emp_owner,
  },
]);

const handleInputChangeSav = (event) => {
  const { name, value } = event.target;
  setFormDataSv((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};
const handleOptionChangeOprter = (index, operator) => {
  const updatedRows = [...rows];
  updatedRows[index].operator = operator;
  setRows(updatedRows);
};
const handleSelectChange = (index, checked) => {
  const newRows = [...rows];
  newRows[index].prompt = checked ? "1" : "0";
  setRows(newRows);
};
const handleInputValueChangeQtr = (index, newValue) => {
  const updatedRowsQtr = [...rows];
  updatedRowsQtr[index].valuept = newValue;
  setValueptEmptyError(false);
  setRows(updatedRowsQtr);
  // Check if the selectedOption and valuept are empty
  if (!newValue && !updatedRowsQtr[index].selectedOption) {
    //  setSelectedOptionEmptyErrorQtr(true);
    //  setValueptEmptyErrorQtr(true);
  } else {
    // setSelectedOptionEmptyErrorQtr(false);
    //  setValueptEmptyErrorQtr(false);
  }
};
const handleIncludeChangeLogcil = (index, logical) => {
  const updatedRows = [...rows];
  updatedRows[index].logical = logical.target.value;
  setLogicalEmptyError(false);
  setRows(updatedRows);
};

const handleAddRow = () => {
  const isLastRowEmpty =
    rows.length > 0 &&
    (!rows[rows.length - 1].selectedOption ||
      rows[rows.length - 1].selectedOption === "");

  if (isLastRowEmpty) {
    setSelectedOptionEmptyError(!isLastRowEmpty.selectedOption);
    setValueptEmptyError(!isLastRowEmpty.valuept);
    setLogicalEmptyError(!isLastRowEmpty.logical);
  } else {
    // Add a new row
    setRows((prevRows) => [
      ...prevRows,
      {
        selectedOption: "",
        operator: "Like",
        logical: "",
        prompt: "0",
        valuept: "",
        siteCd: site_ID,
        queryTypedd: "F",
      },
    ]);
    setSelectedOptionEmptyError(false);
    setValueptEmptyError(false);
    setLogicalEmptyError(false);
  }
};
const handleDeleteRowPopup = (index) => {
  if (rows.length > 1) {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  }
};
// Short By code

const handleOptionChange2 = (index, selectedOptionShort) => {
  const updatedRows = [...rowsort];
  updatedRows[index].selectedOptionShort = selectedOptionShort;
  setSelectedOptionEmptyErrorShort(false);
  setRowsort(updatedRows);
};
const handleSelectChangeshort = (index, checked) => {
  const newRows = [...rowsort];
  newRows[index].promptAsd = checked ? "ASC" : "DESC";
  setRowsort(newRows);
};
const handleAddRowShort = () => {
  if (rowsort[rowsort.length - 1].selectedOptionShort === "") {
    setSelectedOptionEmptyErrorShort(
      rowsort[rowsort.length - 1].selectedOptionShort === ""
    );
  } else {
    const newRow = {
      selectedOptionShort: "",
      promptAsd: "ASC",
    };
    setRowsort([...rowsort, newRow]);
  }
};
const handleDeleteRowShort = (index) => {
  if (rowsort.length > 1) {
    const newRows = [...rowsort];
    newRows.splice(index, 1);
    setRowsort(newRows);
  }
};
const rowOptions = wkoFiledname.map((row) => ({
  value: row.column_name,
  label: `${row.default_label}`,
}));

const handleCloseWorkQryList = () => {
  setShowWordOrderQryList(false);
  FilterhandleClose();
  handleCloseSave();
  setselectedOptionValue("");
  setRowsQrt([]);
  setRowsortQrt([]);
};

  const handelSearchButton = async () => {
    const inputValueGet = inputRef.current.value;
  //  console.log("inputValueGet____",inputValueGet);
    if (inputValueGet !== "" && inputValueGet !== null) {
      Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
      Swal.showLoading();
      try {
        const response = await httpCommon.get(
          `/get_calender_view_search_data.php?site_cd=${site_ID}&searchTerm=${inputValueGet}`
        );
         // console.log("response____search___",response);
          if(response.data.status === "SUCCESS"){
            Swal.close();
            if (response.data?.data?.SearchData?.length > 0) {
             // console.log("enter___here__");
              const formattedEvents = response.data.data.SearchData.map((item) => ({
                start: new Date(item.wko_mst_org_date.date),
                end: new Date(item.wko_mst_org_date.date),
                title: `${item.wko_mst_wo_no}`,
                status: `${item.wko_mst_status}`,
                rowId: `${item.RowID}`,
              }));
              setEvents(formattedEvents);
            }
          }
          else{
            Swal.close();
            Swal.fire({
              title: "Opps..!",
              text: "No record found!",
              icon: "error",
              customClass: {
                container: "swalcontainercustom",
              },
            });
          }
      
      }catch (error) {
        console.error("Error fetching data:", error);
      }
    } 
  }
  const handleOptionChange = async (event,responseData) => {
    const selectedValue = event?.target?.value || selectedOption;
    console.log("selectedValue_____",selectedValue);

    const selectedOptionObjectFilter = calendarFilterDpd.find(
      (item) => item.cf_query_title === selectedValue
    );

    let selectedOptionObject;

    if (Array.isArray(responseData) && responseData.length > 0) {
      selectedOptionObject = responseData.find(
        (item) => item.cf_query_title === selectedValue
      );
    }
    if (selectedOptionObjectFilter) {
      const GetRowID = selectedOptionObjectFilter.RowID;
      const GetPrompt = selectedOptionObjectFilter.cf_query_list_prompt;
      console.log("check__id",GetRowID);
      console.log("GetPrompt__id",GetPrompt);
      if(GetPrompt === '1'){
      //  console.log("after select dropdown")
        setShowPromt(true);
        setTempRowID(GetRowID);
        setExportExcelId(GetRowID);
        setIsLoading(true);
        try {
          const response = await httpCommon.get(
            "/get_work_order_filter_query_data.php?site_cd=" +
              site_ID +
              "&RowID=" +
              GetRowID
          );
          
          if (response.data.data && response.data.data.list_typeF && response.data.data.list_typeF.length > 0) {
            const newRows = response.data.data.list_typeF.map((item) => ({
              selectedOption: item.cf_query_list_column,
              operator: item.cf_query_list_operator,
              valuept: item.cf_query_list_value,
              logical: item.cf_query_list_logical,
              siteCd: site_ID,
              RowId: GetRowID,
              prompt:GetPrompt,
              Column:item.customize_header,
              queryTypedd: "F",
            }));
            setRowsDropdownPrompt(newRows);
            setSelectedOption(selectedValue);
            //setShowAssetByDescp(false);
          } else {
            setSelectedOption(selectedValue);
           // setIsLoading(false);
            Swal.fire({
              icon: "error",
              customClass: {
                container: "swalcontainercustom",
              },
              title: "Oops...",
              text: "No record found Please try again !",
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }finally {
          setIsLoading(false);
        
        }
        return;
      }
    //  console.log("GetRowID___first",GetRowID);
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
    //  setDashbordDataPrmMst([]);
      // setDashbordDataGauge([]);
      setTitleAstReg("");
    }else{
      const GetRowID = selectedOptionObject.RowID;

      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
    //  setDashbordDataPrmMst([]);
     // setDashbordDataGauge([]);
      setTitleAstReg("");
    }
    setSelectedOption(selectedValue);

  }

  const getb = useCallback(async () => {
    const controller = new AbortController(); // Create an instance of AbortController
     const signal = controller.signal; // Get the signal object
    setIsLoading(true);
   
    console.log("enter___Fetching data..");
    try {
     
      
      const response = await httpCommon.post(
        `/get_workorder_list_select_option_data.php?site_cd=${site_ID}&ItemID=${selectDropRowID}&page=${currentPage}&EmpId=${emp_owner}`,
        { signal } // Pass the signal to the request
      );
        console.log("response___getb",response);
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        const formattedEvents = response.data.data.result.map((item) => ({
          start: new Date(item.col9),
          end: new Date(item.col9),
          title: `${item.col2}`,
          status: `${item.col6}`,
          rowId: `${item.col71}`,
        }));
        setEvents(formattedEvents);
        
        Swal.close();
       
      } else {
        setEvents([]);
      //  setTotalRow(0);
      //  setIsLoading(false);
        Swal.fire({
          title: "Opps..!",
          text: "No Record Found!",
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
     //   console.log("Request was cancelled");
      } else {
        console.error("Error fetching data:", error);
      }
    }finally {
      // Set the loading state to false in all cases
      setIsLoading(false);
      controller.abort();
    }
  }, [site_ID, currentPage, selectDropRowID,emp_owner]);

  const handleClosePromt = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return; // Do nothing on backdrop click or escape key press
    }
    setRowsDropdownPrompt([
      {
        selectedOption: "",
        operator: "",
        logical: "",
        valuept: "",
        RowId:"",
        prompt:"",
        siteCd: site_ID,
        queryTypedd: "F",
      },
    ]);
    setShowPromt(false);
  };

  const handleInputValueChangePrompt = (index, newValue) => {
    setRowsDropdownPrompt((prevRows) =>
      prevRows.map((row, idx) =>
        idx === index ? { ...row, valuept: newValue } : row
      )
    );
  };

  const fetchDataResponse = async (hasRowIdValuept) => {
    try {
  
      const response = await httpCommon.post(
        "/get_work_order_dropdown_prompt_data.php?page=" + currentPage,
        {
          rows: rowsDropdownPrompt,
          rowsort: "",
          SiteCD:site_ID,
          admin:emp_owner,
          RowId:hasRowIdValuept
        }
      );

      setSelectedOption(response.data.titleName);
      setselectDropRowID(response.data.TitleId);
      setExportExcelId(response.data.TitleId);
      Swal.close();
    
      handleClosePromt();
  
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
  }

  const handleDropDownPromptSaveAsBtn = async () => {
    const hasEmptyValuept = rowsDropdownPrompt.some(row => !row.valuept.trim());
    const hasRowIdValuept = rowsDropdownPrompt.length > 0 ? rowsDropdownPrompt[0].RowId : null;
  
    if (hasEmptyValuept) {
      // Show error message if any valuept field is empty
      Swal.fire({
        icon: 'error',
        title: "Validation Error !",
        text: 'Please fill in value field before saving.',
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      return; // Exit the function if validation fails
    }else{
      // Swal.fire({
      //   title: "Please Wait !",
      //   allowOutsideClick: false,
      //   customClass: {
      //     container: "swalcontainercustom",
      //   },
      // });
      // Swal.showLoading();
      const combinedData = {
        rowsQrtData: rowsDropdownPrompt,
        siteCd: site_ID,
        RowId:  hasRowIdValuept,
        owner: emp_owner,
      };
      try {
        const response = await httpCommon.post(
          "/insert_work_order_query_dropdown_listsave.php",
          combinedData
        );
          
        if (response.data.status == "SUCCESS") {
         // Swal.close();
          fetchDataResponse(hasRowIdValuept);
         // setselectDropRowID(tempRowID);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
  };
  const fetchDataUsingRefreshBtn = useCallback(async () =>{
    getb();
}, [site_ID, currentPage, selectDropRowID]);

const FilterhandleClose = () => {
  // Resetting rows state to have only one empty row
  setRows([
    {
      selectedOption: "", // Reset selected option or other fields accordingly
      operator: "",
      prompt: false,
      value: "",
      logical: "",
    },
  ]);

  // Resetting rowsort state to have only one empty row
  setRowsort([
    {
      selectedOptionShort: "",
      promptAsd: "ASC",
      siteCd: site_ID,
      queryType: "S",
    },
  ]);

  // Close the dialog
  setFilterShow(false);
};
//Save Button click to
const handleCFQrySave = () => {
  if (formDataSv.queryName.trim() !== "") {
    const inputValue = formDataSv.queryName;
    const matchingOption = calendarFilterDpd.find(
      (option) => option.cf_query_title === inputValue
    );
    if (matchingOption) {
      //setMessage('Input value matches an option in the list.');
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to overwrite the query" + " " + inputValue,
        icon: "warning",
        customClass: {
          container: "swalcontainercustom",
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          if (
            rows?.selectedOption?.trim() !== "" &&
            rows?.logical?.trim() !== "" &&
            rows?.valuept?.trim() !== "" &&
            rowsort?.selectedOptionShort?.trim() !== ""
          ) {
            InsertCf_queryListData();
          }
        }
      });
    } else {
      InsertCf_queryListData();
    }
  } else {
   // console.log("empty__");
  }
};
// Insert Cf_query Api with Query List popup data
const InsertCf_queryListData = async () => {
  Swal.fire({
    title: "Please Wait !",
    allowOutsideClick: false,
    customClass: {
      container: "swalcontainercustom",
    },
  });
  Swal.showLoading();
  const combinedData = {
    formDataSv: formDataSv,
    rowsQrtData: rows,
    rowsortQrtData: rowsort,
    site_cd: site_ID,
    owner: emp_owner,
    availability: "G",
  };

  try {
    const response = await httpCommon.post(
      "/inser_work_order_filter_save_data.php",
      combinedData
    );
   
    if (response.data.status == "SUCCESS") {
    //  setTitleAstReg(response.data.Title);
      setSelectedOption(response.data.Title);
      setselectDropRowID(response.data.ROW_ID);
      fetchFilterSubPopupSavedropdon();
     // RetriveData();
      handleDeleteRowPopup();
      handleDeleteRowShort();
      Swal.close();
      handleCloseSave();

      FilterhandleClose();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const minStartDate = events2.length > 0
    ? new Date(Math.min(...events2.map(event => new Date(event.start).getTime())))
    : new Date();  // Fallback to current date if events2 is empty or undefined
  return (
    <>
     <div className="workReqpage calendarView">
      <Card>
         <Stack
            spacing={2}
            alignItems={{ xs: "flex-end", md: "center" }}
            direction={{
              xs: "column",
              md: "row",
            }}
            sx={{
              p: 2.5,
              pr: { xs: 2.5, md: 1 },
              marginTop: "20px",
            }}
          >
              <Button
                  className="AssetFilterBtn"
                  variant="outlined"
                  sx={{
                    flexShrink: 0,
                  }}
                  onClick={handelFilterAction}
                >
                  <Icon
                    icon="fluent:filter-12-filled"
                    style={{ marginRight: "5px" }}
                  />
                  
                  Filter
                </Button>
                <FormControl
                  sx={{
                    flexShrink: 0,
                    width: { xs: 1, md: 300 },
                  }}
                  className="selectOptioncls"
                >
                  
               <InputLabel id="select-label" className={(TitleAstReg!== "" || selectedOption)? "selectedcss" : ""}>Select an Query</InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    className="customeSelectOptioncls"
                    value={TitleAstReg !== "" ? TitleAstReg : selectedOption}
                    // value={selectedOption}
                    onChange={handleOptionChange}
                    
                    sx={{ textTransform: "capitalize" }}
                  >
                    {calendarFilterDpd.map((item) => (
                      <MenuItem key={item.RowID} value={item.cf_query_title}>
                        <Iconify
                          icon="mdi:sql-query"
                          style={{
                            display: "inline-flex",
                            verticalAlign: "middle",
                            marginRight: "6px",
                            marginTop: "-5px",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                        <span style={{ verticalAlign: "middle" }}>
                          {item.cf_query_title}
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> 

                <Tooltip title="Refresh" placement="top" arrow >
                
                    <span
                      className={`ListDataRefBtn ${selectDropRowID === "" ? "disabled" : ""}`}
                      onClick={selectDropRowID !== "" ? fetchDataUsingRefreshBtn : null}
                        style={{ border: '0px' }}
                    >
                      <Icon icon="icon-park:refresh-one" style={{ width:'23px', height:'23px' }} /> 
                    </span>
                </Tooltip>

                 
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    flexGrow={1}
                    sx={{ width: 1 }}
                  >
                    <div
                      className={`wordkOrdersearchInput ${
                        isInputFocused ? "active" : ""
                      }`}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="text"
                        className="Seachrinput"
                        placeholder="Search.."
                        ref={inputRef}
                        value={inputValueSearch} 
                        onChange={handleSearchInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {inputValueSearch && (
                          <IconButton
                            onClick={handleClearButton}
                            className="customclearbutton"
                          >
                            <Iconify icon="ic:outline-clear" />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={handelSearchButton}
                          className="customsearchbutton"
                        >
                          <Iconify icon="eva:search-fill" />
                        </IconButton>
                      </div>
                    </div>
                   
                </Stack>
          </Stack>
          
      </Card>
     </div>

      <div className="ViewPartCal">
        <div style={{ height: "500px" }}>
          <Calendar
            localizer={localizer}
            events={events2}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            statusAccessor="status"
            views={["month", "week", "day"]}
            defaultView="month"
            defaultDate={new Date(minStartDate.getFullYear(), minStartDate.getMonth(), 1)} 
            // Start at the first day of the month and year of the earliest event
            style={{ marginBottom: "20px" }}
            selectable
            onSelectEvent={handleEventClick}
          />
        </div>
      </div>
      {/* =============================== filter DropDown Prompt  =================================  */}
      <BootstrapDialog
        onClose={handleClosePromt}
        aria-labelledby="customized-dialog-title"
        open={showPromt}
        maxWidth="md"
        fullWidth
        disableBackdropClick={true} 
        disableEscapeKeyDown={true}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Query Prompter</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleClosePromt()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
        <DialogContent dividers>
          <div className="astSubpopup">
            <fieldset className="Subpopup-fieldset">
              <legend>Please Fill In The Value</legend>
              {isLoading ? (
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <ThreeCircles
            radius="9"
            visible={true}
            ariaLabel="three-circles-loading"
            color="green"
         
          />
            
          </div>
        ) : (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                   
                    <th>Column</th>
                    <th>Operator</th>
                    <th>Value</th>
                    <th>Logical</th>
                
                  </tr>
                </thead>
                <tbody>
                  {rowsDropdownPrompt.map((row, index) => {
                    const isRowEmpty = !row.selectedOption && !row.operator && !row.valuept;
                    return !isRowEmpty ? (
                    <tr key={index}>
                      <td style={{ width: "25%" }}>
                      <input
                          type="text"
                          style={{ width: "100%", textAlign: 'center' }}
                          disabled
                          value={row.Column || ""}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          
                        />
                      </td>

                      <td style={{ width: "25%" }}>
                      <input
                          type="text"
                          style={{ width: "100%", textAlign: 'center' }}
                          value={row.operator || ""}
                          disabled
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          
                        />
                      </td>
                      <td style={{ width: "25%" }}>
                      <input
                          type="text"
                          style={{ width: "100%", textAlign: 'center' }}
                          value={row.valuept || ""}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                         
                          onChange={(event) => handleInputValueChangePrompt(index, event.target.value)}
                        />
                       
                      </td>
                      <td style={{ width: "25%" }}>
                        <input
                          type="text"
                          style={{ width: "100%", textAlign: 'center' }}
                          disabled
                          value={row.logical || ""}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          
                        />
                      </td>
                      
                    </tr>
                    ) : null;
                  })}
                </tbody>
              </table>
             )}
            </fieldset>

          </div>
        </DialogContent>
        <DialogActions>
          <Grid item>
            <Button variant="outlined" 
            className="SaveButton"
            style={{
                   backgroundColor: "#4CAF50",
                   color: "white",
                   marginRight: "10px",
                 }}
            onClick={handleDropDownPromptSaveAsBtn}>
              <Iconify icon="iconoir:submit-document" /> Retrieve
            </Button>
          </Grid>
        </DialogActions>
      </BootstrapDialog>

      {/* =============================== filter model  =================================  */}
      <BootstrapDialog
        onClose={FilterhandleClose}
        aria-labelledby="customized-dialog-title"
        open={FilterShow}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="mdi:sql-query" />
          <span style={{ marginLeft: "2px" }}>Define Query</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={FilterhandleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
        <DialogContent dividers>
          <div className="queryBtn">
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="outlined" onClick={handelQuryListpopup}>
                  <Iconify icon="carbon:query-queue" /> Query List
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  //disabled={isButtonDisabled}
                  onClick={retriveBtn}
                >
                  <Iconify icon="carbon:data-base" /> Retrieve
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={SaveRegTbl}
                  disabled={isButtonDisabled}
                >
                  <Iconify icon="mingcute:save-fill" />
                  Save
                </Button>
              </Grid>
            </Grid>
          </div>
          <div className="filterByorder">
            <fieldset className="short-by-fieldset2">
              <legend>Filter By</legend>
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}> ( </th>
                    <th>Field Name</th>
                    <th>Operator</th>
                    <th>Prompt</th>
                    <th>Value</th>
                    <th>Logical</th>
                    <th style={{ textAlign: "center" }}> ) </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td style={{ width: "7%" }}>
                        <Select
                          className="custom-Astselect"
                          style={{ width: "100%" }}
                        >
                          {Openbracket.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ width: "25%" }}>
                        <Select
                          className={`custom-Astselect ${
                            index === rows.length - 1 &&
                            selectedOptionEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          style={{ width: "100%" }}
                          // value={/* add the corresponding value from your state */}
                          onChange={(event) =>
                            handleOptionChange1(index, event.target.value)
                          }
                        >
                          {rowOptions.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>

                      <td style={{ width: "17%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className="custom-Astselect"
                          onChange={(event) =>
                            handleOptionChangeOprter(index, event.target.value)
                          }
                        >
                          {oprt.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ width: "8%" }}>
                        <input
                          style={{ width: "100%" }}
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckChecked"
                          onChange={(e) =>
                            handleSelectChange(index, e.target.checked)
                          }
                        />
                      </td>
                      <td style={{ width: "26%" }}>
                        <input
                          type="text"
                          style={{ width: "100%" }}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          onChange={(event) =>
                            handleInputValueChangeQtr(index, event.target.value)
                          }
                        />
                      </td>
                      <td style={{ width: "10%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && logicalEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          // value={/* add the corresponding value from your state */}
                          onChange={(logical) =>
                            handleIncludeChangeLogcil(index, logical)
                          }
                        >
                          {Logcl.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ width: "7%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className="custom-Astselect"
                          // value={/* add the corresponding value from your state */}
                          //  onChange={(event) => handleOptionChange1(index, event.target.value)}
                        >
                          {Closebracket.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td>
                        <IconButton
                          className="clsBtn"
                          aria-label="delete"
                          size="small"
                          onClick={() => handleDeleteRowPopup(index)}
                        >
                          <Iconify icon="carbon:close" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleAddRow} className="AddFilterBtn">
                  <Iconify
                    icon="material-symbols:add"
                    style={{
                      verticalAlign: "0px",
                      fontSize: "16px",
                      marginRight: "2px",
                    }}
                  />
                  Add new filter
                </Button>
              </div>
            </fieldset>
          </div>
          <div className="filterShort">
            <fieldset className="short-by-fieldset2">
              <legend>Sort By</legend>
              <table>
                <thead>
                  <tr>
                    <th>Field Name</th>
                    <th></th>
                    <th></th>
                    <th>Ascending?</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsort.map((row, index) => (
                    <tr key={index}>
                      <td style={{ width: "60%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className={`custom-Astselect shrt ${
                            index === rowsort.length - 1 &&
                            selectedOptionEmptyErrorShort
                              ? "error-border"
                              : "mammama"
                          }`}
                          // value={/* add the corresponding value from your state */}
                          onChange={(event) =>
                            handleOptionChange2(index, event.target.value)
                          }
                        >
                          {rowOptions.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>

                      <td style={{ width: "15%" }}></td>
                      <td style={{ width: "15%" }}></td>
                      <td style={{ width: "10%" }}>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          checked={rowsort[index].promptAsd === "ASC"}
                          onChange={(e) =>
                            handleSelectChangeshort(index, e.target.checked)
                          }
                          id="flexCheckDefault"
                          style={{
                            width: "65px",
                            height: "15px",
                            marginTop: "-5px",
                          }}
                        />
                      </td>
                      <td></td>
                      <td>
                        <IconButton
                          className="clsBtn"
                          aria-label="delete"
                          size="small"
                          onClick={() => handleDeleteRowShort(index)}
                        >
                          <Iconify icon="carbon:close" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleAddRowShort} className="AddFilterBtn">
                  <Iconify
                    icon="material-symbols:add"
                    style={{
                      verticalAlign: "0px",
                      fontSize: "16px",
                      marginRight: "2px",
                    }}
                  />
                  Add new filter
                </Button>
              </div>
            </fieldset>
          </div>
        </DialogContent>
      </BootstrapDialog>

      {/* =============================== filter model Query List Button  =================================  */}
      <BootstrapDialog
        onClose={handleCloseWorkQryList}
        aria-labelledby="customized-dialog-title"
        open={showWordOrderQryList}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="mdi:sql-query" />
          <span style={{ marginLeft: "2px" }}> Query List</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseWorkQryList}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
        <DialogContent dividers>
          <div className="queryBtn">
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="outlined" onClick={DeleteAssetRegQryList} disabled={!selectedOptionValue}>
                  <Iconify icon="fluent:delete-48-regular" /> Delete
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveWorkOrderQryList} disabled={!selectedOptionValue}>
                  <Iconify icon="ic:outline-save-as" /> Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveAsworkorderTbl} disabled={!selectedOptionValue}>
                  <Iconify icon="fad:saveas" />
                  Save As
                </Button>
              </Grid>
            </Grid>
          </div>
          <div>
            <div className="shortBydd list mt-4">
              <div className="table-containeR">
                <fieldset className="Query-by-fieldset">
                  <legend>Query Name</legend>
                  <table className="custom-tablE">
                    <thead>
                      <tr>
                        <th style={{ width: "100%" }}>Query Title</th>

                        <th style={{ width: "10%" }}>Default?</th>
                      </tr>
                    </thead>
                    <tbody>
                     
                    <Select
                    id="select"
                    style={{ width: "60%" }}
                    value={selectedOptionValue}
                    onChange={(event) => handleClickOption(event.target.value)}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {calendarFilterDpd.map((item) => (
                      <MenuItem key={item.RowID} value={`${item.cf_query_title}-${item.RowID}`}>
                        {item.cf_query_title}
                        {selectedOptionValue !== `${item.cf_query_title}-${item.RowID}` && item.cf_query_default_flag == 1 && (
                          <FormControlLabel
                            label="Default"
                            labelPlacement="start"
                            style={{ marginLeft: 'auto' }}
                            control={<Checkbox checked={item.cf_query_default_flag == 1} />}
                            componentsProps={{
                              typography: {
                                style: { marginRight: '5px' }
                              }
                            }}
                          />
                        )}
                      </MenuItem>
                    ))}
                  </Select>

                      <td>
                       
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          checked={isChecked}
                          onChange={handleCheckboxClick}
                          style={{
                            width: "65px",
                            height: "15px",
                            marginTop: "-5px",
                          }}
                        />

                      </td>
                    </tbody>
                  </table>
                </fieldset>
              </div>
            </div>
            <div className="FiltrBydd mt-2">
              <div>
                <fieldset className="short-by-fieldset2">
                  <legend>Filter By</legend>
                  <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "center", width: "7%" }}>(</th>
                        <th style={{ width: "25%" }}>Field Name</th>
                        <th style={{ width: "17%" }}>Operator</th>
                        <th style={{ width: "8%" }}>Prompt</th>
                        <th style={{ width: "26%" }}>Value</th>
                        <th style={{ width: "10%" }}>Logical</th>
                        <th style={{ textAlign: "center", width: "7%" }}>)</th>
                      </tr>
                    </thead>

                    <tbody>
                     
                      {rowsQrt.map((row, index) => (
                        <React.Fragment key={index}>
                          <tr key={index}>
                            <td style={{ width: "7%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className="custom-Astselect"
                              >
                                {Openbracket.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td style={{ width: "25%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className={`custom-Astselect ${
                                  index === rowsQrt.length - 1 &&
                                  selectedOptionEmptyErrorQtr
                                    ? "error-border"
                                    : "mammama"
                                }`}
                                value={row.selectedOption || ""}
                                onChange={(event) =>
                                  handleOptionChangeQtr(
                                    index,
                                    event.target.value
                                  )
                                }
                              >
                                {rowOptions.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td style={{ width: "17%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className="custom-Astselect"
                                value={row.operator || "Like"}
                                onChange={(event) =>
                                  handleOptionChangeOprterQtr(
                                    index,
                                    event.target.value
                                  )
                                }
                              >
                                {oprt.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td style={{ width: "8%" }}>
                              <input
                                class="form-check-input"
                                type="checkbox"
                                onChange={(e) =>
                                  handleSelectChangeQtr(index, e.target.checked)
                                }
                                checked={row.prompt === "1"}
                                id="flexCheckDefault"
                                style={{
                                  width: "65px",
                                  height: "15px",
                                  marginTop: "-5px",
                                }}
                              />
                            </td>
                            <td style={{ width: "26%" }}>
                              <input
                                type="text"
                                style={{ width: "100%" }}
                                className={`custom-Astselect ${
                                  index === rowsQrt.length - 1 &&
                                  valueptEmptyErrorQtr
                                    ? "error-border"
                                    : "mammama"
                                }`}
                                value={row.valuept || ""}
                                oninput="handleInput(event)"
                                onChange={(event) =>
                                  handleInputValueChangeQtr2(
                                    index,
                                    event.target.value
                                  )
                                }
                              />
                            </td>

                            <td style={{ width: "10%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className={`custom-Astselect ${
                                  index === rowsQrt.length - 1 &&
                                  logicalEmptyErrorQtr
                                    ? "error-border"
                                    : "mammama"
                                }`}
                                value={row.logical || ""}
                                // value={/* add the corresponding value from your state */}
                                // onChange={(logical) =>
                                //   handleIncludeChangeLogcilQtr(index, logical)
                                // }
                              >
                                {Logcl.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>

                            <td style={{ width: "7%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className="custom-Astselect"

                                // value={rowOptions.find(option => option.value === row.selectedOption)}
                                //onChange={(selectedOption) => handleOptionChange1(index, selectedOption)}
                              >
                                {Closebracket.map((option, index) => (
                                  <MenuItem key={index} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>

                            <td>
                              <IconButton
                                className="clsBtn"
                                aria-label="delete"
                                size="small"
                                onClick={() => handleDeleteRowQrt(index)}
                              >
                                <Iconify icon="carbon:close" />
                              </IconButton>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={handleAddRowQrt} className="AddFilterBtn">
                      <Iconify
                        icon="material-symbols:add"
                        style={{
                          verticalAlign: "0px",
                          fontSize: "16px",
                          marginRight: "2px",
                        }}
                      />
                      Add new filter
                    </Button>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="shortBydd mt-4 shtQtr">
              <div>
                <fieldset className="short-by-fieldset">
                  <legend>Sort By</legend>
                  <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th>Field Name</th>
                        <th></th>
                        <th></th>
                        <th>Ascending?</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rowsortQrt.map((row, index) => (
                        <tr key={index}>
                          <td style={{ width: "60%" }}>
                            <Select
                              style={{ width: "100%" }}
                              className={`custom-Astselect sht ${
                                index === rowsortQrt.length - 1 &&
                                selectedOptionEmptyErrorShortQtr
                                  ? "error-border"
                                  : "mammama"
                              }`}
                              // value={/* add the corresponding value from your state */}
                              onChange={(event) =>
                                handleOptionChangeSrtQtr(
                                  index,
                                  event.target.value
                                )
                              }
                              value={row.selectedOptionShort || ""}
                            >
                              {rowOptions.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </td>
                          <td style={{ width: "15%" }}></td>
                          <td style={{ width: "15%" }}></td>
                          <td style={{ width: "8%" }}>
                            <input
                              class="form-check-input"
                              type="checkbox"
                              //checked={row.prompt === '1'}
                              checked={rowsortQrt[index].promptAsd === "ASC"}
                              onChange={(e) =>
                                handleSelectChangeshortQtr(
                                  index,
                                  e.target.checked
                                )
                              }
                              id="flexCheckDefault"
                              style={{
                                width: "65px",
                                height: "15px",
                                marginTop: "-5px",
                              }}
                            />
                          </td>
                          <td></td>
                          <td>
                            <IconButton
                              className="clsBtn"
                              aria-label="delete"
                              size="small"
                              onClick={() => handleDeleteRowShortQrt(index)}
                            >
                              <Iconify icon="carbon:close" />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      onClick={handleAddRowShortQrt}
                      className="AddFilterBtn"
                    >
                      <Iconify
                        icon="material-symbols:add"
                        style={{
                          verticalAlign: "0px",
                          fontSize: "16px",
                          marginRight: "2px",
                        }}
                      />
                      Add new filter
                    </Button>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </DialogContent>
      </BootstrapDialog>

      {/* =============================== filter model Save As Button  =================================  */}
      <BootstrapDialog
        onClose={handleCloseSaveAs}
        aria-labelledby="customized-dialog-title"
        open={showSaveAs}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Save Query As</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSaveAs}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
        <DialogContent dividers>
          <div className="astSubpopup">
            <fieldset className="Subpopup-fieldset">
              <legend>Query name:</legend>
              <div className="form-group ">
                <input
                  type="text"
                  id="customInput"
                  name="queryName"
                  value={formDataSv.queryName}
                  onChange={handleInputChangeSav}
                  className="bsc_sav"
                  list="options"
                  style={{ width: "100%" }}
                />

                <datalist id="options">
                  {calendarFilterDpd.map((option, index) => (
                    <option key={index.RowID} value={option.cf_query_title} />
                  ))}
                </datalist>
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend>Description:</legend>
              <div className="form-group">
                <textarea
                  id="w3review"
                  name="description"
                  rows="3"
                  value={formDataSv.description}
                  onChange={handleInputChangeSav}
                  cols="70"
                  style={{ width: "100%" }}
                />
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend>Availability:</legend>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios1"
                  value="G"
                  checked
                  onChange={handleInputChangeSav}
                />
                <label class="form-check-label" for="exampleRadios1">
                  Global(available to everyone)
                </label>
                <input
                  class="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios2"
                  value="P"
                  onChange={handleInputChangeSav}
                />
                <label class="form-check-label" for="exampleRadios2">
                  Personal
                </label>
              </div>
            </fieldset>
          </div>
        </DialogContent>
        <DialogActions>
          <Grid item>
            <Button variant="outlined" onClick={handleCFQrySaveAsBtn}>
              <Iconify icon="mingcute:save-line" /> Save
            </Button>
          </Grid>
        </DialogActions>
      </BootstrapDialog>
{/* =============================== filter model Save Button  =================================  */}
<BootstrapDialog
        onClose={handleCloseSave}
        aria-labelledby="customized-dialog-title"
        open={showSave}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Save Query</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseSave}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
        <DialogContent dividers>
          <div className="astSubpopup">
            <fieldset className="Subpopup-fieldset">
              <legend>Query name:</legend>
              <div className="form-group ">
                <input
                  type="text"
                  id="customInput"
                  name="queryName"
                  value={formDataSv.queryName}
                  onChange={handleInputChangeSav}
                  className="bsc_sav"
                  list="options"
                  style={{ width: "100%" }}
                />

                <datalist id="options">
                  {calendarFilterDpd.map((option, index) => (
                    <option key={index.RowID} value={option.cf_query_title} />
                  ))}
                </datalist>
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend>Description:</legend>
              <div className="form-group">
                <textarea
                  id="w3review"
                  name="description"
                  rows="3"
                  value={formDataSv.description}
                  onChange={handleInputChangeSav}
                  cols="70"
                  style={{ width: "100%" }}
                />
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend>Availability:</legend>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios1"
                  value="G"
                  checked
                  onChange={handleInputChangeSav}
                />
                <label class="form-check-label" for="exampleRadios1">
                  Global(available to everyone)
                </label>
                <input
                  class="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios2"
                  value="P"
                  onChange={handleInputChangeSav}
                />
                <label class="form-check-label" for="exampleRadios2">
                  Personal
                </label>
              </div>
            </fieldset>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" 
          className="SaveButton"
          startIcon={<Iconify icon="mingcute:save-fill" />}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            marginRight: "10px",
          }}
          onClick={handleCFQrySave}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>

    </>
  );
};
WorkOrderCalendarView.propTypes = {
  data: PropTypes.shape({
    site_cd: PropTypes.string.isRequired,
  }).isRequired,
};
export default WorkOrderCalendarView;
