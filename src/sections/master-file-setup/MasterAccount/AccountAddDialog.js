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

import { FaRegAddressCard } from "react-icons/fa";

export default function AccountAddDialog({
  open,
  handleClose,
  setRefetch,
  tableData,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");

  const [groupLabel, setGroupLabel] = React.useState([]);
  const [data, setData] = React.useState({
    account: "",
    descs: "",
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
      toast.error(`Please fill the Unique field: Account`, {
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
    } else if (!data.account) {
      toast.error(`Please fill the required field: Account`, {
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
    } else if (!data.descs) {
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
    } else {
      try {
        const body = {
          disable_flag: checkData ? 1 : 0,
          descs: data.descs,
          account: data.account,
          site_cd: site_ID,
          audit_user: loginUser,
        };
        const response = await httpCommon.post(
          "/insert_new_master_account.php",
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
    const value = e.target.value;

    if (e.target.name == "account") {
      const res = tableData.find(
        (item) => item.account.toUpperCase() == value.toUpperCase()
      );
      if (res) {
        setError("Create a Unique Account");
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
        <FaRegAddressCard size={24} />
        Account
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Account :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="account"
                  size="small"
                 
                  value={data.account}
                  onChange={handleData}
                  fullWidth
                  inputProps={{maxLength:50}}
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
                  name="descs"
                  value={data.descs}
                  onChange={handleData}
                  className="TxtAra"
                  style={{ borderColor: "1px soild gray", width: "100%" }}
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
                // onChange={handleCheckboxChange}
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
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}
