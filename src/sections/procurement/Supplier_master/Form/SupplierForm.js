import PropTypes from "prop-types";
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";

import { styled } from "@mui/material/styles";

// @mui
import { faFileWord } from "@fortawesome/free-solid-svg-icons";
import Autocomplete from "@mui/material/Autocomplete";
import {  ToastContainer } from "react-toastify";
import Container from "@mui/material/Container";
// @bootstrap

import TextareaAutosize from "@mui/material/TextareaAutosize";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import IconButton from "@mui/material/IconButton";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

// import CloseIcon from '@mui/icons-material/Close';

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Unstable_Grid2";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "moment";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

import { DatePicker as AntDatePicker } from "antd";

// utils

// routes
import { RouterLink } from "src/routes/components";

import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";

// components
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";

import DetailsSection from "../component_module/DetailsSection";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

import { format } from "date-fns";

import {
  Alert,
  Checkbox,
  LinearProgress,
  Snackbar,
  Tooltip,
} from "@mui/material";

import dayjs from "dayjs";
import { ProContext } from "../ProContext";
import ShipTo from "../component_module/ShipTo/ShipTo";

import BillTo from "../component_module/ShipTo/BillTo";
import List2 from "../component_module/List2";
import ListOne from "../component_module/List1/ListOne";
import moment from "moment";

import numeral from "numeral";
import heic2any from "heic2any";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
// ----------------------------------------------------------------------

export default function ProForm({ currentUser }) {
  let site_ID = localStorage.getItem("site_ID");
  const { call, setCall, setFullList,setRefresh,setSavedQptions } = useContext(ProContext);
  const location = useLocation();
  const { baseURL } = httpCommon.defaults;
  const [isOpenWork, setIsOpenWork] = useState(true);

  const [isOpenBillTo, setIsOpenBillTo] = useState(true);
  const [isFormFiled, setIsFormFiled] = useState(false);

  const [isOpenWorkUdf1, setIsOpenWorkUdf1] = useState(false);
  const [isOpenWorkUdf2, setIsOpenWorkUdf2] = useState(false);
  const [isOpenWorkUdf3, setIsOpenWorkUdf3] = useState(false);
  // const [RowID,setRowID] = useState();
  const [RowIdData,setRowIdData] = useState([]);

  const { state } = location;

  const { RowID, savedQuery,  currentPage, selectedOption, selectDropRowID ,TabBtnName} = state || {};

  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);
  const inputRef6 = useRef(null);
  const inputRef7 = useRef(null);
  const inputRef8 = useRef(null);
  const inputRef9 = useRef(null);
  const inputRef10 = useRef(null);

  const [progress, setProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [showEmpl, setShowEmpl] = useState(true);

  const [imguploadStatus, setImguploadStatus] = useState("");
  const [imguploadRefStatus, setImguploadRefStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const settings = useSettingsContext();

  const [error2, setError2] = React.useState("");

  // state for tabs
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
// format number
  const formatNumber = (number) => {
    if (number == null) {
      return '';
    }
   
    const parts = number.toString().split('.');
    let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (integerPart.length > 11) {
      integerPart = integerPart.slice(0, 12) + '.' + integerPart.slice(12, 16);
    }
    let decimalPart = parts[1] ? parts[1].slice(0, 2) : '';
  
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    return formattedValue;
  };

  const handleChangenew = (e, setValue, inputRef) => {
    var string = numeral(e.target.value).format('0,0')
    
    // Extract only numbers and dots
    const input = e.target.value.replace(/[^0-9.]/g, '');
  
    // Split input into integer and decimal parts
    let [integerPart, decimalPart] = input.split('.');
  
    // Limit integer part to a max of 11 digits
    if (integerPart && integerPart.replace(/,/g, '').length > 11) {
      integerPart = integerPart.replace(/,/g, '').slice(0, 11);
    }
  
    // Limit decimal part to 4 digits, if it exists
    decimalPart = decimalPart ? decimalPart.slice(0, 4) : '';
  
    // Format the integer part with commas
    const unformattedInteger = integerPart.replace(/,/g, '');
    const formattedInteger = parseInt(unformattedInteger || "0", 10).toLocaleString('en-US');
  
    // Construct the new value with formatted integer and decimal part
    const newValue = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  
    // Update the formatted value
    setValue(newValue);
  
    // Store the cursor position before formatting
    const initialCursorPosition = inputRef.current.selectionStart;
  
    // Calculate the adjusted cursor position based on user input
    const cursorPositionInUnformattedInteger = Math.max(0, initialCursorPosition - (input.length - unformattedInteger.length));
    const formattedLengthDifference = formattedInteger.length - unformattedInteger.length;
  
    // Set cursor position after updating the value
    setTimeout(() => {
      // Calculate the new cursor position
      let newCursorPosition = cursorPositionInUnformattedInteger + formattedLengthDifference;
  
      // If the cursor is at the end of the decimal part, adjust it to stay after the decimal
      if (decimalPart && initialCursorPosition > formattedInteger.length) {
        newCursorPosition = formattedInteger.length + 1; // Position at the decimal point
      }
  
      // Set the cursor position
      inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };
  
  const handleBlur = (value, setValue) => {
    if (value === '.' || value === '') {
      setValue('.0000');
    }
  };
  
  
const getDataByRowId = async()=>{
try {
  
  const response = await httpCommon.get(`/get_sup_mst_row_data.php?RowID=${RowID}&site_cd=${site_ID}`);

if(response.data.status === "SUCCESS"){
  const data = response.data.result[0]
  if(data){
    setTextFields(data)
    setRowIdData(data)
  }

}
} catch (error) {
  console.log("error",error)
}
}

useEffect(()=>{
  getDataByRowId();
},[RowID])     

const openXlsxInNewTab = (fileName) => {
  const baseURL = httpCommon.defaults.baseURL;
  const fileURL = `${baseURL}${fileName}`;
  window.open(fileURL, "_blank");
};
const openDocxInNewTab = (fileName) => {
  const baseURL = httpCommon.defaults.baseURL;
  const fileURL = `${baseURL}${fileName}`;
  window.open(fileURL, "_blank");
};
const fetchListData = async(RowId)=>{

try {
  const response = await httpCommon.get(`/get_sup_ls_data.php?RowId=${RowId}&site_cd=${site_ID}`)

  if(response.data.status === "SUCCESS"){
    const ls1 = response.data.data.ls1;
    const ls2 = response.data.data.ls2;
    if(ls1){
    const formatLs1 = ls1.map((item) => ({
      ...item,
      sup_ls1_datetime1: item.sup_ls1_datetime1 
        ? moment(item.sup_ls1_datetime1.date).format("yyyy-MM-DD") 
        : "",
      sup_ls1_datetime2: item.sup_ls1_datetime2 
        ? moment(item.sup_ls1_datetime2.date).format("yyyy-MM-DD") 
        : "",
      sup_ls1_datetime3: item.sup_ls1_datetime3 
        ? moment(item.sup_ls1_datetime3.date).format("yyyy-MM-DD") 
        : "",
      sup_ls1_numeric1:item.sup_ls1_numeric1 
      ? formatNumber(item.sup_ls1_numeric1)
      : "",
      sup_ls1_numeric2:item.sup_ls1_numeric2
      ? formatNumber(item.sup_ls1_numeric2)
      : "",
    }));

    
    if(formatLs1){



      setList1((pre)=>([
        ...formatLs1,
      ]))
    }
  }
    if(ls2){
      const formatLs2 = ls2.map((item) => ({
        ...item,
        sup_ls2_datetime1: item.sup_ls2_datetime1 
          ? moment(item.sup_ls2_datetime1.date).format("yyyy-MM-DD") 
          : "",
        sup_ls2_datetime2: item.sup_ls2_datetime2 
          ? moment(item.sup_ls2_datetime2.date).format("yyyy-MM-DD") 
          : "",
        sup_ls2_datetime3: item.sup_ls2_datetime3 
          ? moment(item.sup_ls2_datetime3.date).format("yyyy-MM-DD") 
          : "",
          sup_ls2_numeric1:item.sup_ls2_numeric1 
          ? formatNumber(item.sup_ls2_numeric1)
          : "",
          sup_ls1_numeric2:item.sup_ls1_numeric2
          ? formatNumber(item.sup_ls1_numeric2)
          : "",
      }));
  
      
      if(formatLs2){
  
        setList2((pre)=>([
          ...formatLs2,
        ]))
      }
    }
  }



} catch (error) {
  console.log("error",error)
}
  }

  useEffect(()=>{
    if(RowID && state && state.row && RowIdData){
 
      fetchListData(RowID);
    }

  },[RowID && state && state.row && RowIdData])


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
  }, [snackbarOpen,RowID]);



  const toggleDiv = () => {
    setIsOpenWork(!isOpenWork);
  };

  const [checkboxData, setCheckboxData] = useState({
    sup_mst_smallbu: false,
    sup_mst_hub: false,
    sup_mst_on_bid_lst:false,
    sup_mst_insurance:false,
    sup_mst_iso:false,
    sup_mst_blanketpo:false
  });


  const handleCheckboxData = (e) => {
    const name = e.target.name;

    setCheckboxData((pre) => ({
      ...pre,
      [e.target.name]: e.target.checked,
    }));
    setIsFormFiled(true);
  };

  const [Label, setLabel] = useState([]);

  const [image, setImage] = useState({ preview: "", raw: "" });
  const [imageSelect, setImageSelect] = useState({ name: "", path: "" });
  const [getDbImg, setDbImg] = useState("");
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [showdd2, setShowdd2] = useState(false);
  const handleClosedd2 = () => setShowdd2(false);
  const [Button_save, setButton_save] = useState("");
  const queryParams = new URLSearchParams(location.search);
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



  const [Tabvalue, setTabValue] = useState(0);

  // autocomplete state
  const [Status, setStatus] = useState([]);


  const [selected_Status, setSelected_Status] = useState([]);

  const [RefImg, setRefImg] = useState([]);
  const [removedRefItems, setRemovedRefItems] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedPdfFiles, setSelectedPdfFiles] = useState([]);
  const [selectedImages2, setSelectedImages2] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [showdd, setShowdd] = useState(false);
  const [handalImg, sethandalImg] = useState({});
  const handleClosedd = () => setShowdd(false);
  const [getDbImgRowId, setDbImgRowId] = useState("");
  const fileInputRef = useRef(null);
  const [showErrorBorder, setShowErrorBorder] = useState(false);
  const [dialogNew, setDialogNew] = useState(false);

  // auto complete fields

  // Master Dialog
  const [DefaultModal, setDefaultModal] = useState(false);
  const [textField, setTextField] = useState("");


  const [data, setData] = useState({
    emp_mst_status: "",
    emp_mst_login_id: "",
    emp_mst_usr_grp: "",
    emp_det_craft: "",
    emp_det_work_area: "",
    emp_det_work_grp: "",
    emp_det_supervisor_id: "",
    emp_mst_privilege_template: "",
    row_id: "",
  });
 
  const [taxCodeDrp,setTaxCodeDrp] =useState([{}]);
  const [taxCodeOriginal,setTaxCodeOriginal] = useState([])
  const [selectedTaxCode, setselectedTaxCode] = useState("");

  const [buyerDrp,setBuyerDrp] =useState([{}]);
  const [buyerOriginal,setOriginalBuyer] = useState([])
  const [selectedBuyer, setselectedBuyer] = useState("");


const fetchTaxCodeBuyer = async()=>{
try {
  const response = await httpCommon.get(`/get_sup_mst_tax_buyer_drp.php?site_cd=${site_ID}`);
  
  if(response.data.status === "SUCCESS"){
    const data = response.data.result;

    const tax  = data.tax;
    const buyer =data.buyer;
    setTaxCodeOriginal(tax)
    setOriginalBuyer(buyer)

    const formattedTax = tax.map((item)=>({
      label:item.tax_mst_tax_cd + " : " + item.tax_mst_desc,
      value:item.tax_mst_tax_cd + " : " + item.tax_mst_desc
    }))

    const formattedBuyer = buyer.map((item)=>({
      label:item.emp_mst_empl_id + " : " + item.emp_mst_name,
      value:item.emp_mst_empl_id + " : " + item.emp_mst_name
    }))
      setTaxCodeDrp(formattedTax);
      setBuyerDrp(formattedBuyer)
  }
 

  
} catch (error) {
  console.log("error",error)
}
}

useEffect(()=>{
fetchTaxCodeBuyer();
},[RowID])


  const [statusDrp, setStatusDrp] = useState([{}]);
  const [status, setStatusOriginal] = useState([{}]);
  const [selectedStatus, setselectedStatus] = useState("");

  // user Group
  const [currencyDrp, setCurrencyCode] = useState([{}]);
  const [currency,setCurrency] = useState([])

  const [selectedUserGrp, setSelectedUserGrp] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");


  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  const [selectedMstatus, setselectedMstatus] = useState([]);
  const [tableData, setTableData] = useState([]);

 
  // Master Dialog End
  const [textFields, setTextFields] = useState({
    sup_mst_supplier_cd: "",
    sup_mst_name: "",
    sup_mst_services: "",
    sup_mst_desc:"",

    sup_mst_status: "",
    sup_mst_curr_code: "",
    sup_mst_fid: "",
    sup_mst_terms: "",
    sup_mst_tid: "",
    sup_mst_tax_id: "",
    sup_mst_gst_effective_date: "",

    sup_mst_gst_expire_date: "",
    sup_mst_ins_exp: "",
    sup_mst_rating: "",
   
    sup_mst_lp_date: "",
    sup_mst_buyer: "",
    sup_mst_fob: "",
    sup_mst_shipvia: "",
    sup_mst_acct_no: "",
    sup_det_address1: "",
    sup_det_address2: "",
    sup_det_country: "",
    sup_det_province: "",
    sup_det_shi_state: "",
    sup_det_shi_contact:"",
    sup_det_shi_phone:"",
    sup_det_shi_address1:"",
    sup_det_shi_address2:"",
    sup_det_shi_city:"",
    
    sup_det_shi_postal_code:"",
    sup_det_shi_province:"",
    sup_det_shi_country:"",
    sup_det_shi_note:"",

    sup_det_bil_state: "",
    sup_det_bil_postal_code: "",
    sup_det_bil_contact:"",
    sup_det_bil_phone:"",
    sup_det_bil_address1:"",
    sup_det_bil_address2:"",
    sup_det_bil_city:"",
    sup_det_bil_state:"",
    sup_det_bil_postal_code:"",
    sup_det_bil_province:"",
    sup_det_bil_country:"",
    sup_det_bil_note:""
  });

  // ship to drop down state
const [shipToDrp,setShipToDrp] = useState([{}]);
const [selectedShipTo,setSelectedShipTo] = useState("");
const [ship,setShip]=useState([])

// bill to drop down state
const [billToDrp,setBillToDrp] = useState([{}]);
const [selectedBillTo,setSelectedBillTo] = useState("");
const [bill,setBill]=useState([]);

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

};

const formatDropDownValue = (value,rowData)=>{
  let satusFull;
  if(value === "sup_mst_status"){
    const findData=status.find((item)=>item.sup_sts_status === rowData.sup_mst_status  )

    if(findData){
      return findData.sup_sts_status + " : " + findData.sup_sts_typ_cd
      }
  }
  if(value === "sup_mst_curr_code"){
    const findData=currency.find((item)=>item.
    cur_mst_cur_code === rowData.sup_mst_curr_code
    )
    if(findData){
      return findData.cur_mst_cur_code + " : " + findData.
      cur_mst_desc
      
      }

  }
  if(value === "sup_mst_tax_id"){
    const findData=taxCodeOriginal.find((item)=>item.
    tax_mst_tax_cd === rowData.sup_mst_tax_id

    )
    if(findData){
      return findData.tax_mst_tax_cd + " : " + findData.
      tax_mst_desc
      }
  }

  if(value === "sup_mst_buyer"){
    const findData=buyerOriginal.find((item)=>item.emp_mst_empl_id
=== rowData.sup_mst_buyer

    )
    if(findData){
      return findData.emp_mst_empl_id + " : " + findData.emp_mst_name
      }
  }




}

  const [RatingDrp,setRatingDrp] = useState([

    {
      label:"Good (1)",
      value:"1"
    },
    {
      label:"Average (2)",
      value:"2"
    },
    {
      label:"Poor (3)",
      value:"3"
    },
 
  ])
  const [selectedRating,setSelectedRating] = useState("")

  // fetch Statuse
  const fetchStatus = async () => {
    try {
      const response = await httpCommon.get(
        "/get_sup_mst_status.php?site_cd=" + site_ID,
      );

      if (response.data) {
        const status = response.data.emp_status;
        setStatusOriginal(status)

        // Format the data to { label, value }
        const formattedStatus = status.map((item) => ({
          label: `${item.sup_sts_status} : ${item.sup_sts_typ_cd}`,
          value: `${item.sup_sts_status} : ${item.sup_sts_typ_cd}`,
        }));
       
        setStatusDrp(formattedStatus);
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  };

  // fetUserGroup
  const fetCurrencyCode = async () => {
    try {
      const response = await httpCommon.get(
        "/get_sup_mst_currency_code.php?site_cd=" + site_ID,
      );
     

      if (response.data) {
        const data = response.data.res;
        setCurrency(data)

        // Format the data to { label, value }
        const formattedStatus = data.map((item) => ({
          label: `${item.cur_mst_cur_code} : ${item.cur_mst_desc}`,
          value: `${item.cur_mst_cur_code} : ${item.cur_mst_desc}`,
        }));

        setCurrencyCode(formattedStatus);
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  };
  
  const fetchShipBill = async () => {
    try {
      const response = await httpCommon.get(
        "/get_sup_mst_ship_bil_drp.php?site_cd=" + site_ID,
      );
      console.log("response",response)

      if (response.data) {
        const bill = response.data.result.bill
        const ship = response.data.result.ship
      if(bill){
        setBill(bill)

        // Format the data to { label, value }
        const billF = bill.map((item) => ({
          label: item.sup_bil_billto,
          value: item.sup_bil_billto,
        }));
    
        setBillToDrp(billF);
}
if(ship){

  setShip(ship)
  // Format the data to { label, value }
  const shipF = ship.map((item) => ({
    label: item.sup_shi_shipto,
    value: item.sup_shi_shipto
      ,
  }));

  setShipToDrp(shipF);
}
       
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetCurrencyCode();
    fetchShipBill();
  
  }, [RowID]);

  useEffect(() => {
    if (RowID && state && state.row && RowIdData) {
      const rowData = state.row;


      setTextFields((pre) => ({
        ...pre,
        sup_mst_supplier_cd: RowIdData.sup_mst_supplier_cd
          ? RowIdData.sup_mst_supplier_cd
          : "",
          sup_mst_name: RowIdData.sup_mst_name
          ? RowIdData.sup_mst_name
          : "",
          sup_mst_services: RowIdData.sup_mst_services ? RowIdData.sup_mst_services : "",
    
          sup_mst_fid: RowIdData.sup_mst_fid ? RowIdData.sup_mst_fid : "",

        sup_mst_terms: RowIdData.sup_mst_terms ? RowIdData.sup_mst_terms : "",
        sup_mst_tid: RowIdData.sup_mst_tid ? RowIdData.sup_mst_tid : "",

        sup_mst_gst_effective_date: RowIdData.sup_mst_gst_effective_date
          ? RowIdData.sup_mst_gst_effective_date.date
          : "",
          sup_mst_gst_expire_date: RowIdData.sup_mst_gst_expire_date
          ? RowIdData.sup_mst_gst_expire_date.date
          : "",
          sup_mst_ins_exp: RowIdData.sup_mst_ins_exp
          ? RowIdData.sup_mst_ins_exp.date
          : "",

        sup_mst_lp_date: RowIdData.sup_mst_lp_date
          ? RowIdData.sup_mst_lp_date.date
          : "",

          sup_mst_fob: RowIdData.sup_mst_fob
          ? RowIdData.sup_mst_fob
          : "",

          sup_mst_shipvia: RowIdData.sup_mst_shipvia
          ? RowIdData.sup_mst_shipvia
          : "",

          sup_mst_acct_no: RowIdData.sup_mst_acct_no
          ? RowIdData.sup_mst_acct_no
          : "",

          sup_det_address1: RowIdData.sup_det_address1
          ? RowIdData.sup_det_address1
          : "",
          sup_det_address2: RowIdData.sup_det_address2
          ? RowIdData.sup_det_address2
          : "",
          sup_det_country: RowIdData.sup_det_country
          ? RowIdData.sup_det_country
          : "",
       
      }));


      setCheckboxData((pre) => ({
        ...checkboxData,
        sup_mst_smallbu: RowIdData.sup_mst_smallbu == "1"
          ? true
          : false,
          sup_mst_hub: RowIdData.sup_mst_hub == "1"
          ? true
          : false,
          sup_mst_on_bid_lst: RowIdData.sup_mst_on_bid_lst == "1"
          ? true
          : false,
          sup_mst_iso: RowIdData.sup_mst_iso == "1"
          ? true
          : false,
          sup_mst_insurance: RowIdData.sup_mst_insurance == "1" ? true : false,

          sup_mst_blanketpo: RowIdData.sup_mst_blanketpo == "1"
          ? true
          : false
      }));
    
      setSelectedBillTo(RowIdData && RowIdData.sup_det_bil_billto?RowIdData.sup_det_bil_billto:"")

      setSelectedShipTo(RowIdData && RowIdData.sup_det_shi_shipto?RowIdData.sup_det_shi_shipto:"")


      // status
      setselectedStatus(RowIdData.sup_mst_status?formatDropDownValue("sup_mst_status",RowIdData):"")
      setSelectedCurrency(RowIdData.sup_mst_curr_code?formatDropDownValue("sup_mst_curr_code",RowIdData):"")
      setselectedTaxCode(RowIdData.sup_mst_curr_code?formatDropDownValue("sup_mst_tax_id",RowIdData):"")
      setselectedBuyer(RowIdData.sup_mst_buyer?formatDropDownValue("sup_mst_buyer",RowIdData):"")

      const formattedValue = parseInt(RowIdData.sup_mst_rating, 10).toString(); // Remove decimal part
      const matchedRating = RatingDrp.find((rating) => rating.value === formattedValue);
  
      // Set the selected rating based on the backend response
      if (matchedRating) {
        setSelectedRating(matchedRating);
      }
    

      setShowEmpl(false);
      // // UDF TEXT AND NUM
      // setUDFNote2(rowData.emp_det_note2);
      // setUDFNote1(rowData.emp_det_note1);
      setUDFText_1(rowData.sup_det_varchar1);
      setUDFText_2(rowData.sup_det_varchar2);
      setUDFText_3(rowData.sup_det_varchar3);
      setUDFText_4(rowData.sup_det_varchar4);
      setUDFText_5(rowData.sup_det_varchar5);
      setUDFText_6(rowData.sup_det_varchar6);
      setUDFText_7(rowData.sup_det_varchar7);
      setUDFText_8(rowData.sup_det_varchar8);
      setUDFText_9(rowData.sup_det_varchar9);
      setUDFText_10(rowData.sup_det_varchar10);
      setUDFText_11(rowData.sup_det_varchar11);
      setUDFText_12(rowData.sup_det_varchar12);
      setUDFText_13(rowData.sup_det_varchar13);
      setUDFText_14(rowData.sup_det_varchar14);
      setUDFText_15(rowData.sup_det_varchar15);
      setUDFText_16(rowData.sup_det_varchar16);
      setUDFText_17(rowData.sup_det_varchar17);
      setUDFText_18(rowData.sup_det_varchar18);
      setUDFText_19(rowData.sup_det_varchar19);
      setUDFText_20(rowData.sup_det_varchar20);
      setUDFNumber_1(rowData.sup_det_numeric1);
      // setUDFNumber_2(formatNumber(rowData.sup_det_numeric2));
      setUDFNumber_2(rowData.sup_det_numeric2);
      setUDFNumber_3(rowData.sup_det_numeric3);
      setUDFNumber_4(rowData.sup_det_numeric4);
      setUDFNumber_5(rowData.sup_det_numeric5);
      setUDFNumber_6(rowData.sup_det_numeric6);
      setUDFNumber_7(rowData.sup_det_numeric7);
      setUDFNumber_8(rowData.sup_det_numeric8);
      setUDFNumber_9(rowData.sup_det_numeric9);
      setUDFNumber_10(rowData.sup_det_numeric10);
      setUDFDate_1(
        rowData && rowData.sup_det_datetime1 && rowData.sup_det_datetime1.date
          ? rowData.sup_det_datetime1.date
          : "",
      );
      setUDFDate_2(
        rowData && rowData.sup_det_datetime2 && rowData.sup_det_datetime2.date
          ? rowData.sup_det_datetime2.date
          : "",
      );
      setUDFDate_3(
        rowData && rowData.sup_det_datetime3 && rowData.sup_det_datetime3.date
          ? rowData.sup_det_datetime3.date
          : "",
      );
      setUDFDate_4(
        rowData && rowData.sup_det_datetime4 && rowData.sup_det_datetime4.date
          ? rowData.sup_det_datetime4.date
          : "",
      );
      setUDFDate_5(
        rowData && rowData.sup_det_datetime5 && rowData.sup_det_datetime5.date
          ? rowData.sup_det_datetime5.date
          : "",
      );
      setUDFDate_6(
        rowData && rowData.sup_det_datetime6 && rowData.sup_det_datetime6.date
          ? rowData.sup_det_datetime6.date
          : "",
      );
      setUDFDate_7(
        rowData && rowData.sup_det_datetime7 && rowData.sup_det_datetime7.date
          ? rowData.sup_det_datetime7.date
          : "",
      );
      setUDFDate_8(
        rowData && rowData.sup_det_datetime8 && rowData.sup_det_datetime8.date
          ? rowData.sup_det_datetime8.date
          : "",
      );
      setUDFDate_9(
        rowData && rowData.sup_det_datetime9 && rowData.sup_det_datetime9.date
          ? rowData.sup_det_datetime9.date
          : "",
      );
      setUDFDate_10(
        rowData && rowData.sup_det_datetime10 && rowData.sup_det_datetime10.date
          ? rowData.sup_det_datetime10.date
          : "",
      );
    }
  }, [RowID, state,status,currency,taxCodeOriginal,buyerOriginal]);

  const isMyStateEmpty =
    Object.keys(handalImg).length === 0 && handalImg.constructor === Object;

  useEffect(() => {
    if (RowID && state && state.row) {
      fetchImgData();
    }
  }, [RowID]);

  useEffect(() => {

 
    async function fetchData() {
      if (RowID !== undefined && RowID !== null) {
        setButton_save("Update");
        await getEmployeeLebel();
      } else {
        await getEmployeeLebel();
        setButton_save("Save");
      }
      setLoading(false);
    }
    fetchData();
  }, [RowID]);


  // master Dialog UseEffect
  useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField,RowID]);

  // get autocomplete status

  // get status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await httpCommon.get(
          "/get_sup_mst_status.php?site_cd=" + site_ID,
        );

        if (response.data.status === "SUCCESS") {
          setStatus(response.data.emp_status);
          if (RowID && state && state.row) {
            const rowData = state.row;
            const filterData = response.data.emp_status.find(
              (item) => item.sup_sts_status === rowData.sup_sts_status,
            );
            setselectedStatus(
              filterData.sup_sts_status + " : " + filterData.sup_sts_typ_cd,
            );
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchStatus();
  }, [RowID]);



  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = Label.some(
      (item) =>
        item.column_name === columnName && item.cf_label_required === "1",
    );
  

    return foundItem;
  };

  // Get All Filed label Name
  const getEmployeeLebel = async () => {
    try {
      const res = await httpCommon.get(
        "/get_supplier_master_mandatoryfiled.php",
      );


      if (res.data.status === "SUCCESS") {
        setLabel(res.data.mandatory_fields);
      }
    } catch (error) {
      console.log("error", error);
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

  const handleClearImg = (event) => {
    event.preventDefault();
    clearDataImg();
    setDisabledBtn(false);
  };

  const clearDataImg = () => {
    setImage("");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    selectedImages.forEach((file) => {
      formData.append("files[]", file);
    });
  };
  const handleImgChangeSingle2 = (e) => {
    setDisabledBtn(false);
  };


  // Thired Api Call
  const fetchImgData = async () => {
    try {
      const response = await httpCommon.get("/get_sup_mst_img.php?RowID=" + RowID);
   

      if (response.data.data.AllImgGet.length > 0) {
        setDbImg(response.data.data.AllImgGet);
        setDbImgRowId(response.data.data.AllImgGet[0].RowID);
        setImguploadStatus(response.data.data.AllImgGet[0].ImgStatus);

        setImageSelect({
          name: response.data.data.AllImgGet[0].file_name,
          path: response.data.data.AllImgGet[0].attachment,
        });
      }
      if (response.data.data.AllRef.length > 0) {
        setImguploadRefStatus(response.data.data.AllRef[0].ImgStatusRef);

        setRefImg(response.data.data.AllRef);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const openPDFInNewTab = (fileName) => {
    const baseURL = httpCommon.defaults.baseURL;
    const fileURL = `${baseURL}${fileName}`
    // Open the file URL in a new tab
    window.open(fileURL, "_blank");
  };
  const handleDeleteImg = (e) => {
    const s = selectedImages.filter((item, index) => index !== e);
    setSelectedImages(s);
  };
  const handleShowdata = (item) => {
    setSelectedImage(item.attachment);
    setShowdd(true);
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

  // Customizable Label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = Label.find(
      (item) => item.column_name === columnName,
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const handleRequiredField = (body) => {
    const mandatory = Label.filter(
      (item) => item.cf_label_required === "1",
    );

    const missingFields = mandatory.find(
      (item) =>
        !body.hasOwnProperty(item.column_name) ||
        body[item.column_name] === null ||
        body[item.column_name] === undefined ||
        body[item.column_name] === "",
    );

    if (missingFields) {
      const errorMessage = `Please fill the required field: ${missingFields.customize_label}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError2(missingFields.column_name);
      return true;
    }

    return false;
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


  const fetchSup_mst = async () => {
    const curpage = 1;
    try {
      // const response = await httpCommon.get(
      //   `/get_sup_mst_table_data.php?site_cd=${site_ID}&page=${curpage}`,
      // );

      const response = await httpCommon.get(
        `/get_sup_mst_table_data_form.php?site_cd=${site_ID}&page=${curpage}`,
      );
      
     
     

      setTableData(response.data.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSup_mst();
  }, [RowID]);

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
           navigate(`/dashboard/Procurement/supplier`, {
              state: {
                currentPage,
                selectedOption,
                comeBack:"Come_Back_cancel",
                selectedRowIdBack:RowID,
              },
            });
          setIsFormFiled(false);
          //setAssetSubModuleBtn("");   
        }
      });
    }else{
      navigate(`/dashboard/Procurement/supplier`, {
        state: {
          currentPage,
          selectedOption,
          comeBack:"Come_Back_cancel",
          selectedRowIdBack:RowID,
        },
      });
    }

    
  };
  const handleChange = (event, newValue) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTabValue(newValue);
  };

  const handleChangeText = (e) => {

    let value = e.target.value;


    if (e.target.type === "number") {
      value = value.slice(0, 14);
    }
    if (e.target.name === "sup_mst_supplier_cd") {
      value = value.toUpperCase();
    }


  if(e.target.name === "sup_mst_supplier_cd" ){
    const isDuplicate = tableData.some(
      (item) => item.sup_mst_supplier_cd.toLowerCase() === value.toLowerCase(),
    );
    
    if (isDuplicate) {
      setError(true);
    } else {
      setError(false);
      setError2("")
    }

  }

    setTextFields((prev) => ({
      ...prev,
      [e.target.name]: value,
      
    }));
    setIsFormFiled(true);
  };

  // handleCancel
  const handleCancelClick = async (name) => {
    setData((pre) => ({
      ...pre,
      [name]: "",
    }));
  };

  //   handle edit
  const handleEditClick = (e) => {
    setTextField(e);
  };

  const handleErrorToast = (msg) => {
    const errorMessage = `Please fill the required field: ${msg}`;
    setSnackbarOpen(true);
    setSnackbarMessage(errorMessage);
    setSnackbarSeverity("error");
  };

  // verify Email
  const VerifyEmail = (email) => {
    // Email regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Check if email exists and matches the pattern
    if (email && emailPattern.test(email)) {
      return true; // Valid email
    }

    return false; // Invalid email
  };

  // on submit function handleSubmit

  const New_Supplier = async () => {
    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    // let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

    if (error) {
      const errorMessage = `Duplicate Data Found In The Database`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError2("sup_mst_supplier_cd");
    } else if (!textFields.sup_mst_supplier_cd) {
      handleErrorToast("Supplier Code");
      setError2("sup_mst_supplier_cd");
    } else if (!selectedStatus) {
      handleErrorToast("Status");
      setError2("sup_mst_status");
    } else if (!selectedCurrency) {
      handleErrorToast("Currency Code");
      setError2("sup_mst_curr_code");
    }else if(!textFields.sup_mst_desc){
      handleErrorToast("Supplier Name");
      setError2("sup_mst_desc");
      return;
    }
     else {
      // Date
      setError2("")
      if (textFields.emp_det_email_id) {
        const resEmail = VerifyEmail(textFields.emp_det_email_id);

        if (!resEmail) {
          setError2("emp_det_email_id");
          const errorMessage = `Please fill the valid Email ID`;
          setSnackbarOpen(true);
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity("error");
          return;
        }
      }

      //Select Date 1
      let date_1 = "";
      if (UDFDate_1 == "" || UDFDate_1 == null) {
        date_1 = "";
      } else {
        date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      }

      //Select Date 2
      let date_2 = "";
      if (UDFDate_2 == "" || UDFDate_2 == null) {
        date_2 = "";
      } else {
        date_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date2 ", date_2);
      }

      //Select Date 3
      let date_3 = "";
      if (UDFDate_3 == "" || UDFDate_3 == null) {
        date_3 = "";
      } else {
        date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date3 ", date_3);
      }

      //Select Date 4
      let date_4 = "";
      if (UDFDate_4 == "" || UDFDate_4 == null) {
        date_4 = "";
      } else {
        date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date4 ", date_4);
      }

      //Select Date 5
      let date_5 = "";
      if (UDFDate_5 == "" || UDFDate_5 == null) {
        date_5 = "";
      } else {
        date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date5 ", date_5);
      }

      //Select Date 6
      let date_6 = "";
      if (UDFDate_6 == "" || UDFDate_6 == null) {
        date_6 = "";
      } else {
        date_6 = Moment(UDFDate_6).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date6 ", date_6);
      }

      //Select Date 7
      let date_7 = "";
      if (UDFDate_7 == "" || UDFDate_7 == null) {
        date_7 = "";
      } else {
        date_7 = Moment(UDFDate_7).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date7 ", date_7);
      }

      //Select Date 8
      let date_8 = "";
      if (UDFDate_8 == "" || UDFDate_8 == null) {
        date_8 = "";
      } else {
        date_8 = Moment(UDFDate_8).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date8 ", date_8);
      }

      //Select Date 9
      let date_9 = "";
      if (UDFDate_9 == "" || UDFDate_9 == null) {
        date_9 = "";
      } else {
        date_9 = Moment(UDFDate_9).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date9 ", date_9);
      }

      //Select Date 10
      let date_10 = "";
      if (UDFDate_10 == "" || UDFDate_10 == null) {
        date_10 = "";
      } else {
        date_10 = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date10 ", date_10);
      }
      // Date End
 
      // body to send to backend
      var json = {
        ...textFields,
        ...checkboxData,
        site_cd: site_ID,
        sup_mst_status:selectedStatus ?selectedStatus.replace(/ .*/, "") : "",
        sup_mst_curr_code:selectedCurrency ?selectedCurrency.replace(/ .*/, "") : "",
        sup_mst_tax_id:selectedTaxCode ?selectedTaxCode.replace(/ .*/, "") : "",
        sup_mst_rating:selectedRating && selectedRating.value ?selectedRating.value:"",
        sup_mst_buyer:selectedBuyer ? selectedBuyer.replace(/ .*/, "") : "",
        sup_det_shi_shipto:selectedShipTo ? selectedShipTo :"",
        sup_det_bil_billto:selectedBillTo ? selectedBillTo :"",

        sup_mst_gst_effective_date: textFields.sup_mst_gst_effective_date
        ? format(new Date(textFields.sup_mst_gst_effective_date), "yyyy-MM-dd")
        : "",
      
        sup_mst_gst_expire_date: textFields.sup_mst_gst_expire_date
        ? format(new Date(textFields.sup_mst_gst_expire_date), "yyyy-MM-dd")
        : "",

        sup_mst_ins_exp: textFields.sup_mst_ins_exp
        ? format(new Date(textFields.sup_mst_ins_exp), "yyyy-MM-dd")
        : "",

        sup_mst_lp_date: textFields.sup_mst_lp_date
        ? format(new Date(textFields.sup_mst_lp_date), "yyyy-MM-dd")
        : "",

        sup_mst_smallbu:checkboxData.sup_mst_smallbu ?1:0,
        sup_mst_hub:checkboxData.sup_mst_hub ?1:0,
        sup_mst_on_bid_lst:checkboxData.sup_mst_on_bid_lst ?1:0,
        sup_mst_insurance:checkboxData.sup_mst_insurance ?1:0,
        sup_mst_iso:checkboxData.sup_mst_iso ?1:0,
        sup_mst_blanketpo:checkboxData.sup_mst_blanketpo ?1:0,
        sup_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
        sup_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
        sup_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
        sup_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
        sup_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
        sup_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
        sup_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
        sup_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
        sup_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
        sup_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",
        sup_det_varchar11: UDFText_11 ? UDFText_11.trim() : "",
        sup_det_varchar12: UDFText_12 ? UDFText_12.trim() : "",
        sup_det_varchar13: UDFText_13 ? UDFText_13.trim() : "",
        sup_det_varchar14: UDFText_14 ? UDFText_14.trim() : "",
        sup_det_varchar15: UDFText_15 ? UDFText_15.trim() : "",
        sup_det_varchar16: UDFText_16 ? UDFText_16.trim() : "",
        sup_det_varchar17: UDFText_17 ? UDFText_17.trim() : "",
        sup_det_varchar18: UDFText_18 ? UDFText_18.trim() : "",
        sup_det_varchar19: UDFText_19 ? UDFText_19.trim() : "",
        sup_det_varchar20: UDFText_20 ? UDFText_20.trim() : "",

        sup_det_numeric1: UDFNumber_1 ? UDFNumber_1.trim() : UDFNumber_1,
        sup_det_numeric2: UDFNumber_2 ? UDFNumber_2.trim() : UDFNumber_2,
        sup_det_numeric3: UDFNumber_3 ? UDFNumber_3.trim() : UDFNumber_3,
        sup_det_numeric4: UDFNumber_4 ? UDFNumber_4.trim() : UDFNumber_4,
        sup_det_numeric5: UDFNumber_5 ? UDFNumber_5.trim() : UDFNumber_5,
        sup_det_numeric6: UDFNumber_6 ? UDFNumber_6.trim() : UDFNumber_6,
        sup_det_numeric7: UDFNumber_7 ? UDFNumber_7.trim() : UDFNumber_7,
        sup_det_numeric8: UDFNumber_8 ? UDFNumber_8.trim() : UDFNumber_8,
        sup_det_numeric9: UDFNumber_9 ? UDFNumber_9.trim() : UDFNumber_9,
        sup_det_numeric10: UDFNumber_10 ? UDFNumber_10.trim() : UDFNumber_10,

        sup_det_datetime1: date_1,
        sup_det_datetime2: date_2,
        sup_det_datetime3: date_3,
        sup_det_datetime4: date_4,
        sup_det_datetime5: date_5,
        sup_det_datetime6: date_6,
        sup_det_datetime7: date_7,
        sup_det_datetime8: date_8,
        sup_det_datetime9: date_9,
        sup_det_datetime10: date_10,
        ImgUpload: imageSelect,
        audit_user: emp_mst_login_id.trim(),
        emp_mst_create_by: emp_mst_login_id.trim(),
        SingleImguploadStatus: imguploadStatus,
        ImguploadRefStatus: imguploadRefStatus ? imguploadRefStatus : "EMPTY",
        removedRefItems: removedRefItems,
      };
 
    
      const missingField = handleRequiredField(json);

      if (!missingField) {
        Swal.fire({ title: "Loading.... !", allowOutsideClick: false });
        Swal.showLoading();

        try {
          const response = await httpCommon.post(
            "/insert_new_sup_mst.php",
            json,
          );

          const RowID = response.data.inserted_id;
          if (response.data.status === "SUCCESS") {

            setRefresh(true)
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
                  "/sup_form_reference_multipalImg_upload.php",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data", // Ensure proper content type
                    },
                  },
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
                  }).then(() => {

                    navigate(`/dashboard/Procurement/supplier`, {
                      state: { selectedOption, savedQuery },
                    });
                  });
                }
              } catch (error) {
                console.log("error__", error);
                //Handle error  WorkOrderNo
              }
            }
            if (RowID && list1 && list1.length>0) {
        
     
              let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
            const formatList1 = list1.map((item) => ({
          ...item,
          sup_ls1_numeric1: typeof item.sup_ls1_numeric1 === 'string' 
            ? item.sup_ls1_numeric1.replace(/,/g, "") 
            : item.sup_ls1_numeric1, // Leave it as is if not a string
          sup_ls1_numeric2: typeof item.sup_ls1_numeric2 === 'string' 
            ? item.sup_ls1_numeric2.replace(/,/g, "") 
            : item.sup_ls1_numeric2  // Leave it as is if not a string
        }));

              const json = {
                list1:formatList1,
            
                site_cd: site_ID,
                mst_RowID: RowID,
                audit_user: emp_mst_login_id,
              };
          
              try {
                const response = await httpCommon.post(
                  "/insert_new_ls1.php",
                  json,
                );

              } catch (error) {
                console.log("error", error);
              }
            }

            if (RowID && list2 && list2.length>0) {
        
     
              let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
              const formatList2 = list2.map((item) => ({
                ...item,
                sup_ls2_numeric1: typeof item.sup_ls2_numeric1 === 'string' 
                  ? item.sup_ls2_numeric1.replace(/,/g, "") 
                  : item.sup_ls2_numeric1, // Leave it as is if not a string
                sup_ls2_numeric2: typeof item.sup_ls2_numeric2 === 'string' 
                  ? item.sup_ls2_numeric2.replace(/,/g, "") 
                  : item.sup_ls2_numeric2  // Leave it as is if not a string
              }));



              const json = {
                list2:formatList2,
            
                site_cd: site_ID,
                mst_RowID: RowID,
                audit_user: emp_mst_login_id,
          
              };
          
              try {
                const response = await httpCommon.post(
                  "/insert_new_ls2.php",
                  json,
                );
           // console.log("response_ls2",response)
              } catch (error) {
                console.log("error", error);
              }
            }


            Swal.fire({
              icon: "success",
              title: "SUCCESS",
              text: `Created ${textFields.sup_mst_supplier_cd} Successfully`,
              timer: 2000,
            }).then(() => {
              setSavedQptions(selectedOption)
              navigate(`/dashboard/Procurement/supplier`, {
                state: { selectedOption, savedQuery },
              });
             
              setCall(true);
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
            title: "Oops Data Not Insert...",
            text: error,
          });
        }
      }
    }
  };

  // update work request
  const Update_Supplier = async () => {
     Swal.fire({
          title: "Loading.... !",
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
        Swal.showLoading();

    const rowData = state && state.row ? state.row : "";

    let get_date = Moment().utcOffset("+08:00").format("yyyy-MM-DD HH:mm:ss");

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
    let emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");

   if (!textFields.sup_mst_supplier_cd) {
      handleErrorToast("Supplier Code");
      setError2("sup_mst_supplier_cd");
    } else if (!selectedStatus) {
      handleErrorToast("Status");
      setError2("sup_mst_status");
    } else if (!selectedCurrency) {
      handleErrorToast("Currency Code");
      setError2("sup_mst_curr_code");
    }else if(!textFields.sup_mst_desc){
      handleErrorToast("Supplier Name");
      setError2("sup_mst_desc");
      return;
    }
    else {
      setError2("")

      //Select Date 1
      let date_1 = "";
      if (UDFDate_1 == "" || UDFDate_1 == null) {
        date_1 = "";
      } else {
        date_1 = Moment(UDFDate_1).format("yyyy-MM-DD HH:mm:ss").trim();
      }

      //Select Date 2
      let date_2 = "";
      if (UDFDate_2 == "" || UDFDate_2 == null) {
        date_2 = "";
      } else {
        date_2 = Moment(UDFDate_2).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date2 ", date_2);
      }

      //Select Date 3
      let date_3 = "";
      if (UDFDate_3 == "" || UDFDate_3 == null) {
        date_3 = "";
      } else {
        date_3 = Moment(UDFDate_3).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date3 ", date_3);
      }

      //Select Date 4
      let date_4 = "";
      if (UDFDate_4 == "" || UDFDate_4 == null) {
        date_4 = "";
      } else {
        date_4 = Moment(UDFDate_4).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date4 ", date_4);
      }

      //Select Date 5
      let date_5 = "";
      if (UDFDate_5 == "" || UDFDate_5 == null) {
        date_5 = "";
      } else {
        date_5 = Moment(UDFDate_5).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date5 ", date_5);
      }

      //Select Date 6
      let date_6 = "";
      if (UDFDate_6 == "" || UDFDate_6 == null) {
        date_6 = "";
      } else {
        date_6 = Moment(UDFDate_6).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date6 ", date_6);
      }

      //Select Date 7
      let date_7 = "";
      if (UDFDate_7 == "" || UDFDate_7 == null) {
        date_7 = "";
      } else {
        date_7 = Moment(UDFDate_7).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date7 ", date_7);
      }

      //Select Date 8
      let date_8 = "";
      if (UDFDate_8 == "" || UDFDate_8 == null) {
        date_8 = "";
      } else {
        date_8 = Moment(UDFDate_8).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date8 ", date_8);
      }

      //Select Date 9
      let date_9 = "";
      if (UDFDate_9 == "" || UDFDate_9 == null) {
        date_9 = "";
      } else {
        date_9 = Moment(UDFDate_9).format("yyyy-MM-DD HH:mm:ss").trim();
        //console.log("Date9 ", date_9);
      }

      //Select Date 10
      let date_10 = "";
      if (UDFDate_10 == "" || UDFDate_10 == null) {
        date_10 = "";
      } else {
        date_10 = Moment(UDFDate_10).format("yyyy-MM-DD HH:mm:ss").trim();
        // console.log("Date10 ", date_10);
      }
      // Date End


      //Check Img state
      let setDbImgRowIdUpdate;
      if (getDbImgRowId == "" || getDbImgRowId == null) {
        setDbImgRowIdUpdate = "";
      } else {
        setDbImgRowIdUpdate = getDbImgRowId;
      }

      let missingFields = [];

      var json = {
        ...textFields,
        ...checkboxData,
        site_cd: site_ID,
        sup_mst_status:selectedStatus ?selectedStatus.replace(/ .*/, "") : "",
        sup_mst_curr_code:selectedCurrency ?selectedCurrency.replace(/ .*/, "") : "",
        sup_mst_tax_id:selectedTaxCode ?selectedTaxCode.replace(/ .*/, "") : "",
        sup_mst_rating:selectedRating && selectedRating.value ?selectedRating.value:"",
        sup_mst_buyer:selectedBuyer ? selectedBuyer.replace(/ .*/, "") : "",

        sup_mst_gst_effective_date: textFields.sup_mst_gst_effective_date
        ? format(new Date(textFields.sup_mst_gst_effective_date), "yyyy-MM-dd")
        : "",
      
        sup_mst_gst_expire_date: textFields.sup_mst_gst_expire_date
        ? format(new Date(textFields.sup_mst_gst_expire_date), "yyyy-MM-dd")
        : "",

        sup_mst_ins_exp: textFields.sup_mst_ins_exp
        ? format(new Date(textFields.sup_mst_ins_exp), "yyyy-MM-dd")
        : "",

        sup_mst_lp_date: textFields.sup_mst_lp_date
        ? format(new Date(textFields.sup_mst_lp_date), "yyyy-MM-dd")
        : "",

    
        sup_det_varchar1: UDFText_1 ? UDFText_1.trim() : "",
        sup_det_varchar2: UDFText_2 ? UDFText_2.trim() : "",
        sup_det_varchar3: UDFText_3 ? UDFText_3.trim() : "",
        sup_det_varchar4: UDFText_4 ? UDFText_4.trim() : "",
        sup_det_varchar5: UDFText_5 ? UDFText_5.trim() : "",
        sup_det_varchar6: UDFText_6 ? UDFText_6.trim() : "",
        sup_det_varchar7: UDFText_7 ? UDFText_7.trim() : "",
        sup_det_varchar8: UDFText_8 ? UDFText_8.trim() : "",
        sup_det_varchar9: UDFText_9 ? UDFText_9.trim() : "",
        sup_det_varchar10: UDFText_10 ? UDFText_10.trim() : "",
        sup_det_varchar11: UDFText_11 ? UDFText_11.trim() : "",
        sup_det_varchar12: UDFText_12 ? UDFText_12.trim() : "",
        sup_det_varchar13: UDFText_13 ? UDFText_13.trim() : "",
        sup_det_varchar14: UDFText_14 ? UDFText_14.trim() : "",
        sup_det_varchar15: UDFText_15 ? UDFText_15.trim() : "",
        sup_det_varchar16: UDFText_16 ? UDFText_16.trim() : "",
        sup_det_varchar17: UDFText_17 ? UDFText_17.trim() : "",
        sup_det_varchar18: UDFText_18 ? UDFText_18.trim() : "",
        sup_det_varchar19: UDFText_19 ? UDFText_19.trim() : "",
        sup_det_varchar20: UDFText_20 ? UDFText_20.trim() : "",
        sup_det_numeric1: UDFNumber_1 ? parseFloat(UDFNumber_1.replace(/,/g, "")) : "",
        sup_det_numeric2: UDFNumber_2 ? parseFloat(UDFNumber_2.replace(/,/g, "")) : "",
        sup_det_numeric3: UDFNumber_3 ? parseFloat(UDFNumber_3.replace(/,/g, "")) : "",
        sup_det_numeric4: UDFNumber_4 ? parseFloat(UDFNumber_4.replace(/,/g, "")) : "",
        sup_det_numeric5: UDFNumber_5 ? parseFloat(UDFNumber_5.replace(/,/g, "")) : "",
        sup_det_numeric6: UDFNumber_6 ? parseFloat(UDFNumber_6.replace(/,/g, "")) : "",
        sup_det_numeric7: UDFNumber_7 ? parseFloat(UDFNumber_7.replace(/,/g, "")) : "",
        sup_det_numeric8: UDFNumber_8 ? parseFloat(UDFNumber_8.replace(/,/g, "")) : "",
        sup_det_numeric9: UDFNumber_9 ? parseFloat(UDFNumber_9.replace(/,/g, "")) : "",
        sup_det_numeric10: UDFNumber_10 ? parseFloat(UDFNumber_10.replace(/,/g, "")) :"",
        sup_det_datetime1: date_1,
        sup_det_datetime2: date_2,
        sup_det_datetime3: date_3,
        sup_det_datetime4: date_4,
        sup_det_datetime5: date_5,
        sup_det_datetime6: date_6,
        sup_det_datetime7: date_7,
        sup_det_datetime8: date_8,
        sup_det_datetime9: date_9,
        sup_det_datetime10: date_10,
        sup_det_shi_shipto:selectedShipTo ? selectedShipTo :"",
        sup_det_bil_billto:selectedBillTo ? selectedBillTo :"",
        sup_det_shi_note:textFields?textFields.sup_det_shi_note:"",
        sup_det_shi_province:textFields?textFields.sup_det_shi_province:"",
        sup_mst_smallbu:checkboxData.sup_mst_smallbu ?1:0,
        sup_mst_hub:checkboxData.sup_mst_hub ?1:0,
        sup_mst_on_bid_lst:checkboxData.sup_mst_on_bid_lst ?1:0,
        sup_mst_insurance:checkboxData.sup_mst_insurance ?1:0,
        sup_mst_iso:checkboxData.sup_mst_iso ?1:0,
        sup_mst_blanketpo:checkboxData.sup_mst_blanketpo ?1:0,
        ImgGetDbImgRowId: setDbImgRowIdUpdate,
        ImgUpload: imageSelect,
        audit_user: emp_mst_login_id.trim(),
        sup_mst_create_by: emp_mst_login_id.trim(),
        SingleImguploadStatus: imguploadStatus?imguploadStatus:"",
        ImguploadRefStatus: imguploadRefStatus ? imguploadRefStatus : "EMPTY",
        removedRefItems: removedRefItems?removedRefItems:"",
        // row_id: rowData.RowID,
        row_id: data && data.row_id ? data.row_id : rowData.RowID,
      };
      const missingField = handleRequiredField(json);

      if (!missingField) {

        try {
          const response = await httpCommon.post("/update_sup_mst.php", json);

        //  console.log("response_sup",response)

          if (response.data.status === "SUCCESS") {
            Swal.close();
            // reference Image

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
                  "/sup_form_reference_multipalImg_upload.php",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data", // Ensure proper content type
                    },
                  },
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
                  }).then(() => {
                    navigate(`/dashboard/Procurement/supplier`, {
                      state: {
                        currentPage,
                        selectedOption,
                        selectDropRowID,
                        selectedRowIdBack:RowID,
                        comeBack:"Come_Back_cancel",
                      },
                    });
                  });
                }
              } catch (error) {
                console.log("error__", error);
                //Handle error  WorkOrderNo
              }
            }
          
          
            if (RowID && list1 && list1.length>0) {
        
     
              let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
            const formatList1 = list1.map((item) => ({
  ...item,
  sup_ls1_numeric1: typeof item.sup_ls1_numeric1 === 'string' 
    ? item.sup_ls1_numeric1.replace(/,/g, "") 
    : item.sup_ls1_numeric1, // Leave it as is if not a string
  sup_ls1_numeric2: typeof item.sup_ls1_numeric2 === 'string' 
    ? item.sup_ls1_numeric2.replace(/,/g, "") 
    : item.sup_ls1_numeric2  // Leave it as is if not a string
}));



              const json = {
                list1:formatList1,
            
                site_cd: site_ID,
                mst_RowID: RowID,
                audit_user: emp_mst_login_id,
              };
          
              try {
                const response = await httpCommon.post(
                  "/insert_new_ls1.php",
                  json,
                );

              } catch (error) {
                console.log("error", error);
              }
            }

            if (RowID && list2 && list2.length>0) {
        
     
              let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
              const formatList2 = list2.map((item) => ({
                ...item,
                sup_ls2_numeric1: typeof item.sup_ls2_numeric1 === 'string' 
                  ? item.sup_ls2_numeric1.replace(/,/g, "") 
                  : item.sup_ls2_numeric1, // Leave it as is if not a string
                sup_ls2_numeric2: typeof item.sup_ls2_numeric2 === 'string' 
                  ? item.sup_ls2_numeric2.replace(/,/g, "") 
                  : item.sup_ls2_numeric2  // Leave it as is if not a string
              }));



              const json = {
                list2:formatList2,
            
                site_cd: site_ID,
                mst_RowID: RowID,
                audit_user: emp_mst_login_id,
          
              };
          
              try {
                const response = await httpCommon.post(
                  "/insert_new_ls2.php",
                  json,
                );
          //  console.log("response_ls2",response)
              } catch (error) {
                console.log("error", error);
              }
            }


        //  console.log("response",response)

          Swal.close();
            Swal.fire({
              icon: "success",
              title: response.data.status,
              text: `Updated ${textFields.sup_mst_supplier_cd} Successfully`,
              timer: 2000,
            }).then(() => {
             // setSavedQptions(selectedOption)
              navigate(`/dashboard/Procurement/supplier`, {
                state: {
                  currentPage,
                  selectedOption,
                  selectDropRowID,
                  selectedRowIdBack:RowID,
                  comeBack:"Come_Back_cancel",
                },
              });
             // setCall(true);
              
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
          console.log("error", error);
        }
      }
    }
  };

  // handle Submit end
  const onClickChange = (event) => {
    event.preventDefault();
    setShowErrorBorder(false);
  
    if (Button_save === "Save") {
      New_Supplier();
    } else if (Button_save === "Update") {
      Update_Supplier();
    }
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div
          className="CustomBreadAssetSave asset cb"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
          }}
        >
          <CustomBreadcrumbs
            heading={RowID !== undefined && RowID !== null ? `Edit ${textFields.sup_mst_supplier_cd} Supplier` : "Create New Supplier"}
            links={[
        
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
                          ).trim() && item.key === "CLOSE",
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

                <ToastContainer />
              </div>
            }
            sx={{ mb: { xs: 5, md: 5 } }}
          />
          {/* Tabs  Section   */}
          <Grid container spacing={3} sx={{ marginTop: "-14px" }}>
            <Grid xs={12} md={12}>
              <Tabs
                value={Tabvalue}
                onChange={handleChange}
                aria-label="Basic tabs"
                defaultValue={0}
                sx={{
                  background: "#8080800d",
                  borderRadius: "5px",
                  marginTop: "10px",
                  "& .MuiTab-root": {
                    textTransform: "none",
                  },
                  "& .Mui-selected": {
                    color: "#000",
                    fontWeight: "bold",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "blue",
                  },
                  "& .MuiTabScrollButton-root": {
                    display: {
                      xs: "flex",
                      sm: "none",
                    },
                  },
                }}
                className="emp"
              >
                {/* 0 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="clarity:employee-group-line"
                        style={{ marginRight: "4px" }}
                      />
                      Supplier Master
                    </div>
                  }
                />

                {/* 1 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="akar-icons:info-fill"
                        style={{ marginRight: "4px" }}
                      />
                      Supplier Detail
                    </div>
                  }
                />

                {/* 2 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="material-symbols-light:local-shipping-outline-rounded"
                        
                        style={{ marginRight: "4px",height:"24px",width:"24px" }}
                      />
                      Ship & Bill To
                    </div>
                  }
                />

                {/* 3  */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="material-symbols:order-approve-outline"
                        style={{ marginRight: "4px" }}
                      />
                      List 1
                    </div>
                  }
                />

                {/* 4  */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="material-symbols:order-approve-outline"
                        style={{ marginRight: "4px" }}
                      />
                      List 2
                    </div>
                  }
                />

                {/* 5 */}

                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="codicon:references"
                        style={{ marginRight: "4px" }}
                      />
                      Attachment
                    </div>
                  }
                />
              </Tabs>
            </Grid>
          </Grid>
        </div>

        {/* tab section end */}
        <Box role="tabpanel" hidden={Tabvalue !== 0} sx={{ marginTop: "0px" }}>
          <div>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <>
                <div
                  className="MainOrderFromGd"
                  style={{ backgroundColor: "white" }}
                >
                  <Grid container spacing={0}>
                    <Grid xs={12} md={10} className="imgGird1">
                      <Card sx={{ p: 3 }}>
                        {/* Image mobile Section */}
                      
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
                                               src={require("../Add_Image_icon.png")}
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
                                    onClose={handleClosedd2}
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
                                            width: "100%%",
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
                          {/* master Form */}
                          <Grid
                            container
                            width="100%"
                            alignItems="baseline"
                            spacing={2}
                          >
                            {/* Grid 1 */}
                            <Grid item xs={12} md={6}>
                              {/*Supplier Code	 */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  style={{ color: "red" }}
                                >
                                  {findCustomizeLabel("sup_mst_supplier_cd") ||
                                    "Supplier Code"}
                                </Typography>
                                <TextField
                                  id="outlined-basic"
                                  variant="outlined"
                                  name="sup_mst_supplier_cd"
                                  size="small"
                                  value={textFields.sup_mst_supplier_cd}
                                  disabled={!showEmpl}
                                  defaultValue={""}
                                  onChange={handleChangeText}
                                  
                                  className={`Extrasize ${
                                    error2 === "sup_mst_supplier_cd"
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  inputProps={{ maxLength: 25, autoComplete: "off" }}
                                />
                              </Stack>

                              {/* Status */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className="Requiredlabel"
                                >
                                  {findCustomizeLabel("sup_mst_desc") ||
                                    "Supplier Name"}
                                </Typography>

                                <TextareaAutosize
                                  aria-label="empty textarea"
                                  name="sup_mst_desc"
                                  minRows={6.9}
                                  value={textFields.sup_mst_desc}
                                  className={`TxtAra ${
                                    error2 === "sup_mst_desc"
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  style={{ width: "100%",resize:"none"  }}
                                  inputProps={{
                                    maxLength: 225
                                  }}
                                  onChange={handleChangeText}
                                />
                              </Stack>

                              {/* Services */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel(
                                      "sup_mst_services",
                                    )
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_services") ||
                                    "Services"}
                                </Typography>

                                <TextField
                                  id="outlined-basic"
                                  size="small"
                                  variant="outlined"
                                  className={`Extrasize ${
                                    error2 === "sup_mst_services"
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  name="sup_mst_services"
                                  fullWidth
                                  value={textFields.sup_mst_services}
                                  onChange={handleChangeText}
                                  inputProps={{ maxLength: 25, autoComplete: "off" }}
                                />
                              </Stack>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              {/* status  */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  style={{ color: "red" }}
                                >
                                  {findCustomizeLabel("sup_mst_status") ||
                                    "Status"}
                                </Typography>

                                <Autocomplete
                                  options={statusDrp}
                                  value={selectedStatus ? selectedStatus : ""}
                                  onChange={(event, newValue) => {
                                    if (newValue && newValue.value) {
                                      setselectedStatus(newValue.value);
                                      setError2("");
                                      setIsFormFiled(true);
                                    } else {
                                      setselectedStatus("");
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          error2 === "sup_mst_status"
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>

                              {/* user Group new */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  style={{ color: "red" }}
                                >
                                  {findCustomizeLabel("sup_mst_curr_code") ||
                                    "Currency Code"}
                                </Typography>

                                <Autocomplete
                                  options={currencyDrp}
                                  value={selectedCurrency ? selectedCurrency : ""}
                                  className={`Extrasize ${
                                    error2 === "sup_mst_curr_code"
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  onChange={(event, newValue) => {
                                    setError2("");

                                    if (newValue && newValue.value) {
                                      setSelectedCurrency(newValue.value);
                                      setIsFormFiled(true);
                                    } else {
                                      setSelectedCurrency("");
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          error2 === "sup_mst_curr_code"
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>

                              {/*Company Registration No*/}
                              <div
                                className="loginId"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Stack
                                  spacing={1}
                                  sx={{ pb: 1.5, width: "100%",mt:-0.3 }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    className={
                                      findCustomizerequiredLabel("sup_mst_fid")
                                        ? "red"
                                        : ""
                                    }
                                  >
                                    {findCustomizeLabel("sup_mst_fid") ||
                                      "Company Registration No"}
                                  </Typography>

                                  <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    name="sup_mst_fid"
                                    size="small"
                             
                                    value={textFields.sup_mst_fid}
                                   
                                    onChange={handleChangeText}
                                    
                                    className={`Extrasize ${
                                      error2 === "sup_mst_fid"
                                        ? "errorEmpty"
                                        : ""
                                    }`}
                                    inputProps={{ maxLength: 25 ,autoComplete: "off" }}
                                  />
                                </Stack>
                              </div>

                              {/* Terms */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel("sup_mst_terms")
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_terms") ||
                                    "Terms"}{" "}
                                </Typography>

                                <TextField
                                  id="outlined-basic"
                                  variant="outlined"
                                  name="sup_mst_terms"
                                  size="small"
                                  value={textFields.sup_mst_terms}
                                  defaultValue={""}
                                  onChange={handleChangeText}
                              
                                  className={`Extrasize ${
                                    error2 === "sup_mst_terms"
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  inputProps={{ maxLength: 20 ,autoComplete: "off"}}
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Grid>
                    {/* image section */}

                    <Grid xs={12} md={2} className="imgGird">
                      <Card sx={{ pt: 10, pb: 5, px: 3 }}>
                        <Box
                          sx={{
                            mb: 5,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {/* ************************************* img ******************************************* */}
                          {/* desktop image */}
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
                                              src={require("../Add_Image_icon.png")}
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
                                    onClose={handleClosedd2}
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
                                            width: "100%",
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
                </div>

                {/* Box 2 */}
                <Card sx={{ p: 1.5, mt: 1 }}>
                  <div>
                    <div style={{ display: "flex" }}>
                      <button className="ToggleBttnIcon" onClick={toggleDiv}>
                        <Iconify
                          icon="clarity:employee-group-line"
                          style={{ marginRight: "5px", width: "17px" }}
                        />
                        Information
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
                        <Box>
                          <Grid
                            container
                            width="100%"
                            alignItems="baseline"
                            spacing={2}
                          >
                            <Grid item xs={12} md={6}>
                              {/* GST Registration No*/}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel("sup_mst_tid")
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_tid") ||
                                    "GST Registration No"}{" "}
                                </Typography>

                                <TextField
                                  id="outlined-basic"
                                  size="small"
                                  variant="outlined"
                                  className={`Extrasize ${
                                    error2 === "sup_mst_tid" ? "errorEmpty" : ""
                                  }`}
                                  name="sup_mst_tid"
                                  fullWidth
                                  value={textFields.sup_mst_tid}
                                  onChange={(e) => {
                                    let value = e.target.value;
                                    if (value.length > 25) {
                                      value = value.slice(0, 25);
                                      setIsFormFiled(true);
                                    }
                                    setTextFields((pre) => ({
                                      ...pre,
                                      sup_mst_tid: value,
                                    }));
                                  }}
                
                                  inputProps={{ maxLength: 25,autoComplete: "off" }}
                                />
                              </Stack>
                              {/* GST registration no */}

                              
                            
                              {/* GST Default Tax Code */}
                              {/* Auto Complete */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel("sup_mst_tax_id")
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_tax_id") ||
                                    "GST Default Tax Code"}{" "}
                                </Typography>

                               
                                <Autocomplete
                                  options={taxCodeDrp}
                                  value={selectedTaxCode ? selectedTaxCode : ""}
                                  onChange={(event, newValue) => {
                                    setError2("");

                                    if (newValue && newValue.value) {
                                      setselectedTaxCode(newValue.value);
                                      setIsFormFiled(true);
                                    } else {
                                      setselectedTaxCode("");
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          error2 === "sup_mst_tax_id"
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                              {/* GST Default Tax Code */}

                              {/* GST Effective Date*/}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel(
                                      "sup_mst_gst_effective_date",
                                    )
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel(
                                    "sup_mst_gst_effective_date",
                                  ) || "GST Effective Date"}
                                </Typography>

                                
                                <AntDatePicker
                                  value={textFields.sup_mst_gst_effective_date ? dayjs(textFields.sup_mst_gst_effective_date) : null}
                                  format="DD/MM/YYYY"
                                  placeholder="DD/MM/YYYY"
                                  onChange={(newDate) => {
                                    if (newDate && newDate.isValid()) {
                                      const nativeDate = newDate.toDate();
                                      
                                      setTextFields((pre)=>(
                                      { ...pre,sup_mst_gst_effective_date:nativeDate}
                                      
                                      ))
                                      setIsFormFiled(true);
                                    } else {
                                      setTextFields((pre)=>({
                                        ...pre,sup_mst_gst_effective_date:null
                                      }));
                                    }
                                  }}
                                />

                           
                              </Stack>

                              {/* GST Expire Date */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel(
                                      "sup_mst_gst_expire_date",
                                    )
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel(
                                    "sup_mst_gst_expire_date",
                                  ) || "GST Expire Date"}{" "}
                                </Typography>


                                       
                          <AntDatePicker
                            value={textFields.sup_mst_gst_expire_date ? dayjs(textFields.sup_mst_gst_expire_date) : null}
                            format="DD/MM/YYYY"
                            placeholder="DD/MM/YYYY"
                            onChange={(newDate) => {
                              if (newDate && newDate.isValid()) {
                                const nativeDate = newDate.toDate();
                                setTextFields((pre)=>(
                                 { ...pre,sup_mst_gst_expire_date:nativeDate}
                                ))
                                setIsFormFiled(true);
                              } else {
                                setTextFields((pre)=>({
                                  ...pre,sup_mst_gst_expire_date:null
                                }));
                              }
                            }}
                          />

                              </Stack>

                              {/* Insurance Expire Date */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel(
                                      "sup_mst_ins_exp",
                                    )
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_ins_exp") ||
                                    "Insurance Expire Date"}
                                </Typography>
                                <AntDatePicker
                            value={textFields.sup_mst_ins_exp ? dayjs(textFields.sup_mst_ins_exp) : null}
                            format="DD/MM/YYYY"
                            placeholder="DD/MM/YYYY"
                            onChange={(newDate) => {
                              if (newDate && newDate.isValid()) {
                                const nativeDate = newDate.toDate();
                                setTextFields((pre)=>(
                                 { ...pre,sup_mst_ins_exp:nativeDate}
                                ))
                                setIsFormFiled(true);
                              } else {
                                setTextFields((pre)=>({
                                  ...pre,sup_mst_ins_exp:null
                                }));
                              }
                            }}
                          />
                          </Stack>

                              {/* Last PO Date */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel(
                                      "sup_mst_lp_date",
                                    )
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_lp_date") ||
                                    "Last PO Date"}
                                </Typography>
                                <AntDatePicker
                            value={textFields.sup_mst_lp_date ? dayjs(textFields.sup_mst_lp_date) : null}
                            format="DD/MM/YYYY"
                            placeholder="DD/MM/YYYY"
                            onChange={(newDate) => {
                              if (newDate && newDate.isValid()) {
                                const nativeDate = newDate.toDate();
                                setTextFields((pre)=>(
                                 { ...pre,sup_mst_lp_date:nativeDate}
                                ))
                                setIsFormFiled(true);
                              } else {
                                setTextFields((pre)=>({
                                  ...pre,sup_mst_lp_date:null
                                }));
                              }
                            }}
                          />
                        </Stack>

                           

                              {/* Rating */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>

                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel("sup_mst_rating")
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_rating") ||
                                    "Rating"}
                                </Typography>
                                <Autocomplete
                                  options={RatingDrp}
                                  value={selectedRating ? selectedRating.label : ""}
                                  onChange={(event, newValue) => {
                                    setError2("");

                                    if (newValue) {
                                      setSelectedRating(newValue);
                                      setIsFormFiled(true);
                                    } else {
                                      setSelectedRating("");
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          error2 === "sup_mst_curr_code"
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>
                            </Grid>

                            {/* Grid 2 */}
                            <Grid item xs={12} md={6}>
                              {/* date of birth */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel("sup_mst_buyer")
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_buyer") ||
                                    "Buyer"}
                                </Typography>
                                <Autocomplete
                                  options={buyerDrp}
                                  value={selectedBuyer ? selectedBuyer : ""}
                                  onChange={(event, newValue) => {
                                    setError2("");

                                    if (newValue && newValue.value) {
                                      setselectedBuyer(newValue.value);
                                      setIsFormFiled(true);
                                    } else {
                                      setselectedBuyer("");
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          error2 === "sup_mst_buyer"
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>

                              {/* 
                         
                     "default_header": "Freight on Board",
                                */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel("sup_mst_fob")
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_fob") ||
                                    "Freight on Board"}{" "}
                                </Typography>
                                <TextField
                                  id="outlined-basic"
                                  variant="outlined"
                                  name="sup_mst_fob"
                                  className={`Extrasize ${
                                    error2 === "sup_mst_fob" ? "errorEmpty" : ""
                                  }`}
                                  size="small"
                                  value={
                                    textFields && textFields.sup_mst_fob
                                      ? textFields.sup_mst_fob
                                      : ""
                                  }
                                  onChange={handleChangeText}
                                  inputProps={{ maxLength: 20,autoComplete: "off" }}
                                />
                              </Stack>

                              {/* 
            "default_header": "Ship Via",
             */}
                              <Stack spacing={1} sx={{ pb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  className={
                                    findCustomizerequiredLabel(
                                      "sup_mst_shipvia",
                                    )
                                      ? "red"
                                      : ""
                                  }
                                >
                                  {findCustomizeLabel("sup_mst_shipvia") ||
                                    "Ship Via"}
                                </Typography>
                                <TextField
                                  id="outlined-basic"
                                  variant="outlined"
                                  name="sup_mst_shipvia"
                                  className={`Extrasize ${
                                    error2 === "sup_mst_shipvia"
                                      ? "errorEmpty"
                                      : ""
                                  }`}
                                  size="small"
                                  value={
                                    textFields && textFields.sup_mst_shipvia
                                      ? textFields.sup_mst_shipvia
                                      : ""
                                  }
                                  onChange={handleChangeText}
                                  inputProps={{ maxLength: 30 ,autoComplete: "off"}}
                                />
                              </Stack>
                              {/*ship via end*/}


                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 50,
                                }}
                              >
                                {/*Account no */}
                                <Stack
                                  spacing={1}
                                  sx={{ pb: 1.5, width: "100%" }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    className={
                                      findCustomizerequiredLabel(
                                        "sup_mst_acct_no",
                                      )
                                        ? "red"
                                        : ""
                                    }
                                  >
                                    {findCustomizeLabel("sup_mst_acct_no") ||
                                      "Account no"}{" "}
                                  </Typography>

                                  <TextField
                                    id="outlined-basic"
                                    size="small"
                                    variant="outlined"
                                    className={`Extrasize ${
                                      error2 === "sup_mst_acct_no"
                                        ? "errorEmpty"
                                        : ""
                                    }`}
                                
                                    name="sup_mst_acct_no"
                                    value={textFields.sup_mst_acct_no}
                                    fullWidth
                                    onChange={handleChangeText}
                                    inputProps={{ maxLength: 50 ,autoComplete: "off"}}
                                  
                                  />
                                </Stack>
                              </div>


                              <Stack
                                spacing={1}
                                sx={{ pb: 1.5, width: "100%", mt: 3 }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginRight: "20px",
                                      width: "100%",
                                    }}
                                    className={
                                      findCustomizerequiredLabel(
                                        "sup_mst_smallbu",
                                      )
                                        ? "red"
                                        : ""
                                    }
                                  >
                                    {findCustomizeLabel("sup_mst_smallbu") ||
                                      "Small Business:"}

                                    {/* checked value sent from parent */}
                                    <Checkbox
                                      name="sup_mst_smallbu"
                                      onChange={handleCheckboxData}
                                      checked={
                                        checkboxData.sup_mst_smallbu
                                      }
                                    />
                                  </Typography>


                                  {/* HUB Business */}
                                  <Typography
                                    variant="subtitle2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginRight: "20px",
                                      width: "100%",
                                    }}
                                    className={
                                      findCustomizerequiredLabel("sup_mst_hub")
                                        ? "red"
                                        : ""
                                    }
                                  >
                                    {findCustomizeLabel("sup_mst_hub") ||
                                      "HUB Business:"}

                                    {/* checked value sent from parent */}
                                    <Checkbox
                                      name="sup_mst_hub"
                                      onChange={handleCheckboxData}
                                      checked={checkboxData.sup_mst_hub}
                                    />
                                  </Typography>
                                  {/* HUB Business End*/}
                                </div>
                              </Stack>

                              <Stack
                                spacing={1}
                                sx={{ pb: 1.5, width: "100%", mt: 4 }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginRight: "20px",
                                      width: "100%",
                                    }}
                                    className={
                                      findCustomizerequiredLabel(
                                        "sup_mst_on_bid_lst",
                                      )
                                        ? "red"
                                        : ""
                                    }
                                  >
                                    {findCustomizeLabel("sup_mst_on_bid_lst") ||
                                      "On Bid List:"}

                                    {/* checked value sent from parent */}
                                    <Checkbox
                                      name="sup_mst_on_bid_lst"
                                      onChange={handleCheckboxData}
                                      checked={
                                        checkboxData.sup_mst_on_bid_lst
                                      }
                                    />
                                  </Typography>

                                  <Typography
                                    variant="subtitle2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginRight: "20px",
                                      width: "100%",
                                    }}
                                    className={
                                      findCustomizerequiredLabel("sup_mst_iso")
                                        ? "red"
                                        : ""
                                    }
                                  >
                                    {findCustomizeLabel(
                                      "sup_mst_iso",
                                    ) || "ISO 9000" }

                                    {/* checked value sent from parent */}
                                    <Checkbox
                                      name="sup_mst_iso"
                                      onChange={handleCheckboxData}
                                      checked={
                                        checkboxData.sup_mst_iso
                                      }
                                    />
                                  </Typography>
                                </div>
                              </Stack>


                              <Stack
                                spacing={1}
                                sx={{ pb: 1.5, width: "100%", mt: 3 }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginRight: "20px",
                                      width: "100%",
                                    }}
                                    className={
                                      findCustomizerequiredLabel(
                                        "sup_mst_insurance",
                                      )
                                        ? "red"
                                        : ""
                                    }
                                  >
                                    {findCustomizeLabel(
                                      "sup_mst_insurance",
                                    ) || "Insurance"}

                                    {/* checked value sent from parent */}
                                    <Checkbox
                                      name="sup_mst_insurance"
                                      onChange={handleCheckboxData}
                                      checked={
                                        checkboxData.sup_mst_insurance
                                    }
                                    />
                                  </Typography>

                                  {/* blanket PO */}
                                  <Typography
                                    variant="subtitle2"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginRight: "20px",
                                      width: "100%",
                                    }}
                                    className={
                                      findCustomizerequiredLabel(
                                        "sup_mst_blanketpo",
                                      )
                                        ? "red"
                                        : ""
                                    }
                                  >
                                    {findCustomizeLabel(
                                      "sup_mst_blanketpo",
                                    ) || "Blanket PO"}

                                    {/* checked value sent from parent */}
                                    <Checkbox
                                      name="sup_mst_blanketpo"
                                      onChange={handleCheckboxData}
                                      checked={
                                        checkboxData.sup_mst_blanketpo
                                      }
                                    />
                                  </Typography>
                                </div>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Box>
                      </>
                    )}
                  </div>
                </Card>


   
              </>
            )}
          </div>
        </Box>
    
        {/* tab 1 */}
        <Box role="tabpanel" hidden={Tabvalue !== 1}>
          {/*Details*/}

          <DetailsSection
            findCustomizeLabel={findCustomizeLabel}
            handleChangeText={handleChangeText}
            textFields={textFields}
            findCustomizerequiredLabel={findCustomizerequiredLabel}
            error2={error2}
            setTextFields={setTextFields}
            billToDrp={billToDrp}
            selectedBillTo={selectedBillTo}
            setSelectedBillTo={setSelectedBillTo}
            shipToDrp={shipToDrp}
            selectedShipTo={selectedShipTo}
            setSelectedShipTo={setSelectedShipTo}
          />

          {/* UDF TEXT  */}
          <Card sx={{ p: 1.5, mt: 1 }}>
            <div>
              <div style={{ display: "flex" }}>
                <button
                  className="ToggleBttnIcon"
                  onClick={() => setIsOpenWorkUdf1(!isOpenWorkUdf1)}
                >
                  <Iconify
                    icon="material-symbols:date-range-outline"
                    style={{ marginRight: "5px", width: "17px" }}
                  />
                  UDF Text
                  {isOpenWorkUdf1 ? (
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
              {isOpenWorkUdf1 && (
                <>
                  <Box>
                    {/* List1 */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar1")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar1") ||
                              "Varchar1"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar1" ? "errorEmpty" : ""
                            }`}
                            name="sup_det_varchar1"
                            defaultValue={UDFText_1}
                            onChange={(e) => {
                              setUDFText_1(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off" }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar2")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar2") ||
                              "Varchar2"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar2" ? "errorEmpty" : ""
                            }`}
                            name="sup_det_varchar2"
                            defaultValue={UDFText_2}
                            onChange={(e) => {
                              setUDFText_2(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar3")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar3") ||
                              "Varchar3"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar3"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar3" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_3}
                            onChange={(e) => {
                              setUDFText_3(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar4")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar4") ||
                              "Varchar4"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar4"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar4" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_4}
                            onChange={(e) => {
                              setUDFText_4(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar5")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar5") ||
                              "Varchar5"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar5" ? "errorEmpty" : ""
                            }`}
                            name="sup_det_varchar5"
                            defaultValue={UDFText_5}
                            onChange={(e) => {
                              setUDFText_5(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar6")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar6") ||
                              "Varchar6"}
                          </Typography>

                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar6"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar6" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_6}
                            onChange={(e) => {
                              setUDFText_6(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 , autoComplete: "off" }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar7")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar7") ||
                              "Varchar7"}
                          </Typography>

                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar7"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar7" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_7}
                            onChange={(e) => {
                              setUDFText_7(e.target.value);
                            }}
                            inputProps={{ maxLength: 100, autoComplete: "off" }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar8")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar8") ||
                              "Varchar8"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar8"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar8" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_8}
                            onChange={(e) => {
                              setUDFText_8(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off" }}
                          />
                        </Stack>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar9")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar9") ||
                              "Varchar9"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar9"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar9" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_9}
                            onChange={(e) => {
                              setUDFText_9(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar10")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar10") ||
                              "Varchar10"}
                          </Typography>

                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar10"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar10" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_10}
                            onChange={(e) => {
                              setUDFText_10(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off" }}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar11")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar11") ||
                              "Varchar11"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar11" ? "errorEmpty" : ""
                            }`}
                            name="sup_det_varchar11"
                            value={UDFText_11}
                            onChange={(e) => {
                              setUDFText_11(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off" }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar12")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar12") ||
                              "Varchar12"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar12" ? "errorEmpty" : ""
                            }`}
                            name="sup_det_varchar12"
                            value={UDFText_12}
                            onChange={(e) => {
                              setUDFText_12(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar13")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar13") ||
                              "Varchar13"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar13"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar13" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_13}
                            onChange={(e) => {
                              setUDFText_13(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar14")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar14") ||
                              "Varchar14"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar14"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar14" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_14}
                            onChange={(e) => {
                              setUDFText_14(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar15")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar15") ||
                              "Varchar15"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar15" ? "errorEmpty" : ""
                            }`}
                            name="sup_det_varchar15"
                            defaultValue={UDFText_15}
                            onChange={(e) => {
                              setUDFText_15(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar16")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar16") ||
                              "Varchar16"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar16"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar16" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_16}
                            onChange={(e) => {
                              setUDFText_16(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar17")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar17") ||
                              "Varchar17"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar17"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar17" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_17}
                            onChange={(e) => {
                              setUDFText_17(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar18")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar18") ||
                              "Varchar18"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar18"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar18" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_18}
                            onChange={(e) => {
                              setUDFText_18(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar19")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar19") ||
                              "Varchar19"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar19"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar19" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_19}
                            onChange={(e) => {
                              setUDFText_19(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_varchar20")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_varchar20") ||
                              "Varchar20"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            name="sup_det_varchar20"
                            className={`Extrasize ${
                              error2 === "sup_det_varchar20" ? "errorEmpty" : ""
                            }`}
                            defaultValue={UDFText_20}
                            onChange={(e) => {
                              setUDFText_20(e.target.value);
                            }}
                            inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </div>
          </Card>

          {/*UDF Number  */}
          <Card sx={{ p: 1.5, mt: 1 }}>
            <div>
              <div style={{ display: "flex" }}>
                <button
                  className="ToggleBttnIcon"
                  onClick={() => setIsOpenWorkUdf2(!isOpenWorkUdf2)}
                >
                  <Iconify
                    icon="material-symbols:date-range-outline"
                    style={{ marginRight: "5px", width: "17px" }}
                  />
                  UDF Numeric
                  {isOpenWorkUdf2 ? (
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
              {isOpenWorkUdf2 && (
                <>
                  <Box>
                    {/* List1 */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        {/* Numeric Value */}
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_numeric1")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_numeric1") ||
                              "Numeric1"}
                          </Typography>


                          <TextField
                            size="small"
                            inputRef={inputRef1}
                            variant="outlined"
                            name="sup_det_numeric1"
                            className={`Extrasize ${
                              error2 === "sup_det_numeric1" ? "errorEmpty" : ""
                            }`}
                            type="text"
                            value={UDFNumber_1}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_1,inputRef1)}
                            onBlur={(e)=>handleBlur(UDFNumber_1,setUDFNumber_1)}
                            inputProps={{
                              style: { textAlign: "right" },
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_numeric2")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_numeric2") ||
                              "Numeric2"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_numeric2" ? "errorEmpty" : ""
                            }`}
                            value={UDFNumber_2}
                            type="text"
                            inputRef={inputRef2}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_2,inputRef2)}
                            onBlur={(e)=>handleBlur(UDFNumber_2,setUDFNumber_2)}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_numeric3")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_numeric3") ||
                              "Numeric3"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_numeric3" ? "errorEmpty" : ""
                            }`}

                            inputRef={inputRef3}
                            value={UDFNumber_3}
                            
                            onChange={(e)=>handleChangenew(e,setUDFNumber_3,inputRef3)}
                            onBlur={(e)=>handleBlur(UDFNumber_3,setUDFNumber_3)}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography
                            variant="subtitle2"
                            className={
                              findCustomizerequiredLabel("sup_det_numeric4")
                                ? "red"
                                : ""
                            }
                          >
                            {findCustomizeLabel("sup_det_numeric4") ||
                              "Numeric4"}
                          </Typography>

                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_numeric4" ? "errorEmpty" : ""
                            }`}
                            inputRef={inputRef4}
                              value={UDFNumber_4}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_4,inputRef4)}
                            onBlur={(e)=>handleBlur(UDFNumber_4,setUDFNumber_4)}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_numeric5") ||
                              "Numeric5"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className={`Extrasize ${
                              error2 === "sup_det_numeric5" ? "errorEmpty" : ""
                            }`}


                            inputRef={inputRef5}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_5,inputRef5)}
                            onBlur={(e)=>handleBlur(UDFNumber_5,setUDFNumber_5)}
                            value={UDFNumber_5}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        {/* Numeric Value */}
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_numeric6") ||
                              "Numeric6"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            name="sup_det_numeric11"
                          

                            inputRef={inputRef6}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_6,inputRef6)}
                            onBlur={(e)=>handleBlur(UDFNumber_6,setUDFNumber_6)}
                            value={UDFNumber_6}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_numeric7") ||
                              "Numeric7"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            value={UDFNumber_7}
                            inputRef={inputRef7}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_7,inputRef7)}
                            onBlur={(e)=>handleBlur(UDFNumber_7,setUDFNumber_7)}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_numeric8") ||
                              "Numeric8"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            value={UDFNumber_8}

                            inputRef={inputRef8}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_8,inputRef8)}
                            onBlur={(e)=>handleBlur(UDFNumber_8,setUDFNumber_8)}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_numeric9") ||
                              "Numeric9"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            value={UDFNumber_9}
                            inputRef={inputRef9}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_9,inputRef9)}
                            onBlur={(e)=>handleBlur(UDFNumber_9,setUDFNumber_9)}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_numeric10") ||
                              "Numeric10"}
                          </Typography>
                          <TextField
                            size="small"
                            variant="outlined"
                            className="Extrasize"
                            value={UDFNumber_10}
                            inputRef={inputRef10}
                            onChange={(e)=>handleChangenew(e,setUDFNumber_10,inputRef10)}
                            onBlur={(e)=>handleBlur(UDFNumber_10,setUDFNumber_10)}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </div>
          </Card>

          {/* UDF Datetime */}
          <Card sx={{ p: 1.5, mt: 1 }}>
            <div>
              <div style={{ display: "flex" }}>
                <button
                  className="ToggleBttnIcon"
                  onClick={() => setIsOpenWorkUdf3(!isOpenWorkUdf3)}
                >
                  <Iconify
                    icon="formkit:datetime"
                    style={{ marginRight: "5px", width: "17px" }}
                  />
                  UDF Datetime
                  {isOpenWorkUdf3 ? (
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
              {isOpenWorkUdf3 && (
                <>
                  <Box>
                    {/* List1 */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        {/* Date time 1 */}
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime1") ||
                              "Datetime1"}
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
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime2") ||
                              "Datetime2"}
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
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime3") ||
                              "Datetime3"}
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
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime4") ||
                              "Datetime4"}
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
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime5") ||
                              "Datetime5"}
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
                            }}
                          />
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime6") ||
                              "Datetime6"}
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
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime7") ||
                              "Datetime7"}
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
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime8") ||
                              "Datetime8"}
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
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime9") ||
                              "Datetime9"}
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
                            }}
                          />
                        </Stack>

                        <Stack spacing={1} sx={{ pb: 1.5 }}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("sup_det_datetime10") ||
                              "Datetime10"}
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
                            }}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </div>
          </Card>
        </Box>

        <Box role="tabpanel" hidden={Tabvalue !== 2} sx={{ marginTop: "16px" }}>

            <ShipTo
                findCustomizeLabel={findCustomizeLabel}
                handleChangeText={handleChangeText}
                textFields={textFields}
                handleCancelClick={handleCancelClick}
                handleEditClick={handleEditClick}
                shipToDrp={shipToDrp}
                selectedShipTo={selectedShipTo}
                setSelectedShipTo={setSelectedShipTo}
                RowID={RowID}
                error2={error2}
                setError2={setError2}
                setTextFields={setTextFields}
                findCustomizerequiredLabel={findCustomizerequiredLabel}
                
         />

         {/* bill to */}

          {/* UDF TEXT  */}
          <Card sx={{ p: 1.5, mt: 1 }}>
            <div>
              <div style={{ display: "flex" }}>
                <button
                  className="ToggleBttnIcon"
                  onClick={() => setIsOpenBillTo(!isOpenBillTo)}
                  style={{fontSize:"14px"}}
                >
                  <Iconify
                    icon="material-symbols:date-range-outline"
                    style={{ marginRight: "5px", width: "20px",height: "20px"  }}
                  />
                  Bill To

                       {isOpenBillTo ? (
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
                     {isOpenBillTo && (
                             <>
                          <BillTo  
                                findCustomizeLabel={findCustomizeLabel}
                                handleChangeText={handleChangeText}
                                textFields={textFields}
                                handleCancelClick={handleCancelClick}
                                handleEditClick={handleEditClick}
                                billToDrp={billToDrp}
                                selectedBillTo={selectedBillTo}
                                setSelectedBillTo={setSelectedBillTo}
                                error2={error2}
                                setTextFields={setTextFields}
                                findCustomizerequiredLabel={findCustomizerequiredLabel}
                
                              />
                             </>
                             )} 
                            </div>
                          </Card>
        </Box>

        {/* tab3 */}
        <Box role="tabpanel" hidden={Tabvalue !== 3} sx={{  }}>
       
            <div>
              {RowID && state && state.row ? (
                <ListOne
                  setMaintenceResult={setList1}
                  MaintenceResult={list1}
                  RowIDProp={RowID}
                  state={state}
                  error2={error2}
                  setSnackbarOpen={setSnackbarOpen}
                  setSnackbarMessage={setSnackbarMessage}
                  setSnackbarSeverity={setSnackbarSeverity}
                />
              ) : (
                <ListOne
                  setMaintenceResult={setList1}
                  MaintenceResult={list1}
                  RowIDProp={""}
                  state={null}
                  error2={error2}
                  setSnackbarOpen={setSnackbarOpen}
                  setSnackbarMessage={setSnackbarMessage}
                  setSnackbarSeverity={setSnackbarSeverity}
                />
              )}
            </div>
 
        </Box>

        {/* 4 */}
        <Box
          role="tabpanel"
          hidden={Tabvalue !== 4}
          sx={{ width: "100%", background: "black" }}
        >
          {RowID && state && state.row ? (
            <List2
              setMaintenceResult={setList2}
              MaintenceResult={list2}
              RowIDProp={RowID}
              state={state}
              error2={error2}
              setSnackbarOpen={setSnackbarOpen}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarSeverity={setSnackbarSeverity}
            />
          ) : (
            <List2
              setMaintenceResult={setList2}
              MaintenceResult={list2}
              RowIDProp={""}
              state={null}
              error2={error2}
              setSnackbarOpen={setSnackbarOpen}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarSeverity={setSnackbarSeverity}
            />
          )}

          <ToastContainer />
        </Box>
        <Box
          role="tabpanel"
          hidden={Tabvalue !== 5}
          
        >
             <Grid container>
                      <Grid xs={12} md={12} className="mainDivClass" sx={{ paddingBottom:"10px" }} >
                       <Card className="AssetDetail">
                       
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
                                  //  setIsFormFiled(true);
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
                                          //  setIsFormFiled(true);
                                            handleDeleteReferenceApi(item.RowID)
                                          }}
                                           className="btn multiplsimg"
                                         >
                                          <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                                           <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                                         <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                                         <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                                         <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                                        <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                                        <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                                       </button>
                                     </td>
                                   </tr>
                                     
                                   ): (
                                     <tr key={index}>
                                       <td>
                                         <img
                                           key={index}
                                           //src={URL.createObjectURL(image)}
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
                                           <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
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
                                          handleImageChange(e);   
                                         // setIsFormFiled(true); 
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

        <div className="AssetFromSnackbar">
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={null}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
      
            sx={{
              boxShadow:
                "0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)",
              "& .MuiAlert-filledError": {
                backgroundColor: "#fff",
                color: "#000",
                fontWeight: "600",
                position: "relative",
                animation: snackbarOpen ? "bounce-in 0.5s ease-out" : "none", // Apply bouncing animation conditionally
              },
            }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              variant="filled"
             
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

        <ToastContainer />
      </Container>
    </>
  );
}

ProForm.propTypes = {
  currentUser: PropTypes.object,
};
