import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
import {
  Divider,
  Grid,
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
import { MdOutlineCategory } from "react-icons/md";
import { Bounce, ToastContainer, toast } from "react-toastify";

function CategoryStatusDialog({ open, handleClose, rowData, setRefetch }) {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = React.useState(
    rowData && rowData.sts_cat_desc ? rowData.sts_cat_desc : ""
  );
  const [error, setError] = React.useState(false);

  const handleSubmitForm = async () => {
    if (!data) {
      setError(true);
      toast.error(`Please fill the required field: Description`, {
        position: "top-center",
        autoClose: 3000,
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
          sts_cat_desc: data,
          sts_cat_cat_cd: rowData.sts_cat_cat_cd,
          RowID: rowData.RowID,
        };

        const response = await httpCommon.post(
          `/update_master-status-type.php`,
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
        style={{ display: "flex", alignItems: "center", gap: 2 }}
      >
        <MdOutlineCategory size={22} />
        Master Status Category
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Category</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="LaborAccount"
                  size="small"
                  disabled
                  value={
                    rowData && rowData.sts_cat_cat_cd
                      ? rowData.sts_cat_cat_cd
                      : ""
                  }
                  fullWidth
                  
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error ? "red" : "black" }}
              >
                Description
              </Typography>

              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  minRows={6.5}
                  name="usr_grp_desc"
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
              handleClose(e, r);
              setError(false);
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

export default CategoryStatusDialog;
