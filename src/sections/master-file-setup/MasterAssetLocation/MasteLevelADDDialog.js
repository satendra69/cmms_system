import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
  
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { BsCassette } from "react-icons/bs"

export default function MasteLevelADDDialog({
  open,
  handleClose,
  setRefetch,
  tableData,
}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [groupLabel, setGroupLabel] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [diableToggle,setDisableToggle]=React.useState(false)
  const [data, setData] = React.useState({
    ast_loc_ast_loc:"",
    ast_loc_desc: "",
    ast_loc_desc: "",
    ast_loc_wr_prefix:"",
    ast_loc_wr_counter:"",
    ast_loc_wo_prefix:"",
    ast_loc_wo_counter :"",
    ast_loc_pm_prefix:"",
    ast_loc_pm_counter:""
    

  });

  const [checkData, setCheckData] = React.useState({
    ast_loc_wr_option:0,
    ast_loc_wo_option:0,
    ast_loc_pm_option:0,
    ast_loc_disable_flag:0

  });

  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_asset_level_mandatoryfilled.php"
        );
       

        if (response.data.status === "SUCCESS") {
          setGroupLabel(response.data.asset_lvl.MandatoryField);
         
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);


  const handleRequiredField = (body) => {
    
    const mandatoryFields = groupLabel.filter(item => item.cf_label_required === "1");
    
    const missingFields = mandatoryFields.find(item => !body.hasOwnProperty(item.column_name) || body[item.column_name] === null || body[item.column_name] === undefined || body[item.column_name] === '');

    
    if (missingFields) {
      toast.error(`Please fill the required field: ${missingFields.customize_label
      }`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      })
      return true;
    }
  
    return false;
  };

const handleErrorToast =(msg)=>{
  toast.error(`Please fill the required field: ${msg}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    style: {
      width: "400px",
    },
  })
}


  const handleSubmitForm = async () => {
    if (error) {
      toast.error(`Duplicate Data Found in the Database`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
    } else if (!data.ast_lvl_ast_lvl) {
      handleErrorToast("Asset Level")
    } else if (!data.ast_lvl_desc) {
      handleErrorToast("Description")
    } else {
      const body = {
        ast_lvl_disable_flag: checkData ? 1 : 0,
        ast_lvl_desc: data.ast_lvl_desc,
        ast_lvl_ast_lvl: data.ast_lvl_ast_lvl,
        site_cd: site_ID,
        audit_user: loginUser,
      };

     const missingField = handleRequiredField(body)
     

     if(!missingField){
      try {
       
        const response = await httpCommon.post(
          `/insert_master_asset_locaton.php`,
          body
        );

          
        

        if (response.data.status == "SUCCESS") {
          handleClose();
          Swal.fire({
            title: "Success",
            text: "New Record Created",
            icon: "success",
            confirmButtonText: "OK",
            timer: 2000,
          }).then(() => {
            setData("");
            setRefetch(true);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    }
  };

  const useStyles = makeStyles({
    dialogCard: {
      boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 12px',
    },
  });
  
  console.log("GroupLabel",groupLabel)
  // customize label
  
  const findCustomizeLabel = (columnName) => {
    if(groupLabel){
      const matchingColumn = groupLabel.find(
        (item) => item.column_name === columnName
      );
      return matchingColumn ? matchingColumn.customize_label : "";
    }
  
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

  const handleError = ()=>{
    if(error){
      toast.error(`Duplicate Data Found in the Database`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "400px",
        },
      });
      setDisableToggle(true)
    }
    else return
  }




  const handleData = (e) => {
    const value = e.target.value;
  console.log("name",e.target.name)

    if (e.target.name == "ast_lvl_ast_lvl") {
      if (value.length < 50) {
        const res = tableData.find(
          (item) => item.ast_lvl_ast_lvl === value.toUpperCase()
        );
 
        if (res) {
          setError(true);
        } 
        else {
          setDisableToggle(false)
          setError(false);
        }
        setData((pre) => ({
          ...pre,
          [e.target.name]: value.toUpperCase(),
        }));
      }
    } else {
      
      setData((pre) => ({
        ...pre,
        [e.target.name]: value,
      }));
    }
  };


  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // className="shadow90"
      // classes={{ paper: classes.dialogCard }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", gap: 5, alignItems: "center" }}
      >
        <BsCassette size={24}/>
        Asset Location
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }} >
        
        <Grid container spacing={2} style={{padding:2}}>
         
          <Grid item xs={12} md={12}>
            <Stack spacing={1} >
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {findCustomizeLabel("ast_lvl_ast_lvl") || "loading..."}
               
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="ast_lvl_ast_lvl"
                  size="small"
             
                  value={data.ast_lvl_ast_lvl}
                  onChange={handleData}
                  fullWidth
                  inputProps={{maxLength:50}}
                />
              </div>
              {/* {error && (
                <p
                  style={{
                    color: "red",
                    marginTop: "-5px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </p>
              )} */}
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {findCustomizeLabel("ast_lvl_desc") || "loading..."}
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  name="ast_lvl_desc"
                  minRows={6.5}
                  disabled={diableToggle ? true : false}
                  onClick={handleError}
                  value={data.ast_lvl_desc}
                  onChange={handleData}
                  className="TxtAra"
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} mt={-2}>
            <Stack spacing={1} sx={{ pb: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox onChange={(e) => setCheckData(e.target.checked)} 
                  
                  disabled={diableToggle ? true : false}
                  onClick={handleError}
                  />
                }
                label={findCustomizeLabel("ast_lvl_disable_flag") || "loading..."}
                checked={checkData}
                sx={{ mt: 1 }}
                // onChange={handleCheckboxChange}
              />
            </Stack>
          </Grid>
        </Grid>
    
      </DialogContent>
      <Divider />
      <DialogActions>
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
            Save
          </Button>
          <Button
            variant="soft"
            color="error"
            startIcon={<Iconify icon="jam:close" />}
            onClick={(e, r) => {
              setData("");
              setError("");
              handleClose(e, r);
              setDisableToggle(false)
            }}
          >
            Close
          </Button>
        </div>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}
