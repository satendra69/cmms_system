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
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import MasterDialogLogin from "./MasterDialogLogin"
import { template } from "lodash";


export default function AddLogInDialog({
  open,
  handleClose,
  setRefetch,

}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);

  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    empl_id:"",
    name:"",
    default_site:"",
    default_language:"",
    audit_user:"",
    password:"",
    template:""
   
  });
  const [checkData, setCheckData] = React.useState({
    sys_admin:0,
    cf_user_locked:0

  });


  const handleEditClick = (e) => {

    setTextField(e);
  };
  const handleCloseDefault = (e, result) => {
    if (result !== "backdropClick") {
      setTextField("");
      setDefaultModal(false);
    
    }
  };

  React.useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

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
      setData((pre) => ({
        ...pre,
        [e.target.name]: value,
      }));
    
  };
    // handleCancel
    const handleCancelClick = (name) => {
        // setModalDefault(false);
    
        setData((pre) => ({
          ...pre,
          [name]: "",
        }));
      };

  return (
    <>
     <MasterDialogLogin
        setData={setData}
        handleClose={handleCloseDefault}
        open={DefaultModal}
        name={textField}
      />
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
       Create New User Id
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* For screens smaller than medium, show one column */}
          <Grid item xs={12} >
            <Stack spacing={1} >
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                User ID:
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="empl_id"
                  size="small"
                  placeholder="Enter User ID..."
                  value={data.empl_id}
                  onChange={handleData}
                  fullWidth
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

          <Grid item xs={12} md={12}>
            <Stack spacing={1} >
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Password:
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="account"
                  size="small"
                  placeholder="Enter Your Password..."
                  value={data.password}
                  onChange={handleData}
                  fullWidth
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

          <Grid item xs={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                Name:
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="name"
                  size="small"
                  placeholder="Enter Name..."
                  value={data.name}
                  onChange={handleData}
                  fullWidth
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

          {/* Default Site Code */}
          <Grid item xs={12}>
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("emp_mst_status") || "Default Site Code"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="default_site"
                              size="small"
                              // value={data ? data.LaborAccount : ""}
                              fullWidth
                              // value={Permanent_IDFlag || ""}
                              // disabled
                              placeholder="Select..."
                              value={data.default_site}
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
                                    <Iconify
                                      icon="material-symbols:close"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleCancelClick("default_site")}
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() => handleEditClick("default_site")}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                          </div>
                          </Grid>
             {/* Default Language */}
          <Grid item xs={12} >
                          <Typography variant="subtitle2" >
                            {findCustomizeLabel("default_language") || "Default Language"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="default_language"
                              size="small"
                              // value={data ? data.LaborAccount : ""}
                              fullWidth
                              // value={Permanent_IDFlag || ""}
                              // disabled
                              placeholder="Select..."
                              value={data.default_language}
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
                                    <Iconify
                                      icon="material-symbols:close"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleCancelClick("default_language")}
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() => handleEditClick("default_language")}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                          </div>
                          </Grid>

                              {/* Default Template */}
                          <Grid item xs={12} md={12}>
                          <Typography variant="subtitle2" >
                            {findCustomizeLabel("emp_mst_status") || "Default Template"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="template"
                              size="small"
                              // value={data ? data.LaborAccount : ""}
                              fullWidth
                              // value={Permanent_IDFlag || ""}
                              // disabled
                              placeholder="Select..."
                              value={data.template}
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
                                    <Iconify
                                      icon="material-symbols:close"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => handleCancelClick("template")}
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() => handleEditClick("template")}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                          </div>
                          </Grid>



      
          <Grid item xs={12} md={6} mt={-2}>
            <Stack spacing={1} sx={{ pb: 1.5,}} >
                <div style={{display:"flex",alignItems:"center",gap:1 }}>
            <Typography variant="subtitle2" >
               
                System Administrator:
              </Typography>
           
                  <Checkbox onChange={(e) => setCheckData((pre)=>({
                    ...pre,
                    sys_admin : e.target.checked,

                    }))} />
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:35 }}>
            <Typography variant="subtitle2" >
               
                Account Locked:
              </Typography>
           
                  <Checkbox onChange={(e) => setCheckData((pre)=>({
                    ...pre,
                    cf_user_locked:e.target.checked,
                    
                    }))} />
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
    </>
  );
}
