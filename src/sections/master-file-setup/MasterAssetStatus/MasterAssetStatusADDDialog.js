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
import { makeStyles } from "@mui/styles";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { BsCassette } from "react-icons/bs";
import MasterDialog from "./component/MasterDialog";

export default function MasterAssetStatusADDDialog({
  open,
  handleClose,
  setRefetch,
  tableData,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [modalDefault, setModalDefault] = React.useState(false);
  const [diableToggle, setDisableToggle] = React.useState(false);
  const [textField, setTextField] = React.useState("");
  const [data, setData] = React.useState({
    ast_sts_typ_cd: "",
    ast_sts_status: "",
    ast_sts_desc: "",
  });

  const [checkData, setCheckData] = React.useState(0);
  const [checkData1, setCheckData1] = React.useState(0);
  const [error2, setError2] = React.useState("");

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_asset_status_mandatoryfiled.php"
        );
        console.log("groupLabel", response);
        if (response.data.status === "SUCCESS") {
          setGroupLabel(response?.data?.asset_sts?.MandatoryField);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);

  //  handleCancel Click
  const handleEditClick = (e) => {
    setModalDefault(!modalDefault);
    setTextField(e);
  };

  //handle cancel
  const handleCancelClick = (name) => {
    // setModalDefault(false);

    setData((pre) => ({
      ...pre,
      [name]: "",
    }));
  };

  React.useEffect(() => {
    if (textField) {
      setModalDefault(true);
    }
  }, [textField]);

  const handleRequiredField = (body) => {
    const mandatoryFields = groupLabel.filter(
      (item) => item.cf_label_required === "1"
    );

    const missingFields = mandatoryFields.find(
      (item) =>
        !body.hasOwnProperty(item.column_name) ||
        body[item.column_name] === null ||
        body[item.column_name] === undefined ||
        body[item.column_name] === ""
    );

    if (missingFields) {
      toast.error(
        `Please fill the required field: ${missingFields.customize_label}`,
        {
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
        }
      );
      return true;
    }

    return false;
  };

  const handleErrorToast = (msg) => {
    toast.error(`Please fill the required field: ${msg}`, {
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
  };

  const handleError = () => {
    if (error) {
      toast.error(`Duplicate Data Found in the Database`, {
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
      setDisableToggle(true);
    } else return;
  };

  // submit form
  const handleSubmitForm = async () => {
    if (!data.ast_sts_typ_cd) {
      setError2("ast_sts_typ_cd");
      handleErrorToast("Status Type");
    } else if (error) {
      toast.error(
        `Status Code is set to be unique at this location.Please enter a unique Status Code`,
        {
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
        }
      );
    } else if (!data.ast_sts_status) {
      setError2("ast_sts_status");
      handleErrorToast("Status");
    } else if (!data.ast_sts_desc) {
      setError2("ast_sts_desc");
      handleErrorToast("Description");
    } else {
      const body = {
        ast_sts_disable_flag: checkData ? 1 : 0,
        ast_sts_count_dwn_time: checkData1 ? 1 : 0,
        ast_sts_desc: data.ast_sts_desc,
        ast_sts_typ_cd: data.ast_sts_typ_cd,
        ast_sts_status: data.ast_sts_status,
        site_cd: site_ID,
        audit_user: loginUser,
      };

      const missingField = handleRequiredField(body);

      if (!missingField) {
        try {
          const response = await httpCommon.post(
            `/insert_new_master_asset_status.php`,
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
              setData("");
              setRefetch(true);
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const useStyles = makeStyles({
    dialogCard: {
      boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
    },
  });

  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.some(
      (item) => item.column_name === columnName && item.cf_label_required === "1"
    );
    
    return foundItem;
  
  };

  const handleCloseTabel = () => {
    setModalDefault(false);
    setTextField("");
  };

  const handleData = (e) => {
    const value = e.target.value;
    setError2("");

    if (e.target.name == "ast_sts_status") {
      if (value.length < 4) {
        const res = tableData.find(
          (item) => item.ast_sts_status == value.toUpperCase()
        );

        if (res) {
          setError(true);
        } else {
          setDisableToggle(false);
          setError(false);
        }
        setData((pre) => ({
          ...pre,
          [e.target.name]: value.toUpperCase(),
        }));
      }
    } else {
      setData((pre) => ({
        ...pre,
        [e.target.name]: value,
      }));
    }
  };
  const classes = useStyles();
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        // className="shadow90"
        // classes={{ paper: classes.dialogCard }}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ display: "flex", gap: 5, alignItems: "center" }}
        >
          <BsCassette size={24} />
          Asset Status
        </DialogTitle>

        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2} style={{ padding: 2 }}>
            <Grid item xs={12} md={12}>
              {/* Status Type */}
              <Stack spacing={1}>
                <Typography
                  variant="subtitle2"
                  className={findCustomizerequiredLabel("ast_sts_typ_cd")?"red":""}
                  style={{ color: "red" }}
                >
                  {findCustomizeLabel("ast_sts_typ_cd") || "loading..."}
                </Typography>
                <div
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    name="ast_sts_typ_cd"
                    fullWidth
                    className={error2 === "ast_sts_typ_cd" ? "errorEmpty" : ""}
                    value={data ? data.ast_sts_typ_cd : ""}
                    disabled={diableToggle ? true : false}
                    placeholder="Select..."
                    InputProps={{
                      endAdornment: (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            color: "#637381",
                            gap: 5,
                          }}
                        >
                          <Iconify
                            icon="material-symbols:close"
                            onClick={() => handleCancelClick("ast_sts_typ_cd")}
                            style={{ cursor: "pointer" }}
                          />

                          <Iconify
                            icon="tabler:edit"
                            onClick={() => handleEditClick("ast_sts_typ_cd")}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      ),
                    }}
                  />
                </div>
              </Stack>
            </Grid>

            {/* status */}
            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <Typography
                  variant="subtitle2"
                  className={findCustomizerequiredLabel("ast_sts_status")?"red":""}
                  style={{ color: "red" }}
                >
                  {findCustomizeLabel("ast_sts_status") || "loading..."}
                </Typography>
                <div
                
                >
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    name="ast_sts_status"
                    fullWidth
                    className={error2 === "ast_sts_status" ? "errorEmpty" : ""}
                    value={data ? data.ast_sts_status : ""}
                    onChange={handleData}
                  />
                </div>
              </Stack>
            </Grid>

            {/* desc */}
            <Grid item xs={12} md={12}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" 
                style={{ color: "red" }}
                className={findCustomizerequiredLabel("ast_sts_desc")?"red":""}
                
                >
                  {findCustomizeLabel("ast_sts_desc") || "loading..."}
                </Typography>
                <div>
                  <TextareaAutosize
                    aria-label="empty textarea"
                    name="ast_sts_desc"
                    minRows={6.5}
                    disabled={diableToggle ? true : false}
                    value={data.ast_sts_desc}
                    onChange={handleData}
                    className={`TxtAra  ${
                      error2 === "ast_sts_desc" ? "errorEmpty" : ""
                    }`}
                 
                    onClick={handleError}
                    style={{ borderColor: "1px soild gray", width: "100%" }}
                  
                  />
                </div>
              </Stack>
            </Grid>

            {/* count down time */}
            <Grid item xs={12} md={12} mt={-2} mb={1}>
              <div style={{width:"30%"}}>
              <Stack spacing={1}>
                <Typography style={{ fontSize: "14px", fontWeight: "600",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                className={findCustomizerequiredLabel("ast_sts_count_dwn_time")?"red":""}
                >
                  {findCustomizeLabel("ast_sts_count_dwn_time") || "loading..."}
                  <Checkbox
                    onChange={(e) => setCheckData(e.target.checked)}
                    disabled={diableToggle ? true : false}
                    onClick={handleError}
                  />
                </Typography>
              </Stack>

              {/* count disable */}

              <Stack spacing={1}>
                <Typography style={{ fontSize: "14px", fontWeight: "600",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                   className={findCustomizerequiredLabel("ast_sts_disable_flag")?"red":""}
                >
                  
                  {findCustomizeLabel("ast_sts_disable_flag") || "loading..."}

                  <Checkbox
                    onChange={(e) => setCheckData1(e.target.checked)}
                    disabled={diableToggle ? true : false}
                    checked={checkData1}
                    onClick={handleError}
                  />
                </Typography>
              </Stack>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
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
              onClick={(e, r) => {
                setData("");
                setError("");
                setError2("");
                setDisableToggle(false);
                handleClose(e, r);
              }}
            >
              Close
            </Button>
          </div>
        </DialogActions>
        <ToastContainer />
        <MasterDialog
          setData={setData}
          handleClose={handleCloseTabel}
          open={modalDefault}
          name={textField}
        />
      </Dialog>
    </>
  );
}
