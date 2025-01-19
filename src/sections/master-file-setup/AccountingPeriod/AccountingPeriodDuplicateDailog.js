import * as React from "react";
import { useState } from "react";
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
  Typography,
} from "@mui/material";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { HiOutlineDuplicate } from "react-icons/hi";
import { Bounce, ToastContainer, toast } from "react-toastify";

function AccountingPeriodDuplicateDailog({
  open,
  handleClose,
  rowData,
  setRefetch,
  tableData,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let audit_user = localStorage.getItem("emp_mst_login_id");
  const [data, setData] = React.useState(
    rowData && rowData.prod_year ? rowData.prod_year : ""
  );
  const [newData, setNewData] = React.useState("");
  const [endYear, setEndYear] = useState(rowData.end_of_year.date);

  const customizeDate = (oldDate) => {
    const currentYear = parseInt(oldDate.substr(0, 4));

    const res = oldDate
      .replace(currentYear, newData)
      .replace(/:00.000000$/, "");

    return res;
  };

  const handleSubmitForm = async () => {
    if (!data) {
      toast.error(`Please fill the required field: New Budget Calendar`, {
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
      return;
    }
    try {
      const body = {
        ...rowData,

        audit_user,
        prod_year: newData,
        end_of_year: new Date(`${newData}-12-31`),

        p1beg: customizeDate(rowData.p1beg.date),
        p2beg: customizeDate(rowData.p2beg.date),
        p3beg: customizeDate(rowData.p3beg.date),
        p4beg: customizeDate(rowData.p4beg.date),
        p5beg: customizeDate(rowData.p5beg.date),
        p6beg: customizeDate(rowData.p6beg.date),
        p7beg: customizeDate(rowData.p7beg.date),
        p8beg: customizeDate(rowData.p8beg.date),
        p9beg: customizeDate(rowData.p9beg.date),
        p10beg: customizeDate(rowData.p10beg.date),
        p11beg: customizeDate(rowData.p11beg.date),
        p12beg: customizeDate(rowData.p12beg.date),
        site_ID: site_ID,
      };
      console.log("body", body);
      const response = await httpCommon.post(
        `/insert_new_master_accounting_pereiod.php`,
        body
      );
      console.log("response", response);

      if (response.data.status == "SUCCESS") {
        handleClose();
        Swal.fire({
          title: "Success",
          text: "Created Successfully",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
        }).then(() => setRefetch(true));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    if (e.target.value > 3) {
      const response = tableData.find(
        (item) => item.prod_year == e.target.value
      );
      if (response) {
        toast.error(`Budget year already exists`, {
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
        return;
      }
    }
    setNewData(e.target.value);
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
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <HiOutlineDuplicate size={26} style={{ marginLeft: "-10px" }} />
            {"Dupicate Budget Period"}
          </DialogTitle>
        </div>
        <RxCrossCircled
          onClick={handleClose}
          style={{ cursor: "pointer", color: "gray", marginRight: "20px" }}
          size={32}
        />
      </div>
      <Divider />
      <DialogContent sx={{ my: 2 }}>
        <Grid container spacing={1}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1} sx={{ pb: 0.5 }}>
              <Typography variant="subtitle2">
                Existing Budget Calendar Year
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="LaborAccount"
                  size="small"
                  disabled
                  value={data}
                  fullWidth
                  placeholder="Existing budget calendar..."
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack>
              <Typography variant="subtitle2">New Budget Calendar</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  name="desc"
                  type="number"
                  fullWidth
                  placeholder=""
                  onChange={handleChange}
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

export default AccountingPeriodDuplicateDailog;
