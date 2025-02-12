import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox, 
  Paper,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

import Iconify from "src/components/iconify";

//import PmLaborCraftPopupData from "./PmLaborCraftPopupData"

import { Menu, MenuItem } from "@mui/material";
import CheckList from "./Popup_model/CheckList"
import { useSwalCloseContext } from "../../../ContextApi/WorkOrder/SwalCloseContext";


import httpCommon from "src/http-common";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

const PmCheckList2 = ({ data }) => {
  
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
const {swalCloseTime} = useSwalCloseContext();

  const [Result, setResult] = React.useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowIndex, setMenuRowIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [RowID, setRowID] = useState(data.RowID);
  const [AssetNo, setAssetNo] = useState(data.Asset_No ? data.Asset_No.split(' : ')[0] : '');
  const [modalOpenAsset, setModalOpenAsset] = useState(false);

  const [show, setShow] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

const[EditChecklistName,setEditChecklistName] = useState("");
const[EditChecklistDesc,setEditChecklistDesc] = useState("");
const[EditCarrytoworkOrder,setEditCarrytoworkOrder] = useState("");
const[EditChecklistMstId, setEditChecklistMstId] = useState("");


const [isCarryChecked, setIsCarryChecked] = useState(false);

  const handleShow = () => {
    setShow(true);
    setInputFields(updatedInputFields);
  };

  const location = useLocation();

  const [modalRowDt, setmodalRowDt] = useState("");
  const [modalEditRowDt, setmodalEditRowDt] = useState("");

  const [prmLs1Label, setPrmls1Label] = useState([]);
  const [MaterialMandatoryFiled, setMaterialMandatoryFiled] = useState([]);


  // First Api
  const get_pm_checklist_data = async (site_ID, RowID) => {
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
        `/get_pm_check_list_data.php?site_cd=${site_ID}&RowID=${RowID}`
      );
      // console.log("response____chkList__",response);
      if (response.data.status === "SUCCESS") {
       // setHeader(response.data.data.header);
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
        <TableCell key="action" style={cellStyle}>
          No
        </TableCell>
        <TableCell key="action" style={cellStyle}>
          PM Group / Asset No
        </TableCell>
        <TableCell key="action" style={cellStyle}>
          Check List
        </TableCell>
        <TableCell key="action" style={cellStyle}>
          Description
        </TableCell>
        <TableCell key="action" style={cellStyle}>
          Carry to Work Order
        </TableCell>
       
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
            <MenuItem key={result.RowID || index}
            onClick={(event) => {
              event.stopPropagation(); 
              handleEdit(result, event);
            }}

            > <Iconify icon="solar:pen-bold" width="15px" height="15px" marginRight="5px"/> Edit</MenuItem>
            <MenuItem key={result.RowID || index}
            onClick={(event) => {
              event.stopPropagation(); 
               handleDelete(result, index, event);
            }}
            > <Iconify icon="solar:trash-bin-trash-bold" width="15px" height="20px" marginRight="5px"/> Delete</MenuItem>
          </Menu>
        </TableCell>
      <TableCell style={{ padding: "5px", textAlign: "center" }}>{index + 1}</TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_job_grp_asset}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.prm_job_job_cd}
        </TableCell>
        
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.job_mst_desc}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
            <Checkbox
            checked={result.prm_job_carry === "1"} 
             
            />
        </TableCell>
        
      </TableRow>
    ));
  };

  // Get All Filed label Name
const getPmLaborFormLebel = async () => {
  try {
    const response = await httpCommon.get("/get_pm_checklist_form_label.php");
    if (response.data.status === "SUCCESS") {
        setPrmls1Label(response.data.data.prm_job);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getPmLaborMandatoryfiled = async () => {
  try {
    const response = await httpCommon.get("/get_pm_checklist_from_mandatory_filed.php");
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
  //console.log("dataGet_____",dataGet);
  
    // nw data added
    setEditChecklistMstId(dataGet.RowID);
    setEditChecklistDesc(dataGet.job_mst_desc);
    setEditChecklistName(dataGet.job_mst_job_cd);
    setEditCarrytoworkOrder(dataGet.prm_job_carry);

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
             `/delete_pm_checklist_data.php?site_cd=${site_ID}&RowID=${dltId}`
           );
   
           if (response.data.status === "SUCCESS") {
             Swal.fire({
               title: "Deleted!",
               text: response.data.message,
               icon: "success",
               confirmButtonText: "OK",
               timer: swalCloseTime,
               timerProgressBar: true, 
               customClass: {
                 container: "swalcontainercustom",
               },
               willClose: () => {
                get_pm_checklist_data(site_ID, RowID);
              }
             }).then(() => {
               // Call get_Mr_Line_Data after the "OK" button is clicked
               get_pm_checklist_data(site_ID, RowID);
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
  

  const resetData = () => {
    setmodalRowDt("");
    setmodalEditRowDt("");
    setEditChecklistName("");
    setEditChecklistDesc("");
    
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

      prm_job_grp_asset:AssetNo,
      prm_job_job_cd:"",
      job_mst_desc:"",
      prm_job_carry:"0"
      
    },
  ]);
  // Add New button funcation
  
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
      prm_job_carry: "0",
      job_mst_desc: "",
      prm_job_job_cd: "",
    };
  });

  const handleEditClick = async () => {
    setModalOpenAsset(true);
  };
  const handleCloseModal2 = () => {
    setModalOpenAsset(false);
  };
 
  const handleCancelClick = ( index) => {
   
  const list = [...inputFields]; 
  list[index]["prm_ls1_crft"] = ""; 
  setInputFields(list); 
  };

  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.prm_job_job_cd.trim() === "") {
        
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
          "/insert_pm_check_list_data.php",
          inputFields
        );
      //  console.log("API Response:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Checklist!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
            timer: swalCloseTime,
            timerProgressBar: true, 
            willClose: () =>{
              setResult([...Result, inputFields]);
              get_pm_checklist_data(site_ID, RowID);
              removeInputFields();
              handleClose();
            }
          }).then((result) => {
            if (result.isConfirmed) {
              // Call the next function when the user clicks the "OK" button
              setResult([...Result, inputFields]);
              get_pm_checklist_data(site_ID, RowID);
              removeInputFields();
              handleClose();
            }
          });
        }
      } catch (error) {
        Swal.close();
        console.error("Error posting form data:", error);
      }
    }else{
        handleClose();
    }
  };

  const handleClose = () => {
    setShow(false);
    resetData();
    removeInputFields();
    setInputFields([
      {
        site_ID: site_ID,
        mst_RowID: RowID,
        emp_mst_login_id: emp_mst_login_id,

        prm_job_grp_asset:AssetNo,
        prm_job_job_cd:"",
        job_mst_desc:"",
        prm_job_carry:"0"
        
      },
  
    ]);
    setIsCarryChecked("")
  };

  useEffect(() => {
    get_pm_checklist_data(site_ID, RowID);
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

   // Handel Update button click
   const handleUpdateButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
   
      if (EditChecklistName.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Checklist is Required!",
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
  
      var json_ChkListUpdate = {
        site_cd: site_ID,
        EditChecklistName: String(EditChecklistName || "").trim(), 
        EditChecklistDesc: String(EditChecklistDesc || "").trim(),
      
        EditCarrytoworkOrder: EditCarrytoworkOrder,
        EditChecklistMstId:EditChecklistMstId,
        emp_mst_login_id: emp_mst_login_id,

      }
       Swal.showLoading();
   // console.log("inputFields____post",json_ChkListUpdate);
      try {
        const response = await httpCommon.post(
          "/update_pm_checklist_data.php",
          json_ChkListUpdate
        );
      //  console.log("API Response_update__:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Checklist!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
            timer: swalCloseTime,
            timerProgressBar: true, 
            willClose: () => {
              get_pm_checklist_data(site_ID, RowID);
              removeInputFields();
              handleEditClose();
            }
          }).then((result) => {

            if (result.isConfirmed) {
              // Call the next function when the user clicks the "OK" button
              get_pm_checklist_data(site_ID, RowID);
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

   const handleRowData2 = (dataa, firstData,secondData) => {
   
    const checklistname = dataa;
    const checklistDesc = firstData;

    setInputFields(prevInputFields => {
        return prevInputFields.map((field, index) => {
          
            if (index === 0) {
                return {
                    ...field,
                    prm_job_job_cd: checklistname, 
                    job_mst_desc: checklistDesc 
                };
            }
            return field; 
        });
    });
    setmodalRowDt(checklistname);
      // Handle secondData logic at the end
      if (secondData === 1) {
        setmodalRowDt(dataa);
         handleCloseModal2();
         setModalOpenAsset(false);
      }
    };

    const PopupRowDataSelect = () => {
        if (modalRowDt === "") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select one checklist option!",
            customClass: {
                container: "swalcontainercustom",
              },
          });
        } else {
          setModalOpenAsset(false);
    
        }
      };

    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setIsCarryChecked(checked);
        // Update inputFields based on checkbox status
        setInputFields(prevInputFields => {
            return prevInputFields.map((field, index) => {
                if (index === 0) { // Assuming you want to update the first input field
                    return {
                        ...field,
                        prm_job_carry: checked ? "1" : "0" // Set to "1" if checked, "0" if unchecked
                    };
                }
                return field; // Return unchanged field for other indices
            });
        });
    };

    const handleEditRowData = (dataa, firstData,secondData) => {
   
      const checklistname = dataa;
      const checklistDesc = firstData;

      setEditChecklistName(checklistname);
      setEditChecklistDesc(checklistDesc);
      setmodalEditRowDt(checklistname);
        // Handle secondData logic at the end
        if (secondData === 1) {
          //  setmodalRowDt(dataa);
            handleCloseModal2();
            setModalOpenAsset(false);
        }
      };

    const PopupRowEditDataSelect = () =>{
        if (modalEditRowDt === "") {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Please select one checklist option!",
                  customClass: {
                      container: "swalcontainercustom",
                    },
                });
              } else {
                setModalOpenAsset(false);
        }
    }

    const handleEditCheckboxChange = (event) => {
      const checked = event.target.checked;
      setEditCarrytoworkOrder(checked);
      
     
  };
  return (
    <>
      <div>
        <div style={{ paddingBottom: "0px", backgroundColor: "white" }}>
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginRight: "0px" }}>
             
             <Iconify
                icon="icon-park-outline:list"
                style={{ marginRight: '4px' }}
            />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold", marginTop:"-5px" }}>
                Checklist 
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
          <TableContainer component={Paper} style={{marginBottom:"15px"}}>
            <Table>
              <TableHead>
                <TableRow>{renderTableHeader()}</TableRow>
              </TableHead>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </TableContainer>
        </div>

        {/*************************************** Add Checklist Popup **************************************************/}
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
              sx={{
                m: 0,
                p: 2,
                display: "flex",
                alignItems: "center", 
              }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify
                icon="icon-park-outline:list"
                style={{ marginRight: '4px' }}
            />
              Add Checklist
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
                    {/* {console.log("datadatadatadata____", data)} */}
                    {inputFields.map((data, index) => {
                      const {

                        prm_ls1_crft,
                        prm_ls1_crewSize,
                        selectChargeCostCenter,
                        selectChargeAccount,
                        prm_ls1_est_hrs,
                        prm_ls1_lumpsum,

                        prm_job_grp_asset,
                        prm_job_job_cd,
                        job_mst_desc,
                        prm_job_carry
                        
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
                              
                              </Typography>
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
                             
                              <label className={findCustomizerequiredLabel("prm_job_grp_asset") }> {findCustomizeLabel("prm_job_grp_asset") ||
                                    "PM Group/Asset No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                value={prm_job_grp_asset}
                                disabled
                             
                              />
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label> Checklist:</label>
                            </Grid>
                            <Grid item xs={12} md={8}>

                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.prm_job_job_cd != "" ? data.prm_job_job_cd : ""
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
                            {/* Model checklist Select  */}
                            <BootstrapDialog
                                    
                                    onClose={(event, reason) => {
                                        if (reason !== "backdropClick") {
                                            handleCloseModal2();
                                        }
                                      }}
                                      aria-labelledby="customized-dialog-title"
                                      open={modalOpenAsset}
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
                               
                               Checklist
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
                                //  color: (theme) => theme.palette.grey[500],
                                }}
                              >
                                   <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                              </IconButton>
                                    
                              <DialogContent dividers>
                                <div className="TblSelect">
                                    <CheckList
                                    onRowClick={handleRowData2}
                                    dataId = {RowID}
                                    
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
                          
                           
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label> Description: </label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                disabled
                                value={ data.job_mst_desc != "" ? data.job_mst_desc : "" }
                                
                                
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              <label> Carry to work order:</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Checkbox 
                                  checked={isCarryChecked}
                                  onChange={handleCheckboxChange}
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
          {/*************************************** Edit Checklist Popup **************************************************/}

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
              sx={{
                m: 0,
                p: 2,
                display: "flex",
                alignItems: "center", // Align icon and text vertically
              }}
              id="customized-dialog-title"
              className="dailogTitWork"
            >
              <Iconify icon="icon-park-outline:list" sx={{ mr: 1, fontSize: "1.2rem" }} />
              Update Checklist
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleEditClose}
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
                             
                             <label className={findCustomizerequiredLabel("prm_job_grp_asset") }> {findCustomizeLabel("prm_job_grp_asset") ||
                                    "PM Group/Asset No:"}</label>
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
                             
                             <label> Checklist:</label>
                            </Grid>
                            <Grid item xs={12} md={8}>

                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  EditChecklistName != "" ? EditChecklistName : ""
                                }
                                
                                 placeholder="Select..."
                                 autoComplete="off"
                                
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                   // onClick={() => handleCancelClick()}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditClick}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model Checklist Select  */}
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
                               
                               Checklist
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
                                 <CheckList
                                    onRowClick={handleEditRowData}
                                    dataId = {RowID}
                                    
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
                                      PopupRowEditDataSelect();
                                    }}
                                    style={{ marginLeft: "5px" }}
                                  >
                                    Select
                                  </Button>
                                </div>
                              </DialogActions>
                            </Dialog>
                            {/* End of Checklist Select model */}
                           
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label> Description: </label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                            <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                disabled
                                value={ EditChecklistDesc != "" ? EditChecklistDesc : "" }
                                
                                
                              />
                            </Grid>
                            
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              <label> Carry to work order:</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Checkbox 
                                 checked={Number(EditCarrytoworkOrder) === 1}
                                  onChange={handleEditCheckboxChange}
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

export default PmCheckList2;
