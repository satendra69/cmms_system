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
import {
  differenceInMilliseconds,
  differenceInDays,
} from "date-fns";
import { styled } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import { useLocation } from "react-router-dom";
import httpCommon from "src/http-common";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Moment from "moment";
import "moment-timezone";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Iconify from "src/components/iconify";

// Toastfy
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

import logo from "../../../assets/img/credit-card.png";

const MySwal = withReactContent(Swal);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
const WorkOrderMaterialRequest = ({ data, onDataFromSecondComponent }) => {
  let site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const { RowID } = data;
  const { Asset_No } = data;
  const { WorkOrderNo } = data;

  const location = useLocation();
  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [EmployeeID, setEmployeeID] = useState([]);
  const [selected_EmployeeID, setSelected_EmployeeID] = useState([]);

  const [Craft, setCraft] = useState([]);
  const [selected_Craft, setSelected_Craft] = useState([]);

  const [TimeCardDate, setTimeCardDate] = useState(new Date());
  const [EndTimeCardDate, setEndTimeCardDate] = useState(new Date());

  const [HourType, setHourType] = useState([]);
  const [selected_HourType, setSelected_HourType] = useState([]);

  const [ActualHour, setActualHour] = useState("0");

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState(
    []
  );

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  const [CreditCostCenter, setCreditCostCenter] = useState([]);
  const [selected_CreditCostCenter, setSelected_CreditCostCenter] = useState(
    []
  );

  const [CreditAccount, setCreditAccount] = useState([]);
  const [selected_CreditAccount, setSelected_CreditAccount] = useState([]);


  const [Rate, setRate] = useState("");
  const [Multiplier, setMultiplier] = useState("");
  const [Adder, setAdder] = useState("");
  const [ActualCost, setActualCost] = useState("");


  const [Asset, setAsset] = useState("");
  const [StockNo, setStockNo] = useState([]);
  const [selected_StockNo, setSelected_StockNo] = useState([]);

  const [StockLocation, setStockLocation] = useState("");
  const [DESCRIPTION, setDescription] = useState("");

  const [QtyNeed, setQtyNeed] = useState("1.0000");
  const [Uom, setUOM] = useState("");
  const [itemCost, setitemCost] = useState("");
  const [ExtendedCost, setExtendedCost] = useState("");
  const [MaterialRequestNo, setMaterialRequestNo] = useState("");
  const [MRLineNo, setMRLineNo] = useState("");
  const [MRApprovalStatus, setMRApprovalStatus] = useState("");
  const [stockStatus, setstockStatus] = useState("");
  const [issueStatus, setIssueStatus] = useState("");
  const [actualQuantity, setactualQuantity] = useState("");
  const [contractPoNo, setContractPoNo] = useState("");
  const [contractPoLineNo, setContractPoLineNo] = useState("");

  // Get Header Data
  const get_workordermaster_MaterialRequest = async (site_ID, RowID) => {
    try {
      const response = await httpCommon.get(
        `/get_material_request_data.php?site_cd=${site_ID}&RowID=${RowID}`
      );
    //  console.log("response____",response);
      if (response.data.status === "SUCCESS") {
        setHeader(response.data.data.header);
        setResult(response.data.data.result);
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
  useEffect(() => {
    let site_ID = localStorage.getItem("site_ID");

    get_workordermaster_MaterialRequest(site_ID, RowID);

    get_workorder_status(site_ID, "All");
  }, [location]);

 
  const get_workorder_status = async (site_ID, type) => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `get_MR_dropdown_List.php?site_cd=${site_ID}&type=${type}`
      );
     // console.log("TimeCard Responce____",response);
      if (response.data.status === "SUCCESS") {
        
        let ChargeCostCenter = response.data.data.CostCenter.map((item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.costcenter,
        }));
        setChargeCostCenter(ChargeCostCenter);

        let ChargeAccount = response.data.data.account.map((item) => ({
          label: item.account + " : " + item.descs,
          value: item.account,
        }));
        setChargeAccount(ChargeAccount);

        let CreditCostCenter = response.data.data.CostCenter.map((item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.costcenter,
        }));
        setCreditCostCenter(CreditCostCenter);

        let StockNO = response.data.data.StockNo.map((item) => ({
          label: item.itm_mst_stockno + " : " + item.itm_mst_desc,
          value: item.itm_mst_stockno,
        }));
        setStockNo(StockNO);

        //get_dropdown_ParentFlag(site_ID,selected_asset);
        // get_workordermaster_select(site_ID,selected_asset);
        // New_WorkOrderTimeCard();
        Swal.close();
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      // console.error("Error fetching data:", error);
      Swal.close();
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
    };
    return (
      <>
        <TableCell key="select"></TableCell>
        {Object.keys(Header).map((attr) => (
          <TableCell key={attr} style={cellStyle}>
            {attr.toUpperCase()}
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

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const renderTableRows = () => {
    return Result.map((result, index) => (
      
      <TableRow key={index}  onClick={(event) => handleRowClick(result, event)} 
      style={{ cursor: "pointer", transition: "background-color 0.3s" }}
      onMouseEnter={(event) => event.currentTarget.style.backgroundColor = "#f0f0f0"}
      onMouseLeave={(event) => event.currentTarget.style.backgroundColor = "transparent"}>
         
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
          {result.wko_ls2_desc}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_chg_costcenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_chg_account}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_qty_needed}
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
          {result.mtr_mst_status}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_mr_lineno}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_po_no}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_pr_lineno}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls2_act_qty}
        </TableCell>
 
      </TableRow>
    ));
  };


  const handleRowClick = (data) => {
    // console.log("clickRow__",data)
     setShowModal(true);
   };

  const totalQty = Result.reduce(
    (acc, item) => acc + (parseFloat(item.wko_ls8_hrs) || 0),
    0
  );
  const totalCost = Result.reduce(
    (acc, item) =>
      acc +
      (parseFloat(item.wko_ls8_hrs) || 0) *
        (parseFloat(item.wko_ls8_act_cost) || 0),
    0
  );
  const handleEmployeeIDChange = async (event, value) => {
    let site_ID = localStorage.getItem("site_ID");
    setSelected_EmployeeID(value);
    const labelParts = value ? value.label.split(" : ") : [];
    const beforeColonValue = labelParts.length > 0 ? labelParts[0] : "";
    if (beforeColonValue !== "" && beforeColonValue != null) {
      try {
        const response = await httpCommon.get(
          `get_time_cart_reate_craft.php?site_cd=${site_ID}&empId=${beforeColonValue}`
        );

        if (response.data.data.result.length > 0) {
          let Craft = response.data.data.result.map((item) => ({
            label: item.emp_ls1_craft + " : " + item.crf_mst_desc,
            value: item.emp_ls1_craft,
            rate: item.emp_ls1_charge_rate,
          }));
          setCraft(Craft);

          setSelected_Craft(response.data.data.result[0].emp_ls1_craft);
          setRate(response.data.data.result[0].emp_ls1_charge_rate);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops get_sitecode...",
          text: error,
        });
      }
    }
  };

  const handleHourTypeChange = async (event, value) => {
    setSelected_HourType(value);
    const labelParts = value ? value.label.split(" : ") : [];
    const beforeColonValue = labelParts.length > 0 ? labelParts[0] : "";
    if (beforeColonValue !== "" && beforeColonValue != null) {
      try {
        const response = await httpCommon.get(
          `TimeCartHourTypeGet.php?site_cd=${site_ID}&hourstype=${beforeColonValue}`
        );

        if (response.data.data.result.length > 0) {
          setAdder(response.data.data.result[0].hours_type_adder);
          setMultiplier(response.data.data.result[0].hours_type_multiplier);

          const start = new Date(TimeCardDate);
          const end = new Date(EndTimeCardDate);
          // const range = new Moment.range(start, end);

          const msDiff = differenceInMilliseconds(end, start);
          const days = differenceInDays(end, start);
          const hours = Math.floor(msDiff / (1000 * 60 * 60)); // Total hours
          const min = Math.floor(msDiff / (1000 * 60));

          const Min = Math.floor(msDiff / (1000 * 60));
          const act_hour = Math.floor(Min / 60);

          const h = parseFloat(hours);
          const r = parseFloat(Rate);
          const a = parseFloat(response.data.data.result[0].hours_type_adder);
          const m = parseFloat(
            response.data.data.result[0].hours_type_multiplier
          );

          const f3 = act_hour * (r + a) * m;
          setActualCost(f3);
          setActualHour(hours);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);

        Swal.fire({
          icon: "error",
          title: "Oops get_sitecode...",
          text: error,
        });
      }
    }
  };
  const resetData = () => {
    setSelected_ChargeAccount("");
    setSelected_ChargeCostCenter("");
    setSelected_Craft("");
    setSelected_CreditAccount("");
    setSelected_CreditCostCenter("");
    setSelected_EmployeeID("");
    setSelected_HourType("");
    setActualHour("");
  };
  const handleSubmitMaterialReq = async () => {
    if (selected_StockNo == "" || selected_StockNo == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Stock No is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
  
    } else if (selected_Craft == "" || selected_Craft == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Stock Location is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
    } else if (selected_ChargeCostCenter == "" || selected_ChargeCostCenter == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Charge Cost Center is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
    } else if (selected_ChargeAccount == "" || selected_ChargeAccount == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Charge Account is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
    } else if (QtyNeed == "" || QtyNeed == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Qty Needed is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
    } else {
        console.log("selected_ChargeCostCenter____",selected_ChargeCostCenter);

      let selectedStockNo;
      if (
        !selected_StockNo ||
        selected_StockNo.length === 0 ||
        !selected_StockNo.label
      ) {
        selectedStockNo = "";
      } else {
        const selectedStockNo2 = selected_StockNo.label.split(":");
        selectedStockNo = selectedStockNo2[0].trim();
      }

      let AssetNo;
      if (
        !Asset_No ||
        Asset_No.length === 0 
      ) {
        AssetNo = "";
      } else {
        const AssetNo2 = Asset_No.split(":");
        AssetNo = AssetNo2[0].trim();
      }

      var json_workorderMaterialReq = {
        site_cd: site_ID,
        wko_mst_wo_no: WorkOrderNo,
        mst_RowID: RowID,
        assetno: AssetNo,
        selectedStockNo: selectedStockNo,
        selectedCraft:
        selected_Craft && typeof selected_Craft === "object"
            ? selected_Craft.value
            : selected_Craft,
        selected_ChargeCostCenter: selected_ChargeCostCenter && typeof selected_ChargeCostCenter === "object"
        ? selected_ChargeCostCenter.value
        : selected_ChargeCostCenter,

        selected_ChargeAccount:  selected_ChargeAccount && typeof selected_ChargeAccount === "object"
        ? selected_ChargeAccount.value
        : selected_ChargeAccount,

        desc:DESCRIPTION,
        qty:QtyNeed,
        auditUser: emp_owner,
      };
      console.log("json_workorderTimeCart____",json_workorderMaterialReq);
    //   try {
    //     const response = await httpCommon.post(
    //       "/insert_mr.php",
    //       JSON.stringify(json_workorderMaterialReq)
    //     );
    //     console.log("mr_res____",response);
    //     if (response.data.status == "SUCCESS") {
    //       handleClose();
    //       get_workordermaster_MaterialRequest();
    //       resetData();
    //       onDataFromSecondComponent("SubmitFrom");
    //     }
    //   } catch (error) {
    //     Swal.fire({
    //       icon: "error",
    //       title: "Oops get_sitecode...",
    //       text: error,
    //     });
    //   }
    }
  };
  const isResultNotEmpty = Result && Object.keys(Result).length > 0;

  useEffect(() => {
    const fetchData = async () => {
      if (selected_StockNo && selected_StockNo.value) {
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
            `/get_material_request_select_form_data.php?site_cd=${site_ID}&itm_mst_stockno=${selected_StockNo.value}`
          );
       
          if(response.data.status === 'SUCCESS'){
            setSelected_Craft(response.data.data[0].itm_mst_mstr_locn);
            setDescription(response.data.data[0].itm_mst_desc); 
            setSelected_ChargeCostCenter(response.data.data[0].itm_mst_costcenter); 
            setSelected_ChargeAccount(response.data.data[0].itm_mst_account); 
          }
          // Handle the response data here
          Swal.close(); // Close the Swal popup
        } catch (error) {
          console.error("Error fetching form data:", error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      }
    };

    fetchData();
  }, [selected_StockNo, site_ID]);


  return (
    <>
      <div>
        <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "8px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
              paddingBottom: "10px",
            }}
          >
            <div>
              <div style={{ backgroundColor: "white" }}>
                <div
                  className="template-demo"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <Iconify
                        icon="iconoir:tools"
                        style={{ marginRight: "0px" ,width: "25px", height: "25px" }}
                    />
                   
                  </div>
                  <div
                    className="template-demo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                      Material Request
                    </div>
                    {/* <div className="TimeCartPartCosting">
                      <span style={{ color: "blue" }}>
                        {(totalQty * 1).toFixed(2)}
                      </span>{" "}
                      Total Parts Costing{" "}
                      <span style={{ color: "#19d895" }}>
                        ${totalCost.toFixed(2)}
                      </span>
                    </div> */}
                  </div>
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
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={show}
                maxWidth="lg"
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
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  <Iconify
                        icon="iconoir:tools"
                        style={{ marginRight: "5px" ,width: "25px", height: "25px" }}
                    />
                  Add Material Request
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
                    <Grid
                      container
                      spacing={1.5}
                      className="timeCartPopuplabel"
                    >
                      <Grid item xs={12} md={4}>
                        <label>Stock No:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={StockNo}
                          value={selected_StockNo}
                          onChange={(event, value) =>
                            setSelected_StockNo(value)
                          }
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
                      <Grid item xs={12} md={4}>
                        <label>Stock Location:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={Craft}
                          value={selected_Craft}
                          onChange={(event, value) => {
                            setSelected_Craft(value || null);
                          ///  setRate(value ? value.rate : null);
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
                      
                      <Grid item xs={12} md={4}>
                        <label>Charge Cost Center:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                      <Autocomplete
                          options={ChargeCostCenter}
                          value={selected_ChargeCostCenter}

                          onChange={(event, value) => {
                            setSelected_ChargeCostCenter(value);
                          
                            
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
                      <Grid item xs={12} md={4}>
                        <label>Charge Account:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={ChargeAccount}
                          value={selected_ChargeAccount}
                          onChange={(event, value) => {
                            setSelected_ChargeAccount(value);
                          
                            
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
                      <Grid item xs={12} md={4}>
                        <label>Qty Needed:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          variant="outlined"
                          size="small"
                          className="Extrasize"
                          fullWidth
                          
                          value={QtyNeed}
                          onChange={(e) => {
                            setQtyNeed(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <label>Description:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        placeholder="Descriptions..."
                        minRows={6.5}
                        fullWidth
                         value={DESCRIPTION}
                       
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                        style={{ width: '100%' }}
                        className="TxtAra"
                    />
                      </Grid>
                      
                    </Grid>
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "10px",
                  }}
                >
                  <div className="timeCartSubmit">
                    <Button
                      variant="contained"
                      color="primary"
                      type="button" // Remove this line
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmitMaterialReq();
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </DialogActions>
              </Dialog>
            </div>
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
                onClick={handleShow}
                 >
                + Add Material
             </Button>
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
                      icon="iconoir:tools"
                      width="25px" height="25px"
                      style={{fontSize: "24px", marginRight: "5px"  }}
                    />
          <div>Material Request</div> {/* Title */}
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
          //  color: (theme) => theme.palette.grey[500],
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
              {isResultNotEmpty && (
               
                    <div className="row my-3 tb">
                     
                      <Grid
                        container
                        spacing={1.5}
                        className="timeCartPopuplabel"
                      >
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Asset No:</label>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_assetno}
                          />
                        </Grid>

                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Stock No:</label>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_stockno}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Stock Location:</label>
                        </Grid>

                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_stk_locn}
                          
                          />
                        </Grid>

                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Description:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_desc}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Charge Cost Center:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_chg_costcenter}
                          //  onChange={(event) => setQtyNeeded(event.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Charge Account:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_chg_account}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Qty Needed:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_qty_needed}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>UOM:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_mtl_uom}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Item Cost:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_item_cost}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Extended Cost:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value="0.0000"
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Material Request No:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_mr_no}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>MR Line No:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_pr_lineno}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>MR Approval Status:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].mtr_mst_status}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Stock Status:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value="Shortage"
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Issue Status:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value="Not Issued"
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Actual Quantity:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_act_qty}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Contract Po No:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_pr_no}
                          />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                          <label>Contract Po Line:</label>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <TextField
                            variant="outlined"
                            size="small"
                            className="Extrasize"
                            fullWidth
                            disabled
                            value={Result[0].wko_ls2_pr_lineno}
                          />
                        </Grid>
                      </Grid>
                    </div>
              )}
              
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions
        style={{
          display: "flex",
          justifyContent: "flex-end",
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
      </DialogActions>
      </BootstrapDialog>

        </div>
       

      </div>
     
    </>
  );
};

export default WorkOrderMaterialRequest;
