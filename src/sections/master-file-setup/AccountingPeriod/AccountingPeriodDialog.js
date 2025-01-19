import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IoMdTime } from "react-icons/io";
import { FaCalendar, FaRegCalendarCheck } from "react-icons/fa";
import { Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { DateTimePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import moment from "moment";
import { CgViewMonth } from "react-icons/cg";
import { Bounce, ToastContainer, toast } from "react-toastify";

function AccountingPeriodDialog({ open, handleClose, rowData, setRetch }) {
  let site_ID = localStorage.getItem("site_ID");
  const [error, setError] = React.useState({});
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

  const customizeDate = (oldDate) => {
    console.log("oldDate", oldDate);
    const res = oldDate.replace(/:00.000000$/, "");
    return res;
  };

  const [data, setData] = React.useState({
    p1beg: rowData && rowData.p1beg ? new Date(rowData.p1beg.date) : "",
    p2beg: rowData && rowData.p2beg ? new Date(rowData.p2beg.date) : "",
    p3beg: rowData && rowData.p3beg ? new Date(rowData.p3beg.date) : "",
    p4beg: rowData && rowData.p4beg ? new Date(rowData.p4beg.date) : "",
    p5beg: rowData && rowData.p5beg ? new Date(rowData.p5beg.date) : "",
    p6beg: rowData && rowData.p6beg ? new Date(rowData.p6beg.date) : "",
    p7beg: rowData && rowData.p7beg ? new Date(rowData.p7beg.date) : "",
    p8beg: rowData && rowData.p8beg ? new Date(rowData.p8beg.date) : "",
    p9beg: rowData && rowData.p9beg ? new Date(rowData.p10beg.date) : "",
    p10beg: rowData && rowData.p10beg ? new Date(rowData.p10beg.date) : "",
    p11beg: rowData && rowData.p11beg ? new Date(rowData.p11beg.date) : "",
    p12beg: rowData && rowData.p12beg ? new Date(rowData.p12beg.date) : "",
  });

  const [month, setMonth] = React.useState({
    p1name: rowData && rowData.p1name ? rowData.p1name : "",
    p2name: rowData && rowData.p2name ? rowData.p2name : "",
    p3name: rowData && rowData.p3name ? rowData.p3name : "",
    p4name: rowData && rowData.p4name ? rowData.p4name : "",
    p5name: rowData && rowData.p5name ? rowData.p5name : "",
    p6name: rowData && rowData.p6name ? rowData.p6name : "",
    p7name: rowData && rowData.p7name ? rowData.p7name : "",
    p8name: rowData && rowData.p8name ? rowData.p8name : "",
    p9name: rowData && rowData.p9name ? rowData.p9name : "",
    p10name: rowData && rowData.p10name ? rowData.p10name : "",
    p11name: rowData && rowData.p11name ? rowData.p11name : "",
    p12name: rowData && rowData.p12name ? rowData.p12name : "",
  });

  const handleChange = (e) => {
    setData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };
  const handleError = (name) => {
    toast.error(`Please fill required field Name`, {
      position: "top-center",
      autoClose: 1000,
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
    setError((pre) => ({
      ...pre,
      [name]: true,
    }));
  };

  const handleSubmitForm = async () => {
    if (!month.p1name) {
      handleError("p1name");
    } else if (!month.p2name) {
      handleError("p2name");
    } else if (!month.p3name) {
      handleError("p3name");
    } else if (!month.p4name) {
      handleError("p4name");
    } else if (!month.p5name) {
      handleError("p5name");
    } else if (!month.p6name) {
      handleError("p6name");
    } else if (!month.p7name) {
      handleError("p7name");
    } else if (!month.p8name) {
      handleError("p8name");
    } else if (!month.p9name) {
      handleError("p9name");
    } else if (!month.p10name) {
      handleError("p10name");
    } else if (!month.p11name) {
      handleError("p11name");
    } else if (!month.p12name) {
      handleError("p12name");
    } else {
      try {
        const body = {
          ...month,
          site_ID: rowData.site_cd,

          RowID: rowData.RowID,
          prod_year: rowData.prod_year,
          audit_user: localStorage.getItem("emp_mst_login_id"),
          end_of_year: customizeDate(rowData.end_of_year.date),
          p1beg: format(data.p1beg, "yyyy-MM-dd"),
          p2beg: format(data.p2beg, "yyyy-MM-dd"),
          p3beg: format(data.p3beg, "yyyy-MM-dd"),
          p4beg: format(data.p4beg, "yyyy-MM-dd"),
          p5beg: format(data.p5beg, "yyyy-MM-dd"),
          p6beg: format(data.p6beg, "yyyy-MM-dd"),
          p7beg: format(data.p7beg, "yyyy-MM-dd"),
          p8beg: format(data.p8beg, "yyyy-MM-dd"),
          p9beg: format(data.p9beg, "yyyy-MM-dd"),
          p10beg: format(data.p10beg, "yyyy-MM-dd"),
          p11beg: format(data.p11beg, "yyyy-MM-dd"),
          p12beg: format(data.p12beg, "yyyy-MM-dd"),
        };
        console.log("body", body);
        const response = await httpCommon.post(
          `/update_master_accounting_pereiod.php`,
          body
        );
        console.log("response", response);

        if (response.data.status == "SUCCESS") {
          handleClose();
          Swal.fire({
            title: "Success",
            text: "Updated Successfully",
            icon: "success",
            confirmButtonText: "OK",
            timer: 2000,
          }).then(() => setRetch(true));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChangePeriod = (e) => {
    setData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeMonth = (e) => {
    setError((pre) => ({
      ...pre,
      [e.target.name]: false,
    }));
    setMonth((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullScreen
      sx={{
        width: "90vw",
        height: "90vh",
        mx: "auto",
        my: "auto",
      }}
      PaperProps={{
        sx: { borderRadius: "10px" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <DialogTitle
            id="alert-dialog-title"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FaRegCalendarCheck />
            {"Master Accounting Period"}
          </DialogTitle>
        </div>
      </div>
      <Divider />
      <DialogContent sx={{ my: 1, px: 5 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="left" style={{ marginRight: "10px" }}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">Budget Year</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cnt_mst_module_cd"
                  size="small"
                  type="number"
                  disabled
                  value={rowData.prod_year}
                  fullWidth
                  placeholder="..."
                />
              </div>
            </Stack>
          </div>
          <div className="right">
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">End of Year</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cnt_mst_module_cd"
                  size="small"
                  disabled
                  value={moment(rowData.end_of_year.date).format("YYYY-MM-DD")}
                  fullWidth
                  placeholder="..."
                  InputProps={{
                    endAdornment: (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          color: "#637381",
                          gap: 10,
                        }}
                      >
                        <FaCalendar style={{ color: "GrayText" }} />
                      </div>
                    ),
                  }}
                />
              </div>
            </Stack>
          </div>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 1
              </div>
              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p1beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p1beg}
                  onChange={(newValue) => {
                    console.log("newValue", newValue);
                    setData((pre) => ({
                      ...pre,
                      p1beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p1name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p1name"
                    size="small"
                    value={month.p1name}
                    onChange={handleChangeMonth}
                    fullWidth
                    placeholder="Enter Name"
                  />
                </div>
              </div>
            </Stack>
          </Grid>
          {/* p2 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 2
              </div>

              <div>
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="crf_mst_change_date"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p2beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p2beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p2name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p2name"
                    onChange={handleChangeMonth}
                    size="small"
                    value={month.p2name}
                    fullWidth
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>

          {/* p3 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 3
              </div>
              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p3beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p3beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p3beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p3name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p3name"
                    size="small"
                    value={month.p3name}
                    onChange={handleChangeMonth}
                    fullWidth
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>

          {/* p4 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 4
              </div>

              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p4beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p4beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p4beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p4name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p4name"
                    size="small"
                    value={month.p4name}
                    fullWidth
                    onChange={handleChangeMonth}
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>
          {/* p5 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 5
              </div>

              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p5beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p5beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p5beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p5name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p5name"
                    size="small"
                    value={month.p5name}
                    fullWidth
                    onChange={handleChangeMonth}
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>

          {/* p6 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 6
              </div>

              <div>
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p6beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p6beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p6beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p6name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p6name"
                    size="small"
                    onChange={handleChangeMonth}
                    value={month.p6name}
                    fullWidth
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>
          {/* p7 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 7
              </div>
              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p7beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p7beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p7beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p7name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p7name"
                    onChange={handleChangeMonth}
                    size="small"
                    value={month.p7name}
                    fullWidth
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>

          {/* p8 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 8
              </div>

              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p8beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p8beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p8beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p8name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p8name"
                    size="small"
                    value={month.p8name}
                    onChange={handleChangeMonth}
                    fullWidth
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>

          {/* p9 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 9
              </div>
              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p9beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p9beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p9beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  style={{ color: error.p9name ? "red" : "black" }}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p9name"
                    size="small"
                    value={month.p9name}
                    fullWidth
                    onChange={handleChangeMonth}
                    placeholder="Enter Name"
                  />
                </div>
              </div>
            </Stack>
          </Grid>

          {/* p10 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 10
              </div>
              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p10beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p10beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p10beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  color={error.p10name ? "red" : "black"}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p10name"
                    onChange={handleChangeMonth}
                    size="small"
                    value={month.p10name}
                    fullWidth
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>
          {/* p11 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 11
              </div>
              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p11beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p11beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p11beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  color={error.p11name ? "red" : "black"}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p11name"
                    size="small"
                    onChange={handleChangeMonth}
                    value={month.p11name}
                    fullWidth
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>

          {/* p12 */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={1}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px ",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                className="heading"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                  width: "max-content",
                  padding: "5px 10px 5px 10px",
                  borderRadius: "10px",
                  margin: "0 auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IoMdTime size={22} />
                Period 12
              </div>

              <div>
                {" "}
                <Typography variant="subtitle2">Begin</Typography>
                <DateTimePicker
                  name="p12beg"
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={data.p12beg}
                  onChange={(newValue) => {
                    setData((pre) => ({
                      ...pre,
                      p12beg: newValue,
                    }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </div>

              {/* second Section */}
              <div>
                <Typography
                  variant="subtitle2"
                  color={error.p12name ? "red" : "black"}
                >
                  Name
                </Typography>
                <div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    name="p12name"
                    size="small"
                    onChange={handleChangeMonth}
                    value={month.p12name}
                    fullWidth
                    placeholder="Enter Name..."
                  />
                </div>
              </div>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
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
            onClick={(e, result) => {
              setError({});
              handleClose(e, result);
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

export default AccountingPeriodDialog;
