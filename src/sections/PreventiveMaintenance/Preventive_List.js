import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

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
  TableSkeleton,
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

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Checkbox, FormControlLabel } from '@mui/material';
import { ThreeCircles } from 'react-loader-spinner';
// Toastfy
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { styled } from "@mui/material/styles";

//


import ExportPrlistToExcel from './ExportFIle/ExportPrlistToExcel';
import MTRTableRow from './mtr-table-row';
import MTRTableFiltersResult from './MTRTableFiltersResult';

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

export default function Preventive_List() {


  const site_ID = localStorage.getItem('site_ID');
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const themLayOut = localStorage.getItem("themeLayout");
  const location = useLocation();
  const [DashbordDataGauge, setDashbordDataGauge] = useState(
    location.state?.GaugeDashbordData
  );
  
  const DashbordDataSrt = location.state?.GaugeDashbordDataSort || [];

  const [DropListIdGet, setDropListIdGet] = useState(
    location.state?.DropListId || []
  );
 
  const [isLoading, setIsLoading] = useState(true);
  const popover = usePopover();
  const router = useRouter();
  const navigate = useNavigate();
  const table = useTable();

  const settings = useSettingsContext();
  const [maxHeight, setMaxHeight] = useState("400px");
  const [tableData, setTableData] = useState([]);
  const [totalRow, setTotalRow] = useState();
  const [Headerdata, setheaderData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);
  const [groupLabel, setGroupLabel] = useState([]);

const { selectedOption: returnedSelectedOption, comeBack } = location.state || {};
const [selectedOption, setSelectedOption] = useState(returnedSelectedOption || '');
const [selectedComeBack, setSelectedComeBack] = useState(comeBack || '');

  //const [selectedOption, setSelectedOption] = useState('');

  const confirm = useBoolean();

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageClick, setCurrentPageClick] = useState(1);
  const inputRef = useRef(null);
  const numberOfColumns = "71";
  const [FilterShow, setFilterShow] = useState(false);
  const [ResponceStats, setResponceStats] = useState("");
  const [isChecked, setIsChecked] = useState(null);
 

  const [showSave, setShowSave] = useState(false);
  const [AssetFiledname, setAssetFiledname] = useState([]);
  const [selectedOptionEmptyError, setSelectedOptionEmptyError] =
  useState(false);
  const [selectedOptionEmptyErrorShort, setSelectedOptionEmptyErrorShort] =
  useState(false);
  const [valueptEmptyError, setValueptEmptyError] = useState(false);
  const [logicalEmptyError, setLogicalEmptyError] = useState(false);
  const [TitleAstReg, setTitleAstReg] = useState("");
  const [assetFilterDpd, setAssetFilterDpd] = useState([]);
 
  const [selectedOptionValue, setselectedOptionValue] = useState();
  
  const [showWordOrderQryList, setShowWordOrderQryList] = useState(false);
  const handleShowWorkOrderQryList = () => setShowWordOrderQryList(true);
  const [showSaveAs, setShowSaveAs] = useState(false);
 
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
  const [selectTempDropRowID, setselectTempDropRowID] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [TableSearchData, setTableSearchData] = useState([]);

  const [DefineQueryBtn, setDefineQueryBtn] = useState("");
  const [showQrModel, setshowQrModel] = useState(false);
  const [availabilityQRCode, setAvailabilityQRCode] = useState('selected1');
  const [QrCodeRowId, setQrCodeRowId] = useState("");

  const [QueryTitleRowId, setQueryTitleRowID] = useState("");
  const [defaultTitle, setDefaultTitle] = useState('');
  const [tempRowID, setTempRowID] = useState(null);

  const [showPromtRetiveBtn, setShowPromtRetiveBtn] = useState(false);
  const [showPromt, setShowPromt] = useState(false);
  const [rowlikeset, setRowlikeset] = useState("like");
  const [rowAndset, setRowAndset] = useState("And");
  const [rowQtrlikeset, setRowQtrlikeset] = useState("like");
  const [rowQtrAndset, setRowQtrAndset] = useState("And");
  //const [availabilityQRCode, setAvailabilityQRCode] = useState("And");
  const [rowsDropdownPrompt, setRowsDropdownPrompt] = useState([
    {
      selectedOption: "",
      operator: "",
      logical: "",
      valuept: "",
      RowId:"",
      prompt:"",
      siteCd: site_ID,
      Column:"",
      queryTypedd: "F",
    },
  ]);

  const [inputValueSearch, setInputValueSearch] = useState('');

  const fetchFilterSubPopupSavedropdon = async () => {
    // Get dropdown value using api
    
    try {
      const response = await httpCommon.get(
        `/get_pro_pr_filter_dropdown.php?site_cd=${site_ID}&auditUser=${AuditUser}`
      );
      setAssetFilterDpd(response.data);
  // Swal.close();
      if (DropListIdGet !== "" && DropListIdGet !== null) {
        const matchedItem = response.data.find(
          (item) => item.RowID === DropListIdGet
        );
        if (matchedItem) {
          const cfQueryDescValue = matchedItem.cf_query_title;

          setTitleAstReg(cfQueryDescValue);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

    //  fetch the data Gauge dashbord
    const fetchDataGaugeDSB = useCallback(async () => {
      setIsLoading(true);
      // later

      // try {
      //   const response = await httpCommon.post(
      //     "/get_gauge_dashbord_asset_data.php?page=" + currentPage,
      //     {
      //       rows: DashbordDataGauge,
      //       rowsort: DashbordDataSrt,
      //      // rowsPrm: DashbordDataPrmMst,
      //       site_cd: site_ID,
      //       emp_ID:emp_owner,
      //     }
      //   );
      //  console.log("response_____using _dashbord",response);
      //   if (response.data.status === "SUCCESS") {
      //     if (response.data.data.result.length > 0) {
      //       setheaderData(response.data.data.header);
      //       setTableData(response.data.data.result);
      //       setTotalRow(response.data.total_count);
      //      // setResponceStats(response.data.StatusPRM);
      //      // setTotalCount(response.data.TotalCountPRM);
      //     }
         
      //     setIsLoading(false);
      //   }
      // } catch (error) {
      //   console.error("Error fetching data:", error);
      // }
    }, [site_ID]);
  
  // Get Api data useEffect

  const fetchData = useCallback(async () => {

    
    setIsLoading(true);
   
    try {
      const response = await httpCommon.get(
        `/get_porcument_pr_master_table_data.php?site_cd=${site_ID}&page=${currentPage}`
      );
   
     // get Dropdown Title
     const response2 = await httpCommon.get(
      `/get_pro_pr_filter_dropdown.php?site_cd=${site_ID}&auditUser=${AuditUser}`
    );


      if(selectedOption === ""){
      

     const defaultItem = response2.data.find(item => item.cf_query_default_flag === "1");
      if (defaultItem) {
        setDefaultTitle(defaultItem.cf_query_title);
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
  }, [site_ID]);




  useEffect(() => {
    if (defaultTitle) {
      
      handleOptionTableList({ target: { value: defaultTitle }});

    }
  }, [defaultTitle,site_ID]);
  
  const handleOptionTableList = async (event,responseData) => {
  
    const selectedValue = event?.target?.value || selectedOption;
   
    setCurrentPage(1);
  
    const selectedOptionObjectFilter = assetFilterDpd.find(
      (item) => item.cf_query_title === selectedValue
    );

    if (selectedOptionObjectFilter) {
      const GetRowID = selectedOptionObjectFilter.RowID;
      const GetPrompt = selectedOptionObjectFilter.cf_query_list_prompt;
      if (selectedComeBack === "" || selectedComeBack === undefined){
        if(GetPrompt == '1'){
          setShowPromt(true);
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
      setselectTempDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
      setDashbordDataGauge([]);
      setTitleAstReg("");
    }
    setSelectedOption(selectedValue);
  };

  const handleOptionChange = async (event,responseData) => {
    const selectedValue = event?.target?.value || selectedOption;

    setDefaultTitle("");
    setSelectedComeBack("");
    setCurrentPage(1);

    const selectedOptionObjectFilter = assetFilterDpd.find(
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
        setIsLoading(true);
  
        try {
          const response = await httpCommon.get(
            "/get_pur_filter_query_data.php?site_cd=" +
              site_ID +
              "&RowID=" +
              GetRowID
          );
          
console.log("response__d",response)

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

            console.log("_newRows",newRows)
            setRowsDropdownPrompt(newRows);
           
            setSelectedOption(selectedValue);
            //setShowAssetByDescp(false);
          } else {
            setIsLoading(false);
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
        } finally {
          setIsLoading(false); // Ensure the loader is stopped after data has been processed
        }
        return;
      }
     
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setselectTempDropRowID(GetRowID);
      setCurrentPage(1);
      setDropListIdGet([]);
      setDashbordDataGauge([]);
      setTitleAstReg("");
    }else{
    
      const GetRowID = selectedOptionObject.RowID;
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setselectTempDropRowID(GetRowID);
      setSelectedOption(selectedValue);
      setCurrentPage(1);
      setDropListIdGet([]);
      setDashbordDataGauge([]);
      setTitleAstReg("");
    }
   
   // setSelectedOption(selectedValue);
   setSelectedOption(selectedValue);
   await new Promise((resolve) => setTimeout(resolve, 0));
  };

  const getb = useCallback(async () => {
  
    setIsLoading(true);
    try {
     
      const response = await httpCommon.post(
        `/get_pro_pr_list_selectoption_data.php?site_cd=${site_ID}&ItemID=${selectDropRowID}&page=${currentPage}&EmpId=${emp_owner}`
      );
      
    
     
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        
        setTableData(response.data.data.result);
        setTotalRow(response.data.data.result.length);
        setExportExcelId(selectDropRowID);

       // Swal.close();
        setIsLoading(false);
      } else {
        setTableData("");
        setTotalRow("");
        setIsLoading(false);
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
  }, [site_ID,  selectDropRowID]);

const fetchDataUsingRefreshBtn = useCallback(async () =>{
     getb();
}, [site_ID,  selectDropRowID]);

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
           // console.log("response_____delete___",response);
            if(response.data.status == "SUCCESS"){
              Swal.fire({
              title: "Deleted!",
              text: "Asset Record Delete Successfully",
              icon: "success",
              confirmButtonText: "OK",
              timer: 3000,
              timerProgressBar: true, 
              });
              //fetchData();
              getb();
            }
            if(response.data.status == "ERROR"){
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
    (id,row) => {

      const Rowid = id;
      const AstNo = row.col1;
     
      if (Rowid !== '' && AstNo !== '') {
        navigate(`/dashboard/maintenance-request/editmtr`, {
          state: {
            RowID:Rowid,
            Ast_no:AstNo,
            currentPage,
            selectDropRowID,
            selectedOption,
          },
        });
      }

    },
    [router, selectDropRowID,selectedOption]
  );

  const handleRowClickTable = useCallback(
    
    (id,row) => {
      const Rowid = id;
      const AstNo = row.col1;
      // if (Rowid !== '' && Rowid !== null) {
      //   navigate(`/dashboard/asset/editasset`, {
      //     state: {
      //       RowID:Rowid,
      //       Ast_no:AstNo,
      //       currentPage,
      //       selectDropRowID,
      //       selectedOption,
      //     },
      //   });
      // }
    },
    [router, selectDropRowID,selectedOption]
  );

  const handleDuplicateRow = useCallback(
    (id,row) => {
     
      const DuplicatRowid = id;
      const AstNo = row.col1;
      if (DuplicatRowid !== '' ) {
        navigate(`/dashboard/asset/newasset`, {
          state: {
            DuplicatRowid:DuplicatRowid,
            DupRowID:DuplicatRowid,
            DupAst_no:AstNo,
            currentPage,
            selectedOption,
          },
        });
      }
    
    },
    [router, selectedOption]
  );

  const handlePrintQr = useCallback((id) => {
    setshowQrModel(true);
    const Rowid = id;
    setQrCodeRowId(Rowid);
   
  });

  const handleQRCodePrintBtn = () => {
   
    if (QrCodeRowId !== '' && availabilityQRCode !== null) {
        navigate(`/dashboard/asset/assetPrintQr`, {
          state: {
            RowID:QrCodeRowId,
            selectedVlue:availabilityQRCode,
            ItemID:selectDropRowID,
          },
        });
      }
   }

  const handleCloseQrCode = () => {
    setshowQrModel(false);
  };

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setInputValueSearch('');
    setTableData("");
    if (inputRef.current) {
      inputRef.current.value = ''; // Clear the input field value directly
    }
    if(selectDropRowID !=="" && selectDropRowID !== null){
      getb();
    }
   
  }, [getb]);


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
    setRowlikeset(operator);
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
    setRowAndset(logical.target.value);
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
    // Set error states based on which fields are empty
    setSelectedOptionEmptyError(!lastRow.selectedOption || lastRow.selectedOption === "");
    setValueptEmptyError(!lastRow.valuept || lastRow.valuept === "");
  
  } else {
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
   
    // Call your custom logic here before closing the filter
 
   

    const emptyRowSortQrt = {
      selectedOptionShort: "",
      promptAsd: "ASC",
      siteCd: site_ID,
      queryType: "S",
    };
    setRowlikeset("like")
    setRowQtrAndset("And")
    setRowAndset("And")
    setRowQtrlikeset("like")
    setRowsort([emptyRowSortQrt]); 
  
    setSelectedOptionEmptyError(false);
    setValueptEmptyError(false);
    setLogicalEmptyError(false);
    setSelectedOptionEmptyErrorShort(false);
    setFilterShow(false);
    const emptyRowQrt = {
      selectedOption: "",
      operator: "like",
      logical: "And",
      prompt: "0",
      valuept: "",
      siteCd: site_ID,
      queryTypedd: "F",
    };
    setRows([emptyRowQrt]); 
  };

  const handelFilterAction = () => {
  
    
    setselectDropRowID("");
    setCurrentPage(1);
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
    getAssetListLebel();
  };
  const rowOptions = AssetFiledname.map((row) => ({
    value: row.column_name,
    label: `${row.customize_header}`,
  }));
    /* Filter dropdown value */
    const getAssetListLebel = async () => {
      try {
        const response = await httpCommon.get("/get_pur_filled_name.php");
        //console.log("response___assetList",response);
        if (response.data.status == "SUCCESS") {
          setAssetFiledname(response.data.data);
          //setAstdetLabel(response.data.data.ast_det);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

// Retrive button  funcation,setTableData

  const RetriveData = useCallback(async () => {
 
    let hasEmptyOperator = false;
    let hasEmptyValuept = false;
    let fieldName = '';

    for (const row of rows) {
      if (!row.operator) {
          hasEmptyOperator = true;
      }
      if (!row.valuept) {
          hasEmptyValuept = true;
      }
     
      // If any required field is empty, determine the message and exit the loop
      if (hasEmptyOperator || hasEmptyValuept ) {
          if (hasEmptyOperator && hasEmptyValuept ) {
              fieldName = "Operator and Value";
          } else if (hasEmptyOperator && hasEmptyValuept) {
              fieldName = "Operator and Value";
          } else if (hasEmptyOperator) {
              fieldName = "Operator";
          } else if (hasEmptyValuept) {
              fieldName = "Value";
          } 
          break;  // Stop checking further rows if an error is found
      }
  }
  if (DefineQueryBtn === "") {
    if (fieldName !== '') {  // If any field was missing, show the error message
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
    setSelectedOption("");
    setselectDropRowID("");
    setselectTempDropRowID("");
   
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
        "/get_retrive_popup_pur_filed_data.php?page=" + currentPage,
        {
          rows: rows,
          rowsort: rowsort,
          SiteCD: site_ID,
          admin: emp_owner,
        }
      );
      
    

      if (
        response.data.status === "SUCCESS"
      ) {
       // setTableData(response.data.data.result);
       // setTotalRow(response.data.total_count);
       // setTitleAstReg(response.data.titleName);
      
        setSelectedOption(response.data.titleName);
        setselectDropRowID(response.data.SelectId);
        setselectTempDropRowID(response.data.SelectId);
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
  }
  }, [site_ID,rows,rowsort]);

  const RetriveDataAllData = useCallback(async () => {
 //   console.log("retrive_all Data____");
    setSelectedOption("");
    setselectDropRowID("");
    setDropListIdGet("");
    setIsLoading(true);
    try {
      const response = await httpCommon.post(
        "/get_retrive_procurement_pr_all_data.php?page=" + currentPage,
        {
          SiteCD: site_ID,
          admin: emp_owner,
        }
      );

console.log("response__",response)

      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        setTableData(response.data.data.result);
       setTotalRow(response.data.total_count);
      //  setTitleAstReg(response.data.titleName);
      // console.log("getingt___report__");
      
        setSelectedOption(response.data.titleName);
        setselectTempDropRowID(response.data.titleRowId);
        setselectDropRowID(response.data.titleRowId);
        // setDefineQueryBtn("RetriveData");
        await new Promise(resolve => setTimeout(resolve, 0));
     
        Swal.close();
        FilterhandleClose();
    
      } else {
        setTableData("");
        setTotalRow("");
        setIsLoading(false);
        FilterhandleClose();
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
    }finally {
      setIsLoading(false);
    }
  }, [site_ID,selectDropRowID]);



    const retriveBtn = () => {
      if (rows.some((row) => row.selectedOption !== "")) {
       
        RetriveData();
      }else{
        
          RetriveDataAllData();
      }
    };

    const SaveRegTbl = () => {
      setShowSave(true);
      fetchFilterSubPopupSavedropdon();
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

  const handleInputChangeQRCode = (event) => {
    setAvailabilityQRCode(event.target.value);
  }

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
        "/insert_pur_filter_query_list_data.php",
        combinedData
      );
    // console.log("response_____saveButton_res___",response);
      if (response.data.status == "SUCCESS") {
        
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
      Swal.close();
      console.error("Error fetching data:", error);
    }
  };
  // Filter Save button funcation click to
    const handleCFQrySave = () => {
   
      if (formDataSv.queryName && formDataSv.queryName.trim() !== "") {
       
        const inputValue = formDataSv.queryName;
        const matchingOption = assetFilterDpd.find(
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
       // console.log("empty__");
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
      const emptyRowQrt = {
        selectedOption: "",
        operator: "",
        logical: "",
        prompt: "",
        valuept: "",
        siteCd: site_ID, // keeping site_ID as it is
        queryTypedd: "F", // keeping queryTypedd as "F"
      };
      setRowsQrt([emptyRowQrt]); // Set one empty row
      
      // Reset rowsortQrt to have one empty row with initial structure
      const emptyRowSortQrt = {
        selectedOptionShort: "",
        promptAsd: "",
        siteCd: site_ID, 
        queryType: "S", 
      };
      setRowsortQrt([emptyRowSortQrt]); 
      setShowWordOrderQryList(false);
      FilterhandleClose();
      handleCloseSave();
      setselectedOptionValue("");
      setIsChecked(null);
      setSelectedOptionEmptyErrorQtr(false);
      setValueptEmptyErrorQtr(false);
      setLogicalEmptyErrorQtr(false);
      setSelectedOptionEmptyErrorShortQtr(false);
      //setRowsQrt([]);
     // setRowsortQrt([]);
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
          "/get_retrive_popup_asset_filed_data.php?page=" + currentPage,
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
                "/dete_mtr_define_query.php?value=" +
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
       // console.log("empty");
      }
    };
    const SaveWorkOrderQryList = async () => {
      const [cf_query_title, RowID] = selectedOptionValue.split("-");
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
        
  
        // If any required field is empty, determine the message and exit the loop
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
        Swal.showLoading();
       
        const combinedData = {
          rowsQrtData: rowsQrt,
          siteCd: site_ID,
          owner: emp_owner,
          mst_RowID: RowID,
          defaultFlag: isChecked === null ? "notCheckeset" : isChecked ? "1" : "0", 
          rowsortQrtData: rowsortQrt,
        };
    // console.log("rowsQrt____",rowsQrt);
        try {
          const response = await httpCommon.post(
            "/insert_pur_query_list_save_data.php",
            combinedData
          );
          //  console.log("response__SaveBytncf__",response);
          if (response.data.status == "SUCCESS") {
            Swal.close();
            Swal.fire({
              title: "Success!",
              text: "Your Query Update Successfully.",
              icon: "success",
              confirmButtonText: "OK",
              timer: 3000,
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
          Swal.close();
          console.error("Error fetching data:", error);
        }
      }
    };
    const SaveAsworkorderTbl = () => {
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
        const matchingOption = assetFilterDpd.find(
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
    console.log("selectedOption",selectedOption)
    let cf_query_title, RowID;

    const hyphenCount = selectedOption.split("-").length - 1;

    if(hyphenCount === 1){
       [cf_query_title, RowID] = selectedOption.split("-")
    }else{
      const parts = selectedOption.split("-");
      cf_query_title = parts[0].trim();
      RowID = parts[parts.length - 1].trim();
    }
 
    
    if(RowID !== "" && cf_query_title !==""){
      setQueryTitleRowID(RowID);
  
    const initialCheckedState = assetFilterDpd.some(
      item => item.RowID === RowID && item.cf_query_title === cf_query_title && item.cf_query_default_flag === "1"
      )
      ? true  
      : null;

    setIsChecked(initialCheckedState);

  }else{
    setIsChecked(null);
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
  setRowQtrlikeset(operator);
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
const handlelogicalValueChangeQtr2 = (index, newValue) => {
  setRowQtrAndset(newValue);
  const updatedRowsQtr = [...rowsQrt];
  updatedRowsQtr[index].logical = newValue;
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
     
    } else {
      // Add a new row
      setRowsQrt((prevRows) => [
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
      setSelectedOptionEmptyErrorQtr(false);
      setValueptEmptyErrorQtr(false);
      
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
        "/insert_pur_query_list_save_as_data.php", 
        combinedData
      );
   //  console.log("saveAsQuery_____",response);
      if (response.data.status == "SUCCESS") {
        setSelectedOption(response.data.Title);
        setselectDropRowID(response.data.ROW_ID);
        setExportExcelId(response.data.ROW_ID);
        fetchFilterSubPopupSavedropdon();
      //  RetriveDataQueryList();
        setRowsQrt([]);
        setIsChecked(null);
        setselectedOptionValue("");
        setRowsortQrt([]);
       
        handleCloseSave();
        FilterhandleClose();
        handleCloseSaveAs();
        handleCloseWorkQryList();
        Swal.close();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
      // Search Button Click funcation
      const handelSearchButton = async () => {
        const inputValueGet = inputRef.current.value;

        if(tableData.length>0){
          setIsLoading(true)
          const filteredData = tableData.filter((item) => {
            const searchString = inputValueGet.toLowerCase();
            const col1 = (item.col1 || "").toLowerCase();
            const col2 = (item.col2 || "").toLowerCase();
            const col5 = (item.col5 || "").toLowerCase();
            const col6 = (item.col6 || "").toLowerCase();
            const col7 = (item.col7 || "").toLowerCase();
            const col8 = (item.col8 || "").toLowerCase();
            const col9 = (item.col9 || "").toLowerCase();

          
            
            return (
              col1.includes(searchString) ||
              col2.includes(searchString) ||
              col5.includes(searchString) ||
              col6.includes(searchString) ||
              col7.includes(searchString) ||
              col8.includes(searchString) ||
              col9.includes(searchString) 
            

          
            );
          });
        
          setTableData(filteredData);
          setTotalRow(filteredData.length);
          setIsLoading(false)
        }else if(tableData.length === 0){

      try {
        setIsLoading(true)
              const response = await httpCommon.get(
              `/get_search_maintence_mr_module.php?site_cd=${site_ID}&searchTerm=${inputValueGet}&page=${currentPage}`
            );
            const filteredData = response.data.data.result;

                    setTableData(filteredData);
            setTableData(filteredData);
            setCurrentPage(1);
            setIsLoading(false)
            console.log("responseSerach_____",response);

      } catch (error) {
        console.error(error)
      }

        }
          


      };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
    
      const inputValue2 = inputRef.current.value;
      const newValue = inputValue2.slice(0, -1);
      
      inputRef.current.value = newValue;
      setInputValueSearch(newValue);
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

const handleExportClick = () => {

  ExportPrlistToExcel({ tableData: tableData });
  popover.onClose();
  Swal.fire({
    title: "Please Wait!",
    allowOutsideClick: false,
    customClass: {
      container: "swalcontainercustom",
    },
    timer: 1000,
  });
  Swal.showLoading();
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
      Column:"",
      queryTypedd: "F",
    },
  ]);
  setShowPromt(false);
};

const handleCloseRetrivePromt = (event, reason) => {
  if (reason === "backdropClick" || reason === "escapeKeyDown") {
    return; // Do nothing on backdrop click or escape key press
  }
  const resetRows = rows.map(row => ({
    selectedOption: "",
    operator: "like",
    logical: "And",
    prompt: "0",
    valuept: "",
    siteCd: site_ID, // Keep site_ID as it's common
    queryTypedd: "F", // Keep queryTypedd as "F" for all rows
  }));

  // Set the rows with the reset data
  setRows(resetRows);

  setShowPromtRetiveBtn(false);
  FilterhandleClose();
};

const handleInputValueChangePromptRows = (index, newValue) => {
  setRows((prevRows) =>
    prevRows.map((row, idx) =>
      idx === index ? { ...row, valuept: newValue } : row
    )
  );
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
      "/get_pur_dropdown_prompt_data.php?page=" + currentPage,
      {
        rows: rowsDropdownPrompt,
        rowsort: "",
        SiteCD:site_ID,
        admin:emp_owner,
        RowId:hasRowIdValuept
      }
    );

   // setTableData(response.data.data.result);
   //  setTotalRow(response.data.total_count);
   // setTitleAstReg(response.data.titleName);
    
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
      siteCd: site_ID,
      RowId:  hasRowIdValuept,
      owner: emp_owner,
    };
    try {
      const response = await httpCommon.post(
        "/insert_pr_query_list_prompt_save_data.php",
        combinedData
      );
        
      if (response.data.status == "SUCCESS") {
        Swal.close();
      //  setselectDropRowID(hasRowIdValuept);
        fetchDataResponse(hasRowIdValuept);
       
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

};

const handleFilterBtnPrompt = async () => {
  const hasEmptyValuept = rows.some(row => !row.valuept.trim());
 // const hasRowIdValuept = rowsDropdownPrompt.length > 0 ? rowsDropdownPrompt[0].RowId : null;

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

    const combinedDataPromt = {
      rowsQrtData: rows,
      siteCd: site_ID,
      owner: emp_owner,
    };

    try {

        const response = await httpCommon.post(
          "/insert_pur_retrive_prompt_save_data.php",
          combinedDataPromt
        );
    
        console.log("response__p",response)
        if (response.data.status === "SUCCESS") {

          setSelectedOption(response.data.titleName);
          setselectDropRowID(response.data.SelectId);
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
        handleCloseRetrivePromt();
        //FilterhandleClose();

      
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
          handleCloseRetrivePromt();
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

};

const fetchDataCallback = useCallback(fetchData, [site_ID, currentPage]);
const getbCallback = useCallback(getb, [selectDropRowID]);
const retriveDataCallback = useCallback(RetriveData, [DefineQueryBtn,currentPage]);
const [isButtonClicked, setIsButtonClicked] = useState(false);

useEffect(() => {
 
  if (selectDropRowID !== "" && selectDropRowID !== null) {
  // console.log("firstquery____");
  // getb();
  getbCallback();
  }else if(TableSearchData !="" && TableSearchData != null){
   // console.log("secondQuery____");
    handelSearchButton();
  }else if(DefineQueryBtn !== "" && DefineQueryBtn === "RetriveData"){
   // console.log("ThiredQuery____");
     retriveDataCallback();

  }else if(Array.isArray(DashbordDataGauge) && DashbordDataGauge.length > 0){
   // console.log("forthQuery____");
    
    fetchFilterSubPopupSavedropdon();
    fetchDataGaugeDSB();

 }else {
 
 // console.log("fiveQuery____");
    fetchDataCallback();
  }
 // console.log("fiveQuery____");
 fetchFilterSubPopupSavedropdon();
}, [site_ID, selectDropRowID, fetchDataCallback, getbCallback, retriveDataCallback,fetchDataGaugeDSB,isButtonClicked]);

const getGroupLabel = async () => {
  try {
    const res = await httpCommon.get(
    "/get_pro_pr_mandatoryfiled.php",
    );
    if (res.data.status === "SUCCESS") {
      setGroupLabel(res.data.mandatory_fields);
    }
  } catch (error) {}
};


const CustomizeLable = (name) => {
  let res;
  if (groupLabel) {
    res = groupLabel.find((item) => item.column_name === name);
  }
  return res ? res.default_header : "";
};

useEffect(() => {
  getGroupLabel();
}, []);


const TABLE_HEAD = [
  { id: "", label: "Action", width: 60 },
  {
    id: "col1",
    label: CustomizeLable("pur_mst_porqnnum") || "______",
    width: 120,
  },
  {
    id: "col2",
    label: CustomizeLable("pur_mst_status") || "______",
    width: 100,
    padding: 10,
  },
  {
    id: "col3",
    label: CustomizeLable("pur_mst_rqn_date") || "_____",
    width: 120,
  },
  {
    id: "col4",
    label: CustomizeLable("pur_mst_req_date") || "___",
    width: 130,
  },
  {
    id: "col5",
    label: CustomizeLable("pur_mst_requested_by") || "________",
    width: 160,
  },
  {
    id: "col6",
    label: CustomizeLable("requestor_name") || "Requestor Name",
    width: 160,
  },
  {
    id: "col7",
    label: CustomizeLable("pur_mst_chg_costcenter") || "_____________",
    width: 190,
  },
  {
    id: "col8",
    label: CustomizeLable("pur_mst_chg_account") || "_________",
    width: 200,
  },
  {
    id: "col9",
    label:
      CustomizeLable("pur_mst_op_flag") || "_________",
    width: 180,
  },
  {
    id: "col10",
    label: CustomizeLable("pur_mst_release_for_app") || "________",
    width: 170,
  },
  {
    id: "col11",
    label: CustomizeLable("pur_mst_pur_email_requestor") || "__________",
    width: 200,
  },
  {
    id: "col12",
    label: CustomizeLable("pur_mst_purq_approve") || "_________",
    width: 140,
  },
  {
    id: "col13",
    label: CustomizeLable("pur_mst_sub_tot_cost") || "________",
    width: 100,
  },
  {
    id: "col14",
    label: CustomizeLable("pur_mst_tax") || "______",
    width: 80,
  },

  {
    id: "col15",
    label: CustomizeLable("pur_mst_tot_cost") || "_________",
    width: 100,
  },
  {
    id: "col16",
    label: CustomizeLable("Approval_Status") || "Approval Status",
    width: 140,
  },

  {
    id: "col17",
    label: CustomizeLable("Covert_Status") || "Convert To PO Status",
    width: 200,
  },
  {
    id: "col18",
    label: CustomizeLable("pur_mst_entered_by") || "_______",
    width: 160,
  },
  {
    id: "col19",
    label: CustomizeLable("pur_mst_crd_costcenter") || "______",
    width: 155,
  },
  {
    id: "col20",
    label: CustomizeLable("pur_mst_crd_account") || "______",
    width: 120,
  },
  {
    id: "col21",
    label: CustomizeLable("pur_mst_dept") || "____",
    width: 140,
  },
  {
    id: "col22",
    label: CustomizeLable("pur_mst_notes") || "____",
    width: 160,
  },
  {
    id: "col23",
    label: CustomizeLable("pur_mst_projectid") || "____",
    width: 120,
  },
  {
    id: "col24",
    label: CustomizeLable("pur_mst_buyer") || "_____",
    width: 200,
  },

  {
    id: "col25",
    label: CustomizeLable("pur_mst_create_by") || "______",
    width: 120,
  },
  {
    id: "col26",
    label: CustomizeLable("pur_mst_create_date") || "_________",
    width: 200,
  },
 
];


const handleCurenntPage= async(page)=>{

try {
     
  const response = await httpCommon.post(
    `/get_pro_pr_list_selectoption_data.php?site_cd=${site_ID}&ItemID=${selectDropRowID}&page=${page}&EmpId=${emp_owner}`
  );
  
  console.log("Response_db_page",response)
 
  if (
    response.data.data &&
    response.data.data.result &&
    response.data.data.result.length > 0
  ) {
    
    setTableData(response.data.data.result);
    setTotalRow(response.data.data.length);
    setExportExcelId(selectDropRowID);

   // Swal.close();
    setIsLoading(false);
  } else {
    setTableData("");
    setTotalRow("");
    setIsLoading(false);
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




// // Add Table Header Daynamic value pass
// const TABLE_HEAD = Headerdata && Headerdata.map((item, index) => {
//   console.log("item_head",item)
//   const width = [200, 170, 120, 125, 200, 160,125,200,200,250,120,145,150,200,125,120,180,180,130,155,170,180,160,170,170,160,170,170,160,160,180,160,160,170,195,140,80,80,100,140,155,100,85,125,125,150,150,150,150,150,150,150,150,150,150,150,150,150,150,130][index]; 
//   return {
//     id: item.accessor,
//     label: item.Header,
//     width
//   };
// });



// if (TABLE_HEAD) {

//   // Add 'Action' at the beginning without affecting other indices
//   TABLE_HEAD.unshift({ id: '', label: 'Action', width: 60 });

//   // Update the label at the 8th position only if it’s needed, not replacing
//   if (TABLE_HEAD.length > 7) {
//     TABLE_HEAD.splice(7, 0, { id: 'col8', label: 'Issue Status', width: 60 });
//   }
// }





const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [isOptionSelected, setIsOptionSelected] = useState(TitleAstReg !== "" || selectedOption);

const handleDropdownOpen = () => {
 // console.log("Handal click open");
  setIsDropdownOpen(true);
};

const handleDropdownClose = () => {
  
  setTimeout(() => {
    if (!isOptionSelected) {
      setIsDropdownOpen(false);
    }
  }, 0);
};

const handleOptionChangeInternal = (event) => {
  handleOptionChange(event);
  setIsOptionSelected(event.target.value !== "");
  setIsDropdownOpen(false);
};

const handleSearchInputChange = (e) => {
  setInputValueSearch(e.target.value);
};
 
const handleClearButton = () => {
  handleResetFilters();
  setTotalRow("");
  if (inputRef.current) {
    inputRef.current.focus(); // Refocus the input field
  }
};
  return (
    <>
      <Helmet>
        <title>CMMS System</title>
        <meta name="description" content="CMMS System" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>

        
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
            heading="Purchase Request List"
            links={[]}
            action={
              <Button
                component={RouterLink}
                // href={paths.dashboard.product.new}
                variant="contained"
                className='AddNewButton'
                startIcon={<Iconify icon="mingcute:add-line" />}
                // to={{
                //   pathname: "/dashboard/asset/newasset",
                //   state: { select: "New_Asset" },
                // }}
              >
             
                New
              </Button>
              
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>


        <div className="workReqpage">
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
                <Icon icon="fluent:filter-12-filled" style={{ marginRight: '5px' }} /> Filter
              </Button>
              <FormControl
                sx={{
                  flexShrink: 0,
                  width: { xs: 1, md: 300 },
                }}
                className="selectOptioncls"
              >
                 {/* <InputLabel id="select-label"  className={`select-label ${(isDropdownOpen || isOptionSelected) ? 'hiddendd' : ''}`}>Select an Query</InputLabel> */}
               <InputLabel id="select-label" className={(TitleAstReg!== "" || selectedOption)? "selectedcss" : "defaultLabelSelect"}>Select Query</InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                 // input={<OutlinedInput label="Select an option" />}
                  value={TitleAstReg !== "" ? TitleAstReg : selectedOption}
                  onChange={handleOptionChangeInternal}
                  onOpen={handleDropdownOpen}
                  onClose={handleDropdownClose}
                  sx={{ textTransform: 'capitalize' }}
                >
                
                  {assetFilterDpd.map((item) => (
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
              <MTRTableFiltersResult
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
                            {tableData?.length === 0 ? (
                              <TableRow   
                              className="noDataFound">
                                 {/* <TableCell colSpan={themLayOut === 'mini' ? 4.9 : themLayOut === 'vertical' ? 4.5 : 5} sx={{ p: 0 }}></TableCell>
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
                                  </TableCell> */}
                                  <TableCell  sx={{ p: 0 }}></TableCell>
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
                               
                                .map((row) => (
                                  <MTRTableRow
                                    key={row.id}
                                    row={row}
                                    rowStats={ResponceStats}
                                    selected={table.selected.includes(row.col61)}
                                    onSelectRow={() => table.onSelectRow(row.col61)}
                                    onDeleteRow={() => handleDeleteRow(row.col61,row)}
                                    onEditRow={() => handleEditRow(row.col61,row)}
                                    onDuplicateRow = {() => handleDuplicateRow(row.col61,row)} 
                                    onPrintQrCode = {() => handlePrintQr(row.col61,row)} 
                                    onClick={() => handleRowClickTable(row.col61,row)}
                                 //   onCompleteRow={() => handleCompleteRow(row.col71)}
                                  //  onCloseRow={() => handleCloseRow(row.col71)}
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
                            tableData ? tableData.length : 0
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
                 handleCurenntPage(newPage + 1)
                  setCurrentPage(newPage + 1);
                  table.onChangePage(event, newPage);
                }}
                rowsPerPageOptions={[]} 
                currentPage={currentPage}

              />
            
              
          </Card>
        </div>
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
          onClick={() => FilterhandleClose()}
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
                 // disabled={isButtonDisabled}
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
                          value={rowlikeset}
                        >
                          
                          {oprt.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </td>
                      <td style={{ width: "8%",textAlign: "center"}}>
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
                          value={rowAndset}
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
                          className="form-check-input"
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
                  {assetFilterDpd.map((option, index) => (
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
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios1"
                  value="G"
                  checked
                  onChange={handleInputChangeSav}
                />
                <label className="form-check-label" for="exampleRadios1">
                  Global(available to everyone)
                </label>
                <input
                  className="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios2"
                  value="P"
                  onChange={handleInputChangeSav}
                />
                <label className="form-check-label" for="exampleRadios2">
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
      //  onClose={handleCloseWorkQryList}
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
                        className="custom-default-select"
                        onChange={(event) =>
                          handleClickOption(event.target.value)
                        }
                        renderValue={(selected) => selected.split('-')[0]}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {assetFilterDpd.map((item) => (
                          
                          <MenuItem
                            key={item.RowID}
                            value={`${item.cf_query_title}-${item.RowID}`}
                          >
                            {item.cf_query_title}
                            {item.cf_query_default_flag == 1 && (
                              <FormControlLabel
                               
                                label="Default"
                                 labelPlacement="start"
                                style={{ marginLeft: 'auto' }}
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
                        <input
                          className="form-check-input"
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
                               
                                onChange={(event) =>
                                  handleOptionChangeOprterQtr(
                                    index,
                                    event.target.value
                                  )
                                }
                                value={rowQtrlikeset}
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
                                 className="custom-default-select"
                                type="checkbox"
                                onChange={(e) =>
                                  handleSelectChangeQtr(index, e.target.checked)
                                }
                                checked={row.prompt === "1"}
                                id="flexCheckDefault"
                                style={{
                                  display: "block", 
                                  margin: "0 auto", 
                                  width: "30%" 
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
                                value={rowQtrAndset}
                                onChange={(event) =>
                                  handlelogicalValueChangeQtr2(
                                    index,
                                    event.target.value
                                  )
                                  
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
                              className="form-check-input"
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
                  {assetFilterDpd.map((option, index) => (
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
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios1"
                  value="G"
                  checked
                  onChange={handleInputChangeSav}
                />
                <label className="form-check-label" for="exampleRadios1">
                  Global(available to everyone)
                </label>
                <input
                  className="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios2"
                  value="P"
                  onChange={handleInputChangeSav}
                />
                <label className="form-check-label" for="exampleRadios2">
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
        {/* =============================== filter model Print Qr   =================================  */}
        <BootstrapDialog
        onClose={handleCloseQrCode}
        aria-labelledby="customized-dialog-title"
        open={showQrModel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="fluent:print-48-regular" />
          <span style={{ marginLeft: "2px" }}>Asset QRCode Printing Selection</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseQrCode}
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
              <legend>Asset Selection:</legend>
              <div className="form-check">
                <div style={{ marginBottom : "5px" }}>
                  <input
                  className="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios1"
                  value="selected1"
                  checked={availabilityQRCode === "selected1"}
                  onChange={handleInputChangeQRCode}
                />
                <label class="form-check-label" for="exampleRadios1">
                  Print 1 Selected Asset QRCode.
                </label>
                </div>
                <div>
                <input
                  className="form-check-input"
                  type="radio"
                  name="availability"
                  id="exampleRadios2"
                  value="All"
                  checked={availabilityQRCode === "All"}
                  onChange={handleInputChangeQRCode}
                />
                <label className="form-check-label" for="exampleRadios2">
                  Print All {totalRow} Asset QRCode.
                </label>
              </div>
              </div>
            </fieldset>
          </div>
        </DialogContent>
        <DialogActions>
          <Grid item>
            <Button className="SaveButton" variant="outlined" 
            style={{
                backgroundColor: "#4CAF50",
                color: "white",
                marginRight: "10px",
              }}
               onClick={handleQRCodePrintBtn}>
              <Iconify icon="fluent:print-48-regular" /> Print
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
                      <td style={{ width: "25%", textAlign: 'center' }}>
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

                      <td style={{ width: "25%" ,textAlign: 'center' }}>
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
                      <td style={{ width: "25%",textAlign: 'center' }}>
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
                      <td style={{ width: "25%",textAlign: 'center' }}>
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
      {/* =============================== filter Button Prompt  =================================  */}
      <BootstrapDialog
        onClose={handleCloseRetrivePromt}
        aria-labelledby="customized-dialog-title"
        open={showPromtRetiveBtn}
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
          onClick={() => handleCloseRetrivePromt()}
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
                  {rows.map((row, index) => {

                    const isRowEmpty = !row.selectedOption && !row.operator && !row.valuept;
                    const selectedOptionLabel = rowOptions.find(option => option.value === row.selectedOption)?.label || row.selectedOption;
                    return !isRowEmpty ? (
                    <tr key={index}>
                      <td style={{ width: "25%", textAlign: 'center' }}>
                      <input
                          type="text"
                          style={{ width: "100%", textAlign: 'center' }}
                          disabled
                          value={selectedOptionLabel}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          oninput="handleInput(event)"
                          
                        />
                      </td>

                      <td style={{ width: "25%" ,textAlign: 'center' }}>
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
                      <td style={{ width: "25%",textAlign: 'center' }}>
                      <input
                          type="text"
                          style={{ width: "100%", textAlign: 'center' }}
                          value={row.valuept || ""}
                          className={`custom-Astselect ${
                            index === rows.length - 1 && valueptEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                         
                          onChange={(event) => handleInputValueChangePromptRows(index, event.target.value)}
                        />
                       
                      </td>
                      <td style={{ width: "25%",textAlign: 'center' }}>
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
               onClick={handleFilterBtnPrompt}>
              <Iconify icon="iconoir:submit-document" /> Retrieve
            </Button>
          </Grid>
        </DialogActions>
      </BootstrapDialog>
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

  //   if (name) {
  //     inputData = inputData.filter(
  //       (tableData) => tableData.col2.toLowerCase().indexOf(col2.toLowerCase()) !== -1
  //     );
  //   }
  return inputData;
}
