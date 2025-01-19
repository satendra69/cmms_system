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
  Alert,
  Autocomplete,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Snackbar,
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
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import { Box, width } from "@mui/system";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { format } from "date-fns";

export default function UserFormEmp({setLId, handleClose, setDataEmp, handleSubmit,RowID,selectedLoginId,emplId,empName}) {

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
  const [progress, setProgress] = useState(0);
  const [userLabel, setUserLabel] = useState([]);

  const navigate = useNavigate();
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  // Extrating parameters
  const location = useLocation();
  const { state } = location;
  const queryParams = new URLSearchParams(location.search);
  
  const [defaultSite, setDefaultSite] = useState("");
  const [defaultLanguage, setDefaultLanguge] = useState("");
  const [error2,setError2] = useState("");

  // snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const [defaultSettings, setDefaultSettings] = useState({
    defaultSite: [],
    defaultLanguage: [],
    privalgeTemp: [],
  });





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


  React.useEffect(()=>{
 
    if(emplId && empName){

      setData((pre)=>({
        ...pre,
        empl_id:emplId,
        name:empName
      }))
  
    }
  
    },[selectedLoginId])

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

  // Privalge Template DRP
  const [privalageDrp, setPrivalageDrp] = useState([{}]);
  const [selectedPrivalage, setSelectedPrivalage] = useState("");

  // SiteCode DRP
  const [sitCode, setSiteCodeDrp] = useState([{}]);
  const [selectedSitCode, setSelectedSitCode] = useState("");

  // Default Language
  const [languageDrp, setLanguageDrp] = useState([{}]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

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
      }, 400);
    } else {
      setProgress(0);
    }
    return () => {
      clearInterval(timer);
    };
  }, [snackbarOpen]);


  // fetchDefalut Settings
  const fetchDefalutSettings = async () => {
    try {
      const response = await httpCommon.get("/get_user_default_settigs.php");

      if (response.data) {
        const data = response.data.data;
        if (data) {
          setDefaultSettings((prevState) => ({
            ...prevState,
            privalgeTemp: data.privilege,
            defaultSite: data.default_site,
            defaultLanguage: data.language,
          }));
        }

        const privalage = data.privilege;
        const default_site = data.default_site;
        const defaultLanguage = data.language;

        // Formatted privalge
        const formattedPrivalge = privalage.map((item) => ({
          label: `${item.template_cd} : ${item.template_descs}`,
          value: `${item.template_cd} : ${item.template_descs}`,
        }));
        setPrivalageDrp(formattedPrivalge);


        // default site
        const formattedDefaultSite = default_site.map((item) => ({
          label: `${item.site_cd} : ${item.site_name}`,
          value: `${item.site_cd} : ${item.site_name}`,
        }));
        setSiteCodeDrp(formattedDefaultSite);
        setSelectedSitCode(`${default_site[0].site_cd} : ${default_site[0].site_name}`);

        // default language
        const formattedDefaultLanguage = defaultLanguage.map((item) => ({
          label: `${item.language_cd} : ${item.descs}`,
          value: `${item.language_cd} : ${item.descs}`,
        }));

        const filterDefaultLanguage = defaultLanguage.find((item)=> item.language_cd === "DEFAULT" )
        setLanguageDrp(formattedDefaultLanguage);
        setSelectedLanguage(`${filterDefaultLanguage.language_cd} : ${filterDefaultLanguage.descs}`);
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  };

  useEffect(() => {
    fetchDefalutSettings();
  }, []);




  useEffect(() => {
    const getuserLabel = async () => {
      const site_cd = site_ID;
      try {
        const response = await httpCommon.get(
          "/get_user_label.php?site_cd=" + site_cd,
        );
      
        setUserLabel(response.data.usr_label);
      } catch (error) {
        console.log("error");
      }
    };
    getuserLabel();
  }, []);


  
  const handleTogglePasswordVisibility = () => {
    setToogle(!toogle);
  };

  const onClickChange = (event) => {

      handleSubmitForm();

  };

  const handleToastError = (msg) => {
const errorMessage = `Please fill the required field: ${msg}`
    setSnackbarOpen(true);
    setSnackbarMessage(errorMessage);
    setSnackbarSeverity("error");
  };

  //handle Password
  function validatePassword(password) {
    let regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;

    if (password.length < 5) {

      const errorMessage = `The length of the password must be atleast 5`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError2("password");

    
    } else if (regex.test(password)) {
      return false;
    } else {

      const errorMessage = `Password must  contain at least one number and alphabet character.`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError2("password");
      return true;
    }
  }

  // Handle Submit Form
  const handleSubmitForm = async () => {

    if (error) {

      const errorMessage = `Duplicate Data Found In The Database`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError2("empl_id");
    } else if (!data.empl_id) {
      handleToastError("User ID");
      setError2("empl_id");
    } else if (!data.password) {
      handleToastError("Password");
      setError2("password");
    } else if (validatePassword(data.password)) return;
    else if (!data.name) {
      handleToastError("Name");
      setError2("Name");
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
        selectedSitCode ?selectedSitCode.replace(/ .*/, "") : "",
        default_language:
        selectedLanguage
            ? selectedLanguage.replace(/ .*/, "")
            : "",
        emp_mst_privilege_template:selectedPrivalage?selectedPrivalage.replace(/ .*/, ""):"",
        expired_date:
          date && date.expired_date
            ? format(new Date(date.expired_date), "yyyy-MM-dd")
            : "",
        login_id: data.empl_id,
        audit_user: loginUser,
        emp_mst_create_by: loginUser,
      };

    
      try {
        const response = await httpCommon.post("/insert_new_user1.php", body);
     //   console.log("User_Response",response)
        if (response.data.status === "SUCCESS") {

    
          if(RowID){
            setDataEmp((pre) => ({
              ...pre,
              emp_mst_login_id: data.empl_id + " : " + data.name,
              row_id:RowID
            }));
            setLId(true)
          }
          else{
            setDataEmp((pre) => ({
              ...pre,
              emp_mst_login_id: data.empl_id + " : " + data.name,
              emp_mst_privilege_template:selectedPrivalage
            }));
          }
          setLId(true)
        
          handleSubmit();
        } else {
         
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data,
            customClass: {
              container: "swalcontainercustom",
            },
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    // }
  };


  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = userLabel.find(
      (item) => item.column_name === columnName,
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.find(
      (item) => item.column_name === columnName,
    );

    if (foundItem && foundItem.cf_label_required === "1") {
      return foundItem.cf_label_required;
    }
    return "";
  };

  const handleData = (e) => {
    setError2("")
    const name1 = e.target.name;
    if (name1 === "empl_id") {
      const response = tableData.find(
        (item) => item.empl_id === e.target.value,
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
 
  // cf_user_prv_tmpl
  // cf_user_default_lang
  // cf_user_default_site
  // cf_user_usr_ID
  // cf_user_pass
  // cf_user_name
  // cf_user_exp_date
  // cf_user_sys_admin
  // cf_user_last_pwd_changed
  // cf_user_last_login



  return (
    <>
     

      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div>
          <div className="MainOrderFromGd" style={{ backgroundColor: "white" }}>
            <Divider />
            {console.log("error2",error2)}
            <Grid container spacing={12} sx={{ padding: "8px" }}>
              {/* left */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" style={{ color: "red" }}>
                    {findCustomizeLabel("cf_user_usr_ID") || "User ID"}
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="empl_id"
                      size="small"
                      className={`Extrasize ${
                        error2 === "empl_id"
                          ? "errorEmpty"
                          : ""
                      }`}
                      value={data.empl_id}
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

                <Stack spacing={1} mt={2}>
                  <Typography variant="subtitle2" style={{ color: "red" }}>
                    {findCustomizeLabel("cf_user_pass") || "Password"}
                  </Typography>
                  <div>
                    <TextField
                      component={"text"}
                      id="outlined-basic"
                      variant="outlined"
                      name="password"
                      size="small"
                      placeholder="******"
                      autoComplete="new-password"
                      onChange={handleData}
                      fullWidth
                      className={`Extrasize ${
                        error2 === "password"
                          ? "errorEmpty"
                          : ""
                      }`}
                      type={toogle ? "text" : "password"}
                      inputProps={{ maxLength: 50 }}
                      InputProps={{
                        endAdornment: data.password && (
                          <InputAdornment position="end" >
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              style={{marginRight:"0px"}}
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
                    {findCustomizeLabel("cf_user_name") || " Name:"}
                  </Typography>
                  <div>
                    
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="name"
                      size="small"
                      value={data.name}
                      onChange={handleData}
                      className={`Extrasize ${
                        error2 === "Name"
                          ? "errorEmpty"
                          : ""
                      }`}
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
                    {findCustomizeLabel("cf_user_exp_date") || "Expired Date"}
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
              <Grid
                item
                xs={12}
                md={6}
                sx={{ paddingLeft: "20px" }}
                className="right_div"
              >
                <Grid container>
                  <Grid xs={12} md={12}>
                    <Typography
                      variant="subtitle2"
                      className="flexcheckbox "
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {findCustomizeLabel("cf_user_sys_admin") || "System Administrator"}
                  
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
                        whiteSpace: "nowrap",
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
                          "cf_user_disable_auto_logout",
                        )
                          ? "red"
                          : "black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        whiteSpace: "nowrap",
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
                        <Typography
                          variant="subtitle2"
                          sx={{ whiteSpace: "nowrap" }}
                        >
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
                          {findCustomizeLabel("cf_user_last_login") || "Last Login"}
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
                        <Typography
                          variant="subtitle2"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {findCustomizeLabel("cf_user_last_login") || "loading..."}
                  
                        </Typography>

                        <div className="mr40">
                          {date && date.last_pwd_changed
                            ? format(
                                new Date(date.last_pwd_changed),
                                "dd/MM/yyyy",
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
                  {/* Default Site Code */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {findCustomizeLabel("cf_user_default_site") ||
                        "Default Site Code"}
                    </Typography>

                    {/* site Code Cpi */}
                    <Autocomplete
                      options={sitCode}
                      value={
                        selectedSitCode
                      }
                      onChange={(event, value) => {
                        setSelectedSitCode(value.label);
                      }}
                      renderInput={(params) => (
                        <div>
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select..."
                            variant="outlined"
                          />
                        </div>
                      )}
                    />

                    {/* <TextField
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
                    /> */}
                  </Grid>

                  {/* Default Language */}
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ mt: { xs: 1, md: 0 }, ml: { xs: 0, md: 2 } }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {findCustomizeLabel("cf_user_default_lang") ||
                        "Default Language"}
                    </Typography>
                    <div>
                    {/* Default Language */}
                    <Autocomplete
                      options={languageDrp}
                      value={
                        selectedLanguage 
                      }
                      onChange={(event, value) => {
                        setSelectedLanguage(value.label);
                      }}
                      renderInput={(params) => (
                        <div>
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select..."
                            variant="outlined"
                          />
                        </div>
                      )}
                    />
                      {/* <TextField
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
                      /> */}

                    </div>
                  </Grid>

                  {/* Default Privalage Template */}
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ mt: { xs: 1, md: 0 }, ml: { xs: 0, md: 2 } }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {findCustomizeLabel("cf_user_prv_tmpl") ||
                        "Privalage Template"}
                    </Typography>
                    <div>

                    <Autocomplete
                      options={privalageDrp}
                      value={
                        selectedPrivalage 
                      }
                      onChange={(event, value) => {
                        setSelectedPrivalage(value.label);
                      }}
                      renderInput={(params) => (
                        <div>
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select..."
                            variant="outlined"
                          />
                        </div>
                      )}
                    />




                      {/* <TextField
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
                      /> */}
                    </div>
                  </Grid>
                </div>
              </div>
            </Grid>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "15px",
            marginLeft: "auto",
          }}
        >
          <div style={{ marginLeft: "auto" }}>
            <Button
              // component={RouterLink}
              onClick={onClickChange}
              variant="contained"
              startIcon={<Iconify icon="mingcute:save-fill" />}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                marginRight: "10px",
              }}
            >
              Add
            </Button>
            <Button
              variant="soft"
              color="error"
              startIcon={<Iconify icon="jam:close" />}
              onClick={() => handleClose()}
            >
              Close
            </Button>
          </div>
        </div>
        <ToastContainer />

        <div className="AssetFromSnackbar">
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={null}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            // sx={{
            //   boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)'
            // }}
            sx={{
              boxShadow:
                "0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)",
              "& .MuiAlert-filledError": {
                backgroundColor: "#fff",
                color: "#000",
                fontWeight: "600",
                position: "relative",
                animation: snackbarOpen ? "bounce-in 0.5s ease-out" : "none", // Apply bouncing animation conditionally
              },
            }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              variant="filled"
              // sx={{ backgroundColor: '#fff', color: '#000', fontWeight: '600', position: 'relative' }}
              sx={{
                "@keyframes bounce-in": {
                  "0%": { transform: "scale(0.9)" },
                  "50%": { transform: "scale(1.05)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            >
              {snackbarMessage}

              <LinearProgress
                variant="determinate"
                value={snackbarOpen ? 100 - progress : 0}
                style={{
                  width: "99%",
                  position: "absolute",
                  bottom: "0",
                  marginLeft: "-50px",
                }}
                sx={{
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "green", // Change the color here
                  },
                }}
              />
            </Alert>
          </Snackbar>
        </div>

      </Container>
    </>
  );
}
