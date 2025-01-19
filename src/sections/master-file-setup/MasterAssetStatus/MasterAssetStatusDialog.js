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

import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { BsCassette } from "react-icons/bs"
import MasterDialog from "./component/MasterDialog";

function MasterAssetStatusDialog({ open, handleClose, rowData, setRefetch }) {
  const [groupLabel, setGroupLabel] = React.useState([]);
  let site_ID = localStorage.getItem("site_ID");
  const [error, setError] = React.useState(false);
  const [modalDefault, setModalDefault] = React.useState(false);
  let loginUser = localStorage.getItem("emp_mst_login_id");
  
  const [data, setData] = React.useState({
    ast_sts_typ_cd:rowData && rowData.ast_sts_typ_cd ? rowData.ast_sts_typ_cd :"" ,
    ast_sts_status:rowData && rowData.ast_sts_status ? rowData.ast_sts_status : "",
    ast_sts_desc :rowData && rowData.ast_sts_desc?rowData.ast_sts_desc
:"",
  });
  const [textField, setTextField] = React.useState("");

  const [checkData,setCheckData] = React.useState({
    ast_sts_count_dwn_time: rowData && rowData.ast_sts_count_dwn_time?Number(rowData.ast_sts_count_dwn_time):0,
    ast_sts_disable_flag: rowData && rowData.ast_sts_disable_flag?Number(rowData.ast_sts_disable_flag):0,
  })

  console.log("checkedData",checkData)



 

  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };


  // required label text
  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.some(
      (item) => item.column_name === columnName && item.cf_label_required === "1"
    );
    
    return foundItem;
  
  };



  const handleCloseTabel =()=>{
    setModalDefault(false);
    setTextField("")
  }


  const handleData = (e) => {
    const value = e.target.value;
    


    
      setError("");
      setData((pre) => ({
        ...pre,
        [e.target.name]: value,
      }));

  };


  // handleRequired Field
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



  React.useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_asset_status_mandatoryfiled.php"
        );
 
      
          setGroupLabel(response.data.asset_sts
            .MandatoryField);
   
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);
  
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
    if (!data.ast_sts_desc) {
    
        setError(true);
        handleErrorToast("Description")
        return;
      
    }

    const body = {
      ast_sts_disable_flag: checkData.ast_sts_disable_flag ? 1 : 0,
      ast_sts_count_dwn_time:checkData.ast_sts_count_dwn_time ? 1 :0,
      ast_sts_desc: data.ast_sts_desc,
      ast_sts_typ_cd: data.ast_sts_typ_cd,
      ast_sts_status: data.ast_sts_status,
      site_cd: site_ID,
      audit_user: loginUser,
      RowID:rowData.RowID
      
    };
console.log("body",body)


    const missingFields = handleRequiredField(body);


    if(!missingFields){

    try {

      const response = await httpCommon.post(
        `/update_new_master_asset_status.php`,
        body
      );

       
     

      if (response.data.status == "SUCCESS") {
        handleClose();
        Swal.fire({
          title: "Success",
          text: "Updated Successfully",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000,
        }).then(() => setRefetch(true));
      }
    } catch (error) {
      console.log(error);
    }
  }
  };
  return (
    <>
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
        Asset Status
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2 }} >
        
        <Grid container spacing={2} style={{padding:2}}>
         
          <Grid item xs={12} md={12}>
           {/* Status Type */}
        <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("dft_mst_mat_act")}
            style={{color:"red"}}
          >
            {findCustomizeLabel("ast_sts_typ_cd") || "loading..."}
  
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="ast_sts_typ_cd"
              fullWidth
              value={data ? data.ast_sts_typ_cd : ""}
              placeholder="Select..."
              disabled
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
                      // onClick={() => handleCancelClick("ast_sts_typ_cd")}
                      style={{ cursor: "pointer" }}
                    />

                    <Iconify
                      icon="tabler:edit"
                      // onClick={() => handleEditClick("ast_sts_typ_cd")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ),
              }}
            />
          </div>
        </Stack>
        </Grid>


              {/* status */}
          <Grid item xs={12} md={12}>    
          <Stack spacing={1} sx={{ pb: 1.5 }}>
          <Typography
            variant="subtitle2"
            // className={findCustomizerequiredLabel("dft_mst_mat_act")}
            style={{color:"red"}}
          >
            {findCustomizeLabel("ast_sts_status") || "loading..."}
       
          </Typography>
          <div
          // ref={assetNoAutocompleteRef}
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              size="small"
              name="ast_sts_status"
              fullWidth
              disabled
              value={data ? data.ast_sts_status : ""}
              onChange={handleData}
            />
          </div>
        </Stack>
          </Grid>



          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {findCustomizeLabel("ast_sts_desc") || "loading..."}
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  name="ast_sts_desc"
                  minRows={6.5}
                 
                  value={data.ast_sts_desc}
                  onChange={handleData}
                  className={`TxtAra  ${error?"errorEmpty":""}`}
                  style={{ borderColor: "1px soild gray", width: "100%" }}
                />
              </div>
            </Stack>
          </Grid>


          {/* count down time */}
            <Grid item xs={12} md={12} mt={-2} mb={1}>
              <div style={{width:"30%"}}>
              <Stack spacing={1}>
                <Typography style={{ fontSize: "14px", fontWeight: "600",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                className={findCustomizerequiredLabel("ast_sts_count_dwn_time")?"red":""}
                >
                  {findCustomizeLabel("ast_sts_count_dwn_time") || "loading..."}
                  <Checkbox
                    onChange={(e) => setCheckData((pre)=>(
                      { ...pre,ast_sts_count_dwn_time:e.target.checked}
                    
                    ))}
                   checked={checkData.ast_sts_count_dwn_time}
               
                  />
                </Typography>
              </Stack>

              {/* count disable */}
              <Stack spacing={1}>
                <Typography style={{ fontSize: "14px", fontWeight: "600",display:"flex",alignItems:"center",justifyContent:"space-between" }}
                   className={findCustomizerequiredLabel("ast_sts_disable_flag")?"red":""}
                >
                  
                  {findCustomizeLabel("ast_sts_disable_flag") || "loading..."}

                  <Checkbox
                   onChange={(e) => setCheckData((pre)=>(
                    { ...pre,ast_sts_disable_flag:e.target.checked}
                  
                  ))}
                  
                    checked={checkData.ast_sts_disable_flag}
                
                  />
                </Typography>
              </Stack>
              </div>
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
            }}
          >
            Close
          </Button>
        </div>
      </DialogActions>
      <ToastContainer />
      <MasterDialog
        setData={setData}
        handleClose={handleCloseTabel}
        open={modalDefault}
        name={textField}
      />
    </Dialog>
    </>
  );

}

export default MasterAssetStatusDialog;
