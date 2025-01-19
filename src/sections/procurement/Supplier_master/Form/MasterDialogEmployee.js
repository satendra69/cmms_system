import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

// Dialog Action
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { Button, IconButton } from "@mui/material";
import Iconify from "src/components/iconify";
import EmployeStatusTable from "./EmployeStatusTable"
import EmpUserGroupTable from "./userGroup/EmpUserGroupTable"
import EmployeLoginIdTable from "./EmployeLoginIdTable"
import PrimaryCraftTable from "./primaryCraft/PrimaryCraftTable"
import WorkAreaTable from "./workArea/WorkAreaTable"
import WorkGroupTable from "./workGroup/WorkGroupTable"
import SupervisiorTable from "./supervisiorId/SupervisiorTable"

function MasterDialogEmployee({ setData, handleClose, open, name }) {
 
  const [viewedTotlRows, setViewedTotlRows] = useState(0);
  const [TotalSearch, setTotalSearch] = useState("");
  const [rowData, setRowData] = useState([]);
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  const [assetNo, setTotalAssetNo] = useState();
  const [PermanentIDFlag, setPermanentIDFlag] = useState();


  const handleRowData2 = (dataLenth, dataa, dataSecond) => {
    console.log("Dataaa",dataa)
   
    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    if (dataSecond == "1") {
      setData((pre) => ({
        ...pre,
        [name]: dataa,
      }));
      handleClose();
    }
  };

  const handleRowDataPagechg = (pageCount) => {
    // setViewedTotlRows(pageCount);
  };
  const handelRowSearch = (searchTotl) => {
    // setTotalSearch(searchTotl);
  };

  return (
    <div>
      {/* Asset Parent Flag model popup */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          className="dailogTitWork"
        > {name==="emp_mst_status"?"Select Status":null}
          {name==="emp_mst_login_id"?"Select Login Id":null}
          {name==="emp_mst_usr_grp"?"Select User Group":null}
          {name==="emp_det_craft"?"Select Primary Craft":null}
          {name==="emp_det_work_grp"?"Select User Group":null}
          {name==="emp_det_supervisor_id"?"Supervisior Id":null}
          {name==="emp_det_work_area"?"Work Area":null}
      
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
        <DialogContent dividers>



          <div className="TblSelect">
            {name === "emp_mst_status" ? (
              <EmployeStatusTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
               
              />
            ) : null}
              {name === "emp_mst_login_id" ? (
              <EmployeLoginIdTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
           
              />
            ) : null}

{name === "emp_mst_usr_grp" ? (
              <EmpUserGroupTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
            
              />
            ) : null}

{name === "emp_det_craft" ? (
              <PrimaryCraftTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
               
              />
            ) : null}

        {name === "emp_det_work_area" ? (
              <WorkAreaTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
             
              />
            ) : null}

          {name === "emp_det_work_grp" ? (
              <WorkGroupTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
              
              />
            ) : null}


            {name === "emp_det_supervisor_id" ? (
              <SupervisiorTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
              
              />
            ) : null}



         
          </div>
        </DialogContent>

        {/* Footer Dialog */}
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >

        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default MasterDialogEmployee;

MasterDialogEmployee.propTypes = {
  data: PropTypes.object,
  title: PropTypes.string,
};
