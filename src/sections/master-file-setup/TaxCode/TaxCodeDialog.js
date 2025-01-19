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

import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";

import { DateTimePicker } from "@mui/x-date-pickers";
import { GrCurrency } from "react-icons/gr";
import { format } from "date-fns";
import { IoBarcodeOutline } from "react-icons/io5";

function TaxCodeDialog({ open, handleClose, rowData, setRefetch }) {
  const [groupLabel, setGroupLabel] = React.useState([]);
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [data, setData] = React.useState({
    tax_mst_type: rowData && rowData.tax_mst_type ? rowData.tax_mst_type : "",
    tax_mst_tax_cd:
      rowData && rowData.tax_mst_tax_cd ? rowData.tax_mst_tax_cd : "",
    tax_mst_desc: rowData && rowData.tax_mst_desc ? rowData.tax_mst_desc : "",
    tax_mst_tax_rate:
      rowData && rowData.tax_mst_tax_rate ? rowData.tax_mst_tax_rate : "",
  });

  const [error, setError] = React.useState({
    tax_mst_type: false,
    tax_mst_tax_cd: false,
    tax_mst_desc: false,
  });

  const [TaxCodeOptions, setTaxCodeOptions] = React.useState([
    {
      label: "Purchase",
      value: "P",
    },
    {
      label: "Supply",
      value: "S",
    },
    {
      label: "All",
      value: "A",
    },
  ]);
  const [selectedTaxCodeOptions, setSelectedTaxCodeOptions] = React.useState(
    () => {
      if (rowData.tax_mst_type === "P") {
        return {
          label: "Purchase",
          value: "P",
        };
      } else if (rowData.tax_mst_type === "S") {
        // Changed to 'S' for Supply
        return {
          label: "Supply",
          value: "S",
        };
      } else if (rowData.tax_mst_type === "A") {
        return {
          label: "All",
          value: "A",
        };
      } else {
        return {
          label: "",
          value: "",
        };
      }
    }
  );

  const [checkData, setCheckData] = React.useState(
    rowData && rowData.tax_mst_disable_flag
      ? Number(rowData.tax_mst_disable_flag)
      : 0
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

    let inputValue=e.target.value;
    if(e.target.name === "tax_mst_tax_rate"){
      if(inputValue > 5){
        inputValue = inputValue.slice(0,5);
      }
    }

    setData((pre) => ({
      ...pre,
      [e.target.name]: inputValue,
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
    if (!data.tax_mst_type) {
      Error("tax_mst_type");
      toast.error(`Please fill the required field: Type of Tax`, {
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
    } else if (!data.tax_mst_desc) {
      Error("tax_mst_desc");
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
          site_ID,
          tax_mst_disable_flag: checkData ? "1" : "0",
          RowID: rowData.RowID,
          audit_user: loginUser,
        };
       
        const response = await httpCommon.post(
          `/update_master_tax_code.php`,
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
        <IoBarcodeOutline size={24} />
        Tax Code
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                style={{ color: error.tax_mst_type ? "red" : "black" }}
              >
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Type of Tax :
              </Typography>
              <div>
                <Autocomplete
                  options={TaxCodeOptions}
                  onChange={(event, value) => {
                    if (value) {
                      setSelectedTaxCodeOptions(value);

                      setData((pre) => ({
                        ...pre,
                        tax_mst_type: value.value,
                      }));
                      setError((pre) => ({
                        ...pre,
                        tax_mst_type: false,
                      }));
                    } else {
                      setData((pre) => ({
                        ...pre,
                        tax_mst_type: "",
                      }));
                      setError((pre) => ({
                        ...pre,
                        tax_mst_type: true,
                      }));
                      setSelectedTaxCodeOptions({});
                    }
                  }}
                  value={
                    selectedTaxCodeOptions && selectedTaxCodeOptions.label
                      ? selectedTaxCodeOptions.label
                      : ""
                  }
                  //getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select Type Of Tax..."
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
            </Stack>
          </Grid>

          {/* Tex Code */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                // style={{ color: error.cur_mst_label ? "red" : "black" }}
              >
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Tax Code :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cur_mst_label"
                  size="small"
                  onChange={handleData}
                  value={data.tax_mst_tax_cd}
                  fullWidth
                  disabled
                  placeholder="Enter Currency Label"
                />
              </div>
            </Stack>
          </Grid>

          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error.tax_mst_desc ? "red" : "black" }}
              >
                {/* {findCustomizeLabel("usr_grp_desc") || "loading..."} */}
                Description :
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder="Enter Descriptions..."
                  minRows={6.5}
                  name="tax_mst_desc"
                  value={data.tax_mst_desc}
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
                Tax Rate :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="tax_mst_tax_rate"
                  size="small"
                  onChange={handleData}
                  value={data.tax_mst_tax_rate}
                  fullWidth
                  type="number"
                  inputProps={{style:{textAlign:"right"}}}
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

export default TaxCodeDialog;
