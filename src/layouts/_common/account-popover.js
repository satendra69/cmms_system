import React, { Component, useState, useEffect } from "react";
import { m } from "framer-motion";
// @mui
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Iconify from "src/components/iconify/iconify";
// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
// hooks
import { useMockedUser } from "src/hooks/use-mocked-user";
// auth
import { useAuthContext } from "src/auth/hooks";

// Toastfy
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// components
import { varHover } from "src/components/animate";
import { useSnackbar } from "src/components/snackbar";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import httpCommon from "src/http-common";

// ----------------------------------------------------------------------
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
const MySwal = withReactContent(Swal);

// const OPTIONS = [  // disable for testing only this is menu list
//   {
//     label: "Profile Setting",
//     linkTo: paths.dashboard.user.profile,
//   },
//   // {
//   //   label: 'Settings',
//   //   linkTo: paths.dashboard.user.account,
//   // },
// ];

// ----------------------------------------------------------------------

export default function AccountPopover({ onRowClick }) {
  const router = useRouter();
  const UserLoginId = localStorage.getItem("emp_mst_login_id");

  const UserId = localStorage.getItem("EmpLoginId");
  const Emp_mst_empl_id = localStorage.getItem("emp_mst_empl_id");
  const Site_cd = localStorage.getItem("site_ID");
  const [UserStatus, setUserStatus] = useState();
  const [getDbImg, setDbImg] = useState([]);

  const [activeButton, setActiveButton] = useState(null);
  const { user } = useMockedUser();

  const { logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [progress, setProgress] = useState(0);


  // Get User Profile Data
  const fetchImgData = async () => {
    try {
      const response = await httpCommon.get(
        "/UserProfileFetch.php?RowID=" + UserId
      );
    //console.log("response__img11", response);
      
      if (response && response.data && response.data.data && Array.isArray(response.data.data.UserProfileDt)) {
        if (response.data.data.UserProfileDt.length > 0) {
          setDbImg(response.data.data.UserProfileDt);
        }
      } else {
        //console.log("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Get User Status
  const fetchUserStatus = async () => {
    try {
      const response = await httpCommon.get(
        "/get_emp_status.php?site_cd=" +
          Site_cd +
          "&emp_mst_empl_id=" +
          Emp_mst_empl_id
      );
      //console.log("response__sts",response);
      if (response.data.data.length > 0) {
       //  console.log("response__img",response.data.data['0'].emp_mst_att_sts);
        setUserStatus(response.data.data["0"].emp_mst_att_sts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    // Check if the page has been reloaded before
    const hasReloaded = sessionStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      // Set the flag in sessionStorage so that the page won't reload again in this session
      sessionStorage.setItem('hasReloaded', 'true');
      
      // Reload the page
      window.location.reload();
    }
  }, []);
  useEffect(() => {
    fetchImgData();
    fetchUserStatus();
  }, []);

  const handleButtonClick = async (buttonName) => {
   //  console.log("buttonName____", buttonName);
    setActiveButton(buttonName);

    if (buttonName === "On Shift") {
      const OnSft = "ONS";
      const data = {
        Emp_mst_empl_id,
        Site_cd,
        OnSft,
      };
      try {
        const response = await httpCommon.post("/update_emp_status.php", data);
        if (response.data.status === "SUCCESS") {
          fetchUserStatus();
          
          const errorMessage = "User Status Update is Successfully!";
          setSnackbarOpen(true);
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity('error');
          
          onRowClick(OnSft);
        }
      } catch (error) {
        console.error(error);
      }

      //
    } else if (buttonName === "On Call") {
      const OnSft = "ONC";
      const data = {
        Emp_mst_empl_id,
        Site_cd,
        OnSft,
      };
      try {
        const response = await httpCommon.post("/update_emp_status.php", data);
       // console.log("response____sts___",response);
        if (response.data.status === "SUCCESS") {
          fetchUserStatus();
          
          const errorMessage = "User Status Update is Successfully!";
          setSnackbarOpen(true);
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity('error');
          onRowClick(OnSft);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (buttonName === "Off Shift") {
      const OnSft = "OFS";
      const data = {
        Emp_mst_empl_id,
        Site_cd,
        OnSft,
      };
      try {
        const response = await httpCommon.post("/update_emp_status.php", data);
        if (response.data.status === "SUCCESS") {
          fetchUserStatus();
          
          const errorMessage = "User Status Update is Successfully!";
          setSnackbarOpen(true);
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity('error');
          onRowClick(OnSft);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (buttonName === "On Leave") {
      const OnSft = "ONL";
      const data = {
        Emp_mst_empl_id,
        Site_cd,
        OnSft,
      };
      try {
        const response = await httpCommon.post("/update_emp_status.php", data);
        if (response.data.status === "SUCCESS") {
          fetchUserStatus();
          
          const errorMessage = "User Status Update is Successfully!";
          setSnackbarOpen(true);
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity('error');
          onRowClick(OnSft);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  useEffect(() => {
    let timer;
    if (snackbarOpen) {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            setSnackbarOpen(false);
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 100);
    } else {
      setProgress(0);
    }
    return () => {
      clearInterval(timer);
    };
  }, [snackbarOpen]);
  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      localStorage.removeItem("site_ID");
      localStorage.removeItem("emp_mst_login_id");
      localStorage.removeItem("site_title");
      router.replace("/");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  // const handleClickItem = (path) => {
  //   popover.onClose();
  //   router.push(path);
  // };
  const handleClickItem = () => {
    popover.onClose();
    router.push(paths.dashboard.user.profile);
  };
  const getBorderColor = () => {
    // Set border color based on UserStatus
    if (UserStatus === "ONS") {
      return "#28B463";
    } else if (UserStatus === "ONC") {
      return "#F1C40F";
    } else if (UserStatus === "OFS") {
      return "#E74C3C";
    } else if (UserStatus === "ONL") {
      return "#95A5A6";
    }
  };
  const commonStyle = {
    width: 40,
    height: 40,
    border: (theme) => `solid 3px ${getBorderColor()}`,
  };
  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        className="advtarImgClass"
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
       
        {getDbImg && getDbImg.length > 0 ? (
          
          <Avatar
            src={getDbImg[0].attachment}
            alt={getDbImg[0].name}
            sx={{
              width: 40,
              height: 40,
              // border: (theme) => `solid 2px ${theme.palette.background.default}`,
              border: (theme) => `solid 3px ${getBorderColor()}`,
              
            }}
          >
            {UserLoginId.charAt(0).toUpperCase()}
            <span
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 10,
              height: 10,
              backgroundColor: "green", // Change color based on status
              borderRadius: "50%", // Ensure the dot is circular
            }}
          ></span>
          </Avatar>
        ) : (
          <div className="UserNavProfileText"
          style={{
            width: "40px",
            height: "40px",
            border: `solid 3px ${getBorderColor()}`,
            fontSize: "1.25rem",
            lineHeight: "1",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: "0",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            background: "linear-gradient(135deg, #80808000 0%, #ffffff 100%)"
          }} 
          >
            
           {/* <span >{UserLoginId.charAt(0).toUpperCase()}</span>  */}
           {UserLoginId.charAt(0).toUpperCase()}
           <span
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 10,
              height: 10,
              backgroundColor: `${getBorderColor()}`, // Change color based on status
              borderRadius: "50%", // Ensure the dot is circular
            }}
          ></span>
          </div>
        )}

        {/* <Avatar
          src={user?.photoURL}
          alt={user?.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {UserLoginId.charAt(0).toUpperCase()}
        </Avatar> */}
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 200, p: 0 }}
        className="NewNavCls"
      >
        <Box sx={{ p: 2, pb: 1.5 }} className="NavNewBtn">
          {/* <Typography variant="subtitle2" noWrap>
            {UserLoginId}
          </Typography> */}
          <div className="d-flex">
            <div
              className={`py-3 px-2 d-flex align-items-center justify-content-center ons ${
                activeButton === "On Shift" ? "active" : ""
              } `}
              style={{
                backgroundColor:
                  UserStatus === "ONS"
                    ? "#28B463"
                    : activeButton === "On Shift"
                    ? "#28B463"
                    : "",
                //  pointerEvents: UserStatus === "ONS" ? "none" : "auto",
              }}
              onClick={() => handleButtonClick("On Shift")}
            >
              <p
                className={`mb-0 ml-2 mr-2 ${
                  UserStatus === "ONS"
                    ? "PactClr"
                    : activeButton === "On Shift"
                    ? "PactClr"
                    : ""
                }`}
              >
                On Shift
              </p>
            </div>
            <div
              className={`py-3 px-2 d-flex align-items-center justify-content-center border-left border-right onc ${
                activeButton === "On Call" ? "active" : ""
              } ${UserStatus === "ONC" ? "disabled" : ""}`}
              style={{
                backgroundColor:
                  UserStatus === "ONC"
                    ? "#F1C40F"
                    : activeButton === "On Call"
                    ? "#F1C40F"
                    : "",
                //  pointerEvents: UserStatus === "ONC" ? "none" : "auto",
              }}
              onClick={() => handleButtonClick("On Call")}
            >
              <p
                className={`mb-0 ml-2 mr-2 ${
                  UserStatus === "ONC"
                    ? "PactClr"
                    : activeButton === "On Call"
                    ? "PactClr"
                    : ""
                }`}
              >
                On Call
              </p>
            </div>
            <div
              className={`py-3 px-2 d-flex align-items-center justify-content-center border-right ofs ${
                activeButton === "Off Shift" ? "active" : ""
              } ${UserStatus === "OFS" ? "disabled" : ""}`}
              style={{
                backgroundColor:
                  UserStatus === "OFS"
                    ? "#E74C3C"
                    : activeButton === "Off Shift"
                    ? "#E74C3C"
                    : "",
                // pointerEvents: UserStatus === "OFS" ? "none" : "auto",
              }}
              onClick={() => handleButtonClick("Off Shift")}
            >
              <p
                className={`mb-0 ml-2 mr-2 ${
                  UserStatus === "OFS"
                    ? "PactClr"
                    : activeButton === "Off Shift"
                    ? "PactClr"
                    : ""
                }`}
              >
                Off Shift
              </p>
            </div>
            <div
              className={`py-3 px-2 d-flex align-items-center justify-content-center onl ${
                activeButton === "On Leave" ? "active" : ""
              }${UserStatus === "ONL" ? "disabled" : ""}`}
              style={{
                backgroundColor:
                  UserStatus === "ONL"
                    ? "#95A5A6"
                    : activeButton === "On Leave"
                    ? "#95A5A6"
                    : "",
                //  pointerEvents: UserStatus === "ONL" ? "none" : "auto",
              }}
              onClick={() => handleButtonClick("On Leave")}
            >
              <p
                className={`mb-0 ml-2 mr-2 ${
                  UserStatus === "ONL"
                    ? "PactClr"
                    : activeButton === "On Leave"
                    ? "PactClr"
                    : ""
                }`}
              >
                On Leave
              </p>
            </div>
          </div>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} className="DivderAccount" />

        <Stack sx={{ p: 1 }}>
          {/* {OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              onClick={() => handleClickItem(option.linkTo)}
            >
              {option.label}
            </MenuItem>
           
          ))} */}
          <MenuItem
            onClick={handleClickItem}
            sx={{ fontWeight: "fontWeightBold" }}
          >
            <Iconify
              icon="iconamoon:profile-fill"
              style={{ marginRight: "5px" }}
            />{" "}
            Profile Setting
          </MenuItem>
          <Divider sx={{ borderStyle: "dashed" }} />
          <MenuItem
            onClick={handleLogout}
            sx={{ fontWeight: "fontWeightBold" }}
          >
            <Iconify
              icon="material-symbols:logout"
              style={{ marginRight: "5px" }}
            />{" "}
            Sign Out
          </MenuItem>
        </Stack>
      </CustomPopover>
      <Snackbar
                open={snackbarOpen}
                autoHideDuration={null}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                // sx={{
                //   boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)'
                // }}
                sx={{
                  boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)',
                  '& .MuiAlert-filledError': {
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: '600',
                    position: 'relative',
                    animation: snackbarOpen ? 'bounce-in 0.5s ease-out' : 'none', // Apply bouncing animation conditionally
                  },
                }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity="success"
                  variant="filled"
                  // sx={{ backgroundColor: '#fff', color: '#000', fontWeight: '600', position: 'relative' }}
                  sx={{
                    '@keyframes bounce-in': {
                      '0%': { transform: 'scale(0.9)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }}
                >
                  {snackbarMessage}
                  
                  <LinearProgress variant="determinate" value={progress} style={{ width: '99%', position: 'absolute', bottom: '0',marginLeft: '-50px',
                  }}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'green', // Change the color here
                    },
                  }}
                   />
                   
                </Alert>
              </Snackbar>
      <ToastContainer />
    </>
  );
}
