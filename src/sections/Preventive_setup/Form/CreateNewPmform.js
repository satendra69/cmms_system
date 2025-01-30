import PropTypes from "prop-types";
import React, { useState, useEffect, useRef,useCallback } from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
// @bootstrap

import TextareaAutosize from "@mui/material/TextareaAutosize";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from '@mui/material/Table';

import TableRow from "@mui/material/TableRow";
import TableBody from '@mui/material/TableBody';
import TableCell from "@mui/material/TableCell";
import { makeStyles } from '@material-ui/core/styles';
import IconButton from "@mui/material/IconButton";
import { ConfigProvider, DatePicker as AntDatePicker } from 'antd';

import dayjs from 'dayjs';
import 'antd/dist/reset.css';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
// import CloseIcon from '@mui/icons-material/Close';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Unstable_Grid2";

import Checkbox from "@mui/material/Checkbox";
import { useLocation, useNavigate } from "react-router-dom";

// Toastfy
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "moment";
import "moment-timezone";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
// utils

// routes
import { RouterLink } from "src/routes/components";

import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Avatar, Badge } from '@mui/material'


// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";
import refrencImg from "../../../assets/img/specification.png";
// import WorkOrderAssetNo from "../WorkOrderAssetNo";
import Tooltip from "@mui/material/Tooltip";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import GetAssetList from "../PopupModel/GetAssetList";



import { color } from "framer-motion";
import { event } from "jquery";
import FrequencyCodeList from "../PopupModel/FrequencyCodeList";
import AllPlanningModule from "../component_module/Planning/AllPlanningModule"
import { useSwalCloseContext } from "src/sections/ContextApi/WorkOrder/SwalCloseContext";
import PmCheckList2 from "../component_module/Check_list/PmCheckList2"

//import WorkOrderSpecialOrder from "../component_module/Planning/WorkOrderSpecialOrder";
const MySwal = withReactContent(Swal);
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const StepContainer = styled("div")`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  position: relative;
  :before {
    content: "";
    position: absolute;
    background: #4694d1;
    height: 90%;
    width: 2px;
    top: 50%;
    transform: translateY(-50%);
    left: 15px;
  }
  :after {
    content: "";
    position: absolute;
    background: #f3e7f3;
    height: ${({ width }) => width};
    width: 2px;
    top: 45%;
    transition: 0.4s ease;
    transform: translateY(-50%);
    left: 14px;
  }
`;

const useStyles = makeStyles((theme) => ({

  tableCell: {
    width: '20%', // Set the width of TableCell to 33% of its container
    padding: '8px', // Adjust padding as needed
  },

  circle: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft:10,

  },

  woBadge: {
    color: 'white',
    padding: '4px 8px',
    borderRadius: 4,
    display: 'inline-block',
    marginTop: 4,
  },
  greyBadge: {
    backgroundColor: '#c4c4c4', // Grey background
  },
  greenBadge: {
    backgroundColor: '#4CAF50', // Green background
  },

}));
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    borderRadius: '50%',
    height: '14px',
    width: '14px'
  },
}));
// ----------------------------------------------------------------------

export default function CreateNewPmform ({ currentUser, onPageChange }) {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");
  const {swalCloseTime} = useSwalCloseContext();

  const location = useLocation();
  
  const state = location.state || {};

  const { RowID, PM_no, currentPage, selectedOption } = state || {};

  const { completeRowID } = location.state || {};
  const { closeRowID } = location.state || {};

  const [loading, setLoading] = useState(true);

  const [PmMstLabel, setPmMstLabel] = useState([]);
  const [PmdetLabel, setPmdetLabel] = useState([]);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const settings = useSettingsContext();

  const classes = useStyles();

  const currentDate = new Date();
  const formattedDateTime = currentDate.toISOString().slice(0, 16);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImages2, setSelectedImages2] = useState([]);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedPdfFiles, setSelectedPdfFiles] = useState([]);
  const [RefImg, setRefImg] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [getDbImg, setDbImg] = useState();
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [removedRefItems, setRemovedRefItems] = useState([]);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [imageSelect, setImageSelect] = useState({ name: "", path: "" });
  const [Tabvalue, setTabValue] = useState(0);

  const [imguploadStatus, setImguploadStatus] = useState("");
  const [imguploadRefStatus, setImguploadRefStatus] = useState("");

  const [showdd, setShowdd] = useState(false);
  const [handalImg, sethandalImg] = useState({});
  const handleClosedd = () => setShowdd(false);
  const [showdd2, setShowdd2] = useState(false);
  const handleClosedd2 = () => setShowdd2(false);


  const [TotalAssetNo, setTotalAssetNo] = useState(0);
  const [TotalSearch, setTotalSearch] = useState("");
  const [viewedTotlRows, setViewedTotlRows] = useState(0);
  const [CurrentWorkOrder, setCurrentWorkOrder] = useState("");

  // form filed state
  const [AssetNo, setAssetNo] = useState("");


// New State added by stya 

const [Pm_type, setPm_type] = useState([{label:'Asset',value:'Asset'},{label:'Group',value:'Group'}]); 
const [selected_PmType, setselected_PmType] = useState(Pm_type[0]);

const [pmGroupAllData, setPmGroupAllData] = useState([]);
const [pmGroup, setPmGroup] = useState([]);
const [selected_pmGroup, setSelected_pmGroup] = useState([]);

const [Asset_No, setAsset_No] = useState("");

const [FrequencyCodeAllData, setFrequencyCodeAllData] = useState([]);
const [FrequencyCode, setFrequencyCode] = useState([]);
const [selected_FrequencyCode, setSelected_FrequencyCode] = useState([]);

const [Short_Description, setShort_Description] = useState("");

const [isCheckedFlag, setIsCheckedFlag] = useState(false); 

const [isCheckedPmDate, setIsCheckedPmDate] = useState(false);
const [LPMDate, setLPMDate] = useState(new Date());
const [NextCreateDate, setNextCreateDate] = useState("");

const [Charge_Cost_Center, setCharge_Cost_Center] = useState([]);
const [selected_Charge_Cost_Center, setSelected_Charge_Cost_Center] =
  useState([]);

const [isCheckedLoop, setIsCheckedLoop] = useState(false);
const [isCheckedAutoGen, setIsCheckedAutoGen] = useState(false);
const [LPMClosedDate, setLPMClosedDate] = useState(new Date());
const [NextDueSate, setNextDueDate] = useState("");
const [LeadDay, setLeadDay] = useState("3");

const [Status, setStatus] = useState([]);
const [selected_Status, setSelected_Status] = useState([]);


const [PlanPriority, setPlanPriority] = useState([]);
const [selected_PlanPriority, setSelected_PlanPriority] = useState([]);

const [Pm_workType, setPm_workType] = useState([]);
const [selected_Pm_workType, setSelected_Pm_workType] = useState([]);

const [Pm_workClass, setPm_workClass] = useState([]);
const [selected_Pm_workClass, setSelected_Pm_workClass] = useState([]);

const [WorkGroup, setWorkGroup] = useState([]);
const [selected_WorkGroup, setSelected_WorkGroup] = useState([]);

const [Project_Id, setProject_Id] = useState([]); 
const [selected_Project_Id, setSelected_Project_Id] = useState([]);

const [isCheckedSafty, setIsCheckedSafty] = useState(false); 
const [Note_desc, setNote_desc] = useState("");

const [Work_Area, setWork_Area] = useState([]);
const [selected_Work_Area, setSelected_Work_Area] = useState([]);

const [PmAssetLevel, setPmAssetLevel] = useState([]); 
const [selected_PmAssetLevel, setSelected_PmAssetLevel] = useState([]);

const [AssetLocation, setAssetLocation] = useState("");
const [workLocation, setWorkLocation] = useState("");

const [FaultCode ,setFaultCode] = useState([]);
const [selected_FaultCode, setselected_FaultCode] = useState([]);

const [PmCaseCode, setPmCaseCode] = useState([]);
const [selected_PmCaseCode,setSelected_PmCaseCode] = useState([]);

const [Action_Code,setAction_code] = useState([]);
const [selectedAction_Code,setSelectedAction_Code] = useState([]); 

const [PmCustomerCode,setPmCustomerCode] = useState([]);
const [selected_CustomerCode,setSelected_CustomerCode] = useState([]);

const [Assign_To, setAssign_To] = useState([]);
const [selected_Assign_To, setSelected_Assign_To] = useState([]);

const [Originator,setOriginator] = useState([]);
const [selected_Originator,setSelected_Originator] = useState([]);

const [selected_Approver,setSelect_Approver] = useState([]);

const [MeterId,setMeterId] = useState([]);      
const [selected_MeterId,setSelected_MeterId] = useState([]);  
const [LpmUsage, setPmLPMUsage] = useState("0.00");

const [PmLPMUOM, setPmLPMUOM] = useState([]);
const [selected_PmLPMUOM, setselected_PmLPMUOM] = useState([]);

const [selected_creadit_cost_center, setSelected_creadit_cost_center] =useState([]);

const [Labor_Account, setLabor_Account] = useState([]); 
const [selected_Labor_Account, setSelected_Labor_Account] = useState([]);

const [selected_Contract_Account, setSelected_Contract_Account] = useState(
    []
  );

  const [UDFText_1, setUDFText_1] = useState("");
  const [UDFText_2, setUDFText_2] = useState("");
  const [UDFText_3, setUDFText_3] = useState("");
  const [UDFText_4, setUDFText_4] = useState("");
  const [UDFText_5, setUDFText_5] = useState("");
  const [UDFText_6, setUDFText_6] = useState("");
  const [UDFText_7, setUDFText_7] = useState("");
  const [UDFText_8, setUDFText_8] = useState("");
  const [UDFText_9, setUDFText_9] = useState("");
  const [UDFText_10, setUDFText_10] = useState("");
  const [UDFText_11, setUDFText_11] = useState("");
  const [UDFText_12, setUDFText_12] = useState("");
  const [UDFText_13, setUDFText_13] = useState("");
  const [UDFText_14, setUDFText_14] = useState("");
  const [UDFText_15, setUDFText_15] = useState("");
  const [UDFText_16, setUDFText_16] = useState("");
  const [UDFText_17, setUDFText_17] = useState("");
  const [UDFText_18, setUDFText_18] = useState("");
  const [UDFText_19, setUDFText_19] = useState("");
  const [UDFText_20, setUDFText_20] = useState("");

  const [UDFNumber_1, setUDFNumber_1] = useState();
  const [UDFNumber_2, setUDFNumber_2] = useState();
  const [UDFNumber_3, setUDFNumber_3] = useState();
  const [UDFNumber_4, setUDFNumber_4] = useState();
  const [UDFNumber_5, setUDFNumber_5] = useState();
  const [UDFNumber_6, setUDFNumber_6] = useState();
  const [UDFNumber_7, setUDFNumber_7] = useState();
  const [UDFNumber_8, setUDFNumber_8] = useState();
  const [UDFNumber_9, setUDFNumber_9] = useState();
  const [UDFNumber_10, setUDFNumber_10] = useState();

  const [UDFDate_1, setUDFDate_1] = useState("");
  const [UDFDate_2, setUDFDate_2] = useState("");
  const [UDFDate_3, setUDFDate_3] = useState("");
  const [UDFDate_4, setUDFDate_4] = useState("");
  const [UDFDate_5, setUDFDate_5] = useState("");
  const [UDFDate_6, setUDFDate_6] = useState("");
  const [UDFDate_7, setUDFDate_7] = useState("");
  const [UDFDate_8, setUDFDate_8] = useState("");
  const [UDFDate_9, setUDFDate_9] = useState("");
  const [UDFDate_10, setUDFDate_10] = useState("");

  
  {/*------------------- */}

const [modalOpenAsset, setModalOpenAsset] = useState(false);
const [modalOpenAssetCustomerCode, setModalOpenAssetCustomerCode] = useState(false);

const [modalOpenFrequency, setModalOpenFrequency] = useState(false);
const [isPopupOpening, setIsPopupOpening] = useState(false);


// End -----staya close code

const [Asset_CriFactor, setAsset_CriFactor] = useState([]); 

  const [Asset_Type, setAsset_Type] = useState([]); 

  const [Asset_Code, setAsset_Code] = useState([]); 

  const [Asset_Group_Code, setAsset_Group_Code] = useState([]);
 
  const [Asset_Location, setAsset_Location] = useState([]); 
  
  const [Asset_Level, setAsset_Level] = useState([]);

  const [Work_Group, setWork_Group] = useState([]);


  const [CustomerCode, setCustomerCode] = useState("");

  const [selected_Material_Account, setSelected_Material_Account] = useState(
    []
  );
  
  const [selected_Depreciation_Method, setSelectedDepreciationMethod] = useState([]);

  const [isAssetShortDescEmpty,setIsAssetShortDescEmpty] = useState(false);
 
  const [Plan_Priority, setPlan_Priority] = useState([]);
 
  const [selected_Plan_Priority, setSelected_Plan_Priority] = useState([]);


  const [Fault_Code, setFault_Code] = useState([]);
  const [selected_Fault_Code, setSelected_Fault_Code] = useState([]);
  const [Asset_Status, setAsset_Status] = useState([]);


  const [Supervisor_ID, setSupervisor_ID] = useState([]);


  const [Asset_Laboraccount, setAsset_Laboraccount] = useState([]); 
  


  const [WorkOrderNo, setWorkOrderNo] = useState("");
  
  const [selected_Asset_Status, setSelected_Asset_Status] = useState([]);
  const [selected_Asset_Group_Code, setSelected_Asset_Group_Code] = useState(
    []
  );
 
  const [Phone, setPhone] = useState("");
  const [OriginationDate, setOriginationDate] = useState(new Date());
  const [DueDate, setDueDate] = useState(new Date());
  const [CorrectiveAction, setCorrectiveAction] = useState("");
  const [selected_Original_Periority, setSelected_Original_Periority] =
    useState([]);
  const [selected_Cause_Code, setSelected_Cause_Code] = useState([]);
  const [ScheduleDate, setScheduleDate] = useState();
  const [selected_Action_Code, setSelected_Action_Code] = useState([]);
  const [ExceptionDate, setExceptionDate] = useState();
  const [selected_Delay_Code, setSelected_Delay_Code] = useState([]);
  const [StatusChangeDate, setStatusChangeDate] = useState();
 

  const [selected_Work_Type, setSelected_Work_Type] = useState([]);
  const [CompletionDate, setCompletionDate] = useState();
  const [CompletionDate2, setCompletionDate2] = useState(new Date());

  const [selected_Work_Class, setSelected_Work_Class] = useState([]);
  const [CloseDate, setCloseDate] = useState();
  const [CloseDate2, setCloseDate2] = useState(new Date());
  const [selected_Supervisor_ID, setSelected_Supervisor_ID] = useState([]);
  const [Planner, setPlanner] = useState([]);
  const [selected_Planner, setSelected_Planner] = useState([]);

  const [Approver, setApprover] = useState([]);
  


  const [Temporary_Asset, setTemporary_Asset] = useState(false);
  const [CheckBox_Temporary_Asset, setCheckBox_Temporary_Asset] = useState("0");

  const [Approved, setApproved] = useState(false);
  const [CheckBox_Approved, setCheckBox_Approved] = useState("0");

  const [Safety, setSafety] = useState(false);
  const [CheckBox_Safety, setCheckBox_Safety] = useState("0");



  const [Credit_Cost_Center, setCredit_Cost_Center] = useState([]);
  const [selected_Credit_Cost_Center, setSelected_Credit_Cost_Center] =
    useState([]);

  const [Columns, setColumns] = useState([]);
  const [Data, setData] = useState([]);
  const [AutoNumring, setAutoNumring] = useState("");

  const [UDFNote1, setUDFNote1] = useState("");


  const [Button_save, setButton_save] = useState("");
  const [getDbImgRowId, setDbImgRowId] = useState("");

  const [steps, setsteps] = useState([]);
  const StatushandleClose = () => setStatusShow(false);

  const [StatusShow, setStatusShow] = useState(false);

  const [message, setMessage] = useState("");
  const [imageComment, setimageComment] = useState(null);
  const messageRef = useRef(null);
  const [AllCommnet, setAllComment] = useState([]);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef2 = useRef(null);
  const [selectedImageCommnt, setSelectedImageCommnt] = useState(null);

  const [uploadImgShow, setUploadImgShow] = useState(false);
  const UploadImghandleClose = () => setUploadImgShow(false);
  const chatContainerRef = useRef(null);
  const [isFiledValueEmpty, setIsFiledValueEmpty] = useState(false);
 
  const [isChargeCostEmpty, setIsChargeCostEmpty] = useState(false);
  const [isFaultCodeEmpty, setIsFaultCodeEmpty] = useState(false);
  const [isOriginalPeriorityEmpty, setIsOriginalPeriorityEmpty] =
    useState(false);
  const [isWorkTypeEmpty, setIsWorkTypeEmpty] = useState(false);
  
  const [isOpenWork, setIsOpenWork] = useState(true);
  const [isOpenAsset, setIsOpenAsset] = useState(true);
  const [isOpenWorkActivity, setIsOpenWorkActivity] = useState(true);
  const [isOpenAssetMeter,setIsOpenAssetMeter] = useState(true);
  const [isOpenCostCenter,setIsOpenCostCenter] = useState(true);
  const [isOpenUdfText,setIsOpenUdfText] = useState(false);
  const [isOpenUdfNumeric,setIsOpenUdfNumeric] = useState(false);
  const [isOpenUdfDateTime,setIsOpenUdfDateTime] = useState(false);

  const autocompleteRef = useRef(null);
  const assetNoAutocompleteRef = useRef(null);
  const frequencyCodecompleteRef = useRef(null);
  const CustomerCodeRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [PMSetupShow, setPMSetupShow] = useState(false);
  const PMSetuphandleClose = () => setPMSetupShow(false);
  const PMSetuphandleShow = () => setPMSetupShow(true);

  const [WOHistoryShow, setWOHistoryShow] = useState(false);
  const WOHistoryhandleClose = () => setWOHistoryShow(false);
  const WOHistoryhandleShow = () => setWOHistoryShow(true);

  const [RelocationHistoryShow, setRelocationHistoryShow] = useState(false);
  const RelocationHistoryhandleClose = () => setRelocationHistoryShow(false);
  const RelocationHistoryhandleShow = () => setRelocationHistoryShow(true);

  const [CheckListShow, setCheckListShow] = useState(false);
  const CheckListhandleClose = () => setCheckListShow(false);
  const CheckListhandleShow = () => setCheckListShow(true);
  const [modalOpenAssign, setModalOpenAssign] = useState(false);
  const [assignEmp,setEmpAssign] = useState([]);

  const [AssignStatusShow, setAssignStatusShow] = useState(false);
  const AssignStatushandleClose = () => setAssignStatusShow(false);
  const [AssignStatusToOther, setAssignStatusOther] = useState([]);

  const [PmMandatoryFiled, setPmMandatoryFiled] = useState([]);
  const [errorField, setErrorField] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [progress, setProgress] = useState(0);
  const [isFormFiled, setIsFormFiled] = useState(false);

  const [isPmTypeStatusEmpty, setIsPmTypeStatusEmpty] = useState(false);
  const [isAssetNoEmpty, setIsAssetNoEmpty] = useState(false);
  const [isFrequencyCodeEmpty, setIsFrequencyCodeEmpty] = useState(false);
  const [isDescriptionEmpty,setIsDescriptionEmpty] = useState(false);
  const [isAssetCostCenterEmpty,setIsAssetCostCenterEmpty] = useState(false);
  const [isDefaultStatusEmpty,setIsDefaultStatusEmpty] = useState(false);
  const [isPlanPriorityEmpty, setIsPlanPriorityEmpty] = useState(false);
  const [isWorkGroupEmpty, setIsWorkGroupEmpty] = useState(false);
  const [dueDateIncrementSet,setdueDateIncrement] = useState("");

  /*   new state added by satya  */

  useEffect(() => {
    async function fetchData() {
      if (RowID && PM_no) {

        setButton_save("Update");
        await get_Pm_Edit_formData();
        await fetchStatusData();
        await getPMFormLebel();
        await getPMMandatoryfiled();
        await getPmGroupData();
      } else {
        await getPMFormLebel();
        await getPMMandatoryfiled();
        await fetchStatusData();
        await getPmGroupData();
      //  await fetchStusPriortyData();
        setButton_save("Save");
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // test funcation

  // Get All Filed label Name
  const getPMFormLebel = async () => {
    try {
      const response = await httpCommon.get("/get_pm_form_lebal.php");
      // console.log("response____getLabel",response);
      if (response.data.status === "SUCCESS") {
        setPmMstLabel(response.data.data.prm_mst);
        setPmdetLabel(response.data.data.prm_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPMMandatoryfiled = async () => {
    
    try {
      const response = await httpCommon.get(
        "/get_pm_mandatoryFiled.php"
      );
    //  console.log("response____Mandatoryfiled",response);
      if (response.data.data.MandatoryField.length > 0) {
        setPmMandatoryFiled(response.data.data.MandatoryField);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const get_Pm_Edit_formData = async () => {
  
    try {
      
      const response = await httpCommon.get(
        "/get_pm_edit_form_data.php?RowID=" + RowID
      );
     // console.log("Get_Edit form Data", response);
      if (response.data.status === "SUCCESS" && Array.isArray(response.data.data) && response.data.data.length > 0) {

        const formatNumber = (number) => {
          if (number == null) {
            return '';
          }
        
          let [integerPart, decimalPart] = number.toString().split('.');
          integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
        
          return `${integerPart}.${decimalPart}`;
        };

        if(response.data.data[0].prm_mst_type === "A"){
          setselected_PmType({
            label: "Asset"
          });
        }else{

        }
      
        setAsset_No(response.data.data["0"].prm_mst_assetno + " : " + response.data.data["0"].prm_mst_assetno_desc);
      
        if(response.data.data[0].prm_mst_freq_code === "" && response.data.data[0].prm_mst_freq_code === null)
          {
            setSelected_FrequencyCode({ label: "" });
          }else{
            setSelected_FrequencyCode({ label: response.data.data["0"].prm_mst_freq_code  + " : " + response.data.data["0"].prm_mst_freq_code_desc });
          }


        setShort_Description(response.data.data["0"].prm_mst_desc);
        setIsCheckedFlag(response.data.data["0"].prm_mst_disable_flag === "1");
        setIsCheckedPmDate(response.data.data["0"].prm_mst_cal_startdate === "1");
        setCurrentWorkOrder(response.data.data["0"].prm_mst_curr_wo);
        if (response.data.data["0"].prm_mst_lpm_date == null) {
          setLPMDate("");
        } else {
          const apiDate = response.data.data["0"].prm_mst_lpm_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setLPMDate(formattedDate);
        }

        if (response.data.data["0"].prm_mst_next_create == null) {
          setNextCreateDate("");
        } else {
          const apiDate = response.data.data["0"].prm_mst_next_create.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setNextCreateDate(formattedDate);
        }
       // setShort_Description(response.data.data["0"].ast_mst_asset_shortdesc);
       if(response.data.data[0].prm_det_chg_costcenter === "" && response.data.data[0].prm_det_chg_costcenter === null)
        {
          setSelected_Charge_Cost_Center({ label: "" });
        }else{
          setSelected_Charge_Cost_Center({ label: response.data.data["0"].prm_det_chg_costcenter + " : " + response.data.data["0"].prm_det_chg_costcenter_desc});
        }

       setIsCheckedLoop(response.data.data["0"].prm_mst_closed_loop === "1");
       setIsCheckedAutoGen(response.data.data["0"].prm_mst_auto_gen === "1");

       if (response.data.data["0"].prm_mst_lpm_closed_date == null) {
        setLPMClosedDate("");
      } else {
        const apiDate = response.data.data["0"].prm_mst_lpm_closed_date.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setLPMClosedDate(formattedDate);
      }

      if (response.data.data["0"].prm_mst_next_due == null) {
        setNextDueDate("");
      } else {
        const apiDate = response.data.data["0"].prm_mst_next_due.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setNextDueDate(formattedDate);
      }
        setLeadDay(response.data.data["0"].prm_mst_lead_day);
      
        if(response.data.data["0"].prm_mst_dflt_status === "" && response.data.data["0"].prm_mst_dflt_status === null)
          {
            setSelected_Status({ label: "" });
          }else{
            setSelected_Status({ label: response.data.data["0"].prm_mst_dflt_status + " : " + response.data.data["0"].prm_mst_dflt_status_desc});
          }
        if(response.data.data["0"].prm_ls7_emp_id === "" || response.data.data["0"].prm_ls7_emp_id === null || response.data.data["0"].prm_ls7_emp_id === "null")
          {
            setSelected_Assign_To({ label: "" });
          }else{
            setSelected_Assign_To({ label: response.data.data["0"].prm_ls7_emp_id + " : " + response.data.data["0"].prm_ls7_emp_id_desc});
          }
          

        if(response.data.data["0"].prm_mst_plan_priority === "" || response.data.data["0"].prm_mst_plan_priority === null || response.data.data["0"].prm_mst_plan_priority === "null")
          {
            setSelected_PlanPriority({ label: "" });
          }else{
            setSelected_PlanPriority({ label: response.data.data["0"].prm_mst_plan_priority + " : " + response.data.data["0"].prm_mst_plan_priority_desc});
          }

        if(response.data.data["0"].prm_det_work_class === "" || response.data.data["0"].prm_det_work_class === null || response.data.data["0"].prm_det_work_class === "null")
          {
            setSelected_Pm_workClass({ label: "" });
          }else{
            setSelected_Pm_workClass({ label: response.data.data["0"].prm_det_work_class + " : " + response.data.data["0"].prm_det_work_class_desc});
          }

          if(response.data.data["0"].prm_det_planner === "" || response.data.data["0"].prm_det_planner === null || response.data.data["0"].prm_det_planner === "null")
            {
              setSelected_Planner({ label: "" });
            }else{
              setSelected_Planner({ label: response.data.data["0"].prm_det_planner + " : " + response.data.data["0"].prm_det_planner_desc});
            }

        if(response.data.data["0"].prm_det_work_type === "" || response.data.data["0"].prm_det_work_type === null || response.data.data["0"].prm_det_work_type === "null")
          {
            setSelected_Pm_workType({ label: "" });
          }else{
            setSelected_Pm_workType({ label: response.data.data["0"].prm_det_work_type + " : " + response.data.data["0"].prm_det_work_type_desc});
        }

        if(response.data.data["0"].prm_det_work_grp === "" || response.data.data["0"].prm_det_work_grp === null || response.data.data["0"].prm_det_work_grp === "null")
          {
            setSelected_WorkGroup({ label: "" });
          }else{
            setSelected_WorkGroup({ label: response.data.data["0"].prm_det_work_grp + " : " + response.data.data["0"].prm_det_work_grp_desc});
        }

        if(response.data.data["0"].prm_det_project_id === "" || response.data.data["0"].prm_det_project_id === null || response.data.data["0"].prm_det_project_id === "null" )
          {
            setSelected_Project_Id({ label: "" });
          }else{
            setSelected_Project_Id({ label: response.data.data["0"].prm_det_project_id + " : " + response.data.data["0"].prm_det_project_id_desc});
        }

      
        setIsCheckedSafty(response.data.data["0"].prm_det_safety === "1");

        if(response.data.data["0"].prm_det_work_area === "" || response.data.data["0"].prm_det_work_area === null || response.data.data["0"].prm_det_work_area === "null" )
          {
            setSelected_Work_Area({ label: "" });
          }else{
            setSelected_Work_Area({ label: response.data.data["0"].prm_det_work_area + " : " + response.data.data["0"].prm_det_work_area_desc});
        }

        if(response.data.data["0"].prm_det_asset_level === "" || response.data.data["0"].prm_det_asset_level === null || response.data.data["0"].prm_det_asset_level === "null" )
          {
            setSelected_PmAssetLevel({ label: "" });
          }else{
            setSelected_PmAssetLevel({ label: response.data.data["0"].prm_det_asset_level + " : " + response.data.data["0"].prm_det_asset_level_desc});
        }

        setAssetLocation(response.data.data["0"].prm_mst_assetlocn);
        setWorkLocation(response.data.data["0"].prm_det_work_locn);

        if(response.data.data["0"].prm_mst_flt_code === "" || response.data.data["0"].prm_mst_flt_code === null || response.data.data["0"].prm_mst_flt_code === "null" )
          {
            setselected_FaultCode({ label: "" });
          }else{
            setselected_FaultCode({ label: response.data.data["0"].prm_mst_flt_code + " : " + response.data.data["0"].prm_mst_flt_code_desc});
        }

        if(response.data.data["0"].prm_det_cause_code === "" || response.data.data["0"].prm_det_cause_code === null || response.data.data["0"].prm_det_cause_code === "null" )
          {
            setSelected_PmCaseCode({ label: "" });
          }else{
            setSelected_PmCaseCode({ label: response.data.data["0"].prm_det_cause_code + " : " + response.data.data["0"].prm_det_cause_code_desc});
        }
          
        if(response.data.data["0"].prm_det_act_code === "" || response.data.data["0"].prm_det_act_code === null || response.data.data["0"].prm_det_act_code === "null" )
          {
            setSelectedAction_Code({ label: "" });
          }else{
            setSelectedAction_Code({ label: response.data.data["0"].prm_det_act_code + " : " + response.data.data["0"].prm_det_act_code_desc});
        }

        if(response.data.data["0"].prm_det_customer_cd === "" || response.data.data["0"].prm_det_customer_cd === null || response.data.data["0"].prm_det_customer_cd === "null" )
          {
            setSelected_CustomerCode({ label: "" });
          }else{
            setSelected_CustomerCode({ label: response.data.data["0"].prm_det_customer_cd + " : " + response.data.data["0"].prm_det_customer_cd_desc});
        }  
         
        // setSelected_Assign_To ({ label: response.data.data["0"].prm_det_customer_cd + " : " + response.data.data["0"].
        //   prm_det_customer_cd_desc});  
        
        if(response.data.data["0"].prm_det_originator === "" || response.data.data["0"].prm_det_originator === null || response.data.data["0"].prm_det_originator === "null" )
          {
            setSelected_Originator({ label: "" });
          }else{
            setSelected_Originator({ label: response.data.data["0"].prm_det_originator + " : " + response.data.data["0"].prm_det_originator_desc});
        } 

        if(response.data.data["0"].prm_det_approver === "" || response.data.data["0"].prm_det_approver === null || response.data.data["0"].prm_det_approver === "null" )
          {
            setSelect_Approver({ label: "" });
          }else{
            setSelect_Approver({ label: response.data.data["0"].prm_det_approver + " : " + response.data.data["0"].prm_det_approver_desc});
        }
        
        setSelected_MeterId({ label: response.data.data["0"]. prm_mst_meter_id});
        setPmLPMUsage(response.data.data["0"]. prm_mst_lpm_usg);
        setNote_desc(response.data.data["0"]. prm_det_note1);
  
        if(response.data.data["0"].prm_mst_lpm_uom === "" || response.data.data["0"].prm_mst_lpm_uom === null || response.data.data["0"].prm_mst_lpm_uom === "null" )
          {
            setselected_PmLPMUOM({ label: "" });
          }else{
            setselected_PmLPMUOM({ label: response.data.data["0"].prm_mst_lpm_uom + " : " + response.data.data["0"].prm_mst_lpm_uom_desc});
        }

        if(response.data.data["0"].prm_det_crd_costcenter === "" || response.data.data["0"].prm_det_crd_costcenter === null || response.data.data["0"].prm_det_crd_costcenter === "null" )
          {
            setSelected_creadit_cost_center({ label: "" });
          }else{
            setSelected_creadit_cost_center({ label: response.data.data["0"].prm_det_crd_costcenter + " : " + response.data.data["0"].prm_det_crd_costcenter_desc});
        }
 
        if(response.data.data["0"].prm_det_l_account === "" || response.data.data["0"].prm_det_l_account === null || response.data.data["0"].prm_det_l_account === "null" )
          {
            setSelected_Labor_Account({ label: "" });
          }else{
            setSelected_Labor_Account({ label: response.data.data["0"].prm_det_l_account + " : " + response.data.data["0"].prm_det_l_account_desc});
        }
  

        if(response.data.data["0"].prm_det_c_account === "" || response.data.data["0"].prm_det_c_account === null || response.data.data["0"].prm_det_c_account === "null" )
          {
            setSelected_Contract_Account({ label: "" });
          }else{
            setSelected_Contract_Account({ label: response.data.data["0"].prm_det_c_account + " : " + response.data.data["0"].prm_det_c_account_desc});
        }

        if(response.data.data["0"].prm_det_m_account === "" || response.data.data["0"].prm_det_m_account === null || response.data.data["0"].prm_det_m_account === "null" )
          {
            setSelected_Material_Account({ label: "" });
          }else{
            setSelected_Material_Account({ label: response.data.data["0"].prm_det_m_account + " : " + response.data.data["0"].prm_det_m_account_desc});
        }
     

        setUDFText_1(response.data.data["0"].prm_det_varchar1);
        setUDFText_2(response.data.data["0"].prm_det_varchar2);
        setUDFText_3(response.data.data["0"].prm_det_varchar3);
        setUDFText_4(response.data.data["0"].prm_det_varchar4);
        setUDFText_5(response.data.data["0"].prm_det_varchar5);
        setUDFText_6(response.data.data["0"].prm_det_varchar6);
        setUDFText_7(response.data.data["0"].prm_det_varchar7);
        setUDFText_8(response.data.data["0"].prm_det_varchar8);
        setUDFText_9(response.data.data["0"].prm_det_varchar9);
        setUDFText_10(response.data.data["0"].prm_det_varchar10);
  
        setUDFText_11(response.data.data["0"].prm_det_varchar11);
        setUDFText_12(response.data.data["0"].prm_det_varchar12);
        setUDFText_13(response.data.data["0"].prm_det_varchar13);
        setUDFText_14(response.data.data["0"].prm_det_varchar14);
        setUDFText_15(response.data.data["0"].prm_det_varchar15);
        setUDFText_16(response.data.data["0"].prm_det_varchar16);
        setUDFText_17(response.data.data["0"].prm_det_varchar17);
        setUDFText_18(response.data.data["0"].prm_det_varchar18);
        setUDFText_19(response.data.data["0"].prm_det_varchar19);
        setUDFText_20(response.data.data["0"].prm_det_varchar20);
  
        setUDFNumber_1(formatNumber(response.data.data["0"].prm_det_numeric1));
        setUDFNumber_2(formatNumber(response.data.data["0"].prm_det_numeric2));
        setUDFNumber_3(formatNumber(response.data.data["0"].prm_det_numeric3));
        setUDFNumber_4(formatNumber(response.data.data["0"].prm_det_numeric4));
        setUDFNumber_5(formatNumber(response.data.data["0"].prm_det_numeric5));
        setUDFNumber_6(formatNumber(response.data.data["0"].prm_det_numeric6));
        setUDFNumber_7(formatNumber(response.data.data["0"].prm_det_numeric7));
        setUDFNumber_8(formatNumber(response.data.data["0"].prm_det_numeric8));
        setUDFNumber_9(formatNumber(response.data.data["0"].prm_det_numeric9));
        setUDFNumber_10(formatNumber(response.data.data["0"].prm_det_numeric10));

        if (response.data.data["0"].prm_det_datetime1 == null) {   
          setUDFDate_1("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime1.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_1(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime2 == null) {   
          setUDFDate_2("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime2.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_2(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime3 == null) {   
          setUDFDate_3("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime3.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_3(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime4 == null) {   
          setUDFDate_4("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime4.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_4(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime5 == null) {   
          setUDFDate_5("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime5.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_5(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime6 == null) {   
          setUDFDate_6("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime6.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_6(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime7 == null) {   
          setUDFDate_7("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime7.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_7(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime8 == null) {   
          setUDFDate_8("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime8.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_8(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime9 == null) {   
          setUDFDate_9("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime9.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_9(formattedDate);
        }
        if (response.data.data["0"].prm_det_datetime10 == null) {   
          setUDFDate_10("");
        } else {
          const apiDate = response.data.data["0"].prm_det_datetime10.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_10(formattedDate);
        }

      fetchImgData();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: response.data,
      });
    }
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops Something is wrong...",
        text: error,
      });
    }
  }

  // Get Pm Group Data
  const getPmGroupData = async () => {
    try {
      const response = await httpCommon.get(`/get_pm_filed_data.php?site_cd=${site_ID}`);
      // console.log("response____getLabel",response);
      if (response.data.status === "SUCCESS") {
        setPmGroupAllData(response.data.data.prm_group_data);
        let SetGroup = response.data.data.prm_group_data.map((item) => ({
          label: item.prm_grp_grp_cd + " : " + item.prm_grp_desc,
          value: item.prm_grp_desc,
          key: item.prm_grp_grp_cd,
        }));
        setPmGroup(SetGroup);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Second Api call fetch all dropdowwn data
  const fetchStatusData = async () => {
    try {
      // `/get_asset_dropdownlist.php?site_cd=${site_ID}&assetNo=${AssetNo}`
      const response = await httpCommon.get(
         `/get_asset_dropdownlist.php?site_cd=${site_ID}&assetNo=${AssetNo}`
      );
       //console.log("response____status__", response); 
        
      let Status = response.data.data.AssetStatusList.map((item) => ({
        label: item.wrk_sts_status + " : " + item.wrk_sts_desc,
        value: item.wrk_sts_desc,
        key: item.wrk_sts_status,
      }));
      setStatus(Status);

      let WrkGrup = response.data.data.PmWorkGroup.map((item) => ({
        label: item.wrk_grp_grp_cd + " : " + item.wrk_grp_desc,
        value: item.wrk_grp_desc,
        key: item.wrk_grp_grp_cd,
      }));

      setWorkGroup(WrkGrup);

      let WrkType = response.data.data.PmWorkType.map((item) => ({
        label: item.wrk_typ_typ_cd + " : " + item.wrk_typ_desc,
        value: item.wrk_typ_desc,
        key: item.wrk_typ_typ_cd,
      }));

      setPm_workType(WrkType);

      let FrequencyCode = response.data.data.AssetFrequencyCode.map((item) => ({
        label: item.prm_fcd_freq_code + " : " + item.prm_fcd_desc,
        value: item.prm_fcd_desc,
        key: item.prm_fcd_freq_code,
      }));
      setFrequencyCode(FrequencyCode);
      setFrequencyCodeAllData(response.data.data.AssetFrequencyCode);

      let WrkClass = response.data.data.PmWorkClass.map((item) => ({
        label: item.wrk_cls_cls_cd + " : " + item.wrk_cls_desc,
        value: item.wrk_cls_desc,
        key: item.wrk_cls_cls_cd,
      }));

      setPm_workClass(WrkClass);

      let caseCode = response.data.data.PmCaseCode.map((item) => ({
        label: item.wrk_ccd_cause_cd + " : " + item.wrk_ccd_desc,
        value: item.wrk_ccd_desc,
        key: item.wrk_ccd_cause_cd,
      }));
      setPmCaseCode(caseCode);

      let originator = response.data.data.AssetOriginator.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_empl_id,
      }));
      setOriginator(originator);

      let mtrId = response.data.data.PmMeterId.map((item) => ({
        label: item.ast_ls2_meter_id + " : " + item.ast_ls2_usage_uom,
        value: item.ast_ls2_meter_id,
      }));
      setMeterId(mtrId);

      let actionCode = response.data.data.PmActionCode.map((item) => ({
        label: item.wrk_act_action_cd + " : " + item.wrk_act_desc,
        value: item.wrk_act_desc,
        key: item.wrk_act_action_cd,
      }));
      setAction_code(actionCode);

      let customerCode = response.data.data.PmCustomerCode.map((item) => ({
        label: item.cus_mst_customer_cd + " : " + item.cus_mst_desc,
        value: item.wrk_act_desc,
        key: item.cus_mst_customer_cd,
      }));
      setPmCustomerCode(customerCode);

      let AssetLvl = response.data.data.Assetleavel.map((item) => ({
        label: item.ast_lvl_ast_lvl + " : " + item.ast_lvl_desc,
        value: item.ast_lvl_desc,
        key: item.ast_lvl_ast_lvl,
      }));

      setPmAssetLevel(AssetLvl);

      let AssetlaborAccount = response.data.data.Assetlaboraccount.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.descs,
        key: item.account,
      }));

      setLabor_Account(AssetlaborAccount);

     
      let PlanPriority = response.data.data.AssetPlanPriority.map((item) => ({
        label: item.wrk_pri_pri_cd + " : " + item.wrk_pri_desc,
        value: item.wrk_pri_desc,
        key: item.wrk_pri_pri_cd,
      }));
      setPlanPriority(PlanPriority);

      let PmLPMUOM2 = response.data.data.AssetLPMUOM.map((item) => ({
        label: item.uom_mst_uom + " : " + item.uom_mst_desc,
        value: item.uom_mst_desc,
        key:item.uom_mst_uom,
      }));
      setPmLPMUOM(PmLPMUOM2);

      let FaultCode = response.data.data.AssetFaultCode.map((item) => ({
        label: item.wrk_flt_fault_cd + " : " + item.wrk_flt_desc,
        value: item.wrk_flt_desc,
        key:item.wrk_flt_fault_cd,
      }));
      setFaultCode(FaultCode);

      let Asset_Group_Code = response.data.data.AssetGroupCode.map((item) => ({
        label: item.ast_grp_grp_cd + " : " + item.ast_grp_desc,
        value: item.ast_grp_desc,
      }));
      setAsset_Group_Code(Asset_Group_Code);

      let Work_Area = response.data.data.AssetZone.map((item) => ({
        label: item.mst_war_work_area + " : " + item.mst_war_desc,
        value: item.mst_war_desc,
      }));
      setWork_Area(Work_Area);

      let Charge_Cost_Center = response.data.data.Assetcostcenter.map(
        (item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.descs,
        })
      );
      setCharge_Cost_Center(Charge_Cost_Center);

      let Work_Group = response.data.data.Assetwrkgrp.map((item) => ({
        label: item.wrk_grp_grp_cd + " : " + item.wrk_grp_desc,
        value: item.wrk_grp_desc,
      }));
      setWork_Group(Work_Group);

      let Asset_Level = response.data.data.Assetleavel.map((item) => ({
        label: item.ast_lvl_ast_lvl + " : " + item.ast_lvl_desc,
        value: item.ast_lvl_desc,
      }));
      setAsset_Level(Asset_Level);

      let Asset_Location = response.data.data.Assetlocation.map((item) => ({
        label: item.ast_loc_ast_loc + " : " + item.ast_loc_desc,
        value: item.ast_loc_desc,
      }));
      setAsset_Location(Asset_Location);

      let Asset_Type = response.data.data.AssetType.map((item) => ({
        label: item.ast_type_cd + " : " + item.ast_type_descs,
        value: item.ast_type_descs,
      }));
      setAsset_Type(Asset_Type);

      let Asset_Code = response.data.data.AssetCode.map((item) => ({
        label: item.ast_cod_ast_cd + " : " + item.ast_cod_desc,
        value: item.ast_cod_desc,
      }));
      setAsset_Code(Asset_Code);

      let Asset_CriFactor = response.data.data.Assetcriticalfactor.map((item) => ({
        label: item.ast_cri_cri_factor + " : " + item.ast_cri_desc,
        value: item.ast_cri_desc,
      }));
      setAsset_CriFactor(Asset_CriFactor);

      let Asset_laboraccount = response.data.data.Assetlaboraccount.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.descs,
      }));
      setAsset_Laboraccount(Asset_laboraccount);

      /*   end */

      let Plan_Priority = response.data.data.PlanPeriority.map((item) => ({
        label: item.wrk_pri_pri_cd + " : " + item.wrk_pri_desc,
        value: item.wrk_pri_desc,
      }));
      setPlan_Priority(Plan_Priority);

      let Fault_Code = response.data.data.FaultCode.map((item) => ({
        label: item.wrk_flt_fault_cd + " : " + item.wrk_flt_desc,
        value: item.wrk_flt_desc,
      }));
      setFault_Code(Fault_Code);

      let Asset_Status = response.data.data.AssetStatus.map((item) => ({
        label: item.ast_sts_status + " : " + item.ast_sts_desc,
        value: item.ast_sts_desc,
      }));
      setAsset_Status(Asset_Status);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Get Status And Plan Priorty Data
  const fetchStusPriortyData = async () => {
    try {
      const response = await httpCommon.get(
        "/GetWordkOrderStatus_Plan_PriorityData.php"
      );
      if (response.data.status == "SUCCESS") {
        setSelected_Status({
          label: response.data.data.dft_mst_wko_sts,
        });
        setSelected_Plan_Priority({
          label: response.data.data.dft_mst_wko_pri,
        });
        setSelected_Originator({
          label: emp_mst_name,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Thired Api Call
  const fetchImgData = async () => {
    console.log("callto api");
    try {
      const response = await httpCommon.get(
        "/get_pm_edit_img.php?RowID=" + RowID
      );
    //  console.log("response____img____",response);
        if (response.data.data) {
          // Check if AllImgGet exists and has items
          console.log("response____img____2",response);
          if (response.data.data.AllImgGet && response.data.data.AllImgGet.length > 0) {
            setDbImg(response.data.data.AllImgGet);
           // setDbImgRowId(response.data.data.AllImgGet[0].RowID);
             setImguploadStatus(response.data.data.AllImgGet[0].ImgStatus);
              setImageSelect({
                name: response.data.data.AllImgGet[0].file_name,
                path: response.data.data.AllImgGet[0].attachment,
              });
          }
        
          // Check if AllRef exists and has items
         if (response.data.data.AllRef && response.data.data.AllRef.length > 0) {
           setRefImg(response.data.data.AllRef);
         setImguploadRefStatus(response.data.data.AllRef[0].ImgStatusRef);
         }
        }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const PmGroupSelectedValue = (PmValue) =>{
    if (PmValue.key !=="") {
      const matchedGroup = pmGroupAllData.find(group => group.prm_grp_grp_cd === PmValue.key);
      if (matchedGroup) {
        setAssetLocation(matchedGroup.prm_grp_ast_loc);  
    } 
  }
}

const getDueDateAndDesc =(DueValue) =>{
 
  if (DueValue.key !=="") {
    const matchedGroup = FrequencyCodeAllData.find(group => group.prm_fcd_freq_code === DueValue.key);
    if (matchedGroup) {
      console.log("matchedGroup___",matchedGroup)
     // setAssetLocation(matchedGroup.prm_grp_ast_loc);  
  } 
}
}
  const handleChange = (event, newValue) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });

    setTabValue(newValue);
  };
  const openSaveImg = () => {
    setShowdd2(true);
  };
  // First main Img funcation
  const handleDeleteImgApi = (ImgIDdlt) => {
    console.log("ImgIDdlt___",ImgIDdlt);
    const updatedImages = getDbImg.filter((image) => image.RowID !== ImgIDdlt);

    // Update the state with the new array of images after the deletion
    setDbImg(updatedImages);
    setDisabledBtn(true);
    setDbImgRowId(ImgIDdlt);
    setImguploadStatus("NEW_SINGLE_IMG");
    setImageSelect({ name: "", path: "" });
  };
  const handleImgChangeSingle = (e) => {
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
      setDisabledBtn(true);
      setImguploadStatus("NEW_SINGLE_IMG");
    }
    // Img set for data api
    if (getDbImg != "") {
      setDbImg("");
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSelect({ name: file.name, path: reader.result });
    };

    reader.readAsDataURL(file);
  };
  const clearDataImg = () => {
    setImage("");
    if(Button_save === "Save"){
      setImageSelect({ name: "", path: "" });
    };
  
  };
  const handleClearImg = (event) => {
    event.preventDefault();
    clearDataImg();
    setDisabledBtn(false);
  };
  const handleImgChangeSingle2 = (e) => {
    setDisabledBtn(false);
  };
  // Refrence Imge funcation
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleDeleteImg = (e) => {
    const s = selectedImages.filter((item, index) => index !== e);
    setSelectedImages(s);
  };
  const handleShowdata = (item) => {
    setSelectedImage(item.attachment);
    setShowdd(true);
  };
  const openPDFInNewTab = (fileName) => {
    const binaryData = atob(fileName);

    const byteArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    // Step 3: Create a Blob from the typed array
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Step 4: Generate a URL for the blob
    const url = URL.createObjectURL(blob);

    // Step 5: Open the URL in a new tab
    window.open(url, "_blank");
  };
  const handleDeleteReferenceApi = (RefImgDlt) => {
    const removedItem = RefImg.find((item) => item.RowID === RefImgDlt);
    const updatedRefImg = RefImg.filter((item) => item.RowID !== RefImgDlt);
    setRefImg(updatedRefImg);
    setRemovedRefItems((prevRemovedRefItems) => [
      ...prevRemovedRefItems,
      removedItem,
    ]);
  };
  const handleShowdd = (e, rowData) => {
    sethandalImg(rowData);
    setShowdd(true);
  };
  const isMyStateEmpty =
    Object.keys(handalImg).length === 0 && handalImg.constructor === Object;
  function handleImageChange(event) {
    const files = event.target.files;

    setSelectedPdfFiles((prevSelectedPdfFiles) => [
      ...prevSelectedPdfFiles,
      ...files,
    ]);
    const selectedImagesArray = [...selectedImages2];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageData = {
          name: files[i].name,
          type: files[i].type,
          base64: event.target.result,
        };
        selectedImagesArray.push(imageData);
        if (selectedImagesArray.length === files.length) {
          setSelectedImages2(selectedImagesArray);
          //setImageSelect({ name: file.name, path: reader.result });
        }
      };
      reader.readAsDataURL(files[i]);
    }
    setSelectedImages([...selectedImages, ...files]);
    setImguploadRefStatus("Ref_New_img");
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    selectedImages.forEach((file) => {
      formData.append("files[]", file);
    });
  };
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = PmMstLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  // WorkReq Label Details table
  const findCustomizeLabelDet = (columnName) => {
    const matchingColumn = PmdetLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = PmMandatoryFiled.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
    }
    return "";
  };
  // staya added today
  
  
  //get Asset Parent Flag data onther component
  const handleEditClick = () => {
    setModalOpenAsset(true);
  };

  const handleCancelClick = () => {
    setAsset_No("");
  };

  const handleEditClickFrequency =() =>{
    setIsPopupOpening(true);
    setModalOpenFrequency(true);
  } 

  const handleCancelClickFrequency = () =>{
  
    setSelected_FrequencyCode("");
  }

  const handleCloseClickFrequency = () =>{
    setModalOpenFrequency(false);
    setIsPopupOpening(false);
  }

  function handleCloseModal() {
    setModalOpenAsset(false);
  }

  const handleCancelClickCustomeCode = () =>{
    setCustomerCode("");
  }
  const handleEditClickCustomerCode = () =>{
    setModalOpenAssetCustomerCode(true);
  }
  function handleCloseModalCustomeCode() {
    setModalOpenAssetCustomerCode(false);
  }

  const get_assetmaster_select = async (selected_asset) => {
    
    let site_ID = localStorage.getItem("site_ID");
    const parts = selected_asset.split(':');
    const valueBeforeColon = parts[0].trim();

    if (selected_asset != "") {
      try {
        const response = await httpCommon.get(
          "/get_work_order_assetmaster_select.php?site_cd=" +
            site_ID +
            "&ast_mst_asset_no=" +
            valueBeforeColon +
            "&asset_shortdesc=" +
            "" +
            "&cost_center=" +
            "" +
            "&asset_status=" +
            "" +
            "&asset_type=" +
            "" +
            "&asset_grpcode=" +
            "" +
            "&work_area=" +
            "" +
            "&asset_locn=" +
            "" +
            "&asset_code=" +
            "" +
            "&ast_lvl=" +
            "" +
            "&ast_sts_typ_cd=" +
            "" +
            "&createby=" +
            "" +
            "&service_type=" +
            "" +
            "&block=" +
            "" +
            "&floor=" +
            ""
        );
       // console.log("response___output__",response);
        if (response.data.status === "SUCCESS") {


          setSelected_Charge_Cost_Center({
            label:
              response.data.data["0"].ast_mst_cost_center +
              " : " +
              response.data.data["0"].descs,
          });

          setSelected_Work_Area({
            label:
              response.data.data["0"].ast_mst_work_area +
              " : " +
              response.data.data["0"].mst_war_desc,
          });

          setSelected_PmAssetLevel({
            label:
            response.data.data["0"].ast_mst_ast_lvl +
            " : " +
            response.data.data["0"].ast_lvl_desc,
          });

          setSelected_WorkGroup({
            label:
            response.data.data["0"].ast_mst_wrk_grp +
            " : " +
            response.data.data["0"].ast_grp_desc, 
          })
          setAssetLocation(response.data.data["0"].ast_mst_asset_locn);

          Swal.close();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data,
          });
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Oops get_assetmaster_select...",
          text: e,
        });
      }
    }
  };

  const handleSelectedAssetNo = (dataa) => {
    get_assetmaster_select(dataa);
  };

  const handleRowData2 = (dataLenth, dataa, dataSecond) => {
    // Use the row data in the second component
    setAsset_No(dataa);
   
    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    if (dataa !== undefined && dataa !== null) {
      handleSelectedAssetNo(dataa);
    }
    if (dataSecond == "1") {
      setModalOpenAsset(false);
      setTotalSearch("");
    }
  };

  const handleLPMDateChange = (newDate) => {
    if (newDate && newDate.isValid()) {
      const nativeDate = newDate.toDate();
      setLPMDate(nativeDate);
      if(dueDateIncrementSet !==""){
        const minutesToAdd = dueDateIncrementSet * 1440;
          const newDueDate = new Date(nativeDate.getTime());
          newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
          // Set the new due date
          setNextDueDate(newDueDate);

          // set next created date value 
          if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
            const minutesToAddleadDay = LeadDay * 1440;
            const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
            setNextCreateDate(nxtdate);
          }
      }
    } else {
      setLPMDate(null);
    }
    setIsFormFiled(true);
    
  };
  const handleLPMCloseDateChange = (newDate) => {
   
    if (newDate && newDate.isValid()) {
      const nativeDate = newDate.toDate();
      setLPMClosedDate(nativeDate);
      if(dueDateIncrementSet !=="" && isCheckedLoop === true){
        const minutesToAdd = dueDateIncrementSet * 1440;
          const newDueDate = new Date(nativeDate.getTime());
          newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
          // Set the new due date
          setNextDueDate(newDueDate);

          // set next created date value 
          if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
            const minutesToAddleadDay = LeadDay * 1440;
            const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
            setNextCreateDate(nxtdate);
          }
      }
    } else {
      setLPMClosedDate(null);
    }
    setIsFormFiled(true);
  };
  
  const handleNextDueDateChange = (newDate) =>{
    if (newDate && newDate.isValid()) {
      const nativeDate = newDate.toDate();
      setNextDueDate(nativeDate);
      if(dueDateIncrementSet !==""){
        const minutesToAdd = dueDateIncrementSet * 1440;
          const newDueDate = new Date(nativeDate.getTime());
          newDueDate.setTime(newDueDate.getTime() - minutesToAdd * 60000);
          // Set the new due date
          setLPMDate(newDueDate);
          setLPMClosedDate(newDueDate);

          // set next created date value 
          if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
            const minutesToAddleadDay = LeadDay * 1440;
            const nxtdate = nativeDate - minutesToAddleadDay * 60000;
            setNextCreateDate(nxtdate);
          }
      }
    } else {
      setNextDueDate(null);
    }
    setIsFormFiled(true);

  }
  const handleRowDatafrequency = (dataLenth, dataa, dataSecond,valueset) => {

    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
  
    if (dataSecond == "1") {
      setSelected_FrequencyCode({label:dataa });
      console.log("Set value:", { label: dataa });
      setdueDateIncrement(valueset);


        // Check if LPMDate is not empty (using a valid date)
         if(isCheckedLoop === true){
          if (LPMClosedDate !== "" && LeadDay !== "" && LeadDay !== null) {

            const minutesToAdd = valueset * 1440;
            const newDueDate = new Date(LPMClosedDate.getTime());
            newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
            // Set the new due date
            setNextDueDate(newDueDate);
    
            if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
              const minutesToAddleadDay = LeadDay * 1440;
              const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
              setNextCreateDate(nxtdate);
            }
          }
        }
        else if (LPMDate instanceof Date && !isNaN(LPMDate)) {

          const minutesToAdd = valueset * 1440;
          const newDueDate = new Date(LPMDate.getTime());
          newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
          // Set the new due date
          setNextDueDate(newDueDate);

          // set next created date value 
          if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
            const minutesToAddleadDay = LeadDay * 1440;
            const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
            setNextCreateDate(nxtdate);
          }
          
        }
        if (typeof dataa === "string" && dataa.includes(" : ")) {
  
          const parts = dataa.split(" : ");
          const afterColon = parts.length > 1 ? parts[1].trim() : "";
          
          if (Short_Description === "" || Short_Description === null) {
            setShort_Description(afterColon);
          }
          setModalOpenFrequency(false);
          setTotalSearch("");
        }


    }else if(dataSecond == "0") {

      setSelected_FrequencyCode({label:dataa });
      console.log("Set value:", { label: dataa });
      setdueDateIncrement(valueset);
        // Check if LPMDate is not empty (using a valid date)
        if(isCheckedLoop === true){
          if (LPMClosedDate !== "" && LeadDay !== "" && LeadDay !== null) {

            const minutesToAdd = valueset * 1440;
            const newDueDate = new Date(LPMClosedDate.getTime());
            newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
            // Set the new due date
            setNextDueDate(newDueDate);
    
            if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
              const minutesToAddleadDay = LeadDay * 1440;
              const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
              setNextCreateDate(nxtdate);
            }
          }
        }
        else if (LPMDate instanceof Date && !isNaN(LPMDate)) {

          const minutesToAdd = valueset * 1440;
          const newDueDate = new Date(LPMDate.getTime());
          newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
          // Set the new due date
          setNextDueDate(newDueDate);

          // set next created date value 
          if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
            const minutesToAddleadDay = LeadDay * 1440;
            const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
            setNextCreateDate(nxtdate);
          }
          
        }
        if (typeof dataa === "string" && dataa.includes(" : ")) {
  
          const parts = dataa.split(" : ");
          const afterColon = parts.length > 1 ? parts[1].trim() : "";
          
          if (Short_Description === "" || Short_Description === null) {
            setShort_Description(afterColon);
          }
          setModalOpenFrequency(false);
          setTotalSearch("");
        }

    }
  };

  const handleLeadDayChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setLeadDay("0");
    } else {
      if (LeadDay === "0") {
        value = value.replace(/^0+/, ""); 
      }
      if (value.length <= 3) {
        setLeadDay(value);
      }
    }
    
    if(isCheckedLoop === true && dueDateIncrementSet !== ""){
      if (LPMClosedDate !== "" && value !== "" && value !== null) {

        const minutesToAdd = dueDateIncrementSet * 1440;
        const newDueDate = new Date(LPMClosedDate.getTime());
        newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
        // Set the new due date
        setNextDueDate(newDueDate);
          
        if (newDueDate !== "" && value !== "" && value !== null) {
          const minutesToAddleadDay = value * 1440;
          const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
          setNextCreateDate(nxtdate);
        }
      }else{
        if(LPMClosedDate !== "" && dueDateIncrementSet !== ""){
          const minutesToAddleadDay = 0 * 1440;
          const nxtdate = LPMClosedDate.getTime() - minutesToAddleadDay * 60000;
          setNextCreateDate(nxtdate);
        }
      }
    }else if (NextDueSate !== "" && value !== "" && value !== null) {
      const minutesToAddleadDay = value * 1440;
      const nxtdate = NextDueSate.getTime() - minutesToAddleadDay * 60000;
      setNextCreateDate(nxtdate);
    }else{
      if (NextDueSate !== "") {
        const minutesToAddleadDay = 0 * 1440;
        const nxtdate = NextDueSate.getTime() - minutesToAddleadDay * 60000;
        setNextCreateDate(nxtdate);
      }
    }
    setIsFormFiled(true);
  };

  const handleCheckboxChangeLoop = (event) => {
   
    if(event.target.checked === true && dueDateIncrementSet !==""){
      if (LPMClosedDate !== "" && LeadDay !== "" && LeadDay !== null) {

        const minutesToAdd = dueDateIncrementSet * 1440;
        const newDueDate = new Date(LPMClosedDate.getTime());
        newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
        // Set the new due date
        setNextDueDate(newDueDate);

        if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
          const minutesToAddleadDay = LeadDay * 1440;
          const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
          setNextCreateDate(nxtdate);
        }
      }
      
    }else{
      if (LPMDate !== "" && LeadDay !== "" && dueDateIncrementSet !== "") {

        const minutesToAdd = dueDateIncrementSet * 1440;
        const newDueDate = new Date(LPMDate.getTime());
        newDueDate.setTime(newDueDate.getTime() + minutesToAdd * 60000);
        // Set the new due date
        setNextDueDate(newDueDate);

        if (newDueDate !== "" && LeadDay !== "" && LeadDay !== null) {
          const minutesToAddleadDay = LeadDay * 1440;
          const nxtdate = newDueDate.getTime() - minutesToAddleadDay * 60000;
          setNextCreateDate(nxtdate);
        }
      }
    }
    setIsCheckedLoop(event.target.checked); 
    setIsFormFiled(true);
  };

  const handleLeadDayBlur = () => {
    // If the value is empty, keep it as "0"
    if (LeadDay === "") {
      setLeadDay("0");
      
    }
  };
  const handleRowData3 = (dataLenth, dataa, dataSecond) => {
  
    setCustomerCode(dataa);
   
    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    // if (dataa !== undefined && dataa !== null) {
    //   handleSelectedAssetNo(dataa);
    // }
    if (dataSecond == "1") {
      setModalOpenAssetCustomerCode(false);
      setTotalSearch("");
    }
  };

  const handleRowDataPagechg = (pageCount) => {
    setViewedTotlRows(pageCount);
  };

  const handelRowSearch = (searchTotl) => {
    setTotalSearch(searchTotl);
  };
  function CustomTextField({ rightIcons, ...props }) {
    return (
      <TextField
        {...props}
        InputProps={{
          endAdornment: rightIcons && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {rightIcons.map((icon, index) => (
                <IconButton key={index}>{icon}</IconButton>
              ))}
            </div>
          ),
        }}
      />
    );
  }
  const openDocxInNewTab = (fileName) => {
    const baseURL = httpCommon.defaults.baseURL;
    const fileURL = `${baseURL}${fileName}`;
    window.open(fileURL, "_blank");
  };
    const openPhpInNewTab = (fileName) => {
      const baseURL = httpCommon.defaults.baseURL;
      const fileURL = `${baseURL}${fileName}`;
      window.open(fileURL, "_blank");
    };
    
    const openLogInNewTab = (fileName) => {
      const baseURL = httpCommon.defaults.baseURL;
      const fileURL = `${baseURL}${fileName}`;
      window.open(fileURL, "_blank");
    };
    
    const openXlsxInNewTab = (fileName) => {
      const baseURL = httpCommon.defaults.baseURL;
      const fileURL = `${baseURL}${fileName}`;
      window.open(fileURL, "_blank");
    };

/*   add new asset code by stay */
  const New_Pm_Create = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
   // Swal.showLoading();
   // console.log("enter_____save");
    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

  
    let typePm, setTypePM;
    if (selected_PmType.label == "" || selected_PmType.label == null) {
      setTypePM = "";
    } else {
      typePm = selected_PmType.label.split(":");
      setTypePM = typePm[0];
     // console.log("Status: ", Status[0])
    }

    //Select Asset No
    let EmptyAsset;
    if (Asset_No == "" || Asset_No == null) {
      EmptyAsset = "";
    } else {
      // Asset_No = selected_Asset_No.label.split(":")
      const EmptyAssetSplit = Asset_No.split(":");
      EmptyAsset = EmptyAssetSplit[0];
    }


    let PMfrequencyCode;
  if (!selected_FrequencyCode.label) { // Handles both empty string and null
    PMfrequencyCode = "";
  } else {
    const frequencyCodeSplit = selected_FrequencyCode.label.split(":"); // Use label here
    PMfrequencyCode = frequencyCodeSplit[0].trim(); // Trim to remove leading/trailing spaces
  }

// LPM DATE
    let PMlPMDate = "";
    if (LPMDate == "" || LPMDate == null) {
      PMlPMDate = "";
    } else {
      PMlPMDate = Moment(LPMDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
    }

  // NextCreateDate 
    let PMnextCreateDate = "";
    if (NextCreateDate == "" || NextCreateDate == null) {
      PMnextCreateDate = "";
    } else {
      PMnextCreateDate = Moment(NextCreateDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
    }

    // selected_Charge_Cost_Center
    let selectedchargeCostcenter;
    if (selected_Charge_Cost_Center.label == "" || selected_Charge_Cost_Center.label == null) {
      selectedchargeCostcenter = "";
    } else {
      const costCenter = selected_Charge_Cost_Center.label.split(":");
      selectedchargeCostcenter = costCenter[0];
    }

    //LPMClosedDate
    let PmlPMCloseddate;
    if (LPMClosedDate == "" || LPMClosedDate == null) {
      PmlPMCloseddate = "";
    } else {
      PmlPMCloseddate = Moment(LPMClosedDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
    }

    // NextDueSate
    let PmnextDueSate;
    if (NextDueSate == "" || NextDueSate == null) {
      PmnextDueSate = "";
    } else {
      PmnextDueSate = Moment(NextDueSate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
    }

    //Default WO Status
    let Status, setStatus;
    if (selected_Status.label == "" || selected_Status.label == null) {
      setStatus = "";
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
     // console.log("Status: ", Status[0])
    }

  //selected_PlanPriority
  let SelectedplanPriority;
  if (!selected_PlanPriority || !selected_PlanPriority.label) {
    SelectedplanPriority = "";
  } else {
    const PropritySet = selected_PlanPriority.label.split(":");
    SelectedplanPriority = PropritySet[0];
   // console.log("Status: ", Status[0])
  }

  //selected_Pm_workType
  let SelectedPmWorkType;
    if (!selected_Pm_workType || !selected_Pm_workType.label) {
    SelectedPmWorkType = "";
  } else {
    const PmWorkTypeSet = selected_Pm_workType.label.split(":");
    SelectedPmWorkType = PmWorkTypeSet[0];
   // console.log("Status: ", Status[0])
  }

  //selected_Pm_workClass
  let selectedPmworkClass;
  if (selected_Pm_workClass.label == "" || selected_Pm_workClass.label == null) {
    selectedPmworkClass = "";
  } else {
    const PmworkClassSet = selected_Pm_workClass.label.split(":");
    selectedPmworkClass = PmworkClassSet[0];
   // console.log("Status: ", Status[0])
  }

  //selected_WorkGroup
  let selectedworkGroup;
  if (!selected_WorkGroup || !selected_WorkGroup.label) {
    selectedworkGroup = "";
  } else {
    const PmworkGroupSet = selected_WorkGroup.label.split(":");
    selectedworkGroup = PmworkGroupSet[0];
   // console.log("Status: ", Status[0])
  }
  //selected_Project_Id
  let selectedProjectId;
    if (!selected_Project_Id || !selected_Project_Id.label) {
      selectedProjectId = "";
  } else {
    const PmProjectIdSet = selected_Project_Id.label.split(":");
    selectedProjectId = PmProjectIdSet[0];
   // console.log("Status: ", Status[0])
  }

  //selected_Work_Area
  let selectedworkArea;
  if (selected_Work_Area.label == "" || selected_Work_Area.label == null) {
    selectedworkArea = "";
  } else {
    const PmworkAreaSet = selected_Work_Area.label.split(":");
    selectedworkArea = PmworkAreaSet[0];
   // console.log("Status: ", Status[0])
  }
  //selected_PmAssetLevel
  let selectedpmAssetLevel;
  if (selected_PmAssetLevel.label == "" || selected_PmAssetLevel.label == null) {
    selectedpmAssetLevel = "";
  } else {
    const PmassetLvlSet = selected_PmAssetLevel.label.split(":");
    selectedpmAssetLevel = PmassetLvlSet[0];
   // console.log("Status: ", Status[0])
  }
  //selected_FaultCode
  let selectedFaultCode;
  if (selected_FaultCode.label == "" || selected_FaultCode.label == null) {
    selectedFaultCode = "";
  } else {
    const PmFaultCodeSet = selected_FaultCode.label.split(":");
    selectedFaultCode = PmFaultCodeSet[0];
   // console.log("Status: ", Status[0])
  }

//selected_PmCaseCode
let selectedPmCaseCode;
  if (selected_PmCaseCode.label == "" || selected_PmCaseCode.label == null) {
    selectedPmCaseCode = "";
  } else {
    const PmCaseCodeSet = selected_PmCaseCode.label.split(":");
    selectedPmCaseCode = PmCaseCodeSet[0];
  
  }

  //selectedAction_Code
  let selectedActionCode;
  if (selectedAction_Code.label == "" || selectedAction_Code.label == null) {
    selectedActionCode = "";
  } else {
    const PmActionCodeSet = selectedAction_Code.label.split(":");
    selectedActionCode = PmActionCodeSet[0];
  }

  //selected_CustomerCode
  let selectedCustomerCode;
  if (selected_CustomerCode.label == "" || selected_CustomerCode.label == null) {
    selectedCustomerCode = "";
  } else {
    const PmCustomerCodeSet = selected_CustomerCode.label.split(":");
    selectedCustomerCode = PmCustomerCodeSet[0];
  }

  //selected_Assign_To
  let selectedAssignTo;
  if (selected_Assign_To.label == "" || selected_Assign_To.label == null) {
    selectedAssignTo = "";
  } else {
    const PmAssignToSet = selected_Assign_To.label.split(":");
    selectedAssignTo = PmAssignToSet[0];
  }
  //selected_Originator
  let selectedOriginator;
  if (selected_Originator.label == "" || selected_Originator.label == null) {
    selectedOriginator = "";
  } else {
    const PmOriginatorSet = selected_Originator.label.split(":");
    selectedOriginator = PmOriginatorSet[0];
  }

//selected_Approver
  let selectedApprover;
  if (selected_Approver.label == "" || selected_Approver.label == null) {
    selectedApprover = "";
  } else {
    const PmApproverSet = selected_Approver.label.split(":");
    selectedApprover = PmApproverSet[0];
  }
  //selected_Planner
  let selectedPlanner;
  if (selected_Planner.label == "" || selected_Planner.label == null) {
    selectedPlanner = "";
  } else {
    const PmPlannerSet = selected_Planner.label.split(":");
    selectedPlanner = PmPlannerSet[0];
  }
  //selected_MeterId
  let selectedMeterId;
  if (selected_MeterId.label == "" || selected_MeterId.label == null) {
    selectedMeterId = "";
  } else {
    const PmMeterIdSet = selected_MeterId.label.split(":");
    selectedMeterId = PmMeterIdSet[0];
  }
  //selected_PmLPMUOM
  let selectedPmLPMUOM;
  if (selected_PmLPMUOM.label == "" || selected_PmLPMUOM.label == null) {
    selectedPmLPMUOM = "";
  } else {
    const PmPmLPMUOMSet = selected_PmLPMUOM.label.split(":");
    selectedPmLPMUOM = PmPmLPMUOMSet[0];
  }
  //Charge_Cost_Center
  let Chargecostcenter;
  if (Charge_Cost_Center.label == "" || Charge_Cost_Center.label == null) {
    Chargecostcenter = "";
  } else {
    const PmcostcenterSet = Charge_Cost_Center.label.split(":");
    Chargecostcenter = PmcostcenterSet[0];
  }
  //selected_Labor_Account
  let selectedLaborAccount;
  if (selected_Labor_Account.label == "" || selected_Labor_Account.label == null) {
    selectedLaborAccount = "";
  } else {
    const PmLaborAccountSet = selected_Labor_Account.label.split(":");
    selectedLaborAccount = PmLaborAccountSet[0];
  }
//selected_Material_Account
let selectedMaterialAccount;
if (selected_Material_Account.label == "" || selected_Material_Account.label == null) {
  selectedMaterialAccount = "";
} else {
  const PmMaterialAccountSet = selected_Material_Account.label.split(":");
  selectedMaterialAccount = PmMaterialAccountSet[0];
}
//selected_Contract_Account
let selectedContractAccount;
if (selected_Contract_Account.label == "" || selected_Contract_Account.label == null) {
  selectedContractAccount = "";
} else {
  const PmContractAccountSet = selected_Contract_Account.label.split(":");
  selectedContractAccount = PmContractAccountSet[0];
}
//Select Date 1
let date_1 = "";
if (UDFDate_1 == "" || UDFDate_1 == null) {
  date_1 = "";
} else {
  date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 2
let date_2 = "";
if (UDFDate_2 == "" || UDFDate_2 == null) {
  date_2 = "";
} else {
  date_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 3
let date_3 = "";
if (UDFDate_3 == "" || UDFDate_3 == null) {
  date_3 = "";
} else {
  date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 4
let date_4 = "";
if (UDFDate_4 == "" || UDFDate_4 == null) {
  date_4 = "";
} else {
  date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 5
let date_5 = "";
if (UDFDate_5 == "" || UDFDate_5 == null) {
  date_5 = "";
} else {
  date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 6
let date_6 = "";
if (UDFDate_6 == "" || UDFDate_6 == null) {
  date_6 = "";
} else {
  date_6 = Moment(UDFDate_6).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 7
let date_7 = "";
if (UDFDate_7 == "" || UDFDate_7 == null) {
  date_7 = "";
} else {
  date_7 = Moment(UDFDate_7).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 8
let date_8 = "";
if (UDFDate_8 == "" || UDFDate_8 == null) {
  date_8 = "";
} else {
  date_8 = Moment(UDFDate_8).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 9
let date_9 = "";
if (UDFDate_9 == "" || UDFDate_9 == null) {
  date_9 = "";
} else {
  date_9 = Moment(UDFDate_9).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 10
let date_10 = "";
if (UDFDate_10 == "" || UDFDate_10 == null) {
  date_10 = "";
} else {
  date_10 = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}

  let missingFields = [];

    var json_Pm_Insert = {
      site_cd: site_ID,
      prm_mst_type: setTypePM.trim(),
      prm_mst_assetno: EmptyAsset.trim(),
      prm_mst_pm_grp:"",
      prm_mst_freq_code: PMfrequencyCode.trim(),
      prm_mst_desc: Short_Description.trim(),
      prm_mst_disable_flag: isCheckedFlag,
      prm_mst_cal_startdate: isCheckedPmDate,
      prm_mst_lpm_date: PMlPMDate,
      prm_mst_next_create: PMnextCreateDate,

      prm_det_chg_costcenter: selectedchargeCostcenter,

      prm_mst_closed_loop: isCheckedLoop,
      prm_mst_auto_gen: isCheckedAutoGen,
      prm_mst_lpm_closed_date: PmlPMCloseddate,
      prm_mst_next_due: PmnextDueSate,
      prm_mst_lead_day: LeadDay.trim(),
      prm_mst_dflt_status: setStatus.trim(),
      prm_mst_plan_priority : SelectedplanPriority,

      prm_det_work_type: SelectedPmWorkType,
      prm_det_work_class : selectedPmworkClass,
      prm_det_work_grp: selectedworkGroup,
      //prm_det_project_id: selectedProjectId,
      prm_det_project_id: selectedProjectId,
      prm_det_safety : isCheckedSafty,
      prm_det_note1: Note_desc.trim(),
      prm_det_work_area: selectedworkArea,
      prm_det_asset_level: selectedpmAssetLevel,

      prm_mst_assetlocn: AssetLocation,

      prm_det_work_locn: workLocation.trim(),
      prm_mst_flt_code: selectedFaultCode,
      prm_det_cause_code:selectedPmCaseCode,
      prm_det_act_code: selectedActionCode,
      prm_det_customer_cd :selectedCustomerCode,
      wko_det_assign_to: selectedAssignTo,
      prm_det_originator: selectedOriginator,
      prm_det_approver: selectedApprover,
      prm_det_planner : selectedPlanner,
      prm_mst_meter_id: selectedMeterId,
      prm_mst_lpm_usg : LpmUsage.trim(),
      prm_mst_lpm_uom: selectedPmLPMUOM,
      prm_det_crd_costcenter : Chargecostcenter,
      prm_det_l_account: selectedLaborAccount,
      prm_det_m_account : selectedMaterialAccount,
      prm_det_c_account: selectedContractAccount,

      prm_det_varchar1 : UDFText_1 ? UDFText_1.trim() : "",
      prm_det_varchar2 : UDFText_2 ? UDFText_2.trim() : "",
      prm_det_varchar3 : UDFText_3 ? UDFText_3.trim() : "",
      prm_det_varchar4 : UDFText_4 ? UDFText_4.trim() : "",
      prm_det_varchar5 : UDFText_5 ? UDFText_5.trim() : "",
      prm_det_varchar6 : UDFText_6 ? UDFText_6.trim() : "",
      prm_det_varchar7 : UDFText_7 ? UDFText_7.trim() : "",
      prm_det_varchar8 : UDFText_8 ? UDFText_8.trim() : "",
      prm_det_varchar9 : UDFText_9 ? UDFText_9.trim() : "",
      prm_det_varchar10 : UDFText_10 ? UDFText_10.trim() : "",
      prm_det_varchar11 : UDFText_11 ? UDFText_11.trim() : "",
      prm_det_varchar12 : UDFText_12 ? UDFText_12.trim() : "",
      prm_det_varchar13 : UDFText_13 ? UDFText_13.trim() : "",
      prm_det_varchar14 : UDFText_14 ? UDFText_14.trim() : "",
      prm_det_varchar15 : UDFText_15 ? UDFText_15.trim() : "",
      prm_det_varchar16 : UDFText_16 ? UDFText_16.trim() : "",
      prm_det_varchar17 : UDFText_17 ? UDFText_17.trim() : "",
      prm_det_varchar18 : UDFText_18 ? UDFText_18.trim() : "",
      prm_det_varchar19 : UDFText_19 ? UDFText_19.trim() : "",
      prm_det_varchar20 : UDFText_20 ? UDFText_20.trim() : "",

      prm_det_numeric1 : UDFNumber_1 ? UDFNumber_1.trim() : "",
      prm_det_numeric2 : UDFNumber_2 ? UDFNumber_2.trim() : "",
      prm_det_numeric3 : UDFNumber_3 ? UDFNumber_3.trim() : "",
      prm_det_numeric4 : UDFNumber_4 ? UDFNumber_4.trim() : "",
      prm_det_numeric5 : UDFNumber_5 ? UDFNumber_5.trim() : "",
      prm_det_numeric6 : UDFNumber_6 ? UDFNumber_6.trim() : "",
      prm_det_numeric7 : UDFNumber_7 ? UDFNumber_7.trim() : "",
      prm_det_numeric8 : UDFNumber_8 ? UDFNumber_8.trim() : "",
      prm_det_numeric9 : UDFNumber_9 ? UDFNumber_9.trim() : "",
      prm_det_numeric10 : UDFNumber_10 ? UDFNumber_10.trim() : "",

      prm_det_datetime1 : date_1 ? date_1.trim() : date_1,
      prm_det_datetime2 : date_2 ? date_2.trim() : date_2,
      prm_det_datetime3 : date_3 ? date_3.trim() : date_3,
      prm_det_datetime4 : date_4 ? date_4.trim() : date_4,
      prm_det_datetime5 : date_5 ? date_5.trim() : date_5,
      prm_det_datetime6 : date_6 ? date_6.trim() : date_6,
      prm_det_datetime7 : date_7 ? date_7.trim() : date_7,
      prm_det_datetime8 : date_8 ? date_8.trim() : date_8,
      prm_det_datetime9 : date_9 ? date_9.trim() : date_9,
      prm_det_datetime10 : date_10 ? date_10.trim() : date_10,

     // asset_type_ID: AutoNumring.trim(),
      ImgUpload: imageSelect,
      audit_user: emp_mst_login_id.trim(),
      prm_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
    };

 //   console.log("json_pm_insert", json_Pm_Insert);

    for (let i = 0; i < PmMandatoryFiled.length; i++) {
      const item = PmMandatoryFiled[i];
      const fieldValue = json_Pm_Insert[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break;
      }
    }
    if (missingFields.length > 0) {
      Swal.close();

      const errorMessage = `Please fill the required field: ${missingFields}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    }else{
    try {
      const response = await httpCommon.post(
        "/insert_new_pm_record.php",
        JSON.stringify(json_Pm_Insert)
      );
      // console.log("Json_Pm_", response);

      if (response.data.status === "SUCCESS") {
       
        let GetRowId = response.data.ROW_ID;

        if (selectedPdfFiles.length > 0) {
          
          const formData = new FormData();
          for (let i = 0; i < selectedPdfFiles.length; i++) {
            formData.append("files[]", selectedPdfFiles[i]);
          }
          formData.append("site_cd", site_ID);
          formData.append("RowID", GetRowId);
          formData.append("RefImgUploadStatus", imguploadRefStatus);
          formData.append("audit_user", emp_mst_login_id.trim());

          try {
          
            const response2 = await httpCommon.post(
              "/insert_pm_form_reference_multipalImgUpload.php",
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data' // Ensure proper content type
                }
            }
            );

            // console.log("upload_mltipal____",response2);
            if (response2.data.status == "SUCCESS") {
              
              Swal.close();
            
            }else{
              Swal.close();
              // console.log("error__", error);
            }
          } catch (error) {
            console.log("error__", error);
            //Handle error  WorkOrderNo
          }

        }
        Swal.close();
        Swal.fire({
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
          title: response.data.status,
          text: response.data.message,
          timer: swalCloseTime, // Auto-close after 3 seconds
          timerProgressBar: true, // Optional: Shows a progress bar
          willClose: () => {
            // Navigate to the desired page when the modal closes
            navigate(`/dashboard/PreventiveSetup`, {
              state: {
                currentPage,
              },
            });
          },
        }).then((result) => {
          // This will also handle the case when the user clicks OK before the timer ends
          if (result.dismiss !== Swal.DismissReason.timer) {
            navigate(`/dashboard/PreventiveSetup`, {
              state: {
                currentPage,
              },
            });
          }
        });
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data,
        });
      }
    } catch (error) {
      Swal.close();
      
      Swal.fire({
        icon: "error",
        title: "Oops Something is wrong...",
        text: error,
      });
    }
  }
  };

  const Update_PM = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
   Swal.showLoading();

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    let typePm, setTypePM;
    if (!selected_PmType || selected_PmType.label == "" || selected_PmType.label == null) {
      setTypePM = "";
    } else {
      typePm = selected_PmType.label.split(":");
      setTypePM = typePm[0];
     // console.log("Status: ", Status[0])
    }

    //Select Asset No
    let EmptyAsset;
    if (!Asset_No || Asset_No == "" || Asset_No == null) {
      EmptyAsset = "";
    } else {
      // Asset_No = selected_Asset_No.label.split(":")
      const EmptyAssetSplit = Asset_No.split(":");
      EmptyAsset = EmptyAssetSplit[0];
    }

//selected FrequencyCode 
    let PMfrequencyCode;
    if (!selected_FrequencyCode || selected_FrequencyCode == "" || selected_FrequencyCode == null) {
      PMfrequencyCode = "";
    } else {
     
      const requencyCodeSplit = selected_FrequencyCode.label.split(":");
      PMfrequencyCode = requencyCodeSplit[0];
    }

// LPM DATE
    let PMlPMDate = "";
    if (LPMDate == "" || LPMDate == null) {
      PMlPMDate = "";
    } else {
      PMlPMDate = Moment(LPMDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
    }

  // NextCreateDate 
    let PMnextCreateDate = "";
    if (NextCreateDate == "" || NextCreateDate == null) {
      PMnextCreateDate = "";
    } else {
      PMnextCreateDate = Moment(NextCreateDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
    }

    // selected_Charge_Cost_Center
    let selectedchargeCostcenter;
    if (selected_Charge_Cost_Center.label == "" || selected_Charge_Cost_Center.label == null) {
      selectedchargeCostcenter = "";
    } else {
      const costCenter = selected_Charge_Cost_Center.label.split(":");
      selectedchargeCostcenter = costCenter[0];
    }

    //LPMClosedDate
    let PmlPMCloseddate;
    if (LPMClosedDate == "" || LPMClosedDate == null) {
      PmlPMCloseddate = "";
    } else {
      PmlPMCloseddate = Moment(LPMClosedDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
    }

    // NextDueSate
    let PmnextDueSate;
    if (NextDueSate == "" || NextDueSate == null) {
      PmnextDueSate = "";
    } else {
      PmnextDueSate = Moment(NextDueSate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
    }

    //Default WO Status
    let Status, setStatus;
    if (selected_Status.label == "" || selected_Status.label == null) {
      setStatus = "";
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
     // console.log("Status: ", Status[0])
    }

  //selected_PlanPriority
  let SelectedplanPriority;
  if (!selected_PlanPriority || !selected_PlanPriority.label) {
    SelectedplanPriority = "";
  } else {
    const PropritySet = selected_PlanPriority.label.split(":");
    SelectedplanPriority = PropritySet[0];
   // console.log("Status: ", Status[0])
  }

  //selected_Pm_workType
  let SelectedPmWorkType;
    if (!selected_Pm_workType || !selected_Pm_workType.label) {
    SelectedPmWorkType = "";
  } else {
    const PmWorkTypeSet = selected_Pm_workType.label.split(":");
    SelectedPmWorkType = PmWorkTypeSet[0];
   // console.log("Status: ", Status[0])
  }

  //selected_Pm_workClass
  let selectedPmworkClass;
  if (selected_Pm_workClass.label == "" || selected_Pm_workClass.label == null) {
    selectedPmworkClass = "";
  } else {
    const PmworkClassSet = selected_Pm_workClass.label.split(":");
    selectedPmworkClass = PmworkClassSet[0];
   // console.log("Status: ", Status[0])
  }

  //selected_WorkGroup
  let selectedworkGroup;
  if (!selected_WorkGroup || !selected_WorkGroup.label) {
    selectedworkGroup = "";
  } else {
    const PmworkGroupSet = selected_WorkGroup.label.split(":");
    selectedworkGroup = PmworkGroupSet[0];
   // console.log("Status: ", Status[0])
  }
  //selected_Project_Id
  let selectedProjectId;
    if (!selected_Project_Id || !selected_Project_Id.label) {
      selectedProjectId = "";
  } else {
    const PmProjectIdSet = selected_Project_Id.label.split(":");
    selectedProjectId = PmProjectIdSet[0];
   // console.log("Status: ", Status[0])
  }

  //selected_Work_Area
  let selectedworkArea;
  if (!selected_Work_Area || selected_Work_Area.label == "" || selected_Work_Area.label == null) {
    selectedworkArea = "";
  } else {
    const PmworkAreaSet = selected_Work_Area.label.split(":");
    selectedworkArea = PmworkAreaSet[0];
   // console.log("Status: ", Status[0])
  }
  //selected_PmAssetLevel
  let selectedpmAssetLevel;
  if (!selected_PmAssetLevel || selected_PmAssetLevel.label == "" || selected_PmAssetLevel.label == null) {
    selectedpmAssetLevel = "";
  } else {
    const PmassetLvlSet = selected_PmAssetLevel.label.split(":");
    selectedpmAssetLevel = PmassetLvlSet[0];
   // console.log("Status: ", Status[0])
  }
  //selected_FaultCode
  let selectedFaultCode;
  if (!selected_FaultCode || selected_FaultCode.label == "" || selected_FaultCode.label == null) {
    selectedFaultCode = "";
  } else {
    const PmFaultCodeSet = selected_FaultCode.label.split(":");
    selectedFaultCode = PmFaultCodeSet[0];
   // console.log("Status: ", Status[0])
  }

//selected_PmCaseCode
let selectedPmCaseCode;
  if (!selected_PmCaseCode || selected_PmCaseCode.label == "" || selected_PmCaseCode.label == null) {
    selectedPmCaseCode = "";
  } else {
    const PmCaseCodeSet = selected_PmCaseCode.label.split(":");
    selectedPmCaseCode = PmCaseCodeSet[0];
  
  }

  //selectedAction_Code
  let selectedActionCode;
  if (!selectedAction_Code || selectedAction_Code.label == "" || selectedAction_Code.label == null) {
    selectedActionCode = "";
  } else {
    const PmActionCodeSet = selectedAction_Code.label.split(":");
    selectedActionCode = PmActionCodeSet[0];
  }

  //selected_CustomerCode
  let selectedCustomerCode;
  if (!selected_CustomerCode || selected_CustomerCode.label == "" || selected_CustomerCode.label == null) {
    selectedCustomerCode = "";
  } else {
    const PmCustomerCodeSet = selected_CustomerCode.label.split(":");
    selectedCustomerCode = PmCustomerCodeSet[0];
  }

  //selected_Assign_To
  let selectedAssignTo;
  if (!selected_Assign_To || selected_Assign_To.label == "" || selected_Assign_To.label == null) {
    selectedAssignTo = "";
  } else {
    const PmAssignToSet = selected_Assign_To.label.split(":");
    selectedAssignTo = PmAssignToSet[0];
  }
  //selected_Originator
  let selectedOriginator;
  if (!selected_Originator || selected_Originator.label == "" || selected_Originator.label == null) {
    selectedOriginator = "";
  } else {
    const PmOriginatorSet = selected_Originator.label.split(":");
    selectedOriginator = PmOriginatorSet[0];
  }

//selected_Approver
  let selectedApprover;
  if (!selected_Approver || selected_Approver.label == "" || selected_Approver.label == null) {
    selectedApprover = "";
  } else {
    const PmApproverSet = selected_Approver.label.split(":");
    selectedApprover = PmApproverSet[0];
  }
  //selected_Planner
  let selectedPlanner;
  if (!selected_Planner || selected_Planner.label == "" || selected_Planner.label == null) {
    selectedPlanner = "";
  } else {
    const PmPlannerSet = selected_Planner.label.split(":");
    selectedPlanner = PmPlannerSet[0];
  }
  //selected_MeterId
  let selectedMeterId;
  if (!selected_MeterId || selected_MeterId.label == "" || selected_MeterId.label == null) {
    selectedMeterId = "";
  } else {
    const PmMeterIdSet = selected_MeterId.label.split(":");
    selectedMeterId = PmMeterIdSet[0];
  }
  //selected_PmLPMUOM
  let selectedPmLPMUOM;
  if (!selected_PmLPMUOM || selected_PmLPMUOM.label == "" || selected_PmLPMUOM.label == null) {
    selectedPmLPMUOM = "";
  } else {
    const PmPmLPMUOMSet = selected_PmLPMUOM.label.split(":");
    selectedPmLPMUOM = PmPmLPMUOMSet[0];
  }
  //Charge_Cost_Center
  let Chargecostcenter;
  if (!Charge_Cost_Center || Charge_Cost_Center.label == "" || Charge_Cost_Center.label == null) {
    Chargecostcenter = "";
  } else {
    const PmcostcenterSet = Charge_Cost_Center.label.split(":");
    Chargecostcenter = PmcostcenterSet[0];
  }
  //selected_Labor_Account
  let selectedLaborAccount;
  if (!selected_Labor_Account || selected_Labor_Account.label == "" || selected_Labor_Account.label == null) {
    selectedLaborAccount = "";
  } else {
    const PmLaborAccountSet = selected_Labor_Account.label.split(":");
    selectedLaborAccount = PmLaborAccountSet[0];
  }
//selected_Material_Account
let selectedMaterialAccount;

if (!selected_Material_Account || selected_Material_Account.label == "" || selected_Material_Account.label == null) {
  selectedMaterialAccount = "";
} else {
  const PmMaterialAccountSet = selected_Material_Account.label.split(":");
  selectedMaterialAccount = PmMaterialAccountSet[0];
}
//selected_Contract_Account
let selectedContractAccount;
if (!selected_Contract_Account || selected_Contract_Account.label == "" || selected_Contract_Account.label == null) {
  selectedContractAccount = "";
} else {
  const PmContractAccountSet = selected_Contract_Account.label.split(":");
  selectedContractAccount = PmContractAccountSet[0];
}
//Select Date 1
let date_1 = "";
if (UDFDate_1 == "" || UDFDate_1 == null) {
  date_1 = "";
} else {
  date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 2
let date_2 = "";
if (UDFDate_2 == "" || UDFDate_2 == null) {
  date_2 = "";
} else {
  date_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 3
let date_3 = "";
if (UDFDate_3 == "" || UDFDate_3 == null) {
  date_3 = "";
} else {
  date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 4
let date_4 = "";
if (UDFDate_4 == "" || UDFDate_4 == null) {
  date_4 = "";
} else {
  date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 5
let date_5 = "";
if (UDFDate_5 == "" || UDFDate_5 == null) {
  date_5 = "";
} else {
  date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 6
let date_6 = "";
if (UDFDate_6 == "" || UDFDate_6 == null) {
  date_6 = "";
} else {
  date_6 = Moment(UDFDate_6).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 7
let date_7 = "";
if (UDFDate_7 == "" || UDFDate_7 == null) {
  date_7 = "";
} else {
  date_7 = Moment(UDFDate_7).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 8
let date_8 = "";
if (UDFDate_8 == "" || UDFDate_8 == null) {
  date_8 = "";
} else {
  date_8 = Moment(UDFDate_8).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 9
let date_9 = "";
if (UDFDate_9 == "" || UDFDate_9 == null) {
  date_9 = "";
} else {
  date_9 = Moment(UDFDate_9).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}
//Select Date 10
let date_10 = "";
if (UDFDate_10 == "" || UDFDate_10 == null) {
  date_10 = "";
} else {
  date_10 = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
  ////console.log("Date1 ", date_1);
}

  //Check Img state
  let setDbImgRowIdUpdate;
  if (getDbImgRowId == "" || getDbImgRowId == null) {
    setDbImgRowIdUpdate = "";
  } else {
    setDbImgRowIdUpdate = getDbImgRowId;
  }
  let missingFields = [];

    var json_PmUpdate = {
      site_cd: site_ID,
      prm_mst_type: setTypePM.trim(),
      prm_mst_assetno: EmptyAsset.trim(),
      prm_mst_pm_grp:"",
      prm_mst_freq_code: PMfrequencyCode.trim(),
      prm_mst_desc: Short_Description.trim(),
      prm_mst_disable_flag: isCheckedFlag,
      prm_mst_cal_startdate: isCheckedPmDate,
      prm_mst_lpm_date: PMlPMDate,
      prm_mst_next_create: PMnextCreateDate,

      prm_det_chg_costcenter: selectedchargeCostcenter ?selectedchargeCostcenter.trim() :"",

      prm_mst_closed_loop: isCheckedLoop,
      prm_mst_auto_gen: isCheckedAutoGen,
      prm_mst_lpm_closed_date: PmlPMCloseddate,
      prm_mst_next_due: PmnextDueSate,
      prm_mst_lead_day: LeadDay.trim(),
      prm_mst_dflt_status: setStatus.trim(),
      prm_mst_plan_priority : SelectedplanPriority ? SelectedplanPriority.trim() : "",

      prm_det_work_type: SelectedPmWorkType ? SelectedPmWorkType.trim() : "",
      prm_det_work_class : selectedPmworkClass ? selectedPmworkClass.trim() : "",
      prm_det_work_grp: selectedworkGroup ? selectedworkGroup.trim() : "",
      //prm_det_project_id: selectedProjectId,
      prm_det_project_id: selectedProjectId ? selectedProjectId.trim() : "",
      prm_det_safety : isCheckedSafty,
      prm_det_note1: Note_desc ? Note_desc.trim(): "",
      prm_det_work_area: selectedworkArea ? selectedworkArea.trim() : "",
      prm_det_asset_level: selectedpmAssetLevel ? selectedpmAssetLevel.trim() : "",

      prm_mst_assetlocn: AssetLocation ? AssetLocation.trim() : "",

      prm_det_work_locn: workLocation ? workLocation.trim() :"",
      prm_mst_flt_code: selectedFaultCode ? selectedFaultCode.trim() :"",
      prm_det_cause_code:selectedPmCaseCode ? selectedPmCaseCode.trim() :"",
      prm_det_act_code: selectedActionCode ? selectedActionCode.trim() :"",
      prm_det_customer_cd :selectedCustomerCode ? selectedCustomerCode.trim() :"",
      wko_det_assign_to: selectedAssignTo ? selectedAssignTo.trim() :"",
      prm_det_originator: selectedOriginator ? selectedOriginator.trim() :"",
      prm_det_approver: selectedApprover ? selectedApprover.trim() :"",
      prm_det_planner : selectedPlanner ? selectedPlanner.trim() :"",
      prm_mst_meter_id: selectedMeterId ? selectedMeterId.trim() :"",
      prm_mst_lpm_usg : LpmUsage ? LpmUsage.trim() :"",
      prm_mst_lpm_uom: selectedPmLPMUOM ? selectedPmLPMUOM.trim() :"",
      prm_det_crd_costcenter : Chargecostcenter ? Chargecostcenter.trim() :"",
      prm_det_l_account: selectedLaborAccount ? selectedLaborAccount.trim() :"",
      prm_det_m_account : selectedMaterialAccount ? selectedMaterialAccount.trim() :"",
      prm_det_c_account: selectedContractAccount ? selectedContractAccount.trim() :"",

      prm_det_varchar1 : UDFText_1 ? UDFText_1.trim() : "",
      prm_det_varchar2 : UDFText_2 ? UDFText_2.trim() : "",
      prm_det_varchar3 : UDFText_3 ? UDFText_3.trim() : "",
      prm_det_varchar4 : UDFText_4 ? UDFText_4.trim() : "",
      prm_det_varchar5 : UDFText_5 ? UDFText_5.trim() : "",
      prm_det_varchar6 : UDFText_6 ? UDFText_6.trim() : "",
      prm_det_varchar7 : UDFText_7 ? UDFText_7.trim() : "",
      prm_det_varchar8 : UDFText_8 ? UDFText_8.trim() : "",
      prm_det_varchar9 : UDFText_9 ? UDFText_9.trim() : "",
      prm_det_varchar10 : UDFText_10 ? UDFText_10.trim() : "",
      prm_det_varchar11 : UDFText_11 ? UDFText_11.trim() : "",
      prm_det_varchar12 : UDFText_12 ? UDFText_12.trim() : "",
      prm_det_varchar13 : UDFText_13 ? UDFText_13.trim() : "",
      prm_det_varchar14 : UDFText_14 ? UDFText_14.trim() : "",
      prm_det_varchar15 : UDFText_15 ? UDFText_15.trim() : "",
      prm_det_varchar16 : UDFText_16 ? UDFText_16.trim() : "",
      prm_det_varchar17 : UDFText_17 ? UDFText_17.trim() : "",
      prm_det_varchar18 : UDFText_18 ? UDFText_18.trim() : "",
      prm_det_varchar19 : UDFText_19 ? UDFText_19.trim() : "",
      prm_det_varchar20 : UDFText_20 ? UDFText_20.trim() : "",

      prm_det_numeric1 : UDFNumber_1 ? UDFNumber_1.trim() : "",
      prm_det_numeric2 : UDFNumber_2 ? UDFNumber_2.trim() : "",
      prm_det_numeric3 : UDFNumber_3 ? UDFNumber_3.trim() : "",
      prm_det_numeric4 : UDFNumber_4 ? UDFNumber_4.trim() : "",
      prm_det_numeric5 : UDFNumber_5 ? UDFNumber_5.trim() : "",
      prm_det_numeric6 : UDFNumber_6 ? UDFNumber_6.trim() : "",
      prm_det_numeric7 : UDFNumber_7 ? UDFNumber_7.trim() : "",
      prm_det_numeric8 : UDFNumber_8 ? UDFNumber_8.trim() : "",
      prm_det_numeric9 : UDFNumber_9 ? UDFNumber_9.trim() : "",
      prm_det_numeric10 : UDFNumber_10 ? UDFNumber_10.trim() : "",

      prm_det_datetime1 : date_1 ? date_1.trim() : date_1,
      prm_det_datetime2 : date_2 ? date_2.trim() : date_2,
      prm_det_datetime3 : date_3 ? date_3.trim() : date_3,
      prm_det_datetime4 : date_4 ? date_4.trim() : date_4,
      prm_det_datetime5 : date_5 ? date_5.trim() : date_5,
      prm_det_datetime6 : date_6 ? date_6.trim() : date_6,
      prm_det_datetime7 : date_7 ? date_7.trim() : date_7,
      prm_det_datetime8 : date_8 ? date_8.trim() : date_8,
      prm_det_datetime9 : date_9 ? date_9.trim() : date_9,
      prm_det_datetime10 : date_10 ? date_10.trim() : date_10,

      audit_user: emp_mst_login_id.trim(),
      prm_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(), 

      SingleImguploadStatus:imguploadStatus,
      ImguploadRefStatus:imguploadRefStatus ? imguploadRefStatus :"EMPTY",

      ImgGetDbImgRowId: setDbImgRowIdUpdate,
      ImgUpload: imageSelect,
    //  SpecialOdrResult: SpecialOdrResult,

      removedRefItems: removedRefItems,
      RowID: RowID,
      PM_no: PM_no,
      selectedPdfFiles:selectedPdfFiles,

   
    };

   // console.log("json_workorder_update____",json_PmUpdate);
    for (let i = 0; i < PmMandatoryFiled.length; i++) {
      const item = PmMandatoryFiled[i];
      const fieldValue = json_PmUpdate[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break;
      }
    }
    if (missingFields.length > 0) {
      Swal.close();
    
      const errorMessage = `Please fill the required field: ${missingFields}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      return;
    
    } else {
    try {
      const response = await httpCommon.post(
        "/update_pm_form_data.php",
        JSON.stringify(json_PmUpdate)
      );
      console.log("response____update",response);

      if (response.data.status === "SUCCESS") {
        
        if (selectedPdfFiles.length > 0) {
          const formData = new FormData();
          for (let i = 0; i < selectedPdfFiles.length; i++) {
            formData.append("files[]", selectedPdfFiles[i]);
          }
          formData.append("site_cd", site_ID);
          formData.append("RowID", RowID);
           formData.append("RefImgUploadStatus", imguploadRefStatus);
          formData.append("audit_user", emp_mst_login_id.trim());
        
          try {
          
            const response = await httpCommon.post(
              "/insert_pm_form_reference_multipalImgUpload.php",
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data' // Ensure proper content type
                }
            }
            );
          //  console.log("upload_mltipal____",response);
            if (response.data.status == "SUCCESS") {
              Swal.close();
              Swal.fire({
                icon: "success",
                customClass: {
                  container: "swalcontainercustom",
                },
                title: response.data.status,
                text: response.data.message,
              }).then(() => {
               // navigate(`/dashboard/work/order`);
               navigate(`/dashboard/PreventiveSetup`, {
                state: {
                  currentPage,
                  selectedOption, 
                  selectedRowIdBack:RowID,
                },
              });
              });
            }
          } catch (error) {
            console.log("error__", error);
            //Handle error  WorkOrderNo
          }
        } else {
          Swal.close();
          Swal.fire({
            icon: "success",
            customClass: {
              container: "swalcontainercustom",
            },
            title: response.data.status,
            text: response.data.message,
            timer: swalCloseTime, // Auto-close after 3 seconds
            timerProgressBar: true, // Optional: Shows a progress bar
            willClose: () => {
              // Navigate to the desired page when the modal closes
              navigate(`/dashboard/PreventiveSetup`, {
                state: {
                  currentPage,
                  selectedOption,
                  selectedRowIdBack:RowID,
                },
              });
            },
          }).then(() => {
            if (response.data.status === "SUCCESS") {
             // navigate(`/dashboard/work/order`);
             navigate(`/dashboard/PreventiveSetup`, {
              state: {
                currentPage,
                selectedOption,
                selectedRowIdBack:RowID,
              },
            });
            }
          });
        }
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          customClass: {
            container: "swalcontainercustom",
          },
          title: "Oops...",
          text: response.data,
        });
      }
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        customClass: {
          container: "swalcontainercustom",
        },
        title: "Oops Data Not Updated...",
        text: error,
      });
    }
  }
  };
 
  // Save button // update button click funcation
  const onClickChange = (event) => {
    event.preventDefault();
    
    if (selected_PmType == "" || selected_PmType == null) {
      setIsPmTypeStatusEmpty(true);
      const errorMessage = "Please fill the required field Pm Type is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");

    }else if(Asset_No == "" || Asset_No == null){
      setIsAssetNoEmpty(true);
      const errorMessage = "Please fill the required field Asset No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");

    }else if(selected_FrequencyCode == "" || selected_FrequencyCode == null){
      setIsFrequencyCodeEmpty(true);
      const errorMessage = "Please fill the required field Frequency Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");

    }else if(Short_Description == "" || Short_Description == null){
      setIsDescriptionEmpty(true);
      const errorMessage = "Please fill the required field Description is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");

    }else if(selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center == null){
      setIsAssetCostCenterEmpty(true);
      const errorMessage = "Please fill the required field Charge Cost Center is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
     
    }else if(selected_Status == "" || selected_Status == null){
      setIsDefaultStatusEmpty(true);
      const errorMessage = "Please fill the required field Default WO Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      
    }else if(selected_PlanPriority == "" || selected_PlanPriority == null || selected_PlanPriority.label == ""){
      setIsPlanPriorityEmpty(true);
      const errorMessage = "Please fill the required field Plan Priority is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");

    }else if(selected_WorkGroup == "" || selected_WorkGroup == null){
      setIsWorkGroupEmpty(true);
      const errorMessage = "Please fill the required field Work Group is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
     
    } else {
      if (Button_save === "Save") {
        New_Pm_Create();
    
      } else if (Button_save === "Update") {
        Update_PM();
      }
    }
   
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const onClickCancel = (event) => {

    event.preventDefault();
    if (isFormFiled) {
    Swal.fire({
      title: "Discard changes?",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
      confirmButtonText: "Yes",
      denyButtonText: `No`,
      focusCancel: true 
    }).then((result) => {
      
      if (result.isConfirmed) {
      
        onClickChange(event);
      } else if (result.isDenied) {
        navigate(`/dashboard/PreventiveSetup/Maintenance`, {
            state: {
              currentPage,
              selectedOption,
              comeBack:"Come_Back_cancel",
              selectedRowIdBack:RowID,
            },
          });
        setIsFormFiled(false);
       // setAssetSubModuleBtn("");   // Empty SubModule state btn click value 
      }
    });
  }else{
    navigate(`/dashboard/PreventiveSetup/Maintenance`, {
      state: {
        currentPage,
        selectedOption,
        comeBack:"Come_Back_cancel",
        selectedRowIdBack:RowID,
      },
    });
    //setAssetSubModuleBtn("");   // Empty SubModule state btn click value 
  }

 
  };

  // Status Audit PopUp

  const formatDuration = (duration) => {
    // const seconds = Math.floor(duration % 60);
    const minutes = Math.floor(duration % 60);
    const hours = Math.floor((duration % 1440) / 60);
    const days = Math.floor(duration / 1440);

    if (days > 0) {
      return `${days}d: ${hours}h: ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h: ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "";
    }
    // return `${days}d: ${hours}h: ${minutes}m`;
  };
  const getsteps = async () => {
    // console.log("enter_getSteps___");
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false , customClass: {
      container: "swalcontainercustom",
    }, });
    Swal.showLoading();

    try {

      const responseJson = await httpCommon.get(
        `/get_assetmaster_statusaudit.php?site_cd=${site_ID}&RowID=${RowID}`
      );
      // console.log("responseJson___audit",responseJson);
      if (responseJson.data.status === "SUCCESS") {
        // console.log('get_workordermaster_statusaudit', responseJson.data.data)

        let Status = responseJson.data.data.map((item, index) => ({
          label: item.ast_sts_desc,
          label1: item.ast_aud_status,
          label2: item.emp_mst_name,
          label3: item.audit_user,
          label4: `${new Date(item.ast_aud_start_date.date).toLocaleString(
            "default",
            {
              weekday: "short",
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }
          )}`,
          label5: formatDuration(item.duration),
          step: index + 1,
        }));
        setsteps(Status);

        Swal.close();
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data.message,
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };
  const StatushandleShow = () => {
    setStatusShow(true);
    getsteps();
  };

  const handleImageChange2 = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // const base64String = reader.result.split(',')[1];
        const base64String2 = reader.result.split(",")[1];

        const base64String = reader.result;

        const fileName = file.name;
        setImagePreview(base64String);
        // Set the state with the base64 string and file name
        setimageComment({
          base64: base64String2,
          fileName: fileName,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCmmnt = async () => {
    Swal.fire({ title: "Loading.... !", allowOutsideClick: false });
    Swal.showLoading();

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_name = localStorage.getItem("emp_mst_name");

    const inputValue = messageRef.current.value;

    const newComment = {
      // Add other properties as needed
      audit_user: emp_mst_login_id, // Replace with the actual user
      audit_date: {
        date: Moment().format("YYYY-MM-DD HH:mm:ss"),
        timezone_type: 3,
        timezone: "UTC",
      },
      wko_ls11_sts_upd: inputValue,
      attachment:
        imageComment && imageComment.base64 ? imageComment.base64 : null,
    };
    setAllComment((prevComments) => [...prevComments, newComment]);

    var json_workorder = {
      site_cd: site_ID,
      RowId: RowID,
      commentMsg: inputValue,
      Emp_name: emp_mst_name,
      Emp_login_Name: emp_mst_login_id,
      orderNo: WorkOrderNo,
      ImgUpload: imageComment,
    };

    try {
      const response = await httpCommon.post(
        "/insert_comment.php",
        JSON.stringify(json_workorder)
      );
      console.log("json_workordercommet Data", response);

      if (response.data.status === "SUCCESS") {
        console.log("responseJson", response.data.ROW_ID);
        Swal.close();
        //  setCommentShow(false);

        if (messageRef.current) {
          messageRef.current.value = "";
        }
        setImagePreview("");
        setimageComment("");
        scrollChatToBottom();

      
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data,
        });
      }
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Oops get_WorkOrder_select...",
        text: error,
      });
    }

    imageComment(null);
  };
  const Refreshdatapopup = () => {
  
  };
  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollChatToBottom();
  }, [AllCommnet]);
  
  const handleSelectedFaultCode = (selectedOption) => {
    const newValue =
      selectedOption && selectedOption.value ? selectedOption : null;
   // setDescription(newValue ? newValue.value : null);
  };

 
  const toggleDiv = () => {
    setIsOpenWork(!isOpenWork);
  };

  const toggleDivAssetLocation = () => {
    setIsOpenAsset(!isOpenAsset);
  };
  const toggleDivWorkActivity = () => {
    setIsOpenWorkActivity(!isOpenWorkActivity);
  };
  
  const toggleDivAssetMeter = () => {
    setIsOpenAssetMeter(!isOpenAssetMeter);
  };

  const toggleDivCostCenter = () => {
    setIsOpenCostCenter(!isOpenCostCenter);
  };
  const toggleDivUDFText = () => {
    setIsOpenUdfText(!isOpenUdfText);
  };
  const toggleDivUDFNumeric = () => {
    setIsOpenUdfNumeric(!isOpenUdfNumeric);
  };
  const toggleDivUDFDateTime = () => {
    setIsOpenUdfDateTime(!isOpenUdfDateTime);
  };

// New Funcation added 16-04-2024
const handleCheckboxChangeFlag = (event) => {
    setIsCheckedFlag(event.target.checked); 
    setIsFormFiled(true);
  };
 
  const handleCheckboxChangePmDate = (event) => {
    setIsCheckedPmDate(event.target.checked); 
    setIsFormFiled(true);
  };

  const handleCheckboxAutoGen = (event) => {
    setIsCheckedAutoGen(event.target.checked); 
    setIsFormFiled(true);
  };
  const handleCheckboxChangeSafty = (event) => {
    setIsCheckedSafty(event.target.checked); 
    setIsFormFiled(true);
  };
  // onclick funcation 
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Check for specific date or null
    
    if (dateString === "1900-01-01 00:00:00" || dateString === null) {
      
      return (
        <>
        <span style={{width: "110px", display: "inline-block"}}>
        01-01-1900 00:00
        </span>
        <Tooltip
          title="Due Date Not Set"
          placement="top"
          arrow
        >
          <span className="SpecialDateClass" style={{ color: '#fff',width: "25px", textAlign:'center',display: "inline-block"  }}>
        
           0
          </span>
        </Tooltip>
        </>
      );
    }

  
  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return null; // Return null to render nothing
  }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
    
    
    // Set the time zone to UTC
    const today = new Date().toLocaleString("en-US", { timeZone: "UTC" });
  
    // Calculate the time difference in days
    const timeDifference = date - new Date(today);
    const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    let textColor = "black";
    let textClass = "";
    let text = "";
  
    // Update styles based on the total number of days
    if (totalDays > 0) {
      textColor = "#fff";
      textClass = "FutureDateClass";
      text = "Days Left to Due Date";
    } else if (totalDays <= 0) {
      textColor = "#fff";
      textClass = "PastDateClass";
      text = "Days Past Due";
    }
  
    return (
      <span >
        <Tooltip
          title={` ${Math.abs(totalDays)} ${text} `}
          placement="top"
          arrow
        >
          <span
            className={`DueDtCls ${textClass}`}
            style={{ width: "25px", display: "inline-block", textAlign:'center', color: textColor}}
          >
            {Math.abs(totalDays)}
          </span>
        </Tooltip>
      </span>
    );
  };

  const handleNumericInputChange = (e, setterFunction) => {
    let { value } = e.target;
    if (value.length >= 17) {
      return; 
    }
    value = value.replace(/[^0-9.]/g, '');
    value = value.slice(0, 16); 
    const parts = value.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1];
      if ( decimalPart === '') { 
        integerPart += '.';
        decimalPart = '';
      } else if (decimalPart && decimalPart.length >= 4) {
        decimalPart = decimalPart.slice(0, 4);
      }else{
        let integerPart2 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (integerPart2.length > 11) {
          integerPart2 = integerPart2.slice(0, 12) + '.' + integerPart2.slice(12, 16);
        }
        let decimalPart2 = parts[1] ? parts[1].slice(0, 4) : '';
        const formattedValue2 = decimalPart2 ? `${integerPart2}.${decimalPart2}` : integerPart2;
        setterFunction(formattedValue2);
     //   setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
   // setErrorField(null);
   // setErrorField(null);
  };
  const fetchAssignEmpList = useCallback(async () => {  // Assign emp list
    // setIsLoading(true);
     try {
      
       const response = await httpCommon.post(
         `/get_work_order_assign_to_list.php?site_cd=${site_ID}`
       );
       if(response.data.status === "SUCCESS"){
         setEmpAssign(response.data.data);
       }
     
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   }, [site_ID]);

  const handleEditClickAssign = () => {
    setModalOpenAssign(true);
    fetchAssignEmpList();
  };
  const handelAssignCancelClick = () =>{
    setSelected_Assign_To("");
  }
  const AssignStatushandleshow = () => {
    setAssignStatusShow(true);
    getAssignTosteps();
  };

  const getAssignTosteps = async () => {
    // console.log("enter_getSteps___");
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    // Swal.showLoading();

    try {
      let responseJson;
      if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_pm_assign_history.php?site_cd=${site_ID}&RowID=${completeRowID}`
        );
      } else if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_pm_assign_history.php?site_cd=${site_ID}&RowID=${closeRowID}`
        );
      } else {
        responseJson = await httpCommon.get(
          `/get_pm_assign_history.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      }
    //  console.log("responseJson___RowID_Asign__",responseJson);
      if (responseJson.data.status === "SUCCESS") {
        let AssignStatus = responseJson.data.data.map((item, index) => {
          let date = new Date(item.audit_date.date);
          let formattedDate = date.toLocaleDateString("en-GB");
          let formattedTime = date.toLocaleString("default", {
            hour: "numeric",
            minute: "numeric",
            hour12: true, // 3:37 PM
          });
          let formattedWeekday = date.toLocaleString("default", {
            weekday: "short",
          }); // Fri

          return {
            label: item.prm_ls7_emp_id,
            label1: item.column1,
            label4: `${formattedWeekday} ${formattedDate} ${formattedTime}`,
            label5: formatDuration(item.duration),
            step: index + 1,
          };
        });

        setAssignStatusOther(AssignStatus);

        Swal.close();
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data.message,
        });
      }
    } catch (error) {
      Swal.close();
      console.log("error", error);
    }
  };
  function handleCloseModalAssign() {
    setModalOpenAssign(false);
    Swal.close();
  }

  const handleTableRowClick = (empId2, empName2) => {
    //  setSelected_Assign_To(`${empId2} : ${empName2}`);
    const labelValue = `${empId2} : ${empName2}`;  // Concatenate empId2 and empName2
  
  setSelected_Assign_To({
    label: labelValue,
  });
      
      handleCloseModalAssign();
      setIsFormFiled(true);
    };
  const getStatusColor = (status) => {
    switch (status) {
      case "ONS":
        return '#28B463';
      case "ONC":
        return '#F1C40F';
      case "OFS":
        return '#E74C3C';
      case "ONL":
        return '#95A5A6';
      default:
        return '#95A5A6';
    }
  };



  return (
    <>
      <Helmet>
      <title>
          {RowID
            ? "CMMS System"
            : "CMMS System"}
        </title>
        <meta name="description" content="Create New PM" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div
          className="CustomBreadAssetSave asset"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
            height: "60px !important",
          }}
        >
          <CustomBreadcrumbs
            // heading="Create Work Order"
            heading={
                RowID
                  ? `Edit ${PM_no ? PM_no : ""} PM Request`
                  : "Create New PM Request"
              }
            links={[
              {
                name: "PM",
              },
              { name: RowID ? "Update" : "Create" },
            ]}
            action={
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                        <Button
                          component={RouterLink}
                          onClick={onClickChange}
                          variant="contained"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                          disabled={Status.some(
                            (item) =>
                              item.key ===
                                (
                                  selected_Status?.label?.split(" : ")[2] ?? ""
                                ).trim() && item.key === "CLOSE"
                          )}
                        >
                          {Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          startIcon={<Iconify icon="jam:close" />}
                          onClick={onClickCancel}
                        >
                          Close
                        </Button>
                      </div>
                </div>
                 }
            
            sx={{ mb: { xs: 3, md: 5 } }}
          />
           <Tabs
            value={Tabvalue}
            onChange={handleChange}
            aria-label="Basic tabs"
            defaultValue={0}
            sx={{
                background: "#8080800d",
                borderRadius: "5px",
                marginTop:"10px",
              '& .MuiTab-root': {
                textTransform: 'none',
              },
              '& .Mui-selected': {
                color: '#000',
                fontWeight: 'bold',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'blue',
              },
            }}
          >
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="fluent-mdl2:pen-workspace"
                    style={{ marginRight: '5px', width: '17px' }}
                  />
                  Schedule Master
                </div>
              }
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="akar-icons:info-fill"
                    style={{ marginRight: '4px' }}
                  />
                  Schedule Detail
                </div>
              }
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="material-symbols:date-range-outline"
                    style={{ marginRight: '4px' }}
                  />
                 Planning
                </div>
              }
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="icon-park-outline:list"
                    style={{ marginRight: '4px' }}
                  />
                  Checklist
                </div>
              }
            />
           
              <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="codicon:references"
                    style={{ marginRight: '4px' }}
                  />
                  Attachment
                </div>
              }
            />
          </Tabs>
       
        </div>
        <div>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* toggle view strting from here */}
              <Box
                role="tabpanel"
                hidden={Tabvalue !== 0}
                >
              <div
                className="MainOrderFromGd"
                style={{ backgroundColor: "white" }}
              >
                <Grid container spacing={0}>
                  <Grid xs={12} md={12}>
                    <Card sx={{ padding: "10px 24px 15px 24px" }}>
                      
                        <Grid container spacing={0}>
                          <Grid xs={12} md={10}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                            <Grid item xs={4}>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2" 
                                 className="Requiredlabel"
                                >
                                  {findCustomizeLabel("prm_mst_type") ||
                                    "PM Type"}
                                </Typography>
                                    
                                <Autocomplete
                                    options={Pm_type}
                                    value={(selected_PmType?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setselected_PmType(value);
                                        setIsFormFiled(true);
                                        
                                      }}
                                    disableAnimation
                                    disabled={!!RowID}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small" 
                                          className={`Extrasize ${isPmTypeStatusEmpty ? "errorEmpty" : ""} ${selected_PmType?.label ? "highlightBorder" : ""}`}
                                          style={{ width: "100%" }}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                              </Stack>

                              {selected_PmType?.label === 'Asset' && (
                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                {findCustomizeLabel("prm_mst_assetno") ||
                                "Asset No"}

                                </Typography>
                                <div ref={assetNoAutocompleteRef}>
                                <CustomTextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    size="small"
                                    className={`ExtrasizeDisable ${
                                      isAssetNoEmpty ? "errorEmpty" : ""
                                    }`}
                                    disabled={!!RowID}
                                    fullWidth
                                    value={Asset_No || ""}
                                    placeholder="Select..."
                                    rightIcons={[
                                    <Iconify  
                                        icon="material-symbols:close"
                                        onClick={(e) => {
                                          if (!RowID) {
                                          e.preventDefault();
                                          handleCancelClick();
                                          setIsAssetNoEmpty(false);
                                          setIsFormFiled(true);
                                          }
                                        }}
                                       
                                    />,
                                    <Iconify
                                        icon="tabler:edit"
                                        
                                        onClick={(e) => {
                                          if (!RowID) {
                                          e.preventDefault();
                                          handleEditClick();
                                          setIsAssetNoEmpty(false);
                                          setIsFormFiled(true);
                                          }
                                        }}
                                    />,
                                    ]}
                                />
                                </div>
                                </Stack>
                              )}
                              {selected_PmType?.label === 'Group' && (
                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2" 
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("prm_mst_pm_grp") ||
                                    "PM Group"}
                                </Typography>
                                    
                                <Autocomplete
                                    options={pmGroup}
                                    value={(selected_pmGroup?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      disabled={!!RowID}
                                      onChange={(event, value) => {
                                        setSelected_pmGroup(value);
                                        PmGroupSelectedValue(value);
                                        setIsFormFiled(true);
                                      }}
                                    disableAnimation
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small" 
                                          className={`Extrasize ${isPmTypeStatusEmpty ? "errorEmpty" : ""} ${selected_pmGroup?.label ? "highlightBorder" : ""}`}
                                          style={{ width: "100%" }}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                              </Stack>
                              )}
                             <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2"
                                 className="Requiredlabel"
                                >
                                  {findCustomizeLabel("prm_mst_freq_code") ||
                                    "Frequency Code"}
                                </Typography>
                                <div ref={frequencyCodecompleteRef}>
                                    <CustomTextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        size="small"
                                        className={`ExtrasizeDisable ${
                                          isFrequencyCodeEmpty ? "errorEmpty" : ""
                                        }`}
                                        
                                        fullWidth
                                       
                                        value={(selected_FrequencyCode?.label || "")
                                          .split(" : ")
                                          .slice(0, 2)
                                          .join(" : ")}
                                        placeholder="Select..."
                                        rightIcons={[
                                        <Iconify  
                                            icon="material-symbols:close"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleCancelClickFrequency();
                                              setIsFrequencyCodeEmpty(false);
                                              setIsFormFiled(true);
                                            }}
                                        />,
                                        <Iconify
                                            icon="tabler:edit"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleEditClickFrequency();
                                              setIsFrequencyCodeEmpty(false);
                                              setIsFormFiled(true);
                                            }}
                                        />,
                                        ]}
                                      />
                                  </div>
                             
                              </Stack>
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2"
                                 className="Requiredlabel"
                                >
                                  {findCustomizeLabel("prm_mst_desc") ||
                                    "Description"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea "
                                  minRows={7}
                                  value={Short_Description}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 1000) {
                                      setShort_Description(value);
                                      setIsFormFiled(true);
                                    }
                                   
                                    setIsDescriptionEmpty(false);
                                  }}
                                 
                                //  className="TxtAra"
                                  className={`Extrasize ${
                                    isDescriptionEmpty
                                      ? "errorEmpty"
                                      : "TxtAra pm"
                                  }`}
                                  style={{ resize: 'none', width: '100%' }}
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                 <Stack spacing={1} sx={{ pb: 1.5, pt:3.5 }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                        <Typography variant="subtitle2"
                                         className={findCustomizerequiredLabel(
                                          "prm_mst_disable_flag"
                                        )}
                                        >
                                        {findCustomizeLabel("prm_mst_disable_flag") || "Disable Flag"}
                                        </Typography>
                                        <Checkbox
                                        checked={isCheckedFlag}
                                        onChange={handleCheckboxChangeFlag}
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                    </Stack>
                                </Stack>

                                <Stack spacing={1} sx={{ pb: 1.5, pt:3 }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                 
                                    <Typography variant="subtitle2"
                                     className={findCustomizerequiredLabel(
                                      "prm_mst_cal_startdate"
                                    )}
                                    >
                                    {findCustomizeLabel("prm_mst_cal_startdate") ||
                                      "PM Schedule Date"}
                                  </Typography>
                                    <Checkbox
                                    checked={isCheckedPmDate}
                                    onChange={handleCheckboxChangePmDate}
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                    
                                </Stack>
                                </Stack>
                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                   <Typography variant="subtitle2"
                                   className={findCustomizerequiredLabel(
                                    "prm_mst_lpm_date"
                                  )}
                                  >
                                    {findCustomizeLabel("prm_mst_lpm_date") ||
                                      "LPM Date"}
                                  </Typography>
                                  

                                    <AntDatePicker
                                        value={LPMDate ? dayjs(LPMDate) : null}
                                        format="DD/MM/YYYY" 
                                        placeholder="DD/MM/YYYY"
                                        onChange={handleLPMDateChange}
                                        
                                        allowClear={false}
                                      
                                       
                                      />

                                </Stack>
                                   <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "prm_mst_next_create"
                                    )}
                                    >
                                        {findCustomizeLabel("prm_mst_next_create") ||
                                        "Next Create Date"}
                                    </Typography>
                                    
                                       <AntDatePicker
                                        value={NextCreateDate ? dayjs(NextCreateDate) : null}
                                        format="DD/MM/YYYY" 
                                        placeholder="DD/MM/YYYY"
                                         disabled
                                        onChange={(newDate) => {
                                          if (newDate && newDate.isValid()) {
                                            const nativeDate = newDate.toDate();
                                            setNextCreateDate(nativeDate);
                                            
                                          } else {
                                            setNextCreateDate(null);
                                          }
                                         // setErrorField(null);
                                          setIsFormFiled(true);
                                        }}
                                        allowClear={false}
                                      
                                      />
                                    </Stack>
                                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                                        <Typography variant="subtitle2"
                                          className="Requiredlabel"
                                        >
                                        {findCustomizeLabelDet("prm_det_chg_costcenter") ||
                                            "Charge Cost Center"}
                                        </Typography>
                                        <Autocomplete 
                                        options={Charge_Cost_Center}
                                        value={selected_Charge_Cost_Center?.label ?? ""}
                                        onChange={(event, value) => {
                                            setSelected_Charge_Cost_Center(value || null);
                                            setIsAssetCostCenterEmpty(false);
                                            setIsFormFiled(true);
                                        
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            size="small"
                                            placeholder="Select..."
                                            variant="outlined"
                                            className={`Extrasize ${
                                                isAssetCostCenterEmpty
                                                ? "errorEmpty"
                                                : ""
                                            }`}
                                            fullWidth // Make it full-width
                                            />
                                        )}
                                        />
                                    </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Stack spacing={1} sx={{ pb: 1.5, pt:3.5 }}>
                                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                   
                                    <Typography variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "prm_mst_closed_loop"
                                    )}
                                    >
                                    {findCustomizeLabel("prm_mst_closed_loop") ||
                                      "Closed Loop?"}
                                  </Typography>
                                    <Checkbox
                                    checked={isCheckedLoop}
                                    onChange={handleCheckboxChangeLoop}
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                  
                                    </Stack>
                                </Stack>
                                <Stack spacing={1} sx={{ pb: 1.5,pt:3 }}>
                                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                    
                                    <Typography variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "prm_mst_auto_gen"
                                    )}
                                    >
                                    {findCustomizeLabel("prm_mst_auto_gen") ||
                                      "Auto Gen Flag"}
                                  </Typography>
                                    <Checkbox
                                    checked={isCheckedAutoGen}
                                    onChange={handleCheckboxAutoGen}
                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                    
                                    </Stack>
                                </Stack>
                                
                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                   <Typography variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "prm_mst_lpm_closed_date"
                                    )}>
                                    {findCustomizeLabel("prm_mst_lpm_closed_date") ||
                                      "LPM Closed Date"}
                                  </Typography>
                                
                                    <AntDatePicker
                                      value={LPMClosedDate ? dayjs(LPMClosedDate) : null}
                                      format="DD/MM/YYYY" 
                                      placeholder="DD/MM/YYYY"
                                      onChange={handleLPMCloseDateChange}
                                    
                                      allowClear={false}
                                    
                                    />
                                   </Stack>
                                   <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "prm_mst_next_due"
                                    )}
                                    >
                                      {findCustomizeLabel("prm_mst_next_due") || "Next Due"}
                                    </Typography>

                                    <Grid container alignItems="center">
                                      <Grid item xs={10}>
                                        <AntDatePicker
                                          value={NextDueSate && dayjs(NextDueSate).isValid() ? dayjs(NextDueSate) : null}
                                          format="DD/MM/YYYY" 
                                          placeholder="DD/MM/YYYY"
                                          onChange={handleNextDueDateChange}  
                                          // onChange={(newDate) => {
                                          //   if (newDate && newDate.isValid()) {
                                          //     const nativeDate = newDate.toDate();
                                          //     setNextDueDate(nativeDate);
                                          //   } else {
                                          //     setNextDueDate(null);
                                          //   }
                                          //   // setErrorField(null);
                                          //   setIsFormFiled(true);
                                          // }}
                                        
                                          allowClear={false}
                                          style={{ width: '100%' }} 
                                        />

                                      </Grid>
                                     
                                      <Grid item xs={2} style={{ textAlign: 'center' }}>
                                        <Typography variant="body2">
                                          {formatDate(NextDueSate) || null}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Stack>

                                 <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2"
                                  className={findCustomizerequiredLabel(
                                    "prm_mst_lead_day"
                                  )}
                                >
                                  {findCustomizeLabel("prm_mst_lead_day") ||
                                    "Lead Day"}
                                </Typography>
                                <TextField
                                  name="name"
                                  size="small"
                                  type="number" 
                                  value={LeadDay}
                                  onChange={handleLeadDayChange}
                                  onBlur={handleLeadDayBlur}
                                  className="customeInputfiled"
                                 
                                />
                              </Stack>
                            </Grid>
                            
                            </Grid>
                            </Box>
                            {/* ************************************* img img mobile ******************************************* */}
                            <div className="col-md-2 mobileImgversion">
                                                <div className="row">
                                                  <div className="row ImgShowMobile">
                                                    <div>
                                                      <label htmlFor="upload-button">
                                                        {getDbImg && getDbImg.length > 0 ? (
                                                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                          {/* File Display (Icon or Image) */}
                                                          {getDbImg[0].file_name.toLowerCase().endsWith(".pdf") ? (
                                                            <FontAwesomeIcon
                                                              icon={faFilePdf}
                                                              onClick={() => openPDFInNewTab(getDbImg[0].attachment)}
                                                              style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                              className="fntpdf"
                                                            />
                                                          ) : getDbImg[0].file_name.toLowerCase().endsWith(".docx") ? (
                                                            <FontAwesomeIcon
                                                              icon={faFileWord}
                                                              onClick={() => openDocxInNewTab(getDbImg[0].attachment)}
                                                              style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                              className="fntdocx"
                                                            />
                                                          ) : getDbImg[0].file_name.toLowerCase().endsWith(".php") ? (
                                                            <FontAwesomeIcon
                                                              icon={faFileCode}
                                                              onClick={() => openPhpInNewTab(getDbImg[0].attachment)}
                                                              style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                              className="fntphp"
                                                            />
                                                          ) : getDbImg[0].file_name.toLowerCase().endsWith(".log") ? (
                                                            <FontAwesomeIcon
                                                              icon={faFileAlt}
                                                              onClick={() => openLogInNewTab(getDbImg[0].attachment)}
                                                              style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                              className="fntlog"
                                                            />
                                                          ) : getDbImg[0].file_name.toLowerCase().endsWith(".xlsx") ? (
                                                            <FontAwesomeIcon
                                                              icon={faFileExcel}
                                                              onClick={() => openXlsxInNewTab(getDbImg[0].attachment)}
                                                              style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                              className="fntxlsx"
                                                            />
                                                          ) : getDbImg[0].file_name.toLowerCase().endsWith(".txt") ? (
                                                           <span
                                                                   style={{
                                                                     fontSize: "14px",
                                                                     fontWeight: 600,
                                                                   }}
                                                                 >
                                                                 File preview not supported.
                                                               </span>
                                                         ) :  (
                                                            <img
                                                              src={
                                                                getDbImg[0].attachment
                                                                  ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}`
                                                                  : ""
                                                              }
                                                              className="imgCurPont"
                                                              alt="File Thumbnail"
                                                              onClick={openSaveImg}
                                                              style={{
                                                                width: "auto",
                                                                height: "150px",
                                                                cursor: "pointer",
                                                              }}
                                                            />
                                                          )}
                                                        
                                                          {/* Delete Button */}
                                                          <div className="col btnCenter">
                                                          <button
                                                            type="button"
                                                            className="btn dlt"
                                                            
                                                            onClick={() => {
                                                              setIsFormFiled(true);
                                                              handleDeleteImgApi(getDbImg[0].RowID);
                                                            }}
                                                            style={{
                                                              display: "flex",
                                                              alignItems: "center",
                                                              justifyContent: "center",
                                                              marginTop: "15px", // Adds space between the file and the delete button
                                                            }}
                                                          >
                                                            <Iconify icon="fluent:delete-48-filled" style={{ fontSize: "24px" }} />
                                                            Delete
                                                          </button>
                                                          </div>
                                                        </div>
                                                        ) : image?.preview ? (
                                                          <div>
                                                          {/* If the file is an image, show the image preview */}
                                                          {image.raw?.type?.startsWith("image/") ? (
                                                            <img
                                                              src={image.preview}
                                                              alt="preview"
                                                              className="imgCurPont"
                                                              onClick={openSaveImg}
                                                              style={{ width: "200px", height: "180px", cursor: "pointer" }} // Adjust size as needed
                                                            />
                                                          ) : (
                                                            // Handle non-image files (PDF, DOCX, XLSX, etc.)
                                                            <div>
                                                              {image.raw?.name?.toLowerCase().endsWith(".pdf") ? (
                                                                <FontAwesomeIcon
                                                                  icon={faFilePdf}
                                                                  style={{
                                                                    width: "auto",
                                                                    height: "70px",
                                                                    cursor: "pointer",
                                                                  }}
                                                                />
                                                              ) : image.raw?.name?.toLowerCase().endsWith(".docx") ? (
                                                                <FontAwesomeIcon
                                                                  icon={faFileWord}
                                                                  style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                />
                                                              ) : image.raw?.name?.toLowerCase().endsWith(".xlsx") ? (
                                                                <FontAwesomeIcon
                                                                  icon={faFileExcel}
                                                                  style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                />
                                                              ) : (
                                                                <span
                                                                  style={{
                                                                    fontSize: "14px",
                                                                    fontWeight: 600,
                                                                  }}
                                                                >
                                                                File preview not supported.
                                                              </span>
                                                              )}
                                                            </div>
                                                          )}
                                                      
                                                          {/* Delete button */}
                                                          <div className="col btnCenter">
                                                            <button
                                                              type="button"
                                                              className="btn dlt"
                                                              onClick={handleClearImg}
                                                              style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                marginTop: "15px", // Adds space between the file and the delete button
                                                              }}
                                                            >
                                                              <Iconify icon="fluent:delete-48-filled" style={{ marginRight: "5px" }} />
                                                              Delete
                                                            </button>
                                                          </div>
                                                        </div>
                                                        ) : (
                                                          <>
                                                            <span className="fa-stack fa-2x mb-2">
                                                              <img
                                                                src={require("../../../assets/img/Add_Image_icon.png")}
                                                                className="sliderimg2 ffff"
                                                                
                                                                onClick={(e) => {
                                                                  setIsFormFiled(true);
                                                                  handleImgChangeSingle2(e);
                                                                }}
                                                                width="200"
                                                                height="180"
                                                                alt=""
                                                              />
                                                            </span>
                                                          </>
                                                        )}
                                                      </label>
                                                      {getDbImg && getDbImg.length > 0 ? (
                                                        <div></div>
                                                      ) : (
                                                        <div>
                                                          <input
                                                            type="file"
                                                            id="upload-button"
                                                            accept="image/*"
                                                            disabled={disabledBtn}
                                                            style={{ display: "none" }}
                                                            onChange={handleImgChangeSingle}
                                                            
                                                          />
                                                        </div>
                                                      )}
                                                      <br />
                                                    </div>
                                                    <BootstrapDialog
                                                     
                                                      onClose={(event, reason) => {
                                                        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                                                          handleClosedd2(event, reason);
                                                        }
                                                      }}
                                                      aria-labelledby="customized-dialog-title"
                                                      open={showdd2}
                                                    >
                                                      <IconButton
                                                        aria-label="close"
                                                        onClick={handleClosedd2}
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
                                                      <DialogContent
                                                        dividers
                                                        style={{
                                                          display: "flex",
                                                          justifyContent: "center",
                                                        }}
                                                      >
                                                        {getDbImg && getDbImg.length > 0 ? (
                                                          <div>
                                                            <img
                                                              src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
                                                              alt="dummy"
                                                              className="dummyImg"
                                                              onClick={openSaveImg}
                                                            />
                                                          </div>
                                                        ) : (
                                                          <img
                                                            src={image.preview}
                                                            alt="dummy"
                                                            style={{
                                                              height: "50%",
                                                              width: "50%",
                                                            }}
                                                            onClick={openSaveImg}
                                                            className="dummyImg"
                                                          />
                                                        )}
                                                      </DialogContent>
                                                    </BootstrapDialog>
                                                  </div>
                                                </div>
                             </div>
                           
                          </Grid>
                          <Grid xs={12} md={2} className="imgGird">
                            <Card sx={{ pt: 2, pb: 0, px: 3 }}>
                              <Box
                                sx={{
                                  mb: 5,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {/* ************************************* img web  ******************************************* */}

                                <div className="col-md-2">
                                                    <div className="row">
                                                      <div className="row ImgShowMobile">
                                                        <div>
                                                          <label htmlFor="upload-button">
                                                            {getDbImg && getDbImg.length > 0 ? (
                                                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                              {/* File Display (Icon or Image) */}
                                                              {getDbImg[0].file_name.toLowerCase().endsWith(".pdf") ? (
                                                                <FontAwesomeIcon
                                                                  icon={faFilePdf}
                                                                  onClick={() => openPDFInNewTab(getDbImg[0].attachment)}
                                                                  style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                  className="fntpdf"
                                                                />
                                                              ) : getDbImg[0].file_name.toLowerCase().endsWith(".docx") ? (
                                                                <FontAwesomeIcon
                                                                  icon={faFileWord}
                                                                  onClick={() => openDocxInNewTab(getDbImg[0].attachment)}
                                                                  style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                  className="fntdocx"
                                                                />
                                                              ) : getDbImg[0].file_name.toLowerCase().endsWith(".php") ? (
                                                                <FontAwesomeIcon
                                                                  icon={faFileCode}
                                                                  onClick={() => openPhpInNewTab(getDbImg[0].attachment)}
                                                                  style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                  className="fntphp"
                                                                />
                                                              ) : getDbImg[0].file_name.toLowerCase().endsWith(".log") ? (
                                                                <FontAwesomeIcon
                                                                  icon={faFileAlt}
                                                                  onClick={() => openLogInNewTab(getDbImg[0].attachment)}
                                                                  style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                  className="fntlog"
                                                                />
                                                              ) : getDbImg[0].file_name.toLowerCase().endsWith(".xlsx") ? (
                                                                <FontAwesomeIcon
                                                                  icon={faFileExcel}
                                                                  onClick={() => openXlsxInNewTab(getDbImg[0].attachment)}
                                                                  style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                  className="fntxlsx"
                                                                />
                                                              ) : getDbImg[0].file_name.toLowerCase().endsWith(".txt") ? (
                                                               <span
                                                                       style={{
                                                                         fontSize: "14px",
                                                                         fontWeight: 600,
                                                                       }}
                                                                     >
                                                                     File preview not supported.
                                                                   </span>
                                                             ) :  (
                                                                <img
                                                                  src={
                                                                    getDbImg[0].attachment
                                                                      ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}`
                                                                      : ""
                                                                  }
                                                                  className="imgCurPont"
                                                                  alt="File Thumbnail"
                                                                  onClick={openSaveImg}
                                                                  style={{
                                                                    width: "auto",
                                                                    height: "150px",
                                                                    cursor: "pointer",
                                                                  }}
                                                                />
                                                              )}
                                                          
                                                              {/* Delete Button */}
                                                              <div className="col btnCenter">
                                                              <button
                                                                type="button"
                                                                className="btn dlt"
                                                               // onClick={() => handleDeleteImgApi(getDbImg[0].RowID)}
                                                                onClick={() => {
                                                                  setIsFormFiled(true);
                                                                  handleDeleteImgApi(getDbImg[0].RowID);
                                                                }}
                                                                style={{
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  marginTop: "15px", // Adds space between the file and the delete button
                                                                }}
                                                              >
                                                                <Iconify icon="fluent:delete-48-filled" style={{ fontSize: "24px" }} />
                                                                Delete
                                                              </button>
                                                              </div>
                                                            </div>
                                                           ) : image?.preview ? (
                                                            <div>
                                                            {/* If the file is an image, show the image preview */}
                                                            {image.raw?.type?.startsWith("image/") ? (
                                                              <img
                                                                src={image.preview}
                                                                alt="preview"
                                                                className="imgCurPont"
                                                                onClick={openSaveImg}
                                                                style={{ width: "200px", height: "180px", cursor: "pointer" }} // Adjust size as needed
                                                              />
                                                            ) : (
                                                              // Handle non-image files (PDF, DOCX, XLSX, etc.)
                                                              <div>
                                                                {image.raw?.name?.toLowerCase().endsWith(".pdf") ? (
                                                                  <FontAwesomeIcon
                                                                    icon={faFilePdf}
                                                                    style={{
                                                                      width: "auto",
                                                                      height: "70px",
                                                                      cursor: "pointer",
                                                                    }}
                                                                  />
                                                                ) : image.raw?.name?.toLowerCase().endsWith(".docx") ? (
                                                                  <FontAwesomeIcon
                                                                    icon={faFileWord}
                                                                    style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                  />
                                                                ) : image.raw?.name?.toLowerCase().endsWith(".xlsx") ? (
                                                                  <FontAwesomeIcon
                                                                    icon={faFileExcel}
                                                                    style={{ width: "auto", height: "70px", cursor: "pointer" }}
                                                                  />
                                                                ) : (
                                                                  <span
                                                                    style={{
                                                                      fontSize: "14px",
                                                                      fontWeight: 600,
                                                                    }}
                                                                  >
                                                                  File preview not supported.
                                                                </span>
                                                                )}
                                                              </div>
                                                            )}
                                                        
                                                            {/* Delete button */}
                                                            <div className="col btnCenter">
                                                              <button
                                                                type="button"
                                                                className="btn dlt"
                                                                onClick={handleClearImg}
                                                                style={{
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  marginTop: "10px",
                                                                }}
                                                              >
                                                                <Iconify icon="fluent:delete-48-filled" style={{ marginRight: "5px" }} />
                                                                Delete
                                                              </button>
                                                            </div>
                                                          </div>
                                                            ) : (
                                                              <>
                                                                <span className="fa-stack fa-2x mb-2">
                                                                  <img
                                                                    src={require("../../../assets/img/Add_Image_icon.png")}
                                                                    className="sliderimg2"
                                                                   
                                                                    onClick={() => {
                                                                      setIsFormFiled(true);
                                                                      handleImgChangeSingle2();
                                                                    }}

                                                                    width="200"
                                                                    height="180"
                                                                    alt=""
                                                                  />
                                                                </span>
                                                              </>
                                                            )}
                                                          </label>
                                                          {getDbImg && getDbImg.length > 0 ? (
                                                            <div></div>
                                                          ) : (
                                                            <div>
                                                              <input
                                                                type="file"
                                                                id="upload-button"
                                                                accept="image/*"
                                                                disabled={disabledBtn}
                                                                style={{ display: "none" }}
                                                               
                                                                onChange={handleImgChangeSingle}
                                                              />
                                                            </div>
                                                          )}
                                                          <br />
                                                        </div>
                                                        <BootstrapDialog
                                                          onClose={(event, reason) => {
                                                            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                                                              handleClosedd2(event, reason);
                                                            }
                                                          }}
                                                          aria-labelledby="customized-dialog-title"
                                                          open={showdd2}
                                                        >
                                                          <IconButton
                                                            aria-label="close"
                                                            onClick={handleClosedd2}
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
                                                          <DialogContent
                                                            dividers
                                                            style={{
                                                              display: "flex",
                                                              justifyContent: "center",
                                                            }}
                                                          >
                                                            {getDbImg && getDbImg.length > 0 ? (
                                                              <div>
                                                                <img
                                                                  src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
                                                                  alt="dummy"
                                                                  className="dummyImg"
                                                                  onClick={openSaveImg}
                                                                />
                                                              </div>
                                                            ) : (
                                                              <img
                                                                src={image.preview}
                                                                alt="dummy"
                                                                style={{
                                                                  height: "50%",
                                                                  width: "50%",
                                                                }}
                                                                onClick={openSaveImg}
                                                                className="dummyImg"
                                                              />
                                                            )}
                                                          </DialogContent>
                                                        </BootstrapDialog>
                                                      </div>
                                                    </div>
                                  </div>
                              </Box>
                            </Card>
                          </Grid>
                        </Grid>
                     
                    </Card>
                  </Grid>
                </Grid>
              
              </div>
               {/* Work Information tab */}
              <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                    <Card>
                        <div style={{ display: "flex" }}>
                          
                          <button
                            className="ToggleBttnIcon"
                            onClick={toggleDiv}
                          >
                            <Iconify
                                icon="eos-icons:workload"
                              style={{ marginRight: "2px", width: "20px" }}
                            />
                            Work Information
                            {isOpenWork ? (
                              <Iconify
                                icon="ep:arrow-up-bold"
                                style={{ marginLeft: "4px", width: "12px" }}
                              />
                            ) : (
                              <Iconify
                                icon="ep:arrow-down-bold"
                                style={{ marginLeft: "4px", width: "12px" }}
                              />
                            )}
                          </button>

                        </div>
                        {isOpenWork && (
                          <Grid container spacing={0}>
                            <Grid xs={12} md={12}>
                              <Box sx={{ flexGrow: 1 }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                      <Typography variant="subtitle2"
                                       className="Requiredlabel"
                                      >
                                        {findCustomizeLabel("prm_mst_dflt_status") ||
                                          "Default WO Status"}
                                      </Typography>
                                      
                                      <Autocomplete
                                          options={Status}

                                            value={(selected_Status?.label || "")
                                              .split(" : ")
                                              .slice(0, 2)
                                              .join(" : ")}

                                            onChange={(event, value) => {
                                              setSelected_Status(value);
                                              setIsDefaultStatusEmpty(false);
                                              setIsFormFiled(true);
                                              
                                            }}
                                            
                                          disableAnimation
                                          renderInput={(params) => (
                                            <div>
                                              <TextField
                                                {...params}
                                                placeholder="Select..."
                                                variant="outlined"
                                                size="small"
                                                className={`Extrasize ${
                                                  isDefaultStatusEmpty
                                                    ? "errorEmpty"
                                                    : ""
                                                }`}
                                                style={{ width: "100%" }}
                                                ref={autocompleteRef}
                                              />
                                            </div>
                                          )}
                                        />
                                  </Stack>
                                 
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2"
                                   className="Requiredlabel"
                                >
                                  {findCustomizeLabel("prm_mst_plan_priority") ||
                                    "Plan Priority"}
                                </Typography>
                              
                                <Autocomplete
                                      options={PlanPriority}
                                      value={(selected_PlanPriority?.label || "")
                                        .split(" : ")
                                        .slice(0, 2)
                                        .join(" : ")}

                                      onChange={(event, value) => {
                                        setSelected_PlanPriority(value);
                                        setIsPlanPriorityEmpty(false);
                                        setIsFormFiled(true);
                                      }}
                                       
                                      disableAnimation
                                      renderInput={(params) => (
                                        <div>
                                          <TextField
                                            {...params}
                                            placeholder="Select..."
                                            variant="outlined"
                                            size="small"
                                            className={`Extrasize ${
                                              isPlanPriorityEmpty
                                                ? "errorEmpty"
                                                : ""
                                            }`}
                                            style={{ width: "100%" }}
                                            ref={autocompleteRef}
                                          />
                                        </div>
                                      )}
                                    />
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                  <Typography variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "prm_det_work_type"
                                    )}
                                  >
                                    {findCustomizeLabelDet("prm_det_work_type") ||
                                      "Work Type"}
                                  </Typography>
                                  
                                    <Autocomplete
                                    options={Pm_workType}
                                    value={(selected_Pm_workType?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setSelected_Pm_workType(value);
                                        setIsFormFiled(true);
                                        //setIsAssetCriticalFactorEmpty(false);
                                        
                                      }}
                                    disableAnimation
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small"
                                          className="Extrasize"
                                          style={{ width: "100%" }}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}
                                   className={findCustomizerequiredLabel(
                                    "prm_det_work_class"
                                  )}
                                  >
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabelDet("prm_det_work_class") ||
                                      "Work Class"}
                                  </Typography>
                                    <Autocomplete
                                      options={Pm_workClass}
                                      value={(selected_Pm_workClass?.label || "")
                                        .split(" : ")
                                        .slice(0, 2)
                                        .join(" : ")}
                                        onChange={(event, value) => {
                                          setSelected_Pm_workClass(value);
                                          setIsFormFiled(true);
                                          //setIsAssetCriticalFactorEmpty(false);
                                          
                                        }}
                                      disableAnimation
                                      renderInput={(params) => (
                                        <div>
                                          <TextField
                                            {...params}
                                            placeholder="Select..."
                                            variant="outlined"
                                            size="small"
                                            className="Extrasize"
                                            style={{ width: "100%" }}
                                            ref={autocompleteRef}
                                          />
                                        </div>
                                      )}
                                    />
                                  </Stack>
                                  </Grid>
                                  <Grid item xs={6}>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2"
                                     className={findCustomizerequiredLabel(
                                      "prm_det_work_grp"
                                    )}
                                    >
                                      {findCustomizeLabelDet("prm_det_work_grp") ||
                                        "Work Group"}
                                    </Typography>
                                    <Autocomplete
                                    options={WorkGroup}
                                    value={(selected_WorkGroup?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setSelected_WorkGroup(value);
                                        setIsWorkGroupEmpty(false);
                                        setIsFormFiled(true);
                                        
                                      }}
                                     
                                    disableAnimation
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small"
                                          className={`Extrasize ${
                                            isWorkGroupEmpty
                                              ? "errorEmpty"
                                              : ""
                                          }`}
                                          style={{ width: "100%" }}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                                  </Stack>
                                  
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                      <Typography variant="subtitle2" 
                                       className={findCustomizerequiredLabel(
                                        "prm_det_project_id"
                                      )}
                                      >
                                        {findCustomizeLabelDet("prm_det_project_id") ||
                                        "Project ID"}
                                      </Typography>

                                    <Grid container alignItems="center">
                                      <Grid item xs={9}>
                                      <Autocomplete
                                        options={Project_Id }
                                        value={selected_Project_Id?.label ?? ""}
                                        onChange={(event, value) => {
                                          setSelected_Project_Id(value || null);
                                          setIsFormFiled(true);
                                          //setIsAssetLocation(false);
                                          
                                        }}
                                        
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            size="small"
                                            placeholder="Select..."
                                            variant="outlined"
                                            fullWidth // Make it full-width
                                            className="Extrasize"
                                            ref={autocompleteRef}
                                          />
                                        )}
                                      />
                                      </Grid>
                                      <Grid item xs={3} style={{ textAlign: 'center' }}>
                                          <Stack spacing={1}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                                <Typography variant="subtitle2" sx={{ml:2}}
                                                 className={findCustomizerequiredLabel(
                                                  "prm_det_safety"
                                                )}>
                                                {findCustomizeLabelDet("prm_det_safety") || "Safety"}
                                                </Typography>
                                                <Checkbox
                                                checked={isCheckedSafty}
                                                onChange={handleCheckboxChangeSafty}
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                            </Stack>
                                          </Stack>
                                      </Grid>
                                    </Grid>
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2"
                                    className={findCustomizerequiredLabel(
                                      "prm_det_note1"
                                    )}>

                                      {findCustomizeLabelDet("prm_det_note1") ||
                                        "Note1"}
                                    </Typography>
                                    <TextareaAutosize
                                      aria-label="empty textarea"
                                     
                                      //minRows={4.9}
                                      style={{ resize: 'none', width: '100%' }}
                                      value={Note_desc}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 1000) {
                                          setNote_desc(value);
                                        }
                                        setIsAssetShortDescEmpty(false);
                                        setIsFormFiled(true);
                                      }}
                                      className="Extrasize TxtAra Note1"
                                      
                                    />
                                  </Stack>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </Grid>
                        )}

                    </Card>
                  </Grid>
                </Grid>
                {/* Asset Location tab */}
                <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                    <Card>
                      <div style={{ display: "flex" }}>
                          
                          <button
                            className="ToggleBttnIcon"
                            onClick={toggleDivAssetLocation}
                          >
                            <Iconify
                                icon="mdi:file-location"
                              style={{ marginRight: "2px", width: "20px" }}
                            />
                            Asset Location
                            {isOpenAsset ? (
                              <Iconify
                                icon="ep:arrow-up-bold"
                                style={{ marginLeft: "4px", width: "12px" }}
                              />
                            ) : (
                              <Iconify
                                icon="ep:arrow-down-bold"
                                style={{ marginLeft: "4px", width: "12px" }}
                              />
                            )}
                          </button>

                        </div>
                        {isOpenAsset && (
                          <Grid container spacing={0}>
                              <Grid xs={12} md={12}>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Grid container spacing={2}>
                                      <Grid item xs={6}>
                                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                                          <Typography variant="subtitle2"
                                          className={findCustomizerequiredLabel(
                                            "prm_det_work_area"
                                          )}
                                          >
                                            {findCustomizeLabelDet("prm_det_work_area") ||
                                              "Work Area"}
                                                
                                          </Typography>
                                          <Autocomplete
                                              options={Work_Area }
                                              value={selected_Work_Area?.label ?? ""}
                                              onChange={(event, value) => {
                                                setSelected_Work_Area(value || null);
                                                setIsFormFiled(true);
                                                //setIsAssetLocation(false);
                                              }}
                                              
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  size="small"
                                                  placeholder="Select..."
                                                  variant="outlined"
                                                  fullWidth // Make it full-width
                                                  className="Extrasize"
                                                  ref={autocompleteRef}
                                                />
                                              )}
                                            />
                                        </Stack>
                                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                                          <Typography variant="subtitle2"
                                          className={findCustomizerequiredLabel(
                                            "prm_det_asset_level"
                                          )}
                                          >
                                            {findCustomizeLabelDet("prm_det_asset_level") ||
                                              "Asset Level"}
                                          </Typography>
                                          <Autocomplete
                                              options={PmAssetLevel }
                                              value={selected_PmAssetLevel?.label ?? ""}
                                              onChange={(event, value) => {
                                                setSelected_PmAssetLevel(value || null);
                                                setIsFormFiled(true);
                                                //setIsAssetLocation(false);
                                              }}
                                              
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  size="small"
                                                  placeholder="Select..."
                                                  variant="outlined"
                                                  fullWidth // Make it full-width
                                                   className="Extrasize"
                                                  ref={autocompleteRef}
                                                />
                                              )}
                                            />
                                        </Stack>
                                      </Grid>
                                      <Grid item xs={6}>
                                      <Stack spacing={1} sx={{ pb: 1.5 }}>
                                        <Typography variant="subtitle2"
                                        className={findCustomizerequiredLabel(
                                          "prm_mst_assetlocn"
                                        )}
                                        >
                                          {findCustomizeLabel("prm_mst_assetlocn") ||
                                            "Asset Location"}
                                        </Typography>
                                        
                                          <TextField
                                          name="name"
                                          size="small"
                                          disabled
                                          value={AssetLocation}
                                          className="ExtrasizeDisable"
                                          InputProps={{
                                            sx: { 
                                              color: 'red !important'  // Change text color here
                                            },
                                          }}
                                          />
                                      </Stack>
                                      <Stack spacing={1} sx={{ pb: 1.5 }}>
                                        <Typography variant="subtitle2"
                                         className={findCustomizerequiredLabel(
                                          "prm_det_work_locn"
                                        )}
                                        >
                                          {findCustomizeLabelDet("prm_det_work_locn") ||
                                            "Work Location"}
                                        </Typography>
                                        <TextField
                                          id="outlined-basic"
                                          variant="outlined"
                                          size="small"
                                          value={workLocation}
                                        
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 20) {
                                              setWorkLocation(value);
                                              setIsFormFiled(true);
                                            }
                                          }}

                                          fullWidth
                                        />
                                      </Stack>
                                      </Grid>
                                  </Grid>
                                  </Box>
                          </Grid>
                          </Grid>
                        )}
                    </Card>
                  </Grid>
                </Grid>
                  {/* Work Activity  tab */}
                  <Grid container>
                    <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                    <Card>
                      <div style={{ display: "flex" }}>
                          
                          <button
                            className="ToggleBttnIcon"
                            onClick={toggleDivWorkActivity}
                          >
                            <Iconify
                                icon="uil:file-network"
                              style={{ marginRight: "2px", width: "20px" }}
                            />
                            Work Activity 
                            {isOpenWorkActivity ? (
                              <Iconify
                                icon="ep:arrow-up-bold"
                                style={{ marginLeft: "4px", width: "12px" }}
                              />
                            ) : (
                              <Iconify
                                icon="ep:arrow-down-bold"
                                style={{ marginLeft: "4px", width: "12px" }}
                              />
                            )}
                          </button>

                        </div>
                        {isOpenWorkActivity && (
                          <Grid container spacing={0}>
                              <Grid xs={12} md={12}>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Grid container spacing={2}>
                                      <Grid item xs={6}>
                                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                                          <Typography variant="subtitle2"
                                          className={findCustomizerequiredLabel(
                                            "prm_mst_flt_code"
                                          )}
                                          >
                                            {findCustomizeLabel("prm_mst_flt_code") ||
                                              "Fault Code"}
                                          </Typography>
                                          <Autocomplete
                                              options={FaultCode}
                                              value={(selected_FaultCode?.label || "")
                                                .split(" : ")
                                                .slice(0, 2)
                                                .join(" : ")}
                                                onChange={(event, value) => {
                                                  setselected_FaultCode(value);
                                                  setIsFormFiled(true);
                                                  
                                                }}
                                              disableAnimation
                                              renderInput={(params) => (
                                                <div>
                                                  <TextField
                                                    {...params}
                                                    placeholder="Select..."
                                                    variant="outlined"
                                                    size="small"
                                                    className="Extrasize"
                                                    style={{ width: "100%" }}
                                                    ref={autocompleteRef}
                                                  />
                                                </div>
                                              )}
                                            />
                                        </Stack>
                                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                                          <Typography variant="subtitle2"
                                            className={findCustomizerequiredLabel(
                                              "prm_det_cause_code"
                                            )}
                                          >
                                            {findCustomizeLabelDet("prm_det_cause_code") ||
                                              "Cause Code"}
                                          </Typography>

                                          <Autocomplete
                                            options={PmCaseCode}
                                            value={selected_PmCaseCode?.label ?? ""}
                                            onChange={(event, value) => {
                                              setSelected_PmCaseCode(value || null);
                                              setIsFormFiled(true);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                size="small"
                                                placeholder="Select..."
                                                variant="outlined"
                                                fullWidth // Make it full-width
                                                className="Extrasize"
                                                ref={autocompleteRef}
                                              />
                                            )}
                                          />
                                        </Stack>
                                       
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                                          <Typography variant="subtitle2"
                                          className={findCustomizerequiredLabel(
                                            "prm_det_act_code"
                                          )}
                                          >
                                            {findCustomizeLabelDet("prm_det_act_code") ||
                                              "Action Code"}
                                          </Typography>

                                          <Autocomplete
                                            options={Action_Code}
                                            value={selectedAction_Code?.label ?? ""}
                                            onChange={(event, value) => {
                                              setSelectedAction_Code(value || null);
                                              setIsFormFiled(true);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                size="small"
                                                placeholder="Select..."
                                                variant="outlined"
                                                fullWidth // Make it full-width
                                                 className="Extrasize"
                                                ref={autocompleteRef}
                                              />
                                            )}
                                          />
                                        </Stack>
                                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                                          <Typography variant="subtitle2"
                                          className={findCustomizerequiredLabel(
                                            "prm_det_customer_cd"
                                          )}
                                          >
                                            {findCustomizeLabelDet("prm_det_customer_cd") ||
                                              "Customer Code"}
                                          </Typography>

                                          <Autocomplete
                                            options={PmCustomerCode}
                                            value={selected_CustomerCode?.label ?? ""}
                                            onChange={(event, value) => {
                                              setSelected_CustomerCode(value || null);
                                              setIsFormFiled(true);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                size="small"
                                                placeholder="Select..."
                                                variant="outlined"
                                                fullWidth // Make it full-width
                                                className="Extrasize"
                                                ref={autocompleteRef}
                                              />
                                            )}
                                          />
                                        </Stack>
                                      </Grid>
                                  </Grid>
                                  </Box>
                          </Grid>
                          </Grid>
                        )}
                    </Card>
                  </Grid>
                </Grid>
                </Box>
              {/* Schedule Detail Tab Tab*/}
              <Box
                role="tabpanel"
                hidden={Tabvalue !== 1}
              >

              <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass" sx={{ padding:"0px" }} >
                  <Card sx={{ p: 3 }} >
                  <Grid container spacing={2} className="InnerDiv" >
                  <Grid item xs={12} md={6} spacing={2} >
                      <Box
                            rowGap={2}
                            columnGap={1}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "90%",
                              sm: "90% 10%",
                            }}
                            sx={{ pb: 1 }}
                          >
                            <Stack spacing={1}>
                              <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_assign_to"
                              )}
                              >
                                {findCustomizeLabelDet("wko_det_assign_to") ||
                                  "Assign To"}
                              </Typography>
                             
                            <div ref={assetNoAutocompleteRef}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                
                                size="small"
                                className="ExtrasizeDisable"
                                fullWidth
                               
                                value={selected_Assign_To?.label ?? ""}
                              //  disabled={statusKey === "CLO"}
                               
                                placeholder="Select..."
                                sx={{
                                  "& .MuiInputBase-input": {
                                    fontSize: '12px', // Set the font size to 12px
                                  }
                                }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                  //  className={Button_save === "Save" ? "disabledIcon" : ""}
                                    onClick={handelAssignCancelClick}
                                  //  disabled={statusKey === "CLO"}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={(e) => {
                                      e.preventDefault();
                                        handleEditClickAssign();
                                    }}
                                   

                                  />,
                                ]}
                              />
                            </div>
                            </Stack>
                            <Tooltip
                              title="Assign To"
                              placement="top"
                              className="tooltipRhtAssign"
                              arrow
                            >
                              
                              <IconButton className="TooltipIconBtn">
                                <Iconify
                                  icon="pajamas:status-alert"
                                  onClick={AssignStatushandleshow}
                                />
                              </IconButton>
                            </Tooltip>
                          </Box>
                      <Stack spacing={1} sx={{ pb: 1.5 }}>
                        <Typography variant="subtitle2"
                          className={findCustomizerequiredLabel(
                            "prm_det_originator"
                          )}
                        >
                          {findCustomizeLabelDet("prm_det_originator") ||
                            "Originator"}
                        </Typography>
                    
                        <Autocomplete
                            options={Originator}
                            value={selected_Originator?.label ?? ""}
                            onChange={(event, value) => {
                              setSelected_Originator(value || null);
                              setIsFormFiled(true);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                fullWidth // Make it full-width
                                className="Extrasize"
                                ref={autocompleteRef}
                              />
                            )}
                          />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6} spacing={2} >
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2"
                                className={findCustomizerequiredLabel(
                                  "prm_det_approver"
                                )}
                              >
                                {findCustomizeLabelDet("prm_det_approver") ||
                                  "Approver"}
                              </Typography>
                             
                              <Autocomplete
                                options={Originator}
                                value={selected_Approver?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelect_Approver(value);
                                  setIsFormFiled(true);
                                 // setIsAssetCodeEmpty(false);
                                  
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className="Extrasize"
                                  />
                                )}
                              />
                        </Stack>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_planner"
                              )}>
                                {findCustomizeLabelDet("prm_det_planner") ||
                                  "Planner"}
                              </Typography>
                   
                              <Autocomplete
                                options={Originator }
                                value={selected_Planner?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Planner(value);
                                  setIsFormFiled(true);
                                  //setIsAssetGroupCodeEmpty(false);
                              
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    className="Extrasize"
                                    fullWidth // Make it full-width
                                  />
                                )}
                              />
                        </Stack>
                    </Grid>
                    </Grid>
                  </Card>
                  </Grid>
              </Grid>
              {/* Asset Master */}
            <Grid container>  
                <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                  <Card sx={{ p: 3 }} >
                  <div style={{ display: "flex" }}>
                       
                       <button
                         className="ToggleBttnIcon"
                         onClick={toggleDivAssetMeter}
                       >
                         <Iconify
                            icon="carbon:task-asset-view"
                           style={{ marginRight: "2px", width: "20px" }}
                         />
                         Asset Meter
                         {isOpenAssetMeter ? (
                           <Iconify
                             icon="ep:arrow-up-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         ) : (
                           <Iconify
                             icon="ep:arrow-down-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         )}
                       </button>

                     </div>
                     {isOpenAssetMeter && (

                    
                  <Grid container spacing={2} >
                  <Grid item xs={12} md={6} spacing={2} >
                     <Stack spacing={1} sx={{ pb: 1.5 }}>
                      <Typography variant="subtitle2"
                       className={findCustomizerequiredLabel(
                        "prm_mst_meter_id"
                      )}
                      >
                        {findCustomizeLabel("prm_mst_meter_id") ||
                          "Meter ID"}
                       
                      </Typography>
                      <Autocomplete
                          options={MeterId}
                          value={(selected_MeterId?.label || "")
                            .split(" : ")
                            .slice(0, 2)
                            .join(" : ")}
                            onChange={(event, value) => {
                              setSelected_MeterId(value);
                              setIsFormFiled(true);
                             // setIsAssetCriticalFactorEmpty(false);
                              
                            }}
                          disableAnimation
                          renderInput={(params) => (
                            <div>
                              <TextField
                                {...params}
                                placeholder="Select..."
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                style={{ width: "100%" }}
                                ref={autocompleteRef}
                              />
                            </div>
                          )}
                        />
                    </Stack>

                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                      <Typography variant="subtitle2"
                       className={findCustomizerequiredLabel(
                        "prm_mst_lpm_usg"
                      )}
                      >
                        {findCustomizeLabel("prm_mst_lpm_usg") ||
                          "LPM Usage"}
                      </Typography>
                     
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        size="small"
                        placeholder=".00"
                        value={LpmUsage}
                        fullWidth
                        disabled
                      />
                    </Stack>

                    </Grid>
                    <Grid item xs={12} md={6} spacing={2} >
                        
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2"
                                  className={findCustomizerequiredLabel(
                                    "prm_mst_lpm_uom"
                                  )}
                                >
                                  {findCustomizeLabel("prm_mst_lpm_uom") ||
                                    "LPM UOM"}
                                </Typography>
                                
                                <Autocomplete
                                    options={PmLPMUOM}
                                    value={(selected_PmLPMUOM?.label || "")
                                      .split(" : ")
                                      .slice(0, 2)
                                      .join(" : ")}
                                      onChange={(event, value) => {
                                        setselected_PmLPMUOM(value);
                                        setIsFormFiled(true);
                                      }}
                                    disableAnimation
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          placeholder="Select..."
                                          variant="outlined"
                                          size="small"
                                          className="Extrasize"
                                          style={{ width: "100%" }}
                                          ref={autocompleteRef}
                                        />
                                      </div>
                                    )}
                                  />
                              </Stack>
                       
                    </Grid>
                    </Grid>
                     )}
                  </Card>
                  </Grid>
            </Grid>

              {/* cost center account */}
              <Grid container>  
              <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                  <Card sx={{ p: 3 }} >
                  <div style={{ display: "flex" }}>
                       
                       <button
                         className="ToggleBttnIcon"
                         onClick={toggleDivCostCenter}
                       >
                         <Iconify
                            icon="hugeicons:account-setting-01"
                           style={{ marginRight: "2px", width: "20px" }}
                         />
                         Cost Centre & Account
                         {isOpenCostCenter ? (
                           <Iconify
                             icon="ep:arrow-up-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         ) : (
                           <Iconify
                             icon="ep:arrow-down-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         )}
                       </button>

                     </div>
                     {isOpenCostCenter && (

                  <Grid container spacing={2} >
                  <Grid item xs={12} md={6} spacing={2} >
                      <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_crd_costcenter"
                              )}
                            >
                              {findCustomizeLabelDet("prm_det_crd_costcenter") ||
                                "Credit Cost Center"}
                            </Typography>
                           
                            <Autocomplete 
                              options={Charge_Cost_Center}
                              value={selected_creadit_cost_center?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_creadit_cost_center(value || null);
                                setIsFormFiled(true);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className="Extrasize"
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                      </Stack>
                       <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_l_account"
                              )}
                            >
                              {findCustomizeLabelDet("prm_det_l_account") ||
                                "Labor Account"}
                            </Typography>
                            <Autocomplete 
                              options={Labor_Account}
                              value={selected_Labor_Account?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Labor_Account(value || null);
                                setIsFormFiled(true);
                              
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className="Extrasize"
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                          </Stack>
                    </Grid>
                    <Grid item xs={12} md={6} spacing={2} >
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2" 
                            className={findCustomizerequiredLabel(
                              "prm_det_m_account"
                            )}
                            >
                            {findCustomizeLabelDet("prm_det_m_account") ||
                              "Material Account"}
                           
                          </Typography>
                          <Autocomplete 
                              options={Labor_Account}
                              value={selected_Material_Account?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Material_Account(value || null);
                                setIsFormFiled(true);
                               // setIsAssetCostCenterEmpty(false);
                              
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  className="Extrasize"
                                  fullWidth // Make it full-width
                                />
                              )}
                            />
                        </Stack>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2"
                           className={findCustomizerequiredLabel(
                            "prm_det_c_account"
                          )}
                          >
                            {findCustomizeLabelDet("prm_det_c_account") ||
                              "Contract Account"}
                          </Typography> 
                          <Autocomplete
                            options={Labor_Account}
                            value={selected_Contract_Account?.label ?? ""}
                            onChange={(event, value) => {
                              setSelected_Contract_Account(value || null);
                              setIsFormFiled(true);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                fullWidth // Make it full-width
                                 className="Extrasize"
                                ref={autocompleteRef}
                              />
                            )}
                          />
                        </Stack>
                    </Grid>
                    </Grid>
                     )}
                  </Card>
                  </Grid>
              </Grid>

              {/* Udf Text */}
              <Grid container>  
              <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                  <Card sx={{ p: 3 }} >
                  <div style={{ display: "flex" }}>
                       
                       <button
                         className="ToggleBttnIcon"
                         onClick={toggleDivUDFText}
                       >
                         <Iconify
                            icon="eos-icons:workload"
                           style={{ marginRight: "2px", width: "20px" }}
                         />
                         UDF Text
                         {isOpenUdfText ? (
                           <Iconify
                             icon="ep:arrow-up-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         ) : (
                           <Iconify
                             icon="ep:arrow-down-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         )}
                       </button>

                     </div>
                     {isOpenUdfText && (

                  <Grid container spacing={2} >
                  <Grid item xs={12} md={6} spacing={2} >
                      <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_varchar1"
                              )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar1") ||
                                "Varchar1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_1}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_1(value);
                                  setIsFormFiled(true);
                                }
                                
                                
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_varchar2"
                              )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar2") ||
                                "Varchar2"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_2}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_2(value);
                                  setIsFormFiled(true);
                                }
                                
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_varchar3"
                              )}
                              >
                              {findCustomizeLabelDet("prm_det_varchar3") ||
                                "Varchar3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_3}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_3(value);
                                  setIsFormFiled(true);
                                }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                             className={findCustomizerequiredLabel(
                              "prm_det_varchar4"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar4") ||
                                "Varchar4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_4}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_4(value);
                                  setIsFormFiled(true);
                                }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                             className={findCustomizerequiredLabel(
                              "prm_det_varchar5"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar5") ||
                                "Varchar5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_5}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_5(value);
                                  setIsFormFiled(true);
                                }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" 
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar6"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar6") ||
                                "Varchar6"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_6}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_6(value);
                                  setIsFormFiled(true);
                                }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                             className={findCustomizerequiredLabel(
                              "prm_det_varchar7"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar7") ||
                                "Varchar7"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_7}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_7(value);
                                  setIsFormFiled(true);
                                }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar8"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar8") ||
                                "Varchar8"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              fullWidth
                              value={UDFText_8}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_8(value);
                                  setIsFormFiled(true);
                                }
                               
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar9"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar9") ||
                                "Varchar9"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_9}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_9(value);
                                  setIsFormFiled(true);
                                }
                               
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_varchar10"
                              )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar10") ||
                                "Varchar10"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_10}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_10(value);
                                  setIsFormFiled(true);
                                }
                               
                              }}
                            />
                          </Stack>
                    </Grid>
                    <Grid item xs={12} md={6} spacing={2} >
                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_varchar11"
                              )}
                              >
                              {findCustomizeLabelDet("prm_det_varchar11") ||
                                "Varchar11"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_11}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_11(value);
                                  setIsFormFiled(true);
                                }
                                
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_varchar12"
                              )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar12") ||
                                "Varchar12"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_12}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_12(value);
                                  setIsFormFiled(true);
                                }
                              
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar13"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar13") ||
                                "Varchar13"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_13}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_13(value);
                                  setIsFormFiled(true);
                                }
                                
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "prm_det_varchar14"
                              )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar14") ||
                                "Varchar14"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_14}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_14(value);
                                  setIsFormFiled(true);
                                }
                                
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar15"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar15") ||
                                "Varchar15"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_15}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_15(value);
                                  setIsFormFiled(true);
                                }
                               
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar16"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar16") ||
                                "Varchar16"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_16}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_16(value);
                                  setIsFormFiled(true);
                                }
                                
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                             className={findCustomizerequiredLabel(
                              "prm_det_varchar17"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar17") ||
                                "Varchar17"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_17}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_17(value);
                                  setIsFormFiled(true);
                                }
                                
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar18"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar18") ||
                                "Varchar18"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_18}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_18(value);
                                  setIsFormFiled(true);
                                }
                               
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar19"
                            )}>
                              {findCustomizeLabelDet("prm_det_varchar19") ||
                                "Varchar19"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_19}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_19(value);
                                  setIsFormFiled(true);
                                }
                               
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_varchar20"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_varchar20") ||
                                "Varchar20"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_20}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_20(value);
                                  setIsFormFiled(true);
                                }
                                
                              }}
                            />
                          </Stack>
                    </Grid>
                    </Grid>
                     )}
                  </Card>
                  </Grid>
              </Grid>

                 {/* Udf Nymeric */}
                 <Grid container>  
              <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                  <Card sx={{ p: 3 }} >
                  <div style={{ display: "flex" }}>
                       
                       <button
                         className="ToggleBttnIcon"
                         onClick={toggleDivUDFNumeric}
                       >
                         <Iconify
                            icon="mdi:numeric-0-box-multiple"
                           style={{ marginRight: "2px", width: "20px" }}
                         />
                         UDF Numeric
                         {isOpenUdfNumeric ? (
                           <Iconify
                             icon="ep:arrow-up-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         ) : (
                           <Iconify
                             icon="ep:arrow-down-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         )}
                       </button>

                     </div>
                     {isOpenUdfNumeric && (

                  <Grid container spacing={2}>
                  <Grid item xs={12} md={6} spacing={2} >
                     <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                             className={findCustomizerequiredLabel(
                              "prm_det_numeric1"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric1") ||
                                "Numeric1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              
                              fullWidth
                              value={UDFNumber_1}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_1);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_numeric2"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric2") ||
                                "Numeric2"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_2}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_2);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                             className={findCustomizerequiredLabel(
                              "prm_det_numeric3"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric3") ||
                                "Numeric3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_3}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_3);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_numeric4"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric4") ||
                                "Numeric4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_4}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_4);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_numeric5"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric5") ||
                                "Numeric5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_5}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_5);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                    </Grid>
                      <Grid item xs={12} md={6} spacing={2} >
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_numeric6"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric6") ||
                                "Numeric6"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_6}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_6);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                        </Stack>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                             className={findCustomizerequiredLabel(
                              "prm_det_numeric7"
                            )}>
                              {findCustomizeLabelDet("prm_det_numeric7") ||
                                "Numeric7"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_7}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_7);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_numeric8"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric8") ||
                                "Numeric8"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_8}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_8);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_numeric9"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric9") ||
                                "Numeric9"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_9}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_9);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                             className={findCustomizerequiredLabel(
                              "prm_det_numeric10"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_numeric10") ||
                                "Numeric10"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNumber_10}
                              onChange={(e) => {
                                handleNumericInputChange(e, setUDFNumber_10);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                    </Grid>
                    </Grid>
                     )}
                  </Card>
                  </Grid>
                 </Grid>

               {/* Udf DateTime */}
               <Grid container>  
               <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                  <Card sx={{ p: 3 }} >
                  <div style={{ display: "flex" }}>
                       
                       <button
                         className="ToggleBttnIcon"
                         onClick={toggleDivUDFDateTime}
                       >
                         <Iconify
                            icon="formkit:datetime"
                           style={{ marginRight: "2px", width: "20px" }}
                         />
                         UDF Datetime
                         {isOpenUdfDateTime ? (
                           <Iconify
                             icon="ep:arrow-up-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         ) : (
                           <Iconify
                             icon="ep:arrow-down-bold"
                             style={{ marginLeft: "4px", width: "12px" }}
                           />
                         )}
                       </button>

                     </div>
                     {isOpenUdfDateTime && (

                  <Grid container spacing={2} >
                  <Grid item xs={12} md={6} spacing={2} >
                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime1"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime1") ||
                                "Date1"}
                            </Typography>
                            
                              <AntDatePicker
                                value={UDFDate_1 ? dayjs(UDFDate_1) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_1(nativeDate);
                                  } else {
                                    setUDFDate_1(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime2"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime2") ||
                                "Date2"}
                            </Typography>
                           
                             <AntDatePicker
                                value={UDFDate_2 ? dayjs(UDFDate_2) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_2(nativeDate);
                                  } else {
                                    setUDFDate_2(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime3"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime3") ||
                                "Date3"}
                            </Typography>
                         
                             <AntDatePicker
                                value={UDFDate_3 ? dayjs(UDFDate_3) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_3(nativeDate);
                                  } else {
                                    setUDFDate_3(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                              />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime4"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime4") ||
                                "Date4"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_4 ? dayjs(UDFDate_4) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_4(nativeDate);
                                  } else {
                                    setUDFDate_4(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />

                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime5"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime5") ||
                                "Date5"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_5 ? dayjs(UDFDate_5) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_5(nativeDate);
                                  } else {
                                    setUDFDate_5(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />
                            
                          </Stack>
                    </Grid>
                    <Grid item xs={12} md={6} spacing={2} >
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime6"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime6") ||
                                "Date6"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_6 ? dayjs(UDFDate_6) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_6(nativeDate);
                                  } else {
                                    setUDFDate_6(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />
                            
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime7"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime7") ||
                                "Date7"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_7 ? dayjs(UDFDate_7) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_7(nativeDate);
                                  } else {
                                    setUDFDate_7(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />
                            
                            
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime8"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime8") ||
                                "Date8"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_8 ? dayjs(UDFDate_8) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_8(nativeDate);
                                  } else {
                                    setUDFDate_8(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />
                           
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime1"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime1") ||
                                "Date9"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_9 ? dayjs(UDFDate_9) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_9(nativeDate);
                                  } else {
                                    setUDFDate_9(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />

                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2"
                            className={findCustomizerequiredLabel(
                              "prm_det_datetime10"
                            )}
                            >
                              {findCustomizeLabelDet("prm_det_datetime10") ||
                                "Date10"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_10 ? dayjs(UDFDate_10) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                  
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate();
                                    setUDFDate_10(nativeDate);
                                  } else {
                                    setUDFDate_10(null);
                                  }
                                  // setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                                allowClear={false}
                               
                              />
                           
                          </Stack>
                    </Grid>
                    </Grid>
                     )}
                  </Card>
                  </Grid>
               </Grid>
              </Box>
              {/* Palaning Tab*/}
              <Box
                role="tabpanel"
                hidden={Tabvalue !== 2}
              >
                 <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding:"0px" }} >
                    <Card sx={{ p: 3 }} >
                    <Grid className="InnerDiv" style={{marginTop:"16px"}} >
                  
                   {(RowID) &&(
                        <AllPlanningModule
                          data={{
                            RowID: RowID,
                           // WorkOrderNo: WorkOrderNo,
                            Asset_No: Asset_No,
                            //statusKey:statusKey,
                          }}
                        />
                      )}
                    </Grid>
                    </Card>
                  </Grid>
                  </Grid>
              </Box>

              {/* checklist Tab*/}
              <Box
                role="tabpanel"
                hidden={Tabvalue !== 3}
              >
                 <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding:"0px" }} >
                    <Card sx={{ p: 3 }} >
                    <Grid className="InnerDiv" style={{marginTop:"16px"}} >
                   <PmCheckList2 
                    data={{
                      RowID: RowID,
                      Asset_No: Asset_No,
                     // formStatus: "NEW", 
                      //statusKey:statusKey,
                    }}
                  />
                      </Grid>
                    </Card>
                  </Grid>
                  </Grid>
              </Box>
                {/* Attachment Tab*/}
                <Box
                role="tabpanel"
                hidden={Tabvalue !== 4}
              >
                 <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding:"0px" }} >
                    <Card className="AssetDetail" sx={{ p: 3 }} >

                  <div>
                           <div
                             style={{
                               paddingBottom: "10px",
                               backgroundColor: "white",
                             }}
                           >
                             <div
                                className="template-demo"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between", 
                                  flexWrap: "nowrap",
                                  width: "100%", 
                                }}
                             >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <div style={{ marginRight: "5px" }}>
                                    <Iconify
                                       icon="codicon:references"
                                      width="30px"
                                      height="30px"
                                      style={{ fontSize: "45px" }}
                                    />
                                  </div>
                                  <div
                                    className="template-demo"
                                    style={{ display: "flex", flexDirection: "column" }}
                                  >
                                    <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                                    Reference
                                    </div>
                                  </div>
                                </div>

                                <div
                                  style={{
                                    marginLeft: "auto", // Push button to the right
                                  }}
                                >
                                  <Button  type="submit"   className="AddNewButton"  
                                  onClick={() => {
                                    setIsFormFiled(true);
                                    handleButtonClick();
                                  }}
                                 >
                                  + Add 
                              </Button>

                                </div>
                               
                             </div>
                           </div>
                           <div className="table-responsive">
                             <table className="table table-hover mt-2 col-sm-12 astFimg">
                               <thead>
                                 <tr>
                                   <th>Image</th>
                                   <th>File Name</th>
                                   <th>Audit User</th>
                                   <th>Audit Date</th>
                                   <th>Action</th>
                                 </tr>
                               </thead>
                             
                               <tbody >
                                 {RefImg !== "" &&
                                   RefImg !== null &&
                                   RefImg.map((item, index) => (
                                     <tr key={index} className="tableRow_Attachment_hover">
                                       <td>
                                       
                                         {item.file_name
                                           .toLowerCase()
                                           .endsWith(".pdf") ? (
                                           <FontAwesomeIcon
                                             icon={faFilePdf}
                                             onClick={() =>
                                               openPDFInNewTab(item.attachment)
                                             }
                                             style={{
                                               width: "35px",
                                               height: "35px",
                                               cursor:"pointer",
                                             }}
                                             className="fntpdf"
                                           />
                                         ) : item.file_name.toLowerCase().endsWith(".docx") ? (
                                          <FontAwesomeIcon
                                            icon={faFileWord}
                                            onClick={() => openDocxInNewTab(item.attachment)}
                                            style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                            className="fntdocx"
                                          />
                                        ) : item.file_name.toLowerCase().endsWith(".php") ? (
                                          <FontAwesomeIcon
                                            icon={faFileCode} 
                                            onClick={() => openPhpInNewTab(item.attachment)}
                                            style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                            className="fntphp"
                                          />
                                        ) : item.file_name.toLowerCase().endsWith(".log") ? (
                                          <FontAwesomeIcon
                                            icon={faFileAlt} 
                                            onClick={() => openLogInNewTab(item.attachment)}
                                            style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                            className="fntlog"
                                          />
                                        ) : item.file_name.toLowerCase().endsWith(".xlsx") ? (
                                          <FontAwesomeIcon
                                            icon={faFileExcel} 
                                            onClick={() => openXlsxInNewTab(item.attachment)}
                                            style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                            className="fntxlsx"
                                          />
                                        ): item.file_name.toLowerCase().endsWith(".xls") ? (
                                          <FontAwesomeIcon
                                            icon={faFileExcel} 
                                            onClick={() => openXlsxInNewTab(item.attachment)}
                                            style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                            className="fntxlsx"
                                          />
                                        ) : item.file_name.toLowerCase().endsWith(".txt") ? (
                                          <FontAwesomeIcon
                                            icon={faFileAlt} 
                                            onClick={() => openLogInNewTab(item.attachment)}
                                            style={{ width: "35px", height: "35px", cursor:"pointer", }}
                                            className="fntxlsx"
                                          />
                                        ) : (
                                           
                                           <img
                                             key={index}
                                             //src={item.attachment}
                                             src={item.attachment ? `${httpCommon.defaults.baseURL}${item.attachment}` :""}
                                             style={{
                                               width: "35px",
                                               height: "35px",
                                               cursor:"pointer",
                                             }}
                                             onClick={() => handleShowdata(item)}
                                           />
                                         )}
                                       </td>
   
                                       <td>{item.file_name}</td>
                                       <td>{item.audit_user}</td>
                                       <td>
                                         {new Date(
                                           item.audit_date.date
                                         ).toLocaleString("en-US", {
                                           year: "numeric",
                                           month: "2-digit",
                                           day: "2-digit",
                                           hour: "2-digit",
                                           minute: "2-digit",
                                           second: "2-digit",
                                           // Show milliseconds with 3 digits
                                         })}
                                       </td>
                                       <td>
                                         <button
                                           type="button"
                                          
                                           onClick={() => {
                                            setIsFormFiled(true);
                                            handleDeleteReferenceApi(item.RowID)
                                          }}
                                           className="btn multiplsimg"
                                         >
                                           <Iconify icon="carbon:close-outline" />
                                         </button>
                                       </td>
                                     </tr>
                                   ))}
   
                                 {selectedImages.map((image, index) =>
                                   image && index === undefined ? (
                                     <tr>
                                       <td>
                                         <img
                                           src={RefImg[0].attachment ? `${httpCommon.defaults.baseURL}${RefImg[0].attachment}` :""}
                                           style={{
                                             width: "35px",
                                             height: "35px",
                                           }}
                                         />
                                       </td>
                                     </tr>
                                   ) : image.name
                                       .toLowerCase()
                                       .endsWith(".pdf") ? (
                                     <tr key={index}>
                                       <td>
                                         <FontAwesomeIcon
                                           icon={faFilePdf}
                                           style={{
                                             width: "35px",
                                             height: "35px",
                                           }}
                                         />
                                       </td>
                                       <td>{image.name}</td>
                                       <td>Admin</td>
                                       <td>{new Date().toLocaleString() + ""}</td>
                                       <td>
                                         <button
                                           type="button"
                                           className="btn"
                                           onClick={(e) => {
                                             e.preventDefault();
                                             handleDeleteImg(index);
                                           }}
                                         >
                                           <Iconify icon="carbon:close-outline" />
                                         </button>
                                       </td>
                                     </tr>
                                   ) :
                                   image.name.toLowerCase().endsWith(".xlsx") ? (
                                     <tr key={index}>
                                     <td>
                                       <FontAwesomeIcon
                                         icon={faFileExcel}
                                         style={{
                                           width: "35px",
                                           height: "35px",
                                         }}
                                       />
                                     </td>
                                     <td>{image.name}</td>
                                     <td>Admin</td>
                                     <td>{new Date().toLocaleString() + ""}</td>
                                     <td>
                                       <button
                                         type="button"
                                         className="btn"
                                         onClick={(e) => {
                                           e.preventDefault();
                                           handleDeleteImg(index);
                                         }}
                                       >
                                         <Iconify icon="carbon:close-outline" />
                                       </button>
                                     </td>
                                   </tr>
                                     
                                   ) : image.name.toLowerCase().endsWith(".docx") ? (
                                     <tr key={index}>
                                     <td>
                                       <FontAwesomeIcon
                                         icon={faFileWord}
                                         style={{
                                           width: "35px",
                                           height: "35px",
                                         }}
                                       />
                                     </td>
                                     <td>{image.name}</td>
                                     <td>Admin</td>
                                     <td>{new Date().toLocaleString() + ""}</td>
                                     <td>
                                       <button
                                         type="button"
                                         className="btn"
                                         onClick={(e) => {
                                           e.preventDefault();
                                           handleDeleteImg(index);
                                         }}
                                       >
                                         <Iconify icon="carbon:close-outline" />
                                       </button>
                                     </td>
                                   </tr>
                                     
                                   ) : image.name.toLowerCase().endsWith(".log") ? (
                                     <tr key={index}>
                                     <td>
                                       <FontAwesomeIcon
                                         icon={faFileAlt}
                                         style={{
                                           width: "35px",
                                           height: "35px",
                                         }}
                                       />
                                     </td>
                                     <td>{image.name}</td>
                                     <td>Admin</td>
                                     <td>{new Date().toLocaleString() + ""}</td>
                                     <td>
                                       <button
                                         type="button"
                                         className="btn"
                                         onClick={(e) => {
                                           e.preventDefault();
                                           handleDeleteImg(index);
                                         }}
                                       >
                                         <Iconify icon="carbon:close-outline" />
                                       </button>
                                     </td>
                                   </tr>
                                     
                                   ) : image.name.toLowerCase().endsWith(".txt") ? (
                                    <tr key={index}>
                                    <td>
                                      <FontAwesomeIcon
                                        icon={faFileAlt}
                                        style={{
                                          width: "35px",
                                          height: "35px",
                                        }}
                                      />
                                    </td>
                                    <td>{image.name}</td>
                                    <td>Admin</td>
                                    <td>{new Date().toLocaleString() + ""}</td>
                                    <td>
                                      <button
                                        type="button"
                                        className="btn"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDeleteImg(index);
                                        }}
                                      >
                                        <Iconify icon="carbon:close-outline" />
                                      </button>
                                    </td>
                                  </tr>
                                    
                                  ): image.name.toLowerCase().endsWith(".php") ? (
                                     <tr key={index}>
                                     <td>
                                       <FontAwesomeIcon
                                         icon={faFileCode}
                                         style={{
                                           width: "35px",
                                           height: "35px",
                                         }}
                                       />
                                     </td>
                                     <td>{image.name}</td>
                                     <td>Admin</td>
                                     <td>{new Date().toLocaleString() + ""}</td>
                                     <td>
                                       <button
                                         type="button"
                                         className="btn"
                                         onClick={(e) => {
                                           e.preventDefault();
                                           handleDeleteImg(index);
                                         }}
                                       >
                                         <Iconify icon="carbon:close-outline" />
                                       </button>
                                     </td>
                                   </tr>
                                     
                                   ): (
                                     <tr key={index}>
                                       <td>
                                         <img
                                           key={index}
                                           src={URL.createObjectURL(image)}
                                           alt="Uploaded image"
                                           onClick={(e) => handleShowdd(e, image)}
                                           style={{
                                            width: "35px",
                                            height: "35px",
                                          }}
                                         />
                                       </td>
                                       <td>{image.name}</td>
                                       <td>Admin</td>
                                       <td>{new Date().toLocaleString() + ""}</td>
   
                                       <td>
                                         <button
                                           type="button"
                                           className="btn"
                                           onClick={(e) => {
                                             e.preventDefault();
                                             handleDeleteImg(index);
                                           }}
                                         >
                                           <Iconify icon="carbon:close-outline" />
                                         </button>
                                       </td>
                                     </tr>
                                   )
                                 )}
                               </tbody>
   
                               {isMyStateEmpty ? (
                                 <BootstrapDialog
                                   onClose={handleClosedd}
                                   aria-labelledby="customized-dialog-title"
                                   open={showdd}
                                 >
                                   <IconButton
                                     aria-label="close"
                                     onClick={handleClosedd}
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
                                     <Typography gutterBottom>
                                      
                                       <img
                                        // src={selectedImage}
                                         src={selectedImage ? `${httpCommon.defaults.baseURL}${selectedImage}` :""}
                                         style={{ width: "100%", height: "auto" }}
                                       />
                                     </Typography>
                                   </DialogContent>
                                 </BootstrapDialog>
                               ) : (
                                 <BootstrapDialog
                                   onClose={handleClosedd}
                                   aria-labelledby="customized-dialog-title"
                                   open={showdd}
                                 >
                                   <IconButton
                                     aria-label="close"
                                     onClick={handleClosedd}
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
                                     <Typography gutterBottom>
                                       <img
                                         style={{ height: "100%", width: "100%" }}
                                         src={URL.createObjectURL(handalImg)}
                                         alt="Uploaded image"
                                       />
                                     </Typography>
                                   </DialogContent>
                                 </BootstrapDialog>
                               )}
                             </table>
                           </div>
                           <div
                             style={{
                               display: "flex",
                               justifyContent: "center",
                               marginTop: "20px",
                             }}
                           >
                           <form onSubmit={handleSubmit} className="row">
                                     <div className="col-sm-10 text-center">
                                       <input
                                         type="file"
                                         ref={fileInputRef}
                                         style={{ display: "none" }}
                                         multiple
                                         onChange={(e) => {
                                          handleImageChange(e);    // Call the function with the event
                                          setIsFormFiled(true);     // Set the form field status
                                        }}
                                         className="form-control form-control-lg"
                                         id="formFileMultiple"
                                       />
                                       {/* <Button
                                         onClick={handleButtonClick}
                                         type="submit"
                                        // className="btn Refbtl"
                                        className="tabAddButton"
                                         
                                       >
                                         + Add Attachment
                                       </Button> */}
                                     </div>
                                   </form>
                                   </div>
                         </div>
                    </Card>
                  </Grid>
                  </Grid>
              </Box>
              
              {/* Assign model popup */}
             
              <BootstrapDialog
                onClose={handleCloseModalAssign}
                aria-labelledby="customized-dialog-title"
                open={modalOpenAssign}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Assign To
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalAssign}
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
                <Table className={classes.table} aria-label="customized table">
                <TableBody>
                  {assignEmp.map((employee) => (
                    <TableRow key={employee.id}  sx={{
                      borderBottom: '1px solid #0000001f',
                      cursor: 'pointer',  // Apply pointer cursor on hover
                      '&:hover': {
                        backgroundColor: '#f5f5f5',  // Optional: Highlight row on hover
                      },
                    }}
                     onClick={() => handleTableRowClick(employee.emp_mst_empl_id, employee.emp_mst_name)}
                    >
                      <TableCell>
                        <div className={classes.circle}>
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          sx={{ marginLeft: 2, '& .MuiBadge-dot': { width: 8, height: 8, backgroundColor: getStatusColor(employee.emp_mst_att_sts) } }}
                        >
                        
                        <Avatar sx={{ bgcolor: '#F5DEB3', color:'#000', width: 40, height: 40,fontSize:'13px',fontWeight: 'bold' }}>
                            {employee.emp_mst_name.split(' ').map((namePart) => namePart[0]).join('').substring(0, 2).toUpperCase()}
                        </Avatar>

                        </StyledBadge>
                        </div>
                      </TableCell>
                      
                    <TableCell >
                      <span style={{ fontWeight: 'bold',fontSize:'13px' }}>{employee.emp_mst_empl_id}</span>
                      <br />
                      <span style={{ fontWeight: 'bold',fontSize:'13px' }}>{employee.emp_mst_name}</span>
                      <br />
                      <span style={{ fontWeight: 'bold',fontSize:'13px' }}>{employee.emp_mst_title}</span>

                  
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 'bold',fontSize:'13px' }}>WO Corrective</span>
                      <br />
                     
                    </div>
                    <div className={`${classes.woBadge} ${employee.work_count_c === 0 ? classes.greyBadge : classes.greenBadge}`}>{employee.work_count_c}</div>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 'bold',fontSize:'13px' }}>WO Preventive</span>
                      <br />
                      <div className={`${classes.woBadge} ${employee.work_count_p === 0 ? classes.greyBadge : classes.greenBadge}`}>{employee.work_count_p}</div>
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </DialogContent>
               
              </BootstrapDialog>
              {/* Asset model popup end*/}

              {/* Asset Parent Flag model popup */}
              <BootstrapDialog
                
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseModal(event, reason);
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={modalOpenAsset}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Asset No
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModal}
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
                  <div className="TblSelect">
                    <GetAssetList
                      onRowClick={handleRowData2}
                      onChangePage={handleRowDataPagechg}
                      onSearchChange={handelRowSearch}
                    />
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span class="TotlFont">
                      {TotalAssetNo ? TotalAssetNo
                        : 
                          0}
                      &nbsp;Asset
                    </span>
                  </div>

                  <div className="mlauto">
                    <Button variant="primary" onClick={handleCloseModal}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
              {/* Asset model popup end*/}

               {/* Asset Customer Code model popup */}
               <BootstrapDialog
                onClose={handleCloseModalCustomeCode}
                aria-labelledby="customized-dialog-title"
                open={modalOpenAssetCustomerCode}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Customer Code
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalCustomeCode}
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
                  <div className="TblSelect">
                    {/* <AssetCustomerCodeList
                      onRowClick={handleRowData3}
                      onChangePage={handleRowDataPagechg}
                      onSearchChange={handelRowSearch}
                    /> */}
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span class="TotlFont">
                      {TotalSearch
                        ? // Content to render if condition1 is true
                          TotalSearch
                        : viewedTotlRows
                        ? // Content to render if condition2 is true
                          TotalAssetNo - viewedTotlRows
                        : TotalAssetNo
                        ? // Content to render if condition3 is true
                          TotalAssetNo
                        : // Content to render if none of the conditions are true
                          0}
                      &nbsp;Total
                    </span>
                  </div>

                  <div className="mlauto">
                    <Button variant="primary" onClick={handleCloseModalCustomeCode}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
               {/* Asset customer code model popup end*/}

              {/* Frequency Code Flag model popup */}
              <BootstrapDialog
                
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseClickFrequency(event, reason);
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={modalOpenFrequency}
                maxWidth="md"
                fullWidth
                >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Frequency Code
                 
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseClickFrequency}
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
                  <div className="TblSelect">
                    <FrequencyCodeList
                      onRowClick={handleRowDatafrequency}
                   
                    />
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span class="TotlFont">
                      {TotalAssetNo ? TotalAssetNo
                        : 
                          0}
                      &nbsp;Asset
                    </span>
                  </div>

                  <div className="mlauto">
                    <Button variant="primary" onClick={handleCloseClickFrequency}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
              {/* Frequency Code model popup end*/}

              {/******************** Status Details ********************/}
              <div>
                <BootstrapDialog
                  onClose={StatushandleClose}
                  aria-labelledby="customized-dialog-title"
                  open={StatusShow}
                  maxWidth="lg"
                  fullWidth
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="dailogTitWork"
                  >
                    Asset Status Audit
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={StatushandleClose}
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
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "600px",
                        marginLeft: "110px",
                        marginTop: "-30px",
                      }}
                    >
                      <StepContainer>
                        {steps.map(
                          ({
                            step,
                            label,
                            label1,
                            label2,
                            label3,
                            label4,
                            label5,
                          }) => (
                            <div
                              key={step}
                              style={{ position: "relative", zIndex: 1 }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "grey",
                                  position: "absolute",
                                  left: "-81px",
                                  top: "45px",
                                  width: "80px",
                                  height: "20px",
                                  borderRadius: "5%",
                                  textAlign: "right",
                                }}
                              >
                                {label5}
                              </div>
                              <div
                                step={step}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: "#4694d1",
                                  border: `3px solid ${
                                    step === "completed" ? "#0080FF" : "#F3E7F3"
                                  }`,
                                  transition: "0.4s ease",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{ fontSize: "15px", color: "#f3e7f3" }}
                                >
                                  {step}
                                </div>
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  bottom: "30px",
                                  textAlign: "left",
                                  left: "50px",
                                }}
                              >
                                <div
                                  key={step}
                                  style={{ fontSize: "15px", color: "#4a154b" }}
                                >
                                  {label} ({label1})
                                </div>
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  bottom: "30px",
                                  textAlign: "left",
                                  left: "50px",
                                }}
                              >
                                <div
                                  key={step}
                                  style={{ fontSize: "11px", color: "grey" }}
                                >
                                  Status Update By: {label2} ({label3})
                                </div>
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  bottom: "30px",
                                  textAlign: "left",
                                  left: "50px",
                                }}
                              >
                                <div
                                  key={step}
                                  style={{ fontSize: "11px", color: "grey" }}
                                >
                                  On Start Date: {label4}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </StepContainer>
                    </div>
                  </DialogContent>
                </BootstrapDialog>
              </div>
              {/******************** Comments add Details ********************/}

              {/* single Upload Img Show */}
              <BootstrapDialog
                onClose={UploadImghandleClose}
                aria-labelledby="customized-dialog-title"
                open={uploadImgShow}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Selected Image
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={UploadImghandleClose}
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="upload_img"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </div>
                </DialogContent>
              </BootstrapDialog>
              {/******************** PM Setup ********************/}
              <BootstrapDialog
                onClose={PMSetuphandleClose}
                aria-labelledby="customized-dialog-title"
                open={PMSetupShow}
                maxWidth="lg"
                fullWidth
              >
                {/* <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  PM Setup
                </DialogTitle> */}
                <IconButton
                  aria-label="close"
                  onClick={PMSetuphandleClose}
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
                 
                    {/* <PmSetup 
                    data={{
                        RowID: RowID,
                        WorkOrderNo: WorkOrderNo,
                        Asset_No: AssetNo,
                      }}
                    /> */}
                  
                </DialogContent>
              </BootstrapDialog>
              
              {/******************** WO History ********************/}
              <BootstrapDialog
                onClose={WOHistoryhandleClose}
                aria-labelledby="customized-dialog-title"
                open={WOHistoryShow}
                maxWidth="lg"
                fullWidth
              >
            
                <IconButton
                  aria-label="close"
                  onClick={WOHistoryhandleClose}
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
                 
                    {/* <WoHistory 
                    data={{
                        RowID: RowID,
                        WorkOrderNo: WorkOrderNo,
                        Asset_No: AssetNo,
                      }}
                    /> */}
                  
                </DialogContent>
              </BootstrapDialog>

              {/******************** Relocation History ********************/}
              <BootstrapDialog
                onClose={RelocationHistoryhandleClose}
                aria-labelledby="customized-dialog-title"
                open={RelocationHistoryShow}
                maxWidth="lg"
                fullWidth
              >
            
                <IconButton
                  aria-label="close"
                  onClick={RelocationHistoryhandleClose}
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
                    {/* <RelocationHistory 
                    data={{
                        RowID: RowID,
                        WorkOrderNo: WorkOrderNo,
                        Asset_No: Asset_No,
                      }}
                    /> */}
                  
                </DialogContent>
              </BootstrapDialog>

               {/******************** Check List ********************/}
               <BootstrapDialog
                onClose={CheckListhandleClose}
                aria-labelledby="customized-dialog-title"
                open={CheckListShow}
                maxWidth="lg"
                fullWidth
              >
            
                <IconButton
                  aria-label="close"
                  onClick={CheckListhandleClose}
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
                    {/* <CheckList 
                    data={{
                        RowID: RowID,
                        WorkOrderNo: WorkOrderNo,
                        Asset_No: AssetNo,
                      }}
                    /> */}
                  
                </DialogContent>
              </BootstrapDialog>

              {/********************* Assign To  *************************/}

              <div>
                <BootstrapDialog
                 
                  onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                      AssignStatushandleClose(event, reason);
                    }
                  }}
                  aria-labelledby="customized-dialog-title"
                  open={AssignStatusShow}
                  maxWidth="xs"
                  fullWidth
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="dailogTitWork"
                  >
                    Assign History
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={AssignStatushandleClose}
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
                    <div
                      style={{
                        width: "auto",
                        maxWidth: "max-content",
                        marginLeft: "100px",
                        marginTop: "-30px",
                      }}
                    >
                      <StepContainer>
                        {AssignStatusToOther.map(
                          ({
                            step,
                            label,
                            label1,
                            label2,
                            label3,
                            label4,
                            label5,
                          }) => (
                            <div
                              key={step}
                              style={{ position: "relative", zIndex: 1 }}
                            >
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "grey",
                                  position: "absolute",
                                  left: "-90px",
                                  top: "0px",
                                  width: "80px",
                                  height: "20px",
                                  borderRadius: "5%",
                                  textAlign: "right",
                                }}
                              >
                                {label4}
                              </div>
                              <div
                                step={step}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  backgroundColor: "#4694d1",
                                  border: `3px solid ${
                                    step === "completed" ? "#0080FF" : "#F3E7F3"
                                  }`,
                                  transition: "0.4s ease",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  style={{ fontSize: "15px", color: "#f3e7f3" }}
                                >
                                  {step}
                                </div>
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  bottom: "30px",
                                  textAlign: "left",
                                  left: "50px",
                                }}
                              >
                                <div
                                  key={step}
                                  style={{ fontSize: "15px", color: "#4a154b" }}
                                >
                                  {label}
                                </div>
                              </div>

                              <div
                                style={{
                                  position: "relative",
                                  bottom: "30px",
                                  textAlign: "left",
                                  left: "50px",
                                }}
                              >
                                <div
                                  key={step}
                                  style={{
                                    fontSize: "12px",
                                    color: "grey",
                                    fontWeight: "600",
                                  }}
                                >
                                  {label1}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </StepContainer>
                    </div>
                  </DialogContent>
                </BootstrapDialog>
              </div>

              <div className="AssetFromSnackbar">
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={null}
                  onClose={handleCloseSnackbar}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  // sx={{
                  //   boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)'
                  // }}
                  sx={{
                    boxShadow:
                      "0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)",
                    "& .MuiAlert-filledError": {
                      backgroundColor: "#fff",
                      color: "#000",
                      fontWeight: "600",
                      position: "relative",
                      animation: snackbarOpen
                        ? "bounce-in 0.5s ease-out"
                        : "none", // Apply bouncing animation conditionally
                    },
                  }}
                >
                  <Alert
                    onClose={handleCloseSnackbar}
                    severity="error"
                    variant="filled"
                    // sx={{ backgroundColor: '#fff', color: '#000', fontWeight: '600', position: 'relative' }}
                    sx={{
                      "@keyframes bounce-in": {
                        "0%": { transform: "scale(0.9)" },
                        "50%": { transform: "scale(1.05)" },
                        "100%": { transform: "scale(1)" },
                      },
                    }}
                  >
                    {snackbarMessage}

                    <LinearProgress
                      variant="determinate"
                      value={snackbarOpen ? 100 - progress : 0}
                      style={{
                        width: "99%",
                        position: "absolute",
                        bottom: "0",
                        marginLeft: "-50px",
                      }}
                      sx={{
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "green", // Change the color here
                        },
                      }}
                    />
                  </Alert>
                </Snackbar>
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
}

CreateNewPmform.propTypes = {
  currentUser: PropTypes.object,
};