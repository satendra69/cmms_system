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
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import Autocomplete from "@mui/material/Autocomplete";
import { useLocation } from "react-router-dom";
import httpCommon from "src/http-common";
import { format, setHours } from "date-fns";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Moment from "moment";
import "moment-timezone";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Iconify from "src/components/iconify";
import logo from "../../../assets/img/credit-card.png";

const MySwal = withReactContent(Swal);
const WorkOrderTimeCard = ({ data, onDataFromSecondComponent }) => {
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
  const [EmpDropData, setEmpDropData] = useState([]);
  const [CreditAccount, setCreditAccount] = useState([]);
  const [selected_CreditAccount, setSelected_CreditAccount] = useState([]);

  const [Button_save, setButton_save] = useState("");

  const [RowID2, setRowID2] = useState("");

  const [AssetNo, setAssetNo] = useState("");
  const [Rate, setRate] = useState("");
  const [Multiplier, setMultiplier] = useState("");
  const [Adder, setAdder] = useState("");
  const [ActualCost, setActualCost] = useState("");
  const [TimeCardNo, setTimeCardNo] = useState("");
  const [isEmpNoEmpty, setIsEmpEmpty] = useState(false);
  // Get Header Data
  const get_workordermaster_timecard = async (site_ID, RowID) => {
    try {
      const response = await httpCommon.get(
        `/get_workordermaster_timecard.php?site_cd=${site_ID}&RowID=${RowID}`
      );

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

    get_workordermaster_timecard(site_ID, RowID);

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
        `get_dropdown.php?site_cd=${site_ID}&type=${type}`
      );
     // console.log("TimeCard Responce____",response);
      if (response.data.status === "SUCCESS") {
        let EmployeeID = response.data.data.Employee_Supervisor_Id.map(
          (item) => ({
            label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
            value: item.emp_mst_empl_id,
          })
        );
        setEmployeeID(EmployeeID);

        let Craft = response.data.data.Employee_Primary_Craft.map((item) => ({
          label: item.crf_mst_crf_cd + " : " + item.crf_mst_desc,
          value: item.crf_mst_crf_cd,
        }));
        // setCraft(Craft);

        let HourType = response.data.data.HoursType.map((item) => ({
          label: item.hours_type_cd,
          value: item.hours_type_cd,
        }));
        setHourType(HourType);

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

        let CreditAccount = response.data.data.account.map((item) => ({
          label: item.account + " : " + item.descs,
          value: item.account,
        }));
        setCreditAccount(CreditAccount);

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

  const renderTableRows = () => {
    return Result.map((result, index) => (
      <TableRow key={index}>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {index + 1}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_assetno}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_empl_id}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_craft}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatDate(result.wko_ls8_datetime1)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {formatDate(result.wko_ls8_datetime2)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_hours_type}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_hrs}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_rate}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_multiplier}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_adder}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_act_cost}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_chg_costcenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_chg_account}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_crd_costcenter}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_crd_account}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.wko_ls8_time_card_no}
        </TableCell>
      </TableRow>
    ));
  };
  const formatDate = (dateObject) => {
    const date = new Date(dateObject.date);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
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
          `TimeCartReateCraftGet.php?site_cd=${site_ID}&empId=${beforeColonValue}`
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
  const handleSubmitTimecard = async () => {
    if (selected_EmployeeID == "" || selected_EmployeeID == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Employee ID is required </div>',
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

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Craft is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
    } else if (TimeCardDate == "" || TimeCardDate == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Time Card Date is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
    } else if (EndTimeCardDate == "" || EndTimeCardDate == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field End Time Card Date is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
    } else if (selected_HourType == "" || selected_HourType == null) {
      MySwal.fire({
        position: "top",
        customClass: {
          popup: "top-center",
          container: "swalcontainercustom TimeCard",
        },

        html: '<div style="display: block; color: #b71d18c7; font-size: 15px; font-weight: 600; line-height: 26px;">Please fill the required field Hour Type is required </div>',
        showConfirmButton: false,
        timer: 4000,
        backdrop: false,
      });
    } else {
      let selectedHourType;
      if (
        !selected_HourType ||
        selected_HourType.length === 0 ||
        !selected_HourType.label
      ) {
        selectedHourType = "";
      } else {
        const selectedHourType2 = selected_HourType.label.split(":");
        selectedHourType = selectedHourType2[0].trim();
      }

      let date_1 = "";
      if (TimeCardDate == "" || TimeCardDate == null) {
        date_1 = "";
      } else {
        date_1 = Moment(TimeCardDate).format("yyyy-MM-DD HH:mm:ss").trim();
      }

      let date_2 = "";
      if (EndTimeCardDate == "" || EndTimeCardDate == null) {
        date_2 = "";
      } else {
        date_2 = Moment(EndTimeCardDate).format("yyyy-MM-DD HH:mm:ss").trim();
      }
      var json_workorderTimeCart = {
        site_cd: site_ID,
        wko_mst_wo_no: WorkOrderNo,
        mst_RowID: RowID,
        assetno: Asset_No,
        selectedEmployeeID: selected_EmployeeID.value,
        selectedCraft:
        selected_Craft && typeof selected_Craft === "object"
            ? selected_Craft.value
            : selected_Craft,
        TimeCardDate: date_1,
        EndTimeCardDate: date_2,
        selected_HourType: selectedHourType,
        ActualHour: ActualHour,
        Rate: Rate,
        Multiplier: Multiplier,
        Adder: Adder,
        ActualCost: ActualCost,
        selected_ChargeCostCenter: selected_ChargeCostCenter.value,
        selected_ChargeAccount: selected_ChargeAccount.value,
        selected_CreditCostCenter: selected_CreditCostCenter.value,
        selected_CreditAccount: selected_CreditAccount.value,
        auditUser: emp_owner,
      };

      try {
        const response = await httpCommon.post(
          "/insert_time_card.php",
          JSON.stringify(json_workorderTimeCart)
        );
        if (response.data.status == "SUCCESS") {
          handleClose();
          get_workordermaster_timecard();
          resetData();
          onDataFromSecondComponent("SubmitFrom");
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops get_sitecode...",
          text: error,
        });
      }
    }
  };

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
                    <img src={logo} style={{ width: "50px", height: "50px" }} />
                  </div>
                  <div
                    className="template-demo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                      Time Card
                    </div>
                    <div className="TimeCartPartCosting">
                      <span style={{ color: "blue" }}>
                        {(totalQty * 1).toFixed(2)}
                      </span>{" "}
                      Total Parts Costing{" "}
                      <span style={{ color: "#19d895" }}>
                        ${totalCost.toFixed(2)}
                      </span>
                    </div>
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
                  <img src={logo} style={{ width: "30px", height: "30px",marginRight: "2px" }} />
                  Time Card
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
                    <Grid
                      container
                      spacing={1.5}
                      className="timeCartPopuplabel"
                    >
                      <Grid item xs={12} md={4}>
                        <label>Employee ID:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={EmployeeID}
                          value={selected_EmployeeID}
                          onChange={(event, value) =>
                            handleEmployeeIDChange(event, value)
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
                        <label>Craft:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={Craft}
                          value={selected_Craft}
                          onChange={(event, value) => {
                            setSelected_Craft(value || null);
                            setRate(value ? value.rate : null);
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
                        <label>Time Card Date:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <DateTimePicker
                          value={TimeCardDate}
                          format="dd/MM/yyyy HH:mm"
                          className="Extrasize"
                          sx={{ fontSize: "0.875rem" }}
                          onChange={(newDate) => {
                            setTimeCardDate(newDate); // Update your state with the new value
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <label>Time Card End Date:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <DateTimePicker
                          value={EndTimeCardDate}
                          format="dd/MM/yyyy HH:mm"
                          className="Extrasize"
                          sx={{ fontSize: "0.875rem" }}
                          onChange={(newDate) => {
                            setEndTimeCardDate(newDate); // Update your state with the new value
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <label>Hour Type:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={HourType}
                          value={selected_HourType}
                          onChange={(event, value) =>
                            handleHourTypeChange(event, value)
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
                        <label>Actual Hour:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          variant="outlined"
                          size="small"
                          className="Extrasize"
                          fullWidth
                          disabled
                          value={ActualHour}
                          onChange={(e) => {
                            setActualHour(e.target.value);
                          }}
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
                            setSelected_ChargeCostCenter(value || null);
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
                            setSelected_ChargeAccount(value || null);
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
                        <label>Credit Cost Center:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={CreditCostCenter}
                          value={selected_CreditCostCenter}
                          onChange={(event, value) => {
                            setSelected_CreditCostCenter(value || null);
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
                        <label>Credit Account:</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={CreditAccount}
                          value={selected_CreditAccount}
                          onChange={(event, value) => {
                            setSelected_CreditAccount(value || null);
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
                        handleSubmitTimecard();
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
              <button
                type="button"
                style={{
                  padding: "5px 10px",
                  background: "none",
                  color: "blue",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={handleShow}
              >
                + Add Time Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkOrderTimeCard;
