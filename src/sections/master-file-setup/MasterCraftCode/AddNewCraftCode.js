import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";

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

import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";

import { DateTimePicker } from "@mui/x-date-pickers";

import { Bounce, ToastContainer, toast } from "react-toastify";
import { GiCrafting } from "react-icons/gi";
import { format } from "date-fns";

function AddNewCraftCode({ open, handleClose, rowData, setRetch, tableData }) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [checkData, setCheckData] = React.useState(0);

  const formatDate = (dateString) => {
    // Removing the milliseconds part if present

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    crf_mst_crf_cd: "",
    crf_mst_desc: "",
    crf_mst_crf_est_rate: "0",
    crf_mst_change_date: "",
    crf_mst_disable_flag: "",
  });

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "crf_mst_crf_cd") {
      value = value.toUpperCase();
      const res = tableData.find((item) => item.crf_mst_crf_cd == value);
      if (res) {
        setError("Create a Unique Craft Code");
      } else {
        setError("");
      }
    }
    setData((pre) => ({
      ...pre,
      [e.target.name]: value,
    }));
  };

  const handleSubmitForm = async () => {
    if (error) {
      toast.error(`Please fill the Unique field: Craft Code`, {
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
    } else if (!data.crf_mst_crf_cd) {
      toast.error(`Please fill the required field: Craft Code`, {
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
    } else if (!data.crf_mst_desc) {
      toast.error(`Please fill the required field: Description`, {
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
    } else {
     
      try {
        const body = {
          ...data,
          site_ID: site_ID,
          crf_mst_crf_est_rate: data.crf_mst_crf_est_rate
            ? data.crf_mst_crf_est_rate
            : "0",
          crf_mst_disable_flag: checkData,
          audit_date: data.crf_mst_change_date
            ? format(data.crf_mst_change_date, "yyyy-MM-dd hh:mm")
            : format(new Date(Date.now()), "yyyy-MM-dd hh:mm"),
          audit_user: loginUser,
          crf_mst_change_date: data.crf_mst_change_date
            ? format(data.crf_mst_change_date, "yyyy-MM-dd hh:mm")
            : format(new Date(Date.now()), "yyyy-MM-dd hh:mm"),
        };
       
        const response = await httpCommon.post(
          `/insert_new_master_craft_code.php`,
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
            setData({});
            setRetch(true);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <DialogTitle
          id="alert-dialog-title"
          style={{ display: "flex", alignItems: "center", gap: 3 }}
        >
          <GiCrafting size={22} />
          {"Master Craft Code"}
        </DialogTitle>
      </div>
      {/* <RxCrossCircled
          onClick={handleClose}
          style={{ cursor: "pointer", color: "gray", marginRight: "20px" }}
          size={32}
        /> */}

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                Craft Code
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="crf_mst_crf_cd"
                  size="small"
                  
                  onChange={handleChange}
                  value={data.crf_mst_crf_cd}
                  fullWidth
                  inputProps={{maxLength:25}}
                />
              </div>
              {error && (
                <p
                  style={{ color: "red", marginTop: "-8px", fontSize: "14px" }}
                >
                  {error}
                </p>
              )}
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                Description
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  minRows={6.5}
                  fullWidth
                  name="crf_mst_desc"
                  value={data.crf_mst_desc}
                  onChange={handleChange}
                  className="TxtAra"
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>

          {/* Estimate Rate */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Estimate Rate</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  name="crf_mst_crf_est_rate"
                  fullWidth
                  type="number"
                  value={data.crf_mst_crf_est_rate}
                  onChange={handleChange}
                  inputProps={{style:{textAlign:"right"}}}
                />
              </div>
            </Stack>
          </Grid>

          {/* Estimate Rate */}
          <Grid item xs={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">Change Date</Typography>

              <DateTimePicker
                name="crf_mst_change_date"
                className="Extrasize"
                format="yyyy-MM-dd  HH:mm"
                style={{ width: "100%" }}
                value={
                  data.crf_mst_change_date
                    ? data.crf_mst_change_date
                    : Date.now()
                }
                onChange={(newValue) => {
                 
                  setData((pre) => ({
                    ...pre,
                    crf_mst_change_date: newValue,
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} mt={-2}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => setCheckData(e.target.checked ? 1 : 0)}
                    checked={checkData ? 1 : 0}
                  />
                }
                label="Disable"
                sx={{ mt: 1 }}
                // onChange={handleCheckboxChange}
              />
            </Stack>
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
            onClick={() => {
              setData({});
              setError(false);
              handleClose();
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

export default AddNewCraftCode;
