import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";

import {

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
import { GrStatusInfo } from "react-icons/gr";

function StatusTypeDialog({ open, handleClose, rowData, setRefetch }) {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = React.useState(
    rowData && rowData.sts_typ_desc ? rowData.sts_typ_desc : ""
  );

  const handleSubmitForm = async () => {
    try {
      const body = {
        site_ID,
        sts_typ_cat_cd: rowData.sts_typ_cat_cd,
        sts_typ_desc: data,
        sts_typ_typ_cd: rowData.sts_typ_typ_cd,
        RowID: rowData.RowID,
      };

      const response = await httpCommon.post(
        `/update_master-status-category.php`,
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
        <GrStatusInfo size={22} />
        {"Master Status Type"}
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Category Code</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="LaborAccount"
                  size="small"
                  disabled
                  value={
                    rowData && rowData.sts_typ_cat_cd
                      ? rowData.sts_typ_cat_cd
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
              <Typography variant="subtitle2">Description</Typography>
              <div>
              

                <div>
                  <TextareaAutosize
                    aria-label="empty textarea"
                    minRows={6.5}
                    name="desc"
                    fullWidth
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="TxtAra"
                    style={{ borderColor: "1px soild gray", width: "100%" }}
                  />
                </div>
              </div>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">Category Code</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="LaborAccount"
                  size="small"
                  disabled
                  value={
                    rowData && rowData.sts_typ_typ_cd
                      ? rowData.sts_typ_typ_cd
                      : ""
                  }
                  fullWidth
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
            }}
          >
            Close
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default StatusTypeDialog;
