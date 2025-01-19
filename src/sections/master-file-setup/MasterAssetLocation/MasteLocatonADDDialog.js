import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { BsCassette } from "react-icons/bs";
import { Icon } from "@iconify/react";

export default function MasteLocatonADDDialog({
  open,
  handleClose,
  setRefetch,
  tableData,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [error2, setError2] = React.useState("");
  const [diableToggle, setDisableToggle] = React.useState(false);
  const [data, setData] = React.useState({
    ast_loc_ast_loc: "",
    ast_loc_desc: "",
    ast_loc_wr_prefix: "",
    ast_loc_wr_counter: "",
    ast_loc_wo_prefix: "",
    ast_loc_wo_counter: "",
    ast_loc_pm_prefix: "",
    ast_loc_pm_counter: "",
  });

  const [checkData, setCheckData] = React.useState({
    ast_loc_wr_option: 0,
    ast_loc_wo_option: 0,
    ast_loc_pm_option: 0,
    ast_loc_disable_flag: 0,
  });

  const [counter, setCounter] = React.useState({
    wrCounter: "100001",
    woCounter: "100001",
    pmCounter: "100001",
  });

  const handelCounter = (e) => {
    setCounter((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_asset_location_mandatoryfilled.php"
        );

        if (response.data.status === "SUCCESS") {
          setGroupLabel(response.data.asset_loc.MandatoryField);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);

  const handleRequiredField = (body) => {
    const mandatoryFields = groupLabel.filter(
      (item) => item.cf_label_required === "1"
    );

    const missingFields = mandatoryFields.find(
      (item) =>
        !body.hasOwnProperty(item.column_name) ||
        body[item.column_name] === null ||
        body[item.column_name] === undefined ||
        body[item.column_name] === ""
    );

    if (missingFields) {
      setError2(missingFields.column_name);
      toast.error(
        `Please fill the required field: ${missingFields.customize_label}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          style: {
            width: "400px",
          },
        }
      );
      return true;
    }

    return false;
  };

  const handleErrorToast = (msg) => {
    toast.error(`Please fill the required field: ${msg}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      style: {
        width: "400px",
      },
    });
  };

  const handleSubmitForm = async () => {
    if (error) {
      toast.error(`Duplicate Data Found in the Database`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
      setError2("ast_loc_ast_loc");
    } else if (!data.ast_loc_ast_loc) {
      setError2("ast_loc_ast_loc");
      handleErrorToast("Asset Location");
    } else if (!data.ast_loc_desc) {
      setError2("ast_loc_desc");
      handleErrorToast("Description");
    } else {
      const body = {
        ...checkData,
        ...data,
        ast_loc_wr_counter:
          counter && counter.wrCounter ? counter.wrCounter : "100001",
        ast_loc_wo_counter:
          counter && counter.woCounter ? counter.woCounter : "",
        ast_loc_pm_counter:
          counter && counter.pmCounter ? counter.pmCounter : "",
        site_cd: site_ID,
      };

      const missingField = handleRequiredField(body);

      if (!missingField) {
        try {
          const response = await httpCommon.post(
            `/insert_master_asset_locaton.php`,
            body
          );

          if (response.data.status == "SUCCESS") {
            handleClose();
            Swal.fire({
              title: "Success",
              text: "New Record Created",
              icon: "success",
              confirmButtonText: "OK",
              timer: 2000,
            }).then(() => {
              setData("");
              setRefetch(true);
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const useStyles = makeStyles({
    dialogCard: {
      boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
    },
  });

  // customize label

  const findCustomizeLabel = (columnName) => {
    if (groupLabel) {
      const matchingColumn = groupLabel.find(
        (item) => item.column_name === columnName
      );
      console.log("match", matchingColumn);
      return matchingColumn ? matchingColumn.customize_label : "";
    }
  };
  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.some(
      (item) =>
        item.column_name === columnName && item.cf_label_required === "1"
    );
    return foundItem;
  };

  const handleError = () => {
    if (error) {
      toast.error(`Duplicate Data Found in the Database`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
      setError2("ast_loc_ast_loc");
      setDisableToggle(true);
    } else return;
  };

  const handleData = (e) => {
    const value = e.target.value;
    setError2("");
    if (e.target.name == "ast_loc_ast_loc") {
      if (value.length < 50) {
        const res = tableData.find(
          (item) => item.ast_loc_ast_loc === value.toUpperCase()
        );

        if (res) {
          setError(true);
        } else {
          setDisableToggle(false);
          setError(false);
        }
        setData((pre) => ({
          ...pre,
          [e.target.name]: value.toUpperCase(),
        }));
      }
    } else {
      setData((pre) => ({
        ...pre,
        [e.target.name]: value,
      }));
    }
  };

  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // className="shadow90"
      // classes={{ paper: classes.dialogCard }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", gap: 5, alignItems: "center" }}
      >
        <BsCassette size={24} />
        Asset Location
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2} style={{ padding: 2 }}>
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {findCustomizeLabel("ast_loc_ast_loc") || "loading..."}
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="ast_loc_ast_loc"
                  size="small"
                  className={`${
                    error2 === "ast_loc_ast_loc" ? "errorEmpty" : ""
                  }`}
                  value={data.ast_loc_ast_loc}
                  onChange={handleData}
                  fullWidth
                  inputProps={{ maxLength: 50 }}
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {findCustomizeLabel("ast_loc_desc") || "loading..."}
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  name="ast_loc_desc"
                  minRows={6.5}
                  disabled={diableToggle ? true : false}
                  onClick={handleError}
                  value={data.ast_loc_desc}
                  onChange={handleData}
                  className={`TxtAra ${
                    error2 === "ast_loc_desc" ? "errorEmpty" : ""
                  }`}
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} mt={-2}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>

            <Typography style={{fontWeight:"600",fontSize:"13px",display:"flex",alignItems:"center"}}
              className={findCustomizerequiredLabel("ast_loc_disable_flag")?"red":""}
            
              
              >{findCustomizeLabel("ast_loc_disable_flag") || "loading..."}   
              <Checkbox
                    onChange={(e) => setCheckData((pre)=>({...pre,
                      ast_loc_disable_flag:e.target.checked}))}
                    disabled={diableToggle ? true : false}
                    onClick={handleError}
                    checked={Number(checkData.ast_loc_disable_flag)}
                  />
                  
                  </Typography>
             
            </Stack>
          </Grid>
        </Grid>

        {/* auto number grid */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "10px 0",
          }}
        >
          <Icon
            icon="ic:baseline-auto-mode"
            width="1.2rem"
            height="1.2rem"
            style={{ color: "gray" }}
          />
          <Typography style={{ fontWeight: "600", color: "gray" }}>
            Auto Number
          </Typography>
          <Divider />
        </div>

        <div style={{ padding: "10px 0" }}>
          <div className="shadowColor" style={{ padding: "10px" }}>
            <Grid container spacing={2} sx={{ py: "10px" }}>
              {/* Work Request */}

              <Grid item md={4} sm={6}>
                <Typography style={{ fontWeight: "600", fontSize: "14px" }}>
                  Work Request
                </Typography>

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography
                    style={{
                      fontWeight: "600",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className={
                      findCustomizerequiredLabel("ast_loc_wr_option")
                        ? "red"
                        : ""
                    }
                  >
                    {findCustomizeLabel("ast_loc_wr_option") || "loading..."}{" "}
                    <Checkbox
                      onChange={(e) =>
                        setCheckData((pre) => ({
                          ...pre,
                          ast_loc_wr_option: e.target.checked,
                        }))
                      }
                      disabled={diableToggle ? true : false}
                      onClick={handleError}
                      checked={Number(checkData.ast_loc_wr_option)}
                    />
                  </Typography>
                </Stack>

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography
                    style={{
                      fontWeight: "600",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className={
                      findCustomizerequiredLabel("ast_loc_wr_prefix")
                        ? "red"
                        : ""
                    }
                  >
                    {findCustomizeLabel("ast_loc_wr_prefix") || "WR Prefix"}
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="ast_loc_wr_prefix"
                      size="small"
                      value={data.ast_loc_wr_prefix}
                      className={`${
                        error2 === "ast_loc_wr_prefix" ? "errorEmpty" : ""
                      }`}
                      onChange={handleData}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
                    />
                  </div>
                </Stack>

                {/* WR Counter */}

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography
                    style={{
                      fontWeight: "600",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className={
                      findCustomizerequiredLabel("ast_loc_wr_counter")
                        ? "red"
                        : ""
                    }
                  >
                    {findCustomizeLabel("ast_loc_wr_counter") || "WR Counter"}
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="wrCounter"
                      size="small"
                      value={counter.wrCounter}
                      onChange={handelCounter}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
                    />
                  </div>
                </Stack>
              </Grid>

              {/* Corrective WOrk Order */}
              <Grid item md={4} sm={6}>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Corrective Work Order
                </Typography>

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography
                    style={{ fontSize: "14px", fontWeight: "600" }}
                    className={
                      findCustomizerequiredLabel("ast_loc_wo_option")
                        ? "red"
                        : ""
                    }
                  >
                    {findCustomizeLabel("ast_loc_wo_option") || "WO Option"}
                    <Checkbox
                      onChange={(e) => {
                        setCheckData((pre) => ({
                          ...pre,
                          ast_loc_wo_option: e.target.checked,
                        }));
                      }}
                      checked={Number(checkData.ast_loc_wo_option)}
                      disabled={diableToggle ? true : false}
                      onClick={handleError}
                    />
                  </Typography>
                </Stack>

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("ast_loc_wo_prefix")
                        ? "red"
                        : ""
                    }
                  >
                    {findCustomizeLabel("ast_loc_wo_prefix") || "loading..."}
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="ast_loc_wo_prefix"
                      size="small"
                      className={`${
                        error2 === "ast_loc_wo_prefix" ? "errorEmpty" : ""
                      }`}
                      value={data.ast_loc_wo_prefix}
                      onChange={handleData}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
                    />
                  </div>
                </Stack>

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("ast_loc_wo_counter")
                        ? "red"
                        : ""
                    }
                  >
                    {findCustomizeLabel("ast_loc_wo_counter") || " WO Counter"}
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="woCounter"
                      size="small"
                      value={counter.woCounter}
                      onChange={handelCounter}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
                    />
                  </div>
                </Stack>
              </Grid>

              {/* Premetive Work Order */}
              <Grid item md={4} sm={6}>
                <Typography
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Premetive Work Order
                </Typography>

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("ast_loc_pm_option")
                        ? "red"
                        : ""
                    }
                  >
                    {findCustomizeLabel("ast_loc_pm_option") || "loading..."}
                    <Checkbox
                      checked={Number(checkData.ast_loc_pm_option)}
                      onChange={(e) => {
                        setCheckData((pre) => ({
                          ...pre,
                          ast_loc_pm_option: e.target.checked,
                        }));
                      }}
                      disabled={diableToggle ? true : false}
                      onClick={handleError}
                    />
                  </Typography>
                </Stack>

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("ast_loc_pm_prefix")
                        ? "red"
                        : ""
                    }
                  >
                    {findCustomizeLabel("ast_loc_pm_prefix") || "PM WO Prefix"}
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="ast_loc_pm_prefix"
                      size="small"
                      className={`${
                        error2 === "ast_loc_pm_prefix" ? "errorEmpty" : ""
                      }`}
                      value={data.ast_loc_pm_prefix}
                      onChange={handleData}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
                    />
                  </div>
                </Stack>

                {/* WR Counter */}

                <Stack spacing={1} sx={{ pb: 0.5 }}>
                  <Typography variant="subtitle2">
                    {/* {findCustomizeLabel("ast_loc_ast_loc") || "loading..."}
                     */}
                    Counter
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="ast_loc_ast_loc"
                      size="small"
                      value={counter.pmCounter}
                      onChange={handelCounter}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
                    />
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </div>
        </div>
      </DialogContent>

      <Divider />
      <DialogActions>
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
            Save
          </Button>
          <Button
            variant="soft"
            color="error"
            startIcon={<Iconify icon="jam:close" />}
            onClick={(e, r) => {
              setData("");
              setError("");
              setError2("");
              handleClose(e, r);
              setDisableToggle(false);
            }}
          >
            Close
          </Button>
        </div>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}
