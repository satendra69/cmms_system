import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
import {
  Autocomplete,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import MasterDialogMaintence from "./MasterDialogMaintence"
import { GiStoneCrafting } from "react-icons/gi";
import { template } from "lodash";


export default function EmpWrkGrpDaialogUpdate({
  open,
  handleClose,
  setRefetch,
  setMaintenceResult,
  RowIDProp,
  state,
  rowData,
  MaintenceResult,
  error2,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity
}) {

  console.log("rowData_maint",rowData)
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [buttonSub,setButtonSub]=React.useState("Add");

  const [craft,setCraft] = React.useState([])
  const [sId,setSId] = React.useState([])

  const [error, setError] = React.useState("");
  // data 
  const [data, setData] = React.useState({
    emp_ls1_craft:"",
    emp_ls1_supervisor_id:"",
    emp_ls1_pay_rate:"",
    emp_ls1_charge_rate:"",
    row_id:""
  });

  // temp
  const [temp, setTemp] = React.useState({
    emp_ls1_craft:"",
    emp_ls1_supervisor_id:"",
    emp_ls1_pay_rate:"",
    emp_ls1_charge_rate:"",
    row_id:""
  });


  // fetch Craft Droup Down
  const fetchCraft = async () => {
    try {
      const response = await httpCommon.get("/get_craft_emp.php?site_cd=" + site_ID);
  
      if (response.data) {
        const craft = response.data.data;
   
        setCraft(craft)
        
        // Format the data to { label, value }
        const formattedStatus = craft.map(item => ({
          label: `${item.crf_mst_crf_cd} : ${item.crf_mst_desc}`,
          value: `${item.crf_mst_crf_cd} : ${item.crf_mst_desc}` 
        }));

        const findSelected = craft.find((item)=>item.crf_mst_crf_cd === rowData.emp_ls1_craft)
        
        if(findSelected){
          setSelected_craft(findSelected.crf_mst_crf_cd + ":" + findSelected.crf_mst_desc)
        }

        setSelectedCraftDrp(formattedStatus); 
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  }
  // fetch Supervisor Droup Down
  const superVisiorId = async () => {
    try {
      const response = await httpCommon.get("/get_supervisior_emp.php?site_cd=" + site_ID);
  
      if (response.data) {
        const sId = response.data.data;
      
       
        setSId(sId)
        
        // Format the data to { label, value }
        const formattedStatus = sId.map(item => ({
          label: `${item.emp_mst_empl_id} : ${item.emp_mst_name}`,
          value: `${item.emp_mst_empl_id} : ${item.emp_mst_name}` 
        }));

        const findSelected = sId.find((item)=>item.emp_mst_empl_id === rowData.emp_ls1_supervisor_id)
        if(findSelected){
          setSelected_sId(findSelected.emp_mst_empl_id + ":" + findSelected.emp_mst_name)
        }

        
        setSIdDrp(formattedStatus); 
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  }

  React.useEffect(()=>{
    fetchCraft();
    superVisiorId();
  },[rowData])

  
// DroupDown States
const [craftDrp,setSelectedCraftDrp] = React.useState([])
const [selected_craft, setSelected_craft] = React.useState("");
const [selected_craft_temp, setSelected_craft_temp] = React.useState("");

// DroupDown States SuperVisor Id
const [sIdDrp,setSIdDrp] = React.useState([])
const [selected_sId, setSelected_sId] = React.useState("");
const [selected_sId_temp,setSelected_sId_temp]= React.useState("")

const formatNumber = (number) => {
  if (number == null) {
    return '';
  }

  let [integerPart, decimalPart] = number.toString().split('.');
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';

  return `${integerPart}.${decimalPart}`;
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
  //setErrorField(null);
};
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
     
      emp_ls1_pay_rate:filterResult && filterResult.emp_ls1_pay_rate ? formatNumber(filterResult.emp_ls1_pay_rate) :"",
      emp_ls1_charge_rate:filterResult && filterResult.emp_ls1_charge_rate ? formatNumber(filterResult.emp_ls1_charge_rate) : "",
      RowID: rowData && rowData.RowID
      ? rowData.RowID
      :""
    }))

    // set temp
    setTemp((pre)=>({
      ...pre,
     
      emp_ls1_pay_rate:filterResult && filterResult.emp_ls1_pay_rate ? filterResult.emp_ls1_pay_rate:"",
      emp_ls1_charge_rate:filterResult && filterResult.emp_ls1_charge_rate ? filterResult.emp_ls1_charge_rate:"",
      RowID: rowData && rowData.RowID
      ? rowData.RowID
      :""
    }))



    // supervisior Id
    setSelected_sId(filterResult && filterResult.emp_ls1_supervisor_id ? filterResult.emp_ls1_supervisor_id: "")

    setSelected_sId_temp(filterResult && filterResult.emp_ls1_supervisor_id ? filterResult.emp_ls1_supervisor_id: "")

    // craft
    setSelected_craft(filterResult && filterResult.emp_ls1_craft ? filterResult.emp_ls1_craft: "")

    setSelected_craft_temp(filterResult && filterResult.emp_ls1_craft ? filterResult.emp_ls1_craft: "")
    
 
  }else if(rowData){
 
    setData((pre)=>({
      ...pre,
      // emp_ls1_craft:rowData && rowData.emp_ls1_craft ? rowData.emp_ls1_craft:"",
      // emp_ls1_supervisor_id:rowData && rowData.emp_ls1_supervisor_id ? rowData.emp_ls1_supervisor_id:"",
      emp_ls1_pay_rate:rowData && rowData.emp_ls1_pay_rate ? rowData.emp_ls1_pay_rate:"",
      emp_ls1_charge_rate:rowData && rowData.emp_ls1_charge_rate ? rowData.emp_ls1_charge_rate:"",
    }))
    setSelected_sId(rowData.emp_ls1_supervisor_id)
    setSelected_sId_temp(rowData.emp_ls1_supervisor_id)

    // craft
    setSelected_craft(rowData.emp_ls1_craft)
    setSelected_craft_temp(rowData.emp_ls1_craft)

  }

},[rowData])





  const handleEditClick = (e) => {

    setTextField(e);
    setError("")
  };
  const handleCloseDefault = (e, result) => {
    if (result !== "backdropClick") {
      setTextField("");
      setDefaultModal(false);
    
    }
  };
  

  React.useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_emp_maintence_cf_label.php"
        );

        if (response.data.status === "SUCCESS") {
          setGroupLabel(response?.data?.user_group?.MandatoryField);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);

  const handleRequiredField = (body) => {
  
    
    const mandatory = groupLabel.filter(item => item.cf_label_required === "1");
   
    let missingFields = mandatory.find(item => !body.hasOwnProperty(item.column_name) || body[item.column_name] === null || body[item.column_name] === undefined || body[item.column_name] === '');
if(missingFields){


    if(missingFields.column_name === "emp_ls1_supervisor_id" ){
      if(selected_sId){
        missingFields =false
      }
    }
   
    if (missingFields) {
      const errorMessage = `Please fill the required field: ${missingFields.customize_label}`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setError(missingFields.column_name)
      return true;
    }
  }
  
    return false;
  };


  const handleSubmitForm = async () => {
   if (!selected_craft) {
    const errorMessage = `Please fill the required field: Craft`
    setSnackbarOpen(true);
    setSnackbarMessage(errorMessage);
    setSnackbarSeverity('error');
    setError("emp_ls1_craft")
    }
else{

  // const trimed_craft = selected_craft.replace(/ .*/, "").trim();
  const trimed_craft = selected_craft;
  const existingRecordIndex = MaintenceResult.findIndex(
    (item) => item.emp_ls1_craft === rowData.emp_ls1_craft,
  );


  const res = MaintenceResult.some((item,index)=>item.emp_ls1_craft
   === trimed_craft && index !== existingRecordIndex);
   if(res){
    let errorMessage = `Duplicate Data Found`;
  setSnackbarOpen(true);
  setSnackbarMessage(errorMessage);
  setSnackbarSeverity('error');
  setError("emp_ls1_craft")
  }
  else{




  const missingField = handleRequiredField(data)

  if(!missingField){
    // const trimed_sId = selected_sId.replace(/ .*/, "").trim();
    const trimed_sId = selected_sId;
 


     // Check if there is an existing record with the same condition
  const existingRecordIndex = MaintenceResult.findIndex(item => item.emp_ls1_craft === rowData.emp_ls1_craft)
  



  if (existingRecordIndex !== -1) {
    // Replace the existing record with the new data
    setMaintenceResult(prev => {
     
      
      // Clone the previous array
      const updatedResults = [...prev];
     
      // Update the specific record
      updatedResults[existingRecordIndex] = {
        ...updatedResults[existingRecordIndex],
        ...data,
        mst_RowID: rowData.mst_RowID,
        emp_ls1_craft:trimed_craft,
        emp_ls1_supervisor_id:trimed_sId
      };
      
      return updatedResults;
    });
  } else {
    // Add new data if no existing record found
    setMaintenceResult(prev => [...prev, data]);
  }


  handleClose(); 
}
}
}
  };
  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName
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
  const handleData = (e) => {
    const value = e.target.value;
      setData((pre) => ({
        ...pre,
        [e.target.name]: value,
      }));
    
  };
    // handleCancel
    const handleCancelClick = (name) => {
        // setModalDefault(false);
    
        setData((pre) => ({
          ...pre,
          [name]: "",
        }));
      };



      // handle text
const handleText=(e)=>{
  let value =  e.target.value;

  if (e.target.name === "emp_ls1_pay_rate") {
  
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
else if (e.target.name === "emp_ls1_charge_rate" ) {
  
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
     <MasterDialogMaintence
        setData={setData}
        handleClose={handleCloseDefault}
        open={DefaultModal}
        name={textField}
        preData ={MaintenceResult}
      /> 

    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", alignItems: "center", justifyContent:"space-between",padding: "8px 16px" }}
      >
          <div style={{display:"flex",alignItems:"center",gap:2}}>
          <Iconify icon="wpf:maintenance" style={{ marginRight: "4px",width:"22px",height:"22px" }}   />
          Update Maintenance
       </div>

       <div style={{cursor:"pointer"}} onClick={handleClose}>
        <IconButton color="error">
        <Iconify icon="system-uicons:cross-circle" />
        </IconButton>
        </div>

      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2,p:3 }} >
        <Grid container spacing={2} style={{boxShadow:"rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",borderRadius:"10px",padding:"20px"}} alignItems={"center"}>

                       {/* CRAFT */}
                       <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                          <Typography variant="subtitle2" style={{color:"red"}}>
                            {findCustomizeLabel("emp_ls1_craft") || "Craft"}
                          </Typography>
                          </Grid>

                          <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                              <Autocomplete
                                  options={craftDrp}
                                  value={selected_craft}
                              
                               sx={{width:"100%"}}
                                  onChange={(event, newValue) => {
                                   
                                    
                                if( newValue ){
                                  setSelected_craft(newValue.label)
                                 setError(false)
                                    }else{
                                  setSelected_craft("")
                                    }
                                    }}
                                   
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        fullWidth
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          error === "emp_ls1_craft" ? "errorEmpty" : ""
                                        }`}
                                      />
                                    </div>
                                  )}
                                />
                            </Grid>
                             


                         {/* Default Language */}
                         <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                          <Typography variant="subtitle2" 
                          className={
                            findCustomizerequiredLabel("emp_ls1_supervisor_id")
                              ? "red"
                              : ""
                          }
                          
                          >
                            {findCustomizeLabel("emp_ls1_supervisor_id") || "Supervisior ID"}
                          </Typography>
                          </Grid>

                          <Grid item xs={12} md={8} style={{ padding: "10px" }}>
                               <Autocomplete
                                  options={sIdDrp}
                                  value={selected_sId}
                              
                               sx={{width:"100%"}}
                                  onChange={(event, newValue) => {
                                   
                                    
                                if( newValue ){
                                  setSelected_sId(newValue.label)
                                 setError(false)
                                }else{
                                  setSelected_sId("")
                                }
                              }}
                                   
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        fullWidth
                                        placeholder="Select..."
                                        variant="outlined"
                                        className={`Extrasize ${
                                          error === "emp_ls1_supervisor_id" ? "errorEmpty" : ""
                                        }`}
                                      />
                                    </div>
                                  )}
                                />

                </Grid>
                         {/* pay rate charge*/}
                         <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                          <Typography variant="subtitle2"  className={
                            findCustomizerequiredLabel("emp_ls1_pay_rate")
                              ? "red"
                              : ""
                          }>
                            {findCustomizeLabel("emp_ls1_pay_rate") || "Pay Rate"}
                          </Typography>
                          </Grid>
                          <Grid
                                item
                                xs={12}
                                md={8}
                                style={{ padding: "10px" }}
                              >
                            <TextField
                              id="outlined-basic"
                              fullWidth
                              variant="outlined"
                              name="emp_ls1_pay_rate"
                              size="small"
                              type="text"
                              className={`Extrasize ${
                                error === "emp_ls1_pay_rate" ? "errorEmpty" : ""
                              }`}
                              placeholder=".000"
                              value={data.emp_ls1_pay_rate}
                              onChange={handleText}
                              inputProps={{style:{textAlign:"right"},
                 
                                 }}
                            
                            />
                    
                          </Grid>

                              {/*charge rate*/}
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >
                          <Typography variant="subtitle2" 
                          className={
                            findCustomizerequiredLabel("emp_ls1_charge_rate")
                              ? "red"
                              : ""
                          }
          
                          >
                            {findCustomizeLabel("emp_ls1_charge_rate") || "Charge Rate"}
                          </Typography>
                          </Grid>

                          <Grid
                                item
                                xs={12}
                                md={8}
                                style={{ padding: "10px" }}
                              >
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="emp_ls1_charge_rate"
                              size="small"
                              className={`Extrasize ${
                                error === "emp_ls1_charge_rate" ? "errorEmpty" : ""
                              }`}
                              fullWidth
                              onChange={handleText}
                              type="text"
                              placeholder=".000"
                              value={data.emp_ls1_charge_rate}
                              inputProps={{style:{textAlign:"right"},
                 
                            }}
                            
                            />
                        </Grid>
                         
          
        </Grid>
      </DialogContent>
      <Divider style={{ marginTop: "10px" }} />
      <DialogActions sx={{padding:"12px 16px"}}>
        <div
          className="buttons"
          style={{
            marginLeft: "auto",
            display: "flex",
            justifyContent: "end",
          }}
        >
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
        Update
          </Button>
          <Button
            variant="soft"
            color="error"
            startIcon={<Iconify icon="jam:close" />}
            onClick={(e, r) => {
           
              handleClose(e, r);
              setError("");
            }}
          >
            Close
          </Button>
        </div>
      </DialogActions>
     
    </Dialog>
    </>
  );
}
