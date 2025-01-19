import React, { useState, useEffect,useRef } from "react";
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

import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Iconify from "src/components/iconify";
import WorkStockNoPopupData from "src/sections/maintenance/component_module/Planning/WorkStockNoPopupData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

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
const MR_Line = ({ onRowClick, data ,onDataFromSecondComponent}) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);

  const [show, setShow] = useState(false);
 
  const handleShow = () => {
    setShow(true);
    setInputFields(updatedInputFields);
  };

  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [StockNo, setStockNo] = useState([]);
  
  const [selected_StockNo, setSelected_StockNo] = useState([]);
  const [Description, setDescription] = useState("");

  const [PartNo, setPartNo] = useState("");
 
  const [StockLocation,setStockLocation] = useState("");
  const [RequiredQuantity,setRequiredQuantity] = useState("");
  const [ItemCost,setItemCost] = useState("");
  const [UOM,setUom]= useState("");
  const [ActualQuantity,setActualQuantity] = useState("");
  const [ClearedQty,setClearedQty] = useState("");
  

  const [TotalOh, setTotalOh] = useState("");
  const [QtyNeeded, setQtyNeeded] = useState("");

  const location = useLocation();

  const [RowID, setRowID] = useState(data.RowID);
  const [RowID2, setRowID2] = useState(""); 

  const [MrReqNo, setMrReqNo] = useState(data.MrNo); 
  const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo); 
  const [AuditUser ,setAuditUser] = useState(data.AuditUser);
  

  const [getStockNo, setGetStockNo] = useState([]);
  const [modalOpenAsset, setModalOpenAsset] = useState(false);
  const [modalRowDt, setmodalRowDt] = useState("");

 
  const [MRLineMstLabel, setMRLineMstLabel] = useState([]);
  const [MRLineMandatoryFiled, setMRLineMandatoryFiled] = useState([]);
 
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowIndex, setMenuRowIndex] = useState(null);
  const [open, setOpen] = useState(false);


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


  const formatNumber = (number) => {
    if (number == null) {
      return '';
    }
  
    let [integerPart, decimalPart] = number.toString().split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
  
    return `${integerPart}.${decimalPart}`;
  };
  useEffect(() => {
    if (typeof RowID !== "undefined" && RowID !== null && RowID !== "") {
      get_Mr_Line_Data(site_ID,RowID);
    }
    get_Asset_Spares(site_ID); 
   
    getAssetSparesFromLebel();
    getAssetMandatoryfiled();
  }, [location]);
  // First Api
  const get_Asset_Spares = async (site_ID) => {
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
        `/get_mr_line_header.php?site_cd=${site_ID}`
      );
     //  console.log("response____Asset_MR LIne___", response);
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
  };
  //get table data
  const get_Mr_Line_Data = async (site_ID, RowID) => {
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
         `/get_mr_line_data.php?site_cd=${site_ID}&RowID=${RowID}`
      );
    //  console.log("RowID________",RowID);
     //  console.log("response____Asset_MR LIne___222", response);
       if (response.data.status === "SUCCESS" && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((item) => ({
          site_ID: site_ID,
          mst_RowID: item.RowID,
          emp_mst_login_id: emp_mst_login_id,
          mtr_ls1_mtr_lineno:item.mtr_ls1_mtr_lineno,
          selectStock: item.mtr_ls1_stockno,
          setStockLocation: item.mtr_ls1_stk_locn,
          setDescription: item.mtr_ls1_desc,
          setRequiredQuantity: item.mtr_ls1_req_qty,
          setItemCost: item.mtr_ls1_item_cost,
          setUom: item.mtr_ls1_mtl_uom,
          setActualQuantity: item.mtr_ls1_rcv_qty,
          setClearedQty: item.mtr_ls1_clear_qty,
        }));
    
        setResult(formattedData);
     //   onDataFromSecondComponent(formattedData);
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
      textAlign: "center",
    };
  
    return (
      <>
        <TableCell key="action" style={cellStyle}>
          Action
        </TableCell>
        {Header && typeof Header === 'object'
          ? Object.keys(Header).map((attr) => (
              <TableCell key={attr} style={cellStyle}>
                {attr}
              </TableCell>
            ))
          : null}
      </>
    );
  };

  //Body
  const renderTableRows = () => {

   // return (Result && Array.isArray(Result) ? Result : []).map((result, index) => (
    return (Result && Array.isArray(Result) ? Result.flat() : []).map((result, index) => {
      return (
      <TableRow key={index} 
      style={{ cursor: "pointer", transition: "background-color 0.3s" }}
      onMouseEnter={(event) => event.currentTarget.style.backgroundColor = "#f0f0f0"}
      onMouseLeave={(event) => event.currentTarget.style.backgroundColor = "transparent"}
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
              handleDelete(result, index, event);
            }}
            > <Iconify icon="solar:trash-bin-trash-bold" width="15px" height="20px" marginRight="5px"/> Delete</MenuItem>
          </Menu>
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {index + 1}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
        {result && result.selectStock && result.selectStock.includes(":") 
            ? result.selectStock.split(":")[0].trim() 
            : result ? result.selectStock : ""}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setStockLocation}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
         
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setDescription}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.setRequiredQuantity)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setItemCost}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setUom}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setActualQuantity}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setClearedQty}
        </TableCell>
    
       
      </TableRow>
      );
    });
  
  };

// Get All Filed label Name
const getAssetSparesFromLebel = async () => {
  try {
    const response = await httpCommon.get("/get_mrline_form_lebal.php");
   // console.log("response___forl lebal_",response);
    if (response.data.status === "SUCCESS") {
      setMRLineMstLabel(response.data.data.mtr_ls1);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  // Get All Filed label Name
  const getAssetMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_mrline_mandatory_filed.php");
     // console.log("response___Mandatory filed_",response);
      if (response.data && response.data.data && response.data.data.MandatoryField) {

        if (response.data.data.MandatoryField.length > 0) {
          
          setMRLineMandatoryFiled(response.data.data.MandatoryField);
  
        }
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

const findCustomizeLabel = (columnName) => {
  if (!Array.isArray(MRLineMstLabel)) return "";
  const matchingColumn = MRLineMstLabel.find(
    (item) => item.column_name === columnName
  );
  return matchingColumn ? matchingColumn.customize_label : "";

};

const findCustomizerequiredLabel = (columnName) => {
  const foundItem = MRLineMandatoryFiled.find(item => item.column_name === columnName);
  if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
  }
  return "";
};


const handleEdit = (data, event) => {
  //console.log("Edit data as JSON:", JSON.stringify(data, null, 2));
  setRowID2(data.mst_RowID);
  setStockNo(data.selectStock);
  setStockLocation(data.setStockLocation);
  setDescription(data.setDescription);
  setRequiredQuantity(formatNumber(data.setRequiredQuantity));
  setItemCost(data.setItemCost);
  setUom(data.setUom);
  setActualQuantity(data.setActualQuantity);
  setClearedQty(data.setClearedQty);
   setShowModal(true);
   handleMenuClose();
};

const handleDelete = async (data, index, event) => {
  // Handle delete logic here
 // console.log("Current row index:", index); // Log or use the index as needed
 // console.log("Edit data as JSON:", JSON.stringify(data, null, 2));
 // console.log("Result_____",Result);
  const dltId = data.mst_RowID;
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
       
       // const updatedResult = Result.filter((item) => item.mst_RowID !== dltId);
    //  setResult(updatedResult);
    //  onDataFromSecondComponent(updatedResult);

      try {
        const response = await httpCommon.get(
          `/delete_mr_line_data.php?site_cd=${site_ID}&MR_mstRowId=${RowID}&workOrderNo=${WorkOrderNo}&auditUser=${AuditUser}&MrReqNo=${MrReqNo}&MrLineRowId=${dltId}&MrLineNo=${data.mtr_ls1_mtr_lineno}&setRequiredQuantity=${data.setRequiredQuantity}&setItemCost=${data.setItemCost}`
        );
     //   console.log("response_____delete___", response); 

        if (response.data.status === "SUCCESS") {
          Swal.fire({
            title: "Deleted!",
            text: response.data.message,
            icon: "success"
          }).then(() => {
            // Call get_Mr_Line_Data after the "OK" button is clicked
            get_Mr_Line_Data(site_ID, RowID);
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
  // Add New Row button click
  const [inputFields, setInputFields] = useState([
    {
      site_ID: site_ID,
      mst_RowID: RowID,
      emp_mst_login_id: emp_mst_login_id,
      selectStock: "",
      setStockLocation:"",
      setDescription: "",
      setRequiredQuantity:"",
      setItemCost:"",
      setUom:"",
      setActualQuantity:"0.0000",
      setClearedQty:"0.0000",
    },
  ]);
 // console.log("MRLineMstLabel_____",MRLineMstLabel);
  const resetData = () => {
  
    setInputFields([
      {
        site_ID: site_ID,
        mst_RowID: RowID,
        emp_mst_login_id: emp_mst_login_id,
        selectStock: "",
        setStockLocation: "",
        setDescription: "",
        setRequiredQuantity: "",
        setItemCost: "",
        setUom: "",
        setActualQuantity: "",
        setClearedQty: "",
      },
    ]);
   
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
    //removeInputFields();
  };
  // Clear State data
  const updatedInputFields = inputFields.map((field) => {
    return {
      ...field,
      selectStock: "",
      setDescription: "",
      setPartNo:"",
      setQtyNeeded: "",
      setTotalOh:"",

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
          "/get_mr_line_stock_data.php?site_cd=" +
            site_ID +
            "&itm_mst_stockno=" +
            rowData
        );
       
      //  console.log(response.data.data[0]);
        if (response.data.status === "SUCCESS") {

        
          setGetStockNo(response.data.data);
          setStockNo(modalRowDt + ":" + response.data.data[0].itm_mst_desc);

          
          const list = [...inputFields];

          const stockDt = modalRowDt + " : " + response.data.data[0].itm_mst_desc;
          list[index]["selectStock"] = stockDt;
          setInputFields(list); 

          const StockLocation = response.data.data[0].itm_mst_mstr_locn;
          list[index]["setStockLocation"] = StockLocation;
          setInputFields(list);  

    
          const newData = response.data.data[0].itm_mst_desc;
          list[index]["setDescription"] = newData;
          setInputFields(list);

          const ItemCost = response.data.data[0].itm_det_item_cost;
          list[index]["setItemCost"] = ItemCost;
          setInputFields(list); 

          const UOM = response.data.data[0].itm_mst_issue_uom;
          list[index]["setUom"] = UOM;
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

  const PopupRowDataSelect = () => {
    if (modalRowDt === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select one option!",
      });
    } else {
      setModalOpenAsset(false);
    }
  };

  const handleCancelClick = () => {
    setmodalRowDt("");
  };

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
        let decimalPart2 = parts[1] ? parts[1].slice(0, 2) : '';
        const formattedValue2 = decimalPart2 ? `${integerPart2}.${decimalPart2}` : integerPart2;
        setterFunction(formattedValue2);
       // setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
  //  setErrorField(null);
   
  };
  const handleNumericInputChange_16 = (e, setterFunction) => {
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
      //  setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
   // setErrorField(null);
   
  };
  const handleChange = async (index, fieldName, value, event) => {
    const list = [...inputFields];
    if (fieldName == "setQtyNeeded") {
      
      handleNumericInputChange_14(event, (value) => {

        list[index][fieldName] = value;
    
        setInputFields(list);
    
      });
      setQtyNeeded(value);
    } else if(fieldName == "setPartNo"){
      list[index][fieldName] = value.slice(0, 16);
      setPartNo(value);
    }else {
      list[index][fieldName] = value;
      setInputFields(list);
    }

    // if (fieldName == "setQtyNeeded") {
    //   setQtyNeeded(value);
    // }
  };

  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
        if (!inputFields.selectStock || inputFields.selectStock.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock No is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (!inputFields.setStockLocation || inputFields.setStockLocation.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock Location is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (!inputFields.setRequiredQuantity || inputFields.setRequiredQuantity.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Required Quantity is Required!",
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
   // setResult([...Result, inputFields]);
   const updatedInputFields = inputFields.map(field => ({
    ...field,
    status: "NEW"
}));



   setResult((prevResult) => [...(prevResult || []), updatedInputFields]);
  
   onDataFromSecondComponent(...updatedInputFields);
    //get_Asset_Spares(site_ID, RowID);
   // removeInputFields();
   
    handleClose();
    Swal.close();
      
    }
  };

  // Handel Update button click

  const handleUpdateButtonClick = async (e) =>{
    e.preventDefault();
    let isValid = true;
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
  if (!RequiredQuantity || RequiredQuantity.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Required Quantity is Required!",
      customClass: {
        container: "swalcontainercustom",
      },
    });
    isValid = false;
  }
  if (isValid) {
   
    const updatedResult = Result.map((item) => {
      if (item.mst_RowID && item.mst_RowID.trim() && RowID2.trim() === item.mst_RowID.trim()) {
        return {
          ...item,
          setRequiredQuantity: RequiredQuantity,
          setItemCost: ItemCost,
          status:"oldUpdate",
        };
      }
      return item;
  });
  setResult(updatedResult);
  onDataFromSecondComponent(updatedResult);
  Swal.close();
  handleCloseModal();
}

  
 
  }
  //console.log("updatedResult____",Result);
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
            {/* Left section: Icon and text */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "2px",marginTop: "5px" }}>
                <Iconify
                  icon="clarity:form-line"
                  width="25px"
                  height="25px"
                  style={{ fontSize: "30px" }}
                />
              </div>
              <div
                className="template-demo"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                MR Line 
                </div>
              </div>
            </div>

            {/* Right section: Button */}
            <div
              style={{
                marginLeft: "auto", // Push button to the right
              }}
            >
              <Button
                type="button"
                className="AddNewButton"
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
        <div>
          <Dialog
            onClose={(event, reason) => {
              if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                handleClose(event, reason);
              }
            }}
            aria-labelledby="customized-dialog-title"
            open={show}
            maxWidth="sm"
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
              sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify
              
                icon="clarity:form-line"
                width="30px"
                height="30px"
                style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
              />
              <div>Add MR Line </div> {/* Title */}
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
                        selectStock,
                        setStockLocation,
                        setDescription,
                        setRequiredQuantity,
                        setItemCost,
                        setUom,
                        setActualQuantity,
                        setClearedQty,
                     
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
                              
                              <label className={findCustomizerequiredLabel("mtr_ls1_stockno") || "Requiredlabel"}> {findCustomizeLabel("mtr_ls1_stockno") ||
                                    "Stock No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.selectStock != "" ? data.selectStock : ""
                                }
                                disabled={data.selectStock !== ""}
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditClick}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model stock no  */}
                            <Dialog
                             // onClose={handleCloseModal2}
                              onClose={(event, reason) => {
                                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                                  handleCloseModal2(event, reason);
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
                                sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}
                                id="customized-dialog-title"
                                className="dailogTitWork"
                              >
                                <Iconify
                                  icon="flowbite:list-outline"
                                  width="30px"
                                  height="30px"
                                  style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
                                />
                                <div> Stock</div> {/* Title */}
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModal2}
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
                                <div
                                  style={{
                                    width: "100%",
                                    marginTop: "15px",
                                  }}
                                >
                                  <WorkStockNoPopupData
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
                                  variant="soft"
                                  color="error"
                                  type="button"
                                  className="CloseButton"
                                //  onClick={onClickCancel}
                                  startIcon={
                                    <Iconify icon="material-symbols:close" />
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCloseModal2();
                                  }}
                                  >
                                    Cancel
                                </Button>

                                <div className="timeCartSubmit">
                                  <Button
                                    variant="contained"
                                    type="button"
                                    size="small"
                                    className="SaveButton"
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
                            {/* End of stock model */}

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("mtr_ls1_stk_locn") || "Requiredlabel"}> {findCustomizeLabel("mtr_ls1_stk_locn") ||
                                    "Stock Location:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.setStockLocation != "" ? data.setStockLocation : ""
                                }
                                disabled={data.setStockLocation !== ""}
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                // rightIcons={[
                                //   <Iconify
                                //     icon="material-symbols:close"
                                //     onClick={handleCancelClick}
                                //   />,
                                //   <Iconify
                                //     icon="tabler:edit"
                                //   // onClick={handleEditClickLocation}
                                //   />,
                                // ]}
                              />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("mtr_ls1_varchar1")}>{findCustomizeLabel("mtr_ls1_varchar1") ||
                                    "Serial No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  // value={
                                  //   data.setTotalOh != ""
                                  //     ? data.setTotalOh
                                  //     : ""
                                  // }
                                  disabled
                                  
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
                                <label className={findCustomizerequiredLabel("mtr_ls1_desc")}>{findCustomizeLabel("mtr_ls1_desc") ||
                                    "Description:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  type="text"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setDescription != ""
                                      ? data.setDescription
                                      : ""
                                  }
                                 
                                  onChange={(event) => {
                                    const newValue = event.target.value;
                                    // Check if the new value is within the limit of 1000 characters
                                    if (newValue.length <= 1000) {
                                      handleChange(index, "setDescription", newValue, event);
                                    }
                                  }}
                                 // disabled={data.setDescription !== ""}
                                
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                              
                                <label className={findCustomizerequiredLabel("mtr_ls1_req_qty") || "Requiredlabel"}> {findCustomizeLabel("mtr_ls1_req_qty") ||
                                    "Required Quantity"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  value={setRequiredQuantity}
                                  
                                  onChange={(event) => handleNumericInputChange_16(event, (formattedValue) => {
                                    handleChange(index, "setRequiredQuantity", formattedValue, event);
                                  })}
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
                                  placeholder=".000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("mtr_ls1_item_cost")}>{findCustomizeLabel("mtr_ls1_item_cost") ||
                                    "Item Cost:"}</label>
                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  value={setItemCost}
                                  // onChange={(event) =>
                                  //   handleChange(
                                  //     index,
                                  //     "setItemCost",
                                  //     event.target.value,
                                  //     event
                                  //   )
                                  // }
                                  onChange={(event) => handleNumericInputChange_16(event, (formattedValue) => {
                                    handleChange(index, "setItemCost", formattedValue, event);
                                  })}
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
                                  placeholder=".000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("mtr_ls1_mtl_uom")}>{findCustomizeLabel("mtr_ls1_mtl_uom") || 
                                    "UOM"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setUom != ""
                                      ? data.setUom
                                      : ""
                                  }
                                  disabled
                                  
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
                                <label className={findCustomizerequiredLabel("ast_ls1_ttl_oh")}>{findCustomizeLabel("ast_ls1_ttl_oh2") ||
                                    "Stock Status"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  // value={
                                  //   data.setTotalOh != ""
                                  //     ? data.setTotalOh
                                  //     : ""
                                  // }
                                  disabled
                                  
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
                                <label className={findCustomizerequiredLabel("ast_ls1_ttl_oh")}>{findCustomizeLabel("ast_ls1_ttl_oh2") ||
                                    "Issue Status"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  // value={
                                  //   data.setTotalOh != ""
                                  //     ? data.setTotalOh
                                  //     : ""
                                  // }
                                  disabled
                                  
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
                                <label className={findCustomizerequiredLabel("mtr_ls1_rcv_qty")}>{findCustomizeLabel("mtr_ls1_rcv_qty") ||  
                                    "Actual Quantity"}</label>
                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                 // value={setQtyNeeded}
                                 disabled
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
                                  placeholder=".000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("mtr_ls1_clear_qty")}>{findCustomizeLabel("mtr_ls1_clear_qty") ||
                                    "Cleared Qty"}</label>
                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  //value={setQtyNeeded}
                                disabled
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
                                  placeholder=".000"
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

                <div className="timeCartSubmit" style={{ display: "flex", alignItems: "center" }}>
                  
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
                  Add
                </Button>
                </div>
              </DialogActions>
            </Dialog>
          </div>
         
        </div>

      {/*  Row Click to open model popup */}
      <BootstrapDialog
        
        onClick={(event, reason) => {
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
              
                icon="clarity:form-line"
                width="30px"
                height="30px"
                style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
              />
          <div>Update MR Line</div> {/* Title */}
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
          <div
            style={{
              width: "100%",
              marginTop: "15px",
            }}
          >
            <div className="row">
              <div className="col-sm-12 WrkOdrMtb">
         
                 
                    <div className="row my-3 tb">
                    
                      <Grid
                        container
                        spacing={1.5}
                        className="timeCartPopuplabel"
                      >
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_stockno") || "Requiredlabel"}> {findCustomizeLabel("mtr_ls1_stockno") ||
                         "Stock No:"}</label>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={StockNo}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_stk_locn") || "Requiredlabel"}>{findCustomizeLabel("mtr_ls1_stk_locn") ||
                           "Stock Location:"}</label>
                        </Grid>

                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={StockLocation}
                           // onChange={(event) => setPartNo(event.target.value)}
                            // onChange={(e) => {
                            //   const value = e.target.value;
                            //   if (value.length <= 25 ) {
                            //     setPartNo(value);
                            //   }
                              
                            //   }}
                          />
                        </Grid>

                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_varchar1")}>{findCustomizeLabel("mtr_ls1_varchar1") || 
                           "Serial No:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value=""
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_desc")}>{findCustomizeLabel("mtr_ls1_desc") || 
                            "Description:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Description}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_req_qty")  || "Requiredlabel"}>{findCustomizeLabel("mtr_ls1_req_qty") ||
                           "Required Quantity:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            type="text"
                            className="Extrasize"
                            fullWidth
                            value={RequiredQuantity}
                           // onChange={(event) => setQtyNeeded(event.target.value)}
                            onChange={(e) => handleNumericInputChange_16(e, setRequiredQuantity)}
                            InputProps={{
                              inputProps: { style: { textAlign: 'right' } }
                            }}
                          />
                       
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_item_cost")}>{findCustomizeLabel("mtr_ls1_item_cost") ||
                           "Item Cost:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            type="text"
                            className="Extrasize"
                            fullWidth
                            value={ItemCost}
                           // onChange={(event) => setQtyNeeded(event.target.value)}
                            onChange={(e) => handleNumericInputChange_16(e, setItemCost)}
                            InputProps={{
                              inputProps: { style: { textAlign: 'right' } }
                            }}
                          />
                      
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_mtl_uom")}>{findCustomizeLabel("mtr_ls1_mtl_uom") ||
                            "UOM:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={UOM}
                            
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_rcv_qty")}>{findCustomizeLabel("mtr_ls1_rcv_qty") ||
                            "Actual Quantity:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={ActualQuantity}
                            InputProps={{
                              inputProps: { style: { textAlign: 'right' } }
                              }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("mtr_ls1_clear_qty")}>{findCustomizeLabel("mtr_ls1_clear_qty") ||
                            "Cleared Qty:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={ClearedQty}
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

export default MR_Line;
