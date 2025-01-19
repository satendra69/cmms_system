import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, styled } from '@mui/material';
import React from 'react'
import Iconify from 'src/components/iconify';

  
function EmployeIdPromt({handleClosePromt,showPromt,rowsDropdownPrompt,handleInputValueChangePrompt,handleDropDownPromptSaveAsBtn}) {

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        "& .MuiDialogContent-root": {
          padding: theme.spacing(2),
        },
        "& .MuiDialogActions-root": {
          padding: theme.spacing(1),
        },
      }));


  return (
    <div>    <BootstrapDialog
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
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <Iconify icon="material-symbols:close" />
    </IconButton>
    <DialogContent dividers>
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
              {rowsDropdownPrompt.map((row, index) => {
                const isRowEmpty = !row.selectedOption && !row.operator && !row.valuept;
                return !isRowEmpty ? (
                <tr key={index}>
                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%" }}
                      disabled
                      value={row.selectedOptionName || ""}
                    //   className={`custom-Astselect ${
                    //     index === rows.length - 1 && valueptEmptyError
                    //       ? "error-border"
                    //       : "mammama"
                    //   }`}
                      oninput="handleInput(event)"
                      
                    />
                  </td>

                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%" }}
                      value={row.operator || ""}
                      disabled
                    //   className={`custom-Astselect ${
                    //     index === rows.length - 1 && valueptEmptyError
                    //       ? "error-border"
                    //       : "mammama"
                    //   }`}
                      oninput="handleInput(event)"
                      
                    />
                  </td>
                  <td style={{ width: "25%" }}>
                  <input
                      type="text"
                      style={{ width: "100%" }}
                      value={row.valuept || ""}
                    //   className={`custom-Astselect ${
                    //     index === rows.length - 1 && valueptEmptyError
                    //       ? "error-border"
                    //       : "mammama"
                    //   }`}
                     
                      onChange={(event) => handleInputValueChangePrompt(index, event.target.value)}
                    />
                   
                  </td>
                  <td style={{ width: "25%" }}>
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      disabled
                      value={row.logical || ""}
                    //   className={`custom-Astselect ${
                    //     index === rows.length - 1 && valueptEmptyError
                    //       ? "error-border"
                    //       : "mammama"
                    //   }`}
                      oninput="handleInput(event)"
                      
                    />
                  </td>
                  
                </tr>
                ) : null;
              })}
            </tbody>
          </table>
         
        </fieldset>

      </div>
    </DialogContent>
    <DialogActions>
      <Grid item>
        <Button variant="outlined" onClick={handleDropDownPromptSaveAsBtn}>
          <Iconify icon="iconoir:submit-document" /> Save
        </Button>
      </Grid>
    </DialogActions>
  </BootstrapDialog></div>
  )
}

export default EmployeIdPromt