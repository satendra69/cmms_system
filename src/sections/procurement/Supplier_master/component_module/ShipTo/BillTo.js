import {
  Autocomplete,
  Grid,
  Stack,
  TextField,
  Typography,
  TextareaAutosize,
} from "@mui/material";

import React, { useEffect, useState } from "react";


import httpCommon from "src/http-common";

function BillTo({
  findCustomizeLabel,
  handleChangeText,
  textFields,
  billToDrp,
  selectedBillTo,
  setSelectedBillTo,
  findCustomizerequiredLabel,
  error2,
  setTextFields,
}) {
  const [isOpenWork, setIsOpenWork] = useState(true);
  const site_ID = localStorage.getItem("site_ID");
  const [fetBill,setFetchBill] = useState(false)

  const toggleDiv = () => {
    setIsOpenWork(!isOpenWork);
  };



  const fetchShipTo =async()=>{

    try {
      const response = await httpCommon.get(`/get_sup_mst_bill_to.php?site_cd=${site_ID}&billTo=${selectedBillTo}`)

  
      if(response.data.status === "SUCCESS"){
        const data = response.data.result[0]
        if(data){
          setTextFields((pre)=>({
            ...pre,
            sup_det_bil_contact: data.sup_bil_contact,
            sup_det_bil_phone:  data.sup_bil_phone,
            sup_det_bil_address1: data.sup_bil_address1,
            sup_det_bil_address2:data.sup_bil_address2,
            sup_det_bil_city: data.sup_bil_city,
            sup_det_bil_state: data.sup_bil_state,
            sup_det_bil_postal_code: data.sup_bil_postal_code,
            sup_det_bil_province: data.sup_bil_province,
            sup_det_bil_country:data.sup_bil_country,
            sup_det_bil_note:data.sup_bil__note,

          }))
          setFetchBill(false)
        }
       
      
      }
    } catch (error) {
      console.log("error",error)
    }
   }
  useEffect(()=>{
    if(fetBill){
      fetchShipTo();
    }
    
  },[fetBill])


  useEffect(()=>{
    setTextFields((pre)=>({
      ...pre,
      sup_det_bil_contact:textFields && textFields.sup_det_bil_contact ?textFields.sup_det_bil_contact : "",

      sup_det_bil_phone:textFields && textFields.sup_det_bil_phone ?textFields.sup_det_bil_phone : "",

      sup_det_bil_address1:textFields && textFields.sup_det_bil_address1 ?textFields.sup_det_bil_address1 :"",

      sup_det_bil_address2:textFields && textFields.sup_det_bil_address2 ?textFields.sup_det_bil_address2 : "",

      sup_det_bil_city:textFields && textFields.sup_det_bil_city ?textFields.sup_det_bil_city : "",

      sup_det_bil_state:textFields && textFields.sup_det_bil_state ?textFields.sup_det_bil_state :  "",

      sup_det_bil_postal_code:textFields && textFields.sup_det_bil_postal_code ?textFields.sup_det_bil_postal_code: "",

      sup_det_bil_province:textFields && textFields.sup_det_bil_province ?textFields.sup_det_bil_province : "",

      sup_det_bil_country:textFields && textFields.sup_det_bil_country ?textFields.sup_det_bil_country : "",

      sup_det_bil_note:textFields && textFields.sup_det_bil_note ?textFields.sup_det_bil_note : "",
    }))
  },[])


  const handleTextFields =()=>{

    setTextFields((pre)=>({
      ...pre,
      sup_det_bil_contact:"",
      sup_det_bil_phone:"",
      sup_det_bil_address1:"",
      sup_det_bil_address2:"",
      sup_det_bil_city:"",
      sup_det_bil_state:"",
      sup_det_bil_postal_code:"",
      sup_det_bil_province:"",
      sup_det_bil_country:"",
      sup_det_bil_note:"",
    }))
  
  }
  

  return (
    <>
      <Grid container width="100%" alignItems="baseline" spacing={2}>
        {/* Grid 1 */}
        <Grid item xs={12} md={6}>
          {/* Ship to */}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
            <Typography variant="subtitle2">
              {findCustomizeLabel("sup_det_bil_billto") || "Bill To"}
            </Typography>

            <Autocomplete
              options={billToDrp}
              value={selectedBillTo ? selectedBillTo : ""}
              onChange={(event, newValue) => {
                if (newValue && newValue.value) {
                  setSelectedBillTo(newValue.value);
                  setFetchBill(true)
                  // setError2("");
                } else {
                  setSelectedBillTo("");
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
                      error2 === "sup_det_bil_billto" ? "errorEmpty" : ""
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
                findCustomizerequiredLabel("sup_det_bil_contact") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_contact") || "Contact"}
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              name="sup_det_bil_contact"
              className="Extrasize"
         
              value={textFields.sup_det_bil_contact}
              onChange={(e) => {
                let inputValue = e.target.value;
                if (inputValue > 30) {
                  inputValue = inputValue.slice(0, 30);
                }
                setTextFields((pre) => ({
                  ...pre,
                  [e.target.name]: e.target.value,
                }));
              }}
              inputProps={{ maxLength: 30 } }
            />
          </Stack>

          {/* Postal Code */}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
            <Typography
              variant="subtitle2"
              className={
                findCustomizerequiredLabel("sup_det_bil_phone") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_phone") || "Phone"}
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              name="sup_det_bil_phone"
              className="Extrasize"
    
              value={textFields.sup_det_bil_phone}
              onChange={(e) => {
                let inputValue = e.target.value;
                if (inputValue > 30) {
                  inputValue = inputValue.slice(0, 30);
                }
                setTextFields((pre) => ({
                  ...pre,
                  [e.target.name]: e.target.value,
                }));
              }}
              inputProps={{ maxLength: 30 } }
            />
          </Stack>

          {/* Address 1 ship */}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
            <Typography
              variant="subtitle2"
              className={
                findCustomizerequiredLabel("sup_det_bil_address1") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_address1") || "Adress 1"}
            </Typography>

            <TextareaAutosize
              aria-label="empty textarea"
              name="sup_det_bil_address1"
              minRows={6.5}
              value={textFields.sup_det_bil_address1}
              className={`TxtAra ${
                error2 === "sup_det_bil_address1" ? "errorEmpty" : ""
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
                findCustomizerequiredLabel("sup_det_bil_address2") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_address2") || "Adress 2"}
            </Typography>
            <TextareaAutosize
              aria-label="empty textarea"
              name="sup_det_bil_address2"
              minRows={6.5}
              value={textFields.sup_det_bil_address2}
              className={`TxtAra ${
                error2 === "sup_det_bil_address2" ? "errorEmpty" : ""
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
                findCustomizerequiredLabel("sup_det_bil_city") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_city") || "City"}
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              name="sup_det_bil_city"
              className="Extrasize"
        
              value={textFields.sup_det_bil_city}
              onChange={handleChangeText}
              inputProps={{ maxLength: 30 } }
            />
          </Stack>

          {/*State*/}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
            <Typography
              variant="subtitle2"
              className={
                findCustomizerequiredLabel("sup_det_bil_state") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_state") || "State"}
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              name="sup_det_bil_state"
              className="Extrasize"
           
              value={textFields.sup_det_bil_state}
              onChange={handleChangeText}
              inputProps={{ maxLength: 30 } }
            />
          </Stack>

          {/*Postal Code ship*/}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
            <Typography
              variant="subtitle2"
              className={
                findCustomizerequiredLabel("sup_det_bil_postal_code")
                  ? "red"
                  : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_postal_code") || "Postal Code"}
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              name="sup_det_bil_postal_code"
              className="Extrasize"
              value={textFields.sup_det_bil_postal_code}
              onChange={handleChangeText}
              inputProps={{ maxLength: 30 } }
            />
          </Stack>

          {/*Province*/}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
            <Typography
              variant="subtitle2"
              className={
                findCustomizerequiredLabel("sup_det_bil_province") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_province") || "Province"}
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              name="sup_det_bil_province"
              className="Extrasize"
              value={textFields.sup_det_bil_province}
              onChange={handleChangeText}
              inputProps={{ maxLength: 30 } }
            />
          </Stack>

          {/*Country Ship*/}
          <Stack spacing={1} sx={{ pb: 1.5,mt:-0.3 }}>
            <Typography
              variant="subtitle2"
              className={
                findCustomizerequiredLabel("sup_det_bil_country") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_country") || "Country"}
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              name="sup_det_bil_country"
              className="Extrasize"
              value={textFields.sup_det_bil_country}
              onChange={handleChangeText}
              inputProps={{ maxLength: 30 } }
            />
          </Stack>

          {/* Mobile Phone */}
          <Stack spacing={1} sx={{ pb: 1.5 }}>
            <Typography
              variant="subtitle2"
              className={
                findCustomizerequiredLabel("sup_det_bil_note") ? "red" : ""
              }
            >
              {findCustomizeLabel("sup_det_bil_note") || "Notes"}
            </Typography>

            <TextareaAutosize
              aria-label="empty textarea"
              name="sup_det_bil_note"
              minRows={6.5}
              value={textFields.sup_det_bil_note}
              className={`TxtAra ${
                error2 === "sup_det_bil_note" ? "errorEmpty" : ""
              }`}
              style={{ width: "100%", resize: "none" }}
              onChange={handleChangeText}
              maxLength={2000}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default BillTo;
