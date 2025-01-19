import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import { FaCalendar } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { IoMdTime } from "react-icons/io";
import Iconify from "src/components/iconify";

function AccountingPeriodAddDailog({
  open,
  handleClose,
  setRetch,
  dataFiltered,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let audit_user = localStorage.getItem("emp_mst_login_id");

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

  const [budgetYear, setBudgetYear] = React.useState("");
  const [endYear, setEndYear] = React.useState("");

  const [data, setData] = React.useState({
    p1beg: "",
    p2beg: "",
    p3beg: "",
    p4beg: "",
    p5beg: "",
    p6beg: "",
    p7beg: "",
    p8beg: "",
    p9beg: "",
    p10beg: "",
    p11beg: "",
    p12beg: "",
  });
  const [month, setMonth] = React.useState({
    p1name: "",
    p2name: "",
    p3name: "",
    p4name: "",
    p5name: "",
    p6name: "",
    p7name: "",
    p8name: "",
    p9name: "",
    p10name: "",
    p11name: "",
    p12name: "",
  });

  React.useEffect(() => {
    if (budgetYear.length > 3) {
      const response = dataFiltered.find(
        (item) => item.prod_year == budgetYear
      );
      if (response) {
        toast.error(`Budget Year already exists`, {
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
        setBudgetYear("");
      } else {
        setEndYear(new Date(`${budgetYear}-12-31`));
        setData((pre) => ({
          ...pre,
          p1beg: new Date(`${budgetYear}-01-01`),
          p2beg: new Date(`${budgetYear}-02-01`),
          p3beg: new Date(`${budgetYear}-03-01`),
          p4beg: new Date(`${budgetYear}-04-01`),
          p5beg: new Date(`${budgetYear}-05-01`),
          p6beg: new Date(`${budgetYear}-06-01`),
          p7beg: new Date(`${budgetYear}-07-01`),
          p8beg: new Date(`${budgetYear}-08-01`),
          p9beg: new Date(`${budgetYear}-09-01`),
          p10beg: new Date(`${budgetYear}-10-01`),
          p11beg: new Date(`${budgetYear}-11-01`),
          p12beg: new Date(`${budgetYear}-12-01`),
        }));
        setMonth((prev) => ({
          ...prev,
          p1name: "January",
          p2name: "February",
          p3name: "March",
          p4name: "April",
          p5name: "May",
          p6name: "June",
          p7name: "July",
          p8name: "August",
          p9name: "September",
          p10name: "October",
          p11name: "November",
          p12name: "December",
        }));
      }
    }
  }, [budgetYear.length > 3]);

  const handleSubmitForm = async () => {
    if (!budgetYear) {
      toast.error(`Please fill the required field: Budget Year`, {
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
    } else if (!endYear) {
      toast.error(`Please fill the required field: End Year`, {
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
    } else if (
      !month.p1name ||
      !month.p2name ||
      !month.p3name ||
      !month.p4name ||
      !month.p5name ||
      !month.p6name ||
      !month.p7name ||
      !month.p8name ||
      !month.p9name ||
      !month.p10name ||
      !month.p11name ||
      !month.p12name
    ) {
      toast.error(`Please fill the required field: Name`, {
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

          ...month,
          audit_user,
          prod_year: budgetYear,
          end_of_year: endYear,
          site_ID,
        };

        const response = await httpCommon.post(
          `/insert_new_master_accounting_pereiod.php`,
          body
        );

        if (response.data.status == "SUCCESS") {
          handleClose();
          Swal.fire({
            title: "Success",
            text: "Created Successfully",
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
        {/* <RxCrossCircled
          onClick={handleClose}
          style={{ cursor: "pointer", color: "gray", marginRight: "20px" }}
          size={32}
        /> */}
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
          <div className="left">
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                Budget Year
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cnt_mst_module_cd"
                  size="small"
                  onChange={(e) => setBudgetYear(e.target.value)}
                  value={budgetYear}
                  fullWidth
                  placeholder=""
                  type="number"
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
          <div className="right">
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                End of Year
              </Typography>
              <div>
                <DateTimePicker
                  className="Extrasize"
                  format="yyyy-MM-dd"
                  value={endYear}
                  onChange={(newValue) => {
                    setEndYear(newValue);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                    placeholder="Enter Name..."
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                    placeholder="Enter Name..."
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
                <Typography variant="subtitle2" style={{ color: "red" }}>
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
              setData({});
              setMonth({});
              setBudgetYear("");
              setEndYear("");
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

export default AccountingPeriodAddDailog;
