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
import { Bounce, ToastContainer, toast } from "react-toastify";
import UserFormEmp from "./UserFormEmp";
import { Icon } from "@iconify/react";

export default function UserDialog({
  open,
  handleClose,
  setDataEmp,
  setRefetch,
  tableData,
  RowID,
  setLId,
  emplId,
  empName
}) {

 
  const  handleSubmit = ()=>{
    handleClose()
    Swal.fire({
        icon: "success",
        title: "Sucess",
        text: `Created Successfully`,
        timer: 3000,
        customClass: {
          container: "swalcontainercustom",
        },
        customClass: 'my-swal-high-zindex'
      })
  }





  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    //   fullScreen 
    PaperProps={{
        sx: {
          width: '70vw',
          height: '95vh',
          maxWidth: 'none', 
          maxHeight: 'none', 
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}
      >
        <div style={{display:"flex",alignItems:"center",gap:2}}>
        <FaUserFriends size={26} />
        Create New User
 
        </div>
        <div style={{cursor:"pointer"}} onClick={handleClose}>
        <IconButton color="error">
        <Icon icon="system-uicons:cross-circle" />
        </IconButton>
        </div>
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ mt: 1 }}>
       <UserFormEmp emplId={emplId} empName={empName}  setLId={setLId} handleClose={handleClose} setDataEmp={setDataEmp} handleSubmit={handleSubmit} RowID={RowID} />
      </DialogContent>
      <Divider style={{ marginTop: "10px" }} />
      <ToastContainer />
    </Dialog>
  );
}
