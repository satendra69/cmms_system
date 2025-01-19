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
import { useLocation } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Iconify from "src/components/iconify";
import logo from "../../../../assets/img/setup.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import httpCommon from "src/http-common";

const WorkOrderOutsource = ({ onRowClick, data }) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [MaterialOrderResult, setMaterialOrderResult] = React.useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  //  resetData();
  removeInputFields();
  setInputFields((prevFields) =>
    prevFields.map((field) => ({
      ...field,
      selectedSupplier:"",
      setDescription:"",
      selectedTaxCode:"",
      selectedUOM:"",
      setQtyNeeded:"",
      setEstimateCost:"",
      selectedCostCenter:"",
      selectedChargeAccount:"",
    }))
  );
  };

  
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [Supplier, setSupplier] = useState([]);
  const [selected_Supplier, setSelected_Supplier] = useState([]);

  const [Description, setDescription] = useState("");

  const [TaxCode, setTaxCode] = useState([]);
  const [selected_TaxCode, setSelected_TaxCode] = useState([]);

  const [UOM, setUOM] = useState([]);
  const [selected_UOM, setSelected_UOM] = useState([]);

  const [QtyNeeded, setQtyNeeded] = useState("0");

  const [EstimateCost, setEstimateCost] = useState("0");

  const [CostCenter, setCostCenter] = useState([]);
  const [selected_CostCenter, setSelected_CostCenter] = useState([]);

  const [Account, setAccount] = useState([]);
  const [selected_Account, setSelected_Account] = useState([]);

  const location = useLocation();
  
  const [Button_save, setButton_save] = useState("");

  const [RowID, setRowID] = useState(data.RowID);

  const [FormStatus, setFormStatus] = useState(data.formStatus);

  const [StockNo, setStockNo] = useState("");
  const [MaterialRequestNo, setMaterialRequestNo] = useState("");
  const [PrNo, setPrNo] = useState("");
  const [PrLineNo, setPrLineNo] = useState("");
  const [ApprovalStatus, setApprovalStatus] = useState("");
  const [PoNo, setPoNo] = useState("");
  const [PoLine, setPoLine] = useState("");
  const [ContractPoNo, setContractPoNo] = useState("");
  const [ContractPoLine, setContractPoLine] = useState("");
  const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo);
  
  const [AssetNo, setAssetNo] = useState(data.Asset_No ? data.Asset_No.split(' : ')[0] : '');

  const [getStockNo, setGetStockNo] = useState([]);
  const [modalOpenAsset, setModalOpenAsset] = useState(false);
  const [modalRowDt, setmodalRowDt] = useState("");

  const [wkoMstLabel, setWkoMstLabel] = useState([]);
  const [MaterialMandatoryFiled, setMaterialMandatoryFiled] = useState([]);



  // First Api
  const get_workordermaster_OutSource = async (site_ID, RowID) => {
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
        `/get_workordermaster_outsourcecontract.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );
      //  console.log("response____order___", response);
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

  const get_workordermaster_OutSource_header =async (site_ID, RowID) =>{
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
        `/get_workordermaster_outsourcecontract.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );
      //  console.log("response____order___", response);
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
  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center",
       padding: "5px"
    };
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

  const formatNumber = (number) => {
    if (number == null) {
      return '';
    }
  
    let [integerPart, decimalPart] = number.toString().split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
  
    return `${integerPart}.${decimalPart}`;
  };
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleMouseEnter = (index) => setHoveredRow(index);
  const handleMouseLeave = () => setHoveredRow(null);
  //Body
  const renderTableRows = () => {
    return Result.map((result, index) => (
      <TableRow
        key={index}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
        onClick={(event) => handleRowClick(result, event)}
        style={{
          backgroundColor: hoveredRow === index ? "#f0f8ff" : "white", // Light blue hover color
          cursor: "pointer",
        }}
      >
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {index + 1}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls4_supplier}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          
          {result.wko_ls4_descr && result.wko_ls4_descr.length > 20 ? (
          <Tooltip title={result.wko_ls4_descr} arrow placement="top">
            <span>
              {result.wko_ls4_descr.slice(0, 20)}...
            </span>
          </Tooltip>
        ) : (
          result.wko_ls4_descr || ""
        )}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls4_tax_cd}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls4_svc_uom}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
         
          {formatNumber(result.wko_ls4_qty_needed)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
      
           {formatNumber(result.wko_ls4_est_cost)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
           {result.wko_ls4_chg_costcenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
           {result.wko_ls4_chg_account}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          <span
            style={{
              backgroundColor:
                result.pur_mst_purq_approve === "W"
                  ? "#FF6258"
                  : result.pur_mst_purq_approve === "A"
                  ? "#19D895"
                  : result.pur_mst_purq_approve
                  
                  
                  === "D"
                  ? "#2196F3"
                  : null,
              color: "white",
              padding: "5px",
              borderRadius: "5px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {result.pur_mst_purq_approve === "W"
              ? "Awaiting (W)"
              : result.pur_mst_purq_approve === "A"
              ? "Approve (A)"
              : result.pur_mst_purq_approve === "D"
              ? "Disapprove (D)"
              : result.pur_mst_purq_approve}
          </span>
        </TableCell>
      </TableRow>
    ));
  };
  const handleRowClick = (data) => {
    //console.log("clickRow__",data)

    setStockNo( data.wko_ls4_assetno )
    setSupplier( data.wko_ls4_supplier )
    setDescription( data.wko_ls4_descr )
    setTaxCode( data.wko_ls4_tax_cd )
    setUOM( data.wko_ls4_svc_uom )
    setQtyNeeded( data.wko_ls4_qty_needed )
    setEstimateCost( data.wko_ls4_est_cost )
    setCostCenter( data.wko_ls4_chg_costcenter )
    setAccount( data.wko_ls4_chg_account )
    setPrNo( data.wko_ls4_pr_no )
    setPrLineNo( data.wko_ls4_pr_lineno )
    setApprovalStatus( data.pur_mst_purq_approve )
    setPoLine( data.pur_ls1_po_no )
    setPoLine( data.pur_ls1_po_lineno )
    setContractPoNo( data.wko_ls4_po_no )
    setContractPoLine( data.wko_ls4_po_lineno )

    setShowModal(true);
  };
  const resetData = () => {
      setSelected_Supplier(0);
      setDescription('');
      setSelected_TaxCode(0);
      setSelected_UOM(0);
      setQtyNeeded('');
      setEstimateCost('');
      setSelected_CostCenter(0);
      setSelected_Account(0);
  };
  // Add New Row button click
  const [inputFields, setInputFields] = useState([
    {
           mst_RowID: RowID,
           emp_mst_login_id: emp_mst_login_id,
           mtr_mst_wo_no: WorkOrderNo,
            pur_ls1_po_lineno: null,
            pur_ls1_po_no: null,
            pur_mst_purq_approve: "W",
            site_cd: site_ID,
            wko_ls4_assetno: AssetNo,
            wko_ls4_po_lineno: null,
            wko_ls4_po_no: null,
            wko_ls4_pr_lineno: "1",
            wko_ls4_pr_no: "PR100004",
            selectedSupplier:"",
            setDescription:"",
            selectedTaxCode:"",
            selectedUOM:"",
            setQtyNeeded:"",
            setEstimateCost:"",
            selectedCostCenter:"",
            selectedChargeAccount:"",

    },
  ]);
  // Add New button funcation
  const addInputField = (event) => {
    event.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
      if (inputFields.selectedSupplier === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Supplier is Required!",
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
      }  else if (inputFields.selectedUOM === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "UOM is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setQtyNeeded.trim() === "") {
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
      else if (inputFields.setEstimateCost.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Estimate Cost is Required!",
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
        
          mst_RowID: RowID,
          mtr_mst_wo_no: WorkOrderNo,
          emp_mst_login_id: emp_mst_login_id,
           pur_ls1_po_lineno: null,
           pur_ls1_po_no: null,
           pur_mst_purq_approve: "W",
           site_cd: site_ID,
           wko_ls4_assetno: AssetNo,
           wko_ls4_po_lineno: null,
           wko_ls4_po_no: null,
           wko_ls4_pr_lineno: "1",
           wko_ls4_pr_no: "PR100004",
           selectedSupplier:"",
           setDescription:"",
           selectedTaxCode:"",
           selectedUOM:"",
           setQtyNeeded:"",
           setEstimateCost:"",
           selectedCostCenter:"",
           selectedChargeAccount:"",
    
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
      selectedSupplier:"",
      setDescription:"",
      selectedTaxCode:"",
      selectedUOM:"",
      setQtyNeeded:"",
      setEstimateCost:"",
      selectedCostCenter:"",
      selectedChargeAccount:"",
    };
  });

  const handleChange = async (index, fieldName, value) => {
    const list = [...inputFields];
    if (fieldName == "setQtyNeeded") {
      list[index][fieldName] = value;
      setInputFields(list);
      setQtyNeeded(value);
    } else {
      list[index][fieldName] = value;
      setInputFields(list);
    }

    if (fieldName == "selectedSupplier") {
        setSelected_Supplier(value);
    } else if (fieldName == "setDescription") {
        setDescription(value);
    } else if (fieldName == "selectedTaxCode") {
        setSelected_TaxCode(value);
    }else if (fieldName == "selectedUOM") {
        setSelected_UOM(value);
    }else if (fieldName == "selectedTaxCode") {
        setSelected_TaxCode(value);
    }else if (fieldName == "setEstimateCost") {
      setEstimateCost(value);
    }else if (fieldName == "selectedCostCenter") {
        setSelected_CostCenter(value);
    }else if (fieldName == "selectedChargeAccount") {
      setSelected_Account(value);
    }
  };

  const handleClickSupplier = async () => {
    const Supplier2 = "supplier";
    try {
      const response = await httpCommon.get(
        "/get_dropdown.php?site_cd=" + site_ID + "&type=" + Supplier2
      );
     
      let SupplierGet = response.data.data.supplier.map(item => ({
        label: item.sup_mst_supplier_cd + " : " + item.sup_mst_desc,
        value: item.sup_mst_supplier_cd
    }));
    
    setSupplier(SupplierGet);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleClickTaxCode = async () => {
    const ItmTaxCode = "ITM_Tax_Code";
    try {
      const response = await httpCommon.get(
        "/get_dropdown.php?site_cd=" + site_ID + "&type=" + ItmTaxCode
      );
     
      let ItmTaxCodeGet = response.data.data.ITM_Tax_Code.map(item => ({
        label: item.tax_mst_tax_cd + " : " + item.tax_mst_desc,
        value: item.tax_mst_tax_cd
    }));
    
    setTaxCode(ItmTaxCodeGet);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickUOM = async () => {
    const ItmUOM = "ITM_Issue_UOM";
    try {
      const response = await httpCommon.get(
        "/get_dropdown.php?site_cd=" + site_ID + "&type=" + ItmUOM
      );
     
      let ItmUOMGet = response.data.data.ITM_Issue_UOM.map(item => ({
        label: item.uom_mst_uom + " : " + item.uom_mst_desc,
        value: item.uom_mst_uom
    }));
    
    setUOM(ItmUOMGet);
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleClickCostCenter = async () => {
    const ItmCostCenter = "CostCenter";
    try {
      const response = await httpCommon.get(
        "/get_dropdown.php?site_cd=" + site_ID + "&type=" + ItmCostCenter
      );
     
      let ItmCostCenterGet = response.data.data.CostCenter.map(item => ({
        label: item.costcenter + " : " + item.descs,
        value: item.costcenter
    }));
    
    setCostCenter(ItmCostCenterGet);
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
      setAccount(ChargeAccount);
    } catch (error) {
      console.error(error);
    }
  };
 // console.log("inputFields____",inputFields);
  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    let isValid = true;
    inputFields.forEach((inputFields) => {
        
      if (inputFields.selectedSupplier === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Supplier is Required!",
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
      } else if (inputFields.selectedUOM === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "UOM is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setQtyNeeded.trim() === "") {
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
      else if (inputFields.setEstimateCost.trim() === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Estimate Cost is Required!",
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
     // Swal.showLoading();
     
      try {
        const response = await httpCommon.post(
          "/insert_work_order_contract.php",
          inputFields
        );
        //console.log("API Response_Contract:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Outsource Contract Request!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            setResult([...Result, inputFields]);
            get_workordermaster_OutSource(site_ID, RowID);
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
    (acc, item) => acc + (parseFloat(item.wko_ls4_qty_needed) || 0),
    0
  );

  //Multiply calculation
  const totalCost = Result.reduce(
    (acc, item) =>
      acc +
      (parseFloat(item.wko_ls4_qty_needed) || 0) *
        (parseFloat(item.wko_ls4_est_cost) || 0),
    0
  );

  const formattedTotalCost = totalCost.toLocaleString('en-US');
  const formattedtotalQty =  totalQty.toLocaleString('en-US');
  // Get All Filed label Name
const getWorkOrderOutSourceFromLebel = async () => {
  try {
    const response = await httpCommon.get("/get_work_order_outsource_contract_form_lebal.php");
    if (response.data.status === "SUCCESS") {
      setWkoMstLabel(response.data.data.wko_ls3);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const getWorkOrderOutSourceMandatoryfiled = async () => {
  try {
    const response = await httpCommon.get("/get_work_order_outsource_contract_mandatory_filed.php");
    
    if (response.data && response.data.data && response.data.data.MandatoryField) {

      if (response.data.data.MandatoryField.length > 0) {
        
        setMaterialMandatoryFiled(response.data.data.MandatoryField);

      }

    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  useEffect(() => {
   
    if(FormStatus !== "" && FormStatus == "NEW" ){
      get_workordermaster_OutSource_header(site_ID);
    }else{
      get_workordermaster_OutSource(site_ID, RowID);
    }
    getWorkOrderOutSourceFromLebel();
    getWorkOrderOutSourceMandatoryfiled();
    // get_workorder_status(site_ID, "All", location.state.select);
  }, [location]);

  const findCustomizeLabel = (columnName) => {
    if (!Array.isArray(wkoMstLabel)) return "";
    const matchingColumn = wkoMstLabel.find(
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
       // setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
   // setErrorField(null);
    
  };
 // console.log("inputFields____", inputFields);

 const handleShow = () => {
           
  if(FormStatus !== "" && FormStatus == "NEW" ){
    Swal.fire({
      icon: "info",
      customClass: {
        container: "swalcontainercustom",
      },
      title: "Please Wait!",
      allowOutsideClick: false,
      text: "Once the Work Order is created, you can then add detailed Outsource Contract (PR).",
      width:"400px"
    });
    onRowClick("BtnPlanning");
  }else{
    setShow(true);
    setInputFields(updatedInputFields);
     
  }
};

  return (
    <>
      <div>
        <div style={{ paddingBottom: "0px", backgroundColor: "white" }}>
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginRight: "4px",marginTop:"-10px" }}>
              <img src={logo} style={{ width: "35px", height: "35px" }} />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
              Outsource Contract (PR)
              </div>
              <div style={{fontSize:"14px",marginBottom:"14px"}}>
              Total Quantity {" "}
                <span style={{ color: "blue" }}>
                  {formattedtotalQty},
                </span>{" "}
                Total Outsource Contract Cost{" "}
                <span style={{ color: "#19d895" }}>
                  ${formattedTotalCost}
                </span>
              </div>
            </div>
            <div
              style={{
                marginLeft: "auto", // Push button to the right
              }}
              className="submoduleDiv"
            >
              <Button
                type="button"
                 className="SubmoduleAddNewButton"
                onClick={handleShow}
                disabled={data.statusKey === "CLO"}
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
           // onClose={handleClose}
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
              <img
                src={logo}
                style={{ width: "30px", height: "30px", marginRight: "2px" }}
              />
             Outsource Contract (PR)
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
                    {/* {console.log("datadatadatadata____", data)} */}
                    {inputFields.map((data, index) => {

                      const { selectedSupplier, setDescription,selectedTaxCode, selectedUOM, setQtyNeeded, setEstimateCost, selectedCostCenter,selectedChargeAccount } = data;
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
                              
                              <label className={findCustomizerequiredLabel("wko_ls4_supplier") || "Requiredlabel"}> {findCustomizeLabel("wko_ls4_supplier") ||
                                    "Supplier:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={Supplier}
                                value={data.selectedSupplier}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "selectedSupplier",
                                    newValue
                                  )
                                }
                                onOpen={handleClickSupplier}
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
                              
                              <label className={findCustomizerequiredLabel("wko_ls4_descr") || "Requiredlabel"}> {findCustomizeLabel("wko_ls4_descr") ||
                                    "Description:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              {/* <TextField
                                variant="outlined"
                                size="small"
                                className="Extrasize"
                                fullWidth
                                value={
                                  data.setDescription != ""
                                    ? data.setDescription
                                    : ""
                                }
                              
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length <= 1024) {
                                    handleChange(
                                      index,
                                      "setDescription",
                                      event.target.value
                                    )
                                  }
                                  
                                }
                              }
                              /> */}
                              <TextareaAutosize
                                  aria-label="empty textarea"
                                  minRows={2.9}  // Set a higher initial height to allow expansion
                                  value={
                                    data.setDescription != ""
                                      ? data.setDescription
                                      : ""
                                  }
                                  fullWidth
                                  style={{ width: '100%', 
                                    resize: 'vertical',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    padding: '5px',
                                    borderColor: 'rgb(211, 209, 209)' }} 

                                    onChange={(event) => {
                                      const value = event.target.value;
                                      if (value.length <= 1024) {
                                        handleChange(
                                          index,
                                          "setDescription",
                                          event.target.value
                                        )
                                      }
                                      
                                    }
                                  }
                                  
                                />
                            
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("wko_ls4_tax_cd") || ""}> {findCustomizeLabel("wko_ls4_tax_cd") ||
                                    "Tax Code:"}</label>
                            </Grid>
                              <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={TaxCode}
                                value={data.selectedTaxCode}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "selectedTaxCode",
                                    newValue
                                  )
                                }
                                onOpen={handleClickTaxCode}
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
                             
                              <label className={findCustomizerequiredLabel("wko_ls4_svc_uom") || "Requiredlabel"}> {findCustomizeLabel("wko_ls4_svc_uom") ||
                                    "UOM:"}</label>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={UOM}
                                value={data.selectedUOM}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "selectedUOM",
                                    newValue
                                  )
                                }
                                onOpen={handleClickUOM}
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
                              
                              <label className={findCustomizerequiredLabel("wko_ls4_qty_needed") || "Requiredlabel"}> {findCustomizeLabel("wko_ls4_qty_needed") ||
                                    "Qty Needed:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                 type="text"
                                 inputProps={{ maxLength: 11 }}
                                className="Extrasize"
                                fullWidth
                                placeholder=".00"
                              
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange(event, (formattedValue) => {
                                      handleChange(index, "setQtyNeeded", formattedValue);
                                    });
                                  }
                                }}
                                onInput={(event) => {
                                  const value = event.target.value;
                                 
                                  if (value === '0') {
                                    event.target.value = '';
                                  }
                                }}
                                value={setQtyNeeded}
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
                              
                              <label className={findCustomizerequiredLabel("wko_ls4_est_cost") || "Requiredlabel"}> {findCustomizeLabel("wko_ls4_est_cost") ||
                                    "Estimate Cost:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder=".00"
                             
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange(event, (formattedValue) => {
                                      handleChange(index, "setEstimateCost", formattedValue);
                                    });
                                  }
                                }}

                                onInput={(event) => {
                                  const value = event.target.value;
                                  // Prevent '0' or empty value
                                  if (value === '0') {
                                    event.target.value = '';
                                  }
                                }}
                                value={setEstimateCost}
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
                              
                              <label className={findCustomizerequiredLabel("wko_ls4_chg_costcenter") || ""}> {findCustomizeLabel("wko_ls4_chg_costcenter") ||
                                    "Cost Center:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={CostCenter}
                                value={data.selectedCostCenter}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "selectedCostCenter",
                                    newValue
                                  )
                                }
                                onOpen={handleClickCostCenter}
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
                              
                              <label className={findCustomizerequiredLabel("wko_ls4_chg_account") || ""}> {findCustomizeLabel("wko_ls4_chg_account") ||
                                    "Account:"}</label>
                            </Grid>
                            
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={Account}
                                value={data.selectedChargeAccount}
                                onChange={(event, newValue) =>
                                  handleChange(
                                    index,
                                    "selectedChargeAccount",
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

              <div className="timeCartSubmit"  style={{ display: "flex", alignItems: "center" }}>
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
            disabled={data.statusKey === "CLOSE"}
          >
            + Add Outsource Contract (PR)
          </Button>
        </div> */}
      </div>
    </>
  );
};

export default WorkOrderOutsource;
