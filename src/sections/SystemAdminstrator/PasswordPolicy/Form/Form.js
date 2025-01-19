import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
// @mui
import Autocomplete from "@mui/material/Autocomplete";
import Container from "@mui/material/Container";
// @bootstrap

import TextareaAutosize from "@mui/material/TextareaAutosize";
import { ThreeCircles } from "react-loader-spinner";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import IconButton from "@mui/material/IconButton";

import { ConfigProvider, DatePicker as AntDatePicker } from "antd";

import dayjs from "dayjs";
import "antd/dist/reset.css";

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
import { Checkbox, Menu, MenuItem } from "@mui/material";

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
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";
import { BsBookmarkDash } from "react-icons/bs";

//import logo from "../../../assets/img/work-time.png";

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

// ----------------------------------------------------------------------

export default function Form({ currentUser, onPageChange }) {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_name = localStorage.getItem("emp_mst_name");
  const location = useLocation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [progress, setProgress] = useState(0);

  const state = location.state || {};
  const {
    RowID,
    Ast_no,
    DuplicatRowid,
    DupRowID,
    DupAst_no,
    currentPage,
    selectedOption,
    selectDropRowID,
  } = state || {};

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [astMstLabel, setAstMstLabel] = useState([]);
  const [astdetLabel, setAstdetLabel] = useState([]);

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
  const [selected_Status, setSelected_Status] = useState([]);

  const [Asset_CriFactor, setAsset_CriFactor] = useState([]);
  const [selected_CriFactor, setselected_CriFactor] = useState([]);

  const [Short_Description, setShort_Description] = useState("");
  const [Long_Description, setLong_Description] = useState("");
  const [Note1, setNote1] = useState("");

  const [Area_ID, setArea_ID] = useState("");

  const [Asset_Type, setAsset_Type] = useState([]);
  const [selected_AssetType, setselectedAssetType] = useState([]);

  const [Asset_Code, setAsset_Code] = useState([]);
  const [selected_AssetCode, setselectedAssetCode] = useState([]);

  const [Asset_Group_Code, setAsset_Group_Code] = useState([]);
  const [selected_AssetGroupCode, setselectedAssetGroupCode] = useState([]);

  const [Charge_Cost_Center, setCharge_Cost_Center] = useState([]);
  const [selected_Charge_Cost_Center, setSelected_Charge_Cost_Center] =
    useState([]);

  const [Work_Area, setWork_Area] = useState([]);
  const [selected_Work_Area, setSelected_Work_Area] = useState([]);

  const [Asset_Location, setAsset_Location] = useState([]);
  const [selected_Asset_Location, setSelected_Asset_Location] = useState([]);

  const [Asset_Level, setAsset_Level] = useState([]);
  const [selected_Asset_Level, setSelected_Asset_Level] = useState([]);

  const [Work_Group, setWork_Group] = useState([]);
  const [selected_Work_Group, setSelected_Work_Group] = useState([]);

  const [Permanent_ID, setPermanent_ID] = useState("0");

  const [SafetyRequirement, setSafetyRequirement] = useState("");
  const [BarcodeCount, setBarcodeCount] = useState("0");

  const [ManufactureCode, setManufactureCode] = useState([]);
  const [selected_ManufactureCode, setSelected_ManufactureCode] = useState([]);

  const [Assetmodel, setAssetmodel] = useState([]);
  const [selected_Assetmodel, setSelected_Assetmodel] = useState([]);

  const [AssetCost, setAssetCost] = useState("");
  const [ResidualValue, setResidualValue] = useState([]);
  const [Permanent_IDFlag, setPermanentIDFlag] = useState([]);
  const [CustomerCode, setCustomerCode] = useState("");
  const [selected_Customer_Code, setSelected_Customer_Code] = useState([]);

  const [selected_Contract_Account, setSelected_Contract_Account] = useState(
    [],
  );
  const [PurchaseDate, setPurchaseDate] = useState(new Date());

  const [WarrantyDate, setWarrantyDate] = useState(new Date());

  const [selected_Labor_Account, setSelected_Labor_Account] = useState([]);

  const [ExpectedLifeYear, setExpectedLifeYear] = useState("");

  const [selected_Material_Account, setSelected_Material_Account] = useState(
    [],
  );

  const [DepreciationMethod, setDepreciationMethod] = useState([
    { label: "SL : Straight-Line", value: "SL" },
    { label: "DB : Declining-Balance", value: "DB" },
    { label: "DD : Double-Declining", value: "DD" },
  ]);
  const [selected_Depreciation_Method, setSelectedDepreciationMethod] =
    useState(DepreciationMethod[0]);

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

  const [isAssetAssetEmpty, setIsAssetEmpty] = useState(false);
  const [isAssetStatusEmpty, setIsAssetStatusEmpty] = useState(false);
  const [isAssetCriticalFactorEmpty, setIsAssetCriticalFactorEmpty] =
    useState(false);
  const [isAssetShortDescEmpty, setIsAssetShortDescEmpty] = useState(false);
  const [isAssetTypeEmpty, setIsAssetTypeEmpty] = useState(false);
  const [isAssetCodeEmpty, setIsAssetCodeEmpty] = useState(false);
  const [isAssetGroupCodeEmpty, setIsAssetGroupCodeEmpty] = useState(false);
  const [isAssetWorkAreaEmpty, setIsAssetWorkAreaEmpty] = useState(false);
  const [isAssetLocation, setIsAssetLocation] = useState(false);
  const [isAssetLeavelEmpty, setIsAssetLeavelEmpty] = useState(false);
  const [isAssetManufacturerEmpty, setIsAssetManufacturerEmpty] =
    useState(false);

  const [isAssetCostCenterEmpty, setIsAssetCostCenterEmpty] = useState(false);

  const [Asset_Laboraccount, setAsset_Laboraccount] = useState([]);

  const [WorkOrderNo, setWorkOrderNo] = useState("");

  const [selected_Asset_Status, setSelected_Asset_Status] = useState([]);
  const [selected_Asset_Group_Code, setSelected_Asset_Group_Code] = useState(
    [],
  );

  const [AutoNumring, setAutoNumring] = useState("");

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

  const [PMSetupShow, setPMSetupShow] = useState(false);
  const PMSetuphandleClose = () => setPMSetupShow(false);
  const PMSetuphandleShow = () => setPMSetupShow(true);

  const [CheckListShow, setCheckListShow] = useState(false);
  const CheckListhandleClose = () => setCheckListShow(false);
  const CheckListhandleShow = () => setCheckListShow(true);
  const [AssetMandatoryFiled, setAssetMandatoryFiled] = useState([]);
  const [errorField, setErrorField] = useState(null);
  const [AssetAutoNumbring, setAssetAutoNumbring] = useState([]);
  const [Asset_type_ID, setAsset_type_ID] = useState("");
  const [Asset_group_ID, setAsset_group_ID] = useState("");
  const [isFormFiled, setIsFormFiled] = useState(false);

  const [loadSpares, setLoadSpares] = useState(false);
  const [loadUsage, setLoadUsage] = useState(false);
  const [loadSpecification, setLoadSpecification] = useState(false);
  const [SerialNumber, setSerialNumber] = useState("");
  const [AssetAutoNo, setAssetAutoNo] = useState("");

  const [data, setData] = useState({
  
    pwd_set_agi_itr: "",
    pwd_set_adv_not: "",
    pwd_set_min_len: "",
    pwd_set_max_len: "",
    pwd_set_pwd_cri: "",
    pwd_set_max_failed_attempt: "",
 
    audit_date: "",
   
  });


  const [checkboxData,setCheckBoxData] = useState({
    pwd_set_agi_ctr:false,
    pwd_set_adj_chk: false,
    pwd_set_allow_multiple_session: false,
  })

  const handleChangeText = (e) => {
    console.log("tragetValue", e.target.value);
  };

  console.log("checkboxData",checkboxData)

const handleOptionChange = (e)=>{


if(e.target.type === "checkbox"){

  setCheckBoxData((pre)=>({
    ...pre,[e.target.name]:e.target.checked
  }))
}

setData((pre)=>(
  {
    ...pre,[e.target.name]:e.target.value
  }
))
}

  useEffect(() => {
    async function fetchData() {
      if (typeof RowID !== "undefined" && RowID !== null && RowID !== "") {
        setButton_save("Update");
        await get_assetmaster_selected();
        await fetchStatusData();
        await getAssetFromLebel();
        await getAssetMandatoryfiled();
      } else if (
        typeof DuplicatRowid !== "undefined" &&
        DuplicatRowid !== null &&
        DuplicatRowid !== ""
      ) {
        setButton_save("Duplicate");

        await get_assetmaster_selected();
        await fetchStatusData();
        await getAssetFromLebel();
        await getAssetMandatoryfiled();
      } else {
        await getAssetFromLebel();
        await fetchStatusData();
        await getAssetMandatoryfiled();
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
      const response = await httpCommon.get("/get_asset_from_lebal.php");
      // console.log("response____getLabel",response);
      if (response.data.status === "SUCCESS") {
        setAstMstLabel(response.data.data.ast_mst);
        setAstdetLabel(response.data.data.ast_det);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Get All Filed label Name
  const getAssetMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_asset_mandatory_filed.php");

      if (
        response.data &&
        response.data.data &&
        response.data.data.MandatoryField
      ) {
        if (response.data.data.MandatoryField.length > 0) {
          setAssetMandatoryFiled(response.data.data.MandatoryField);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const get_assetmaster_selected = async () => {
    var json = {
      site_cd: site_ID,
      ast_mst_asset_no:
        DuplicatRowid !== undefined && DuplicatRowid !== ""
          ? DupAst_no
          : Ast_no,
      asset_shortdesc: "",
      cost_center: "",
      asset_status: "",
      asset_type: "",
      asset_grpcode: "",
      work_area: "",
      asset_locn: "",
      asset_code: "",
      ast_lvl: "",
      ast_sts_typ_cd: "",
      createby: "",
      service_type: "",
      block: "",
      floor: "",
      RowId:
        DuplicatRowid !== undefined && DuplicatRowid !== "" ? DupRowID : RowID,
    };
    try {
      const response = await httpCommon.post(
        "/get_assetmaster_select.php",
        JSON.stringify(json),
      );
      console.log("Get_Asset Data", response);
      if (response.data.status === "SUCCESS") {
        const formatNumber = (number) => {
          if (number == null) {
            return "";
          }

          let [integerPart, decimalPart] = number.toString().split(".");
          integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          decimalPart = decimalPart ? decimalPart.slice(0, 2) : "00";

          return `${integerPart}.${decimalPart}`;
        };
        const formatNumber2 = (number) => {
          if (number == null) {
            return "";
          }

          let [integerPart, decimalPart] = number.toString().split(".");
          integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          decimalPart = decimalPart ? decimalPart.slice(0, 2) : "";

          return `${integerPart}`;
        };

        if (
          typeof DuplicatRowid !== "undefined" &&
          DuplicatRowid !== null &&
          DuplicatRowid !== ""
        ) {
          // console.log("Enter_log_with duplicate__key");
          setAssetNo("");
        } else {
          // console.log("Enter_log_without duplicate__key");
          setAssetNo(response.data.data["0"].ast_mst_asset_no);
        }

        if (
          (response.data.data["0"].ast_mst_asset_status === "" ||
            response.data.data["0"].ast_mst_asset_status === null) &&
          (response.data.data["0"].ast_sts_desc === null ||
            response.data.data["0"].ast_sts_desc === "null")
        ) {
          setSelected_Status({ label: "" });
        } else {
          setSelected_Status({
            label:
              response.data.data["0"].ast_mst_asset_status +
              " : " +
              response.data.data["0"].ast_sts_desc,
          });
        }

        setShort_Description(response.data.data["0"].ast_mst_asset_shortdesc);
        setNote1(response.data.data["0"].ast_det_note1);

        if (
          (response.data.data["0"].ast_mst_cri_factor === "" ||
            response.data.data["0"].ast_mst_cri_factor === null) &&
          (response.data.data["0"].ast_cri_desc === null ||
            response.data.data["0"].ast_cri_desc === "null")
        ) {
          setselected_CriFactor({ label: "" });
        } else {
          setselected_CriFactor({
            label:
              response.data.data["0"].ast_mst_cri_factor +
              " : " +
              response.data.data["0"].ast_cri_desc,
          });
        }

        setArea_ID(response.data.data["0"].ast_mst_perm_id);
        setLong_Description(response.data.data["0"].ast_mst_asset_longdesc);

        if (
          (response.data.data["0"].ast_mst_asset_type === "" ||
            response.data.data["0"].ast_mst_asset_type === null) &&
          (response.data.data["0"].ast_type_descs === null ||
            response.data.data["0"].ast_type_descs === "null")
        ) {
          setselectedAssetType({ label: "" });
        } else {
          setselectedAssetType({
            label:
              response.data.data["0"].ast_mst_asset_type +
              " : " +
              response.data.data["0"].ast_type_descs,
          });
        }

        if (
          (response.data.data["0"].ast_mst_asset_code === "" ||
            response.data.data["0"].ast_mst_asset_code === null) &&
          (response.data.data["0"].ast_cod_desc === null ||
            response.data.data["0"].ast_cod_desc === "null")
        ) {
          setselectedAssetCode({ label: "" });
        } else {
          setselectedAssetCode({
            label:
              response.data.data["0"].ast_mst_asset_code +
              " : " +
              response.data.data["0"].ast_cod_desc,
          });
        }

        if (
          (response.data.data["0"].ast_mst_asset_grpcode === "" ||
            response.data.data["0"].ast_mst_asset_grpcode === null) &&
          (response.data.data["0"].ast_grp_desc === null ||
            response.data.data["0"].ast_grp_desc === "null")
        ) {
          setselectedAssetGroupCode({ label: "" });
        } else {
          setselectedAssetGroupCode({
            label:
              response.data.data["0"].ast_mst_asset_grpcode +
              " : " +
              response.data.data["0"].ast_grp_desc,
            value: response.data.data["0"].ast_mst_asset_grpcode,
            key: response.data.data["0"].Auto_number,
          });
        }

        if (
          (response.data.data["0"].ast_mst_cost_center === "" ||
            response.data.data["0"].ast_mst_cost_center === null) &&
          (response.data.data["0"].descs === null ||
            response.data.data["0"].descs === "null")
        ) {
          setSelected_Charge_Cost_Center({ label: "" });
        } else {
          setSelected_Charge_Cost_Center({
            label:
              response.data.data["0"].ast_mst_cost_center +
              " : " +
              response.data.data["0"].descs,
          });
        }

        if (
          (response.data.data["0"].ast_mst_work_area === "" ||
            response.data.data["0"].ast_mst_work_area === null) &&
          (response.data.data["0"].mst_war_desc === null ||
            response.data.data["0"].mst_war_desc === "null")
        ) {
          setSelected_Work_Area({ label: "" });
        } else {
          setSelected_Work_Area({
            label:
              response.data.data["0"].ast_mst_work_area +
              " : " +
              response.data.data["0"].mst_war_desc,
          });
        }

        if (
          (response.data.data["0"].ast_mst_asset_locn === "" ||
            response.data.data["0"].ast_mst_asset_locn === null) &&
          (response.data.data["0"].ast_loc_desc === null ||
            response.data.data["0"].ast_loc_desc === "null")
        ) {
          setSelected_Asset_Location({ label: "" });
        } else {
          setSelected_Asset_Location({
            label:
              response.data.data["0"].ast_mst_asset_locn +
              " : " +
              response.data.data["0"].ast_loc_desc,
          });
        }

        if (
          (response.data.data["0"].ast_mst_ast_lvl === "" ||
            response.data.data["0"].ast_mst_ast_lvl === null) &&
          (response.data.data["0"].ast_lvl_desc === null ||
            response.data.data["0"].ast_lvl_desc === "null")
        ) {
          setSelected_Asset_Level({ label: "" });
        } else {
          setSelected_Asset_Level({
            label:
              response.data.data["0"].ast_mst_ast_lvl +
              " : " +
              response.data.data["0"].ast_lvl_desc,
          });
        }

        if (
          (response.data.data["0"].ast_mst_wrk_grp === "" ||
            response.data.data["0"].ast_mst_wrk_grp === null) &&
          (response.data.data["0"].wrk_grp_desc === null ||
            response.data.data["0"].wrk_grp_desc === "null")
        ) {
          setSelected_Work_Group({ label: "" });
        } else {
          setSelected_Work_Group({
            label:
              response.data.data["0"].ast_mst_wrk_grp +
              " : " +
              response.data.data["0"].wrk_grp_desc,
          });
        }

        if (
          (response.data.data["0"].ast_det_mfg_cd === "" ||
            response.data.data["0"].ast_det_mfg_cd === null) &&
          (response.data.data["0"].ast_det_mfg_cd_desc === null ||
            response.data.data["0"].ast_det_mfg_cd_desc === "null")
        ) {
          setSelected_ManufactureCode({ label: "" });
        } else {
          setSelected_ManufactureCode({
            label:
              response.data.data["0"].ast_det_mfg_cd +
              " : " +
              response.data.data["0"].ast_det_mfg_cd_desc,
          });
        }

        if (
          (response.data.data["0"].ast_det_modelno === "" ||
            response.data.data["0"].ast_det_modelno === null) &&
          (response.data.data["0"].ast_det_modelno_desc === null ||
            response.data.data["0"].ast_det_modelno_desc === "null")
        ) {
          setSelected_Assetmodel({ label: "" });
        } else {
          setSelected_Assetmodel({
            label:
              response.data.data["0"].ast_det_modelno +
              " : " +
              response.data.data["0"].ast_det_modelno_desc,
          });
        }

        setAssetAutoNo(response.data.data["0"].ast_mst_auto_no);
        setSerialNumber(response.data.data["0"].ast_det_serial);
        setPermanent_ID(response.data.data["0"].ast_mst_parent_flag);
        setPermanentIDFlag(response.data.data["0"].ast_mst_parent_id);
        setSafetyRequirement(response.data.data["0"].ast_mst_safety_rqmts);
        setBarcodeCount(response.data.data["0"].ast_mst_print_count);
        setManufactureCode(response.data.data["0"].ast_det_mfg_cd);
        setAssetCost(formatNumber(response.data.data["0"].ast_det_asset_cost));
        setResidualValue(
          formatNumber(response.data.data["0"].ast_det_repl_cost),
        );

        const depreciationMethod = response.data.data["0"].ast_det_depr_method;

        if (depreciationMethod !== "" && depreciationMethod !== null) {
          if (depreciationMethod === "SL") {
            setSelectedDepreciationMethod({
              label: depreciationMethod + " : Straight-Line ",
            });
          } else if (depreciationMethod === "DB") {
            setSelectedDepreciationMethod({
              label: depreciationMethod + " : Declining-Balance",
            });
          } else if (depreciationMethod === "DD") {
            setSelectedDepreciationMethod({
              label: depreciationMethod + " : Double-Declining",
            });
          }
        } else {
          setSelectedDepreciationMethod("");
        }

        //  setSelectedDepreciationMethod({ label: response.data.data["0"].ast_det_depr_method });
        setSelected_Contract_Account({
          label: response.data.data["0"].ast_det_c_account,
        });
        setSelected_Labor_Account({
          label: response.data.data["0"].ast_det_l_account,
        });
        setSelected_Material_Account({
          label: response.data.data["0"].ast_det_m_account,
        });

        if (response.data.data["0"].ast_det_purchase_date == null) {
          setPurchaseDate("");
        } else {
          const apiDate = response.data.data["0"].ast_det_purchase_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setPurchaseDate(formattedDate);
        }
        if (response.data.data["0"].ast_det_warranty_date == null) {
          setWarrantyDate("");
        } else {
          const apiDate = response.data.data["0"].ast_det_warranty_date.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setWarrantyDate(formattedDate);
        }
        setExpectedLifeYear(
          formatNumber2(response.data.data["0"].ast_det_depr_term),
        );
        setCustomerCode(response.data.data["0"].ast_det_cus_code);

        setUDFText_1(response.data.data["0"].ast_det_varchar1);
        setUDFText_2(response.data.data["0"].ast_det_varchar2);
        setUDFText_3(response.data.data["0"].ast_det_varchar3);
        setUDFText_4(response.data.data["0"].ast_det_varchar4);
        setUDFText_5(response.data.data["0"].ast_det_varchar5);
        setUDFText_6(response.data.data["0"].ast_det_varchar6);
        setUDFText_7(response.data.data["0"].ast_det_varchar7);
        setUDFText_8(response.data.data["0"].ast_det_varchar8);
        setUDFText_9(response.data.data["0"].ast_det_varchar9);
        setUDFText_10(response.data.data["0"].ast_det_varchar10);

        setUDFText_11(response.data.data["0"].ast_det_varchar11);
        setUDFText_12(response.data.data["0"].ast_det_varchar12);
        setUDFText_13(response.data.data["0"].ast_det_varchar13);
        setUDFText_14(response.data.data["0"].ast_det_varchar14);
        setUDFText_15(response.data.data["0"].ast_det_varchar15);
        setUDFText_16(response.data.data["0"].ast_det_varchar16);
        setUDFText_17(response.data.data["0"].ast_det_varchar17);
        setUDFText_18(response.data.data["0"].ast_det_varchar18);
        setUDFText_19(response.data.data["0"].ast_det_varchar19);
        setUDFText_20(response.data.data["0"].ast_det_varchar20);

        setUDFText_21(response.data.data["0"].ast_det_varchar21);
        setUDFText_22(response.data.data["0"].ast_det_varchar22);
        setUDFText_23(response.data.data["0"].ast_det_varchar23);
        setUDFText_24(response.data.data["0"].ast_det_varchar24);
        setUDFText_25(response.data.data["0"].ast_det_varchar25);
        setUDFText_26(response.data.data["0"].ast_det_varchar26);
        setUDFText_27(response.data.data["0"].ast_det_varchar27);
        setUDFText_28(response.data.data["0"].ast_det_varchar28);
        setUDFText_29(response.data.data["0"].ast_det_varchar29);
        setUDFText_30(response.data.data["0"].ast_det_varchar30);

        setUDFNumber_1(formatNumber(response.data.data["0"].ast_det_numeric1));

        setUDFNumber_2(formatNumber(response.data.data["0"].ast_det_numeric2));
        setUDFNumber_3(formatNumber(response.data.data["0"].ast_det_numeric3));
        setUDFNumber_4(formatNumber(response.data.data["0"].ast_det_numeric4));
        setUDFNumber_5(formatNumber(response.data.data["0"].ast_det_numeric5));
        setUDFNumber_6(formatNumber(response.data.data["0"].ast_det_numeric6));
        setUDFNumber_7(formatNumber(response.data.data["0"].ast_det_numeric7));
        setUDFNumber_8(formatNumber(response.data.data["0"].ast_det_numeric8));
        setUDFNumber_9(formatNumber(response.data.data["0"].ast_det_numeric9));
        setUDFNumber_10(
          formatNumber(response.data.data["0"].ast_det_numeric10),
        );
        setUDFNumber_11(
          formatNumber(response.data.data["0"].ast_det_numeric11),
        );
        setUDFNumber_12(
          formatNumber(response.data.data["0"].ast_det_numeric12),
        );
        setUDFNumber_13(
          formatNumber(response.data.data["0"].ast_det_numeric13),
        );
        setUDFNumber_14(
          formatNumber(response.data.data["0"].ast_det_numeric14),
        );
        setUDFNumber_15(
          formatNumber(response.data.data["0"].ast_det_numeric15),
        );

        if (response.data.data["0"].ast_det_datetime1 == null) {
          setUDFDate_1("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime1.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_1(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime2 == null) {
          setUDFDate_2("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime2.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_2(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime3 == null) {
          setUDFDate_3("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime3.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_3(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime4 == null) {
          setUDFDate_4("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime4.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_4(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime5 == null) {
          setUDFDate_5("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime5.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_5(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime6 == null) {
          setUDFDate_6("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime6.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_6(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime7 == null) {
          setUDFDate_7("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime7.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_7(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime8 == null) {
          setUDFDate_8("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime8.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_8(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime9 == null) {
          setUDFDate_9("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime9.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_9(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime10 == null) {
          setUDFDate_10("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime10.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_10(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime11 == null) {
          setUDFDate_11("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime11.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_11(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime12 == null) {
          setUDFDate_12("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime12.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_12(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime13 == null) {
          setUDFDate_13("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime13.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_13(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime14 == null) {
          setUDFDate_14("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime14.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_14(formattedDate);
        }
        if (response.data.data["0"].ast_det_datetime15 == null) {
          setUDFDate_15("");
        } else {
          const apiDate = response.data.data["0"].ast_det_datetime15.date;
          const formattedDate = Moment(
            apiDate,
            "YYYY-MM-DD HH:mm:ss.SSSSSS",
          ).toDate();
          setUDFDate_15(formattedDate);
        }
        if (DuplicatRowid == null) {
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
  };

  // Second Api call fetch all dropdowwn data
  const fetchStatusData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_asset_dropdownlist.php?site_cd=" + site_ID,
      );
      //  console.log("response____status__", response);

      let Status = response.data.data.AssetStatusListDropdown.map((item) => ({
        label: item.ast_sts_status + " : " + item.ast_sts_desc,
        value: item.ast_sts_desc,
        key: item.ast_sts_status,
      }));

      setStatus(Status);

      let Asset_Group_Code = response.data.data.AssetGroupCode.map((item) => ({
        label: item.ast_grp_grp_cd + " : " + item.ast_grp_desc,
        value: item.ast_grp_desc,
        key: item.Auto_number,
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
        }),
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

      let Manufacture = response.data.data.Manufacturer_code.map((item) => ({
        label: item.mfg_mst_mfg_cd + " : " + item.mfg_mst_company,
        value: item.mfg_mst_mfg_cd,
      }));
      setManufactureCode(Manufacture);

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

      let Asset_CriFactor = response.data.data.Assetcriticalfactor.map(
        (item) => ({
          label: item.ast_cri_cri_factor + " : " + item.ast_cri_desc,
          value: item.ast_cri_desc,
        }),
      );
      setAsset_CriFactor(Asset_CriFactor);

      let Asset_laboraccount = response.data.data.Assetlaboraccount.map(
        (item) => ({
          label: item.account + " : " + item.descs,
          value: item.descs,
        }),
      );
      setAsset_Laboraccount(Asset_laboraccount);
      setAssetAutoNumbring(response.data.data.AssetAutoNumbering);

      /*   end */
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Thired Api Call
  const fetchImgData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_asset_edit_img.php?RowID=" + RowID,
      );
      //console.log("response____img__asset",response);
      if (response.data.data) {
        // Check if AllImgGet exists and has items

        if (
          response.data.data.AllImgGet &&
          response.data.data.AllImgGet.length > 0
        ) {
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




 



  const clearDataImg = () => {
    setImage("");

    if (Button_save === "Save") {
      setImageSelect({ name: "", path: "" });
    }
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


  const findCustomizeLabel = (columnName) => {
    const matchingColumn = astMstLabel.find(
      (item) => item.column_name === columnName,
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };


  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = AssetMandatoryFiled.find(
      (item) => item.column_name === columnName,
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
    }
    return "";
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
            "",
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
          setSelected_Work_Area({
            label:
              response.data.data["0"].ast_mst_work_area +
              " : " +
              response.data.data["0"].mst_war_desc,
          });
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
                <IconButton key={index} onClick={icon.props.onClick}>
                  {icon}
                </IconButton>
              ))}
            </div>
          ),
        }}
      />
    );
  }

  /*   add new asset code by stay */
  const New_Asset = async () => {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });

    // Swal.showLoading();
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

    let PermanentIDFlag, setPermanentIDFlag;
    if (typeof Permanent_IDFlag === "string" && Permanent_IDFlag !== "") {
      // Split the string only if it's not empty
      PermanentIDFlag = Permanent_IDFlag.split(":");
      setPermanentIDFlag = PermanentIDFlag[0].trim();
    } else {
      setPermanentIDFlag = "";
    }

    //Select Asset_Critical
    let Asset_Critical, setAsset_Critical;
    if (selected_CriFactor == "" || selected_CriFactor == null) {
      setAsset_Critical = "";
    } else {
      Asset_Critical = selected_CriFactor.label.split(":");
      setAsset_Critical = Asset_Critical[0];
      //  console.log("Asset_Critical ", setAsset_Critical)
    }

    //Select Asset Type
    let Asset_Type, setAsset_Type;
    if (selected_AssetType == "" || selected_AssetType == null) {
      setAsset_Type = "";
    } else {
      Asset_Type = selected_AssetType.label.split(":");
      setAsset_Type = Asset_Type[0];
      // console.log("Asset_Critical ", setAsset_Type)
    }

    //Select Asset Code
    let Asset_Code, setAsset_Code;
    if (selected_AssetCode == "" || selected_AssetCode == null) {
      setAsset_Code = "";
    } else {
      Asset_Code = selected_AssetCode.label.split(":");
      setAsset_Code = Asset_Code[0];
      //  console.log("Asset_Code ", setAsset_Code);
    }

    //Select Asset Group Code
    let Asset_GroupCode, setAsset_GroupCode;
    if (selected_AssetGroupCode == "" || selected_AssetGroupCode == null) {
      setAsset_GroupCode = "";
    } else {
      Asset_GroupCode = selected_AssetGroupCode.label.split(":");
      setAsset_GroupCode = Asset_GroupCode[0];
      //   console.log("Asset_GroupCode ", setAsset_GroupCode);
    }

    //Select Cost Center
    let Asset_CostCenter, setAsset_CostCenter;
    if (
      selected_Charge_Cost_Center == "" ||
      selected_Charge_Cost_Center == null
    ) {
      setAsset_CostCenter = "";
    } else {
      Asset_CostCenter = selected_Charge_Cost_Center.label.split(":");
      setAsset_CostCenter = Asset_CostCenter[0];
      //   console.log("Asset_CostCenter ", setAsset_CostCenter);
    }

    //Select Zone
    let Asset_WorkArea, setAsset_WorkArea;
    if (selected_Work_Area == "" || selected_Work_Area == null) {
      setAsset_WorkArea = "";
    } else {
      Asset_WorkArea = selected_Work_Area.label.split(":");
      setAsset_WorkArea = Asset_WorkArea[0];
      //   console.log("Asset_WorkArea ", setAsset_WorkArea);
    }

    //Select Asset Location
    let Asset_Location, setAsset_Location;
    if (selected_Asset_Location == "" || selected_Asset_Location == null) {
      setAsset_Location = "";
    } else {
      Asset_Location = selected_Asset_Location.label.split(":");
      setAsset_Location = Asset_Location[0];
      //  console.log("Asset_Location ", setAsset_Location);
    }

    let Depreciation;

    if (
      !selected_Depreciation_Method ||
      !selected_Depreciation_Method.label ||
      selected_Depreciation_Method.label === ""
    ) {
      Depreciation = "";
    } else {
      const Depreciation2 = selected_Depreciation_Method.label.split(":");

      Depreciation = Depreciation2.length > 0 ? Depreciation2[0].trim() : "";
      //  console.log("Asset_Level ", Asset_Level[0])
    }

    //Select Asset Level
    let Asset_Level, setAsset_Level;

    if (selected_Asset_Level === "" || selected_Asset_Level === null) {
      setAsset_Level = "";
    } else {
      Asset_Level = selected_Asset_Level.label.split(":");
      setAsset_Level = Asset_Level[0];
      //  console.log("Asset_Level ", Asset_Level[0])
    }

    let manufature, setmanufature;
    if (
      !selected_ManufactureCode ||
      !selected_ManufactureCode.label ||
      selected_ManufactureCode.label === ""
    ) {
      setmanufature = "";
    } else {
      manufature = selected_ManufactureCode.label.split(":");
      setmanufature = manufature[0];
      //  console.log("Asset_Level ", Asset_Level[0])
    }
    let modelAsset, setmodelAsset;
    if (
      !selected_Assetmodel ||
      !selected_Assetmodel.label ||
      selected_Assetmodel.label === ""
    ) {
      setmodelAsset = "";
    } else {
      modelAsset = selected_Assetmodel.label.split(":");
      setmodelAsset = modelAsset[0];
      //  console.log("Asset_Level ", Asset_Level[0])
    }

    let Asset_WorkGroup, setAsset_WorkGroup;
    if (
      !selected_Work_Group ||
      selected_Work_Group.length === 0 ||
      selected_Work_Group[0] === null
    ) {
      setAsset_WorkGroup = "";
    } else {
      Asset_WorkGroup = selected_Work_Group.label.split(":");
      if (Asset_WorkGroup && Asset_WorkGroup.length > 0) {
        setAsset_WorkGroup = Asset_WorkGroup[0];
      } else {
        setAsset_WorkGroup = "";
      }
    }

    //Select Labor Account
    let LaborAccountValue;
    if (selected_Labor_Account.length === 0 || !selected_Labor_Account.label) {
      LaborAccountValue = "";
    } else {
      const LaborAccount = selected_Labor_Account.label.split(":");
      LaborAccountValue = LaborAccount[0];
    }

    //Select Material Account
    let MaterialAccountValue;
    if (
      selected_Material_Account.length === 0 ||
      !selected_Material_Account.label
    ) {
      MaterialAccountValue = "";
    } else {
      const MaterialAccount = selected_Material_Account.label.split(":");
      MaterialAccountValue = MaterialAccount[0];
    }

    //Select Contract Account
    let ContractAccountValue;
    if (
      selected_Contract_Account.length === 0 ||
      !selected_Contract_Account.label
    ) {
      ContractAccountValue = "";
    } else {
      const ContractAccount = selected_Contract_Account.label.split(":");
      ContractAccountValue = ContractAccount[0];
    }

    //Select Purchase Date
    let date_of_purchase = "";
    if (PurchaseDate == "" || PurchaseDate == null) {
      date_of_purchase = "";
    } else {
      date_of_purchase = Moment(PurchaseDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      //  console.log("purchase_date ", date_of_purchase);
    }

    //Select Warranty Date
    let date_of_Warranty = "";
    if (WarrantyDate == "" || WarrantyDate == null) {
      date_of_Warranty = "";
    } else {
      date_of_Warranty = Moment(WarrantyDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      //    console.log("Warranty__date ", date_of_Warranty);
    }

    // select UDFDate_1
    let date_of_1 = "";
    if (UDFDate_1 == "" || UDFDate_1 == null) {
      date_of_1 = "";
    } else {
      date_of_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      //   console.log("UDFDate_1 ", date_of_1);
    }

    // select UDFDate_2
    let date_of_2 = "";
    if (UDFDate_2 == "" || UDFDate_2 == null) {
      date_of_2 = "";
    } else {
      date_of_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
      //console.log("UDFDate_2 ", date_of_2);
    }

    // select UDFDate_3
    let date_of_3 = "";
    if (UDFDate_3 == "" || UDFDate_3 == null) {
      date_of_3 = "";
    } else {
      date_of_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_3 ", date_of_3);
    }

    // select UDFDate_4
    let date_of_4 = "";
    if (UDFDate_4 == "" || UDFDate_4 == null) {
      date_of_4 = "";
    } else {
      date_of_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_4 ", date_of_4);
    }

    // select UDFDate_5
    let date_of_5 = "";
    if (UDFDate_5 == "" || UDFDate_5 == null) {
      date_of_5 = "";
    } else {
      date_of_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
      //   console.log("UDFDate_5 ", date_of_5);
    }

    // select UDFDate_6
    let date_of_6 = "";
    if (UDFDate_6 == "" || UDFDate_6 == null) {
      date_of_6 = "";
    } else {
      date_of_6 = Moment(UDFDate_6).format("yyyy-MM-DD HH:mm:ss").trim();
      //   console.log("UDFDate_6 ", date_of_6);
    }

    // select UDFDate_7
    let date_of_7 = "";
    if (UDFDate_7 == "" || UDFDate_7 == null) {
      date_of_7 = "";
    } else {
      date_of_7 = Moment(UDFDate_7).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_7 ", date_of_7);
    }

    // select UDFDate_8
    let date_of_8 = "";
    if (UDFDate_8 == "" || UDFDate_8 == null) {
      date_of_8 = "";
    } else {
      date_of_8 = Moment(UDFDate_8).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_8 ", date_of_8);
    }

    // select UDFDate_9
    let date_of_9 = "";
    if (UDFDate_9 == "" || UDFDate_9 == null) {
      date_of_9 = "";
    } else {
      date_of_9 = Moment(UDFDate_9).format("yyyy-MM-DD HH:mm:ss").trim();
      // console.log("UDFDate_9 ", date_of_9);
    }

    // select UDFDate_10
    let date_of_10 = "";
    if (UDFDate_10 == "" || UDFDate_10 == null) {
      date_of_10 = "";
    } else {
      date_of_10 = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
      //    console.log("UDFDate_10 ", date_of_10);
    }

    // select UDFDate_11
    let date_of_11 = "";
    if (UDFDate_11 == "" || UDFDate_11 == null) {
      date_of_11 = "";
    } else {
      date_of_11 = Moment(UDFDate_11).format("yyyy-MM-DD HH:mm:ss").trim();
      // console.log("UDFDate_11 ", date_of_11);
    }

    // select UDFDate_12
    let date_of_12 = "";
    if (UDFDate_12 == "" || UDFDate_12 == null) {
      date_of_12 = "";
    } else {
      date_of_12 = Moment(UDFDate_12).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_12 ", date_of_12);
    }

    // select UDFDate_13
    let date_of_13 = "";
    if (UDFDate_13 == "" || UDFDate_13 == null) {
      date_of_13 = "";
    } else {
      date_of_13 = Moment(UDFDate_13).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_13 ", date_of_13);
    }

    // select UDFDate_14
    let date_of_14 = "";
    if (UDFDate_14 == "" || UDFDate_14 == null) {
      date_of_14 = "";
    } else {
      date_of_14 = Moment(UDFDate_14).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_14 ", date_of_14);
    }

    // select UDFDate_15
    let date_of_15 = "";
    if (UDFDate_15 == "" || UDFDate_15 == null) {
      date_of_15 = "";
    } else {
      date_of_15 = Moment(UDFDate_15).format("yyyy-MM-DD HH:mm:ss").trim();
      // console.log("UDFDate_15 ", date_of_15);
    }

    // console.log("Permanent_ID____",Permanent_ID);
    let missingFields = [];

    var json_AssetInsert = {
      site_cd: site_ID,
      ast_mst_asset_no: AssetNo?.trim() || "",
      ast_mst_asset_status: setStatus?.trim() || "",
      ast_mst_asset_shortdesc: Short_Description?.trim() || "",
      ast_det_note1: Note1?.trim() || "",
      ast_mst_cri_factor: setAsset_Critical?.trim() || "",
      ast_mst_asset_longdesc: Long_Description?.trim() || "",
      ast_mst_perm_id: Area_ID?.trim() || "",
      ast_mst_asset_type: setAsset_Type?.trim() || "",
      ast_mst_work_area: setAsset_WorkArea?.trim() || "",
      ast_mst_asset_code: setAsset_Code?.trim() || "",
      ast_mst_asset_locn: setAsset_Location?.trim() || "",
      ast_mst_asset_grpcode: setAsset_GroupCode?.trim() || "",
      ast_mst_ast_lvl: setAsset_Level?.trim() || "",
      ast_mst_cost_center: setAsset_CostCenter?.trim() || "",
      ast_mst_wrk_grp: setAsset_WorkGroup?.trim() || "",
      ast_mst_parent_flag: setPermanentIDFlag?.trim() || "",
      // ast_mst_parent_id: Permanent_ID.toString()?.trim() || '',
      ast_mst_parent_id: Permanent_ID ? Permanent_ID.toString().trim() : "",
      ast_mst_safety_rqmts: SafetyRequirement?.trim() || "",
      ast_mst_print_count: BarcodeCount?.trim() || "",
      ast_det_mfg_cd: setmanufature?.trim() || "",
      ast_det_modelno: setmodelAsset?.trim() || "",
      ast_det_serial: SerialNumber ? SerialNumber.trim() : SerialNumber,
      ast_det_asset_cost: AssetCost ? AssetCost.trim() : "",
      ast_det_purchase_date: date_of_purchase,
      ast_det_depr_term:
        ExpectedLifeYear && typeof ExpectedLifeYear === "string"
          ? ExpectedLifeYear.trim()
          : ExpectedLifeYear,
      ast_det_repl_cost:
        ResidualValue && typeof ResidualValue === "string"
          ? ResidualValue.trim()
          : "",
      ast_det_warranty_date: date_of_Warranty,
      ast_det_cus_code: CustomerCode ? CustomerCode.trim() : "",

      ast_det_depr_method: Depreciation ? Depreciation : "",

      ast_det_l_account: LaborAccountValue ? LaborAccountValue.trim() : "",
      ast_det_m_account: MaterialAccountValue
        ? MaterialAccountValue.trim()
        : "",
      ast_det_c_account: ContractAccountValue
        ? ContractAccountValue.trim()
        : "",
      ast_det_depr_date: "",
      ast_det_depr_by: "",
      ast_det_acc_depr_cost: "",
      ast_det_net_book_value: "",
      ast_det_dispose_date: "",
      ast_det_dispose_by: "",
      ast_det_dispose_type: "",
      ast_det_dispose_value: "",

      ast_det_varchar1: UDFText_1 ? UDFText_1.trim() : UDFText_1,
      ast_det_varchar2: UDFText_2 ? UDFText_2.trim() : UDFText_2,
      ast_det_varchar3: UDFText_3 ? UDFText_3.trim() : UDFText_3,
      ast_det_varchar4: UDFText_4 ? UDFText_4.trim() : UDFText_4,
      ast_det_varchar5: UDFText_5 ? UDFText_5.trim() : UDFText_5,
      ast_det_varchar6: UDFText_6 ? UDFText_6.trim() : UDFText_6,
      ast_det_varchar7: UDFText_7 ? UDFText_7.trim() : UDFText_7,
      ast_det_varchar8: UDFText_8 ? UDFText_8.trim() : UDFText_8,
      ast_det_varchar9: UDFText_9 ? UDFText_9.trim() : UDFText_9,
      ast_det_varchar10: UDFText_10 ? UDFText_10.trim() : UDFText_10,
      ast_det_varchar11: UDFText_11 ? UDFText_11.trim() : UDFText_11,
      ast_det_varchar12: UDFText_12 ? UDFText_12.trim() : UDFText_12,
      ast_det_varchar13: UDFText_13 ? UDFText_13.trim() : UDFText_13,
      ast_det_varchar14: UDFText_14 ? UDFText_14.trim() : UDFText_14,
      ast_det_varchar15: UDFText_15 ? UDFText_15.trim() : UDFText_15,
      ast_det_varchar16: UDFText_16 ? UDFText_16.trim() : UDFText_16,
      ast_det_varchar17: UDFText_17 ? UDFText_17.trim() : UDFText_17,
      ast_det_varchar18: UDFText_18 ? UDFText_18.trim() : UDFText_18,
      ast_det_varchar19: UDFText_19 ? UDFText_19.trim() : UDFText_19,
      ast_det_varchar20: UDFText_20 ? UDFText_20.trim() : UDFText_20,
      ast_det_varchar21: UDFText_21 ? UDFText_21.trim() : UDFText_21,
      ast_det_varchar22: UDFText_22 ? UDFText_22.trim() : UDFText_22,
      ast_det_varchar23: UDFText_23 ? UDFText_23.trim() : UDFText_23,
      ast_det_varchar24: UDFText_24 ? UDFText_24.trim() : UDFText_24,
      ast_det_varchar25: UDFText_25 ? UDFText_25.trim() : UDFText_25,
      ast_det_varchar26: UDFText_26 ? UDFText_26.trim() : UDFText_26,
      ast_det_varchar27: UDFText_27 ? UDFText_27.trim() : UDFText_27,
      ast_det_varchar28: UDFText_28 ? UDFText_28.trim() : UDFText_28,
      ast_det_varchar29: UDFText_29 ? UDFText_29.trim() : UDFText_29,
      ast_det_varchar30: UDFText_30 ? UDFText_30.trim() : UDFText_30,

      ast_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : UDFNumber_1,
      ast_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : UDFNumber_2,
      ast_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : UDFNumber_3,
      ast_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : UDFNumber_4,
      ast_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : UDFNumber_5,
      ast_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : UDFNumber_6,
      ast_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : UDFNumber_7,
      ast_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : UDFNumber_8,
      ast_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : UDFNumber_9,
      ast_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : UDFNumber_10,
      ast_det_numeric11: UDFNumber_11 ? UDFNumber_11.trim() : UDFNumber_11,
      ast_det_numeric12: UDFNumber_12 ? UDFNumber_12.trim() : UDFNumber_12,
      ast_det_numeric13: UDFNumber_13 ? UDFNumber_13.trim() : UDFNumber_13,
      ast_det_numeric14: UDFNumber_14 ? UDFNumber_14.trim() : UDFNumber_14,
      ast_det_numeric15: UDFNumber_15 ? UDFNumber_15.trim() : UDFNumber_15,

      ast_det_datetime1: date_of_1 ? date_of_1.trim() : date_of_1,
      ast_det_datetime2: date_of_2 ? date_of_2.trim() : date_of_2,
      ast_det_datetime3: date_of_3 ? date_of_3.trim() : date_of_3,
      ast_det_datetime4: date_of_4 ? date_of_4.trim() : date_of_4,
      ast_det_datetime5: date_of_5 ? date_of_5.trim() : date_of_5,
      ast_det_datetime6: date_of_6 ? date_of_6.trim() : date_of_6,
      ast_det_datetime7: date_of_7 ? date_of_7.trim() : date_of_7,
      ast_det_datetime8: date_of_8 ? date_of_8.trim() : date_of_8,
      ast_det_datetime9: date_of_9 ? date_of_9.trim() : date_of_9,
      ast_det_datetime10: date_of_10 ? date_of_10.trim() : date_of_10,
      ast_det_datetime11: date_of_11 ? date_of_11.trim() : date_of_11,
      ast_det_datetime12: date_of_12 ? date_of_12.trim() : date_of_12,
      ast_det_datetime13: date_of_13 ? date_of_13.trim() : date_of_13,
      ast_det_datetime14: date_of_14 ? date_of_14.trim() : date_of_14,
      ast_det_datetime15: date_of_15 ? date_of_15.trim() : date_of_15,

      asset_type_ID: Asset_type_ID.trim(),
      asset_group_ID: Asset_group_ID
        ? Asset_group_ID.trim()
        : selected_AssetGroupCode.key,
      ImgUpload: imageSelect,
      audit_user: emp_mst_login_id.trim(),
      ast_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
    };

    //console.log("json_AssetInsert_____",json_AssetInsert);
    // console.log("AssetMandatoryFiled_____",AssetMandatoryFiled);

    for (let i = 0; i < AssetMandatoryFiled.length; i++) {
      const item = AssetMandatoryFiled[i];
      const fieldValue = json_AssetInsert[item.column_name];
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
      setSnackbarSeverity("error");
    } else {
      // console.log("json_Asset Data", json_AssetInsert);
      try {
        const response = await httpCommon.post(
          "/insert_new_asset_data.php",
          JSON.stringify(json_AssetInsert),
        );
        // console.log("json_Asset Data_responce__", response);

        if (response.data.status === "SUCCESS") {
          // console.log("responseJson", response.data.ROW_ID);
          Swal.close();
          Swal.fire({
            icon: "success",
            customClass: {
              container: "swalcontainercustom",
            },
            title: response.data.status,
            text: response.data.message,
            timer: 3000,
            timerProgressBar: true,
            willClose: () => {
              navigate(`/dashboard/asset/list`, {
                state: {
                  currentPage,
                },
              });
            },
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
              navigate(`/dashboard/asset/list`, {
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

  const Update_Asset = async () => {
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
    //CustomerCode Permanent_IDFlag
    let PermanentIDFlag, setPermanentIDFlag;
    if (typeof Permanent_IDFlag === "string" && Permanent_IDFlag !== "") {
      // Split the string only if it's not empty
      PermanentIDFlag = Permanent_IDFlag.split(":");
      setPermanentIDFlag = PermanentIDFlag[0].trim();
    } else {
      setPermanentIDFlag = "";
    }

    //Select Asset_Critical
    let Asset_Critical, setAsset_Critical;
    if (selected_CriFactor == "" || selected_CriFactor == null) {
      setAsset_Critical = "";
    } else {
      Asset_Critical = selected_CriFactor.label.split(":");
      setAsset_Critical = Asset_Critical[0];
      //  console.log("Asset_Critical ", setAsset_Critical)
    }

    //Select Asset Type
    let Asset_Type, setAsset_Type;
    if (selected_AssetType == "" || selected_AssetType == null) {
      setAsset_Type = "";
    } else {
      Asset_Type = selected_AssetType.label.split(":");
      setAsset_Type = Asset_Type[0];
      // console.log("Asset_Critical ", setAsset_Type)
    }

    //Select Asset Code
    let Asset_Code, setAsset_Code;
    if (selected_AssetCode == "" || selected_AssetCode == null) {
      setAsset_Code = "";
    } else {
      Asset_Code = selected_AssetCode.label.split(":");
      setAsset_Code = Asset_Code[0];
      //  console.log("Asset_Code ", setAsset_Code);
    }

    //Select Asset Group Code
    let Asset_GroupCode, setAsset_GroupCode;
    if (selected_AssetGroupCode == "" || selected_AssetGroupCode == null) {
      setAsset_GroupCode = "";
    } else {
      Asset_GroupCode = selected_AssetGroupCode.label.split(":");
      setAsset_GroupCode = Asset_GroupCode[0];
      //   console.log("Asset_GroupCode ", setAsset_GroupCode);
    }

    //Select Cost Center
    let Asset_CostCenter, setAsset_CostCenter;
    if (
      selected_Charge_Cost_Center == "" ||
      selected_Charge_Cost_Center == null
    ) {
      setAsset_CostCenter = "";
    } else {
      Asset_CostCenter = selected_Charge_Cost_Center.label.split(":");
      setAsset_CostCenter = Asset_CostCenter[0];
      //   console.log("Asset_CostCenter ", setAsset_CostCenter);
    }

    //Select Zone
    let Asset_WorkArea, setAsset_WorkArea;
    if (selected_Work_Area == "" || selected_Work_Area == null) {
      setAsset_WorkArea = "";
    } else {
      Asset_WorkArea = selected_Work_Area.label.split(":");
      setAsset_WorkArea = Asset_WorkArea[0];
      //   console.log("Asset_WorkArea ", setAsset_WorkArea);
    }

    //Select Asset Location
    let Asset_Location, setAsset_Location;
    if (selected_Asset_Location == "" || selected_Asset_Location == null) {
      setAsset_Location = "";
    } else {
      Asset_Location = selected_Asset_Location.label.split(":");
      setAsset_Location = Asset_Location[0];
      //  console.log("Asset_Location ", setAsset_Location);
    }

    //Select Asset Level
    let Asset_Level, setAsset_Level;
    if (selected_Asset_Level === "" || selected_Asset_Level === null) {
      setAsset_Level = "";
    } else {
      Asset_Level = selected_Asset_Level.label.split(":");
      setAsset_Level = Asset_Level[0];
      //  console.log("Asset_Level ", Asset_Level[0])
    }

    //Select Asset Work Group
    let Asset_WorkGroup, setAsset_WorkGroup;
    if (selected_Work_Group === "" || selected_Work_Group === null) {
      setAsset_WorkGroup = "";
    } else {
      Asset_WorkGroup = selected_Work_Group.label.split(":");
      setAsset_WorkGroup = Asset_WorkGroup[0];
      //  console.log("Asset_WorkGroup ", Asset_WorkGroup)
    }

    //Select Labor Account

    let SelectManufacture;
    if (
      !selected_ManufactureCode || // Check if selected_ManufactureCode is undefined or null
      !selected_ManufactureCode.label || // Check if label is undefined, null, or an empty string
      selected_ManufactureCode.label === ""
    ) {
      SelectManufacture = "";
    } else {
      const Manufacture = selected_ManufactureCode.label.split(":");
      SelectManufacture = Manufacture[0];
    }

    // model selected_Assetmodel
    let SelectModel;
    if (
      !selected_Assetmodel ||
      !selected_Assetmodel.label ||
      selected_Assetmodel.label === ""
    ) {
      SelectModel = "";
    } else {
      const Modle = selected_Assetmodel.label.split(":");
      SelectModel = Modle[0];
    }

    //console.log("DepreciationMethod_____",DepreciationMethod);

    let DepreciationMethod;
    if (
      !selected_Depreciation_Method ||
      !selected_Depreciation_Method.label ||
      selected_Depreciation_Method.label === ""
    ) {
      DepreciationMethod = "";
    } else {
      const DepreciationS = selected_Depreciation_Method.label.split(":");

      //DepreciationMethod = DepreciationS;
      DepreciationMethod =
        DepreciationS.length > 0 ? DepreciationS[0].trim() : "";
    }

    let LaborAccountValue;
    if (!selected_Labor_Account || !selected_Labor_Account.label) {
      LaborAccountValue = "";
    } else {
      const LaborAccount = selected_Labor_Account.label.split(":");
      LaborAccountValue = LaborAccount[0];
    }

    //Select Material Account
    let MaterialAccountValue;
    if (!selected_Material_Account || !selected_Material_Account.label) {
      MaterialAccountValue = "";
    } else {
      const MaterialAccount = selected_Material_Account.label.split(":");
      MaterialAccountValue = MaterialAccount[0];
    }

    //Select Contract Account
    let ContractAccountValue;
    if (!selected_Contract_Account || !selected_Contract_Account.label) {
      ContractAccountValue = "";
    } else {
      const ContractAccount = selected_Contract_Account.label.split(":");
      ContractAccountValue = ContractAccount[0];
    }

    //Select Customer Code
    let CustomerCodeValue;
    if (
      selected_Customer_Code.length === 0 ||
      selected_Customer_Code[0] === null
    ) {
      CustomerCodeValue = "";
    } else {
      const CustomerCode = selected_Customer_Code.label.split(":");
      CustomerCodeValue = CustomerCode[0].trim();
    }

    //Select Purchase Date
    let date_of_purchase = "";
    if (PurchaseDate == "" || PurchaseDate == null) {
      date_of_purchase = "";
    } else {
      date_of_purchase = Moment(PurchaseDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      //  console.log("purchase_date ", date_of_purchase);
    }

    //Select Warranty Date
    let date_of_Warranty = "";
    if (WarrantyDate == "" || WarrantyDate == null) {
      date_of_Warranty = "";
    } else {
      date_of_Warranty = Moment(WarrantyDate)
        .format("yyyy-MM-DD HH:mm:ss")
        .trim();
      //    console.log("Warranty__date ", date_of_Warranty);
    }

    // select UDFDate_1
    let date_of_1 = "";
    if (UDFDate_1 == "" || UDFDate_1 == null) {
      date_of_1 = "";
    } else {
      date_of_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      //   console.log("UDFDate_1 ", date_of_1);
    }

    // select UDFDate_2
    let date_of_2 = "";
    if (UDFDate_2 == "" || UDFDate_2 == null) {
      date_of_2 = "";
    } else {
      date_of_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
      //console.log("UDFDate_2 ", date_of_2);
    }

    // select UDFDate_3
    let date_of_3 = "";
    if (UDFDate_3 == "" || UDFDate_3 == null) {
      date_of_3 = "";
    } else {
      date_of_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_3 ", date_of_3);
    }

    // select UDFDate_4
    let date_of_4 = "";
    if (UDFDate_4 == "" || UDFDate_4 == null) {
      date_of_4 = "";
    } else {
      date_of_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_4 ", date_of_4);
    }

    // select UDFDate_5
    let date_of_5 = "";
    if (UDFDate_5 == "" || UDFDate_5 == null) {
      date_of_5 = "";
    } else {
      date_of_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
      //   console.log("UDFDate_5 ", date_of_5);
    }

    // select UDFDate_6
    let date_of_6 = "";
    if (UDFDate_6 == "" || UDFDate_6 == null) {
      date_of_6 = "";
    } else {
      date_of_6 = Moment(UDFDate_6).format("yyyy-MM-DD HH:mm:ss").trim();
      //   console.log("UDFDate_6 ", date_of_6);
    }

    // select UDFDate_7
    let date_of_7 = "";
    if (UDFDate_7 == "" || UDFDate_7 == null) {
      date_of_7 = "";
    } else {
      date_of_7 = Moment(UDFDate_7).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_7 ", date_of_7);
    }

    // select UDFDate_8
    let date_of_8 = "";
    if (UDFDate_8 == "" || UDFDate_8 == null) {
      date_of_8 = "";
    } else {
      date_of_8 = Moment(UDFDate_8).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_8 ", date_of_8);
    }

    // select UDFDate_9
    let date_of_9 = "";
    if (UDFDate_9 == "" || UDFDate_9 == null) {
      date_of_9 = "";
    } else {
      date_of_9 = Moment(UDFDate_9).format("yyyy-MM-DD HH:mm:ss").trim();
      // console.log("UDFDate_9 ", date_of_9);
    }

    // select UDFDate_10
    let date_of_10 = "";
    if (UDFDate_10 == "" || UDFDate_10 == null) {
      date_of_10 = "";
    } else {
      date_of_10 = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
      //    console.log("UDFDate_10 ", date_of_10);
    }

    // select UDFDate_11
    let date_of_11 = "";
    if (UDFDate_11 == "" || UDFDate_11 == null) {
      date_of_11 = "";
    } else {
      date_of_11 = Moment(UDFDate_11).format("yyyy-MM-DD HH:mm:ss").trim();
      // console.log("UDFDate_11 ", date_of_11);
    }

    // select UDFDate_12
    let date_of_12 = "";
    if (UDFDate_12 == "" || UDFDate_12 == null) {
      date_of_12 = "";
    } else {
      date_of_12 = Moment(UDFDate_12).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_12 ", date_of_12);
    }

    // select UDFDate_13
    let date_of_13 = "";
    if (UDFDate_13 == "" || UDFDate_13 == null) {
      date_of_13 = "";
    } else {
      date_of_13 = Moment(UDFDate_13).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_13 ", date_of_13);
    }

    // select UDFDate_14
    let date_of_14 = "";
    if (UDFDate_14 == "" || UDFDate_14 == null) {
      date_of_14 = "";
    } else {
      date_of_14 = Moment(UDFDate_14).format("yyyy-MM-DD HH:mm:ss").trim();
      //  console.log("UDFDate_14 ", date_of_14);
    }

    // select UDFDate_15
    let date_of_15 = "";
    if (UDFDate_15 == "" || UDFDate_15 == null) {
      date_of_15 = "";
    } else {
      date_of_15 = Moment(UDFDate_15).format("yyyy-MM-DD HH:mm:ss").trim();
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

    var json_AssetUpdate = {
      site_cd: site_ID,
      ast_mst_asset_no: AssetNo.trim(),
      ast_mst_asset_status: setStatus.trim(),
      ast_mst_asset_shortdesc: Short_Description
        ? Short_Description.trim()
        : Short_Description,
      ast_det_note1: Note1 ? Note1.trim() : Note1,
      ast_mst_cri_factor: setAsset_Critical.trim(),
      ast_mst_asset_longdesc: Long_Description
        ? Long_Description.trim()
        : Long_Description,
      ast_mst_perm_id: Area_ID ? Area_ID.trim() : Area_ID,
      ast_mst_asset_type: setAsset_Type.trim(),
      ast_mst_work_area: setAsset_WorkArea.trim(),
      ast_mst_asset_code: setAsset_Code.trim(),
      ast_mst_asset_locn: setAsset_Location.trim(),
      ast_mst_asset_grpcode: setAsset_GroupCode.trim(),
      ast_mst_ast_lvl: setAsset_Level.trim(),
      ast_mst_cost_center: setAsset_CostCenter.trim(),
      ast_mst_wrk_grp: setAsset_WorkGroup.trim(),

      ast_mst_parent_flag: setPermanentIDFlag.trim(),
      // ast_mst_parent_id: Permanent_ID.toString().trim(),
      ast_mst_parent_id: Permanent_ID ? Permanent_ID.toString().trim() : "",

      ast_mst_safety_rqmts: SafetyRequirement
        ? SafetyRequirement.trim()
        : SafetyRequirement,
      ast_mst_print_count: BarcodeCount ? BarcodeCount.trim() : BarcodeCount,

      ast_det_mfg_cd: SelectManufacture
        ? SelectManufacture.trim()
        : SelectManufacture,
      ast_det_modelno: SelectModel ? SelectModel.trim() : SelectModel,
      ast_det_serial: SerialNumber ? SerialNumber.trim() : SerialNumber,
      ast_det_asset_cost: AssetCost ? AssetCost.trim() : "",
      ast_det_purchase_date: date_of_purchase,
      ast_det_repl_cost: ResidualValue ? ResidualValue.trim() : "",
      ast_det_warranty_date: date_of_Warranty,
      ast_det_depr_term:
        ExpectedLifeYear && typeof ExpectedLifeYear === "string"
          ? ExpectedLifeYear.trim()
          : ExpectedLifeYear,
      ast_det_cus_code: CustomerCode ? CustomerCode.trim() : CustomerCode,
      ast_det_depr_method: DepreciationMethod ? DepreciationMethod : "",
      ast_det_l_account: LaborAccountValue,
      ast_det_m_account: MaterialAccountValue,
      ast_det_c_account: ContractAccountValue,
      ast_det_depr_date: "",
      ast_det_depr_by: "",
      ast_det_acc_depr_cost: "",
      ast_det_net_book_value: "",
      ast_det_dispose_date: "",
      ast_det_dispose_by: "",
      ast_det_dispose_type: "",
      ast_det_dispose_value: "",

      ast_det_varchar1: UDFText_1 ? UDFText_1.trim() : UDFText_1,
      ast_det_varchar2: UDFText_2 ? UDFText_2.trim() : UDFText_2,
      ast_det_varchar3: UDFText_3 ? UDFText_3.trim() : UDFText_3,
      ast_det_varchar4: UDFText_4 ? UDFText_4.trim() : UDFText_4,
      ast_det_varchar5: UDFText_5 ? UDFText_5.trim() : UDFText_5,
      ast_det_varchar6: UDFText_6 ? UDFText_6.trim() : UDFText_6,
      ast_det_varchar7: UDFText_7 ? UDFText_7.trim() : UDFText_7,
      ast_det_varchar8: UDFText_8 ? UDFText_8.trim() : UDFText_8,
      ast_det_varchar9: UDFText_9 ? UDFText_9.trim() : UDFText_9,
      ast_det_varchar10: UDFText_10 ? UDFText_10.trim() : UDFText_10,
      ast_det_varchar11: UDFText_11 ? UDFText_11.trim() : UDFText_11,
      ast_det_varchar12: UDFText_12 ? UDFText_12.trim() : UDFText_12,
      ast_det_varchar13: UDFText_13 ? UDFText_13.trim() : UDFText_13,
      ast_det_varchar14: UDFText_14 ? UDFText_14.trim() : UDFText_14,
      ast_det_varchar15: UDFText_15 ? UDFText_15.trim() : UDFText_15,
      ast_det_varchar16: UDFText_16 ? UDFText_16.trim() : UDFText_16,
      ast_det_varchar17: UDFText_17 ? UDFText_17.trim() : UDFText_17,
      ast_det_varchar18: UDFText_18 ? UDFText_18.trim() : UDFText_18,
      ast_det_varchar19: UDFText_19 ? UDFText_19.trim() : UDFText_19,
      ast_det_varchar20: UDFText_20 ? UDFText_20.trim() : UDFText_20,
      ast_det_varchar21: UDFText_21 ? UDFText_21.trim() : UDFText_21,
      ast_det_varchar22: UDFText_22 ? UDFText_22.trim() : UDFText_22,
      ast_det_varchar23: UDFText_23 ? UDFText_23.trim() : UDFText_23,
      ast_det_varchar24: UDFText_24 ? UDFText_24.trim() : UDFText_24,
      ast_det_varchar25: UDFText_25 ? UDFText_25.trim() : UDFText_25,
      ast_det_varchar26: UDFText_26 ? UDFText_26.trim() : UDFText_26,
      ast_det_varchar27: UDFText_27 ? UDFText_27.trim() : UDFText_27,
      ast_det_varchar28: UDFText_28 ? UDFText_28.trim() : UDFText_28,
      ast_det_varchar29: UDFText_29 ? UDFText_29.trim() : UDFText_29,
      ast_det_varchar30: UDFText_30 ? UDFText_30.trim() : UDFText_30,

      ast_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : UDFNumber_1,
      ast_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : UDFNumber_2,
      ast_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : UDFNumber_3,
      ast_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : UDFNumber_4,
      ast_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : UDFNumber_5,
      ast_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : UDFNumber_6,
      ast_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : UDFNumber_7,
      ast_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : UDFNumber_8,
      ast_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : UDFNumber_9,
      ast_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : UDFNumber_10,
      ast_det_numeric11: UDFNumber_11 ? UDFNumber_11.trim() : UDFNumber_11,
      ast_det_numeric12: UDFNumber_12 ? UDFNumber_12.trim() : UDFNumber_12,
      ast_det_numeric13: UDFNumber_13 ? UDFNumber_13.trim() : UDFNumber_13,
      ast_det_numeric14: UDFNumber_14 ? UDFNumber_14.trim() : UDFNumber_14,
      ast_det_numeric15: UDFNumber_15 ? UDFNumber_15.trim() : UDFNumber_15,

      ast_det_datetime1: date_of_1 ? date_of_1.trim() : date_of_1,
      ast_det_datetime2: date_of_2 ? date_of_2.trim() : date_of_2,
      ast_det_datetime3: date_of_3 ? date_of_3.trim() : date_of_3,
      ast_det_datetime4: date_of_4 ? date_of_4.trim() : date_of_4,
      ast_det_datetime5: date_of_5 ? date_of_5.trim() : date_of_5,
      ast_det_datetime6: date_of_6 ? date_of_6.trim() : date_of_6,
      ast_det_datetime7: date_of_7 ? date_of_7.trim() : date_of_7,
      ast_det_datetime8: date_of_8 ? date_of_8.trim() : date_of_8,
      ast_det_datetime9: date_of_9 ? date_of_9.trim() : date_of_9,
      ast_det_datetime10: date_of_10 ? date_of_10.trim() : date_of_10,
      ast_det_datetime11: date_of_11 ? date_of_11.trim() : date_of_11,
      ast_det_datetime12: date_of_12 ? date_of_12.trim() : date_of_12,
      ast_det_datetime13: date_of_13 ? date_of_13.trim() : date_of_13,
      ast_det_datetime14: date_of_14 ? date_of_14.trim() : date_of_14,
      ast_det_datetime15: date_of_15 ? date_of_15.trim() : date_of_15,

      asset_type_ID: AutoNumring.trim(),

      audit_user: emp_mst_login_id.trim(),
      ast_mst_create_by: emp_mst_login_id.trim(),
      ast_aud_originator: emp_mst_empl_id.trim(),
      ast_mst_create_date: get_date,

      SingleImguploadStatus: imguploadStatus,
      ImguploadRefStatus: imguploadRefStatus ? imguploadRefStatus : "EMPTY",

      ImgGetDbImgRowId: setDbImgRowIdUpdate,
      ImgUpload: imageSelect,
      SpecialOdrResult: SpecialOdrResult,

      removedRefItems: removedRefItems,
      RowID: RowID,
    };

    // console.log("json_AssetUpdate_____",json_AssetUpdate);

    for (let i = 0; i < AssetMandatoryFiled.length; i++) {
      const item = AssetMandatoryFiled[i];
      const fieldValue = json_AssetUpdate[item.column_name];
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
      setSnackbarSeverity("error");
    } else {
      try {
        const response = await httpCommon.post(
          "/update_asset.php",
          JSON.stringify(json_AssetUpdate),
        );

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
                "/insert_asset_form_reference_multipalImgUpload.php",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data", // Ensure proper content type
                  },
                },
              );

              //console.log("upload_mltipal____",response);
              if (response.data.status == "SUCCESS") {
                Swal.close();
                Swal.fire({
                  icon: "success",
                  customClass: {
                    container: "swalcontainercustom",
                  },
                  title: response.data.status,
                  text: `Asset ` + AssetNo + ` Updated Successfully`,
                  timer: 3000, // Auto-close after 3 seconds
                  timerProgressBar: true, // Optional: Shows a progress bar
                  willClose: () => {
                    // Navigate to the desired page when the modal closes
                    navigate(`/dashboard/asset/list`, {
                      state: {
                        currentPage,
                        selectedOption,
                        selectDropRowID,
                        comeBack: "Come_Back_cancel",
                      },
                    });
                  },
                }).then((result) => {
                  if (result.dismiss !== Swal.DismissReason.timer) {
                    navigate(`/dashboard/asset/list`, {
                      state: {
                        currentPage,
                        selectedOption,
                        selectDropRowID,
                        comeBack: "Come_Back_cancel",
                      },
                    });
                  }
                });
              } else {
                Swal.close();
                // console.log("error__", error);
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
              timer: 3000,
              timerProgressBar: true,
              willClose: () => {
                // Navigate to the desired page when the modal closes
                navigate(`/dashboard/asset/list`, {
                  state: {
                    currentPage,
                    selectedOption,
                    comeBack: "Come_Back_cancel",
                  },
                });
              },
            }).then((result) => {
              if (result.dismiss !== Swal.DismissReason.timer) {
                if (response.data.status === "SUCCESS") {
                  navigate(`/dashboard/asset/list`, {
                    state: {
                      currentPage,
                      selectedOption,
                      comeBack: "Come_Back_cancel",
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

    if (Asset_type_ID === "AG" && Asset_group_ID === "0" && AssetNo === "") {
      setIsAssetEmpty(true);
      const errorMessage =
        "Please fill the required field Asset No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      Asset_type_ID === "MG" &&
      Asset_group_ID === "0" &&
      AssetNo === ""
    ) {
      setIsAssetEmpty(true);
      const errorMessage =
        "Please fill the required field Asset No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (Asset_type_ID === "MM" && AssetNo === "") {
      setIsAssetEmpty(true);
      const errorMessage =
        "Please fill the required field Asset No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_Status == "" || selected_Status == null) {
      setIsAssetStatusEmpty(true);
      const errorMessage = "Please fill the required field Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_CriFactor == "" || selected_CriFactor == null) {
      setIsAssetCriticalFactorEmpty(true);
      const errorMessage =
        "Please fill the required field Critical Factor is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      //setIsAssetCriticalFactorEmpty(true);
    } else if (Short_Description == "" || Short_Description == null) {
      setIsAssetShortDescEmpty(true);
      const errorMessage =
        "Please fill the required field Short Description is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_AssetType == "" || selected_AssetType == null) {
      setIsAssetTypeEmpty(true);
      const errorMessage =
        "Please fill the required field Asset Type is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_AssetCode == "" || selected_AssetCode == null) {
      setIsAssetCodeEmpty(true);
      const errorMessage =
        "Please fill the required field Asset Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_AssetGroupCode == "" ||
      selected_AssetGroupCode == null
    ) {
      setIsAssetGroupCodeEmpty(true);
      const errorMessage =
        "Please fill the required field Asset Group Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_Work_Area == "" || selected_Work_Area == null) {
      setIsAssetWorkAreaEmpty(true);
      const errorMessage = "Please fill the required field Zone is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_Asset_Location == "" ||
      selected_Asset_Location == null
    ) {
      setIsAssetLocation(true);
      const errorMessage =
        "Please fill the required field Asset Location is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_Asset_Level == "" || selected_Asset_Level == null) {
      setIsAssetLeavelEmpty(true);
      const errorMessage = "Please fill the required field Level is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_Charge_Cost_Center == "" ||
      selected_Charge_Cost_Center == null
    ) {
      setIsAssetCostCenterEmpty(true);
      const errorMessage =
        "Please fill the required field Cost Center is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else {
      if (Button_save === "Save") {
        New_Asset();
      } else if (Button_save === "Update") {
        Update_Asset();
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

  const onClickDuplicate = (event) => {
    event.preventDefault();

    if (Asset_type_ID === "AG" && Asset_group_ID === "0" && AssetNo === "") {
      setIsAssetEmpty(true);
      const errorMessage =
        "Please fill the required field Asset No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      Asset_type_ID === "MG" &&
      Asset_group_ID === "0" &&
      AssetNo === ""
    ) {
      setIsAssetEmpty(true);
      const errorMessage =
        "Please fill the required field Asset No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (Asset_type_ID === "MM" && AssetNo === "") {
      console.log("Enter this cotion");
      setIsAssetEmpty(true);
      const errorMessage =
        "Please fill the required field Asset No is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_Status == "" || selected_Status == null) {
      setIsAssetStatusEmpty(true);
      const errorMessage = "Please fill the required field Status is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_CriFactor == "" || selected_CriFactor == null) {
      setIsAssetCriticalFactorEmpty(true);
      const errorMessage =
        "Please fill the required field Critical Factor is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      //setIsAssetCriticalFactorEmpty(true);
    } else if (Short_Description == "" || Short_Description == null) {
      setIsAssetShortDescEmpty(true);
      const errorMessage =
        "Please fill the required field Short Description is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_AssetType == "" || selected_AssetType == null) {
      setIsAssetTypeEmpty(true);
      const errorMessage =
        "Please fill the required field Asset Type is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_AssetCode == "" || selected_AssetCode == null) {
      setIsAssetCodeEmpty(true);
      const errorMessage =
        "Please fill the required field Asset Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_AssetGroupCode == "" ||
      selected_AssetGroupCode == null
    ) {
      setIsAssetGroupCodeEmpty(true);
      const errorMessage =
        "Please fill the required field Asset Group Code is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_Work_Area == "" || selected_Work_Area == null) {
      setIsAssetWorkAreaEmpty(true);
      const errorMessage = "Please fill the required field Zone is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_Asset_Location == "" ||
      selected_Asset_Location == null
    ) {
      setIsAssetLocation(true);
      const errorMessage =
        "Please fill the required field Asset Location is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (selected_Asset_Level == "" || selected_Asset_Level == null) {
      setIsAssetLeavelEmpty(true);
      const errorMessage = "Please fill the required field Level is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else if (
      selected_Charge_Cost_Center == "" ||
      selected_Charge_Cost_Center == null
    ) {
      setIsAssetCostCenterEmpty(true);
      const errorMessage =
        "Please fill the required field Cost Center is required!";
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
    } else {
      if (Button_save === "Duplicate") {
        // console.log("claing Api to duplicate key ");
        New_Asset();
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
        focusCancel: true,
      }).then((result) => {
        if (result.isConfirmed) {
          onClickChange(event);
        } else if (result.isDenied) {
          navigate(`/dashboard/system-admin/password-policy`, {
            state: {
              currentPage,
              selectedOption,
              comeBack: "Come_Back_cancel",
            },
          });
          setIsFormFiled(false);
        }
      });
    } else {
      navigate(`/dashboard/system-admin/password-policy`, {
        state: {
          currentPage,
          selectedOption,
          comeBack: "Come_Back_cancel",
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



  // Asset NO render base oncondition
  useEffect(() => {
    const selectedKey = Asset_Group_Code.find(
      (item) => item.value === selected_AssetGroupCode?.value,
    )?.key;

    if (AssetAutoNumbring.length !== 0) {
      const assetStsus = AssetAutoNumbring[0];

      if (
        assetStsus.cnt_mst_numbering === "A" &&
        assetStsus.cnt_mst_option === "G"
      ) {
        if (selectedKey === "0") {
          setAsset_group_ID(selectedKey);
          setAsset_type_ID("AG");
        } else {
          setAsset_group_ID(selectedKey);
          setAsset_type_ID("AG");
        }
      } else if (
        assetStsus.cnt_mst_numbering === "A" &&
        assetStsus.cnt_mst_option === "M"
      ) {
        setAsset_group_ID(selectedKey);
        setAsset_type_ID("AM");
      } else if (
        assetStsus.cnt_mst_numbering === "M" &&
        assetStsus.cnt_mst_option === "G"
      ) {
        if (selectedKey === "0") {
          setAsset_group_ID(selectedKey);
          setAsset_type_ID("MG");
        } else {
          setAsset_group_ID(selectedKey);
          setAsset_type_ID("MG");
        }
      } else if (
        assetStsus.cnt_mst_numbering === "M" &&
        assetStsus.cnt_mst_option === "M"
      ) {
        setAsset_group_ID(selectedKey);
        setAsset_type_ID("MM");
      }
    }
  }, [selected_AssetGroupCode, AssetAutoNumbring, DuplicatRowid]);


  useEffect(() => {
    if (RowID == "" || RowID == null) {
      if (!selected_Status?.label && Status.length > 0) {
        // Set the selected status to the first item in the Status array
        setSelected_Status(Status[0]);
      }
    }
  }, [selected_Status, Status]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div
          className="CustomBreadAssetSave "
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
            height: "70px",
          }}
        >
          <CustomBreadcrumbs
            // heading="Create Work Order"
            heading="Edit"
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
                          onClick={onClickDuplicate}
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
        </div>
        <div>
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* toggle view strting from here */}

              <Grid container spacing={2} sx={{marginTop:"-20px"}}>
                <Grid xs={12} md={12}>
                  <Card className="mainAssetDiv">
                    <Grid container spacing={2}>
                      <Grid xs={12} md={12}>
                        {/* Asset Master */}
                        <Box
                          role="tabpanel"
                          hidden={Tabvalue !== 0}
                          sx={{ marginTop: "16px" }}
                        >
                          <Card className="AssetFirstTab">
                            <Grid container spacing={0} alignItems={"baseline"}>
                              <Grid xs={12} md={12}>
                                <Box>
                                  <Grid container spacing={2} alignItems={"baseline"}>
                                    <Grid item xs={12} md={6}>
                                      <Box sx={{}}>
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "auto 1fr",
                                            alignItems: "center",
                                            paddingBottom: "20px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          <BsBookmarkDash
                                            size={22}
                                            style={{ marginRight: "4px" }}
                                          />
                                          Password Aging
                                        </div>
                                      </Box>

                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        width="100%"
                                        rowGap={2}
                                        columnGap={1}
                                      >
                                        <Stack
                                          
                                          spacing={1}
                                          sx={{ pb: 1.5 }}
                                        >
                                          <Typography variant="subtitle2">
                                            {findCustomizeLabel(
                                              "pwd_set_agi_ctr",
                                            ) || "Password Aging Control"}

                                      <Checkbox name="pwd_set_agi_ctr" checked={checkboxData.pwd_set_agi_ctr}
                                      onChange={handleOptionChange}
                                      />
                                          </Typography>

                                         
                                        </Stack>
                                      </Box>

                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        width="100%"
                                        rowGap={2}
                                        columnGap={1}
                                      >
                                        <Stack
                                          flexGrow={1}
                                          spacing={1}
                                          sx={{ pb: 1.5,marginTop:"30px" }}
                                        >
                                          <Typography variant="subtitle2">
                                            {findCustomizeLabel(
                                              "pwd_set_agi_itr",
                                            ) || "Password Aging Interval"}
                                          </Typography>

                                          <TextField
                                            name="pwd_set_agi_itr"
                                            size="small"
                                            value={data.pwd_set_agi_itr}
                                            autoComplete="off"
                                            disabled={Button_save === "Update"}
                                            onChange={handleChangeText}
                                          />
                                        </Stack>
                                      </Box>
                                      {/* email */}
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        width="100%"
                                        rowGap={2}
                                        columnGap={1}
                                      >
                                        <Stack
                                          flexGrow={1}
                                          spacing={1}
                                          sx={{ pb: 1.5 }}
                                        >
                                          <Typography
                                            variant="subtitle2"
                                            // className="Requiredlabel"
                                          >
                                            {findCustomizeLabel(
                                              "pwd_set_adv_not",
                                            ) || "Advance Notice:"}
                                          </Typography>

                                          <TextField
                                            name="pwd_set_adv_not"
                                            size="small"
                                            value={data.site_name}
                                            autoComplete="off"
                                            disabled={Button_save === "Update"}
                                            onChange={handleChangeText}
                                        
                                          />
                                        </Stack>
                                      </Box>
                                    </Grid>

                                    {/* grid right */}
                                    <Grid item xs={12} md={6}>
                                      <Box sx={{}}>
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "auto 1fr",
                                            alignItems: "center",

                                            paddingBottom: "20px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          <BsBookmarkDash
                                            size={22}
                                            style={{ marginRight: "4px" }}
                                          />
                                          Password Settings
                                        </div>
                                      </Box>

                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        width="100%"
                                        rowGap={2}
                                        columnGap={1}
                                      >
                                        <Stack
                                          flexGrow={1}
                                          spacing={1}
                                          sx={{ pb: 1.5 }}
                                        >
                                          <Typography variant="subtitle2">
                                            {findCustomizeLabel(
                                              "pwd_set_min_len",
                                            ) || "Minimum Length:"}
                                          </Typography>

                                          <TextField
                                            name="pwd_set_min_len"
                                            size="small"
                                            value={data.pwd_set_min_len}
                                            autoComplete="off"
                                            onChange={handleChangeText}
                                          />
                                        </Stack>

                                        {/* box 2 */}
                                        <Stack
                                          flexGrow={1}
                                          spacing={1}
                                          sx={{ pb: 1.5 }}
                                        >
                                          <Typography
                                            variant="subtitle2"
                                            // className="Requiredlabel"
                                          >
                                            {findCustomizeLabel(
                                              "pwd_set_max_len",
                                            ) || "Maximum Length:"}
                                          </Typography>

                                          <TextField
                                            name="pwd_set_max_len"
                                            size="small"
                                            value={data.pwd_set_max_len}
                                            autoComplete="off"
                                            onChange={handleChangeText}
                                          />
                                        </Stack>
                                      </Box>

                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        width="100%"
                                        rowGap={2}
                                        columnGap={1}
                                      >
                                        <Stack
                                          flexGrow={1}
                                          spacing={1}
                                          sx={{ pb: 1.5 }}
                                        >
                                          <Typography
                                            variant="subtitle2"
                                            // className="Requiredlabel"
                                          >
                                            {findCustomizeLabel(
                                              "pwd_set_pwd_cri",
                                            ) || "Password Criteria:"}
                                          </Typography>

                                          <TextField
                                            name="pwd_set_pwd_cri"
                                            size="small"
                                            value={data.fax_no}
                                            autoComplete="off"
                                            disabled={Button_save === "Update"}
                                            onChange={handleChangeText}
                                            // className={`Extrasize ${
                                            //   isAssetAssetEmpty
                                            //     ? "errorEmpty"
                                            //     : ""
                                            // }`}
                                          />
                                        </Stack>
                                      </Box>

                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        width="100%"
                                        rowGap={2}
                                        columnGap={1}
                                      >
                                        <Stack
                                          flexGrow={1}
                                          spacing={1}
                                          sx={{ pb: 1.5 }}
                                        >
                                          <Typography
                                            variant="subtitle2"
                                            // className="Requiredlabel"
                                          >
                                            {findCustomizeLabel(
                                              "pwd_set_adj_chk",
                                            ) || "Adjacent Checking:"}

                                            <Checkbox name="pwd_set_adj_chk" checked={checkboxData.pwd_set_adj_chk}  onChange={handleOptionChange}/>
                                          </Typography>
                                        </Stack>

                                        <Stack
                                          flexGrow={1}
                                          spacing={1}
                                          sx={{ pb: 1.5 }}
                                        >
                                          <Typography
                                            variant="subtitle2"
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            {findCustomizeLabel(
                                              "pwd_set_min_len",
                                            ) || "Minimum Length:"}

                                            <TextField
                                              name="pwd_set_min_len"
                                              size="small"
                                              value={data.pwd_set_min_len}
                                              autoComplete="off"
                                              onChange={handleChangeText}
                                            />
                                          </Typography>
                                        </Stack>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                            </Grid>

                            <Grid container sx={{ marginTop: "20px" }}>
                              <Grid item>
                                <Box sx={{}}>
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "auto 1fr",
                                      alignItems: "center",

                                      paddingBottom: "20px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <BsBookmarkDash
                                      size={22}
                                      style={{ marginRight: "4px" }}
                                    />
                                    Multiple Sessions
                                  </div>
                                </Box>

                                <Stack
                                  flexGrow={1}
                                  spacing={1}
                                  sx={{ pb: 1.5 }}
                                >
                                  <Typography variant="subtitle2">
                                    {findCustomizeLabel("pwd_set_agi_itr") ||
                                      "Password Aging Interval"}

                                    <Checkbox name="pwd_set_allow_multiple_session" checked={checkboxData.pwd_set_allow_multiple_session} onChange={handleOptionChange} />
                                  </Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Card>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>

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
      <ToastContainer />
    </>
  );
}

Form.propTypes = {
  currentUser: PropTypes.object,
};
