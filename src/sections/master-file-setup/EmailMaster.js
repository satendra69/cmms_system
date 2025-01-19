import {
  Autocomplete,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSettingsContext } from "src/components/settings";
import { FaDollarSign } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import { FcImport, FcSettings } from "react-icons/fc";
import { MdOutgoingMail } from "react-icons/md";
import Iconify from "src/components/iconify";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Stack, display } from "@mui/system";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { IoServerOutline } from "react-icons/io5";
import { TbAddressBook } from "react-icons/tb";
import IconButtons from "../_examples/mui/button-view/icon-buttons";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { GoEyeClosed } from "react-icons/go";
import { FaMegaport } from "react-icons/fa";
import { MdOutlineEnhancedEncryption } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
function EmailMaster() {
  const [Tabvalue, setTabValue] = useState(0);
  const [Permanent_IDFlag, setPermanentIDFlag] = useState([]);
  const [modalDefault, setModalDefault] = useState(false);
  const [DefaultMandatoryFiled, setDefaultMandatoryFiled] = useState([]);
  const [password, setPassword] = useState("");
  const settings = useSettingsContext();
  const [isAssetNoEmpty, setIsAssetNoEmpty] = useState(false);
  const [errorField, setErrorField] = useState(null);
  const [checked, setChecked] = useState(false);
  const [emailData, setEmailData] = useState({
    eserver: "",
    eAddress: "",
    password: "",
    ename: "",
    portno: "",
    ese: "",
  });

  //   Toggel Password
  const [showPassword, setShowPassword] = useState(false);

  const [EmailServerOptions, setEmailServerOptions] = useState([
    { label: "SSL", value: "S" },
    { label: "TLS", value: "T" },
  ]);

  const [selected_EmailServerOptions, setSelectedEmailServerOptions] = useState(
    []
  );

  const [Emailmeathod, setEmailmeathod] = useState([
    { label: "SMTP Mail", value: "smtp" },
    { label: "PB Mail", value: "pb" },
    { label: "PBNI Mail", value: "I" },
  ]);

  const [selected_Emailmeathod, setSelectedEmailmeathod] = useState([]);

  console.log("Cheacked", checked);
  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = DefaultMandatoryFiled.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
    }
    return "";
  };

  const handlePassword = (e) => {
    console.log("password", e.target.value);
  };
  function CustomTextField({ rightIcons, ...props }) {
    return (
      <TextField
        {...props}
        InputProps={{
          endAdornment: rightIcons && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              {rightIcons.map((icon, index) => (
                <IconButton key={index} onClick={icon.props.onClick}>
                  {icon}
                </IconButton>
              ))}
            </div>
          ),
        }}
      />
    );
  }

  // const handleChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };
  // handleChange
  const handleChange = (e) => {
    setEmailData((pre) => ({
      ...pre,
      [e.target.name]: e.target.value,
    }));
  };
  //handle cancel
  const handleCancelClick = () => {
    setPermanentIDFlag("");
  };
  //   handle edit
  const handleEditClick = () => {
    setModalDefault(true);
  };

  return (
    <div className="Form grid3" style={{ marginTop: "40px" }}>
      {/*    Email Meathod */}
      <Stack spacing={1} sx={{ pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          className={findCustomizerequiredLabel("ast_det_depr_method")}
        >
          {/* {findCustomizeLabelDet("ast_det_depr_method") ||
              "Depreciation Method"} */}
          Email Meathod
        </Typography>
        <Autocomplete
          options={Emailmeathod}
          value={selected_Emailmeathod?.label ?? ""}
          onChange={(event, value) => {
            setSelectedEmailmeathod(value);
            setErrorField(null);
          }}
          //getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              variant="outlined"
              className={
                errorField === "ast_det_depr_method" ? "erroBorderadd" : ""
              }
              fullWidth
            />
          )}
        />
      </Stack>
      {/*Email Server*/}
      <Stack spacing={1} sx={{ pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          // className={findCustomizerequiredLabel("ast_mst_parent_id")}
        >
          {/* {findCustomizeLabel("ast_mst_parent_id") ||
      "Parent Flag"} */}
          Email Server
        </Typography>
        <div
        // ref={assetNoAutocompleteRef}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleChange}
            name="eserver"
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <IoServerOutline />
            //     </InputAdornment>
            //   ),
            // }}
            // value={Permanent_IDFlag || ""}
            // disabled
          />
        </div>
      </Stack>

      {/* Email Address */}
      <Stack spacing={1} sx={{ pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          // className={findCustomizerequiredLabel("ast_mst_parent_id")}
        >
          {/* {findCustomizeLabel("ast_mst_parent_id") ||
      "Parent Flag"} */}
          Email Address
        </Typography>
        <div
        // ref={assetNoAutocompleteRef}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleChange}
            name="eAddress"
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <TbAddressBook />
            //     </InputAdornment>
            //   ),
            // }}
            // value={Permanent_IDFlag || ""}
            // disabled
          />
        </div>
      </Stack>

      {/* password */}
      <Stack spacing={1} sx={{ pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          // className={findCustomizerequiredLabel("ast_mst_parent_id")}
        >
          {/* {findCustomizeLabel("ast_mst_parent_id") ||
      "Parent Flag"} */}
          Password
        </Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          size="small"
          name="password"
          onChange={handleChange}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          fullWidth
          // InputProps={{
          //   endAdornment: (
          //     <InputAdornment
          //       position="end"
          //       onClick={() => setShowPassword(!showPassword)}
          //     >
          //       {showPassword ? <GoEyeClosed /> : <FaEye />}
          //     </InputAdornment>
          //   ),
          // }}
          // value={Permanent_IDFlag || ""}
          // disabled
        />
      </Stack>

      <Stack spacing={1} sx={{ pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          // className={findCustomizerequiredLabel("ast_mst_parent_id")}
        >
          {/* {findCustomizeLabel("ast_mst_parent_id") ||
      "Parent Flag"} */}
          Email Name
        </Typography>
        <div
        // ref={assetNoAutocompleteRef}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleChange}
            name="ename"
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <MdDriveFileRenameOutline />
            //     </InputAdornment>
            //   ),
            // }}
            // value={Permanent_IDFlag || ""}
            // disabled
          />
        </div>
      </Stack>
      {/* Port No */}
      <Stack spacing={1} sx={{ pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          // className={findCustomizerequiredLabel("ast_mst_parent_id")}
        >
          {/* {findCustomizeLabel("ast_mst_parent_id") ||
      "Parent Flag"} */}
          Port Number
        </Typography>
        <div
        // ref={assetNoAutocompleteRef}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleChange}
            name="portno"
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <FaMegaport />
            //     </InputAdornment>
            //   ),
            // }}
            // value={Permanent_IDFlag || ""}
            // disabled
          />
        </div>
      </Stack>

      {/*    Email Server Encryption */}
      <Stack spacing={1} sx={{ pb: 1.5 }}>
        <Typography
          variant="subtitle2"
          className={findCustomizerequiredLabel("ast_det_depr_method")}
        >
          {/* {findCustomizeLabelDet("ast_det_depr_method") ||
            "Depreciation Method"} */}
          Email Server Encryption
        </Typography>
        <Autocomplete
          options={EmailServerOptions}
          value={selected_EmailServerOptions?.label ?? ""}
          onChange={(event, value) => {
            setSelectedEmailServerOptions(value);
            setErrorField(null);
          }}
          //getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              variant="outlined"
              className={
                errorField === "ast_det_depr_method" ? "erroBorderadd" : ""
              }
              fullWidth
            />
          )}
        />
      </Stack>

      <Stack spacing={1} sx={{ pb: 1.5, mt: 3 }}>
        <FormControlLabel
          required
          control={<Checkbox />}
          label="SMTP Server requires userid/Password"
          onChange={(e) => setChecked(e.target.checked)}
        />
      </Stack>
    </div>
  );
}

export default EmailMaster;
