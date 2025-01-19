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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Iconify from "src/components/iconify";

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
const List1 = ({ onRowClick, data,ApprovalStatus }) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);

  const [show, setShow] = useState(false);
 
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [EditVar1, setEditVar1] = useState("");
  const [EditVar2, setEditVar2] = useState("");
  const [EditVar3, setEditVar3] = useState("");
  const [EditNumeric1,setEditNumeric1] = useState("");
  const [EditNumeric2,setEditNumeric2] = useState("");
  const [EditDateTime1,setEditDateTime1] = useState(null);
  const [EditDateTime2,setEditDateTime2] = useState(null);
  const [EditDateTime3,setEditDateTime3] = useState(null);


  const location = useLocation();

  const [FormStatus, setFormStatus] = useState(data.formStatus);
  const [RowID, setRowID] = useState(data.RowID);
  const [RowID2, setRowID2] = useState("");


  const [WrLabel, setWRLabel] = useState([]);
  const [WRList1MandatoryFiled, setWRList1MandatoryFiled] = useState([]);
 
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
   
    if(FormStatus !== "" && FormStatus == "NEW" ){
      get_WR_List2_Header(site_ID);
    }else{
      get_WR_List2(site_ID, RowID);
    }

    getWRList1FromLebel();
    getAssetMandatoryfiled();
  }, [location]);

  // First Api
  const get_WR_List2 = async (site_ID, RowID) => {
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
        `/get_wr_list2.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );
      // console.log("response____List1___", response);
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

  const get_WR_List2_Header = async (site_ID) => {
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
        `/get_wr_list2.php?site_cd=${site_ID}&RowID=${RowID || ""}`
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "No date available"; 
  
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, '0'); 
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    const year = dateObj.getFullYear();
   
  
    return `${day}-${month}-${year}`;
  };

  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center" ,
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
        {/* <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {index + 1}
        </TableCell> */}
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wkr_ls2_varchar1}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wkr_ls2_varchar2}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wkr_ls2_varchar3}
        </TableCell>
        {result.wkr_ls2_datetime1 &&
        result.wkr_ls2_datetime1.date ? (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {formatDateTime(result.wkr_ls2_datetime1.date)}
          </TableCell>
        ) : (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {/* Render empty value */}
          </TableCell>
        )}
         {result.wkr_ls2_datetime2 &&
        result.wkr_ls2_datetime2.date ? (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {formatDateTime(result.wkr_ls2_datetime2.date)}
          </TableCell>
        ) : (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {/* Render empty value */}
          </TableCell>
        )}
        {result.wkr_ls2_datetime3 &&
        result.wkr_ls2_datetime3.date ? (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {formatDateTime(result.wkr_ls2_datetime3.date)}
          </TableCell>
        ) : (
          <TableCell style={{ padding: "5px", textAlign: "center" }}>
            {/* Render empty value */}
          </TableCell>
        )}
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.wkr_ls2_numeric1)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.wkr_ls2_numeric2)}
        </TableCell>
        
      </TableRow>
    ));
  };

// Get All Filed label Name
const getWRList1FromLebel = async () => {
  try {
    const response = await httpCommon.get("/get_wr_list_1_from_lebal.php");
    if (response.data.status === "SUCCESS") {
      setWRLabel(response.data.data.wkr_ls2);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  // Get All Filed label Name
  const getAssetMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_wr_list_1_from_mandatory_filed.php");
      
      if (response.data && response.data.data && response.data.data.MandatoryField) {

        if (response.data.data.MandatoryField.length > 0) {
          
            setWRList1MandatoryFiled(response.data.data.MandatoryField);
  
        }
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
//console.log("WrLabel____",WrLabel);
const findCustomizeLabel = (columnName) => {
  if (!Array.isArray(WrLabel)) return "";
  const matchingColumn = WrLabel.find(
    (item) => item.column_name === columnName
  );
  return matchingColumn ? matchingColumn.customize_label : "";

};

const findCustomizerequiredLabel = (columnName) => {
  const foundItem = WRList1MandatoryFiled.find(item => item.column_name === columnName);
  if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
  }
  return "";
};

const handleEdit = (data) => {
  // console.log("Edit data as JSON:", JSON.stringify(data, null, 2));
  //console.log(`Edit row: ${data}`);
  setRowID2(data.RowID);
  setEditVar1(data.wkr_ls2_varchar1);
  setEditVar2(data.wkr_ls2_varchar2);
  setEditVar3(data.wkr_ls2_varchar3);
  setEditNumeric1(formatNumber(data.wkr_ls2_numeric1));
  setEditNumeric2(formatNumber(data.wkr_ls2_numeric2));
  setEditDateTime1(data.wkr_ls2_datetime1);
  setEditDateTime2(data.wkr_ls2_datetime2);
  setEditDateTime3(data.wkr_ls2_datetime3);

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
            `/delete_work_request_list_1_table_data.php?site_cd=${site_ID}&RowID=${dltId}`
          );
      
       if (response.data && response.data.status === "SUCCESS") {
        Swal.fire({
          title: "Deleted!",
          text: response.data.message,
          icon: "success"
        });
        // fetchData(); // Uncomment if needed
        get_WR_List2(site_ID, RowID);
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

    setEditVar1("");
    setEditVar2("");
    setEditVar3("");
    setEditNumeric1("");
    setEditNumeric2("");
    setEditDateTime1(null);
    setEditDateTime2(null);
    setEditDateTime3(null);
   
  };
 
  // Add New Row button click
  const [inputFields, setInputFields] = useState([
    {
      site_ID: site_ID,
      mst_RowID: RowID,
      emp_mst_login_id: emp_mst_login_id,
      Varchar1: "",
      Varchar2:"",
      Varchar3:"",
      Datetime1:"",
      Datetime2:"",
      Datetime3:"",
      Numeric1:"",
      Numeric2: ""
    },
  ]);
  
  // Add New button funcation
  const addInputField = (event) => {
    event.preventDefault();
    let isValid = true;
    if (isValid) {
      setInputFields([
        ...inputFields,
        {
          site_ID: site_ID,
          mst_RowID: RowID,
          emp_mst_login_id: emp_mst_login_id,
          Varchar1: "",
          Varchar2:"",
          Varchar3:"",
          Datetime1:"",
          Datetime2:"",
          Datetime3:"",
          Numeric1:"",
          Numeric2: ""
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
      Varchar1: "",
      Varchar2:"",
      Varchar3:"",
      Datetime1:"",
      Datetime2:"",
      Datetime3:"",
      Numeric1:"",
      Numeric2: ""

    };
  });

  const handleNumericInputChange_14 = (e, setterFunction) => {

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
       // setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
   // setErrorField(null);
   
  };

  const handleChange = async (index, fieldName, value, event) => {
  
    const list = [...inputFields];
    if (fieldName == "Numeric1") {
      
      handleNumericInputChange_14(event, (value) => {
        list[index][fieldName] = value;
        setInputFields(list);
      });
    } else if (fieldName == "Numeric2") {
      
        handleNumericInputChange_14(event, (value) => {
          list[index][fieldName] = value;
          setInputFields(list);
        });
      } else if(fieldName === "Datetime1"){
        if (value && !isNaN(new Date(value).getTime())) {
            list[index][fieldName] = new Date(value);
            setInputFields(list);
        }
          
    }else if(fieldName === "Datetime2"){
        if (value && !isNaN(new Date(value).getTime())) {
            list[index][fieldName] = new Date(value);
            setInputFields(list);
        }
    }else if(fieldName === "Datetime3"){
        if (value && !isNaN(new Date(value).getTime())) {
            list[index][fieldName] = new Date(value);
            setInputFields(list);
        }
    }else {
      list[index][fieldName] = value;
      setInputFields(list);
    }
  };
console.log("inputFields___222",inputFields);
  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
    const allEmpty = inputFields.every((field) => {
      return (
        !field.Datetime1 &&
        !field.Datetime2 &&
        !field.Datetime3 &&
        !field.Numeric1 &&
        !field.Numeric2 &&
        !field.Varchar1 &&
        !field.Varchar2 &&
        !field.Varchar3
      );
    });
  
    if (allEmpty) {
      removeInputFields();
      handleClose();
      return false; 
    }
      Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      //Swal.showLoading();
      
      try {
        const response = await httpCommon.post(
          "/insert_work_request_list_2_data.php",
          inputFields
        );
      //  console.log("response_____lis1__",response);

        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "List 2 Data!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
            timer: 3000, 
            timerProgressBar: true, 
            willClose: () => {
              
              setResult([...Result, inputFields]);
              get_WR_List2(site_ID, RowID);
          
              removeInputFields();
              handleClose();
            
            },
          }).then((result) => {
            if (result.dismiss !== Swal.DismissReason.timer) {
            setResult([...Result, inputFields]);
            get_WR_List2(site_ID, RowID);
            // console.log("inputFields_after",inputFields);

            if (result.isConfirmed) {
              // Call the next function when the user clicks the "OK" button

              removeInputFields();
              handleClose();
            }
          }
          });
        }
      } catch (error) {
        console.error("Error posting form data:", error);
      }
    
  };

  // Handel Update button click
  const handleUpdateButtonClick = async (e) =>{
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

    var json_UpdatList1 = {
      site_cd: site_ID,
      EditVar1:EditVar1?.trim() ?? '',
      EditVar2:EditVar2?.trim() ?? '',
      EditVar3:EditVar3?.trim() ?? '',
      EditNumeric1:EditNumeric1?.trim() ?? '',
      EditNumeric2:EditNumeric2?.trim() ?? '',
      EditDateTime1:EditDateTime1,
      EditDateTime2:EditDateTime2,
      EditDateTime3:EditDateTime3,
      RowID:RowID2,
      auditUser:emp_mst_login_id,
    }
  // console.log("json_UpdatList1___",json_UpdatList1);
    //update_asset_Specification
    try {
      const response = await httpCommon.post(
        "/update_work_request_list2.php",
        JSON.stringify(json_UpdatList1)
      );
    //  console.log("json_List1 Data", response);
      if (response.data.status === "SUCCESS") {
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
            
            setResult([...Result, inputFields]);
            get_WR_List2(site_ID, RowID);
      
           
               handleCloseModal();
            
          },
         }).then((result) => {
          if (result.dismiss !== Swal.DismissReason.timer) {
          setResult([...Result, inputFields]);
          get_WR_List2(site_ID, RowID);
    
          if (result.isConfirmed) {
             handleCloseModal();
          }
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
  
  const handleShow = () => {
     
    if(FormStatus !== "" && FormStatus == "NEW" ){
      Swal.fire({
        icon: "info",
        customClass: {
          container: "swalcontainercustom",
        },
        title: "Please Wait!",
        allowOutsideClick: false,
        text: "Once the Work Request is created, you can then add detailed list 2 .",
        width:"400px"
      });
      onRowClick("BtnList2");
    }else{
        setShow(true);
        setInputFields(updatedInputFields);
    }
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject; // Return Date object
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
              justifyContent: "space-between",
              flexWrap: "nowrap", 
              width: "100%",
            }}
          >
            {/* Left section: Icon and text */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "5px" }}>
                <Iconify
                 icon="material-symbols:date-range-outline"
                  width="25px"
                  height="25px"
                  style={{ fontSize: "24px" }}
                />
              </div>
              <div
                className="template-demo"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                  List 2
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
                disabled={
                  data.ApprovalStatus &&
                  (data.ApprovalStatus === "A" || data.ApprovalStatus === "D")
                }
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
              
                 icon="material-symbols:date-range-outline"
                width="25px"
                height="25px"
                style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
              />
              <div>Add List</div> {/* Title */}
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
                        Varchar1,
                        Varchar2,
                        Varchar3,
                        Datetime1,
                        Datetime2,
                        Datetime3,
                        Numeric1,
                        Numeric2
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
                                <label className={findCustomizerequiredLabel("wkr_ls2_varchar1")}>{findCustomizeLabel("wkr_ls2_varchar1") ||
                                    "Varchar1:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={data.Varchar1}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 15) {
                                        //setEditVar3(value);
                                        handleChange(index, 'Varchar1', value)
                                    }
                                  }}
                                  
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("wkr_ls2_varchar2")}>{findCustomizeLabel("wkr_ls2_varchar2") ||
                                    "Varchar2:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={data.Varchar2}
                                  
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 15) {
                                        //setEditVar3(value);
                                        handleChange(index, 'Varchar2', value)
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("wkr_ls2_varchar3")}>{findCustomizeLabel("wkr_ls2_varchar3") ||
                                    "Varchar3:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={data.Varchar3}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 15) {
                                        
                                        handleChange(index, 'Varchar3', value)
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("wkr_ls2_datetime1")}>{findCustomizeLabel("wkr_ls2_datetime1") ||
                                    "Datetime1:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                               
                                <DatePicker
                                 
                                value={data.Datetime1}
                                format="dd/MM/yyyy"
                                onChange={(newDate) => {
                                  handleChange(
                                    index,
                                    "Datetime1",
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
                                <label className={findCustomizerequiredLabel("wkr_ls2_datetime2")}>{findCustomizeLabel("wkr_ls2_datetime2") ||
                                    "Datetime2:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <DatePicker
                                 
                                 value={data.Datetime2}
                                 format="dd/MM/yyyy"
                                 onChange={(newDate) => {
                                   handleChange(
                                     index,
                                     "Datetime2",
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
                                <label className={findCustomizerequiredLabel("wkr_ls2_datetime3")}>{findCustomizeLabel("wkr_ls2_datetime3") ||
                                    "Datetime3:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <DatePicker
                                 value={data.Datetime3}
                                 format="dd/MM/yyyy"
                                 onChange={(newDate) => {
                                   handleChange(
                                     index,
                                     "Datetime3",
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
                                <label className={findCustomizerequiredLabel("wkr_ls2_numeric1")}>{findCustomizeLabel("wkr_ls2_numeric1") ||
                                    "Numeric1:"}</label>
                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  value={data.Numeric1}
                                  onChange={(event) =>
                                    handleChange(
                                      index,
                                      "Numeric1",
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
                                  placeholder=".000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("wkr_ls2_numeric2")}>{findCustomizeLabel("wkr_ls2_numeric2") ||
                                    "Numeric2:"}</label>
                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  value={data.Numeric2}
                                  onChange={(event) =>
                                    handleChange(
                                      index,
                                      "Numeric2",
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
                  className='AddNewButton'
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
        onClose={handleCloseModal}
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
            icon="material-symbols:date-range-outline"
            width="25px" height="25px"
            style={{fontSize: "24px", marginRight: "5px"  }}
        />
          <div>Update List 2</div> {/* Title */}
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

                        <label className={findCustomizerequiredLabel("wkr_ls2_varchar1")}>{findCustomizeLabel("wkr_ls2_varchar1") ||
                            "Varchar1:"}</label>

                        </Grid>

                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            value={EditVar1}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 15 ) {
                                setEditVar1(value);
                              }
                              
                              }}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>

                        <label className={findCustomizerequiredLabel("wkr_ls2_varchar2")}>{findCustomizeLabel("wkr_ls2_varchar2") ||
                            "Varchar2:"}</label>

                        </Grid>

                        <Grid item xs={12} md={8}>
                        <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            value={EditVar2}
                            onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 15 ) {
                                setEditVar2(value);
                            }
                            
                            }}
                        />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>

                        <label className={findCustomizerequiredLabel("wkr_ls2_varchar3")}>{findCustomizeLabel("wkr_ls2_varchar3") ||
                            "Varchar3:"}</label>

                        </Grid>
                     
                        <Grid item xs={12} md={8}>
                        <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            value={EditVar3}
                            onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 15 ) {
                                setEditVar3(value);
                            }
                            
                            }}
                        />
                        </Grid>

                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("wkr_ls2_datetime1")}>{findCustomizeLabel("wkr_ls2_datetime1") ||
                            "Datetime1:"}</label>
                        </Grid>
                      
                        <Grid item xs={12} md={8}>
                        <DatePicker
                                 
                            value={EditDateTime1 ? formatDate(EditDateTime1.date) : null} 
                            format="dd/MM/yyyy"
                            onChange={(newDate) => {
                                setEditDateTime1({ date: newDate }); 
                              }}
                            slotProps={{
                            textField: {
                                fullWidth: true,
                            },
                            }}
                            className="Extrasize"
                        />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("wkr_ls2_datetime2")}>{findCustomizeLabel("wkr_ls2_datetime2") ||
                            "Datetime2:"}</label>
                        </Grid>
                      
                        <Grid item xs={12} md={8}>
                        <DatePicker
                                 
                            value={EditDateTime2 ? formatDate(EditDateTime2.date) : null} 
                            format="dd/MM/yyyy"
                            onChange={(newDate) => {
                                setEditDateTime2({ date: newDate }); 
                              }}
                            slotProps={{
                            textField: {
                                fullWidth: true,
                            },
                            }}
                            className="Extrasize"
                        />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("wkr_ls2_datetime3")}>{findCustomizeLabel("wkr_ls2_datetime3") ||
                            "Datetime3:"}</label>
                        </Grid>
                      
                        <Grid item xs={12} md={8}>
                        <DatePicker
                                 
                            value={EditDateTime3 ? formatDate(EditDateTime3.date) : null} 
                            format="dd/MM/yyyy"
                            onChange={(newDate) => {
                                setEditDateTime3({ date: newDate }); 
                              }}
                            slotProps={{
                            textField: {
                                fullWidth: true,
                            },
                            }}
                            className="Extrasize"
                        />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                           <label className={findCustomizerequiredLabel("wkr_ls2_numeric1")}>{findCustomizeLabel("wkr_ls2_numeric1") ||
                                "Numeric1:"}</label>
                        </Grid>
                       
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            type="text"
                            className="Extrasize"
                            fullWidth
                            value={EditNumeric1}
                            onChange={(e) => handleNumericInputChange_14(e, setEditNumeric1)}
                            InputProps={{
                              inputProps: { style: { textAlign: 'right' } }
                            }}
                          />
                        
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                        <label className={findCustomizerequiredLabel("wkr_ls2_numeric2")}>{findCustomizeLabel("wkr_ls2_numeric2") ||
                                "Numeric2:"}</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                        <TextField
                            variant="outlined"
                            size="small"
                            type="text"
                            className="Extrasize"
                            fullWidth
                            value={EditNumeric2}
                            onChange={(e) => handleNumericInputChange_14(e, setEditNumeric2)}
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

export default List1;
