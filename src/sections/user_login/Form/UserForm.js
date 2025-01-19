import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
import { BsBookmarkDash } from "react-icons/bs";
import {
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { RouterLink } from "src/routes/components";

import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import MasterDialogLogin from "./LoginId/MasterDialogLogin";
import { useSettingsContext } from "src/components/settings";
import { template } from "lodash";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import { useLocation, useNavigate } from "react-router";
import adminImg from "./leftImg.jpg";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { Box, width } from "@mui/system";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { format } from "date-fns";

export default function UserForm({}) {
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);
  const settings = useSettingsContext();
  const [Button_save, setButton_save] = React.useState("Create");
  const [error, setError] = React.useState("");
  const [toogle, setToogle] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [ErrorField, setErrorField] = useState("");

  const [userLabel, setUserLabel] = useState([]);

  const navigate = useNavigate();
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  // Extrating parameters
  const location = useLocation();
  const { state } = location;
  const queryParams = new URLSearchParams(location.search);
  const RowID = queryParams.get("rowID");
  const [defaultSite, setDefaultSite] = useState("");
  const [defaultLanguage, setDefaultLanguge] = useState("");
  // text-fields
  const [data, setData] = React.useState({
    empl_id: "",
    name: "",
    default_site: site_ID,
    default_language: "DEFAULT",
    audit_user: "",
    password: "",
    template: "",
    cf_user_failed_attempt: "0",
  });

  // check-data
  const [checkData, setCheckData] = React.useState({
    sys_admin: 0,
    cf_user_locked: 0,
    cf_user_disable_auto_logout: 0,
  });

  // dates

  const [date, setDate] = useState({
    last_login: "",
    last_pwd_changed: "",
    expired_date: "",
  });
  const [user, setUser] = useState({});

  // get userDetails
  const fetchUser = async (row_id) => {
    console.log("row_id", row_id);
    const response = await httpCommon.get(
      `/get_users_det.php?row_id=${row_id}`
    );
    console.log("response_user", response);
    if (response.data.status === "SUCCESS") {
    }
  };
  useEffect(() => {
    if (RowID) {
      fetchUser(RowID);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await httpCommon.get("/get_user_details.php");

        setTableData(response.data.data.cf_user_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUser();
  }, []);

  // filter funcion end

  // language
  useEffect(() => {
    const language = async () => {
      const response = await httpCommon.get("/get_language.php");

      setDefaultLanguge(response.data.data);
      const fetch = response.data.data;

      const filterData = fetch.find(
        (item) => item.language_cd === data.default_language
      );
      if (filterData) {
        setData((pre) => ({
          ...pre,
          default_language: filterData.language_cd + " : " + filterData.descs,
        }));
      }
    };
    language();
  }, [data]);

  // site
  useEffect(() => {
    const site = async () => {
      const response = await httpCommon.get("/get_sitecode.php");
      console.log("responseSite", response);
      setDefaultSite("");
      const fetch = response.data.data;

      const filterData = fetch.find((item) => item.site_cd === site_ID);

      setData((pre) => ({
        ...pre,
        default_site: filterData.site_cd + " : " + filterData.site_name,
      }));
    };
    site();
  }, []);

  useEffect(() => {
    if (RowID && state && state.row) {
      const { row } = state;
      setData((pre) => ({
        empl_id: row && row.empl_id ? row.empl_id : "",
        name: row && row.name ? row.name : "",
        default_site: row && row.default_site ? row.default_site : "",
        default_language:
          row && row.default_language ? row.default_language : "",
        audit_user: row && row.audit_user ? row.audit_user : "",
        // password: row && row.password ? row.password : "....",
        cf_user_failed_attempt:
          row && row.cf_user_failed_attempt ? row.cf_user_failed_attempt : "0",
      }));

      setCheckData((pre) => ({
        sys_admin: row && row.sys_admin ? Number(row.sys_admin) : 0,
        cf_user_locked:
          row && row.cf_user_locked ? Number(row.cf_user_locked) : 0,
        cf_user_disable_auto_logout:
          row && row.cf_user_disable_auto_logout
            ? Number(row.cf_user_disable_auto_logout)
            : 0,
      }));

      setButton_save("Update");

      setDate((pre) => ({
        last_login:
          row && row.last_login && row.last_login.date
            ? row.last_login.date
            : "",
        last_pwd_changed:
          row && row.last_pwd_changed && row.last_pwd_changed.date
            ? row.last_pwd_changed.date
            : "",
        expired_date:
          row && row.expired_date && row.expired_date.date
            ? row.expired_date.date
            : "",
      }));
    }
  }, [RowID, state]);

  const handleEditClick = (e) => {
    setTextField(e);
  };
  const handleCloseDefault = (e, result) => {
    if (result !== "backdropClick") {
      setTextField("");
      setDefaultModal(false);
    }
  };

  useEffect(() => {
    const getuserLabel = async () => {
      const site_cd = site_ID;
      try {
        const response = await httpCommon.get(
          "/get_user_label.php?site_cd=" + site_cd
        );
        console.log("response", response.data.usr_label);
        setUserLabel(response.data.usr_label);
      } catch (error) {
        console.log("error");
      }
    };
    getuserLabel();
  }, []);

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

  const handleTogglePasswordVisibility = () => {
    setToogle(!toogle);
  };

  const onClickChange = (event) => {
    event.preventDefault();

    if (Button_save === "Create") {
      handleSubmitForm();
    } else if (Button_save === "Update") {
      handleUpdateForm();
    }
  };

  const handleToastError = (msg) => {
    toast.error(`Please fill the required field: ${msg}`, {
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
  };

  //handle Password
  function validatePassword(password) {
    let regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;

    if (password.length < 5) {
      toast.error(`The length of the password must be atleast 5`, {
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
      return true;
    } else if (regex.test(password)) {
      return false;
    } else {
      toast.error(
        `Password must  contain at least one number and alphabet character.`,
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
      return true;
    }
  }

  // Handle Submit Form
  const handleSubmitForm = async () => {
    if (error) {
      toast.error(
        `User ID is required to be unique. Please enter unique User ID`,
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
    } else if (!data.empl_id) {
      handleToastError("User ID");
    } else if (!data.password) {
      handleToastError("Password");
    } else if (validatePassword(data.password)) return;
    else if (!data.name) {
      handleToastError("Name");
    } else {
      const body = {
        ...data,
        ...checkData,
        ...date,
        audit_user: AuditUser,
        last_pwd_changed:
          date && date.last_pwd_changed
            ? date.last_pwd_changed.split(" ")[0]
            : "",
        last_login:
          date && date.last_login ? date.last_login.split(" ")[0] : "",
        default_site:
          data && data.default_site ? data.default_site.replace(/ .*/, "") : "",
        default_language:
          data && data.default_language
            ? data.default_language.replace(/ .*/, "")
            : "",
        expired_date:
          date && date.expired_date
            ? format(new Date(date.expired_date), "yyyy-MM-dd")
            : "",
        login_id: data.empl_id,
        audit_user: loginUser,
        emp_mst_create_by: loginUser,
      };

      // let missingFields;
      // for (let i = 0; i < groupLabel.length; i++) {
      //   const item = groupLabel[i];

      //   const fieldValue = body[item.column_name];

      //   if (fieldValue !== null && fieldValue !== undefined && fieldValue) {
      //     missingFields = item.customize_label;
      //     console.log("missingFields",missingFields)
      //     setErrorField(item.column_name);
      //     break;
      //   }
      // }

      // if ( missingFields) {

      //   handleToastError(missingFields);

      // }
      // else {

      try {
        const response = await httpCommon.post("/insert_new_user1.php", body);
        console.log("response", response);
        if (response.data.status === "SUCCESS") {
          Swal.fire({
            icon: "success",
            title: "Sucess",
            text: "Created Successfully",
            timer: 2000,
          }).then(() => {
            navigate(`/dashboard/user/user-list`);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data,
            timer: 2000,
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    // }
  };
  // Handle Submit Form
  const handleUpdateForm = async () => {
    if (error) {
      toast.error(error, {
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
    } else if (!data.empl_id) {
      handleToastError("User ID");
    } else if (!data.password && !RowID) {
      handleToastError("Password");
    } else if (data.password && validatePassword(data.password)) return;
    else if (!data.name) {
      handleToastError("Name");
    } else {
      const body = {
        ...data,
        ...checkData,
        ...date,
        audit_user: AuditUser,
        last_pwd_changed:
          date && date.last_pwd_changed
            ? date.last_pwd_changed.split(" ")[0]
            : "",
        last_login:
          date && date.last_login ? date.last_login.split(" ")[0] : "",
        default_site:
          data && data.default_site ? data.default_site.replace(/ .*/, "") : "",
        default_language:
          data && data.default_language
            ? data.default_language.replace(/ .*/, "")
            : "",
        expired_date:
          date && date.expired_date
            ? format(new Date(date.expired_date), "yyyy-MM-dd")
            : "",
        login_id: data.empl_id,
        audit_user: loginUser,
        emp_mst_create_by: loginUser,
      };

      // let missingFields;
      // for (let i = 0; i < groupLabel.length; i++) {
      //   const item = groupLabel[i];
      //   const fieldValue = body[item.column_name];
      //   if (fieldValue !== null && fieldValue !== undefined && fieldValue.trim() === "") {
      //     missingFields = item.customize_label;
      //     setErrorField(item.column_name);
      //     break;
      //   }
      // }

      // if ( missingFields.length > 0) {

      //   handleToastError(missingFields);

      // }

      try {
        const response = await httpCommon.post("/update_password.php", body);
        console.log("responseUpdate", response);
        if (response.data.status === "SUCCESS") {
          Swal.fire({
            icon: "success",
            title: "Sucess",
            text: "Updated Successfully",
            timer: 2000,
          }).then(() => {
            navigate(`/dashboard/user/user-list`);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something Went Wrong While Creating User ID",
            timer: 2000,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Internal Api Error",
          timer: 2000,
        });

        console.log("error");
      }
    }
  };

  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = userLabel.find(
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
    const name1 = e.target.name;

    if (name1 === "empl_id") {
      const response = tableData.find(
        (item) => item.empl_id === e.target.value
      );

      if (response) {
        setError(true);
        setData((pre) => ({
          ...pre,
          [e.target.name]: e.target.value,
        }));
      } else {
        setData((pre) => ({
          ...pre,
          [e.target.name]: e.target.value,
        }));
        setError(false);
      }
    }
    setData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };
  const onClickCancel = () => {
    navigate(`/dashboard/user/user-list`);
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

      <Container
        maxWidth={settings.themeStretch ? false : "lg"}
        sx={{ height: "120px" }}
      >
        <div
          className="CustomBreadAssetSave asset"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
            height: "120px !important",
          }}
        >
          <CustomBreadcrumbs
            heading={RowID ? `Update User` : "Create New User"}
            links={[
              {
                name: "Employee",
              },
              { name: RowID ? "Update" : "Create" },
            ]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Button
                    component={RouterLink}
                    onClick={onClickChange}
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:save-fill" />}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      marginRight: "10px",
                    }}
                  >
                    {Button_save}
                  </Button>
                  <Button
                    variant="soft"
                    color="error"
                    startIcon={<Iconify icon="jam:close" />}
                    onClick={onClickCancel}
                  >
                    Close
                  </Button>
                </div>
              </div>
            }
            sx={{ mb: { xs: 5, md: 5 } }}
          />
        </div>
        <div>
          <div className="MainOrderFromGd" style={{ backgroundColor: "white" }}>
            <Divider />

            <Grid
              container
              spacing={5}
              style={{
                padding: "20px 16px 20px 20px",
              }}
            >
              {/* left */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" style={{ color: "red" }}>
                    {findCustomizeLabel("usr_grp_usr_grp") || "User ID"}
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="empl_id"
                      size="small"
                      value={data.empl_id}
                      onChange={handleData}
                      disabled={RowID ? true : false}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
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

                <Stack spacing={1} mt={2}>
                  <Typography variant="subtitle2" style={{ color: "red" }}>
                    {findCustomizeLabel("usr_grp_usr_grp") || "Password"}
                  </Typography>
                  <div>
                    <TextField
                      component={"text"}
                      id="outlined-basic"
                      variant="outlined"
                      name="password"
                      size="small"
                      placeholder={RowID ? "*****" : ""}
                      autoComplete="new-password"
                      onChange={handleData}
                      fullWidth
                      type={toogle ? "text" : "password"}
                      inputProps={{ maxLength: 50 }}
                      InputProps={{
                        endAdornment: data.password && (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {toogle ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
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

                {/*3  */}

                <Stack spacing={1} mt={2}>
                  <Typography variant="subtitle2" style={{ color: "red" }}>
                    {findCustomizeLabel("name") || " Name:"}
                  </Typography>
                  <div>
                    {/* <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="name2"
                      size="small"
                      value={data.name}
                      onChange={handleData}
                      fullWidth
                      // inputProps={{ maxLength: 50 }}
                    /> */}
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="name"
                      size="small"
                      value={data.name}
                      onChange={handleData}
                      fullWidth
                      inputProps={{ maxLength: 50 }}
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

                {/* expired Date */}

                <Stack spacing={1} mt={2}>
                  <Typography variant="subtitle2">
                    {findCustomizeLabel("expired_date") || "Expired Date"}
                  </Typography>

                  <DatePicker
                    format="dd-MM-yyyy"
                    variant="outlined"
                    className="Extrasize"
                    name="expired_date"
                    sx={{ width: "100%" }}
                    value={new Date(date.expired_date)}
                    onChange={(newDate) => {
                      setDate((pre) => ({
                        ...pre,
                        expired_date: newDate,
                      }));
                    }}
                  />
                </Stack>
              </Grid>

              {/* Right */}
              <Grid item xs={12} md={6}>
                <Grid container>
                  <Grid xs={12} md={12}>
                    <Typography
                      variant="subtitle2"
                      className="flexcheckbox "
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      System Administrator:
                      <div className="mr50">
                        <Checkbox
                          onChange={(e) =>
                            setCheckData((pre) => ({
                              ...pre,
                              sys_admin: e.target.checked,
                            }))
                          }
                          checked={checkData.sys_admin}
                        />
                      </div>
                    </Typography>
                  </Grid>

                  <Grid xs={12} md={12}>
                    <Typography
                      variant="subtitle2"
                      style={{
                        color: findCustomizerequiredLabel("cf_user_locked")
                          ? "red"
                          : "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      className="flexcheckbox "
                    >
                      {findCustomizeLabel("cf_user_locked") || "......"}
                      <div className="mr50">
                        <Checkbox
                          onChange={(e) =>
                            setCheckData((pre) => ({
                              ...pre,
                              cf_user_locked: e.target.checked,
                            }))
                          }
                          checked={checkData.cf_user_locked}
                        />
                      </div>
                    </Typography>
                  </Grid>

                  <Grid xs={12} md={12}>
                    <Typography
                      variant="subtitle2"
                      style={{
                        color: findCustomizerequiredLabel(
                          "cf_user_disable_auto_logout"
                        )
                          ? "red"
                          : "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      className="flexcheckbox"
                    >
                      {findCustomizeLabel("cf_user_disable_auto_logout") ||
                        "......"}
                      <div className="mr50">
                        <Checkbox
                          onChange={(e) =>
                            setCheckData((pre) => ({
                              ...pre,
                              cf_user_disable_auto_logout: e.target.checked,
                            }))
                          }
                          checked={checkData.cf_user_disable_auto_logout}
                        />
                      </div>
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: "2px" }}>
                  {/* 1 */}
                  <Grid item xs={12} style={{}}>
                    <Stack spacing={1}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        className="mr52"
                      >
                        <Typography variant="subtitle2">
                          {findCustomizeLabel("cf_user_failed_attempt") ||
                            "......"}
                        </Typography>
                        <div>{data.cf_user_failed_attempt}</div>
                      </div>
                    </Stack>
                  </Grid>
                  {/* 2 */}
                  <Grid item xs={12}>
                    {/* las login */}

                    <Stack spacing={1}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                          Last Login
                        </Typography>

                        {/* <TextField
                          id="outlined-basic"
                          variant="outlined"
                          name="name"
                          size="small"
                          disabled
                          sx={{ width: "30%" }}
                          value={
                            date && date.last_login
                              ? new Date(date.last_login)
                              : "00/00/0000"
                          }
                          onChange={handleData}
                          // sx={{width:"50%"}}
                          inputProps={{ maxLength: 50 }}
                        /> */}
                        <div className="mr40">
                          {date && date.last_login
                            ? format(new Date(date.last_login), "dd/MM/yyyy")
                            : "00/00/0000"}
                        </div>
                      </div>
                    </Stack>
                  </Grid>
                  {/* 3 */}
                  <Grid item xs={12}>
                    {/* last password change */}
                    <Stack spacing={1}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                          Last Password Changed
                        </Typography>

                        {/* <TextField
                          id="outlined-basic"
                          variant="outlined"
                          name="name"
                          size="small"
                          disabled
                          value={
                            date && date.last_pwd_changed
                              ? new Date(date.last_pwd_changed)
                              : "00/00/0000"
                          }
                          onChange={handleData}
                          sx={{ width: "30%" }}
                          inputProps={{ maxLength: 50 }}
                        /> */}
                        <div className="mr40">
                          {date && date.last_pwd_changed
                            ? format(
                                new Date(date.last_pwd_changed),
                                "dd/MM/yyyy"
                              )
                            : "00/00/0000"}
                        </div>
                      </div>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider style={{ marginBottom: "10px" }} />
            <Box sx={{ marginTop: "8px", marginLeft: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  alignItems: "center",

                  paddingBottom: "10px",
                  fontWeight: "500",
                }}
              >
                {/* <Iconify
                        className="IconCss"
                        icon="fluent-mdl2:financial"
                        style={{ marginRight: "4px" }}
                      /> */}
                <BsBookmarkDash size={22} style={{ marginRight: "4px" }} />
                Users Default Settings
              </div>
            </Box>

            <Grid
              container
              spacing={2}
              alignItems="flex-start"
              style={{
                padding: "20px 16px 20px 20px",
              }}
            >
              {/* Left */}

              {/* Default Site Code */}
              <div
                className="shadow11"
                style={{
                  padding: "20px 20px 20px 20px",
                  width: "100%",
                  marginLeft: "20px",
                  borderRadius: "10px",
                }}
              >
                <div className="flex2">
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {findCustomizeLabel("emp_mst_status") ||
                        "Default Site Code"}
                    </Typography>

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
                  </Grid>

                  {/* Default Language */}
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ mt: { xs: 1, md: 0 }, ml: { xs: 0, md: 2 } }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {findCustomizeLabel("default_language") ||
                        "Default Language"}
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
                                onClick={() =>
                                  handleCancelClick("default_language")
                                }
                              />

                              <Iconify
                                icon="tabler:edit"
                                onClick={() =>
                                  handleEditClick("default_language")
                                }
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          ),
                        }}
                      />
                    </div>
                  </Grid>
                </div>
              </div>

              {/* Default Template */}
              {/* <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" mb={1}>
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
                          </Grid> */}

              {/* Failed Login Attempt */}
              {/* <Grid item xs={12} md={6}>
            
          </Grid> */}
            </Grid>
          </div>
        </div>
        <ToastContainer />
      </Container>
    </>
  );
}
