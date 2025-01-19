import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, } from "@mui/material";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import httpCommon from "src/http-common";
import { Checkbox ,Radio} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Iconify from "src/components/iconify";
import logo from "../../../../../assets/img/Location_pin.png.jpg";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import StockLoactionPopupData from "src/sections/Inventory/InventoryMaster/component_module/Popup/StockLoactionPopupData";
import { Menu, MenuItem } from "@mui/material";
import { dateTimePickerTabsClasses } from "@mui/x-date-pickers";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Inventory_location = ({data}) =>{

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

    const [show, setShow] = useState(false);
    const location = useLocation();
    const [RowID, setRowID] = useState(data.RowID);
    const [Header, setHeader] = React.useState([]);
    const [Result, setResult] = React.useState([]);

    const [inv_loc_Label, setinv_loc_Label] = useState([]);
    const [locationMandatoryFiled, setlocationMandatoryFiled] = useState([]);
    const [modalOpenlocation, setmodalOpenlocation] = useState(false);
    const [modalRowDt, setmodalRowDt] = useState("");

    const [anchorEl, setAnchorEl] = useState(null);
    const [menuRowIndex, setMenuRowIndex] = useState(null);

    
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

    // Add New Row button click
    const [inputFields, setInputFields] = useState([
        {
            site_ID: site_ID,
            mst_RowID: RowID,
            emp_mst_login_id: emp_mst_login_id,
            itm_loc_lockout4count: '0',
            itm_loc_prim_locn_flg: '0',
            itm_loc_stk_loc:'',
            itm_loc_inc_ttloh:'0',
            itm_loc_stock_cost_flag:'0'
        },
    ]);

    const [UpdateFields, setUpdateFields] = useState([])

    useEffect(() => {
        get_inventory_master_location(site_ID, RowID);
       
    }, [location]);


    // First Api
    const get_inventory_master_location = async (site_ID, RowID) => {
        Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
            container: "swalcontainercustom",
        },
        });
        Swal.showLoading();
        try {
            console.log("get_inventory_master_location:", httpCommon.get( `/get_inventory_master_location.php?site_cd=${site_ID}&RowID=${RowID}` ));

            const response = await httpCommon.get( `/get_inventory_master_location.php?site_cd=${site_ID}&RowID=${RowID}` );
             console.log("response____material___", JSON.stringify(response));
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
        const cellStyle = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"};
        return (
        <>
            <TableCell key="select"></TableCell>
            {Object.keys(Header).map((attr) => (
            <TableCell key={attr} style={cellStyle}>
                {attr}
            </TableCell>
            ))}
        </>
        );
    };

    const formatDate = (dateObject) => {
        if (!dateObject) {
          return ''; // or any default value you prefer
        }
        const date = new Date(dateObject.date);
    
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
    
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
    
       // return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
       return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const CheckBox = (dateObject) => {

        if (!dateObject) {
          return false; 
        }else{

            if(dateObject == '0'){
                return false; 
            }else{
                return true; 
            }

        }
       
    };

    const formatFloat = (dateObject) => {
        
        return parseFloat(dateObject).toFixed(2);
    };

    const handleMenuClick = (event, index) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setMenuRowIndex(index);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuRowIndex(null);
    };

    const handleEdit = (item,index) => {

        setUpdateFields([
           
            {
                site_ID: site_ID,
                mst_RowID: RowID,
                RowID:item.RowID,
                Rowcount:index,
                emp_mst_login_id: emp_mst_login_id,
                itm_loc_lockout4count: item.itm_loc_lockout4count,
                itm_loc_prim_locn_flg: item.itm_loc_prim_locn_flg,
                itm_loc_stk_loc:item.itm_loc_stk_loc,
                itm_loc_inc_ttloh:item.itm_loc_inc_ttloh,
                itm_loc_stock_cost_flag:item.itm_loc_stock_cost_flag
            },
        ]);
        
        setShowModal(true);
        handleMenuClose();

    }

    const handleDelete = async (data) => {

    }

    const renderTableRows = () => {

        return Result.map((result, index) => (

            <TableRow key={index}  
                onMouseEnter={(event) => (event.currentTarget.style.backgroundColor = "#f0f0f0") }
                onMouseLeave={(event) => (event.currentTarget.style.backgroundColor = "transparent") }>

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
                        anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                    >
                        <MenuItem key={index}
                        onClick={(event) => { 
                            event.stopPropagation() 
                            handleEdit(result,index)
                        }}>
                             <Iconify icon="solar:pen-bold" width="15px" height="15px" marginRight="5px"/> Edit</MenuItem>
                        <MenuItem 
                        onClick={(event) => { 
                            event.stopPropagation(); 
                            handleDelete(result, event); 
                        }}>
                            <Iconify icon="solar:trash-bin-trash-bold" width="15px" height="20px" marginRight="5px"/> Delete</MenuItem>
                    </Menu>
                 </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}> {formatFloat(result.itm_loc_order_pt)} </TableCell>

                <TableCell align="center" style={{ padding: "5px", textAlign: "center" }}>
                    <div className="customcheckbox">
                        <FormControlLabel
                            control={ <Checkbox color="primary" />}
                            checked={CheckBox(result.itm_loc_lockout4count)}
                            labelPlacement="start" 
                        />
                    </div>
                </TableCell>

                <TableCell align="center" style={{ padding: "5px", textAlign: "center" }}>
                    <div className="customcheckbox">
                        <FormControlLabel
                            control={ <Checkbox color="primary" />}
                            checked={CheckBox(result.itm_loc_prim_locn_flg)}
                            labelPlacement="start" 
                        />
                    </div>
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {result.itm_loc_stk_loc}
                </TableCell>

                <TableCell align="center" style={{ padding: "5px", textAlign: "center" }}>
                    <div className="customcheckbox">
                        <FormControlLabel
                            control={ <Checkbox color="primary" />}
                            checked={CheckBox(result.itm_loc_inc_ttloh)}
                            labelPlacement="start" 
                        />
                    </div>
                </TableCell>

                <TableCell align="center" style={{ padding: "5px", textAlign: "center" }}>
                    <div className="customcheckbox">
                        <FormControlLabel
                            control={ <Checkbox color="primary" />}
                            checked={CheckBox(result.itm_loc_stock_cost_flag)}
                            labelPlacement="start" 
                        />
                    </div>
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_loc_oh_qty)}
                </TableCell>


                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_loc_maximum)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_loc_pr_due_in)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_loc_due_in)}
                </TableCell>

               

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_loc_short_qty)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatDate(result.itm_loc_create_date)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatDate(result.itm_loc_lastactdate)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatDate(result.itm_loc_lastcntdate)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatDate(result.itm_loc_next_cnt_date)}
                </TableCell>

            </TableRow>

        ))

    }

    const handleRowClick = (data) => {

    }

    const handleAddButtonClick = async (e) => {

        console.log("Test",e)

        console.log("Test",JSON.stringify(inputFields))
    }

    const addInputField = (event) => {
        event.preventDefault();
        let isValid = true;
        inputFields.forEach((inputFields) => {
            if (inputFields.itm_loc_stk_loc.trim() === "" || inputFields.itm_loc_stk_loc == null) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Stock location is Required!",
                    customClass: {
                      container: "swalcontainercustom",
                    },
                });
                isValid = false;
            }
        })
        if (isValid) {

            setInputFields([
                ...inputFields,
                {
                    site_ID: site_ID,
                    mst_RowID: RowID,
                    emp_mst_login_id: emp_mst_login_id,
                    itm_loc_lockout4count: '0',
                    itm_loc_prim_locn_flg: '',
                    itm_loc_stk_loc:'',
                    itm_loc_inc_ttloh:'0',
                    itm_loc_stock_cost_flag:'0'
                },
            ]);

        }

    }

    const updatedInputFields = inputFields.map((field) => {
        return {
          ...field,
            itm_loc_lockout4count: '0',
            itm_loc_prim_locn_flg: '0',
            itm_loc_stk_loc:'',
            itm_loc_inc_ttloh:'0',
            itm_loc_stock_cost_flag:'0'
    
        };
    });
    
    const handleShow = () => {

        setShow(true);
        setInputFields(updatedInputFields)
    }

    const handleClose = () => {
        setShow(false);
        removeInputFields();
       
    };
    
    
    const findCustomizeLabel = (columnName) => {
        if (!Array.isArray(inv_loc_Label)) return "";
            const matchingColumn = inv_loc_Label.find( (item) => item.column_name === columnName );
        return matchingColumn ? matchingColumn.customize_label : "";
    
    };

    const findCustomizerequiredLabel = (columnName) => {
        const foundItem = locationMandatoryFiled.find(item => item.column_name === columnName);
        if (foundItem && foundItem.cf_label_required === "1") {
            return "Requiredlabel";
        }
        return "";
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

    const handleCancelClick = () => {
        setmodalRowDt("");
    };

    const handleEditClick = async () => {
        setmodalOpenlocation(true);
    };

    const handleCloseModal2 = () => {
        setmodalOpenlocation(false);
    };

    const onhandle_Checkbox = async ( index, value,e ) => {
       
       if(value === 'itm_loc_lockout4count'){

        const list = [...inputFields];
        list[index]["itm_loc_lockout4count"] = e ? '1' :'0';;
        setInputFields(list);

       }else if(value === 'itm_loc_prim_locn_flg'){

        const stockInInputFields = inputFields.some((field) => field.itm_loc_prim_locn_flg === '1');
        console.log("PL",stockInInputFields);
        if (stockInInputFields) {

            const matchingRow = inputFields.find((field) => field.itm_loc_prim_locn_flg === '1');
            console.log("PL2",matchingRow);
            console.log("PL3",inputFields[index].itm_loc_stk_loc);

            Swal.close();
            Swal.fire({
                title: "Do you want to change the primary location",
                text: `From: ${matchingRow.itm_loc_stk_loc} 
                \r\n To: ${inputFields[index].itm_loc_stk_loc}`,
                showDenyButton: true,
                
                confirmButtonText: "Yes",
                customClass: {
                    container: "swalcontainercustom",
                },
                denyButtonText: `No`
                
              }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  Swal.fire("Saved!", "", "success");
                } else if (result.isDenied) {
                  Swal.fire("Changes are not saved", "", "info");
                }
            });
            return false;
            

        }

        const list = [...inputFields];
        list[index]["itm_loc_prim_locn_flg"] = e ? '1' :'0';
        setInputFields(list);

       }else if(value === 'itm_loc_inc_ttloh'){

        const list = [...inputFields];
        list[index]["itm_loc_inc_ttloh"] = e ? '1' :'0';;
        setInputFields(list);

       }else if(value === 'itm_loc_stock_cost_flag'){

        const list = [...inputFields];
        list[index]["itm_loc_stock_cost_flag"] = e ? '1' :'0';;
        setInputFields(list);

       }
       
    };

    const handleRowPopupData = async ( index, rowData, secondRowData ) => {
       
       
        // Use the row data in the second component
        if (rowData !== undefined && rowData !== null) {
          setmodalRowDt(rowData);
        }
        if (secondRowData == "1") {

            const stockInInputFields = inputFields.some((field) => field.itm_loc_stk_loc === rowData);
            console.log("stockInInputFields",stockInInputFields);
            Swal.fire({
                title: "Please Wait!",
                allowOutsideClick: false,
                customClass: {
                  container: "swalcontainercustom",
                },
            });
            Swal.showLoading();
            if (stockInInputFields) {
              Swal.close();
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Duplicate Data Found Stock Location.",
                customClass: {
                  container: "swalcontainercustom",
                },
                  });
                  return false;
            }
        
            if (rowData !== undefined && rowData !== null) {

                const list = [...inputFields];
                list[index]["itm_loc_stk_loc"] = rowData;

            }
            Swal.close();
            setmodalOpenlocation(false);

        }
       
      

       
    };

    const PopupRowDataSelect = async (index) => {

    const stockInInputFields = inputFields.some((field) => field.itm_loc_stk_loc === modalRowDt);
    if (modalRowDt === "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select one option!",
        });
        } else {
        if (stockInInputFields) {
            Swal.close();
            Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Duplicate Data Found Stock Location.",
            customClass: {
                container: "swalcontainercustom",
            },
                });
                return false;
            }
        if (modalRowDt !== undefined && modalRowDt !== null) {

            const list = [...inputFields];
            list[index]["itm_loc_stk_loc"] = modalRowDt;
        
        }
        setmodalOpenlocation(false);
        }
    

    };


    const handle_PopupData = async ( index, rowData, secondRowData ) => {
       
       
        // Use the row data in the second component
        if (rowData !== undefined && rowData !== null) {
          setmodalRowDt(rowData);
        }
        if (secondRowData == "1") {

            const stockInInputFields = Result.some((field) => field.itm_loc_stk_loc === rowData);
            console.log("stockInInputFields",stockInInputFields);
            Swal.fire({
                title: "Please Wait!",
                allowOutsideClick: false,
                customClass: {
                  container: "swalcontainercustom",
                },
            });
            Swal.showLoading();
            if (stockInInputFields) {
              Swal.close();
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Duplicate Data Found Stock Location.",
                customClass: {
                  container: "swalcontainercustom",
                },
                  });
                  return false;
            }
        
            if (rowData !== undefined && rowData !== null) {

                const list = [...UpdateFields];
                list[index]["itm_loc_stk_loc"] = rowData;

            }
            Swal.close();
            setmodalOpenlocation(false);

        }
       
      

       
    };

    const Popup_DataSelect = async (index) => {

    const stockInInputFields = inputFields.some((field) => field.itm_loc_stk_loc === modalRowDt);
    if (modalRowDt === "") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please select one option!",
        });
        } else {
        if (stockInInputFields) {
            Swal.close();
            Swal.fire({
            icon: "warning",
            title: "Warning",
            text: "Duplicate Data Found Stock Location.",
            customClass: {
                container: "swalcontainercustom",
            },
                });
                return false;
            }
        if (modalRowDt !== undefined && modalRowDt !== null) {

            const list = [...inputFields];
            list[index]["itm_loc_stk_loc"] = modalRowDt;
        
        }
        setmodalOpenlocation(false);
        }
    

    };

    const handleUpdateButtonClick = async (e) =>{
        e.preventDefault();
        let isValid = true;
        UpdateFields.forEach((updatefields) => {

            if (updatefields.itm_loc_stk_loc.trim() === "" || updatefields.itm_loc_stk_loc == null) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Stock location is Required!",
                    customClass: {
                      container: "swalcontainercustom",
                    },
                });
                isValid = false;
            }

        })

        if (isValid) {

            Swal.fire({
                title: "Please Wait!",
                allowOutsideClick: false,
                customClass: {
                  container: "swalcontainercustom",
                },
            });

            

        }

    }

    return(
        <>
        <div>
            <div style={{ paddingBottom: "0px", backgroundColor: "white" }}>
                <div
                    className="template-demo"
                    style={{ display: "flex", alignItems: "center",marginBottom:10 }}>

                    <div style={{ marginLeft: "auto" }}>
                        <Button
                            type="button"
                            className="AddNewButton"
                            disabled={data.statusKey === "CLOSE"}
                            onClick={handleShow}
                        > + Add Location
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
                    <   TableBody>{renderTableRows()}</TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Dialog */}
            <div>
                <Dialog 
                    onClose={(event, reason) => {
                        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                            handleClose(event, reason);
                        }
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={show}
                    fullWidth
                >

                    <DialogTitle 
                        sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
                        id="customized-dialog-title" 
                        className="dailogTitWork" >
                        <img src={logo} style={{ width: "30px", height: "30px", marginRight: "2px" }} /> Location
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }} >
                        <Iconify icon="material-symbols:close" />
                    </IconButton>
                    <DialogContent dividers>
                        <div style={{ width: "100%", marginTop: "15px"}} >
                            <div className="row">
                                <div className="col-sm-12 WrkOdrMtb">
                                    {inputFields.map((data, index) => {
                                        const { itm_loc_lockout4count, itm_loc_prim_locn_flg, itm_loc_stk_loc, itm_loc_inc_ttloh,itm_loc_stock_cost_flag} = data;
                                        return(
                                            <div className="row my-3 tb" key={index}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography style={{ color: "#2196f3", textDecoration: "underline", fontWeight: 600, fontSize: 16, }} >
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


                                                {/* Lockout for Count */}
                                                <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                                    <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                        <label className={findCustomizerequiredLabel("itm_loc_lockout4count")}> 
                                                            {findCustomizeLabel("itm_loc_lockout4count") || "Lockout for Count"}
                                                        </label>
                                                    </Grid>
                                                    <Grid item xs={12} md={0.8}>
                                                        <div className="customlayoutchk">
                                                            <FormControlLabel
                                                                control={ <Checkbox color="primary" />}
                                                                checked={itm_loc_lockout4count === '1' ? true : false}
                                                                onChange={(e) => {onhandle_Checkbox(index,'itm_loc_lockout4count',e.target.checked)}}
                                                                labelPlacement="start" 
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                                {/* Primary Location */}
                                                <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                                    <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                        <label className={findCustomizerequiredLabel("itm_loc_prim_locn_flg")}> 
                                                            {findCustomizeLabel("itm_loc_prim_locn_flg") || "Primary Location"}
                                                        </label>
                                                    </Grid>
                                                    <Grid item xs={12} md={0.8}>
                                                        <div className="customlayoutchk">
                                                            <FormControlLabel
                                                                control={ <Checkbox color="primary" />}
                                                                checked={itm_loc_prim_locn_flg === '1' ? true : false}
                                                                onChange={(e) => {onhandle_Checkbox(index,'itm_loc_prim_locn_flg',e.target.checked)}}
                                                                labelPlacement="start" 
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                                {/* Stock Location */}
                                                <Grid container spacing={1.5} className="timeCartPopuplabel">
                                                    <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                        <label className={findCustomizerequiredLabel("itm_loc_stk_loc") || "Requiredlabel"}> 
                                                            {findCustomizeLabel("itm_loc_stk_loc") || "Stock Location"}
                                                        </label>
                                                    </Grid>

                                                    <Grid item xs={12} md={8}>
                                                        <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                            <CustomTextField
                                                                id="outlined-basic"
                                                                variant="outlined"
                                                                size="small"
                                                                className="ExtrasizeDisable"
                                                                fullWidth
                                                                value={ data.itm_loc_stk_loc != "" ? data.itm_loc_stk_loc : "" }
                                                                disabled={data.itm_loc_stk_loc !== ""}
                                                                placeholder="Select..."
                                                                style={{ color: "#000" }}
                                                                rightIcons={[
                                                                    <Iconify
                                                                        icon="material-symbols:close"
                                                                        className="hoverIconBtn"
                                                                        onClick={handleCancelClick}
                                                                    />,
                                                                    <Iconify
                                                                        icon="tabler:edit"
                                                                        onClick={handleEditClick}
                                                                    />,
                                                                ]}
                                                            />
                                                        </div>
                                                    </Grid>

                                                    {/* Model stock Loaction  */}
                                                    <Dialog
                                                        onClose={handleCloseModal2}
                                                        aria-labelledby="customized-dialog-title"
                                                        open={modalOpenlocation}
                                                        maxWidth="lg"
                                                        fullWidth
                                                        disableBackdropClick
                                                        sx={{ width: "100vw", marginLeft: "auto", marginRight: "auto", marginTop: "20px", }}
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
                                                                style={{ fontSize: "24px", marginRight: "5px" }} 
                                                            />
                                                                <div> Stock Location</div> {/* Title */}
                                                        </DialogTitle>
                                                        <IconButton
                                                            aria-label="close"
                                                            onClick={handleCloseModal2}
                                                            sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
                                                        >
                                                            <Iconify icon="material-symbols:close" />
                                                        </IconButton>
                                                        
                                                        <DialogContent dividers>
                                                            <div style={{ width: "100%", marginTop: "15px", }} >
                                                                <StockLoactionPopupData
                                                                    onRowClick={( rowData, secondRowData ) =>
                                                                        handleRowPopupData( index, rowData, secondRowData )
                                                                    }
                                                                />
                                                            </div>
                                                        </DialogContent>

                                                        <DialogActions
                                                            style={{ display: "flex", justifyContent: "space-between", padding: "10px", }}
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
                                                                        PopupRowDataSelect(index);
                                                                    }}
                                                                    style={{ marginLeft: "5px" }}
                                                                >
                                                                    Select
                                                                </Button>
                                                            </div>
                                                        </DialogActions>
                                                    </Dialog>
                                                </Grid>

                                                {/* Increase Total OH */}
                                                <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                                    <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                        <label className={findCustomizerequiredLabel("itm_loc_inc_ttloh")}> 
                                                            {findCustomizeLabel("itm_loc_inc_ttloh") || "Increase Total OH"}
                                                        </label>
                                                    </Grid>
                                                    <Grid item xs={12} md={0.8}>
                                                        <div className="customlayoutchk">
                                                            <FormControlLabel
                                                                control={ <Checkbox color="primary" />}
                                                                checked={itm_loc_inc_ttloh === '1' ? true : false}
                                                                onChange={(e) => {onhandle_Checkbox(index,'itm_loc_inc_ttloh',e.target.checked)}}
                                                                labelPlacement="start" 
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                                {/* Update Stock Costing */}
                                                <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                                    <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                        <label className={findCustomizerequiredLabel("itm_loc_stock_cost_flag")}> 
                                                            {findCustomizeLabel("itm_loc_stock_cost_flag") || "Update Stock Costing"}
                                                        </label>
                                                    </Grid>
                                                    <Grid item xs={12} md={0.8}>
                                                        <div className="customlayoutchk">
                                                            <FormControlLabel
                                                                control={ <Checkbox color="primary" />}
                                                                checked={itm_loc_stock_cost_flag === '1' ? true : false}
                                                                onChange={(e) => {onhandle_Checkbox(index,'itm_loc_stock_cost_flag',e.target.checked)}}
                                                                labelPlacement="start" 
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions
                        style={{ display: "flex", justifyContent: "space-between", padding: "10px" }} >
                        <Button
                            variant="soft"
                            color="error"
                            className="CloseButton"
                            startIcon={<Iconify icon="jam:close" />}
                            onClick={(e) => { e.preventDefault(); handleClose(); }}>
                            Close
                        </Button>

                        <div className="timeCartSubmit" style={{ display: "flex", alignItems: "center" }}>
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
                            style={{ backgroundColor: "#4CAF50", color: "white", marginRight: "10px", }}
                            onClick={handleAddButtonClick}>
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
                <img src={logo} style={{ width: "30px", height: "30px", marginRight: "2px" }} /> Update Location
            </DialogTitle>

            <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
            >
                <Iconify icon="material-symbols:close" />
            </IconButton>
            <DialogContent dividers>
                <div style={{ width: "100%", marginTop: "15px" }} >
                    <div className="row">
                        <div className="col-sm-12 WrkOdrMtb">
                           
                            {UpdateFields.map((data, index) => {
                                const { itm_loc_lockout4count, itm_loc_prim_locn_flg, itm_loc_stk_loc, itm_loc_inc_ttloh,itm_loc_stock_cost_flag,Rowcount} = data;
                                return(
                                    <div className="row my-3 tb" key={index}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography style={{ color: "#2196f3", textDecoration: "underline", fontWeight: 600, fontSize: 16, }} >
                                                    Line {Rowcount + 1}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ textAlign: "right" }}>
                                            </Grid>
                                        </Grid>


                                        {/* Lockout for Count */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_loc_lockout4count")}> 
                                                    {findCustomizeLabel("itm_loc_lockout4count") || "Lockout for Count"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={0.8}>
                                                <div className="customlayoutchk">
                                                    <FormControlLabel
                                                        control={ <Checkbox color="primary" />}
                                                        checked={itm_loc_lockout4count === '0' ? false : true}
                                                        labelPlacement="start" 
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Primary Location */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_loc_prim_locn_flg")}> 
                                                    {findCustomizeLabel("itm_loc_prim_locn_flg") || "Primary Location"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={0.8}>
                                                <div className="customlayoutchk">
                                                    <FormControlLabel
                                                        control={ <Checkbox color="primary" />}
                                                        checked={itm_loc_prim_locn_flg === '0' ? false : true}
                                                        labelPlacement="start" 
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Stock Location */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel">
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_loc_stk_loc") || "Requiredlabel"}> 
                                                    {findCustomizeLabel("itm_loc_stk_loc") || "Stock Location"}
                                                </label>
                                            </Grid>

                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <CustomTextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        className="ExtrasizeDisable"
                                                        fullWidth
                                                        value={ data.itm_loc_stk_loc != "" ? data.itm_loc_stk_loc : "" }
                                                        disabled={data.itm_loc_stk_loc !== ""}
                                                        placeholder="Select..."
                                                        style={{ color: "#000" }}
                                                        rightIcons={[
                                                            <Iconify
                                                                icon="material-symbols:close"
                                                                className="hoverIconBtn"
                                                                onClick={handleCancelClick}
                                                            />,
                                                            <Iconify
                                                                icon="tabler:edit"
                                                                onClick={handleEditClick}
                                                            />,
                                                        ]}
                                                    />
                                                </div>
                                            </Grid>

                                            {/* Model stock Loaction  */}
                                            <Dialog
                                                onClose={handleCloseModal2}
                                                aria-labelledby="customized-dialog-title"
                                                open={modalOpenlocation}
                                                maxWidth="lg"
                                                fullWidth
                                                disableBackdropClick
                                                sx={{ width: "100vw", marginLeft: "auto", marginRight: "auto", marginTop: "20px", }}
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
                                                        style={{ fontSize: "24px", marginRight: "5px" }} 
                                                    />
                                                        <div> Stock Location</div> {/* Title */}
                                                </DialogTitle>
                                                <IconButton
                                                    aria-label="close"
                                                    onClick={handleCloseModal2}
                                                    sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
                                                >
                                                    <Iconify icon="material-symbols:close" />
                                                </IconButton>
                                                
                                                <DialogContent dividers>
                                                    <div style={{ width: "100%", marginTop: "15px", }} >
                                                        <StockLoactionPopupData
                                                            onRowClick={( rowData, secondRowData ) =>
                                                                handle_PopupData( index, rowData, secondRowData )
                                                            }
                                                        />
                                                    </div>
                                                </DialogContent>

                                                <DialogActions
                                                    style={{ display: "flex", justifyContent: "space-between", padding: "10px", }}
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
                                                                PopupRowDataSelect(index);
                                                            }}
                                                            style={{ marginLeft: "5px" }}
                                                        >
                                                            Select
                                                        </Button>
                                                    </div>
                                                </DialogActions>
                                            </Dialog>
                                        </Grid>

                                        {/* Increase Total OH */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_loc_inc_ttloh")}> 
                                                    {findCustomizeLabel("itm_loc_inc_ttloh") || "Increase Total OH"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={0.8}>
                                                <div className="customlayoutchk">
                                                    <FormControlLabel
                                                        control={ <Checkbox color="primary" />}
                                                        checked={itm_loc_inc_ttloh === '0' ? false : true}
                                                        labelPlacement="start" 
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Update Stock Costing */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_loc_stock_cost_flag")}> 
                                                    {findCustomizeLabel("itm_loc_stock_cost_flag") || "Update Stock Costing"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={0.8}>
                                                <div className="customlayoutchk">
                                                    <FormControlLabel
                                                        control={ <Checkbox color="primary" />}
                                                        checked={itm_loc_stock_cost_flag === '0' ? false : true}
                                                        labelPlacement="start" 
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                    </div>
                                )
                            })}
                           
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions
                style={{ display: "flex", justifyContent: "space-between", padding: "10px", }}
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
                        style={{ backgroundColor: "#4CAF50", color: "white", marginRight: "10px", }}
                        onClick={handleUpdateButtonClick}
                    >
                    Save
                    </Button>
                </div>
            </DialogActions>
        </BootstrapDialog>
        </>
    )

}

export default Inventory_location;