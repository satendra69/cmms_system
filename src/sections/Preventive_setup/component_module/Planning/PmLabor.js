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
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

import Iconify from "src/components/iconify";

import PmLaborCraftPopupData from "./PmLaborCraftPopupData"

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

const PmLabor = ({ data }) => {
  
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowIndex, setMenuRowIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [RowID, setRowID] = useState(data.RowID);
  const [AssetNo, setAssetNo] = useState(data.Asset_No ? data.Asset_No.split(' : ')[0] : '');
  const [modalOpenAsset, setModalOpenAsset] = useState(false);

  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

const [EditPrmls1craft,setEditPrmls1craft] = useState("");
const [EditPrmls1crewsize,setEditPrmls1crewsize] = useState("");
const [EditPrmls1esthrs,setEditPrmls1esthrse] = useState("");
const [EditPrmls1chgcostcenter,setEditPrmls1chgcostcenter] = useState([]);
const [EditPrmls1chgAccount,setEditPrmls1chgAccount] = useState([]);
const [EditPrmls1lumpsum,setEditPrmls1lumpsum] = useState("");
const [EditPrmls1MstRowId,setEditPrmls1MstRowId] = useState("");

  const handleShow = () => {
    setShow(true);
    setInputFields(updatedInputFields);
  };

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState(
    []
  );

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  const location = useLocation();
  const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo);

  const [modalRowDt, setmodalRowDt] = useState("");
  const [prmLs1Label, setPrmls1Label] = useState([]);
  const [MaterialMandatoryFiled, setMaterialMandatoryFiled] = useState([]);

  // First Api
  const get_pm_labor_data = async (site_ID, RowID) => {
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
        `/get_pm_labor_data.php?site_cd=${site_ID}&RowID=${RowID}`
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
  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
       textAlign: "center"
    };
    return (
      <>
         <TableCell key="action" style={cellStyle}>
          Action
        </TableCell>
        {Object.keys(Header).map((attr) => (
          <TableCell key={attr} style={cellStyle}>
            {attr}
          </TableCell>
        ))}
      </>
    );
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
  // Get All Filed label Name
const getPmLaborFormLebel = async () => {
  try {
    const response = await httpCommon.get("/get_pm_labor_form_label.php");
    if (response.data.status === "SUCCESS") {
        setPrmls1Label(response.data.data.prm_ls1);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getPmLaborMandatoryfiled = async () => {
  try {
    const response = await httpCommon.get("/get_pm_labor_from_mandatory_filed.php");
    if (response.data && response.data.data && response.data.data.MandatoryField) {

      if (response.data.data.MandatoryField.length > 0) {
        
        setMaterialMandatoryFiled(response.data.data.MandatoryField);

      }

    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const handleMenuClick = (event, index) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpen(true);
    setMenuRowIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setMenuRowIndex(null);
  };

  const handleEdit = (dataGet, event) => {
  
    setEditPrmls1craft(dataGet.prm_ls1_craft);
    setEditPrmls1crewsize(dataGet.prm_ls1_crewsize);
    setEditPrmls1esthrse(formatNumber(dataGet.prm_ls1_est_hrs));
    setEditPrmls1chgcostcenter({label:dataGet.prm_ls1_chg_costcenter,value:dataGet.prm_ls1_chg_costcenter});
    setEditPrmls1chgAccount({label:dataGet.prm_ls1_chg_account,value:dataGet.prm_ls1_chg_account});
    setEditPrmls1lumpsum(formatNumber(dataGet.prm_ls1_lumpsum));
    setEditPrmls1MstRowId(dataGet.RowID);

    setShowEditModal(true);
    handleMenuClose();

  }
  const handleEditClose = () =>{
    setShowEditModal(false);
}

const handleDelete = async (data, index, event) => {

   //console.log("Edit data as JSON delete:", JSON.stringify(data, null, 2));
    // console.log("Result_____",Result);
     const dltId = data.RowID;
     handleMenuClose();
    
     if (dltId !== undefined && dltId !== "") {
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
             `/delete_pm_labor_data.php?site_cd=${site_ID}&RowID=${dltId}`
           );
   
           if (response.data.status === "SUCCESS") {
             Swal.fire({
               title: "Deleted!",
               text: response.data.message,
               icon: "success"
             }).then(() => {
               // Call get_Mr_Line_Data after the "OK" button is clicked
               get_pm_labor_data(site_ID, RowID);
             });
           } else if (response.data.status === "ERROR") {
             Swal.fire({
               title: "Oops!",
               text: response.data.message,
               icon: "error"
             });
           }
         //  setIsLoading(false);
         } catch (error) {
           console.error('Error fetching data:', error);
          // setIsLoading(false);
         }
   
         
         }
       });
   
     }
   
    
   }; 
  //Body
  const renderTableRows = () => {
    return Result.map((result, index) => (
      <TableRow key={index} 
      style={{ cursor: "pointer", transition: "background-color 0.3s" }}
      onMouseEnter={(event) => event.currentTarget.style.backgroundColor = "#f0f0f0"}
      onMouseLeave={(event) => event.currentTarget.style.backgroundColor = "transparent"}
      >
            <TableCell style={{ padding: "5px", textAlign: "center" }}>
            <IconButton 
                    onClick={(event) => {
                        event.stopPropagation(); 
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
               handleDelete(result, index, event);
            }}
            > <Iconify icon="solar:trash-bin-trash-bold" width="15px" height="20px" marginRight="5px"/> Delete</MenuItem>
          </Menu>
        </TableCell>
      
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls1_assetno}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls1_craft}
        </TableCell>
        
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls1_crewsize}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls1_chg_costcenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls1_chg_account}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.prm_ls1_est_hrs)}
          
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.prm_ls1_lumpsum)}
          
        </TableCell>
      </TableRow>
    ));
  };

  const resetData = () => {
   // setSelected_StockNo("");
    setmodalRowDt("");
   // setSelected_StockLocation("");
   // setDescription("");
    setSelected_ChargeCostCenter("");
    setSelected_ChargeAccount([]);
   // setQtyNeeded("");
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
      prm_ls1_assetno: AssetNo,
      mtr_mst_wo_no: WorkOrderNo,
      prm_ls1_crft:"",
      prm_ls1_crewSize:"1",
      prm_ls1_est_hrs:"",
      prm_ls1_lumpsum:"",
      selectChargeCostCenter: "",
      selectChargeAccount: "",
      
    },
  ]);
  // Add New button funcation
  const addInputField = (event) => {
    event.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.prm_ls1_crft.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Craft is Required!",
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
          prm_ls1_assetno: AssetNo,
          prm_ls1_crft:"",
          prm_ls1_crewSize:"1",
          prm_ls1_est_hrs:"",
          prm_ls1_lumpsum:"",
          selectChargeCostCenter: "",
          selectChargeAccount: "",
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
  // Clear State data
  const updatedInputFields = inputFields.map((field) => {
    return {
      ...field,
      prm_ls1_crewSize: "1",
      prm_ls1_crft:"",
      selectChargeAccount: "",
      selectChargeCostCenter: "",
      prm_ls1_est_hrs: "",
      prm_ls1_lumpsum: "",
    };
  });

  const handleEditClick = async () => {
    setModalOpenAsset(true);
  };
  const handleCloseModal2 = () => {
    setModalOpenAsset(false);
  };
  // Stock Popup Data Get onclcik
  const handleRowPopupData = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {

    // Use the row data in the second component
    if (rowData !== undefined && rowData !== null) {
        if (Result.length > 0) {
       
            const resultMatch = Result.some((item) => item.prm_ls1_craft.trim() === rowData.trim());
      
            if (resultMatch) {
                Swal.fire({
                    icon: "warning",
                    title: "Oops...",
                    text: "Duplicate Data Found In Row Craft",
                    customClass: {
                        container: "swalcontainercustom",
                      },
                  });
                  
              return;
            }
          }

      setmodalRowDt(rowData);
      const list = [...inputFields];

      const crftDt = rowData + " : " + RowDescp;
      list[index]["prm_ls1_crft"] = crftDt;
      setInputFields(list);
      
    }
    if (secondRowData == "1") {
        
      setModalOpenAsset(false);
    
    }

  };
  const handleRowPopupDataEdit = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {

    // Use the row data in the second component

    if (rowData !== undefined && rowData !== null) {
     
      if (Result.length > 0) {
       
        const resultMatch = Result.some((item) => item.prm_ls1_craft.trim() === rowData.trim());
  
        const inputFieldsMatch = inputFields.some((item) => {
          const prm_ls1_crftValue = item.prm_ls1_crft.split(':')[0].trim(); 
          return prm_ls1_crftValue === rowData.trim();
        });
  
        if (resultMatch || inputFieldsMatch) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Duplicate Data Found In Row Craft",
                customClass: {
                    container: "swalcontainercustom",
                  },
              });
              
          return;
        }
      }
      setmodalRowDt(rowData);
     // const list = [...inputFields];

      const crftDt = rowData + " : " + RowDescp;
      setEditPrmls1craft(crftDt);
  

    }

    if (secondRowData == "1") {
      setModalOpenAsset(false);
      if (Result.length > 0) {
  
        const resultMatch = Result.some((item) => item.prm_ls1_craft.trim() === rowData.trim());
  
        const inputFieldsMatch = inputFields.some((item) => {
          const prm_ls1_crftValue = item.prm_ls1_crft.split(':')[0].trim(); 
          return prm_ls1_crftValue === rowData.trim();
        });
  
        if (resultMatch || inputFieldsMatch) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Duplicate Data Found In Row Craft",
                customClass: {
                    container: "swalcontainercustom",
                  },
              });

          return;
        }
      }
    }
  };

  const PopupRowDataSelect = () => {
    if (modalRowDt === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select one option!",
        customClass: {
            container: "swalcontainercustom",
          },
      });
    } else {
      setModalOpenAsset(false);

    }
  };
  const handleCancelClick = ( index) => {
   
  const list = [...inputFields]; 
  list[index]["prm_ls1_crft"] = ""; 
  setInputFields(list); 
  };

  const handleChange = async (index, fieldName, value) => {

    const list = [...inputFields];
    if (fieldName == "setQtyNeeded") {
      list[index][fieldName] = value;
      setInputFields(list);
     // setQtyNeeded(value);
    } else {
      list[index][fieldName] = value;
      setInputFields(list);
    }

    if (fieldName == "selectChargeCostCenter") {
      setSelected_ChargeCostCenter(value);
    } else if (fieldName == "selectChargeAccount") {
      setSelected_ChargeAccount(value);
    } else if (fieldName == "setQtyNeeded") {
     // setQtyNeeded(value);
    }else if(fieldName == "Editprm_ls1_crewSize"){
        setEditPrmls1crewsize(value);
    }
  };

  const handleEditChange = async (index, fieldName, value) => {

   if(fieldName == "Editprm_ls1_crewSize"){
        setEditPrmls1crewsize(value);
    }else if(fieldName == "selectChargeCostCenter"){
        setEditPrmls1chgcostcenter(value);
    }else if(fieldName == "selectChargeAccount"){
        setEditPrmls1chgAccount(value);
    }else if(fieldName == "Editprm_ls1_est_hrs"){
        setEditPrmls1esthrse(value);
    }else if(fieldName == "Editprm_ls1_lumpsum"){
        setEditPrmls1lumpsum(value);
    }
  };

  const handleClickChargeCostCenter = async () => {
    const CostType = "CostCenter";
    try {
      const response = await httpCommon.get(
        "/get_dropdown.php?site_cd=" + site_ID + "&type=" + CostType
      );
      let ChargeCostCenter = response.data.data.CostCenter.map((item) => ({
        label: item.costcenter + " : " + item.descs,
        value: item.costcenter,
      }));
     
      setChargeCostCenter(ChargeCostCenter);
     // setEditPrmls1chgcostcenter(ChargeCostCenter);
    } catch (error) {
      console.error(error);
    }
  };
  const handleClickChargeAccount = async () => {
    const AccountType = "WKO_Labor_Account";
    try {
      const response = await httpCommon.get(
        "/get_dropdown.php?site_cd=" + site_ID + "&type=" + AccountType
      );
      let ChargeAccount = response.data.data.WKO_Labor_Account.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.account,
      }));
      setChargeAccount(ChargeAccount);
     
    } catch (error) {
      console.error(error);
    }
  };

  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.prm_ls1_crft.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Craft is Required!",
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
      Swal.showLoading();
    // console.log("inputFields____post",inputFields);
      try {
        const response = await httpCommon.post(
          "/insert_pm_labor_data.php",
          inputFields
        );
      //  console.log("API Response:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Labor!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            setResult([...Result, inputFields]);
            get_pm_labor_data(site_ID, RowID);
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
  //Sum calculation
  const totalQty = Result.reduce(
    (acc, item) => acc + (parseFloat(item.wko_ls2_qty_needed) || 0),
    0
  );

  //Multiply calculation
  const totalCost = Result.reduce(
    (acc, item) =>
      acc +
      (parseFloat(item.wko_ls2_qty_needed) || 0) *
        (parseFloat(item.wko_ls2_item_cost) || 0),
    0
  );

  const formattedTotalCost = totalCost.toLocaleString('en-US');
  const formattedtotalQty  = totalQty.toLocaleString('en-US');
  
  const handleClose = () => {
    setShow(false);
    resetData();
    removeInputFields();
    setInputFields([
      {
        site_ID: site_ID,
        mst_RowID: RowID,
        emp_mst_login_id: emp_mst_login_id,
        prm_ls1_assetno: AssetNo,
        prm_ls1_crft:"",
        prm_ls1_crewSize:"1",
        prm_ls1_est_hrs:"",
        prm_ls1_lumpsum:"",
        selectChargeCostCenter: "",
        selectChargeAccount: "",
        
      },
  
    ]);
    
  };

  useEffect(() => {
    get_pm_labor_data(site_ID, RowID);
    getPmLaborFormLebel();
    getPmLaborMandatoryfiled();
    // get_workorder_status(site_ID, "All", location.state.select);
  }, [location]);

  const findCustomizeLabel = (columnName) => {
    if (!Array.isArray(prmLs1Label)) return "";
    const matchingColumn = prmLs1Label.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = MaterialMandatoryFiled.find(item => item.column_name === columnName);
    if (foundItem && foundItem.cf_label_required === "1") {
        return "Requiredlabel";
    }
    return "";
  };

  const handleNumericInputChange = (event, setterFunction) => {
    let { value } = event.target;
    if (value.length >= 14) {
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
        let decimalPart2 = parts[1] ? parts[1].slice(0, 4) : '';
        if (integerPart2.length > 11) {
          integerPart2 = integerPart2.slice(0, 12) + '.' + integerPart2.slice(12, 14);
        }
       
        const formattedValue2 = decimalPart2 ? `${integerPart2}.${decimalPart2}` : integerPart2;
        setterFunction(formattedValue2);
       // setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
   // setErrorField(null);
    
  };

  const handleNumericInputChange_4_limit = (e, setterFunction) =>{
    let { value } = e.target;
    value = value.replace(/[^\d.]/g, ''); // Remove non-numeric characters except decimal
    value = value.slice(0, 4); // Limit to 16 characters including decimals and commas

    const parts = value.split('.');
    let integerPart = parts[0].replace(/\B(?=(\d{4})+(?!\d))/g, ',');
    if (integerPart.length > 5) {
      integerPart = integerPart.slice(0, 5);
    }
    let decimalPart = parts[1] ? parts[1].slice(0, 5) : '';

    const formattedValue = decimalPart ? `${integerPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
    

    
  }

   // Handel Update button click
   const handleUpdateButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
   
      if (EditPrmls1craft.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Craft is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } 
  
    if (isValid) {
      Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
  
      var json_PmLaborUpdate = {
        site_cd: site_ID,
        EditPrmls1craft: String(EditPrmls1craft || "").trim(), 
        EditPrmls1crewsize: String(EditPrmls1crewsize || "").trim(),
        EditPrmls1esthrs: String(EditPrmls1esthrs || "").trim(), 
        EditPrmls1lumpsum: String(EditPrmls1lumpsum || "").trim(), 
        EditPrmls1chgcostcenter: EditPrmls1chgcostcenter,
        EditPrmls1chgAccount: EditPrmls1chgAccount,
        EditPrmls1MstRowId:EditPrmls1MstRowId,
        emp_mst_login_id: emp_mst_login_id,

      }
       Swal.showLoading();
   // console.log("inputFields____post",json_PmLaborUpdate);
      try {
        const response = await httpCommon.post(
          "/update_pm_labor_data.php",
          json_PmLaborUpdate
        );
        console.log("API Response_update__:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Labor!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            get_pm_labor_data(site_ID, RowID);
            // console.log("inputFields_after",inputFields);

            if (result.isConfirmed) {
              // Call the next function when the user clicks the "OK" button

              removeInputFields();
              handleEditClose();
            }
          });
        }
      } catch (error) {
        Swal.close();
        console.error("Error posting form data:", error);
      }
    }
   }
  return (
    <>
      <div>
        <div style={{ paddingBottom: "0px", backgroundColor: "white" }}>
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginRight: "0px" }}>
             
              <Iconify icon="hugeicons:labor" style={{ width: "35px", height: "35px" }} />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                Labor 
              </div>
              {/* <div>
               Total Quantity {" "}
                <span style={{ color: "blue" }}>
                  {formattedtotalQty}
                </span>{" "},
                Total Material Cost{" "}
                <span style={{ color: "#19d895" }}>
                  ${formattedTotalCost}
                </span>
              </div> */}
            </div>
            <div
                style={{
                  marginLeft: "auto",
                  marginBottom:"5px"
                }}
              >
              <Button
                type="button"
                className="AddNewButton"
                disabled={data.statusKey === "CLOSE"}
                onClick={handleShow}
              >
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

        {/*************************************** Add Labor Popup **************************************************/}
        <div>
          <Dialog
             onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                  handleClose();
                }
              }}
              aria-labelledby="customized-dialog-title"
              open={show}
              maxWidth="sm"
              fullWidth
              sx={{
                width: "100vw",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "20px",
              }}
          >
            <DialogTitle
              sx={{ m: 0, p: 2 }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify icon="hugeicons:labor" style={{ width: "30px", height: "30px" ,marginRight: "2px"}} />
              Labor
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleClose}
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
                  marginTop: "15px",
                }}
              >
               
                <div className="row">
                  <div className="col-sm-12 WrkOdrMtb">
                    {/* {console.log("datadatadatadata____", data)} */}
                    {inputFields.map((data, index) => {
                      const {
                        prm_ls1_assetno,
                        prm_ls1_crft,
                        prm_ls1_crewSize,
                        selectChargeCostCenter,
                        selectChargeAccount,
                        prm_ls1_est_hrs,
                        prm_ls1_lumpsum,
                        
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls1_assetno") || "Requiredlabel"}> {findCustomizeLabel("prm_ls1_assetno") ||
                                    "Asset No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={prm_ls1_assetno}
                                disabled
                             
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("prm_ls1_craft") || "Requiredlabel"}> {findCustomizeLabel("prm_ls1_craft") ||
                                    "Craft:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>

                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.prm_ls1_crft != "" ? data.prm_ls1_crft : ""
                                }
                                
                                 placeholder="Select..."
                                 autoComplete="off"
                                
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={() => handleCancelClick(index)}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditClick}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model Craft Select  */}
                            <BootstrapDialog
                                    
                                    onClose={(event, reason) => {
                                        if (reason !== "backdropClick") {
                                            handleCloseModal2();
                                        }
                                      }}
                                      aria-labelledby="customized-dialog-title"
                                      open={modalOpenAsset}
                                      maxWidth="lg"
                                      fullWidth
                                      disableBackdropClick
                                      sx={{
                                        width: "100vw",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        marginTop: "20px",
                                      }}

                                  >
                                      <DialogTitle
                                sx={{ m: 0, p: 2 }}
                                id="customized-dialog-title"
                                className="dailogTitWork"
                              >
                               
                               Craft
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModal2}
                                sx={{
                                  position: "absolute",
                                  right: 8,
                                  top: 8,
                                  color: (theme) => theme.palette.grey[500],
                                }}
                              >
                                <Iconify icon="material-symbols:close" />
                              </IconButton>
                                    
                                    <DialogContent
                                      dividers
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        paddingTop:"0px"
                                      }}
                                    >
                                     <div
                                  style={{
                                    width: "100%",
                                    
                                  }}
                                >
                                  <PmLaborCraftPopupData
                                    onRowClick={(
                                      rowData,
                                      RowDescp,
                                      secondRowData
                                    ) =>
                                      handleRowPopupData(
                                        index,
                                        rowData,
                                        RowDescp,
                                        secondRowData
                                      )
                                    }
                                  />
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
                                  type="button"
                                  size="small"
                                  startIcon={
                                    <Iconify icon="material-symbols:close" />
                                  }
                                  variant="soft"
                                  color="error"
                                  className="CloseButton"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCloseModal2();
                                  }}
                                >
                                  Close
                                </Button>

                                <div className="timeCartSubmit">
                                  <Button
                                    variant="contained"
                                    type="button"
                                    size="small"
                                    className="SaveButton assetSpares"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      PopupRowDataSelect();
                                    }}
                                    style={{ marginLeft: "5px" }}
                                  >
                                    Select
                                  </Button>
                                </div>
                              </DialogActions>
                                  </BootstrapDialog>
                            {/* <Dialog
                              
                              onClose={(event, reason) => {
                                if (reason !== "backdropClick") {
                                    handleCloseModal2();
                                }
                              }}
                              aria-labelledby="customized-dialog-title"
                              open={modalOpenAsset}
                              maxWidth="lg"
                              fullWidth
                              disableBackdropClick
                              sx={{
                                width: "100vw",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "20px",
                              }}
                            >
                              <DialogTitle
                                sx={{ m: 0, p: 2 }}
                                id="customized-dialog-title"
                                className="dailogTitWork"
                              >
                               
                               Craft
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModal2}
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
                                    marginTop: "15px",
                                  }}
                                >
                                  <PmLaborCraftPopupData
                                    onRowClick={(
                                      rowData,
                                      RowDescp,
                                      secondRowData
                                    ) =>
                                      handleRowPopupData(
                                        index,
                                        rowData,
                                        RowDescp,
                                        secondRowData
                                      )
                                    }
                                  />
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
                                  type="button"
                                  size="small"
                                  startIcon={
                                    <Iconify icon="material-symbols:close" />
                                  }
                                  variant="soft"
                                  color="error"
                                  className="CloseButton"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCloseModal2();
                                  }}
                                >
                                  Close
                                </Button>

                                <div className="timeCartSubmit">
                                  <Button
                                    variant="contained"
                                    type="button"
                                    size="small"
                                    className="SaveButton assetSpares"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      PopupRowDataSelect();
                                    }}
                                    style={{ marginLeft: "5px" }}
                                  >
                                    Select
                                  </Button>
                                </div>
                              </DialogActions>
                            </Dialog> */}
                            {/* End of Craft Select model */}
                           
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("prm_ls1_crewsize")}> {findCustomizeLabel("prm_ls1_crewsize") ||
                                    "Crew Size:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder="1"
                              
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange_4_limit(event, (formattedValue) => {
                                      handleChange(index, "prm_ls1_crewSize", formattedValue);
                                    });
                                  }
                                }}

                                value={prm_ls1_crewSize}
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
                              <label className={findCustomizerequiredLabel("prm_ls1_chg_costcenter")}> {findCustomizeLabel("prm_ls1_chg_costcenter") ||
                                    "Charge Cost Center:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeCostCenter}
                                value={data.selectChargeCostCenter}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "selectChargeCostCenter",
                                    newValue
                                  )
                                }
                                onOpen={handleClickChargeCostCenter}
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
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("prm_ls1_chg_account")}> {findCustomizeLabel("prm_ls1_chg_account") ||
                                    "Charge Account:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeAccount}
                                value={data.selectChargeAccount}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "selectChargeAccount",
                                    newValue
                                  )
                                }
                                onOpen={handleClickChargeAccount}
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
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("prm_ls1_est_hrs")}> {findCustomizeLabel("prm_ls1_est_hrs") ||
                                    "Estimate Hours:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder="0.00"
                               
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange(event, (formattedValue) => {
                                      handleChange(index, "prm_ls1_est_hrs", formattedValue);
                                    });
                                  }
                                }}

                                value={prm_ls1_est_hrs}
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
                            
                              <label className={findCustomizerequiredLabel("prm_ls1_lumpsum")}>
                                 {findCustomizeLabel("prm_ls1_lumpsum") ||
                                    "Lump Sum Amount:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder="0.00"
                               
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange(event, (formattedValue) => {
                                      handleChange(index, "prm_ls1_lumpsum", formattedValue);
                                    });
                                  }
                                }}

                                value={prm_ls1_lumpsum}
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
                startIcon={<Iconify icon="jam:close" />}
                onClick={(e) => {
                  e.preventDefault();
                  handleClose();
                }}
              >
                Close
              </Button>

              <div
                className="timeCartSubmit"
                style={{ display: "flex", alignItems: "center" }}
              >
                {/* <Button
                  variant="contained"
                  className="AddNewButton"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={addInputField}
                  style={{ marginRight: "10px" }}
                >
                  Add 2
                </Button> */}
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
          {/*************************************** Edit Labor Popup **************************************************/}

           {/*  Row Click to open model popup */}
           <div>
          <Dialog
             onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                  handleClose();
                }
              }}
              aria-labelledby="customized-dialog-title"
              open={showEditModal}
              maxWidth="sm"
              fullWidth
              sx={{
                width: "100vw",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "20px",
              }}
          >
            <DialogTitle
              sx={{ m: 0, p: 2 }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify icon="hugeicons:labor" style={{ width: "30px", height: "30px" ,marginRight: "2px"}} />
              Update Labor
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleEditClose}
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
                  marginTop: "15px",
                }}
              >
               
                <div className="row">
                  <div className="col-sm-12 WrkOdrMtb">
                    {/* {console.log("datadatadatadata____", data)} */}
                
                        <div className="row my-3 tb">
                           
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls1_assetno") || "Requiredlabel"}> {findCustomizeLabel("prm_ls1_assetno") ||
                                    "Asset No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={AssetNo}
                                disabled
                             
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("prm_ls1_craft") || "Requiredlabel"}> {findCustomizeLabel("prm_ls1_craft") ||
                                    "Craft:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>

                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                    EditPrmls1craft != "" ? EditPrmls1craft : ""
                                }
                                
                                 placeholder="Select..."
                                 autoComplete="off"
                                
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                  //  onClick={() => handleCancelClick(index)}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditClick}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model Craft Select  */}
                            <Dialog
                              
                              onClose={(event, reason) => {
                                if (reason !== "backdropClick") {
                                    handleCloseModal2();
                                }
                              }}
                              aria-labelledby="customized-dialog-title"
                              open={modalOpenAsset}
                              maxWidth="lg"
                              fullWidth
                              disableBackdropClick
                              sx={{
                                width: "100vw",
                                marginLeft: "auto",
                                marginRight: "auto",
                                marginTop: "20px",
                              }}
                            >
                              <DialogTitle
                                sx={{ m: 0, p: 2 }}
                                id="customized-dialog-title"
                                className="dailogTitWork"
                              >
                               
                               Craft
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModal2}
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
                                    marginTop: "15px",
                                  }}
                                >
                                  <PmLaborCraftPopupData
                                    onRowClick={(
                                      rowData,
                                      RowDescp,
                                      secondRowData
                                    ) =>
                                        handleRowPopupDataEdit(
                                        EditPrmls1MstRowId,
                                        rowData,
                                        RowDescp,
                                        secondRowData
                                      )
                                    }
                                  />
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
                                  type="button"
                                  size="small"
                                  startIcon={
                                    <Iconify icon="material-symbols:close" />
                                  }
                                  variant="soft"
                                  color="error"
                                  className="CloseButton"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCloseModal2();
                                  }}
                                >
                                  Close
                                </Button>

                                <div className="timeCartSubmit">
                                  <Button
                                    variant="contained"
                                    type="button"
                                    size="small"
                                    className="SaveButton assetSpares"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      PopupRowDataSelect();
                                    }}
                                    style={{ marginLeft: "5px" }}
                                  >
                                    Select
                                  </Button>
                                </div>
                              </DialogActions>
                            </Dialog>
                            {/* End of Craft Select model */}
                           
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("prm_ls1_crewsize")}> {findCustomizeLabel("prm_ls1_crewsize") ||
                                    "Crew Size:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder="1"
                              
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange_4_limit(event, (formattedValue) => {
                                        handleEditChange(EditPrmls1MstRowId, "Editprm_ls1_crewSize", formattedValue);
                                    });
                                  }
                                }}

                                value={EditPrmls1crewsize}
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
                              <label className={findCustomizerequiredLabel("prm_ls1_chg_costcenter")}> {findCustomizeLabel("prm_ls1_chg_costcenter") ||
                                    "Charge Cost Center:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeCostCenter}
                                value={EditPrmls1chgcostcenter}
                                getOptionLabel={(option) => (option && option.label ? option.label : '')}
                                onChange={(event, newValue) =>
                                    handleEditChange(
                                     EditPrmls1MstRowId,
                                      "selectChargeCostCenter",
                                      newValue
                                    )
                                  }
                                onOpen={handleClickChargeCostCenter}
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
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("prm_ls1_chg_account")}> {findCustomizeLabel("prm_ls1_chg_account") ||
                                    "Charge Account:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeAccount}
                                value={EditPrmls1chgAccount}
                                getOptionLabel={(option) => (option && option.label ? option.label : '')}
                                onChange={(event, newValue) =>
                                    handleEditChange(
                                     EditPrmls1MstRowId,
                                      "selectChargeAccount",
                                      newValue
                                    )
                                  }
                                onOpen={handleClickChargeAccount}
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
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("prm_ls1_est_hrs")}> {findCustomizeLabel("prm_ls1_est_hrs") ||
                                    "Estimate Hours:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder="0.00"
                               
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange(event, (formattedValue) => {
                                      handleEditChange(EditPrmls1MstRowId, "Editprm_ls1_est_hrs", formattedValue);
                                    });
                                  }
                                }}

                                value={EditPrmls1esthrs}
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
                            
                              <label className={findCustomizerequiredLabel("prm_ls1_lumpsum")}>
                                 {findCustomizeLabel("prm_ls1_lumpsum") ||
                                    "Lump Sum Amount:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder="0.00"
                               
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange(event, (formattedValue) => {
                                        handleEditChange(EditPrmls1MstRowId, "Editprm_ls1_lumpsum", formattedValue);
                                    });
                                  }
                                }}

                                value={EditPrmls1lumpsum}
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
                startIcon={<Iconify icon="jam:close" />}
                onClick={(e) => {
                  e.preventDefault();
                  handleEditClose();
                }}
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
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default PmLabor;
