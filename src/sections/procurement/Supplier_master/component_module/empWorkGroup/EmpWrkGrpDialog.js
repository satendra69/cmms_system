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
import { Bounce,toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";

import { GiStoneCrafting } from "react-icons/gi";
import { template } from "lodash";
import { Icon } from "@iconify/react";


export default function EmpWrkGrpDialog({
  open,
  handleClose,
  setRefetch,
  setMaintenceResult,
  MaintenceResult,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
  deleted,
  setDeleted

}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [buttonSub,setButtonSub]=React.useState("Add")

  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    emp_ls5_work_group:"",
  });
  
  const [workGrpDrp,setWorkGrpDrp]=React.useState([])
  const [selectedWorkGrp,setSelectedWorkGrp] = React.useState("")



  React.useEffect(() => {
    if (textField) {
      setDefaultModal(true);
    }
  }, [textField]);

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_emp_wrk_maintence.php"
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


 

  const handleSubmitForm = async () => {
   if (!selectedWorkGrp) {
    
    const errorMessage = `Please fill the required field: Work Group`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setError(true)

    }else{
      
      const trimedgrp = selectedWorkGrp;
      const res = MaintenceResult.some((item)=>item.emp_ls5_work_group === trimedgrp)
    
      if(res){

      const errorMessage = `Duplicate Data Found`;
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setError("emp_ls3_costcenter");
 }
else{
      // const trmmedData = selectedWorkGrp.replace(/ .*/, "").trim();
      const trmmedData = selectedWorkGrp;
        setMaintenceResult((prev) => [...prev,{emp_ls5_work_group:trmmedData}]);
        setData([]);
        handleClose()
        setSelectedWorkGrp("")
        
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
    const foundItem = groupLabel.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return foundItem.cf_label_required;
    }
    return "";
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
    setData((pre)=>({
        ...pre,
        [e.target.name]:e.target.value
    }))

}

// fetWorkGroup
const fetchWorkGroup = async () => {
  try {
    const response =  await httpCommon.get("/get_emp_work_group.php?site_cd=" + site_ID)

    if (response.data) {
      const data = response.data.emp_work_group;
      
      // Format the data to { label, value }
      const formattedStatus = data.map(item => ({
        label: `${item.wrk_grp_grp_cd} : ${item.wrk_grp_desc}`,
        value: `${item.wrk_grp_desc} : ${item.usr_grp_desc}` 
      }));

     
      setWorkGrpDrp(formattedStatus); 
    }
  } catch (error) {
    console.error("Error fetching employee status:", error);
  }
}

React.useEffect(()=>{
  fetchWorkGroup();
},[])



  return (
    <>
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
                  <Iconify
                        icon="clarity:employee-group-solid"
                        style={{ marginRight: "4px",width:"24px",height:"24px" }}
                      />
      Add Work Group
      </div>

      <div style={{cursor:"pointer"}} onClick={handleClose}>
        <IconButton color="error">
        <Icon icon="system-uicons:cross-circle" />
        </IconButton>
        </div>
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 3, p: 2  }} >
        <Grid container spacing={2} alignItems={"center"} >


                    
                              <Grid
                                item
                                xs={12}
                                md={4}
                                style={{ padding: "10px" }}
                              >

                   
                          <Typography variant="subtitle2" style={{color:"red"}}>
                            {findCustomizeLabel("emp_ls5_work_group") || "Work Group"}
                          </Typography>
                          </Grid>
                          <Grid
                                item
                                xs={12}
                                md={8}
                                style={{ padding: "10px" }}
                              >
                                <Autocomplete
                                  options={workGrpDrp}
                                  value={selectedWorkGrp}
                              
                               sx={{width:"240px"}}
                                  onChange={(event, newValue) => {
                                   
                                    
                                if( newValue ){
                                  setSelectedWorkGrp(newValue.label)
                                 setError(false)
                                }else{
                                  setSelectedWorkGrp("")
                                }
                              }}
                                   
                                  renderInput={(params) => (
                                    <div>
                                      <TextField
                                        {...params}
                                        size="small"
                                        fullWidth
                                        placeholder="Select.."
                                        variant="outlined"
                                        className={`Extrasize ${error ? "errorEmpty" : ""}`}
                                      />
                                    </div>
                                  )}
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
        Add
          </Button>
          <Button
            variant="soft"
            color="error"
            startIcon={<Iconify icon="jam:close" />}
            onClick={(e, r) => {
              setData("");
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
