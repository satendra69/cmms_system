import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import Moment from "moment";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Iconify from "src/components/iconify";
//import WorkStockNoPopupData from "./WorkStockNoPopupData";
//import logo from "../../../../assets/img/screw.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextareaAutosize from "@mui/material/TextareaAutosize";



import { Menu, MenuItem } from "@mui/material";

import httpCommon from "src/http-common";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const AssetUsage = ({ onRowClick, data }) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);


  const [show, setShow] = useState(false);

  

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [StockNo, setStockNo] = useState([]);
  const [selected_StockNo, setSelected_StockNo] = useState([]);

  const [StockLocation, setStockLocation] = useState([]);
  const [selected_StockLocation, setSelected_StockLocation] = useState([]);

  const [Description, setDescription] = useState("");
  const [PartNo, setPartNo] = useState("");
  const [TotalOh, setTotalOh] = useState("");

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState(
    []
  );

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  const [QtyNeeded, setQtyNeeded] = useState("");

  const location = useLocation();

  const [Button_save, setButton_save] = useState("");
  const [FormStatus, setFormStatus] = useState(data.formStatus);
  const [RowID, setRowID] = useState(data.RowID);
  const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo);
  const [selected_Charge_Cost_Center, setselected_Charge_Cost_Center] =
    useState(data.selected_Charge_Cost_Center);

  //const [AssetNo, setAssetNo] = useState(data.Asset_No.split(' : ')[0]);
  const [AssetNo, setAssetNo] = useState();
  const [UOM, setUOM] = useState("");
  const [ItemCost, setItemCost] = useState("");
  const [MaterialRequestNo, setMaterialRequestNo] = useState("");
  const [MrLineNo, setMrLineNo] = useState("");
  const [MrApprovalStatus, setMrApprovalStatus] = useState("");
  const [ActualQuantity, setActualQuantity] = useState("");
  const [ContractPoNo, setContractPoNo] = useState("");
  const [ContractPoLine, setContractPoLine] = useState("");
  const [getStockNo, setGetStockNo] = useState([]);
  //const [modalOpenAsset, setModalOpenAsset] = useState(false);
  const [modalRowDt, setmodalRowDt] = useState("");

  const [MeterInstallDate, setMeterInstallDate] = useState(new Date());
  const [UsageDate, setUsageDate] = useState(new Date());
 
  const [Selected_UsageUOM, setSelected_UsageUOM] = useState([]);


  const [MeterID, setMeterID] = useState();
  const [UsageUOM, setUsageUOM] = useState([]);
  const [selectedUom, setSelectedUom] = useState([]);
  const [TotalRunning, setTotalRunning] = useState(false);
  const [MeterPoint, setMeterPoint] = useState("");
  const [AstLs2Desc,setAstLs2Desc] = useState("");
  const [GetMasterInstallDate, setgetMasterInstallDate] = useState('');
  const [GetUsageDate, setgetUsageDate] = useState('');
  const [GetUsageReading,setGetUsageReading] = useState("");
  const [AvgUsage, setAvgUsage] = useState("");
  const [MeterInstalledUsage,setMeterInstalledUsage] = useState("");
  const [LtdUsage, setLtdUsage] = useState("");
  const [Maxavgusage,setMaxavgusage] = useState("");
  const [GetWarrantyUsage, setWarrantyUsage] = useState("");
  const [GetMeterMaximum,setGetMeterMaximum] = useState("");
  const [MeterInstallWO,setMeterInstallWO] = useState("");
  const [AlertROFlag,setAlertROFlag] = useState(null);
  const [AlertMAFlag,setAlertMAFlag] = useState(null);
  const [RowID2,setRowID2] = useState("");

  const [astls2Label, setAstls2Label] = useState([]);

  const [AssetUsageMandatoryFiled, setAssetUsageMandatoryFiled] = useState([]);
  const [errorField, setErrorField] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowIndex, setMenuRowIndex] = useState(null);


  const handleMenuClick = (event, index) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuRowIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowIndex(null);
  };
  
  useEffect(() => {
    if(FormStatus !== "" && FormStatus == "NEW" ){
      get_Asset_Usage_Header(site_ID);
    }else{
      get_Asset_Usage(site_ID, RowID);
    }
    getUsageUOM(site_ID);
    getAssetUsageFromLebel();
    getAssetUsageMandatoryfiled();
    // get_workorder_status(site_ID, "All", location.state.select);
  }, [location]);

  // First Api
  const get_Asset_Usage = async (site_ID, RowID) => {
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `/get_asset_usage.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );

      if (response.data.status === "SUCCESS") {
        setHeader(response.data.data.header);
        setResult(response.data.data.result);
        Swal.close();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };

  const get_Asset_Usage_Header = async (site_ID) =>{
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `/get_asset_usage.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );

      if (response.data.status === "SUCCESS") {
        setHeader(response.data.data.header);
       // setResult(response.data.data.result);
        Swal.close();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  }  
 // Get UOM
  const getUsageUOM = async () => {
    try {
      const response = await httpCommon.get(
        `/getUsageUOM.php?site_cd=${site_ID}`
      );
      //    console.log("response____Asset_Usage___", response);
      if (response.data.status === "SUCCESS") {
        setUsageUOM(response.data.data.result);
        let UOMLIST = response.data.data.result.map((item) => ({
          label: item.uom_mst_uom + " : " + item.uom_mst_desc,
          value: item.uom_mst_desc,
          key: item.uom_mst_uom,
        }));
        setUsageUOM(UOMLIST);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };

  // Get All Filed label Name
const getAssetUsageFromLebel = async () => {
  try {
    const response = await httpCommon.get("/get_asset_spares_and_usage_from_lebal.php");
    // console.log("response____getLabel",response);
    if (response.data.status === "SUCCESS") {
      setAstls2Label(response.data.data.ast_ls2);
      //setAstdetLabel(response.data.data.ast_ls2);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  // Get All Filed label Name
  const getAssetUsageMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_asset_spares_and_usage_from_mandatory_filed.php");
      
      if (response.data && response.data.data && response.data.data.MandatoryField) {

        if (response.data.data.MandatoryField.length > 0) {
          
          setAssetUsageMandatoryFiled(response.data.data.MandatoryField);
  
        }
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const findCustomizeLabel = (columnName) => {
    if (!Array.isArray(astls2Label)) return "";
    const matchingColumn = astls2Label.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  
  };
  
  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = AssetUsageMandatoryFiled.find(item => item.column_name === columnName);
    if (foundItem && foundItem.cf_label_required === "1") {
        return "Requiredlabel";
    }
    return "";
  };

const headerStyles = {
  "Meter ID": { width: "100px" }, // Example width
  "Usage UOM": { width: "80px" }, // Example width
  "Total Running Meter": { width: "120px" }, // Example width
  "Meter Point": { width: "100px" }, // Example width
  "Description": { width: "800px" }, // Width for Description
  "Meter Install Date": { width: "120px" }, // Example width
  "Usage Date": { width: "120px" }, // Example width
  "Usage Reading": { width: "120px" }, // Example width
  "Average Usage": { width: "120px" }, // Example width
  "Old LTD Usage": { width: "120px" }, // Example width
  "LTD Usage": { width: "120px" }, // Example width
  "Max Average Usage": { width: "120px" }, // Example width
  "Warranty Usage": { width: "120px" }, // Example width
  "Meter Maximum": { width: "120px" }, // Example width
  "Alert MA Flag": { width: "100px" }, // Example width
  "Alert RO Flag": { width: "100px" }, // Example width
  "Meter Install WO": { width: "120px" }, // Example width
};
  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center",
    };
    
    return (
      <>

<TableCell key="action" style={cellStyle}>
                Action
            </TableCell>
            {Object.keys(Header).map((attr) => (
                <TableCell
                    key={attr}
                    style={{
                        ...cellStyle,
                        ...headerStyles[attr], // Apply individual header styles
                    }}
                >
                    {attr}
                </TableCell>
            ))}
      </>
    );
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "No date available"; 
  
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, '0'); // Get day and pad with leading zero
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, pad with leading zero
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0'); // Get hours, pad with leading zero
    const minutes = String(dateObj.getMinutes()).padStart(2, '0'); // Get minutes, pad with leading zero
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  
  const formatNumber = (number) => {
    if (number == null) {
      return '';
    }
  
    let [integerPart, decimalPart] = number.toString().split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
  
    return `${integerPart}.${decimalPart}`;
  };

  //Body
  const renderTableRows = () => {
    return Result.map((result, index) => (
      <TableRow
        key={index}
        
        style={{ cursor: "pointer", transition: "background-color 0.3s" }}
        onMouseEnter={(event) =>
          (event.currentTarget.style.backgroundColor = "#f0f0f0")
        }
        onMouseLeave={(event) =>
          (event.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
            <IconButton 
                    onClick={(event) => {
                        event.stopPropagation(); // Prevent the event from bubbling up to the TableRow
                        handleMenuClick(event, index);
                    }}
                >
                   <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuRowIndex === index}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem key={index}
            onClick={(event) => {
              event.stopPropagation(); 
              handleEdit(result, event);
            }}

            > <Iconify icon="solar:pen-bold" width="15px" height="15px" marginRight="5px"/> Edit</MenuItem>
            <MenuItem 
            onClick={(event) => {
              event.stopPropagation(); 
              handleDelete(result, event);
            }}
            > <Iconify icon="solar:trash-bin-trash-bold" width="15px" height="20px" marginRight="5px"/> Delete</MenuItem>
          </Menu>
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.ast_ls2_meter_id}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.ast_ls2_usage_uom}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          <FormControlLabel
            value="top"
            
            control={
              <Checkbox
                checked={result.ast_ls2_incr_usage_flag === "Y"}
                
              />
            }
          />
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.ast_ls2_meter_point}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center",width:"30%" }}>
          {result.ast_ls2_meter_desc}
        </TableCell>

        {result.ast_ls2_meter_install_date &&
        result.ast_ls2_meter_install_date.date ? (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {formatDateTime(result.ast_ls2_meter_install_date.date)}
          </TableCell>
        ) : (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {/* Render empty value */}
          </TableCell>
        )}
        {result.ast_ls2_usage_date && result.ast_ls2_usage_date.date ? (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {formatDateTime(result.ast_ls2_usage_date.date)}
          </TableCell>
        ) : (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {/* Render empty value */}
          </TableCell>
        )}
     
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.ast_ls2_usage_reading)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.ast_ls2_avg_usage)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.ast_ls2_old_ltd_usage)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.ast_ls2_ltd_usage)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.ast_ls2_max_avg_usage)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.ast_ls2_warranty_usage)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.ast_ls2_meter_maximum)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          <FormControlLabel
            value="top"
            
            control={
              <Checkbox
                checked={result.ast_ls2_alert_ma_flag === "Y"}
                
              />
            }
          />
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          <FormControlLabel
            value="top"
            
            control={
              <Checkbox
                checked={result.ast_ls2_alert_ro_flag === "Y"}
                
              />
            }
          />
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.ast_ls2_meter_install_wo}
        </TableCell>
      </TableRow>
    ));
  };

  const handleEdit = (data) => {
    
    // Handle edit logic here
    setRowID2(data.RowID);
    setMeterID(data.ast_ls2_meter_id);
    setSelectedUom(data.ast_ls2_usage_uom);
    setTotalRunning(data.ast_ls2_incr_usage_flag);
    setMeterPoint(data.ast_ls2_meter_point);
    setAstLs2Desc(data.ast_ls2_meter_desc);
    setgetMasterInstallDate(data.ast_ls2_meter_install_date);
    setgetUsageDate(data.ast_ls2_usage_date);
    setGetUsageReading(formatNumber(data.ast_ls2_usage_reading));
    setAvgUsage(formatNumber(data.ast_ls2_max_avg_usage));
    setMeterInstalledUsage(formatNumber(data.ast_ls2_old_ltd_usage));
    setLtdUsage(formatNumber(data.ast_ls2_old_ltd_usage));
    setMaxavgusage(formatNumber(data.ast_ls2_max_avg_usage));
    setWarrantyUsage(formatNumber(data.ast_ls2_warranty_usage));
    setGetMeterMaximum(formatNumber(data.ast_ls2_meter_maximum));
    setMeterInstallWO(data.ast_ls2_meter_install_wo);
    setAlertROFlag(data.ast_ls2_alert_ro_flag);
    setAlertMAFlag(data.ast_ls2_alert_ma_flag);
  
    setShowModal(true);
    handleMenuClose();
  };
  
  const handleDelete = async (data) => {
    // Handle delete logic here
    console.log(`Delete row: ${data.RowID}`);
    const dltId = data.RowID;
    handleMenuClose();
    if(dltId !== ""){
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => { 
        if (result.isConfirmed) {
         
          try {
            const response = await httpCommon.get(
              `/delete_asset_usage_table_data.php?site_cd=${site_ID}&RowID=${dltId}`
            );
        
         if (response.data && response.data.status === "SUCCESS") {
          Swal.fire({
            title: "Deleted!",
            text: response.data.message,
            icon: "success"
          });
          // fetchData(); // Uncomment if needed
          get_Asset_Usage(site_ID, RowID);
        } else if (response.data && response.data.status === "ERROR") {
          Swal.fire({
            title: "Oops!",
            text: response.data.message,
            icon: "error"
          });
        }
          
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          
        }
      });
  
    }
  
   
  }; 

  
  const resetData = () => {
    setSelected_StockNo("");
    setPartNo("");
    setTotalOh("");
    setmodalRowDt("");
    setDescription("");
    setQtyNeeded("");
  };
  function CustomTextField({ rightIcons, ...props }) {
    return (
      <TextField
        {...props}
        InputProps={{
          endAdornment: rightIcons && (
            <div
              style={{ display: "flex", flexDirection: "row", color: "#000" }}
            >
              {rightIcons.map((icon, index) => (
                <IconButton key={index}>{icon}</IconButton>
              ))}
            </div>
          ),
        }}
      />
    );
  }
  // Add New Row button click
  const [inputFields, setInputFields] = useState([
    {
      site_ID: site_ID,
      mst_RowID: RowID,
      emp_mst_login_id: emp_mst_login_id,
      ast_ls2_usage_uom: "",
      ast_ls2_meter_desc: "",
      ast_ls2_usage_date: UsageDate,
      ast_ls2_usage_reading: "0.0000",
      ast_ls2_avg_usage: "0.0000",
      ast_ls2_old_ltd_usage: "",
      ast_ls2_ltd_usage: "0.0000",
      ast_ls2_meter_point: "",
      ast_ls2_meter_id: "",
      ast_ls2_max_avg_usage: "",
      ast_ls2_warranty_usage: "",
      ast_ls2_meter_maximum: "",
      ast_ls2_meter_install_wo: "",
      ast_ls2_incr_usage_flag: "",
      ast_ls2_alert_ma_flag: "",
    },
  ]);
  // Add New button funcation
  const addInputField = (event) => {
    event.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (
        !inputFields.ast_ls2_meter_id ||
        inputFields.ast_ls2_meter_id.trim() === ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Meter ID is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (
        !inputFields.ast_ls2_usage_uom ||
        inputFields.ast_ls2_usage_uom.label.trim() === ""
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Usage UOM is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }
    });
    if (isValid) {
      setInputFields([
        ...inputFields,
        {
          site_ID: site_ID,
          mst_RowID: RowID,
          emp_mst_login_id: emp_mst_login_id,
          ast_ls2_usage_uom: "",
          ast_ls2_meter_desc: "",
          ast_ls2_usage_date: UsageDate,
          ast_ls2_usage_reading: "0.0000",
          ast_ls2_avg_usage: "0.0000",
          ast_ls2_old_ltd_usage: "",
          ast_ls2_ltd_usage: "0.0000",
          ast_ls2_meter_id: "",
          ast_ls2_meter_point: "",
          ast_ls2_max_avg_usage: "",
          ast_ls2_warranty_usage: "",
          ast_ls2_meter_maximum: "",
          ast_ls2_meter_install_wo: "",
          ast_ls2_incr_usage_flag: "",
          ast_ls2_alert_ma_flag: "",
          ast_ls2_alert_ro_flag: "",
        },
      ]);
    }
  };
  const removeInputFields = (index) => {
    const rows = [...inputFields];
    if (index !== undefined) {
      rows.splice(index, 1);
    } else {
      rows.splice(1, rows.length);
    }

    setInputFields(rows);
  };
  const handleClose = () => {
    setShow(false);
    resetData();
    removeInputFields();
  };
  // Clear State data
  const updatedInputFields = inputFields.map((field) => {
    return {
      ...field,
      ast_ls2_usage_uom: "",
      ast_ls2_meter_desc: "",
      ast_ls2_old_ltd_usage: "",
      ast_ls2_meter_id: "",
      ast_ls2_meter_point: "",
      ast_ls2_max_avg_usage: "",
      ast_ls2_warranty_usage: "",
      ast_ls2_meter_maximum: "",
      ast_ls2_meter_install_wo: "",
      ast_ls2_incr_usage_flag: "",
      ast_ls2_alert_ma_flag: "",
      ast_ls2_alert_ro_flag: "",
    };
  });
  const handleNumericInputChange_14 = (e, setterFunction) => {
    let { value } = e.target;
    if (value.length >= 15) {
      return; 
    }
    value = value.replace(/[^0-9.]/g, '');
    value = value.slice(0, 14); 
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
          integerPart2 = integerPart2.slice(0, 12) + '.' + integerPart2.slice(12, 14);
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
console.log("Result___",Result);
  const handleChange = async (index, fieldName, value,event) => {
    const list = [...inputFields];
    if (fieldName == "ast_ls2_meter_id") {

      const stockInInputFields = inputFields.some((field) => field.ast_ls2_meter_id === value);
      const stockInResult = Result.some((result) => result.ast_ls2_meter_id  === value);
      if (stockInInputFields || stockInResult) {
      Swal.close();
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Duplicate Data Found Meter ID.",
        customClass: {
          container: "swalcontainercustom",
        },
          });
          return false;
      }else{
        list[index][fieldName] = value.slice(0, 50);
        setInputFields(list);
        setMeterID(value);
      }
     

    }else if(fieldName == "ast_ls2_meter_point"){
      list[index][fieldName] = value.slice(0, 40);
      setInputFields(list);
     

    }else if(fieldName == "ast_ls2_meter_desc"){
      list[index][fieldName] = value.slice(0, 80);
      setInputFields(list);
    
      
    } else if(fieldName == "ast_ls2_old_ltd_usage"){
      
      handleNumericInputChange_14(event, (value) => {

        list[index][fieldName] = value;
    
        setInputFields(list);
    
      });
      
    }else if(fieldName == "ast_ls2_max_avg_usage"){
    
      handleNumericInputChange_14(event, (value) => {

        list[index][fieldName] = value;
    
        setInputFields(list);
    
      });
    
      
    }else if(fieldName == "ast_ls2_warranty_usage"){
    
      handleNumericInputChange_14(event, (value) => {

        list[index][fieldName] = value;
    
        setInputFields(list);
    
      });
     
      
    }else if(fieldName == "ast_ls2_meter_maximum"){
      handleNumericInputChange_14(event, (value) => {

        list[index][fieldName] = value;
    
        setInputFields(list);
    
      });
      
    }else if(fieldName == "ast_ls2_meter_install_wo"){
      list[index][fieldName] = value.slice(0, 11);
      setInputFields(list);
      
    }else {
      list[index][fieldName] = value;
      setInputFields(list);
    }
    if (fieldName == "ast_ls2_usage_uom") {
      //setSelected_ChargeCostCenter(value);
      setSelected_UsageUOM(value);
    }
  };

  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
   // console.log("inputFields____post_first__",inputFields);
    inputFields.forEach((inputFields) => {
      if (inputFields.ast_ls2_meter_id.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Meter ID is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      
      }else if(Result.some((result) => result.ast_ls2_meter_id === inputFields.ast_ls2_meter_id.trim())){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Meter ID already exists!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (typeof inputFields.ast_ls2_usage_uom === "string" && inputFields.ast_ls2_usage_uom.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Usage UOM is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (inputFields.ast_ls2_usage_uom?.label && inputFields.ast_ls2_usage_uom.label.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Usage UOM is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }
    });
    if (isValid) {
      Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
     //   Swal.showLoading();
      //console.log("inputFields____post",inputFields);
      try {
        const response = await httpCommon.post(
          "/insert_asset_usage_table_data.php",
          inputFields
        );
        //  console.log("inputFields____postAfter",response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Asset Usage Request!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            setResult([...Result, inputFields]);
            get_Asset_Usage(site_ID, RowID);
            // console.log("inputFields_after",inputFields);

            if (result.isConfirmed) {
              // Call the next function when the user clicks the "OK" button

              removeInputFields();
              handleClose();
            }
          });
        }
      } catch (error) {
        Swal.close();
        console.error("Error posting form data:", error);
      }
    }
  };

  // Handel Update button click
  const handleUpdateButtonClick = async (e) =>{
    e.preventDefault();
    let isValid = true;
    console.log("selectedUom____",selectedUom);
    if (!selectedUom || 
      typeof selectedUom !== "object" ||
      !selectedUom.label || 
      !selectedUom.value || 
      selectedUom.label.trim() === "" || 
      selectedUom.value.trim() === "" ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usage UOM is Required!",
        customClass: {
          container: "swalcontainercustom",
        },
      });
      isValid = false;
    }
    if (isValid) {
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
   // console.log("MeterInstalledUsage_____",MeterInstalledUsage)
    // Swal.showLoading();
    var json_UpdateAsset = {
      site_cd: site_ID,
      RowID:RowID2,
      auditUser:emp_mst_login_id,
      ast_ls2_usage_uom:selectedUom,
      ast_ls2_incr_usage_flag:TotalRunning,
      ast_ls2_meter_point:MeterPoint?.trim() ?? '',
      ast_ls2_meter_desc:AstLs2Desc?.trim() ?? '',
      ast_ls2_meter_install_date:GetMasterInstallDate,
      ast_ls2_old_ltd_usage:MeterInstalledUsage?.trim() ?? '',
      ast_ls2_max_avg_usage:Maxavgusage?.trim() ?? '',
      ast_ls2_warranty_usage:GetWarrantyUsage?.trim() ?? '',
      ast_ls2_meter_maximum:GetMeterMaximum?.trim() ?? '',
      ast_ls2_alert_ma_flag:AlertMAFlag,
      ast_ls2_alert_ro_flag:AlertROFlag,
      ast_ls2_meter_install_wo:MeterInstallWO?.trim() ?? '',
    
    }
   // console.log("json_UpdateAsset____",json_UpdateAsset);
    //update_asset_Specification
    try {
      const response = await httpCommon.post(
        "/update_asset_usages_tb_data.php",
        JSON.stringify(json_UpdateAsset)
      );
    //  console.log("json_Asset output", response);
      if (response.data.status === "SUCCESS") {
         Swal.close();
        
         Swal.fire({
           icon: "success",
           customClass: {
             container: "swalcontainercustom",
           },
           title: response.data.status,
           text: response.data.message,
         }).then((result) => {
          setResult([...Result, inputFields]);
          get_Asset_Usage(site_ID, RowID);
    
          if (result.isConfirmed) {
             handleCloseModal();
          }
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
  }
  }
 
  const formatDate2 = (dateString) => {
    const dateObject = new Date(dateString);
    const formattedDate = dateObject.toLocaleString('en-GB', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return formattedDate;
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject; // Return Date object
  };

  const handleShow = () => {
   
    if(FormStatus !== "" && FormStatus == "NEW" ){
      Swal.fire({
        icon: "info",
        customClass: {
          container: "swalcontainercustom",
        },
        title: "Please Wait!",
        allowOutsideClick: false,
        text: "Once the asset is created, you can then add detailed usage.",
        width:"350px"
      });
      onRowClick("BtnUsage");
    }else{
        setShow(true);
        setInputFields(updatedInputFields);
    }
  };
  return (
    <>
      <div>
        <div style={{ paddingBottom: "10px", backgroundColor: "white" }}>
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
                  icon="fluent:calendar-data-bar-24-regular"
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
                Usage
                </div>
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto", // Push button to the right
              }}
            >
               <Button type="button"   className="AddNewButton" onClick={handleShow}>
            + Add 
          </Button>
            </div>

          </div>
        </div>
        <div className="table-responsive">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>{renderTableHeader()}</TableRow>
              </TableHead>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          <Dialog
           
           onClose={(event, reason) => {
              if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                handleClose(event, reason);
              }
            }}
            aria-labelledby="customized-dialog-title"
            open={show}
            maxWidth="lg"
            fullWidth
            disableBackdropClick
            sx={{
              width: "50vw",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "20px",
            }}
          >
            <DialogTitle
              sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify
                icon="fluent:calendar-data-bar-24-regular"
                width="30px"
                height="30px"
                style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
              />
              <div>Add Usage</div> {/* Title */}
            </DialogTitle>
            <IconButton
              aria-label="close"
              
              onClick={handleClose}
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
                  width: "100%",
                  marginTop: "15px",
                }}
              >
                <div className="row">
                  <div className="col-sm-12 WrkOdrMtb">
                    {inputFields.map((data, index) => {
                      const {
                        ast_ls2_usage_uom,
                        ast_ls2_meter_desc,
                        ast_ls2_incr_usage_flag,
                        ast_ls2_old_ltd_usage,
                        ast_ls2_meter_id,
                        ast_ls2_meter_point,
                        ast_ls2_max_avg_usage,
                        ast_ls2_warranty_usage,
                        ast_ls2_meter_maximum,
                        ast_ls2_meter_install_wo,
                        ast_ls2_alert_ma_flag,
                        ast_ls2_alert_ro_flag,
                      } = data;
                      return (
                        <div className="row my-3 tb" key={index}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                style={{
                                  color: "#2196f3",
                                  textDecoration: "underline",
                                  fontWeight: 600,
                                  fontSize: 16,
                                }}
                              >
                                Line {index + 1}
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: "right" }}>
                              {inputFields.length !== 1 && (
                                <Button
                                  className="workmarerial_dlt"
                                  onClick={() => removeInputFields(index)}
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </Button>
                              )}
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            spacing={1.5}
                            className="timeCartPopuplabel"
                          >
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              <label className={findCustomizerequiredLabel("ast_ls2_meter_id") || "Requiredlabel"}> {findCustomizeLabel("ast_ls2_meter_id") ||
                                    "Meter ID:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                fullWidth
                                value={ast_ls2_meter_id}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_meter_id",
                                    event.target.value.toUpperCase())
                                }
                                inputProps={{
                                  style: {
                                    textTransform: 'uppercase',
                                  },
                                }}
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                          
                              <label className={findCustomizerequiredLabel("ast_ls2_usage_uom") || "Requiredlabel"}> {findCustomizeLabel("ast_ls2_usage_uom") ||
                                    "Usage UOM:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={UsageUOM}
                                value={data.ast_ls2_usage_uom}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_usage_uom",
                                    newValue
                                  )
                                }
                                disableAnimation
                                renderInput={(params) => (
                                  <div>
                                    <TextField
                                      {...params}
                                      placeholder="Select..."
                                      variant="outlined"
                                      size="small"
                                      className="Extrasize"
                                    />
                                  </div>
                                )}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_incr_usage_flag")}> {findCustomizeLabel("ast_ls2_incr_usage_flag") ||
                                    "Total Running Meter:"}</label>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={8}
                              style={{ textAlign: "right" }}
                            >
                              <FormControlLabel
                                value="top"
                               
                                control={<Checkbox defaultChecked={false} />}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_incr_usage_flag",
                                    event.target.checked ? "Y" : "N"
                                  )
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_meter_point")}> {findCustomizeLabel("ast_ls2_meter_point") ||
                                    "Meter Point:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                fullWidth
                                value={ast_ls2_meter_point}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_meter_point",
                                    event.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                           
                              <label className={findCustomizerequiredLabel("ast_ls2_meter_desc")}> {findCustomizeLabel("ast_ls2_meter_desc") ||
                                    "Description:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                             
                               <TextareaAutosize
                                aria-label="empty textarea"
                                minRows={2.2}
                                value={ast_ls2_meter_desc}
                                fullWidth
                                style={{ width: '100%' }} 
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_meter_desc",
                                    event.target.value
                                  )
                                }
                              className={errorField === "ast_mst_safety_rqmts" ? "erroBorderadd" : "TxtAraUsage"}
                            />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_meter_install_date")}> {findCustomizeLabel("ast_ls2_meter_install_date") ||
                                    "Meter Install Date:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <DateTimePicker
                                value={MeterInstallDate}
                                format="dd/MM/yyyy HH:mm"
                                onChange={(newDate) => {
                                  handleChange(
                                    index,
                                    "ast_ls2_meter_install_date",
                                    newDate
                                  );
                                }}
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                                className="Extrasize"
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("ast_ls2_usage_date")}> {findCustomizeLabel("ast_ls2_usage_date") ||
                                    "Usage Date:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <DateTimePicker
                                disabled
                                value={UsageDate}
                                format="dd/MM/yyyy HH:mm"
                                onChange={(newDate) => {
                                  setUsageDate(newDate); // Update your state with the new value
                                }}
                                
                                slotProps={{
                                  textField: {
                                    fullWidth: true,
                                  },
                                }}
                                className="Extrasize"
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("ast_ls2_usage_reading")}> {findCustomizeLabel("ast_ls2_usage_reading") ||
                                    "Usage Reading:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                fullWidth
                                disabled
                                value=".00"
                                onChange={(e) => {
                                  // setActualHour(e.target.value);
                                }}
                                InputProps={{
                                  inputProps: { style: { textAlign: 'right' } }
                                  }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("ast_ls2_avg_usage")}> {findCustomizeLabel("ast_ls2_avg_usage") ||
                                    "Average Usage:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                fullWidth
                                disabled
                                value=".00"
                                onChange={(e) => {
                                  // setActualHour(e.target.value);
                                }}
                                InputProps={{
                                  inputProps: { style: { textAlign: 'right' } }
                                  }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_old_ltd_usage")}> {findCustomizeLabel("ast_ls2_old_ltd_usage") ||
                                    "Meter Installed Usage:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={ast_ls2_old_ltd_usage}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_old_ltd_usage",
                                    event.target.value,
                                    event
                                  )
                                }
                                onInput={(event) => {
                                  const value = event.target.value;
                                  // Prevent '0' or empty value
                                  if (value === '0') {
                                    event.target.value = '';
                                  }
                                }}
                                InputProps={{
                                  inputProps: { style: { textAlign: 'right' } }
                                  }}
                              />
                              
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_ltd_usage")}> {findCustomizeLabel("ast_ls2_ltd_usage") ||
                                    "LTD Usage:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                fullWidth
                                disabled
                                value=".00"
                                onChange={(e) => {
                                  // setActualHour(e.target.value);
                                }}
                                InputProps={{
                                  inputProps: { style: { textAlign: 'right' } }
                                  }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_max_avg_usage")}> {findCustomizeLabel("ast_ls2_max_avg_usage") ||
                                    "Max Average Usage:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={ast_ls2_max_avg_usage}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_max_avg_usage",
                                    event.target.value,
                                    event
                                  )
                                }
                                onInput={(event) => {
                                  const value = event.target.value;
                                  // Prevent '0' or empty value
                                  if (value === '0') {
                                    event.target.value = '';
                                  }
                                }}
                                InputProps={{
                                  inputProps: { style: { textAlign: 'right' } }
                                  }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("ast_ls2_warranty_usage")}> {findCustomizeLabel("ast_ls2_warranty_usage") ||
                                    "Warranty Usage:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={ast_ls2_warranty_usage}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_warranty_usage",
                                    event.target.value,
                                    event
                                  )
                                }
                                onInput={(event) => {
                                  const value = event.target.value;
                                  // Prevent '0' or empty value
                                  if (value === '0') {
                                    event.target.value = '';
                                  }
                                }}
                                InputProps={{
                                  inputProps: { style: { textAlign: 'right' } }
                                  }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_meter_maximum")}> {findCustomizeLabel("ast_ls2_meter_maximum") ||
                                    "Meter Maximum:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={ast_ls2_meter_maximum}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_meter_maximum",
                                    event.target.value,
                                    event
                                  )
                                }
                                onInput={(event) => {
                                  const value = event.target.value;
                                  // Prevent '0' or empty value
                                  if (value === '0') {
                                    event.target.value = '';
                                  }
                                }}
                                InputProps={{
                                  inputProps: { style: { textAlign: 'right' } }
                                  }}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_alert_ma_flag")}> {findCustomizeLabel("ast_ls2_alert_ma_flag") ||
                                    "Alert MA Flag:"}</label>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={8}
                              style={{ textAlign: "right" }}
                            >
                              <FormControlLabel
                                value="top"
                                control={<Checkbox />}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_alert_ma_flag",

                                    event.target.checked ? "Y" : "N"
                                  )
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_alert_ro_flag")}> {findCustomizeLabel("ast_ls2_alert_ro_flag") ||
                                    "Alert RO Flag:"}</label>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={8}
                              style={{ textAlign: "right" }}
                            >
                              <FormControlLabel
                                value="top"
                                control={<Checkbox defaultChecked={false} />}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_alert_ro_flag",
                                    event.target.checked ? "Y" : "N"
                                  )
                                }
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("ast_ls2_meter_install_wo")}> {findCustomizeLabel("ast_ls2_meter_install_wo") ||
                                    "Meter Install WO:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                fullWidth
                                value={ast_ls2_meter_install_wo}
                                onChange={(event) =>
                                  handleChange(
                                    index,
                                    "ast_ls2_meter_install_wo",
                                    event.target.value,
                                    event
                                  )
                                }
                              />
                            </Grid>
                          </Grid>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <Button
                variant="soft"
                color="error"
                className="CloseButton"
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                }}
                startIcon={<Iconify icon="jam:close" />}
              >
                Close
              </Button>

              <div
                className="timeCartSubmit"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  variant="contained"
                  className="AddNewButton"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={addInputField}
                  style={{ marginRight: "10px" }}
                >
                  Add
                </Button>

                <Button
                  variant="contained"
                  className="SaveButton assetSpares"
                  startIcon={<Iconify icon="mingcute:save-fill" />}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    marginRight: "10px",
                  }}
                  onClick={handleAddButtonClick}
                >
                  Save
                </Button>
              </div>
            </DialogActions>
          </Dialog>
        </div>
       
      </div>
      {/*  Row Click to open model popup */}
      <BootstrapDialog
        onClose={(event, reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            handleCloseModal(event, reason);
          }
        }}
        aria-labelledby="customized-dialog-title"
        open={showModal}
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
          id="customized-dialog-title"
          className="dailogTitWork"
        >
          <Iconify
                icon="fluent:calendar-data-bar-24-regular"
                width="25px"
                height="25px"
                style={{ fontSize: "24px", marginRight: "5px" }}
              />
          <div>Update Usage</div> {/* Title */}
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            padding:"0px !important",
            margin:"5px !important",
           // color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
        </IconButton>
        <DialogContent dividers>
          <div
            style={{
              width: "100%",
              marginTop: "15px",
            }}
          >
            <div className="row">
              <div className="col-sm-12 WrkOdrMtb">
                <div className="row my-3 tb">
                  <Grid container spacing={1.5} className="timeCartPopuplabel">
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_meter_id") || "Requiredlabel"}> {findCustomizeLabel("ast_ls2_meter_id") ||
                          "Meter ID:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        className="Extrasize"
                        fullWidth
                        value={MeterID}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_usage_uom") || "Requiredlabel"}> {findCustomizeLabel("ast_ls2_usage_uom") ||
                            "Usage UOM:"}</label>
                    </Grid>
                   
                    <Grid item xs={12} md={8}>
                      <Autocomplete
                        options={UsageUOM}
                        value={selectedUom}
                        onChange={(event, newValue) => {
                         
                          setSelectedUom(newValue); 
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
                            />
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_incr_usage_flag")}> {findCustomizeLabel("ast_ls2_incr_usage_flag") ||
                          "Total Running Meter:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8} style={{ textAlign: "right" }}>
                      <FormControlLabel
                        value="top"
                        control={
                          <Checkbox
                          checked={TotalRunning === "Y"}
                          onChange={(event) => setTotalRunning(event.target.checked ? "Y" : "N")}
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_meter_point")}> {findCustomizeLabel("ast_ls2_meter_point") ||
                            "Meter Point:"}</label>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        className="Extrasize"
                        fullWidth
                        value={MeterPoint}
                       // onChange={(event) => setMeterPoint(event.target.value)}
                        onChange={(event) =>
                          {
                            const value = event.target.value;
                            if (value.length <= 40) {
                              setMeterPoint(value);
                            }
                           // setMeterInstallWO(event.target.value);
                          }
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_meter_desc")}> {findCustomizeLabel("ast_ls2_meter_desc") ||
                            "Description:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                    
                      <TextareaAutosize
                          aria-label="empty textarea"
                          minRows={2.2}
                          value={AstLs2Desc}
                          fullWidth
                          style={{ width: '100%' }} 
                          onChange={(event) =>
                            {
                              const value = event.target.value;
                              if (value.length <= 80) {
                                setAstLs2Desc(value);
                              }
                             // setMeterInstallWO(event.target.value);
                            }
                          }
                        className={errorField === "ast_mst_safety_rqmts" ? "erroBorderadd" : "TxtAraUsage"}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_meter_install_date")}> {findCustomizeLabel("ast_ls2_meter_install_date") ||
                          "Meter Install Date:"}</label>
                    </Grid>

                    <Grid item xs={12} md={8}>
                       <DateTimePicker
                          value={GetMasterInstallDate ? formatDate(GetMasterInstallDate.date) : null} 
                          format="dd/MM/yyyy HH:mm"
                          onChange={(newDate) => setgetMasterInstallDate(newDate)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                          className="Extrasize"
                        />
                        
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_usage_date")}> {findCustomizeLabel("ast_ls2_usage_date") ||
                          "Usage Date:"}</label>
                    </Grid>
                   
                    <Grid item xs={12} md={8}>
                      
                      <TextField
                        variant="outlined"
                        size="small"
                        className="Extrasize"
                        fullWidth
                        disabled
                        value={GetUsageDate ? formatDate2(GetUsageDate.date) : null}   
                        
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_usage_reading")}> {findCustomizeLabel("ast_ls2_usage_reading") ||
                            "Usage Reading:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        className="Extrasize"
                        fullWidth
                        disabled
                        value={GetUsageReading}
                        onChange={(e) => {
                          setGetUsageReading(e.target.value);
                        }}
                        InputProps={{
                          inputProps: { style: { textAlign: 'right' } }
                          }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_avg_usage")}> {findCustomizeLabel("ast_ls2_avg_usage") ||
                              "Average Usage:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        className="Extrasize"
                        fullWidth
                        disabled
                        value={AvgUsage}
                        onChange={(e) => {
                          setAvgUsage(e.target.value);
                        }}
                        InputProps={{
                          inputProps: { style: { textAlign: 'right' } }
                          }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_old_ltd_usage")}> {findCustomizeLabel("ast_ls2_old_ltd_usage") ||
                            "Meter Installed Usage:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        type="text"
                        className="Extrasize"
                        fullWidth
                        disabled
                         value={formatNumber(MeterInstalledUsage)}
                       
                        onChange={(e) => handleNumericInputChange_14(e, setMeterInstalledUsage)}
                       InputProps={{
                         inputProps: { style: { textAlign: 'right' } }
                       }}
                       onInput={(event) => {
                        const value = event.target.value;
                        // Prevent '0' or empty value
                        if (value === '0') {
                          event.target.value = '';
                        }
                      }}	
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_ltd_usage")}> {findCustomizeLabel("ast_ls2_ltd_usage") ||
                            "LTD Usage:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        className="Extrasize"
                        fullWidth
                        disabled
                        value={LtdUsage}
                        onChange={(e) => {
                           setLtdUsage(e.target.value);
                        }}
                        InputProps={{
                          inputProps: { style: { textAlign: 'right' } }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_max_avg_usage")}> {findCustomizeLabel("ast_ls2_max_avg_usage") ||
                          "Max Average Usage:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        type="text"
                        className="Extrasize"
                        fullWidth
                         value={Maxavgusage}
                         
                       onChange={(e) => handleNumericInputChange_14(e, setMaxavgusage)}
                       InputProps={{
                         inputProps: { style: { textAlign: 'right' } }
                       }}
                       onInput={(event) => {
                        const value = event.target.value;
                        // Prevent '0' or empty value
                        if (value === '0') {
                          event.target.value = '';
                        }
                      }}	
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_warranty_usage")}> {findCustomizeLabel("ast_ls2_warranty_usage") ||
                          "Warranty Usage:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        type="text"
                        className="Extrasize"
                        fullWidth
                    
                        value={GetWarrantyUsage}
                       
                       onChange={(e) => handleNumericInputChange_14(e, setWarrantyUsage)}
                       InputProps={{
                         inputProps: { style: { textAlign: 'right' } }
                       }}
                       onInput={(event) => {
                        const value = event.target.value;
                        // Prevent '0' or empty value
                        if (value === '0') {
                          event.target.value = '';
                        }
                      }}	
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_meter_maximum")}> {findCustomizeLabel("ast_ls2_meter_maximum") ||
                        "Meter Maximum:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        type="text"
                        className="Extrasize"
                        fullWidth
                       
                         value={GetMeterMaximum}
                          // onChange={(e) =>{
                          //   setGetMeterMaximum(e.target.value);
                          // }}
                          onInput={(event) => {
                            const value = event.target.value;
                            // Prevent '0' or empty value
                            if (value === '0') {
                              event.target.value = '';
                            }
                          }}	
                          onChange={(e) => handleNumericInputChange_14(e, setGetMeterMaximum)}
                            InputProps={{
                              inputProps: { style: { textAlign: 'right' } }
                            }}
                      />
                    </Grid>
                   
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_alert_ma_flag")}> {findCustomizeLabel("ast_ls2_alert_ma_flag") ||
                          "Alert MA Flag:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8} style={{ textAlign: "right" }}>
                      <FormControlLabel
                        value="top"
                        control={
                          <Checkbox
                            
                            checked={AlertMAFlag === "Y"}
                            onChange={(event) => setAlertMAFlag(event.target.checked ? "Y" : "N")}
                          />
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_alert_ro_flag")}> {findCustomizeLabel("ast_ls2_alert_ro_flag") ||
                          "Alert RO Flag:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8} style={{ textAlign: "right" }}>
                      <FormControlLabel
                        value="top"
                        control={
                          <Checkbox
                            checked={AlertROFlag === "Y"}
                            onChange={(event) => setAlertROFlag(event.target.checked ? "Y" : "N")}
                          />
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                    <label className={findCustomizerequiredLabel("ast_ls2_meter_install_wo")}> {findCustomizeLabel("ast_ls2_meter_install_wo") ||
                            "Meter Install WO:"}</label>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <TextField
                        variant="outlined"
                        size="small"
                        className="Extrasize"
                        fullWidth
                         value={MeterInstallWO}
                        onChange={(event) =>
                          {
                            const value = event.target.value;
                            if (value.length <= 11) {
                              setMeterInstallWO(value);
                            }
                           // setMeterInstallWO(event.target.value);
                          }
                        }
                      />
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <Button
            variant="soft"
            color="error"
            className="CloseButton"
            onClick={(e) => {
              e.preventDefault();
              handleCloseModal();
            }}
            startIcon={<Iconify icon="jam:close" />}
          >
            Close
          </Button>

          <div
            className="timeCartSubmit"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Button
              variant="contained"
              className="SaveButton assetSpares"
              startIcon={<Iconify icon="mingcute:save-fill" />}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                marginRight: "10px",
              }}
               onClick={handleUpdateButtonClick}
            >
              Save
            </Button>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default AssetUsage;
