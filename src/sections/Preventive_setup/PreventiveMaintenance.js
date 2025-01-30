import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// @mui
import Grid from "@mui/material/Unstable_Grid2";
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from '@mui/material/Stack';
import { Checkbox } from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ThreeCircles } from 'react-loader-spinner';
// routes

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
// Toastfy

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';


// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// _mock

// components
import { useSettingsContext } from 'src/components/settings';

import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import httpCommon from 'src/http-common';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import FormControlLabel from '@mui/material/FormControlLabel';


import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";

//

import PreventiveTableRow from './Preventive-table-row';
import GenerationPopup from './PopupModel/Generation_popup';
import PreventivemaintenanceTableFiltersResult from './PreventiveMaintenanceTableFiltersResult';

import ExportPreventivelistToExcel from "../Preventive_setup/ExportFIle/ExportPreventivelistToExcel";
import PreventiveMaintenanceCalendarView from "./PreventiveMaintenanceCalendarView";
import { useSwalCloseContext } from "../ContextApi/WorkOrder/SwalCloseContext";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
// ----------------------------------------------------------------------

const defaultFilters = {
  col1: '',
  publish: [],
  stock: [],
};
// ----------------------------------------------------------------------

export default function PreventiveMaintenance() {
  const site_ID = localStorage.getItem('site_ID');
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const {swalCloseTime} = useSwalCloseContext();

  const [isLoading, setIsLoading] = useState(true);
  const popover = usePopover();
  const router = useRouter();
  const navigate = useNavigate();
  const table = useTable();
  const location = useLocation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [progress, setProgress] = useState(0);

  const settings = useSettingsContext();
  const [maxHeight, setMaxHeight] = useState("400px");
  const [tableData, setTableData] = useState([]);
  const [totalRow, setTotalRow] = useState();

  const [filters, setFilters] = useState(defaultFilters);
  const { selectedOption: returnedSelectedOption, comeBack,selectedRowIdBack } = location.state || {};
 

  const [selectedOption, setSelectedOption] = useState(returnedSelectedOption || '');
  const [selectedComeBack, setSelectedComeBack] = useState(comeBack || '');
  const [selectedRowIdbackState, setSelectedRowIdbackState] = useState(selectedRowIdBack || '');

  const confirm = useBoolean();
  
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const numberOfColumns = "71";
  const [FilterShow, setFilterShow] = useState(false);
  const [ResponceStats, setResponceStats] = useState("");
 // const FilterhandleClose = () => setFilterShow(false);
  const [showSave, setShowSave] = useState(false);
  
  //const [AssetFiledname, setAssetFiledname] = useState([]);
  const [PreMaintFiledname, setPreMaintFiledname] = useState([]);

  const [selectedOptionEmptyError, setSelectedOptionEmptyError] =
  useState(false);
  const [selectedOptionEmptyErrorShort, setSelectedOptionEmptyErrorShort] =
  useState(false);
  const [valueptEmptyError, setValueptEmptyError] = useState(false);
  const [logicalEmptyError, setLogicalEmptyError] = useState(false);

  const [PreventiveTitle , setPreventiveTitle] = useState("");
  const [preventiveFilterDpd, setPreventiveFilterDpd] = useState([]);
  const [DropListIdGet, setDropListIdGet] = useState(
    location.state?.DropListId || []
  );
  const [selectedOptionValue, setselectedOptionValue] = useState();
  const [showWordOrderQryList, setShowWordOrderQryList] = useState(false);
  const handleShowWorkOrderQryList = () => setShowWordOrderQryList(true);
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedOptionEmptyErrorQtr, setSelectedOptionEmptyErrorQtr] =
  useState(false);
  const [valueptEmptyErrorQtr, setValueptEmptyErrorQtr] = useState(false);
  const [logicalEmptyErrorQtr, setLogicalEmptyErrorQtr] = useState(false);
  const [
    selectedOptionEmptyErrorShortQtr,
    setSelectedOptionEmptyErrorShortQtr,
  ] = useState(false);
  const [ExportExcelId, setExportExcelId] = useState("");
  const [selectDropRowID, setselectDropRowID] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [TableSearchData, setTableSearchData] = useState([]);
  const [TitleAstReg, setTitleAstReg] = useState("");
  const [isOptionSelected, setIsOptionSelected] = useState(TitleAstReg !== "" || selectedOption);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValueSearch, setInputValueSearch] = useState('');
  const [RowPerPage,setRowperPage]=useState(100);
  const [defaultTitle, setDefaultTitle] = useState('');
  const [tempRowID, setTempRowID] = useState(null);
  const [showPromt, setShowPromt] = useState(false);
  const [showPromtRetiveBtn, setShowPromtRetiveBtn] = useState(false);
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

  const [DefineQueryBtn, setDefineQueryBtn] = useState("");
  const [ignoreEffect, setIgnoreEffect] = useState(false);
  const [Headerdata, setheaderData] = useState([]);

  const [TitleStatus,setTitleStatus] = useState("Preventive Maintenance");

  const [showDiv1, setShowDiv1] = useState(true);
  const [showDiv2, setShowDiv2] = useState(false);
  const [button1Active, setButton1Active] = useState(true);
  const [button2Active, setButton2Active] = useState(false);
  
  const [rowlikeset, setRowlikeset] = useState("like");
  const [rowAndset, setRowAndset] = useState("And");
  const [rowQtrlikeset, setRowQtrlikeset] = useState("like");
  const [rowQtrAndset, setRowQtrAndset] = useState("And");

  const [showGenerateModel, setshowGenerateModel] = useState(false);
  const [GeneratSelectedRows, setGeneratSelectedRows] = useState([]);
  const [GenerateMsg,setGenretionMsg] = useState(); 
 
  // Get Api data useEffect
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await httpCommon.get(
        `/get_preventive_maintenance_table_data.php?site_cd=${site_ID}&page=${currentPage}`
      );
  // console.log("response____Heeader____",response);
      // get Dropdown Title
      const response2 = await httpCommon.get(
        `/get_preventive_maintenance_filter_drop_down.php?site_cd=${site_ID}&auditUser=${AuditUser}`
      );
     
      if(selectedOption === ""){
        const defaultItem = response2.data.find(item => item.cf_query_default_flag === "1");
         if (defaultItem) {
           setDefaultTitle(defaultItem.cf_query_title);
          // setselectDropRowID(defaultItem.RowID);
           
         }
         setheaderData(response.data.data.header);
       }else{
         setDefaultTitle(selectedOption);
         setheaderData(response.data.data.header);
      }

      setIsLoading(false);
    
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }, [site_ID, currentPage]);

  useEffect(() => {
    if (defaultTitle) {

      handleOptionTableList({ target: { value: defaultTitle }});

    }
  }, [defaultTitle,site_ID, currentPage]);

  const fetchFilterSubPopupSavedropdon = async () => {
    // Get dropdown value using api
    
    try {
      const response = await httpCommon.get(
        `/get_preventive_maintenance_filter_drop_down.php?site_cd=${site_ID}&auditUser=${AuditUser}`
      );
       // console.log("check__-asset__",response);
     // setAssetFilterDpd(response.data);
      setPreventiveFilterDpd(response.data);
  // Swal.close();
      if (DropListIdGet !== "" && DropListIdGet !== null) {
        const matchedItem = response.data.find(
          (item) => item.RowID === DropListIdGet
        );
        if (matchedItem) {
          const cfQueryDescValue = matchedItem.cf_query_title;

          setPreventiveTitle(cfQueryDescValue);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOptionTableList = async (event,responseData) => {
    // console.log("cancel___edit___");
      const selectedValue = event?.target?.value || selectedOption;
      setCurrentPage(1);
    
      const selectedOptionObjectFilter = preventiveFilterDpd.find(
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
        if (selectedComeBack === "" || selectedComeBack === undefined){
        if(GetPrompt == '1'){
          setShowPromt(true);
          setIsLoading(true);
          
          try {
            const response = await httpCommon.get(
              "/get_preventive_maintenance_filter_query_data.php?site_cd=" +
                site_ID +
                "&RowID=" +
                GetRowID
            );
         // console.log("firsttime load___",response);
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
              const timeoutId = setTimeout(() => {
                setIsLoading(false);
                setRowsDropdownPrompt(newRows);
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
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          return;
        }
      }
  
        setExportExcelId(GetRowID);
        setselectDropRowID(GetRowID);
        setCurrentPage(1);
        setDropListIdGet([]);
       
        setTitleAstReg("");
      }
  
      setSelectedOption(selectedValue);
    };

  const handleOptionChange = async (event,responseData) => {
   
    const selectedValue = event?.target?.value || selectedOption;
    setDefaultTitle("");
    setSelectedComeBack("");
    setCurrentPage(1);
  
    const selectedOptionObjectFilter = preventiveFilterDpd.find(
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
  
      if(GetPrompt == '1'){
        setShowPromt(true);
        setTempRowID(GetRowID);
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
            "/get_preventive_maintenance_filter_query_data.php?site_cd=" +
              site_ID +
              "&RowID=" +
              GetRowID
          );
       //   console.log("response_______selectOption___",response);
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
            const timeoutId = setTimeout(() => {
              Swal.close();
              setRowsDropdownPrompt(newRows);
              setSelectedOption(selectedValue);
            }, 3000);
            //setShowAssetByDescp(false);
          } else {
            setSelectedOption(selectedValue);
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
        }
        return;

      }
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
      setPreventiveTitle("");
    }else{
      const GetRowID = selectedOptionObject.RowID;
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
      setPreventiveTitle("");
    }
    setSelectedOption(selectedValue);
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  const getb = useCallback(async () => {
   //  console.log("calling____getDb");
    setIsLoading(true);
    try {
     
      const response = await httpCommon.post(
        `/get_preventive_list_select_option_data.php?site_cd=${site_ID}&ItemID=${selectDropRowID}&page=${currentPage}&EmpId=${emp_owner}`
      );
      // console.log("check___api__data__",response);
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        setTableData(response.data.data.result);
        setTotalRow(response.data.DashbrdCount);
       // Swal.close();
        setIsLoading(false);
      } else {
        setTableData("");
        setTotalRow("");
        setIsLoading(false);
        Swal.fire({
          title: "Opps..!",
          text: "No Record Found!",
          icon: "warning",
          customClass: {
            container: "swalcontainercustom",
          },
          width: '30%',
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage, selectDropRowID]);

 
  useEffect(() => {
    if (ignoreEffect) {
      setIgnoreEffect(false); // Reset the flag
      return;
    }

    if (selectDropRowID != "" && selectDropRowID != null) {
      getb();
    }else if(TableSearchData !="" && TableSearchData != null){
      handelSearchButton();
    }else {
      fetchData();
    }
    fetchFilterSubPopupSavedropdon();
  }, [site_ID, currentPage, selectDropRowID,fetchData,getb]);

  const dataFiltered = applyFilter({
    inputData: Array.isArray(tableData) ? tableData : [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  
  const handleDeleteRow = useCallback(async (id, row) => {
  //  console.log("row++++++____", row.col1);
   // console.log("row++++++____", id);
    const Rowid = id;
    const AstNo = row.col1;
    if (Rowid !== '' && AstNo !== '') {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => { // Add async here if you want to use await inside then
        if (result.isConfirmed) {
          setIsLoading(true);
    
          try {
            const response = await httpCommon.get(
              `/asset_list_delete_record.php?site_cd=${site_ID}&mst_id=${Rowid}&ast_no=${AstNo}`
            );
         //   console.log("response_____delete___",response);
            if(response.data.status = "SUCCESS"){
              Swal.fire({
              title: "Deleted!",
              text: response.data.message,
              icon: "success"
              });
            }
            if(response.data.status = "ERROR"){
              Swal.fire({
              title: "Oops!",
              text: response.data.message,
              icon: "error"
              });
            }
            setIsLoading(false);
          
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          
        }
      });
    }
  }, [tableData, router, site_ID]);
  
  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (row) => {
     
      const Rowid = row.RowID;
      const PMID = row.prm_mst_pm_no;
      if (Rowid !== '' && PMID !== '') {
        // React Router v6 pass data
        navigate(`/dashboard/PreventiveSetup/newpmform`, {
          state: {
            RowID: Rowid,
            PM_no: PMID,
            currentPage,
            selectedOption,
          },
        });
      }
    
    },
    [router,currentPage, selectedOption]
  );

 const handleRowClickTable = useCallback(
    
    (id,row) => {
      const Rowid = id;
      const PMID = row.prm_mst_pm_no;
      if (Rowid !== '' && PMID !== '') {
        navigate(`/dashboard/PreventiveSetup/newpmform`, {
          state: {
            RowID:Rowid,
            PM_no: PMID,
            currentPage,
            selectedOption,
          },
        });
      }
    },
    [router,currentPage, selectedOption]
  );

  const handleResetFilters = useCallback(() => {
    setInputValueSearch("");
    setTableData("");

    if (inputRef.current) {
      inputRef.current.value = ''; 
    }
    if(selectDropRowID !=="" && selectDropRowID !== null){
     
      getb();
    }
  }, [getb]);

  const handleFilterName = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, name: value });

    const filteredData = tableData.filter((item) =>
      item.col1.toLowerCase().includes(value.toLowerCase())
    );
    setTableData(filteredData);
  };
 
  // set screen revolation set
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      // Adjust maxHeight based on window height
      const newMaxHeight = Math.floor(windowHeight * 0.6) + "px"; // Adjust this value as needed
      setMaxHeight(newMaxHeight);
    };

    // Call handleResize on initial mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter funcation
  const [rows, setRows] = useState([
    {
      selectedOption: "",
      operator: "like",
      logical: "And",
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

  const handleOptionChange1 = (index, selectedOption) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = selectedOption;
    setSelectedOptionEmptyError(false);
    setRows(updatedRows);
  };

  const handleOptionChangeOprter = (index, operator) => {
   // setRowlikeset(operator);
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
   // setRowAndset(logical.target.value);
    const updatedRows = [...rows];
    updatedRows[index].logical = logical.target.value;
    setLogicalEmptyError(false);
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    const isLastRowIncomplete =
    rows.length > 0 &&
    (!lastRow.selectedOption || lastRow.selectedOption === "" ||
     !lastRow.valuept || lastRow.valuept === "");

    if (isLastRowIncomplete) {
      setSelectedOptionEmptyError(!lastRow.selectedOption || lastRow.selectedOption === "");
      setValueptEmptyError(!lastRow.valuept || lastRow.valuept === "");
      
    }else {
      // Add a new row
      setRows((prevRows) => [
        ...prevRows,
        {
          selectedOption: "",
          operator: "like",
          logical: "And",
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

  const FilterhandleClose = () => {
    const emptyRowQrt = {
      selectedOption: "",
      operator: "",
      logical: "AND",
      prompt: "0",
      valuept: "",
      siteCd: site_ID,
      queryTypedd: "F",
    };
    setRows([emptyRowQrt]); 
    
    const emptyRowSortQrt = {
      selectedOptionShort: "",
      promptAsd: "ASC",
      siteCd: site_ID,
      queryType: "S",
    };
    setRowsort([emptyRowSortQrt]); 
    setSelectedOptionEmptyError(false);
    setValueptEmptyError(false);
    setLogicalEmptyError(false);
    setSelectedOptionEmptyErrorShort(false);
    setFilterShow(false);
  };
  const handelFilterAction = () => {

    setIgnoreEffect(true); 
    setselectDropRowID("");
    setCurrentPage(1);

    const updatedEmptyRows = rows.map((row) => ({
      // empty state data
      ...row,
      selectedOption: "",
      valuept: "",
      
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
    if (rowsort.length > 1) {
      const newRowsort = [rowsort[0]]; // Keep only the first row
      setRowsort(newRowsort);
    }
    setFilterShow(true);
    getPreventMaintListLebel();
  };
  const rowOptions = PreMaintFiledname.map((row) => ({
    value: row.column_name,
    label: `${row.default_label}`,
  }));
    /* Filter dropdown value */
    const getPreventMaintListLebel = async () => {
      try {
        const response = await httpCommon.get("/getPreventiveMaintenanceFilterFileName.php");
        //  console.log("response___assetList",response);
        if (response.data.status == "SUCCESS") {
            setPreMaintFiledname(response.data.data);
          //setAstdetLabel(response.data.data.ast_det);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

      // Retrive button  funcation,setTableData
  const RetriveData = async () => {
  //  console.log("popup__retrive___enteer-__");
  let hasEmptyOption = false;
  let hasEmptyValuept = false;
  let fieldName = '';

  setSelectedRowIdbackState("");
  for (const row of rows) {
    if (!row.selectedOption) {
      hasEmptyOption = true;
    }
    if (!row.valuept) {
        hasEmptyValuept = true;
    }
   
    // If any required field is empty, determine the message and exit the loop
    if (hasEmptyOption || hasEmptyValuept ) {
        if (hasEmptyOption && hasEmptyValuept ) {
            fieldName = "Field Name and Value";
        } else if (hasEmptyOption && hasEmptyValuept) {
            fieldName = "Field Name and Value";
        } else if (hasEmptyOption) {
            fieldName = "Field Name";
        } else if (hasEmptyValuept) {
            fieldName = "Value";
        } 
        break;  // Stop checking further rows if an error is found
    }
}
  if(DefineQueryBtn === ""){
    //console.log("Enter this code_____");
    if (fieldName !== '') {
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
 // setCurrentPage(1);

  setTitleAstReg("");
  setTableData("");
  setDropListIdGet("");

  setSelectedOption("");
  setselectDropRowID("");

  let foundPromptOne = false;
  for (const rowChk of rows) {
    if (rowChk.prompt === "1") {
        setShowPromtRetiveBtn(true); 
        Swal.close();
        foundPromptOne = true; // Set the flag to true
        break; // Stop the loop when condition is met
    }
 }
   if (!foundPromptOne) {
    try {
      const response = await httpCommon.post(
        "/get_retrive_popup_preventive_maintinace_filed_data.php?page=" + currentPage,
        {
          rows: rows,
          rowsort: rowsort,
          SiteCD: site_ID,
          admin: emp_owner,
        }
      );
       // console.log("popup__retrive___",response);
       if (
        response.data.status === "SUCCESS"
      ) {
      
        setTableData(response.data.data.result);
        setTotalRow(response.data.total_count);

        setSelectedOption(response.data.titleName);
        setselectDropRowID(response.data.SelectId);
        setExportExcelId(response.data.SelectId);
        setDefineQueryBtn("RetriveData");
       
        const updatedEmptyRows = rows.map((row) => ({
          // empty state data
          ...row,
          selectedOption: "",
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
  }
  };

  const RetriveDataAllData = useCallback(async () => {
   // console.log("retrive____All");
    setTableData("");
    setSelectedOption("");
    setselectDropRowID("");
    setDropListIdGet("");
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

    try {
      const response = await httpCommon.post(
        `/get_retrive_preventive_maintenance_all_data.php?page=${currentPage}`,
        {
          SiteCD: site_ID,
          admin: emp_owner,
        }
      );
      //console.log("work_req___", response);

      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {

        setTableData(response.data.data.result);
        setTotalRow(response.data.total_count);

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
         Swal.close();
        FilterhandleClose();
        Swal.fire({
          title: "Oops..!",
          text: "No Record Found!",
          icon: "error",
          customClass: {
            container: "swalcontainercustom",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
     
    }
  }, [currentPage, site_ID, emp_owner,selectDropRowID]);

  const retriveBtn = () => {
   
    if (rows.some((row) => row.selectedOption !== "")) {
      
      RetriveData();
     
    }else{
    
      RetriveDataAllData();
        
    }
  };

    const SaveRegTbl = () => {
       let hasEmptyValuept = false;
        let fieldName = '';
        setSelectedRowIdbackState("");
        for (const row of rows) {
          
          if (!row.valuept) {
              hasEmptyValuept = true;
          }
          
          if ( hasEmptyValuept ) {
              if ( hasEmptyValuept ) {
                  fieldName = "Value";
              } 
              break; 
            }
          }
        if (fieldName !== '') {
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
        }else{
          setShowSave(true);
          fetchFilterSubPopupSavedropdon();
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
  const handleCloseSave = () => {
    setShowSave(false);
    setFormDataSv({
      queryName: "",
      description: "",
    });
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
      [name]: value.toUpperCase(),
    }));
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
        "/insert_preventive_maintenance_filter_query_list_data.php",
        combinedData
      );
     //console.log("response_____saveButton_res___",response);
      if (response.data.status == "SUCCESS") {
     
        setSelectedOption(response.data.Title);
        setselectDropRowID(response.data.ROW_ID);
        fetchFilterSubPopupSavedropdon();
      //  RetriveData();
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
  // Filter Save button funcation click to
    const handleCFQrySave = () => {
     
      if (formDataSv.queryName && formDataSv.queryName.trim() !== "") {
        const inputValue = formDataSv.queryName;
        const matchingOption = preventiveFilterDpd.find(
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Query name can't be empty!`,
          customClass: {
            container: "swalcontainercustom",
          },
        });
      
      }
    };
  // Query button click to funcatio start
    // Handel Query List popup
    const [rowsQrt, setRowsQrt] = useState([
      {
        selectedOption: "",
        operator: "like",
        logical: "And",
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

    const handleCloseWorkQryList = () => {
      setShowWordOrderQryList(false);
      FilterhandleClose();
      handleCloseSave();
      setselectedOptionValue("");
      setRowsQrt([]);
      setRowsortQrt([]);
    };

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
          "/get_retrive_popup_preventive_maintinace_filed_data.php?page=" + currentPage,
          {
            rows: rowsQrt,
            rowsort: rowsortQrt,
            SiteCD:site_ID,
            admin:emp_owner
          }
        );
      // console.log("response____fliter___",response);
        setTableData(response.data.data.result);
        setTotalRow(response.data.total_count);
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

    const DeletePMRegQryList = async () => {
      const parts = selectedOptionValue.split("-").map(part => part.trim()); 
      let cf_query_title = ""; 
      let RowID = ""; 
      if (parts.length > 1) {
          cf_query_title = parts.slice(0, -1).join(" -"); 
          RowID = `${parts[parts.length - 1]}`;
      }
  
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
                "/PreventiveMaintenanceRegQueryListDataDelete.php?value=" +
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
              
                setTableData("");
                setTotalRow("");
                setSelectedOption("");
                setselectDropRowID("");
                handleCloseWorkQryList();
                //setSelectedRow([]);
                Swal.fire("Deleted!", "Your query has been deleted.", "success");
              }
            }
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
      //  console.log("empty");
      }
    };

    const SavePMQryList = async () => {
      const parts = selectedOptionValue.split("-").map(part => part.trim());
      let cf_query_title = ""; 
      let RowID = ""; 
      if (parts.length > 1) {
          cf_query_title = parts.slice(0, -1).join(" -"); 
          RowID = `${parts[parts.length - 1]}`;
      }

      const isAnySelectedOptionShortEmpty = rowsortQrt.some(
        (row) => !row.selectedOptionShort
      );

      let hasEmptyQrtOperator = false;
      let hasEmptyQrtValuept = false;
     
      let fieldNameQrt = '';
     // console.log("rowsQrt____first__",rowsQrt);
      for (const row of rowsQrt) {
        if (!row.selectedOption ) {
          hasEmptyQrtOperator = true;
        }
        if (!row.valuept) {
          hasEmptyQrtValuept = true;
        }
        
        if (hasEmptyQrtOperator || hasEmptyQrtValuept ) {
            if (hasEmptyQrtOperator && hasEmptyQrtValuept) {
              fieldNameQrt = "Field Name, and Value";
            }  else if (hasEmptyQrtOperator) {
              fieldNameQrt = "Field Name";
            } else if (hasEmptyQrtValuept) {
              fieldNameQrt = "Value";
            } 
            break;  // Stop checking further rows if an error is found
        }
    }
    if (fieldNameQrt !== '') {  // If any field was missing, show the error message
     // Swal.close();
      toast.error(`Please fill the required field: ${fieldNameQrt}`, {
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

      if (isAnySelectedOptionShortEmpty && RowID != "") {
      } else {
        Swal.fire({
          title: "Please Wait !",
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
       // Swal.showLoading();
       
        const combinedData = {
          rowsQrtData: rowsQrt,
          siteCd: site_ID,
          owner: emp_owner,
          mst_RowID: RowID,
          defaultFlag:isChecked,
          rowsortQrtData: rowsortQrt,
        };
     // console.log("combinedData_____",combinedData);
        try {
          const response = await httpCommon.post(
            "/insert_preventive_maintenance_querylist_save_data.php",
            combinedData
          );
          //  console.log("response__SaveBytncf__",response);
          if (response.data.status == "SUCCESS") {
            setIgnoreEffect(false); 
            Swal.close();
            Swal.fire({
              title: "Success!",
              text: "Your query update successfully.",
              icon: "success",
              confirmButtonText: "OK",
              timer: swalCloseTime,
              timerProgressBar: true, 
              customClass: {
                container: "swalcontainercustom",
              },
              willClose: () => {
                // Execute these actions when the modal closes
                setIsChecked(null);
                setRowsQrt([]);
                setselectedOptionValue("");
                setRowsortQrt([]);
                setRowsort([]);
                setRows([]);
                handleCloseWorkQryList();
                FilterhandleClose();
                setSelectedOption(cf_query_title);
                setselectDropRowID(RowID);
                setExportExcelId(RowID);
              }
            }).then((result) => {
              if (result.isConfirmed) {
               
                setIsChecked(null);
                //   RetriveDataQueryList();
                   setRowsQrt([]);
                   setselectedOptionValue("");
                   setRowsortQrt([]);
                   setRowsort([]);
                   setRows([]);
                 
                   handleCloseWorkQryList();
                   FilterhandleClose();
                   setSelectedOption(cf_query_title);
                   setselectDropRowID(RowID);
                   setExportExcelId(RowID);
                
              }
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    const SaveAsPMTbl = () => {
      setShowSaveAs(true);
    };

    const handleCloseSaveAs = () => {
      setShowSaveAs(false);
      setFormDataSv({
        queryName: "",
        description: "",
      });
    };
    const handleCFQrySaveAsBtn = () => {
  
      if (formDataSv.queryName && formDataSv.queryName.trim() !== "") {
        const inputValue = formDataSv.queryName;
        const matchingOption = preventiveFilterDpd.find(
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Query name can't be empty!`,
          customClass: {
            container: "swalcontainercustom",
          },
        });
      }
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
     //   setQueryTitleRowID(RowID);
     // setIsChecked(true);
      const initialCheckedState = preventiveFilterDpd.some(
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
            "/get_preventive_maintenance_filter_query_data.php?site_cd=" +
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
 
const handelQuryListpopup = () => {
  fetchFilterSubPopupSavedropdon();
  handleShowWorkOrderQryList();
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
const handleSelectChangeQtr = (index, checked) => {
  const newRows = [...rowsQrt];
  newRows[index].prompt = checked ? "1" : "0";
  setRowsQrt(newRows);
};
const handleInputValueChangeQtr2 = (index, newValue) => {
  const updatedRowsQtr = [...rowsQrt];
  updatedRowsQtr[index].valuept = newValue;
  //setValueptEmptyErrorQtr(false);
  setRowsQrt(updatedRowsQtr);
};
  const handleDeleteRowQrt = (index) => {
    if (rowsQrt.length > 1) {
      const newRows = [...rowsQrt];
      newRows.splice(index, 1);
      setRowsQrt(newRows);
    }
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
  const handleDeleteRowShortQrt = (index) => {
    if (rowsortQrt.length > 1) {
      const newRows = [...rowsortQrt];
      newRows.splice(index, 1);
      setRowsortQrt(newRows);
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
      defaultFlag: isChecked === null ? "notCheckeset" : isChecked ? "1" : "0", 
      SITE_CD: site_ID,
      OWNER_ID: emp_owner,
      availability: "G",
    };

    try {
      const response = await httpCommon.post(
        "/insert_preventive_maintenance_querylist_saveas_data.php",
        combinedData
      );

      if (response.data.status === "SUCCESS") {
        setSelectedOption(response.data.Title);
        setselectDropRowID(response.data.ROW_ID);
        setExportExcelId(response.data.ROW_ID);
        fetchFilterSubPopupSavedropdon();
     //   RetriveDataQueryList();
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
      console.error("Error fetching data:", error);
    }
  };
 
// Search Button Click funcation
const handelSearchButton = async () => {
  const inputValueGet = inputRef.current.value;
  
  if (inputValueGet !== "" && inputValueGet !== null) {
    Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
    Swal.showLoading();
   // console.log("call_again___");
    try {
      const response = await httpCommon.get(
        `/get_SearchPreventiveMaintenanceModule.php?site_cd=${site_ID}&searchTerm=${inputValueGet}&page=${currentPage}`
      );
        // console.log("responseSerach_____",response);
      if (response.data.data.result.length > 0) {
        setTableSearchData(response.data.data.result);
        setTotalRow(response.data.total_count);

        const filteredData = response.data.data.result.filter((item) => {
          const searchString = inputValueGet.toLowerCase();
          const prm_mst_pm_no = (item.prm_mst_pm_no || "").toLowerCase();
          const prm_mst_type = (item.prm_mst_type || "").toLowerCase();
          const prm_mst_pm_grp = (item.prm_mst_pm_grp || "").toLowerCase();
          const prm_mst_freq_code = (item.prm_mst_freq_code || "").toLowerCase();
          const prm_mst_meter_id = (item.prm_mst_meter_id || "").toLowerCase();
          const prm_mst_lpm_usg = (item.prm_mst_lpm_usg || "").toLowerCase();
          const prm_mst_lpm_uom = (item.prm_mst_lpm_uom || "").toLowerCase();
          const prm_mst_flt_code = (item.prm_mst_flt_code || "").toLowerCase();
          const prm_mst_curr_wo = (item.prm_mst_curr_wo || "").toLowerCase();
          const prm_mst_shadow_grp = (item.prm_mst_shadow_grp || "").toLowerCase();
          const prm_mst_assetlocn = (item.prm_mst_assetlocn || "").toLowerCase();
          const prm_mst_desc = (item.prm_mst_desc || "").toLowerCase();
          const prm_mst_assetno = (item.prm_mst_assetno || "").toLowerCase();
          
          return (
            prm_mst_pm_no.includes(searchString) ||
            prm_mst_type.includes(searchString) ||
            prm_mst_pm_grp.includes(searchString) ||
            prm_mst_pm_grp.includes(searchString) ||
            prm_mst_freq_code.includes(searchString) ||
            prm_mst_meter_id.includes(searchString) ||
            prm_mst_lpm_usg.includes(searchString) ||
            prm_mst_lpm_uom.includes(searchString) ||
            prm_mst_flt_code.includes(searchString) ||
            prm_mst_curr_wo.includes(searchString) ||
            prm_mst_shadow_grp.includes(searchString) ||
            prm_mst_assetlocn.includes(searchString) ||
            prm_mst_desc.includes(searchString) ||
            prm_mst_assetno.includes(searchString)
          );
        });
        setTableData(filteredData);
       // setTableData(filteredData);
     //   setCurrentPage(1);
        Swal.close();
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No Record Found!",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};

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
const handleButtonClick = () => {
  setButton1Active(!button1Active);
  setButton2Active(false);
  setShowDiv1(true);
  setShowDiv2(false);
  setTitleStatus("Preventive Maintenance");
};
const handleButtonClick2 = () => {
  setButton2Active(!button2Active);
  setButton1Active(false);
  setShowDiv1(false);
  setShowDiv2(true);
  setTitleStatus("Preventive Maintenance Calendar View");
};

const handleExportClick = async () => {
  if (ExportExcelId !== "") {
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.post(
        `/get_preventive_list_excel_data.php?site_cd=${site_ID}&ItemID=${ExportExcelId}`
      );
       // console.log("response_____first",response);
      Swal.close();
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        ExportPreventivelistToExcel({ resultData: response.data.data.result });
        popover.onClose();
        Swal.close();
      } else {
        setTableData("");
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
  } else {
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      
      const response = await httpCommon.get(
        `/get_preventive_list_all_data_excelsheet.php?site_cd=${site_ID}`
      );
     // console.log("response_____second",response);
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        ExportPreventivelistToExcel({ resultData: response.data.data.result });
        popover.onClose();
        Swal.close();
      } else {
        setTableData("");
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
};

const handleDropdownOpen = () => {
  //console.log("Handal click open");
  setIsDropdownOpen(true);
};

const handleDropdownClose = () => {
  
  setTimeout(() => {
    if (!isOptionSelected) {
      setIsDropdownOpen(false);
    }
  }, 0);
};
const handleCloseSnackbar = () => {
  setSnackbarOpen(false);
};
const fetchDataUsingRefreshBtn = useCallback(async () =>{
  getb();
}, [site_ID, currentPage, selectDropRowID]);

const handleSearchInputChange = (e) => {
  setInputValueSearch(e.target.value);
};
const handleClearButton = () => {
  handleResetFilters();
  if (inputRef.current) {
    inputRef.current.focus(); // Refocus the input field
  }
};
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
      "/get_preventive_maintenance_dropdown_prompt_data.php?page=" + currentPage,
      {
        rows: rowsDropdownPrompt,
        rowsort: "",
        SiteCD:site_ID,
        admin:emp_owner,
        RowId:hasRowIdValuept
      }
    );
  // console.log("response____prompt___",response);
    setSelectedOption(response.data.titleName);
    setselectDropRowID(response.data.TitleId);
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
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    const combinedData = {
      rowsQrtData: rowsDropdownPrompt,
      rowsortQrtData:"",
      siteCd: site_ID,
      mst_RowID:  hasRowIdValuept,
      owner: emp_owner,
    };
    try {
      const response = await httpCommon.post(
        "/insert_preventive_maintenance_query_list_prompt_save_data.php",
        combinedData

      );
      //  console.log("response____ret",response);
      if (response.data.status == "SUCCESS") {

        Swal.close();
        setselectDropRowID(tempRowID);
        handleClosePromt();
       // fetchDataResponse(hasRowIdValuept);
      }else{
        Swal.close();
        handleClosePromt();
      }
    } catch (error) {
      Swal.close();
      console.error("Error fetching data:", error);
    }
  }

};

const TABLE_HEAD = Headerdata && Headerdata.map((item, index) => {
  const width = [100,110,140,125,160,130,130,150,130,110,150,180,120,180,120,300,120,130,120,300,150,160,150,180,160,140,140,140,180,160,180,190,160,120,120,120,130,120,160,140,155,,130,130,140][index]; 
  return {
    id: item.accessor,
    label: item.Header,
    width
  };
});
if (TABLE_HEAD) {
  TABLE_HEAD.unshift({ id: '', label: '', width: 60 });
  TABLE_HEAD.unshift({ id: '', label: 'Action', width: 60 });
}
const handelGenrate = () => {
 
  if(GeneratSelectedRows.length === 0){
    Swal.fire({
      title: "Info!",
      text: "Please select at least one checkbox before proceeding",
      icon: "info",
      customClass: {
        container: "swalcontainercustom",
      },
      width: '30%',
      
    });
  }
  if (
    (totalRow !== undefined && totalRow === 0 && GeneratSelectedRows.length === 0) ||
    (totalRow > 0 && GeneratSelectedRows.length > 0)
  ) {
    setshowGenerateModel(true);
  }

 // setshowGenerateModel(true);
}
const handleGenrateClose = () => {
  setshowGenerateModel(false);
  //resetAllCheckboxes(); // Reset checkboxes
  if (GenerateMsg !== undefined && GenerateMsg !== "") {
    resetAllCheckboxes(); // Call this function if GenerateMsg is not empty
  }
  //getb();
};

const handleChildMessage = (msg) => {
 
  setGenretionMsg(msg);
  
  // You can perform additional logic here
};

const resetAllCheckboxes = () => {
  setGeneratSelectedRows([]); // Empty the selected rows array
  
};

const handleCheckboxChange = (row, isChecked) => {

  if (isChecked) {
    setGeneratSelectedRows((prev) => {
      // Add only if not already present
      if (!prev.some((selectedRow) => selectedRow.prm_mst_pm_no === row.prm_mst_pm_no)) {
        return [...prev, row];
      }
      return prev;
    });
  } else {
    setGeneratSelectedRows((prev) =>
      prev.filter((selectedRow) => selectedRow.prm_mst_pm_no !== row.prm_mst_pm_no)
    );
  }
  
};

  return (
    <>
      <Helmet>
        <title>CMMS System</title>
        <meta name="description" content="Preventive Maintenance List" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
             heading={TitleStatus}
            links={[]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
                
                <Tooltip title="List View" placement="top" arrow>
                  <Button
                    component={RouterLink}
                    variant="contained"
                    className={button1Active ? "active tableView" : "tableView"}
                    onClick={handleButtonClick}
                  >
                    <Iconify icon="fluent:table-20-filled" />
                  </Button>
               </Tooltip>
               
                <Tooltip title="Calendar View" placement="top" arrow>
                  <Button
                    component={RouterLink}
                    variant="contained"
                    className={
                      button2Active ? "active calendarView" : "calendarView"
                    }
                     onClick={handleButtonClick2}
                  >
                    <Iconify icon="clarity:calendar-solid" />
                  </Button>
               </Tooltip>
                 
               <Button
                  variant="contained"
                  startIcon={<Iconify icon="ri:ai-generate" />}
                  onClick={ handelGenrate }
                  sx={{
                    marginRight: "5px",
                    backgroundColor: "#008000d1", 
                    '&:hover': {
                      backgroundColor: "green", 
                    },
                  }} 
                >
                  Generate
                </Button>

                <Button
                  component={Link}
                  variant="contained"
                  className="AddNewButton2"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  to={{
                    pathname: "/dashboard/PreventiveSetup/newpmform",
                    state: {
                      select: 'New_PMFom',
                    },
                  }}
                >
                  New
                </Button>

              </div>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>
        <div className="workReqpage">
        {showDiv1 && (
          <Card>
            <Stack
              spacing={2}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction={{
                xs: 'column',
                md: 'row',
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
                    style={{ marginRight: "5px",fontSize: "16px",
                       }}
                  /> Filter
              </Button>
              <FormControl
                sx={{
                  flexShrink: 0,
                  width: { xs: 1, md: 300 },
                }}
                className="selectOptioncls"
              >
                <InputLabel id="select-label" className={(TitleAstReg!== "" || selectedOption)? "selectedcss" : "defaultLabelSelect"}>Select Query</InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                 // input={<OutlinedInput label="Select an option" />}
                 value={PreventiveTitle && PreventiveTitle !== "" ? PreventiveTitle : (selectedOption || "")}

                  onChange={handleOptionChange}
                  onOpen={handleDropdownOpen}
                  onClose={handleDropdownClose}
                  sx={{ textTransform: 'capitalize' }}
                >
              
                  {preventiveFilterDpd.map((item) => (
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
              <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                  <div
                    className="wordkOrdersearchInput"
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
                <IconButton onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Stack>
            </Stack>

            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow="right-top"
              sx={{ width: 180 }}
            >
              <MenuItem
                onClick={() => {
                  handleExportClick();
                }}
              >
                <Iconify icon="solar:export-bold" />
                Export to Excel
              </MenuItem>

            </CustomPopover>
            {canReset && (
              <PreventivemaintenanceTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                //
                onResetFilters={handleResetFilters}
                //
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <TableContainer sx={{ position: 'relative'}}>
            <TableSelectedAction
                dense={table.dense}
               
                numSelected={table.selected?.length || 0}
                  rowCount={tableData?.length || 0}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar sx={{ overflowX: "auto", maxHeight: maxHeight }}>  
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                 
                  <TableHeadCustom

                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}

                    rowCount={tableData ? tableData.length : 0}
                    numSelected={table.selected ? table.selected.length : 0}
                    onSort={table.onSort}
                    className="stickyheader"
                  />
                 
                  <TableBody className="AssetTable">
                        {isLoading ? ( // Assuming isLoading is a boolean state indicating whether data is loading
                          <TableRow>
                             <TableCell colSpan={numberOfColumns} className="NoRecodcls" >
                          <Dialog open={isLoading} aria-labelledby="loading-dialog-title"  PaperProps={{
                                  style: {
                                      backgroundColor: "transparent", // Set your desired background color here
                                  },
                              }}
                              BackdropProps={{
                                className: "yourbackdropclass",
                              }}
                              >
                          <DialogTitle id="loading-dialog-title"  style={{ textAlign: 'center' }}></DialogTitle>
                            <DialogContent>
                            
                              <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                              <ThreeCircles
                                radius="9"
                                visible={true}
                                ariaLabel="three-circles-loading"
                                color="green"
                             
                              />
                                
                              </div>
                            </DialogContent>
                          </Dialog>
                           
                          </TableCell>
                          </TableRow>
                        ) : (
                          <>
                         
                              {(tableData || []).length === 0 ? (
                              <TableRow   
                                className="noDataFound">
                                 <TableCell sx={{ p: 0 }}></TableCell>
                                   <TableCell
                                     colSpan={numberOfColumns}
                                     sx={{
                                      height: 150, 
                                        textAlign: 'center',  
                                        verticalAlign: 'middle', 
                                        padding: 5, 
                                    }}
                                  >
                                    <TableNoData  numberOfColumns={numberOfColumns} notFound={notFound} />
                                  </TableCell>
                                 
                                
                              </TableRow>
                            ) : (
                              <>
                           
                       
                              {dataFiltered
                                      .map((row,index) => (
                                  <PreventiveTableRow
                                    key={row.id}
                                    row={row}
                                    index={index}
                                    rowStats={ResponceStats}
                                    selected={table.selected.includes(row.RowID)}
                                    isHighlighted={selectedRowIdbackState && selectedRowIdbackState === row.RowID} 
                                    onSelectRow={() => table.onSelectRow(row.RowID)}
                                    onDeleteRow={() => handleDeleteRow(row.RowID,row)}
                                    onEditRow={() => handleEditRow(row)}
                                    onCheckboxChange={handleCheckboxChange}
                                    onClick={() => handleRowClickTable(row.RowID,row)}
                                   // shouldReset={GeneratSelectedRows.length === 0} // Pass the reset trigger
                                   
                              
                                  />
                                ))}
                               
                              </>
                            )}
                          </>
                        )}
                        
                        <TableEmptyRows
                          emptyRows={emptyRows(
                            table.page,
                            table.rowsPerPage,
                            tableData?.length
                          )}
                        />
                      </TableBody>

                </Table>
              </Scrollbar>
            </TableContainer>

              <TablePaginationCustom
                count={totalRow > 0 ? totalRow : dataFiltered.length}
                page={currentPage - 1}
                rowsPerPage={table.rowsPerPage}
                onPageChange={(event, newPage) => {
                  setCurrentPage(newPage + 1);

                  table.onChangePage(event, newPage);
                }}
                currentPage={currentPage}
                rowsPerPageOptions={[]} 
                
              />
          </Card>
          )}
        </div>
      
    {showDiv2 && (
        <div className="clandarV">
          <PreventiveMaintenanceCalendarView />
        </div>
        )}

      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      {/* =============================== filter model  =================================  */}
      <BootstrapDialog
       
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            FilterhandleClose(event, reason);
          }
        }}
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
            padding:"0px !important",
            margin:"5px !important"
          }}
        >
          <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                //  disabled={isButtonDisabled}
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
              <legend className="mailLegHding">Filter By</legend>
              <table className="custom-tablE">
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
                          className="custom-default-select"
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
                         className={`custom-default-select ${
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
                          className="custom-default-select"
                          onChange={(event) =>
                            handleOptionChangeOprter(index, event.target.value)
                          }
                          value={row.operator || "like"}
                        >
                          {oprt.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ width: "8%" ,textAlign: "center"}}>
                        <input
                          style={{
                            display: "block", 
                            margin: "0 auto", 
                            width: "30%" 
                          }}
                           class="custom-default-select"
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
                          className={`custom-default-select ${
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
                          className={`custom-default-select ${
                            index === rows.length - 1 && logicalEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          // value={/* add the corresponding value from your state */}
                          onChange={(logical) =>
                            handleIncludeChangeLogcil(index, logical)
                          }
                          value={row.logical || "And"}
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
                          className="custom-default-select"
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
                <Button onClick={handleAddRow} className="add-filter-btn">
                  <Iconify
                    icon="material-symbols:add"
                    style={{
                      verticalAlign: "0px",
                      fontSize: "16px",
                      marginRight: "2px",
                    }}
                   
                  />
                  Add 
                </Button>
              </div>

            </fieldset>
          </div>
          <div className="filterShort">
          <fieldset className="short-by-fieldset2">
              <legend className="mailLegHding">Sort By</legend>
              <table className="custom-tablE">
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
                <Button onClick={handleAddRowShort} className="add-filter-btn">
                  <Iconify
                    icon="material-symbols:add"
                    style={{
                      verticalAlign: "0px",
                      fontSize: "16px",
                      marginRight: "2px",
                    }}
                  />
                  Add
                </Button>
              </div>

            </fieldset>
          </div>
        </DialogContent>
      </BootstrapDialog>
       {/* =============================== filter model Save Button  =================================  */}
       <BootstrapDialog
      
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleCloseSave(event, reason);
          }
        }}
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
            padding:"0px !important",
            margin:"5px !important"
          }}
        >
          <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                  {preventiveFilterDpd.map((option, index) => (
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
      {/* =============================== filter model Query List Button  =================================  */}
      <BootstrapDialog
       
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleCloseWorkQryList(event, reason);
          }
        }}
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
            padding:"0px !important",
            margin:"5px !important"
          }}
        >
          <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
        </IconButton>
        <DialogContent dividers>
          <div className="queryBtn">
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="outlined" onClick={DeletePMRegQryList} disabled={!selectedOptionValue}>
                  <Iconify icon="fluent:delete-48-regular" /> Delete
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SavePMQryList} disabled={!selectedOptionValue}>
                  <Iconify icon="ic:outline-save-as" /> Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveAsPMTbl} disabled={!selectedOptionValue}>
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
                  <legend className="mailLegHding">Query Name</legend>
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
                        style={{ width: "60%",marginBottom:"5px" }}
                        
                        value={selectedOptionValue}
                        className="custom-default-select"
                      
                        onChange={(event) =>
                          handleClickOption(event.target.value)
                        }
                        sx={{ textTransform: "capitalize" }}
                      >
                       
                        {preventiveFilterDpd.map((item) => (

                            <MenuItem
                            key={item.RowID}
                            value={`${item.cf_query_title}-${item.RowID}`}
                            >
                            {item.cf_query_title}
                            {item.cf_query_default_flag == 1 && (
                              <FormControlLabel
                              
                                label="Default"
                                labelPlacement="start"
                                style={{ marginLeft: 'auto',float: 'right' }}
                                control={
                                  <Checkbox
                                    checked={item.cf_query_default_flag == 1}
                                  />
                                }
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
                       {console.log("isChecked___",isChecked)}
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
                  <legend className="mailLegHding">Filter By</legend>
                  <table style={{ borderCollapse: "collapse" }} className="custom-tablE">
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
                                 className="custom-default-select"
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
                                className={`custom-default-select ${
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
                                className="custom-default-select"
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
                                className={`custom-default-select ${
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
                                className={`custom-default-select ${
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
                                className="custom-default-select"

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
                    <Button onClick={handleAddRowQrt} className="add-filter-btn">
                      <Iconify
                        icon="material-symbols:add"
                        style={{
                          verticalAlign: "0px",
                          fontSize: "16px",
                          marginRight: "2px",
                        }}
                      />
                      Add
                    </Button>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="shortBydd mt-4 shtQtr">
              <div>
              <fieldset className="short-by-fieldset">
                  <legend className="mailLegHding">Sort By</legend>
                  <table style={{ borderCollapse: "collapse" }} className="custom-tablE">
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
                      className="add-filter-btn"
                    >
                      <Iconify
                        icon="material-symbols:add"
                        style={{
                          verticalAlign: "0px",
                          fontSize: "16px",
                          marginRight: "2px",
                        }}
                      />
                      Add
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
        
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleCloseSaveAs(event, reason);
          }
        }}
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
            padding:"0px !important",
            margin:"5px !important"
          }}
        >
           <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                  {preventiveFilterDpd.map((option, index) => (
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
            <Button variant="outlined" 
             className="SaveButton"
           
             style={{
               backgroundColor: "#4CAF50",
               color: "white",
               marginRight: "10px",
             }}
             onClick={handleCFQrySaveAsBtn}>
              <Iconify icon="mingcute:save-line" /> Save
            </Button>
          </Grid>
        </DialogActions>
      </BootstrapDialog>

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

    {/* =============================== filter Genrate model  =================================  */}
     <BootstrapDialog
        onClose={handleGenrateClose}
        aria-labelledby="customized-dialog-title"
        open={showGenerateModel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="ri:ai-generate" />
          <span style={{ marginLeft: "2px" }}>PM Generation Process</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleGenrateClose}
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
          <GenerationPopup 
            data={GeneratSelectedRows} 
            AlltableData={tableData} 
            onMessage={(msg) => handleChildMessage(msg)} 
           
          />
          
        </DialogContent>
      
      </BootstrapDialog>

      <div className="AssetFromSnackbar">       
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={null}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                // sx={{
                //   boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)'
                // }}
                sx={{
                  boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)',
                  '& .MuiAlert-filledError': {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: '600',
                    position: 'relative',
                    animation: snackbarOpen ? 'bounce-in 0.5s ease-out' : 'none', // Apply bouncing animation conditionally
                  },
                }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity="error"
                  variant="filled"
                  // sx={{ backgroundColor: '#fff', color: '#000', fontWeight: '600', position: 'relative' }}
                  sx={{
                    '@keyframes bounce-in': {
                      '0%': { transform: 'scale(0.9)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }}
                >
                  {snackbarMessage}
                  
                  <LinearProgress variant="determinate" value={snackbarOpen ? 100 - progress : 0} style={{ width: '99%', position: 'absolute', bottom: '0',marginLeft: '-50px',
                  }}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'green', // Change the color here
                    },
                  }}
                   />
                   
                </Alert>
              </Snackbar>
      </div> 

      <ToastContainer />
    </>
  );
}
function applyFilter({ inputData, comparator, filters }) {

  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
