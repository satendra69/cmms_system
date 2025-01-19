import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { Helmet } from "react-helmet-async";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
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
import Moment from "moment";
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
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
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
import OutlinedInput from "@mui/material/OutlinedInput";
import { Icon } from "@iconify/react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextareaAutosize from "@mui/material/TextareaAutosize";

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
import { PeopleContext } from "./EmpContext";

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
  const [lastQuery, setLastQuery] = useState([]);
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refetch2, setRefetch2] = useState(false);
  const popover = usePopover();
  const router = useRouter();
  const navigate = useNavigate();
  const table = useTable();
  const [RowPerPage,setRowperPage]=useState(100);
  const { call, setCall,setSavedQuery,savedQuery,savedOptions,setSavedQptions,rowsPromptGlobal,setRowsPromptGlobal,setRowsPromptSortGlobal,rowsPromptSortGlobal,defineQyeryRetrive,setDefineQueryRetrive } = useContext(PeopleContext);
  const [empFlag,setEmpFlag] = useState(false)

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
  const [AssetFiledname, setAssetFiledname] = useState([]);
  const [WorkReqFiledname, setWordReqFiledname] = useState([]);
  const [selectedOptionEmptyError, setSelectedOptionEmptyError] =
    useState(false);
  const [selectedOptionEmptyErrorShort, setSelectedOptionEmptyErrorShort] =
    useState(false);
  const [valueptEmptyError, setValueptEmptyError] = useState(false);
  const [logicalEmptyError, setLogicalEmptyError] = useState(false);
  const [TitleAstReg, setTitleAstReg] = useState("");

  // const [assetFilterDpd, setAssetFilterDpd] = useState([]);
  const [workReqFilterDpd, setWorkReqFilterDpd] = useState([]);

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
  const [ExportExcelId, setExportExcelId] = useState("");
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
  const [template,setTemplate] = useState(false)
  const [callHandleOption,setCallHandleOption]=useState(false)
  const [refresh,setRefresh] = useState(false)

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
  const { selectedOption: returnedSelectedOption, savedQuery:oldData } = location.state || {};
  const [selectedOption, setSelectedOption] = useState(null);


  // Select DroupDown Value employe list Filter
  const fetchFilterSubPopupSavedropdon = async () => {
    try {
      const response = await httpCommon.get(
        `/get_emp_filter_dropdown.php?site_cd=${site_ID}&cf_query_owner=${AuditUser}`,
      );
     
      setWorkReqFilterDpd(response.data);

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
    // const response = await httpCommon.get(
    //   `/get_emp_table_data.php?site_cd=${site_ID}&page=${currentPage}&recordsPerPage=${RowPerPage}`,
    // );

    const response2 = await httpCommon.get(
      `/get_emp_filter_dropdown.php?site_cd=${site_ID}&cf_query_owner=${AuditUser}`,
    );

       
        // const tableList = response.data.employe_result.result;
        


        if(selectedOption === "" || selectedOption == null ){
          const defaultItem = response2.data.find(item => item.cf_query_default_flag === "1");

         
          
        
          if (defaultItem && !call) {
            setSelectedOption(defaultItem.cf_query_title)
            setTitleAstReg(defaultItem.cf_query_title);
            
            setEmpFlag(true)
           
          }
          else{
           
            setTableData([]);
            setTotalRow(0);
          }
        }
   

    // Swal.close();
    // setIsLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setIsLoading(false);
  }
}, [site_ID, currentPage, fetch,RowPerPage]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        if (refetch2) {
          await fetchFilterSubPopupSavedropdon();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refetch2]);

 

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
        "/get_emp_dropdown_prompt_data.php?page=" + currentPage,
        {
          rows: rowsDropdownPrompt,
          rowsort: "",
          SiteCD: site_ID,
          admin: emp_owner,
          RowId: hasRowIdValuept,
        },
      );
     
     
      setTableData(response.data.data);
      setSavedQuery(response.data.data)
      setTotalRow(response.data.total_count);
      setTitleAstReg(response.data.titleName);
      setSavedQptions(response.data.titleName)
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
          "/insert_emp_list_prompt_save_data.php",
          combinedData,
        );

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

 

  // onOptionChange
  const handleOptionChange = async (event, responseData) => {

    if(defineQyeryRetrive){
      RetriveData();
      setDefineQueryRetrive(false)
    }
    else{


    const selectedValue = event?.target?.value || selectedOption;

   
    if(workReqFilterDpd){
     
    const selectedOptionObjectFilter = workReqFilterDpd.find(
      (item) => item.cf_query_title === selectedValue,
    );
  
    if (selectedOptionObjectFilter && !refresh ) {


      const GetRowID = selectedOptionObjectFilter.RowID;
      const GetPrompt = selectedOptionObjectFilter.cf_query_list_prompt;
   
  
      // dialog promt
      if (GetPrompt === "1" && !refresh ) {
        setShowPromt(true);
        Swal.fire({
          title: "Please Wait !",
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
        Swal.showLoading();
        try {

          // passig query rowID to get all the information
          const response = await httpCommon.get(
            "/get_emp_filter_query_data.php?site_cd=" +
              site_ID +
              "&RowID=" +
              GetRowID,
          );
      

          if (response.data.data) {
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
            setRowsPromptGlobal(newRows)
           
              setSelectedOption(selectedValue)
            // setTotalRow(response.data.data.length);
            // setCall(true)
            // setEmpFlag(false)


            const timeoutId = setTimeout(() => {
              Swal.close();
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
    

    setCurrentPage(1);
    setSelectedOption(selectedValue);


    if (selectedValue) {
      setRefresh(false)
      Swal.fire({
        title: "Please Wait",

        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(async(result) => {
        if (selectedValue === "001. ACT ID") {
          try {
            const response = await httpCommon.get(
              `get_emp_filter_act.php?site_cd=${site_ID}`,
            );
            if (response && response.data) {
              let timerInterval;
              Swal.fire({
                title: "Please Wait",
    
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading();
                },
              }).then((result) => {
                /* Read more about handling dismissals below */
                Swal.close();
              });
              setSelectedOption(selectedValue)
              setTitleAstReg(selectedValue);
              setTableData(response.data);
              setSavedQuery(response.data)
              setSavedQptions(selectedValue)
              setTotalRow(response.data.length);
              
            }
          } catch (error) {}
        }

        else if(selectedValue === "LAST QUERY"){

            const response = await httpCommon.get(
      `/get_emp_table_data.php?site_cd=${site_ID}&page=${currentPage}&recordsPerPage=${RowPerPage}`,
    );
const result = response.data.employe_result.result;

          setSelectedOption(selectedValue)
          setTitleAstReg(selectedValue);
          setTableData(result);
          setSavedQuery(result)
          setSavedQptions(selectedValue)
          setTotalRow(result.length);
        }
    
    else{

     
      try {
        const response = await httpCommon.get(`/get_emp_non_prompt_data.php?site_cd=${site_ID}&title=${selectedValue}`)
       
        if(response.data.status === "SUCCESS"){
     
          const result = response.data.data;
       
            setSelectedOption(selectedValue)
            setTitleAstReg(selectedValue);
            setTableData(result);
            setSavedQuery(result)
            setSavedQptions(selectedValue)
            setTotalRow(response.data.data.length);
            setCall(true)
            setEmpFlag(false)
        
        }
     
             
       
      } catch (error) {
        console.log("error",error)
      }
    }
        Swal.close();
      });
    }

 


  
  }

}
  };
  

  // employe flag
useEffect(()=>{
if(empFlag){

    handleOptionChange();


  setEmpFlag(false)
}
},[empFlag])


// going back 
useEffect(()=>{
  if(call){
  setTimeout(()=>{
   setTableData(savedQuery)
   setTitleAstReg(savedOptions)
   setSelectedOption(savedOptions)
   setSavedQptions(savedOptions)
   setCall(false)
  },500)
  }
},[call])


// refresh button
useEffect(()=>{
if(refresh){
  handleOptionChange();
}
},[refresh])

useEffect(()=>{
if(defineQyeryRetrive){
  setRows(rowsPromptGlobal)
  setRowsort(rowsPromptSortGlobal)

}
},[defineQyeryRetrive])



  const getb = useCallback(async () => {
    // setIsLoading(true);
    try {
      const response = await httpCommon.post(
        `/getWorkReqOptionListData.php?site_cd=${site_ID}&ItemID=${selectDropRowID}&page=${currentPage}&EmpId=${emp_owner}`,
      );
      //  console.log("check___api__data__",response);
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        setTableData(response.data.data.result);
        setTotalRow(response.data.DashbrdCount);
        // Swal.close();
        // setIsLoading(false);
      } else {
        setTableData("");
        setTotalRow("");
        // setIsLoading(false);
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
  }, [site_ID, currentPage, selectDropRowID]);

  const get_dropdown = async () => {
    try {
      const responseJson = await httpCommon.post(
        `/getDropdownApprove.php?site_ID=${site_ID}`,
      );
      // console.log("response___dropdown",responseJson);
      if (responseJson.data.status === "SUCCESS") {
        // console.log('get_dropdown____', responseJson.data)

        let Status = responseJson.data.data.WorkorderStatus.map((item) => ({
          label: item.wrk_sts_desc,
          value: item.wrk_sts_status + " : " + item.wrk_sts_desc,
        }));
        setStatus(Status);

        let Originator = responseJson.data.data.WKO_Originator.map((item) => ({
          label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
          value: item.emp_mst_empl_id,
        }));
        setOriginator(Originator);

        let WorkGroup = responseJson.data.data.WKO_Work_Group.map((item) => ({
          label: item.wrk_grp_grp_cd + " : " + item.wrk_grp_desc,
          value: item.wrk_grp_grp_cd,
        }));
        setWorkGroup(WorkGroup);

        setButton_save("Approve");
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectDropRowID != "" && selectDropRowID != null) {
      getb();
    } else if (TableSearchData != "" && TableSearchData != null) {
      handelSearchButton();
    } else {
      fetchData();
    }
    fetchFilterSubPopupSavedropdon();
    get_dropdown();
  }, [site_ID, currentPage, selectDropRowID, fetchData, getb, fetch]);

  const dataFiltered = applyFilter({
    inputData: Array.isArray(tableData) ? tableData : [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage,
  );

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

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

              console.log("response___", response);
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

      if (Rowid !== "") {
        navigate(`/dashboard/people/employe-new?rowID=${Rowid}`, {
          state: {
            currentPage,
            selectedOption,
            row,
            savedQuery
          },
        });
      }
    },
    [router, currentPage],
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    inputRef.current.value = "";
    fetchData();
  }, [fetchData]);

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

  const FilterhandleClose = () => {
    // Call your custom logic here before closing the filter
    if (rows.length > 1) {
      const newRows = [rows[0]]; // Keep only the first row
      setRows(newRows);
    }

    // Call handleDeleteRowShort to remove all rowsort except the first one
    if (rowsort.length > 1) {
      const newRowsort = [rowsort[0]]; // Keep only the first row
      setRowsort(newRowsort);
    }

    // Close the filter
    setFilterShow(false);
  };
  const handelFilterAction = () => {
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
    label: row.default_label,
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
        setSavedQuery(response.data.data)
        setTotalRow(response.data.total_count);

      }
      
    } catch (error) {
      console.log("error",error)
    }


  }

  // Retrive button  funcation,setTableData
  const RetriveData = async () => {

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
      setRefetch2(true);
      if (response.data.status === "SUCCESS") {
        setTableData(response.data.data);
        setTotalRow(response.data.total_count);
        setTitleAstReg(response.data.titleName);
        setSavedQuery(response.data.data)
        setSavedQptions(response.data.titleName)
        setSelectedOption(response.data.titleName)

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
    // }
  };




  // Retrive all data
  const RetriveDataAllData = async () => {
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
        `/get_emp_table_data.php?site_cd=${site_ID}&page=${currentPage}`,
      );
      console.log("response retrive", response.data.employe_result.result);
      if (response.data.status == "SUCCESS") {
        setTableData(response.data.employe_result.result);
        setTotalRow(response.data.total_count);
        setSavedQuery(response.data.employe_result.result)
     
      setTitleAstReg("LAST QUERY");
      setSavedQptions("LAST QUERY")
      setSelectedOption("LAST QUERY")
        // setTitleAstReg(response.data.titleName);

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
  };

  // retrive buttton
  const retriveBtn = () => {
    setRefetch2(true);
    if (rows.some((row) => row.selectedOption !== "")) {
      //  i have to apply multiple toast condition
      for (const row of rows) {
        if (!row.operator) {
          toast.error(`Please fill the required field: Qperator`, {
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
        } else if (!row.valuept) {
          toast.error(`Please fill the required field: Value`, {
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
          setRowsPromptGlobal(rows)
          setRowsPromptSortGlobal(rowsort)
          setDefineQueryRetrive(true)
          RetriveData();
        }
      }
    } else {
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
        setSavedQptions(response.data.Title)
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
    if (formDataSv.queryName.trim() !== "") {
      const inputValue = formDataSv.queryName;
      const matchingOption = workReqFilterDpd.find(
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
      console.log("empty__");
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
        "/get_retrive_popup_emp_filed_data.php?page=" + currentPage,
        {
          rows: rowsQrt,
          rowsort: rowsortQrt,
          SiteCD: site_ID,
          admin: emp_owner,
        },
      );
    
      setTableData(response.data.data);
      setSavedQuery(response.data.data)
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
          timer: 2000,
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await httpCommon.get(
              "/delete_emp_query.php?value=" + RowID + "&siteId=" + site_ID,
            );

            if (response.data.status == "SUCCESS") {
              fetchFilterSubPopupSavedropdon();
              //  setErrord(null);
              setselectedOptionValue("");
              setRowsQrt([]);
              setRowsortQrt([]);
              //setSelectedRow([]);
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


    if (!selectedOptionValue) {
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
    } else {
      const [cf_query_title, RowID] = selectedOptionValue.split("-");
      const isAnySelectedOptionShortEmpty = rowsortQrt.some(
        (row) => !row.selectedOptionShort,
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
          RowId: RowID,
          rowsortQrtData: rowsortQrt,
        };

        
        try {
          const response = await httpCommon.post(
            "/insert_emp_list_prompt_save_data.php",
            combinedData,
          );
        
    

          const data  = response.data;
     


          const findRes = workReqFilterDpd.find((item)=> item.
          RowID === data.ROW_ID

          )

          console.log("findRes",findRes)

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
                RetriveDataQueryList();
                setRowsQrt([]);
                setselectedOptionValue("" );
                setSelectedOption(findRes?findRes.cf_query_title:"")
                setSavedQptions(findRes?findRes.cf_query_title:"")
               
                setRowsortQrt([]);
                setRowsort([]);
                setRows([]);
                setRefetch2(true);
                handleCloseWorkQryList();
              }
            });
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
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
    if (!formDataSv.queryName) {
      toast.error(`Please fill the required field: Query Name`, {
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
      if (formDataSv.queryName.trim() !== "") {
        const inputValue = formDataSv.queryName;
        const matchingOption = workReqFilterDpd.find(
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
          "/get_emp_filter_query_data.php?site_cd=" +
            site_ID +
            "&RowID=" +
            RowID,
        );
        console.log("response____fluter___", response);
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
      SITE_CD: site_ID,
      OWNER_ID: emp_owner,
      availability: "G",
    };

    try {
      const response = await httpCommon.post(
        "/insert_emp_save_as_query.php",
        combinedData,
      );

      console.log("response", response);
      if (response.data.status == "SUCCESS") {
        setTitleAstReg(response.data.Title);
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


  const handleClearButton = () => {
    // handleResetFilter();
    // if (inputRef.current) {
    //   inputRef.current.focus(); 
    // }
    inputRef.current.value = "";

    setTableData(savedQuery)
  };



  // Search Button Click funcation
  const handelSearchButton = async () => {
    const inputValueGet = inputRef.current.value;
  

    if (inputValueGet !== "" && inputValueGet !== null) {
 
      
      try {
        const response = await httpCommon.get(
          `/get_employee_search.php?site_cd=${site_ID}&searchTerm=${inputValueGet}&page=${currentPage}`,
        );

      
        
        if (response.data.status === "SUCCESS") {
         

          setTableSearchData(response.data.data);
          setTotalRow(response.data.total_count);

          // const filteredData = response.data.data.filter((item) => {
          //   const searchString = inputValueGet.toLowerCase();
          //   const emp_mst_name = (item.emp_mst_name || "").toLowerCase();
          //   const emp_mst_title = (item.emp_mst_title || "").toLowerCase();
          //   const emp_mst_status = (item.emp_mst_status || "").toLowerCase();
          //   const emp_mst_homephone = (
          //     item.emp_mst_homephone || ""
          //   ).toLowerCase();
          //   const emp_mst_emg_name = (
          //     item.emp_mst_emg_name || ""
          //   ).toLowerCase();
          //   const emp_mst_emg_phone = (
          //     item.emp_mst_emg_phone || ""
          //   ).toLowerCase();
          //   const emp_mst_empl_id = (item.emp_mst_empl_id || "").toLowerCase();
          //   const emp_mst_login_id = (
          //     item.emp_mst_login_id || ""
          //   ).toLowerCase();

          //   return (
          //     emp_mst_name.includes(searchString) ||
          //     emp_mst_title.includes(searchString) ||
          //     emp_mst_status.includes(searchString) ||
          //     emp_mst_homephone.includes(searchString) ||
          //     emp_mst_emg_name.includes(searchString) ||
          //     emp_mst_emg_phone.includes(searchString) ||
          //     emp_mst_empl_id.includes(searchString) ||
          //     emp_mst_login_id.includes(searchString)
          //   );
          // });
          Swal.fire({ title: "Please Wait!", allowOutsideClick: false });
          Swal.showLoading();
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
          



            
            // Check if RowID exists in tableData
            const isRowIDMatching = tableData.some(
              (tableItem) => tableItem.RowID === item.RowID
            );


            if(isRowIDMatching){
                 // Apply the filter based on search string and RowID match
              return (
                isRowIDMatching && tableData.length > 0 &&
                (emp_mst_name.includes(searchString) ||
                  emp_mst_title.includes(searchString) ||
                  emp_mst_status.includes(searchString) ||
                  emp_mst_homephone.includes(searchString) ||
                  emp_mst_emg_name.includes(searchString) ||
                  emp_mst_emg_phone.includes(searchString) ||
                  emp_mst_empl_id.includes(searchString) ||
                  emp_mst_login_id.includes(searchString))
              );
            }

          else if(tableData.length === 0){
            return (
              (emp_mst_name.includes(searchString) ||
                emp_mst_title.includes(searchString) ||
                emp_mst_status.includes(searchString) ||
                emp_mst_homephone.includes(searchString) ||
                emp_mst_emg_name.includes(searchString) ||
                emp_mst_emg_phone.includes(searchString) ||
                emp_mst_empl_id.includes(searchString) ||
                emp_mst_login_id.includes(searchString))
            );
          }
          });
        if(filteredData && filteredData.length > 0){
        setTableData(filteredData);
       setTotalRow(filteredData.length)
       Swal.close();
      }else {

      Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "No Record Found!",
    });
    }

          
          
          //   setCurrentPage(1);
          // Swal.close();
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

  // Approv and DisApprove funcation
  const handleShowApprove = (id, row) => {
    if (row.wkr_mst_wr_status === "A" || row.wkr_mst_wr_status === "D") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The record update cannot be done because the record had been updated by another user. Kindly retrieve the Work Request again to continue.",
      });
      return;
    } else {
      setRowId(row.RowID);
      setShowApprove(true);
    }
  };

  const onClickApprove = () => {
    if (selected_Status == 0 || selected_Status == null) {
      setErrorMessage("Please select a status.");
    } else {
      if (selected_Originator == 0 || selected_Originator == null) {
        setErrorMessage("Please Select the Originator.");
      } else {
        if (selected_WorkGroup == 0 || selected_WorkGroup == null) {
          setErrorMessage("Please Select the Work Group.");
        } else {
          if (Button_save == "Approve") {
            handleCloseApprove();
            WorkRequest_Approval();
          }
        }
      }
    }
  };

  //Approval
  const WorkRequest_Approval = async () => {
    let site_ID = localStorage.getItem("site_ID");
    let EmpID = localStorage.getItem("emp_mst_empl_id");
    let EmpName = localStorage.getItem("emp_mst_name");
    let LOGINID = localStorage.getItem("emp_mst_login_id");
    let Status, setStatus;
    if (selected_Status == "" || selected_Status == null) {
      setStatus = "";
    } else {
      Status = selected_Status.split(":");
      setStatus = Status[0];
    }

    //Select Assign To
    let Originator, setOriginator;
    if (selected_Originator == "" || selected_Originator == null) {
      setOriginator = "";
    } else {
      Originator = selected_Originator.label.split(":");
      setOriginator = Originator[0];
      console.log("Originator ", Originator[0]);
    }

    //Select Work Group
    let WorkGroup, setWorkGroup;
    if (selected_WorkGroup == "" || selected_WorkGroup == null) {
      setWorkGroup = "";
    } else {
      WorkGroup = selected_WorkGroup.label.split(":");
      setWorkGroup = WorkGroup[0];
      console.log("WorkGroup ", WorkGroup[0]);
    }
    var json_workrequest = {
      site_cd: site_ID,
      wko_mst_status: setStatus.trim(),
      wkr_mst_originator: setOriginator.trim(),
      wkr_mst_work_group: setWorkGroup.trim(),

      RowID: rowId,
      EmpID: EmpID,
      EmpName: EmpName,
      LOGINID: LOGINID,
    };

    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    try {
      const responseJson = await httpCommon.post(
        "/insert_work_request_approval.php",
        JSON.stringify(json_workrequest),
      );

      if (responseJson.data.status === "SUCCESS") {
        Swal.close();

        Swal.fire({
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
          title: responseJson.data.status,
          text: responseJson.data.message,
        }).then(() => {
          navigate(`/dashboard/people`);
        });
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data,
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_WorkRequest_select...",
        text: error,
      });
    }
  };

  // DisApprov funcation
  const handleShowDisapprove = (row) => {
    if (row.wkr_mst_wr_status === "D" || row.wkr_mst_wr_status === "A") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The record update cannot be done because the record had been updated by another user. Kindly retrieve the Work Request again to continue.",
      });
      return;
    }
    setRowId(row.RowID);
    setShowDisapprove(true);
  };
  const onClickDisapprove = () => {
    if (RejectedDescription == "") {
      setErrorMessage("Please Enter the Rejected Description.");
    } else {
      handleCloseDisapprove();
      WorkRequest_Disapproval();
      console.log("Disapprove button clicked here!");
    }
  };
  //Disapproval
  const WorkRequest_Disapproval = async () => {
    let site_ID = localStorage.getItem("site_ID");

    let EmpID = localStorage.getItem("emp_mst_empl_id");

    let EmpName = localStorage.getItem("emp_mst_name");
    let LOGINID = localStorage.getItem("emp_mst_login_id");

    //Select Reject Date
    let date_of_reject = "";
    if (RejectDate == "" || RejectDate == null) {
      date_of_reject = "";
    } else {
      date_of_reject = Moment(RejectDate).format("yyyy-MM-DD HH:mm:ss").trim();
    }

    var json_workrequest = {
      site_cd: site_ID,
      wkr_det_reject_by: LOGINID,
      wkr_det_reject_desc: RejectedDescription.trim(),
      wkr_det_reject_date: date_of_reject,

      RowID: rowId,
      EmpID: EmpID,
      EmpName: EmpName,
      LOGINID: LOGINID,
    };
    console.log("json_workrequest_____disapprove", json_workrequest);

    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    try {
      const responseJson = await httpCommon.post(
        "/insert_work_request_disapproval.php",
        JSON.stringify(json_workrequest),
      );
      if (responseJson.data.status === "SUCCESS") {
        Swal.close();

        Swal.fire({
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
          title: responseJson.data.status,
          text: responseJson.data.message,
        }).then(() => {
          navigate(`/dashboard/work/list`);
        });
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data,
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_WorkRequest_select...",
        text: error,
      });
    }
  };
 
  return (
    <>
      <Helmet>
        <title>Employe List</title>
        <meta name="description" content="Employe List" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>

      <TemplateDialog open={template} handleClose={handleCloseTemplate} />
     
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
            heading="Employee List"
            links={[]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
  

              <Button
                component={RouterLink}
                variant="contained"
                className="AddNewButton"
                startIcon={<Iconify icon="mingcute:add-line" />}
                to={{
                  pathname: "/dashboard/people/employe-new",
                  state: { select: "New_WorkRequest" },
                }}
                sx={{width:"100px"}}
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
               
                
                <InputLabel id="select-label" className={(TitleAstReg!== "" || selectedOption)? "selectedcss" : ""}>Select an Query</InputLabel>


                <Select
                  labelId="select-label"
                  id="select"
                  value={TitleAstReg !== "" ? TitleAstReg : selectedOption}
                  onChange={handleOptionChange}
                  sx={{ textTransform: "capitalize" }}
                >
                  {workReqFilterDpd.map((item) => (
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
                  className={`ListDataRefBtn ${tableData.length == 0 ? "disabled" : ""}`}
                  onClick={() => {
                    setRefresh(true)
                  }}
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
                    onKeyDown={(e)=>{
                      
                      if (e.key === 'Enter') {
                        handelSearchButton();
                      }
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {search && (
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
                            <TableCell
                              colSpan={numberOfColumns}
                              sx={{
                                height: 150, 
                                  textAlign: 'center',  
                                  verticalAlign: 'middle', 
                                  padding: 5, 
                              }}
                            >
                            < TableNoData notFound={tableData && tableData.length === 0 ?true:false} />
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {dataFiltered.map((row,index) => (
                              index < RowPerPage && (
                              <EmployeRow
                        
                                key={row.id}
                                row={row}
                                setRefetch={setRefetch}
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
                                onDisApprove={() => handleShowDisapprove(row)}
                                onApprove={() =>
                                  handleShowApprove(row.mst_RowID, row)
                                }
                                //  onViewRow={() => handleViewRow(row.id)}
                                //   onCompleteRow={() => handleCompleteRow(row.col71)}
                                //  onCloseRow={() => handleCloseRow(row.col71)}
                              />
                            )
                            ))}
                          </>
                        )}
                      </>
                    )}
                    <TableEmptyRows
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        tableData &&  tableData.length?tableData.length:0,
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
              //  onRowsPerPageChange={table.onChangeRowsPerPage}
              onRowsPerPageChange={(rowsPerPage) => {
                setRowperPage(rowsPerPage.target.value);
                console.log("rowsPerPage",rowsPerPage)
                table.onChangeRowsPerPage(rowsPerPage);
              }}
              // dense={table.dense}
              //  onChangeDense={table.onChangeDense}
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

                      {/* opertaor */}

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

                      {/* promt checkbox */}
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

                      {/* value field */}
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
                  {workReqFilterDpd.map((option, index) => (
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
          <Button color="primary" onClick={handleCFQrySave}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {/* =============================== filter model Query List Button  =================================  */}

      {/* Query List modal */}

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
          <span style={{ marginLeft: "2px" }}>Query List</span>
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
                <Button variant="outlined" onClick={DeleteAssetRegQryList}>
                  <Iconify icon="fluent:delete-48-regular" /> Delete
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveWorkOrderQryList}>
                  <Iconify icon="ic:outline-save-as" /> Save
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={SaveAsworkorderTbl}>
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
                        // onChange={handleClickOption}
                        onChange={(event) =>
                          handleClickOption(event.target.value)
                        }
                        sx={{ textTransform: "capitalize" }}
                      >
                        {workReqFilterDpd.map((item) => (
                          <MenuItem
                            key={item.RowID}
                            value={`${item.cf_query_title}-${item.RowID}`}
                          >
                            {item.cf_query_title}
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
                            {/* Bracket */}
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
                            {/* Selected options */}
                            <td style={{ width: "25%" }}>
                              <Select
                                style={{ width: "100%" }}
                                className={`custom-Astselect ${
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
                                className="custom-Astselect"
                                value={row.operator || "Like"}
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
                                    event.target.value,
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
                  {workReqFilterDpd.map((option, index) => (
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
        {/* <ToastContainer /> */}
      </BootstrapDialog>

      {/******************** Approve Work Request ********************/}
      <BootstrapDialog
        onClose={handleCloseApprove}
        aria-labelledby="customized-dialog-title"
        open={showApprove}
        maxWidth="md"
        fullWidth
        className="approveModel"
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Approve Work Request</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseApprove}
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                <FormControlLabel
                  control={<div />} // Empty control to avoid rendering checkbox or radio button
                  label="Status:"
                />
              </Grid>
              <Grid item xs={8}>
                {Status.map((status) => (
                  <FormControlLabel
                    key={status.value}
                    value={status.value}
                    control={<Radio />}
                    label={status.label}
                    checked={selected_Status === status.value}
                    onChange={(e) => {
                      setSelected_Status(e.target.value);
                      setErrorMessage("");
                    }}
                  />
                ))}
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                <FormControlLabel
                  control={<div />} // Empty control to avoid rendering checkbox or radio button
                  label="Assign to:"
                />
              </Grid>
              <Grid item xs={8}>
                <Autocomplete
                  options={Originator}
                  defaultValue={selected_Originator}
                  onChange={(event, value) => {
                    setSelected_Originator(value);
                    setErrorMessage("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select..."
                      variant="outlined"
                      fullWidth // Ensure the TextField takes up full width
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                <FormControlLabel
                  control={<div />} // Empty control to avoid rendering checkbox or radio button
                  label="Work Group:"
                />
              </Grid>
              <Grid item xs={8}>
                <Autocomplete
                  options={WorkGroup}
                  defaultValue={selected_WorkGroup}
                  onChange={(event, value) => {
                    setSelected_WorkGroup(value);
                    setErrorMessage("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select..."
                      variant="outlined"
                      fullWidth // Ensure the TextField takes up full width
                    />
                  )}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Grid item>
            <Button variant="outlined" onClick={onClickApprove}>
          
              <Iconify icon="mingcute:save-line" /> Approve
            </Button>
          </Grid> */}
          <Grid container spacing={2} alignItems="center">
            {errorMessage && (
              <Grid item>
                <div style={{ color: "red", marginRight: "10px" }}>
                  {errorMessage}
                </div>
              </Grid>
            )}
            <Grid item>
              <Button variant="outlined" onClick={onClickApprove}>
                <Iconify icon="mingcute:save-line" /> Approve
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </BootstrapDialog>
      {/******************** Disapprove Work Request ********************/}
      <BootstrapDialog
        onClose={handleCloseDisapprove}
        aria-labelledby="customized-dialog-title"
        open={showDisapprove}
        maxWidth="md"
        fullWidth
        className="approveModel"
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify icon="material-symbols-light:file-save-sharp" />
          <span style={{ marginLeft: "2px" }}>Disapprove Work Request</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseDisapprove}
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                <FormControlLabel
                  control={<div />} // Empty control to avoid rendering checkbox or radio button
                  label="Reject By:"
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="outlined-basic"
                  size="small"
                  variant="outlined"
                  className="Extrasize"
                  fullWidth
                  defaultValue={AuditUser}
                  disabled
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                <FormControlLabel
                  control={<div />} // Empty control to avoid rendering checkbox or radio button
                  label="Reject Date:"
                />
              </Grid>
              <Grid item xs={8}>
                <DateTimePicker
                  value={RejectDate}
                  format="dd/MM/yyyy HH:mm"
                  className="Extrasize"
                  onChange={(newDate) => {
                    setRejectDate(newDate); // Update your state with the new value
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} sx={{ pl: 2 }}>
                <FormControlLabel
                  control={<div />} // Empty control to avoid rendering checkbox or radio button
                  label="Rejected Description:"
                />
              </Grid>
              <Grid item xs={8}>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder=""
                  style={{ width: "100%" }}
                  minRows={6.5}
                  defaultValue={RejectedDescription}
                  onChange={(e) => {
                    setRejectedDescription(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Grid item>
            <Button variant="outlined" onClick={onClickApprove}>
          
              <Iconify icon="mingcute:save-line" /> Approve
            </Button>
          </Grid> */}
          <Grid container spacing={2} alignItems="center">
            {errorMessage && (
              <Grid item>
                <div style={{ color: "red", marginRight: "10px" }}>
                  {errorMessage}
                </div>
              </Grid>
            )}
            <Grid item>
              <Button variant="outlined" onClick={onClickDisapprove}>
                <Iconify icon="mingcute:save-line" /> Disapprove
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </BootstrapDialog>

      <EmployeIdPromt
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
