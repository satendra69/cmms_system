import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, styled } from '@mui/material';
import React, { useState, useEffect } from "react";
import Iconify from 'src/components/iconify';
import { ThreeCircles } from 'react-loader-spinner';
  
                     
  function EmployeIdPromt({handleClosePromt,showPromt,rowsDropdownPrompt,handleInputValueChangePrompt,handleDropDownPromptSaveAsBtn}) {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const hasEmptySelectedOption = rowsDropdownPrompt.some(row => row.selectedOption === "");
    if (hasEmptySelectedOption) {
      setLoading(true); 
    } else {
      setLoading(false); 
    }
  }, [rowsDropdownPrompt]);


    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
          padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
          padding: theme.spacing(1),
        },
      }));


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
      }}
    >
      <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
    </IconButton>
    <DialogContent dividers>
      <div className="astSubpopup">
        <fieldset className="Subpopup-fieldset">
          <legend>Please Fill In The Value</legend>
         
          {loading ? (
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <ThreeCircles
            radius="9"
            visible={true}
            ariaLabel="three-circles-loading"
            color="green"
         
          />
            
          </div>
        ) : (
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
           
              {rowsDropdownPrompt.map((row, index) => {
                const isRowEmpty = !row.selectedOption && !row.operator && !row.valuept;
            
                return !isRowEmpty ? (
                <tr key={index}>
                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%",textAlign: 'center' }}
                      disabled
                      value={row.Column ? row.Column : row.selectedOptionName
                      }
                      oninput="handleInput(event)"
                      
                    />
                  </td>

                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%",textAlign: 'center' }}
                      value={row.operator || ""}
                      disabled
                    
                      oninput="handleInput(event)"
                      
                    />
                  </td>
                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%",textAlign: 'center' }}
                      value={row.valuept || ""}
                    
                      onChange={(event) => handleInputValueChangePrompt(index, event.target.value)}
                    />
                   
                  </td>
                  <td style={{ width: "25%" }}>
                    <input
                      type="text"
                      style={{ width: "100%",textAlign: 'center' }}
                      disabled
                      value={row.logical || ""}
                    
                      oninput="handleInput(event)"
                      
                    />
                  </td>
                  
                </tr>
                ) : null;
              })}
            </tbody>
          </table>
        )}
        </fieldset>

      </div>
    </DialogContent>
    <DialogActions style={{ padding: 8, margin: 0 }}>
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

export default EmployeIdPromt