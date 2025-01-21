import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSettingsContext } from "src/components/settings";
import { FaDollarSign, FaMobileAlt } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuCassetteTape } from "react-icons/lu";
import { SiMaterialformkdocs } from "react-icons/si";
import { IoIosGitPullRequest } from "react-icons/io";
import { GrHostMaintenance } from "react-icons/gr";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import { FcImport, FcSettings } from "react-icons/fc";
import { MdOutgoingMail } from "react-icons/md";
import Iconify from "src/components/iconify";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { Stack, display } from "@mui/system";
import { GiShinyPurse } from "react-icons/gi";
import httpCommon from "src/http-common";
import { Dashboard } from "@material-ui/icons";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

function SettingsMaster() {
  let site_ID = localStorage.getItem("site_ID");
  const [Tabvalue, setTabValue] = useState(0);
  const [Permanent_IDFlag, setPermanentIDFlag] = useState([]);
  const [modalDefault, setModalDefault] = useState(false);
  const [DefaultMandatoryFiled, setDefaultMandatoryFiled] = useState([]);
  const settings = useSettingsContext();
  const [DefaultLabel, setDefaultLabel] = useState([]);
  const [formData, setDefaultFormData] = useState([]);
  const [settingData, setSettingData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFormData() {
      try {
        const response = await httpCommon.get(
          `/DefaultSettingFormData.php?site_cd=${site_ID}`
        );
        if (response.data.status === "SUCCESS") {
          console.log("FormData", response);
          setDefaultFormData(response.data.data.DeafultSettings[0]);
          setSettingData((pre) => ({
            ...pre,
            Dashboard: Number(
              response.data.data.DeafultSettings[0].dft_mst_show_dashboard
            ),
            dft_mst_edit_flag:Number(
              response.data.data.DeafultSettings[0].dft_mst_edit_flag
            ),
            AssetSectionByLocation: Number(
              response.data.data.DeafultSettings[0].dft_mst_asset_selection
            ),
            MaterialReserved: Number(
              response.data.data.DeafultSettings[0].dft_mst_itm_resv
            ),
            PrintTransactionDocument: Number(
              response.data.data.DeafultSettings[0].dft_mst_print_trx
            ),
            EmailNotification: Number(
              response.data.data.DeafultSettings[0].dft_mst_mtr_email
            ),

            MrApproval: Number(
              response.data.data.DeafultSettings[0].dft_mst_mr_approval
            ),

            MRReleaseApproval: Number(
              response.data.data.DeafultSettings[0].dft_mst_mr_release_for_app
            ),

            MRApprovalClosedLoop: Number(
              response.data.data.DeafultSettings[0].dft_mst_mtr_closed_loop
            ),

            EmailMRApprover: Number(
              response.data.data.DeafultSettings[0].dft_mst_mtr_email_approver
            ),

            AutoMRApprovalEmail: Number(
              response.data.data.DeafultSettings[0]
                .dft_mst_mtr_approval_auto_send
            ),

            EmailRequestedBy: Number(
              response.data.data.DeafultSettings[0].dft_mst_mtr_email_requestor
            ),

            WrEmailNotification: Number(
              response.data.data.DeafultSettings[0].dft_mst_wkr_email
            ),

            WwEmailNotification: Number(
              response.data.data.DeafultSettings[0].dft_mst_ww_send_ntf
            ),

            DefaultWOCC: Number(
              response.data.data.DeafultSettings[0].dft_mst_wo_default_cc
            ),

            AutoWOPlanWR: Number(
              response.data.data.DeafultSettings[0].dft_mst_wr_auto_plan_wo
            ),

            GenerateWOInvoice: Number(
              response.data.data.DeafultSettings[0].dft_mst_gen_inv
            ),

            TemporaryAssetFlag: Number(
              response.data.data.DeafultSettings[0].dft_mst_temp_ast
            ),

            PMClosedLoop: Number(
              response.data.data.DeafultSettings[0].dft_mst_pm_closed_loop
            ),

            PMScheduleDate: Number(
              response.data.data.DeafultSettings[0].dft_mst_pm_schedule_date
            ),

            TimCardnotEditableMobile: Number(
              response.data.data.DeafultSettings[0].dft_mst_tim_act
            ),

            DefaultPRReleaseApproval: Number(
              response.data.data.DeafultSettings[0].dft_mst_pr_release_for_app
            ),

            PRApprovalClosedLoop: Number(
              response.data.data.DeafultSettings[0].dft_mst_pur_closed_loop
            ),

            EmailPRApprover: Number(
              response.data.data.DeafultSettings[0].dft_mst_pur_email_approver
            ),

            AutoPRApprovalEmail: Number(
              response.data.data.DeafultSettings[0]
                .dft_mst_pur_approval_auto_send
            ),

            EmailRequestedPRApproved: Number(
              response.data.data.DeafultSettings[0].dft_mst_pur_email_requestor
            ),

            OrderPointAutoGenratePR: Number(
              response.data.data.DeafultSettings[0].dft_mst_order_point_pr
            ),

            AutoGenratePO: Number(
              response.data.data.DeafultSettings[0].dft_mst_generate_po
            ),

            AutoClosePO: Number(
              response.data.data.DeafultSettings[0].dft_mst_po_auto_close
            ),
            RowID: response.data.data.DeafultSettings[0].RowID,
          }));
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchFormData();
  }, []);
  const onClickCancel = () => {
    navigate(`/dashboard`, {});
  };

  // Setting Label
  const getDefaultFromLebel = async () => {
    try {
      const response = await httpCommon.get("/get_default_from_lebal.php");
      // console.log("response____getLabel",response);
      if (response.data.status === "SUCCESS") {
        console.log("responseLabel", response);
        setDefaultLabel(response.data.data.dft_mst);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getDefaultFromLebel();
    }
    fetchData();
  }, []);

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = DefaultMandatoryFiled.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
    }
    return "";
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

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //handle cancel
  const handleCancelClick = () => {
    setPermanentIDFlag("");
  };
  //   handle edit
  const handleEditClick = () => {
    setModalDefault(true);
  };
  const handleSelect = (fieldName, value) => {
    setSettingData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  // update_default_settings.php
  const handleSubmitForm = async () => {
    console.log("settingData", settingData);

    try {
      const response = await httpCommon.post("/update_default_settings.php", {
        ...settingData,
        site_cd: site_ID,
      });
      console.log("response", response);
      if (response.data.status === "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Default Settings Updated Successfully.",
          confirmButtonText: "OK",
          timer: 2000,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = DefaultLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };
  return (
    <>
      <div className="buttonsTop">
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
          onClick={onClickCancel}
        >
          Close
        </Button>
      </div>

      <div className="Form grid3" style={{ marginTop: "20px" }}>
        <div
          className="backd"
          style={{
            borderRadius: "8px",
            padding: "12px",
            height: "maxcontent",
          }}
        >
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: 1, font: "bold" }}
          >
            <LuLayoutDashboard size={28} style={{ color: "gray" }} />
            Dashboard
          </Typography>
          <div>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) =>
                  handleSelect("Dashboard", e.target.checked ? 1 : 0)
                }
              />
            }
            label={
              findCustomizeLabel("dft_mst_show_dashboard") || "Show Dashboard:"
            }
            sx={{ mt: 1 }}
            checked={settingData.Dashboard ? settingData.Dashboard : 0}
            name="SMTP Server requires userid/Password"
          />
          </div>
            {/*2  */}
            <div>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) =>
                  handleSelect("dft_mst_edit_flag", e.target.checked ? 1 : 0)
                }
              />
            }
            label={
              findCustomizeLabel("dft_mst_edit_flag") || "Disable Dashboard Edit:"
            }
            sx={{ mt: 1 }}
            checked={settingData.dft_mst_edit_flag ? settingData.dft_mst_edit_flag : 0}
            name="Disable flag"
          />
          </div>


        </div>

        {/* Asset */}
        <div
          className="backd"
          style={{
            borderRadius: "8px",
            padding: "12px",
            height: "maxcontent",
          }}
        >
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: 1, font: "bold" }}
          >
            <LuCassetteTape size={28} style={{ color: "gray" }} />
            Asset
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) =>
                  handleSelect(
                    "AssetSectionByLocation",
                    e.target.checked ? 1 : 0
                  )
                }
              />
            }
            label={
              findCustomizeLabel("dft_mst_asset_selection") || "loading..."
            }
            checked={
              settingData.AssetSectionByLocation
                ? settingData.AssetSectionByLocation
                : 0
            }
            sx={{ mt: 1 }}
          />
        </div>

        {/* Inventory */}
        <div
          className="backd"
          style={{
            borderRadius: "8px",
            padding: "12px",
            height: "maxcontent",
          }}
        >
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: 1, font: "bold" }}
          >
            <SiMaterialformkdocs size={28} style={{ color: "gray" }} />
            Inventory
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("MaterialReserved", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={findCustomizeLabel("dft_mst_itm_resv") || "loading..."}
                checked={
                  settingData.MaterialReserved
                    ? settingData.MaterialReserved
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "PrintTransactionDocument",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={findCustomizeLabel("dft_mst_print_trx") || "loading..."}
                sx={{ mt: 1 }}
                checked={
                  settingData.PrintTransactionDocument
                    ? settingData.PrintTransactionDocument
                    : 0
                }
              />
            </Grid>
          </Grid>
        </div>

        {/* Material Request */}
        <div
          className="backd"
          style={{
            borderRadius: "8px",
            padding: "12px",
            height: "maxcontent",
          }}
        >
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: 1, font: "bold" }}
          >
            <IoIosGitPullRequest size={28} style={{ color: "gray" }} />
            Material Request
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "EmailNotification",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_mtr_email") ||
                  "MR Email Notification:"
                }
                checked={
                  settingData.EmailNotification
                    ? settingData.EmailNotification
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("MrApproval", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_mr_approval") ||
                  "MR Approval Required:"
                }
                checked={settingData.MrApproval ? settingData.MrApproval : 0}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "MRReleaseApproval",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_mr_release_for_app") ||
                  "loading..."
                }
                sx={{ mt: 1 }}
                checked={
                  settingData.MRReleaseApproval
                    ? settingData.MRReleaseApproval
                    : 0
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "MRApprovalClosedLoop",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_mtr_closed_loop") || "loading..."
                }
                checked={
                  settingData.MRApprovalClosedLoop
                    ? settingData.MRApprovalClosedLoop
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("EmailMRApprover", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_mtr_email_approver") ||
                  "loading..."
                }
                checked={
                  settingData.EmailMRApprover ? settingData.EmailMRApprover : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "AutoMRApprovalEmail",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_mtr_approval_auto_send") ||
                  "loading..."
                }
                checked={
                  settingData.AutoMRApprovalEmail
                    ? settingData.AutoMRApprovalEmail
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("EmailRequestedBy", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_mtr_email_requestor") ||
                  "loading..."
                }
                checked={
                  settingData.EmailRequestedBy
                    ? settingData.EmailRequestedBy
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </div>
        {/* Maintence */}

        <div
          className="backd"
          style={{
            borderRadius: "8px",
            padding: "12px",
            height: "maxcontent",
          }}
        >
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: 1, font: "bold" }}
          >
            <GrHostMaintenance size={28} style={{ color: "gray" }} />
            Maintence
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "WrEmailNotification",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_wkr_email") ||
                  "WR Email Notification:"
                }
                checked={
                  settingData.WrEmailNotification
                    ? settingData.WrEmailNotification
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "WwEmailNotification",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_ww_send_ntf") ||
                  "WW Email Notification:"
                }
                checked={
                  settingData.WwEmailNotification
                    ? settingData.WwEmailNotification
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("DefaultWOCC", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_wo_default_cc") ||
                  "Default WO CC to Planning:"
                }
                checked={settingData.DefaultWOCC ? settingData.DefaultWOCC : 0}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("AutoWOPlanWR", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_wr_auto_plan_wo") || "loading.."
                }
                checked={
                  settingData.AutoWOPlanWR ? settingData.AutoWOPlanWR : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "GenerateWOInvoice",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={findCustomizeLabel("dft_mst_gen_inv") || "loading..."}
                checked={
                  settingData.GenerateWOInvoice
                    ? settingData.GenerateWOInvoice
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>{" "}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "TemporaryAssetFlag",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_temp_ast") ||
                  "Temporary Asset Flag"
                }
                checked={
                  settingData.TemporaryAssetFlag
                    ? settingData.TemporaryAssetFlag
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("PMClosedLoop", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_pm_closed_loop") ||
                  "PM Closed Loop:"
                }
                checked={
                  settingData.PMClosedLoop ? settingData.PMClosedLoop : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("PMScheduleDate", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_pm_schedule_date") ||
                  "PM Schedule Date:"
                }
                checked={
                  settingData.PMScheduleDate ? settingData.PMScheduleDate : 0
                }
                sx={{ mt: 1 }}
              />
            </div>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "TimCardnotEditableMobile",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_tim_act") ||
                  "Time Card non Editable in Mobile WO:"
                }
                sx={{ mt: 1 }}
                checked={
                  settingData.TimCardnotEditableMobile
                    ? settingData.TimCardnotEditableMobile
                    : 0
                }
              />
            </Grid>
          </Grid>
        </div>

        {/* Purchasing */}

        <div
          className="backd"
          style={{
            borderRadius: "8px",
            padding: "12px",
            height: "maxcontent",
          }}
        >
          <Typography
            sx={{ display: "flex", alignItems: "center", gap: 1, font: "bold" }}
          >
            <GiShinyPurse size={32} style={{ color: "gray" }} />
            Purchasing
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "DefaultPRReleaseApproval",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_pr_release_for_app") ||
                  "loading..."
                }
                sx={{ mt: 1 }}
                checked={
                  settingData.DefaultPRReleaseApproval
                    ? settingData.DefaultPRReleaseApproval
                    : 0
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "PRApprovalClosedLoop",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_pur_closed_loop") ||
                  "PR Approval Closed Loop:"
                }
                checked={
                  settingData.PRApprovalClosedLoop
                    ? settingData.PRApprovalClosedLoop
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("EmailPRApprover", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_pur_email_approver") ||
                  "Email PR Approver:"
                }
                checked={
                  settingData.EmailPRApprover ? settingData.EmailPRApprover : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "AutoPRApprovalEmail",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_pur_approval_auto_send") ||
                  "Auto PR Approval Email:"
                }
                checked={
                  settingData.AutoPRApprovalEmail
                    ? settingData.AutoPRApprovalEmail
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "EmailRequestedPRApproved",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_pur_email_requestor") ||
                  "Order Point Auto Generate PR:"
                }
                checked={
                  settingData.EmailRequestedPRApproved
                    ? settingData.EmailRequestedPRApproved
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect(
                        "OrderPointAutoGenratePR",
                        e.target.checked ? 1 : 0
                      )
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_order_point_pr") ||
                  "Order Point Auto Generate PR:"
                }
                checked={
                  settingData.OrderPointAutoGenratePR
                    ? settingData.OrderPointAutoGenratePR
                    : 0
                }
                sx={{ mt: 1 }}
              />
            </Grid>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("AutoGenratePO", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_generate_po") ||
                  "Auto Generate PO:"
                }
                sx={{ mt: 1 }}
                checked={
                  settingData.AutoGenratePO ? settingData.AutoGenratePO : 0
                }
              />
            </div>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleSelect("AutoClosePO", e.target.checked ? 1 : 0)
                    }
                  />
                }
                label={
                  findCustomizeLabel("dft_mst_po_auto_close") ||
                  "Auto Close PO:"
                }
                sx={{ mt: 1 }}
                checked={settingData.AutoClosePO ? settingData.AutoClosePO : 0}
              />
            </Grid>
          </Grid>
        </div>

        {/* Purchasing */}

        {/* <div
        className="backd"
        style={{
          borderRadius: "8px",
          padding: "12px",
          height: "maxcontent",
        }}
      >
        <Typography
          sx={{ display: "flex", alignItems: "center", gap: 1, font: "bold" }}
        >
          <FaMobileAlt size={28} style={{ color: "gray" }} />
          Mobile
        </Typography>
        <FormControlLabel
          control={<Checkbox />}
          label="Mobile Checklist Scan"
          sx={{ mt: 1 }}
          value={settingData.AutoClosePO}
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Checklist All Complete"
          sx={{ mt: 1 }}
        />
      </div> */}
      </div>
    </>
  );
}

export default SettingsMaster;
