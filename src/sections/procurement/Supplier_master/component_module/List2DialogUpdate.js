import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";

import {


  Divider,

  Grid,
  IconButton,

  TextField,

  Typography,
} from "@mui/material";


import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";

import {  DatePicker as AntDatePicker } from "antd";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";


export default function List2DialogUpdate({
  open,
  handleClose,
  setRefetch,
  setMaintenceResult,
  MaintenceResult,
  error2,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
  deleted,
  setDeleted,
  rowData,
  RowIDProp,
  state

}) {

  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);

  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    sup_ls2_varchar1: "",
    sup_ls2_varchar2: "",
    sup_ls2_varchar3: "",
    sup_ls2_datetime1:"",
    sup_ls2_datetime2:"",
    sup_ls2_datetime3:"",
    sup_ls2_numeric1:"",
    sup_ls2_numeric2:""

  });
  React.useEffect(() => {
    if (deleted) {
     

      setDeleted(false);
    }
  }, [deleted]);



  React.useEffect(()=>{
    // const filterResult=MaintenceResult.find((item)=>item.RowID == rowData.RowID)
    const filterResult = MaintenceResult.find(
      (item) =>
        item.RowID === rowData.RowID &&
        item.RowID !== undefined &&
        item.RowID !== "",
    );
    
    
      if(RowIDProp && state && filterResult ){
    
        setData((pre)=>({
          ...pre,
         
          sup_ls2_varchar1:filterResult && filterResult.sup_ls2_varchar1 ? filterResult.sup_ls2_varchar1:"",

          sup_ls2_varchar2:filterResult && filterResult.sup_ls2_varchar2 ? filterResult.sup_ls2_varchar2:"",

          sup_ls2_varchar3:filterResult && filterResult.sup_ls2_varchar3 ? filterResult.sup_ls2_varchar3:"",

          sup_ls2_datetime1:filterResult && filterResult.sup_ls2_datetime1 ? filterResult.sup_ls2_datetime1:"",

          sup_ls2_datetime2:filterResult && filterResult.sup_ls2_datetime2 ? filterResult.sup_ls2_datetime2:"",

          sup_ls2_datetime3:filterResult && filterResult.sup_ls2_datetime3 ? filterResult.sup_ls2_datetime3:"",

          sup_ls2_numeric1:filterResult && filterResult.sup_ls2_numeric1 ? filterResult.sup_ls2_numeric1:"",

          sup_ls2_numeric2:filterResult && filterResult.sup_ls2_numeric2 ? filterResult.sup_ls2_numeric2:"",

         

          RowID: rowData && rowData.RowID
          ? rowData.RowID
          :""
        }))

        
     
      }else if(rowData){
     
        setData((pre)=>({
          ...pre,
          sup_ls2_varchar1:rowData && rowData.sup_ls2_varchar1 ? rowData.sup_ls2_varchar1:"",

          sup_ls2_varchar2:rowData && rowData.sup_ls2_varchar2 ? rowData.sup_ls2_varchar2:"",

          sup_ls2_varchar3:rowData && rowData.sup_ls2_varchar3 ? rowData.sup_ls2_varchar3:"",

          sup_ls2_datetime1:rowData && rowData.sup_ls2_datetime1 ? rowData.sup_ls2_datetime1:"",

          sup_ls2_datetime2:rowData && rowData.sup_ls2_datetime2 ? rowData.sup_ls2_datetime2:"",

          sup_ls2_datetime3:rowData && rowData.sup_ls2_datetime3 ? rowData.sup_ls2_datetime3:"",

          sup_ls2_numeric1:rowData && rowData.sup_ls2_numeric1 ? rowData.sup_ls2_numeric1:"",

          sup_ls2_numeric2:rowData && rowData.sup_ls2_numeric2 ? rowData.sup_ls2_numeric2:"",
        }))
  
    
      }
    
    },[rowData])

  React.useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_sup_mst_ls2_mandatoryfiled.php",
        );

      //  console.log("ls2_label", response);
        if (response.data.status === "SUCCESS") {
          setGroupLabel(response.data.mandatory_fields);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);

  const handleRequiredField = (body) => {
    const mandatory = groupLabel.filter(
      (item) => item.cf_label_required === "1",
    );

    let missingFields = mandatory.find(
      (item) =>
        !body.hasOwnProperty(item.column_name) ||
        body[item.column_name] === null ||
        body[item.column_name] === undefined ||
        body[item.column_name] === "",
    );

    if (missingFields) {
      const errorMessage = `Please fill the required field: ${missingFields.customize_label}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError(missingFields.column_name);
      return true;
    }

    return false;
  };

  // customize label
  
  const handleSubmitForm = async () => {
    const missingField = handleRequiredField(data);
  
    if (!missingField) {
      setMaintenceResult((prev) => {
        const updatedResults = [...prev]; // Clone the previous state
        
        // Find the record by ID (ensure `rowData` has an `id`)
        const existingRecordIndex = updatedResults.findIndex(
          (record) => record.id === rowData.id
        );
  
        // Format the data before updating or adding
        const formattedData = {
          ...data,
          sup_ls2_datetime1: data.sup_ls2_datetime1
            ? dayjs(data.sup_ls2_datetime1).format('YYYY-MM-DD')
            : null,
            sup_ls2_datetime2: data.sup_ls2_datetime2
            ? dayjs(data.sup_ls2_datetime2).format('YYYY-MM-DD')
            : null,
            sup_ls2_datetime3: data.sup_ls2_datetime3
            ? dayjs(data.sup_ls2_datetime3).format('YYYY-MM-DD')
            : null,
        };
  
        if (existingRecordIndex !== -1) {
          // Update the existing record
          updatedResults[existingRecordIndex] = {
            ...updatedResults[existingRecordIndex], // Keep existing data
            ...formattedData, // Merge updated fields
          };
        } else {
          // If no matching record, add a new one
          updatedResults.push({
            ...formattedData,
            id: new Date().getTime(), // Generate a unique ID
          });
        }
  
        return updatedResults;
      });
  
      handleClose(); // Close the modal/dialog
    }
  };

  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName,
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.some(
      (item) =>
        item.column_name === columnName && item.cf_label_required === "1",
    );

    return foundItem;
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
    //    setErrorField(null); // Clear any error state
         return; 
      }
    const formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    setterFunction(formattedValue); // Set the state for the respective UDFNumber state
   // setErrorField(null);
  };


  // handle Text new
  const handleText=(e)=>{
    let value =  e.target.value;
  
    if (e.target.name === "sup_ls2_numeric1") {
    
      if (value == 0 ) {
        setData((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
      return
     }else{
      handleNumericInputChange2(e, (formattedValue) => {
        setData((prev) => ({
          ...prev,
          [e.target.name]: formattedValue,
        }));
      });
      return;
    }
    
  }
  else if (e.target.name === "sup_ls2_numeric2" ) {
    
    if (value == 0 ) {
      setData((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
    return
   }else{
    handleNumericInputChange2(e, (formattedValue) => {
      setData((prev) => ({
        ...prev,
        [e.target.name]: formattedValue,
      }));
    });
    return;
  }
  
  }
   
      setData((pre)=>({
          ...pre,
          [e.target.name]:value
      }))
      setError("")
  }


  return (
    <>
     
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{zIndex:1000}}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Iconify
              icon="material-symbols:order-approve-outline"
              style={{ marginRight: "4px", height: "22px", width: "22px" }}
            />
            Add List 2
          </div>

          <div style={{ cursor: "pointer" }} onClick={handleClose}>
            <IconButton color="error">
              <Icon icon="system-uicons:cross-circle" />
            </IconButton>
          </div>
        </DialogTitle>

        <Divider style={{margin:"0px 0"}}/>
        <DialogContent sx={{ mt: 0.5, p: 2 }}>
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
       

            {/* original content grid  */}
            <Grid container spacing={2} alignItems={"center"}>
                {/* Craft 1 */}
                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                  <Typography variant="subtitle2">
                    {findCustomizeLabel("sup_ls2_varchar1") || "Text 1"}
                  </Typography>
                </Grid>
  
                {/* Text 1 */}
                <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    name="sup_ls2_varchar1"
                    size="small"
                    className={`Extrasize ${
                      error === "sup_ls2_varchar1" ? "errorEmpty" : ""
                    }`}
                    value={data.sup_ls2_varchar1}
                    onChange={handleText}
                    inputProps={{  maxLength: 100 ,autoComplete: "off"}}
                  />
                </Grid>
  
                {/* Text 2 */}
                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("sup_ls2_varchar2") ? "red" : ""
                    }
                  >
                    {findCustomizeLabel("sup_ls2_varchar2") || "Text 2"}
                  </Typography>
                </Grid>
  
                <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    name="sup_ls2_varchar2"
                    size="small"
                    className={`Extrasize ${
                      error === "sup_ls2_varchar2" ? "errorEmpty" : ""
                    }`}
                    value={data.sup_ls2_varchar2}
                    onChange={handleText}
                    inputProps={{ maxLength: 100 ,autoComplete: "off"}}
                  />
                </Grid>


  
                {/* Text 3 */}
                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("sup_ls2_varchar3") ? "red" : ""
                    }
                  >
                    {findCustomizeLabel("sup_ls2_varchar3") || "Text 3"}
                  </Typography>
                </Grid>
  
  
                <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    name="sup_ls2_varchar3"
                    size="small"
             
                    className={`Extrasize ${
                      error === "sup_ls2_varchar3" ? "errorEmpty" : ""
                    }`}
                  
                    value={data.sup_ls2_varchar3}
                    onChange={handleText}
                    inputProps={{ maxLength: 100 ,autoComplete: "off" }}
                  />
                </Grid>


  
                {/* date 1 */}
                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("sup_ls2_datetime1") ? "red" : ""
                    }
                  >
                    {findCustomizeLabel("sup_ls2_datetime1") || "Date 1"}
                  </Typography>
                </Grid>
  
                <Grid item xs={12} md={8} style={{ padding: "10px"}}>
                  <AntDatePicker
                    value={
                      data.sup_ls2_datetime1
                        ? dayjs(data.sup_ls2_datetime1)
                        : null
                    }
                    format="DD/MM/YYYY"
                    placeholder="DD/MM/YYYY"
                    onChange={(newDate) => {
                      if (newDate && newDate.isValid()) {
                        const nativeDate = newDate.toDate();
                        setData((pre) => ({
                          ...pre,
                          sup_ls2_datetime1: nativeDate,
                        }));
                      } else {
                        setData((pre) => ({
                          ...pre,
                          sup_ls2_datetime1: null,
                        }));
                      }
                    }}
                   style={{width:"100%"}}
                   dropdownStyle={{ zIndex: 2000 }} 
              
           
                  />
                </Grid>
  
  
                 {/* date 2 */}
                 <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("sup_ls2_datetime2") ? "red" : ""
                    }
                  >
                    {findCustomizeLabel("sup_ls2_datetime2") || "Date 2"}
                  </Typography>
                </Grid>
  
                <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                  <AntDatePicker
                    value={
                      data.sup_ls2_datetime2
                        ? dayjs(data.sup_ls2_datetime2)
                        : null
                    }
                    format="DD/MM/YYYY"
                    placeholder="DD/MM/YYYY"
                    onChange={(newDate) => {
                      if (newDate && newDate.isValid()) {
                        const nativeDate = newDate.toDate();
                        setData((pre) => ({
                          ...pre,
                          sup_ls2_datetime2: nativeDate,
                        }));
                      } else {
                        setData((pre) => ({
                          ...pre,
                          sup_ls2_datetime2: null,
                        }));
                      }
                    }}
                    style={{width:"100%",zIndex:2000}}
              
                  />
                </Grid>
  
  
                      {/* date 3 */}
                 <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                  <Typography
                    variant="subtitle2"
                    className={
                      findCustomizerequiredLabel("sup_ls2_datetime3") ? "red" : ""
                    }
                  >
                    {findCustomizeLabel("sup_ls2_datetime3") || "Date 2"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                  <AntDatePicker
                    value={
                      data.sup_ls2_datetime3
                        ? dayjs(data.sup_ls2_datetime3)
                        : null
                    }
                    format="DD/MM/YYYY"
                    placeholder="DD/MM/YYYY"
                    onChange={(newDate) => {
                      if (newDate && newDate.isValid()) {
                        const nativeDate = newDate.toDate();
                        setData((pre) => ({
                          ...pre,
                          sup_ls2_datetime3: nativeDate,
                        }));
                      } else {
                        setData((pre) => ({
                          ...pre,
                          sup_ls2_datetime3: null,
                        }));
                      }
                    }}
                    
                    style={{ zIndex: 2000,width:"100%" }} 
              
                  />
                </Grid>

                {/* numeric 1  */}
                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                  <Typography variant="subtitle2">
                    {findCustomizeLabel("sup_ls2_numeric1") || "Text 1"}
                  </Typography>
                </Grid>
  
                {/* Numeric 1 */}
                <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    name="sup_ls2_numeric1"
                    size="small"
                    className={`Extrasize ${
                      error === "sup_ls2_numeric1" ? "errorEmpty" : ""
                    }`}
                   autoComplete="off"
                    value={data.sup_ls2_numeric1}
                    onChange={handleText}
                    inputProps={{ 
                      maxLength: 15,
                      style: { textAlign: "right" }  
                    }}
                  />
                </Grid>

              
                {/* numeric 2  */}
                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                  <Typography variant="subtitle2">
                    {findCustomizeLabel("sup_ls2_numeric2") || "Text 1"}
                  </Typography>
                </Grid>
  
                {/* Numeric 2 */}
                <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                  <TextField
                    id="outlined-basic"
                    fullWidth
                    variant="outlined"
                    name="sup_ls2_numeric2"
                    size="small"
                    className={`Extrasize ${
                      error === "sup_ls2_numeric2" ? "errorEmpty" : ""
                    }`}
                   autoComplete="off"
                    value={data.sup_ls2_numeric2}
                    onChange={handleText}
                    inputProps={{ 
                      maxLength: 15,
                      style: { textAlign: "right" }  
                    }}
                  />
                </Grid>

              </Grid>
          </div>
        </DialogContent>
        <Divider style={{ margin: "0px" }} />
        <DialogActions
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                }}
              >
                
                <Button
                      variant="soft"
                      color="error"
                      className="CloseButton"
                      onClick={(e, r) => {
                        setData("");
                        handleClose(e, r);
                        setError("");
                      }}
                      startIcon={<Iconify icon="jam:close" />}
                    >
                      Close
                </Button>

                <div className="timeCartSubmit" style={{ display: "flex", alignItems: "center" }}>
                  
                  <Button
                  variant="contained"
                  className="SaveButton assetSpares"
                  startIcon={<Iconify icon="mingcute:save-fill" />}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    marginRight: "10px",
                  }}
                  onClick={handleSubmitForm}
                  
                >
                Update
                </Button>
                </div>
              </DialogActions>
      </Dialog>
    </>
  );
}
