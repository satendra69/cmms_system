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
import { GrCurrency } from "react-icons/gr";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import { DateTimePicker } from "@mui/x-date-pickers";

export default function CurrencyAddDialog({
  open,
  handleClose,
  setRefetch,
  tableData,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");

  const [groupLabel, setGroupLabel] = React.useState([]);
  const [data, setData] = React.useState({
    cur_mst_cur_code: "",
    cur_mst_desc: "",
    cur_mst_exchange_rate: "",
    cur_mst_label: "",
    cur_mst_format_string: "",
    cur_mst_exchange_rate_date: "",
  });
  const [error, setError] = React.useState("");

  const [checkData, setCheckData] = React.useState(0);
  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_usert_group_mandatoryfiled.php"
        );

        if (response.data.status === "SUCCESS") {
          setGroupLabel(response?.data?.user_group?.MandatoryField);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);
  const handleSubmitForm = async () => {
    if (error) {
      toast.error(`Please fill the Unique field: Currency Code`, {
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
    } else if (!data.cur_mst_cur_code) {
      toast.error(`Please fill the required field: Currency Code`, {
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
    } else if (!data.cur_mst_desc) {
      toast.error(`Please fill the required field: Description`, {
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
    } else if (!data.cur_mst_label) {
      toast.error(`Please fill the required field: Currency Label`, {
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
    } else if (!data.cur_mst_exchange_rate) {
      toast.error(`Please fill the required field: Exchange Rate`, {
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
    } else {
      try {
        const body = {
          ...data,
          cur_mst_base_cur: checkData ? "1" : "0",
          cur_mst_exchange_rate_date: data.cur_mst_exchange_rate_date
            ? format(data.cur_mst_exchange_rate_date, "yyyy-MM-dd")
            : format(new Date(Date.now()), "yyyy-MM-dd hh:mm"),
          site_cd: site_ID,
          audit_user: loginUser,
        };
        console.log("response", body);
        const response = await httpCommon.post(
          "/insert_new_master_currency_code.php",
          body
        );
        console.log("response", response);
        if (response.data.status == "SUCCESS") {
          handleClose();
          Swal.fire({
            title: "Success",
            text: "New Record Created",
            icon: "success",
            confirmButtonText: "OK",
            timer: 2000,
          }).then(() => {
            setError("");
            setData("");
            setRefetch(true);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
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
  const handleData = (e) => {
    let value = e.target.value;

    if(e.target.name === "cur_mst_exchange_rate"){
      if(value.length > 30){
        value = value.slice(0,30);
      }
    }


    if (e.target.name == "cur_mst_cur_code") {
      const res = tableData.find(
        (item) => item.cur_mst_cur_code.toUpperCase() == value.toUpperCase()
      );
      if (res) {
        setError("Create a Currency Code");
      } else {
        setError("");
      }
      setData((pre) => ({
        ...pre,
        [e.target.name]: value.toUpperCase(),
      }));
    } else {
      setData((pre) => ({
        ...pre,
        [e.target.name]: value,
      }));
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
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Currency Code :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cur_mst_cur_code"
                  size="small"
                  value={data.cur_mst_cur_code}
                  onChange={handleData}
                  fullWidth
                  inputProps={{maxLength:10}}
                />
              </div>
              {error && (
                <p
                  style={{
                    color: "red",
                    marginTop: "-5px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </p>
              )}
            </Stack>
          </Grid>

          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {/* {findCustomizeLabel("usr_grp_desc") || "loading..."} */}
                Description :
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  minRows={6.5}
                  name="cur_mst_desc"
                  value={data.cur_mst_desc}
                  onChange={handleData}
                  className="TxtAra"
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>

          {/* Exchanhge Rate */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Currency Label :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cur_mst_label"
                  size="small"
                  value={data.cur_mst_label}
                  onChange={handleData}
                  fullWidth
                  inputProps={{maxLength:10}}
                />
              </div>
              {error && (
                <p
                  style={{
                    color: "red",
                    marginTop: "-5px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </p>
              )}
            </Stack>
          </Grid>
          {/* Label */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Exchange Rate :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cur_mst_exchange_rate"
                  size="small"
                  value={data.cur_mst_exchange_rate}
                  onChange={handleData}
                  fullWidth
                  type="number"

                />
              </div>
              {error && (
                <p
                  style={{
                    color: "red",
                    marginTop: "-5px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </p>
              )}
            </Stack>
          </Grid>

          {/*Exchange Rate */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">Exchange Rate Date:</Typography>
              <div>
                <DateTimePicker
                  name="cur_mst_exchange_rate_date"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={
                    data && data.cur_mst_exchange_rate_date
                      ? data.cur_mst_exchange_rate_date
                      : new Date()
                  }
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

          {/*Format String */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">Format String:</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cur_mst_format_string"
                  size="small"
                  value={data.cur_mst_format_string}
                  onChange={handleData}
                  fullWidth
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
                label="Base Currency"
                checked={checkData}
                sx={{ mt: 1 }}
                // onChange={handleCheckboxChange}
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
              ? `${data.cur_mst_label} ${data.cur_mst_exchange_rate}`
              : "0.00"}
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
                handleClose(e, r);
                setError("");
              }}
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
