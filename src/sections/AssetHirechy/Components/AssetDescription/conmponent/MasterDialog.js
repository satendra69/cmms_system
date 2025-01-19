import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import AssetChild from "./defult-settings-table";
import { Button, IconButton } from "@mui/material";
import Iconify from "src/components/iconify";

function MasterDialog({ setData, handleClose, open, name, handleUpdate, tableData }) {
  const fadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1,scale:1.1, transition: { duration: 0.7 }, },
  };

  // const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  //   "& .MuiDialogContent-root": {
  //     padding: theme.spacing(2),
  //   },
  //   "& .MuiDialogActions-root": {
  //     padding: theme.spacing(1),
  //   },
  // }));

  const [assetNo, setTotalAssetNo] = useState();

  const handleRowData2 = (dataLenth, dataa, dataSecond) => {
    if (dataLenth !== undefined && dataLenth !== null) {
      setTotalAssetNo(dataLenth);
    }
    if (dataSecond == "1") {
      handleUpdate(dataa);
      setData(dataa);
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
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
     
          <m.div variants={fadeAnimation} initial="initial" animate="animate">
       <Dialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              maxWidth="lg"
              fullWidth
              variants={fadeAnimation} initial="initial" animate="animate"
            >
              <DialogTitle
                sx={{ m: 0, p: 2 }}
                id="customized-dialog-title"
                className="dailogTitWork"
              >
                Child Asset
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
                  <AssetChild
                    data={tableData}
                    onRowClick={handleRowData2}
                    onChangePage={handleRowDataPagechg}
                    onSearchChange={handelRowSearch}
                  />
                </div>
              </DialogContent>
              <DialogActions
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {/* Add any footer content here */}
              </DialogActions>
            </Dialog>
          </m.div>
    
      </AnimatePresence>
    </LazyMotion>
  );
}

export default MasterDialog;

MasterDialog.propTypes = {
  setData: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string,
  handleUpdate: PropTypes.func.isRequired,
  tableData: PropTypes.array.isRequired,
};
