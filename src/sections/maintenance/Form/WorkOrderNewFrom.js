import PropTypes from "prop-types";
import React, { useState, useEffect, useRef,useCallback } from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
// @bootstrap

import Table from '@mui/material/Table';
import TextareaAutosize from "@mui/material/TextareaAutosize";
import TableRow from "@mui/material/TableRow";
import TableBody from '@mui/material/TableBody';
import TableCell from "@mui/material/TableCell";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import IconButton from "@mui/material/IconButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {  DatePicker as AntDatePicker } from 'antd';

import heic2any from "heic2any";   // Conver heic img to jpeg

import dayjs from 'dayjs';
import 'antd/dist/reset.css';
 

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
// import CloseIcon from '@mui/icons-material/Close';

// Toastfy
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@mui/material/Unstable_Grid2";

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Checkbox from "@mui/material/Checkbox";
import { useLocation, useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "moment";
import "moment-timezone";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
// utils

import { Avatar, Badge } from '@mui/material'
// routes
import { RouterLink } from "src/routes/components";

import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";

import materialImg from "../../../assets/img/screw.png";
import specialOrderImg from "../../../assets/img/Special_Order.png";
import outsourecImg from "../../../assets/img/setup.png";
import miscImg from "../../../assets/img/toolkit.png";
import WorkOrderAssetNo from "../WorkOrderAssetNo";
import Tooltip from "@mui/material/Tooltip";
import WorkOrderTimeCard from "../component_module/WordOrderTimeCard";
import WorkOrderDownTime from "../component_module/WorkOrderDownTime";
//import WorkOrderSpecialOrder from "../component_module/Planning/WorkOrderSpecialOrder";
import WorkOrderCheckList from "../component_module/Check_list/WorkOrderCheckList";
import WorkOrderComments from "../component_module/Comments/WorkOrderComments";
import OriginalPriorityModel from "../model/OriginalPriorityModel";
import WorkOrderMaterial from "../component_module/Planning/WorkOrderMaterial";
import WorkorderSpecial from "../component_module/Planning/WorkOrderSpecial";
import WorkOrderOutsource from "../component_module/Planning/WorkOrderOutsource";
import WorkOrderMisc from "../component_module/Planning/WorkOrderMisc";
import { useSwalCloseContext } from "src/sections/ContextApi/SwalCloseContext";

//const MySwal = withReactContent(Swal);
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

export default function WorkOrderText({ currentUser, onPageChange }) {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
  const location = useLocation();

  const {swalCloseTime} = useSwalCloseContext();

  //const searchParams = new URLSearchParams(location.search);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [progress, setProgress] = useState(0);

  // const currentPage = searchParams.get('currentPage') || 1;
  // const selecOption = searchParams.get('optvl') || "";

  const state = location.state || {};
  const { RowID} = state || {};
  const { currentPage, selectDropRowID, selectedOption, AssetHirechyId, ModuleFrom,TabBtnName } = state;

  const { completeRowID } = location.state || {};
  const { closeRowID } = location.state || {};

  const [loading, setLoading] = useState(true);

  const [wkoMstLabel, setWkoMstLabel] = useState([]);
  const [wkodetLabel, setWkoDetLabel] = useState([]);

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const settings = useSettingsContext();

  const currentDate = new Date();

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImages2, setSelectedImages2] = useState([]);
 
  const [selectedPdfFiles, setSelectedPdfFiles] = useState([]);
  const [RefImg, setRefImg] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [getDbImg, setDbImg] = useState();
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [removedRefItems, setRemovedRefItems] = useState([]);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [imageSelect, setImageSelect] = useState({ name: "", path: "" });
  const [imguploadStatus, setImguploadStatus] = useState("");
  const [imguploadRefStatus, setImguploadRefStatus] = useState("");
  const [Tabvalue, setTabValue] = useState(0);
  const [isOpenAsset, setIsOpenAsset] = useState(true);
  const [isOpenWorkInfo, setIsOpenWorkInfo] = useState(true);
  const [isOpenAdditionalWorkInfo, setIsOpenAdditionalWorkInfo] = useState(true);
  const [isOpenAccountInfo, setIsOpenAccountInfo] = useState(true);
  const [ isOpenUDFInfo,setIsOpenUDFInfo] = useState(false)

  const [showdd, setShowdd] = useState(false);
  const [handalImg, sethandalImg] = useState({});
  const handleClosedd = () => setShowdd(false);
  const [showdd2, setShowdd2] = useState(false);
  const handleClosedd2 = () => setShowdd2(false);

  const [Asset_No, setAsset_No] = useState("");
  const [TotalAssetNo, setTotalAssetNo] = useState(0);
  const [TotalSearch, setTotalSearch] = useState("");
  const [viewedTotlRows, setViewedTotlRows] = useState(0);

  // form filed state
  const [Status, setStatus] = useState([]);
  const [Plan_Priority, setPlan_Priority] = useState([]);
  const [selected_Project_ID, setSelected_Project_ID] = useState([]);
  const [selected_Plan_Priority, setSelected_Plan_Priority] = useState([]);
  const [Asset_Group_Code, setAsset_Group_Code] = useState([]);
  const [Fault_Code, setFault_Code] = useState([]);
  const [selected_Fault_Code, setSelected_Fault_Code] = useState([]);
  const [Asset_Status, setAsset_Status] = useState([]);
  const [Charge_Cost_Center, setCharge_Cost_Center] = useState([]);
  const [selected_Charge_Cost_Center, setSelected_Charge_Cost_Center] =
    useState([]);
  const [Supervisor_ID, setSupervisor_ID] = useState([]);
  const [Work_Group, setWork_Group] = useState([]);
  const [selected_Work_Group, setSelected_Work_Group] = useState([]);
  const [Asset_Level, setAsset_Level] = useState([]);
  const [selected_Asset_Level, setSelected_Asset_Level] = useState([]);
  const [Asset_Location, setAsset_Location] = useState([]);
  const [Cause_Code, setCause_Code] = useState([]);
  const [Action_Code, setAction_Code] = useState([]);
  const [Delay_Code, setDelay_Code] = useState([]);
  const [Work_Type, setWork_Type] = useState([]);
  const [Work_Class, setWork_Class] = useState([]);

  const [Work_Area, setWork_Area] = useState([]);
  const [Originator, setOriginator] = useState([]);
  const [inputValueOriginator, setInputValueOriginator] = useState("");
  const [WorkOrderNo, setWorkOrderNo] = useState("");
  //const [selected_Status, setSelected_Status] = useState([]);
  const [selected_Status, setSelected_Status] = useState();
  const [WorkOrderDefaultStats, setWorkOrderDefaultStatus] = useState([]);

  const [selected_Status2,setSelected_Status2] = useState([]);
  const [selected_Asset_Status, setSelected_Asset_Status] = useState([]);
  const [selected_Asset_Group_Code, setSelected_Asset_Group_Code] = useState(
    []
  );
  const [selected_Work_Area, setSelected_Work_Area] = useState([]);
  const [selected_Originator, setSelected_Originator] = useState([]);
  const [selected_Asset_Location, setSelected_Asset_Location] = useState([]);
  const [Description, setDescription] = useState("");
  const [Phone, setPhone] = useState("");
  const [OriginationDate, setOriginationDate] = useState(new Date());
  const [DueDate, setDueDate] = useState(new Date());
  const [CorrectiveAction, setCorrectiveAction] = useState("");
  const [CorrectiveActionTemp, setCorrectiveActionTemp] = useState(CorrectiveAction);
  const [selected_Original_Periority, setSelected_Original_Periority] =
    useState([]);
  const [selected_Cause_Code, setSelected_Cause_Code] = useState([]);
  const [selected_Cause_Code_temp,setSelected_Cause_Code_temp] = useState(selected_Cause_Code);

  const [ScheduleDate, setScheduleDate] = useState();
  const [selected_Action_Code, setSelected_Action_Code] = useState([]); 
  const [selected_Action_Code_temp,setSelected_Action_Code_temp] = useState(selected_Action_Code);

  const [ExceptionDate, setExceptionDate] = useState();
  const [selected_Delay_Code, setSelected_Delay_Code] = useState([]);
  const [StatusChangeDate, setStatusChangeDate] = useState();
  const [Project_ID, setProject_ID] = useState([]);

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
  const [selected_Approver, setSelected_Approver] = useState([]);

  const [Assign_To, setAssign_To] = useState([]);
  const [selected_Assign_To, setSelected_Assign_To] = useState([]);

  const [Permanent_ID, setPermanent_ID] = useState("");

  const [Temporary_Asset, setTemporary_Asset] = useState(0);
  const [CheckBox_Temporary_Asset, setCheckBox_Temporary_Asset] = useState(0);

  const [Approved, setApproved] = useState(0);
  const [CheckBox_Approved, setCheckBox_Approved] = useState(0);

  const [Safety, setSafety] = useState(0);
  const [CheckBox_Safety, setCheckBox_Safety] = useState(0);

  const [Customer_Code, setCustomer_Code] = useState([]);
  const [selected_Customer_Code, setSelected_Customer_Code] = useState([]);

  const [Labor_Account, setLabor_Account] = useState([]);
  const [selected_Labor_Account, setSelected_Labor_Account] = useState([]);

  const [Material_Account, setMaterial_Account] = useState([]);
  const [selected_Material_Account, setSelected_Material_Account] = useState(
    []
  );

  const [Credit_Cost_Center, setCredit_Cost_Center] = useState([]);
  const [selected_Credit_Cost_Center, setSelected_Credit_Cost_Center] =
    useState([]);

  const [Contract_Account, setContract_Account] = useState([]);
  const [selected_Contract_Account, setSelected_Contract_Account] = useState(
    []
  );

  const [Miscellaneous_Account, setMiscellaneous_Account] = useState([]);
  const [selected_Miscellaneous_Account, setSelected_Miscellaneous_Account] =
    useState([]);

  const [AutoNumring, setAutoNumring] = useState("");

  const [UDFNote1, setUDFNote1] = useState("");
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

  const [UDFNumber_1, setUDFNumber_1] = useState("");
  const [UDFNumber_2, setUDFNumber_2] = useState("");
  const [UDFNumber_3, setUDFNumber_3] = useState("");
  const [UDFNumber_4, setUDFNumber_4] = useState("");
  const [UDFNumber_5, setUDFNumber_5] = useState("");

  const [UDFDate_1, setUDFDate_1] = useState("");
  const [UDFDate_2, setUDFDate_2] = useState("");
  const [UDFDate_3, setUDFDate_3] = useState("");
  const [UDFDate_4, setUDFDate_4] = useState("");
  const [UDFDate_5, setUDFDate_5] = useState("");
  const [Button_save, setButton_save] = useState("");
  const [getDbImgRowId, setDbImgRowId] = useState("");
  const [SpecialOdrResult, setSpecialOdrResult] = useState([]);

  const [steps, setsteps] = useState([]);
  const StatushandleClose = () => setStatusShow(false);

  const [StatusShow, setStatusShow] = useState(false);

  const [AssignStatusShow, setAssignStatusShow] = useState(false);
  const AssignStatushandleClose = () => setAssignStatusShow(false);
  const [AssignStatusToOther, setAssignStatusOther] = useState([]);

  const [CommentShow, setCommentShow] = useState(false);
  const CommenthandleClose = () => setCommentShow(false);
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
  const [isAssetStatusEmpty, setIsAssetStatusEmpty] = useState(false);

  const [isFaultCodeEmpty, setIsFaultCodeEmpty] = useState(false);

  const [isWorkTypeEmpty, setIsWorkTypeEmpty] = useState(false);
  const [isWorkGroupEmpty, setIsWorkGroupEmpty] = useState(false);
  const [isAssetNoEmpty, setIsAssetNoEmpty] = useState(false);
  const [isCorrectiveValueEmpty, setIsCorrectiveValueEmpty] = useState(false);
  const [isCorrectiveValueEmptyTemp, setIsCorrectiveValueEmptyTemp] = useState(false);
  const [isCauseCodeValueEmpty, setIsCauseCodeValueEmpty] = useState(false);
  const [isCauseCodeValueEmptyTemp, setIsCauseCodeValueEmptyTemp] = useState(false);
  const [isActionCodeValueEmpty, setIsActionCodeValueEmpty] = useState(false);
  const [isActionCodeValueEmptyTemp,setIsActionCodeValueEmptyTemp] = useState(false);
  
  const [isOpenWork, setIsOpenWork] = useState(true);
 

  const [WorkOrderMandatoryFiled, setWorkOrderMandatoryFiled] = useState([]);
  const [errorField, setErrorField] = useState(null);

  const [isWorkOrderStatusEmpty, setIsWorkOrderStatusEmpty] = useState(false);
  const [isWorkDescEmpty, setIsWorkDescEmpty] = useState(false);
  const [isWorkOrderAssetNoEmpty, setisWorkOrderAssetNoEmpty] = useState(false);
  const [isChargeCostEmpty, setIsChargeCostEmpty] = useState(false);

  const autocompleteRef = useRef(null);
  const assetNoAutocompleteRef = useRef(null);
  const faultCodeAutocompleteRef = useRef(null);

  const [isFormFiled, setIsFormFiled] = useState(false);
  const [assignEmp,setEmpAssign] = useState([]);
  const [checkListData,setCheckListData] = useState([]);
  
  const classes = useStyles();

  const [modalOpenAsset, setModalOpenAsset] = useState(false);
  const [modalOpenAssign, setModalOpenAssign] = useState(false);
  const [modalOpenComplete, setModalOpenComplete] = useState(false);
  const [modalOpenClose, setModalOpenClose] = useState(false);
  const [workRequestNo, setworkRequestNo] = useState("");
  const [prmRequestNo, setprmRequestNo] = useState("");
  const [modalOpenWorkReq, setModalOpenWorkReq] = useState(false);
  
  const [WRStatus, setWRStatus] = useState("");
  const [WROriDate, setWROriDate] = useState("");

  const [passCompleteBtn, setPassCompleteBtn] = useState("");
  const [dueDateIncrementSet,setdueDateIncrement] = useState("");
  const planPerioritycompleteRef = useRef(null);
  const [modalOpenplanPeriority, setModalOpenplanPeriority] = useState(false);

  const [NestedTabValue, setNestedTabValue] = useState(0);
  const handleNestedTabChange = (event, newValue) => setNestedTabValue(newValue);
  const [WorkOrderSubModuleBtn, setWorkOrderSubModuleBtn] = useState("");
  
  // Get All Filed label Name
  const getWorkOrderLebel = async () => {
    try {
      const response = await httpCommon.get("/getWorkOrderFromLebal.php");
     //   console.log("response____work_order_label",response);
      if (response.data.status === "SUCCESS") {
        setWkoMstLabel(response.data.data.wko_mst);
        setWkoDetLabel(response.data.data.wko_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getWorkOrderMandatoryfiled = async () => {
    
    try {
      const response = await httpCommon.get(
        "/get_workOrder_mandatoryFiled.php"
      );
    //  console.log("response____Mandatoryfiled",response);
      if (response.data.data.MandatoryField.length > 0) {
        setWorkOrderMandatoryFiled(response.data.data.MandatoryField);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const get_workordermaster_select = async () => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

    try {
      let responseJson;
      if (
        completeRowID 
      ) {
        responseJson = await httpCommon.get(
          "/get_workordermaster_select.php?RowID=" + completeRowID
        );
      } else if (
        closeRowID 
      ) {
        responseJson = await httpCommon.get(
          "/get_workordermaster_select.php?RowID=" + closeRowID
        );
      } else {
        responseJson = await httpCommon.get(
          "/get_workordermaster_select.php?RowID=" + RowID
        );
      }
      // console.log("responseJson___today___111", responseJson);
      if (responseJson.data.status === "SUCCESS") {
        // *** Set All data to state
        const formatNumber = (number) => {
          
          if (number === null || number === undefined || isNaN(Number(number))) {
            return ''; // Return an empty string for invalid numbers
          }
        
          let [integerPart, decimalPart] = number.toString().split('.');
          integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
        
          return `${integerPart}.${decimalPart}`;
        };

        setWorkOrderNo(responseJson.data.data["0"].wko_mst_wo_no);
        setAsset_No(responseJson.data.data["0"].wko_mst_assetno);

        const statusValue = responseJson.data.data[0].wko_mst_status;

        // Split the status value by " : " to extract the key and label
        const statusParts = statusValue.split(" : ");

        // Set the state with the key and label
        setSelected_Status({
          key: statusParts[2],              // WIP
          label: `${statusParts[0]} : ${statusParts[1]}`,  // WIP : Work IN Progress
        });

        setSelected_Asset_Status({
          label: responseJson.data.data[0].wko_mst_asset_status,
        });
        setSelected_Plan_Priority(
           responseJson.data.data[0].wko_mst_plan_priority,
        );
        setSelected_Asset_Group_Code({
          label: responseJson.data.data["0"].wko_mst_asset_group_code,
        });
        setSelected_Charge_Cost_Center({
          label: responseJson.data.data[0].wko_mst_chg_costcenter,
        });
        setSelected_Work_Area({
          label: responseJson.data.data[0].wko_mst_work_area,
        });
        setSelected_Originator({
          label: responseJson.data.data[0].wko_mst_originator,
        });
        setSelected_Asset_Level({
          label: responseJson.data.data[0].wko_mst_asset_level,
        });
        setPhone(responseJson.data.data["0"].wko_mst_phone);

        setSelected_Asset_Location({
          label: responseJson.data.data[0].wko_mst_asset_location,
        });
        setworkRequestNo(
          responseJson.data.data["0"].wko_det_wr_no
        );

        setprmRequestNo(
          responseJson.data.data["0"].wko_det_pm_idno
        );

        if (responseJson.data.data[0].wko_mst_flt_code == null) {
          setSelected_Fault_Code("");
        } else {
          setSelected_Fault_Code({
            label: responseJson.data.data[0].wko_mst_flt_code,
          });
        }

        setDescription(responseJson.data.data["0"].wko_mst_descs);
        //setDbImg(responseJson.data.data['0'].attachment)

        if (responseJson.data.data["0"].wko_mst_org_date == null) {
          setOriginationDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_mst_org_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setOriginationDate(formattedDate);
        }

        if (responseJson.data.data["0"].wko_mst_due_date == null) {
          setDueDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_mst_due_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setDueDate(formattedDate);
        }

        setCorrectiveAction(responseJson.data.data["0"].wko_det_corr_action);
        setSelected_Project_ID({
          label: responseJson.data.data[0].wko_mst_project_id,
        });

        setSelected_Original_Periority({
          label: responseJson.data.data[0].wko_mst_orig_priority,
        });
        setSelected_Cause_Code({
          label: responseJson.data.data[0].wko_det_cause_code,
        });

        if (responseJson.data.data["0"].wko_det_sched_date == null) {
          setScheduleDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_sched_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setScheduleDate(formattedDate);
        }

        setSelected_Action_Code({
          label: responseJson.data.data[0].wko_det_act_code,
        });

        if (responseJson.data.data["0"].wko_det_exc_date == null) {
          setExceptionDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_exc_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setExceptionDate(formattedDate);
        }
        setSelected_Delay_Code({
          label: responseJson.data.data[0].wko_det_delay_cd,
        });

        if (responseJson.data.data["0"].wko_det_sc_date == null) {
          setStatusChangeDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_sc_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setStatusChangeDate(formattedDate);
        }

        setSelected_Work_Type({
          label: responseJson.data.data[0].wko_det_work_type,
        });

        if (responseJson.data.data["0"].wko_det_cmpl_date == null) {
          setCompletionDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_cmpl_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setCompletionDate(formattedDate);
        }
        setSelected_Work_Class({
          label: responseJson.data.data[0].wko_det_work_class,
        });

        if (responseJson.data.data["0"].wko_det_clo_date == null) {
          setCloseDate("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_clo_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setCloseDate(formattedDate);
        }

        // setSelected_Work_Group({
        //   label: responseJson.data.data["0"].wko_det_work_grp.replace(/\s*:\s*/, ' : '),
        // });

        setSelected_Work_Group({
          label: (responseJson.data.data["0"].wko_det_work_grp ?? "").replace(/\s*:\s*/, ' : '),
        });
        

        setSelected_Supervisor_ID({
          label: responseJson.data.data[0].wko_det_supv_id,
        });
        setSelected_Planner({
          label: responseJson.data.data[0].wko_det_planner,
        });
        setSelected_Approver({
          label: responseJson.data.data[0].wko_det_approver,
        });
        setSelected_Assign_To({
          label: responseJson.data.data[0].wko_det_assign_to,
        });
        setPermanent_ID(responseJson.data.data["0"].wko_det_perm_id);
        setTemporary_Asset(responseJson.data.data["0"].wko_det_temp_asset);
        setApproved(responseJson.data.data["0"].wko_det_approved);
        setSafety(responseJson.data.data["0"].wko_det_safety);

      
        if(responseJson.data.data[0].wko_det_customer_cd === "" && responseJson.data.data[0].wko_det_customer_cd === null)
          {
            setSelected_Customer_Code({ label: "" });
          }else{
            setSelected_Customer_Code({    label: responseJson.data.data[0].wko_det_customer_cd});
          }
        setSelected_Labor_Account({
          label: responseJson.data.data[0].wko_det_laccount,
        });
        setSelected_Material_Account({
          label: responseJson.data.data[0].wko_det_maccount,
        });
        setSelected_Credit_Cost_Center({
          label: responseJson.data.data[0].wko_det_crd_costcenter,
        });
        setSelected_Contract_Account({
          label: responseJson.data.data[0].wko_det_caccount,
        });
        setSelected_Miscellaneous_Account({
          label: responseJson.data.data[0].wko_det_saccount,
        });

        setUDFNote1(responseJson.data.data["0"].wko_det_note1);
        setUDFText_1(responseJson.data.data["0"].wko_det_varchar1);
        setUDFText_2(responseJson.data.data["0"].wko_det_varchar2);
        setUDFText_3(responseJson.data.data["0"].wko_det_varchar3);
        setUDFText_4(responseJson.data.data["0"].wko_det_varchar4);
        setUDFText_5(responseJson.data.data["0"].wko_det_varchar5);
        setUDFText_6(responseJson.data.data["0"].wko_det_varchar6);
        setUDFText_7(responseJson.data.data["0"].wko_det_varchar7);
        setUDFText_8(responseJson.data.data["0"].wko_det_varchar8);
        setUDFText_9(responseJson.data.data["0"].wko_det_varchar9);
        setUDFText_10(responseJson.data.data["0"].wko_det_varchar10);

        setUDFNumber_1(formatNumber(responseJson.data.data["0"].wko_det_numeric1));
        setUDFNumber_2(formatNumber(responseJson.data.data["0"].wko_det_numeric2));
        setUDFNumber_3(formatNumber(responseJson.data.data["0"].wko_det_numeric3));
        setUDFNumber_4(formatNumber(responseJson.data.data["0"].wko_det_numeric4));
        setUDFNumber_5(formatNumber(responseJson.data.data["0"].wko_det_numeric5));

        if (responseJson.data.data["0"].wko_det_datetime1 == null) {
          setUDFDate_1("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime1.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_1(formattedDate);
        }

        if (responseJson.data.data["0"].wko_det_datetime2 == null) {
          setUDFDate_2("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime2.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_2(formattedDate);
        }

        if (responseJson.data.data["0"].wko_det_datetime3 == null) {
          setUDFDate_3("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime3.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_3(formattedDate);
        }
        if (responseJson.data.data["0"].wko_det_datetime4 == null) {
          setUDFDate_4("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime4.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_4(formattedDate);
        }

        if (responseJson.data.data["0"].wko_det_datetime5 == null) {
          setUDFDate_5("");
        } else {
          const apiDate = responseJson.data.data["0"].wko_det_datetime5.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS"
          ).toDate();
          setUDFDate_5(formattedDate);
        }
        fetchStatusData();

        Swal.close();
        fetchImgData();
      } else {
       // console.log("comingelse_____");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data,
        });
      }
    } catch (error) {
      console.error("Error in get_workordermaster_select:", error); 
      Swal.fire({
        icon: "error",
        title: "Oops get_WorkOrder_select...",
        text: error,
      });
    }
  };
  //console.log("WorkOrderMandatoryFiled____",DueDate);

  const getWorkOrderDefaultStatus = async () => {
    try {
      const response = await httpCommon.get("/get_default_status_type.php?site_cd=" + site_ID);
   //  console.log("response_____default___status___",response);
      if (response.data.status === "SUCCESS") {
        setWorkOrderDefaultStatus(response.data.data.AllStatusType);
        
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Second Api call
  const fetchStatusData = async (datastatus) => {
    
    try {
      const response = await httpCommon.get(
        "/get_workOrderStatus.php?site_cd=" + site_ID
      );
     // console.log("response____status__", response);
     //console.log("datastatus_____",datastatus);
      let Status = response.data.data.WorkStatus.map((item) => ({
        label: item.wrk_sts_status + " : " + item.wrk_sts_desc,
        value: item.wrk_sts_desc,
        key: item.wrk_sts_typ_cd,
      }));

      setStatus(Status);
      if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        const completeStatus = Status.find(
          (status) => status.key === "COMPLETE"
        );

        setSelected_Status(completeStatus);
        
      }
      if (datastatus !== "" && datastatus === "CompleteStatus") { 
       
        const completeStatus = Status.find(
          (status) => status.key === "COMPLETE"
        );

        setSelected_Status2(completeStatus);

      }
      if (datastatus !== "" && datastatus === "CloseBtnStatus") { 
        const completeStatus2 = Status.find(
          (status) => status.key === "CLOSE"
        );

        setSelected_Status2(completeStatus2);
      }


      if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        const closeStatus = Status.find((status) => status.key === "CLOSE");

        setSelected_Status(closeStatus);
      }

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

      let Asset_Group_Code = response.data.data.AssetGroupCode.map((item) => ({
        label: item.ast_grp_grp_cd + " : " + item.ast_grp_desc,
        value: item.ast_grp_desc,
      }));
      setAsset_Group_Code(Asset_Group_Code);

      let Charge_Cost_Center = response.data.data.ChargeCostCenter.map(
        (item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.descs,
        })
      );
      setCharge_Cost_Center(Charge_Cost_Center);

      let Work_Group = response.data.data.WorkGroup.map((item) => ({
        label: item.wrk_grp_grp_cd + " : " + item.wrk_grp_desc,
        value: item.wrk_grp_desc,
      }));
      setWork_Group(Work_Group);

      let Asset_Level = response.data.data.AssetLevel.map((item) => ({
        label: item.ast_lvl_ast_lvl + " : " + item.ast_lvl_desc,
        value: item.ast_lvl_desc,
      }));
      setAsset_Level(Asset_Level);

      let Asset_Location = response.data.data.AssetLocation.map((item) => ({
        label: item.ast_loc_ast_loc + " : " + item.ast_loc_desc,
        value: item.ast_loc_desc,
      }));
      setAsset_Location(Asset_Location);

      let Cause_Code = response.data.data.CasuseCode.map((item) => ({
        label: item.wrk_ccd_cause_cd + " : " + item.wrk_ccd_desc,
        value: item.wrk_ccd_desc,
      }));
      setCause_Code(Cause_Code);

      let Action_Code = response.data.data.ActionCode.map((item) => ({
        label: item.wrk_act_action_cd + " : " + item.wrk_act_desc,
        value: item.wrk_act_desc,
      }));
      setAction_Code(Action_Code);

      let Delay_Code = response.data.data.WKO_Delay_Code.map((item) => ({
        label: item.wrk_dcd_delay_cd + " : " + item.wrk_dcd_desc,
        value: item.wrk_dcd_desc,
      }));
      setDelay_Code(Delay_Code);

      let Work_Type = response.data.data.WorkType.map((item) => ({
        label: item.wrk_typ_typ_cd + " : " + item.wrk_typ_desc,
        value: item.wrk_typ_desc,
      }));
      setWork_Type(Work_Type);

      let Work_Class = response.data.data.WorkPermitType.map((item) => ({
        label: item.wrk_cls_cls_cd + " : " + item.wrk_cls_desc,
        value: item.wrk_cls_desc,
      }));
      setWork_Class(Work_Class);

      let Original_Periority = response.data.data.OriginalPeriority.map(
        (item) => ({
          label: item.wrk_pri_pri_cd + " : " + item.wrk_pri_desc,
          value: item.wrk_pri_desc,
        })
      );
     // setOriginal_Periority(Original_Periority);

      let Work_Area = response.data.data.Work_Area.map((item) => ({
        label: item.mst_war_work_area + " : " + item.mst_war_desc,
        value: item.mst_war_desc,
      }));
      setWork_Area(Work_Area);
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
    //  console.log("response____proprity__",response);
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
    // console.log("fetch___img___");
    try {
      const response = await httpCommon.get(
        "/get_WorkOrderImg.php?RowID=" + RowID
      );
     // console.log("response____img___",response);
      if (response.data.data) {
        // Check if AllImgGet exists and has items
        if (
          response.data.data.AllImgGet &&
          response.data.data.AllImgGet.length > 0
        ) {
          setDbImg(response.data.data.AllImgGet);
          setImguploadStatus(response.data.data.AllImgGet[0].ImgStatus);
          // setDbImgRowId(response.data.data.AllImgGet[0].RowID);
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
    const updatedImages = getDbImg.filter((image) => image.RowID !== ImgIDdlt);
    // Update the state with the new array of images after the deletion
    setDbImg(updatedImages);
    setDbImgRowId(ImgIDdlt);
    setImguploadStatus("NEW_SINGLE_IMG");
    setDisabledBtn(true);
    setImageSelect({ name: "", path: "" });
  };
  const handleImgChangeSingle = (e) => {
    const file = e.target.files[0];
    if (file) {
     
      if (!file.type.startsWith('image/')) {
        
        Swal.fire({
          title: "Opps..!",
          text: "You can upload only image files",
          icon: "warning",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        return;
      }
    }
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
    const updatedPdfFiles = selectedPdfFiles.filter((item, index) => index !== e);
    setSelectedImages(s);
    setSelectedPdfFiles(updatedPdfFiles);
  };
 
  const handleShowdata = (item) => {
    setSelectedImage(item.attachment);
    // console.log("click this button___");
    setShowdd(true);
  };
 
  const openPDFInNewTab = (fileName) => {
    const baseURL = httpCommon.defaults.baseURL;
    const fileURL = `${baseURL}${fileName}`
    // Open the file URL in a new tab
    window.open(fileURL, "_blank");
  };
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
    const base64Data = rowData.base64.split(',')[1]; 
    const byteCharacters = atob(base64Data); 
    const byteArrays = [];
  
    // Create byte array from base64 data
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    const blob = new Blob(byteArrays, { type: rowData.type });
    const objectURL = URL.createObjectURL(blob);
    sethandalImg(objectURL);
    setShowdd(true);
  };
  const isMyStateEmpty =
    Object.keys(handalImg).length === 0 && handalImg.constructor === Object;

    async function handleImageChange(event) {
      const files = Array.from(event.target.files);
      const selectedImagesArray = [...selectedImages2];
      const processedFiles = []; // To track promises for all file processing
    
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let fileType = file.type.toLowerCase();
    
        // Check for HEIC/HEIF using the file name if type is empty
        if (!fileType) {
          const fileName = file.name.toLowerCase();
          if (fileName.endsWith(".heic") || fileName.endsWith(".heif")) {
            fileType = "image/heic"; // Manually set the type
          }
        }
    
    
        // Handle HEIC/HEIF files
        if (fileType === "image/heic" || fileType === "image/heif") {
          const processHEIC = async () => {
            try {
              const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
              const convertedFile = new File([convertedBlob], file.name.replace(/\.\w+$/, ".jpg"), {
                type: "image/jpeg",
              });
    
              // Read converted file as Base64
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  selectedImagesArray.push({
                    name: convertedFile.name,
                    type: convertedFile.type,
                    base64: e.target.result,
                  });
                  resolve();
                };
                reader.readAsDataURL(convertedFile);
              });
            } catch (error) {
              console.error("Error converting HEIC image:", error);
            }
          };
          processedFiles.push(processHEIC());
        } else {
          // Handle non-HEIC files
          const processOtherFile = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              selectedImagesArray.push({
                name: file.name,
                type: file.type,
                base64: event.target.result,
              });
              resolve();
            };
            reader.readAsDataURL(file);
          });
          processedFiles.push(processOtherFile);
        }
      }
    
      await Promise.all(processedFiles);
      // Update state once all files are processed
      setSelectedImages2(selectedImagesArray);
      //setSelectedImages((prev) => [...prev, ...files]);
      setSelectedImages(selectedImagesArray); 
     setSelectedPdfFiles((prevSelectedPdfFiles) => [
      ...prevSelectedPdfFiles,
      ...files,
    ]);
      setImguploadRefStatus("Ref_New_img");
    }
//console.log("selectedImages2___",selectedImages2);

  useEffect(() => {
   // setCorrectiveActionTemp(CorrectiveAction);
    setCorrectiveActionTemp(CorrectiveAction);
    setSelected_Cause_Code_temp(selected_Cause_Code);
    setSelected_Action_Code_temp(selected_Action_Code);
  }, [CorrectiveAction,selected_Cause_Code,selected_Action_Code]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    // selectedImages.forEach((file) => {
    //   formData.append("files[]", file);
    // });
  };
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = wkoMstLabel?.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  // WorkReq Label Details table
  const findCustomizeLabelDet = (columnName) => {
    const matchingColumn = wkodetLabel?.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = WorkOrderMandatoryFiled.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
    }
    return "";
  };

  const calculateDaysBetween = (startDate, endDate) => {
    if (!endDate) return null;
    const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    return diffDays;
  };

  const daysBetween = calculateDaysBetween(OriginationDate, DueDate);
  // show due date funcation
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

  //get WorkOrderAssetNo onther component
  const handleEditClick = () => {
    setModalOpenAsset(true);
  };

  const handleCancelClick = () => {
    setAsset_No("");
  };

const handleEditClickPlan_Priority = () =>{
  setModalOpenplanPeriority(true);
}
 const handleCancelClickPlan_Priority = () =>{
  setSelected_Plan_Priority("");
  }

  function handleCloseModalPlan_Priority() {
    // If not empty, proceed to close the modal
    setModalOpenplanPeriority(false);
    Swal.close();
  }
  function handleCloseModalPlan_PrioritySelect ()
  {
    if (!selected_Plan_Priority || selected_Plan_Priority.length === 0) {
      Swal.fire({
        title: "Please select Original Priority",
        text: "You need to select at least one Original Priority before closing.",
        icon: "warning",
      
        customClass: {
          container: "swalcontainercustom",
        },
      });
      return; // Exit the function if no selection
    }

    // If not empty, proceed to close the modal
    setModalOpenplanPeriority(false);
    Swal.close();
  }
  const handleEditClickAssign = () => {
    setModalOpenAssign(true);
    fetchAssignEmpList();
  };

  const handelAssignCancelClick = () =>{
    setSelected_Assign_To("");
  }
  function handleCloseModalAssign() {
    setModalOpenAssign(false);
    Swal.close();
  }
  function handleCloseModal() {
    setModalOpenAsset(false);
    Swal.close();
  }

const handleTableRowClick = (empId2, empName2) => {
  //  setSelected_Assign_To(`${empId2} : ${empName2}`);
  const labelValue = `${empId2} : ${empName2}`;  // Concatenate empId2 and empName2

setSelected_Assign_To({
  label: labelValue,
});
    
    handleCloseModalAssign();
  };

  const get_assetmaster_select = async (selected_asset) => {
    let site_ID = localStorage.getItem("site_ID");
    const parts = selected_asset.split(":");
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

        if (response.data.status === "SUCCESS") {
          // setSelected_Asset_Status({
          //   label: response.data.data["0"].ast_mst_asset_status, 
          // });
          setSelected_Asset_Status({
            label: response.data.data["0"].ast_mst_asset_status !== "null" && response.data.data["0"].ast_sts_desc !== null
              ? response.data.data["0"].ast_mst_asset_status + " : " + response.data.data["0"].ast_sts_desc
              : "",
          });
         
          setSelected_Asset_Group_Code({
            label: response.data.data["0"].ast_mst_asset_grpcode !== "null" && response.data.data["0"].ast_grp_desc !== null
              ? response.data.data["0"].ast_mst_asset_grpcode + " : " + response.data.data["0"].ast_grp_desc
              : "",
          });

          setSelected_Charge_Cost_Center({
            label: response.data.data["0"].ast_mst_cost_center !== "null" && response.data.data["0"].descs !== null
              ? response.data.data["0"].ast_mst_cost_center + " : " + response.data.data["0"].descs
              : "",
          });

          setSelected_Work_Area({
            label: response.data.data["0"].ast_mst_work_area !== "null" && response.data.data["0"].mst_war_desc !== null
              ? response.data.data["0"].ast_mst_work_area + " : " + response.data.data["0"].mst_war_desc
              : "",
          });

          setSelected_Asset_Level({
            label: response.data.data["0"].ast_mst_ast_lvl !== "null" && response.data.data["0"].ast_lvl_desc !== null
              ? response.data.data["0"].ast_mst_ast_lvl + " : " + response.data.data["0"].ast_lvl_desc
              : "",
          });
         
          setSelected_Asset_Location({
            label: response.data.data["0"].ast_mst_asset_locn !== "null" && response.data.data["0"].ast_loc_desc !== null
              ? response.data.data["0"].ast_mst_asset_locn + " : " + response.data.data["0"].ast_loc_desc
              : "",
          });
          
          setSelected_Work_Group({
            label: response.data.data["0"].ast_mst_wrk_grp !== "null" && response.data.data["0"].wrk_grp_desc !== null
              ? response.data.data["0"].ast_mst_wrk_grp + " : " + response.data.data["0"].wrk_grp_desc
              : "",
          });


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
    setIsAssetNoEmpty(false);

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
  const handleRowDataplanPriority = (dataLenth, dataa, dataSecond,dataclick) =>{
    setSelected_Plan_Priority(dataa);
   

    if (dataLenth !== undefined && dataLenth !== null) {
     // setTotalAssetNo(dataLenth);
    }
    if (dataa !== undefined && dataa !== null) {
    //  handleSelectedAssetNo(dataa);
    }
    if(dataSecond !== undefined && dataSecond !== null){
     
      const currentDate = new Date(OriginationDate);
        const minutesToAdd = dataSecond;
        const newDueDate = new Date(currentDate.getTime() + minutesToAdd * 60000); // Add minutes to current date
        setDueDate(newDueDate);
        setdueDateIncrement(dataSecond)
    }
    if (dataclick == "1") {
      setModalOpenplanPeriority(false);
      setTotalSearch("");
    }
  }
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
                <IconButton key={index} disabled={props.disabled}>{icon}</IconButton>
              ))}
            </div>
          ),
        }}
        
      />
    );
  }
  const handleClickOriginator = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderOriginator.php?site_cd=" + site_ID
      );
      let Originator = response.data.data.WorkOriginator.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_empl_id,
      }));
      setOriginator(Originator);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickProjectID = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderProjectID.php?site_cd=" + site_ID
      );
      let Project_ID = response.data.data.WorkProjectID.map((item) => ({
        label: item.prj_mst_prj_cd + " : " + item.prj_mst_desc,
        value: item.prj_mst_desc,
      }));
      setProject_ID(Project_ID);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickSupervisorId = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderSupervisorId.php?site_cd=" + site_ID
      );
      let Supervisor_ID = response.data.data.WorkSupervisorID.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_name,
      }));
      setSupervisor_ID(Supervisor_ID);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickPlanner = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderPlanner.php?site_cd=" + site_ID
      );
      let Planner = response.data.data.WorkPlanner.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_name,
      }));
      setPlanner(Planner);
      setErrorField(null);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickApprover = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderApprover.php?site_cd=" + site_ID
      );
      let Approver = response.data.data.WorkApprover.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_name,
      }));
      setApprover(Approver);
      setErrorField(null);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickAssignTo = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderApprover.php?site_cd=" + site_ID
      );
      let Assign_To = response.data.data.WorkApprover.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
        value: item.emp_mst_name,
      }));
      setAssign_To(Assign_To);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickCustomerCode = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderCustomerCode.php?site_cd=" + site_ID
      );
      let CustomerCode = response.data.data.WorkCustomerCode.map((item) => ({
        label: item.cus_mst_customer_cd + " : " + item.cus_mst_desc,
        value: item.cus_mst_desc,
      }));
      setCustomer_Code(CustomerCode);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickCostCenter = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderCostCenter.php?site_cd=" + site_ID
      );
      let Credit_Cost_Center = response.data.data.WorkCostCenter.map(
        (item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.descs,
        })
      );
      setCredit_Cost_Center(Credit_Cost_Center);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickLaborAccount = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderLaborAccount.php?site_cd=" + site_ID
      );
      let Labor_Account = response.data.data.WorkLaborAccount.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.descs,
      }));
      setLabor_Account(Labor_Account);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickContractAccount = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderLaborAccount.php?site_cd=" + site_ID
      );
      let Contract_Account = response.data.data.WorkLaborAccount.map(
        (item) => ({
          label: item.account + " : " + item.descs,
          value: item.descs,
        })
      );
      setContract_Account(Contract_Account);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickMaterialAccount = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderLaborAccount.php?site_cd=" + site_ID
      );
      let Material_Account = response.data.data.WorkLaborAccount.map(
        (item) => ({
          label: item.account + " : " + item.descs,
          value: item.descs,
        })
      );
      setMaterial_Account(Material_Account);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickMiscellaneousAccount = async () => {
    try {
      const response = await httpCommon.get(
        "/get_workOrderLaborAccount.php?site_cd=" + site_ID
      );
      let Miscellaneous_Account = response.data.data.WorkLaborAccount.map(
        (item) => ({
          label: item.account + " : " + item.descs,
          value: item.descs,
        })
      );
      setMiscellaneous_Account(Miscellaneous_Account);
    } catch (error) {
      console.error(error);
    }
  };
 

  const onClickChange = (event,datastatus) => {
    event.preventDefault();
   // console.log("datastatus___",selected_Status);
    if (selected_Status == "" || selected_Status == null) {
      setIsWorkOrderStatusEmpty(true);
      const errorMessage = "Please fill the required field Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (Description == "" || Description == null) {
      setIsWorkDescEmpty(true);
      const errorMessage =
        "Please fill the required field Description is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (Asset_No == "" || Asset_No == null) {
      setisWorkOrderAssetNoEmpty(true);
      const errorMessage =
        "Please fill the required field Asset No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_Charge_Cost_Center == "" ||
      selected_Charge_Cost_Center == null
    ) {
      setIsChargeCostEmpty(true);
      const errorMessage =
        "Please fill the required field Charge Cost Center is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else {
      if(datastatus === "CompleteStatus"){
         Update_WorkOrder(datastatus);
      }else if(datastatus === "CloseBtnStatus"){
        Update_WorkOrder(datastatus);
      }
      else if (Button_save === "Save") {
        New_WorkOrder();

        // resetData();
      } else if (Button_save === "Update") {
       Update_WorkOrder();
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const onClickChangeComplete = (event) => {
    event.preventDefault();
   
    if (selected_Status2 === "" || selected_Status2 === null) {
      setIsFiledValueEmpty(true);
    } else if (CorrectiveActionTemp === "" || CorrectiveActionTemp === null) {
      const errorMessage = "Please fill the required field Corrective Actions is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setIsCorrectiveValueEmptyTemp(true);
    } else if (
      !selected_Cause_Code_temp || 
      typeof selected_Cause_Code_temp.label !== 'string' || 
      selected_Cause_Code_temp.label.trim() === ""
    ) {
      const errorMessage = "Please fill the required field Cause Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setIsCauseCodeValueEmptyTemp(true);
    } else if (

      !selected_Action_Code_temp || 
      typeof selected_Action_Code_temp.label !== 'string' || 
      selected_Action_Code_temp.label.trim() === ""

    ) {
      const errorMessage = "Please fill the required field Action Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setIsActionCodeValueEmpty(true);
    } else {
      Update_complete();
      if (Button_save === "Complete") {
        
        Update_complete();
      }
    }
  };

  const onClickChangeClose = (event) => {
    event.preventDefault();

    if (selected_Status2 === "" || selected_Status2 === null) {
      const errorMessage = "Please fill the required field Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setIsFiledValueEmpty(true);
    } else if (CorrectiveActionTemp === "" || CorrectiveActionTemp === null) {
      const errorMessage = "Please fill the required field Corrective Actions is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setIsCorrectiveValueEmptyTemp(true);
    } else if (
     
      !selected_Cause_Code_temp || 
      typeof selected_Cause_Code_temp.label !== 'string' || 
      selected_Cause_Code_temp.label.trim() === ""

    ) {
      const errorMessage = "Please fill the required field Cause Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setIsCauseCodeValueEmptyTemp(true);
    } else if (

      !selected_Action_Code_temp || 
      typeof selected_Action_Code_temp.label !== 'string' || 
      selected_Action_Code_temp.label.trim() === ""
    ) {
      const errorMessage = "Please fill the required field Action Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setIsActionCodeValueEmptyTemp(true);
    } else {
        Update_closeOrder();
      if (Button_save === "Close Order") {
      
        Update_closeOrder();
      }
    }
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
            navigate(`/dashboard/work/order`, {
              state: {
                currentPage,
                selectDropRowID,
                selectedOptionBack:selectedOption,
                comeBack:"Come_Back_cancel",
                ModuleFrom:ModuleFrom,
                selectedRowIdBack:RowID,
              },
            });
          setIsFormFiled(false);
        }
      });
    }else{
      navigate(`/dashboard/work/order`, {
        state: {
          currentPage,
          selectDropRowID,
          selectedOptionBack:selectedOption,
          comeBack:"Come_Back_cancel",
          selectedRowIdBack:RowID,
          ModuleFrom:ModuleFrom,
        },
      });
    }
  };

  const New_WorkOrder = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
     Swal.showLoading();

    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    //Select Asset No

    let EmptyAsset;
    if (Asset_No == "" || Asset_No == null) {
      EmptyAsset = "";
    } else {
      // Asset_No = selected_Asset_No.label.split(":")
      const EmptyAssetSplit = Asset_No.split(":");
      EmptyAsset = EmptyAssetSplit[0];
    }

    //Select Status
    let Status, setStatus;
    if (selected_Status.label == "" || selected_Status.label == null) {
      setStatus = "";
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
      ////console.log("Status: ", Status[0])
    }

    //Select Asset Status
    let Asset_Status, setAsset_Status;
    if (selected_Asset_Status == "" || selected_Asset_Status == null) {
      setAsset_Status = "";
    } else {
      Asset_Status = selected_Asset_Status.label.split(":");
      setAsset_Status = Asset_Status[0];
      //console.log("Asset_Status ", setAsset_Status)
    }

    //Select Plan Priority
    let Plan_Priority, setPlan_Priority;
    if (selected_Plan_Priority == "" || selected_Plan_Priority == null) {
      setPlan_Priority = "";
    } else {
      Plan_Priority = selected_Plan_Priority.split(":");
      setPlan_Priority = Plan_Priority[0];
      ////console.log("Plan_Priority ", Plan_Priority[0])
    }

    //Select Asset Group Code
    let Asset_Group_Code, setAsset_Group_Code;
    if (
      !selected_Asset_Group_Code || !selected_Asset_Group_Code.label
    ) {
      setAsset_Group_Code = "";
    } else {
      Asset_Group_Code = selected_Asset_Group_Code.label.split(":");
      setAsset_Group_Code = Asset_Group_Code[0];
      ////console.log("Asset_Group_Code ", Asset_Group_Code[0])
    }


    //Select Origination Date
    let date_of_origination = "";
    if (OriginationDate == "" || OriginationDate == null) {
      date_of_origination = "";
    } else {
      date_of_origination = Moment(OriginationDate)
        .utcOffset("+08:00")
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("OD ", date_of_origination);
    }

    //Select Charge Cost Center
    let Charge_Cost_Center, setCharge_Cost_Center;

    if (
      selected_Charge_Cost_Center == "" ||
      selected_Charge_Cost_Center == null
    ) {
      setCharge_Cost_Center = "";
    } else {
      Charge_Cost_Center = selected_Charge_Cost_Center.label.split(":");
      setCharge_Cost_Center = Charge_Cost_Center[0];
      ////console.log("Work_Area ", Work_Area[0])
    }
    ////console.log("Charge_Cost_Center: ", Charge_Cost_Center[0])

    //Select Due Date
    let date_of_due = "";
    if (DueDate == "" || DueDate == null) {
      date_of_due = "";
    } else {
      date_of_due = Moment(DueDate).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("DD ", date_of_due);
    }

    //Select Work Area
    let Work_Area, setWork_Area;
    if (selected_Work_Area == "" || selected_Work_Area == null) {
      setWork_Area = "";
    } else {
      Work_Area = selected_Work_Area.label.split(":");
      setWork_Area = Work_Area[0];
      ////console.log("Work_Area ", Work_Area[0])
    }

    //Select Originator
    let Originator, setOriginator;
    if (selected_Originator == "" || selected_Originator == null) {
      setOriginator = "";
    } else {
      Originator = selected_Originator.label.split(":");
      setOriginator = Originator[0];
      ////console.log("Originator ", Originator[0])
    }

    //Select Asset Level
    let Asset_Level, setAsset_Level;
    if (selected_Asset_Level === "" || selected_Asset_Level === null) {
      setAsset_Level = "";
    } else {
      Asset_Level = selected_Asset_Level.label.split(":");
      setAsset_Level = Asset_Level[0];
      ////console.log("Asset_Level ", Asset_Level[0])
    }

    //Select Phone
    ////console.log("Phone: ", Phone)

    //Select Asset Location
    let Asset_Location, setAsset_Location;
    if (!selected_Asset_Location || !selected_Asset_Location.label) {
      setAsset_Location = "";
    } else {
      Asset_Location = selected_Asset_Location.label.split(":");
      setAsset_Location = Asset_Location[0];
      ////console.log("Asset_Location ", Asset_Location[0])
    }

    //Select Fault Code
    //let Fault_Code = selected_Fault_Code.label.split(":");
    ////console.log("Fault_Code: ", Fault_Code[0])

    let Fault_Code, setFault_Code;
    if (selected_Fault_Code == "" || selected_Fault_Code == null) {
      setFault_Code = "";
    } else {
      Fault_Code = selected_Fault_Code.label.split(":");
      setFault_Code = Fault_Code[0];
      //console.log("Asset_Status ", setAsset_Status)
    }

    //Select Project ID
    let Project_ID, setProject_ID;

    ////console.log('Project_ID', selected_Project_ID.label)
    if (!selected_Project_ID || typeof selected_Project_ID.label !== 'string' || selected_Project_ID.label.trim() === "") {
      setProject_ID = "";
    } else {
      Project_ID = selected_Project_ID.label.split(":");
      setProject_ID = Project_ID[0];
      ////console.log("Project_ID ", Project_ID[0])
    }

    //Select Cause Code
    let Cause_Code, setCause_Code;
    if (selected_Cause_Code == "" || selected_Cause_Code == null) {
      setCause_Code = "";
    } else {
      Cause_Code = selected_Cause_Code.label.split(":");
      setCause_Code = Cause_Code[0];
      ////console.log("Cause_Code ", Cause_Code[0])
    }

    //Select Work Type
    let Work_Type, setWork_Type;
    if (selected_Work_Type == "" || selected_Work_Type == null) {
      setWork_Type = "";
    } else {
      Work_Type = selected_Work_Type.label.split(":");
      setWork_Type = Work_Type[0];
      ////console.log("Cause_Code ", Cause_Code[0])
    }
    //Select Schedule Date
    let date_of_schedule = "";
    if (ScheduleDate == "" || ScheduleDate == null) {
      date_of_schedule = "";
    } else {
      date_of_schedule = Moment(ScheduleDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("SD ", date_of_schedule);
    }

    //Select Action Code
    let Action_Code, setAction_Code;
    if (selected_Action_Code == "" || selected_Action_Code == null) {
      setAction_Code = "";
    } else {
      Action_Code = selected_Action_Code.label.split(":");
      setAction_Code = Action_Code[0];
      ////console.log("Action_Code ", Action_Code[0])
    }

    //Select Exception Date
    let date_of_exception = "";
    if (ExceptionDate == "" || ExceptionDate == null) {
      date_of_exception = "";
    } else {
      date_of_exception = Moment(ExceptionDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("EB ", date_of_exception);
    }

    //Select Delay Code
    let Delay_Code, setDelay_Code;
    if (selected_Delay_Code.label == "" || selected_Delay_Code.label == null) {
      setDelay_Code = "";
    } else {
      Delay_Code = selected_Delay_Code.label.split(":");
      setDelay_Code = Delay_Code[0];
      ////console.log("Delay_Code ", Delay_Code[0])
    }

    //Select Status Change Date
    let date_of_status_change = "";
    if (StatusChangeDate == "" || StatusChangeDate == null) {
      date_of_status_change = "";
    } else {
      date_of_status_change = Moment(StatusChangeDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("SCB ", date_of_status_change);
    }

    //Select Completion Date
    let date_of_completion = "";
    if (CompletionDate == "" || CompletionDate == null) {
      date_of_completion = "";
    } else {
      date_of_completion = Moment(CompletionDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("CD ", date_of_completion);
    }

    //Select Work Class
    let Work_Class, setWork_Class;
    if (selected_Work_Class == "" || selected_Work_Class == null) {
      setWork_Class = "";
    } else {
      Work_Class = selected_Work_Class.label.split(":");
      setWork_Class = Work_Class[0];
      ////console.log("Work_Class ", Work_Class[0])
    }

    //Select Close Date
    let date_of_close = "";
    if (CloseDate == "" || CloseDate == null) {
      date_of_close = "";
    } else {
      date_of_close = Moment(CloseDate).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("CLOD ", date_of_close);
    }

    //Select Work Group
    let Work_Group;

    if (!selected_Work_Group || !selected_Work_Group.label || selected_Work_Group.label.trim() === "") {
      Work_Group = "";
    } else {
      const WorkGroup = selected_Work_Group.label.split(":");
      Work_Group = WorkGroup[0];
      // console.log("Work_Type ", WorkType[0]);
    }

    ////console.log("Work_Group: ", Work_Group[0])

    //Select Supervisor ID
    let Supervisor_ID, setSupervisor_ID;
    if (
    
      !selected_Supervisor_ID || !selected_Supervisor_ID.label || selected_Supervisor_ID.label.trim() === ""
    ) {
      setSupervisor_ID = "";
    } else {
      Supervisor_ID = selected_Supervisor_ID.label.split(":");
      setSupervisor_ID = Supervisor_ID[0];
      ////console.log("Supervisor_ID ", Supervisor_ID[0])
    }

    //Select Planner
    let Planner, setPlanner;
    if ( !selected_Planner || !selected_Planner.label || selected_Planner.label.trim() === "") {
      setPlanner = "";
    } else {
      Planner = selected_Planner.label.split(":");
      setPlanner = Planner[0];
      ////console.log("Planner ", Planner[0])
    }

    //Select Approver
    // console.log("selected_Approver___",selected_Approver);
    let Approver, setApprover;

    if ( !selected_Approver || !selected_Approver.label || selected_Approver.label.trim() === "") {
      setApprover = "";
    } else {
      // Assuming you're checking the first element in the array
      Approver = selected_Approver.label.split(":");
      setApprover = Approver[0];
      // console.log("Approver ", Approver[0]);
    }

    //Select Assign To

    let Assign_To, setAssign_To;
    if (!selected_Assign_To || typeof selected_Assign_To.label !== 'string' || selected_Assign_To.label.trim() === "") {
      setAssign_To = "";
    } else {
      Assign_To = selected_Assign_To.label.split(":");
      setAssign_To = Assign_To[0];
      ////console.log("Assign_To ", Assign_To[0])
    }

    //Select WKO Customer Code
    let CustomerCodeValue;
    if (
      !selected_Customer_Code || selected_Customer_Code.length === 0 ||
      selected_Customer_Code[0] === null
    ) {
      CustomerCodeValue = "";
    } else {
      const CustomerCode = selected_Customer_Code.label.split(":");
      CustomerCodeValue = CustomerCode[0].trim();
    }

    //Select WKO Labor Account
    let LaborAccountValue;
    if (
      !selected_Labor_Account || selected_Labor_Account.length === 0 ||
      selected_Labor_Account[0] === null
    ) {
      LaborAccountValue = "";
    } else {
      const LaborAccount = selected_Labor_Account.label.split(":");
      LaborAccountValue = LaborAccount[0];
    }

    //Select WKO Material Account
    let MaterialAccountValue;
    if (
      !selected_Material_Account || selected_Material_Account.length === 0 ||
      selected_Material_Account[0] === null
    ) {
      MaterialAccountValue = "";
    } else {
      const MaterialAccount = selected_Material_Account.label.split(":");
      MaterialAccountValue = MaterialAccount[0];
    }

    //Select WKO Credit Cost Center
    let CreditCostCenterValue;
    if (
      !selected_Credit_Cost_Center || selected_Credit_Cost_Center.length === 0 ||
      selected_Credit_Cost_Center[0] === null
    ) {
      CreditCostCenterValue = "";
    } else {
      const CreditCenter = selected_Credit_Cost_Center.label.split(":");
      CreditCostCenterValue = CreditCenter[0];
    }

    //Select WKO Contract Account
    let ContractAccountValue;
    if (
      !selected_Contract_Account || selected_Contract_Account.length === 0 ||
      selected_Contract_Account[0] === null
    ) {
      ContractAccountValue = "";
    } else {
      const ContractAccount = selected_Contract_Account.label.split(":");
      ContractAccountValue = ContractAccount[0];
    }

    //Select WKO Miscellaneous Account
    let MiscellaneousAccountValue;
    if (
      !selected_Miscellaneous_Account || selected_Miscellaneous_Account.length === 0 ||
      selected_Miscellaneous_Account[0] === null
    ) {
      MiscellaneousAccountValue = "";
    } else {
      const MiscellaneousAccount =
        selected_Miscellaneous_Account.label.split(":");
      MiscellaneousAccountValue = MiscellaneousAccount[0];
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
      ////console.log("Date2 ", date_2);
    }

    //Select Date 3
    let date_3 = "";
    if (UDFDate_3 == "" || UDFDate_3 == null) {
      date_3 = "";
    } else {
      date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date3 ", date_3);
    }

    //Select Date 4
    let date_4 = "";
    if (UDFDate_4 == "" || UDFDate_4 == null) {
      date_4 = "";
    } else {
      date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date4 ", date_4);
    }

    //Select Date 5
    let date_5 = "";
    if (UDFDate_5 == "" || UDFDate_5 == null) {
      date_5 = "";
    } else {
      date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date5 ", date_5);
    }
    let missingFields = [];

    var json_workorder_Insert = {
      site_cd: site_ID,
      wko_mst_wo_no: WorkOrderNo ? WorkOrderNo.trim() : "",
      wko_mst_assetno: EmptyAsset ? EmptyAsset.trim() :"",
      wko_mst_status: setStatus.trim(),
      wko_mst_asset_status: setAsset_Status.trim(),
      wko_mst_plan_priority: setPlan_Priority.trim(),
      wko_mst_asset_group_code: setAsset_Group_Code.trim(),
      wko_mst_org_date: date_of_origination,
      wko_mst_chg_costcenter: setCharge_Cost_Center.trim(),
      wko_mst_due_date: date_of_due,
      wko_mst_work_area: setWork_Area.trim(),
    //  wko_mst_originator: setOriginator.trim(), 
      wko_mst_originator: setOriginator?.trim() || inputValueOriginator?.trim() || "",

      wko_mst_asset_level: setAsset_Level.trim(),
      wko_mst_phone: Phone ? Phone.trim() :"",
      wko_mst_asset_location: setAsset_Location.trim(),
      wko_mst_flt_code: setFault_Code.trim(),
      wko_mst_descs: Description ? Description.trim() :"",

      wko_mst_project_id: setProject_ID.trim(),
      wko_mst_orig_priority: "",
      wko_det_corr_action: CorrectiveAction ? CorrectiveAction.trim() :"",
      wko_det_cause_code: setCause_Code.trim(),
      wko_det_sched_date: date_of_schedule,
      wko_det_act_code: setAction_Code.trim(),
      wko_det_exc_date: date_of_exception,
      wko_det_delay_cd: setDelay_Code.trim(),
      wko_det_sc_date: date_of_status_change,
      wko_det_work_type: setWork_Type.trim(),
      wko_det_cmpl_date: date_of_completion,
      wko_det_work_class: setWork_Class.trim(),
      wko_det_clo_date: date_of_close,
      wko_det_work_grp: Work_Group ? Work_Group.trim() :"",
      wko_det_supv_id: setSupervisor_ID.trim(),
      wko_det_planner: setPlanner.trim(),
      wko_det_approver: setApprover.trim(),
      wko_det_assign_to: setAssign_To.trim(),
      wko_det_perm_id: Permanent_ID,
      wko_det_temp_asset: CheckBox_Temporary_Asset,
      wko_det_approved: CheckBox_Approved,
      wko_det_safety: CheckBox_Safety,

      wko_det_customer_cd: CustomerCodeValue,
      wko_det_laccount: LaborAccountValue.trim(),
      wko_det_maccount: MaterialAccountValue.trim(),
      wko_det_crd_costcenter: CreditCostCenterValue.trim(),
      wko_det_caccount: ContractAccountValue.trim(),
      wko_det_saccount: MiscellaneousAccountValue.trim(),

      wko_det_note1: UDFNote1 ? UDFNote1.trim() : "",
      wko_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
      wko_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
      wko_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
      wko_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
      wko_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
      wko_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
      wko_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
      wko_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
      wko_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
      wko_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",

      wko_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : "",
      wko_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : "",
      wko_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : "",
      wko_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : "",
      wko_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : "",

      wko_det_datetime1: date_1 ? date_1.trim() : date_1,
      wko_det_datetime2: date_2 ? date_2.trim() : date_2,
      wko_det_datetime3: date_3 ? date_3.trim() : date_3,
      wko_det_datetime4: date_4 ? date_4.trim() : date_4,
      wko_det_datetime5: date_5 ? date_5.trim() : date_5,

      asset_type_ID: AutoNumring.trim(),
      ImgUpload: imageSelect,
      audit_user: emp_mst_login_id.trim(),
      wko_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      wko_mst_create_date: get_date,
      cnt_mst_numbering: AutoNumring,
    };
   
    //console.log("json_workorder_Insert___",json_workorder_Insert);

    for (let i = 0; i < WorkOrderMandatoryFiled.length; i++) {
      const item = WorkOrderMandatoryFiled[i];
      const fieldValue = json_workorder_Insert[item.column_name];
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
    } else {
     
      try {
        const response = await httpCommon.post(
          "/insert_new_workorder.php",
          JSON.stringify(json_workorder_Insert)
        );
        // console.log("json_workorderNew Data", response);

        if (response.data.status === "SUCCESS") {
          // console.log("responseJson", response.data.ROW_ID);
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
                    "/insert_work_order_reference_multiImg_upload.php",
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
                timer: swalCloseTime, 
                timerProgressBar: true, 
                willClose: () => {
                  if(WorkOrderSubModuleBtn){
                    navigate(`/dashboard/work/editworkorder`, {
                      state: {
                        RowID:GetRowId,
                        currentPage,
                        selectDropRowID,
                        selectedOption,
                        TabBtnName:WorkOrderSubModuleBtn,
                      },
                    });
                    window.location.reload();
                 
                   }else{
                    navigate(`/dashboard/work/order`, {
                      state: {
                        currentPage,
                      },
                    });
                  }
                 
                },
              }).then((result) => {
                if (result.dismiss !== Swal.DismissReason.timer) {
                  if(WorkOrderSubModuleBtn){
                    navigate(`/dashboard/work/editworkorder`, {
                      state: {
                        RowID:GetRowId,
                        currentPage,
                        selectDropRowID,
                        selectedOption,
                        TabBtnName:WorkOrderSubModuleBtn,
                      },
                    });
                    window.location.reload();
                 
                   }else{
                    navigate(`/dashboard/work/order`, {
                      state: {
                        currentPage,
                      },
                    });
                  }
                }
              });
            } else {
              Swal.close();
              Swal.fire({
                icon: "error",
                title: "Oops...",
                customClass: {
                  container: "swalcontainercustom",
                },
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
    }
  };

  const Update_WorkOrder = async (datastatus) => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    // let RowID = localStorage.getItem("RowID");

    //Select Asset No
    let EmptyAsset;
    if (Asset_No == "" || Asset_No == null) {
      EmptyAsset = "";
    } else {
      // Asset_No = selected_Asset_No.label.split(":")
      const EmptyAssetSplit = Asset_No.split(":");
      EmptyAsset = EmptyAssetSplit[0];
    }

    //Select Status
    let Status, setStatus;
    if (selected_Status.label === "" || selected_Status.label === null) {
      setIsWorkOrderStatusEmpty(true);
      const errorMessage = "Please fill the required field Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      Swal.close();
      return;
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
    }

    //Select Asset Status
    let Asset_Status, setAsset_Status;
    if (
      selected_Asset_Status.label === "" ||
      selected_Asset_Status.label === null
    ) {
      // console.log("selected_Asset_Status", selected_Asset_Status);
      setAsset_Status = "";
    } else {
      Asset_Status = selected_Asset_Status.label.split(":");
      setAsset_Status = Asset_Status[0];
    }

    //Select Plan Priority !selected_Originator || !selected_Originator.label
    let Plan_Priority, setPlan_Priority;
   
    if (selected_Plan_Priority == "" || selected_Plan_Priority == null) {
      setPlan_Priority = "";
    } else {
      Plan_Priority = selected_Plan_Priority.split(":");
      setPlan_Priority = Plan_Priority[0];
      ////console.log("Plan_Priority ", Plan_Priority[0])
    }

    //Select Asset Group Code
    let Asset_Group_Code;
    if (!selected_Asset_Group_Code || !selected_Asset_Group_Code.label) {
      Asset_Group_Code = "";
    } else {
      const AssetGroupCode = selected_Asset_Group_Code.label.split(":");
      Asset_Group_Code = AssetGroupCode[0];
      ////console.log("Asset_Group_Code ", Asset_Group_Code[0])
    }

    //Select Origination Date
    let date_of_origination = "";
    if (OriginationDate == "" || OriginationDate == null) {
      date_of_origination = "";
    } else {
      date_of_origination = Moment(OriginationDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("OD ", date_of_origination);
    }

    //Select Charge Cost Center
    let Charge_Cost_Center, setCharge_Cost_Center;
    if (
      selected_Charge_Cost_Center.label == "" ||
      selected_Charge_Cost_Center.label == null
    ) {
     setIsChargeCostEmpty(true);
      const errorMessage =
        "Please fill the required field Charge Cost Center is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      Swal.close();
      return;
    } else {
      Charge_Cost_Center = selected_Charge_Cost_Center.label.split(":");
      setCharge_Cost_Center = Charge_Cost_Center[0];
      ////console.log("Charge_Cost_Center: ", Charge_Cost_Center[0])
    }

    //Select Due Date
    let date_of_due = "";
    if (DueDate == "" || DueDate == null) {
      date_of_due = "";
    } else {
      date_of_due = Moment(DueDate).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("DD ", date_of_due);
    }

    //Select Work Area
   
    let Work_Area, setWork_Area;
    if (!selected_Work_Area || !selected_Work_Area.label) {
      setWork_Area = "";
    } else {
      Work_Area = selected_Work_Area.label.split(":");
      setWork_Area = Work_Area[0];
      ////console.log("Work_Area ", Work_Area[0])
    }

    //Select Originator
    let OriginatorUP;

    if (!selected_Originator || !selected_Originator.label) {
      OriginatorUP = "";
    } else {
      const Originator2 = selected_Originator.label.split(":");
      OriginatorUP = Originator2[0];
    }

    //Select Asset Level
    let Asset_Level;

    if (!selected_Asset_Level || !selected_Asset_Level.label) {
      Asset_Level = "";
    } else {
      const AssetLevel = selected_Asset_Level.label.split(":");
      Asset_Level = AssetLevel[0];
    }

    //Select Asset Location
    let Asset_Location, setAsset_Location;
    if (!selected_Asset_Location || !selected_Asset_Location.label) {
      setAsset_Location = "";
    } else {
      Asset_Location = selected_Asset_Location.label.split(":");
      setAsset_Location = Asset_Location[0];
      ////console.log("Asset_Location ", Asset_Location[0])
    }

    //Select Fault Code

    let Fault_Code;
    if (!selected_Fault_Code || !selected_Fault_Code.label) {
      Fault_Code = "";
    } else {
      const Fault_Code2 = selected_Fault_Code.label.split(":");
      Fault_Code = Fault_Code2[0];
    }
    ////console.log("Fault_Code: ", Fault_Code[0])

    //Select Project ID
    let Project_ID, setProject_ID;

    ////console.log('Project_ID', selected_Project_ID.label)
    if (selected_Project_ID.label == "" || selected_Project_ID.label == null) {
      setProject_ID = "";
    } else {
      Project_ID = selected_Project_ID.label.split(":");
      setProject_ID = Project_ID[0];
      ////console.log("Project_ID ", Project_ID[0])
    }

    //Select Original Periority

    //Select Cause Code
    let Cause_Code;

    if (!selected_Cause_Code || !selected_Cause_Code.label) {
      Cause_Code = "";
    } else {
      const Cause_Code2 = selected_Cause_Code.label.split(":");
      Cause_Code = Cause_Code2[0];
      ////console.log("Cause_Code ", Cause_Code[0])
    }

    //Select Schedule Date
    let date_of_schedule = "";
    if (ScheduleDate == "" || ScheduleDate == null) {
      date_of_schedule = "";
    } else {
      date_of_schedule = Moment(ScheduleDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("SD ", date_of_schedule);
    }

    //Select Action Code
    let Action_Code;
    if (!selected_Action_Code || !selected_Action_Code.label) {
      Action_Code = "";
    } else {
      const Action_Code2 = selected_Action_Code.label.split(":");
      Action_Code = Action_Code2[0];
      ////console.log("Action_Code ", Action_Code[0])
    }

    //Select Exception Date
    let date_of_exception = "";
    if (ExceptionDate == "" || ExceptionDate == null) {
      date_of_exception = "";
    } else {
      date_of_exception = Moment(ExceptionDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("EB ", date_of_exception);
    }

    //Select Delay Code
    let Delay_Code;
    if (!selected_Delay_Code || !selected_Delay_Code.label) {
      Delay_Code = "";
    } else {
      const Delay_Code2 = selected_Delay_Code.label.split(":");
      Delay_Code = Delay_Code2[0];
      ////console.log("Delay_Code ", Delay_Code[0])
    }

    //Select Status Change Date
    let date_of_status_change = "";
    if (StatusChangeDate == "" || StatusChangeDate == null) {
      date_of_status_change = "";
    } else {
      date_of_status_change = Moment(StatusChangeDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("SCB ", date_of_status_change);
    }

    let WorkTypeValue;

    if (!selected_Work_Type || !selected_Work_Type.label || selected_Work_Type.label.trim() === "") {
      WorkTypeValue = "";
    } else {
      const WorkType = selected_Work_Type.label.split(":");
      WorkTypeValue = WorkType[0];
      // console.log("Work_Type ", WorkType[0]);
    }


    //Select Completion Date
    let date_of_completion = "";
    if (CompletionDate == "" || CompletionDate == null) {
      date_of_completion = "";
    } else {
      date_of_completion = Moment(CompletionDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      ////console.log("CD ", date_of_completion);
    }

    //Select Work Class
    let Work_Class;
    if (!selected_Work_Class || !selected_Work_Class.label) {
      Work_Class = "";
    } else {
      const Work_Class2 = selected_Work_Class.label.split(":");
      Work_Class = Work_Class2[0];
      ////console.log("Work_Class ", Work_Class[0])
    }

    //Select Close Date
    let date_of_close = "";
    if (CloseDate == "" || CloseDate == null) {
      date_of_close = "";
    } else {
      date_of_close = Moment(CloseDate).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("CLOD ", date_of_close);
    }

    //Select Work Group

    let WorkGroupValue;

    if (!selected_Work_Group || !selected_Work_Group.label || selected_Work_Group.label.trim() === "") {
      WorkGroupValue = "";
    } else {
      const WorkGroup = selected_Work_Group.label.split(":");
      WorkGroupValue = WorkGroup[0];
      // console.log("Work_Type ", WorkType[0]);
    }


    //Select Supervisor ID
    let Supervisor_ID;
    if (!selected_Supervisor_ID || !selected_Supervisor_ID.label) {
      Supervisor_ID = "";
    } else {
      const Supervisor_ID2 = selected_Supervisor_ID.label.split(":");
      Supervisor_ID = Supervisor_ID2[0];
      ////console.log("Supervisor_ID ", Supervisor_ID[0])
    }

    //Select Planner
    let Planner;
    if (!selected_Planner || !selected_Planner.label) {
      Planner = "";
    } else {
      const Planner2 = selected_Planner.label.split(":");
      Planner = Planner2[0];
      ////console.log("Planner ", Planner[0])
    }

    //Select Approver
    let Approver;
    if (!selected_Approver || !selected_Approver.label) {
      Approver = "";
    } else {
      const Approver2 = selected_Approver.label.split(":");
      Approver = Approver2[0];
      ////console.log("Approver ", Approver[0])
    }

    //Select Assign To
    let Assign_To;
    if (
      !selected_Assign_To || typeof selected_Assign_To.label !== 'string' || selected_Assign_To.label.trim() === ""
    ) {
      Assign_To = "";
    } else {
      const Assign_To2 = selected_Assign_To.label.split(":");
      Assign_To = Assign_To2[0].trim();
      ////console.log("Work_Group ", Work_Group[0])
    }
  
    //Select WKO Customer Code
    let CustomerCodeValue;
    if (!selected_Customer_Code || !selected_Customer_Code.label) {
      CustomerCodeValue = "";
    } else {
      const CustomerCode = selected_Customer_Code.label.split(":");
      CustomerCodeValue = CustomerCode[0].trim();
    }

    //Select WKO Labor Account
    let LaborAccountValue;
    if (!selected_Labor_Account || !selected_Labor_Account.label) {
      LaborAccountValue = "";
    } else {
      const LaborAccount = selected_Labor_Account.label.split(":");
      LaborAccountValue = LaborAccount[0];
    }

    //Select WKO Material Account
    let MaterialAccountValue;
    if (!selected_Material_Account || !selected_Material_Account.label) {
      MaterialAccountValue = "";
    } else {
      const MaterialAccount = selected_Material_Account.label.split(":");
      MaterialAccountValue = MaterialAccount[0];
    }

    //Select WKO Credit Cost Center
    let CreditCostCenterValue;
    if (!selected_Credit_Cost_Center || !selected_Credit_Cost_Center.label) {
      CreditCostCenterValue = "";
    } else {
      const CreditCenter = selected_Credit_Cost_Center.label.split(":");
      CreditCostCenterValue = CreditCenter[0];
    }

    //Select WKO Contract Account
    let ContractAccountValue;
    if (!selected_Contract_Account || !selected_Contract_Account.label) {
      ContractAccountValue = "";
    } else {
      const ContractAccount = selected_Contract_Account.label.split(":");
      ContractAccountValue = ContractAccount[0];
    }

    //Select WKO Miscellaneous Account
    let MiscellaneousAccountValue;
    if (
      !selected_Miscellaneous_Account ||
      !selected_Miscellaneous_Account.label
    ) {
      MiscellaneousAccountValue = "";
    } else {
      const MiscellaneousAccount =
        selected_Miscellaneous_Account.label.split(":");
      MiscellaneousAccountValue = MiscellaneousAccount[0];
    }

    //Check Img state
    let setDbImgRowIdUpdate;
    if (getDbImgRowId == "" || getDbImgRowId == null) {
      setDbImgRowIdUpdate = "";
    } else {
      setDbImgRowIdUpdate = getDbImgRowId;
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
      ////console.log("Date2 ", date_2);
    }

    //Select Date 3
    let date_3 = "";
    if (UDFDate_3 == "" || UDFDate_3 == null) {
      date_3 = "";
    } else {
      date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date3 ", date_3);
    }

    //Select Date 4
    let date_4 = "";
    if (UDFDate_4 == "" || UDFDate_4 == null) {
      date_4 = "";
    } else {
      date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date4 ", date_4);
    }

    //Select Date 5
    let date_5 = "";
    if (UDFDate_5 == "" || UDFDate_5 == null) {
      date_5 = "";
    } else {
      date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
      ////console.log("Date5 ", date_5);
    }

    let setDescriptionValue;
    if (Description == "" || Description == null) {
      setIsWorkDescEmpty(true);
      const errorMessage =
        "Please fill the required field Description is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      Swal.close();
      return;
    } else {
      setDescriptionValue = Description;
      ////console.log("Date5 ", date_5);
    }

    let missingFields = [];

    var json_workorder_update = {
      site_cd: site_ID,
      wko_mst_wo_no: WorkOrderNo.trim(),
      wko_mst_assetno: EmptyAsset.trim(),
      wko_mst_status: setStatus.trim(),
      wko_mst_asset_status: setAsset_Status.trim(),
      wko_mst_plan_priority: setPlan_Priority.trim(),
      wko_mst_asset_group_code: Asset_Group_Code.trim(),
      wko_mst_org_date: date_of_origination,
      wko_mst_chg_costcenter: Charge_Cost_Center[0].trim(),
      wko_mst_due_date: date_of_due,
      wko_mst_work_area: setWork_Area.trim(),
   //   wko_mst_originator: OriginatorUP.trim(),
      wko_mst_originator: OriginatorUP?.trim() || inputValueOriginator?.trim() || "",

      wko_mst_asset_level: Asset_Level.trim(),
      wko_mst_phone: Phone,
      wko_mst_asset_location: setAsset_Location.trim(),
      wko_mst_flt_code: Fault_Code.trim(),
      wko_mst_descs: setDescriptionValue,

      wko_det_corr_action: CorrectiveAction,
      wko_mst_project_id: setProject_ID.trim(),
      wko_mst_orig_priority: "",
      wko_det_cause_code: Cause_Code.trim(),
      wko_det_sched_date: date_of_schedule,
      wko_det_act_code: Action_Code.trim(),
      wko_det_exc_date: date_of_exception,
      wko_det_delay_cd: Delay_Code.trim(),
      wko_det_sc_date: date_of_status_change,
      wko_det_work_type: WorkTypeValue,
      wko_det_cmpl_date: date_of_completion,
      wko_det_work_class: Work_Class.trim(),
      wko_det_clo_date: date_of_close,
      wko_det_work_grp: WorkGroupValue,
      wko_det_supv_id: Supervisor_ID.trim(),
      wko_det_planner: Planner.trim(),
      wko_det_approver: Approver.trim(),
      wko_det_assign_to: Assign_To.trim(),
      wko_det_perm_id: Permanent_ID,
      wko_det_temp_asset: CheckBox_Temporary_Asset,
      wko_det_approved: CheckBox_Approved,
      wko_det_safety: CheckBox_Safety,

      wko_det_customer_cd: CustomerCodeValue,
      wko_det_laccount: LaborAccountValue.trim(),
      wko_det_maccount: MaterialAccountValue.trim(),
      wko_det_crd_costcenter: CreditCostCenterValue.trim(),
      wko_det_caccount: ContractAccountValue.trim(),
      wko_det_saccount: MiscellaneousAccountValue.trim(),

      wko_det_note1: UDFNote1,
      wko_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
      wko_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
      wko_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
      wko_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
      wko_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
      wko_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
      wko_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
      wko_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
      wko_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
      wko_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",

      wko_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : "",
      wko_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : "",
      wko_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : "",
      wko_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : "",
      wko_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : "",

      wko_det_datetime1: date_1 ? date_1.trim() : date_1,
      wko_det_datetime2: date_2 ? date_2.trim() : date_2,
      wko_det_datetime3: date_3 ? date_3.trim() : date_3,
      wko_det_datetime4: date_4 ? date_4.trim() : date_4,
      wko_det_datetime5: date_5 ? date_5.trim() : date_5,

      asset_type_ID: AutoNumring.trim(),

      audit_user: emp_mst_login_id.trim(),
      wko_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      wko_mst_create_date: get_date,
      SingleImguploadStatus: imguploadStatus,
      ImguploadRefStatus: imguploadRefStatus ? imguploadRefStatus : "EMPTY",
      ImgGetDbImgRowId: setDbImgRowIdUpdate,
      ImgUpload: imageSelect,
      SpecialOdrResult: SpecialOdrResult,
      checklistformData:checkListData,

      // "ImgUploadMultiPal": selectedImages2,
      //"AllPlaningData":AllPlaningData,
      removedRefItems: removedRefItems,
      RowID: RowID,
      selectedPdfFiles: selectedPdfFiles,
    };
//console.log("json_workorder_update____",json_workorder_update);

for (let i = 0; i < WorkOrderMandatoryFiled.length; i++) {
  const item = WorkOrderMandatoryFiled[i];
  const fieldValue = json_workorder_update[item.column_name];
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
        "/update_workorder.php",
        JSON.stringify(json_workorder_update)
      );
   //  console.log("response___order___", response);
      // Swal.close();
      if (response.data.status === "SUCCESS") {

        if(datastatus === "CompleteStatus"){       // complete popup code
          Swal.close();
          setModalOpenComplete(true);
          return;
        }else if( datastatus === "CloseBtnStatus"){  // complete popup code
          Swal.close();
          setModalOpenClose(true);
          return;
        }

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
              "/insert_work_order_reference_multiImg_upload.php",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data", // Ensure proper content type
                },
              }
            );
           // console.log("img___upload___", response);

            if (response.data.status == "SUCCESS") {
              Swal.close();
              Swal.fire({
                icon: "success",
                customClass: {
                  container: "swalcontainercustom",
                },
                title: response.data.status,
                text: `Work Oder ` + WorkOrderNo + ` Updated Successfully`,
                timer: swalCloseTime, // Auto-close after 3 seconds
                timerProgressBar: true, // Optional: Shows a progress bar
                willClose: () => {
                  // Navigate to the desired page when the modal closes
                  navigate(`/dashboard/work/order`, {
                    state: {
                      currentPage,
                      selectDropRowID,
                      selectedOptionBack:selectedOption,
                      selectedRowIdBack:RowID,
                    },
                  });
                },
              }).then((result) => {
                if (result.dismiss !== Swal.DismissReason.timer) {
                  navigate(`/dashboard/work/order`, {
                    state: {
                      currentPage,
                      selectDropRowID,
                      selectedOptionBack:selectedOption,
                      selectedRowIdBack:RowID,
                    },
                  });
                }
              });
            }
          } catch (error) {
            Swal.close();
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
            timer: swalCloseTime, 
            timerProgressBar: true, 
            willClose: () => {
              // Navigate to the desired page when the modal closes
              navigate(`/dashboard/work/order`, {
                state: {
                  currentPage,
                  selectDropRowID,
                  selectedOptionBack:selectedOption,
                  selectedRowIdBack:RowID,
                },
              });
            },
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              if (response.data.status === "SUCCESS") {
              navigate(`/dashboard/work/order`, {
                state: {
                  currentPage,
                  selectDropRowID,
                  selectedOptionBack:selectedOption,
                  selectedRowIdBack:RowID,
                },
              });
            }
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

  // Complete button click api
  const Update_complete = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
   // Swal.showLoading();
  
    const formattedDate = CompletionDate2
      ? Moment(CompletionDate2).format("YYYY-MM-DD HH:mm:ss.SSS")
      : "";
    let CompleteStatus;
   // console.log("selected_Status2_____",selected_Status2);
    if (selected_Status2.label === "" || selected_Status2.label === null) {
      CompleteStatus = "";
    } else {
      const Status2 = selected_Status2.label.split(":");
      CompleteStatus = Status2[0];
      ////console.log("Status: ", Status[0])  selected_Cause_Code_temp
    }

    let selectedActionCode = "";
    if (
      !selected_Action_Code_temp || 
      typeof selected_Action_Code_temp.label !== 'string' || 
      selected_Action_Code_temp.label.trim() === ""
    ) {
      selectedActionCode = "";
    } else {
      const ActionCode = selected_Action_Code_temp.label.split(":");
      selectedActionCode = ActionCode[0];
    }

    let selectedCauseCode = "";
    if (
      !selected_Cause_Code_temp || 
      typeof selected_Cause_Code_temp.label !== 'string' || 
      selected_Cause_Code_temp.label.trim() === ""
    ) {
      selectedCauseCode = "";
    } else {
      const CauseCode2 = selected_Cause_Code_temp.label.split(":");
      selectedCauseCode = CauseCode2[0];
    }
    var json_workorder = {
      site_cd: site_ID,
      wko_mst_status: CompleteStatus.trim(),
      audit_user: emp_mst_login_id.trim(),
      wko_det_cmpl_date: formattedDate,
      wko_det_corr_action: CorrectiveActionTemp.trim(),
      wko_sts_wo_no: WorkOrderNo,
      mst_RowID: RowID,
      wko_det_act_code: selectedActionCode.trim(),
      wko_det_cause_code: selectedCauseCode.trim(),
    };
      
    try {
      const response = await httpCommon.post(
        "/complete_workorder.php",
        JSON.stringify(json_workorder)
      );
    //    console.log("response___complet___",response);
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
          navigate(`/dashboard/work/order`, {
            state: {
              currentPage,
              selectDropRowID,
              selectedOptionBack:selectedOption,
            },
          });
        });
      }else{
        Swal.fire({
          icon: "info",
          title: response.data.status,
          text: response.data.message,
          customClass: {
            container: "swalcontainercustom",
          },
          width: '450px', 
        }).then(() => {

           handleCMPCloseModal();
         });

        
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops somthing is wrong...",
        text: error,
      });
    }
  };

  // Close button click Api
  const Update_closeOrder = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
     Swal.showLoading();
    const formattedDate = CloseDate2
      ? Moment(CloseDate2).format("YYYY-MM-DD HH:mm:ss.SSS")
      : "";
    let CloseStatus;
    if (selected_Status2.label === "" || selected_Status2.label === null) {
      CloseStatus = "";
    } else {
      const Status2 = selected_Status2.label.split(":");
      CloseStatus = Status2[0];
      ////console.log("Status: ", Status[0])
    }

    let selectedActionCode;
    if (
      selected_Action_Code_temp.label === "" ||
      selected_Action_Code_temp.label === null
    ) {
      selectedActionCode("");
    } else {
      const ActionCode = selected_Action_Code_temp.label.split(":");
      selectedActionCode = ActionCode[0];
    }

    let selectedCauseCode;
    if (
      selected_Cause_Code_temp.label === "" ||
      selected_Cause_Code_temp.label === null
    ) {
      selectedCauseCode("");
    } else {
      const CauseCode2 = selected_Cause_Code_temp.label.split(":");
      selectedCauseCode = CauseCode2[0];
    }
    var json_workorder = {
      site_cd: site_ID,
      wko_mst_status: CloseStatus.trim(),
      audit_user: emp_mst_login_id.trim(),
      wko_det_close_date: formattedDate,
      wko_det_corr_action: CorrectiveActionTemp.trim(),
      wko_sts_wo_no: WorkOrderNo,
      mst_RowID: RowID,
      wko_det_act_code: selectedActionCode.trim(),
      wko_det_cause_code: selectedCauseCode.trim(),
    };
    try {
      const response = await httpCommon.post(
        "/Close_workorder.php",
        JSON.stringify(json_workorder)
      );
      console.log("res", response);
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
       //   navigate(`/dashboard/work/order`);
          navigate(`/dashboard/work/order`, {
            state: {
              currentPage,
              selectDropRowID,
              selectedOptionBack:selectedOption,
            },
          });
        });
      }else{
        Swal.fire({
          icon: "info",
          title: response.data.status,
          text: response.data.message,
          customClass: {
            container: "swalcontainercustom",
          },
          width: '450px', 
        }).then(() => {

           handleCLOCloseModal();
         });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops somthing is wrong...",
        text: error,
      });
    }
  };

  // Status Audit PopUp

  const formatDuration = (duration) => {
    // const seconds = Math.floor(duration % 60);
    if (duration == null) {
      return "";
    }
    const minutes = Math.floor(duration % 60);
    const hours = Math.floor((duration % 1440) / 60);
    const days = Math.floor(duration / 1440);

    if (days > 0) {
      return `${days}d: ${hours}h: ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h: ${minutes}m`;
    } else if (minutes >= 0) {
      return `${minutes}m`;
    } else {
      return "";
    }
    // return `${days}d: ${hours}h: ${minutes}m`;
  };
  const getsteps = async () => {
    // console.log("enter_getSteps___");
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    //Select Status
    let setStatus = "";

    if (selected_Status.label) {
      console.log("selected_Status:", selected_Status);
      console.log("selected_Status.label:", selected_Status.label);

      // Split the label and log the result
      const splitLabel = selected_Status.label.split(":");
      console.log("splitLabel:", splitLabel);

      // Assign setStatus and log it
      setStatus = splitLabel[0].trim(); // Trim to remove any extra spaces
    }

    try {
      let responseJson;
      if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_workordermaster_statusaudit.php?site_cd=${site_ID}&RowID=${completeRowID}`
        );
      } else if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_workordermaster_statusaudit.php?site_cd=${site_ID}&RowID=${closeRowID}`
        );
      } else if (setStatus && setStatus === "CMP") {
        responseJson = await httpCommon.get(
          `/get_workordermaster_complete_statusaudit.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      } else if (setStatus && setStatus === "CLO") {
        responseJson = await httpCommon.get(
          `/get_workordermaster_complete_statusaudit.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      } else {
        responseJson = await httpCommon.get(
          `/get_workordermaster_statusaudit.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      }
       console.log("responseJson___status",responseJson);
      if (responseJson.data.status === "SUCCESS") {
        // console.log('get_workordermaster_statusaudit', responseJson.data.data)

        let Status = responseJson.data.data.map((item, index) => {
          let date = new Date(item.wko_sts_start_date.date);
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
            label: item.wrk_sts_desc,
            label1: item.wko_sts_status,
            label2: item.emp_mst_name,
            label3: item.wko_sts_originator,
            label4: `${formattedWeekday} ${formattedDate} ${formattedTime}`,
            label5: formatDuration(item.duration),
            label6: item.wrk_sts_desc,
            step: index + 1,
          };
        });
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
      console.log("Error", error);
    }
  };

  const StatushandleShow = () => {
    setStatusShow(true);
    getsteps();
  };
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
          `/get_assignTo_history.php?site_cd=${site_ID}&RowID=${completeRowID}`
        );
      } else if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        responseJson = await httpCommon.get(
          `/get_assignTo_history.php?site_cd=${site_ID}&RowID=${closeRowID}`
        );
      } else {
        responseJson = await httpCommon.get(
          `/get_assignTo_history.php?site_cd=${site_ID}&RowID=${RowID}`
        );
      }
   //   console.log("responseJson___RowID_Asign__",responseJson);
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
            label: item.wko_ls7_emp_id,
            label1: item.column1,
            label2: item.emptyName,
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
  const addCommnethandal = () => {
    setCommentShow(true);
    fetchAllCommentData();
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

    const inputValue = messageRef.current.value.trim();

    if (inputValue === "" && !imageComment) {
      console.log("both empty");
      Swal.close();
      return;
    }

    const newComment = {
      // Add other properties as needed
      wko_ls11_name: emp_mst_name,
      audit_user: emp_mst_login_id, // Replace with the actual user
      audit_date: {
        date: Moment().format("YYYY-MM-DD HH:mm:ss"),
        timezone_type: 3,
        timezone: "UTC",
      },
      wko_ls11_sts_upd: inputValue,
      attachment: imageComment ? imageComment.base64 : null,
    };
    setAllComment((prevComments) => [...prevComments, newComment]);

    const json_workorder = {
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
      //console.log("json_workordercommet Data", response);

      if (response.data.status === "SUCCESS") {
        Swal.close();
        if (messageRef.current) {
          messageRef.current.value = "";
        }
        setImagePreview("");
        setimageComment(null); // Use null instead of an empty string
        scrollChatToBottom();
        // fetchAllCommentData();
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
      console.error("Error submitting comment:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your comment. Please try again.",
      });
    }
  };

  const Refreshdatapopup = () => {
    fetchAllCommentData();
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
  // get all comment funcation
  const fetchAllCommentData = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    setLoading(true);
    try {
      const Rowid = RowID || completeRowID || closeRowID;
      const response = await httpCommon.get(
        `get_chart.php?mst_RowID=${Rowid}&site_cd=${site_ID}&url=${httpCommon.defaults.baseURL}&folder=React_web&dvc_id=Web`
      );

       //  console.log("json_workordercommet Data", response);

      if (response.data.status === "SUCCESS") {
        setAllComment(response.data.data);
        Swal.close();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleImageClick = (imageData) => {
    setSelectedImageCommnt(imageData);
  };
  const handleImageClickSHow = () => {
    setUploadImgShow(true);
  };
  const handleUploadCloseClick = () => {
    setImagePreview("");
  };

  // OnChange to check error funcation
  const handleStatusChange = (event, value) => {
    
    setSelected_Status2(value);
    setSelected_Status(value);
    setIsFiledValueEmpty(false);
    setIsWorkOrderStatusEmpty(false);
    setIsFormFiled(true);
  };

  const handlePlanPriorityChange = async (event, value) => {
    const newValue = value === null ? null : value;
    
    setSelected_Plan_Priority(newValue);
    setIsFormFiled(true);
    if (value && value.label) {
      const labelParts = value.label.split(":");
      const valueBeforeColon = labelParts[0].trim();

      if (valueBeforeColon !== "") {
        try {
          const response = await httpCommon.get(
            `GetDueDatePlanPriority.php?ID=${valueBeforeColon}&site_cd=${site_ID}`
          );
        
          if (response.data.status === "SUCCESS") {
            const dueDateIncrement = response.data.data;
            if (!isNaN(dueDateIncrement)) {
              //const dt = new Date();
              setdueDateIncrement(dueDateIncrement);
              const today = new Date();
              const millisecondsToAdd = dueDateIncrement * 60 * 1000;
              const newDate = new Date(
                today.getTime() + millisecondsToAdd
              );
              setDueDate(newDate);
              Swal.close();
              setLoading(false);
            } else {
              console.error("Invalid dueDateIncrement:", response.data.data);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
  };
  const handleOriginationDateChange = async (newDate) =>{
    if (newDate && newDate.isValid()) {
      const nativeDate = newDate.toDate();
      if(dueDateIncrementSet !== "" && dueDateIncrementSet !== null){
        const millisecondsToAdd = dueDateIncrementSet * 60 * 1000;
          const newDate2 = new Date(
            nativeDate.getTime() + millisecondsToAdd
          ); 
          setDueDate(newDate2);
          setOriginationDate(newDate);
      }else if(dueDateIncrementSet === ""){ 
        const millisecondsToAdd = 0 * 60 * 1000;
        const newDate2 = new Date(
          nativeDate.getTime() + millisecondsToAdd
        ); 
        setDueDate(newDate2);
        setOriginationDate(newDate);

      }else{
        setOriginationDate(nativeDate);
      }
      
    } else {
      setOriginationDate(null);
    }
    // setErrorField(null);
    setIsFormFiled(true);
  }

  const handleChargeCostChange = (event, value) => {
    setSelected_Charge_Cost_Center(value);
    setIsChargeCostEmpty(false);
    setIsChargeCostEmpty(false);
    setIsFormFiled(true);
  };
  const handleFaultCodeChange = (selectedOption) => {
   // const newValue = value === null ? null : value;
  
   setSelected_Fault_Code(selectedOption);
   if (selectedOption) {
if(Description === ""){
  setDescription(selectedOption.value);
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: "Do you want to overwrite the description?",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, overwrite it!'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     setDescription(selectedOption.value);
        
    //   }
    // });
  }
  }


   //
    //handleSelectedFaultCode(newValue);
    setIsFaultCodeEmpty(false);
    setErrorField(null);
  };
  
  const handleWorkGroupChange = (event, value) => {
    setSelected_Work_Group(value);
    setIsWorkGroupEmpty(false);
    setErrorField(null);
    setIsFormFiled(true);
  };

  const toggleDivAsset = () => {
    setIsOpenAsset(!isOpenAsset);
  };
  const toggleDivAssetWorkInfo = () => {
    setIsOpenWorkInfo(!isOpenWorkInfo);
  };
   const toggleDivAssetAdditionalWorkInfo = () => {
    setIsOpenAdditionalWorkInfo(!isOpenAdditionalWorkInfo);
  };
  const toggleDivAssetAccountInfo = () => {
    setIsOpenAccountInfo(!isOpenAccountInfo);
  };
  const toggleDivAssetUDFInfo = () =>{
    setIsOpenUDFInfo(!isOpenUDFInfo);
    
  }

  const handleDataFromSecondComponent = (data) => {
   // console.log("data++++++++", data);
    window.location.reload();
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
        setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
    setErrorField(null);
  };

  useEffect(() => {
    async function fetchData() {
      if (RowID !== "" && RowID !== null && RowID !== undefined) {
        setButton_save("Update");
        await get_workordermaster_select();
        await getWorkOrderLebel();
        //await getWorkOrderDefaultStatus();
        await getWorkOrderMandatoryfiled();
      } else if (
        completeRowID !== undefined &&
        completeRowID !== null &&
        completeRowID !== ""
      ) {
        //setSelected_Status
        setButton_save("Complete");
        await get_workordermaster_select();
        await getWorkOrderLebel();
       // await getWorkOrderDefaultStatus();
        await getWorkOrderMandatoryfiled();
      } else if (
        closeRowID !== undefined &&
        closeRowID !== null &&
        closeRowID !== ""
      ) {
        setButton_save("Close Order");
        await get_workordermaster_select();
       // await getWorkOrderDefaultStatus();
        await getWorkOrderLebel();
        await getWorkOrderMandatoryfiled();
      }else if(AssetHirechyId !== "" && AssetHirechyId !== null && AssetHirechyId !== undefined){
        await getWorkOrderLebel();
       
        await getWorkOrderMandatoryfiled();
        await fetchStatusData();
       // await getWorkOrderDefaultStatus();
        await fetchStusPriortyData();
        await get_assset_hirechy_data();
       
     
        setButton_save("Save");
      } else {
        await getWorkOrderLebel();
        await getWorkOrderMandatoryfiled();
        await fetchStatusData();
        await getWorkOrderDefaultStatus();
        await fetchStusPriortyData();
        setButton_save("Save");
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (
      WorkOrderDefaultStats.length > 0 &&
      WorkOrderDefaultStats[0].dft_mst_wko_sts
    ) {
      const defaultStatus = WorkOrderDefaultStats[0].dft_mst_wko_sts;
  
      const matchingStatus = Status.find((status) => {
        const [statusCode] = status.label.split(" : "); // Extract the part before the colon
        return statusCode === defaultStatus;
      });

      if (matchingStatus) {
      //  console.log("matchingStatus_____",matchingStatus);
        // Set the label in selected_Status state
        setSelected_Status({
          key:matchingStatus.key,
          label: matchingStatus.label,
        });
      }
    }
  }, [WorkOrderDefaultStats]);

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

   const getKeyFromLabel = (label) => {
    // Ensure label is a string and contains a colon
    if (typeof label === 'string' && label.includes(' : ')) {
      const parts = label.split(' : ');
      return parts[0]; // Return the key part, which is the first part before the colon
    }
    return ''; // Return an empty string or a default value if label is not valid
  };

  const statusKey = selected_Status ? getKeyFromLabel(selected_Status.label) : null;

 // get Asset hirecy data
 const get_assset_hirechy_data = async () => {
  try {
    const responseJson = await httpCommon.get(
      `/get_asset_hirechy_work_order_data.php?RowID=${AssetHirechyId}&site_ID=${site_ID}`
    );
   // console.log("responseJson____3333",responseJson);
    if(responseJson.data.status === "SUCCESS"){
      if(!responseJson.data.data.all_ast_data.ast_mst_cost_center || !responseJson.data.data.all_ast_data.cost_center_desc )
        {
          setSelected_Charge_Cost_Center({ label: "" });
        }else{
          setSelected_Charge_Cost_Center({    
            label: responseJson.data.data.all_ast_data.ast_mst_cost_center + " : " + responseJson.data.data.all_ast_data.cost_center_desc,
           });
        };
    }
    //   console.log("SELECT res: ", responseJson);
    }catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops get_WorkRequest_select...",
        text: error,
      });
    }
  }

  const handleCheckListData = (FormDataGet) => {
   //console.log("FormDataGet_____",FormDataGet);
    setCheckListData(FormDataGet);           
  } 

const CompletePopup = (event) =>{

  const datastatus = "CompleteStatus";
  setPassCompleteBtn(datastatus);

  if (isFormFiled) {
   // console.log("isFormFiled___value___",isFormFiled);
    fetchStatusData(datastatus);
    onClickChange(event,datastatus);
  }else{
   // console.log("comingelse constion__");
    fetchStatusData(datastatus);
    setModalOpenComplete(true);
  }
 
}

const handleCMPCloseModal =() => {
  setPassCompleteBtn("");
  //setCorrectiveActionTemp("");
  setCorrectiveActionTemp(CorrectiveAction);
  setSelected_Cause_Code_temp(selected_Cause_Code);
  setSelected_Action_Code_temp(selected_Action_Code);
  setSelected_Status2("");
  setModalOpenComplete(false);
}

const CloseBtnPopup = (event) =>{
  const datastatus = "CloseBtnStatus";
  if (isFormFiled) {
     fetchStatusData(datastatus);
     onClickChange(event,datastatus);
   }else{
    // console.log("comingelse constion__");
     fetchStatusData(datastatus);
     setModalOpenClose(true);
   }
}

const handleCLOCloseModal =() => {
  setPassCompleteBtn("");
  setCorrectiveActionTemp(CorrectiveAction);
  setSelected_Cause_Code_temp(selected_Cause_Code);
  setSelected_Action_Code_temp(selected_Action_Code);
  setSelected_Status2("");
  setModalOpenClose(false);
}

 const [selectedValue, setSelectedValue] = useState("");
 const [selectedValueTemp, setSelectedValueTemp] = useState("");

  const handleChangeStatus = (event) => {
    setSelectedValue(event.target.value);
  };
  const getClassName = (key) => {
    switch (key) {
      case "OPEN":
        return "openClass";
      case "COMPLETE":
        return "completeClass";
      case "CLOSE":
        return "closeClass";
      case "CAN":
        return "cancelClass";
      default:
        return "";
    }
  };
 
const classNamed = selected_Status ? getClassName(selected_Status.key) : null;

const getWRInfo  = async() =>{
  try {
      
    const response = await httpCommon.get(`/get_wr_request_info.php?site_cd=${site_ID}&WR_No=${workRequestNo}`);
      //console.log("response____work_order_",response);
    if (response.data.status === "SUCCESS") {
      setWRStatus(response.data.data[0].wkr_mst_wr_status);
      if (response.data.data[0].wkr_mst_org_date == null) {
        setWROriDate("");
      } else {
        const apiDate = response.data.data["0"].wkr_mst_org_date.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm"
        ).toDate();
        setWROriDate(formattedDate);
      }
     // setWkoDetLabel(response.data.data.wkr_mst_org_date);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
const wrkReqinfopopup = () =>{
//  console.log("open___",workRequestNo);
  getWRInfo();
  setModalOpenWorkReq(true);
}

function handleCloseModalWorkReq() {
  setModalOpenWorkReq(false);
}
const handleWorkOrderSubModule = (btnClkDataRecived) =>{
  setWorkOrderSubModuleBtn(btnClkDataRecived);
}

  useEffect(() => {
    if (TabBtnName) {
     
      if (TabBtnName === 'BtnTimeCard') {
        setTabValue(2); 
       
      }else if(TabBtnName === 'BtnPlanning'){
        setTabValue(3); 

      }else if (TabBtnName === 'BtnCheckList') {
        setTabValue(4); 
       
      } else if (TabBtnName === 'BtnDownTime') {
        setTabValue(5); 

      }else if(TabBtnName === 'BtnComments'){
        setTabValue(6);

      }
    }
  }, [TabBtnName]);

  useEffect(() => {
    if (Tabvalue === 6 && !RowID && !completeRowID && !closeRowID) {
        Swal.fire({
            icon: "info",
            customClass: {
              container: "swalcontainercustom",
            },
            title: "Please Wait!",
            allowOutsideClick: false,
            text: "Once the Work Order is created, you can then add detailed Comments.",
            width:"400px"
          });
        //  onRowClick("BtnDownTime");
        setWorkOrderSubModuleBtn("BtnComments")
    }
  }, [Tabvalue, RowID, completeRowID, closeRowID]);

  return (
    <>
      <Helmet>
        <title>
          {RowID
            ? "CMMS System"
            : completeRowID
            ? "CMMS System"
            : closeRowID
            ? "CMMS System"
            : "CMMS System"}
        </title>
        <meta name="description" content="New Work Order" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div
          className="CustomBreadAssetSaveWordOrder"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
            height: "105px",
          }}
        >
          <div className="breadcrumbs-container">
          <CustomBreadcrumbs
            // heading="Create Work Order"

            heading={
              <div className="breadcrumbs-heading">
                {RowID
                  ? `Edit ${WorkOrderNo} Work Order`
                  : completeRowID
                  ? `Complete ${WorkOrderNo} Work Order`
                  : closeRowID
                  ? `Close ${WorkOrderNo} Work Order`
                  : "Create New Work Order"}
              </div>
           
            }
            links={[
              {
                name: "Work Order",
              },
              { name: RowID ? "Save" : "Create" },
            ]}
            action={
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                {(() => {
                  if (
                    completeRowID !== undefined &&
                    completeRowID !== null &&
                    completeRowID !== ""
                  ) {
                    return (
                      <div>
                        <Button
                          component={RouterLink}
                          onClick={onClickChangeComplete}
                          variant="contained"
                          className="SaveButton"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                        >
                          {Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          startIcon={<Iconify icon="jam:close" />}
                          onClick={onClickCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    );
                  } else if (
                    closeRowID !== undefined &&
                    closeRowID !== null &&
                    closeRowID !== ""
                  ) {
                    return (
                      <div>
                        <Button
                          component={RouterLink}
                          onClick={onClickChangeClose}
                          variant="contained"
                          className="SaveButton"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                        >
                          {Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          startIcon={<Iconify icon="jam:close" />}
                          onClick={onClickCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    );
                  } else {
                   
                    return (
                      <div>
                      
                        {!loading && Button_save !== "Save" && (
                          <FormControl sx={{ m: 1, minWidth: 120, borderRadius: '8px'}} className={`cutomeBtnDropMainCls ${classNamed}`}
                          >
                            
                            <Select
                              value={
                                selected_Status && selected_Status.key === "OPEN"
                                  ? "Open" 
                                  : selected_Status && selected_Status.key === "COMPLETE"
                                  ? "Complete"
                                  : selected_Status && selected_Status.key === "CLOSE"
                                  ? "Close"
                                  : selected_Status && selected_Status.key === "CAN"
                                  ? "Cancel"
                                  : ""
                              }
                              onChange={handleChangeStatus}
                              displayEmpty
                              inputProps={{ 'aria-label': 'Without label' }}
                            >
                              <MenuItem value="Open" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Iconify icon="fluent:status-48-filled" style={{ color: "Green", marginRight: '5px', fontSize: '17px',marginTop: "2px" }} />
                                <span style={{ color: "Green",fontWeight:"700" }}>Open </span>
                              </MenuItem>
                              <MenuItem value="Complete" 
                               onClick={selected_Status && selected_Status.key !== "COMPLETE" ? CompletePopup : null}
                               disabled={!selected_Status || selected_Status.key === "COMPLETE" || selected_Status.key === "CLOSE"}
                             
                               >
                                <Iconify icon="hugeicons:note-done" style={{ color: "Blue", marginRight: '5px', fontSize: '17px',marginTop: "2px" }} /> <span style={{ color: "Blue",fontWeight:"700" }}>Complete</span>
                               
                              </MenuItem>
                              <MenuItem value="Close" 
                              onClick={selected_Status && selected_Status.key !== "CLOSE" ? CloseBtnPopup : null}
                              disabled={selected_Status && selected_Status.key === "CLOSE"}
                              >
                                <Iconify icon="iconamoon:file-close-fill" style={{ color: "#636363", marginRight: '5px', fontSize: '17px',marginTop: "2px" }}/> 
                                <span style={{ color: "#636363",fontWeight:"700" }} >Close</span> 
                              </MenuItem>
                              <MenuItem value="Cancel">
                                <Iconify icon="material-symbols-light:cancel-outline-rounded" style={{ color: "#b71d18", marginRight: '5px', fontSize: '17px',marginTop: "2px" }} />
                                <span style={{ color: "#b71d18",fontWeight:"700" }} >Cancel</span> 
                              </MenuItem>
                            </Select>
                          </FormControl>
                        )
                      }
                        <Button
                          component={RouterLink}
                          onClick={onClickChange}
                          variant="contained"
                          className="SaveButton cutm"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                          disabled={statusKey === "CLO"}
                        >
                       
                         {Button_save === "Update" ? "Save" : Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          startIcon={<Iconify icon="jam:close" />}
                          onClick={onClickCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    );
                  }
                })()}
              </div>
            }
           // sx={{ mb: { xs: 3, md: 5 } }}
           sx={{

            mb: { xs: 3, md: 5 },
          
            [`@media (max-width: 768px)`]: {
          
              '& .action-buttons': {
          
                flexWrap: 'wrap',
          
              },
          
              '& .action-buttons > *': {
          
                width: '100%',
          
                marginBottom: '10px',
          
              },
          
            },
          
          }}
            
          />    
      </div>

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
                  Work Order
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
                  Details
                </div>
              }
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="material-symbols:timer-outline"
                    style={{ marginRight: '4px' }}
                  />
                 Time Card
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
                    icon="mdi:planner-outline"
                    style={{ marginRight: '4px' }}
                  />
                  Check List
                </div>
              }
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="guidance:time"
                    style={{ marginRight: '4px' }}
                  />
                  DownTime
                </div>
              }
            />
         
         <Tab
            label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="bx:chat"
                  style={{ marginRight: '4px' }}
                />
                Comments
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
              {/* Complete Status code */}
              {completeRowID !== undefined &&
                completeRowID !== null &&
                completeRowID !== "" && (
                  <div
                    className="MainOrderFromGd"
                    style={{ backgroundColor: "white" }}
                  >
                    <Grid container spacing={0}>
                      <Grid xs={12} md={12} className="CompleteDiv">
                        <Card sx={{ p: 3 }}>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "1fr",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Box
                              rowGap={2}
                              columnGap={1}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "90%",
                                sm: "90% 10%",
                              }}
                            >
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("wko_mst_status") ||
                                    "Status"}
                                </Typography>
                               
                                <Autocomplete
                                  options={Status.filter(
                                    (status) => status.key === "COMPLETE"
                                  )}
                                  value={(selected_Status?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}
                                  onChange={handleStatusChange}
                                  disableAnimation
                                 // disabled={ApprovalStatus === "A" || ApprovalStatus === "D"}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          isFiledValueEmpty ? "errorEmpty" : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Tooltip
                                title="Status Audit"
                                placement="top"
                                className="tooltipRht"
                                disabled={Button_save == "Save"}
                                arrow
                              >
                                <IconButton>
                                  <Iconify
                                    icon="pajamas:status-alert"
                                    onClick={StatushandleShow}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabel("wko_det_cmpl_date") ||
                                  "Complete Date"}
                              </Typography>

                              <DateTimePicker
                                value={CompletionDate2}
                                format="dd/MM/yyyy HH:mm"
                                className="Extrasize"
                                onChange={(newDate) => {
                                  setCompletionDate2(newDate);
                                  setIsFormFiled(true);
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                              />
                            </Stack>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2" className="Requiredlabel">
                                  {findCustomizeLabel("wko_det_corr_action") ||
                                    "Corrective Actions"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  
                                  size="small"
                                  value={CorrectiveAction}
                                  minRows={6}
                                  className={`TxtAra ${
                                    isCorrectiveValueEmpty ? "errorEmpty" : ""
                                  }`}
                                  style={{ width: "100%" }}
                                 
                                  onChange={(e) => {
                             
                                    const value = e.target.value;
                                    if (value.length <= 2000) {
                                      setCorrectiveAction(value);
                                    }
                                    setIsCorrectiveValueEmpty(false);
                                    setIsFormFiled(true);
                                    
                                  }}
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "repeat(1, 1fr)",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className="Requiredlabel">
                                {findCustomizeLabelDet("wko_det_cause_code") ||
                                  "Cause Code"}
                              </Typography>
                              <Autocomplete
                                options={Cause_Code}
                                value={selected_Cause_Code?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Cause_Code(value || null);
                                  setIsCauseCodeValueEmpty(false);
                                  setIsFormFiled(true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isCauseCodeValueEmpty ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className="Requiredlabel">
                                {findCustomizeLabelDet("wko_det_act_code") ||
                                  "Action Code"}
                              </Typography>
                              <Autocomplete
                                options={Action_Code}
                                value={selected_Action_Code?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Action_Code(value || null);
                                  setIsActionCodeValueEmpty(false);
                                  setIsFormFiled(true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isActionCodeValueEmpty ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                )}

              {/* Close Status code */}
              {closeRowID !== undefined &&
                closeRowID !== null &&
                closeRowID !== "" && (
                  <div
                    className="MainOrderFromGd"
                    style={{ backgroundColor: "white" }}
                  >
                    <Grid container spacing={0}>
                      <Grid xs={12} md={12} className="CompleteDiv">
                        <Card sx={{ p: 3 }}>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "1fr",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Box
                              rowGap={2}
                              columnGap={1}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "90%",
                                sm: "90% 10%",
                              }}
                            >
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("wko_mst_status") ||
                                    "Status"}
                                </Typography>
                                <Autocomplete
                                  options={Status.filter(
                                    (status) => status.key === "CLOSE"
                                  )}
                                  value={(selected_Status?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}
                                  onChange={handleStatusChange}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          isFiledValueEmpty ? "errorEmpty" : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Tooltip
                                title="Status Audit"
                                placement="right"
                                className="tooltipRht"
                                disabled={Button_save == "Save"}
                              >
                                <IconButton>
                                  <Iconify
                                    icon="pajamas:status-alert"
                                    onClick={StatushandleShow}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabel("wko_det_clo_date") ||
                                  "Close Date"}
                              </Typography>

                              <DateTimePicker
                                value={CloseDate2}
                                format="dd/MM/yyyy HH:mm"
                                className="Extrasize"
                                onChange={(newDate) => {
                                  setCloseDate2(newDate); // Update your state with the new value
                                  setIsFormFiled(true);
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                              />
                            </Stack>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2" className="Requiredlabel">
                                  {findCustomizeLabel("wko_det_corr_action") ||
                                    "Corrective Actions"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  
                                  size="small"
                                  value={CorrectiveAction}
                                  minRows={6}
                                  className={`TxtAra ${
                                    isCorrectiveValueEmpty ? "errorEmpty" : ""
                                  }`}
                                  style={{ width: "100%" }}
                                  
                                  onChange={(e) => {
                             
                                    const value = e.target.value;
                                    if (value.length <= 2000) {
                                      setCorrectiveAction(value);
                                    }
                                    setIsCorrectiveValueEmpty(false);
                                    setIsFormFiled(true);
                                    
                                  }}
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "repeat(1, 1fr)",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className="Requiredlabel">
                                {findCustomizeLabelDet("wko_det_cause_code") ||
                                  "Cause Code"}
                              </Typography>
                              <Autocomplete
                                options={Cause_Code}
                                value={selected_Cause_Code?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Cause_Code(value || null);
                                  setIsCauseCodeValueEmpty(false);
                                  setIsFormFiled(true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isCauseCodeValueEmpty ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className="Requiredlabel">
                                {findCustomizeLabelDet("wko_det_act_code") ||
                                  "Action Code"}
                              </Typography>
                              <Autocomplete
                                options={Action_Code}
                                value={selected_Action_Code?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Action_Code(value || null);
                                  setIsActionCodeValueEmpty(false);
                                  setIsFormFiled(true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isActionCodeValueEmpty ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                )}

              {/* toggle view */}

              <Grid container spacing={2}>
          
                <Grid xs={12} md={12} className="mainDivClass">
                  <Card >
                  
                    <Grid container spacing={2} >
                    <Grid xs={12} md={12}>
                    {/*Work Order*/}
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 0}
                      sx={{ marginTop: "16px" }}
                    >
                        <Grid container spacing={2}>
                          <Grid xs={12} md={10}>
                            {/* ************************************* img mobile ******************************************* */}
                            <div className="col-md-2 mobileImgversion">
                              <div className="row">
                                <div className="row ImgShowMobile">
                                  <div>
                                    <label htmlFor="upload-button">
                                      {getDbImg && getDbImg.length > 0 ? (
                                         <div className="dbImgGet">
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
                                                             className="imgCurPont 3"
                                                              width="150"
                                                              height="auto"
                                                             alt="Base64 Image"
                                                             onClick={openSaveImg}
                                                             disabled={statusKey === "CLO"}
                                                           />
                                                           )}
                                                         
                                                           {/* Delete Button */}
                                                           <div className="col btnCenter">
                                                           <button
                                                             type="button"
                                                             className="btn dlt"
                                                             disabled={statusKey === "CLO"}
                                                             //onClick={() => handleDeleteImgApi(getDbImg[0].RowID)}
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

                                         </div>
                                      ) : image.preview ? (
                                        <div>
                                        {/* If the file is an image, show the image preview */}
                                        {image.raw?.type?.startsWith("image/") ? (
                                          <img
                                            src={image.preview}
                                            alt="preview"
                                            className="imgCurPont"
                                            onClick={openSaveImg}
                                            disabled={statusKey === "CLO"}
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
                                            disabled={statusKey === "CLO"}
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
                                              width="126"
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
                                   // onClose={handleClosedd2}
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
                                       // color: (theme) => theme.palette.grey[500],
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
                                            src={getDbImg[0].attachment}
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
                            <Box>
                               <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                   <Stack spacing={1} sx={{pb:1.5}}>
                                      <Typography
                                        variant="subtitle2"
                                        className={findCustomizerequiredLabel(
                                          "wko_mst_flt_code"
                                        )}
                                      >
                                        {findCustomizeLabel("wko_mst_flt_code") ||
                                          "Fault Code"}
                                      </Typography>
                                      
                                      <Autocomplete
                                        options={Fault_Code}
                                        value={selected_Fault_Code?.label ?? ""}
                                        disabled={statusKey === "CLO"}
                                        onChange={(event, value) => {
                                          handleFaultCodeChange(value);
                                          setErrorField(null); 
                                          setIsFormFiled(true);
                                        }}
                                        renderInput={(params) => (
                                          <div>
                                            <TextField
                                              {...params}
                                              size="small"
                                              placeholder="Select..."
                                              variant="outlined"
                                              className={
                                                errorField === "ast_mst_perm_id"
                                                  ? "erroBorderadd"
                                                  : "Extrasize"
                                              }
                                        
                                              ref={faultCodeAutocompleteRef}
                                            />
                                          </div>
                                        )}
                                      />
                                   </Stack>
                                   <Stack spacing={1} sx={{ height: '100%' }}>
                                      <Typography
                                        variant="subtitle2"
                                        className="Requiredlabel"
                                      >
                                        {findCustomizeLabel("wko_mst_descs") ||
                                          "Description..."}
                                      </Typography>
                                      <TextareaAutosize
                                        aria-label="empty textarea"
                                        
                                      // minRows={minRowsDesc}
                                        value={Description}
                                      disabled={statusKey === "CLO"}
                                        
                                        onChange={(e) => {
                                  
                                          const value = e.target.value;
                                          if (value.length <= 2000) {
                                            setDescription(value);
                                          }
                                          setErrorField(null); 
                                          setIsFormFiled(true);
                                          setIsWorkDescEmpty(false);
                                        }}
                                        className={`Extrasize ${
                                          isWorkDescEmpty ? "errorEmpty" : "TxtAra third"
                                        }`}
                                        style={{ resize: 'none', width: '100%' }}
                                      />
                                   </Stack>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                  <Box
                                    display="flex"
                                    alignItems="center" // Align items in the center vertically
                                    justifyContent="space-between" // Space out items horizontally
                                    sx={{
                                      flexDirection: { xs: 'row', sm: 'row' }, // Ensure the row direction on all screen sizes
                                      columnGap: 1, // Add some gap between the elements
                                      width: "100%",
                                    }}
                                  >
                                    <Stack spacing={1} flex={1} sx={{pb:1.5}}>
                                      <Typography
                                        variant="subtitle2"
                                        className="Requiredlabel"
                                      >
                                        {findCustomizeLabel("wko_mst_status") || "Status"}
                                      </Typography>

                                      <Autocomplete
                                        options={Status.filter((status) => status.key === "OPEN")}
                                        value={(selected_Status?.label || "")
                                          .split(" : ")
                                          .slice(0, 2)
                                          .join(" : ")}
                                        onChange={handleStatusChange}
                                        disabled={statusKey === "CLO"}
                                        disableAnimation
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder="Select..."
                                            variant="outlined"
                                            size="small"
                                            className={`Extrasize ${isWorkOrderStatusEmpty ? "errorEmpty" : ""} ${selected_Status?.label ? "highlightBorder" : ""}`}
                                            fullWidth
                                            ref={autocompleteRef}
                                          />
                                        )}
                                      />
                                    </Stack>

                                    <Tooltip
                                      title="Status Audit"
                                      placement="top"
                                      className="tooltipRht"
                                      disabled={Button_save === "Save"}
                                      arrow
                                    >
                                      <IconButton>
                                        <Iconify
                                          icon="pajamas:status-alert"
                                          onClick={StatushandleShow}
                                        />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                  <Box
                                rowGap={2}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                  xs: "repeat(1, 1fr)",
                                  sm: "repeat(2, 1fr)",
                                  rowGap: "0px",
                                }}
                                marginBottom={2}
                                sx={{ alignItems: 'stretch' }}
                              >
                              <Stack spacing={1} flex={1} sx={{ pb: 1.5 ,height: '100%'}}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel(
                                    "wko_mst_plan_priority"
                                  ) || "Plan Periority"}
                                </Typography>
                             
                                <div ref={planPerioritycompleteRef} className="hoverContainerIconBtn">
                                      <CustomTextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        size="small"
                                        className="Extrasize"
                                      
                                        fullWidth
                                      
                                        value={
                                          selected_Plan_Priority && selected_Plan_Priority.length > 20
                                            ? `${selected_Plan_Priority.substring(0, 20)}...`
                                            : selected_Plan_Priority || ""
                                        }
                                        disabled={statusKey === "CLO"}
                                        autoComplete="off"
                                        placeholder="Select..."
                                        rightIcons={[
                                          <Iconify
                                            icon="material-symbols:close"
                                          // onClick={handleCancelClick}
                                           className="hoverIconBtn"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleCancelClickPlan_Priority();
                                            //  setisWorkOrderAssetNoEmpty(false);
                                              setIsFormFiled(true);
                                            }}
                                            disabled={statusKey === "CLO"}
                                            
                                          />,
                                          <Iconify
                                            icon="tabler:edit"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleEditClickPlan_Priority();
                                           //   setisWorkOrderAssetNoEmpty(false);
                                              setIsFormFiled(true);
                                            }}
                                            disabled={statusKey === "CLO"}
                                          />,
                                        ]}
                                      />
                                    </div>
                               
                              </Stack>
                              <Stack spacing={1} sx={{ pb: 1.5 ,height: '100%'}}>
                                <Typography
                                  variant="subtitle2"
                                  className={findCustomizerequiredLabel(
                                    "wko_det_work_type"
                                  )}
                                >
                                  {findCustomizeLabelDet("wko_det_work_type") ||
                                    "Work Type"}
                                </Typography>
                                <Autocomplete
                                  options={Work_Type}
                                  value={selected_Work_Type?.label ?? ""}
                                  onChange={(event, value) => {
                                    // handleWorkTypeChange();
                                    setSelected_Work_Type(value);
                                    setErrorField(null);
                                    setIsFormFiled(true);
                                  }}
                                 disabled={statusKey === "CLO"}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      placeholder="Select..."
                                      variant="outlined"
                                      fullWidth // Make it full-width
                                      className={
                                        errorField === "wko_det_work_type"
                                          ? "erroBorderadd"
                                          : "Extrasize"
                                      }
                                      ref={autocompleteRef}
                                    />
                                  )}
                                />
                              </Stack>
                                <Stack spacing={1} sx={{ pb: 1.5 ,height: '100%'}} className="dateIconCss">
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("wko_mst_org_date") ||
                                      "Origination Date"}
                                  </Typography>

                                  <AntDatePicker
                                        value={OriginationDate ? dayjs(OriginationDate) : null}
                                        format="DD/MM/YYYY HH:mm" 
                                        placeholder="DD/MM/YYYY HH:mm"
                                        showTime 
                                        disabled={statusKey === "CLO"}
                                        onChange={handleOriginationDateChange}
                                        allowClear={false}
                                       
                                      />
                                </Stack>
                                <Stack spacing={1} sx={{ pb: 1.5 ,height: '100%'}}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel(
                                      "wko_mst_due_date"
                                    ) || "Due Date"}
                                  </Typography>

                                    <Stack direction="row" alignItems="center" spacing={1} className="dateIconCss">

                                    <AntDatePicker
                                        value={DueDate ? dayjs(DueDate) : null}
                                        format="DD/MM/YYYY HH:mm" 
                                        placeholder="DD/MM/YYYY HH:mm"
                                        showTime 
                                        disabled={statusKey === "CLO"}
                                        onChange={(newDate) => {
                                          if (newDate && newDate.isValid()) {
                                            const nativeDate = newDate.toDate();
                                            setDueDate(nativeDate);
                                          } else {
                                            setDueDate(null);
                                          }
                                         // setErrorField(null);
                                          setIsFormFiled(true);
                                        }}
                                        allowClear={false}
                                      />
                                    {formatDate(DueDate)}
                                     
                                  </Stack>
                                </Stack>
                                  </Box>
                                  </Grid>
                                </Grid>
                            </Box>

                           
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
                                {/* ************************************* img web ******************************************* */}

                                <div>
                                  <div>
                                    <div className="row ImgShowMobile">
                                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <label htmlFor="upload-button">
                                          {getDbImg && getDbImg.length > 0 ? (
                                            <>
                                            <div className="dbImgGet">
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
                                                                className="imgCurPont 3"
                                                                 width="150"
                                                                 height="auto"
                                                                alt="Base64 Image"
                                                                onClick={openSaveImg}
                                                                disabled={statusKey === "CLO"}
                                                              />
                                                              )}
                                                            
                                                              {/* Delete Button */}
                                                              <div className="col btnCenter">
                                                              <button
                                                                type="button"
                                                                className="btn dlt"
                                                                disabled={statusKey === "CLO"}
                                                              //  onClick={() => handleDeleteImgApi(getDbImg[0].RowID)}
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

                                            </div>
                                            
                                          </>
                                          ) : image?.preview ? (
                                                <div>
                                                {/* If the file is an image, show the image preview */}
                                                {image.raw?.type?.startsWith("image/") ? (
                                                  <img
                                                    src={image.preview}
                                                    alt="preview"
                                                    className="imgCurPont"
                                                    onClick={openSaveImg}
                                                    disabled={statusKey === "CLO"}
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
                                                    disabled={statusKey === "CLO"}
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
                                                  disabled={statusKey === "CLO"}
                                                  width="126"
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
                                        <div className="ExtraWorkBtn">
                                        {workRequestNo && (
                                            <Button 
                                              className="webImgDownBtn" 
                                              style={{ marginTop: "10px" }}  
                                              onClick={wrkReqinfopopup}
                                            >
                                              <Iconify
                                                icon="ic:baseline-info"
                                                style={{
                                                  marginRight: "5px",
                                                  color: "rgb(67 160 71)",
                                                }}
                                              />
                                              {workRequestNo}
                                            </Button>
                                          )}

                                      {prmRequestNo && (
                                        <Button className="webImgDownBtn">
                                         <Iconify
                                            icon="ic:baseline-info"
                                            style={{
                                              marginRight: "5px",
                                              color: "rgb(67 160 71)",
                                            }}
                                            /> {prmRequestNo}
                                         </Button>
                                      )}
                                      </div>
                                         
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
                                            //color: (theme) => theme.palette.grey[500],
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
                                                src={
                                                  getDbImg[0].attachment
                                                    ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}`
                                                    : ""
                                                }
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
                     
                    </Box>
                    
                    </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
              <Box
                role="tabpanel"
                hidden={Tabvalue !== 1}
              
              >
                <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass" sx={{ padding:"0px" }} >
                    <Card sx={{ p: 3 }} >
                  
                    <Grid container spacing={2} className="InnerDiv" >
                        <Grid item xs={12} md={6} spacing={2} >
                          <Stack spacing={1} sx={{ pb: 1 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_corr_action") ||
                                "Corrective Actions"}
                            </Typography>
                            <TextareaAutosize
                              aria-label="empty textarea"
                             disabled={statusKey === "CLO"}
                              value={CorrectiveAction}
                              minRows={7}
                              className="TxtAra"
                              
                              style={{ width: "100%",resize: 'none' }} // Make it full-width
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 2000) {
                                  setCorrectiveAction(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                
                              }}
                            />
                          </Stack>
                          
                          <Stack spacing={1}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_note1") ||
                                "Note1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFNote1}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 1000) {
                                  setUDFNote1(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_cause_code") ||
                                "Cause Code"}
                            </Typography>
                            <Autocomplete
                              options={Cause_Code}
                              value={selected_Cause_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Cause_Code(value);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_cause_code" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_act_code") ||
                                "Action Code"}
                            </Typography>
                            <Autocomplete
                              options={Action_Code}
                              value={selected_Action_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Action_Code(value);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_act_code" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_delay_cd") ||
                                "Delay Code"}
                            </Typography>
                            <Autocomplete
                              options={Delay_Code}
                              value={selected_Delay_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Delay_Code(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_delay_cd" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                        </Grid>
                      </Grid>
                    </Card>
                    </Grid>
                </Grid>

                <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                  <Card>
                    <div style={{ display: "flex" }}>
                       
                       <button
                         className="ToggleBttnIcon"
                         onClick={toggleDivAssetAdditionalWorkInfo}
                       >
                         <Iconify
                            icon="eos-icons:workload"
                           style={{ marginRight: "2px", width: "20px" }}
                         />
                         Additional Work Information
                         {isOpenAdditionalWorkInfo ? (
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
                     {isOpenAdditionalWorkInfo && (
                    <Grid container spacing={2} className="InnerDiv_two" >
                        <Grid item xs={12} md={6} spacing={2} >
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_supv_id"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_supv_id") ||
                                "Supervisor ID"}
                            </Typography>
                            <Autocomplete
                              options={Supervisor_ID}
                              value={selected_Supervisor_ID?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Supervisor_ID(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickSupervisorId}
                                  variant="outlined"
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_supv_id" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_planner"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_planner") ||
                                "Planner"}
                            </Typography>
                            <Autocomplete
                              options={Planner}
                              value={selected_Planner?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Planner(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickPlanner}
                                  variant="outlined"
                                  fullWidth
                                  className={
                                    errorField === "wko_det_planner"
                                      ? "erroBorderadd"
                                      : "Extrasize"
                                  }
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_approver"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_approver") ||
                                "Approver"}
                            </Typography>
                            <Autocomplete
                              options={Approver}
                              value={selected_Approver?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Approver(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  onClick={handleClickApprover}
                                  variant="outlined"
                                  fullWidth
                                  className={
                                    errorField === "wko_det_approver"
                                      ? "erroBorderadd"
                                      : "Extrasize"
                                  }
                                />
                              )}
                            />
                          </Stack>
                          
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_sched_date"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_sched_date") ||
                                "Schedule Date"}
                            </Typography>

                              <AntDatePicker
                                value={DueDate ? dayjs(DueDate) : null}
                                format="DD/MM/YYYY HH:mm" // Include time in the format
                                placeholder="DD/MM/YYYY HH:mm"
                                showTime // Enables time picker
                                disabled={statusKey === "CLO"}
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate(); // Convert to native JS Date object
                                    setScheduleDate(nativeDate);
                                  } else {
                                    setScheduleDate(null);
                                  }
                                  setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                                allowClear={false}
                                className={errorField === "wko_det_sched_date" ? "erroBorderadd" : "Extrasize"}
                              />

                          </Stack>
                       
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography
                              variant="subtitle2"
                              className={findCustomizerequiredLabel(
                                "wko_det_exc_date"
                              )}
                            >
                              {findCustomizeLabelDet("wko_det_exc_date") ||
                                "Exception Date"}
                            </Typography>
                            <AntDatePicker
                                value={ExceptionDate ? dayjs(ExceptionDate) : null}
                                format="DD/MM/YYYY HH:mm" // Include time in the format
                                placeholder="DD/MM/YYYY HH:mm"
                                showTime // Enables time picker
                                disabled={statusKey === "CLO"}
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate(); // Convert to native JS Date object
                                    setExceptionDate(nativeDate);
                                  } else {
                                    setExceptionDate(null);
                                  }
                                  setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                                allowClear={false}
                                className={errorField === "wko_det_exc_date" ? "erroBorderadd" : "Extrasize"}
                              />
                            
                          </Stack>
                          <Stack
                            spacing={1}
                            sx={{
                              display: "flex",
                              flexDirection: "row", // Set the flex direction to row
                              alignItems: "center", // Center items vertically
                              justifyContent: "space-between", // Create space between items
                            }}
                          >
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_temp_asset") ||
                                "Temporary Asset"}
                            </Typography>
                           
                            <div className="customlayoutchk">
                              <FormControlLabel
                                control={<Checkbox color="primary" />}
                                checked={Temporary_Asset === "1"}
                               disabled={statusKey === "CLO"}
                               
                                onChange={(event) => {
                                  const isChecked = event.target.checked; 
                                  setTemporary_Asset(isChecked ? "1" : "0"); 
                                  setCheckBox_Temporary_Asset(isChecked ? "1" : "0");
                                  setIsFormFiled(true); 
                                }}
                                labelPlacement="start" // Place the label on the left
                              />
                            </div>
                          </Stack>
                          <Stack
                            spacing={1}
                            sx={{
                              display: "flex",
                              flexDirection: "row", // Set the flex direction to row
                              alignItems: "center", // Center items vertically
                              justifyContent: "space-between", // Create space between items
                            }}
                          >
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_approved") ||
                                "Approved"}
                            </Typography>
                            <div className="customlayoutchk">
                              <FormControlLabel
                                control={<Checkbox color="primary" />}
                                checked={Approved === "1"}
                               disabled={statusKey === "CLO"}
                                onChange={(event) => {
                                  //handleOnChangeApproved(value);
                                  const isChecked = event.target.checked; 
                                  setApproved(isChecked ? "1" : "0"); 
                                  setCheckBox_Approved(isChecked ? "1" : "0");
                                  setIsFormFiled(true); 
                                  
                                }}
                                
                                labelPlacement="start" // Place the label on the left
                              />
                            </div>
                          </Stack>
                          <Stack
                            spacing={1}
                            sx={{
                              display: "flex",
                              flexDirection: "row", // Set the flex direction to row
                              alignItems: "center", // Center items vertically
                              justifyContent: "space-between", // Create space between items
                            }}
                          >
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_safety") || "Safety"}
                            </Typography>
                            <div className="customlayoutchk">
                              <FormControlLabel
                                control={<Checkbox color="primary" />}
                                checked={Safety === "1"}
                               disabled={statusKey === "CLO"}
                                // onChange={(value) => {
                                //   handleOnChangeSafety(value);
                                //   setIsFormFiled(true);
                                // }} setSafety setCheckBox_Safety("1");
                                onChange={(event) => {
                                  //handleOnChangeApproved(value);
                                  const isChecked = event.target.checked; 
                                  setSafety(isChecked ? "1" : "0"); 
                                  setCheckBox_Safety(isChecked ? "1" : "0");
                                  setIsFormFiled(true); 
                                  
                                }}
                                labelPlacement="start" // Place the label on the left
                              />
                            </div>
                          </Stack>
                        </Grid>
                      </Grid>
                     )}
                    </Card>
                    </Grid>
                </Grid>
                {/* Account Information */}
                <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                    <Card >
                      <div style={{ display: "flex" }}>
                        
                        <button
                          className="ToggleBttnIcon"
                          onClick={toggleDivAssetAccountInfo}
                        >
                          <Iconify
                              icon="mdi:account-balance-wallet-outline"
                            style={{ marginRight: "2px", width: "20px" }}
                          />
                          Account Information
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
                      {isOpenAccountInfo && (
                        <Grid container spacing={2} className="InnerDiv_two">
                        
                        <Grid item xs={12} md={4}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_customer_cd") ||
                                "Customer Code"}
                            </Typography>
                            <Autocomplete
                              options={Customer_Code}
                              value={selected_Customer_Code?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Customer_Code(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  onClick={handleClickCustomerCode}
                                  variant="outlined"
                                  placeholder="Select..."
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_customer_cd" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet(
                                "wko_det_crd_costcenter"
                              ) || "Credit Cost Center"}
                            </Typography>
                            <Autocomplete
                              options={Credit_Cost_Center}
                              value={selected_Credit_Cost_Center?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Credit_Cost_Center(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select..."
                                  onClick={handleClickCostCenter}
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_crd_costcenter" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                          </Grid>
                         
                          <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_laccount") ||
                                "Labor Account"}
                            </Typography>
                            <Autocomplete
                              options={Labor_Account}
                              value={selected_Labor_Account?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Labor_Account(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select..."
                                  variant="outlined"
                                  onClick={handleClickLaborAccount}
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_laccount" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_caccount") ||
                                "Contract Account"}
                            </Typography>
                            <Autocomplete
                              options={Contract_Account}
                              value={selected_Contract_Account?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Contract_Account(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select..."
                                  onClick={handleClickContractAccount}
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_caccount" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                          </Grid>
                          <Grid item xs={12} md={4}>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_maccount") ||
                                "Material Account"}
                            </Typography>
                            <Autocomplete
                              options={Material_Account}
                              value={selected_Material_Account?.label ?? ""}
                              onChange={(event, value) => {
                                setSelected_Material_Account(value || null);
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select..."
                                  onClick={handleClickMaterialAccount}
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_maccount" ? "erroBorderadd" : "Extrasize"}
                                />
                              )}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_saccount") ||
                                "Miscellaneous Account"}
                            </Typography>
                            <Autocomplete
                              options={Miscellaneous_Account}
                              value={
                                selected_Miscellaneous_Account?.label ?? ""
                              }
                              onChange={(event, value) => {
                                setSelected_Miscellaneous_Account(
                                  value || null
                                );
                                setIsFormFiled(true);
                              }}
                             disabled={statusKey === "CLO"}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select..."
                                  onClick={handleClickMiscellaneousAccount}
                                  fullWidth // Make it full-width
                                  className={errorField === "wko_det_saccount" ? "erroBorderadd" : "Extrasize"}
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
             {/* User Defined Field */}
             <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass DetailsWorkCard" sx={{ padding:"0px" }} >
                    <Card >
                      <div style={{ display: "flex" }}>
                        
                        <button
                          className="ToggleBttnIcon"
                          onClick={toggleDivAssetUDFInfo}
                        >
                          <Iconify
                              icon="solar:calendar-broken"
                            style={{ marginRight: "2px", width: "20px" }}
                          />
                          User Defined Field
                          {isOpenUDFInfo ? (
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

                      {isOpenUDFInfo && (
                    <Grid container spacing={2} className="InnerDiv_two">
                      <Grid item xs={12} md={4}>
                      <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar1") ||
                                "Varchar1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_1}
                              autoComplete="off"
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_1(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar2") ||
                                "Varchar2"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_2}
                              autoComplete="off"
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_2(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar3") ||
                                "Varchar3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              defaultValue={UDFText_3}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_3(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar4") ||
                                "Varchar4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              defaultValue={UDFText_4}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_4(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar5") ||
                                "Varchar5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              defaultValue={UDFText_5}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_5(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar6") ||
                                "Varchar6"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              defaultValue={UDFText_6}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_6(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar7") ||
                                "Varchar7"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              defaultValue={UDFText_7}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_7(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar8") ||
                                "Varchar8"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              size="small"
                              variant="outlined"
                              fullWidth
                              autoComplete="off"
                              defaultValue={UDFText_8}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_8(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar9") ||
                                "Varchar9"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              defaultValue={UDFText_9}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_9(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_varchar10") ||
                                "Varchar10"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              defaultValue={UDFText_10}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_10(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                            />
                          </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                      <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric1") ||
                                "Numeric1"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              placeholder=".0000"
                              fullWidth
                              autoComplete="off"
                              value={UDFNumber_1}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_1);
                                }
                               
                                setErrorField(null); 
                                setIsFormFiled(true);
                                
                              }}
                             
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric2") ||
                                "Numeric2"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                               placeholder=".0000"
                              fullWidth
                              autoComplete="off"
                              value={UDFNumber_2}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_2);
                                }
                               
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric3") ||
                                "Numeric3"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                               placeholder=".0000"
                              fullWidth
                              autoComplete="off"
                              value={UDFNumber_3}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_3);
                                }
                                
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric4") ||
                                "Numeric4"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                               placeholder=".0000"
                              fullWidth
                              autoComplete="off"
                              value={UDFNumber_4}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_4);
                                }
                                
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_numeric5") ||
                                "Numeric5"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                               placeholder=".0000"
                              fullWidth
                              autoComplete="off"
                              value={UDFNumber_5}
                             disabled={statusKey === "CLO"}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_5);
                                }
                               
                                setErrorField(null); 
                                setIsFormFiled(true);
                                setIsFormFiled(true);
                              }}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                      <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabelDet("wko_det_datetime1") ||
                                "Date1"}
                            </Typography>
                             <AntDatePicker
                                value={UDFDate_1 ? dayjs(UDFDate_1) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                disabled={statusKey === "CLO"}
                                allowClear={false}
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate(); 
                                    setUDFDate_1(nativeDate);
                                  } else {
                                    setUDFDate_1(null);
                                  }
                                  setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                              />
                            
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_datetime2") ||
                                "Date2"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_2 ? dayjs(UDFDate_2) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                disabled={statusKey === "CLO"}
                                allowClear={false}
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate(); 
                                    setUDFDate_2(nativeDate);
                                  } else {
                                    setUDFDate_2(null);
                                  }
                                  setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              
                              />
                            
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_datetime3") ||
                                "Date3"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_3 ? dayjs(UDFDate_3) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                disabled={statusKey === "CLO"}
                                allowClear={false}
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate(); 
                                    setUDFDate_3(nativeDate);
                                  } else {
                                    setUDFDate_3(null);
                                  }
                                  setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              />
                          
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_datetime4") ||
                                "Date4"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_4 ? dayjs(UDFDate_4) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                disabled={statusKey === "CLO"}
                                allowClear={false}
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate(); 
                                    setUDFDate_4(nativeDate);
                                  } else {
                                    setUDFDate_4(null);
                                  }
                                  setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              />
                          
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2">
                              {findCustomizeLabel("wko_det_datetime5") ||
                                "Date5"}
                            </Typography>
                            <AntDatePicker
                                value={UDFDate_5 ? dayjs(UDFDate_5) : null}
                                format="DD/MM/YYYY" 
                                placeholder="DD/MM/YYYY"
                                disabled={statusKey === "CLO"}
                                allowClear={false}
                                onChange={(newDate) => {
                                  if (newDate && newDate.isValid()) {
                                    const nativeDate = newDate.toDate(); 
                                    setUDFDate_5(nativeDate);
                                  } else {
                                    setUDFDate_5(null);
                                  }
                                  setErrorField(null);
                                  setIsFormFiled(true);
                                }}
                              />
                         
                          </Stack>
                        </Grid>
                    </Grid>
                      )}
                    </Card>
                  </Grid>
              </Grid>
              </Box>
              <Box
                role="tabpanel"
                hidden={Tabvalue !== 2}
              >

                <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding:"0px" }} >
                    <Card sx={{ p: 3 }} >
                    <Grid className="InnerDiv" style={{marginTop:"16px"}} >
                    {/* {(RowID || completeRowID || closeRowID) && (
                        <WorkOrderTimeCard
                          data={{
                            RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                            WorkOrderNo: WorkOrderNo,
                            Asset_No: Asset_No,
                            statusKey:statusKey,
                          }}
                          onDataFromSecondComponent={
                            handleDataFromSecondComponent
                          }
                        />
                      )} */}
                          { RowID || completeRowID || closeRowID ? (
                            <WorkOrderTimeCard
                              data={{
                                RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                                formStatus: "EDIT", 
                                WorkOrderNo: WorkOrderNo,
                                Asset_No: Asset_No,
                                statusKey:statusKey,
                              }}
                              onDataFromSecondComponent={
                                handleDataFromSecondComponent
                              }
                            />
                          ) :  !RowID || !completeRowID || !closeRowID ? (
                            <WorkOrderTimeCard
                              data={{
                                formStatus: "NEW", 
                                statusKey:statusKey,
                              }}
                              
                              onRowClick={handleWorkOrderSubModule}
                            />
                          ) : null} 
                      </Grid>
                    </Card>
                  </Grid>
                  </Grid>  
                
              </Box>
              
              <Box
                role="tabpanel"
                hidden={Tabvalue !== 3}
              >
                <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding: "0px" }}>
                    <Card sx={{ p: 3 }}>
                      {/* Nested Tabs */}
                     
                     
                         
                      <Tabs value={NestedTabValue} onChange={handleNestedTabChange} aria-label="Nested Tabs">
                      <Tab
                          icon={
                            
                            <img src={materialImg} style={{ width: "25px", height: "25px", marginRight: "5px" }} />
                           
                          }
                          label="Material"
                          iconPosition="start" // Moves icon below the label
                        />
                        <Tab 
                        icon={
                          <img src={specialOrderImg} style={{ width: "22px", height: "22px", marginRight: "5px" }} />
                        }
                        label="Special Order" 
                        iconPosition="start"
                        />
                        <Tab 
                        icon={
                          <img src={outsourecImg} style={{ width: "22px", height: "22px", marginRight: "5px" }} />
                        }
                        label="Outsource Contract (PR)" 
                        iconPosition="start"
                        />
                        <Tab 
                        icon={
                          <img src={miscImg} style={{ width: "22px", height: "22px", marginRight: "5px" }} />
                        }
                        label="Misc"
                        iconPosition="start" />
                      </Tabs>

                     
                      <Box role="tabpanel" hidden={NestedTabValue !== 0}>
                        <Grid className="InnerDiv" style={{ marginTop: "16px" }}>
                             
                               { RowID || completeRowID || closeRowID ? (
                                  <WorkOrderMaterial
                                    data={{
                                      RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                                      formStatus: "EDIT", 
                                      WorkOrderNo: WorkOrderNo,
                                      Asset_No: Asset_No,
                                      statusKey:statusKey,
                                    }}
                                    onDataFromSecondComponent={
                                      handleDataFromSecondComponent
                                    }
                                  />
                                ) :  !RowID || !completeRowID || !closeRowID ? (
                                  <WorkOrderMaterial
                                    data={{
                                      formStatus: "NEW", 
                                      statusKey:statusKey,
                                    }}
                                    
                                    onRowClick={handleWorkOrderSubModule}
                                  />
                                ) : null} 
                                <br />
                          </Grid>
                      </Box>

                      <Box role="tabpanel" hidden={NestedTabValue !== 1}>
                        <Grid className="InnerDiv" style={{ marginTop: "16px" }}>
                         <div className="card">
                            <div>

                             { RowID || completeRowID || closeRowID ? (
                                  <WorkorderSpecial
                                    data={{
                                      RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                                      formStatus: "EDIT", 
                                      WorkOrderNo: WorkOrderNo,
                                      Asset_No: Asset_No,
                                      statusKey:statusKey,
                                    }}
                                    onDataFromSecondComponent={
                                      handleDataFromSecondComponent
                                    }
                                  />
                                ) :  !RowID || !completeRowID || !closeRowID ? (
                                  <WorkorderSpecial
                                    data={{
                                      formStatus: "NEW", 
                                      statusKey:statusKey,
                                    }}
                                    
                                    onRowClick={handleWorkOrderSubModule}
                                  />
                                ) : null} 
                               
                            </div>
                          </div>
                        </Grid>
                      </Box>
                      <Box role="tabpanel" hidden={NestedTabValue !== 2}>
                        <Grid className="InnerDiv" style={{ marginTop: "16px" }}>
                        <div className="card">
                          <div>
                             { RowID || completeRowID || closeRowID ? (
                                  <WorkOrderOutsource
                                    data={{
                                      RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                                      formStatus: "EDIT", 
                                      WorkOrderNo: WorkOrderNo,
                                      Asset_No: Asset_No,
                                      statusKey:statusKey,
                                    }}
                                    onDataFromSecondComponent={
                                      handleDataFromSecondComponent
                                    }
                                  />
                                ) :  !RowID || !completeRowID || !closeRowID ? (
                                  <WorkOrderOutsource
                                    data={{
                                      formStatus: "NEW", 
                                      statusKey:statusKey,
                                    }}
                                    
                                    onRowClick={handleWorkOrderSubModule}
                                  />
                                ) : null} 
                          </div>
                        </div>
                        </Grid>
                      </Box>
                      <Box role="tabpanel" hidden={NestedTabValue !== 3}>
                        <Grid className="InnerDiv" style={{ marginTop: "16px" }}>
                        <div className="card">
                          <div
                          >
                            
                             { RowID || completeRowID || closeRowID ? (
                                  <WorkOrderMisc
                                    data={{
                                      RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                                      formStatus: "EDIT", 
                                      WorkOrderNo: WorkOrderNo,
                                      Asset_No: Asset_No,
                                      statusKey:statusKey,
                                    }}
                                    onDataFromSecondComponent={
                                      handleDataFromSecondComponent
                                    }
                                  />
                                ) :  !RowID || !completeRowID || !closeRowID ? (
                                  <WorkOrderMisc
                                    data={{
                                      formStatus: "NEW",
                                      statusKey:statusKey, 
                                    }}
                                    
                                    onRowClick={handleWorkOrderSubModule}
                                  />
                                ) : null} 
                          </div>
                        </div>
                        </Grid>
                      </Box>
                      
                     
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              
              <Box
                  role="tabpanel"
                  hidden={Tabvalue !== 4}
                >
               <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding:"0px" }} >
                    <Card sx={{ p: 3 }} >
                    <Grid className="InnerDiv" style={{marginTop:"16px"}} >
                   

                          { RowID || completeRowID || closeRowID ? (
                            <WorkOrderCheckList
                              data={{
                                RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                                formStatus: "EDIT", 
                                WorkOrderNo: WorkOrderNo,
                                Asset_No: Asset_No,
                                statusKey:statusKey,
                              }}
                              onRowClick={handleCheckListData}
                             
                            />
                          ) :  !RowID || !completeRowID || !closeRowID ? (
                            <WorkOrderCheckList
                              data={{
                                formStatus: "NEW", 
                                statusKey:statusKey,
                              }}
                              
                              onRowClick={handleWorkOrderSubModule}
                            />
                          ) : null} 
                     
                      </Grid>
                    </Card>
                  </Grid>
                  </Grid>  
                  
                </Box>
                <Box
                  role="tabpanel"
                  hidden={Tabvalue !== 5}

                >
                <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding:"0px" }} >
                    <Card sx={{ p: 3 }} >
                    <Grid className="InnerDiv" style={{marginTop:"16px"}} >
                    

                        { RowID || completeRowID || closeRowID ? (
                            <WorkOrderDownTime
                              data={{
                                RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                                formStatus: "EDIT", 
                                WorkOrderNo: WorkOrderNo,
                                Asset_No: Asset_No,
                                statusKey:statusKey,
                                OrigiDate:OriginationDate,
                              }}
                              onDataFromSecondComponent={
                                handleDataFromSecondComponent
                              }
                            />
                          ) :  !RowID || !completeRowID || !closeRowID ? (
                            <WorkOrderDownTime
                              data={{
                                formStatus: "NEW", 
                                statusKey:statusKey,
                              }}
                              
                              onRowClick={handleWorkOrderSubModule}
                            />
                          ) : null} 
                      </Grid>
                    </Card>
                  </Grid>
                </Grid>  
                  
                </Box>
                <Box
                  role="tabpanel"
                  hidden={Tabvalue !== 6}
                >
                  <Grid container>
                  <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding:"0px" }} >
                    <Card sx={{ p: 3 }} >
                    <Grid className="InnerDiv" style={{marginTop:"16px"}} >
                    
                  
                          { RowID || completeRowID || closeRowID ? (
                            <WorkOrderComments
                              data={{
                                RowID: RowID ? RowID : completeRowID ? completeRowID : closeRowID,
                                formStatus: "EDIT", 
                                WorkOrderNo: WorkOrderNo,
                                Asset_No: Asset_No,
                                statusKey:statusKey,
                               
                              }}
                              onDataFromSecondComponent={
                                handleDataFromSecondComponent
                              }
                            />
                          ) : null} 
                    </Grid>
                    </Card>
                    </Grid>
                    </Grid>
                    </Box>
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 7}
                     
                    >
                      <Grid container>
                        <Grid xs={12} md={12} className="mainDivClass otherTbs" sx={{ padding:"0px" }} >
                          <Card sx={{ p: 3 }} >
                            <Grid className="InnerDiv" style={{marginTop:"16px"}} >
                              <div>
                                <div
                                  style={{
                                    paddingBottom: "20px",
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
                                          <Button  type="submit"   className="SubmoduleAddNewButton" 
                                          onClick={() => {
                                            setIsFormFiled(true);
                                            handleButtonClick();
                                          }}
                                          disabled={statusKey === "CLO"}
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
                                  
                                    <tbody>
                                      {RefImg !== "" &&
                                        RefImg !== null &&
                                        RefImg.map((item, index) => (
                                          <tr key={index}>
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
                                              ): item.file_name.toLowerCase().endsWith(".docx") ? (
                                                <FontAwesomeIcon
                                                  icon={faFileWord} 
                                                  onClick={() => openDocxInNewTab(item.attachment)}
                                                  style={{ width: "35px", height: "35px", cursor:"pointer" }}
                                                  className="fntdocx"
                                                />
                                              ) : item.file_name.toLowerCase().endsWith(".php") ? (
                                                <FontAwesomeIcon
                                                  icon={faFileCode} 
                                                  onClick={() => openPhpInNewTab(item.attachment)}
                                                  style={{ width: "35px", height: "35px", cursor:"pointer" }}
                                                  className="fntphp"
                                                />
                                              ) : item.file_name.toLowerCase().endsWith(".log") ? (
                                                <FontAwesomeIcon
                                                  icon={faFileAlt}
                                                  onClick={() => openLogInNewTab(item.attachment)}
                                                  style={{ width: "35px", height: "35px", cursor:"pointer" }}
                                                  className="fntlog"
                                                />
                                              ) : item.file_name.toLowerCase().endsWith(".txt") ? (
                                                <FontAwesomeIcon
                                                  icon={faFileAlt}
                                                  onClick={() => openLogInNewTab(item.attachment)}
                                                  style={{ width: "35px", height: "35px", cursor:"pointer" }}
                                                  className="fntlog"
                                                />
                                              ) : item.file_name.toLowerCase().endsWith(".xlsx") ? (
                                                <FontAwesomeIcon
                                                  icon={faFileExcel} 
                                                  onClick={() => openXlsxInNewTab(item.attachment)}
                                                  style={{ width: "35px", height: "35px", cursor:"pointer" }}
                                                  className="fntxlsx"
                                                />
                                              ) : item.file_name.toLowerCase().endsWith(".xls") ? (
                                                <FontAwesomeIcon
                                                  icon={faFileExcel} 
                                                  onClick={() => openXlsxInNewTab(item.attachment)}
                                                  style={{ width: "35px", height: "35px", cursor:"pointer" }}
                                                  className="fntxlsx"
                                                />
                                              ) : (
                                                <img
                                                key={index}
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
                                                disabled={statusKey === "CLO"}
                                                className="btn multiplsimg"
                                              >
                                                <Iconify
                                                  icon="fluent:delete-48-filled"
                                                  style={{ fontSize: "24px" }}
                                                />
                                              </button>
                                            </td>
                                          </tr>
                                        ))}

                                      {selectedImages.map((image, index) =>
                                        image && index === undefined ? (
                                          <tr>
                                            <td>
                                              <img
                                                src={
                                                  RefImg[0].attachment
                                                    ? `${httpCommon.defaults.baseURL}${RefImg[0].attachment}`
                                                    : ""
                                                }
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
                                        ) : image.name.toLowerCase().endsWith(".xlsx") ? (
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
                                        ) : (
                                          <tr key={index}>
                                            <td>
                                              <img
                                                key={index}
                                                src={image.base64 || URL.createObjectURL(image)}
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
                                            //color: (theme) => theme.palette.grey[500],
                                          }}
                                        >
                                          <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                                        </IconButton>
                                        <DialogContent dividers>
                                          <Typography gutterBottom>
                                            
                                            <img
                                              // src={selectedImage}
                                              src={
                                                selectedImage
                                                  ? `${httpCommon.defaults.baseURL}${selectedImage}`
                                                  : ""
                                              }
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
                                           // color: (theme) => theme.palette.grey[500],
                                          }}
                                        >
                                         <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                                        </IconButton>
                                        <DialogContent dividers>
                                          <Typography gutterBottom>
                                            <img
                                              style={{ height: "100%", width: "100%" }}
                                              src={handalImg}
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
                                          
                                        </div>
                                      </form>
                                </div>
                              </div>
                            
                            </Grid>
                          </Card>
                        </Grid>
                      </Grid>

                     
                    </Box>

              {/* Asset Work */}
              {Tabvalue === 0 &&  (
                <>
              <div
                className="MainOrderFromGdForm"
                style={{ backgroundColor: "white",marginTop:"10px"}}
              >
                <Grid container spacing={0}>
                  <Grid xs={12} md={12}>
                    <Card sx={{ padding: "10px 24px 10px 24px" }}>
                   
                      <div style={{ display: "flex" }}>
                       
                        <button
                          className="ToggleBttnIcon"
                          onClick={toggleDivAsset}
                        >
                          <Iconify
                            icon="carbon:user-settings"
                            style={{ marginRight: "2px", width: "20px" }}
                          />{" "}
                          Asset & Work Assign
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
                       
                        <Box
                          rowGap={2}
                          columnGap={2}
                          display="grid"
                        
                        >
                            <Box>
                              <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                  <Stack spacing={1} sx={{pb:1.5}}>
                                    <Typography
                                      variant="subtitle2"
                                      className="Requiredlabel"
                                    >
                                      {findCustomizeLabel("wko_mst_assetno") ||
                                        "Asset No"}
                                    </Typography>
                                    <div ref={assetNoAutocompleteRef} className="hoverContainerIconBtn">
                                      <CustomTextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        size="small"
                                        className={`ExtrasizeDisable ${
                                          isWorkOrderAssetNoEmpty ? "errorEmpty" : ""
                                        }`}
                                      
                                        fullWidth
                                        
                                        value={Asset_No || ""}
                                        disabled={statusKey === "CLO"}
                                    
                                        placeholder="Select..."
                                        autoComplete="off"
                                        rightIcons={[
                                          <Iconify
                                            icon="material-symbols:close"
                                          // onClick={handleCancelClick}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleCancelClick();
                                              setisWorkOrderAssetNoEmpty(false);
                                              setIsFormFiled(true);
                                            }}
                                            disabled={statusKey === "CLO"}
                                             className="hoverIconBtn"
                                            
                                          />,
                                          <Iconify
                                            icon="tabler:edit"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleEditClick();
                                              setisWorkOrderAssetNoEmpty(false);
                                              setIsFormFiled(true);
                                            }}
                                            disabled={statusKey === "CLO"}
                                          />,
                                        ]}
                                      />
                                    </div>
                                  </Stack>
                                  <Stack spacing={1} sx={{pb:1.5}}>
                                    <Typography variant="subtitle2">
                                      {findCustomizeLabel("wko_mst_work_area") ||
                                        "Work Area"}
                                    </Typography>
                                    <Autocomplete
                                      options={Work_Area}
                                  
                                      value={selected_Work_Area?.label ?? ""}
                                      onChange={(event, value) => {
                                        setSelected_Work_Area(value || null);
                                        setIsFormFiled(true);
                                      }}
                                    disabled={statusKey === "CLO"}
                                      renderInput={(params) => (
                                        <div>
                                          <TextField
                                            {...params}
                                            size="small"
                                            placeholder="Select..."
                                            variant="outlined"
                                            className="Extrasize"
                                          />
                                        </div>
                                      )}
                                    />
                                  </Stack>
                                  <Stack spacing={1} sx={{pb:1.5}}>
                                    <Typography variant="subtitle2">
                                      {findCustomizeLabel("wko_mst_asset_level") ||
                                        "Asset Level"}
                                    </Typography>
                                    <Autocomplete
                                      options={Asset_Level}
                                      value={selected_Asset_Level?.label ?? ""}
                                      onChange={(event, value) => {
                                        setSelected_Asset_Level(value || null);
                                        setIsFormFiled(true);
                                      }}
                                    disabled={statusKey === "CLO"}
                                      renderInput={(params) => (
                                        <div>
                                          <TextField
                                            {...params}
                                            size="small"
                                            placeholder="Select..."
                                            variant="outlined"
                                             className="Extrasize"
                                          />
                                        </div>
                                      )}
                                    />
                                  </Stack>
                                  <Stack spacing={1} sx={{pb:1.5}}>
                                    <Typography variant="subtitle2">
                                      {findCustomizeLabel("wko_mst_asset_location") ||
                                        "Asset Location"}
                                    </Typography>
                                    <Autocomplete
                                      options={Asset_Location}
                                    
                                      value={selected_Asset_Location?.label ?? ""}
                                      onChange={(event, value) => {
                                        setSelected_Asset_Location(value || null);
                                        setIsFormFiled(true);
                                      }}
                                    disabled={statusKey === "CLO"}
                                      renderInput={(params) => (
                                        <div>
                                          <TextField
                                            {...params}
                                            size="small"
                                            placeholder="Select..."
                                            variant="outlined"
                                            className="Extrasize"
                                          />
                                        </div>
                                      )}
                                    />
                                  </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                      <Stack spacing={1} sx={{pb:1.5}}>
                                        <Typography
                                          variant="subtitle2"
                                          className="Requiredlabel"
                                        >
                                          {findCustomizeLabel("wko_mst_chg_costcenter") ||
                                            "Charge Cost Center"}
                                        </Typography>
                                        <Autocomplete
                                          options={Charge_Cost_Center}
                                          
                                          value={selected_Charge_Cost_Center?.label ?? ""}
                                          onChange={handleChargeCostChange}
                                        disabled={statusKey === "CLO"}
                                          renderInput={(params) => (
                                            <div>
                                              <TextField
                                                {...params}
                                                size="small"
                                                placeholder="Select..."
                                                variant="outlined"
                                                className={`Extrasize ${
                                                  isChargeCostEmpty ? "errorEmpty" : ""
                                                }`}
                                                ref={autocompleteRef}
                                              />
                                            </div>
                                          )}
                                        />
                                      </Stack>
                                      <Stack spacing={1} sx={{pb:1.5}}>
                                        <Typography
                                          variant="subtitle2"
                                          className={findCustomizerequiredLabel(
                                            "wko_mst_asset_group_code"
                                          )}
                                        >
                                          {findCustomizeLabel("wko_mst_asset_group_code") ||
                                            "Asset Group Code"}
                                        </Typography>
                                        <Autocomplete
                                          options={Asset_Group_Code}
                                          value={selected_Asset_Group_Code?.label ?? ""}
                                          onChange={(event, value) => {
                                            setSelected_Asset_Group_Code(value || null);
                                            setIsFormFiled(true);
                                          }}
                                        disabled={statusKey === "CLO"}
                                          
                                          renderInput={(params) => (
                                            <div>
                                              <TextField
                                                {...params}
                                                size="small"
                                                placeholder="Select..."
                                                variant="outlined"
                                                className={
                                                  errorField === "wko_mst_asset_group_code"
                                                    ? "erroBorderadd"
                                                    : "Extrasize"
                                                }
                                                 
                                              />
                                            </div>
                                          )}
                                        />
                                      </Stack>
                                      <Stack spacing={1} sx={{pb:1.5}}>
                                        <Typography
                                          variant="subtitle2"
                                          className={findCustomizerequiredLabel(
                                            "wko_det_work_grp"
                                          )}
                                        >
                                          {findCustomizeLabelDet("wko_det_work_grp") ||
                                            "Work Group"}
                                        </Typography>
                        
                                        <Autocomplete
                                          options={Work_Group}
                                        
                                          value={selected_Work_Group?.label ?? ""}
                                          onChange={handleWorkGroupChange}
                                        disabled={statusKey === "CLO"}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              size="small"
                                              placeholder="Select..."
                                              onClick={handleClickSupervisorId}
                                              variant="outlined"
                                              fullWidth // Make it full-width
                                              className={
                                                errorField === "wko_det_work_grp"
                                                  ? "erroBorderadd"
                                                  : "Extrasize"
                                              }
                                              ref={autocompleteRef}
                                            />
                                          )}
                                        />
                                      </Stack>
                                        <Box
                                            display="flex"
                                            alignItems="center" // Align items in the center vertically
                                            justifyContent="space-between" // Space out items horizontally
                                            sx={{
                                            flexDirection: { xs: 'row', sm: 'row' }, // Ensure the row direction on all screen sizes
                                            columnGap: 1, // Add some gap between the elements
                                            width: "100%",
                                            }}
                                              >
                                              <Stack spacing={1} flex={1}>
                                              <Typography variant="subtitle2">
                                                {findCustomizeLabelDet("wko_det_assign_to") ||
                                                  "Assign To"}
                                              </Typography>
                                            
                                            <div ref={assetNoAutocompleteRef} className="hoverContainerIconBtn">
                                              <CustomTextField
                                                id="outlined-basic"
                                                variant="outlined"
                                                
                                                size="small"
                                                className="ExtrasizeDisable"
                                                fullWidth
                                              
                                                value={selected_Assign_To?.label ?? ""}
                                                disabled={statusKey === "CLO"}
                                                autoComplete="off"
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
                                                    disabled={statusKey === "CLO"}
                                                     className="hoverIconBtn"
                                                  />,
                                                  <Iconify
                                                    icon="tabler:edit"
                                                    onClick={(e) => {
                                                      handleEditClickAssign();
                                                        
                                                        setIsFormFiled(true);
                                                    }}
                                                    disabled={statusKey === "CLO"}
                                                  // className={Button_save === "Save" ? "disabledIcon" : ""}

                                                  />,
                                                ]}
                                              />
                                            </div>
                                            </Stack>
                                            <Tooltip
                                              title="Assign To"
                                              placement="top"
                                              className="tooltipRhtAssign"
                                              disabled={Button_save === "Save"}
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
                                    </Grid>
                              </Grid>
                            </Box>
                        </Box>
                          
                          )}
                     
                    </Card>
                  </Grid>
                </Grid>
              </div>
              </>
              )}
            
             {Tabvalue === 0 &&  (
                <>
              <div
                className="MainOrderFromGdForm"
                style={{ backgroundColor: "white" ,marginTop:"12px"}}
              >
                <Grid container spacing={0}>
                  <Grid xs={12} md={12}>
                  <Card sx={{ padding: "10px 24px 10px 24px" }}>
                  <div style={{ display: "flex" }}>
                       
                       <button
                         className="ToggleBttnIcon"
                         onClick={toggleDivAssetWorkInfo}
                       >
                         <Iconify
                           icon="eos-icons:workload"
                           style={{ marginRight: "2px", width: "20px" }}
                         />
                        Work Information
                         {isOpenWorkInfo ? (
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
                     {isOpenWorkInfo && (
                     <Box
                          rowGap={2}
                          columnGap={2}
                          display="grid"
                         
                        >
                         
                           <Box>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                <Stack spacing={1} sx={{pb:1.5}}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("wko_mst_originator") ||
                                      "Originator"}
                                  </Typography>
                                  <Autocomplete
                                    options={Originator}
                                    freeSolo
                                    value={selected_Originator?.label || inputValueOriginator || ""}
                                    onChange={(event, value) => {
                                      setSelected_Originator(value || null);
                                      setInputValueOriginator("");
                                      setIsFormFiled(true);
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                      setInputValueOriginator(newInputValue.toUpperCase()); 
                                      setIsFormFiled(true);
                                    }}
                                  disabled={statusKey === "CLO"}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          size="small"
                                          placeholder="Select..."
                                          variant="outlined"
                                          className="Extrasize"
                                          onClick={handleClickOriginator}
                                        />
                                      </div>
                                    )}
                                  />
                                </Stack>
                               
                                <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography
                                      variant="subtitle2"
                                      className={findCustomizerequiredLabel(
                                        "wko_det_work_class"
                                      )}
                                    >
                                      {findCustomizeLabelDet("wko_det_work_class") ||
                                        "Work Permit Type"}
                                    </Typography>
                                    <Autocomplete
                                      options={Work_Class}
                                      value={selected_Work_Class?.label ?? ""}
                                      onChange={(event, value) => {
                                        setSelected_Work_Class(value || null);
                                        setErrorField(null);
                                        setIsFormFiled(true);
                                      }}
                                    disabled={statusKey === "CLO"}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          placeholder="Select..."
                                          variant="outlined"
                                          fullWidth // Make it full-width
                                          className={
                                            errorField === "wko_det_work_class"
                                              ? "erroBorderadd"
                                              : "Extrasize"
                                          }
                                        />
                                      )}
                                    />
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography
                                      variant="subtitle2"
                                      className={findCustomizerequiredLabel(
                                        "wko_det_perm_id"
                                      )}
                                    >
                                      {findCustomizeLabelDet("wko_det_perm_id") ||
                                        "Permanent ID"}
                                    </Typography>
                                    <TextField
                                      id="outlined-basic"
                                      placeholder=""
                                      size="small"
                                      variant="outlined"
                                      value={Permanent_ID}
                                      onChange={(e) => {
                                  
                                        const value = e.target.value;
                                        if (value.length <= 50) {
                                          setPermanent_ID(e.target.value);
                                        }
                                        setErrorField(null); 
                                        setIsFormFiled(true);
                                      }}

                                    disabled={statusKey === "CLO"}
                                      fullWidth
                                      className={
                                        errorField === "wko_det_perm_id"
                                          ? "erroBorderadd"
                                          : ""
                                      }
                                    />
                                  </Stack>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2">
                                      {findCustomizeLabel("wko_mst_phone") ||
                                        "Phone"}
                                    </Typography>
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      className="Extrasize"
                                      value={Phone}
                                    disabled={statusKey === "CLO"}
                                      onChange={(e) => {
                                  
                                        const value = e.target.value;
                                        if (value.length <= 20) {
                                          setPhone(value);
                                        }
                                        setErrorField(null); 
                                        setIsFormFiled(true);
                                      }}
                                    />
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("wko_mst_project_id") ||
                                      "Project ID"}
                                  </Typography>
                                  <Autocomplete
                                    options={Project_ID}
                                    value={selected_Project_ID?.label ?? ""}
                                    onChange={(event, value) => {
                                      setSelected_Project_ID(value);
                                      setIsFormFiled(true);
                                    }}
                                  disabled={statusKey === "CLO"}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        className="Extrasize"
                                        placeholder="Select..."
                                        onClick={handleClickProjectID}
                                        variant="outlined"
                                        fullWidth // Make it full-width
                                      />
                                    )}
                                  />
                          </Stack>
                                </Grid>
                              </Grid>
                            </Box>
                          
                          </Box>
                     )}
                          
                       </Card>
                    </Grid>
                    </Grid>
                    </div>
                    </>
                    )}
                   
              {/* toggle view End */}

              {/* Asset model popup */}
              <BootstrapDialog
                //onClose={handleCloseModal}
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
                  Select Asset No
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
                    //color: (theme) => theme.palette.grey[500],
                  }}
                >
                   <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                </IconButton>
                <DialogContent dividers className="CallToAssetNoSubMdl">
                  <div className="TblSelect">
                    <WorkOrderAssetNo
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
                      {TotalAssetNo
                        ? // Content to render if condition3 is true
                          TotalAssetNo
                        : // Content to render if none of the conditions are true
                          0}
                      &nbsp;Asset
                    </span>
                  </div>

                  <div className="mlauto">
                    <Button variant="primary" className="SaveButton"sx={{color:"#fff"}} onClick={handleCloseModal}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
              {/* Asset model popup end*/}

              {/* Plan Priority model popup */}
              <BootstrapDialog
               // onClose={handleCloseModalPlan_Priority}
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseModalPlan_Priority(event, reason);
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={modalOpenplanPeriority}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Original Priority
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalPlan_Priority}
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
                <DialogContent dividers className="CallToAssetNoSubMdl">
                  <div className="TblSelect">
                    <OriginalPriorityModel
                      onRowClick={handleRowDataplanPriority}
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
                   
                    </span>
                  </div>
                
                  <div className="mlauto">
                    <Button variant="primary" className="SaveButton"sx={{color:"#fff"}} onClick={handleCloseModalPlan_PrioritySelect}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
              {/* Plan Priority model popup end*/}

              {/******************** Status Details ********************/}
              <div>
                <BootstrapDialog
        
                  onClose={(event, reason) => {
                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                      StatushandleClose(event, reason);
                    }
                  }}
                  aria-labelledby="customized-dialog-title"
                  open={StatusShow}
                  maxWidth="sm"
                  fullWidth
                  disableBackdropClick={true}
                  disableEscapeKeyDown={true}
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="dailogTitWork"
                  >
                    Work Order Status Audit
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={StatushandleClose}
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
                    <div
                      style={{
                        width: "auto",
                        maxWidth: "max-content",
                        marginLeft: "50px",
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
                            label6,
                            
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
                                  left: "-70px",
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
                                  {label6} ({label1})
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
              {/* Assign model popup */}
             
              <BootstrapDialog
               // onClose={handleCloseModalAssign}
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseModalAssign(event, reason);
                  }
                }}
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
                    padding:"0px !important",
                    margin:"5px !important"
                   // color: (theme) => theme.palette.grey[500],
                  }}
                >
                   <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                      padding:"0px !important",
                      margin:"5px !important"
                     // color: (theme) => theme.palette.grey[500],
                    }}
                  >
                     <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                                  {label ? label : (label2 === "REMOVE" ? "REMOVE" : label2)}
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
                                 Assign Date: {label4}
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
              <BootstrapDialog
                onClose={CommenthandleClose}
                aria-labelledby="customized-dialog-title"
                open={CommentShow}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    m: 0,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Iconify
                      icon="quill:chat"
                      style={{
                        fontSize: "24px",
                        verticalAlign: "middle",
                        marginRight: "5px",
                      }}
                    />
                    <span style={{ fontSize: "16px", verticalAlign: "middle" }}>
                      Work Order Comment
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <IconButton
                      aria-label="close"
                      onClick={Refreshdatapopup}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <Iconify icon="tabler:refresh" />
                    </IconButton>
                    <IconButton
                      aria-label="close"
                      onClick={CommenthandleClose}
                      sx={{
                        color: (theme) => theme.palette.grey[500],
                      }}
                    >
                      <Iconify icon="ic:baseline-close" />
                    </IconButton>
                  </div>
                </DialogTitle>

                <DialogContent dividers>
                  <div className="chat-container">
                    <div className="menud" ref={chatContainerRef}>
                      <ol className="chatd">
                        {loading ? (
                          <li>Loading...</li>
                        ) : (
                          AllCommnet.map((item, index) => (
                            <li
                              key={index}
                              className={`messagedd ${
                                item.wko_ls11_name === emp_mst_name
                                  ? "self2"
                                  : "other2"
                              }`}
                            >
                              <div
                                className={`avatar2 ${
                                  item.wko_ls11_name === emp_mst_name
                                    ? "top-left"
                                    : "bottom-right"
                                }`}
                              >
                                <span>
                                  {item.wko_ls11_name
                                    ? item.wko_ls11_name.charAt(0)
                                    : "?"}
                                </span>
                              </div>
                              <div className="msg2">
                                <div className="msfcls">
                                  <p className="usrName">
                                    <span>{item.wko_ls11_name}</span>
                                  </p>
                                  <p className="msgP">
                                    {Moment(item.audit_date.date).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </p>
                                  {item.full_size_link ? (
                                    <img
                                      src={item.full_size_link}
                                      alt="Comment Img"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginBottom: "10px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  ) : item.attachment ? (
                                    <img
                                      src={`data:image/png;base64,${item.attachment}`}
                                      alt="Comment Img"
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginBottom: "10px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  ) : null}

                                  <p className="commentTxt">
                                    {item.wko_ls11_sts_upd && (
                                      <p>{item.wko_ls11_sts_upd}</p>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))
                        )}
                      </ol>
                    </div>
                    <div className="input-container">
                      <label htmlFor="file-upload" className="upload-icon">
                        <Iconify icon="fa:camera" />
                      </label>
                      <input
                        type="file"
                        id="file-upload"
                        ref={fileInputRef2}
                        style={{ display: "none" }}
                        onChange={handleImageChange2}
                      />

                      {imagePreview && (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="Uploaded Preview"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50px",
                              marginRight: "5px",
                              cursor: "pointer",
                            }}
                            onClick={handleImageClickSHow}
                          />

                          {/* Close icon */}
                          <div
                            style={{
                              position: "absolute",
                              top: "0",
                              right: "0",
                              cursor: "pointer",
                              padding: "1px",
                              background: "rgba(255, 255, 255, 0.7)",
                              borderRadius: "50%",
                              width: "21px",
                              height: "22px",
                            }}
                            onClick={handleUploadCloseClick}
                          >
                            <Iconify icon="carbon:close-outline" />
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        className="text_input"
                        placeholder="Comment..."
                        disabled={!!imagePreview}
                        ref={messageRef}
                      />
                      {selectedImage && (
                        <div className="upImgCntr">
                          <img
                            src={`data:image/png;base64,${selectedImage}`}
                            alt="Selected Image"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                        </div>
                      )}
                      <button
                        type="submit"
                        className="submit-button"
                        onClick={handleSubmitCmmnt}
                      >
                        <Iconify icon="fa:send" />
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </BootstrapDialog>

              {/* single Upload Img Show */}
              <BootstrapDialog
              //  onClose={UploadImghandleClose}
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    UploadImghandleClose(event, reason);
                  }
                }}
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
                    padding:"0px !important",
                    margin:"5px !important"
                   // color: (theme) => theme.palette.grey[500],
                  }}
                >
                   <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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

              {/* complete word order popup */}
              <BootstrapDialog
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick') {
                    handleCMPCloseModal();
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={modalOpenComplete}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Complete Work Order
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCMPCloseModal}
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
                <DialogContent dividers style={{padding: "0px"}}>
                <div
                    className="MainOrderFromGd"
                    style={{ backgroundColor: "white" }}
                  >
                    <Grid container spacing={0}>
                      <Grid xs={12} md={12} className="CompleteDiv">
                        <Card sx={{ p: 3 }}>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "1fr",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Box
                              rowGap={2}
                              columnGap={1}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "90%",
                                sm: "90% 10%",
                                gap:"0px"
                              }}
                            >
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2">
                                  {findCustomizeLabel("wko_mst_status") ||
                                    "Status"}
                                </Typography>
                              
                                <Autocomplete
                                  options={Status.filter(
                                    (status) => status.key === "COMPLETE"
                                  )}
                                  value={selected_Status2?.label?.split(" : ").slice(0, 2).join(" : ") || ""}
                                  onChange={handleStatusChange}
                                  disableAnimation
                                 // disabled={ApprovalStatus === "A" || ApprovalStatus === "D"}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          isFiledValueEmpty ? "errorEmpty" : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Tooltip
                                title="Status Audit"
                                placement="top"
                                arrow
                                className="tooltipRht"
                                disabled={Button_save == "Save"}
                              >
                                <IconButton>
                                  <Iconify
                                    icon="pajamas:status-alert"
                                    onClick={StatushandleShow}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabel("wko_det_cmpl_date") ||
                                  "Complete Date"}
                              </Typography>

                              <DateTimePicker
                                value={CompletionDate2}
                                format="dd/MM/yyyy HH:mm"
                                className="Extrasize"
                                onChange={(newDate) => {
                                  setCompletionDate2(newDate);
                                  
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                              />
                            </Stack>
                          </Box>
                         
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2" className="Requiredlabel">
                                  {findCustomizeLabel("wko_det_corr_action") ||
                                    "Corrective Actions"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  
                                  size="small"
                                  value={CorrectiveActionTemp}
                                  minRows={6}
                                  className={`TxtAra ${
                                    isCorrectiveValueEmptyTemp ? "errorEmpty" : ""
                                  }`}
                                  style={{  width: '100%' }}
                                  onChange={(e) => {
                             
                                    const value = e.target.value;
                                    if (value.length <= 2000) {
                                      setCorrectiveActionTemp(e.target.value);
                                    }
                                    setIsCorrectiveValueEmptyTemp(false);
                                  }}
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "repeat(1, 1fr)",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className="Requiredlabel">
                                {findCustomizeLabelDet("wko_det_cause_code") ||
                                  "Cause Code"}
                              </Typography>

                              <Autocomplete
                                options={Cause_Code}
                                value={selected_Cause_Code_temp?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Cause_Code_temp(value || null);
                                  setIsCauseCodeValueEmptyTemp(false);
                                 
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isCauseCodeValueEmptyTemp ? "errorEmpty" : "Extrasize"
                                    }`}
                                    ref={autocompleteRef}
                                  />

                              
                                )}
                              />
                            </Stack>
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className="Requiredlabel">
                                {findCustomizeLabelDet("wko_det_act_code") ||
                                  "Action Code"}
                              </Typography>
                              <Autocomplete
                                options={Action_Code}
                                value={selected_Action_Code_temp?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Action_Code_temp(value || null);
                                  setIsActionCodeValueEmptyTemp(false);
                                
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isActionCodeValueEmptyTemp ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                </DialogContent>
                  <DialogActions
                    style={{
                      display: "flex",
                      justifyContent: "flex-end", // Align buttons to the right
                    }}
                  >
                   <Button
                    variant="soft"
                    color="error"
                    className="CMPButton"
                    startIcon={<Iconify icon="hugeicons:note-done" />}
                    onClick={onClickChangeComplete}
                    style={{
                      backgroundColor: "#067effd1",
                      color: "white",
                      marginRight: "10px",
                    }}
                  >
                    Complete
                  </Button>

                  </DialogActions>
                </BootstrapDialog>

              {/*  Close word order popup */}
              <BootstrapDialog
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick') {
                    handleCLOCloseModal();
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={modalOpenClose}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Close Work Order
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCLOCloseModal}
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
                <DialogContent dividers style={{padding: "0px"}}>
                <div
                    className="MainOrderFromGd"
                    style={{ backgroundColor: "white" }}
                  >
                     <Grid container spacing={0}>
                      <Grid xs={12} md={12} className="CompleteDiv">
                        <Card sx={{ p: 3 }}>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "1fr",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Box
                              rowGap={2}
                              columnGap={1}
                              display="grid"
                              gridTemplateColumns={{
                                xs: "90%",
                                sm: "90% 10%",
                                gap:"1px"
                              }}
                            >
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("wko_mst_status") ||
                                    "Status"}
                                </Typography>
                                <Autocomplete
                                  options={Status.filter(
                                    (status) => status.key === "CLOSE"
                                  )}
                                  value={(selected_Status2?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}
                                  onChange={handleStatusChange}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          isFiledValueEmpty ? "errorEmpty" : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              <Tooltip
                                title="Status Audit"
                                placement="top"
                                arrow
                                className="tooltipRht"
                                disabled={Button_save == "Save"}
                              >
                                <IconButton>
                                  <Iconify
                                    icon="pajamas:status-alert"
                                    onClick={StatushandleShow}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2">
                                {findCustomizeLabel("wko_det_clo_date") ||
                                  "Close Date"}
                              </Typography>

                              <DateTimePicker
                                value={CloseDate2}
                                format="dd/MM/yyyy HH:mm"
                                className="Extrasize"
                                onChange={(newDate) => {
                                  setCloseDate2(newDate); // Update your state with the new value
                                  setIsFormFiled(true);
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                              />
                            </Stack>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                                <Typography variant="subtitle2" className="Requiredlabel">
                                  {findCustomizeLabel("wko_det_corr_action") ||
                                    "Corrective Actions"}
                                </Typography>
                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  
                                  size="small"
                                  value={CorrectiveActionTemp}
                                  minRows={6}
                                  className={`TxtAra ${
                                    isCorrectiveValueEmptyTemp ? "errorEmpty" : ""
                                  }`}
                                  style={{ width: '100%' }}
                                  onChange={(e) => {
                             
                                    const value = e.target.value;
                                    if (value.length <= 2000) {
                                      setCorrectiveActionTemp(e.target.value);
                                    }
                                    setIsCorrectiveValueEmptyTemp(false);
                                    setIsFormFiled(true);
                                  }}
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                          <Box
                            rowGap={2}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                              xs: "repeat(1, 1fr)",
                              sm: "repeat(2, 1fr)",
                            }}
                          >
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className="Requiredlabel">
                                {findCustomizeLabelDet("wko_det_cause_code") ||
                                  "Cause Code"}
                              </Typography>
                              <Autocomplete
                                options={Cause_Code}
                                value={selected_Cause_Code_temp?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Cause_Code_temp(value || null);
                                  setIsCauseCodeValueEmptyTemp(false);
                                  setIsFormFiled(true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isCauseCodeValueEmptyTemp ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                            <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className="Requiredlabel">
                                {findCustomizeLabelDet("wko_det_act_code") ||
                                  "Action Code"}
                              </Typography>
                              <Autocomplete
                                options={Action_Code}
                                value={selected_Action_Code_temp?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelected_Action_Code_temp(value || null);
                                  setIsActionCodeValueEmptyTemp(false);
                                  setIsFormFiled(true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    placeholder="Select..."
                                    variant="outlined"
                                    fullWidth // Make it full-width
                                    className={`Extrasize ${
                                      isActionCodeValueEmptyTemp ? "errorEmpty" : ""
                                    }`}
                                  />
                                )}
                              />
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </div>
                </DialogContent>
                  <DialogActions
                    style={{
                      display: "flex",
                      justifyContent: "flex-end", // Align buttons to the right
                    }}
                  >
                   <Button
                    variant="soft"
                    color="error"
                    className="CLOButton"
                    onClick={onClickChangeClose}
                    startIcon={<Iconify icon="iconamoon:file-close-fill" />}
                    style={{ backgroundColor: '#9e9e9e', color: 'white',  marginRight: "10px" }}
                  >
                    Close
                  </Button>

                  </DialogActions>
                </BootstrapDialog>  

            {/* Work request info popup*/}
            <BootstrapDialog
               // onClose={handleCloseModalWorkReq}
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseModalWorkReq(event, reason);
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={modalOpenWorkReq}
                 maxWidth="xs"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                 {workRequestNo !== "" ? `Info: ${workRequestNo}` : ""}
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalWorkReq}
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
                <Typography gutterBottom>
                <Stack spacing={2} className="ApproveDailog">
                        <div>
                          <TextField
                            label="Work Request Status :"
                            fullWidth
                            value={WRStatus == "A" ? "Approve" : WRStatus == "D" ? "Disapprove" : "Awaiting"}
                            disabled
                          />
                        </div>
                        <div>
                        
                           <DateTimePicker
                            label="WR Origination Date :"
                              value={WROriDate}
                              format="dd/MM/yyyy HH:mm"
                              className="workReqSubText"
                              disabled
                            />
                        </div>
                </Stack>
                </Typography>
                </DialogContent>
               
              </BootstrapDialog>
              {/* Work Request info popup End */}
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

WorkOrderText.propTypes = {
  currentUser: PropTypes.object,
};
