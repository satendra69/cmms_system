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

import PmMaterialStockNoPopupData from "./PmMaterialStockNoPopup";

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

const PmMaterial = ({ data }) => {
  
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

const [EditPrmls2stockNo,setEditPrmls2stockNo] = useState("");
const [EditPrmls2StockLoc,setEditPrmls2StockLoc] = useState([]);
const [EditPrmls2Desc,setEditPrmls2Desc] = useState("");
const [EditPrmls2Uom,setEditPrmls2Uom] = useState("");
const [EditPrmls2QtyNed,setEditPrmls2QtyNed] = useState("");
const [EditPrmls2chgcostcenter,setEditPrmls2chgcostcenter] = useState([]);
const [EditPrmls2chgAccount,setEditPrmls2chgAccount] = useState([]);
const [EditPrmls2Itmcst,setEditPrmls2Itmcst] = useState("");
const [EditPrmls1MstRowId,setEditPrmls1MstRowId] = useState("");


const handleShow = () => {
setShow(true);
setInputFields(updatedInputFields);
};

const [SlectStockLocation, setSlectStockLocation] = useState([]);
const [ChargeCostCenter, setChargeCostCenter] = useState([]);

const [ChargeAccount, setChargeAccount] = useState([]);

const location = useLocation();
const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo);

const [modalRowDt, setmodalRowDt] = useState("");
const [prmLs2Label, setPrmls2Label] = useState([]);
const [MaterialMandatoryFiled, setMaterialMandatoryFiled] = useState([]);

  // First Api
  const get_pm_material_data = async (site_ID, RowID) => {
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
        `/get_pm_material_data.php?site_cd=${site_ID}&RowID=${RowID}`
      );
   //  console.log("response____material___",response);
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
const getPmMaterialFormLebel = async () => {
  try {
    const response = await httpCommon.get("/get_pm_material_form_label.php");
    if (response.data.status === "SUCCESS") {
        setPrmls2Label(response.data.data.prm_ls2);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getPmMaterialMandatoryfiled = async () => {
  try {
    const response = await httpCommon.get("/get_pm_material_from_mandatory_filed.php");
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
  //console.log("Edit data as JSON :", JSON.stringify(dataGet, null, 2));
   setEditPrmls2stockNo(dataGet.prm_ls2_stockno);
   setEditPrmls2StockLoc({label:dataGet.prm_ls2_stk_locn,value:dataGet.prm_ls2_stk_locn});
   setEditPrmls2Desc(dataGet.prm_ls2_desc);
   setEditPrmls2Uom(dataGet.prm_ls2_mtl_uom);
   setEditPrmls2QtyNed(dataGet.prm_ls2_qty_needed);
   setEditPrmls2chgcostcenter({label:dataGet.prm_ls2_chg_costcenter,value:dataGet.prm_ls2_chg_costcenter});
   setEditPrmls2chgAccount({label:dataGet.prm_ls2_chg_account,value:dataGet.prm_ls2_chg_account});
   setEditPrmls2Itmcst(dataGet.prm_ls2_item_cost);
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
             `/delete_pm_material_data.php?site_cd=${site_ID}&RowID=${dltId}`
           );
   
           if (response.data.status === "SUCCESS") {
             Swal.fire({
               title: "Deleted!",
               text: response.data.message,
               icon: "success"
             }).then(() => {
               // Call get_Mr_Line_Data after the "OK" button is clicked
               get_pm_material_data(site_ID, RowID);
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
          {result.prm_ls2_assetno}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls2_stockno}
        </TableCell>
        
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls2_stk_locn}
        </TableCell>
      
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
        
             {result.prm_ls2_desc && result.prm_ls2_desc.length > 20 ? (
          <Tooltip title={result.prm_ls2_desc} arrow placement="top">
            <span>
              {result.prm_ls2_desc.slice(0, 20)}...
            </span>
          </Tooltip>
        ) : (
          result.prm_ls2_desc || ""
        )}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls2_mtl_uom}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.prm_ls2_qty_needed)}
          
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls2_chg_costcenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_ls2_chg_account}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.prm_ls2_item_cost)}
          
        </TableCell>
      </TableRow>
    ));
  };

  const resetData = () => {
    setmodalRowDt("");
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
      prm_ls2_assetno: AssetNo,
      mtr_mst_wo_no: WorkOrderNo,
      prm_ls2_stockno:"",
      prm_ls2_stk_locn:"",
      prm_ls2_desc:"",
      prm_ls2_mtl_uom:"",
      prm_ls2_qty_needed:"1",
      prm_ls2_chg_costcenter: "",
      prm_ls2_chg_account: "",
      prm_ls2_item_cost:""
      
    },
  ]);
  // Add New button funcation
//   const addInputField = (event) => {
//     event.preventDefault();
//     let isValid = true;
//     inputFields.forEach((inputFields) => {
//       if (inputFields.prm_ls1_crft.trim() === "") {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: "Craft is Required!",
//           customClass: {
//             container: "swalcontainercustom",
//           },
//         });
//         isValid = false;
//       } 
//     });
//     if (isValid) {
//       setInputFields([
//         ...inputFields,
//         {
//           site_ID: site_ID,
//           mst_RowID: RowID,
//           emp_mst_login_id: emp_mst_login_id,
//           prm_ls1_assetno: AssetNo,
//           prm_ls1_crft:"",
//           prm_ls1_crewSize:"1",
//           prm_ls1_est_hrs:"",
//           prm_ls1_lumpsum:"",
//           selectChargeCostCenter: "",
//           selectChargeAccount: "",
//         },
//       ]);
//     }
//   };
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
      prm_ls2_assetno: AssetNo,
      prm_ls2_stockno: "",
      prm_ls2_stk_locn:"",
      prm_ls2_desc: "",
      prm_ls2_mtl_uom: "",
      prm_ls2_qty_needed: "1",
      prm_ls2_chg_costcenter: "",
      prm_ls2_chg_account:"",
      prm_ls2_item_cost:""
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
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    if (rowData !== undefined && rowData !== null) {
      setmodalRowDt(rowData);
      try {
        const response = await httpCommon.get(
          "/get_Stock _No_dataMaterial.php?site_cd=" +
            site_ID +
            "&itm_mst_stockno=" +
            rowData
        );
       // console.log("response____get__",response);
        if (response.data.status === "SUCCESS") {
        
          const list = [...inputFields];

          const stockDt = rowData;
          list[index]["prm_ls2_stockno"] = stockDt;
          setInputFields(list);

          const newData = response.data.data[0].itm_mst_desc;
          list[index]["prm_ls2_desc"] = newData;
          setInputFields(list);

          const DataLoction = response.data.data[0].itm_mst_mstr_locn;
          list[index]["prm_ls2_stk_locn"] = DataLoction;
          setInputFields(list);

          const Umo = response.data.data[0].itm_mst_issue_uom;
          list[index]["prm_ls2_mtl_uom"] = Umo;
          setInputFields(list);

          const CostCenter = response.data.data[0].itm_mst_costcenter;
          const CostCenterDesc = response.data.data[0].cf_cost_center_desc;
            list[index]["prm_ls2_chg_costcenter"] = {
            label: `${CostCenter} : ${CostCenterDesc}`,
            value: CostCenter,
            };
            setInputFields(list);
          
 
          const CostAcnt = response.data.data[0].itm_mst_account;
          const CostAcntDesc = response.data.data[0].account_desc;
          list[index]["prm_ls2_chg_account"] = {
            label: `${CostAcnt} : ${CostAcntDesc}`,
            value: CostAcnt,
            };
          

          const itmCst = response.data.data[0].itm_det_issue_price;
          list[index]["prm_ls2_item_cost"] = itmCst;
          setInputFields(list);


          Swal.close();
        }
      } catch (error) {
        console.error("Error posting form data:", error);
      }
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
    Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
   //   Swal.showLoading();
      if (rowData !== undefined && rowData !== null) {
        setmodalRowDt(rowData);
        try {
          const response = await httpCommon.get(
            "/get_Stock _No_dataMaterial.php?site_cd=" +
              site_ID +
              "&itm_mst_stockno=" +
              rowData
          );
          console.log("response____get__update",response);
          if (response.data.status === "SUCCESS") {
          
            const list = [...inputFields];
  
            const stockDt = rowData;
             setEditPrmls2stockNo(stockDt);
          
            const newData = response.data.data[0].itm_mst_desc;
             setEditPrmls2Desc(newData);
            const DataLoction = response.data.data[0].itm_mst_mstr_locn;
             setEditPrmls2StockLoc({label: `${DataLoction}`,
                value: DataLoction,});
  
            const Umo = response.data.data[0].itm_mst_issue_uom;
            setEditPrmls2Uom(Umo);
  
            const CostCenter = response.data.data[0].itm_mst_costcenter;
            const CostCenterDesc = response.data.data[0].cf_cost_center_desc;
              setEditPrmls2chgcostcenter({label: `${CostCenter} : ${CostCenterDesc}`,
                value: CostCenter,})
   
            const CostAcnt = response.data.data[0].itm_mst_account;
            const CostAcntDesc = response.data.data[0].account_desc;
            setEditPrmls2chgAccount({label: `${CostAcnt} : ${CostAcntDesc}`,
                value: CostAcnt,})
            
           // const itmQty = response.data.data[0].itm_loc_oh_qty;
           // setEditPrmls2QtyNed(itmQty);

            const itmCst = response.data.data[0].itm_det_issue_price;
             setEditPrmls2Itmcst(itmCst);
  
  
            Swal.close();
          }
        } catch (error) {
          console.error("Error posting form data:", error);
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
  const handleCancelClick = ( index) => {
   
  const list = [...inputFields]; 
  list[index]["prm_ls2_stockno"] = ""; 
  setInputFields(list); 
  };

  const handleChange = async (index, fieldName, value) => {
       
    const list = [...inputFields];
    if (fieldName == "prm_ls2_stk_locn") {
      list[index][fieldName] = value;
      setInputFields(list);
    } else {
      list[index][fieldName] = value;
      setInputFields(list);
    }
  };

  const handleEditChange = async (index, fieldName, value) => {

    if(fieldName === "selectStockloc"){
        setEditPrmls2StockLoc(value); 
    }else if(fieldName === "prm_ls2_desc"){
        setEditPrmls2Desc(value);
    }else if(fieldName === "prm_ls2_qty_needed"){
        setEditPrmls2QtyNed(value);
    }else if(fieldName === "prm_ls2_chg_costcenter"){
        setEditPrmls2chgcostcenter(value);
    }else if(fieldName === "prm_ls2_chg_account"){
        setEditPrmls2chgAccount(value);
    }

  };
const handleClickStockLocation = async() =>{
    try {
      const response = await httpCommon.get(
        `get_stock_location_pm_material.php?site_cd=${site_ID}&stockNo=${modalRowDt}&empId=${emp_mst_login_id}`
      );
     
      let ChargeSelectStockLocation = response.data.data.map((item) => ({
        label: item.itm_loc_stk_loc,
        value: item.itm_loc_stk_loc,
      }));
     
      setSlectStockLocation(ChargeSelectStockLocation);
      setEditPrmls2StockLoc(ChargeSelectStockLocation);
    } catch (error) {
      console.error(error);
    }  
}
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
//console.log("materiL____input__",inputFields);
  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.prm_ls2_stockno.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock No is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.prm_ls2_stk_locn.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock Location is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.prm_ls2_desc.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (inputFields.prm_ls2_qty_needed.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Qty Needed is Required!",
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
          "/insert_pm_material_data.php",
          inputFields
        );
      //  console.log("API Response:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Material!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
           
            get_pm_material_data(site_ID, RowID);
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
    (acc, item) => acc + (parseFloat(item.prm_ls2_qty_needed) || 0),
    0
  );

  //Multiply calculation
  const totalCost = Result.reduce(
    (acc, item) =>
      acc +
      (parseFloat(item.prm_ls2_qty_needed) || 0) *
        (parseFloat(item.prm_ls2_item_cost) || 0),
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
        prm_ls2_assetno: AssetNo,
        mtr_mst_wo_no: WorkOrderNo,
        prm_ls2_stockno:"",
        prm_ls2_stk_locn:"",
        prm_ls2_desc:"",
        prm_ls2_mtl_uom:"",
        prm_ls2_qty_needed:"1",
        prm_ls2_chg_costcenter: "",
        prm_ls2_chg_account: "",
        prm_ls2_item_cost:""
        
      },

  
    ]);
    
  };

  useEffect(() => {
    get_pm_material_data(site_ID, RowID);
    getPmMaterialFormLebel();
    getPmMaterialMandatoryfiled();
    // get_workorder_status(site_ID, "All", location.state.select);
  }, [location]);

  const findCustomizeLabel = (columnName) => {
    if (!Array.isArray(prmLs2Label)) return "";
    const matchingColumn = prmLs2Label.find(
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


   // Handel Update button click
   const handleUpdateButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;

      if (EditPrmls2stockNo.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock No is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (EditPrmls2StockLoc.label == "" || EditPrmls2StockLoc.label == null) {
        
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock Location is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (EditPrmls2Desc.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (EditPrmls2QtyNed.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Qty Needed is Required!",
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
  
      var json_PmMaterialUpdate = {
        site_cd: site_ID,
        EditPrmls2stockNo: String(EditPrmls2stockNo || "").trim(), 
        EditPrmls2QtyNed: String(EditPrmls2QtyNed || "").trim(),
        EditPrmls2Itmcst: String(EditPrmls2Itmcst || "").trim(), 
        EditPrmls2Uom: String(EditPrmls2Uom || "").trim(), 
        EditPrmls2Desc: EditPrmls2Desc,
        EditPrmls2StockLoc:EditPrmls2StockLoc,
        EditPrmls2chgcostcenter: EditPrmls2chgcostcenter,
        EditPrmls2chgAccount:EditPrmls2chgAccount,
        EditPrmls1MstRowId:EditPrmls1MstRowId,
        emp_mst_login_id: emp_mst_login_id,

      }
       Swal.showLoading();
  //  console.log("inputFields____post",json_PmMaterialUpdate);
      try {
        const response = await httpCommon.post(
          "/update_pm_material_data.php",
          json_PmMaterialUpdate
        );
        console.log("API Response_update__:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Material!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            get_pm_material_data(site_ID, RowID);
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
             
              <Iconify icon="bi:tools" style={{ width: "28px", height: "28px",marginRight:"4px",marginLeft:"2px" }} />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
              Material 
              </div>
              <div  style={{ fontSize:"14px" ,marginBottom: "4px"}}>
               Total Quantity {" "}
                <span style={{ color: "blue" }}>
                  {formattedtotalQty}
                </span>{" "},
                Total Material Cost{" "}
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

        {/*************************************** Add Material Popup **************************************************/}
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
              <Iconify icon="bi:tools" style={{ width: "26px", height: "26px" ,marginRight: "4px"}} />
              Material
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
                        prm_ls2_assetno,
                        prm_ls2_stockno,
                        prm_ls2_stk_locn,
                        prm_ls2_desc,
                        prm_ls2_mtl_uom,
                        prm_ls2_qty_needed,
                        prm_ls2_chg_costcenter,
                        prm_ls2_chg_account,
                        prm_ls2_item_cost
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls2_assetno") || "Requiredlabel"}> {findCustomizeLabel("prm_ls2_assetno") ||
                                    "Asset No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={data.prm_ls2_assetno}
                                disabled
                             
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("prm_ls2_stockno") || "Requiredlabel"}> {findCustomizeLabel("prm_ls2_stockno") ||
                                    "Stock No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>

                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.prm_ls2_stockno != "" ? data.prm_ls2_stockno : ""
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
                            {/* Model Stock No  Select  */}
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
                               
                               Stock No
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
                                  <PmMaterialStockNoPopupData
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
                            
                            {/* End of Stock No Select model */}
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              <label className={findCustomizerequiredLabel("prm_ls2_stk_locn") || "Requiredlabel" } > {findCustomizeLabel("prm_ls2_stk_locn") ||
                                    "Stock Location:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={SlectStockLocation}
                                value={data.prm_ls2_stk_locn}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "prm_ls2_stk_locn",
                                    newValue
                                  )
                                }
                                onOpen={handleClickStockLocation}
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
                              <label className={findCustomizerequiredLabel("prm_ls2_desc") || "Requiredlabel" } > {findCustomizeLabel("prm_ls2_desc") ||
                                    "Description:"}</label>
                            </Grid>
                                <Grid item xs={12} md={8}>
                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        minRows={2.5}
                                        fullWidth
                                     value={data.prm_ls2_desc}
                                      onChange={(event) => {
                                        const value = event.target.value;
                                        if (value.length <= 1024) {
                                          handleChange(
                                            index,
                                            "prm_ls2_desc",
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
                              
                              <label className={findCustomizerequiredLabel("prm_ls2_mtl_uom") || "Requiredlabel"}> {findCustomizeLabel("prm_ls2_mtl_uom") ||
                                    "UOM:"}</label>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    className="Extrasize"
                                    fullWidth
                                    disabled
                                    value={data.prm_ls2_mtl_uom}
                                
                                    
                                />
                                </Grid>
                           
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    style={{ padding: "10px" }}
                                    >
                              
                              <label className={findCustomizerequiredLabel("prm_ls2_qty_needed") || "Requiredlabel"}> {findCustomizeLabel("prm_ls2_qty_needed") ||
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
                                      handleChange(index, "prm_ls2_qty_needed", formattedValue);
                                    });
                                  }
                                }}

                                value={data.prm_ls2_qty_needed}
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
                              <label className={findCustomizerequiredLabel("prm_ls2_chg_costcenter")}> {findCustomizeLabel("prm_ls2_chg_costcenter") ||
                                    "Charge Cost Center:"}</label>
                            </Grid>

                       
                        
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeCostCenter}
                                value={data.prm_ls2_chg_costcenter}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "prm_ls2_chg_costcenter",
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls2_chg_account")}> {findCustomizeLabel("prm_ls2_chg_account") ||
                                    "Charge Account:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeAccount}
                                value={data.prm_ls2_chg_account}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "prm_ls2_chg_account",
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
                              
                              <label className={findCustomizerequiredLabel("prm_ls2_item_cost")}> {findCustomizeLabel("prm_ls2_item_cost") ||
                                    "Item Cost:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder=".00"
                                disabled
                                value={data.prm_ls2_item_cost}
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
          {/*************************************** Edit Material Popup **************************************************/}

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
              <Iconify icon="bi:tools" style={{ width: "26px", height: "26px" ,marginRight: "4px"}} />
               Update Material
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls2_assetno") || "Requiredlabel"}> {findCustomizeLabel("prm_ls2_assetno") ||
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls2_stockno") || "Requiredlabel"}> {findCustomizeLabel("prm_ls2_stockno") ||
                                    "Stock No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>

                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                    EditPrmls2stockNo != "" ? EditPrmls2stockNo : ""
                                }
                                
                                 placeholder="Select..."
                                 autoComplete="off"
                                
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                   // onClick={() => handleCancelClick(index)}
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
                               
                               Stock No
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
                                  <PmMaterialStockNoPopupData
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
                            {/* End of Craft Select model */}
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              <label className={findCustomizerequiredLabel("prm_ls2_stk_locn") || "Requiredlabel" } > {findCustomizeLabel("prm_ls2_stk_locn") ||
                                    "Stock Location:"}</label>
                            </Grid>
              
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={SlectStockLocation}
                                value={EditPrmls2StockLoc}
                                getOptionLabel={(option) => (option.label ? option.label : "")}
                                onChange={(event, newValue) =>
                                    handleEditChange(
                                     EditPrmls1MstRowId,
                                      "selectStockloc",
                                      newValue
                                    )
                                  }
                                onOpen={handleClickStockLocation}
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
                              <label className={findCustomizerequiredLabel("prm_ls2_desc") || "Requiredlabel" } > {findCustomizeLabel("prm_ls2_desc") ||
                                    "Description:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <TextareaAutosize
                                    aria-label="empty textarea"
                                    minRows={2.5}
                                    fullWidth
                                    value={EditPrmls2Desc}
                                    onChange={(event) => {
                                    const value = event.target.value;
                                    if (value.length <= 1024) {
                                        handleEditChange(
                                        EditPrmls1MstRowId,
                                        "prm_ls2_desc",
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
                              
                                <label className={findCustomizerequiredLabel("prm_ls2_mtl_uom") || "Requiredlabel"}> {findCustomizeLabel("prm_ls2_mtl_uom") ||
                                    "UOM:"}</label>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    className="Extrasize"
                                    fullWidth
                                    disabled
                                    value={EditPrmls2Uom}
                                    
                                />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    style={{ padding: "10px" }}
                                    >
                              
                              <label className={findCustomizerequiredLabel("prm_ls2_qty_needed") || "Requiredlabel"}> {findCustomizeLabel("prm_ls2_qty_needed") ||
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
                                        handleEditChange(EditPrmls1MstRowId, "prm_ls2_qty_needed", formattedValue);
                                    });
                                  }
                                }}

                                value={EditPrmls2QtyNed}
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
                              <label className={findCustomizerequiredLabel("prm_ls2_chg_costcenter")}> {findCustomizeLabel("prm_ls2_chg_costcenter") ||
                                    "Charge Cost Center:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeCostCenter}
                                value={EditPrmls2chgcostcenter}
                                onChange={(event, newValue) =>
                                handleEditChange(
                                    EditPrmls1MstRowId,
                                    "prm_ls2_chg_costcenter",
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
                             
                              <label className={findCustomizerequiredLabel("prm_ls2_chg_account")}> {findCustomizeLabel("prm_ls2_chg_account") ||
                                    "Charge Account:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={ChargeAccount}
                                value={EditPrmls2chgAccount}
                                onChange={(event, newValue) =>
                                    handleEditChange(
                                    EditPrmls1MstRowId,
                                    "prm_ls2_chg_account",
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
                              
                              <label className={findCustomizerequiredLabel("prm_ls2_item_cost")}> {findCustomizeLabel("prm_ls2_item_cost") ||
                                    "Item Cost:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder=".00"
                                disabled
                                value={EditPrmls2Itmcst}
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

export default PmMaterial;
