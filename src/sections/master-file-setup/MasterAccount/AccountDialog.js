import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
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
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { FaRegAddressCard, FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";

function AccountDialog({ open, handleClose, rowData, setRefetch }) {
  const [groupLabel, setGroupLabel] = React.useState([]);
  let site_ID = localStorage.getItem("site_ID");
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState(
    rowData && rowData.descs ? rowData.descs : ""
  );
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
  // customize label

  const handleSubmitForm = async () => {
    if (!data) {
      setError(true);
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
          site_ID,
          disable_flag: checkData ? 1 : 0,
          descs: data,
          account: rowData.account,
          RowID: rowData.RowID,
        };

        const response = await httpCommon.post(
          `/update_master_account.php`,
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
        <FaRegAddressCard size={24} />
        Account
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Account :
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="costcenter"
                  size="small"
                  disabled
                  value={rowData && rowData.account ? rowData.account : ""}
                  fullWidth
                  
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error ? "red" : "black" }}
              >
                {/* {findCustomizeLabel("usr_grp_desc") || "loading..."} */}
                Description :
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  
                  minRows={6.5}
                  name="desc"
                  value={data}
                  onChange={(e) => {
                    setError(false);
                    setData(e.target.value);
                  }}
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
            onClick={(e, r) => handleClose(e, r)}
          >
            Close
          </Button>
        </div>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}

export default AccountDialog;
