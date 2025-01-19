import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { RxCrossCircled } from "react-icons/rx";
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
import { MdOutlineDescription, MdOutlineGroups } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Iconify from "src/components/iconify";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { TbAlignBoxBottomCenter } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import  PrDialogMaster from "./PrDialogMaster"
import { GiStoneCrafting } from "react-icons/gi";
import { template } from "lodash";


export default function PrSectionDialog({
  open,
  handleClose,
  setRefetch,
  setMaintenceResult

}) {
  let site_ID = localStorage.getItem("site_ID");
  let loginUser = localStorage.getItem("emp_mst_login_id");
  const [textField, setTextField] = React.useState("");
  const [DefaultModal, setDefaultModal] = React.useState(false);
  const [groupLabel, setGroupLabel] = React.useState([]);

  const [error, setError] = React.useState("");
  const [data, setData] = React.useState({
    cost_center:"",
    approval_limit:"",

  });


  const handleEditClick = (e) => {

    setTextField(e);
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
          "/get_usert_group_mandatoryfiled.php"
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
   if (!data.craft) {
      toast.error(`Please fill the required field: Craft`, {
        position: "top-center",
        autoClose: 3000,
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
    }else {
        setMaintenceResult((prev) => [...prev,data]);
        setData([]);
        handleClose()
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
const handleText=(e)=>{
    setData((pre)=>({
        ...pre,
        [e.target.name]:e.target.value
    }))

}



  return (
    <>
     <PrDialogMaster
        setData={setData}
        handleClose={handleCloseDefault}
        open={DefaultModal}
        name={textField}
      /> 
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", alignItems: "center", gap: 3 }}
      >
    <GiStoneCrafting  />
       Add New
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 2,p:3 }} >
        <Grid container spacing={2} >
       


          {/* Default Site Code */}
          <Grid item xs={12} >
                          <Typography variant="subtitle2">
                            {findCustomizeLabel("emp_mst_status") || "Cost Center"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              variant="outlined"
                              name="cost_center"
                              size="small"
                             
                              fullWidth
                            
                              placeholder="Select..."
                              value={data.cost_center}
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
                                      onClick={() => handleCancelClick("cost_center")}
                                    />

                                    <Iconify
                                      icon="tabler:edit"
                                      onClick={() => handleEditClick("cost_center")}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ),
                              }}
                            />
                          </div>
                          </Grid>
    

                         {/*approval Limit*/}
                          <Grid item xs={12} md={12}>
                          <Typography variant="subtitle2" >
                            {findCustomizeLabel("approval_limit") || "Approval Limit"}
                          </Typography>
                          <div>
                            <TextField
                              id="outlined-basic"
                              fullWidth
                              variant="outlined"
                              name="approval_limit"
                              size="small"
                              type="number"
                              placeholder=".000"
                              value={data.approval_limit}
                              onChange={handleText}
                            
                            />
                          </div>
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
      <ToastContainer />
    </Dialog>
    </>
  );
}
