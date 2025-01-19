import {
  Autocomplete,
  Grid,
  Stack,
  TextField,
  Typography,
  Card,
  TextareaAutosize,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import httpCommon from "src/http-common";

function ShipTo({
  findCustomizeLabel,
  handleChangeText,
  textFields,
  RowID,
  findCustomizerequiredLabel,
  shipToDrp,
  selectedShipTo,
  setSelectedShipTo,
  error2,
  setError2,
  setTextFields,
}) {
  const site_ID = localStorage.getItem("site_ID");
  const [isOpenWork, setIsOpenWork] = useState(true);
  const [fetShip,setFetchShip] = useState(false)
  const toggleDiv = () => {
    setIsOpenWork(!isOpenWork);
  };
 const fetchShipTo =async()=>{

  try {
    const response = await httpCommon.get(`/get_sup_mst_ship_to.php?site_cd=${site_ID}&shipTo=${selectedShipTo}&RowID=${RowID}`)

    if(response.data.status === "SUCCESS"){
      const data = response.data.result[0]
     

      if(data){
        setTextFields((pre)=>({
          ...pre,
          sup_det_shi_contact:data.sup_shi_contact,
          sup_det_shi_phone:data.sup_shi_phone,
          sup_det_shi_address1:data.sup_shi_address1,
          sup_det_shi_address2:data.sup_shi_address2,
          sup_det_shi_city:data.sup_shi_city,
          sup_det_shi_state:data.sup_shi_state,
          sup_det_shi_postal_code:data.sup_shi_postal_code,
          sup_det_shi_province:data.sup_shi_province,
          sup_det_shi_country:data.sup_shi_country,
          sup_det_shi_note:data.sup_shi__note,
        }))
        setFetchShip(false)
      }
    
    }
  } catch (error) {
    console.log("error",error)
  }
 }
useEffect(()=>{
  if(fetShip){
    fetchShipTo();
  }
  
},[fetShip])


useEffect(()=>{
  setTextFields((pre)=>({
    ...pre,
    sup_det_shi_contact:textFields && textFields.sup_det_shi_contact?textFields.sup_det_shi_contact : "",
    sup_det_shi_phone:textFields && textFields.sup_det_shi_phone?textFields.sup_det_shi_phone:"",
    sup_det_shi_address1:textFields && textFields.sup_det_shi_address1?textFields.sup_det_shi_address1:"",
    sup_det_shi_address2:textFields && textFields.sup_det_shi_address2?textFields.sup_det_shi_address2:"",
    sup_det_shi_city:textFields && textFields.sup_det_shi_city?textFields.sup_det_shi_city:"",
    sup_det_shi_state:textFields && textFields.sup_det_shi_state?textFields.sup_det_shi_state:"",
    sup_det_shi_postal_code:textFields && textFields.sup_det_shi_postal_code?textFields.sup_det_shi_postal_code:"",
    sup_det_shi_province:textFields && textFields.sup_det_shi_province?textFields.sup_det_shi_province:"",
    sup_det_shi_country:textFields && textFields.sup_det_shi_country?textFields.sup_det_shi_country:"",
    sup_det_shi_note:textFields && textFields.sup_det_shi_note?textFields.sup_det_shi_note:"",
  }))
},[])

const handleTextFields =()=>{

  setTextFields((pre)=>({
    ...pre,
    sup_det_shi_contact:"",
    sup_det_shi_phone:"",
    sup_det_shi_address1:"",
    sup_det_shi_address2:"",
    sup_det_shi_city:"",
    sup_det_shi_state:"",
    sup_det_shi_postal_code:"",
    sup_det_shi_province:"",
    sup_det_shi_country:"",
    sup_det_shi_note:"",
  }))

}

  return (
    <>
      <Card sx={{ p: 3, mt: -2,borderRadius:"0px" }}>
        <Grid container width="100%" alignItems="baseline" spacing={2}>
          {/* Grid 1 */}
          <Grid item xs={12} md={6}>
            {/* Ship to */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography variant="subtitle2">
                {findCustomizeLabel("sup_det_shi_shipto") || "Ship To"}
              </Typography>

              <Autocomplete
                options={shipToDrp}
                value={selectedShipTo ? selectedShipTo : ""}
                onChange={(event, newValue) => {
                  if (newValue && newValue.value) {
                    setSelectedShipTo(newValue.value);
                    setError2("");
                    setFetchShip(true)
                    
                  } else {
                    setSelectedShipTo("");
                    handleTextFields();
                  }
                }}
                renderInput={(params) => (
                  <div>
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select..."
                      variant="outlined"
                      className={`Extrasize ${
                        error2 === "sup_det_shi_shipto" ? "errorEmpty" : ""
                      }`}
                  
                    />
                  </div>
                )}
              />
            </Stack>

            {/* Ship to Contact */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_contact") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_contact") || "Contact"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_contact"
                className="Extrasize"
      
                value={textFields.sup_det_shi_contact}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 30
                }}
              />
            </Stack>

            {/* Postal Code */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_phone") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_phone") || "Phone"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_phone"
                className="Extrasize"
           
                value={textFields.sup_det_shi_phone}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 30
                }}
             
              />
            </Stack>

            {/* Address 1 ship */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_address1")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_address1") || "Adress 1"}
              </Typography>
              <TextareaAutosize
                aria-label="empty textarea"
                name="sup_det_shi_address1"
                minRows={6.5}
                value={textFields.sup_det_shi_address1}
                className={`TxtAra ${
                  error2 === "sup_det_shi_address1" ? "errorEmpty" : ""
                }`}
                style={{ width: "100%", resize: "none" }}
                onChange={handleChangeText}
                maxLength={50}
              />
            </Stack>

           {/* Address 2 ship */}
           <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_address2")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_address2") || "Adress 2"}
              </Typography>
              <TextareaAutosize
                aria-label="empty textarea"
                name="sup_det_shi_address2"
                minRows={6.5}
                value={textFields.sup_det_shi_address2}
                className={`TxtAra ${
                  error2 === "sup_det_shi_address2" ? "errorEmpty" : ""
                }`}
                style={{ width: "100%", resize: "none" }}
                onChange={handleChangeText}
                maxLength={50}
              />
            </Stack>



          </Grid>

          {/* Grid 2 */}
          <Grid item xs={12} md={6}>
            {/* city */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_city") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_city") || "City"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_city"
                className="Extrasize"
          
                value={textFields.sup_det_shi_city}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 30
                }}
              
              />
            </Stack>

            {/*State*/}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_state") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_state") || "State"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_state"
                className="Extrasize"
                value={textFields.sup_det_shi_state}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 30
                }}
              />
            </Stack>

            {/*Postal Code ship*/}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_postal_code") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_postal_code") || "Postal Code"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_postal_code"
                className="Extrasize"
           
                value={textFields.sup_det_shi_postal_code}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 30
                }}
              />
            </Stack>

            {/*Province*/}
            <Stack spacing={1} sx={{ pb: 1.5 }}>

              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_province") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_province") || "Province"}
              </Typography>

              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_province"
                className="Extrasize"
                value={textFields.sup_det_shi_province}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 30
                }}
              />
              
            </Stack>

            {/*Country Ship*/}
            <Stack spacing={1} sx={{ pb: 1.5,mt:-0.3 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_country") ? "red" : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_country") || "Country"}
              </Typography>
              <TextField
                size="small"
                variant="outlined"
                name="sup_det_shi_country"
                className="Extrasize"
          
                value={textFields.sup_det_shi_country}
                onChange={handleChangeText}
                inputProps={{
                  maxLength: 30
                }}
              />
            </Stack>

            {/* Mobile Phone */}
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <Typography
                variant="subtitle2"
                className={
                  findCustomizerequiredLabel("sup_det_shi_note")
                    ? "red"
                    : ""
                }
              >
                {findCustomizeLabel("sup_det_shi_note") || "Notes"}
              </Typography>
                  <TextareaAutosize
                      aria-label="empty textarea"
                      name="sup_det_shi_note"
                      minRows={6.5}
                      value={textFields.sup_det_shi_note}
                      className={`TxtAra ${
                        error2 === "sup_det_shi_note"
                          ? "errorEmpty"
                          : ""
                      }`}
                      style={{ width: "100%",resize:"none" }}
                      onChange={handleChangeText}
                      maxLength={2000}
                    />
            </Stack>

          
          </Grid>
        </Grid>{" "}
      </Card>
    </>
  );
}

export default ShipTo;
