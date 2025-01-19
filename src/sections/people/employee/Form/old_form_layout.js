 {/* Form Label */}
 <Box
 rowGap={2}
 columnGap={2}
 display="grid"
 gridTemplateColumns={{
   xs: "repeat(1, 1fr)",
   sm: "repeat(2, 1fr)",
 }}
 alignItems="center"
>



 
 {/*Employee ID */}
 <Stack spacing={1}>
   <Typography
     variant="subtitle2"
     style={{ color: "red" }}
   >
     {findCustomizeLabel("emp_mst_empl_id") ||
       "Employee ID"}
   </Typography>
   <TextField
     id="outlined-basic"
     variant="outlined"
     name="emp_mst_empl_id"
     size="small"
     value={textFields.emp_mst_empl_id}
     disabled={!showEmpl}
     defaultValue={""}
     onChange={handleChangeText}
     className="Extrasize"
     inputProps={{ maxLength: 50 }}
   />
 </Stack>
 {/* Status */}
 <Stack spacing={1}>
   <Typography
     variant="subtitle2"
     style={{ color: "red" }}
   >
     {findCustomizeLabel("emp_mst_status") || "Status"}
   </Typography>
   <div>
     <TextField
       id="outlined-basic"
       variant="outlined"
       name="emp_det_work_grp"
       size="small"
       // value={data ? data.LaborAccount : ""}
       fullWidth
       // value={Permanent_IDFlag || ""}
       // disabled
       placeholder="Select..."
       value={data.emp_mst_status}
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
                 handleCancelClick("emp_mst_status")
               }
             />

             <Iconify
               icon="tabler:edit"
               onClick={() =>
                 handleEditClick("emp_mst_status")
               }
               style={{ cursor: "pointer" }}
             />
           </div>
         ),
       }}
     />
   </div>
 </Stack>
 {/* Status end */}

 {/* Name */}
 <Stack spacing={1.5}>
   <Typography
     variant="subtitle2"
     style={{ color: "red" }}
   >
     {findCustomizeLabel("emp_mst_name") || "Name"}
   </Typography>
   <TextField
     id="outlined-basic"
     size="small"
     variant="outlined"
     className="Extrasize"
     fullWidth
     value={textFields.emp_mst_name}
     name="emp_mst_name"
     onChange={handleChangeText}
     inputProps={{ maxLength: 50 }}
   />
 </Stack>

 {/* user Group */}
 <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
   <Typography
     variant="subtitle2"
     style={{ color: "red" }}
   >
     {findCustomizeLabel("emp_mst_usr_grp") ||
       "User Group"}{" "}
   </Typography>

   <div>
     <TextField
       id="outlined-basic"
       variant="outlined"
       name="emp_det_work_grp"
       size="small"
       value={data ? data.emp_mst_usr_grp : ""}
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
               onClick={() =>
                 handleCancelClick("emp_mst_usr_grp")
               }
             />

             <Iconify
               icon="tabler:edit"
               onClick={() =>
                 handleEditClick("emp_mst_usr_grp")
               }
               style={{ cursor: "pointer" }}
             />
           </div>
         ),
       }}
     />
   </div>
 </Stack>

 {/* Title */}
 <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
   <Typography
     variant="subtitle2"
     style={{
       color:
         errorField === "emp_mst_title"
           ? "red"
           : "black",
     }}
   >
     {findCustomizeLabel("emp_mst_title") || "Title"}
   </Typography>

   <TextField
     id="outlined-basic"
     size="small"
     variant="outlined"
     className="Extrasize"
     name="emp_mst_title"
     fullWidth
     value={textFields.emp_mst_title}
     onChange={handleChangeText}
     inputProps={{ maxLength: 60 }}
   />
 </Stack>

 <div
   className="loginId"
   style={{
     display: "flex",
     alignItems: "center",
     gap: "10px",
   }}
 >
   <Stack
     spacing={1}
     sx={{ pb: 1, mt: 1, width: "100%" }}
   >
     <Typography
       variant="subtitle2"
       style={{
         color:
           errorField === "emp_mst_login_id"
             ? "red"
             : "black",
       }}
     >
       {findCustomizeLabel("emp_mst_login_id") ||
         "Login Id"}{" "}
     </Typography>

     <div
       style={{
         display: "flex",
         alignItems: "center",
         gap: 20,
       }}
     >
       <TextField
         id="outlined-basic"
         variant="outlined"
         name="emp_mst_login_id"
         size="small"
         value={data.emp_mst_login_id}
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
                 gap: 10,
               }}
             >
               <Iconify
                 icon="material-symbols:close"
                 style={{ cursor: "pointer" }}
                 onClick={() =>
                   handleCancelClick("emp_mst_login_id")
                 }
               />

               <Iconify
                 icon="tabler:edit"
                 onClick={() =>
                   handleEditClick("emp_mst_login_id")
                 }
                 style={{ cursor: "pointer" }}
               />
             </div>
           ),
         }}
       />

       {/* create new loginId dialog */}
       <Tooltip
         title="Create New User Login"
         arrow
         placement="top"
       >
         <IconButton>
           <Icon
             icon="flat-color-icons:plus"
             width="24"
             height="24"
           />
         </IconButton>
       </Tooltip>
     </div>
   </Stack>
 </div>



 {/* Dashboard Acesss */}
 <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
   <Typography
     variant="subtitle2"
     style={{
       color:
         errorField === "emp_mst_dash_access"
           ? "red"
           : "black",
     }}
   >
     {findCustomizeLabel("emp_mst_dash_access") ||
       "Dashboard Acess"}{" "}
   </Typography>

   <Autocomplete
     options={dashboardAcess}
     value={
       selectedDashboardAcess
         ? selectedDashboardAcess
         : ""
     }
     onChange={(event, value) => {
       setselectedDashboardAcess(value);
     }}
     renderInput={(params) => (
       <div>
         <TextField
           {...params}
           size="small"
           placeholder="Select.."
           variant="outlined"
           className="Extrasize"
         />
       </div>
     )}
   />
 </Stack>
</Box>



// Employee Information

    {/* contact no */}
    <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
    <Typography
      variant="subtitle2"
      style={{
        color:
          errorField === "emp_mst_homephone"
            ? "red"
            : "black",
      }}
    >
      {findCustomizeLabel("emp_mst_homephone") ||
        "Contact No"}{" "}
    </Typography>

    <TextField
      id="outlined-basic"
      size="small"
      variant="outlined"
      className="Extrasize"
      name="emp_mst_homephone"
      fullWidth
      value={textFields.emp_mst_homephone}
      onChange={handleChangeText}
      inputProps={{ maxLength: 60 }}
    />
  </Stack>
  {/* contact no end */}

  
                              {/* date of birth */}
                              <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  style={{
                                    color:
                                      errorField === "emp_mst_date_of_birth"
                                        ? "red"
                                        : "black",
                                  }}
                                >
                                  {findCustomizeLabel(
                                    "emp_mst_date_of_birth"
                                  ) || "DOB"}{" "}
                                </Typography>
                                <DatePicker
                                  format="dd/MM/yyyy"
                                  className="Extrasize"
                                  onChange={(newDate) => {
                                    setDate((pre) => ({
                                      ...pre,
                                      emp_mst_date_of_birth: newDate,
                                    }));
                                  }}
                                  value={new Date(date.emp_mst_date_of_birth)}
                                  // value={date.emp_mst_date_of_birth}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                    },
                                  }}
                                />
                              </Stack>
                              {/* date of birth end */}

                                       {/* Emergency Name */}
                                       <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                                       <Typography
                                         variant="subtitle2"
                                         style={{
                                           color:
                                             errorField === "emp_mst_emg_name"
                                               ? "red"
                                               : "black",
                                         }}
                                       >
                                         {findCustomizeLabel("emp_mst_emg_name") ||
                                           "Emergency Name"}{" "}
                                       </Typography>
       
                                       <TextField
                                         id="outlined-basic"
                                         size="small"
                                         variant="outlined"
                                         className="Extrasize"
                                         name="emp_mst_emg_name"
                                         value={textFields.emp_mst_emg_name}
                                         fullWidth
                                         onChange={handleChangeText}
                                       />
                                     </Stack>


                              {/* DOH */}
                              <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  style={{
                                    color:
                                      errorField === "emp_mst_dateofhire"
                                        ? "red"
                                        : "black",
                                  }}
                                >
                                  {findCustomizeLabel("emp_mst_dateofhire") ||
                                    "Date of Hire"}{" "}
                                </Typography>

                                <DatePicker
                                  format="dd/MM/yyyy"
                                  className="Extrasize"
                                  onChange={(newDate) => {
                                    setDate((pre) => ({
                                      ...pre,
                                      emp_mst_dateofhire: newDate,
                                    })); // Update your state with the new value
                                  }}
                                  value={new Date(date.emp_mst_dateofhire)}
                                  // value={date.emp_mst_dateofhire}

                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                    },
                                  }}
                                />
                              </Stack>
                              {/* DOH  END*/}


                              
                              {/* Emergency Phone */}
                              <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  style={{
                                    color:
                                      errorField === "emp_mst_emg_phone"
                                        ? "red"
                                        : "black",
                                  }}
                                >
                                  {findCustomizeLabel("emp_mst_emg_phone") ||
                                    "Emergency Phone"}{" "}
                                </Typography>

                                <TextField
                                  id="outlined-basic"
                                  size="small"
                                  variant="outlined"
                                  className="Extrasize"
                                  name="emp_mst_emg_phone"
                                  fullWidth
                                  value={textFields.emp_mst_emg_phone}
                                  onChange={handleChangeText}
                                />
                              </Stack>
                              {/* Emergency End */}


                                  {/* material Status */}
                                  <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                                  <Typography
                                    variant="subtitle2"
                                    style={{
                                      color:
                                        errorField === "emp_mst_marital_status"
                                          ? "red"
                                          : "black",
                                    }}
                                  >
                                    {findCustomizeLabel(
                                      "emp_mst_marital_status"
                                    ) || "Marital Status"}{" "}
                                  </Typography>
  
                                  <Autocomplete
                                    options={mstatus}
                                    value={
                                      selectedMstatus && selectedMstatus.label
                                        ? selectedMstatus.label
                                        : ""
                                    }
                                    onChange={(event, value) => {
                                      setselectedMstatus(value);
                                    }}
                                    renderInput={(params) => (
                                      <div>
                                        <TextField
                                          {...params}
                                          size="small"
                                          placeholder="Select..."
                                          variant="outlined"
                                          className="Extrasize"
                                        />
                                      </div>
                                    )}
                                  />
                                </Stack>
                                {/* material Status End*/}


                                
                              {/* Sex */}
                              <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
                              <Typography
                                variant="subtitle2"
                                style={{
                                  color:
                                    errorField === "emp_mst_sex"
                                      ? "red"
                                      : "black",
                                }}
                              >
                                {findCustomizeLabel("emp_mst_sex") || "Sex"}{" "}
                              </Typography>

                              <Autocomplete
                                options={sex}
                                value={selectedSex?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelectedSex(value);
                                }}
                                renderInput={(params) => (
                                  <div>
                                    <TextField
                                      {...params}
                                      size="small"
                                      placeholder="Select..."
                                      variant="outlined"
                                      className="Extrasize"
                                    />
                                  </div>
                                )}
                              />
                            </Stack>

                            {/* Sex End*/}


                            <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 50,
                            }}
                          >
                            {/* pay period */}
                            <Stack
                              spacing={1}
                              sx={{ pb: 1, mt: 1, width: "100%" }}
                            >
                              <Typography
                                variant="subtitle2"
                                style={{
                                  color:
                                    errorField === "emp_mst_pay_period"
                                      ? "red"
                                      : "black",
                                }}
                              >
                                {findCustomizeLabel("emp_mst_pay_period") ||
                                  "Pay Period"}{" "}
                              </Typography>

                              <Autocomplete
                                options={payPeriod}
                                value={selectedPayPeriod?.label ?? ""}
                                onChange={(event, value) => {
                                  setSelectedPayPeriod(value);
                                }}
                                renderInput={(params) => (
                                  <div>
                                    <TextField
                                      {...params}
                                      size="small"
                                      variant="outlined"
                                      className="Extrasize"
                                      // inputProps={{maxLength:}}
                                    />
                                  </div>
                                )}
                              />
                            </Stack>
                            {/* pay period end */}

                            {/* pay rate */}
                            <Stack
                              spacing={1}
                              sx={{ pb: 1, mt: 1, width: "100%" }}
                            >
                              <Typography
                                variant="subtitle2"
                                style={{
                                  color:
                                    errorField === "emp_mst_dateofhire"
                                      ? "red"
                                      : "black",
                                }}
                              >
                                {findCustomizeLabel("emp_mst_payrate") ||
                                  "Pay Rate"}{" "}
                              </Typography>

                              <TextField
                                id="outlined-basic"
                                size="small"
                                variant="outlined"
                                className="Extrasize"
                                type="number"
                                name="emp_mst_payrate"
                                value={textFields.emp_mst_payrate}
                                fullWidth
                                onChange={handleChangeText}
                                inputProps={{
                                  style: { textAlign: "right" },
                                }}
                              />
                            </Stack>
                          </div>

<Stack spacing={1}>
<Typography variant="subtitle2">
  {findCustomizeLabel("emp_det_email_id") || "Email ID"}
</Typography>
<TextField
  id="outlined-basic"
  variant="outlined"
  name="emp_det_email_id"
  size="small"
  value={textFields && textFields.emp_det_email_id?textFields.emp_det_email_id:""}

  onChange={handleChangeText}
  inputProps={{ maxLength: 50 }}
/>
</Stack>



  {/* Shift */}
  <Stack spacing={1} sx={{ pb: 1, mt: 1 }}>
          <Typography variant="subtitle2">
            {findCustomizeLabel("emp_det_shift") || "Shift"}{" "}
          </Typography>
          
          <Autocomplete
            options={shift}
           value={selectedShift && selectedShift.label?selectedShift.label:""}
            onChange={(event, value) => {
              setSelectedShift(value);
            }}
            renderInput={(params) => (
              <div>
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select..."
                  variant="outlined"
                  className="Extrasize"
                />
              </div>
            )}
          />
        </Stack>



<Stack spacing={1}>
<Typography
  variant="subtitle2"
  style={{
    color:
      errorField === "emp_mst_remarks"
        ? "red"
        : "black",
  }}
>
  {findCustomizeLabelDet("emp_mst_remarks") ||
    "Remark"}
</Typography>
<TextareaAutosize
  aria-label="empty textarea"
  name="emp_mst_remarks"
  minRows={6.5}
  value={textFields.emp_mst_remarks}
  className="TxtAra"
  style={{ width: "100%" }} // Make it full-width
  // onChange={(e) => {
  //   setUDFNote1(e.target.value);
  // }}
  onChange={handleChangeText}
/>
</Stack>

       