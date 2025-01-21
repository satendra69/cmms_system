import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";
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
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import FormControlLabel from "@mui/material/FormControlLabel";


import { styled } from "@mui/material/styles";

import loderImg from "./employe.gif";
//import componet Section

import WorkReqTableFiltersResult from "./WorkReqTableFiltersResult";
import ExportToExcel from "../employee/component_module/ExportToExcel";
import EmployeRow from "./EmployeRow";
import EmployeIdPromt from "./component_module/EmployeePromt/EmployeIdPromt";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { ThreeCircles } from "react-loader-spinner";
import TemplateDialog from "./Form/Template/TemplateDialog";
import { Checkbox } from "@mui/material";

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

export default function EmployeList() {
 
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const popover = usePopover();
  const router = useRouter();
  const navigate = useNavigate();
  const table = useTable();
 
 
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

  const settings = useSettingsContext();
  const [maxHeight, setMaxHeight] = useState("400px");
  const [tableData, setTableData] = useState([]);
  const [totalRow, setTotalRow] = useState();

  const [filters, setFilters] = useState(defaultFilters);
  
  const [showPromtRetiveBtn, setShowPromtRetiveBtn] = useState(false);
  const [promt, setShowPromt] = useState(false);
  const confirm = useBoolean();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const numberOfColumns = "71";
  const [FilterShow, setFilterShow] = useState(false);
  const [ResponceStats, setResponceStats] = useState("");
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
  const [empReqFilterDpd, setEmpReqFilterDpd] = useState([]);

  const [DropListIdGet, setDropListIdGet] = useState(
    location.state?.DropListId || [],
  );
  const [selectedOptionValue, setselectedOptionValue] = useState();
  const [selectRefreshId, setSelectRefreshId] =  useState("");

  const [showWordOrderQryList, setShowWordOrderQryList] = useState(false);
  const handleShowWorkOrderQryList = () => setShowWordOrderQryList(true);
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [isChecked, setIsChecked] = useState(null);
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


  const [fetch, setRefetch] = useState(false);

  const [template,setTemplate] = useState(false)

  const [DefineQueryBtn, setDefineQueryBtn] = useState("");
  const [defaultTitle, setDefaultTitle] = useState('');
  const { selectedOption: returnedSelectedOption, comeBack,selectedRowIdBack } = location.state || {};
const [selectedOption, setSelectedOption] = useState(returnedSelectedOption || '');
const [selectedComeBack, setSelectedComeBack] = useState(comeBack || '');
const [selectedRowIdbackState, setSelectedRowIdbackState] = useState(selectedRowIdBack || '');


const [inputValueSearch, setInputValueSearch] = useState('');
const [QueryTitleRowId, setQueryTitleRowID] = useState("");
const [ignoreEffect, setIgnoreEffect] = useState(false);

const [selectedOperator,setSelectedOperator] = useState("like");
const [LogcValue,setLogcValue] = useState("And")

const [selectedOperatorQl,setSelectedOperatorQl] = useState("like");


const [LogcValueQl,setLogcValueQl] = useState("And")

  const handleCloseTemplate=()=>{
    setTemplate(false)
  }
  const CustomizeLable = (name) => {
    let res;
    if(tableData){
       res = tableData.find((item) => item.column_name === name);
    }
  

    return res ? res.default_header : "";
  };

  const TABLE_HEAD = [
    { id: "", label: "Action", width: 60 },
    {
      id: "emp_mst_empl_id",
      label: CustomizeLable("emp_mst_empl_id") || "Employee ID",
      width: 140,
    },
    {
      id: "emp_mst_login_id",
      label: CustomizeLable("emp_mst_login_id") || "Login ID",
      width: 140,
      padding: 10,
    },
    {
      id: "emp_mst_usr_grp",
      label: CustomizeLable("emp_mst_usr_grp") || "User Group",
      width: 140,
    },
    {
      id: "emp_mst_name",
      label: CustomizeLable("emp_mst_name") || "Name",
      width: 140,
    },
    {
      id: "emp_mst_title",
      label: CustomizeLable("emp_mst_title") || "Title",
      width: 200,
    },
    {
      id: "emp_mst_status",
      label: CustomizeLable("emp_mst_status") || "Status",
      width: 140,
    },
    {
      id: "emp_mst_homephone",
      label: CustomizeLable("emp_mst_homephone") || "Contact No",
      width: 140,
    },
    {
      id: "emp_mst_emg_name",
      label: CustomizeLable("emp_mst_emg_name") || "Emergency Name",
      width: 140,
    },
    {
      id: "emp_mst_emg_phone",
      label: CustomizeLable("emp_mst_emg_phone") || "Emergency Phone",
      width: 140,
    },
    {
      id: "emp_mst_dateofhire",
      label: CustomizeLable("emp_mst_dateofhire") || "Date of Hire",
      width: 140,
    },
    {
      id: "emp_mst_sex",
      label: CustomizeLable("emp_mst_sex") || "Sex",
      width: 140,
    },
    {
      id: "emp_mst_date_of_birth",
      label: CustomizeLable("emp_mst_date_of_birth") || "Date of Birth",
      width: 140,
    },
    {
      id: "emp_mst_marital_status",
      label: CustomizeLable("emp_mst_marital_status") || "Marital Status",
      width: 140,
    },
    {
      id: "emp_mst_payrate",
      label: CustomizeLable("emp_mst_payrate") || "Pay Rate",
      width: 140,
    },
    {
      id: "emp_mst_pay_period",
      label: CustomizeLable("emp_mst_pay_period") || "Pay Period",
      width: 140,
    },
    {
      id: "emp_mst_remarks",
      label: CustomizeLable("emp_mst_remarks") || "Remarks",
      width: 140,
    },
    {
      id: "emp_mst_privilege_template",
      label:
        CustomizeLable("emp_mst_privilege_template") || "Privilege Template",
      width: 170,
    },
    {
      id: "emp_supervisor_name",
      label: CustomizeLable("emp_supervisor_name") || "Supervisor Name",
      width: 140,
    },
    {
      id: "emp_mst_create_by",
      label: CustomizeLable("emp_mst_create_by") || "Created By",
      width: 140,
    },
    {
      id: "emp_mst_create_date",
      label: CustomizeLable("emp_mst_create_date") || "Created Date",
      width: 140,
    },
    {
      id: "audit_user",
      label: CustomizeLable("audit_user") || "Audit User",
      width: 140,
    },
    {
      id: "audit_date",
      label: CustomizeLable("audit_date") || "Audit Date",
      width: 140,
    },
    {
      id: "column1",
      label: CustomizeLable("column1") || "Column 1",
      width: 140,
    },
    {
      id: "column2",
      label: CustomizeLable("column2") || "Column 2",
      width: 140,
    },
    {
      id: "column3",
      label: CustomizeLable("column3") || "Column 3",
      width: 140,
    },
    {
      id: "column4",
      label: CustomizeLable("column4") || "Column 4",
      width: 140,
    },
    {
      id: "column5",
      label: CustomizeLable("column5") || "Column 5",
      width: 140,
    },
    {
      id: "emp_det_mr_approver",
      label:
        CustomizeLable("emp_det_mr_approver") || "MR Approver / Global Limit",
      width: 200,
    },
    {
      id: "emp_det_mr_limit",
      label: CustomizeLable("emp_det_mr_limit") || "Material Request Limit",
      width: 180,
    },
    {
      id: "emp_det_wo_budget_approver",
      label:
        CustomizeLable("emp_det_wo_budget_approver") ||
        "WO Budget Approver / Limit",
      width: 220,
    },
    {
      id: "emp_det_wo_approval_limit",
      label: CustomizeLable("emp_det_wo_approval_limit") || "WO Approval Limit",
      width: 160,
    },
    {
      id: "emp_det_pr_approver",
      label: CustomizeLable("emp_det_pr_approver") || "PR Approver",
      width: 140,
    },
    {
      id: "emp_det_pr_approval_limit",
      label: CustomizeLable("emp_det_pr_approval_limit") || "PR Approval Limit",
      width: 140,
    },
    {
      id: "emp_det_wr_approver",
      label: CustomizeLable("emp_det_wr_approver") || "WR Approver",
      width: 140,
    },
    {
      id: "emp_det_planner",
      label: CustomizeLable("emp_det_planner") || "Planner",
      width: 140,
    },
    {
      id: "emp_det_wo_gen_mr_pr",
      label:
        CustomizeLable("emp_det_wo_gen_mr_pr") || "Request Parts && Services",
      width: 220,
    },
    {
      id: "emp_det_pm_generator",
      label: CustomizeLable("emp_det_pm_generator") || "PM Generator",
      width: 140,
    },
    {
      id: "emp_det_time_card_enter",
      label: CustomizeLable("emp_det_time_card_enter") || "Time Card Enter",
      width: 140,
    },
    {
      id: "emp_det_time_card_void",
      label: CustomizeLable("emp_det_time_card_void") || "Time Card Void",
      width: 140,
    },
    {
      id: "emp_det_wo_sched",
      label: CustomizeLable("emp_det_wo_sched") || "Schedule Work Order",
      width: 200,
    },
    {
      id: "emp_det_po_buyer",
      label: CustomizeLable("emp_det_po_buyer") || "PO Buyer",
      width: 140,
    },
    {
      id: "emp_det_supervisor",
      label: CustomizeLable("emp_det_supervisor") || "Supervisor",
      width: 140,
    },
    {
      id: "emp_det_foreman",
      label: CustomizeLable("emp_det_foreman") || "Technician",
      width: 140,
    },
    {
      id: "emp_det_asset_tag_flag",
      label: CustomizeLable("emp_det_asset_tag_flag") || "Asset Tag Posting",
      width: 140,
    },
    {
      id: "emp_det_checklist",
      label: CustomizeLable("emp_det_checklist") || "Add/Delete Checklist",
      width: 200,
    },

    {
      id: "emp_det_email_id",
      label: CustomizeLable("emp_det_email_id") || "Email ID",
      width: 140,
    },
    {
      id: "emp_det_craft",
      label: CustomizeLable("emp_det_craft") || "Craft",
      width: 140,
    },
    {
      id: "emp_det_work_area",
      label: CustomizeLable("emp_det_work_area") || "Work Area",
      width: 140,
    },
    {
      id: "emp_det_work_grp",
      label: CustomizeLable("emp_det_work_grp") || "Work Group",
      width: 140,
    },
    {
      id: "emp_det_shift",
      label: CustomizeLable("emp_det_shift") || "Shift",
      width: 140,
    },
    {
      id: "emp_det_supervisor_id",
      label: CustomizeLable("emp_det_supervisor_id") || "Supervisor ID",
      width: 140,
    },
    {
      id: "emp_det_varchar1",
      label: CustomizeLable("emp_det_varchar1") || "Varchar 1",
      width: 140,
    },
    {
      id: "emp_det_varchar2",
      label: CustomizeLable("emp_det_varchar2") || "Varchar 2",
      width: 140,
    },
    {
      id: "emp_det_varchar3",
      label: CustomizeLable("emp_det_varchar3") || "Varchar 3",
      width: 140,
    },
    {
      id: "emp_det_varchar4",
      label: CustomizeLable("emp_det_varchar4") || "Varchar 4",
      width: 140,
    },
    {
      id: "emp_det_varchar5",
      label: CustomizeLable("emp_det_varchar5") || "Varchar 5",
      width: 140,
    },
    {
      id: "emp_det_varchar6",
      label: CustomizeLable("emp_det_varchar6") || "Varchar 6",
      width: 140,
    },
    {
      id: "emp_det_varchar7",
      label: CustomizeLable("emp_det_varchar7") || "Varchar 7",
      width: 140,
    },
    {
      id: "emp_det_varchar8",
      label: CustomizeLable("emp_det_varchar8") || "Varchar 8",
      width: 140,
    },
    {
      id: "emp_det_varchar9",
      label: CustomizeLable("emp_det_varchar9") || "Varchar 9",
      width: 140,
    },
    {
      id: "emp_det_varchar10",
      label: CustomizeLable("emp_det_varchar10") || "Varchar 10",
      width: 140,
    },
    {
      id: "emp_det_varchar11",
      label: CustomizeLable("emp_det_varchar11") || "Varchar 11",
      width: 140,
    },
    {
      id: "emp_det_varchar12",
      label: CustomizeLable("emp_det_varchar12") || "Varchar 12",
      width: 140,
    },
    {
      id: "emp_det_varchar13",
      label: CustomizeLable("emp_det_varchar13") || "Varchar 13",
      width: 140,
    },
    {
      id: "emp_det_varchar14",
      label: CustomizeLable("emp_det_varchar14") || "Varchar 14",
      width: 140,
    },
    {
      id: "emp_det_varchar15",
      label: CustomizeLable("emp_det_varchar15") || "Varchar 15",
      width: 140,
    },
    {
      id: "emp_det_varchar16",
      label: CustomizeLable("emp_det_varchar16") || "Varchar 16",
      width: 140,
    },
    {
      id: "emp_det_varchar17",
      label: CustomizeLable("emp_det_varchar17") || "Varchar 17",
      width: 140,
    },
    {
      id: "emp_det_varchar18",
      label: CustomizeLable("emp_det_varchar18") || "Varchar 18",
      width: 140,
    },
    {
      id: "emp_det_varchar19",
      label: CustomizeLable("emp_det_varchar19") || "Varchar 19",
      width: 140,
    },
    {
      id: "emp_det_varchar20",
      label: CustomizeLable("emp_det_varchar20") || "Varchar 20",
      width: 140,
    },
    {
      id: "emp_det_numeric1",
      label: CustomizeLable("emp_det_numeric1") || "Numeric 1",
      width: 140,
    },
    {
      id: "emp_det_numeric2",
      label: CustomizeLable("emp_det_numeric2") || "Numeric 2",
      width: 140,
    },
    {
      id: "emp_det_numeric3",
      label: CustomizeLable("emp_det_numeric3") || "Numeric 3",
      width: 140,
    },
    {
      id: "emp_det_numeric4",
      label: CustomizeLable("emp_det_numeric4") || "Numeric 4",
      width: 140,
    },
    {
      id: "emp_det_numeric5",
      label: CustomizeLable("emp_det_numeric5") || "Numeric 5",
      width: 140,
    },
    {
      id: "emp_det_numeric6",
      label: CustomizeLable("emp_det_numeric6") || "Numeric 6",
      width: 140,
    },
    {
      id: "emp_det_numeric7",
      label: CustomizeLable("emp_det_numeric7") || "Numeric 7",
      width: 140,
    },
    {
      id: "emp_det_numeric8",
      label: CustomizeLable("emp_det_numeric8") || "Numeric 8",
      width: 140,
    },
    {
      id: "emp_det_numeric9",
      label: CustomizeLable("emp_det_numeric9") || "Numeric 9",
      width: 140,
    },
    {
      id: "emp_det_numeric10",
      label: CustomizeLable("emp_det_numeric10") || "Numeric 10",
      width: 140,
    },
    {
      id: "emp_det_datetime1",
      label: CustomizeLable("emp_det_datetime1") || "Datetime 1",
      width: 140,
    },
    {
      id: "emp_det_datetime2",
      label: CustomizeLable("emp_det_datetime2") || "Datetime 2",
      width: 140,
    },
    {
      id: "emp_det_datetime3",
      label: CustomizeLable("emp_det_datetime3") || "Datetime 3",
      width: 140,
    },
    {
      id: "emp_det_datetime4",
      label: CustomizeLable("emp_det_datetime4") || "Datetime 4",
      width: 140,
    },
    {
      id: "emp_det_datetime5",
      label: CustomizeLable("emp_det_datetime5") || "Datetime 5",
      width: 140,
    },
    {
      id: "emp_det_datetime6",
      label: CustomizeLable("emp_det_datetime6") || "Datetime 6",
      width: 140,
    },
    {
      id: "emp_det_datetime7",
      label: CustomizeLable("emp_det_datetime7") || "Datetime 7",
      width: 140,
    },
    {
      id: "emp_det_datetime8",
      label: CustomizeLable("emp_det_datetime8") || "Datetime 8",
      width: 140,
    },
    {
      id: "emp_det_datetime9",
      label: CustomizeLable("emp_det_datetime9") || "Datetime 9",
      width: 140,
    },
    {
      id: "emp_det_datetime10",
      label: CustomizeLable("emp_det_datetime10") || "Datetime 10",
      width: 140,
    },
    {
      id: "emp_det_note1",
      label: CustomizeLable("emp_det_note1") || "Note 1",
      width: 140,
    },
    {
      id: "emp_det_note2",
      label: CustomizeLable("emp_det_note2") || "Note 2",
      width: 140,
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(TitleAstReg !== "" || selectedOption);
  // Select DroupDown Value employe list Filter
  const fetchFilterSubPopupSavedropdon = async () => {
    try {
      const response = await httpCommon.get(
        `/get_emp_filter_dropdown.php?site_cd=${site_ID}&cf_query_owner=${AuditUser}`,
      );
     //console.log("check save as___",response);
      setEmpReqFilterDpd(response.data);

      // Swal.close();

      if (DropListIdGet !== "" && DropListIdGet !== null) {
        const matchedItem = response.data.find(
          (item) => item.RowID === DropListIdGet,
        );
        if (matchedItem) {
          const cfQueryDescValue = matchedItem.cf_query_title;
         // console.log("check save as___cfQueryDescValue",cfQueryDescValue);
          setTitleAstReg(cfQueryDescValue);
        
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
// Get Api data useEffect first time 
const fetchData = useCallback(async () => {
  //console.log("fetch___data___",selectedOption);
  setIsLoading(true);
  try {
    
    const response2 = await httpCommon.get(
      `/get_emp_filter_dropdown.php?site_cd=${site_ID}&cf_query_owner=${AuditUser}`,
    );
   
        if(selectedOption === "" || selectedOption == null ){
          const defaultItem = response2.data.find(item => item.cf_query_default_flag === "1");

        
          if (defaultItem) {
            setDefaultTitle(defaultItem.cf_query_title);
            
          }
        
        }else{
         // console.log("enter___here first__",selectedOption);
          setDefaultTitle(selectedOption);
         
        }
    setIsLoading(false);
    
  } catch (error) {
    console.error("Error fetching data:", error);
  } 
}, [site_ID, currentPage]);

useEffect(() => {
  if (defaultTitle) {
   
    handleOptionTableList({ target: { value: defaultTitle }});

  }
}, [defaultTitle,site_ID, currentPage]);

const handleOptionTableList = async (event,responseData) => {
    
  const selectedValue = event?.target?.value || selectedOption;
  setCurrentPage(1);

  const selectedOptionObjectFilter = empReqFilterDpd.find(
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
            "/get_work_order_filter_query_data.php?site_cd=" +
              site_ID +
              "&RowID=" +
              GetRowID
          );
         // console.log("response___promt__data",response);
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
              
              setRowsDropdownPrompt(newRows);
              setIsLoading(false);
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

const handleOptionChange = async (event, responseData) => {
 
  const selectedValue = event?.target?.value || selectedOption;
  setDefaultTitle("");
  setSelectedComeBack("");
  setCurrentPage(1);
  setSelectedRowIdbackState("");
  setInputValueSearch("");
  setSelectRefreshId("");
  const selectedOptionObjectFilter = empReqFilterDpd.find(
    (item) => item.cf_query_title === selectedValue
  );

  let selectedOptionObject;

  if (Array.isArray(responseData) && responseData.length > 0) {
    selectedOptionObject = responseData.find(
      (item) => item.cf_query_title === selectedValue
    );
  }

  if (selectedOptionObjectFilter ) {

    const GetRowID = selectedOptionObjectFilter.RowID;
    const GetPrompt = selectedOptionObjectFilter.cf_query_list_prompt;
   
    // dialog promt
    if (GetPrompt === "1") {
    
      setShowPromt(true);
      setIsLoading(true);
      try {

        const response = await httpCommon.get(
          "/get_emp_filter_query_data.php?site_cd=" +
            site_ID +
            "&RowID=" +
            GetRowID,
        );
   

        if (response.data.data && response.data.data.list_typeF && response.data.data.list_typeF.length > 0) {
          const newRows = response.data.data.list_typeF.map((item) => ({
            selectedOption: item.cf_query_list_column,
            selectedOptionName: item.customize_header,
            operator: item.cf_query_list_operator,
            valuept: item.cf_query_list_value,
            logical: item.cf_query_list_logical,
            siteCd: site_ID,
            RowId: GetRowID,
            prompt: GetPrompt,
            queryTypedd: "F",
          }));
        
          setRowsDropdownPrompt(newRows);
          setSelectedOption(selectedValue);
         
         
        } else {
    
        
          setIsLoading(false);
          setSelectedOption(selectedValue);
          // Swal.fire({
          //   icon: "error",
          //   customClass: {
          //     container: "swalcontainercustom",
          //   },
          //   title: "Oops...",
          //   text: "No record found Please try again !",
          // });
        
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally {
        setIsLoading(false); // Ensure the loader is stopped after data has been processed
      }
      return;
    }
  
  setExportExcelId(GetRowID);
  setselectDropRowID(GetRowID);
  setCurrentPage(1);
  setDropListIdGet([]);
  setTitleAstReg("");
}else{
  const GetRowID = selectedOptionObject.RowID;
    setExportExcelId(GetRowID);
    setselectDropRowID(GetRowID);
    setCurrentPage(1);
    setDropListIdGet([]);
    setTitleAstReg("");
}
setSelectedOption(selectedValue);
   await new Promise((resolve) => setTimeout(resolve, 0));

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
      `/get_emp_table_data_List.php?site_cd=${site_ID}&ItemID=${ItemID}&page=${CurrentPageValue}&EmpId=${emp_owner}`,
    );

  // console.log("response____getb",response);
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
      setTableData([]);
      setTotalRow(0);
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
}, [site_ID, currentPage, selectDropRowID, selectRefreshId]);

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

const fetchDataUsingRefreshBtn = useCallback(async () =>{
  getb();
}, [site_ID, currentPage, selectDropRowID, selectRefreshId]);

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

  const handleCloseRetrivePromt = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return; // Do nothing on backdrop click or escape key press
    }
    const resetRows = rows.map(row => ({
      selectedOption: "",
      operator: "",
      logical: "AND",
      prompt: "0",
      valuept: "",
      siteCd: site_ID, 
      queryTypedd: "F", 
    }));
  
    // Set the rows with the reset data
    setRows(resetRows);
  
    setShowPromtRetiveBtn(false);
    FilterhandleClose();
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
    //  Swal.showLoading();
      const combinedDataPromt = {
        rowsQrtData: rows,
        siteCd: site_ID,
        owner: emp_owner,
      };
     
      try {

        const response = await httpCommon.post(
          "/insert_emp_retrive_prompt_save_data.php",
          combinedDataPromt
        );

        
        if (response.data.status === "SUCCESS") {

          setSelectedOption(response.data.titleName);
          setselectDropRowID(response.data.SelectId);
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
          handleCloseRetrivePromt();
          //FilterhandleClose();
  
        
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
            handleCloseRetrivePromt();
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
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
        idx === index ? { ...row, valuept: newValue } : row,
      ),
    );
  };

  // fetching the data 
  const fetchDataResponse = async (hasRowIdValuept) => {
    try {
      const response = await httpCommon.post(
        "/get_emp_dropdown_prompt_data.php?page=" + currentPage,
        {
          rows: rowsDropdownPrompt,
          rowsort: "",
          SiteCD: site_ID,
          admin: emp_owner,
          RowId: hasRowIdValuept,
        },
      );
     
      setSelectedOption(response.data.titleName);
      setselectDropRowID(response.data.TitleId);
 
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
        mst_RowID: hasRowIdValuept,
        owner: emp_owner,
      };

   
      try {
        const response = await httpCommon.post(
          "/insert_emp_query_list_prompt_save_data.php",
          combinedData,
        );

      

        if (response.data.status == "SUCCESS") {
          
          
          fetchDataResponse(hasRowIdValuept);
          Swal.close();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };


  useEffect(() => {
   
    if (ignoreEffect) {
     
      setIgnoreEffect(false); // Reset the flag
      return;
    }
    if (selectDropRowID !== "" && selectDropRowID !== null) {
     

      getb();
    } else if (TableSearchData != "" && TableSearchData != null) {
    
      handelSearchButton();
    } else {
      
      fetchData();
    }
   
    fetchFilterSubPopupSavedropdon();
    
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
              const response = await httpCommon.post("/delete_employe.php", {
                site_cd: site_ID,
                row_id: row.RowID,
              });

              //console.log("response___", response);
              if (response.data.status == "SUCCESS") {
                Swal.fire({
                  title: "Deleted!",
                  text: response.data.message,
                  icon: "success",
                }).then(() => setRefetch(true));
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
    (id, row) => {

      const Rowid = id;
      const querydropdownId = selectDropRowID || selectRefreshId;
      const passSelectOption = TitleAstReg || selectedOption;

      if (Rowid !== "") {
        navigate(`/dashboard/people/editemployee`, {
          state: {
            currentPage,
            selectDropRowID: querydropdownId,
            selectedOption: passSelectOption,
            row,
            RowID:Rowid,
          },
        });
      }
    },
    [router, currentPage,selectDropRowID,selectedOption,selectRefreshId],
  );
  const handleRowClickTable = useCallback(
    
    (id,row) => {
      const Rowid = id;
      const querydropdownId = selectDropRowID || selectRefreshId;
      const passSelectOption = TitleAstReg || selectedOption;
      if (Rowid !== '' && Rowid !== null) {
        navigate(`/dashboard/people/editemployee`, {
          state: {
            currentPage,
            selectDropRowID: querydropdownId,
            selectedOption: passSelectOption,
            row,
           
            RowID:Rowid,
          },
        });
      }
    },
    [router,currentPage, selectDropRowID,selectRefreshId,selectedOption]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router],
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

  const handleFilterName = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, name: value });

    const filteredData = tableData.filter((item) =>
      item.col1.toLowerCase().includes(value.toLowerCase()),
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
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter funcation
  const [rows, setRows] = useState([
    {
      selectedOption: "",
      operator: "",
      logical: "",
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
    const updatedRows = [...rows];
  //  setSelectedOperator(operator)
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

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
     
    const isLastRowIncomplete =
    rows.length > 0 &&
    (!lastRow.selectedOption || lastRow.selectedOption === "" ||
     !lastRow.valuept || lastRow.valuept === "" ||
     !lastRow.logical || lastRow.logical === "");

    if (isLastRowIncomplete) {
      setSelectedOptionEmptyError(!lastRow.selectedOption || lastRow.selectedOption === "");
      setValueptEmptyError(!lastRow.valuept || lastRow.valuept === "");
      setLogicalEmptyError(!lastRow.logical || lastRow.logical === "");
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

  const FilterhandleClose = () => {
    // Call your custom logic here before closing the filter
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
    // Call handleDeleteRowShort to remove all rowsort except the first one
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
      logical: "",
      operator:"",
      valuept: "",
      logical:"",
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
    label: row.customize_header,
  }));


  /* Filter dropdown value */
  const getWorkReqListLebel = async () => {
    try {
      const response = await httpCommon.get("/get_emp_filter_name.php");
      // console.log("response___empList",response);
      if (response.data.status == "SUCCESS") {
        setWordReqFiledname(response.data.data);
        //setAstdetLabel(response.data.data.ast_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const retriveSaveQuery =async()=>{
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
        "/get_retrive_popup_emp_filed_data.php?page=" + currentPage,
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

      }
      
    } catch (error) {
      console.log("error",error)
    }


  }

  // Retrive button  funcation,setTableData 
  const RetriveData = useCallback(async () => {

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
   if (!foundPromptOne) {
    try {
      const response = await httpCommon.post(
        "/get_retrive_popup_emp_filed_data.php?page=" + currentPage,
        {
          rows: rows,
          rowsort: rowsort,
          SiteCD: site_ID,
          admin: emp_owner,
        },
      );
    // console.log("response_____Asset_filter__",response);
      if (response.data.status === "SUCCESS") {

        setTableData(response.data.data);
        setTotalRow(response.data.total_count);

        setSelectedOption(response.data.titleName);
        setselectDropRowID(response.data.SelectId);
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
    // }
  }, [site_ID, currentPage,rows,rowsort]);

  // Retrive all data
  const RetriveDataAllData = useCallback(async () => {
   // console.log("retrive_all Data____");
    setSelectedOption("");
    setselectDropRowID("");
    setDropListIdGet("");
    setSelectRefreshId("");
    setSelectedRowIdbackState("");
    setIsLoading(true);
    try {

      const response = await httpCommon.get(
        `/get_emp_mst_table_data_all_test.php?site_cd=${site_ID}&page=${currentPage}&admin=${emp_owner}`,
      );
     
    //  console.log("response_retrive",response)
      if (
        response.data &&
        response.data.result &&
        response.data.result.length > 0
      ) {

        setTableData(response.data.result);
        setTotalRow(response.data.total_count);

        setSelectedOption(response.data.titleName);
        setSelectRefreshId(response.data.titleRowId);
       // setselectDropRowID(response.data.titleRowId);
        setExportExcelId(response.data.titleRowId);
        await new Promise(resolve => setTimeout(resolve, 0));
     
        Swal.close();
        FilterhandleClose();
       
      } else {
        Swal.close();
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
  }, [site_ID, currentPage,emp_owner,selectDropRowID]);

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
      [name]: value,
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
        "/Insert_emp__req_filter_query_list_data.php",
        combinedData,
      );
    
      if (response.data.status == "SUCCESS") {
        setTitleAstReg(response.data.Title);
       
        setSelectedOption(response.data.title)
        fetchFilterSubPopupSavedropdon();
        retriveSaveQuery()
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
      const matchingOption = empReqFilterDpd.find(
        (option) => option.cf_query_title === inputValue,
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
    //setRowsortQrt([]);
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
        "/get_retrive_popup_emp_filed_data.php?page=" + currentPage,
        {
          rows: rowsQrt,
          rowsort: rowsortQrt,
          SiteCD: site_ID,
          admin: emp_owner,
        },
      );
    
      setTableData(response.data.data);
 
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
         // timer: 2000,
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await httpCommon.get(
              "/delete_emp_query.php?value=" + RowID + "&siteId=" + site_ID,
            );
          // console.log("delete__res___",response)
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
   //   console.log("empty");
    }
  };

  const SaveWorkOrderQryList = async () => {
   
      const [cf_query_title, RowID] = selectedOptionValue.split("-");
      const isAnySelectedOptionShortEmpty = rowsortQrt.some(
        (row) => !row.selectedOptionShort,
      );
      
      if (isAnySelectedOptionShortEmpty && RowID != "") {
        toast.error(`Please fill the required field: Field Name`, {
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
          RowId: RowID,
     
          defaultFlag: isChecked === null ? "notCheckeset" : isChecked ? "1" : "0", 
          rowsortQrtData: rowsortQrt,
        };
   
        try {
          const response = await httpCommon.post(
            "/insert_emp_list_prompt_save_data.php",
            combinedData,
          );
          //  console.log("response____save__",response);
          if (response.data.status == "SUCCESS") {
            setIgnoreEffect(false); 
            setSelectedOption(cf_query_title);
            setselectDropRowID(RowID);
            setExportExcelId(RowID);
            Swal.close();
            Swal.fire({
              title: "Success!",
              text: "Your query update successfully.",
              icon: "success",
              confirmButtonText: "OK",
              timer: 3000,
              timerProgressBar: true, 
              customClass: {
                container: "swalcontainercustom",
              },
            }).then((result) => {
              if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                setIsChecked(null);
                RetriveDataQueryList();
                setRowsQrt([]);
                setselectedOptionValue("");
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
      const matchingOption = empReqFilterDpd.find(
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

    if (hyphenCount === 1) {
      [cf_query_title, RowID] = selectedOption.split("-");
    } else {
      const parts = selectedOption.split("-");

      cf_query_title = parts[0].trim();
      RowID = parts[parts.length - 1].trim();
    }

    if(RowID !== "" && cf_query_title !==""){
      setQueryTitleRowID(RowID);
    const initialCheckedState = empReqFilterDpd.some(
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
          "/get_emp_filter_query_data.php?site_cd=" +
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
    setSelectedOperatorQl(operator)
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

  const handleIncludeChangeLogcilQtr2 = (index, logical) => {
    setLogcValueQl(logical.target.value)
    const updatedRowsQtr = [...rowsQrt];
    updatedRowsQtr[index].logical = logical.target.value;
   // logicalEmptyErrorQtr(false);
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
      SITE_CD: site_ID,
      OWNER_ID: emp_owner,
      defaultFlag:isChecked?1:0,
      availability: "G",
    };

    try {
      const response = await httpCommon.post(
        "/insert_emp_save_as_query.php",
        combinedData,
      );

     // console.log("response", response);
      if (response.data.status == "SUCCESS") {
        setIgnoreEffect(false); 
        setSelectedOption(response.data.Title);
        setselectDropRowID(response.data.ROW_ID);
        setExportExcelId(response.data.ROW_ID);

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
  const handleResetFilter = useCallback(() => {
    setSearch('');
    if (inputRef.current) {
      inputRef.current.value = ''; 
    }
    RetriveDataAllData();
  }, [RetriveDataAllData]);

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


  // Search Button Click funcation
  const handelSearchButton = async () => {
    const inputValueGet = inputRef.current.value;
  
    if (inputValueGet !== "" && inputValueGet !== null) {
      Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
      Swal.showLoading();
      
      try {
        const response = await httpCommon.get(
          `/get_employee_search.php?site_cd=${site_ID}&searchTerm=${inputValueGet}&page=${currentPage}`,
        );
      //  console.log("serch result____",response);
        if (response.data.data.length > 0) {
       // if (response.data.status === "SUCCESS") {
         
          setTableSearchData(response.data.data);
          setTotalRow(response.data.total_count);

          const filteredData = response.data.data.filter((item) => {
            const searchString = inputValueGet.toLowerCase();
            const emp_mst_name = (item.emp_mst_name || "").toLowerCase();
            const emp_mst_title = (item.emp_mst_title || "").toLowerCase();
            const emp_mst_status = (item.emp_mst_status || "").toLowerCase();
            const emp_mst_homephone = (item.emp_mst_homephone || "").toLowerCase();
            const emp_mst_emg_name = (item.emp_mst_emg_name || "").toLowerCase();
            const emp_mst_emg_phone = (item.emp_mst_emg_phone || "").toLowerCase();
            const emp_mst_empl_id = (item.emp_mst_empl_id || "").toLowerCase();
            const emp_mst_login_id = (item.emp_mst_login_id || "").toLowerCase();
            // Apply the filter based on search string and RowID match
              return (
               
                emp_mst_name.includes(searchString) ||
                  emp_mst_title.includes(searchString) ||
                  emp_mst_status.includes(searchString) ||
                  emp_mst_homephone.includes(searchString) ||
                  emp_mst_emg_name.includes(searchString) ||
                  emp_mst_emg_phone.includes(searchString) ||
                  emp_mst_empl_id.includes(searchString) ||
                  emp_mst_login_id.includes(searchString)
              );
        });
        setTableData(filteredData);
        setTableData(filteredData);
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
   

      const inputValue2 = inputRef.current.value;
      if (inputValue2.length === 1) {
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
      timer: 1000,
    });
    Swal.showLoading();
  };

  return (
    <>
      <Helmet>
        <title>CMMS System</title>
        <meta name="description" content="Employe List" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>

      <TemplateDialog open={template} handleClose={handleCloseTemplate} />
     
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
            heading="Employee List"
            links={[]}
            action={
              <Button
                component={RouterLink}
                variant="contained"
                className="AddNewButton"
                startIcon={<Iconify icon="mingcute:add-line" />}
                to={{
                  pathname: "/dashboard/people/employe-new",
                  state: { select: "New_WorkRequest" },
                }}
                
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
               
                
               <InputLabel id="select-label" className={(TitleAstReg !== "" || selectedOption) ? "selectedcss" : "defaultLabelSelect "}>Select Query</InputLabel>


                <Select
                  labelId="select-label"
                  id="select"
                  value={TitleAstReg !== "" ? TitleAstReg : selectedOption}
                  onChange={handleOptionChangeInternal}
                  onOpen={handleDropdownOpen}
                  onClose={handleDropdownClose}
                  sx={{ textTransform: "capitalize" }}
                >
                  {empReqFilterDpd.map((item) => (
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
                  className={`ListDataRefBtn ${selectDropRowID === "" ? "disabled" : ""}`}
                
                  onClick={selectDropRowID !== "" || selectRefreshId !== "" ? fetchDataUsingRefreshBtn : null}
                  style={{ border: '0px' }}
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
                  <div style={{ display: "flex", alignItems: "center" }}>
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
                disabled={tableData && tableData.length > 0 ? false:true}
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
                numSelected={table.selected.length}
                rowCount={tableData && tableData.length?tableData.length:"0"}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id),
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
                    rowCount={tableData && tableData.length?tableData.length:"0"}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    className="stickyheader"
                  />

                  <TableBody className="AssetTable">
                    {isLoading ? ( // Assuming isLoading is a boolean state indicating whether data is loading
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
                        {tableData && tableData.length === 0 ? (
                          <TableRow className="noDataFound">
                            <TableCell  sx={{ p: 0 }}></TableCell>
                            <TableCell
                              colSpan={numberOfColumns}
                              sx={{
                                height: 150, 
                                  textAlign: 'center',  
                                  verticalAlign: 'middle', 
                                  padding: 5, 
                                  marginLeft:"10px"
                              }}
                            >
                          
                            <TableNoData  numberOfColumns={numberOfColumns} notFound={notFound} />
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {dataFiltered
                                .map((row, index) => (
                              <EmployeRow
                        
                                key={row.id}
                                row={row}
                                index={index}
                              //  setRefetch={setRefetch}
                                isHighlighted={selectedRowIdbackState && selectedRowIdbackState === row.RowID} 
                                selectedOption={selectedOption}
                                rowStats={ResponceStats}
                                selected={table.selected.includes(
                                  row.mst_RowID,
                                )}
                                onSelectRow={() =>
                                  table.onSelectRow(row.mst_RowID)
                                }
                                onDeleteRow={() =>
                                  handleDeleteRow(row.mst_RowID, row)
                                }
                                onEditRow={() => handleEditRow(row.RowID, row)}
                                onClick={() => handleRowClickTable(row.RowID,row)}
                                
                              />
                            )
                            )}
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
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
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
           // color: (theme) => theme.palette.grey[500],
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
                      <td style={{ width: "8%" }}>
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


                      <td style={{ width: "10%" }}>
                        <Select
                          style={{ width: "100%" }}
                          className={`custom-default-select ${
                            index === rows.length - 1 && logicalEmptyError
                              ? "error-border"
                              : "mammama"
                          }`}
                          value={row.logical || "And"}
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
            //color: (theme) => theme.palette.grey[500],
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
                  {empReqFilterDpd.map((option, index) => (
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

      {/* Query List modal */}
      <BootstrapDialog
       // onClose={handleCloseWorkQryList}
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
                    {/* empReqFilterDpd */}
                     
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
                        {empReqFilterDpd.map((item) => (
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
                            <td style={{ width: "17%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className="custom-default-select"
                                 value={row.selectedOption || ""} 

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
                                    event.target.value,
                                  )
                                }
                              />
                            </td>

                            <td style={{ width: "10%" }}>
                              <Select
                                style={{ width: "100%" }}
                                value={row.logical || "And"}
                                className={`custom-default-select ${
                                  index === rowsQrt.length - 1 &&
                                  logicalEmptyErrorQtr
                                    ? "error-border"
                                    : "mammama"
                                }`}
                                 onChange={(logical) =>
                                  handleIncludeChangeLogcilQtr2(index, logical)
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
        //onClose={handleCloseSaveAs}
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
           // color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
        </IconButton>
        <DialogContent dividers>
          <div className="astSubpopup">
            <fieldset className="Subpopup-fieldset">
              <legend>Query name:</legend>
              <div className="form-group">
                <input
                  type="text"
                  id="customInput"
                  name="queryName"
                  value={formDataSv.queryName}
                   autoComplete='off'
                  onChange={handleInputChangeSav}
                  className="bsc_sav"
                  list="options"
                  style={{ width: "100%" }}
                />

                <datalist id="options">
                  {empReqFilterDpd.map((option, index) => (
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

      
      {/******************** Prompt  Select Option ********************/}
   

      <EmployeIdPromt
        handleClosePromt={handleClosePromt}
        showPromt={promt}
        rowsDropdownPrompt={rowsDropdownPrompt}
        rowOptions = {rowOptions}
        handleInputValueChangePrompt={handleInputValueChangePrompt}
        handleDropDownPromptSaveAsBtn={handleDropDownPromptSaveAsBtn}
      />

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
  return inputData;
}
