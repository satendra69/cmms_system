import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, styled } from '@mui/material';
import React from 'react'
import { ThreeCircles } from 'react-loader-spinner';
import Iconify from 'src/components/iconify';

  
function SupplierPromt({handleClosePromt,showPromt,rowsDropdownPrompt,isLoading,handleInputValueChangePrompt,handleDropDownPromptSaveAsBtn}) {

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
          padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
          padding: theme.spacing(1),
        },
      }));

      const allRowsEmpty = rowsDropdownPrompt.every(
        (row) => !row.selectedOption && !row.operator && !row.valuept
      );

  return (
    <div>    
    <Dialog
    onClose={handleClosePromt}
    aria-labelledby="customized-dialog-title"
    open={showPromt}
    maxWidth="md"
    fullWidth
    disableBackdropClick={true} 
    disableEscapeKeyDown={true}
  >
    <DialogTitle
      sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
      id="customized-dialog-title"
      className="dailogTitWork"
    >
      <Iconify icon="material-symbols-light:file-save-sharp" />
      <span style={{ marginLeft: "2px" }}>Query Prompter</span>
    </DialogTitle>
    <IconButton
      aria-label="close"
      onClick={() => handleClosePromt()}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
        padding:"0px !important",
        margin:"5px !important"
       // color: (theme) => theme.palette.grey[500],
      }}
    >
     <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
    </IconButton>
    <DialogContent dividers style={{margin:"10px 0px 0px",paddingBottom:"10px"}}>
      <div className="astSubpopup">
        <fieldset className="Subpopup-fieldset">
          <legend>Please Fill In The Value</legend>
    
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
               
                <th>Column</th>
                <th>Operator</th>
                <th>Value</th>
                <th>Logical</th>
            
              </tr>
            </thead>
            <tbody>
             {allRowsEmpty ? (
                    <tr>
                    <td colSpan="4" style={{ textAlign: "center"}}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          
                        }}
                      >
                        <ThreeCircles
                          width="80"
                          color="#4fa94d"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                          ariaLabel="three-circles-rotating"
                          outerCircleColor=""
                          innerCircleColor=""
                          middleCircleColor=""
                        />
                      </div>
                    </td>
                  </tr>
                  
                  ) : (
              rowsDropdownPrompt.map((row, index) => {
                const isRowEmpty = !row.selectedOption && !row.operator && !row.valuept;
                return !isRowEmpty ? (
                <tr key={index}>
                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%" }}
                      disabled
                      value={row.Column|| ""}
                      oninput="handleInput(event)"
                      
                    />
                  </td>

                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%" }}
                      value={row.operator || ""}
                      disabled
                      oninput="handleInput(event)"
                    />
                  </td>
                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%" }}
                      value={row.valuept || ""}
                      onChange={(event) => handleInputValueChangePrompt(index, event.target.value)}
                    />
                   
                  </td>
                  <td style={{ width: "25%" }}>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      disabled
                      value={row.logical || ""}
                      oninput="handleInput(event)"
                    />
                  </td>
                  
                </tr>
                ) : null;
              })
            )}
            </tbody>
          </table>
    
         
        </fieldset>

      </div>
    </DialogContent>
    <DialogActions style={{padding:"10px 10px 15px"}}>
          <Grid item>
            <Button variant="outlined" 
            className="SaveButton"
            style={{
                   backgroundColor: "#4CAF50",
                   color: "white",
                   marginRight: "10px",
                 }}
            onClick={handleDropDownPromptSaveAsBtn}>
              <Iconify icon="iconoir:submit-document" /> Retrieve
            </Button>
          </Grid>
        </DialogActions>
  </Dialog></div>
  )
}

export default SupplierPromt