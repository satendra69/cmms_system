import {
  Autocomplete,
  Grid,
  Stack,
  TextField,
  Typography,
  Card,
  Box,
  TextareaAutosize
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { textAlign } from "@mui/system";
import { bg } from "date-fns/locale";
import React, { useState } from "react";

import Iconify from "src/components/iconify";

function DetailsSection({
  findCustomizeLabel,
  handleChangeText,
  textFields,
  handleCancelClick,
  handleEditClick,
  data,
  visible,
  setVisible,
  checkboxData,
  handleCheckboxData,
  setSelectedShift,
  shift,
  selectedShift,
  UDFNote1,
  setUDFNote1,
  setWorkGrpDrp,
  workGrpDrp,
  setSelectedWorkGrp,
  selectedWorkGrp,
  wrkAreaDrp,
  selectedWrkArea,
  setSelectedWrkArea,
  primaryCraftDrp,
  selectedPrimaryCraft,
  setSelectedPrimaryCraft,
  superVisiorDrp,
  selectedSuperVisior,
  setSelectedSuperVisior,
  findCustomizerequiredLabel,
  error2,
  setTextFields,
  setPrimaryCraftFlag


}) {
  const [isOpenWork, setIsOpenWork] = useState(true);

  const toggleDiv = () => {
    setIsOpenWork(!isOpenWork);
  };

  const handleNumericInputChange2 = (e, setterFunction) => {
    let { value } = e.target;
    if (value.length >= 15) {
      return; 
    }
    value = value.replace(/[^0-9.]/g, '');
    value = value.slice(0, 14); 
    const parts = value.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1];
      if ( decimalPart === '') { 
        integerPart += '.';
        decimalPart = '';
      } else if (decimalPart && decimalPart.length >= 4) {
        decimalPart = decimalPart.slice(0, 4);
      }else{
        let integerPart2 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (integerPart2.length > 11) {
          integerPart2 = integerPart2.slice(0, 12) + '.' + integerPart2.slice(12, 14);
        }
        let decimalPart2 = parts[1] ? parts[1].slice(0, 2) : '';
        const formattedValue2 = decimalPart2 ? `${integerPart2}.${decimalPart2}` : integerPart2;
        setterFunction(formattedValue2);
      //  setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
  //  setErrorField(null);
  };
  
  
  return (
    <>
      <Card sx={{ p: 3,mt:-2 }}>
        <Grid container width="100%" alignItems="center" spacing={1}>
          {/* Grid 1 */}
          <Grid item xs={12} md={4}>
            <Stack spacing={1} sx={{width:"100%"}}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_mr_approver")
                    ? "red"
                    : ""
                }

              >
                {findCustomizeLabel("emp_det_mr_approver") ||
                  "MR Approver / Global Limit"}
                  
                {/* checked value sent from parent */}
                <Checkbox
                  name="emp_det_mr_approver"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_mr_approver)}
                />
              </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="emp_det_mr_limit"
                  size="small"
                  type="text"
                   autoComplete="off"
                  placeholder=".00"
                  className={`Extrasize ${error2 === "emp_det_mr_approver" ? "errorEmpty" : ""}`}
                  disabled={
                    !Number(checkboxData.emp_det_mr_approver)}
                    value={textFields.emp_det_mr_limit}
                
                 // onChange={handleChangeText}
                 onChange={(e) => {
                  const value = e.target.value;
                  if (value.length === 0 || value[0] !== '0') {
                    handleNumericInputChange2(e, (formattedValue) => {
                      setTextFields((prev) => ({
                        ...prev,
                        [e.target.name]: formattedValue, // Set formatted value
                      }));
                    });
                  }
                }}
                  
                  style={{ marginRight: "20px"}}
                  inputProps={{style:{textAlign:"right"} }}
                />
         
            </Stack>

            {/*WR Approver */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_wr_approver")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_wr_approver") || "WR Approver"}
                {/* checked value sent from parent */}
                <Checkbox
                  name="emp_det_wr_approver"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_wr_approver)}
                />
              </Typography>
            </Stack>

            {/*Planner */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_planner")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_planner") || "Planner"}

                <Checkbox
                  name="emp_det_planner"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_planner)}
                />
              </Typography>
            </Stack>

            {/* Request Parts && Services */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}

                className={
                  findCustomizerequiredLabel("emp_det_wo_gen_mr_pr")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_wo_gen_mr_pr") ||
                  "Request Parts && Services"}

                <Checkbox
                  name="emp_det_wo_gen_mr_pr"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_wo_gen_mr_pr)}
                />
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_pm_generator")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_pm_generator") || "PM Generator"}

                <Checkbox
                  name="emp_det_pm_generator"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_pm_generator)}
                />
              </Typography>
            </Stack>

            {/* Enter Time Card */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_time_card_enter")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_time_card_enter") ||
                  "Enter Time Card"}

                <Checkbox
                  name="emp_det_time_card_enter"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_time_card_enter)}
                />
              </Typography>
            </Stack>
          </Grid>

          {/* Grid 2 */}
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_pr_approver")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_pr_approver") ||
                  "PR Approval Limit"}

                <Checkbox
                  name="emp_det_pr_approver"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_pr_approver)}
                />
              </Typography>
             
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="emp_det_pr_approval_limit"
                  type="text"
                  size="small"
                   placeholder=".00"
                   autoComplete="off"
                  disabled={!Number(checkboxData.emp_det_pr_approver) }
                  style={{ marginRight: "20px"}}
                  value={textFields.emp_det_pr_approval_limit}
                  // value={textFields.emp_det_pr_approval_limit}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length === 0 || value[0] !== '0') {
                      handleNumericInputChange2(e, (formattedValue) => {
                        setTextFields((prev) => ({
                          ...prev,
                          [e.target.name]: formattedValue, // Set formatted value
                        }));
                      });
                    }
                  }}
                  inputProps={{style:{textAlign:"right"} }}
                />
        
            </Stack>

            {/*Void Time Card */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_time_card_void")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_time_card_void") ||
                  "Void Time Card"}

                <Checkbox
                  name="emp_det_time_card_void"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_time_card_void)}
                />
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_wo_sched")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_wo_sched") ||
                  "Schedule Work Order"}

                <Checkbox
                  name="emp_det_wo_sched"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_wo_sched)}
                />
              </Typography>
            </Stack>

            {/* PO Buyer */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}

                className={
                  findCustomizerequiredLabel("emp_det_po_buyer")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_po_buyer") || "PO Buyer"}

                <Checkbox
                  name="emp_det_po_buyer"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_po_buyer)}
                />
              </Typography>
            </Stack>

            {/* Supervisor */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_supervisor")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_supervisor") || "Supervisor"}

                <Checkbox
                  name="emp_det_supervisor"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_supervisor)}
                />
              </Typography>
            </Stack>

            {/* Technician */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_foreman")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_foreman") || "Technician"}

                <Checkbox
                  name="emp_det_foreman"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_foreman)}
                />
              </Typography>
            </Stack>
          </Grid>

          {/* grid 3 */}
          <Grid item xs={12} md={4}>
            {/*WO Budget Approver */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_wo_budget_approver")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_wo_budget_approver") ||
                  "WO Budget Approver / Limit"}

                <Checkbox
                  name="emp_det_wo_budget_approver"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_wo_budget_approver)}
                />
              </Typography>
             
             

                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="emp_det_wo_approval_limit"
                  size="small"
                  type="text"
                  disabled={!Number(checkboxData.emp_det_wo_budget_approver)}
                  placeholder=".00"
                  value={
                    textFields.emp_det_wo_approval_limit 
                  }
                 autoComplete="off"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length === 0 || value[0] !== '0') {
                      handleNumericInputChange2(e, (formattedValue) => {
                        setTextFields((prev) => ({
                          ...prev,
                          [e.target.name]: formattedValue, // Set formatted value
                        }));
                      });
                    }
                  }}
                  inputProps={{ style:{textAlign:"right"} }}
                />
   
            </Stack>

            {/* Asset Tagging Posting */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_asset_tag_flag")
                    ? "red"
                    : ""
                }

              >
                {findCustomizeLabel("emp_det_asset_tag_flag") ||
                  "Asset Tagging Posting"}

                <Checkbox
                  name="emp_det_asset_tag_flag"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_asset_tag_flag)}
                />
              </Typography>
            </Stack>

            {/* Add/Delete Check List */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_checklist")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_checklist") ||
                  "Add/Delete Check List"}

                <Checkbox
                  name="emp_det_checklist"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_checklist)}
                />
              </Typography>
            </Stack>

            {/* Core Access */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_core")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_core") || "Core Access"}

                <Checkbox
                  name="emp_det_core"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_core)}
                />
              </Typography>
            </Stack>

            {/* Mobile Access */}
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}

                className={
                  findCustomizerequiredLabel("emp_det_mobile")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_mobile") || "Mobile Access"}

                <Checkbox
                  name="emp_det_mobile"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_mobile)}
                />
              </Typography>
            </Stack>

            {/* web work */}

            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: "20px",
                }}
                className={
                  findCustomizerequiredLabel("emp_det_webwork")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("emp_det_webwork") || "Core Access"}

                <Checkbox
                  name="emp_det_webwork"
                  onChange={handleCheckboxData}
                  checked={Number(checkboxData.emp_det_webwork)}
                />
              </Typography>
            </Stack>
          </Grid>
        </Grid>{" "}
      </Card>

      {/* 2 d box  */}
      {/* Box 2 */}
      <Card sx={{ p: 1.5, mt: 1 }}>
        <div>
          <div style={{ display: "flex" }}>
            <button className="ToggleBttnIcon" onClick={toggleDiv}>
              <Iconify
                icon="clarity:employee-group-line"
                style={{ marginRight: "5px", width: "17px" }}
              />
              Employee Work Details
              {isOpenWork ? (
                <Iconify
                  icon="ep:arrow-up-bold"
                  style={{ marginLeft: "4px", width: "12px" }}
                />
              ) : (
                <Iconify
                  icon="ep:arrow-down-bold"
                  style={{ marginLeft: "4px", width: "12px" }}
                />
              )}
            </button>
          </div>
          {isOpenWork && (
            <>
              <Box>
                <Grid container width="100%" alignItems="center" spacing={3}>
                  {/* Grid 1 */}
                  <Grid item xs={12} md={6}>

                {/* Primary creaft */}
                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                    <Typography variant="subtitle2"   className={
                                    findCustomizerequiredLabel("emp_det_craft")
                                      ? "red"
                                      : ""
                                  } >
                        {findCustomizeLabel("emp_det_craft") || "Primary Craft"}
                      </Typography>

                                <Autocomplete
                                  options={primaryCraftDrp}
                                  value={selectedPrimaryCraft?selectedPrimaryCraft:""}
                               
                                  onChange={(event, newValue) => {
                                   
                                    
                                if( newValue ){
                                  setSelectedPrimaryCraft(newValue.label)
                                 
                                }else{
                                  setSelectedPrimaryCraft("")
                                }
                              }}
                                   
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${error2 === "emp_det_craft" ? "errorEmpty" : ""}`}

                                      />
                                    </div>
                                  )}
                                />
                    </Stack>





          {/* work area new*/}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography variant="subtitle2" 
          className={
            findCustomizerequiredLabel("emp_det_work_area")
              ? "red"
              : ""
          }
          >
                        {findCustomizeLabel("emp_det_work_area") || "Work Area"}
                      </Typography>

                                <Autocomplete
                                  options={wrkAreaDrp}
                                  value={selectedWrkArea?selectedWrkArea:""}
                               
                                  onChange={(event, newValue) => {
                                   
                                    
                                if( newValue ){
                                  setSelectedWrkArea(newValue.label)
                                 
                                }else{
                                  setSelectedWrkArea("")
                                }
                              }}
                                   
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${error2 === "emp_det_work_area" ? "errorEmpty" : ""}`}

                                      />
                                    </div>
                                  )}
                                />
                  </Stack>

                    {/* remark */}
                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                      <Typography
                        variant="subtitle2"
                        className={
                          findCustomizerequiredLabel("emp_mst_remarks")
                            ? "red"
                            : ""
                        }
                      >
                        {findCustomizeLabel("emp_mst_remarks") || "Remark"}
                      </Typography>
                      <TextareaAutosize
                        aria-label="empty textarea"
                        name="emp_mst_remarks"
                        minRows={6.5}
                        value={textFields.emp_mst_remarks}
                        className={`TxtAra ${error2 === "emp_mst_remarks" ? "errorEmpty" : ""}`}
                        style={{ resize: 'none', width: '100%' }}
                       
                        // onChange={(e) => {
                        //   setUDFNote1(e.target.value);
                        // }}
                       // onChange={handleChangeText}
                       onChange={(e) => {
                        const value = e.target.value;
                    
                        if (value.length <= 2000) {
                          handleChangeText(e);
                        } 
                      }}
                      />
                    </Stack>
                  </Grid>



            {/* Grid 2 */}
            <Grid item xs={12} md={6}>
             
           {/* Work Group New */}
           <Stack spacing={1} sx={{ pb: 1.5 }}>
           <Typography variant="subtitle2" 
            className={
              findCustomizerequiredLabel("emp_det_work_grp")
                ? "red"
                : ""
            }
           >
            {findCustomizeLabel("emp_det_work_grp") || "Work Group"}
          </Typography>

                                <Autocomplete
                                  options={workGrpDrp}
                                  value={selectedWorkGrp}
                               
                                  onChange={(event, newValue) => {
                                   
                                    
                                if( newValue ){
                                  setSelectedWorkGrp(newValue.label)
                                 
                                }else{
                                  setSelectedWorkGrp("")
                                }
                              }}
                                   
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${error2 === "emp_det_work_grp" ? "errorEmpty" : ""}`}
                                      />
                                    </div>
                                  )}
                                />
                              </Stack>


            {/* Supervisor ID New */}
              <Stack spacing={1} sx={{ pb: 1.5 }}>
                      <Typography variant="subtitle2"
                       className={
                        findCustomizerequiredLabel("emp_det_supervisor_id")
                          ? "red"
                          : ""
                      }
                      >
                      {findCustomizeLabel("emp_det_supervisor_id") || "Supervisor ID"}
                            </Typography>

                                <Autocomplete
                                  options={superVisiorDrp}
                                  value={selectedSuperVisior?selectedSuperVisior:""}
                               
                                  onChange={(event, newValue) => {
                                   
                                    
                                if( newValue ){
                                  setSelectedSuperVisior(newValue.label)
                                 
                                }else{
                                  setSelectedSuperVisior("")
                                }
                              }}
                                   
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${error2 === "emp_det_supervisor_id" ? "errorEmpty" : ""}`}
                                      />
                                    </div>
                                  )}
                                />
                    </Stack>





                    <Stack spacing={1} sx={{ pb: 1.5 }}>
                      <Typography variant="subtitle2" 
                      
                      className={
                        findCustomizerequiredLabel("emp_det_note1")
                          ? "red"
                          : ""
                      }
                      
                      >
                        {findCustomizeLabel("emp_det_note1") || "Note1"}
                      </Typography>
                      <TextareaAutosize
                        aria-label="empty textarea"
                      
                        minRows={6.5}
                        className={`TxtAra ${error2 === "emp_det_note1" ? "errorEmpty" : ""}`}
                    
                        style={{ resize: 'none', width: '100%' }}
                        value={UDFNote1}
                    
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 411) {
                            setUDFNote1(e.target.value);
                          }
                          
                          }}
                      />
                    </Stack>

                 

         
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </div>
      </Card>
    </>
  );
}

export default DetailsSection;
