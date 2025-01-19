import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
import { MdAutoMode } from "react-icons/md";
import {
  Autocomplete,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { MdFormatListNumbered } from "react-icons/md";
import { GrCaretPrevious } from "react-icons/gr";
import { TbBrandDaysCounter } from "react-icons/tb";

function AutoAddAdialog({ open, handleClose }) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  // rowData && rowData.length > 0 ? rowData : {};
  const [data, setData] = React.useState({
    cnt_mst_module_cd: "",
    cnt_mst_prefix: "",
    cnt_mst_counter: "",
    cnt_mst_option: "",
  });

  const [checkData, setCheckData] = React.useState(0);
  const [AutoNumberingOptions, setAutoNumberingOptions] = React.useState([
    { label: "Auto", value: "A" },
    { label: "Manual", value: "M" },
  ]);

  const [selected_AutoNumberingOptions, setSelectedAutoNumberingOptions] =
    React.useState([]);
  const handleChange = (e) => {
    setData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitForm = async () => {
    try {
      const body = {
        ...data,

        cnt_mst_numbering: selected_AutoNumberingOptions.value,
      };
      console.log("body", body);
      const response = await httpCommon.post(
        `/update_master_auto_no.php`,
        body
      );

      if (response.data.status == "SUCCESS") {
        handleClose();
        Swal.fire({
          title: "Hello!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
        }).then(() => window.location.reload());
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <DialogTitle id="alert-dialog-title">{"Auto Number"}</DialogTitle>
        </div>
        <RxCrossCircled
          onClick={handleClose}
          style={{ cursor: "pointer", color: "gray", marginRight: "20px" }}
          size={32}
        />
      </div>
      <Divider />
      <DialogContent sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">Module Code</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="cnt_mst_module_cd"
                  size="small"
                  value={data ? data.cnt_mst_module_cd : ""}
                  fullWidth
                  placeholder="Select..."
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
                        <MdOutlineGroups />
                      </div>
                    ),
                  }}
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Description</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  name="cnt_mst_desc"
                  fullWidth
                  value={data ? data.cnt_mst_desc : ""}
                  placeholder="Select..."
                  onChange={handleChange}
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
                        <MdOutlineDescription />
                      </div>
                    ),
                  }}
                />
              </div>
            </Stack>
          </Grid>
          {/* Auto Numbering */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Auto Numbering</Typography>
              <Autocomplete
                options={AutoNumberingOptions}
                value={selected_AutoNumberingOptions?.label ?? ""}
                onChange={(event, value) => {
                  setSelectedAutoNumberingOptions(value);
                }}
                //getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select..."
                    variant="outlined"
                    fullWidth // Make it full-width
                  />
                )}
              />
            </Stack>
          </Grid>

          {/* Prefix */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Prefix</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  name="cnt_mst_prefix"
                  fullWidth
                  value={data ? data.cnt_mst_prefix : ""}
                  placeholder="Select..."
                  onChange={handleChange}
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
                        <GrCaretPrevious />
                      </div>
                    ),
                  }}
                />
              </div>
            </Stack>
          </Grid>

          {/* Counter */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Counter</Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  name="cnt_mst_counter"
                  fullWidth
                  value={data ? data.cnt_mst_counter : ""}
                  placeholder="Select..."
                  onChange={(e) => setData(e.target.value)}
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
                        <TbBrandDaysCounter />
                      </div>
                    ),
                  }}
                />
              </div>
            </Stack>
          </Grid>

          {/* Option */}
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <FormControl>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  sx={{ color: "black" }}
                >
                  Option
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue={data ? data.cnt_mst_option : ""}
                  name="cnt_mst_option"
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="M"
                    control={<Radio />}
                    sx={{ color: "GrayText" }}
                    label="Master Counter (Auto Asset No by Master Prefix and Counter)"
                  />
                  <FormControlLabel
                    value="G"
                    control={<Radio />}
                    sx={{ color: "GrayText", mt: 1 }}
                    label="Asset Group Counter (Auto Asset No by Asset Group Code and Counter)"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider style={{ marginTop: "20px" }} />
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
    </Dialog>
  );
}

export default AutoAddAdialog;
