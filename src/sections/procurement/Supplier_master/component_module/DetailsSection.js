import {
  Grid,
  Stack,
  TextField,
  Typography,
  Card,
  TextareaAutosize,
} from "@mui/material";
import React, { useState } from "react";


function DetailsSection({
  findCustomizeLabel,
  handleChangeText,
  textFields,
  findCustomizerequiredLabel,
  error2,
  setTextFields,

}) {

  return (
    <>
      <Card sx={{ p: 3, mt: -2 }}>
        <Grid container width="100%" alignItems="baseline" spacing={2}>
          {/* Grid 1 */}
          <Grid item xs={12} md={6}>
            {/* Address 1 */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_address1") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_address1") || "Address 1"}
              </Typography>
              <TextareaAutosize
                aria-label="empty textarea"
                name="sup_det_address1"
                minRows={6.5}
                value={textFields.sup_det_address1}
                className={`TxtAra ${
                  error2 === "sup_det_address1" ? "errorEmpty" : ""
                }`}
            
                onChange={handleChangeText}

                style={{ width: "100%",resize:"none"  }}
                maxLength={80 }
                

              />
            </Stack>

            {/*Planner */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_address2") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_address2") || "Address 2"}
              </Typography>
              <TextareaAutosize
                aria-label="empty textarea"
                name="sup_det_address2"
                minRows={6.5}
                value={textFields.sup_det_address2}
                className={`TxtAra ${
                  error2 === "sup_det_address2" ? "errorEmpty" : ""
                }`}
             
                onChange={handleChangeText}
                 style={{ width: "100%",resize:"none"  }}
                 maxLength={80}
              />
            </Stack>

            {/* Postal Code */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_postal_code")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("sup_det_postal_code") || "Note1"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_postal_code"
                className="Extrasize"
        
                value={textFields.sup_det_postal_code}
                onChange={(e) => {
                  let inputValue = e.target.value;
                  if (inputValue > 25) {
                    inputValue = inputValue.slice(0, 25);
                  }
                  setTextFields((pre) => ({
                    ...pre,
                    [e.target.name]: e.target.value,
                  }));
                }}
                inputProps={{
                  maxLength: 25,autoComplete: "off"
                }}
             
              />
            </Stack>

            {/* City */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_city") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_city") || "City"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_city"
                className="Extrasize"
             
                value={textFields.sup_det_shi_city}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 50,autoComplete: "off"
                }}
             
                
              />
            </Stack>
              
            {/* state */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_state") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_state") || "State"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_state"
                className="Extrasize"
              
                value={textFields.sup_det_shi_state}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 50,autoComplete: "off"
                }}
             
              />
            </Stack>

            {/* Province */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_province") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_province") || "Province"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_province"
                className="Extrasize"
       
                value={textFields.sup_det_province}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 50,autoComplete: "off"
                }}
           
              />
            </Stack>

            {/* Country */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_country") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_country") || "Country"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_country"
                className="Extrasize"
    
                value={textFields.sup_det_country}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 50 , autoComplete: "off"
                }}
      
              />
            </Stack>
          </Grid>

          {/* Grid 2 */}
          <Grid item xs={12} md={6}>
            {/* Contact 1 */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_contact1") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_contact1") || "Country"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_contact1"
                className="Extrasize"
                
                value={textFields.sup_det_contact1}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 80,autoComplete: "off"
                }}
          
              />
            </Stack>

            {/* Contact 2*/}
            <Stack spacing={1} sx={{ pb: 1.5,mt:-0.3 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_contact2") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_contact2") || "Contact 2"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_contact2"
                className="Extrasize"
                
                value={textFields.sup_det_contact2}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 80,autoComplete: "off"
                }}
          
              />
            </Stack>


                  {/*Phone no*/}
              <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_phone") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_phone") || "Contact 2"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_phone"
                className="Extrasize"
                value={textFields.sup_det_phone}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 25,autoComplete: "off"
                }}
        
              />
            </Stack>

          
                  {/*Phone no*/}
              <Stack spacing={1} sx={{ pb: 1.5,mt:-0.3 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_fax_phone") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_fax_phone") || "Fax Phone No"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_fax_phone"
                className="Extrasize"
              
                value={textFields.sup_det_fax_phone}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 25,autoComplete: "off"
                }}

              />
            </Stack>

           {/* Mobile Phone */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_mobile_phone") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_mobile_phone") || "Mobile Phone"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_mobile_phone"
                className="Extrasize"
                type="number"
                value={textFields.sup_det_mobile_phone}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 25,autoComplete: "off"
                }}
           
              />
            </Stack>

           {/* Email Id */}
           <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_email_id") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_email_id") || "Email ID"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_email_id"
                className="Extrasize"
            
                value={textFields.sup_det_email_id}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 50, autoComplete: "off"
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default DetailsSection;
