import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback, useRef, useContext } from "react";

import React from "react";
import {useNavigate, useLocation } from "react-router-dom";
// @mui
import Grid from "@mui/material/Unstable_Grid2";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// routes
import { useRouter } from "src/routes/hooks";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

// hooks
import { useBoolean } from "src/hooks/use-boolean";
// _mock

// components
import { useSettingsContext } from "src/components/settings";


import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";

import { Icon } from "@iconify/react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Radio from "@mui/material/Radio";

import FormControlLabel from "@mui/material/FormControlLabel";

import { styled } from "@mui/material/styles";


//import componet Section

import WorkReqTableFiltersResult from "./WorkReqTableFiltersResult";
import ExportToExcel from "./component_module/ExportToExcel";

import SupplierPromt from "./component_module/SupplierPromt/SupplierPromt";
import { useSwalCloseContext } from "src/sections/ContextApi/SwalCloseContext";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { ThreeCircles } from "react-loader-spinner";
import TemplateDialog from "./Form/Template/TemplateDialog";
import { ProContext } from "./ProContext";
import ProRow from "./ProRow";
import { Checkbox } from "@mui/material";
import { height, width } from "@mui/system";


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
  col1: "",
  publish: [],
  stock: [],
};
// ----------------------------------------------------------------------

export default function SupplierList() {
 
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const {swalCloseTime} = useSwalCloseContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const popover = usePopover();
  const router = useRouter();
  const navigate = useNavigate();
  const [DefineQueryBtn, setDefineQueryBtn] = useState("");
  const table = useTable();
 
  const [showPromtRetiveBtn, setShowPromtRetiveBtn] = useState(false);
  const [selectTempDropRowID, setselectTempDropRowID] = useState("");
  const [isBoxChecked,setIsBoxChecked] = useState(false);
   const [inputValueSearch, setInputValueSearch] = useState('');

  const {
    call,
    setCall,
    setSavedQuery,
    savedQuery,
    savedOptions,
    setSavedQptions,
    rowsPromptGlobal,
    setRowsPromptGlobal,
    rowsPromptSortGlobal,
    defineQyeryRetrive,
    setDefineQueryRetrive,
    refresh,
    setRefresh,
  } = useContext(ProContext);
  const [empFlag, setEmpFlag] = useState(false);

  const [rowsDropdownPrompt, setRowsDropdownPrompt] = useState([
    {
      selectedOption: "",
      selectedOptionName: "",
      operator: "",
      logical: "",
      valuept: "",
      RowId: "",
      prompt: "",
      siteCd: site_ID,
      queryTypedd: "F",
    },
  ]);
  const location = useLocation();
  const settings = useSettingsContext();
  const [maxHeight, setMaxHeight] = useState("400px");
  const [tableData, setTableData] = useState([]);
  const [totalRow, setTotalRow] = useState();

  const [filters, setFilters] = useState(defaultFilters);
  const { selectedOption: returnedSelectedOption, comeBack,selectedRowIdBack } = location.state || {};
  const [selectedOption, setSelectedOption] = useState(returnedSelectedOption || '');
  const [selectedComeBack, setSelectedComeBack] = useState(comeBack || '');
   const [selectedRowIdbackState, setSelectedRowIdbackState] = useState(selectedRowIdBack || '');


  const [promt, setShowPromt] = useState(false);
  const confirm = useBoolean();
 
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const numberOfColumns = "71";
  const [FilterShow, setFilterShow] = useState(false);
  const [ExportExcelId, setExportExcelId] = useState("");
  // const FilterhandleClose = () => setFilterShow(false);
  const [showSave, setShowSave] = useState(false);

  const [WorkReqFiledname, setWordReqFiledname] = useState([]);
  const [selectedOptionEmptyError, setSelectedOptionEmptyError] =
    useState(false);
  const [selectedOptionEmptyErrorShort, setSelectedOptionEmptyErrorShort] =
    useState(false);
  const [valueptEmptyError, setValueptEmptyError] = useState(false);
  const [logicalEmptyError, setLogicalEmptyError] = useState(false);
  const [TitleAstReg, setTitleAstReg] = useState("");

  // const [assetFilterDpd, setAssetFilterDpd] = useState([]);
  const [FilterDpd, setFilterDpd] = useState([]);

  const [DropListIdGet, setDropListIdGet] = useState(
    location.state?.DropListId || [],
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

  const [selectDropRowID, setselectDropRowID] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [TableSearchData, setTableSearchData] = useState([]);
  const [rowId, setRowId] = useState([]);
  const [showApprove, setShowApprove] = useState(false);
  const handleCloseApprove = () => setShowApprove(false);
  const [Status, setStatus] = useState([]);
  const [selected_Status, setSelected_Status] = useState([]);
  const [Originator, setOriginator] = useState([]);
  const [selected_Originator, setSelected_Originator] = useState([]);
  const [WorkGroup, setWorkGroup] = useState([]);
  const [selected_WorkGroup, setSelected_WorkGroup] = useState([]);
  const [Button_save, setButton_save] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fetch, setRefetch] = useState(false);
  const [showDisapprove, setShowDisapprove] = useState(false);
  const handleCloseDisapprove = () => setShowDisapprove(false);
  const [RejectDate, setRejectDate] = useState(new Date());
  const [RejectedDescription, setRejectedDescription] = useState("");
  const [template, setTemplate] = useState(false);
  const [selectRefreshId, setSelectRefreshId] =  useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(TitleAstReg !== "" || selectedOption);
    const [defaultTitle, setDefaultTitle] = useState('');
  // const [refresh,setRefresh] = useState(false)
  const [groupLabel, setGroupLabel] = useState([]);
  const [ignoreEffect, setIgnoreEffect] = useState(false);

  const handleCloseTemplate = () => {
    setTemplate(false);
  };

  const CustomizeLable = (name) => {
    let res;
    if (groupLabel) {
      res = groupLabel.find((item) => item.column_name === name);
    }
    return res ? res.customize_header : "";
  };

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

  useEffect(() => {
    getGroupLabel();
  }, []);

  const TABLE_HEAD = [
    { id: "", label: "Action", width: 60 },
    {
      id: "sup_mst_supplier_cd",
      label: CustomizeLable("sup_mst_supplier_cd") || "Supplier ID",
      width: 140,
    },
    {
      id: "sup_mst_status",
      label: CustomizeLable("sup_mst_status") || "Status",
      width: 80,
      padding: 10,
    },
    {
      id: "sup_mst_desc",
      label: CustomizeLable("sup_mst_desc") || "Description",
      width: 200,
    },
    {
      id: "sup_mst_rating",
      label: CustomizeLable("sup_mst_rating") || "Rating",
      width: 100,
    },
    {
      id: "sup_mst_curr_code",
      label: CustomizeLable("sup_mst_curr_code") || "Currency Code",
      width: 160,
    },
    {
      id: "sup_mst_fid",
      label: CustomizeLable("sup_mst_fid") || "Company Registration No",
      width: 220,
    },
    {
      id: "sup_mst_tid",
      label: CustomizeLable("sup_mst_tid") || "GST Registration No",
      width: 190,
    },
    {
      id: "sup_mst_tax_id",
      label: CustomizeLable("sup_mst_tax_id") || "GST Default Tax Code",
      width: 180,
    },
    {
      id: "sup_mst_gst_effective_date",
      label:
        CustomizeLable("sup_mst_gst_effective_date") || "GST Effective Date",
      width: 180,
    },
    {
      id: "sup_mst_gst_expire_date",
      label: CustomizeLable("sup_mst_gst_expire_date") || "GST Expire Date",
      width: 170,
    },
    {
      id: "sup_mst_ins_exp",
      label: CustomizeLable("sup_mst_ins_exp") || "Insurance Expire Date",
      width: 200,
    },
    {
      id: "sup_mst_lp_date",
      label: CustomizeLable("sup_mst_lp_date") || "Last PO Date",
      width: 140,
    },
    {
      id: "sup_mst_buyer",
      label: CustomizeLable("sup_mst_buyer") || "Buyer",
      width: 60,
    },
    {
      id: "sup_mst_terms",
      label: CustomizeLable("sup_mst_terms") || "Terms",
      width: 60,
    },

    {
      id: "sup_mst_fob",
      label: CustomizeLable("sup_mst_fob") || "Freight on Board",
      width: 160,
    },
    {
      id: "sup_mst_shipvia",
      label: CustomizeLable("sup_mst_shipvia") || "Ship Via",
      width: 100,
    },

    {
      id: "sup_mst_acct_no",
      label: CustomizeLable("sup_mst_acct_no") || "Account No",
      width: 125,
    },
    {
      id: "sup_mst_smallbu",
      label: CustomizeLable("sup_mst_smallbu") || "Small Business",
      width: 160,
    },
    {
      id: "sup_mst_on_bid_lst",
      label: CustomizeLable("sup_mst_on_bid_lst") || "On Bid List",
      width: 125,
    },
    {
      id: "sup_mst_insurance",
      label: CustomizeLable("sup_mst_insurance") || "Insurance",
      width: 120,
    },
    {
      id: "sup_mst_hub",
      label: CustomizeLable("sup_mst_hub") || "HUB Business",
      width: 140,
    },
    {
      id: "sup_mst_iso",
      label: CustomizeLable("sup_mst_iso") || "ISO 9000",
      width: 120,
    },
    {
      id: "sup_mst_blanketpo",
      label: CustomizeLable("sup_mst_blanketpo") || "Blanket PO",
      width: 120,
    },
    {
      id: "sup_mst_services",
      label: CustomizeLable("sup_mst_services") || "Services",
      width: 200,
    },
    {
      id: "sup_mst_create_by",
      label: CustomizeLable("sup_mst_create_by") || "Created By",
      width: 120,
    },
    {
      id: "sup_mst_create_date",
      label: CustomizeLable("sup_mst_create_date") || "Created Date",
      width: 200,
    },
  ];

 

  // Select DroupDown Value employe list Filter
  const fetchFilterSubPopupSavedropdon = async () => {
    try {
      const response = await httpCommon.get(
        `/get_sup_mst_filter_dropdown.php?site_cd=${site_ID}&cf_query_owner=${AuditUser}`,
      );

      setFilterDpd(response.data);

      // Swal.close();

      if (DropListIdGet !== "" && DropListIdGet !== null) {
        const matchedItem = response.data.find(
          (item) => item.RowID === DropListIdGet,
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

  // Get Api data useEffect
  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const response2 = await httpCommon.get(
        `/get_sup_mst_filter_dropdown.php?site_cd=${site_ID}&cf_query_owner=${AuditUser}`,
      );

       
       
      if (selectedOption === "" || selectedOption == null) {
        const defaultItem = response2.data.find(
          (item) => item.cf_query_default_flag === "1",
        );
         
          if (defaultItem) {
            setDefaultTitle(defaultItem.cf_query_title);
           
          }

      }else{
        setDefaultTitle(selectedOption);
      }

      // Swal.close();
      // setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [site_ID, currentPage]);

  // function releted query dialog
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
        RowId: "",
        prompt: "",
        siteCd: site_ID,
        queryTypedd: "F",
      },
    ]);
    setShowPromt(false);
  };

  const handleInputValueChangePrompt = (index, newValue) => {
    setRowsDropdownPrompt((prevRows) =>
      prevRows.map((row, idx) =>
        idx === index ? { ...row, valuept: newValue } : row,
      ),
    );
  };


  // fetching the data
  const fetchDataResponse = async (hasRowIdValuept) => {
    try {
      const response = await httpCommon.post(
        "/get_sup_mst_dropdown_prompt_data.php?page=" + currentPage,
        {
          rows: rowsDropdownPrompt,
          rowsort: "",
          SiteCD: site_ID,
          admin: emp_owner,
          RowId: hasRowIdValuept,
        },
      );

      setTableData(response.data.data);
      setSavedQuery(response.data.data);
      setTotalRow(response.data.total_count);
      setTitleAstReg(response.data.titleName);
     // setSavedQptions(response.data.titleName);
      setSelectedOption(response.data.titleName)
      
      Swal.close();

      handleClosePromt();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // save button
  const handleDropDownPromptSaveAsBtn = async () => {

    const hasEmptyValuept = rowsDropdownPrompt.some(
      (row) => !row.valuept.trim(),
    );
    const hasRowIdValuept =
      rowsDropdownPrompt.length > 0 ? rowsDropdownPrompt[0].RowId : null;

    if (hasEmptyValuept) {
      // Show error message if any valuept field is empty
      Swal.fire({
        icon: "error",
        title: "Validation Error !",
        text: "Please fill in value field before saving.",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      return; // Exit the function if validation fails
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
        rowsQrtData: rowsDropdownPrompt,
        owsortQrtData: "",
        siteCd: site_ID,
        RowId: hasRowIdValuept,
        owner: emp_owner,
      };

      try {
        const response = await httpCommon.post(
          "/insert_sup_list_save_data.php",
          combinedData,
        );
       
        // console.log("response___prompt__",response);
        if (response.data.status == "SUCCESS") {
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
              fetchDataResponse(hasRowIdValuept);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    if (defaultTitle) {
      
      handleOptionTableList({ target: { value: defaultTitle }});

    }
  }, [defaultTitle,site_ID, currentPage]);


   const handleOptionTableList = async (event,responseData) => {
      
      const selectedValue = event?.target?.value || selectedOption;
     
      setCurrentPage(1);
    
      const selectedOptionObjectFilter = FilterDpd.find(
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
                "/get_sup_mst_filter_query_data.php?site_cd=" +
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
        setTitleAstReg("");
      }
      setSelectedOption(selectedValue);
    };
  // onOptionChange
  const handleOptionChange = async (event, responseData) => {

    const selectedValue = event?.target?.value || selectedOption;
     // console.log("handleOptionChange____",selectedValue);
    setDefaultTitle("");
    setSelectedComeBack("");
    setSelectedRowIdbackState("");
    setInputValueSearch("");
    setSelectRefreshId("");
    setCurrentPage(1);

    const selectedOptionObjectFilter = FilterDpd.find(
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
       // setTempRowID(GetRowID);
        setIsLoading(true);
  
        try {
          const response = await httpCommon.get(
            "/get_sup_mst_filter_query_data.php?site_cd=" +
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
     // setDashbordDataGauge([]);
      setTitleAstReg("");
    }else{
    
      const GetRowID = selectedOptionObject?.RowID;
      setExportExcelId(GetRowID);
      setselectDropRowID(GetRowID);
      setselectTempDropRowID(GetRowID);
      setSelectedOption(selectedValue);
      setCurrentPage(1);
      setDropListIdGet([]);
     // setDashbordDataGauge([]);
      setTitleAstReg("");
    }
   
   // setSelectedOption(selectedValue);
   setSelectedOption(selectedValue);
   await new Promise((resolve) => setTimeout(resolve, 0));

  };

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


  const getb = useCallback(async (page) => {
     setIsLoading(true);
   const ItemID = selectRefreshId ? selectRefreshId : selectDropRowID;
   const CurrentPageValue = page ? page : currentPage;
    try {
      const response = await httpCommon.post(
        `/get_supplier_list_selectoption_data.php?site_cd=${site_ID}&ItemID=${ItemID}&page=${CurrentPageValue}&EmpId=${emp_owner}`,
      );
    //  console.log("getb____resPonce__",response);
      if (
        response.data.data &&
        response.data.data.result.length > 0
      ) {
        setTableData(response.data.data.result);
        setTotalRow(response.data.DashbrdCount);
         Swal.close();
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
  }, [site_ID, currentPage, selectDropRowID,selectRefreshId]);

  const fetchDataUsingRefreshBtn = useCallback(async () =>{
   // console.log("calll refesth btn___");
       getb();
  }, [site_ID, currentPage, selectDropRowID, selectRefreshId]);
  

  useEffect(() => {
  
    if (ignoreEffect) {
      setIgnoreEffect(false); // Reset the flag
      return;
    }
  
    if (selectDropRowID != "" && selectDropRowID != null) {
    
      getb();
    } else if (TableSearchData != "" && TableSearchData != null) {
      
      handelSearchButton();
    } else {
     
      fetchData();
    }
    fetchFilterSubPopupSavedropdon();
    // get_dropdown();
  }, [site_ID, currentPage, selectDropRowID, fetchData, getb]);

  const dataFiltered = applyFilter({
    inputData: Array.isArray(tableData) ? tableData : [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );


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
    [table],
  );

  const handleDeleteRow = useCallback(
    async (id, row) => {
      // console.log("row++++++____", row);
      const Rowid = row.RowID;
      // console.log("Rowid____", Rowid);
      if (Rowid !== "") {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          // Add async here if you want to use await inside then
          if (result.isConfirmed) {
            // setIsLoading(true);

            try {
              const response = await httpCommon.post("/delete_sup_mst.php", {
                site_cd: site_ID,
                row_id: row.RowID,
              });

               
             
              if (response.data.status == "SUCCESS") {
                Swal.fire({
                  title: "Deleted!",
                  text: response.data.message,
                  icon: "success",
                }).then(() =>{
                  
               
                  handleOptionChange()});
              }
              if (response.data.status == "ERROR") {
                Swal.fire({
                  title: "Oops!",
                  text: response.data.message,
                  icon: "error",
                });
              }
              // setIsLoading(false);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }
        });
      }
    },
    [tableData, router, site_ID],
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id),
    );
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
        const querydropdownId = selectDropRowID || selectRefreshId;
        const passSelectOption = TitleAstReg || selectedOption;
      
        if (Rowid !== '') {
          navigate(`/dashboard/Procurement/editsupplier`, {
            state: {
              row,
              RowID:Rowid,
              currentPage,
              selectDropRowID: querydropdownId,
              selectedOption: passSelectOption,
            },
          });
        }
  
      },
      [router,currentPage, selectDropRowID,selectRefreshId,selectedOption]
    );

    const handleRowClickTable = useCallback(
      
      (id,row) => {
        const Rowid = id;
        const querydropdownId = selectDropRowID || selectRefreshId;
        const passSelectOption = TitleAstReg || selectedOption;

        if (Rowid !== '' && Rowid !== null) {
          navigate(`/dashboard/Procurement/editsupplier`, {
            state: {
              row,
              RowID:Rowid,
              currentPage,
              selectDropRowID: querydropdownId,
              selectedOption: passSelectOption,
            },
          });
        }
      },
      [router,currentPage, selectDropRowID, selectRefreshId, selectedOption]
    );

  const handleResetFilters = useCallback(() => {
    setInputValueSearch('');
    setTableData("");
    if (inputRef.current) {
      inputRef.current.value = ''; // Clear the input field value directly
    }
    if(selectDropRowID || selectRefreshId){
      
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
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
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
      promptAsd: "",
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
   // setSelectedOperator(operator)
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
   // setLogcValue(logical.target.value)
    const updatedRows = [...rows];
    updatedRows[index].logical = logical.target.value;
    setLogicalEmptyError(false);
    setRows(updatedRows);
  };

  const handleIncludeChangeLogcilQtr = (index, logical) => {
   // setLogcValueQl(logical.target.value)
    const updatedRows = [...rows];
    updatedRows[index].logical = logical.target.value;
    setLogicalEmptyError(false);
    setRowsQrt(updatedRows);
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
    setIgnoreEffect(false); 
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
    getWorkReqListLebel();
  };
  const rowOptions = WorkReqFiledname.map((row) => ({
    value: row.column_name,
    label: row.default_header,
  }));

  /* Filter dropdown value */
  const getWorkReqListLebel = async () => {
    try {
      const response = await httpCommon.get("/get_sup_filter_name.php");
   
      if (response.data.status == "SUCCESS") {
        setWordReqFiledname(response.data.data);
        //setAstdetLabel(response.data.data.ast_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const retriveSaveQuery = async () => {
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
        "/get_retrive_popup_sup_filed_data.php?page=" + currentPage,
        {
          rows: rows,
          rowsort: rowsort,
          SiteCD: site_ID,
          admin: emp_owner,
        },
      );

      if (response.data.status === "SUCCESS") {
        setTableData(response.data.data);
        setSavedQuery(response.data.data);
        setTotalRow(response.data.total_count);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

// handle input retrive promant
  const handleInputValueChangePromptRows = (index, newValue) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === index ? { ...row, valuept: newValue } : row
      )
    );
  };

const fetchAfterPromatQuery= async()=>{
  try {
    const response = await httpCommon.post(
      "/get_retrive_popup_sup_filed_data.php?page=" + currentPage,
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
    
     setTableData(response.data.data);
     setTotalRow(response.data.total_count);
     setTitleAstReg(response.data.titleName);
     setSavedQuery(response.data.data);
     //setSavedQptions(response.data.titleName);
     setSelectedOption(response.data.titleName);
   
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
      handleCloseRetrivePromt();
      //FilterhandleClose();

    
    } else {
      const updatedEmptyRows = rows.map((row) => ({
        // empty state data
        ...row,
        selectedOption: "",
        logical: "And",
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

  const handleFilterBtnPrompt = async () => {
    const hasEmptyValuept = rows.some(row => !row.valuept.trim());
   const hasRowIdValuept = WorkReqFiledname.find((item)=>item.
   column_name === rows[0].selectedOption)
  let Rowid;
  if(hasRowIdValuept){
  const {RowID} = hasRowIdValuept;
  Rowid = RowID
  }
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
      const selectedOptionObjectFilter = FilterDpd.find(
        (item) => item.cf_query_title === rowsQrt.selectedOption,
      );

      const combinedData = {
        rowsQrtData: rows,
        siteCd: site_ID,
        owner: emp_owner,
        RowId: Rowid,
       
        defaultFlag:isChecked?1:0,
        rowsortQrtData: [],
      };

    // saving data befor retrive start
      try {
        // const response = await httpCommon.post(
        //   "/insert_sup_list_prompt_save_data.php",
        //   combinedData,
        // );
        const response = await httpCommon.post(
          "/insert_sup_list_save_data.php",
          combinedData,
        );
        const data = response.data;
        const findRes = FilterDpd.find((item) => item.RowID === data.ROW_ID);

        if (response.data.status == "SUCCESS") {
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
              fetchAfterPromatQuery();
            
             setTitleAstReg(findRes ? findRes.cf_query_title : "")
              setSelectedOption(findRes ? findRes.cf_query_title : "");
             // setSavedQptions(findRes ? findRes.cf_query_title : "");
            
              setRowsortQrt([]);
              setRowsort([]);
              setRows([]);
              
              handleCloseWorkQryList();
            }
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

// saving data befor retrive







     
      
      // try {
      //   const response = await httpCommon.post(
      //     "/get_retrive_popup_sup_filed_data.php?page=" + currentPage,
      //     {
      //       rows: rows,
      //       rowsort: rowsort,
      //       SiteCD: site_ID,
      //       admin: emp_owner,
      //     }
      //   );
      
      //   if (
      //     response.data.status === "SUCCESS"
      //   ) {
      //    // setTableData(response.data.data.result);
      //    // setTotalRow(response.data.total_count);
      //    // setTitleAstReg(response.data.titleName);
        
      //    setTableData(response.data.data);
      //    setTotalRow(response.data.total_count);
      //    setTitleAstReg(response.data.titleName);
      //    setSavedQuery(response.data.data);
      //    setSavedQptions(response.data.titleName);
      //    setSelectedOption(response.data.titleName);
       
      //     const updatedEmptyRows = rows.map((row) => ({
      //       // empty state data
      //       ...row,
      //       selectedOption: "",
      //       logical: "",
      //       valuept: "",
      //     }));
      //     setRows(updatedEmptyRows);
  
      //   const updatedEmptyRowsort = rows.map((rowsort) => ({
      //       // empty state data
      //       ...rowsort,
      //       selectedOptionShort: "",
      //     }));
      //     setRowsort(updatedEmptyRowsort);
       
      //     Swal.close();
      //     handleCloseRetrivePromt();
      //     //FilterhandleClose();
  
        
      //   } else {
      //     const updatedEmptyRows = rows.map((row) => ({
      //       // empty state data
      //       ...row,
      //       selectedOption: "",
      //       logical: "",
      //       valuept: "",
      //     }));
      //     setRows(updatedEmptyRows);
  
      //     const updatedEmptyRowsort = rows.map((rowsort) => ({
      //       // empty state data
      //       ...rowsort,
      //       selectedOptionShort: "",
      //     }));
      //     setRowsort(updatedEmptyRowsort);
        
      //     Swal.fire({
      //       title: "Oops..!",
      //       text: "No Record Found!",
      //       icon: "success",
      //       customClass: {
      //         container: "swalcontainercustom",
      //       },
      //     }).then(() => {
      //       Swal.close();
      //       handleCloseRetrivePromt();
      //     });
      //   }
      // } catch (error) {
      //   console.error("Error fetching data:", error);
      // }
    }

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

  // Retrive button  funcation,setTableData
  const RetriveData = useCallback(async () => {
    
    let hasEmptyOption = false;
    let hasEmptyValuept = false;
    let fieldName = '';
    //setSelectedRowIdbackState("");

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

    let foundPromptOne = false;
      
    for (const rowChk of rows) {
      if (rowChk.prompt === "1") {
          
          setShowPromtRetiveBtn(true); 
          Swal.close();
          foundPromptOne = true; // Set the flag to true
          break; // Stop the loop when condition is met
      }
   }


if(!foundPromptOne){
// getting without promat data using sorting condition
    try {
      const response = await httpCommon.post(
        "/get_retrive_popup_sup_filed_data.php?page=" + currentPage,
        {
          rows: rows,
          rowsort: rowsort,
          SiteCD: site_ID,
          admin: emp_owner,
        },
      );
      if (response.data.status === "SUCCESS") {
        setTableData(response.data.data);
        setTotalRow(response.data.total_count);
        setTitleAstReg(response.data.titleName);
        // setSavedQuery(response.data.data);
       // setSavedQptions(response.data.titleName);
        setSelectedOption(response.data.titleName);

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
    // }
  }, [site_ID, currentPage,rows,rowsort]);

  // Retrive all data
  const RetriveDataAllData = useCallback(async () => {

    setSelectedOption("");
    setselectDropRowID("");
    setDropListIdGet("");
    setSelectRefreshId("");
    setTitleAstReg("");
    setSelectedRowIdbackState("");
    setIsLoading(true);

    try {
      
     const response = await httpCommon.post(
            "/get_sup_mst_table_data.php?page=" + currentPage,
            {
              SiteCD: site_ID,
              admin: emp_owner,
            }
          );
      //  console.log("response____all__data",response);
      if (response.data &&
        response.data.result &&
        response.data.result.length > 0) {
          
    //    fetchFilterSubPopupSavedropdon();
        setTableData(response.data.result);
        setTotalRow(response.data.total_count);

        setTitleAstReg(response.data.titleName);
       setSelectRefreshId(response.data.titleRowId);
      //  setselectDropRowID(response.data.titleRowId);
        setExportExcelId(response.data.titleRowId);

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
  }, [site_ID, currentPage,selectDropRowID]);

  // retrive button updated
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
           // setSelectedRowIdbackState("");
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
        rowsort[rowsort.length - 1].selectedOptionShort === "",
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
        "/Insert_sup__req_filter_query_list_data.php",
        combinedData,
      );

      if (response.data.status == "SUCCESS") {
        setTitleAstReg(response.data.Title);
       // setSavedQptions(response.data.Title);
        setSelectedOption(response.data.title);
        fetchFilterSubPopupSavedropdon();
        retriveSaveQuery();
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

useEffect(()=>{
},[isBoxChecked])

  // Filter Save button funcation click to
  const handleCFQrySave = () => {
        if (formDataSv.queryName && formDataSv.queryName.trim() !== "") {
         
          const inputValue = formDataSv.queryName;
          const matchingOption = FilterDpd.find(
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
      siteCd: site_ID, 
      queryTypedd: "F", 
    };
    setRowsQrt([emptyRowQrt]); 
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

  };

  
  const RetriveDataQueryList = async () => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
   // Swal.showLoading();
    try {
      const response = await httpCommon.post(
        "/get_retrive_popup_sup_filed_data.php?page=" + currentPage,
        {
          rows: rowsQrt,
          rowsort: rowsortQrt,
          SiteCD: site_ID,
          admin: emp_owner,
        },
      );

    //  console.log("response___retriveList",response);
  let promat = rowsQrt[0].prompt;

    if(promat == 1){
      setTableData([])
    }else{
      setTableData(response.data.data);
    }
     
      //setSavedQuery(response.data.data);
      setTotalRow(response.data.total_count);

      Swal.close();
      FilterhandleClose();
      const updatedEmptyRows = rowsQrt.map((row) => ({
        // empty state data
        ...row,
        selectedOption: "",
        logical: "And",
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
          timer: swalCloseTime,
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await httpCommon.get(
              "/delete_sup_query.php?value=" + cf_query_title + "&siteId=" + site_ID,
            );
            if (response.data.status == "SUCCESS") {
              fetchFilterSubPopupSavedropdon();

              setselectedOptionValue("");
              setRowsQrt([]);
              setRowsortQrt([]);
              setTableData("");
              setTotalRow("");
              setSelectedOption("");
              setselectDropRowID("");

              handleCloseWorkQryList();
              Swal.fire("Deleted!", "Your query has been deleted.", "success").then(()=>{
                setCall(true)
               
              })
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
     // console.log("isAnySelectedOptionShortEmpty",isAnySelectedOptionShortEmpty);
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
          RowId: RowID,
          defaultFlag: isChecked === null ? "notCheckeset" : isChecked ? "1" : "0", 
          rowsortQrtData: rowsortQrt,
        };
    // console.log("rowsQrt____",rowsQrt);
        try {
          const response = await httpCommon.post(
            "/insert_sup_list_save_data.php",
            combinedData
          );
       //   console.log("cf_query_title__",cf_query_title);
          if (response.data.status == "SUCCESS") {
            setIgnoreEffect(false); 
            Swal.close();
            //setIgnoreEffect(false); 
            Swal.fire({
              title: "Success!",
              text: "Your Query Update Successfully.",
              icon: "success",
              confirmButtonText: "OK",
              timer: swalCloseTime,
              timerProgressBar: true, 
              customClass: {
                container: "swalcontainercustom",
              },
              willClose: () => {
                // Execute these actions when the modal closes
               // RetriveDataQueryList();
                setRowsQrt([]);
                setselectedOptionValue("");
                setSelectedOption(cf_query_title);
                setTitleAstReg(cf_query_title);
                setSavedQptions("");
                setselectDropRowID(RowID);
                setExportExcelId(RowID);
                setRowsortQrt([]);
                setRowsort([]);
                setRows([]);
              
                handleCloseWorkQryList();
            
              }
            }).then((result) => {
              if (result.isConfirmed) {
               // RetriveDataQueryList();
                setRowsQrt([]);
                setselectedOptionValue("");
                setSelectedOption(cf_query_title);
                setTitleAstReg(cf_query_title);
                setSavedQptions("");
                setselectDropRowID(RowID);
                setExportExcelId(RowID);
                setRowsortQrt([]);
                setRowsort([]);
                setRows([]);
               
                handleCloseWorkQryList();
                
              }
            });
          }else{
              Swal.close();
          }
        } catch (error) {
          Swal.close();
          console.error("Error fetching data:", error);
        }
      }
    };
  
  const SaveAsworkorderTbl = () => {
    if (selectedOptionValue) {
      setShowSaveAs(true);
    } else {
      toast.error(`Please fill the required field: Query Title`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    }
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
        const matchingOption = FilterDpd.find(
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
    
    const checkedValue =FilterDpd.map((item)=>item.cf_query_default_flag == 1 )



    let cf_query_title, RowID;

    const hyphenCount = selectedOption.split("-").length - 1;

    if (hyphenCount === 1) {
      [cf_query_title, RowID] = selectedOption.split("-");
    } else {
      const parts = selectedOption.split("-");

      cf_query_title = parts[0].trim();
      RowID = parts[parts.length - 1].trim();
    }

      
    if(RowID !== "" && cf_query_title !==""){
      // setQueryTitleRowID(RowID);
  
    const initialCheckedState = FilterDpd.some(
      item => item.RowID === RowID && item.cf_query_title === cf_query_title && item.cf_query_default_flag === "1"
      )
      ? true  
      : null;

    
    setIsChecked(initialCheckedState);

  }else{
    setIsChecked(null);
  }

    setTitleAstReg(cf_query_title);

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
          "/get_sup_filter_query_data.php?site_cd=" +
            site_ID +
            "&RowID=" +
            RowID,
        );
  
        if (
          response.data.data &&
          response.data.data.list_typeF &&
          response.data.data.list_typeF.length > 0
        ) {
          const newRows = response.data.data.list_typeF.map((item) => ({
            selectedOption: item.cf_query_list_column,
            operator: item.cf_query_list_operator,
            prompt: item.cf_query_list_prompt,
            valuept: item.cf_query_list_value,
            logical: item.cf_query_list_logical,
            siteCd: site_ID,
            queryTypedd: "F",
          }));
          if (newRows) {
            Swal.close();
            setRowsQrt((prevrowsQrt) => [...prevrowsQrt, ...newRows]);
          }
          // const timeoutId = setTimeout(() => {

          // }, 3000);
          //setShowAssetByDescp(false);
        } else {
          // Swal.fire({
          //   icon: "error",

          //   customClass: {
          //     container: "swalcontainercustom",
          //   },
          //   title: "Oops...",
          //   text: "No record found Please try again !",
          // });
          Swal.close();
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
   // setSelectedOperatorQl(operator)
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
    
    const isLastRowInvalid =
    rowsQrt.length > 0 &&
    (!rowsQrt[rowsQrt.length - 1].selectedOption ||
      rowsQrt[rowsQrt.length - 1].selectedOption === "" ||
      !rowsQrt[rowsQrt.length - 1].valuept ||
      rowsQrt[rowsQrt.length - 1].valuept === "");


    if (isLastRowInvalid) {
      setSelectedOptionEmptyErrorQtr(
        !rowsQrt[rowsQrt.length - 1].selectedOption ||
          rowsQrt[rowsQrt.length - 1].selectedOption === ""
      );
      setValueptEmptyErrorQtr(
        !rowsQrt[rowsQrt.length - 1].valuept ||
          rowsQrt[rowsQrt.length - 1].valuept === ""
      );
     
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
    const [cf_query_title, RowID] = selectedOptionValue.split("-");

    const combinedData = {
      formDataSv: formDataSv,
      rowsQrtData: rowsQrt,
      rowsortQrtData: rowsortQrt,
      SITE_CD: site_ID,
      OWNER_ID: emp_owner,
      defaultFlag:isChecked?1:0,
      RowID:RowID,
      availability: "G",
    };

    try {

      const response = await httpCommon.post(
        "/insert_sup_save_as_query.php",
        combinedData,
      );

      if (response.data.status == "SUCCESS") {
        setIgnoreEffect(false); 
        setTitleAstReg(response.data.Title);
        setSelectedOption(response.data.Title);
        setSavedQptions(response.data.Title)
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
      console.error("Error fetching data:", error);
    }
  };
 
  // Search Button Click funcation
  const handelSearchButton = async () => {
    const inputValueGet = inputRef.current.value;

    if (inputValueGet !== "" && inputValueGet !== null) {

    if(tableData.length>0){

  const filteredData = tableData.filter((item) => {
    const searchString = inputValueGet.toLowerCase();
    const p1 = (item.sup_mst_status || "").toLowerCase();
    const p2 = (item.sup_mst_desc || "").toLowerCase();
    const p3 = (item.sup_det_city || "").toLowerCase();
    const p4 = (item.sup_det_contact1 || "").toLowerCase();
    const p5 = (item.sup_det_contact2 || "").toLowerCase();
    const p6 = (item.sup_det_address1 || "").toLowerCase();
    const p7 = (item.sup_det_address2 || "").toLowerCase();
    const p8 = (item.sup_det_province || "").toLowerCase();
    const p9 = (item.sup_det_state || "").toLowerCase();
    const p10 = (item.sup_det_country || "").toLowerCase();
    const p11 = (item.sup_det_postal_code || "").toLowerCase();
    const p12 = (item.sup_det_phone || "").toLowerCase();
    const p13 = (item.sup_det_fax_phone || "").toLowerCase();
    const p14 = (item.sup_det_mobile_phone || "").toLowerCase();
    const p15 = (item.sup_det_email_id || "").toLowerCase();
    const p16 = (item.sup_mst_supplier_cd || "").toLowerCase();
    const p17 = (item.sup_mst_curr_code || "").toLowerCase();
    const p18 = (item.sup_mst_desc || "").toLowerCase();

    // Check if RowID exists in tableData
    const isRowIDMatching = tableData.some(
      (tableItem) => tableItem.RowID === item.RowID,
    );

    if (isRowIDMatching) {
      // Apply the filter based on search string and RowID match
      return (
        isRowIDMatching &&
        tableData.length > 0 &&
        (
          p16.includes(searchString)) ||
          p1.includes(searchString) ||
          p17.includes(searchString) ||
          p2.includes(searchString) ||
          p3.includes(searchString) ||
          p4.includes(searchString) ||
          p5.includes(searchString) ||
          p6.includes(searchString) ||
          p7.includes(searchString) ||
          p8.includes(searchString) ||
          p9.includes(searchString) ||
          p10.includes(searchString) ||
          p11.includes(searchString) ||
          p12.includes(searchString) ||
          p13.includes(searchString) ||
          p14.includes(searchString) ||
          p18.includes(searchString)
      
      );
    } else if (tableData.length === 0) {
      return (
        p16.includes(searchString) ||
        p1.includes(searchString) ||
        p17.includes(searchString) ||
        p2.includes(searchString) ||
        p3.includes(searchString) ||
        p4.includes(searchString) ||
        p5.includes(searchString) ||
        p6.includes(searchString) ||
        p7.includes(searchString) ||
        p8.includes(searchString) ||
        p9.includes(searchString) ||
        p10.includes(searchString) ||
        p11.includes(searchString) ||
        p12.includes(searchString) ||
        p13.includes(searchString) ||
        p14.includes(searchString) ||
        p15.includes(searchString) ||
        p18.includes(searchString)
      );
    }
  });
  if (filteredData && filteredData.length > 0) {
    setTableData(filteredData);
    setTotalRow(filteredData.length);
    Swal.close();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No Record Found!",
    });
  }
}
else if(tableData.length === 0){
 Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
    Swal.showLoading();
      try {
        const searchTerm = inputValueGet.toLowerCase();
        
        const response = await httpCommon.get(
          `/get_sup_mst_search.php?site_cd=${site_ID}&searchTerm=${searchTerm}&page=${currentPage}`,
        );

        if (response.data.status === "SUCCESS") {
          setTableData(response.data.data);
          setTableSearchData(response.data.data);
          setTotalRow(response.data.total_count);

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
    ExportToExcel({ tableData: tableData });
    popover.onClose();
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
      timer: swalCloseTime,
    });
    Swal.showLoading();
  };

  const handleSearchInputChange = (e) => {
    setInputValueSearch(e.target.value);
  };

  const handleClearButton = () => {
    handleResetFilters();
    setTotalRow("");
    if (inputRef.current) {
      inputRef.current.focus(); 
    }
  };
  return (
    <>
      {/* <Helmet>
        <title>Employe List</title>
        <meta name="description" content="Employe List" />
      </Helmet> */}
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <TemplateDialog open={template} handleClose={handleCloseTemplate} />

        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
            heading="Supplier Master"
            links={[]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="contained"
                  className="AddNewButton"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  
                  onClick={() =>
                    navigate("/dashboard/Procurement/newsupplier", {
                      state: {
                        selectedOption,
                      },
                    })
                  }
                  
                >
                  New
                </Button>
              </div>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>

        <div className="workReqpage">
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
                />{" "}
                Filter
              </Button>

              {/* Select filter in employee list */}

              <FormControl
                sx={{
                  flexShrink: 0,
                  width: { xs: 1, md: 300 },
                }}
                className="selectOptioncls"
              >
                
                <InputLabel id="select-label" className={(TitleAstReg !== "" || selectedOption)? "selectedcss" : "defaultLabelSelect"}>Select Query</InputLabel>

                {/* Select Query Filter */}
                <Select
                  labelId="select-label"
                  id="select"
                  
                  value={TitleAstReg !== "" ? TitleAstReg : selectedOption}
                  
            
                  onChange={handleOptionChangeInternal}
                  onOpen={handleDropdownOpen}
                  onClose={handleDropdownClose}
                
                  sx={{ textTransform: "capitalize" }}
                >
                  {FilterDpd.map((item) => (
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
             

              <Tooltip title="Refresh" placement="top" arrow>
                <span
                  className={`ListDataRefBtn ${
                    tableData.length == 0 ? "disabled" : ""
                  }`}

                  onClick={selectDropRowID !== "" || selectRefreshId !== "" ? fetchDataUsingRefreshBtn : null}
                  style={{ border: "0px" }}
                >
                  <Icon
                    icon="icon-park:refresh-one"
                    style={{ width: "23px", height: "23px" }}
                  />
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
                disabled={tableData && tableData.length > 0 ? false : true}
              >
                <Iconify icon="solar:export-bold" />
                Export to Excel
              </MenuItem>
            </CustomPopover>
            {canReset && (
              <WorkReqTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                //
                onResetFilters={handleResetFilters}
                //
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <TableContainer sx={{ position: "relative" }}>
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
                <Table
                  size={table.dense ? "small" : "medium"}
                  sx={{ minWidth: 960 }}
                >
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData ? tableData.length : 0}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    className="stickyheader"
                  />

                  <TableBody className="AssetTable">
                    {isLoading ? ( 
                      <TableRow>
                        <TableCell
                          colSpan={numberOfColumns}
                          className="NoRecodcls"
                        >
                          <Dialog
                            open={isLoading}
                            aria-labelledby="loading-dialog-title"
                            PaperProps={{
                              style: {
                                backgroundColor: "transparent", // Set your desired background color here
                              },
                            }}
                            BackdropProps={{
                              className: "yourbackdropclass",
                            }}
                          >
                            <DialogTitle
                              id="loading-dialog-title"
                              style={{ textAlign: "center" }}
                            ></DialogTitle>
                            <DialogContent>
                              <div
                                style={{
                                  textAlign: "center",
                                  paddingTop: "10px",
                                }}
                              >
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
                          <TableRow className="noDataFound">
                            <TableCell
                              colSpan={numberOfColumns}
                              sx={{
                                height: 150,
                                textAlign: "center",
                                verticalAlign: "middle",
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

                                  <ProRow
                                    key={row.id}
                                    row={row}
                                    index={index}
                                    selectedOption={selectedOption}
                                    isHighlighted={selectedRowIdbackState && selectedRowIdbackState === row.mst_RowID} 
                                    selected={table.selected.includes(row.mst_RowID)}
                                    onSelectRow={() => table.onSelectRow(row.mst_RowID)}
                                    onDeleteRow={() => handleDeleteRow(row.mst_RowID,row)}
                                    onEditRow={() => handleEditRow(row.RowID,row)}
                                    onClick={() => handleRowClickTable(row.RowID,row)}
                          
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
                        tableData && tableData.length ? tableData.length : 0,
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
                const updatedPage = newPage + 1;
                setCurrentPage(updatedPage);
                table.onChangePage(event, newPage);
                getb(updatedPage);
              }}
              rowsPerPageOptions={[]} 
              currentPage={currentPage}
              
            />
          </Card>
        </div>
      </Container>
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
            //color: (theme) => theme.palette.grey[500],
          }}
        >
           <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
        </IconButton>

        {/* Query List */}
        <DialogContent dividers>
          <div className="queryBtn">
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="outlined" onClick={handelQuryListpopup}>
                  <Iconify icon="carbon:query-queue" /> Query List
                </Button>
              </Grid>

              <Grid item>
                <Button variant="outlined" onClick={retriveBtn}>
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
              <legend >Filter By</legend>
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

                        {/* open bracket */}
                        <Select
                        className="custom-default-select"
                          style={{ width: "100%" }}
                        >
                          {/* Operator menu item */}
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



                      {/* opertaor */}
                      <td style={{ width: "17%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className="custom-default-select"
                          value={row.operator || "like"}
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

                  {/* promt checkbox */}
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

                      {/* value field */}
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
                      

                      
                      {/*  */}
                      <td style={{ width: "10%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className={`custom-default-select ${
                            index === rows.length - 1 && logicalEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          value={row.logical || "And"}
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
              <legend  >Sort By</legend>
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
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
        <DialogContent dividers>
          <div className="astSubpopup">
            <fieldset className="Subpopup-fieldset">
              <legend >Query name:</legend>
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
                  {FilterDpd.map((option, index) => (
                    <option key={index.RowID} value={option.cf_query_title} />
                  ))}
                </datalist>
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend >Description:</legend>
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
              <legend >Availability:</legend>
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
 
      {/* Query List modal */}

      <BootstrapDialog
        //onClose={handleCloseWorkQryList}
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
          <span style={{ marginLeft: "2px" }}>Query List</span>
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
            //color: (theme) => theme.palette.grey[500],
          }}
        >
           <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
        </IconButton>
        
        <DialogContent dividers>

          <div className="queryBtn">
            <Grid container spacing={1}>
              <Grid item>
                <Button variant="outlined" onClick={DeleteAssetRegQryList}
                disabled={!selectedOptionValue}
                >
                  <Iconify icon="fluent:delete-48-regular" /> Delete
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveWorkOrderQryList}
                disabled={!selectedOptionValue}
                >
                  <Iconify icon="ic:outline-save-as" /> Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveAsworkorderTbl}
                 disabled={!selectedOptionValue}
                >
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
                  <legend >Query Name</legend>
                  <table className="custom-tablE">
                    <thead>
                      <tr>
                        <th style={{ width: "100%" }}>Query Title</th>
                        <th style={{ width: "10%" }}>Default?</th>
                      </tr>
                    </thead>
                    <tbody>
                    {/* workReqFilterDpd */}
              
                      <Select
                        id="select"
                        style={{ width: "60%" }}
                        value={selectedOptionValue}
                        className="custom-default-select"
                        onChange={(event) =>
                          handleClickOption(event.target.value)
                        }
                       // renderValue={(selected) => selected.split('-')[0]}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {FilterDpd.map((item) => (
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
                  <legend >Filter By</legend>
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
                            {/* Bracket */}
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

                            {/* Selected options */}
                            <td style={{ width: "25%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className={`custom-default-select ${
                                  index === rowsQrt.length - 1 &&
                                  selectedOptionEmptyErrorQtr
                                    ? "error-border"
                                    : "mammama"
                                }`}
                                value={
                                  row && row.selectedOption
                                    ? row.selectedOption
                                    : ""
                                }
                                onChange={(event) =>
                                  handleOptionChangeQtr(
                                    index,
                                    event.target.value,
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

                            {/* Operator */}
                            <td style={{ width: "17%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className="custom-default-select"
                                value={row.operator || "like"}
                                
                                onChange={(event) =>
                                  handleOptionChangeOprterQtr(
                                    index,
                                    event.target.value,
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

                            {/* checkbox */}
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
                            {/* checkbox end*/}

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
                                    event.target.value,
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
                                 value={row.logical || "And"}
                                // value={/* add the corresponding value from your state */}
                                onChange={(logical) =>
                                  handleIncludeChangeLogcilQtr(index, logical)
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
                  <legend >Sort By</legend>
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
                                  event.target.value,
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
                                  e.target.checked,
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
              <legend     
              >Query name:</legend>
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
                  {FilterDpd.map((option, index) => (
                    <option key={index.RowID} value={option.cf_query_title} />
                  ))}
                </datalist>
              </div>
            </fieldset>

            <fieldset className="Subpopup-fieldset">
              <legend >Description:</legend>
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
              <legend >Availability:</legend>
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
            <Button variant="outlined"  className="SaveButton" 
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
        {/* <ToastContainer /> */}
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



      <SupplierPromt
        handleClosePromt={handleClosePromt}
        showPromt={promt}
        rowsDropdownPrompt={rowsDropdownPrompt}
        handleInputValueChangePrompt={handleInputValueChangePrompt}
        handleDropDownPromptSaveAsBtn={handleDropDownPromptSaveAsBtn}
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
