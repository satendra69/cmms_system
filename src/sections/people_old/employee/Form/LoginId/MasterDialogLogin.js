import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

// Dialog Action
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DefaultSiteCodeTable from "./DefaultSiteCodeTable"
import DefaultLanguageTable from "./DefaultLanguageTable"
import DefaultTemplateTabel from "./DefaultTemplateTabel"
import { Button, IconButton } from "@mui/material";
import Iconify from "src/components/iconify";


function MasterDialogLogin({ setData, handleClose, open, name }) {
 
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
        > 
          {name==="default_site"?"Select Site Code":null}
          {name==="template"?"Select Template":null}
          {name==="default_language"?"Select Language":null}
          
      
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


            
            {name === "default_site" ? (
              <DefaultSiteCodeTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
              />
            ) : null}

            {name === "default_language" ? (
              <DefaultLanguageTable
                onRowClick={handleRowData2}
                onChangePage={handleRowDataPagechg}
                onSearchChange={handelRowSearch}
              />
            ) : null}
              

              {name === "template" ? (
              <DefaultTemplateTabel
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

export default MasterDialogLogin;

MasterDialogLogin.propTypes = {
  data: PropTypes.object,
  title: PropTypes.string,
};
