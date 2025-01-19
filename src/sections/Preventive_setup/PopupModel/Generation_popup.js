import React, { useState } from "react";
import Iconify from "src/components/iconify";
import Grid from "@mui/material/Unstable_Grid2";
import Button from '@mui/material/Button';
import { Checkbox,Radio, RadioGroup } from '@mui/material';

// Toastfy
import { Box, Typography  } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

import httpCommon from "src/http-common";
import Swal from "sweetalert2";

import FormControlLabel from '@mui/material/FormControlLabel';

const GenerationPopup = ({ data ,AlltableData,onMessage }) => {
 
    let site_ID = localStorage.getItem("site_ID");
    const SelectedData = data;
    const TableAllData = AlltableData;

    const [selectedOption, setSelectedOption] = useState(
        SelectedData.length > 0 ? 'selected' : 'all'
      );

    const [ResultLog,setResultLog] = useState([]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value); // Update the selected option
      };
   
    const geneationDataSubmit = async () => {
    
    if(selectedOption !=="" || selectedOption != null){

        const requestData = selectedOption === "selected" ? SelectedData : TableAllData;
        const requestDataWithSiteCd = requestData.map((item) => ({
            ...item,
            siteCd: site_ID, // Append the siteCd
        }));

        Swal.fire({
            title: "Loading.... !",
            allowOutsideClick: false,
            customClass: {
              container: "swalcontainercustom",
            },
          });
      
          Swal.showLoading();
          
          try {
            const response = await httpCommon.post(
              "/insert_update_pm_generation.php",
              JSON.stringify(requestDataWithSiteCd)
            );
           // console.log("response______",response);
            if (response.data.status === "SUCCESS") {
                setResultLog(response.data);
                onMessage("Data generation has been submitted!");
            }
            Swal.close();
            // Handle success (if needed)
            
          } catch (error) {
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "Oops, something went wrong...",
              text: error.message || error,
            });
          }
    }
    }
    console.log("ResultLog____",ResultLog);
  return (
    <>
      <div>
      
          <div className="astSubpopup">
          
            <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  margin: "16px 0",
                  position: "relative",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {/* Legend */}
                <Typography
                  component="legend"
                  sx={{
                    position: "absolute",
                    top: "-10px",
                    left: "16px",
                    backgroundColor: "#f9f9f9",
                    padding: "0 8px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  PM Selection
                </Typography>

                {/* Checkboxes */}
                <Grid container spacing={2}>
                <Grid item xs={12}>
                   
                    <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                    {/* First Radio Button */}
                    <FormControlLabel
                        value="all"
                        control={<Radio />}
                        label="Generate all PM Work Order that are currently in the list"
                    />
                    {/* Second Radio Button */}
                    <FormControlLabel
                        value="selected"
                        control={<Radio />}
                        label={`Generate all PM Work Order(s) for ${SelectedData.length} selected record(s) in the list`}
                    />
                    </RadioGroup>
                </Grid>
                </Grid>
              </Box>

              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  margin: "16px 0",
                  position: "relative",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {/* Legend */}
                <Typography
                  component="legend"
                  sx={{
                    position: "absolute",
                    top: "-10px",
                    left: "16px",
                    backgroundColor: "#f9f9f9",
                    padding: "0 8px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  PM Generation Options
                </Typography>

                {/* Checkboxes */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Print Work Order Form"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Print Asset List For PM Group Work Order"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Print Asset Safety Requirements"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Print Asset Spare List"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Print Reference File Listing"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Print Material Requests"
                    />
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Print Purchase Requests"
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "16px",
                  margin: "16px 0",
                  position: "relative",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {/* Legend */}
                <Typography
                  component="legend"
                  sx={{
                    position: "absolute",
                    top: "-10px",
                    left: "16px",
                    backgroundColor: "#f9f9f9",
                    padding: "0 8px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  PM Generation Log
                </Typography>

                {/* Checkboxes */}
                <Grid container spacing={2} >
                <Grid item xs={12} style={{
                    overflowX: 'auto', // Enable horizontal scrolling only
                    height: '137px',
                    whiteSpace: 'nowrap',
                }}>
                  <div>
                    {ResultLog?.dataMSg?.length > 0 ? (
                    ResultLog.dataMSg.map((msg, index) => (
                        <Typography
                        key={index}
                        variant="body1"
                        sx={{
                            mb: 0,
                            whiteSpace: 'pre-line', 
                            fontSize: '12px',
                            fontWeight:'600'
                        }}
                        >
                        {msg}
                        </Typography>
                    ))
                    ) : (
                    <Typography variant="body1"></Typography>
                    )}
                </div>
                <div>
                    {ResultLog?.dataMSg?.length > 0 ? (
                    <>
                        <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        mb: 0, // Margin below heading
                        }}
                    >
                        Summary Log
                    </Typography>
                    <Typography
                        variant="body1"
                        color="textPrimary"
                        sx={{
                        fontSize: '12px',
                        mb: 0, // Space below separator
                        }}
                    >
                        --------------
                        
                        
                    </Typography>
                     <Typography
                     variant="body1"
                     color="textPrimary"
                     sx={{
                     fontSize: '12px',
                     fontWeight:'600'
                     }}
                 >
                     Total Preventive Setup: {ResultLog.summaryLogTotal}
                 </Typography>
                   <Typography
                   variant="body1"
                   color="textPrimary"
                   sx={{
                   fontSize: '12px',
                  fontWeight:'600'
                   }}
               >
                   Total Work Order Generated : {ResultLog.summaryLogGenrate}
               </Typography>

                
                   </>
                    ) : (
                    <Typography variant="body1"></Typography>
                    )}
                </div>
                
                  </Grid>
                 
                </Grid>
                
              </Box>
              <Box
                sx={{
                display: "flex",
                justifyContent: "flex-end", // Aligns the button to the right
                marginTop: "16px",
                }}
            >
                <Button
                className="SaveButton"
                variant="outlined"
                onClick={geneationDataSubmit}
                sx={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    marginRight: "10px",
                    "&:hover": {
                    backgroundColor: "#45a049",
                    },
                }}
                >
                <Iconify icon="ri:ai-generate" /> Generate
                </Button>
            </Box>
             
          </div>
       
      </div>
    </>
  );
};

export default GenerationPopup;
