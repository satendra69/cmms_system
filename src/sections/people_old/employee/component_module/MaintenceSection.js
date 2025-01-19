import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Iconify from "src/components/iconify";
import { MdDeleteOutline } from "react-icons/md";

import MenuItem from "@mui/material/MenuItem";
import httpCommon from "src/http-common";
import MaintenceSectionDialog from "./MaintenceSectionDialog";
import MaintenceSectionDialogUpdate from "./MaintenceSectionDialogUpdate";
import { ToastContainer } from "react-toastify";

const MaintenceSection = ({
  onRowClick,
  data,
  setData,
  MaintenceResult,
  setMaintenceResult,
  RowIDProp,
  state,
  error2,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity
}) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
  const popover = usePopover();
 
  // const [MaintenceResult, setMaintenceResult] = React.useState([]);
  const [textField, setTextField] = useState("");
  const [show, setShow] = useState(false);

  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const [Description, setDescription] = useState("");

 
  const [deleted,setDeleted] = useState(false)
  const [dialog, setDialog] = useState(false);
  const [dialog1, setDialog1] = useState(false);

  const [DefaultModal, setModalDefault] = useState(false);

  const location = useLocation();

  const [RowID, setRowID] = useState("");
   const [rowData, setRowData] = useState({});
  
  const [modalRowDt, setmodalRowDt] = useState("");
  const [groupLabel,setGroupLabel] = useState([])

  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName,
    );
    return matchingColumn ? matchingColumn.default_header : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.some(
      (item) =>
        item.column_name === columnName && item.cf_label_required === "1",
    );

    return foundItem;
  };


// fetch label
React.useEffect(() => {
  const fetchLabel = async () => {
    try {
      const response = await httpCommon.get(
        "/get_emp_maintence_cf_label.php",
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

 
  const handleEdit =(item)=>{
            
              setDialog1(!dialog1);
              popover.onClose();
  }



  const handleDelete = async (row) => {
    popover.onClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        if(rowData && rowData.RowID){

     
        try {
          const response = await httpCommon.post(
            "/delete_emp_maintence.php",
            {
              site_cd: site_ID,
              row_id: rowData.RowID,
            }
          );

          if (response.data.status === "SUCCESS") {
            setDeleted(true)
            Swal.fire({
              title: "Sucess",
              text: "Record Deleted Successfully ",
              icon: "success",
              timer: 2000,
            }).then(

              // () => setRefetch(true)

            );

            popover.onClose();
          }
        } catch (error) {
          console.log("error", error);
        }
      }

        setMaintenceResult((prev) => prev.filter((item) => item !== row));
        setDeleted(true)

      }
    });
  };




  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      textAlign: "center",
    };
    return (
      <>
        
        <TableCell key="select">Action</TableCell>
        <TableCell key="select" style={{color:"red"}}>
       {findCustomizeLabel("emp_ls1_craft")}
      
          
          </TableCell>
        <TableCell key="select" style={{color:findCustomizerequiredLabel("emp_ls1_supervisor_id")?"red":""}}>
        {findCustomizeLabel("emp_ls1_supervisor_id")}
        
          </TableCell>
        <TableCell key="select" style={{color:findCustomizerequiredLabel("emp_ls1_pay_rate")?"red":""}}>
        {findCustomizeLabel("emp_ls1_pay_rate")}
    
          </TableCell>
        <TableCell key="select" style={{color:findCustomizerequiredLabel("emp_ls1_charge_rate")?"red":""}}>
        {findCustomizeLabel("emp_ls1_charge_rate")}
         
          </TableCell>
      </>
    );
  };

  //Table rows
  const renderTableRows = () => {

if(MaintenceResult && MaintenceResult.length >0 ){
  return  MaintenceResult.map((item) => (
    <>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
       
        <MenuItem
          onClick={() => {
            handleEdit(item)
            
          }}
         
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete(item);
          }}
    
        >
          <MdDeleteOutline size={24} />
          Delete
        </MenuItem>
      </CustomPopover>
      <TableRow>
        <TableCell>
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={(event)=>{
               popover.onOpen(event)
               setRowData(item)
              
              }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>{item.emp_ls1_craft}</TableCell>
        <TableCell>{item.emp_ls1_supervisor_id}</TableCell>
        <TableCell>{item.emp_ls1_pay_rate}</TableCell>
        <TableCell>{item.emp_ls1_charge_rate}</TableCell>
      </TableRow>
    </>
  ));
}

  };



  // Add New Row button click
  const [inputFields, setInputFields] = useState([
    {
      site_ID: site_ID,
      mst_RowID: RowID,
      emp_mst_login_id: emp_mst_login_id,
      selectStock: "",
      setDescription: "",
      setPartNo: "",
      setTotalOh: "",
      setQtyNeeded: "",
    },
  ]);
 
  const removeInputFields = (index) => {
    const rows = [...inputFields];
    if (index !== undefined) {
      rows.splice(index, 1);
    } else {
      rows.splice(1, rows.length);
    }

    setInputFields(rows);
  };
  const handleClose = () => {
    setShow(false);
  
    removeInputFields();
  };
  // Clear State data
  const updatedInputFields = inputFields.map((field) => {
    return {
      ...field,
      selectStock: "",
      setDescription: "",
      setPartNo: "",
      setQtyNeeded: "",
      setTotalOh: "",
    };
  });
  const handleCancelClick = (name) => {
    setModalDefault(false);
    setData((pre) => ({
      ...pre,
      [name]: "",
    }));
  };

  const handleEditClick = (e) => {
    setModalDefault(!DefaultModal);
    setTextField(e);
  };



  const handleClick = (e, result) => {
    if (result !== "backdropClick") {
      setDialog(!dialog);
    }
  };

  // update Dialog
  const handleClick2 = (e, result) => {
    if (result !== "backdropClick") {
      setDialog1(!dialog1);
    }
  };

  return (
    <>
       <ToastContainer />
      <div style={{ width: "100%", backgroundColor: "white" }} className="w001">
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            width: "100%",
          }}
          className="CustomBreadAssetSave MuiBox-root mom"
        >
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center",marginTop:"10px" }}
          >
            <div style={{height:"100%",width:"100%",display:"flex",alignItems:"center",gap:2}}>
              <Iconify icon="wpf:maintenance" style={{ marginRight: "4px",width:"26px",height:"26px" }}   />
              <Typography style={{ marginRight: "10px", fontWeight: "bold"}}>
                Maintenance
              </Typography>
            </div>
           
           
          </div>
        </div>

        {/* Table start here */}
        {/* <ToastContainer /> */}
        <div className="table-responsive" >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>{renderTableHeader()}</TableRow>
              </TableHead>
              <TableBody>{renderTableRows()}</TableBody>
           
            </Table>
      
          </TableContainer>
      
        </div>

          

        {/* Create Dialog*/}
        <MaintenceSectionDialog
          open={dialog}
          handleClose={handleClick}
          setMaintenceResult={setMaintenceResult}
          MaintenceResult={MaintenceResult}
          error2={error2}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarSeverity={setSnackbarSeverity}
          deleted={deleted}
          setDeleted={setDeleted}
        />

        {/* Update Dialog */}
        <MaintenceSectionDialogUpdate
          open={dialog1}
          handleClose={handleClick2}
          setMaintenceResult={setMaintenceResult}
          RowIDProp={RowIDProp}
          state={state}
          MaintenceResult={MaintenceResult}
          rowData={rowData}
          error2={error2}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarSeverity={setSnackbarSeverity}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop:"20px"
          }}
        >
          <Button
            type="button"
            className="tabAddButton"
            onClick={() => {
              setDialog(true);

            }}
          >
            + Add New
          </Button>
        </div>
      </div>

      {/*  Row Click to open model popup */}
    
    </>
  );
};

export default MaintenceSection;
