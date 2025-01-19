import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, } from "@mui/material";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Iconify from "src/components/iconify";
import logo from "../../../../../assets//img/toolkit.png";
import httpCommon from "src/http-common";
import { Menu, MenuItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import {  DatePicker as AntDatePicker } from 'antd';
import dayjs from 'dayjs';
import SupplierPopupData from "src/sections/Inventory/InventoryMaster/component_module/Popup/SupplierPopupData";
import TaxCodePopupData from "src/sections/Inventory/InventoryMaster/component_module/Popup/TaxCodePopupData";
import ManufacturerPopupData from "src/sections/Inventory/InventoryMaster/component_module/Popup/ManufacturerPopupData";
import UOMPopupData from "src/sections/Inventory/InventoryMaster/component_module/Popup/UOMPopupData";


const Inventory_Supplier = ({data}) =>{

    let site_ID = localStorage.getItem("site_ID");
    let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

    const location = useLocation();

    const [RowID, setRowID] = useState(data.RowID);
    const [Header, setHeader] = React.useState([]);
    const [Result, setResult] = React.useState([]);

    const [inv_sup_Label, setinv_sup_Label] = useState([]);
    const [SupplierMandatoryFiled, setSupplierMandatoryFiled] = useState([]);
    const [modalOpenSupplier, setmodalOpenSupplier] = useState(false);
    const [modalRowDt, setmodalRowDt] = useState("");


    const [modalOpenTaxcode, setmodalOpenTaxcode] = useState(false);
    const [modalOpenManufacturer, setmodalOpenManufacturer] = useState(false);
    const [modalOpenUOM, setmodalOpenUOM] = useState(false);

    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [UpdateFields, setUpdateFields] = useState([])

    const [anchorEl, setAnchorEl] = useState(null);
    const [menuRowIndex, setMenuRowIndex] = useState(null);


    // Add New Row button click
    const [inputFields, setInputFields] = useState([
        {
            site_ID: site_ID,
            mst_RowID: RowID,
            emp_mst_login_id: emp_mst_login_id,
            itm_sup_mfgrank: '',
            itm_sup_supplier: '',
            itm_sup_tax_cd:'',
            itm_sup_supplier_partno:'',
            itm_sup_partmfg:'',
            itm_sup_file_name:'',
            itm_sup_last_itemcost:'',
            itm_sup_retail_price:'',
            itm_sup_last_rcvd_date:'',
            itm_sup_order_uom:'',
            itm_sup_min_orderqty:'',
            itm_sup_rcpts_ctr:'',
            itm_sup_discount_pct:'',
        },
    ]);

    

    useEffect(() => {
        get_inventory_master_supplier(site_ID, RowID);
       
    }, [location]);

    // First Api
    const get_inventory_master_supplier = async (site_ID, RowID) => {
        Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
            container: "swalcontainercustom",
        },
        });
        Swal.showLoading();
        try {
            const response = await httpCommon.get( `/get_inventory_master_supplier.php?site_cd=${site_ID}&RowID=${RowID}` );
             console.log("response____material___", response);
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
                itm_sup_mfgrank: item.itm_sup_mfgrank,
                itm_sup_supplier: item.itm_sup_supplier,
                itm_sup_tax_cd:item.itm_sup_tax_cd,
                itm_sup_supplier_partno:item.itm_sup_supplier_partno,
                itm_sup_partmfg:item.itm_sup_partmfg,
                itm_sup_file_name:item.itm_sup_file_name,
                itm_sup_last_itemcost:item.itm_sup_last_itemcost,
                itm_sup_retail_price:item.itm_sup_retail_price,
                itm_sup_last_rcvd_date:item.itm_sup_last_rcvd_date,
                itm_sup_order_uom:item.itm_sup_order_uom,
                itm_sup_min_orderqty:item.itm_sup_min_orderqty,
                itm_sup_rcpts_ctr:item.itm_sup_rcpts_ctr,
                itm_sup_discount_pct:item.itm_sup_discount_pct,

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

                        <MenuItem 
                        onClick={(event) => { 
                            event.stopPropagation(); 
                            handleDelete(result, event); 
                        }}>
                            <Iconify icon="solar:arrow-up-bold" width="15px" height="20px" marginRight="5px"/> Move Up</MenuItem>

                        <MenuItem 
                        onClick={(event) => { 
                            event.stopPropagation(); 
                            handleDelete(result, event); 
                        }}>
                            <Iconify icon="solar:arrow-down-bold" width="15px" height="20px" marginRight="5px"/> Move Down</MenuItem>
                    </Menu>
                </TableCell>

                
                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {result.itm_sup_mfgrank}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {result.itm_sup_supplier}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {result.itm_sup_tax_cd}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {result.itm_sup_supplier_partno}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {result.itm_sup_partmfg}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {result.itm_sup_file_name}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_last_itemcost)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_retail_price)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatDate(result.itm_sup_last_rcvd_date)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {result.itm_sup_order_uom}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_min_orderqty)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_rcpts_ctr)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_discount_pct)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_ord_qty)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_rcv_qty)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_late_qty)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_high_qty)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_di)}
                </TableCell>

                <TableCell style={{ padding: "5px", textAlign: "center" }}>
                    {formatFloat(result.itm_sup_ci)}
                </TableCell>




            </TableRow>
        ))
    }

    const handleRowClick = (data) => {

    }

    const handleAddButtonClick = async (e) => {

    }

    const addInputField = (event) => {

        event.preventDefault();
        let isValid = true;
        inputFields.forEach((inputFields) => {
            if (inputFields.itm_sup_supplier.trim() === "" || inputFields.itm_sup_supplier == null) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Supplier is Required!",
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
                    itm_sup_mfgrank: '',
                    itm_sup_supplier: '',
                    itm_sup_tax_cd:'',
                    itm_sup_supplier_partno:'',
                    itm_sup_partmfg:'',
                    itm_sup_file_name:'',
                    itm_sup_last_itemcost:'',
                    itm_sup_retail_price:'',
                    itm_sup_last_rcvd_date:'',
                    itm_sup_order_uom:'',
                    itm_sup_min_orderqty:'',
                    itm_sup_rcpts_ctr:'',
                    itm_sup_discount_pct:'',
                },
            ]);

        }
    }
    
    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
       
    };

    const findCustomizeLabel = (columnName) => {
        if (!Array.isArray(inv_sup_Label)) return "";
            const matchingColumn = inv_sup_Label.find( (item) => item.column_name === columnName );
        return matchingColumn ? matchingColumn.customize_label : "";
    
    };

    const findCustomizerequiredLabel = (columnName) => {
        const foundItem = SupplierMandatoryFiled.find(item => item.column_name === columnName);
        if (foundItem && foundItem.cf_label_required === "1") {
            return "Requiredlabel";
        }
        return "";
    };

    const removeInputFields = (index) => {

    }


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


    // Supplier Modal 01
    const Supplier_handleClose = () => {
        setmodalOpenSupplier(false);
    };

    const handleCancelClick = () => {
        setmodalRowDt("");
    };

    const handleEditClick = async () => {
        setmodalOpenSupplier(true);
    };


    const handleRowPopupData = async ( index, rowData, secondRowData ) => {
       
        // Use the row data in the second component
        if (rowData !== undefined && rowData !== null) {
          setmodalRowDt(rowData.sup_mst_supplier_cd);
        }
        if (secondRowData == "1") {

            const stockInInputFields = inputFields.some((field) => field.itm_sup_supplier === rowData.sup_mst_supplier_cd);
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
                text: "Duplicate Data Found Supplier.",
                customClass: {
                  container: "swalcontainercustom",
                },
                  });
                  return false;
            }
        
            if (rowData !== undefined && rowData !== null) {

                const list = [...inputFields];
                list[index]["itm_sup_supplier"] = rowData.sup_mst_supplier_cd;



            }
            Swal.close();
            setmodalOpenSupplier(false);

        }
       
      

       
    };

    const PopupRowDataSelect = async (index) => {

        console.log('modalRowDt',modalRowDt);

        const stockInInputFields = inputFields.some((field) => field.sup_mst_supplier_cd === modalRowDt);

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
                text: "Duplicate Data Found Stock Supplier.",
                customClass: {
                    container: "swalcontainercustom",
                },
                    });
                    return false;
                }
            if (modalRowDt !== undefined && modalRowDt !== null) {
    
                const list = [...inputFields];
                list[index]["itm_sup_supplier"] = modalRowDt;
            
            }
            setmodalOpenSupplier(false);
        }
        
    
    };


    const handleNumericInputChange = (index, rowData, e) => {


        console.log('index',index)

        console.log('rowData',rowData)

        console.log('e',e)
        
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
            const formattedValue2 = decimalPart2 ? `${integerPart2}.${decimalPart2}` : integerPart2
            console.log('formattedValue2',formattedValue2)
           
            return; 
        }
        const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
        console.log('formattedValue',formattedValue)
       
            
        
        
    }


    // TaxCode Modal 01
    const Tax_handleClose = () => {
        setmodalOpenTaxcode(false);
    };

    const Taxcode_handleCancelClick = () => {
        setmodalRowDt("");
    };

    const Taxcode_handleEditClick = async () => {
        setmodalOpenTaxcode(true);
    };

    const Taxcode_handleRowPopupData = async ( index, rowData, secondRowData ) => {
       
        // Use the row data in the second component

        console.log('rowData',rowData)
        if (rowData !== undefined && rowData !== null) {
          setmodalRowDt(rowData);
        }
        if (secondRowData == "1") {

            
        
            if (rowData !== undefined && rowData !== null) {

                const list = [...inputFields];
                list[index]["itm_sup_tax_cd"] = rowData;



            }
            Swal.close();
            setmodalOpenTaxcode(false);

        }
       
      

       
    };

    const Taxcode_PopupRowDataSelect = async (index) => {

        console.log('modalRowDt',modalRowDt);

        const stockInInputFields = inputFields.some((field) => field.sup_mst_supplier_cd === modalRowDt);

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
                text: "Duplicate Data Found Stock Supplier.",
                customClass: {
                    container: "swalcontainercustom",
                },
                    });
                    return false;
                }
            if (modalRowDt !== undefined && modalRowDt !== null) {
    
                const list = [...inputFields];
                list[index]["itm_sup_supplier"] = modalRowDt;
            
            }
            setmodalOpenSupplier(false);
        }
        
    
    };


    // TaxCode Modal 01
    const Manufacturer_handleClose = () => {
        setmodalOpenManufacturer(false);
    };

    const Manufacturer_handleCancelClick = () => {
        setmodalRowDt("");
    };

    const Manufacturer_handleEditClick = async () => {
        setmodalOpenManufacturer(true);
    };


    // TaxCode Modal 01
    const UOM_handleClose = () => {
        setmodalOpenUOM(false);
    };

    const UOM_handleCancelClick = () => {
        setmodalRowDt("");
    };

    const UOM_handleEditClick = async () => {
        setmodalOpenUOM(true);
    };



    const TextField_onChange = async (index, value,e) => {


        console.log('e',e);

        if(value === 'itm_sup_supplier_partno'){

            const list = [...inputFields];
            list[index]["itm_sup_supplier_partno"] = e;
            setInputFields(list);

        }
    };

    

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
                        > + Add Supplier
                        </Button>
                    
                    </div>

                    
                    
                </div>
            </div>
            <div className="table-responsive"
             style={{ marginBottom:10 }}>
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
                maxWidth="sm"
                fullWidth>

                <DialogTitle 
                    sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
                    id="customized-dialog-title" 
                    className="dailogTitWork" >

                    <img src={logo} style={{ width: "30px", height: "30px", marginRight: "2px" }} /> Supplier

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

                                        {/* Supplier */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier") || "Requiredlabel"}> 
                                                    {findCustomizeLabel("itm_sup_supplier") || "Supplier"}
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
                                                        value={ data.itm_sup_supplier != "" ? data.itm_sup_supplier : "" }
                                                        disabled={data.itm_sup_supplier !== ""}
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

                                            {/* Supplier Pop_up */}
                                            <Dialog
                                                onClose={Supplier_handleClose}
                                                aria-labelledby="customized-dialog-title"
                                                open={modalOpenSupplier}
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
                                                        style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
                                                    />
                                                    <div> Supplier</div> {/* Title */}
                                                </DialogTitle>

                                                <IconButton
                                                    aria-label="close"
                                                    onClick={Supplier_handleClose}
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
                                                    <div style={{ width: "100%", marginTop: "15px", }} >
                                                    <SupplierPopupData
                                                        onRowClick={( rowData, RowDescp, secondRowData ) =>
                                                            handleRowPopupData( index, rowData, RowDescp, secondRowData )
                                                        }
                                                    />
                                                    </div>
                                                </DialogContent>
                                                <DialogActions style={{ display: "flex", justifyContent: "space-between", padding: "10px", }} >
                                    
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
                                                            Supplier_handleClose();
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

                                        {/* Tax Code */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_tax_cd")}> 
                                                    {findCustomizeLabel("itm_sup_tax_cd") || "Tax Code"}
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
                                                        value={ data.itm_sup_tax_cd != "" ? data.itm_sup_tax_cd : "" }
                                                        disabled={data.itm_sup_tax_cd !== ""}
                                                        placeholder="Select..."
                                                        style={{ color: "#000" }}
                                                        rightIcons={[
                                                        <Iconify
                                                            icon="material-symbols:close"
                                                            className="hoverIconBtn"
                                                            onClick={Taxcode_handleCancelClick}
                                                        />,
                                                        <Iconify
                                                            icon="tabler:edit"
                                                            onClick={Taxcode_handleEditClick}
                                                        />,
                                                        ]}
                                                    />
                                                </div>
                                            </Grid>
                                            {/* Supplier */}
                                            <Dialog
                                                onClose={Tax_handleClose}
                                                aria-labelledby="customized-dialog-title"
                                                open={modalOpenTaxcode}
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
                                                        style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
                                                    />
                                                    <div> Tax Code</div> {/* Title */}
                                                </DialogTitle>

                                                <IconButton
                                                    aria-label="close"
                                                    onClick={Tax_handleClose}
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
                                                    <div style={{ width: "100%", marginTop: "15px", }} >
                                                    <TaxCodePopupData
                                                        onRowClick={( rowData, RowDescp, secondRowData ) =>
                                                            Taxcode_handleRowPopupData( index, rowData, RowDescp, secondRowData )
                                                        }
                                                    />
                                                    </div>
                                                </DialogContent>

                                            </Dialog>
                                        </Grid>

                                        {/* Supplier Part No */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier_partno")}> 
                                                    {findCustomizeLabel("itm_sup_supplier_partno") || "Supplier Part No"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <TextField
                                                        id="outlined-basic"
                                                        size="small"
                                                        placeholder="0"
                                                        variant="outlined"
                                                        value={data.itm_sup_supplier_partno}
                                                        onChange={(e) => { const value = e.target.value; 
                                                            if (value.length <= 25) 
                                                            {
                                                                TextField_onChange(index,'itm_sup_supplier_partno',e.target.value)
                                                            } 
                                                    }}
                                                        
                                                        fullWidth
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Manufacturer */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_partmfg")}> 
                                                    {findCustomizeLabel("itm_sup_partmfg") || "Manufacturer"}
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
                                                        value={ data.itm_sup_partmfg != "" ? data.itm_sup_partmfg : "" }
                                                        disabled={data.itm_sup_partmfg !== ""}
                                                        placeholder="Select..."
                                                        style={{ color: "#000" }}
                                                        rightIcons={[
                                                        <Iconify
                                                            icon="material-symbols:close"
                                                            className="hoverIconBtn"
                                                            onClick={Manufacturer_handleCancelClick}
                                                        />,
                                                        <Iconify
                                                            icon="tabler:edit"
                                                            onClick={Manufacturer_handleEditClick}
                                                        />,
                                                        ]}
                                                    />
                                                </div>
                                            </Grid>
                                            {/* Manufacturer */}
                                            <Dialog
                                                onClose={Manufacturer_handleClose}
                                                aria-labelledby="customized-dialog-title"
                                                open={modalOpenManufacturer}
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
                                                        style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
                                                    />
                                                    <div> Tax Code</div> {/* Title */}
                                                </DialogTitle>

                                                <IconButton
                                                    aria-label="close"
                                                    onClick={Manufacturer_handleClose}
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
                                                    <div style={{ width: "100%", marginTop: "15px", }} >
                                                    <ManufacturerPopupData
                                                        onRowClick={( rowData, RowDescp, secondRowData ) =>
                                                            handleRowPopupData( index, rowData, RowDescp, secondRowData )
                                                        }
                                                    />
                                                    </div>
                                                </DialogContent>

                                            </Dialog>
                                        </Grid>

                                        {/* Last Quotation */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_file_name")}> 
                                                    {findCustomizeLabel("itm_sup_file_name") || "Last Quotation"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <TextField
                                                        id="outlined-basic"
                                                        size="small"
                                                        variant="outlined"
                                                        placeholder="0.0000"
                                                        value={data.itm_sup_file_name}
                                                        onChange={(e) => { handleNumericInputChange(index,'itm_sup_supplier_partno',e); }}
                                                        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                        fullWidth
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Last Item Cost */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier")}> 
                                                    {findCustomizeLabel("itm_sup_supplier") || "Last Item Cost"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="0.0000"
                                                        value={data.itm_sup_last_itemcost}
                                                        //onChange={(e) => { handleNumericInputChange(e, ''); }}
                                                        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                        fullWidth
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Retail Price */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier")}> 
                                                    {findCustomizeLabel("itm_sup_supplier") || "Retail Price"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="0.0000"
                                                        value={data.itm_sup_last_itemcost}
                                                        //onChange={(e) => { handleNumericInputChange(e, ''); }}
                                                        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                        fullWidth
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* last Recieve Date */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier")}> 
                                                    {findCustomizeLabel("itm_sup_supplier") || "last Recieve Date"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <AntDatePicker
                                                        value={data.itm_sup_last_rcvd_date ? dayjs(data.itm_sup_last_rcvd_date) : null}
                                                        format="DD/MM/YYYY HH:mm" 
                                                        placeholder="DD/MM/YYYY HH:mm"
                                                        showTime
                                                        allowClear={false}
                                                        onChange={(newDate) => {
                                                        if (newDate && newDate.isValid()) {
                                                            const nativeDate = newDate.toDate(); 
                                                            //setUDFDateTime_2(nativeDate);
                                                        } else {
                                                            //setUDFDateTime_2(null);
                                                        }
                                                       
                                                        
                                                        }}
                                                    
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* "Order UOM */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier")}> 
                                                    {findCustomizeLabel("itm_sup_supplier") || "Order UOM"}
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
                                                        value={ data.itm_sup_supplier != "" ? data.itm_sup_supplier : "" }
                                                        disabled={data.itm_sup_supplier !== ""}
                                                        placeholder="Select..."
                                                        style={{ color: "#000" }}
                                                        rightIcons={[
                                                        <Iconify
                                                            icon="material-symbols:close"
                                                            className="hoverIconBtn"
                                                            onClick={UOM_handleCancelClick}
                                                        />,
                                                        <Iconify
                                                            icon="tabler:edit"
                                                            onClick={UOM_handleEditClick}
                                                        />,
                                                        ]}
                                                    />
                                                </div>
                                            </Grid>
                                            {/* UOM */}
                                            <Dialog
                                                onClose={UOM_handleClose}
                                                aria-labelledby="customized-dialog-title"
                                                open={modalOpenUOM}
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
                                                        style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
                                                    />
                                                    <div> Tax Code</div> {/* Title */}
                                                </DialogTitle>

                                                <IconButton
                                                    aria-label="close"
                                                    onClick={UOM_handleClose}
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
                                                    <div style={{ width: "100%", marginTop: "15px", }} >
                                                    <UOMPopupData
                                                        onRowClick={( rowData, RowDescp, secondRowData ) =>
                                                            handleRowPopupData( index, rowData, RowDescp, secondRowData )
                                                        }
                                                    />
                                                    </div>
                                                </DialogContent>

                                            </Dialog>
                                        </Grid>

                                        {/* Minimum Order Qty */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier")}> 
                                                    {findCustomizeLabel("itm_sup_supplier") || "Minimum Order Qty"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="0.0000"
                                                        value={data.itm_sup_last_itemcost}
                                                        //onChange={(e) => { handleNumericInputChange(e, ''); }}
                                                        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                        fullWidth
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Multiplier Quantity */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier")}> 
                                                    {findCustomizeLabel("itm_sup_supplier") || "Multiplier Quantity"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="0.0000"
                                                        value={data.itm_sup_last_itemcost}
                                                        //onChange={(e) => { handleNumericInputChange(e, ''); }}
                                                        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                        fullWidth
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>

                                        {/* Discount */}
                                        <Grid container spacing={1.5} className="timeCartPopuplabel" >
                                            <Grid item xs={12} md={4} style={{ padding: "10px" }} >
                                                <label className={findCustomizerequiredLabel("itm_sup_supplier")}> 
                                                    {findCustomizeLabel("itm_sup_supplier") || "Discount"}
                                                </label>
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <div style={{ flexGrow: 1 }} className="hoverContainerIconBtn">
                                                    <TextField
                                                        id="outlined-basic"
                                                        variant="outlined"
                                                        size="small"
                                                        placeholder="0.0000"
                                                        value={data.itm_sup_last_itemcost}
                                                        //onChange={(e) => { handleNumericInputChange(e, ''); }}
                                                        InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                                                        fullWidth
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
        </>
    )

}
export default Inventory_Supplier;