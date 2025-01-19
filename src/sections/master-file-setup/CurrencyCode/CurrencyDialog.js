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

import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";

import { DateTimePicker } from "@mui/x-date-pickers";
import { GrCurrency } from "react-icons/gr";
import { format } from "date-fns";

function CurrencyDialog({ open, handleClose, rowData, setRefetch }) {
  const [groupLabel, setGroupLabel] = React.useState([]);
  let site_ID = localStorage.getItem("site_ID");

  const [data, setData] = React.useState({
    cur_mst_cur_code:
      rowData && rowData.cur_mst_cur_code ? rowData.cur_mst_cur_code : "",
    cur_mst_desc: rowData && rowData.cur_mst_desc ? rowData.cur_mst_desc : "",
    cur_mst_label:
      rowData && rowData.cur_mst_label ? rowData.cur_mst_label : "",
    cur_mst_base_cur:
      rowData && rowData.cur_mst_base_cur ? rowData.cur_mst_base_cur : "",
    cur_mst_exchange_rate:
      rowData && rowData.cur_mst_exchange_rate
        ? rowData.cur_mst_exchange_rate
        : "",
    cur_mst_exchange_rate_date:
      rowData &&
      rowData.cur_mst_exchange_rate_date &&
      rowData.cur_mst_exchange_rate_date.date
        ? new Date(rowData.cur_mst_exchange_rate_date.date)
        : "",
    cur_mst_format_string:
      rowData && rowData.cur_mst_format_string
        ? rowData.cur_mst_format_string
        : "",
  });

  const [error, setError] = React.useState({
    cur_mst_cur_code: false,
    cur_mst_desc: false,
    cur_mst_label: false,
    cur_mst_exchange_rate: false,
  });

  const [checkData, setCheckData] = React.useState(
    rowData && rowData.disable_flag ? Number(rowData.disable_flag) : 0
  );
  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return foundItem.cf_label_required;
    }
    return "";
  };
  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_usert_group_mandatoryfiled.php"
        );

        if (response.data.status === "SUCCESS") {
          setGroupLabel(response.data.user_group.MandatoryField);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);
  const handleData = (e) => {

let inputField = e.target.value;
if(e.target.name === "cur_mst_exchange_rate"){
  if(inputField.length > 30){
    inputField = inputField.slice(0,30)
  }
  
}

    setData((pre) => ({
      ...pre,
      [e.target.name]: inputField,
    }));
    setError((pre) => ({
      ...pre,
      [e.target.name]: false,
    }));
  };

  const Error = (errorName) => {
    setError((pre) => ({
      ...pre,
      [errorName]: true,
    }));
  };

  const handleSubmitForm = async () => {
    if (!data.cur_mst_desc) {
      Error("cur_mst_desc");
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
    } else if (!data.cur_mst_label) {
      Error("cur_mst_label");
      toast.error(`Please fill the required field: Currency Label`, {
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
    } else if (!data.cur_mst_exchange_rate) {
      Error("cur_mst_exchange_rate");
      toast.error(`Please fill the required field:Exchange Rate`, {
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
          site_ID,
          cur_mst_cur_code: rowData.cur_mst_cur_code,
          cur_mst_base_cur: checkData ? "1" : "0",
          cur_mst_desc: data.cur_mst_desc,
          cur_mst_exchange_rate: data.cur_mst_exchange_rate,
          cur_mst_label: data.cur_mst_label,
          cur_mst_format_string: data.cur_mst_format_string,
          cur_mst_exchange_rate_date: format(
            data.cur_mst_exchange_rate_date,
            "yyyy-MM-dd"
          ),

          RowID: rowData.RowID,
        };
      
        const response = await httpCommon.post(
          `/update_master_currency_code.php`,
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
          }).then(() => setRefetch(true));
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
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", alignItems: "center", gap: 3 }}
      >
        <GrCurrency size={24} />
        Currency Code
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Currency Code :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="costcenter"
                  size="small"
                  disabled
                  value={
                    rowData && rowData.cur_mst_cur_code
                      ? rowData.cur_mst_cur_code
                      : ""
                  }
                  fullWidth
                 inputProps={{maxLength:10}}
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error.cur_mst_desc ? "red" : "black" }}
              >
                {/* {findCustomizeLabel("usr_grp_desc") || "loading..."} */}
                Description :
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  name="cur_mst_desc"
                  minRows={6.5}
                  value={data.cur_mst_desc}
                  onChange={handleData}
                  className="TxtAra"
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>

          {/* Currency Label */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                style={{ color: error.cur_mst_label ? "red" : "black" }}
              >
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Currency Label :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cur_mst_label"
                  size="small"
                  onChange={handleData}
                  value={data.cur_mst_label}
                  fullWidth
                  inputProps={{maxLength:10}}
                />
              </div>
            </Stack>
          </Grid>

          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                style={{ color: error.cur_mst_exchange_rate ? "red" : "black" }}
              >
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Exchange Rate :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cur_mst_exchange_rate"
                  size="small"
                  onChange={handleData}
                  value={data.cur_mst_exchange_rate}
                  fullWidth
                  type="number"
                />
              </div>
            </Stack>
          </Grid>

          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Exchange Rate Date:
              </Typography>
              <div>
                <DateTimePicker
                  name="cur_mst_exchange_rate_date"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.cur_mst_exchange_rate_date}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      cur_mst_exchange_rate_date: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>
            </Stack>
          </Grid>

          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Format String:
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cur_mst_format_string"
                  size="small"
                  fullWidth
                  value={data.cur_mst_format_string}
                  onChange={handleData}
                  inputProps={{maxLength:25}}
                />
              </div>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} mt={-2}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox onChange={(e) => setCheckData(e.target.checked)} />
                }
                label="Disable"
                checked={checkData}
                sx={{ mt: 1 }}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider style={{ marginTop: "10px" }} />
      <DialogActions>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            MYR 1.00 :{" "}
            {data && data.cur_mst_label && data.cur_mst_exchange_rate
              ? `${data.cur_mst_label} ${parseFloat(
                  data.cur_mst_exchange_rate
                ).toFixed(2)}`
              : "00.000"}
          </div>

          <div
            className="buttons"
            style={{
              marginLeft: "auto",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
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
              onClick={(e, r) => handleClose(e, r)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}

export default CurrencyDialog;
