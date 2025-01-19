import React, { useState ,useEffect } from 'react';
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";


//import Select from 'react-select';
//import APIServices from "../services/APIServices";
//import '../style.css';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import IconButton from "@mui/material/IconButton";
import Iconify from "src/components/iconify";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import { ThreeCircles } from 'react-loader-spinner';
import httpCommon from '../../../http-common';
//import Grid from "@mui/material/Unstable_Grid2";
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from "@mui/material/Autocomplete";
// import AssetPdfCreate from '../Asset_report/pdf/AssetPdfCreate';
import AssetPrintQrReport from './AssetPrintQrReport';
import { Typography, Box, Container, Grid, Paper } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));


  
const AssetPrintQrCode = () => {
  let site_ID = localStorage.getItem("site_ID");
  const [dataAllData2, setAllData2] = useState([]);
  const [SelecteddataAll, setSelecteddataAll] = useState([]);

  const [AssetNO, setAssetNO] = useState("")
 
  const [isLoading, setIsLoading] = useState(true);
 
  const location = useLocation();
  const state = location.state || {};
  const { RowID,selectedVlue,ItemID } = state || {};
  const [FontSize, setFontSize] = useState("10");
  const [heightAdd, setheight] = useState("");
  const [WidthAdd, setWidthAdd] = useState("");
  const [RowBetween, setRowBetween] = useState("");

//Popup model
const [showdd2, setShowdd2] = useState(false);
const handleClosedd2 = () => setShowdd2(false);
const AssetPopupClick =(e) =>{
    setShowdd2(true);
  }

// Get all select value api
const get_asset_printData = async () =>{
  setIsLoading(true);
  try {
    const responseJson = await httpCommon.get(
      `/getAssetPrintQrCodeData.php?site_cd=${site_ID}&RowId=${RowID}&selectedVlue=${selectedVlue}&ItemID=${ItemID}`
    );
     console.log("responseJson____",responseJson);
      if (responseJson.data.status === 'SUCCESS') {   
        setAllData2(responseJson.data.data.Selected1);
        setSelecteddataAll(responseJson.data.data.All);
        if(responseJson.data.data.Selected1.length !== 0){
          setAssetNO(responseJson.data.data.Selected1['0'].ast_mst_asset_no);
        }
          setIsLoading(false);
      }
  
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

useEffect(() => {
  let site_ID = localStorage.getItem("site_ID");
  get_asset_printData();
},[])

const handleFontSizeChange = ( event,value) => {
  setFontSize(value);
  const updatedData = dataAllData2.map(item => ({
    ...item,
    FontSize: value + 'px'
  }));
  setAllData2(updatedData);
  const updatedataAll = SelecteddataAll.map(item => ({
    ...item,
    FontSize: value + 'px'
  }));
  setSelecteddataAll(updatedataAll);
};
const handleHeightChange = (event) => {
  setheight(event.target.value);
};
const handleWidthChange = (event) => {
  setWidthAdd(event.target.value);
};
const handleRowBetWeenChange  = (event) => {
  setRowBetween(event.target.value);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  handleClosedd2();
}
function truncateText(text, maxLength) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  } else {
    return text;
  }
}

  return (
    <>
     <Container>
     
    <div>
    <button className="btn btn-dark btn-sm mt-2 mb-4 mr-2" style={{marginRight: '5px'}}> 
      <AssetPrintQrReport 
        data={(dataAllData2 && Object.keys(dataAllData2).length !== 0) ? dataAllData2 : SelecteddataAll}
        FontSize={FontSize}
      />
     </button>

    <button className="btn btn-dark btn-sm mt-2 mb-4 mr-2" onClick={e =>{e.preventDefault(); AssetPopupClick()}}>Option</button>
      
    </div>
    
   
   
    <Box m={2} className="printCodeCss" style={{ width: "50%" }}>
  <div>
    {/* Loader */}
    <Dialog open={isLoading} aria-labelledby="loading-dialog-title" PaperProps={{
      style: {
        backgroundColor: "transparent", // Set your desired background color here
      },
    }} BackdropProps={{
      className: "yourbackdropclass",
    }}>
      <DialogTitle id="loading-dialog-title" style={{ textAlign: 'center' }}></DialogTitle>
      <DialogContent>
        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
          <ThreeCircles
            radius="9"
            visible={true}
            ariaLabel="three-circles-loading"
            color="green"
          />
        </div>
      </DialogContent>
    </Dialog>

    {/* Asset details */}
    {!isLoading && (
      <>
        {dataAllData2 && Object.keys(dataAllData2).length !== 0 && (
          <div className='AssetPrintmainDiv'>
            <div className='AssetPrintfirstDiv'>
              <QRCode value={AssetNO} size={dataAllData2.FontSize !== undefined && dataAllData2.FontSize !== null && dataAllData2.FontSize !== "" ? dataAllData2.FontSize : 60} width={50} />
            </div>
            <div className='AssetPrintsecondDiv'>
            {dataAllData2.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <span style={{ display: 'block', fontSize: item.FontSize,fontWeight: "600"  }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}># :</span> {item.ast_mst_asset_no}</span>

                    <span style={{ display: 'block', fontSize: item.FontSize,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>C :</span> {item.ast_mst_cost_center}</span>

                    <span style={{ display: 'block', fontSize: item.FontSize,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>L :</span> {item.ast_mst_asset_locn}</span>
                    <span style={{ display: 'block', fontSize: item.FontSize,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>D :</span> {truncateText(item.ast_mst_asset_shortdesc, 25)}</span>
                </div>
            ))}
              
            </div>
          </div>
        )}
        {SelecteddataAll && SelecteddataAll.length !== 0 && (
          <>
            {SelecteddataAll.map((item, index) => (
              <div key={index} className='AssetPrintmainDiv'>
                <div className='AssetPrintfirstDiv'>
                  <QRCode value={item.ast_mst_asset_no} size={60} width={60} />
                </div>
                <div className='AssetPrintsecondDiv'>
                <span style={{ display: 'block', fontSize: item.FontSize ,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}># :</span> {item.ast_mst_asset_no}</span>

                <span style={{ display: 'block', fontSize: item.FontSize,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>C :</span> {item.ast_mst_cost_center}</span>

                <span style={{ display: 'block', fontSize: item.FontSize,fontWeight: "600" }}><span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>L :</span> {item.ast_mst_asset_locn}</span>

                <span style={{ display: 'block', fontSize: item.FontSize,fontWeight: "600" }}>
                  <span className="highlight" style={{ fontSize: item.FontSize,fontWeight: "600"  }}>D :</span> {truncateText(item.ast_mst_asset_shortdesc, 25)}</span>
                

                </div>
              </div>
            ))}
          </>
        )}
      </>
    )}
     
  </div>
</Box>
      
     
     </Container>
    
    <BootstrapDialog
                onClose={handleClosedd2}
                aria-labelledby="customized-dialog-title"
                open={showdd2}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Tagging Options
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleClosedd2}
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
                  <div style={{padding:"0px 15px"}}>
                    
                    <Grid container spacing={2} alignItems="center" sx={{ mb:1 }}>
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Font Size:"
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Autocomplete
                                options={['1','2','3','4','5','6','7','8','9','10','11','12','50']} 
                                defaultValue={setFontSize} 
                                onChange={handleFontSizeChange} 
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        placeholder="Select..."
                                        variant="outlined"
                                        fullWidth // Ensure the TextField takes up full width
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center" sx={{ mb:1 }}>
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Height (cm):"
                            />
                        </Grid>
                        <Grid item xs={8}>
                        <TextField
                          type="number"
                          aria-label="Height (cm)"
                          placeholder="Type Height…"
                          value={heightAdd}
                          onChange={handleHeightChange}
                          className="PrintInput"
                          fullWidth
                        />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center" sx={{ mb:1 }}>
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Width (cm):"
                            />
                        </Grid>
                        <Grid item xs={8}>
                        <TextField
                          type="number"
                          aria-label="Height (cm)"
                          placeholder="Type Width…"
                          value={WidthAdd}
                          onChange={handleWidthChange}
                          className="PrintInput"
                          fullWidth
                        />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center" sx={{ mb:1 }}>
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Between Rows (cm):"
                            />
                        </Grid>
                        <Grid item xs={8}>
                        <TextField
                          type="number"
                          aria-label="Height (cm)"
                          placeholder="Type Row Between…"
                          value={RowBetween}
                          onChange={handleRowBetWeenChange}
                          
                          fullWidth
                          className="PrintInput"
                        />
                        </Grid>
                    </Grid>
                    
                  </div>
                </DialogContent>
                    <DialogActions>
                    {/* <Grid item>
                        <Button variant="outlined" onClick={onClickApprove}>
                    
                        <Iconify icon="mingcute:save-line" /> Approve
                        </Button>
                    </Grid> */}
                    <Grid container spacing={2} alignItems="center">
                    {/* {errorMessage && (
                        <Grid item>
                        <div style={{ color: 'red', marginRight: '10px' }}>{errorMessage}</div>
                        </Grid>
                    )} */}
                    <Grid item>
                        <Button variant="outlined" onClick={handleSubmit}>
                         OK
                        </Button>
                    </Grid>
                    
                    </Grid>
                    </DialogActions>
     </BootstrapDialog>
              
      <ToastContainer />
    </>
  )
}

  
export default AssetPrintQrCode;
