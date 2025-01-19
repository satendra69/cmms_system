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
import Autocomplete from "@mui/material/Autocomplete";

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
import CurrencyCodeData from "./CurrencyCodePopupData"
import TaxCodeData from "./TaxCodePopupData"
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
const PR_Line = ({ onRowClick, data ,onDataFromSecondComponent}) => {
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
  const [modalOpenCurrencyCode, setModalOpenCurrencyCode] = useState(false);
  const [modalOpenTaxCode, setModalOpenTaxCode] = useState(false);
  const [modalRowDt, setmodalRowDt] = useState("");

 
  const [PRLineMstLabel, setPRLineMstLabel] = useState([]);
  const [MRLineMandatoryFiled, setMRLineMandatoryFiled] = useState([]);
 
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowIndex, setMenuRowIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const autocompleteRef = useRef(null);
  const [isAssetShortDescEmpty,setIsAssetShortDescEmpty] = useState(false);
  const [Charge_Cost_Center, setCharge_Cost_Center] = useState([]);
  const [selected_Charge_Cost_Center, setSelected_Charge_Cost_Center] =
    useState([]);

    const [Supplier_List, setSupplier_List] = useState([]);
    const [selected_Supplier_List, setSelected_Supplier_List] = useState([]);

    const [Order_UoM, setOrder_UoM] = useState([]);
    const [selected_Order_UoM, setSelected_Order_UoM] = useState([]);

    const [Charge_Account, setCharge_Account] = useState([]);
    const [selected_Charge_Account, setSelected_Charge_Account] = useState([]);

    const [Project_id, setProject_id] = useState([]);
    const [selected_Project_id, setSelected_Project_id] = useState([]);

    const [EditItemCategory,setEditItemCategory] = useState([]);
    const [EditSupplierList,setEditSupplierList] = useState([]);
    const [EditSupplierName, setEditSupplierName] = useState("");
    const [EditRecSupplier,setEditRecSupplier] = useState("");
    const [EditLastItemCost,setEditLastItemCost] = useState("");
    const [EditDescription,setEditDescription] = useState("");
    
    const [EditOrderQty,setEditOrderQty] = useState("");
    const [EditRetailPrice,setEditRetailPrice] = useState("");
    const [EditItemCost,setEditItemCost] = useState("");
    const [EditCurrencyCode,setEditCurrencyCode] = useState("");
    const [EditCurrencyRate,setEditCurrencyRate] = useState("");
    const [EditTaxCode,setEditTaxCode] = useState("");
    const [EditTotal,setEditTotal] = useState("");
    const [EditTaxRate,setEditTaxRate] = useState("");
    const [EditTaxValue,setEditTaxValue] = useState("");
    const [EditCostCenter,setEditCostCenter] = useState("");
    const [EditChargeAccount,setEditChargeAccount] = useState("");
    const [EditPONo,setEditPONo] = useState("");
    const [EditPOLineNo,setEditPOLineNo] = useState("");
    const [EditContractId,setEditContractId] = useState("");
    const [EditWoNo,setEditWoNo] = useState("");
    const [QuotationNo,setQuotationNo] = useState("");
    const [EditIndexNo,setEditIndexNo] = useState("");
    const [EditStatus,setEditStatus] = useState("");


    const handleCloseModal = () => {
      setShowModal(false);
      setEditStatus("");
      setEditIndexNo("");
    }

  {/* Satya added new state  */}
  const [stockType, setStockType] = useState({
    "Stock": "Stock",
    "Non Stock": "Non Stock"
  });

  const [selectedValue, setSelectedValue] = useState({ value: "Stock", label: "Stock" });

  const [selected_Item_Category, setSelected_Item_Category] = useState([]);

    // Convert the object to an array of objects for Autocomplete
    const optionsStock = Object.keys(stockType).map(key => ({
      label: `${key}`,  // Concatenate key and value for the label
      value: key,  // Use the key as the value
    }));

  // Set the default value (in this case "ad": "add")
  const defaultValue = optionsStock.find(option => option.value === "Stock");
  

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
      get_Pr_Line_Data(site_ID,RowID);
    }
    get_pr_header(site_ID); 
    fetchStatusData(site_ID);
    getPrFromLebel();
    getPrMandatoryfiled();
  }, [location]);
  // First Api
  const get_pr_header = async (site_ID) => {
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
        `/get_pr_line_header.php?site_cd=${site_ID}`
      );
      // console.log("response_____PR LIne___", response);
      if (response.data.status === "SUCCESS") {
        let updatedHeader = {};
        const newKeys = {
          "SupplierName": "Supplier Name",
        };
        const newKeys2 = {
          "Total": "Total",
        };

        // Insert new keys after "Item Category"
        for (const [key, value] of Object.entries(response.data.data.header)) {
          updatedHeader[key] = value;

          if (key === "Supplier") {
            Object.assign(updatedHeader, newKeys); // Add new keys
          }
          if (key === "Tax Code") {
            Object.assign(updatedHeader, newKeys2); // Add new keys
          }
        }

        // Update the state
        setHeader(updatedHeader);
     //   setHeader(response.data.data.header);
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
  const get_Pr_Line_Data = async (site_ID, RowID) => {
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
         `/get_pr_line_data.php?site_cd=${site_ID}&RowID=${RowID}`
      );
  
       if (response.data.status === "SUCCESS" && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map((item,index) => ({
          site_ID: site_ID,
          index: index + 1,
          mst_RowID: item.RowID,
          emp_mst_login_id: emp_mst_login_id,
          mtr_ls1_mtr_lineno:item.pur_ls1_pr_lineno,
          setItemCategory: item.pur_ls1_item_category,
          selectStock:item.pur_ls1_stockno,
          setSupplier:item.pur_ls1_supplier,
          setSupplierName:item.setSupplierName,
          setRecSupplier:item.pur_ls1_rec_supplier,
          setLastItemCost:item.pur_ls1_last_item_cost,
          setDescription: item.pur_ls1_desc,
          setUom: item.pur_ls1_ord_uom,
          setOrderQty: item.pur_ls1_ord_qty,
          setRetailPrice: item.pur_ls1_retail_price,
          setItemCost: item.pur_ls1_item_cost,
          setCurrencyCode:item.pur_ls1_cur_code,
          setCurrencyRate:item.pur_ls1_cur_exchange_rate,
          setTaxCode:item.pur_ls1_tax_code,
          setTotal:item.pur_ls1_ord_qty*item.pur_ls1_item_cost,
          setTaxRate:item.pur_ls1_tax_rate,
          setTaxValue:item.pur_ls1_tax_value,
          setCostCenter:item.pur_ls1_chg_costcenter,
          setCostAccount:item.pur_ls1_chg_account,
          setProjectId:item.pur_ls1_projectid,
          setPoNo:item.pur_ls1_po_no,
          setPoLineNO:item.pur_ls1_po_lineno,
          setContractId:item.pur_ls1_contract_id,
          setWoNo:item.pur_ls1_wo_no,
          setQuotationNo:item.pur_ls1_quo_no,
          setStockLocation:item.pur_ls1_stk_locn
        }));
    
        setResult(formattedData);
       // onDataFromSecondComponent(formattedData);
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

   // Second Api call fetch all dropdowwn data
   const fetchStatusData = async () => {
    try {
      const response = await httpCommon.get(
        "/get_purchase_req_dropdown_list.php?site_cd=" + site_ID
      );
    //   console.log("response____status__new__popup", response);  

       let Charge_Cost_Center = response.data.data.costcenter.map(
        (item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.costcenter,
        })
      );
      setCharge_Cost_Center(Charge_Cost_Center);

      let Supplier_ListData = response.data.data.Supplier.map((item) => ({
        label: item.sup_mst_supplier_cd + " : " + item.sup_mst_desc,
        value: item.sup_mst_supplier_cd,
        key: item.sup_mst_supplier_cd,
      }));

      setSupplier_List(Supplier_ListData);

      let UoM = response.data.data.Order_Uom.map((item) => ({
        label: item.uom_mst_uom + " : " + item.uom_mst_desc,
        value: item.uom_mst_desc,
        key: item.uom_mst_uom ,
      }));

      setOrder_UoM(UoM);


      let Charge_AccountData = response.data.data.Charge_Cost_Account.map((item) => ({
        label: item.account + " : " + item.descs,
        value: item.account,
      }));
      setCharge_Account(Charge_AccountData);


      let ProjectIDAdd = response.data.data.Project_Id.map((item) => ({
        label: item.prj_mst_prj_cd + " : " + item.prj_mst_desc,
        value: item.prj_mst_prj_cd,
      }));
      setProject_id(ProjectIDAdd);


      /*   end */

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
 // console.log("Header_____",Header);
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
 // console.log("Result______",Result);
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
        {/* <TableCell style={{ padding: "5px", textAlign: "center" }}>
        {result && result.selectStock && result.selectStock.includes(":") 
            ? result.selectStock.split(":")[0].trim() 
            : result ? result.selectStock : ""}
        </TableCell> */}
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setItemCategory}
        </TableCell>
       
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
        {result && result.selectStock && result.selectStock.includes(":") 
            ? result.selectStock.split(":")[0].trim() 
            : result ? result.selectStock : ""}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
        {result && result.setSupplier && result.setSupplier.includes(":") 
            ? result.setSupplier.split(":")[0].trim() 
            : result ? result.setSupplier : ""}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setSupplierName}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setRecSupplier}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setLastItemCost}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setDescription}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setUom}
        </TableCell>
        

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.setOrderQty)}
        </TableCell>
        
      
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.setRetailPrice)}
        </TableCell>
        
        
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.setItemCost)}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setCurrencyCode}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.setCurrencyRate)}
        </TableCell>
        
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setTaxCode}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.setTotal)}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.setTaxRate)}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.setTaxValue)}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setCostCenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setCostAccount}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setProjectId }
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setPoNo}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setPoLineNO}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setContractId}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setContractId}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setWoNo}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setQuotationNo}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.setStockLocation}
        </TableCell>
    
      </TableRow>
      );
    });
  
  };

// Get All Filed label Name
const getPrFromLebel = async () => {
  try {
    const response = await httpCommon.get("/get_prline_form_lebal.php");
   // console.log("response___forl lebal_",response);
    if (response.data.status === "SUCCESS") {
      setPRLineMstLabel(response.data.data.pur_ls1);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  // Get All Filed label Name
  const getPrMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_prline_mandatory_filed.php");
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
  if (!Array.isArray(PRLineMstLabel)) return "";
  const matchingColumn = PRLineMstLabel.find(
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
 // console.log("inputFields____",inputFields);
 setEditStatus(data.status);
 setEditIndexNo(data.index);

  setRowID2(data.mst_RowID);
  setEditItemCategory({label:data.setItemCategory,value:data.setItemCategory});
  setStockNo(data.selectStock);
  setEditSupplierList({label:data.setSupplier,value:data.setSupplier});
  setEditSupplierName(data.setSupplierName);
  setEditRecSupplier(data.setRecSupplier);
  setEditLastItemCost(data.setLastItemCost);
  setEditDescription(data.setDescription);
  setSelected_Order_UoM({label:data.setUom,value:data.setUom});
  setEditOrderQty(formatNumber(data.setOrderQty));
  setEditRetailPrice(formatNumber(data.setRetailPrice));
  setEditItemCost(formatNumber(data.setItemCost));
  setEditCurrencyCode(data.setCurrencyCode);
  setEditCurrencyRate(formatNumber(data.setCurrencyRate));
  setEditTotal(formatNumber(data.setTotal));
  setEditTaxCode(data.setTaxCode);
  setEditTaxRate(formatNumber(data.setTaxRate));
  setEditTaxValue(formatNumber(data.setTaxValue));
  setEditCostCenter(data.setCostCenter);
  setEditChargeAccount(data.setCostAccount);
  setEditPONo(data.setPoNo);
  setEditPOLineNo(data.setPoLineNO);
  setEditContractId(data.setContractId);
  setEditWoNo(data.setWoNo);
  setQuotationNo(data.setQuotationNo);
  setStockLocation(data.setStockLocation);

   setShowModal(true);
   handleMenuClose();
};

const handleDelete = async (data, index, event) => {

 //console.log("Edit data as JSON delete:", JSON.stringify(data, null, 2));
 // console.log("Result_____",Result);
  const dltId = data.mst_RowID;
  handleMenuClose();
  if (data.status === "NEW") {
    setResult((prevResult) => {
      const updatedResult = prevResult.filter((item) => item.index !== data.index);
      return updatedResult;
    });
    return; 
  }
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
          `/delete_pr_line_data.php?site_cd=${site_ID}&PR_RowId=${dltId}`
        );
        console.log("response_____delete___", response); 

        if (response.data.status === "SUCCESS") {
          Swal.fire({
            title: "Deleted!",
            text: response.data.message,
            icon: "success"
          }).then(() => {
            // Call get_Mr_Line_Data after the "OK" button is clicked
            get_Pr_Line_Data(site_ID, RowID);
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
      setItemCategory:"Stock",
      selectStock: "",
      setStockLocation:"",
      setDescription: "",
      setRequiredQuantity:"",
      setItemCost:"",
      setUom:"",
      setCostCenter:"",
      setCostAccount:"",
      setSupplierName:"",
      setSupplier:"",
      setCurrencyCode:"",
      setCurrencyRate:"",
      setTaxCode:"",
      setTaxRate:"",
      setRecSupplier:"",
      setLastItemCost:"",
      setOrderQty:"",
      setRetailPrice:"",
      setItemCost:"",
      setTotal:"",
      setTaxValue:"",
      setProjectId:"",
      setPoNo:"",
      setPoLineNO:"",
      setContractId:"",
      setWoNo:"",
      setQuotationNo:""
    },
  ]);
 // console.log("inputFields_____",inputFields);
  const resetData = () => {
  
    setInputFields([
      {
        site_ID: site_ID,
        mst_RowID: RowID,
        emp_mst_login_id: emp_mst_login_id,
        setItemCategory:"Stock",
        selectStock: "",
        setStockLocation:"",
        setDescription: "",
        setRequiredQuantity:"",
        setItemCost:"",
        setUom:"",
        setCostCenter:"",
        setCostAccount:"",
        setSupplierName:"",
        setSupplier:"",
        setCurrencyCode:"",
        setCurrencyRate:"",
        setTaxCode:"",
        setTaxRate:"",
        setRecSupplier:"",
          setLastItemCost:"",
          setOrderQty:"",
          setRetailPrice:"",
          setItemCost:"",
          setTotal:"",
          setTaxValue:"",
          setProjectId:"",
          setPoNo:"",
          setPoLineNO:"",
          setContractId:"",
          setWoNo:"",
          setQuotationNo:""
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

  // Add New button funcation
  const addInputField = (event) => {
    event.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.selectStock.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Stock No is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setDescription.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setPartNo === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Part Number is Required!",
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
          selectStock: "",
          setDescription: "",
          setPartNo:"",
          setQtyNeeded:"",
          setTotalOh: "",
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
  const handleEditCurrencyClick = async () =>{
   
    setModalOpenCurrencyCode(true);
  }
  
  const handleCloseModalCurrencyCode = () =>{
   
    setModalOpenCurrencyCode(false);
  }
  const handleEditCurrencyClickUpdate = async () =>{
    
     setModalOpenCurrencyCode(true);
     
   }

  const handleEdittaxCodeClick = async () =>{
    setModalOpenTaxCode(true);
  }
  const handleCloseModaltaxCode = () =>{
    setModalOpenTaxCode(false);
  }

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
          "/get_pr_line_stock_data.php?site_cd=" +
            site_ID +
            "&itm_mst_stockno=" +
            rowData
        );
       
      //  console.log("stock___",response.data.data[0]);
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

          const CostcEnter = response.data.data[0].itm_mst_costcenter;
          list[index]["setCostCenter"] = CostcEnter;
          setInputFields(list); 

          const CostaCcount = response.data.data[0].itm_mst_account;
          list[index]["setCostAccount"] = CostaCcount;
          setInputFields(list); 

          // itm_mst_account

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

  const handleRowPopupCurrencyCodeData = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {
   
    // Use the row data in the second component

    if (rowData !== undefined && rowData !== null) {
      const updatedList = [...inputFields];
           
      // Update UOM in the specific row
      updatedList[index]["setCurrencyCode"] = rowData || "";
      updatedList[index]["setCurrencyRate"] = RowDescp || "";

      // Perform calculations for setItemCost and setTotal
    const retailPrice = parseFloat(updatedList[index]["setRetailPrice"]) || 0;
    const currencyRate = parseFloat(RowDescp) || 1; // Default to 1 to avoid division by zero
    const orderQty = parseFloat(updatedList[index]["setOrderQty"]) || 0;

    // Calculate setItemCost and setTotal
    const itemCost = retailPrice / currencyRate;
    const total = itemCost * orderQty;

    // Update the calculated values in the specific row
    updatedList[index]["setItemCost"] = itemCost.toFixed(4); // Format to 4 decimal places
    updatedList[index]["setTotal"] = total.toFixed(4); // Format to 4 decimal places

    setInputFields(updatedList);

    //  setInputFields(updatedList);
     // setmodalRowDt(rowData);
    
    }
    if (secondRowData == "1") {
      setModalOpenCurrencyCode(false);
    }
  };

  const handleRowPopupCurrencyCodeDataUpdate = async (
    EditIndexNo,
    rowData,
    RowDescp,
    secondRowData
  ) => {
   
    // Use the row data in the second component

    if (rowData !== undefined && rowData !== null) {
      const arrayIndex = Result.findIndex((item) => item.index === EditIndexNo);

    if (arrayIndex === -1) {
      console.error(`No item found with index ${EditIndexNo}`);
      return;
    }


      const updatedList = [...Result];
  
      // Update UOM in the specific row
      updatedList[arrayIndex]["setCurrencyCode"] = rowData || "";
      updatedList[arrayIndex]["setCurrencyRate"] = RowDescp || "";

      setEditCurrencyCode(rowData);
      setEditCurrencyRate(RowDescp);

      // Perform calculations for setItemCost and setTotal
    const retailPrice = parseFloat(updatedList[arrayIndex]["setRetailPrice"]) || 0;
    const currencyRate = parseFloat(RowDescp) || 1; // Default to 1 to avoid division by zero
    const orderQty = parseFloat(updatedList[arrayIndex]["setOrderQty"]) || 0;

    setEditRetailPrice(retailPrice);
    setEditOrderQty(orderQty);

    // Calculate setItemCost and setTotal
    const itemCost = retailPrice / currencyRate;
    const total = itemCost * orderQty;

    // Update the calculated values in the specific row
    updatedList[arrayIndex]["setItemCost"] = itemCost.toFixed(4); 
    updatedList[arrayIndex]["setTotal"] = total.toFixed(4); 

    setEditItemCost(itemCost.toFixed(4));
    setEditTotal(total.toFixed(4));

    setResult(updatedList);

    //  setInputFields(updatedList);
     // setmodalRowDt(rowData);
    
    }
    if (secondRowData == "1") {
      setModalOpenCurrencyCode(false);
    }
  };
  const handleRowPopupTaxCodeDataUpdate = async (
    EditIndexNo,
    rowData,
    RowDescp,
    secondRowData
  ) => {
   
    // Use the row data in the second component
   
    if (rowData !== undefined && rowData !== null) {
      const arrayIndex = Result.findIndex((item) => item.index === EditIndexNo);

    if (arrayIndex === -1) {
      console.error(`No item found with index ${EditIndexNo}`);
      return;
    }
      const updatedList = [...Result];
           
      // Update UOM in the specific row
      updatedList[arrayIndex]["setTaxCode"] = rowData || "";
      updatedList[arrayIndex]["setTaxRate"] = RowDescp || "";

      const TotlePrice = parseFloat(updatedList[arrayIndex]["setTotal"]) || 0;
      const taxRate = parseFloat(RowDescp) || 1; // Default to 1 to avoid division by zero
      const total = TotlePrice * taxRate;

      updatedList[arrayIndex]["setTaxValue"] = total.toFixed(4); // Format to 4 decimal places

      setEditTaxCode(rowData);
      setEditTaxRate(RowDescp);
      setEditTaxValue(total.toFixed(4));

      setResult(updatedList);
     // setmodalRowDt(rowData);
    
    }
    if (secondRowData == "1") {
      setModalOpenTaxCode(false);
    }
  };
  const handleRowPopupTaxCodeData = async (
    index,
    rowData,
    RowDescp,
    secondRowData
  ) => {
   
    // Use the row data in the second component
    
    if (rowData !== undefined && rowData !== null) {
      const updatedList = [...inputFields];
           
      // Update UOM in the specific row
      updatedList[index]["setTaxCode"] = rowData || "";
      updatedList[index]["setTaxRate"] = RowDescp || "";

      const TotlePrice = parseFloat(updatedList[index]["setTotal"]) || 0;
      const taxRate = parseFloat(RowDescp) || 1; // Default to 1 to avoid division by zero
      const total = TotlePrice * taxRate;

      updatedList[index]["setTaxValue"] = total.toFixed(4); // Format to 4 decimal places

      setInputFields(updatedList);
     // setmodalRowDt(rowData);
    
    }
    if (secondRowData == "1") {
      setModalOpenTaxCode(false);
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
        // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); 
   
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
        // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); 
   
  };
  const handleChangeAdd = async (index, fieldName, value, event) => {
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
  const handleChange = async (index, fieldName, value, event) => {
    
    const list = [...inputFields];
    if (fieldName == "setEditOrderQty") {
      
      setEditOrderQty(value);
    } else if(fieldName == "setEditRetailPrice"){
      setEditRetailPrice(value);
    }else if(fieldName == "setEditItemCost"){
      setEditItemCost(value);
    }else if(fieldName == "setEditCurrencyRate"){
      setEditCurrencyRate(value);
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
        if (!inputFields.setDescription || inputFields.setDescription.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Description is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (!inputFields.setUom || inputFields.setUom.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Order UOM is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (!inputFields.setOrderQty || inputFields.setOrderQty.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Order Qty is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }else if (!inputFields.setCurrencyCode || inputFields.setCurrencyCode.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Currency Code is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }
      else if (!inputFields.setCostCenter || inputFields.setCostCenter.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Charge Cost Center is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      }
      else if (!inputFields.setCostAccount || inputFields.setCostAccount.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Charge Account is Required!",
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
  // const newIndex = inputFields.length + 1;
   //console.log("inputFields____chck___",inputFields);
//    const updatedInputFields = inputFields.map(field => ({
//     ...field,
//     status: "NEW"
// }));
const newInputField = {
  ...inputFields[0], // Copy structure from the first input field
  index: Result.length > 0 ? (Math.max(...Result.map(field => field.index || 0)) + 1) : 1,
  status: "NEW", // Add "NEW" status
};

// Update the Result state with the new entry
setResult((prevResult) => {
  const updatedResult = [...(prevResult || []), newInputField];
  return updatedResult;
});

  
   onDataFromSecondComponent(newInputField);
    //get_Asset_Spares(site_ID, RowID);
   // removeInputFields();
    handleClose();
    Swal.close();
      
    }
  };

  // Handel Update button click
  const handleUpdateButtonClick = async (e) => {
   
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

  if (!EditDescription || EditDescription.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Description is Required!",
      customClass: {
        container: "swalcontainercustom",
      },
    });
    isValid = false;
  } else if(!selected_Order_UoM || !selected_Order_UoM.label || selected_Order_UoM.label.trim() === "" ){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Order UOM is Required!",
      customClass: {
        container: "swalcontainercustom",
      },
    });
    isValid = false;
  } else if(!EditCurrencyCode || EditCurrencyCode.trim() === "" ){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Currency Code is Required!",
      customClass: {
        container: "swalcontainercustom",
      },
    });
    isValid = false;
  } else if(!EditOrderQty){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Order Qty is Required!",
      customClass: {
        container: "swalcontainercustom",
      },
    });
    isValid = false;
  }
  if (isValid) {
   
  //   const updatedResult = Result.map((item) => {

  //     if (item.mst_RowID && item.mst_RowID.trim() && RowID2.trim() === item.mst_RowID.trim()) {
  //       return {
  //         ...item,
  //         setRequiredQuantity: RequiredQuantity,
  //         setItemCost: ItemCost,
  //         Status:"oldUpdate",
  //       };
  //     }

  //     return item;
  // });

  
  setResult((prevResult) => {
    const updatedResult = prevResult.map((item) => {
     
      if (item.index === EditIndexNo) {
        return {
           ...item, 
          setItemCategory: `${EditItemCategory.label}`,
          selectStock:StockNo,
          setSupplier: `${EditSupplierList.label}`,
          setSupplierName:EditSupplierName,
          setRecSupplier:EditRecSupplier,
          setLastItemCost:EditLastItemCost,
          setDescription: EditDescription,
          setUom: `${selected_Order_UoM.label}`,
          setOrderQty: EditOrderQty,
          setRetailPrice: EditRetailPrice,
          setItemCost: EditItemCost,
          setCurrencyCode:EditCurrencyCode,
          setCurrencyRate:EditCurrencyRate,
          setTaxCode:EditTaxCode,
          setTotal:EditTotal,
          setTaxRate:EditTaxRate,
          setTaxValue:EditTaxValue,
          setCostCenter: `${EditCostCenter.label}`,
          setCostAccount: `${EditChargeAccount.label}`,
          setProjectId:selected_Project_id,
          setPoNo:EditPONo,
          setPoLineNO:EditPOLineNo,
          setContractId:EditContractId,
          setWoNo:EditWoNo,
          setQuotationNo:QuotationNo,
          setStockLocation:StockLocation
        };
      }
      return item;
    });
  
  //const finalResult = [...updatedResult, updatedItem];
  //console.log("after Update____",finalResult);
    onDataFromSecondComponent(updatedResult);
    return updatedResult;
  });

}

  Swal.close();
  handleCloseModal();
 
  }
 // console.log("updatedResult____",inputFields);
 
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
                PR Line 
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
              <div>Add PR Line </div> {/* Title */}
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
                    {inputFields.map((data, index) => {
                      const {
                        setItemCategory,
                        selectStock,
                        setStockLocation,
                        setDescription,
                        setRequiredQuantity,
                        setItemCost,
                        setUom,
                        setCostCenter,
                        setCostAccount,
                        setSupplierName,
                        setSupplier,
                        setCurrencyCode,
                        setCurrencyRate,
                        setTaxCode,
                        setTaxRate,
                        setActualQuantity,
                        setClearedQty,
                        setRecSupplier,
                        setLastItemCost,
                        setOrderQty,
                        setRetailPrice,
                        setTotal,
                        setTaxValue,
                        setProjectId,
                        setPoNo,
                        setPoLineNO,
                        setContractId,
                        setWoNo,
                        setQuotationNo
                     
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
                                <label className={findCustomizerequiredLabel("pur_ls1_item_category")}>{findCustomizeLabel("pur_ls1_item_category") ||
                                    "Item Category:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={optionsStock}
                                  
                                  value={
                                    data.setItemCategory != "" ? data.setItemCategory : ""
                                  }
                                  onChange={(event, value) => {
                                    if (value) {
                                      // Update the selected value in state
                                      setSelectedValue(value);
                                      const updatedList = [...inputFields];
                                      updatedList[index]["setItemCategory"] = value.value ;
                                      setInputFields(updatedList);
                                     
                                    }
                                  }}

                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                              
                              <label className={findCustomizerequiredLabel("pur_ls1_stockno")}> {findCustomizeLabel("pur_ls1_stockno") ||
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
                                disabled={data.setItemCategory === "Non Stock"}
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={() => {
                                      if (data.setItemCategory !== "Non Stock") handleCancelClick();
                                    }}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={() => {
                                      if (data.setItemCategory !== "Non Stock") handleEditClick();
                                    }}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model stock no  */}
                            <Dialog
                              onClose={handleCloseModal2}
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
                                <label className={findCustomizerequiredLabel("pur_ls1_supplier")}>{findCustomizeLabel("pur_ls1_supplier") ||
                                    "Supplier:"}</label>
                              </Grid>
                             
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Supplier_List}
                                  // value={(selected_Supplier_List?.label || "")
                                  //   .split(" : ")
                                  //   .slice(0, 2)
                                  //   .join(" : ")}
                                    value={
                                      data.setSupplier != ""
                                        ? data.setSupplier
                                        : ""
                                    }
                                   
                                    onChange={(event, value) => {
                                     // console.log("Selected value:", value);
                                      setSelected_Supplier_List(value);
                                  
                                      if (value && value.label) {
                                        const updatedList = [...inputFields];
                                        updatedList[index]["setSupplier"] = value.label;
                                        setInputFields(updatedList);

                                        // Extract the part after the colon
                                        const supplierName = value.label.split(" : ")[1] || "";
                                  
                                        // Update the specific row in inputFields
                                       
                                        updatedList[index]["setSupplierName"] = supplierName;
                                        setInputFields(updatedList);
                                      }
                                    }}

                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                                <label className={findCustomizerequiredLabel("mtr_ls1_varchar1")}>{findCustomizeLabel("mtr_ls1_varchar1") ||
                                    "Supplier Name:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setSupplierName != ""
                                      ? data.setSupplierName
                                      : ""
                                  }
                                  disabled
                                  
                                  InputProps={{
                                    inputProps: { style: { textAlign: 'left' } }
                                    }}
                                />
                              
                              </Grid>

                              
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("pur_ls1_rec_supplier")}>{findCustomizeLabel("pur_ls1_rec_supplier") ||
                                    "Rec Supplier:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setRecSupplier != ""
                                      ? data.setRecSupplier
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
                                <label className={findCustomizerequiredLabel("pur_ls1_last_item_cost")}>{findCustomizeLabel("pur_ls1_last_item_cost") ||
                                    "Last Item Cost:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setLastItemCost != ""
                                      ? data.setLastItemCost
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
                                <label className={findCustomizerequiredLabel("pur_ls1_desc") || "Requiredlabel" }>{findCustomizeLabel("pur_ls1_desc") ||
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
                                      handleChangeAdd(index, "setDescription", newValue, event);
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
                                <label className={findCustomizerequiredLabel("pur_ls1_ord_uom") || "Requiredlabel"}>{findCustomizeLabel("pur_ls1_ord_uom") ||
                                    "Order UOM:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Order_UoM}
                                 
                                    value={inputFields[index]?.setUom || ""} 
                                    
                                    onChange={(event, value) => {
                                      const updatedList = [...inputFields];
                                
                                      // Update UOM in the specific row
                                      updatedList[index]["setUom"] = value.label || "";
                                      setInputFields(updatedList);
                                    }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                              
                                <label className={findCustomizerequiredLabel("pur_ls1_ord_qty") || "Requiredlabel"}> {findCustomizeLabel("pur_ls1_ord_qty") ||
                                    "Order Qty:"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  //value={setRequiredQuantity}
                                  value={
                                    data.setOrderQty != ""
                                      ? data.setOrderQty
                                      : ""
                                  }
                                  onChange={(event) => handleNumericInputChange_16(event, (formattedValue) => {
                                    handleChangeAdd(index, "setOrderQty", formattedValue, event);
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
                                  placeholder=".0000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                              
                                <label className={findCustomizerequiredLabel("pur_ls1_retail_price")}> {findCustomizeLabel("pur_ls1_retail_price") ||
                                    "Retail Price:"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  // value={setRequiredQuantity}
                                  value={
                                    data.setRetailPrice != ""
                                      ? data.setRetailPrice
                                      : ""
                                  }
                                 
                                  onChange={(event) => {
                                    const formattedValue = handleNumericInputChange_16(
                                      event,
                                      (formattedValue) => {
                                        handleChangeAdd(index, "setRetailPrice", formattedValue, event);
                              
                                        // Check if data.setCurrencyCode is empty
                                        if (!data.setCurrencyCode) {
                                          handleChangeAdd(index, "setItemCost", formattedValue, event);
                                        }
                                      }
                                    );
                                  }}
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
                                   placeholder=".0000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                              
                                <label className={findCustomizerequiredLabel("pur_ls1_item_cost")}> {findCustomizeLabel("pur_ls1_item_cost") ||
                                    "Item Cost:"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  
                                  value={
                                    data.setItemCost != ""
                                      ? data.setItemCost
                                      : ""
                                  }
                                 
                                  onChange={(event) => {
                                    const formattedValue = handleNumericInputChange_16(
                                      event,
                                      (formattedValue) => {
                                        handleChangeAdd(index, "setItemCost", formattedValue, event);
                              
                                       
                                      }
                                    );
                                  }}
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
                              
                              <label className={findCustomizerequiredLabel("pur_ls1_cur_code") || "Requiredlabel"}> {findCustomizeLabel("pur_ls1_cur_code") ||
                                    "Currency Code:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  data.setCurrencyCode != "" ? data.setCurrencyCode : ""
                                }
                                
                                disabled={data.setCurrencyCode !== ""}
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditCurrencyClick}
                                  />,
                                ]}
                              />
                            </Grid>

                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                              
                                <label className={findCustomizerequiredLabel("pur_ls1_cur_exchange_rate")}> {findCustomizeLabel("pur_ls1_cur_exchange_rate") ||
                                    "Currency Rate:"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                 // value={setRequiredQuantity}
                                 value={
                                  data.setCurrencyRate != "" ? data.setCurrencyRate : ""
                                }
                                
                                  onChange={(event) => handleNumericInputChange_16(event, (formattedValue) => {
                                    handleChangeAdd(index, "setRequiredQuantity", formattedValue, event);
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
                                <label className={findCustomizerequiredLabel("mtr_ls1_varchar1")}>{findCustomizeLabel("mtr_ls1_varchar1") ||
                                    "Total:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setTotal != ""
                                      ? data.setTotal
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
                              
                              <label className={findCustomizerequiredLabel("pur_ls1_tax_code")}> {findCustomizeLabel("pur_ls1_tax_code") ||
                                    "Tax Code:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                
                                value={
                                  data.setTaxCode != "" ? data.setTaxCode : ""
                                }
                                disabled={data.setTaxCode !== ""}
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEdittaxCodeClick}
                                  />,
                                ]}
                              />
                            </Grid>
                            
                            <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("pur_ls1_tax_rate")}>{findCustomizeLabel("pur_ls1_tax_rate") ||
                                    "Tax Rate:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setTaxRate != ""
                                      ? data.setTaxRate
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
                                <label className={findCustomizerequiredLabel("pur_ls1_tax_value")}>{findCustomizeLabel("pur_ls1_tax_value") ||
                                    "Tax Value:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setTaxValue != ""
                                      ? data.setTaxValue
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
                                <label className={findCustomizerequiredLabel("pur_ls1_chg_costcenter") || "Requiredlabel"}>{findCustomizeLabel("pur_ls1_chg_costcenter") ||
                                    "Charge Cost Center:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Charge_Cost_Center}

                                    value={inputFields[index]?.setCostCenter || ""} 
                                    
                                    onChange={(event, value) => {
                                      const updatedList = [...inputFields];
                                
                                      // Update UOM in the specific row setCostAccount
                                      updatedList[index]["setCostCenter"] = value.label || "";
                                      setInputFields(updatedList);
                                    }}

                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                                <label className={findCustomizerequiredLabel("pur_ls1_chg_account") || "Requiredlabel"}>{findCustomizeLabel("pur_ls1_chg_account") ||
                                    "Charge Account:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Charge_Account}
                                  value={inputFields[index]?.setCostAccount || ""} 
                                    
                                  onChange={(event, value) => {
                                    const updatedList = [...inputFields];
                              
                                    // Update UOM in the specific row 
                                    updatedList[index]["setCostAccount"] = value.label || "";
                                    setInputFields(updatedList);
                                  }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                                <label className={findCustomizerequiredLabel("pur_ls1_projectid")}>{findCustomizeLabel("pur_ls1_projectid") ||
                                    "Project ID:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Project_id}
                                  value={(selected_Project_id?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}

                                  onChange={(event, value) => {
                                    const updatedList = [...inputFields];
                              
                                    // Update UOM in the specific row 
                                    updatedList[index]["setProjectId"] = value.label || "";
                                    setInputFields(updatedList);
                                  }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                                <label className={findCustomizerequiredLabel("pur_ls1_po_no")}>{findCustomizeLabel("pur_ls1_po_no") ||
                                    "PO No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setPoNo != ""
                                      ? data.setPoNo
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
                                <label className={findCustomizerequiredLabel("pur_ls1_po_lineno")}>{findCustomizeLabel("pur_ls1_po_lineno") ||
                                    "PO Line No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setPoLineNO != ""
                                      ? data.setPoLineNO
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
                                <label className={findCustomizerequiredLabel("pur_ls1_contract_id")}>{findCustomizeLabel("pur_ls1_contract_id") ||
                                    "Contract Id:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setContractId != ""
                                      ? data.setContractId
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
                                <label className={findCustomizerequiredLabel("pur_ls1_wo_no")}>{findCustomizeLabel("pur_ls1_wo_no") ||
                                    "WO No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setWoNo != ""
                                      ? data.setWoNo
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
                                <label className={findCustomizerequiredLabel("pur_ls1_quo_no")}>{findCustomizeLabel("pur_ls1_quo_no") ||
                                    "Quotation No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setQuotationNo != ""
                                      ? data.setQuotationNo
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
                              
                              <label className={findCustomizerequiredLabel("pur_ls1_stk_locn")}> {findCustomizeLabel("pur_ls1_stk_locn") ||
                                    "Stock Location:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                            <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    data.setStockLocation != ""
                                      ? data.setStockLocation
                                      : ""
                                  }
                                  disabled
                                  
                                  InputProps={{
                                    inputProps: { style: { textAlign: 'left' } }
                                    }}
                                />
                            </Grid>

                {/*EEND*/}
                        {/* Model Currency Code   */}
                          <Dialog
                              onClose={handleCloseModalCurrencyCode}
                              aria-labelledby="customized-dialog-title"
                              open={modalOpenCurrencyCode}
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
                                <div> Currency Code</div> {/* Title */}
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModalCurrencyCode}
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
                                  <CurrencyCodeData
                                    onRowClick={(
                                      rowData,
                                      RowDescp,
                                      secondRowData
                                    ) =>
                                      handleRowPopupCurrencyCodeData(
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
                                    handleCloseModalCurrencyCode();
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
                            {/* End of Currency Code model */}

                             {/* Model Tax Code   */}
                          <Dialog
                              onClose={handleCloseModaltaxCode}
                              aria-labelledby="customized-dialog-title"
                              open={modalOpenTaxCode}
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
                                <div> Tax Code</div> {/* Title */}
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModaltaxCode}
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
                                  <TaxCodeData
                                    onRowClick={(
                                      rowData,
                                      RowDescp,
                                      secondRowData
                                    ) =>
                                      handleRowPopupTaxCodeData(
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
                                    handleCloseModaltaxCode();
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
                            {/* End of Tax Code model */}
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
          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button
              type="button"
              className="tabAddButton"
              onClick={handleShow}
            >
              + Add Spares
            </Button>
          </div> */}
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
              icon="clarity:form-line"
              width="30px"
              height="30px"
              style={{ fontSize: "24px", marginRight: "5px" }} // Add margin-right for spacing
              />
          <div>Update PR Line</div> {/* Title */}
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
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
                            <label className={findCustomizerequiredLabel("pur_ls1_item_category")}>{findCustomizeLabel("pur_ls1_item_category") ||
                                "Item Category:"}</label>
                            
                          </Grid>
                          <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={optionsStock}
                                 
                                  value={
                                    EditItemCategory.label != "" ? EditItemCategory.label : ""
                                  }
                                  onChange={(event, value) => {
                                    if (value) {
                                      // Update the selected value in state
                                      setEditItemCategory(value);
                                 
                                    }
                                  }}

                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                              
                              <label className={findCustomizerequiredLabel("pur_ls1_stockno")}> {findCustomizeLabel("pur_ls1_stockno") ||
                                    "Stock No:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  StockNo != "" ? StockNo : ""
                                }
                                disabled={EditItemCategory.label === "Non Stock"}
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={() => {
                                      if (EditItemCategory.label !== "Non Stock") handleCancelClick();
                                    }}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={() => {
                                      if (EditItemCategory.label !== "Non Stock") handleEditClick();
                                    }}
                                  />,
                                ]}
                              />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("pur_ls1_supplier")}>{findCustomizeLabel("pur_ls1_supplier") ||
                                    "Supplier:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Supplier_List}
                                  
                                  value={
                                    EditSupplierList.label != "" ? EditSupplierList.label : ""
                                  }
                                    onChange={(event, value) => {
                                      setEditSupplierList(value);
                                      if (value && value.label) {
                                         const supplierName = value.label.split(" : ")[1] || "";
                                         setEditSupplierName(supplierName);
                                      }
                                    }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                                <label className={findCustomizerequiredLabel("mtr_ls1_varchar1")}>{findCustomizeLabel("mtr_ls1_varchar1") ||
                                    "Supplier Name:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={EditSupplierName}
                                  disabled
                                  
                                  InputProps={{
                                    inputProps: { style: { textAlign: 'left' } }
                                    }}
                                />
                              
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("pur_ls1_rec_supplier")}>{findCustomizeLabel("pur_ls1_rec_supplier") ||
                                    "Rec Supplier:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditRecSupplier != ""
                                      ? EditRecSupplier
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
                                <label className={findCustomizerequiredLabel("pur_ls1_last_item_cost")}>{findCustomizeLabel("pur_ls1_last_item_cost") ||
                                    "Last Item Cost:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditLastItemCost != ""
                                      ? EditLastItemCost
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
                                <label className={findCustomizerequiredLabel("pur_ls1_desc") || "Requiredlabel" }>{findCustomizeLabel("pur_ls1_desc") ||
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
                                    EditDescription != ""
                                      ? EditDescription
                                      : ""
                                  }
                                 
                                  onChange={(event) => {
                                    const newValue = event.target.value;
                                    // Check if the new value is within the limit of 1000 characters
                                    if (newValue.length <= 1000) {
                                      setEditDescription(newValue);
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
                                <label className={findCustomizerequiredLabel("pur_ls1_ord_uom") || "Requiredlabel"}>{findCustomizeLabel("pur_ls1_ord_uom") ||
                                    "Order UOM:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Order_UoM}
                                  getOptionLabel={(option) => option.label || ""} // Ensure label is used
                                  value={selected_Order_UoM} // Find the matching option
                                  //  value={inputFields[index]?.setUom || ""} 
                                   
                                    onChange={(event, value) => {
                                       setSelected_Order_UoM(value); // Update the state with the selected label
                                    }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                              
                                <label className={findCustomizerequiredLabel("pur_ls1_ord_qty") || "Requiredlabel"}> {findCustomizeLabel("pur_ls1_ord_qty") ||
                                    "Order Qty:"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  //value={setRequiredQuantity}
                                  value={ EditOrderQty !== ""  ? EditOrderQty : "" }
                                  onChange={(event) => handleNumericInputChange_16(event, (formattedValue) => {
                                   handleChange(EditIndexNo,"setEditOrderQty", formattedValue, event);
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
                                  placeholder=".0000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                              
                                <label className={findCustomizerequiredLabel("pur_ls1_retail_price")}> {findCustomizeLabel("pur_ls1_retail_price") ||
                                    "Retail Price:"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  // value={setRequiredQuantity}
                                  value={
                                    EditRetailPrice != ""
                                      ? EditRetailPrice
                                      : ""
                                  }
                                 
                                  onChange={(event) => {
                                    const formattedValue = handleNumericInputChange_16(
                                      event,
                                      (formattedValue) => {
                                        handleChange(EditIndexNo,"setEditRetailPrice", formattedValue, event);
                              
                                      }
                                    );
                                  }}
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
                                   placeholder=".0000"
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                              
                                <label className={findCustomizerequiredLabel("pur_ls1_item_cost")}> {findCustomizeLabel("pur_ls1_item_cost") ||
                                    "Item Cost:"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                  
                                  value={
                                    EditItemCost != ""
                                      ? EditItemCost
                                      : ""
                                  }
                                 
                                  onChange={(event) => {
                                    const formattedValue = handleNumericInputChange_16(
                                      event,
                                      (formattedValue) => {
                                        handleChange( EditIndexNo,"setEditItemCost", formattedValue, event);
                              
                                       
                                      }
                                    );
                                  }}
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
                             
                              <label className={findCustomizerequiredLabel("pur_ls1_cur_code") || "Requiredlabel"}> {findCustomizeLabel("pur_ls1_cur_code") ||
                                    "Currency Code:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={
                                  EditCurrencyCode !== "" ? EditCurrencyCode : ""
                                }
                                
                                //disabled={EditCurrencyCode !== ""}
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEditCurrencyClickUpdate}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model Currency Code   */}
                          <Dialog
                              onClose={handleCloseModalCurrencyCode}
                              aria-labelledby="customized-dialog-title"
                              open={modalOpenCurrencyCode}
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
                                <div> Currency Code</div> {/* Title */}
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModalCurrencyCode}
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
                                  <CurrencyCodeData
                                    onRowClick={(
                                      rowData,
                                      RowDescp,
                                      secondRowData
                                    ) =>
                                      handleRowPopupCurrencyCodeDataUpdate(
                                        EditIndexNo,
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
                                    handleCloseModalCurrencyCode();
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
                            {/* End of Currency Code model update */}
                            <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                              
                                <label className={findCustomizerequiredLabel("pur_ls1_cur_exchange_rate")}> {findCustomizeLabel("pur_ls1_cur_exchange_rate") ||
                                    "Currency Rate:"}</label>

                              </Grid>

                              <Grid item xs={12} md={8}>
                              <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  type="text"
                                  fullWidth
                                 // value={setRequiredQuantity}
                                 value={
                                  EditCurrencyRate != "" ? EditCurrencyRate : ""
                                }
                                
                                  onChange={(event) => handleNumericInputChange_16(event, (formattedValue) => {
                                    handleChange( EditIndexNo,"setEditCurrencyRate", formattedValue, event);
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
                                <label className={findCustomizerequiredLabel("mtr_ls1_varchar1")}>{findCustomizeLabel("mtr_ls1_varchar1") ||
                                    "Total:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditTotal != ""
                                      ? EditTotal
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
                              
                              <label className={findCustomizerequiredLabel("pur_ls1_tax_code")}> {findCustomizeLabel("pur_ls1_tax_code") ||
                                    "Tax Code:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <CustomTextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                fullWidth
                                
                                value={
                                  EditTaxCode != "" ? EditTaxCode : ""
                                }
                                //disabled={EditTaxCode !== ""}
                                placeholder="Select..."
                                style={{ color: "#000" }}
                                rightIcons={[
                                  <Iconify
                                    icon="material-symbols:close"
                                    onClick={handleCancelClick}
                                  />,
                                  <Iconify
                                    icon="tabler:edit"
                                    onClick={handleEdittaxCodeClick}
                                  />,
                                ]}
                              />
                            </Grid>
                            {/* Model Tax Code   */}
                          <Dialog
                              onClose={handleCloseModaltaxCode}
                              aria-labelledby="customized-dialog-title"
                              open={modalOpenTaxCode}
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
                                <div> Tax Code</div> {/* Title */}
                              </DialogTitle>
                              <IconButton
                                aria-label="close"
                                onClick={handleCloseModaltaxCode}
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
                                  <TaxCodeData
                                    onRowClick={(
                                      rowData,
                                      RowDescp,
                                      secondRowData
                                    ) =>
                                      handleRowPopupTaxCodeDataUpdate(
                                        EditIndexNo,
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
                                    handleCloseModaltaxCode();
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
                            {/* End of Tax Code model */}
                            <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                                <label className={findCustomizerequiredLabel("pur_ls1_tax_rate")}>{findCustomizeLabel("pur_ls1_tax_rate") ||
                                    "Tax Rate:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditTaxRate != ""
                                      ? EditTaxRate
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
                                <label className={findCustomizerequiredLabel("pur_ls1_tax_value")}>{findCustomizeLabel("pur_ls1_tax_value") ||
                                    "Tax Value:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditTaxValue != ""
                                      ? EditTaxValue
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
                                <label className={findCustomizerequiredLabel("pur_ls1_chg_costcenter") || "Requiredlabel"}>{findCustomizeLabel("pur_ls1_chg_costcenter") ||
                                    "Charge Cost Center:"}</label>
                              </Grid>
                            
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Charge_Cost_Center}
                                  // getOptionLabel={(option) => option.label || ""} // Ensure label is used
                                    value={EditCostCenter} 
                                    
                                    onChange={(event, value) => {
                                     
                                      setEditCostCenter(value);
                                    
                                    }}

                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                                <label className={findCustomizerequiredLabel("pur_ls1_chg_account") || "Requiredlabel"}>{findCustomizeLabel("pur_ls1_chg_account") ||
                                    "Charge Account:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Charge_Account}
                                 // getOptionLabel={(option) => option.label || ""} 
                                  value={EditChargeAccount} 
                                    
                                  onChange={(event, value) => {
                                    setEditChargeAccount(value);
                                 
                                  }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                                <label className={findCustomizerequiredLabel("pur_ls1_projectid")}>{findCustomizeLabel("pur_ls1_projectid") ||
                                    "Project ID:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                  options={Project_id}
                                  value={(selected_Project_id?.label || "")
                                    .split(" : ")
                                    .slice(0, 2)
                                    .join(" : ")}

                                  onChange={(event, value) => {
                                    setSelected_Project_id(value);
                                   
                                  }}
                                  disableAnimation
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        placeholder="Select..."
                                        variant="outlined"
                                        size="small"
                                        className={`Extrasize ${
                                          isAssetShortDescEmpty
                                            ? "errorEmpty"
                                            : ""
                                        }`}
                                        style={{ width: "100%" }}
                                        ref={autocompleteRef}
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
                                <label className={findCustomizerequiredLabel("pur_ls1_po_no")}>{findCustomizeLabel("pur_ls1_po_no") ||
                                    "PO No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditPONo != ""
                                      ? EditPONo
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
                                <label className={findCustomizerequiredLabel("pur_ls1_po_lineno")}>{findCustomizeLabel("pur_ls1_po_lineno") ||
                                    "PO Line No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditPOLineNo != ""
                                      ? EditPOLineNo
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
                                <label className={findCustomizerequiredLabel("pur_ls1_contract_id")}>{findCustomizeLabel("pur_ls1_contract_id") ||
                                    "Contract Id:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditContractId != ""
                                      ? EditContractId
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
                                <label className={findCustomizerequiredLabel("pur_ls1_wo_no")}>{findCustomizeLabel("pur_ls1_wo_no") ||
                                    "WO No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    EditWoNo != ""
                                      ? EditWoNo
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
                                <label className={findCustomizerequiredLabel("pur_ls1_quo_no")}>{findCustomizeLabel("pur_ls1_quo_no") ||
                                    "Quotation No:"}</label>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    QuotationNo != ""
                                      ? QuotationNo
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
                              
                              <label className={findCustomizerequiredLabel("pur_ls1_stk_locn")}> {findCustomizeLabel("pur_ls1_stk_locn") ||
                                    "Stock Location:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                            <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={
                                    StockLocation != ""
                                      ? StockLocation
                                      : ""
                                  }
                                  disabled
                                  
                                  InputProps={{
                                    inputProps: { style: { textAlign: 'left' } }
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

export default PR_Line;
