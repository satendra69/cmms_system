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
import WorkStockNoPopupData from "./WorkStockNoPopupData";
import logo from "../../../../assets/img/screw.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import httpCommon from "src/http-common";

const WorkOrderMaterial = ({ onRowClick, data }) => {
  
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);

  const [show, setShow] = useState(false);


  const [StockNo, setStockNo] = useState([]);
  const [selected_StockNo, setSelected_StockNo] = useState([]);

  const [StockLocation, setStockLocation] = useState([]);
  const [selected_StockLocation, setSelected_StockLocation] = useState([]);

  const [Description, setDescription] = useState("");

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState(
    []
  );

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  const [QtyNeeded, setQtyNeeded] = useState("");

  const location = useLocation();


  const [RowID, setRowID] = useState(data.RowID);
  const [WorkOrderNo, setWorkOrderNo] = useState(data.WorkOrderNo);
  const [selected_Charge_Cost_Center, setselected_Charge_Cost_Center] =
    useState(data.selected_Charge_Cost_Center);

  const [AssetNo, setAssetNo] = useState(data.Asset_No ? data.Asset_No.split(' : ')[0] : '');

   const [FormStatus, setFormStatus] = useState(data.formStatus);

  const [UOM, setUOM] = useState("");
  const [ItemCost, setItemCost] = useState("");
  const [MaterialRequestNo, setMaterialRequestNo] = useState("");
  const [MrLineNo, setMrLineNo] = useState("");
  const [MrApprovalStatus, setMrApprovalStatus] = useState("");
  const [ActualQuantity, setActualQuantity] = useState("");
  const [ContractPoNo, setContractPoNo] = useState("");
  const [ContractPoLine, setContractPoLine] = useState("");
  const [getStockNo, setGetStockNo] = useState([]);
  const [modalOpenAsset, setModalOpenAsset] = useState(false);
  const [modalRowDt, setmodalRowDt] = useState("");

  const [wkoMstLabel, setWkoMstLabel] = useState([]);
  const [MaterialMandatoryFiled, setMaterialMandatoryFiled] = useState([]);


  // First Api
  const get_workordermaster_material = async (site_ID, RowID) => {
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
        `/get_workordermaster_material.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );
      // console.log("response____material___", response);
       //console.log("RowID___",RowID);
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

  const get_workordermaster_material_header = async (site_ID) =>{
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
        `/get_workordermaster_material.php?site_cd=${site_ID}&RowID=${RowID || ""}`
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
  // Get All Filed label Name
const getAssetSparesFromLebel = async () => {
  try {
    const response = await httpCommon.get("/get_material_from_lebal.php");
    if (response.data.status === "SUCCESS") {
      setWkoMstLabel(response.data.data.ast_ls2);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const getAssetMandatoryfiled = async () => {
  try {
    const response = await httpCommon.get("/get_material_form_mandatory_filed.php");
    if (response.data && response.data.data && response.data.data.MandatoryField) {

      if (response.data.data.MandatoryField.length > 0) {
        
        setMaterialMandatoryFiled(response.data.data.MandatoryField);

      }

    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const [hoveredRow, setHoveredRow] = useState(null);

  const handleMouseEnter = (index) => setHoveredRow(index);
  const handleMouseLeave = () => setHoveredRow(null);

  //Body
  const renderTableRows = () => {
    if (!Array.isArray(Result)) {
     // console.error("Result is not an array:", Result);
      return;
    }
  
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
          {result.wko_ls2_stockno}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_stk_locn}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
        
             {result.wko_ls2_desc && result.wko_ls2_desc.length > 20 ? (
          <Tooltip title={result.wko_ls2_desc} arrow placement="top">
            <span>
              {result.wko_ls2_desc.slice(0, 20)}...
            </span>
          </Tooltip>
        ) : (
          result.wko_ls2_desc || ""
        )}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_chg_costcenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_chg_account}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatNumber(result.wko_ls2_qty_needed)}
          
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_mtl_uom}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_item_cost}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_mr_no}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          <span
            style={{
              backgroundColor:
                result.mtr_mst_status === "W"
                  ? "#FF6258"
                  : result.mtr_mst_status === "A"
                  ? "#19D895"
                  : result.mtr_mst_status === "D"
                  ? "#2196F3"
                  : null,
              color: "white",
              padding: "5px",
              borderRadius: "5px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {result.mtr_mst_status === "W"
              ? "Awaiting (W)"
              : result.mtr_mst_status === "A"
              ? "Approve (A)"
              : result.mtr_mst_status === "D"
              ? "Disapprove (D)"
              : result.mtr_mst_status}
          </span>
        </TableCell>
      </TableRow>
    ));
  };

  const handleRowClick = (data) => {
    //console.log("clickRow__",data)

    setAssetNo(data.wko_ls2_assetno);
    setStockNo(data.wko_ls2_stockno);
    setStockLocation(data.wko_ls2_stk_locn);
    setDescription(data.wko_ls2_desc);
    setChargeCostCenter(data.wko_ls2_chg_costcenter);
    setChargeAccount(data.wko_ls2_chg_account);
    setQtyNeeded(data.wko_ls2_qty_needed);
    setUOM(data.wko_ls2_mtl_uom);
    setItemCost(data.wko_ls2_item_cost);
    setMaterialRequestNo(data.wko_ls2_mr_no);
    setMrLineNo(data.wko_ls2_mr_lineno);
    setMrApprovalStatus(data.mtr_mst_status);
    setActualQuantity(data.mtr_ls1_rcv_qty);
    setContractPoNo(data.wko_ls2_po_no);
    setContractPoLine(data.wko_ls2_po_lineno);

  };
  const resetData = () => {
    setSelected_StockNo("");
    setmodalRowDt("");
    setSelected_StockLocation("");
    setDescription("");
    setSelected_ChargeCostCenter("");
    setSelected_ChargeAccount([]);
    setQtyNeeded("");
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
      mtr_mst_wo_no: WorkOrderNo,
      wko_ls2_mtl_uom: "",
      wko_ls2_item_cost: "",
      mtr_ls1_rcv_qty: ".0000",
      mtr_mst_assetno: AssetNo,
      selectStock: "",
      selectStockLocation: "",
      setDescription: "",
      selectChargeCostCenter: "",
      selectChargeAccount: "",
      setQtyNeeded: "",
    },
  ]);
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
      } else if (inputFields.selectChargeCostCenter === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Charge Cost Center is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.selectChargeAccount === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Charge Account is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setQtyNeeded === "") {
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
      setInputFields([
        ...inputFields,
        {
          site_ID: site_ID,
          mst_RowID: RowID,
          emp_mst_login_id: emp_mst_login_id,
          mtr_mst_wo_no: WorkOrderNo,
          wko_ls2_mtl_uom: "",
          wko_ls2_item_cost: "",
          mtr_ls1_rcv_qty: ".0000",
          mtr_mst_assetno: AssetNo,
          selectStock: "",
          selectStockLocation: "",
          setDescription: "",
          selectChargeCostCenter: "",
          selectChargeAccount: "",
          setQtyNeeded: "",
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
      selectStock: "",
      selectStockLocation: "",
      selectChargeCostCenter: "",
      setDescription: "",
      setQtyNeeded: "",
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
      //  console.log("response____material__22",response);
        if (response.data.status === "SUCCESS") {
          setGetStockNo(response.data.data);
          setStockNo(modalRowDt + ":" + response.data.data[0].itm_mst_desc);
         
          let StockLocation = response.data.data.map((item) => ({
            label: item.itm_mst_mstr_locn,
            value: item.itm_mst_mstr_locn,
          }));

          const list = [...inputFields];

          const stockDt = rowData;
          list[index]["selectStock"] = stockDt;
          setInputFields(list);

          const newData = response.data.data[0].itm_mst_desc;
          list[index]["setDescription"] = newData;
          setInputFields(list);

          const DataLoction = response.data.data[0].itm_mst_mstr_locn;
          list[index]["selectStockLocation"] = DataLoction;
          setInputFields(list);

          const Umo = response.data.data[0].itm_mst_issue_uom;
          list[index]["wko_ls2_mtl_uom"] = Umo;
          setInputFields(list);

          const Price = response.data.data[0].itm_det_issue_price;
          list[index]["wko_ls2_item_cost"] = Price;
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

    if (fieldName == "selectChargeCostCenter") {
      setSelected_ChargeCostCenter(value);
    } else if (fieldName == "selectChargeAccount") {
      setSelected_ChargeAccount(value);
    } else if (fieldName == "setQtyNeeded") {
      setQtyNeeded(value);
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

  // Submit Data in database
  const handleAddButtonClick = async (e) => {
    e.preventDefault();
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
      } else if (inputFields.selectChargeCostCenter === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Charge Cost Center is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.selectChargeAccount === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Charge Account is Required!",
          customClass: {
            container: "swalcontainercustom",
          },
        });
        isValid = false;
      } else if (inputFields.setQtyNeeded === "") {
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
   //  console.log("inputFields____post",inputFields);
      try {
        const response = await httpCommon.post(
          "/insert_word_order_planning_material.php",
          inputFields
        );
        console.log("API Response:", response);
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Material Request!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            setResult([...Result, inputFields]);
            get_workordermaster_material(site_ID, RowID);
            // console.log("inputFields_after",inputFields);

            if (result.isConfirmed) {
              // Call the next function when the user clicks the "OK" button

              removeInputFields();
              handleClose();
            }
          });
        }
      } catch (error) {
        console.error("Error posting form data:", error);
      }
    }
  };
  //Sum calculation


  const totalQty = Array.isArray(Result)
  ? Result.reduce(
      (acc, item) => acc + (parseFloat(item.wko_ls2_qty_needed) || 0),
      0
    )
  : 0;

const totalCost = Array.isArray(Result)
  ? Result.reduce(
      (acc, item) =>
        acc +
        (parseFloat(item.wko_ls2_qty_needed) || 0) *
          (parseFloat(item.wko_ls2_item_cost) || 0),
      0
    )
  : 0;

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
        mtr_mst_wo_no: WorkOrderNo,
        wko_ls2_mtl_uom: "",
        wko_ls2_item_cost: "",
        mtr_ls1_rcv_qty: ".0000",
        mtr_mst_assetno: AssetNo,
        selectStock: "",
        selectStockLocation: "",
        setDescription: "",
        selectChargeCostCenter: "",
        selectChargeAccount: "",
        setQtyNeeded: "",
      },
  
    ]);
    
  };

  useEffect(() => {
   
    if(FormStatus !== "" && FormStatus == "NEW" ){
      get_workordermaster_material_header(site_ID);
    }else{
      get_workordermaster_material(site_ID, RowID);
    }
    getAssetSparesFromLebel();
    getAssetMandatoryfiled();
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

  const handleShow = () => {
         
    if(FormStatus !== "" && FormStatus == "NEW" ){
      Swal.fire({
        icon: "info",
        customClass: {
          container: "swalcontainercustom",
        },
        title: "Please Wait!",
        allowOutsideClick: false,
        text: "Once the Work Order is created, you can then add detailed Material.",
        width:"400px"
      });
      onRowClick("BtnPlanning");
    }else{
      setShow(true);
      setInputFields(updatedInputFields);
       
    }
  };

  //console.log("inputFields____material", inputFields);
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
                Material 
              </div>
              <div style={{fontSize:"14px",marginBottom:"14px"}}>
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
                  marginLeft: "auto", // Push button to the right
                }}
                className="submoduleDiv"
              >
              <Button
                type="button"
                className="SubmoduleAddNewButton"
                disabled={data.statusKey === "CLO"}
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
          //  onClose={handleClose}
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
              Material
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
                //color: (theme) => theme.palette.grey[500],
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
                        selectStock,
                        selectStockLocation,
                        setDescription,
                        selectChargeCostCenter,
                        selectChargeAccount,
                        setQtyNeeded,
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
                             
                              <label className={findCustomizerequiredLabel("wko_ls2_stockno") || "Requiredlabel"}> {findCustomizeLabel("wko_ls2_stockno") ||
                                    "Stock Now:"}</label>
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
                                
                                 placeholder="Select..."
                                 autoComplete="off"
                                
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
                              //onClose={handleCloseModal2}
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
                                sx={{ m: 0, p: 2 }}
                                id="customized-dialog-title"
                                className="dailogTitWork"
                              >
                                <img
                                  src={logo}
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    marginRight: "2px",
                                  }}
                                />
                                Stock No
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
                            {/* End of stock model */}
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                             
                              <label className={findCustomizerequiredLabel("wko_ls2_desc") || "Requiredlabel"}> {findCustomizeLabel("wko_ls2_desc") ||
                                    "Description:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                            
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
                                    
                                  }}
                                  
                                />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={4}
                              style={{ padding: "10px" }}
                            >
                              
                              <label className={findCustomizerequiredLabel("wko_ls2_stk_locn") || "Requiredlabel"}> {findCustomizeLabel("wko_ls2_stk_locn") ||
                                    "Stock Location:"}</label>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Autocomplete
                                options={selected_StockLocation}
                                value={data.selectStockLocation}
                                onChange={(event, value) => {
                                  // setSelected_StockLocation(value || null);
                                }}
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
                              <label className={findCustomizerequiredLabel("wko_ls2_chg_costcenter") || "Requiredlabel"}> {findCustomizeLabel("wko_ls2_chg_costcenter") ||
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
                             
                              <label className={findCustomizerequiredLabel("wko_ls2_chg_account") || "Requiredlabel"}> {findCustomizeLabel("wko_ls2_chg_account") ||
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
                              
                              <label className={findCustomizerequiredLabel("wko_ls2_qty_needed") || "Requiredlabel"}> {findCustomizeLabel("wko_ls2_qty_needed") ||
                                    "Qty Needed:"}</label>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="text"
                                className="Extrasize"
                                fullWidth
                                placeholder="1.000"
                                // onChange={(event) =>
                                //   handleChange(
                                //     index,
                                //     "setQtyNeeded",
                                //     event.target.value
                                //   )
                                // }
                                onChange={(event) => {
                                  const value = event.target.value;
                                  if (value.length === 0 || value[0] !== '0') {
                                    handleNumericInputChange(event, (formattedValue) => {
                                      handleChange(index, "setQtyNeeded", formattedValue);
                                    });
                                  }
                                }}

                                value={setQtyNeeded}
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
                            <Grid item xs={12} md={2}>
                              <div className="col-sm-1 form-label bgClr">
                                EACH
                              </div>
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
            disabled={data.statusKey === "CLOSE"}
            onClick={handleShow}
          >
            + Add Material
          </Button>
        </div> */}
      </div>
    </>
  );
};

export default WorkOrderMaterial;
