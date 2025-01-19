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
import { Bounce, ToastContainer, toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";

import { GiStoneCrafting } from "react-icons/gi";
import { template } from "lodash";
import { Icon } from "@iconify/react";

export default function MrApproverDialog({
  open,
  handleClose,
  setRefetch,
  setMaintenceResult,
  MaintenceResult,
  error2,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
  deleted,
  setDeleted,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [craft, setCraft] = React.useState([]);
  const [sId, setSId] = React.useState([]);
  const [buttonSub, setButtonSub] = React.useState("Add");

  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    emp_ls3_approval_limit: "",
  });

  React.useEffect(() => {
    if (deleted) {
      setSelected_cost("");

      setDeleted(false);
    }
  }, [deleted]);

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

        setCostDrp(formattedStatus);
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  };

  React.useEffect(() => {
    fetchCostCenter();
  }, []);

  // DroupDown States
  const [costDrp, setCostDrp] = React.useState([]);
  const [selected_cost, setSelected_cost] = React.useState("");

  const [checkData, setCheckData] = React.useState({});
  const handleEditClick = (e) => {
    setTextField(e);
  };
  const handleCloseDefault = (e, result) => {
    if (result !== "backdropClick") {
      setTextField("");
      setDefaultModal(false);
    }
  };

  React.useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

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
    console.log("mandatory", mandatory);
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
      const res = MaintenceResult.some(
        (item) => item.emp_ls3_costcenter === selected_cost,
      );

      if (res) {
        let errorMessage = `Duplicate Data Found`;
        setSnackbarOpen(true);
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setError("emp_ls3_costcenter");
      } else {
        const missingField = handleRequiredField(data);
        if (!missingField) {
      

          setMaintenceResult((prev) => [
            ...prev,
            {
              ...data,
              emp_ls3_costcenter: selected_cost,
            },
          ]);
          setData([]);
          handleClose();
          setSelected_cost("");
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
     }
    
  }

    if (value.length > 14) {
      value = value.slice(0, 15);
    }
    setData((pre) => ({
      ...pre,
      [e.target.name]: value,
    }));
    setError("");
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
           Add MR Approval
          </div>

          <div style={{ cursor: "pointer" }} onClick={()=>{
            setData("");
            setError("");
            setSelected_cost("");
            handleClose();
            }}>
            <IconButton color="error">
              <Iconify icon="system-uicons:cross-circle" />
            </IconButton>
          </div>
        </DialogTitle>

        <Divider />
        <DialogContent sx={{ mt: 0.5, p: 2 }}>

            
{/* {
MaintenceResult.map((item)=>(
  <div
  style={{
    boxShadow:
      "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
    borderRadius: "10px",
    padding: "20px",
    marginTop:"5px"
  }}
>
  <Grid container spacing={2} alignItems={"center"}>
 
    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
      <Typography
        variant="subtitle2"
        className={
          findCustomizerequiredLabel("emp_ls3_costcenter")
            ? "red"
            : ""
        }
        // style={{ color: "red" }}
      >
        {findCustomizeLabel("emp_ls3_costcenter") || "Charge Rate"}
      </Typography>
    </Grid>

    <Grid item xs={12} md={8} style={{ padding: "10px" }}>
      <Autocomplete
        options={costDrp}
        value={item.emp_ls3_costcenter}
        sx={{ width: "100%" }}
        // onChange={(event, newValue) => {
        //   if (newValue) {
        //     setSelected_cost(newValue.label);
        //     setError(false);
        //   } else {
        //     setSelected_cost("");
        //   }
        // }}
        renderInput={(params) => (
          <div>
            <TextField
              {...params}
              size="small"
              fullWidth
              placeholder="Select.."
              variant="outlined"
              className={`Extrasize ${
                error === "emp_ls3_costcenter" ? "errorEmpty" : ""
              }`}
              disabled
            />
          </div>
        )}
      />
    </Grid>

  
    <Grid item xs={12} md={4} style={{ padding: "10px" }}>
      <Typography
        variant="subtitle2"
        className={
          findCustomizerequiredLabel("emp_ls3_approval_limit")
            ? "red"
            : ""
        }
        // style={{ color: "red" }}
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
        type="number"
        className={`Extrasize ${
          error === "emp_ls3_approval_limit" ? "errorEmpty" : ""
        }`}
        disabled
        placeholder=".000"
        value={item.emp_ls3_approval_limit}
        // onChange={handleText}
        inputProps={{ style: { textAlign: "right" } }}
      />
    </Grid>
  </Grid>
</div>

))
} */}





          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              borderRadius: "10px",
              padding: "20px",
              marginTop:"5px"
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
                  value={selected_cost}
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
                        placeholder="Select.."
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
                  type="number"
                  className={`Extrasize ${
                    error === "emp_ls3_approval_limit" ? "errorEmpty" : ""
                  }`}
                  placeholder=".000"
                  value={data.emp_ls3_approval_limit}
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
              Add
            </Button>
            <Button
              variant="soft"
              color="error"
              startIcon={<Iconify icon="jam:close" />}
              onClick={(e, r) => {
                setData("");
                handleClose(e, r);
                setError("");
                setSelected_cost("");
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
