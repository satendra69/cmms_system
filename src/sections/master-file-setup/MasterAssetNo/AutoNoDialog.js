import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";

import {
  Autocomplete,
  Divider,
  Grid,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";

import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";

import { MdOutlineAutorenew } from "react-icons/md";
import { Bounce, ToastContainer, toast } from "react-toastify";

function AssetNoDialog({ open, handleClose, rowData, setReFetch }) {
  const [error, setError] = React.useState({
    cnt_mst_module_cd: false,
    cnt_mst_desc: false,
    autoNumbering: false,
    cnt_mst_prefix: false,
    cnt_mst_counter: false,
    autoNumbering: false,
  });
  console.log("error", error);
  let site_ID = localStorage.getItem("site_ID");
  // rowData && rowData.length > 0 ? rowData : {};
  const [data, setData] = React.useState({
    cnt_mst_module_cd:
      rowData && rowData.cnt_mst_module_cd ? rowData.cnt_mst_module_cd : "",
    cnt_mst_desc: rowData && rowData.cnt_mst_desc ? rowData.cnt_mst_desc : "",

    cnt_mst_prefix:
      rowData && rowData.cnt_mst_prefix ? rowData.cnt_mst_prefix : "",
    cnt_mst_counter:
      rowData && rowData.cnt_mst_counter ? rowData.cnt_mst_counter : "",
    cnt_mst_option:
      rowData && rowData.cnt_mst_option ? rowData.cnt_mst_option : "",
  });

  const [checkData, setCheckData] = React.useState(
    rowData && rowData.usr_grp_desc ? Number(rowData.usr_grp_disable_flag) : 0
  );
  const [AutoNumberingOptions, setAutoNumberingOptions] = React.useState([
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" },
  ]);

  React.useEffect(() => {
    const selectedOption = AutoNumberingOptions.find(
      (option) => option.value == rowData.cnt_mst_numbering
    );
    setSelectedAutoNumberingOptions(selectedOption);
  }, []);

  const [selected_AutoNumberingOptions, setSelectedAutoNumberingOptions] =
    React.useState([]);
  const handleChange = (e) => {
    const inputValue=e.target.value;
    if (e.target.name === "cnt_mst_prefix") {
      if(inputValue > 3){
        inputValue.slice(0,3);
      }
      setData((pre) => ({
        ...pre,
        [e.target.name]: inputValue.toUpperCase(),
      }));
    }
    else if(e.target.name === "cnt_mst_counter"){
        if(inputValue > 5){
          inputValue.slice(0,5)
        }
        setData((pre) => ({
          ...pre,
          [e.target.name]: inputValue,
        }));
    }
    else {
      setData((pre) => ({
        ...pre,
        [e.target.name]: e.target.value,
      }));
    }
    setError((pre) => ({ ...pre, [e.target.name]: false }));
  };

  const setErrors = (name) => {
    setError((pre) => ({
      ...pre,
      [name]: true,
    }));
  };
  // const setErrorsAfter = (name) => {
  //   setError((pre) => ({
  //     ...pre,
  //     [name]: true,
  //   }));
  // };

  const handleSubmitForm = async () => {
    if (!data.cnt_mst_module_cd) {
      setErrors("cnt_mst_module_cd");
      toast.error(`Please fill the required field: Module Code`, {
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
    } else if (!data.cnt_mst_desc) {
      setErrors("cnt_mst_desc");
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
    } else if (!data.cnt_mst_numbering) {
      setErrors("autoNumbering");
      toast.error(`Please fill the required field: Auto Numbering`, {
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
    } else if (!data.cnt_mst_prefix) {
      setErrors("cnt_mst_prefix");
      toast.error(`Please fill the required field: Prefix`, {
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
    } else if (!data.cnt_mst_counter) {
      setErrors("cnt_mst_counter");
      toast.error(`Please fill the required field: Counter`, {
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
          site_ID: rowData.site_cd,
          cnt_mst_numbering: selected_AutoNumberingOptions.value,
          RowID: rowData.RowID,
          cnt_mst_option: "M",
        };

        const response = await httpCommon.post(
          `/update_master_auto_no.php`,
          body
        );

        if (response.data.status == "SUCCESS") {
          handleClose();
          Swal.fire({
            title: "Success",
            text: "Updated Successfully",
            icon: "success",
            confirmButtonText: "OK",
            timer: 2000,
          }).then(() => setReFetch(true));
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <DialogTitle
            id="alert-dialog-title"
            style={{ display: "flex", alignItems: "center", gap2: 3 }}
          >
            <MdOutlineAutorenew size={28} /> {"Auto Number"}
          </DialogTitle>
        </div>
      </div>
      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error.cnt_mst_module_cd ? "red" : "black" }}
              >
                Module Code
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cnt_mst_module_cd"
                  size="small"
                  disabled
                  value={data ? data.cnt_mst_module_cd : ""}
                  fullWidth
                  placeholder="Enter Module Code..."
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error.cnt_mst_desc ? "red" : "black" }}
              >
                Description
              </Typography>

              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder="Enter Descriptions..."
                  minRows={6.5}
                  name="cnt_mst_desc"
                  fullWidth
                  value={data ? data.cnt_mst_desc : ""}
                  onChange={handleChange}
                  className="TxtAra"
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>
          {/* Auto Numbering */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error.autoNumbering ? "red" : "black" }}
              >
                Auto Numbering
              </Typography>
              <Autocomplete
                options={AutoNumberingOptions}
                value={selected_AutoNumberingOptions?.label ?? ""}
                onChange={(event, value) => {
                  setError((prevState) => ({
                    ...prevState,
                    autoNumbering: false,
                  }));
                  setData((pre) => ({
                    ...pre,
                    cnt_mst_numbering: value,
                  }));
                  setSelectedAutoNumberingOptions(value);
                }}
                //getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                   
                    variant="outlined"
                    fullWidth // Make it full-width
                  />
                )}
              />
            </Stack>
          </Grid>

          {/* Prefix */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error.cnt_mst_prefix ? "red" : "black" }}
              >
                Prefix
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  name="cnt_mst_prefix"
                  fullWidth
                  value={data ? data.cnt_mst_prefix : ""}
                 
                  onChange={handleChange}
                  inputProps={{maxLength:3}}
                />
              </div>
            </Stack>
          </Grid>

          {/* Counter */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error.cnt_mst_counter ? "red" : "black" }}
              >
                Counter
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  name="cnt_mst_counter"
                  fullWidth
                  value={data ? data.cnt_mst_counter : ""}
              
                  type="number"
                  onChange={handleChange}
                />
              </div>
            </Stack>
          </Grid>

          {/* Option */}
          {/* <Grid item xs={12}>
            <Stack spacing={1}>
              <FormControl>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  sx={{ color: "black" }}
                >
                  Option
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={data ? data.cnt_mst_option : ""}
                  name="cnt_mst_option"
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="M"
                    control={<Radio />}
                    sx={{ color: "GrayText" }}
                    label="Master Counter (Auto Asset No by Master Prefix and Counter)"
                  />
                  <FormControlLabel
                    value="G"
                    control={<Radio />}
                    sx={{ color: "GrayText", mt: 1 }}
                    label="Asset Group Counter (Auto Asset No by Asset Group Code and Counter)"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Grid> */}
        </Grid>
      </DialogContent>

      <Divider style={{ marginTop: "20px" }} />
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
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}

export default AssetNoDialog;
