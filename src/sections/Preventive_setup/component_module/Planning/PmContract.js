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

import Tooltip from "@mui/material/Tooltip";
import TextareaAutosize from "@mui/material/TextareaAutosize";
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

import PmSpecialOrderRecommendedSuppPopupData from "./PmSpecialOrderRecommendedSupp";
import PmSpecialOrderTaxCodePopupData from "./PmSpecialOrderTaxCodePopup";

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

const PmContract = ({ data }) => {
  
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
  const [modalOpenTaxCode, setModalOpenTaxCode] = useState(false);

  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [EditPrmls4RecSupplier,setEditPrmls4RecSupplier] = useState("");
  const [EditPrmls4Desc,setEditPrmls4Desc] = useState("");
  const [EditPrmls4TaxCode,setEditPrmls4TaxCode] = useState("");
  const [EditPrmls4Uom,setEditPrmls4Uom] = useState([]);
  const [EditPrmls4QtyNed,setEditPrmls4QtyNed] = useState("");
  const [EditPrmls4ItmCost,setEditPrmls4ItmCost] = useState("");
  const [EditPrmls4chgcostcenter,setEditPrmls4chgcostcenter] = useState([]);
  const [EditPrmls4chgAccount,setEditPrmls4chgAccount] = useState([]);

const [EditPrmls1MstRowId,setEditPrmls1MstRowId] = useState("");


const handleShow = () => {
setShow(true);
setInputFields(updatedInputFields);
};

const [ChargeCostCenter, setChargeCostCenter] = useState([]);
const [SelectTaxCode, setSelectTaxCode] = useState([]);

const [ChargeAccount, setChargeAccount] = useState([]);

const location = useLocation();
const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo);

const [modalRowDt, setmodalRowDt] = useState("");
const [modalRowDtTaxCode, setmodalRowDtTaxCode] = useState("");
const [prmLs4Label, setPrmls4Label] = useState([]);
const [ContractMandatoryFiled, setContractMandatoryFiled] = useState([]);

  // First Api
  const get_pm_contract_data = async (site_ID, RowID) => {
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
        `/get_pm_contract_data.php?site_cd=${site_ID}&RowID=${RowID}`
      );
    // console.log("response____Contract___",response);
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
const getPmContractFormLebel = async () => {
  try {
    const response = await httpCommon.get("/get_pm_contract_form_label.php");
    
    if (response.data.status === "SUCCESS") {
        setPrmls4Label(response.data.data.prm_ls4);
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getPmContractMandatoryfiled = async () => {
  try {
    const response = await httpCommon.get("/get_pm_contract_from_mandatory_filed.php");
    if (response.data && response.data.data && response.data.data.MandatoryField) {

      if (response.data.data.MandatoryField.length > 0) {
        
        setContractMandatoryFiled(response.data.data.MandatoryField);

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
  //console.log("Edit data as JSON :", JSON.stringify(dataGet, null, 2));
  setEditPrmls4RecSupplier(dataGet.prm_ls4_supplier);
  setEditPrmls4Desc(dataGet.prm_ls4_desc);
  setEditPrmls4TaxCode(dataGet.prm_ls4_tax_cd);
  setEditPrmls4Uom({label:dataGet.prm_ls4_svc_uom,value:dataGet.prm_ls4_svc_uom});
  setEditPrmls4QtyNed(dataGet.prm_ls4_qty_needed);
  setEditPrmls4ItmCost(dataGet.prm_ls4_est_cost);
  setEditPrmls4chgcostcenter({label:dataGet.prm_ls4_chg_costcenter,value:dataGet.prm_ls4_chg_costcenter});
  setEditPrmls4chgAccount({label:dataGet.prm_ls4_chg_account,value:dataGet.prm_ls4_chg_account});

   setEditPrmls1MstRowId(dataGet.RowID);
    
    setShowEditModal(true);
    handleMenuClose();

  }
  const handleEditClose = () =>{
    setShowEditModal(false);
}

const handleDelete = async (data, index, event) => {
   //console.log("Edit data as JSON delete:", JSON.stringify(data, null, 2));
     const dltId = data.RowID;
    // console.log("Result_____",dltId);
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
             `/delete_pm_contract_data.php?site_cd=${site_ID}&RowID=${dltId}`
           );
          //  console.log("response____",response);
           if (response.data.status === "SUCCESS") {
             Swal.fire({
               title: "Deleted!",
               text: response.data.message,
               icon: "success"
             }).then(() => {
               // Call get_Mr_Line_Data after the "OK" button is clicked
               get_pm_contract_data(site_ID, RowID);
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
          {result.prm_ls4_assetno}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls4_supplier}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
        
             {result.prm_ls4_desc && result.prm_ls4_desc.length > 20 ? (
          <Tooltip title={result.prm_ls4_desc} arrow placement="top">
            <span>
              {result.prm_ls4_desc.slice(0, 20)}...
            </span>
          </Tooltip>
        ) : (
          result.prm_ls4_desc || ""
        )}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls4_tax_cd}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls4_svc_uom}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.prm_ls4_qty_needed)}
          
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.prm_ls4_est_cost)}
          
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls4_chg_costcenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls4_chg_account}
        </TableCell>
       
      </TableRow>
    ));
  };

  const resetData = () => {
    setmodalRowDt("");
    setmodalRowDtTaxCode("");
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
      prm_ls4_assetno: AssetNo,
      prm_ls4_supplier:"",
      prm_ls4_desc:"",
      prm_ls4_tax_cd:"",
      prm_ls4_svc_uom:"",
      prm_ls4_qty_needed:"",
      prm_ls4_est_cost:"",
      prm_ls4_chg_costcenter: "",
      prm_ls4_chg_account: ""
    },
  ]);
  
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
      prm_ls4_assetno: AssetNo,
      prm_ls4_supplier: "",
      prm_ls4_desc:"",
      prm_ls4_tax_cd:"",
      prm_ls4_svc_uom:"",
      prm_ls4_qty_needed:"",
      prm_ls4_est_cost:"",
      prm_ls4_chg_costcenter: "",
      prm_ls4_chg_account: ""
    };
  });

  const handleEditClick = async () => {
    setModalOpenAsset(true);
  };

  const handleCloseModal2 = () => {
    setModalOpenAsset(false);
  };

  const handleTaxCodeEditClick = async () =>{
    setModalOpenTaxCode(true);
  }
  const handleTaxCodeCloseModal2 = () => {
    setModalOpenTaxCode(false);
  };
  // Stock Popup Data Get onclcik
  const handleRowPopupData = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {
  
    if (rowData !== undefined && rowData !== null) {
      setmodalRowDt(rowData);
        
          const list = [...inputFields];

          const SuppId = rowData;
          const SuppIdDesc = RowDescp;

          if (SuppIdDesc === "" || SuppIdDesc === null) {
            list[index]["prm_ls4_supplier"] = `${SuppId}`;
            setInputFields(list);
          } else {
            list[index]["prm_ls4_supplier"] = `${SuppId} : ${SuppIdDesc}`;
            setInputFields(list);
          }

    }
    if (secondRowData == "1") {
      setModalOpenAsset(false);
    }

  };
  const handleTaxCodeRowPopupData = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {
  
    if (rowData !== undefined && rowData !== null) {
    //  setmodalRowDt(rowData);
      setmodalRowDtTaxCode(rowData);
        
          const list = [...inputFields];

          const SuppId = rowData;
          const SuppIdDesc = RowDescp;
          list[index]["prm_ls4_tax_cd"] = `${SuppId} : ${SuppIdDesc}`;
          setInputFields(list);

    }
    if (secondRowData == "1") {
        setModalOpenTaxCode(false);
    }

  };
  const handleTaxCodeRowPopupDataEdit = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {
  
    if (rowData !== undefined && rowData !== null) {
    //  setmodalRowDt(rowData);
      setmodalRowDtTaxCode(rowData);

          const SuppId = rowData;
          const SuppIdDesc = RowDescp;
        
          setEditPrmls4TaxCode( `${SuppId} : ${SuppIdDesc}`);

    }
    if (secondRowData == "1") {
        setModalOpenTaxCode(false);
    }

  };
  const handleRowPopupDataEdit = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {
    // Use the row data in the second component
   
   //   Swal.showLoading();
      if (rowData !== undefined && rowData !== null) {
        setmodalRowDt(rowData);
        const SuppId = rowData;
        const SuppIdDesc = RowDescp;

        if (SuppIdDesc === "" || SuppIdDesc === null) {
          setEditPrmls4RecSupplier(`${SuppId}`)
        } else {
          setEditPrmls4RecSupplier(`${SuppId} : ${SuppIdDesc}`)
        }

       
      }

    if (secondRowData == "1") {
      setModalOpenAsset(false);
    
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
  const PopupRowDataSelectTaxCode = () => {
    if (modalRowDtTaxCode === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select one option!",
        customClass: {
            container: "swalcontainercustom",
          },
      });
    } else {
        setModalOpenTaxCode(false);

    }
  };
  const handleCancelClick = ( index) => {
   
  const list = [...inputFields]; 
  list[index]["prm_ls4_supplier"] = ""; 
  setInputFields(list); 
  };

  const handleCancelEditClick = () => {
    setEditPrmls4RecSupplier("");
  }
  const handleTaxCodeCancelClick = (index) => {
    const list = [...inputFields]; 
    list[index]["prm_ls4_tax_cd"] = ""; 
    setInputFields(list); 
  }
  const handleTaxCodeEditCancelClick = () => {
  setEditPrmls4TaxCode("");
  }

  const handleChange = async (index, fieldName, value) => {
       
    const list = [...inputFields];
    if (fieldName == "prm_ls4_desc") {
      list[index][fieldName] = value;
      setInputFields(list);
    } else {
      list[index][fieldName] = value;
      setInputFields(list);
    }
  };

  const handleEditChange = async (index, fieldName, value) => {

    if(fieldName === "prm_ls4_desc"){
      setEditPrmls4Desc(value);
    }else if(fieldName === "prm_ls4_svc_uom"){
      setEditPrmls4Uom(value);
    }else if(fieldName === "prm_ls4_qty_needed"){
        setEditPrmls4QtyNed(value);
    }else if(fieldName === "prm_ls4_est_cost"){
      setEditPrmls4ItmCost(value);
    }else if(fieldName === "prm_ls4_chg_costcenter"){
      setEditPrmls4chgcostcenter(value);
    }else if(fieldName === "prm_ls4_chg_account"){
      setEditPrmls4chgAccount(value);
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
  const handleClickUoM = async () => {
    const ItmUOM = "ITM_Issue_UOM";
    try {
      const response = await httpCommon.get(
        "/get_dropdown.php?site_cd=" + site_ID + "&type=" + ItmUOM
      );
      let ItmUOMGet = response.data.data.ITM_Issue_UOM.map(item => ({
        label: item.uom_mst_uom + " : " + item.uom_mst_desc,
        value: item.uom_mst_uom
    }));
     
      setSelectTaxCode(ItmUOMGet);
    
    } catch (error) {
      console.error(error);
    }
  };

  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
  //  console.log("inputFields______",inputFields);
    inputFields.forEach((inputFields) => {
      if (inputFields.prm_ls4_supplier.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Supplier is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.prm_ls4_desc.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.prm_ls4_svc_uom === "" || inputFields.prm_ls4_svc_uom.label ==="") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "UOM is Required!",
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
      //Swal.showLoading();
    // console.log("inputFields____post",inputFields);
      try {
        const response = await httpCommon.post(
          "/insert_pm_contract_data.php",
          inputFields
        );
       // console.log("API Response:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Contreact!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
           
            get_pm_contract_data(site_ID, RowID);
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
    (acc, item) => acc + (parseFloat(item.prm_ls4_qty_needed) || 0),
    0
  );

  //Multiply calculation
  const totalCost = Result.reduce(
    (acc, item) =>
      acc +
      (parseFloat(item.prm_ls4_qty_needed) || 0) *
        (parseFloat(item.prm_ls4_est_cost) || 0),
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
        prm_ls4_assetno: AssetNo,
        prm_ls4_supplier:"",
        prm_ls4_desc:"",
        prm_ls4_tax_cd:"",
        prm_ls4_svc_uom:"",
        prm_ls4_qty_needed: "",
        prm_ls4_est_cost: "",
        prm_ls4_chg_costcenter:"",
        prm_ls4_chg_account:""
        
      },

  
    ]);
    
  };

  useEffect(() => {
    get_pm_contract_data(site_ID, RowID);
    getPmContractFormLebel();
    getPmContractMandatoryfiled();
   
  }, [location]);


  const findCustomizeLabel = (columnName) => {
    if (!Array.isArray(prmLs4Label)) return "";
    const matchingColumn = prmLs4Label.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = ContractMandatoryFiled.find(item => item.column_name === columnName);
    if (foundItem && foundItem.cf_label_required === "1") {
        return "Requiredlabel";
    }
    return "";
  };


  const handleNumericInputChange = (event, setterFunction) => {
    let { value } = event.target;
    // if (value.length >= 14) {
    //   return; 
    // }
   
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
        let decimalPart2 = parts[1] ? parts[1].slice(0, 2) : '';
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

   // Handel Update button click
   const handleUpdateButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;

      if (EditPrmls4RecSupplier.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: " Supplier is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (EditPrmls4Desc.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (EditPrmls4Uom === "" || EditPrmls4Uom.lable === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "UOM is Required!",
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
      
      var json_PmContractUpdate = {
        site_cd: site_ID,
        EditPrmls4RecSupplier: String(EditPrmls4RecSupplier || "").trim(), 
        EditPrmls4QtyNed: String(EditPrmls4QtyNed || "").trim(),
        EditPrmls4ItmCost: String(EditPrmls4ItmCost || "").trim(),
        EditPrmls4Desc: EditPrmls4Desc,
        EditPrmls4TaxCode:EditPrmls4TaxCode,
        EditPrmls4Uom:EditPrmls4Uom,
        EditPrmls4chgcostcenter: EditPrmls4chgcostcenter,
        EditPrmls4chgAccount:EditPrmls4chgAccount,
        EditPrmls1MstRowId:EditPrmls1MstRowId,
        emp_mst_login_id: emp_mst_login_id,

      }
      // Swal.showLoading();
    //console.log("inputFields____update",json_PmContractUpdate);
      try {
        const response = await httpCommon.post(
          "/update_pm_contract_data.php",
          json_PmContractUpdate
        );
     //   console.log("API Response_update__:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Contract!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            get_pm_contract_data(site_ID, RowID);
            // console.log("inputFields_after",inputFields);

            if (result.isConfirmed) {
              // Call the next function when the user clicks the "OK" button

              removeInputFields();
              handleEditClose();
            }
          });
        }
      } catch (error) {
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
             
              <Iconify icon="clarity:contract-line" style={{ width: "28px", height: "28px",marginRight:"4px",marginLeft:"2px" }} />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
              Contract
              </div>
              <div  style={{ fontSize:"14px",marginBottom: "4px" }}>
               Total Quantity {" "}
                <span style={{ color: "blue" }}>
                  {formattedtotalQty}
                </span>{" "},
                Total Contract Cost{" "}
                <span style={{ color: "#19d895" }}>
                  ${formattedTotalCost}
                </span>
              </div>
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

        {/*************************************** Add Contract Popup **************************************************/}
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
              sx={{ m: 0, p: 1, 
                display: 'flex', 
                alignItems: 'center' 
             }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify icon="clarity:contract-line" style={{ width: "26px", height: "26px" ,marginRight: "4px"}} />
              Contract
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
                        prm_ls4_assetno,
                        prm_ls4_supplier,
                        prm_ls4_desc,
                        prm_ls4_tax_cd,
                        prm_ls4_svc_uom,
                        prm_ls4_qty_needed,
                        prm_ls4_est_cost,
                        prm_ls4_chg_costcenter,
                        prm_ls4_chg_account
                      } = data;
                      return (
                        <div className="row my-3 tb" key={index}>
                          
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls4_assetno") || "Requiredlabel"}> {findCustomizeLabel("prm_ls4_assetno") ||
                                    "Asset No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={data.prm_ls4_assetno}
                                disabled
                             
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("prm_ls4_supplier") || "Requiredlabel"}> {findCustomizeLabel("prm_ls4_supplier") ||
                                    "Supplier:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>

                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.prm_ls4_supplier != "" ? data.prm_ls4_supplier : ""
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
                            {/* Model Supplier No  Select  */}
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
                               
                                Supplier
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
                                  <PmSpecialOrderRecommendedSuppPopupData
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
                            {/* End of Supplier Supplier model */}

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              <label className={findCustomizerequiredLabel("prm_ls4_desc") || "Requiredlabel" } > {findCustomizeLabel("prm_ls4_desc") ||
                                    "Description:"}</label>
                            </Grid>
                                <Grid item xs={12} md={8}>
                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        minRows={2.5}
                                        fullWidth
                                     value={data.prm_ls4_desc}
                                      onChange={(event) => {
                                        const value = event.target.value;
                                        if (value.length <= 1024) {
                                          handleChange(
                                            index,
                                            "prm_ls4_desc",
                                            event.target.value
                                          )
                                        }
                                        
                                      }}

                                        style={{ width: "100%"}}
                                        className="TxtAraMaterial"
                                    />
                                </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              <label className={findCustomizerequiredLabel("prm_ls4_tax_cd") } > {findCustomizeLabel("prm_ls4_tax_cd") ||
                                    "Tax Code:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                           
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.prm_ls4_tax_cd != "" ? data.prm_ls4_tax_cd : ""
                                }
                                
                                 placeholder="Select..."
                                 autoComplete="off"
                                
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={() => handleTaxCodeCancelClick(index)}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleTaxCodeEditClick}
                                  />,
                                ]}
                              />
                            </Grid>
                             {/* Model Tax Code No  Select  */}
                             <BootstrapDialog
                                    
                                    onClose={(event, reason) => {
                                        if (reason !== "backdropClick") {
                                            handleTaxCodeCloseModal2();
                                        }
                                        }}
                                        aria-labelledby="customized-dialog-title"
                                        open={modalOpenTaxCode}
                                        maxWidth="sm"
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
                                   
                                   Tax Code
                                  </DialogTitle>
                                  <IconButton
                                    aria-label="close"
                                    onClick={handleTaxCodeCloseModal2}
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
                                      <PmSpecialOrderTaxCodePopupData
                                        onRowClick={(
                                          rowData,
                                          RowDescp,
                                          secondRowData
                                        ) =>
                                        handleTaxCodeRowPopupData(
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
                                        handleTaxCodeCloseModal2();
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
                                          PopupRowDataSelectTaxCode();
                                        }}
                                        style={{ marginLeft: "5px" }}
                                      >
                                        Select
                                      </Button>
                                    </div>
                                  </DialogActions>
                             </BootstrapDialog>

                            {/* End of Tax Code Supplier model */}

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("prm_ls4_svc_uom") || "Requiredlabel"}> {findCustomizeLabel("prm_ls4_svc_uom") ||
                                    "UOM:"}</label>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                <Autocomplete
                                options={SelectTaxCode}
                                value={data.prm_ls4_svc_uom}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "prm_ls4_svc_uom",
                                    newValue
                                  )
                                }
                                onOpen={handleClickUoM}
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
                              
                              <label className={findCustomizerequiredLabel("prm_ls4_qty_needed")}> {findCustomizeLabel("prm_ls4_qty_needed") ||
                                    "Qty Needed:"}</label>
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
                                      handleChange(index, "prm_ls4_qty_needed", formattedValue);
                                    });
                                  }
                                }}

                                value={data.prm_ls4_qty_needed}
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
                              
                              <label className={findCustomizerequiredLabel("prm_ls4_est_cost")}> {findCustomizeLabel("prm_ls4_est_cost") ||
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
                                      handleChange(index, "prm_ls4_est_cost", formattedValue);
                                    });
                                  }
                                }}

                                value={data.prm_ls4_est_cost}
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
                              <label className={findCustomizerequiredLabel("prm_ls4_chg_costcenter")}> {findCustomizeLabel("prm_ls4_chg_costcenter") ||
                                    "Charge Cost Center:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeCostCenter}
                                value={data.prm_ls4_chg_costcenter}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "prm_ls4_chg_costcenter",
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls4_chg_account")}> {findCustomizeLabel("prm_ls4_chg_account") ||
                                    "Charge Account:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeAccount}
                                value={data.prm_ls4_chg_account}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "prm_ls4_chg_account",
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
          {/*************************************** Edit Contract Popup **************************************************/}

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
              sx={{ m: 0, p: 1, 
                display: 'flex', 
                alignItems: 'center' 
             }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify icon="clarity:contract-line" style={{ width: "26px", height: "26px" ,marginRight: "4px"}} />
               Update Contract
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls4_assetno") || "Requiredlabel"}> {findCustomizeLabel("prm_ls4_assetno") ||
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
                             
                             <label className={findCustomizerequiredLabel("prm_ls4_supplier") || "Requiredlabel"}> {findCustomizeLabel("prm_ls4_supplier") ||
                                    "Recommended Supplier:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>

                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  EditPrmls4RecSupplier != "" ? EditPrmls4RecSupplier : ""
                                }
                                
                                 placeholder="Select..."
                                 autoComplete="off"
                                
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelEditClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditClick}
                                  />,
                                ]}
                              />
                            </Grid>
                           {/* Model RecommendedSupplier No  Select  */}
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
                               
                               Recommended Supplier
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
                              <DialogContent dividers
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
                                  <PmSpecialOrderRecommendedSuppPopupData
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
                             </BootstrapDialog>
                             {/* Model RecommendedSupplier No  Select  */}
                             <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              <label className={findCustomizerequiredLabel("prm_ls4_desc") || "Requiredlabel" } > {findCustomizeLabel("prm_ls4_desc") ||
                                    "Description:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <TextareaAutosize
                                    aria-label="empty textarea"
                                    minRows={2.5}
                                    fullWidth
                                    value={EditPrmls4Desc}
                                    onChange={(event) => {
                                    const value = event.target.value;
                                    if (value.length <= 1024) {
                                        handleEditChange(
                                        EditPrmls1MstRowId,
                                        "prm_ls4_desc",
                                        event.target.value
                                        )
                                    }
                                    
                                    }}

                                    style={{ width: "100%"}}
                                    className="TxtAraMaterial"
                                />
                                </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                                <label className={findCustomizerequiredLabel("prm_ls4_tax_cd") } > {findCustomizeLabel("prm_ls4_tax_cd") ||
                                    "Tax Code:"}</label>
                            </Grid>
              
                            <Grid item xs={12} md={8}>
                            <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  EditPrmls4TaxCode != "" ? EditPrmls4TaxCode : ""
                                }
                                
                                 placeholder="Select..."
                                 autoComplete="off"
                                
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleTaxCodeEditCancelClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleTaxCodeEditClick}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model Tax Code No  Select  */}
                            <BootstrapDialog
                                    
                                    onClose={(event, reason) => {
                                        if (reason !== "backdropClick") {
                                            handleTaxCodeCloseModal2();
                                        }
                                        }}
                                        aria-labelledby="customized-dialog-title"
                                        open={modalOpenTaxCode}
                                        maxWidth="sm"
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
                                   
                                   Tax Code
                                  </DialogTitle>
                                  <IconButton
                                    aria-label="close"
                                    onClick={handleTaxCodeCloseModal2}
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
                                      <PmSpecialOrderTaxCodePopupData
                                        onRowClick={(
                                          rowData,
                                          RowDescp,
                                          secondRowData
                                        ) =>
                                         handleTaxCodeRowPopupDataEdit(
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
                                        handleTaxCodeCloseModal2();
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
                                          PopupRowDataSelectTaxCode();
                                        }}
                                        style={{ marginLeft: "5px" }}
                                      >
                                        Select
                                      </Button>
                                    </div>
                                  </DialogActions>
                             </BootstrapDialog>

                            {/* End of Tax Code Supplier model */}
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("prm_ls4_svc_uom") || "Requiredlabel"}> {findCustomizeLabel("prm_ls4_svc_uom") ||
                                    "UOM:"}</label>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                <Autocomplete
                                options={SelectTaxCode}
                                
                                value={EditPrmls4Uom}
                                onChange={(event, newValue) =>
                                  handleEditChange(
                                      EditPrmls1MstRowId,
                                      "prm_ls4_svc_uom",
                                      newValue
                                    )
                                  }
                                onOpen={handleClickUoM}
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
                              
                               <label className={findCustomizerequiredLabel("prm_ls4_qty_needed") || "Requiredlabel"}> {findCustomizeLabel("prm_ls4_qty_needed") ||
                                    "Qty Needed:"}</label>
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
                                        handleEditChange(EditPrmls1MstRowId, "prm_ls4_qty_needed", formattedValue);
                                    });
                                  }
                                }}

                                value={EditPrmls4QtyNed}
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
                              
                              <label className={findCustomizerequiredLabel("prm_ls4_est_cost")}> {findCustomizeLabel("prm_ls4_est_cost") ||
                                    "Item Cost:"}</label>
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
                                        handleEditChange(EditPrmls1MstRowId, "prm_ls4_est_cost", formattedValue);
                                    });
                                  }
                                }}

                                value={EditPrmls4ItmCost}
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
                              <label className={findCustomizerequiredLabel("prm_ls4_chg_costcenter")}> {findCustomizeLabel("prm_ls4_chg_costcenter") ||
                                    "Charge Cost Center:"}</label>
                            </Grid>
                          
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeCostCenter}
                                value={EditPrmls4chgcostcenter}
                                getOptionLabel={(option) => (option && option.label ? option.label : '')}
                                onChange={(event, newValue) =>
                                handleEditChange(
                                    EditPrmls1MstRowId,
                                    "prm_ls4_chg_costcenter",
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls4_chg_account")}> {findCustomizeLabel("prm_ls4_chg_account") ||
                                    "Charge Account:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeAccount}
                                value={EditPrmls4chgAccount}
                                getOptionLabel={(option) => (option && option.label ? option.label : '')}
                                onChange={(event, newValue) =>
                                    handleEditChange(
                                    EditPrmls1MstRowId,
                                    "prm_ls4_chg_account",
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

export default PmContract;
