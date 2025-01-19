import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
import {
  Autocomplete,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";

import { GiStoneCrafting } from "react-icons/gi";
import { template } from "lodash";

export default function MrApproverDialogUpdate({
  open,
  handleClose,
  setRefetch,
  setMaintenceResult,
  RowIDProp,
  state,
  rowData,
  MaintenceResult,
  error2,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [buttonSub, setButtonSub] = React.useState("Add");

  const [craft, setCraft] = React.useState([]);
  const [sId, setSId] = React.useState([]);

  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    emp_ls3_costcenter: "",
    row_id: "",
  });
  const [temp, setTemp] = React.useState({});

  // fetch Craft Droup Down
  const fetchCostCenter = async () => {
    try {
      const response = await httpCommon.get(
        "/get_cost_center_emp.php?site_cd=" + site_ID,
      );

      if (response.data) {
        const craft = response.data.data.Cost_Center;
        setCraft(craft);

        // Format the data to { label, value }
        const formattedStatus = craft.map((item) => ({
          label: `${item.costcenter} : ${item.descs}`,
          value: `${item.costcenter} : ${item.descs}`,
        }));

        const findSelected = craft.find(
          (item) => item.costcenter === rowData.emp_ls3_costcenter,
        );

        if (findSelected) {
          setSelected_cost(findSelected.costcenter + ":" + findSelected.descs);
          setSelected_cost_temp(
            findSelected.costcenter + ":" + findSelected.descs,
          );
        }

        setCostDrp(formattedStatus);
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  };

  React.useEffect(() => {
    fetchCostCenter();
  }, [rowData]);

  // DroupDown States
  const [costDrp, setCostDrp] = React.useState([]);
  const [selected_cost, setSelected_cost] = React.useState("");
  const [selected_cost_temp, setSelected_cost_temp] = React.useState("");

  // DroupDown States SuperVisor Id
  const [sIdDrp, setSIdDrp] = React.useState([]);
  const [selected_sId, setSelected_sId] = React.useState("");

  // const filterResult = MaintenceResult.find(
  //   (item) => item.RowID === rowData.RowID,
  // );
  const formatNumber = (number) => {
    if (number == null) {
      return '';
    }
  
    let [integerPart, decimalPart] = number.toString().split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
  
    return `${integerPart}.${decimalPart}`;
  };
  const handleNumericInputChange2 = (e, setterFunction) => {
    let { value } = e.target;
    if (value.length >= 19) {
      return; 
    }
    value = value.replace(/[^0-9.]/g, '');
    value = value.slice(0, 18); 
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
        if (integerPart2.length > 15) {
          integerPart2 = integerPart2.slice(0, 15) + '.' + integerPart2.slice(15, 18);
        }
        let decimalPart2 = parts[1] ? parts[1].slice(0, 2) : '';
        const formattedValue2 = decimalPart2 ? `${integerPart2}.${decimalPart2}` : integerPart2;
        setterFunction(formattedValue2);
   //     setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
  //  setErrorField(null);
  };

  React.useEffect(() => {
    const filterResult = MaintenceResult.find(
      (item) =>
        item.RowID === rowData.RowID &&
        item.RowID !== undefined &&
        item.RowID !== "",
    );

    if (RowIDProp && state && filterResult) {
      setData((pre) => ({
        ...pre,

        emp_ls3_approval_limit:
          filterResult && filterResult.emp_ls3_approval_limit
            ? formatNumber(filterResult.emp_ls3_approval_limit)
            : "",
        RowID: rowData && rowData.RowID ? rowData.RowID : "",
      }));
      setTemp((pre) => ({
        ...pre,

        emp_ls3_approval_limit:
          filterResult && filterResult.emp_ls3_approval_limit
            ? formatNumber(filterResult.emp_ls3_approval_limit)
            : "",
        RowID: rowData && rowData.RowID ? rowData.RowID : "",
      }));

      setSelected_cost(
        filterResult && filterResult.emp_ls3_costcenter
          ? filterResult.emp_ls3_costcenter
          : "",
      );

      setSelected_cost_temp(
        filterResult && filterResult.emp_ls3_costcenter
          ? filterResult.emp_ls3_costcenter
          : "",
      );
    } else if (rowData) {
      setData((pre) => ({
        ...pre,
        emp_ls3_approval_limit:
          rowData && rowData.emp_ls3_approval_limit
            ? rowData.emp_ls3_approval_limit
            : "",
      }));
      setTemp((pre) => ({
        ...pre,

        emp_ls3_approval_limit:
          rowData && rowData.emp_ls3_approval_limit
            ? rowData.emp_ls3_approval_limit
            : "",
      }));
      setSelected_cost_temp(rowData.emp_ls3_costcenter);
      setSelected_cost(rowData.emp_ls3_costcenter);
    }
  }, [rowData]);

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get("/get_cost_center_cf_label.php");

        if (response.data.status === "SUCCESS") {
          setGroupLabel(response?.data?.user_group?.MandatoryField);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);

  const handleRequiredField = (body) => {
    const mandatory = groupLabel.filter(
      (item) => item.cf_label_required === "1",
    );

    let missingFields = mandatory.find(
      (item) =>
        !body.hasOwnProperty(item.column_name) ||
        body[item.column_name] === null ||
        body[item.column_name] === undefined ||
        body[item.column_name] === "",
    );

    if (missingFields) {
      const errorMessage = `Please fill the required field: ${missingFields.customize_label}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError(missingFields.column_name);
      return true;
    }

    return false;
  };

  const handleSubmitForm = async () => {
    if (!selected_cost) {
      const errorMessage = `Please fill the required field: Cost Center`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError("emp_ls3_costcenter");
    } else if (!data.emp_ls3_approval_limit) {
      const errorMessage = `Please fill the required field: Approval Limit`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError("emp_ls3_approval_limit");
    } else {
      // const trimed_craft = selected_cost.replace(/ .*/, "").trim();

      const existingRecordIndex = MaintenceResult.findIndex(
        (item) => item.emp_ls3_costcenter === rowData.emp_ls3_costcenter,
      );

      const res = MaintenceResult.some((item, index) => {
        return (
          index !== existingRecordIndex &&
          item.emp_ls3_costcenter === selected_cost
        );
      });

      if (res) {
        let errorMessage = `Duplicate Data Found`;
        setSnackbarOpen(true);
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setError("emp_ls3_costcenter");
      } else {
        const missingField = handleRequiredField(data);

        if (!missingField) {
          const trimed_sId = selected_sId.replace(/ .*/, "").trim();

          // Check if there is an existing record with the same condition
          const existingRecordIndex = MaintenceResult.findIndex(
            (item) => item.emp_ls3_costcenter === rowData.emp_ls3_costcenter,
          );

          if (existingRecordIndex !== -1) {
            // Replace the existing record with the new data
            setMaintenceResult((prev) => {
              // Clone the previous array
              const updatedResults = [...prev];

              // Update the specific record
              updatedResults[existingRecordIndex] = {
                ...updatedResults[existingRecordIndex],
                ...data,
                mst_RowID: rowData.mst_RowID,
                emp_ls3_costcenter: selected_cost,
              };

              return updatedResults;
            });
          } else {
            // Add new data if no existing record found
            setMaintenceResult((prev) => [...prev, data]);
          }

          handleClose();
        }
      }
    }
  };
  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName,
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.some(
      (item) =>
        item.column_name === columnName && item.cf_label_required === "1",
    );

    return foundItem;
  };
  const handleData = (e) => {
    const value = e.target.value;
    setData((pre) => ({
      ...pre,
      [e.target.name]: value,
    }));
  };
  // handleCancel
  const handleCancelClick = (name) => {
    // setModalDefault(false);

    setData((pre) => ({
      ...pre,
      [name]: "",
    }));
  };

  // handle text
  const handleText = (e) => {
    let value = e.target.value;
    if (e.target.name === "emp_ls3_approval_limit" ||e.target.name === "emp_ls1_charge_rate" ) {
  
      if (value == 0 ) {
        setData((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
      return
     }else{
      handleNumericInputChange2(e, (formattedValue) => {
        setData((prev) => ({
          ...prev,
          [e.target.name]: formattedValue,
        }));
      });
      return;
    }
    
  }
  
    setData((pre) => ({
      ...pre,
      [e.target.name]: value,
    }));
  };
  const findMaintence = (key) => {
    const findData = MaintenceResult.find(
      (item) => item[key] !== undefined && item[key] === temp[key],
    );

    return findData ? findData[key] : "";
  };

  React.useEffect(() => {
    if (selected_cost || selected_cost_temp) {
      findCost("emp_ls3_costcenter"); 
    }
  }, [selected_cost, selected_cost_temp]);

  const findCost = (key) => {
    let findData;
    if (selected_cost) {
      findData = MaintenceResult.find(
        (item) => item[key] !== undefined && item[key] === selected_cost_temp,
      );
    }
    return findData ? findData[key] : "";
  };


  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Iconify
              icon="arcticons:autotools"
              style={{ marginRight: "4px", height: "28px", width: "28px" }}
            />
          Update MR Approval
          </div>

          <div style={{ cursor: "pointer" }} onClick={()=>{
             setError("");
             setData(temp);
             setSelected_cost(selected_cost_temp);
              handleClose()
            }}>
            <IconButton color="error">
              <Iconify icon="system-uicons:cross-circle" />
            </IconButton>
          </div>
        </DialogTitle>

        <Divider />
        <DialogContent sx={{ mt: 0.5, p: 2 }}>
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "10px",
            }}
          >
            <Grid container spacing={2} alignItems={"center"}>
              {/* Cost Center */}
              <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                <Typography
                  variant="subtitle2"
                  className={
                    findCustomizerequiredLabel("emp_ls3_costcenter")
                      ? "red"
                      : ""
                  }
                  style={{ color: "red" }}
                >
                  {findCustomizeLabel("emp_ls3_costcenter") || "Charge Rate"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                <Autocomplete
                  options={costDrp}
                  // value={selected_cost}
                  value={selected_cost ?? findCost("emp_ls3_costcenter", 1)}
                  sx={{ width: "100%" }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setSelected_cost(newValue.label);
                      setError(false);
                    } else {
                      setSelected_cost("");
                    }
                  }}
                  renderInput={(params) => (
                    <div>
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        placeholder="Select..."
                        variant="outlined"
                        className={`Extrasize ${
                          error === "emp_ls3_costcenter" ? "errorEmpty" : ""
                        }`}
                      />
                    </div>
                  )}
                />
              </Grid>

              {/*charge rate*/}
              <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                <Typography
                  variant="subtitle2"
                  className={
                    findCustomizerequiredLabel("emp_ls3_approval_limit")
                      ? "red"
                      : ""
                  }
                  style={{ color: "red" }}
                >
                  {findCustomizeLabel("emp_ls3_approval_limit") ||
                    "Approval Limit"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  variant="outlined"
                  name="emp_ls3_approval_limit"
                  size="small"
                  type="text"
                  className={`Extrasize ${
                    error === "emp_ls3_approval_limit" ? "errorEmpty" : ""
                  }`}
                  placeholder=".000"
                  value={
                    data.emp_ls3_approval_limit ??
                    findMaintence("emp_ls3_approval_limit", 1)
                  }
                  onChange={handleText}
                  inputProps={{ style: { textAlign: "right" } }}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <Divider style={{ marginTop: "10px" }} />
        <DialogActions sx={{ padding: "12px 16px" }}>
          <div
            className="buttons"
            style={{
              marginLeft: "auto",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              // component={RouterLink}
              // onClick={onClickChangeComplete}
              variant="contained"
              startIcon={<Iconify icon="mingcute:save-fill" />}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                marginRight: "10px",
              }}
              onClick={handleSubmitForm}
            >
              Update
            </Button>
            <Button
              variant="soft"
              color="error"
              startIcon={<Iconify icon="jam:close" />}
              onClick={(e, r) => {
                handleClose(e, r);
                setError("");
                setData(temp);
                setSelected_cost(selected_cost_temp);
              }}
            >
              Close
            </Button>
          </div>
        </DialogActions>
        {/* <ToastContainer /> */}
      </Dialog>
    </>
  );
}
