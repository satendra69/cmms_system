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
  Tooltip,
} from "@mui/material";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import Moment from "moment";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Iconify from "src/components/iconify";
//import WorkStockNoPopupData from "./WorkStockNoPopupData";
import WorkStockNoPopupData from "src/sections/maintenance/component_module/Planning/WorkStockNoPopupData";
//import logo from "../../../../assets/img/screw.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { MdDeleteOutline } from "react-icons/md";
import PrSectionDialog from "./PrSectionDialog"
import httpCommon from "src/http-common";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const PrSection = ({ onRowClick, data,setData }) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [MaintenceResult, setMaintenceResult] = React.useState([]);
  const [textField, setTextField] = useState("");
  const [show, setShow] = useState(false);
 
console.log("MaintenceResult",MaintenceResult)

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

  const [TotalOh, setTotalOh] = useState("");
  const [QtyNeeded, setQtyNeeded] = useState("");


  const [StockLocation, setStockLocation] = useState([]);
  const [selected_StockLocation, setSelected_StockLocation] = useState([]);
  const [dialog, setDialog] = useState(false);

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
 


  const [ChargeAccount, setChargeAccount] = useState([]);
  const [DefaultModal, setModalDefault] = useState(false);

  
  

  const location = useLocation();

  const [Button_save, setButton_save] = useState("");

  const [RowID, setRowID] = useState("");
  const [RowID2, setRowID2] = useState("");
  const [WorkOrderNo, setWorkOrderNo] = useState(data?.WorkOrderNo || "");
  const [selected_Charge_Cost_Center, setselected_Charge_Cost_Center] =
    useState(data?.selected_Charge_Cost_Center);

  //const [AssetNo, setAssetNo] = useState(data.Asset_No.split(' : ')[0]);
  const [AssetNo, setAssetNo] = useState();
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

const handleDeleteRow=(row)=>{
  setMaintenceResult(prev => prev.filter(item => item !== row))
}



  useEffect(() => {
    get_Asset_Spares(site_ID, RowID);
    // get_workorder_status(site_ID, "All", location.state.select);
  }, [location]);

  // First Api
  const get_Asset_Spares = async (site_ID, RowID) => {
    // Swal.fire({
    //   title: "Please Wait!",
    //   allowOutsideClick: false,
    //   customClass: {
    //     container: "swalcontainercustom",
    //   },
    // });
    // Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `/get_Asset_Spares.php?site_cd=${site_ID}&RowID=${RowID}`
      );
     //  console.log("response____Asset_Spares___", response);
      if (response.data.status === "SUCCESS") {
        setHeader(response.data.data.header);
        setResult(response.data.data.result);
        Swal.close();
      }
      // } else {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Oops...",
      //     text: response.data.message,
      //   });
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Swal.fire({
      //   icon: "error",
      //   title: "Oops get_sitecode...",
      //   text: error,
      // });
    }
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
        {/* <TableCell key="select" ></TableCell>
        {Object.keys(Header).map((attr) => (
          <TableCell key={attr} style={cellStyle}>
            {attr.toUpperCase()}
          </TableCell>
        ))} */}
 <TableCell key="select" >Action</TableCell>
 <TableCell key="select">Craft</TableCell>
 <TableCell key="select">Supervisior Id</TableCell>
 <TableCell key="select">Pay Rate</TableCell>
 <TableCell key="select">Charge Rate</TableCell>

      </>
    );
  };

  //Body
  const renderTableRows = () => {

    // return MaintenceResult.map((result, index) => (
    //   <TableRow key={index} onClick={(event) => handleRowClick(result, event)} 
    //   style={{ cursor: "pointer", transition: "background-color 0.3s" }}
    //   onMouseEnter={(event) => event.currentTarget.style.backgroundColor = "#f0f0f0"}
    //   onMouseLeave={(event) => event.currentTarget.style.backgroundColor = "transparent"}
    //   >
    //     <TableCell style={{ padding: "5px", textAlign: "center" }}>
    //       {index + 1}
    //     </TableCell>
    //     <TableCell style={{ padding: "5px", textAlign: "center" }}>
    //       {result.ast_ls1_stock_no}
    //     </TableCell>
    //     <TableCell style={{ padding: "5px", textAlign: "center" }}>
    //       {result.ast_ls1_varchar1}
    //     </TableCell>
    //     <TableCell style={{ padding: "5px", textAlign: "center" }}>
    //       {result.itm_mst_desc}
    //     </TableCell>
    //     <TableCell style={{ padding: "5px", textAlign: "center" }}>
    //       {result.ast_ls1_qty_needed}
    //     </TableCell>
    //     <TableCell style={{ padding: "5px", textAlign: "center" }}>
    //       {result.itm_mst_ttl_oh}
    //     </TableCell>
       
    //   </TableRow>
    // ));

   return ( 
  
   
    MaintenceResult.map((item)=>(
      <TableRow>
      <TableCell >
      <Tooltip title="Delete" onClick={()=>handleDeleteRow(item)}>
  <IconButton>
  <MdDeleteOutline /> 
  </IconButton>
</Tooltip>
    
  </TableCell>
  <TableCell >
          {item.craft}
  </TableCell>
  <TableCell >
  {item.s_Id}
  </TableCell>
  <TableCell>
  {item.pay_rate}
  </TableCell>
  <TableCell >
        {item.charge_rate}
  </TableCell>
  
  
      </TableRow>
    )) 
 )


  };

  const handleRowClick = (data) => {
   // console.log("clickRow__",data)
    setRowID2(data.RowID);
    setStockNo(data.ast_ls1_stock_no);
    setPartNo(data.ast_ls1_varchar1);
    setDescription(data.ast_ls1_desc);
    setQtyNeeded(data.ast_ls1_qty_needed);
    setTotalOh(data.itm_mst_ttl_oh);

    setShowModal(true);
  };
  const resetData = () => {
    setSelected_StockNo("");
    setPartNo("");
    setTotalOh("");
    setmodalRowDt("");
    setDescription("");
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
      selectStock: "",
      setDescription: "",
      setPartNo:"",
      setTotalOh: "",
      setQtyNeeded:"",
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
    removeInputFields();
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
  const handleCancelClick = (name) => {
    setModalDefault(false);
    setData((pre) => ({
      ...pre,
      [name]: "",
    }));
  };

  const handleEditClick = (e) => {
    setModalDefault(!DefaultModal);
    setTextField(e);
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
          "/get_Asset_StockNo_dataMaterial.php?site_cd=" +
            site_ID +
            "&itm_mst_stockno=" +
            rowData
        );
        if (response.data.status === "SUCCESS") {
         
          setGetStockNo(response.data.data);
          setStockNo(modalRowDt + ":" + response.data.data[0].itm_mst_desc);

          
          const list = [...inputFields];

          const stockDt = modalRowDt;
          list[index]["selectStock"] = stockDt;
          setInputFields(list);

          const newData = response.data.data[0].itm_mst_desc;
          list[index]["setDescription"] = newData;
          setInputFields(list);

          const newData2 = response.data.data[0].itm_mst_partno;
          list[index]["setPartNo"] = newData2;
          setInputFields(list);

          const newData3 = response.data.data[0].itm_det_ttl_oh;
          list[index]["setTotalOh"] = newData3;
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

    if (fieldName == "setQtyNeeded") {
      setQtyNeeded(value);
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
      //console.log("inputFields____post",inputFields);
      try {
        const response = await httpCommon.post(
          "/insert_AssetSparesTabData.php",
          inputFields
        );
      
        if (response.data.status === "SUCCESS") {
          Swal.close();
          Swal.fire({
            title: "Asset Spare Request!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            setResult([...Result, inputFields]);
            get_Asset_Spares(site_ID, RowID);
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
    var json_UpdateAsset = {
      site_cd: site_ID,
      PartNo:PartNo.trim(),
      QtyNeeded:QtyNeeded.trim(),
      RowID:RowID2,
      auditUser:emp_mst_login_id,
    }
    //update_asset_Specification
    try {
      const response = await httpCommon.post(
        "/update_asset_Spares.php",
        JSON.stringify(json_UpdateAsset)
      );
    //  console.log("json_Asset Data", response);
      if (response.data.status === "SUCCESS") {
         Swal.close();
        
         Swal.fire({
           icon: "success",
           customClass: {
             container: "swalcontainercustom",
           },
           title: response.data.status,
           text: response.data.message,
         }).then((result) => {
          setResult([...Result, inputFields]);
          get_Asset_Spares(site_ID, RowID);
    
          if (result.isConfirmed) {
             handleCloseModal();
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

  const handleClick = (e, result) => {
    if (result !== "backdropClick") {
      setDialog(!dialog);
    }
  };

  
  return (
    <>
      <div>
        <div style={{ paddingBottom: "20px", backgroundColor: "white" }}>
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginRight: "5px" }}>
            <Iconify
                              icon="wpf:maintenance"
                              style={{ marginRight: "4px" }}
            />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
         PR Approver
              </div>
            
            </div>
          </div>
        </div>

{/* Table start here */}

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

        {/* Table end here */}

        <PrSectionDialog
          open={dialog}
          handleClose={handleClick}
          setMaintenceResult={setMaintenceResult}
          
        
        />

      


        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            type="button"
            className="tabAddButton"
            onClick={()=>setDialog(true)}
          >
            + Add New 
          </Button>
        </div>
      </div>

      {/*  Row Click to open model popup */}


    </>
  );
};

export default PrSection;
