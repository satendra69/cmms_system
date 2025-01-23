import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
// @bootstrap

import TextareaAutosize from "@mui/material/TextareaAutosize";
import { ThreeCircles } from 'react-loader-spinner';
import FormControlLabel from "@mui/material/FormControlLabel";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
import {  Checkbox } from '@mui/material';

import Grid from "@mui/material/Unstable_Grid2";

import { useLocation, useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "moment";
import "moment-timezone";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
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


// Toastfy
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";

// import WorkOrderAssetNo from "../WorkOrderAssetNo";

import Tooltip from "@mui/material/Tooltip";

import AssetParentIdList from "../AssetParentIdList"
import AssetCustomerCodeList from "../AssetCustomerCodeList"
import MrWorkOrderList from "../MrWorkOrderList";

import MR_Line from "../Mr_module/MR_Line";
import Mr_ApprovalList from "../Mr_module/Mr_ApprovalList"
import { useSwalCloseContext } from "src/sections/ContextApi/SwalCloseContext";

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

// ----------------------------------------------------------------------

export default function CreateMRFrom({ currentUser, onPageChange }) {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");
  const location = useLocation();
  let Emp_logonId = localStorage.getItem("emp_mst_empl_id");
  const {swalCloseTime} = useSwalCloseContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [progress, setProgress] = useState(0);
  const [MrLineStorresult, setMrLineStorResult] = useState([]);

  const state = location.state || {};
  const { RowID, Ast_no, DuplicatRowid,DupRowID,DupAst_no, currentPage, selectedOption,selectDropRowID } = state || {};

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true );

  const [mtrMstLabel, setMtrMstLabel] = useState([]);
  const [mtrdetLabel, setMtrdetLabel] = useState([]);

 // console.log("mtrdetLabel_____",mtrdetLabel);

  const [MrApprovalStatus, setMrApprovalStatus] = useState("Awaiting (W)");
  const [MrApprovalProcess, setMrApprovalProcess] = useState("0/1");


  const [NextApprover,setNextApprover] = useState("");
  const [ReleaseAproval, setReleaseAproval] = useState(true);
  const [EmlReqBy, setEmlReqBy] = useState(false); 
  const [EmlNotification, setEmlNotification] = useState(false);
  const [RequiredDate, setRequiredDate] = useState(new Date());
  const [OriginationDate, setOriginationDate] = useState(new Date());

  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const settings = useSettingsContext();

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImages2, setSelectedImages2] = useState([]);

  const [selectedPdfFiles, setSelectedPdfFiles] = useState([]);
  const [RefImg, setRefImg] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [getDbImg, setDbImg] = useState();
  const [image, setImage] = useState({ preview: "", raw: "" });

  const [imguploadStatus, setImguploadStatus] = useState("");
  const [imguploadRefStatus, setImguploadRefStatus] = useState("");

  const [removedRefItems, setRemovedRefItems] = useState([]);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [imageSelect, setImageSelect] = useState({ name: "", path: "" });
  const [Tabvalue, setTabValue] = useState(0);

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
  const [AssetNo, setAssetNo] = useState("");
  const [Status, setStatus] = useState([]);
  const [EnteredBy,setEnteredBy] = useState("");

  const [selected_Asset_Location, setSelected_Asset_Location] = useState([]);

  const [selected_Asset_Level, setSelected_Asset_Level] = useState([]);

  const [selected_Work_Group, setSelected_Work_Group] = useState([]);

  const [Permanent_IDFlag, setPermanentIDFlag] =useState([]);
 
  const [CustomerAssetNoCode, setCustomerAssetNoCode] = useState("");

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
  const [UDFText_21, setUDFText_21] = useState("");
  const [UDFText_22, setUDFText_22] = useState("");
  const [UDFText_23, setUDFText_23] = useState("");
  const [UDFText_24, setUDFText_24] = useState("");
  const [UDFText_25, setUDFText_25] = useState("");
  const [UDFText_26, setUDFText_26] = useState("");
  const [UDFText_27, setUDFText_27] = useState("");
  const [UDFText_28, setUDFText_28] = useState("");
  const [UDFText_29, setUDFText_29] = useState("");
  const [UDFText_30, setUDFText_30] = useState("");

  const [UDFNumber_1, setUDFNumber_1] = useState("");
  const [UDFNumber_2, setUDFNumber_2] = useState("");
  const [UDFNumber_3, setUDFNumber_3] = useState("");
  const [UDFNumber_4, setUDFNumber_4] = useState("");
  const [UDFNumber_5, setUDFNumber_5] = useState("");
  const [UDFNumber_6, setUDFNumber_6] = useState("");
  const [UDFNumber_7, setUDFNumber_7] = useState("");
  const [UDFNumber_8, setUDFNumber_8] = useState("");
  const [UDFNumber_9, setUDFNumber_9] = useState("");
  const [UDFNumber_10, setUDFNumber_10] = useState("");
  const [UDFNumber_11, setUDFNumber_11] = useState("");
  const [UDFNumber_12, setUDFNumber_12] = useState("");
  const [UDFNumber_13, setUDFNumber_13] = useState("");
  const [UDFNumber_14, setUDFNumber_14] = useState("");
  const [UDFNumber_15, setUDFNumber_15] = useState("");

  const [UDFDate_1, setUDFDate_1] = useState();
  const [UDFDate_2, setUDFDate_2] = useState();
  const [UDFDate_3, setUDFDate_3] = useState();
  const [UDFDate_4, setUDFDate_4] = useState();
  const [UDFDate_5, setUDFDate_5] = useState();
  const [UDFDate_6, setUDFDate_6] = useState();
  const [UDFDate_7, setUDFDate_7] = useState();
  const [UDFDate_8, setUDFDate_8] = useState();
  const [UDFDate_9, setUDFDate_9] = useState();
  const [UDFDate_10, setUDFDate_10] = useState();
  const [UDFDate_11, setUDFDate_11] = useState();
  const [UDFDate_12, setUDFDate_12] = useState();
  const [UDFDate_13, setUDFDate_13] = useState();
  const [UDFDate_14, setUDFDate_14] = useState();
  const [UDFDate_15, setUDFDate_15] = useState();

  const [isAssetStatusEmpty, setIsAssetStatusEmpty] = useState(false);
  const [isAssetCriticalFactorEmpty, setIsAssetCriticalFactorEmpty] = useState(false);
  const [isAssetShortDescEmpty,setIsAssetShortDescEmpty] = useState(false);
  const [isNoteEmpty,setIsNoteEmpty] = useState(false);


  const [selected_Asset_Status, setSelected_Asset_Status] = useState([]);
  const [selected_Asset_Group_Code, setSelected_Asset_Group_Code] = useState(
    []
  );

  const [Button_save, setButton_save] = useState("");
  const [getDbImgRowId, setDbImgRowId] = useState("");
  const [SpecialOdrResult, setSpecialOdrResult] = useState([]);

  const [steps, setsteps] = useState([]);
  const StatushandleClose = () => setStatusShow(false);

  const [StatusShow, setStatusShow] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef2 = useRef(null);

  const [uploadImgShow, setUploadImgShow] = useState(false);
  const UploadImghandleClose = () => setUploadImgShow(false);
 
  const [isAssetNoEmpty, setIsAssetNoEmpty] = useState(false);
  const [isOpenWork, setIsOpenWork] = useState(true);
  const [isOpenWork2, setIsOpenWork2] = useState(false);

  const autocompleteRef = useRef(null);
  const assetNoAutocompleteRef = useRef(null);
  const CustomerCodeRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);

  
  const [MrMandatoryFiled, setMrMandatoryFiled] = useState([]);
  const [errorField, setErrorField] = useState(null);
 
  const [isFormFiled, setIsFormFiled] = useState(false);


  /* New State create by satya */
  const[MrRequestNo, setMrRequestNo] = useState("");
  const [selected_Status, setSelected_Status] = useState([]);

  const [Mr_requester, setMr_requester] = useState([]);
  const [selected_Mr_requester, setSelected_Mr_requester] = useState([]);

  const [CustomerCode, setCustomerCode] = useState("");

  const [CustomerCodeAssetNO, setCustomerCodeAssetNo] = useState("");
  const [selected_Customer_Code_AssetNo, setSelected_Customer_Code_AssetNo] = useState([]);

  const [Charge_Cost_Center, setCharge_Cost_Center] = useState([]);
  const [selected_Charge_Cost_Center, setSelected_Charge_Cost_Center] =
    useState([]);

  const [MrAccount, setMrAccount] = useState([]);
  const [selected_MrAccount, setselected_MrAccount] = useState([]);
  const [Note1, setNote1] = useState("");
  const [mrCount,setMrCount] = useState("0");
  /*   new state added by satya  */


  useEffect(() => {
    async function fetchData() { 
     
      if (typeof RowID !== "undefined" && RowID !== null && RowID !== "") {
        
        setButton_save("Update");
        await get_mr_form_data_selected();
        await fetchStatusData();
        await getAssetFromLebel();
        await getMrMandatoryfiled();
      } else if(typeof DuplicatRowid !== "undefined" && DuplicatRowid !== null && DuplicatRowid !== "") {
        
        setButton_save("Duplicate");
      
        await get_mr_form_data_selected();
        await fetchStatusData();
        await getAssetFromLebel();
        await getMrMandatoryfiled();

      }else{

        await getAssetFromLebel();
        await fetchStatusData();
        await getMrMandatoryfiled();
      //  await fetchStusPriortyData();
        setButton_save("Save");
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // test funcation

  // Get All Filed label Name
  const getAssetFromLebel = async () => {
    try {
      const response = await httpCommon.get("/get_mr_form_lebal.php");
      // console.log("response____getLabel",response);
      if (response.data.status === "SUCCESS") {
        setMtrMstLabel(response.data.data.mtr_mst);
        setMtrdetLabel(response.data.data.mtr_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Get All Filed label Name
  const getMrMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_mr_mandator_filed.php");
     
      if (response.data && response.data.data && response.data.data.MandatoryField) {

        if (response.data.data.MandatoryField.length > 0) {
  
          setMrMandatoryFiled(response.data.data.MandatoryField);
  
        }
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 
  const get_mr_form_data_selected = async () => {
    var json = {

        "site_cd": site_ID,
        "RowId": DuplicatRowid !== undefined && DuplicatRowid !== "" ? DupRowID : RowID,
    }
    try {
      const response = await httpCommon.post(
        "/get_mr_form_data_selected.php",
        JSON.stringify(json)
      );
    //  console.log("Get_mr Data", response);
      if (response.data.status === "SUCCESS") {
        
        setMrCount(response.data.count);
        const formatNumber = (number) => {
          if (number == null) {
            return '';
          }
        
          let [integerPart, decimalPart] = number.toString().split('.');
          integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
        
          return `${integerPart}.${decimalPart}`;
        };
        const formatNumber2 = (number) => {
          if (number == null) {
            return '';
          }
        
          let [integerPart, decimalPart] = number.toString().split('.');
          integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          decimalPart = decimalPart ? decimalPart.slice(0, 2) : '';
        
          return `${integerPart}`;
        };

        if(typeof DuplicatRowid !== "undefined" && DuplicatRowid !== null && DuplicatRowid !== ""){
         // console.log("Enter_log_with duplicate__key");
          setAssetNo("");
        }else{
         // console.log("Enter_log_without duplicate__key");
          setAssetNo(response.data.data["0"].mtr_mst_mtr_no);
        }

        setMrRequestNo(response.data.data["0"].mtr_mst_mtr_no);
        setEnteredBy(response.data.data["0"].mtr_mst_entered_by);
        
        if(response.data.data["0"].mtr_mst_status == "A"){
          setMrApprovalStatus("Approved (A)");
        }else if(response.data.data["0"].mtr_mst_status == "D"){
          setMrApprovalStatus("Disapproved (D)");
        }else if(response.data.data["0"].mtr_mst_status == "W"){
          setMrApprovalStatus("Awaiting (W)");
        }
        setMrApprovalProcess( response.data.data["0"].mtr_mst_cur_app_level + " / " + response.data.data["0"].mtr_mst_app_level);
        setNextApprover(response.data.data["0"].mtr_mst_approver);

        if((response.data.data["0"].mtr_mst_mr_status === "" || response.data.data["0"].mtr_mst_mr_status === null) && 
        (response.data.data["0"].ast_sts_desc === null || response.data.data["0"].ast_sts_desc === "null")){
          setSelected_Status({ label: "" });
        }else{
         // setSelected_Status({ label: response.data.data["0"].mtr_mst_mr_status + " : " + response.data.data["0"].ast_sts_desc });
         setSelected_Status({ label: response.data.data["0"].mtr_mst_mr_status });
        }
        

        if((response.data.data["0"].mtr_mst_requester === "" || response.data.data["0"].mtr_mst_requester === null) && 
        (response.data.data["0"].ast_cri_desc === null || response.data.data["0"].ast_cri_desc === "null")){
          setSelected_Mr_requester({ label: "" });
        }else{
         // setSelected_Mr_requester({ label: response.data.data["0"].mtr_mst_requester + " : " + response.data.data["0"].ast_cri_desc });
         setSelected_Mr_requester({ label: response.data.data["0"].mtr_mst_requester });
        }

        setCustomerCode(response.data.data["0"].mtr_mst_wo_no);
        setCustomerCodeAssetNo(response.data.data["0"].mtr_mst_assetno);

       if((response.data.data["0"].mtr_mst_costcenter === "" || response.data.data["0"].mtr_mst_costcenter === null) && 
       (response.data.data["0"].ast_cri_desc === null || response.data.data["0"].ast_cri_desc === "null")){
        setSelected_Charge_Cost_Center({ label: "" });
       }else{
        // setSelected_Mr_requester({ label: response.data.data["0"].mtr_mst_requester + " : " + response.data.data["0"].ast_cri_desc });
        setSelected_Charge_Cost_Center({ label: response.data.data["0"].mtr_mst_costcenter });
       }

       
       if((response.data.data["0"].mtr_mst_account === "" || response.data.data["0"].mtr_mst_account === null) && 
       (response.data.data["0"].ast_cri_desc === null || response.data.data["0"].ast_cri_desc === "null")){
        setselected_MrAccount({ label: "" });
       }else{
        // setSelected_Mr_requester({ label: response.data.data["0"].mtr_mst_requester + " : " + response.data.data["0"].ast_cri_desc });
        setselected_MrAccount({ label: response.data.data["0"].mtr_mst_account });
       }

       setNote1(response.data.data["0"].mtr_mst_note);

       if (response.data.data["0"].mtr_mst_org_date == null) {
        setOriginationDate("");
      } else {
        const apiDate = response.data.data["0"].mtr_mst_org_date.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setOriginationDate(formattedDate);
      }
      if (response.data.data["0"].mtr_mst_req_date == null) {
        setRequiredDate("");
      } else {
        const apiDate = response.data.data["0"].mtr_mst_req_date.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setRequiredDate(formattedDate);
      }
      setReleaseAproval(response.data.data["0"]. mtr_mst_release_for_app);
      setEmlReqBy(response.data.data["0"]. mtr_mst_email_requestor); 
      setEmlNotification(response.data.data["0"]. mtr_mst_email_notification);

       /** End ---*/


      setUDFText_1(response.data.data["0"].mtr_det_varchar1);
      setUDFText_2(response.data.data["0"].mtr_det_varchar2);
      setUDFText_3(response.data.data["0"].mtr_det_varchar3);
      setUDFText_4(response.data.data["0"].mtr_det_varchar4);
      setUDFText_5(response.data.data["0"].mtr_det_varchar5);
      setUDFText_6(response.data.data["0"].mtr_det_varchar6);
      setUDFText_7(response.data.data["0"].mtr_det_varchar7);
      setUDFText_8(response.data.data["0"].mtr_det_varchar8);
      setUDFText_9(response.data.data["0"].mtr_det_varchar9);
      setUDFText_10(response.data.data["0"].mtr_det_varchar10);

      setUDFText_11(response.data.data["0"].mtr_det_varchar11);
      setUDFText_12(response.data.data["0"].mtr_det_varchar12);
      setUDFText_13(response.data.data["0"].mtr_det_varchar13);
      setUDFText_14(response.data.data["0"].mtr_det_varchar14);
      setUDFText_15(response.data.data["0"].mtr_det_varchar15);
      setUDFText_16(response.data.data["0"].mtr_det_varchar16);
      setUDFText_17(response.data.data["0"].mtr_det_varchar17);
      setUDFText_18(response.data.data["0"].mtr_det_varchar18);
      setUDFText_19(response.data.data["0"].mtr_det_varchar19);
      setUDFText_20(response.data.data["0"].mtr_det_varchar20);

      setUDFText_21(response.data.data["0"].mtr_det_varchar21);
      setUDFText_22(response.data.data["0"].mtr_det_varchar22);
      setUDFText_23(response.data.data["0"].mtr_det_varchar23);
      setUDFText_24(response.data.data["0"].mtr_det_varchar24);
      setUDFText_25(response.data.data["0"].mtr_det_varchar25);
      setUDFText_26(response.data.data["0"].mtr_det_varchar26);
      setUDFText_27(response.data.data["0"].mtr_det_varchar27);
      setUDFText_28(response.data.data["0"].mtr_det_varchar28);
      setUDFText_29(response.data.data["0"].mtr_det_varchar29);
      setUDFText_30(response.data.data["0"].mtr_det_varchar30);

      setUDFNumber_1(formatNumber(response.data.data["0"].mtr_det_numeric1));

      setUDFNumber_2(formatNumber(response.data.data["0"].mtr_det_numeric2));
      setUDFNumber_3(formatNumber(response.data.data["0"].mtr_det_numeric3));
      setUDFNumber_4(formatNumber(response.data.data["0"].mtr_det_numeric4));
      setUDFNumber_5(formatNumber(response.data.data["0"].mtr_det_numeric5));
      setUDFNumber_6(formatNumber(response.data.data["0"].mtr_det_numeric6));
      setUDFNumber_7(formatNumber(response.data.data["0"].mtr_det_numeric7));
      setUDFNumber_8(formatNumber(response.data.data["0"].mtr_det_numeric8));
      setUDFNumber_9(formatNumber(response.data.data["0"].mtr_det_numeric9));
      setUDFNumber_10(formatNumber(response.data.data["0"].mtr_det_numeric10));
      setUDFNumber_11(formatNumber(response.data.data["0"].mtr_det_numeric11));
      setUDFNumber_12(formatNumber(response.data.data["0"].mtr_det_numeric12));
      setUDFNumber_13(formatNumber(response.data.data["0"].mtr_det_numeric13));
      setUDFNumber_14(formatNumber(response.data.data["0"].mtr_det_numeric14));
      setUDFNumber_15(formatNumber(response.data.data["0"].mtr_det_numeric15));

    
      if (response.data.data["0"].mtr_det_datetime1 == null) {   
        setUDFDate_1("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime1.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_1(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime2 == null) {   
        setUDFDate_2("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime2.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_2(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime3 == null) {   
        setUDFDate_3("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime3.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_3(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime4 == null) {   
        setUDFDate_4("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime4.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_4(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime5 == null) {   
        setUDFDate_5("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime5.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_5(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime6 == null) {   
        setUDFDate_6("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime6.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_6(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime7 == null) {   
        setUDFDate_7("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime7.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_7(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime8 == null) {   
        setUDFDate_8("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime8.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_8(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime9 == null) {   
        setUDFDate_9("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime9.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_9(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime10 == null) {   
        setUDFDate_10("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime10.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_10(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime11 == null) {   
        setUDFDate_11("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime11.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_11(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime12 == null) {   
        setUDFDate_12("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime12.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_12(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime13 == null) {   
        setUDFDate_13("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime13.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_13(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime14 == null) {   
        setUDFDate_14("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime14.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_14(formattedDate);
      }
      if (response.data.data["0"].mtr_det_datetime15 == null) {   
        setUDFDate_15("");
      } else {
        const apiDate = response.data.data["0"].mtr_det_datetime15.date;
        const formattedDate = Moment(
          apiDate,
          "YYYY-MM-DD HH:mm:ss.SSSSSS"
        ).toDate();
        setUDFDate_15(formattedDate);
      }
       if(DuplicatRowid == null){
        fetchImgData();
       }
      
    
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
        title: "Oops get_Asset select Not Found...",
        text: error,
      });
    }
  }
  
  // Second Api call fetch all dropdowwn data
  const fetchStatusData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_material_req_dropdown_list.php?site_cd=" + site_ID
      );
       //console.log("response____status__new__", response);  

       let Charge_Cost_Center = response.data.data.costcenter.map(
        (item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.costcenter,
        })
      );
      setCharge_Cost_Center(Charge_Cost_Center);

      let Accountdata = response.data.data.Mr_Account.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.account,
        key: item.account,
      }));

      setMrAccount(Accountdata);

      let Status = response.data.data.MRStatusList.map((item) => ({
        label: item.mtr_sts_status + " : " + item.mtr_sts_description,
        value: item.mtr_sts_description,
        key: item.mtr_sts_status,
      }));

      setStatus(Status);


      let reQster = response.data.data.Requester.map((item) => ({
        label: item.emp_mst_empl_id + " : " + item.emp_mst_title,
        value: item.emp_mst_empl_id,
      }));
      setMr_requester(reQster);


      /*   end */

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Thired Api Call
  const fetchImgData = async () => {
   
    try {
      const response = await httpCommon.get(
        "/get_mr_edit_img.php?RowID=" + RowID
      );
   // console.log("response____img__asset",response);
        if (response.data.data) {
          // Check if AllImgGet exists and has items
          
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

  const openSaveImg = () => {
    setShowdd2(true);
  };
  // First main Img funcation
  const handleDeleteImgApi = (ImgIDdlt) => {
    const updatedImages = getDbImg.filter((image) => image.RowID !== ImgIDdlt);

    // Update the state with the new array of images after the deletion
    setDbImg(updatedImages);
    setDbImgRowId(ImgIDdlt);
    setDisabledBtn(true);
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
    setIsFormFiled(true);   
    reader.readAsDataURL(file);
  };
  
  const clearDataImg = () => {
    setImage("");
   
      if(Button_save === "Save"){
          setImageSelect({ name: "", path: "" });
        };
      }
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
    const matchingColumn = mtrMstLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";

  };
  // WorkReq Label Details table
  const findCustomizeLabelDet = (columnName) => {
    const matchingColumn = mtrdetLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };


const findCustomizerequiredLabel = (columnName) => {
    const foundItem = MrMandatoryFiled.find(item => item.column_name === columnName);
    if (foundItem && foundItem.cf_label_required === "1") {
        return "Requiredlabel";
    }
    return "";
};

  // staya added today
  const [modalOpenAsset, setModalOpenAsset] = useState(false);
  const [modalOpenAssetCustomerCode, setModalOpenAssetCustomerCode] = useState(false);

  const [modalOpenWorkOrderNo, setModalOpenWorkOrderNo] = useState(false);
  
  //get Asset Parent Flag data onther component
  const handleEditClick = () => {
    setModalOpenAsset(true);
  };

  const handleCancelClick = () => {
    setPermanentIDFlag("");
  };
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

  const handleEditClickWorkOrderNo = () =>{
    setModalOpenWorkOrderNo(true);
  }
  const handleCancelClickWorkOrderNo = () =>{
    setCustomerCode("");
  }
  function handleCloseModalWorkOrderNo() {
    setModalOpenWorkOrderNo(false);
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

        if (response.data.status === "SUCCESS") {
          setSelected_Asset_Status({
            label: response.data.data["0"].ast_mst_asset_status,
          });
          setSelected_Asset_Status({
            label: response.data.data["0"].ast_mst_asset_status,
          });
          setSelected_Asset_Group_Code({
            label:
              response.data.data["0"].ast_mst_asset_grpcode +
              " : " +
              response.data.data["0"].ast_grp_desc,
          });
          setSelected_Charge_Cost_Center({
            label:
              response.data.data["0"].ast_mst_cost_center +
              " : " +
              response.data.data["0"].descs,
          });
          // setSelected_Work_Area({
          //   label:
          //     response.data.data["0"].ast_mst_work_area +
          //     " : " +
          //     response.data.data["0"].mst_war_desc,
          // });
          setSelected_Asset_Level({
            label:
              response.data.data["0"].ast_mst_ast_lvl +
              " : " +
              response.data.data["0"].ast_lvl_desc,
          });
          setSelected_Asset_Location({
            label:
              response.data.data["0"].ast_mst_asset_locn +
              " : " +
              response.data.data["0"].ast_loc_desc,
          });
          setSelected_Work_Group({
            label:
              response.data.data["0"].ast_mst_wrk_grp +
              " : " +
              response.data.data["0"].wrk_grp_desc,
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
    setPermanentIDFlag(dataa);
   
    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    // if (dataa !== undefined && dataa !== null) {
    //   handleSelectedAssetNo(dataa);
    // }
    if (dataSecond == "1") {
      setModalOpenAsset(false);
      setTotalSearch("");
    }
  };
 
  const handleRowData3 = (dataLenth, dataa, dataSecond,assetNoGet) => {
    // Use the row data in the second component
    setCustomerCode(dataa);
    setCustomerAssetNoCode(assetNoGet);
    
    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
   
    if (dataSecond == "1") {
     // setModalOpenAssetCustomerCode(false);
      setModalOpenWorkOrderNo(false);
      setTotalSearch("");
    }
  };
  const handleRowData4 = (dataLenth, dataa, dataSecond) => {
    // Use the row data in the second component
    setCustomerCodeAssetNo(dataa);
   
    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
   
    if (dataSecond == "1") {
     // setModalOpenAssetCustomerCode(false);
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
                <IconButton key={index} onClick={icon.props.onClick}>{icon}</IconButton>
              ))}
            </div>
          ),
        }}
      />
    );
  }

  const handleOnChangeReleaseAproval = (newValue) => {
    setReleaseAproval(newValue);

  };
  const handleOnChangeEmlReqBy = (newValue) => {
    setEmlReqBy(newValue);
  
 };

 const handleOnChangeEmlNotofication = (newValue) => {
  setEmlNotification(newValue);

};
/*   add new asset code by stay */
  const New_MR_INSERT = async () => {
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

    //Select Status
    let Status, setStatus;
    if (selected_Status.label == "" || selected_Status.label == null) {
      setStatus = "";
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
     // console.log("Status: ", Status[0])
    }

    //Select Requster
    let Set_requster, setAsset_Status;
    if (selected_Mr_requester == "" || selected_Mr_requester == null) {
      setAsset_Status = "";
    } else {
      Set_requster = selected_Mr_requester.label.split(":");
      setAsset_Status = Set_requster[0];
      //console.log("Asset_Status ", setAsset_Status)
    }

  //Select Coste center
  let Set_costCenter, setCost_Center;
  if (selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center == null) {
    setCost_Center = "";
  } else {
    Set_costCenter = selected_Charge_Cost_Center.label.split(":");
    setCost_Center = Set_costCenter[0];
    //console.log("Asset_Status ", setAsset_Status)
  }

    //Select Account
    let Set_Account, setAccount;
    if (selected_MrAccount == "" || selected_MrAccount == null) {
      setAccount = "";
    } else {
      Set_Account = selected_MrAccount.label.split(":");
      setAccount = Set_Account[0];
      //console.log("Asset_Status ", setAsset_Status)
    }

  //Select Purchase Date
  let date_origination = "";
  if (OriginationDate == "" || OriginationDate == null) {
    date_origination = "";
  } else {
    date_origination = Moment(OriginationDate)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //  console.log("purchase_date ", date_of_purchase);
  }

  //Select Warranty Date
  let date_of_RequiredDate = "";
  if (RequiredDate == "" || RequiredDate == null) {
    date_of_RequiredDate = "";
  } else {
    date_of_RequiredDate = Moment(RequiredDate)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
  //    console.log("Warranty__date ", date_of_Warranty);
  }

  // select UDFDate_1 
  let date_of_1 = "";
  if (UDFDate_1 == "" || UDFDate_1 == null) {
    date_of_1 = "";
  } else {
    date_of_1 = Moment(UDFDate_1)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_1 ", date_of_1);
  }

  // select UDFDate_2 
  let date_of_2 = "";
  if (UDFDate_2 == "" || UDFDate_2 == null) {
    date_of_2 = "";
  } else {
    date_of_2 = Moment(UDFDate_2)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
      //console.log("UDFDate_2 ", date_of_2);
  }

  // select UDFDate_3 
  let date_of_3 = "";
  if (UDFDate_3 == "" || UDFDate_3 == null) {
    date_of_3 = "";
  } else {
    date_of_3 = Moment(UDFDate_3)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_3 ", date_of_3);
  }

  // select UDFDate_4 
  let date_of_4 = "";
  if (UDFDate_4 == "" || UDFDate_4 == null) {
    date_of_4 = "";
  } else {
    date_of_4 = Moment(UDFDate_4)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_4 ", date_of_4);
  }

  // select UDFDate_5 
  let date_of_5 = "";
  if (UDFDate_5 == "" || UDFDate_5 == null) {
    date_of_5 = "";
  } else {
    date_of_5 = Moment(UDFDate_5)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_5 ", date_of_5);
  }

  // select UDFDate_6 
  let date_of_6 = "";
  if (UDFDate_6 == "" || UDFDate_6 == null) {
    date_of_6 = "";
  } else {
    date_of_6 = Moment(UDFDate_6)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_6 ", date_of_6);
  }

  // select UDFDate_7 
  let date_of_7 = "";
  if (UDFDate_7 == "" || UDFDate_7 == null) {
    date_of_7 = "";
  } else {
    date_of_7 = Moment(UDFDate_7)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_7 ", date_of_7);
  }

  // select UDFDate_8 
  let date_of_8 = "";
  if (UDFDate_8 == "" || UDFDate_8 == null) {
    date_of_8 = "";
  } else {
    date_of_8 = Moment(UDFDate_8)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_8 ", date_of_8);
  }

  // select UDFDate_9 
  let date_of_9 = "";
  if (UDFDate_9 == "" || UDFDate_9 == null) {
    date_of_9 = "";
  } else {
    date_of_9 = Moment(UDFDate_9)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_9 ", date_of_9);
  }

  // select UDFDate_10 
  let date_of_10 = "";
  if (UDFDate_10 == "" || UDFDate_10 == null) {
    date_of_10 = "";
  } else {
    date_of_10 = Moment(UDFDate_10)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
  //    console.log("UDFDate_10 ", date_of_10);
  }

  // select UDFDate_11 
  let date_of_11 = "";
  if (UDFDate_11 == "" || UDFDate_11 == null) {
    date_of_11 = "";
  } else {
    date_of_11 = Moment(UDFDate_11)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_11 ", date_of_11);
  }

  // select UDFDate_12 
  let date_of_12 = "";
  if (UDFDate_12 == "" || UDFDate_12 == null) {
    date_of_12 = "";
  } else {
    date_of_12 = Moment(UDFDate_12)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_12 ", date_of_12);
  }

  // select UDFDate_13 
  let date_of_13 = "";
  if (UDFDate_13 == "" || UDFDate_13 == null) {
    date_of_13 = "";
  } else {
    date_of_13 = Moment(UDFDate_13)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_13 ", date_of_13);
  }

  // select UDFDate_14 
  let date_of_14 = "";
  if (UDFDate_14 == "" || UDFDate_14 == null) {
    date_of_14 = "";
  } else {
    date_of_14 = Moment(UDFDate_14)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_14 ", date_of_14);
  }

  // select UDFDate_15 
  let date_of_15 = "";
  if (UDFDate_15 == "" || UDFDate_15 == null) {
    date_of_15 = "";
  } else {
    date_of_15 = Moment(UDFDate_15)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_15 ", date_of_15);
  }
 
  let missingFields = [];

    var json_Mr_Insert = {
      site_cd: site_ID,
     // ast_mst_asset_no: AssetNo?.trim() || '',
      mtr_mst_mr_status: setStatus?.trim() || '',
      mtr_mst_requester: setAsset_Status?.trim() || '',
      mtr_mst_wo_no: CustomerCode?.trim() || '',
      mtr_mst_assetno:CustomerCodeAssetNO ? CustomerCodeAssetNO : CustomerAssetNoCode,
      mtr_mst_costcenter:setCost_Center?.trim() || '',
      mtr_mst_account:setAccount?.trim() || '',
      mtr_mst_note:Note1?.trim() || '',
      mtr_mst_entered_by:Emp_logonId?.trim() || '',
      mtr_mst_status:MrApprovalStatus?.trim() || '',
      mtr_approval_process:MrApprovalProcess?.trim() || '',
      mtr_mst_approver:"",
      mtr_mst_org_date:date_origination,
      mtr_mst_req_date:date_of_RequiredDate,
      mtr_mst_release_for_app:ReleaseAproval,
      mtr_mst_email_requestor:EmlReqBy,
      mtr_mst_email_notification:EmlNotification,
  
      mtr_det_varchar1: UDFText_1 ? UDFText_1.trim() : UDFText_1,
      mtr_det_varchar2: UDFText_2 ? UDFText_2.trim() : UDFText_2,
      mtr_det_varchar3: UDFText_3 ? UDFText_3.trim() : UDFText_3,
      mtr_det_varchar4: UDFText_4 ? UDFText_4.trim() : UDFText_4,
      mtr_det_varchar5: UDFText_5 ? UDFText_5.trim() : UDFText_5,
      mtr_det_varchar6: UDFText_6 ? UDFText_6.trim() : UDFText_6,
      mtr_det_varchar7: UDFText_7 ? UDFText_7.trim() : UDFText_7,
      mtr_det_varchar8: UDFText_8 ? UDFText_8.trim() : UDFText_8,
      mtr_det_varchar9: UDFText_9 ? UDFText_9.trim() : UDFText_9,
      mtr_det_varchar10: UDFText_10 ? UDFText_10.trim() : UDFText_10,
      mtr_det_varchar11: UDFText_11 ? UDFText_11.trim() : UDFText_11,
      mtr_det_varchar12: UDFText_12 ? UDFText_12.trim() : UDFText_12,
      mtr_det_varchar13: UDFText_13 ? UDFText_13.trim() : UDFText_13,
      mtr_det_varchar14: UDFText_14 ? UDFText_14.trim() : UDFText_14,
      mtr_det_varchar15: UDFText_15 ? UDFText_15.trim() : UDFText_15,
      mtr_det_varchar16: UDFText_16 ? UDFText_16.trim() : UDFText_16,
      mtr_det_varchar17: UDFText_17 ? UDFText_17.trim() : UDFText_17,
      mtr_det_varchar18: UDFText_18 ? UDFText_18.trim() : UDFText_18,
      mtr_det_varchar19: UDFText_19 ? UDFText_19.trim() : UDFText_19,
      mtr_det_varchar20: UDFText_20 ? UDFText_20.trim() : UDFText_20,
      mtr_det_varchar21: UDFText_21 ? UDFText_21.trim() : UDFText_21,
      mtr_det_varchar22: UDFText_22 ? UDFText_22.trim() : UDFText_22,
      mtr_det_varchar23: UDFText_23 ? UDFText_23.trim() : UDFText_23,
      mtr_det_varchar24: UDFText_24 ? UDFText_24.trim() : UDFText_24,
      mtr_det_varchar25: UDFText_25 ? UDFText_25.trim() : UDFText_25,
      mtr_det_varchar26: UDFText_26 ? UDFText_26.trim() : UDFText_26,
      mtr_det_varchar27: UDFText_27 ? UDFText_27.trim() : UDFText_27,
      mtr_det_varchar28: UDFText_28 ? UDFText_28.trim() : UDFText_28,
      mtr_det_varchar29: UDFText_29 ? UDFText_29.trim() : UDFText_29,
      mtr_det_varchar30: UDFText_30 ? UDFText_30.trim() : UDFText_30,

      mtr_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : UDFNumber_1,
      mtr_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : UDFNumber_2,
      mtr_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : UDFNumber_3,
      mtr_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : UDFNumber_4,
      mtr_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : UDFNumber_5,
      mtr_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : UDFNumber_6,
      mtr_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : UDFNumber_7,
      mtr_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : UDFNumber_8,
      mtr_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : UDFNumber_9,
      mtr_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : UDFNumber_10,
      mtr_det_numeric11: UDFNumber_11 ? UDFNumber_11.trim() : UDFNumber_11,
      mtr_det_numeric12: UDFNumber_12 ? UDFNumber_12.trim() : UDFNumber_12,
      mtr_det_numeric13: UDFNumber_13 ? UDFNumber_13.trim() : UDFNumber_13,
      mtr_det_numeric14: UDFNumber_14 ? UDFNumber_14.trim() : UDFNumber_14,
      mtr_det_numeric15: UDFNumber_15 ? UDFNumber_15.trim() : UDFNumber_15,

      mtr_det_datetime1: date_of_1 ? date_of_1.trim() : date_of_1,
      mtr_det_datetime2: date_of_2 ? date_of_2.trim() : date_of_2,
      mtr_det_datetime3: date_of_3 ? date_of_3.trim() : date_of_3,
      mtr_det_datetime4: date_of_4 ? date_of_4.trim() : date_of_4,
      mtr_det_datetime5: date_of_5 ? date_of_5.trim() : date_of_5,
      mtr_det_datetime6: date_of_6 ? date_of_6.trim() : date_of_6,
      mtr_det_datetime7: date_of_7 ? date_of_7.trim() : date_of_7,
      mtr_det_datetime8: date_of_8 ? date_of_8.trim() : date_of_8,
      mtr_det_datetime9: date_of_9 ? date_of_9.trim() : date_of_9,
      mtr_det_datetime10: date_of_10 ? date_of_10.trim() : date_of_10,
      mtr_det_datetime11: date_of_11 ? date_of_11.trim() : date_of_11,
      mtr_det_datetime12: date_of_12 ? date_of_12.trim() : date_of_12,
      mtr_det_datetime13: date_of_13 ? date_of_13.trim() : date_of_13,
      mtr_det_datetime14: date_of_14 ? date_of_14.trim() : date_of_14,
      mtr_det_datetime15: date_of_15 ? date_of_15.trim() : date_of_15,
      mrLineData:MrLineStorresult,
      ImgUpload: imageSelect,
      audit_user: emp_mst_login_id.trim(),
      ast_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),

    };

 //console.log("json_AssetInsert_____",json_Mr_Insert);
// console.log("AssetMandatoryFiled_____",AssetMandatoryFiled);

    for (let i = 0; i < MrMandatoryFiled.length; i++) {
      const item = MrMandatoryFiled[i];
      const fieldValue = json_Mr_Insert[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break;
      }
    }
    
    // If any fields are missing, display an error message
    if (missingFields.length > 0) {
      Swal.close();
    
        const errorMessage = `Please fill the required field: ${missingFields}`;
        setSnackbarOpen(true);
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
    }else{
     // console.log("json_Asset Data", json_Mr_Insert);
     try {
      const response = await httpCommon.post(
        "/insert_new_mr_data.php",
        JSON.stringify(json_Mr_Insert)
      );
    //  console.log("json_Asset Data_responce__", response);
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
             "/insert_mr_form_reference_multipalImgUpload.php",
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
           
           navigate(`/dashboard/MaterialRequest/list`, {
             state: {
               currentPage,
             },
           });
         },
       }).then((result) => {
         if (result.dismiss !== Swal.DismissReason.timer) {
           navigate(`/dashboard/MaterialRequest/list`, {
             state: {
               currentPage,
             },
           });
         }
         
         //navigate(`/dashboard/asset/list`);
       });
     } else {
       Swal.close();
       Swal.fire({
         icon: "error",
         title: "Oops...",
         text: response.data.message,
       });
     }
      
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops, something went wrong...",
        text: error,
      });
    }
  }
  };

  const Update_MR = async () => {
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

    //Select Status
    let Status, setStatus;
    if (selected_Status.label == "" || selected_Status.label == null) {
      setStatus = "";
    } else {
      Status = selected_Status.label.split(":");
      setStatus = Status[0];
     // console.log("Status: ", Status[0])
    }

    //Select Requster
    let Set_requster, setAsset_Status;
    if (!selected_Mr_requester || !selected_Mr_requester.label) {
      setAsset_Status = "";
  } else {
      Set_requster = selected_Mr_requester.label.split(":");
      setAsset_Status = Set_requster[0];
      //console.log("Asset_Status ", setAsset_Status)
    }

  //Select Coste center
  let Set_costCenter, setCost_Center;
  if (selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center == null) {
    setCost_Center = "";
  } else {
    Set_costCenter = selected_Charge_Cost_Center.label.split(":");
    setCost_Center = Set_costCenter[0];
    //console.log("Asset_Status ", setAsset_Status)
  }

    //Select Account
    let Set_Account, setAccount;
    if (selected_MrAccount == "" || selected_MrAccount == null) {
      setAccount = "";
    } else {
      Set_Account = selected_MrAccount.label.split(":");
      setAccount = Set_Account[0];
      //console.log("Asset_Status ", setAsset_Status)
    }

  //Select Purchase Date
  let date_origination = "";
  if (OriginationDate == "" || OriginationDate == null) {
    date_origination = "";
  } else {
    date_origination = Moment(OriginationDate)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //  console.log("purchase_date ", date_of_purchase);
  }

  //Select Warranty Date
  let date_of_RequiredDate = "";
  if (RequiredDate == "" || RequiredDate == null) {
    date_of_RequiredDate = "";
  } else {
    date_of_RequiredDate = Moment(RequiredDate)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
  //    console.log("Warranty__date ", date_of_Warranty);
  }

  // select UDFDate_1 
  let date_of_1 = "";
  if (UDFDate_1 == "" || UDFDate_1 == null) {
    date_of_1 = "";
  } else {
    date_of_1 = Moment(UDFDate_1)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_1 ", date_of_1);
  }

  // select UDFDate_2 
  let date_of_2 = "";
  if (UDFDate_2 == "" || UDFDate_2 == null) {
    date_of_2 = "";
  } else {
    date_of_2 = Moment(UDFDate_2)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
      //console.log("UDFDate_2 ", date_of_2);
  }

  // select UDFDate_3 
  let date_of_3 = "";
  if (UDFDate_3 == "" || UDFDate_3 == null) {
    date_of_3 = "";
  } else {
    date_of_3 = Moment(UDFDate_3)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_3 ", date_of_3);
  }

  // select UDFDate_4 
  let date_of_4 = "";
  if (UDFDate_4 == "" || UDFDate_4 == null) {
    date_of_4 = "";
  } else {
    date_of_4 = Moment(UDFDate_4)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_4 ", date_of_4);
  }

  // select UDFDate_5 
  let date_of_5 = "";
  if (UDFDate_5 == "" || UDFDate_5 == null) {
    date_of_5 = "";
  } else {
    date_of_5 = Moment(UDFDate_5)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_5 ", date_of_5);
  }

  // select UDFDate_6 
  let date_of_6 = "";
  if (UDFDate_6 == "" || UDFDate_6 == null) {
    date_of_6 = "";
  } else {
    date_of_6 = Moment(UDFDate_6)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
   //   console.log("UDFDate_6 ", date_of_6);
  }

  // select UDFDate_7 
  let date_of_7 = "";
  if (UDFDate_7 == "" || UDFDate_7 == null) {
    date_of_7 = "";
  } else {
    date_of_7 = Moment(UDFDate_7)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_7 ", date_of_7);
  }

  // select UDFDate_8 
  let date_of_8 = "";
  if (UDFDate_8 == "" || UDFDate_8 == null) {
    date_of_8 = "";
  } else {
    date_of_8 = Moment(UDFDate_8)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_8 ", date_of_8);
  }

  // select UDFDate_9 
  let date_of_9 = "";
  if (UDFDate_9 == "" || UDFDate_9 == null) {
    date_of_9 = "";
  } else {
    date_of_9 = Moment(UDFDate_9)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_9 ", date_of_9);
  }

  // select UDFDate_10 
  let date_of_10 = "";
  if (UDFDate_10 == "" || UDFDate_10 == null) {
    date_of_10 = "";
  } else {
    date_of_10 = Moment(UDFDate_10)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
  //    console.log("UDFDate_10 ", date_of_10);
  }

  // select UDFDate_11 
  let date_of_11 = "";
  if (UDFDate_11 == "" || UDFDate_11 == null) {
    date_of_11 = "";
  } else {
    date_of_11 = Moment(UDFDate_11)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_11 ", date_of_11);
  }

  // select UDFDate_12 
  let date_of_12 = "";
  if (UDFDate_12 == "" || UDFDate_12 == null) {
    date_of_12 = "";
  } else {
    date_of_12 = Moment(UDFDate_12)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_12 ", date_of_12);
  }

  // select UDFDate_13 
  let date_of_13 = "";
  if (UDFDate_13 == "" || UDFDate_13 == null) {
    date_of_13 = "";
  } else {
    date_of_13 = Moment(UDFDate_13)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_13 ", date_of_13);
  }

  // select UDFDate_14 
  let date_of_14 = "";
  if (UDFDate_14 == "" || UDFDate_14 == null) {
    date_of_14 = "";
  } else {
    date_of_14 = Moment(UDFDate_14)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
    //  console.log("UDFDate_14 ", date_of_14);
  }

  // select UDFDate_15 
  let date_of_15 = "";
  if (UDFDate_15 == "" || UDFDate_15 == null) {
    date_of_15 = "";
  } else {
    date_of_15 = Moment(UDFDate_15)
      .format("yyyy-MM-DD HH:mm:ss")
      .trim();
     // console.log("UDFDate_15 ", date_of_15);
  }
 
  //Check Img state
  let setDbImgRowIdUpdate;
  if (getDbImgRowId == "" || getDbImgRowId == null) {
    setDbImgRowIdUpdate = "";
  } else {
    setDbImgRowIdUpdate = getDbImgRowId;
  }

    let missingFields = [];

    var json_MrUpdate = {
      site_cd: site_ID,
       mtr_mst_mr_status: setStatus?.trim() || '',
       mtr_mst_requester: setAsset_Status?.trim() || '',
       mtr_mst_wo_no: CustomerCode?.trim() || '',
       mtr_mst_assetno:CustomerCodeAssetNO ? CustomerCodeAssetNO : CustomerAssetNoCode,
       mtr_mst_costcenter:setCost_Center?.trim() || '',
       mtr_mst_account:setAccount?.trim() || '',
       mtr_mst_note:Note1?.trim() || '',
       mtr_mst_entered_by:Emp_logonId?.trim() || '',
       mtr_mst_status:MrApprovalStatus?.trim() || '',
       mtr_approval_process:MrApprovalProcess?.trim() || '',
       mtr_mst_approver:"",
       mtr_mst_org_date:date_origination,
       mtr_mst_req_date:date_of_RequiredDate,
       mtr_mst_release_for_app:ReleaseAproval,
       mtr_mst_email_requestor:EmlReqBy,
       mtr_mst_email_notification:EmlNotification,
   
       mtr_det_varchar1: UDFText_1 ? UDFText_1.trim() : UDFText_1,
       mtr_det_varchar2: UDFText_2 ? UDFText_2.trim() : UDFText_2,
       mtr_det_varchar3: UDFText_3 ? UDFText_3.trim() : UDFText_3,
       mtr_det_varchar4: UDFText_4 ? UDFText_4.trim() : UDFText_4,
       mtr_det_varchar5: UDFText_5 ? UDFText_5.trim() : UDFText_5,
       mtr_det_varchar6: UDFText_6 ? UDFText_6.trim() : UDFText_6,
       mtr_det_varchar7: UDFText_7 ? UDFText_7.trim() : UDFText_7,
       mtr_det_varchar8: UDFText_8 ? UDFText_8.trim() : UDFText_8,
       mtr_det_varchar9: UDFText_9 ? UDFText_9.trim() : UDFText_9,
       mtr_det_varchar10: UDFText_10 ? UDFText_10.trim() : UDFText_10,
       mtr_det_varchar11: UDFText_11 ? UDFText_11.trim() : UDFText_11,
       mtr_det_varchar12: UDFText_12 ? UDFText_12.trim() : UDFText_12,
       mtr_det_varchar13: UDFText_13 ? UDFText_13.trim() : UDFText_13,
       mtr_det_varchar14: UDFText_14 ? UDFText_14.trim() : UDFText_14,
       mtr_det_varchar15: UDFText_15 ? UDFText_15.trim() : UDFText_15,
       mtr_det_varchar16: UDFText_16 ? UDFText_16.trim() : UDFText_16,
       mtr_det_varchar17: UDFText_17 ? UDFText_17.trim() : UDFText_17,
       mtr_det_varchar18: UDFText_18 ? UDFText_18.trim() : UDFText_18,
       mtr_det_varchar19: UDFText_19 ? UDFText_19.trim() : UDFText_19,
       mtr_det_varchar20: UDFText_20 ? UDFText_20.trim() : UDFText_20,
       mtr_det_varchar21: UDFText_21 ? UDFText_21.trim() : UDFText_21,
       mtr_det_varchar22: UDFText_22 ? UDFText_22.trim() : UDFText_22,
       mtr_det_varchar23: UDFText_23 ? UDFText_23.trim() : UDFText_23,
       mtr_det_varchar24: UDFText_24 ? UDFText_24.trim() : UDFText_24,
       mtr_det_varchar25: UDFText_25 ? UDFText_25.trim() : UDFText_25,
       mtr_det_varchar26: UDFText_26 ? UDFText_26.trim() : UDFText_26,
       mtr_det_varchar27: UDFText_27 ? UDFText_27.trim() : UDFText_27,
       mtr_det_varchar28: UDFText_28 ? UDFText_28.trim() : UDFText_28,
       mtr_det_varchar29: UDFText_29 ? UDFText_29.trim() : UDFText_29,
       mtr_det_varchar30: UDFText_30 ? UDFText_30.trim() : UDFText_30,
 
       mtr_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : UDFNumber_1,
       mtr_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : UDFNumber_2,
       mtr_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : UDFNumber_3,
       mtr_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : UDFNumber_4,
       mtr_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : UDFNumber_5,
       mtr_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : UDFNumber_6,
       mtr_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : UDFNumber_7,
       mtr_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : UDFNumber_8,
       mtr_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : UDFNumber_9,
       mtr_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : UDFNumber_10,
       mtr_det_numeric11: UDFNumber_11 ? UDFNumber_11.trim() : UDFNumber_11,
       mtr_det_numeric12: UDFNumber_12 ? UDFNumber_12.trim() : UDFNumber_12,
       mtr_det_numeric13: UDFNumber_13 ? UDFNumber_13.trim() : UDFNumber_13,
       mtr_det_numeric14: UDFNumber_14 ? UDFNumber_14.trim() : UDFNumber_14,
       mtr_det_numeric15: UDFNumber_15 ? UDFNumber_15.trim() : UDFNumber_15,
 
       mtr_det_datetime1: date_of_1 ? date_of_1.trim() : date_of_1,
       mtr_det_datetime2: date_of_2 ? date_of_2.trim() : date_of_2,
       mtr_det_datetime3: date_of_3 ? date_of_3.trim() : date_of_3,
       mtr_det_datetime4: date_of_4 ? date_of_4.trim() : date_of_4,
       mtr_det_datetime5: date_of_5 ? date_of_5.trim() : date_of_5,
       mtr_det_datetime6: date_of_6 ? date_of_6.trim() : date_of_6,
       mtr_det_datetime7: date_of_7 ? date_of_7.trim() : date_of_7,
       mtr_det_datetime8: date_of_8 ? date_of_8.trim() : date_of_8,
       mtr_det_datetime9: date_of_9 ? date_of_9.trim() : date_of_9,
       mtr_det_datetime10: date_of_10 ? date_of_10.trim() : date_of_10,
       mtr_det_datetime11: date_of_11 ? date_of_11.trim() : date_of_11,
       mtr_det_datetime12: date_of_12 ? date_of_12.trim() : date_of_12,
       mtr_det_datetime13: date_of_13 ? date_of_13.trim() : date_of_13,
       mtr_det_datetime14: date_of_14 ? date_of_14.trim() : date_of_14,
       mtr_det_datetime15: date_of_15 ? date_of_15.trim() : date_of_15,
       mrLineData:MrLineStorresult,
       mrCount:mrCount,
      audit_user: emp_mst_login_id.trim(),
      ast_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      ast_mst_create_date: get_date,

      SingleImguploadStatus:imguploadStatus,
      ImguploadRefStatus:imguploadRefStatus ? imguploadRefStatus :"EMPTY",

      ImgGetDbImgRowId: setDbImgRowIdUpdate,
      ImgUpload: imageSelect,
      SpecialOdrResult: SpecialOdrResult,

      removedRefItems: removedRefItems,
      RowID: RowID,
      MrRequestNo:MrRequestNo,
    };

//    console.log("json_MrUpdate_____",json_MrUpdate);

    for (let i = 0; i < MrMandatoryFiled.length; i++) {
      const item = MrMandatoryFiled[i];
      const fieldValue = json_MrUpdate[item.column_name];
      if (fieldValue !== null && fieldValue.trim() === "") {
        missingFields = item.customize_label;
        setErrorField(item.column_name);
        break; // Stop loop as soon as a missing field is found
      }
    }

    if (missingFields.length > 0) {
      Swal.close();
  
      const errorMessage = `Please fill the required field: ${missingFields}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');

      
    }else{
    try {
      const response = await httpCommon.post(
        "/update_mr_form_data.php",
        JSON.stringify(json_MrUpdate)
      );
     // console.log("response_____update__",response);
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
              "/insert_mr_form_reference_multipalImgUpload.php",
              formData,
              {
                headers: {
                    'Content-Type': 'multipart/form-data' // Ensure proper content type
                }
            }
            );

        
            if (response.data.status == "SUCCESS") {
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
                    navigate(`/dashboard/MaterialRequest/list`, {
                      state: {
                        currentPage,
                        selectedOption,
                        selectedRowIdBack:RowID,
                        comeBack:"Come_Back_cancel",
                      },
                    });
                  },
                }).then((result) => {
                  if (result.dismiss !== Swal.DismissReason.timer) {
                    if (response.data.status === "SUCCESS") {
                      navigate(`/dashboard/MaterialRequest/list`, {
                      state: {
                        currentPage,
                        selectedOption,
                        selectedRowIdBack:RowID,
                        comeBack:"Come_Back_cancel",
                      },
                    });
                  }
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
              navigate(`/dashboard/MaterialRequest/list`, {
                state: {
                  currentPage,
                  selectedOption,
                  selectedRowIdBack:RowID,
                  comeBack:"Come_Back_cancel",
                },
              });
            },
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              if (response.data.status === "SUCCESS") {
                navigate(`/dashboard/MaterialRequest/list`, {
                state: {
                  currentPage,
                  selectedOption,
                  selectedRowIdBack:RowID,
                  comeBack:"Come_Back_cancel",
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
          text: response.data.message,
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  // Save button // update button click funcation
  
  const onClickChange = (event) => {
    event.preventDefault();
   
  
   if (selected_Status == "" || selected_Status == null) {
   
      setIsAssetStatusEmpty(true);
      const errorMessage = 'Please fill the required field MR Status is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');

    }else if(selected_Charge_Cost_Center == "" || selected_Charge_Cost_Center == null){
   
      setIsAssetCriticalFactorEmpty(true);
      const errorMessage = 'Please fill the required field Cost Center is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      //setIsAssetCriticalFactorEmpty(true);
    }else if(selected_MrAccount == "" || selected_MrAccount == null){
     
      setIsAssetShortDescEmpty(true);
      const errorMessage = 'Please fill the required field Account is required!';
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');

    }else if(Button_save === "Save" && Array.isArray(MrLineStorresult) && MrLineStorresult.length === 0){
      //(Array.isArray(MrLineStorresult) && MrLineStorresult.length === 0
     // console.log("mrCount____",mrCount);
        const errorMessage = 'There is no requested line item. Please add line item to continue or exit!';
        setSnackbarOpen(true);
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
      
    }
    else if(Button_save === "Update" && mrCount <= 0){
      //(Array.isArray(MrLineStorresult) && MrLineStorresult.length === 0
      //console.log("mrCount____",mrCount);
        const errorMessage = 'There is no requested line item. Please add line item to continue or exit!';
        setSnackbarOpen(true);
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
      
    } else {
      if (Button_save === "Save") {
        New_MR_INSERT();
    
      } else if (Button_save === "Update") {
        Update_MR();

      }
    }
  };

  useEffect(() => {
    let timer;
    if (snackbarOpen) {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            setSnackbarOpen(false);
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 400);
    } else {
      setProgress(0);
    }
    return () => {
      clearInterval(timer);
    };
  }, [snackbarOpen]);

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
          navigate(`/dashboard/MaterialRequest/list`, {
            state: {
              currentPage,
              selectedOption,
              comeBack:"Come_Back_cancel",
              selectedRowIdBack:RowID,
            },
          });
        setIsFormFiled(false);
      }
    });
  }else{
    navigate(`/dashboard/MaterialRequest/list`, {
      state: {
        currentPage,
        selectedOption,
        comeBack:"Come_Back_cancel",
        selectedRowIdBack:RowID,
      },
    });
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
    setIsLoading(true);
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false , customClass: {
      container: "swalcontainercustom",
    }, });
    Swal.showLoading();

    try {

      const responseJson = await httpCommon.get(
        `/get_mr_status_audit.php?site_cd=${site_ID}&RowID=${RowID}`
      );
     //  console.log("responseJson___audit",responseJson);
      if (responseJson.data.status === "SUCCESS") {
        // console.log('get_workordermaster_statusaudit', responseJson.data.data)

        let Status = responseJson.data.data.map((item, index) => {
          let date = new Date(item.mtr_ls2_datetime1.date);
          let formattedDate = date.toLocaleDateString("en-GB"); 
          let formattedTime = date.toLocaleString("default", {
            hour: "numeric",
            minute: "numeric",
            hour12: true, // 3:37 PM
          });
          let formattedWeekday = date.toLocaleString("default", { weekday: "short" }); // Fri
    
          return {
            label: item.mtr_sts_description,
            label1: item.mtr_ls2_varchar2,
            label2: item.emp_mst_name,
            label3: item.audit_user            ,
            label4: `${formattedWeekday} ${formattedDate} ${formattedTime}`,
            label5: formatDuration(item.duration),
            step: index + 1,
          };
        });
    
        setsteps(Status);
        setIsLoading(false);
        Swal.close();
      } else {
        setIsLoading(false);
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responseJson.data.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
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

  const toggleDiv = () => {
    setIsOpenWork(!isOpenWork);
  };

  const [isOpenWorkAssetDtls, setIsOpenWorkAssetDtls] = useState(false);
  const [isOpenWorkAssetDtls2, setIsOpenWorkAssetDtls2] = useState(false);
  const [isOpenWorkAssetDtls3, setIsOpenWorkAssetDtls3] = useState(false);

  const AssetDetailtoggleDiv2 = () => {
    setIsOpenWorkAssetDtls2(!isOpenWorkAssetDtls2);
  };
  const AssetDetailtoggleDiv3 = () => {
    setIsOpenWorkAssetDtls3(!isOpenWorkAssetDtls3);
  };

  const handleDataFromSecondComponent = (data) => {
 //   console.log("data++++++++", data);
    window.location.reload();
  };
  const handleDataFromSecondComponent2 = (data) => {
    //console.log("data++++++++", data);
    setMrLineStorResult((prevResult) => [...prevResult, data]);
   // window.location.reload();
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

const [MrApprovalSubModuleBtn,setMrApprovalSubModuleBtn] = useState("");
  useEffect(() => {
    if (!selected_Status?.label && Status.length > 0) {
      // Set the selected status to the first item in the Status array
      setSelected_Status(Status[0]);
    }
  }, [selected_Status, Status]);
  const handleSubmoduleBtn = (btnClkDataRecived) =>{
    setMrApprovalSubModuleBtn(btnClkDataRecived);
  }

  const handleChange = (event, newValue) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });

    setTabValue(newValue);
    
  };
  return (
    <>
      <Helmet>
        <title>
          {RowID
            ? "CMMS System"
            : DuplicatRowid
            ? "CMMS System"
            : "CMMS System"}
        </title>
        <meta name="description" content="CMMS System" />
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
            height: "105px",
          }}
        >
          <CustomBreadcrumbs
            // heading="Create Work Order"
            heading={
              RowID
                ? `Edit ${AssetNo} Material Request`
                : DuplicatRowid
                ? "Duplicate Asset" 
                : "Create New Material Request"
            }
            links={[
              {
                name: "Asset",
              },
              { name: RowID ? "Update" : "Create" },
            ]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
                {(() => {
                 if (
                    DuplicatRowid !== undefined &&
                    DuplicatRowid !== null &&
                    DuplicatRowid !== ""
                  ) {
                    return (
                      <div>
                        <Button
                          component={RouterLink}
                          //onClick={onClickDuplicate}
                          variant="contained"
                          className="SaveButton"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }}
                        >
                          {Button_save === "Duplicate" ? "Save" : Button_save}
                        </Button>
                        <Button
                          variant="soft"
                          color="error"
                          className="CloseButton"
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
                        <Button
                          component={RouterLink}
                          onClick={onClickChange}
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
                          className="CloseButton"
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
                  MR Master
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
                  MR Detail
                </div>
              }
            />
            <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                        icon="material-symbols:order-approve"
                        style={{ marginRight: "4px" }}
                      />
                  MR Approval List
                </div>
              }
            />
            
             <Tab
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="codicon:references"
                    style={{ marginRight: "4px" }}
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
              
              <Grid container spacing={2}>
                  <Grid xs={12} md={12}>
                    <Card className="mainAssetDiv">
                  
                      <Grid container spacing={2} >
                        <Grid xs={12} md={12}>
                           {/* Asset Master */}
                            <Box
                              role="tabpanel"
                              hidden={Tabvalue !== 0}
                              sx={{ marginTop: "16px" }}
                            >
                              
                                  <Grid container spacing={0}>
                                    <Grid xs={12} md={12}>
                                      <Card className="AssetFirstTab">
                                    
                                      
                                          <Grid container spacing={0}>
                                            <Grid xs={12} md={10}>
                                              {/* ************************************* img  mobile ******************************************* */}
                                              <div className="col-md-2 mobileImgversion">
                                                <div className="row">
                                                  <div className="row ImgShowMobile">
                                                    <div>
                                                      <label htmlFor="upload-button">
                                                        {getDbImg && getDbImg.length > 0 ? (
                                                          <div>
                                                            <img
                                                              src={getDbImg[0].attachment ? `${httpCommon.defaults.baseURL}${getDbImg[0].attachment}` :""}
                                                              className="imgCurPont"
                                                               width="180"
                                                               height="170"
                                                              alt="Base64 Image"
                                                              onClick={openSaveImg}
                                                            />
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
                                                                  marginTop: "10px",
                                                                }}
                                                              >
                                                                <Iconify
                                                                  icon="fluent:delete-48-filled"
                                                                  style={{ fontSize: "24px" }}
                                                                />
                                                                Delete
                                                              </button>
                                                            </div>
                                                          </div>
                                                        ) : image.preview ? (
                                                          <div>
                                                            <img
                                                              src={image.preview}
                                                              alt="dummy"
                                                               width="180"
                                                               height="170"
                                                              className="imgCurPont"
                                                              onClick={openSaveImg}
                                                            />
                                                            <div className="col btnCenter">
                                                              <button
                                                                type="button"
                                                                className="btn dlt"
                                                                onClick={handleClearImg}
                                                                style={{
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                }}
                                                              >
                                                                <Iconify
                                                                  icon="fluent:delete-48-filled"
                                                                  style={{ marginRight: "5px" }}
                                                                />
                                                                Delete
                                                              </button>
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <>
                                                            <span className="fa-stack fa-2x mb-2">
                                                              <img
                                                                 src={require("./Add_Image_icon.png")}
                                                                className="sliderimg2 ffff"
                                                                onClick={(e) =>{
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
                                              <Box>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                      <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        width="100%"
                                                        rowGap={2}
                                                        columnGap={1}
                                                      >
                                                        
                                                        <Stack flexGrow={1} spacing={1} sx={{ pb: 1 }}>
                                                          <Typography variant="subtitle2">
                                                            {findCustomizeLabel("mtr_mst_mtr_no") ||
                                                              "Material Request No"}
                                                          </Typography>
                                                          
                                                          <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            className="Extrasize"
                                                            value={MrRequestNo}
                                                            disabled
                                                         
                                                          />
                                                          
                                                        </Stack>
                                                      </Box>
                                                      <Box
                                                          rowGap={2}
                                                          columnGap={1}
                                                          display="flex"
                                                          alignItems="center" 
                                                          width="100%"
                                                        >
                                                          <Stack flexGrow={1} spacing={1} sx={{ pb: 1 }}>
                                                            <Typography variant="subtitle2" className="Requiredlabel">
                                                              {findCustomizeLabel("mtr_mst_mr_status") ||
                                                                "MR Status:"}
                                                            </Typography>
                                                          
                                                            <Autocomplete
                                                              options={Status}
                                                              value={(selected_Status?.label || "")
                                                              .split(" : ")
                                                              .slice(0, 2)
                                                              .join(" : ")}
                                                              onChange={(event, value) => {

                                                                setSelected_Status(value);
                                                                setIsAssetStatusEmpty(false);
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
                                                                      isAssetStatusEmpty
                                                                        ? "errorEmpty"
                                                                        : ""
                                                                    }`}
                                                                  
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
                                                            disabled={Button_save == "Save" || Button_save == "Duplicate"}  
                                                            arrow
                                                            arrowTransform="translateY(4px)" // Adjust the translateY value to adjust the space between the Tooltip and the IconButton
                                                          
                                                          >
                                                            <IconButton onClick={StatushandleShow}>
                                                              <Iconify
                                                                icon="pajamas:status-alert"
                                                                
                                                              />
                                                            </IconButton>
                                                          </Tooltip>

                                                      
                                                        </Box>

                                                             <Stack spacing={1} sx={{ pb: 1 }}>
                                                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_mst_requester")}>
                                                                {findCustomizeLabel("mtr_mst_requester") ||
                                                                  "Requester:"}
                                                              </Typography>
                                                              <Autocomplete
                                                              options={Mr_requester}
                                                              value={(selected_Mr_requester?.label || "")
                                                              .split(" : ")
                                                              .slice(0, 2)
                                                              .join(" : ")}
                                                              onChange={(event, value) => {
                                                            
                                                                setSelected_Mr_requester(value);
                                                                ///setIsAssetStatusEmpty(false);
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
                                                                      isAssetStatusEmpty
                                                                        ? "errorEmpty"
                                                                        : ""
                                                                    }`}
                                                                  
                                                                    ref={autocompleteRef}
                                                                  />
                                                                </div>
                                                              )}
                                                            />
                                                            </Stack>  
                                                            <Stack spacing={1} sx={{ pb: 1 }}>
                                                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_mst_wo_no")}>
                                                                {findCustomizeLabel("mtr_mst_wo_no") ||
                                                                  "Work Order No"}
                                                              </Typography>
                                                              <div ref={CustomerCodeRef}>
                                                                <CustomTextField
                                                                  id="outlined-basic"
                                                                  variant="outlined"
                                                                  size="small"
                                                                  className={`ExtrasizeDisable ${
                                                                    isAssetNoEmpty ? "errorEmpty" : ""
                                                                  }`}
                                                                  
                                                                  fullWidth
                                                                  value={CustomerCode || ""}
                                                                  autoComplete="off"
                                                                  placeholder="Select..."
                                                                  sx={{
                                                                    '& .MuiInputBase-input::placeholder': {
                                                                      color: '#919eab', // Set placeholder color to #919eab
                                                                    },
                                                                  }}
                                                                  disabled={RowID ? true : false}
                                                                  rightIcons={[
                                                                    <Iconify
                                                                      icon="material-symbols:close"
                                                                      
                                                                      onClick={() => {
                                                                        if (!RowID) handleCancelClickWorkOrderNo(); // Only call if RowID is empty
                                                                      }}
                                                                    />,
                                                                    <Iconify
                                                                      icon="tabler:edit"
                                                                      
                                                                      onClick={() => {
                                                                        if (!RowID) handleEditClickWorkOrderNo(); // Only call if RowID is empty
                                                                      }}
                                                                    />,
                                                                  ]}
                                                                />
                                                              </div>
                                                            </Stack>  
                                                            <Stack spacing={1} sx={{ pb: 1 }}>
                                                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_mst_assetno")}>
                                                                {findCustomizeLabel("mtr_mst_assetno") ||
                                                                  "Asset No:"}
                                                              </Typography>
                                                              <div ref={CustomerCodeRef}>
                                                                <CustomTextField
                                                                  id="outlined-basic"
                                                                  variant="outlined"
                                                                  size="small"
                                                                  className={`ExtrasizeDisable ${
                                                                    isAssetNoEmpty ? "errorEmpty" : ""
                                                                  }`}
                                                                  
                                                                  fullWidth
                                                                  value={CustomerCodeAssetNO || CustomerAssetNoCode}
                                                                  autoComplete="off"
                                                                  //disabled={!!CustomerAssetNoCode}
                                                                  placeholder="Select..."
                                                                  sx={{
                                                                    '& .MuiInputBase-input::placeholder': {
                                                                      color: '#919eab', // Set placeholder color to #919eab
                                                                    },
                                                                  }}
                                                                  disabled={!!RowID || !!CustomerAssetNoCode }
                                                                  rightIcons={[
                                                                    <Iconify
                                                                      icon="material-symbols:close"
                                                                      //onClick={handleCancelClickCustomeCode}
                                                                     // onClick={!CustomerAssetNoCode ? //handleCancelClickCustomeCode : undefined} 
                                                                     onClick={RowID ? undefined : (!CustomerAssetNoCode ? handleCancelClickCustomeCode : undefined)}
                                                                    />,
                                                                    <Iconify
                                                                      icon="tabler:edit"
                                                                    //  onClick={handleEditClickCustomerCode}
                                                                      // onClick={!CustomerAssetNoCode ? handleEditClickCustomerCode : undefined} 
                                                                      onClick={RowID ? undefined : (!CustomerAssetNoCode ? handleEditClickCustomerCode : undefined)}
                                                                    />,
                                                                  ]}
                                                                />
                                                              </div>
                                                            </Stack> 

                                                            <Stack spacing={1} sx={{ pb: 1 }}>
                                                            <Typography variant="subtitle2" className="Requiredlabel">
                                                              {findCustomizeLabel("mtr_mst_costcenter") ||
                                                                "Cost Center:"}
                                                            </Typography>

                                                            <Autocomplete
                                                              options={Charge_Cost_Center}
                                                              value={(selected_Charge_Cost_Center?.label || "")
                                                                .split(" : ")
                                                                .slice(0, 2)
                                                                .join(" : ")}
                                                                onChange={(event, value) => {
                                                                  setSelected_Charge_Cost_Center(value);
                                                                  setIsAssetCriticalFactorEmpty(false);
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
                                                                      isAssetCriticalFactorEmpty
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

                                                            <Stack spacing={1} sx={{ pb: 1 }}>
                                                              <Typography variant="subtitle2" className="Requiredlabel">
                                                                {findCustomizeLabel("mtr_mst_account") ||
                                                                  "Account:"}
                                                              </Typography>

                                                              <Autocomplete
                                                                options={MrAccount}
                                                                value={(selected_MrAccount?.label || "")
                                                                  .split(" : ")
                                                                  .slice(0, 2)
                                                                  .join(" : ")}
                                                                  onChange={(event, value) => {
                                                                    setselected_MrAccount(value);
                                                                    setIsAssetShortDescEmpty(false);
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
                                                                        isAssetShortDescEmpty
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
                                                     
                                                     
                                                      <Stack spacing={1}>
                                                          <Typography variant="subtitle2">
                                                            {findCustomizeLabel("mtr_mst_note") ||
                                                              "Note1:"}
                                                          </Typography>
                                                          <TextareaAutosize
                                                            aria-label="empty textarea"
                                                          // minRows={6.5}
                                                            value={Note1}
                                                            onChange={(e) => {
                                                              const value = e.target.value;
                                                              if (value.length <= 1000) {
                                                                setNote1(value);
                                                              }
                                                              setIsNoteEmpty(false);
                                                              setIsFormFiled(true);
                                                              }}
                                                              style={{ resize: 'none', width: '100%' }}
                                                          //  className="TxtAra"
                                                            className={`Extrasize ${
                                                              isNoteEmpty
                                                                ? "errorEmpty second"
                                                                : "TxtAra second"
                                                            }`}
                                                          />
                                                        </Stack>
                                                        
                                                      </Grid>
                                                      <Grid item xs={12} md={6}>
                                                      <Stack flexGrow={1} spacing={1} sx={{ pb: 1 }}>
                                                          <Typography variant="subtitle2">
                                                            {findCustomizeLabel("mtr_mst_entered_by") ||
                                                              "Entered By"}
                                                          </Typography>
                                                          
                                                          <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            className="Extrasize"
                                                            value={EnteredBy ? EnteredBy : Emp_logonId}
                                                            disabled
                                                          
                                                          />
                                                         
                                                        </Stack>
                                                        <Stack flexGrow={1} spacing={1} sx={{ pb: 1 }}>
                                                          <Typography variant="subtitle2">
                                                            {findCustomizeLabel("mtr_mst_status") ||
                                                              "MR Approval Status:"}
                                                          </Typography>
                                                          
                                                          <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            className="Extrasize"
                                                            value={MrApprovalStatus}
                                                             disabled
                                                        
                                                          />
                                                          
                                                        </Stack>
                                                        <Stack flexGrow={1} spacing={1} sx={{ pb: 1 }}>
                                                          <Typography variant="subtitle2">
                                                            {findCustomizeLabel("ast_mst_asset_no1") ||
                                                              "Approval Process:"}
                                                          </Typography>
                                                          
                                                          <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            className="Extrasize"
                                                            value={MrApprovalProcess}
                                                            disabled
                                                            
                                                          />
                                                          
                                                        </Stack>
                                                      <Stack flexGrow={1} spacing={1} sx={{ pb: 1 }}>
                                                          <Typography variant="subtitle2">
                                                            {findCustomizeLabel("mtr_mst_approver") ||
                                                              "Next Approver:"}
                                                          </Typography>
                                                         
                                                          <TextField
                                                            variant="outlined"
                                                            size="small"
                                                            className="Extrasize"
                                                            value={NextApprover}
                                                            disabled
                                                            
                                                          />
                                                          
                                                        </Stack>
                                                      <Box
                                                          rowGap={2}
                                                          columnGap={2}
                                                          display="grid"
                                                          gridTemplateColumns={{
                                                            xs: "repeat(1, 1fr)",
                                                            sm: "repeat(2, 1fr)",
                                                            rowGap: "0px",
                                                          }}
                                                         
                                                          sx={{ alignItems: 'stretch' }}
                                                        >
                                                         

                                                       <Stack spacing={1} sx={{ pb: 1 ,height: '100%'}} className="dateIconCss">
                                                        <Typography variant="subtitle2">
                                                          {findCustomizeLabel("mtr_mst_org_date") ||
                                                            "Origination Date"}
                                                        </Typography>

                                                        <AntDatePicker
                                                              value={OriginationDate ? dayjs(OriginationDate) : null}
                                                              format="DD/MM/YYYY" 
                                                              placeholder="DD/MM/YYYY"
                                                              showTime 
                                                             // disabled={statusKey === "CLO"}
                                                             onChange={(newDate) => {
                                                              if (newDate && newDate.isValid()) {
                                                                const nativeDate = newDate.toDate();
                                                                setOriginationDate(nativeDate);
                                                              } else {
                                                                setOriginationDate(null);
                                                              }
                                                             // setErrorField(null);
                                                              setIsFormFiled(true);
                                                            }}
                                                              allowClear={false}
                                                            
                                                              
                                                            />
                                                      </Stack>
                                                      <Stack spacing={1} sx={{ pb: 1 ,height: '100%'}} className="dateIconCss">
                                                        <Typography variant="subtitle2">
                                                          {findCustomizeLabel("mtr_mst_req_date") ||
                                                            "Required Date:"}
                                                        </Typography>

                                                        

                                                        <AntDatePicker
                                                              value={RequiredDate ? dayjs(RequiredDate) : null}
                                                              format="DD/MM/YYYY" 
                                                              placeholder="DD/MM/YYYY"
                                                              showTime 
                                                              onChange={(newDate) => {
                                                                if (newDate && newDate.isValid()) {
                                                                  const nativeDate = newDate.toDate();
                                                                  setRequiredDate(nativeDate);
                                                                } else {
                                                                  setRequiredDate(null);
                                                                }
                                                               // setErrorField(null);
                                                                setIsFormFiled(true);
                                                              }}
                                                              allowClear={false}
                                                            
                                                              
                                                            />
                                                      </Stack>
                                                          
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
                                                         
                                                          sx={{ alignItems: 'stretch' }}
                                                        >
                                                       <Stack spacing={1} sx={{ pb: 1 ,height: '100%'}} className="dateIconCss">
                                                        <Typography variant="subtitle2">
                                                          {findCustomizeLabel("mtr_mst_release_for_app") ||
                                                            "Release For Approval:"}
                                                        </Typography>
                                                     
                                                        <div className="CustomeMRCheckbOx">
                                                            <FormControlLabel
                                                              control={<Checkbox color="primary" sx={{ ml: 0 }} />}
                                                              checked={ReleaseAproval}
                                                              onChange={(event) => {
                                                                const newValue = event.target.checked ? 1 : 0; // Set value to 1 when checked, 0 when unchecked
                                                                handleOnChangeReleaseAproval(newValue);
                                                                setIsFormFiled(true);
                                                              }}
                                                              labelPlacement="start" // Place the label on the left
                                                            />
                                                          </div>

 

                                                      </Stack>
                                                      <Stack spacing={1} sx={{ pb: 1 ,height: '100%'}} className="dateIconCss">
                                                        <Typography variant="subtitle2">
                                                          {findCustomizeLabel("mtr_mst_email_requestor") ||
                                                            "Email Requested By:"}
                                                        </Typography>
    
                                                        <div className="CustomeMRCheckbOx">
                                                            <FormControlLabel
                                                              control={<Checkbox color="primary" sx={{ ml: 0 }} />}
                                                              
                                                              checked={Number(EmlReqBy) === 1}
                                                              onChange={(event) => {
                                                                const newValue = event.target.checked ? 1 : 0; // Set value to 1 when checked, 0 when unchecked
                                                                handleOnChangeEmlReqBy(newValue);
                                                                setIsFormFiled(true);
                                                              }}
                                                              labelPlacement="start" // Place the label on the left
                                                            />
                                                          </div>
                                                      </Stack>
                                                          
                                                        </Box>
                                                        <Box
                                                          rowGap={1}
                                                          columnGap={1}
                                                          display="grid"
                                                          
                                                          marginBottom={1}
                                                        >
                                                        <Stack spacing={1} sx={{ pb: 1 ,height: '100%'}} className="dateIconCss">
                                                        <Typography variant="subtitle2">
                                                          {findCustomizeLabel("mtr_mst_email_notification") ||
                                                            "Email Notification:"}
                                                        </Typography>
                                                         
                                                        <div className="CustomeMRCheckbOx">
                                                            <FormControlLabel
                                                              control={<Checkbox color="primary" sx={{ ml: 0 }} />}
                                                              checked={Number(EmlNotification) === 1}
                                                             
                                                              onChange={(event) => {
                                                                const newValue = event.target.checked ? 1 : 0; // Set value to 1 when checked, 0 when unchecked
                                                                handleOnChangeEmlNotofication(newValue);
                                                                setIsFormFiled(true);
                                                              }}
                                                              labelPlacement="start" // Place the label on the left
                                                            />
                                                          </div>
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
                                                                     src={require("./Add_Image_icon.png")}
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
                              
                              
                            </Box>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
              </Grid>

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
                        <button className="ToggleBttnIcon" onClick={toggleDiv}>
                          <Iconify
                            icon="clarity:form-line"
                            style={{ marginRight: "5px", width: "17px" }}
                          />
                          MR Line
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
                        <>
                         <Grid container>
                            <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                              <Card className="AssetDetail">
                               
                                  <MR_Line
                                    data={{
                                      RowID: RowID,
                                      MrNo:MrRequestNo,
                                      WorkOrderNo:CustomerCode,
                                      AuditUser:Emp_logonId

                                    }}
                                    
                                    onDataFromSecondComponent={
                                      handleDataFromSecondComponent2
                                    }
                                  />
                                
                              </Card>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </Card>
                  </Grid>
                </Grid>
                
                </div>
              
                </>
                )}
                <Box
                  role="tabpanel"
                  hidden={Tabvalue !== 1}
                  
                >
                    <Grid container>
                      <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                       <Card className="AssetDetail">
                       <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar1")}>
                              {findCustomizeLabelDet("mtr_det_varchar1") ||
                               "Varchar1:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={UDFText_1}
                              autoComplete="off"
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_1(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar1" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar2")}>
                              {findCustomizeLabelDet("mtr_det_varchar2") ||
                               "Varchar2:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_2}
                              onChange={(e) => {

                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_2(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar2" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar3")}>
                              {findCustomizeLabelDet("mtr_det_varchar3") ||
                                "Varchar3:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_3}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_3(value);
                                }
                                setErrorField(null);
                                setIsFormFiled(true); 
                              }}
                              className={errorField === "mtr_det_varchar3" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar4")}>
                              {findCustomizeLabelDet("mtr_det_varchar4") ||
                                "Varchar4:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_4}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_4(value);
                                }
                                setErrorField(null); 
                              }}
                              className={errorField === "ast_det_varchar14" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar5")}>
                              {findCustomizeLabelDet("mtr_det_varchar5") ||
                                "Varchar5:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_5}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_5(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar5" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar6")}>
                              {findCustomizeLabelDet("mtr_det_varchar6") ||
                               "Varchar6:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_6}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_6(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar6" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar7")}>
                              {findCustomizeLabelDet("mtr_det_varchar7") ||
                                "Varchar7:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_7}
                              onChange={(e) => {

                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_7(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar7" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar8")}>
                              {findCustomizeLabelDet("mtr_det_varchar8") ||
                                "Varchar8:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_8}
                              onChange={(e) => {
                              
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_8(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar8" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar9")}>
                              {findCustomizeLabelDet("mtr_det_varchar9") ||
                                 "Varchar9:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_9}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_9(value);
                                }
                                setErrorField(null);
                                setIsFormFiled(true); 
                              }}
                              className={errorField === "mtr_det_varchar9" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar10")}>
                              {findCustomizeLabelDet("mtr_det_varchar10") ||
                                "Varchar10:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_10}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_10(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar10" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar11")}>
                              {findCustomizeLabelDet("mtr_det_varchar11") ||
                                "Varchar11:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_11}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_11(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar11" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar12")}>
                              {findCustomizeLabelDet("mtr_det_varchar12") ||
                                "Varchar12:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_12}
                              onChange={(e) => {

                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_12(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar12" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar13")}>
                              {findCustomizeLabelDet("mtr_det_varchar13") ||
                                  "Varchar13:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_13}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_13(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar13" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar14")}>
                              {findCustomizeLabelDet("mtr_det_varchar14") ||
                               "Varchar14:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_14}
                              onChange={(e) => {

                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_14(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar14" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar15")}>
                              {findCustomizeLabelDet("mtr_det_varchar15") ||
                                "Varchar15:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_15}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_15(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar15" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar16")}>
                              {findCustomizeLabelDet("mtr_det_varchar16") ||
                                "Varchar16:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_16}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_16(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar16" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar17")}>
                              {findCustomizeLabelDet("mtr_det_varchar17") ||
                                "Varchar17:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_17}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_17(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar17" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar18")}>
                              {findCustomizeLabelDet("mtr_det_varchar18") ||
                                 "Varchar18:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_18}
                              onChange={(e) => {

                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_18(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar18" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar19")}>
                              {findCustomizeLabelDet("mtr_det_varchar19") ||
                               "Varchar19:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              autoComplete="off"
                              fullWidth
                              value={UDFText_19}
                              onChange={(e) => {
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_19(value);
                                  }
                                
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar19" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar20")}>
                              {findCustomizeLabelDet("mtr_det_varchar20") ||
                               "Varchar20:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_20}
                              onChange={(e) => {
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_20(value);
                                  }
                                setErrorField(null);  
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar20" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar21")}>
                              {findCustomizeLabelDet("mtr_det_varchar21") ||
                               "Varchar21:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_21}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                if (value.length <= 100) {
                                  setUDFText_21(value);
                                }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar21" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar22")}>
                              {findCustomizeLabelDet("mtr_det_varchar22") ||
                                "Varchar22:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_22}
                              onChange={(e) => {

                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_22(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar22" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar23")}>
                              {findCustomizeLabelDet("mtr_det_varchar23") ||
                                "Varchar23:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_23}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_23(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar23" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar24")}>
                              {findCustomizeLabelDet("mtr_det_varchar24") ||
                               "Varchar24:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_24}
                              onChange={(e) => {

                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_24(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar24" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar25")}>
                              {findCustomizeLabelDet("mtr_det_varchar25") ||
                                "Varchar25:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_25}
                              onChange={(e) => {
                                
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_25(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar25" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar26")}>
                              {findCustomizeLabelDet("mtr_det_varchar26") ||
                                "Varchar26:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_26}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_26(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar26" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar27")}>
                              {findCustomizeLabelDet("mtr_det_varchar27") ||
                               "Varchar27:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_27}
                              onChange={(e) => {
                               
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_27(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar27" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar28")}>
                              {findCustomizeLabelDet("mtr_det_varchar28") ||
                                 "Varchar28:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_28}
                              onChange={(e) => {

                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_28(value);
                                  }
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar28" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar29")}>
                              {findCustomizeLabelDet("mtr_det_varchar29") ||
                              "Varchar29:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              autoComplete="off"
                              fullWidth
                              value={UDFText_29}
                              onChange={(e) => {
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_29(value);
                                  }
                                
                                setErrorField(null); 
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar29" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_varchar30")}>
                              {findCustomizeLabelDet("mtr_det_varchar30") ||
                               "Varchar30:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              value={UDFText_30}
                              onChange={(e) => {
                                const value = e.target.value;
                                  if (value.length <= 100) {
                                    setUDFText_30(value);
                                  }
                                setErrorField(null);  
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_varchar30" ? "erroBorderadd" : ""}
                            />
                          </Stack>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                  </Grid>
            
            {/*UDF Numeric */}
                  <Grid container spacing={0} sx={{pb:1.5}}>
                    <Grid xs={12} md={12}>
                      <Card sx={{ padding: "10px 24px 10px 24px" }}>
                      <div style={{ display: "flex" }}>
                        <button className="ToggleBttnIcon" onClick={AssetDetailtoggleDiv2}>
                          <Iconify
                            icon="carbon:user-x-ray"
                            style={{ marginRight: "5px", width: "17px" }}
                          />
                          UDF Numeric 
                          {isOpenWorkAssetDtls2 ? (
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
                      {isOpenWorkAssetDtls2 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric1")}>
                              {findCustomizeLabelDet("mtr_det_numeric1") ||
                                "Numeric1:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              type="text"
                              placeholder=".0000"
                              value={UDFNumber_1}
                              
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_1);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric1" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric2")}>
                              {findCustomizeLabelDet("mtr_det_numeric2") ||
                                 "Numeric2:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                               placeholder=".0000"
                              type="text"
                              autoComplete="off"
                              fullWidth
                              value={UDFNumber_2}
                             
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_2);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric2" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric3")}>
                              {findCustomizeLabelDet("mtr_det_numeric3") ||
                                "Numeric3:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                               placeholder=".0000"
                              type="text"
                              value={UDFNumber_3}
                             
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_3);
                                }
                            
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric3" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric4")}>
                              {findCustomizeLabelDet("mtr_det_numeric4") ||
                                "Numeric4:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              autoComplete="off"
                              type="text"
                               placeholder=".0000"
                              fullWidth
                              value={UDFNumber_4}
                             
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_4);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric4" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric5")}>
                              {findCustomizeLabelDet("mtr_det_numeric5") ||
                                "Numeric5:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              autoComplete="off"
                              type="text"
                               placeholder=".0000"
                              fullWidth
                              value={UDFNumber_5}
                             
                              onChange={(e) => {
                       
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_5);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric5" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                            </Grid> 
                            <Grid item xs={12} md={4}>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric6")}>
                              {findCustomizeLabelDet("mtr_det_numeric6") ||
                                "Numeric6:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                              type="text"
                              placeholder=".0000"
                              value={UDFNumber_6}
                              
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_6);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric6" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric7")}>
                              {findCustomizeLabelDet("mtr_det_numeric7") ||
                                "Numeric7:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                               placeholder=".0000"
                              type="text"
                              autoComplete="off"
                              fullWidth
                              value={UDFNumber_7}
                             
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_7);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric7" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric8")}>
                              {findCustomizeLabelDet("mtr_det_numeric8") ||
                                "Numeric8:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              fullWidth
                              autoComplete="off"
                               placeholder=".0000"
                              type="text"
                              value={UDFNumber_8}
                             
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_8);
                                }
                            
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric8" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric9")}>
                              {findCustomizeLabelDet("mtr_det_numeric9") ||
                               "Numeric9:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              autoComplete="off"
                              type="text"
                               placeholder=".0000"
                              fullWidth
                              value={UDFNumber_9}
                             
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_9);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric9" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric10")}>
                              {findCustomizeLabelDet("mtr_det_numeric10") ||
                                 "Numeric10:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              autoComplete="off"
                              type="text"
                               placeholder=".0000"
                              fullWidth
                              value={UDFNumber_10}
                             
                              onChange={(e) => {
                       
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_10);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric10" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                            </Grid>
                            <Grid item xs={12} md={4}>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric11")}>
                              {findCustomizeLabelDet("mtr_det_numeric11") ||
                                "Numeric11:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              autoComplete="off"
                              type="text"
                              fullWidth
                               placeholder=".0000"
                              value={UDFNumber_11}
                            
                              onChange={(e) => {
                            
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_11);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric11" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric12")}>
                              {findCustomizeLabelDet("mtr_det_numeric12") ||
                               "Numeric12:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              type="text"
                              autoComplete="off"
                               placeholder=".0000"
                              fullWidth
                              value={UDFNumber_12}
                             
                              onChange={(e) => {
                             
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_12);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric12" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric13")}>
                              {findCustomizeLabelDet("mtr_det_numeric13") ||
                               "Numeric13:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              type="text"
                              autoComplete="off"
                              placeholder=".0000"
                              fullWidth
                              value={UDFNumber_13}
                             
                              onChange={(e) => {
                              
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_13);
                                }
                                
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric13" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric14")}>
                              {findCustomizeLabelDet("mtr_det_numeric14") ||
                                "Numeric14:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              autoComplete="off"
                              type="text"
                             placeholder=".0000"
                              fullWidth
                              value={UDFNumber_14}
                              
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_14);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric14" ? "erroBorderadd" : ""}
                              InputProps={{
                                inputProps: { style: { textAlign: 'right' } }
                              }}
                            />
                          </Stack>
                          <Stack spacing={1} sx={{ pb: 1.5 }}>
                            <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_numeric15")}>
                              {findCustomizeLabelDet("mtr_det_numeric15") ||
                                 "Numeric15:"}
                            </Typography>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              size="small"
                              type="text"
                              autoComplete="off"
                              placeholder=".0000"
                              fullWidth
                              value={UDFNumber_15}
                              
                              onChange={(e) => {
                              
                                const value = e.target.value;
                                if (value.length === 0 || value[0] !== '0') {
                                  handleNumericInputChange(e, setUDFNumber_15);
                                }
                                setIsFormFiled(true);
                              }}
                              className={errorField === "mtr_det_numeric15" ? "erroBorderadd" : ""}
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
            {/*UDF DATE */}
              <Grid container spacing={0} sx={{pb:1.5}}>
                    <Grid xs={12} md={12}>
                      <Card sx={{ padding: "10px 24px 10px 24px" }}>
                      <div style={{ display: "flex" }}>
                        <button className="ToggleBttnIcon" onClick={AssetDetailtoggleDiv3}>
                          <Iconify
                            icon="clarity:date-solid-badged"
                            style={{ marginRight: "5px", width: "17px" }}
                          />
                          UDF Datetime 
                          {isOpenWorkAssetDtls3 ? (
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
                      {isOpenWorkAssetDtls3 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime1")}>
                                {findCustomizeLabelDet("mtr_det_datetime1") ||
                                  "Datetime1:"}
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
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime1" ? "erroBorderadd" : "Extrasize"}
                                    />
                              
                            </Stack>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime2")}>
                                {findCustomizeLabelDet("mtr_det_datetime2") ||
                                 "Datetime2:"}
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
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime2" ? "erroBorderadd" : "Extrasize"}
                                    />
                            </Stack>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime3")}>
                                {findCustomizeLabelDet("mtr_det_datetime3") ||
                                   "Datetime3:"}
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
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime3" ? "erroBorderadd" : "Extrasize"}
                                    />

                            </Stack>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime4")}>
                                {findCustomizeLabelDet("mtr_det_datetime4") ||
                                   "Datetime4:"}
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
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime4" ? "erroBorderadd" : "Extrasize"}
                                    />

                            </Stack>
                            <Stack spacing={1} sx={{ pb: 1.5 }}>
                              <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime5")}>
                                {findCustomizeLabelDet("mtr_det_datetime5") ||
                                   "Datetime5:"}
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
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime5" ? "erroBorderadd" : "Extrasize"}
                                    />
                            </Stack>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime6")}>
                                      {findCustomizeLabelDet("mtr_det_datetime6") ||
                                        "Datetime6:"}
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
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime6" ? "erroBorderadd" : "Extrasize"}
                                    />

                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime7")}>
                                      {findCustomizeLabelDet("mtr_det_datetime7") ||
                                        "Datetime7:"}
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
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime7" ? "erroBorderadd" : "Extrasize"}
                                    />
                                    
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime8")}>
                                      {findCustomizeLabelDet("mtr_det_datetime8") ||
                                        "Datetime8:"}
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
                                        setErrorField(null); 
                                        setIsFormFiled(true);
                                      }}
                                      allowClear={false}
                                      className={errorField === "mtr_det_datetime8" ? "erroBorderadd" : "Extrasize"}
                                      />

                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime9")}>
                                      {findCustomizeLabelDet("mtr_det_datetime9") ||
                                       "Datetime9:"}
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
                                        setErrorField(null); 
                                        setIsFormFiled(true);
                                      }}
                                      allowClear={false}
                                      className={errorField === "mtr_det_datetime9" ? "erroBorderadd" : "Extrasize"}
                                      />
                                    
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime10")}>
                                      {findCustomizeLabelDet("mtr_det_datetime10") ||
                                        "Datetime10:"}
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
                                        setErrorField(null); 
                                        setIsFormFiled(true);
                                      }}
                                      allowClear={false}
                                      className={errorField === "mtr_det_datetime10" ? "erroBorderadd" : "Extrasize"}
                                      />

                                  </Stack>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime11")}>
                                      {findCustomizeLabelDet("mtr_det_datetime11") ||
                                       "Datetime11:"}
                                    </Typography>

                                    <AntDatePicker 
                                    value={UDFDate_11 ? dayjs(UDFDate_11) : null}  
                                    format="DD/MM/YYYY"    
                                    placeholder="DD/MM/YYYY" 
                                    onChange={(newDate) => {
                                      if (newDate && newDate.isValid()) {
                                      const nativeDate = newDate.toDate(); 
                                      setUDFDate_11(nativeDate); 
                                      } else {
                                        setUDFDate_11(null); 
                                      }
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime11" ? "erroBorderadd" : "Extrasize"}
                                    />

                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime12")}>
                                      {findCustomizeLabelDet("mtr_det_datetime12") ||
                                         "Datetime12:"}
                                    </Typography>
                                    <AntDatePicker 
                                    value={UDFDate_12 ? dayjs(UDFDate_12) : null}  
                                    format="DD/MM/YYYY"    
                                    placeholder="DD/MM/YYYY" 
                                    onChange={(newDate) => {
                                      if (newDate && newDate.isValid()) {
                                      const nativeDate = newDate.toDate(); 
                                      setUDFDate_12(nativeDate); 
                                      } else {
                                        setUDFDate_12(null); 
                                      }
                                      setErrorField(null); 
                                      setIsFormFiled(true);
                                    }}
                                    allowClear={false}
                                    className={errorField === "mtr_det_datetime12" ? "erroBorderadd" : "Extrasize"}
                                    />
                                    
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime13")}>
                                      {findCustomizeLabelDet("mtr_det_datetime13") ||
                                         "Datetime13:"}
                                    </Typography>

                                    <AntDatePicker 
                                      value={UDFDate_13 ? dayjs(UDFDate_13) : null}  
                                      format="DD/MM/YYYY"    
                                      placeholder="DD/MM/YYYY" 
                                      onChange={(newDate) => {
                                        if (newDate && newDate.isValid()) {
                                        const nativeDate = newDate.toDate(); 
                                        setUDFDate_13(nativeDate); 
                                        } else {
                                          setUDFDate_13(null); 
                                        }
                                        setErrorField(null); 
                                        setIsFormFiled(true);
                                      }}
                                      allowClear={false}
                                      className={errorField === "mtr_det_datetime13" ? "erroBorderadd" : "Extrasize"}
                                      />

                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime14")}>
                                      {findCustomizeLabelDet("mtr_det_datetime14") ||
                                        "Datetime14:"}
                                    </Typography>
                                    <AntDatePicker 
                                      value={UDFDate_14 ? dayjs(UDFDate_14) : null}  
                                      format="DD/MM/YYYY"    
                                      placeholder="DD/MM/YYYY" 
                                      onChange={(newDate) => {
                                        if (newDate && newDate.isValid()) {
                                        const nativeDate = newDate.toDate(); 
                                        setUDFDate_14(nativeDate); 
                                        } else {
                                          setUDFDate_14(null); 
                                        }
                                        setErrorField(null); 
                                        setIsFormFiled(true);
                                      }}
                                      allowClear={false}
                                      className={errorField === "mtr_det_datetime14" ? "erroBorderadd" : "Extrasize"}
                                      />
                                    
                                  </Stack>
                                  <Stack spacing={1} sx={{ pb: 1.5 }}>
                                    <Typography variant="subtitle2" className={findCustomizerequiredLabel("mtr_det_datetime15")}>
                                      {findCustomizeLabelDet("mtr_det_datetime15") ||
                                       "Datetime15:"}
                                    </Typography>

                                    <AntDatePicker 
                                      value={UDFDate_15 ? dayjs(UDFDate_15) : null}  
                                      format="DD/MM/YYYY"    
                                      placeholder="DD/MM/YYYY" 
                                      onChange={(newDate) => {
                                        if (newDate && newDate.isValid()) {
                                        const nativeDate = newDate.toDate(); 
                                        setUDFDate_15(nativeDate); 
                                        } else {
                                          setUDFDate_15(null); 
                                        }
                                        setErrorField(null); 
                                        setIsFormFiled(true);
                                      }}
                                      allowClear={false}
                                      className={errorField === "mtr_det_datetime15" ? "erroBorderadd" : "Extrasize"}
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
                      <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                          <Card className="AssetDetail">
                          {  RowID ? (
                            <Mr_ApprovalList
                              data={{
                                RowID: RowID,
                                formStatus: "EDIT", 
                              }}
                              onDataFromSecondComponent={
                                handleDataFromSecondComponent
                              }
                            />
                          ) :   !RowID ? (
                            <Mr_ApprovalList
                              data={{
                                formStatus: "NEW", 
                              }}
                              onRowClick={handleSubmoduleBtn}
                            />
                          ) : null}
                          </Card>
                       </Grid>
                    </Grid>

                </Box>
                  
                    <Box
                      role="tabpanel"
                      hidden={Tabvalue !== 3}
                     
                    >
                       <Grid container>
                      <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                       <Card className="AssetDetail">
                       
                        
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
                                  justifyContent: "space-between", // Space between icon/text and button
                                  flexWrap: "nowrap", // Prevent wrapping to new lines
                                  width: "100%", // Ensure full width
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
                                  <Button  type="submit"   className="AddNewButton"  onClick={handleButtonClick}>
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
                                           onClick={() =>
                                             handleDeleteReferenceApi(item.RowID)
                                           }
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
                                     
                                   ) : image.name.toLowerCase().endsWith(".php") ? (
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
                                   //onClose={handleClosedd}

                                   onClose={(event, reason) => {
                                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                                      handleClosedd(event, reason);
                                    }
                                  }}
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
                                        // src={selectedImage}
                                         src={selectedImage ? `${httpCommon.defaults.baseURL}${selectedImage}` :""}
                                         style={{ width: "100%", height: "auto" }}
                                       />
                                     </Typography>
                                   </DialogContent>
                                 </BootstrapDialog>
                               ) : (
                                 <BootstrapDialog
                                  
                                   onClose={(event, reason) => {
                                    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                                      handleClosedd(event, reason);
                                    }
                                  }}
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
                                      
                              </div>
                            </form>
                          </div>
                         </div>
                         
                       </Card>
                       </Grid>
                       </Grid>
                     
                    </Box>
              {/* toggle view End */}

             
              {/* Asset Parent Flag model popup */}
              <BootstrapDialog
               // onClose={handleCloseModal}
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
                  Parent ID
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
                   // color: (theme) => theme.palette.grey[500],
                  }}
                >
                 <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                </IconButton>
                <DialogContent dividers>
                  <div className="TblSelect">
                    <AssetParentIdList
                      onRowClick={handleRowData2}
                      onChangePage={handleRowDataPagechg}
                      onSearchChange={handelRowSearch}
                      asset={AssetNo}
                      
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
                      &nbsp;Asset
                    </span>
                  </div>

                  <div className="mlauto">
                    <Button variant="primary"  className="SaveButton" 
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "10px",
                          }} onClick={handleCloseModal}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
              {/* Asset model popup end*/}

               {/* Work Order Code model popup */}
               <BootstrapDialog
               // onClose={handleCloseModalWorkOrderNo}
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseModalWorkOrderNo(event, reason);
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={modalOpenWorkOrderNo}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Work Order No
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalWorkOrderNo}
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
                  <div className="TblSelect">
                    <MrWorkOrderList
                      onRowClick={handleRowData3}
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
                    <Button variant="primary" onClick={handleCloseModalWorkOrderNo}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>
               {/* Work Order code model popup end*/}

                {/* Asset Customer Code model popup */}
                <BootstrapDialog
                //onClose={handleCloseModalCustomeCode}
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseModalCustomeCode(event, reason);
                  }
                }}
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
                  Asset No
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalCustomeCode}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    padding:"0px !important",
                    margin:"5px !important",
                    //color: (theme) => theme.palette.grey[500],
                  }}
                >
                 <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                </IconButton>
                <DialogContent dividers>
                  <div className="TblSelect">
                    <AssetCustomerCodeList
                      onRowClick={handleRowData4}
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
                    MR Status Audit
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={StatushandleClose}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      padding:"0px !important",
                       margin:"5px !important",
                      //color: (theme) => theme.palette.grey[500],
                    }}
                  >
                   <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                  </IconButton>
                  <DialogContent dividers>
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
                    )}
                  </DialogContent>
                </BootstrapDialog>
              </div>
              {/******************** Comments add Details ********************/}

              {/* single Upload Img Show */}
              <BootstrapDialog
                //onClose={UploadImghandleClose}
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
                    //color: (theme) => theme.palette.grey[500],
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

            </>
          )}
         
        </div>
       
      </Container>
      <ToastContainer />
    </>
  );
}

CreateMRFrom.propTypes = {
  currentUser: PropTypes.object,
};
