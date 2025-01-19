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
import { Checkbox, FormControlLabel, TableRow } from '@mui/material';
import { ThreeCircles } from 'react-loader-spinner';
// Toastfy
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { styled } from "@mui/material/styles";


import AssetTableFiltersResult from './AssetTableFiltersResult';
import ExportAssetlistToExcel from "./ExportFIle/ExportAssetlistToExcel";
import TableRowMui from './table-row';
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

export default function TableList() {
  const site_ID = localStorage.getItem('site_ID');
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const themLayOut = localStorage.getItem("themeLayout");
const [originalData,setOriginalData] = useState([])
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


const { selectedOption: returnedSelectedOption, comeBack } = location.state || {};
const [selectedOption, setSelectedOption] = useState(returnedSelectedOption || '');
const [selectedComeBack, setSelectedComeBack] = useState(comeBack || '');

  //const [selectedOption, setSelectedOption] = useState('');

  const confirm = useBoolean();

  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const numberOfColumns = "71";
 
  const [AssetFiledname, setAssetFiledname] = useState([]);
 

  const [TitleAstReg, setTitleAstReg] = useState("");

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
  const [UserPermission, setUserPermission] = useState([]);
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
  const [ignoreEffect, setIgnoreEffect] = useState(false);
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



 
  



  // Get Api data useEffect

  const fetchData = useCallback(async () => {
    setIsLoading(true);
   
    try {
      const response = await httpCommon.get(
        `/get_password_policy_table_data.php`
      );
      console.log("response_password",response)
    
      setOriginalData(response.data.data.result)
      setTableData(response.data.data.result)
      setOriginalData(response.data.data.result)
      setTotalRow(response.data.DashbrdCount);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [site_ID, currentPage]);


  useEffect(()=>{
    getGroupLabel();
    fetchData();
  },[])


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
        navigate(`/dashboard/system-admin/password-policy/form`, {
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
    [router,currentPage, selectDropRowID,selectedOption]
  );

  const handleRowClickTable = useCallback(
    
    (id,row) => {
      const Rowid = id;
      const AstNo = row.col1;
      if (Rowid !== '' && Rowid !== null) {
        navigate(`/dashboard/system-admin/password-policy/form`, {
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
    [router,currentPage, selectDropRowID,selectedOption]
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
    [router,currentPage, selectedOption]
  );

  const handlePrintQr = useCallback((id) => {
    setshowQrModel(true);
    const Rowid = id;
    setQrCodeRowId(Rowid);
   
  });

 

  const handleCloseQrCode = () => {
    setshowQrModel(false);
  };


  const handleResetFilters = useCallback(() => {
    setInputValueSearch('');
    setTableData("");
    if (inputRef.current) {
      inputRef.current.value = ''; // Clear the input field value directly
    }
   
   
  }, []);


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




 
// Search Button Click funcation
const handelSearchButton = async () => {
  const inputValueGet = inputRef.current.value.trim(); // Use trim to remove unnecessary spaces
  
  // If the input is not empty, proceed with filtering
  if (inputValueGet) {
    Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
    Swal.showLoading();
    
    // Create a search string once, convert it to lowercase
    const searchString = inputValueGet.toLowerCase();

    // Filter the data based on search string matching site_cd or site_name
    const filteredData = originalData.filter((item) => {
      const col1 = (item.site_cd || "").toLowerCase();
      const col2 = (item.site_name || "").toLowerCase();
      
      return col1.includes(searchString) || col2.includes(searchString);
    });

    // Check if any data was found, and update the state accordingly
    if (filteredData.length > 0) {
      setTableData(filteredData);

    } else {
      Swal.fire({
        title: "No Results Found",
        icon: "info",
        timer: 1500,
      });
      // Optionally: setTableData([]) to clear table if no results
    }

    Swal.close(); // Close the loading indicator
  } else {
    // If search input is empty, restore original data
    setTableData(originalData); // You should have the full data set saved somewhere
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



const handleExportClick = async () => {
  if(tableData && tableData.length > 0){
    Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
    Swal.showLoading();
      if (
        tableData && tableData.length > 0
      ) {
        ExportAssetlistToExcel({ resultData: tableData });
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
    }
  }



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

};


const fetchDataResponse = async (hasRowIdValuept) => {
  try {

    const response = await httpCommon.post(
      "/get_asset_dropdown_prompt_data.php?page=" + currentPage,
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


const [groupLabel, setGroupLabel] = useState([]);

const getGroupLabel = async () => {
  try {
    const res = await httpCommon.get(
      "/get_supplier_master_mandatoryfiled.php",
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


const TABLE_HEAD = [
  { id: "", label: "Action", width: 60 },
  {
    id: "pac",
    label: CustomizeLable("Password Aging Control") || "Password Aging Control",
    width: 220,
  },
  {
    id: "pai",
    label: CustomizeLable("Password Aging Interval") || "Password Aging Interval",
    width:220,
    padding: 150,
  },

  {
    id: "advance_notice",
    label: CustomizeLable("Advance Notice") || "Advance Notice",
    width: 150,
    padding: 150,
  },


  {
    id: "minimum_length",
    label: CustomizeLable("Minimum Length") || "Minimum Length",
    width: 170,
    padding: 150,
  },


  {
    id: "maximum_length",
    label: CustomizeLable("Maximum Length") || "Maximum Length",
    width: 170,
    padding: 150,
  },


  {
    id: "password_criteria",
    label: CustomizeLable("Password Criteria") || "Password Criteria",
    width: 170,
    padding: 150,
  },


  {
    id: "adjacent_checking",
    label: CustomizeLable("adjacent_checking") || "adjacent_checking",
    width:170,
    padding: 170,
  },

  {
    id: "maximum_failed_login_attempts",
    label: CustomizeLable("Maximum Failed Login Attempts") || "Maximum Failed Login Attempts",
    width: 270,
    padding: 0,
  },

  {
    id: "single_session_per_user",
    label: CustomizeLable("Single Session Per User") || "Single Session Per User",
    width: 230,
    padding: 170,
  },

  {
    id: "audit_user",
    label: CustomizeLable("Audit User") || "Audit User",
    width: 220,
    padding: 170,
  },

  {
    id: "audit_date",
    label: CustomizeLable("Audit Date") || "Audit Date",
    width: 220,
    padding: 170,
  },

];


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



const handleSearchInputChange = (e) => {
  setInputValueSearch(e.target.value);
};
 
const handleClearButton = () => {
  handleResetFilters();
  // setTotalRow("");
  // if (inputRef.current) {
  //   inputRef.current.focus(); // Refocus the input field
  // }
  setTableData(originalData)
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
            heading="Password Policy List"
            links={[]}
          
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>
        <div className="workReqpage">
          <Card >
         
            <Stack
              spacing={2}
           
              direction={{
                xs: 'column',
                md: 'row',
              }}
              sx={{
                p: 2.5,
                pr: { xs: 2.5, md: 1 },
                marginTop: "20px",
                justifyContent:"space-between",
                alignItems:"center"
              }}
            >



                  <div
                    className="wordkOrdersearchInput"
                    style={{ display: "flex", alignItems: "center",width:"30%" }}
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
              <AssetTableFiltersResult
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
                                //.filter((row, index) => index < RowPerPage)
                               // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (

                                  <TableRowMui
                                    key={row.id}
                                    row={row}
                                 
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
                  setCurrentPage(newPage + 1);
                  table.onChangePage(event, newPage);
                }}
                rowsPerPageOptions={[]} 
                currentPage={currentPage}
             
                //  onRowsPerPageChange={table.onChangeRowsPerPage}
                // onRowsPerPageChange={(rowsPerPage) => {
                //   console.log("rowsPerPage.target.value____",rowsPerPage.target.value);
                 
                //   setRowperPage(rowsPerPage.target.value);
                //  // setCurrentPage(1);
                //   table.onChangeRowsPerPage(rowsPerPage);
                // }}
                
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
