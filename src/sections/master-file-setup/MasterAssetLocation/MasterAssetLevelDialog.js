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

function UserGroupDialog({ open, handleClose, rowData, setRefetch }) {
  const [groupLabel, setGroupLabel] = React.useState([]);
  let site_ID = localStorage.getItem("site_ID");
  const [error, setError] = React.useState(false);
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [data, setData] = React.useState(
    rowData && rowData.ast_lvl_desc ? rowData.ast_lvl_desc : ""
  );
  const [checkData, setCheckData] = React.useState(
    rowData && rowData.ast_lvl_disable_flag ? Number(rowData.ast_lvl_disable_flag) : 0
  );
  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
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
    if (!data) {
    
        setError(true);
        handleErrorToast("Description")
        return;
      
    }


    const body = {
      site_cd : site_ID,
      ast_lvl_disable_flag: checkData ? 1 : 0,
      ast_lvl_desc: data,
      ast_lvl_ast_lvl: rowData.ast_lvl_ast_lvl,
      audit_user:loginUser,
      RowID: rowData.RowID,
    };


    const missingFields = handleRequiredField(body);


    if(!missingFields){

    try {

      const response = await httpCommon.post(
        `/update_master_asset_level.php`,
        body
      );
      console.log("response_up",response)

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
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
     
      
         
          <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", gap: 5, alignItems: "center" }}
      >
        <BsCassette size={24}/>
        Asset Level
      </DialogTitle>

 
      <Divider />
      <DialogContent sx={{ mt: 3 }}>
        <Grid container spacing={2}>
       
          <Grid item xs={12} md={12}>
            <Stack spacing={1}  >
              <Typography variant="subtitle2">
              {findCustomizeLabel("ast_lvl_ast_lvl") || "loading..."}
              </Typography>
              <div>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  name="ast_lvl_ast_lvl"
                  size="small"
                  disabled
                  value={
                    rowData && rowData.ast_lvl_ast_lvl
                      ? rowData.ast_lvl_ast_lvl
                      : ""
                  }
                  fullWidth
                  placeholder=""
                />
              </div>
            </Stack>
          </Grid>
          {/* desc */}
          <Grid item xs={12} md={12}>
            <Stack spacing={1}>
              <Typography
                variant="subtitle2"
                style={{ color: error ? "red" : "black" }}
              >
                {findCustomizeLabel("ast_lvl_desc") || "loading..."}
              </Typography>
              <div>
                <TextareaAutosize
                  aria-label="empty textarea"
                  placeholder=""
                  minRows={6.5}
                  name="ast_lvl_desc"
                  value={data}
                  onChange={(e) => {
                    setError(false);
                    setData(e.target.value);
                  }}
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
                  <Checkbox onChange={(e) => setCheckData(e.target.checked)} />
                }
                label={findCustomizeLabel("ast_lvl_disable_flag") || "loading..."}
                checked={checkData}
                sx={{ mt: 1 }}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider style={{ marginTop: "10px" }} />
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
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}

export default UserGroupDialog;
