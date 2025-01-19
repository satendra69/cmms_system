import React, { useState, useEffect, forwardRef } from "react";
// @mui
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import httpCommon from "src/http-common";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button, Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
// Toastfy
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Iconify from "src/components/iconify/iconify";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { AccountPopover } from "src/layouts/_common";

// routes
import { paths } from "src/routes/paths";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

// components

//
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function UserProfileView() {
  const settings = useSettingsContext();
  let site_ID = localStorage.getItem("site_ID");
  const empName = localStorage.getItem("emp_mst_name");
  const empLoginId = localStorage.getItem("emp_mst_login_id");
  const emp_ID = localStorage.getItem("emp_mst_empl_id");
  const site_name = localStorage.getItem("site_name");
  const UserId = localStorage.getItem("EmpLoginId");
  const [showModal, setShowModal] = useState(false);
  const [PasswordUpdtModal, setPasswordUpdtModal] = useState(false);
  const [showIcon, setshowIcon] = useState(false);
  const [getDbImg, setDbImg] = useState();
  const [UserStatus, setUserStatus] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSelect, setImageSelect] = useState({
    name: "",
    path: "",
    site_ID: "",
    audit_user: "",
    UserId: "",
  });
  const [navbarState, setNavbarState] = useState("");
  const classNamesToHide = [".hideProfleNav", ".hideProfleNav1"];
  let updatePasswordClicked = false;

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isRendered, setIsRendered] = useState(false);

  // User Profile fetch img
  const fetchImgData = async () => {
    try {
      const response = await httpCommon.get(
        "/UserProfileFetch.php?RowID=" + UserId
      );
     
      if (response.data && response.data.data && Array.isArray(response.data.data.UserProfileDt)) {
        if (response.data.data.UserProfileDt.length > 0) {
          setDbImg(response.data.data.UserProfileDt);
        }
      } else {
       // console.error("UserProfileDt is undefined or not an array");
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Get User Status
  const fetchUserStatus = async () => {
   // console.log("call_again__");
    try {
      const response = await httpCommon.get(
        "/get_emp_status.php?site_cd=" +
          site_ID +
          "&emp_mst_empl_id=" +
          empLoginId
      );
      //  console.log("response__sts", response);
      if (response.data.data.length > 0) {
        console.log("response__img", response.data.data["0"].emp_mst_att_sts);
        setUserStatus(response.data.data["0"].emp_mst_att_sts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchImgData();
    fetchUserStatus();
  }, []);

  useEffect(() => {
    // Trigger a re-render without reloading the page
    //console.log("Hello__");
    setIsRendered(true);
  }, []); // Run only once when the component mounts

  const UploadProfile = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const showOverlay = () => {
    setshowIcon(true);
  };

  const hideOverlay = () => {
    setshowIcon(false);
  };
  // Get First 2 word in User name
  const getInitials = (empName) => {
    const words = empName.split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    const initials = words.map((word) => word[0].toUpperCase());
    return initials.slice(0, 2).join("");
  };
  const initials = getInitials(empName);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSelect({
          name: file.name,
          path: reader.result,
          site_ID: site_ID,
          audit_user: empLoginId,
          User_mstId: UserId,
        });
      };

      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid file type. Please select a PNG or JPEG image.",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });

      // console.error('Invalid file type. Please select a PNG or JPEG image.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedImage) {
      Swal.fire({
        title: "Uploading Image.. !",
        text: "Please wait...",
        icon: "info",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      Swal.showLoading();
      try {
        const response = await httpCommon.post(
          "/UserProfileUpload.php",
          imageSelect
        );

        if (response.data.status === "SUCCESS") {
          Swal.close();
          fetchImgData();
          handleModalClose();
          Swal.fire({
            icon: "success",
            title: response.data.status,
            text: response.data.message,
          }).then(() => {
            handleModalClose();
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleNavbarStateUpdate = (newValue) => {
    // console.log("newValue_____",newValue);
    setNavbarState(newValue);
    fetchUserStatus();
  };
  const toggleElementsVisibility = () => {
    classNamesToHide.forEach((className) => {
      const elements = document.querySelectorAll(className);
      elements.forEach((element) => {
        if (updatePasswordClicked) {
          element.style.display = "none"; // Hide elements if either settings.open is true or UpdatePassword clicked
        } else {
          element.style.display = "block"; // Show elements
        }
      });
    });
  };

  const UpdatePassword = (e) => {
    e.preventDefault();
    updatePasswordClicked = true;

    toggleElementsVisibility();
    setPasswordUpdtModal(true);
  };
  const UpdatePasswordCloseModel = () => {
    setPasswordUpdtModal(false);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  };
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords don't match!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      try {
        let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

        var json_passwrd = {
          site_cd: site_ID,
          new_passwod: confirmNewPassword,
          login_id: emp_mst_login_id.trim(),
        };
        const response = await httpCommon.post(
          "/update_password.php",
          JSON.stringify(json_passwrd)
        );

        if (response.data.status === "SUCCESS") {
          toast.success(response.data.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          setNewPassword("");
          setConfirmNewPassword("");
          UpdatePasswordCloseModel();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="User Profile"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "User", href: paths.dashboard.user.root },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <div className="container" style={{ padding: "20px" }}>
        <div className="main-body mt-4">
          <div className="row gutters-sm">
            <div className="col-md-12 mb-8">
              <div className="cardProfile">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <div
                      //  onClick={(e) => UploadProfile(e)}
                      onMouseOver={showOverlay}
                      onMouseLeave={hideOverlay}
                      style={{ position: "relative" }}
                    >
                      {getDbImg && getDbImg.length > 0 ? (
                        <div style={{ position: "relative" }}>
                          <img
                            src={getDbImg[0].attachment}
                            alt="Profile"
                            className="Profilerounded-circle"
                            style={{ width: "110px", height: "110px" }}
                          />
                          {/* {showIcon && (
                            <div className="overlayProfileEdit">
                             <Iconify icon="fa6-solid:user-pen" />
                            </div>
                          )} */}
                        </div>
                      ) : (
                        <div
                          className="rounded-circle pro"
                          style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Avatar style={{ width: "110px", height: "110px" }}>
                            {initials}
                          </Avatar>
                          {/* {showIcon && (
                            <div className="overlayProfileEdit">
                              <Iconify icon="fa6-solid:user-pen" />
                            </div>
                          )} */}
                        </div>
                      )}
                      <div
                        className="stsProfile2"
                        style={{
                          position: "absolute",
                          top: "65%",
                          left: "53%",
                          transform: "translate(-50%, 10px)",
                        }}
                      >
                        <div>
                          {(() => {
                            if (UserStatus === "ONS") {
                              return (
                                <div>
                                  <Iconify
                                    icon="ph:circle-thin"
                                    className="online-status-icon"
                                    style={{
                                      background: "#28B463",
                                      color: "#28B463",
                                    }}
                                  />
                                </div>
                              );
                            } else if (UserStatus === "ONC") {
                              return (
                                <div>
                                  <Iconify
                                    icon="ph:circle-thin"
                                    className="online-status-icon"
                                    style={{
                                      background: "#F1C40F",
                                      color: "#F1C40F",
                                    }}
                                  />
                                </div>
                              );
                            } else if (UserStatus === "OFS") {
                              return (
                                <div>
                                  <Iconify
                                    icon="ph:circle-thin"
                                    className="online-status-icon"
                                    style={{
                                      background: "#E74C3C",
                                      color: "#E74C3C",
                                    }}
                                  />
                                </div>
                              );
                            } else if (UserStatus === "ONL") {
                              return (
                                <div>
                                  <Iconify
                                    icon="ph:circle-thin"
                                    className="online-status-icon"
                                    style={{
                                      background: "#95A5A6",
                                      color: "#95A5A6",
                                    }}
                                  />
                                </div>
                              );
                            } else {
                              return (
                                <div>
                                  <Iconify
                                    icon="ph:circle-thin"
                                    className="online-status-icon"
                                    style={{
                                      background: "gray",
                                      color: "gray",
                                    }}
                                  />
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4>Welcome, {empName}</h4>
                      <p className="text-secondary mb-1"></p>
                      {/* {site_name} */}
                    </div>
                  </div>

                  <div className="hideProfleNav">
                    <AccountPopover onRowClick={handleNavbarStateUpdate} />
                  </div>

                  <Grid
                    container
                    spacing={2}
                    style={{ padding: "10px 25px 0px 25px" }}
                    xs={8}
                  >
                    <Grid xs={8}>
                      <h5>Login ID :</h5>
                    </Grid>
                    <Grid xs={4}>
                      <h5>{empLoginId}</h5>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    style={{ padding: "10px 25px 0px 25px" }}
                    xs={8}
                  >
                    <Grid xs={8}>
                      <h5>Employee ID :</h5>
                    </Grid>
                    <Grid xs={4}>
                      <h5>{emp_ID}</h5>
                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent="center" marginTop="30px">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => UpdatePassword(e)}
                    >
                      Change Password
                    </Button>
                  </Box>
                </div>
                {/******************** Img upload  ********************/}
                <BootstrapDialog
                  onClose={handleModalClose}
                  aria-labelledby="customized-dialog-title"
                  open={showModal}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="dailogTitWork"
                  >
                    Upload Image
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={handleModalClose}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <Iconify icon="material-symbols:close" />
                  </IconButton>
                  <DialogContent dividers>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <input
                        className="uploadFileUserPic"
                        type="file"
                        onChange={handleImageChange}
                      />
                    </div>
                  </DialogContent>
                  <DialogActions
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid
                      container
                      xs={12}
                      md={12}
                      justifyContent="flex-end"
                      style={{ paddingRight: "20px", marginTop: "20px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Button
                          variant="secondary"
                          onClick={handleUpload}
                          startIcon={<Iconify icon="ep:upload-filled" />}
                        >
                          Upload
                        </Button>
                      </div>
                    </Grid>
                  </DialogActions>
                </BootstrapDialog>
                {/******************** Password Change  ********************/}
                <BootstrapDialog
                  onClose={UpdatePasswordCloseModel}
                  aria-labelledby="customized-dialog-title"
                  open={PasswordUpdtModal}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    className="dailogTitWork"
                  >
                    Update Password
                  </DialogTitle>
                  <IconButton
                    aria-label="close"
                    onClick={UpdatePasswordCloseModel}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <Iconify icon="material-symbols:close" />
                  </IconButton>
                  <DialogContent dividers>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <div>
                          <FormControl
                            sx={{ m: 1, width: "55ch" }}
                            variant="outlined"
                          >
                            <InputLabel htmlFor="outlined-adornment-password">
                              New Password
                            </InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-password"
                              type={showPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={handleNewPasswordChange}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword ? (
                                      <Iconify icon="material-symbols:visibility" />
                                    ) : (
                                      <Iconify icon="material-symbols:visibility-off" />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="New Password"
                            />
                          </FormControl>

                          <FormControl
                            sx={{ m: 1, width: "55ch" }}
                            variant="outlined"
                          >
                            <InputLabel htmlFor="outlined-adornment-password">
                              Confirm New Password
                            </InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-password"
                              type={showPassword ? "text" : "password"}
                              value={confirmNewPassword}
                              onChange={handleConfirmNewPasswordChange}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword ? (
                                      <Iconify icon="material-symbols:visibility" />
                                    ) : (
                                      <Iconify icon="material-symbols:visibility-off" />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="Confirm New Password"
                            />
                          </FormControl>
                        </div>
                      </Box>
                    </div>
                  </DialogContent>
                  <DialogActions
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid
                      container
                      xs={12}
                      md={12}
                      justifyContent="flex-end"
                      style={{ paddingRight: "20px", marginTop: "20px" }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Button
                          variant="contained"
                          onClick={handleUpdatePassword}
                          style={{
                            backgroundColor: "rgb(33 43 54)",
                            color: "white",
                            marginRight: "10px",
                          }}
                          startIcon={<Iconify icon="lucide:save-all" />}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </Grid>
                  </DialogActions>
                </BootstrapDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Container>
  );
}
