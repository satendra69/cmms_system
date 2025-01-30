import {
  Autocomplete,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useSettingsContext } from "src/components/settings";
import Iconify from "src/components/iconify";
import React, { useEffect, useState } from "react";
import { Stack, display } from "@mui/system";
import MasterDialog from "./MasterDialog";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

import { useSwalCloseContext } from "../ContextApi/WorkOrder/SwalCloseContext";

function DefaultTabMaster() {

  const { updateSwalCloseTime } = useSwalCloseContext();

  let site_ID = localStorage.getItem("site_ID");
  const [modalDefault, setModalDefault] = useState(false);
  const [DefaultMandatoryFiled, setDefaultMandatoryFiled] = useState([]);
  const settings = useSettingsContext();

  const [errorField, setErrorField] = useState(null);
  const [DefaultLabel, setDefaultLabel] = useState([]);

  const [defaultFormData, setDefaultFormData] = useState({});
  const navigate = useNavigate();

  const [data, setData] = useState({
    LaborAccount: "",
    MaterialAccount: "",
    ContractAccount: "",
    WRWorkPriority: "",
    WOWorkPriority: "",
    PMWorkPriority: "",
    AssetStatus: "",
    WOWorkStatus: "",
    MRStatus: "",
    PRStatus: "",
    POStatus: "",
    WRAssetNo: "",
    WROriginator: "",
    WOAssetNo: "",
    POCurrencyCode: "",
    DashBoardRefresh: "",
    SucClosePopup:"",
    PMLeadDay: "",
    WOGracePeriod: "",
    CostRate: "",
    ProcessCost: "",
    Days:"",
    dft_mst_ww_send_ntf:"",
    RowID: "",
  });

  const [refetch, setRefetch] = useState(false);

  // Fetchin form data

  useEffect(() => {
    async function fetchFormData() {
      try {
        const response = await httpCommon.get(
          `/DefaultSettingFormData.php?site_cd=${site_ID}`
        );
   //   console.log("response____get___",response);
        if (response.data.status === "SUCCESS") {
          setDefaultFormData(response.data.data.DeafultSettings[0]);
          const selectedOption = MrApprovalOptions.find(
            (option) =>
              option.value ==
              response.data.data.DeafultSettings[0].dft_mst_mr_approval
          );
          const selectedOptionTimecard = TimecardOptions.find(
            (option) =>
              option.value ==
              response.data.data.DeafultSettings[0].dft_mst_time_card_by
          );
          const selectedOptionPr = PrApprovalOptions.find(
            (option) =>
              option.value ==
              response.data.data.DeafultSettings[0].dft_mst_pur_approval
          );

          setSelectedTimecardOptions(selectedOptionTimecard);
          setSelectedPrApprovalOptions(selectedOptionPr);
          setSelectedMrApprovalOptions(selectedOption);
          setData((pre) => {
            const newData = { ...pre };

            if (response.data.data.DeafultSettings[0].dft_mst_lab_act) {
              newData.LaborAccount = `${response.data.data.DeafultSettings[0].dft_mst_lab_act} : ${response.data.data.DeafultSettings[0].lab_act_desc}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_mat_act) {
              newData.MaterialAccount = `${response.data.data.DeafultSettings[0].dft_mst_mat_act} : ${response.data.data.DeafultSettings[0].mat_act_desc}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_con_act) {
              newData.ContractAccount = `${response.data.data.DeafultSettings[0].dft_mst_con_act} : ${response.data.data.DeafultSettings[0].con_act_desc}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_wkr_pri) {
              newData.WRWorkPriority = `${response.data.data.DeafultSettings[0].dft_mst_wkr_pri} : ${response.data.data.DeafultSettings[0].wkr_pri_desc}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_wko_pri) {
              newData.WOWorkPriority = `${response.data.data.DeafultSettings[0].dft_mst_wko_pri} : ${response.data.data.DeafultSettings[0].wko_pri_desc}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_prm_pri) {
              newData.PMWorkPriority = `${response.data.data.DeafultSettings[0].dft_mst_prm_pri} : ${response.data.data.DeafultSettings[0].prm_pri_desc}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_ast_sts) {
              newData.AssetStatus = `${response.data.data.DeafultSettings[0].dft_mst_ast_sts} : ${response.data.data.DeafultSettings[0].ast_sts_desc}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_wko_sts) {
              newData.WOWorkStatus = `${response.data.data.DeafultSettings[0].dft_mst_wko_sts} : ${response.data.data.DeafultSettings[0].wrk_sts_desc}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_mtr_sts) {
              newData.MRStatus = `${response.data.data.DeafultSettings[0].dft_mst_mtr_sts} : ${response.data.data.DeafultSettings[0].mtr_sts_description}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_pur_sts) {
              newData.PRStatus = `${response.data.data.DeafultSettings[0].dft_mst_pur_sts} : ${response.data.data.DeafultSettings[0].pur_sts_description}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_puo_sts) {
              newData.POStatus = `${response.data.data.DeafultSettings[0].dft_mst_puo_sts} : ${response.data.data.DeafultSettings[0].puo_sts_description}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_wkr_asset_no) {
              newData.WRAssetNo =
                response.data.data.DeafultSettings[0].dft_mst_wkr_asset_no;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_wkr_originator) {
              newData.WROriginator = `${response.data.data.DeafultSettings[0].dft_mst_wkr_originator} : ${response.data.data.DeafultSettings[0].emp_mst_name}`;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_wko_asset_no) {
              newData.WOAssetNo =
                response.data.data.DeafultSettings[0].dft_mst_wko_asset_no;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_po_curr_code) {
              newData.POCurrencyCode =
                response.data.data.DeafultSettings[0].dft_mst_po_curr_code;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_dsh_refresh) {
              newData.DashBoardRefresh =
                response.data.data.DeafultSettings[0].dft_mst_dsh_refresh;
            }
            if (response.data.data.DeafultSettings[0].dft_mst_clo_popup) {
              newData.SucClosePopup =
                response.data.data.DeafultSettings[0].dft_mst_clo_popup;
            }
           
            if (response.data.data.DeafultSettings[0].dft_mst_prm_led) {
              newData.PMLeadDay =
                response.data.data.DeafultSettings[0].dft_mst_prm_led;
            }

            if (response.data.data.DeafultSettings[0].dft_mst_grace_period) {
              newData.WOGracePeriod =
                response.data.data.DeafultSettings[0].dft_mst_grace_period;
            }

            if (
              response.data.data.DeafultSettings[0].dft_mst_eoq_carry_cost_rate
            ) {
              newData.CostRate =
                response.data.data.DeafultSettings[0].dft_mst_eoq_carry_cost_rate;
            }

            if (
              response.data.data.DeafultSettings[0].dft_mst_eoq_po_process_cost
            ) {
              newData.ProcessCost =
                response.data.data.DeafultSettings[0].dft_mst_eoq_po_process_cost;
            }

            if (
              response.data.data.DeafultSettings[0].dft_mst_ww_disp_day
            ) {
              newData.Days =
                response.data.data.DeafultSettings[0].dft_mst_ww_disp_day;
            }



            newData.RowID = response.data.data.DeafultSettings[0].RowID;

            return newData;
          });

          
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    fetchFormData();
  }, [refetch]);

  const [MrApprovalOptions, setMrApprovalOptions] = useState([
    { label: "ROUTE", value: "1" },
    { label: "Limit", value: "2" },
  ]);

  // get Asset FromLabel

  const getDefaultFromLebel = async () => {
    try {
      const response = await httpCommon.get("/get_default_from_lebal.php");
      // console.log("response____getLabel",response);
      if (response.data.status === "SUCCESS") {
       
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

  const [textField, setTextField] = useState("");

  const [DefaultModal, setDefaultModal] = useState(false);

  const [PrApprovalOptions, setPrApprovalOptions] = useState([
    { label: "ROUTE", value: "R" },
    { label: "Limit", value: "L" },
  ]);

  const [selected_PrApprovalOptions, setSelectedPrApprovalOptions] = useState(
    []
  );

  const [selected_MrApprovalOptions, setSelectedMrApprovalOptions] = useState(
    []
  );

  const [TimecardOptions, setTimecardOptions] = useState([
    { label: "All", value: "A" },
    { label: "Users", value: "U" },
    { label: "Individual", value: "I" },
  ]);

  const [selected_TimecardOption, setSelectedTimecardOptions] = useState([]);

  // const handleName = (e) => {
  //   setTextField(e.target.name);
  // };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = DefaultMandatoryFiled.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return "Requiredlabel";
    }
    return "";
  };

  const handleTextChange = (e) => {
    let inputValue = e.target.value;

    // DashBoardRefresh
    if(e.target.name === "DashBoardRefresh" || e.target.name === "PMLeadDay" || e.target.name === "WOGracePeriod" || e.target.name === "CostRate" || e.target.name === "ProcessCost" || e.target.name === "SucClosePopup"){
    if(inputValue > 4){
      inputValue = inputValue.slice(0,4)
    }
    }
    
    setData((pre) => ({
      ...pre,
      [e.target.name]:inputValue,
    }));
  };

  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = DefaultLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  //handle cancel
  const handleCancelClick = (name) => {
    // setModalDefault(false);

    setData((pre) => ({
      ...pre,
      [name]: "",
    }));
  };
  //   handle edit
  const handleEditClick = (e) => {
    setModalDefault(!DefaultModal);
    setTextField(e);
  };

  const handleClose = (e, result) => {
    if (result !== "backdropClick") {
      setTextField("");
      setDefaultModal(false);
    }
  };

  useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

  const extractData = (data) => {
    return {
      LaborAccount: data.LaborAccount.split(" : ")[0],
      MaterialAccount: data.MaterialAccount.split(" : ")[0],
      ContractAccount: data.ContractAccount.split(" : ")[0],
      WRWorkPriority: data.WRWorkPriority.split(" : ")[0],
      WOWorkPriority: data.WOWorkPriority.split(" : ")[0],
      PMWorkPriority: data.PMWorkPriority.split(" : ")[0],
      AssetStatus: data.AssetStatus.split(" : ")[0],
      WOWorkStatus: data.WOWorkStatus.split(" : ")[0],
      MRStatus: data.MRStatus.split(" : ")[0],
      PRStatus: data.PRStatus.split(" : ")[0],
      POStatus: data.POStatus.split(" : ")[0],
      WRAssetNo: data.WRAssetNo,
      WROriginator: data.WROriginator.split(" : ")[0],
      WOAssetNo: data.WOAssetNo,
      POCurrencyCode: data.POCurrencyCode,
      DashBoardRefresh: data.DashBoardRefresh,
      SucClosePopup : data.SucClosePopup,
      PMLeadDay: data.PMLeadDay,
      WOGracePeriod: data.WOGracePeriod,
      CostRate: data.CostRate,
      ProcessCost: data.ProcessCost,
      RowID: data.RowID,
    };
  };

  const onClickCancel = () => {
    navigate(`/dashboard`, {});
  };

  const handleSubmitForm = async () => {
    const newData = extractData(data);
    const params = {
      site_cd: site_ID,
      dft_mst_lab_act: newData.LaborAccount,
      dft_mst_mat_act: newData.MaterialAccount,
      dft_mst_con_act: newData.ContractAccount,
      dft_mst_wkr_pri: newData.WRWorkPriority,
      dft_mst_wko_pri: newData.WOWorkPriority,
      dft_mst_wko_sts: newData.WOWorkStatus,

      // new
      dft_mst_prm_pri: newData.PMWorkPriority,
      dft_mst_ast_sts: newData.AssetStatus,
      dft_mst_mtr_sts: newData.MRStatus,
      dft_mst_pur_sts: newData.PRStatus,
      dft_mst_puo_sts: newData.POStatus,
      dft_mst_wkr_originator: newData.WROriginator,
      // pr Approval
      dft_mst_pur_approval: selected_PrApprovalOptions.value,
      // time card
      dft_mst_mr_approval: selected_MrApprovalOptions.value
        ? selected_MrApprovalOptions.value
        : "",
      dft_mst_time_card_by: selected_TimecardOption.value,
      dft_mst_wko_asset_no: newData.WOAssetNo,
      dft_mst_wkr_asset_no: newData.WRAssetNo,
      dft_mst_po_curr_code: newData.POCurrencyCode,
      // pending

      dft_mst_dsh_refresh: newData.DashBoardRefresh,
      dft_mst_prm_led: newData.PMLeadDay,
      dft_mst_grace_period: newData.WOGracePeriod,
      dft_mst_eoq_carry_cost_rate: newData.CostRate,
      dft_mst_eoq_po_process_cost: newData.ProcessCost,
      dft_mst_clo_popup: newData.SucClosePopup,
      RowID: newData.RowID,
    };

    try {
      const response = await httpCommon.post(
        "/update_default_setting_form_data.php",
        {
          site_cd: site_ID,
          dft_mst_lab_act: newData.LaborAccount,
          dft_mst_mat_act: newData.MaterialAccount,
          dft_mst_con_act: newData.ContractAccount,
          dft_mst_wkr_pri: newData.WRWorkPriority,
          dft_mst_wko_pri: newData.WOWorkPriority,
          dft_mst_wko_sts: newData.WOWorkStatus,

          // new
          dft_mst_prm_pri: newData.PMWorkPriority,
          dft_mst_ast_sts: newData.AssetStatus,
          dft_mst_mtr_sts: newData.MRStatus,
          dft_mst_pur_sts: newData.PRStatus,
          dft_mst_puo_sts: newData.POStatus,
          dft_mst_wkr_originator: newData.WROriginator,
          // pr Approval
          dft_mst_pur_approval: selected_PrApprovalOptions.value,
          // time card
          dft_mst_mr_approval: selected_MrApprovalOptions.value,
          dft_mst_time_card_by: selected_TimecardOption.value,
          dft_mst_wko_asset_no: newData.WOAssetNo,
          dft_mst_wkr_asset_no: newData.WRAssetNo,
          dft_mst_po_curr_code: newData.POCurrencyCode,
          // pending
          dft_mst_mtr_approval_type: "",
          dft_mst_dsh_refresh: newData.DashBoardRefresh,
          dft_mst_prm_led: newData.PMLeadDay,
          dft_mst_grace_period: newData.WOGracePeriod,
          dft_mst_eoq_carry_cost_rate: newData.CostRate,
          dft_mst_eoq_po_process_cost: newData.ProcessCost,
          dft_mst_clo_popup : newData.SucClosePopup,
          dft_mst_ww_disp_day:data.Days,
          RowID: newData.RowID,
        }
      );
   // console.log("update responce____",response);
      if (response.data.status === "SUCCESS") {
        const timerInMilliseconds = newData.SucClosePopup ? newData.SucClosePopup * 1000 : 3000;
        updateSwalCloseTime(timerInMilliseconds);
       
        Swal.fire({
          icon: "success",
          title: "Success!",
          timerProgressBar: true, 
          text: "Default Settings Updated Successfully.",
          confirmButtonText: "OK",
          timer: timerInMilliseconds,
        });
        setRefetch(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div
        className="buttonsTop"
       
      >
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:save-fill" />}
          style={{
            marginRight: "10px",
          }}
          className="SaveButton"
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

      {/* master Dialog */}

      <MasterDialog
        setData={setData}
        handleClose={handleClose}
        open={DefaultModal}
        name={textField}
      />

      <div className="Form grid3" style={{ marginTop: "40px" }}>
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_lab_act") || "loading..."}
          </Typography>
          <div>
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="LaborAccount"
              size="small"
              value={data ? data.LaborAccount : ""}
              fullWidth
              // value={Permanent_IDFlag || ""}
              // disabled
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
                    <Iconify
                      icon="material-symbols:close"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCancelClick("LaborAccount")}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("LaborAccount")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/* Default Material Account */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("dft_mst_mat_act")}
          >
            {findCustomizeLabel("dft_mst_mat_act") || "loading..."}
            {/* Default Material Account */}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="MaterialAccount"
              fullWidth
              value={data ? data.MaterialAccount : ""}
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
                      onClick={() => handleCancelClick("MaterialAccount")}
                      style={{ cursor: "pointer" }}
                    />
  
                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("MaterialAccount")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>
        {/* Default Material Account */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_con_act") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="ContractAccount"
              size="small"
              value={data ? data.ContractAccount : ""}
              fullWidth
              // value={Permanent_IDFlag || ""}
              // disabled
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
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCancelClick("ContractAccount")}
                    />

                    <Iconify
                      icon="tabler:edit"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEditClick("ContractAccount")}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/* Default WR Work Priority */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_wkr_pri") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="WRWorkPriority"
              fullWidth
              value={data ? data.WRWorkPriority : ""}
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
                      onClick={() => handleCancelClick("WRWorkPriority")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("WRWorkPriority")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/* Default WR Work Priority */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("dft_mst_wko_pri") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="WOWorkPriority"
              size="small"
              fullWidth
              value={data ? data.WOWorkPriority : ""}
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
                      onClick={() => handleCancelClick("WOWorkPriority")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("WOWorkPriority")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/*  Default PM Work Priority */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_prm_pri") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="PMWorkPriority"
              size="small"
              value={data ? data.PMWorkPriority : ""}
              fullWidth
              // value={Permanent_IDFlag || ""}
              // disabled
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
                      onClick={() => handleCancelClick("PMWorkPriority")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("PMWorkPriority")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>
        {/*  Default Asset Status */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_ast_sts") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="AssetStatus"
              fullWidth
              value={data ? data.AssetStatus : ""}
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
                      onClick={() => handleCancelClick("AssetStatus")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("AssetStatus")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>
        {/*  Default Work Status */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_wko_sts") || " loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              value={data.WOWorkStatus}
              name="WOWorkStatus"
              fullWidth
              // value={Permanent_IDFlag || ""}
              // disabled
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
                      onClick={() => handleCancelClick("WOWorkStatus")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("WOWorkStatus")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/*  Default MR Status */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("dft_mst_mtr_sts") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="MRStatus"
              value={data ? data.MRStatus : ""}
              fullWidth
              // value={Permanent_IDFlag || ""}
              // disabled
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
                      onClick={() => handleCancelClick("MRStatus")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("MRStatus")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/*  Default PR Status */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("dft_mst_pur_sts") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="PRStatus"
              value={data ? data.PRStatus : ""}
              fullWidth
              // value={Permanent_IDFlag || ""}
              // disabled
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
                      onClick={() => handleCancelClick("PRStatus")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("PRStatus")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/*  Default PO Status */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("dft_mst_puo_sts") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="POStatus"
              fullWidth
              value={data ? data.POStatus : ""}
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
                      onClick={() => handleCancelClick("POStatus")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("POStatus")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/*  Default WR Asset No */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("dft_mst_wkr_asset_no") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="WRAssetNo"
              fullWidth
              value={data ? data.WRAssetNo : ""}
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
                      onClick={() => handleCancelClick("WRAssetNo")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("WRAssetNo")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/*  Default WR Originator */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_wkr_originator") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="WROriginator"
              size="small"
              value={data ? data.WROriginator : ""}
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
                      gap: 5,
                    }}
                  >
                    <Iconify
                      icon="material-symbols:close"
                      onClick={() => handleCancelClick("WROriginator")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("WROriginator")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/* This label */}

        {/*  Default WO Asset No */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {/* {findCustomizeLabel("ast_mst_parent_id") ||
  "Parent Flag"} */}
            {findCustomizeLabel("dft_mst_wko_asset_no") ||
              "Default WO Asset No:"}
            {/* Default WO Asset No */}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              name="WOAssetNo"
              size="small"
              fullWidth
              value={data ? data.WOAssetNo : ""}
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
                      onClick={() => handleCancelClick("WOAssetNo")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("WOAssetNo")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/*    Deafult PR Approval Type */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("dft_mst_pur_approval") ||
              "Default PR Approval Type:"}
          </Typography>
          <Autocomplete
            options={PrApprovalOptions}
            value={selected_PrApprovalOptions?.label ?? ""}
            onChange={(event, value) => {
              setSelectedPrApprovalOptions(value);
              setErrorField(null);
            }}
            //getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select..."
                variant="outlined"
                className={
                  errorField === "ast_det_depr_method" ? "erroBorderadd" : ""
                }
                fullWidth // Make it full-width
              />
            )}
          />
        </Stack>

        {/*    Deafult Mr Approval Type */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("dft_mst_mtr_approval_type")}
          >
            {findCustomizeLabel("dft_mst_mtr_approval_type") ||
              "Default MR Approval Type:"}
          </Typography>
          <Autocomplete
            options={MrApprovalOptions}
            value={selected_MrApprovalOptions?.label ?? ""}
            onChange={(event, value) => {
              setSelectedMrApprovalOptions(value);
              setErrorField(null);
            }}
            //getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select..."
                variant="outlined"
                className={
                  errorField === "ast_det_depr_method" ? "erroBorderadd" : ""
                }
                fullWidth // Make it full-width
              />
            )}
          />
        </Stack>

        {/*    Time Card Entery By */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            className={findCustomizerequiredLabel("ast_det_depr_method")}
          >
            {findCustomizeLabel("dft_mst_time_card_by") ||
              "Time Card Entry By:"}
          </Typography>
          <Autocomplete
            options={TimecardOptions}
            onChange={(event, value) => {
              setSelectedTimecardOptions(value);
              setErrorField(null);
            }}
            value={selected_TimecardOption?.label ?? ""}
            //getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Select..."
                variant="outlined"
                className={
                  errorField === "ast_det_depr_method" ? "erroBorderadd" : ""
                }
                fullWidth
              />
            )}
          />
        </Stack>

        {/*           Default PO Currency Code */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_po_curr_code") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="POCurrencyCode"
              value={data.POCurrencyCode}
              fullWidth
              // value={Permanent_IDFlag || ""}
              // disabled
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
                      onClick={() => handleCancelClick("POCurrencyCode")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      onClick={() => handleEditClick("POCurrencyCode")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>

        {/*  Dashboard Refresh Interval (Minutes)*/}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_dsh_refresh") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="DashBoardRefresh"
              placeholder="2"
              type="number"
              value={data ? data.DashBoardRefresh : ""}
              onChange={handleTextChange}
              fullWidth
              inputProps={{style:{textAlign:"right"}}}
            />
          </div>
        </Stack>

        {/*PM Lead Day*/}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_prm_led") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="PMLeadDay"
              placeholder="3"
              fullWidth
              type="number"
              value={data ? data.PMLeadDay : ""}
              onChange={handleTextChange}
              inputProps={{style:{textAlign:"right"}}}
            />
          </div>
        </Stack>

        {/* WO Grace Period*/}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_grace_period") || "loading..."}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="WOGracePeriod"
              placeholder="0"
              type="number"
              fullWidth
              value={data ? data.WOGracePeriod : ""}
              onChange={handleTextChange}
              inputProps={{style:{textAlign:"right"}}}
            />
          </div>
        </Stack>

        {/*EOQ Carry Cost Rate*/}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_eoq_carry_cost_rate") ||
              "EOQ Carry Cost Rate(%)"}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              placeholder="0.00"
              type="number"
              name="CostRate"
              fullWidth
              onChange={handleTextChange}
              value={data ? data.CostRate : ""}
              inputProps={{style:{textAlign:"right"}}}
            />
          </div>
        </Stack>

        {/*EOQ PO Process Cost(%)*/}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_eoq_po_process_cost") ||
              "EOP PO Process"}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="ProcessCost"
              type="number"
              placeholder="0.00"
              fullWidth
              onChange={handleTextChange}
              value={data ? data.ProcessCost : ""}
             inputProps={{style:{textAlign:"right"}}}
            />
          </div>
        </Stack>

          {/* Days */}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
             Default Days
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="Days"
              type="number"
              placeholder="0.00"
              fullWidth
              onChange={handleTextChange}
              value={data ? data.Days : ""}
             inputProps={{style:{textAlign:"right"}}}
            />
          </div>
        </Stack>


         {/*  Dashboard Refresh Interval (second)*/}
         <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
            {findCustomizeLabel("dft_mst_clo_popup") || "Default Success Close Popup (second):"}
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="SucClosePopup"
              placeholder="3"
              type="number"
              value={data ? data.SucClosePopup : ""}
              onChange={handleTextChange}
              fullWidth
              inputProps={{style:{textAlign:"right"}}}
            />
          </div>
        </Stack>
        {/* dft_mst_ww_send_ntf */}

        {/* <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("ast_mst_parent_id")}
          >
           Deafult Email Flag
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="Days"
              type="number"
              placeholder="0.00"
              fullWidth
              onChange={handleTextChange}
              value={data ? data.dft_mst_ww_send_ntf : ""}
             inputProps={{style:{textAlign:"right"}}}
            />
          </div>
        </Stack> */}


      </div>
    </>
  );
}

export default DefaultTabMaster;
