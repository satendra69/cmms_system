import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  Autocomplete,
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

function MasterAssetGrpDialog({ open, handleClose, rowData, setRefetch }) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [error2, setError2] = React.useState("");
  const [data, setData] = React.useState({
    ast_grp_grp_cd:
      rowData && rowData.ast_grp_grp_cd ? rowData.ast_grp_grp_cd : "",
    ast_grp_desc: rowData && rowData.ast_grp_desc ? rowData.ast_grp_desc : "",
    ast_grp_separator:
      rowData && rowData.ast_grp_separator ? rowData.ast_grp_separator : "",
    ast_grp_counter:
      rowData && rowData.ast_grp_counter ? rowData.ast_grp_counter : "100001",
    Sample_Format:
      rowData && rowData.Sample_Format ? rowData.Sample_Format : "",
  });

  const [checkData, setCheckData] = React.useState({
    ast_grp_disable_flag:
      rowData && rowData.ast_grp_disable_flag
        ? Number(rowData.ast_grp_disable_flag)
        : 0,
    ast_grp_serial:
      rowData && rowData.ast_grp_serial ? Number(rowData.ast_grp_serial) : 0,
    ast_grp_option:
      rowData && rowData.ast_grp_option ? Number(rowData.ast_grp_option) : 0,
  });

  const [seprator, setSeprator] = React.useState([
    { label: "-", value: "-" },
    { label: "|", value: "|" },
    { label: "/", value: "/" },
  ]);

  const [selected_seprator, setSelectedSeprator] = React.useState({
    label:
      rowData && rowData.ast_grp_separator ? rowData.ast_grp_separator : "",
    value:
      rowData && rowData.ast_grp_separator ? rowData.ast_grp_separator : "",
  });

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_asset_grp_code_mandatoryfilled.php"
        );

        console.log("response", response);
        if (response.data.status === "SUCCESS") {
          setGroupLabel(response?.data?.ast_grp?.MandatoryField);
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
    } else if (!data.ast_grp_grp_cd) {
      handleErrorToast("Group Code");
      setError2("ast_grp_grp_cd");
    } else if (!data.ast_grp_desc) {
      handleErrorToast("Description");
      setError2("ast_grp_desc");
    } else if (!data.ast_grp_counter) {
      handleErrorToast("Counter");
      setError2("ast_grp_counter");
    } else {
      const body = {
        ...data,
        ast_grp_serial: checkData.ast_grp_serial ? 1 : 0,
        ast_grp_disable_flag: checkData.ast_grp_disable_flag,
        ast_grp_option: checkData.ast_grp_option,
        site_cd: site_ID,
        audit_user: loginUser,
        RowID: rowData.RowID,
      };

      const missingField = handleRequiredField(body);

      if (!missingField) {
        try {
          const response = await httpCommon.post(
            `/update_asset_grp_code.php`,
            body
          );

          if (response.data.status == "SUCCESS") {
            handleClose();
            Swal.fire({
              title: "Success",
              text: "New Record Updated Successfully",
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
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };


   // required Label
   const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.some(
      (item) => item.column_name === columnName && item.cf_label_required === "1"
    );
    return foundItem;
  };

  const handleCheckData = (e) => {
    
    const checked = e.target.checked;
    setCheckData((pre) => ({
      ...pre,
      [e.target.name]: checked,
    }));
  };

  const handleData = (e) => {
    const value = e.target.value;

    setData((pre) => ({
      ...pre,
      [e.target.name]: value,
    }));
  };
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", gap: 5, alignItems: "center" }}
      >
        <BsCassette size={24} />
        Asset Group Code
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2} style={{ padding: 2 }}>
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {findCustomizeLabel("ast_grp_grp_cd") || "loading..."}
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="ast_grp_grp_cd"
                  size="small"
                  disabled
                  value={data.ast_grp_grp_cd}
                  onChange={handleData}
                  fullWidth
                />
              </div>
            </Stack>
          </Grid>

          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {findCustomizeLabel("ast_grp_desc") || "loading..."}
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  name="ast_grp_desc"
                  minRows={6.5}
                  value={data.ast_grp_desc}
                  onChange={handleData}
                  className={`TxtAra ${
                    error2 === "ast_grp_desc" ? "errorEmpty" : ""
                  }`}
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>

          {/* counter */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {findCustomizeLabel("ast_grp_counter") || "loading..."}
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="ast_grp_counter"
                  size="small"
                  className={`${
                    error2 === "ast_grp_counter" ? "errorEmpty" : ""
                  }`}
                  value={data.ast_grp_counter}
                  onChange={handleData}
                  fullWidth
                />
              </div>
            </Stack>
          </Grid>

          {/* seprator */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={findCustomizerequiredLabel("ast_det_depr_method")}
              >
                {findCustomizeLabel("ast_grp_separator") || "loading..."}
              </Typography>
              <Autocomplete
                options={seprator}
                onChange={(event, value) => {
                  setSelectedSeprator(value);
                }}
                onInputChange={(event, value, reason) => {
                  if (reason === "clear") {
                    setSelectedSeprator({ label: "", value: "" });
                  }
                }}
                value={selected_seprator?.label ?? ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select..."
                    variant="outlined"
                    className={` ${
                      error2 === "ast_grp_separator" ? "errorEmpty" : ""
                    }`}
                    fullWidth
                  />
                )}
              />
            </Stack>
          </Grid>

          {/* sample Format */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                {findCustomizeLabel("Sample_Format") || "Sample Format"}
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="Sample_Format"
                  size="small"
                  disabled
                  value={
                    data.ast_grp_grp_cd
                      ? data.ast_grp_grp_cd +
                        selected_seprator.value +
                        data.ast_grp_counter
                      : data.ast_grp_counter
                  }
                  onChange={handleData}
                  fullWidth
                />
              </div>
            </Stack>
          </Grid>

          {/* auto number */}
               
               <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            
            >
              <Stack spacing={1} sx={{ pb: 1.5 }}>
                <Typography
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                  className={findCustomizerequiredLabel("ast_grp_option")?"red":""}
                >
                  {findCustomizeLabel("ast_grp_option") || "Aut"}
                  <Checkbox
                    name="ast_grp_option"
                    onChange={handleCheckData}
                    checked={checkData.ast_grp_option}
                  />
                </Typography>
              </Stack>



              {/* Generate Serialize Stock */}
              <Stack spacing={1} sx={{ pb: 1.5 }}>
                <Typography
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                  className={findCustomizerequiredLabel("ast_grp_serial")?"red":""}
                >
                  {findCustomizeLabel("ast_grp_serial") || "Generate Serialize Stock"}
                  <Checkbox
                      onChange={handleCheckData}
                      name="ast_grp_serial"
                      checked={checkData.ast_grp_serial}
                    />
                </Typography>

              
              </Stack>

              {/* Generate Disable */}
              <Stack spacing={1} sx={{ pb: 1.5 }}>
                  
              <Typography
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                  className={findCustomizerequiredLabel("ast_grp_disable_flag")?"red":""}
                >
                  
                  {findCustomizeLabel("ast_grp_disable_flag") || "Disable"}
                  <Checkbox
                      onChange={handleCheckData}
                      name="ast_grp_disable_flag"
                      checked={checkData.ast_grp_disable_flag}
                    />
                </Typography>
              </Stack>
            </div>
          </Grid>
        </Grid>
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
              handleClose(e, r);
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

export default MasterAssetGrpDialog;
