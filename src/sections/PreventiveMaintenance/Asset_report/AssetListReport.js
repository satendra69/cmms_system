import React, { useState ,useEffect } from 'react';
import { styled } from "@mui/material/styles";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import Select from 'react-select';
//import APIServices from "../services/APIServices";
//import '../style.css';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Loader from '../../../assets/img/Work_order.gif';
import AssetPdfCreate from "./pdf/AssetPdfCreate";
import IconButton from "@mui/material/IconButton";
import Iconify from "src/components/iconify";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import httpCommon from '../../../http-common';
import Swal from "sweetalert2";
import Grid from "@mui/material/Unstable_Grid2";
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from "@mui/material/Autocomplete";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  
const AssetListReport = () => {
  let site_ID = localStorage.getItem("site_ID");
  const [dataAllData2, setAllData2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [AssetNO, setAssetNO] = useState("")
  const [Assetcode, setAssetcode] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const [selectedOptionLoc, setSelectedOptionLoc] = useState(null);
  const [AssetLocation, setAssetLocation] = useState([]);
  const [CostCenter, setCostCenter] = useState([]);
  const [selectedOptionCost, setSelectedOptionCost] = useState(null);
  const [WorkGroup, setWorkGroup] = useState([]);
  const [selectedOptionWork, setSelectedOptionWork] = useState(null);
  

 
//Popup model
const [showdd2, setShowdd2] = useState(false);
const handleClosedd2 = () => setShowdd2(false);
const AssetPopupClick =(e) =>{
    setShowdd2(true);
    setAllData2([]);
  }

// Get all select value api
const get_asset_Status = async () => {
  try {
    const responseJson = await httpCommon.get(
      `/get_dropdown.php?site_cd=${site_ID}&type=All`
    );
   // console.log("response_____fetcha___",responseJson);
          if (responseJson.data.status === 'SUCCESS') {
            let Assetcode =responseJson.data.data.Assetcode.map(item => ({
                label: item.ast_cod_ast_cd +" : "+ item.ast_cod_desc ,
                value: item.ast_cod_desc            
                }));
                setAssetcode(Assetcode);

            let AssetLocation =responseJson.data.data.AssetLocation.map(item => ({
              label: item.ast_loc_ast_loc +" : "+ item.ast_loc_desc ,
              value: item.ast_loc_desc            
              }));
              setAssetLocation(AssetLocation); 

            let CostCenter =responseJson.data.data.CostCenter.map(item => ({
              label: item.costcenter +" : "+ item.descs ,
              value: item.descs            
              }));                   
              setCostCenter(CostCenter); 

            let wrk_group =responseJson.data.data.wrk_group.map(item => ({
              label: item.wrk_grp_grp_cd +" : "+ item.wrk_grp_desc ,
              value: item.wrk_grp_desc            
              }));                   
              setWorkGroup(wrk_group);
            
        }else{
          
        }
  
  } catch (error) {
    console.error('Error fetching data:', error);
  }

// APIServices.get_dropdown(site_ID,type).then((responseJson)=>{
//       if (responseJson.data.status === 'SUCCESS') {
//         let Assetcode =responseJson.data.data.Assetcode.map(item => ({
//             label: item.ast_cod_ast_cd +" : "+ item.ast_cod_desc ,
//             value: item.ast_cod_desc            
//             }));
//             setAssetcode(Assetcode);

//         let AssetLocation =responseJson.data.data.AssetLocation.map(item => ({
//           label: item.ast_loc_ast_loc +" : "+ item.ast_loc_desc ,
//           value: item.ast_loc_desc            
//           }));
//           setAssetLocation(AssetLocation); 

//         let CostCenter =responseJson.data.data.CostCenter.map(item => ({
//           label: item.costcenter +" : "+ item.descs ,
//           value: item.descs            
//           }));                   
//           setCostCenter(CostCenter); 

//         let wrk_group =responseJson.data.data.wrk_group.map(item => ({
//           label: item.wrk_grp_grp_cd +" : "+ item.wrk_grp_desc ,
//           value: item.wrk_grp_desc            
//           }));                   
//           setWorkGroup(wrk_group);
        
//     }else{
      
//     }
// })
}
useEffect(() => {
  let site_ID = localStorage.getItem("site_ID");
  get_asset_Status();  
},[])

const handleSubmit = async (e) => {
  e.preventDefault();
  let site_ID = localStorage.getItem("site_ID");
// console.log("selectedOptionCost",selectedOptionCost);
  var selectedOptionLocValue ="";
  var selectedOptionCostValue ="";
  var selectedOptionValue ="";
  var selectedOptionWorkValue ="";

  if (selectedOptionLoc) {

     selectedOptionLocValue = (selectedOptionLoc.value).trim();

  }else if(selectedOptionCost){
   const selectlabel  = (selectedOptionCost.label).trim();
   const split_text = selectlabel.split(":")
   selectedOptionCostValue  = (split_text[0]).trim();
  }else if(selectedOption){
    selectedOptionValue = (selectedOption.value).trim();

  }else if(selectedOptionWork){
    selectedOptionWorkValue =(selectedOptionWork.value).trim();

  }
 
   if(AssetNO.trim() !== '' || selectedOptionLocValue !== '' || selectedOptionCostValue !== '' || selectedOptionValue !== '' || selectedOptionWorkValue !== ''){
     // console.log("selectedOptionWork___ssenenene");
   
  //   console.log("enter____");
  //     // You can access the form data from the state
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var JsData = {
        "site_cd": site_ID,
        "ast_mst_asset_no": AssetNO,
        "asset_shortdesc": "",
        "cost_center": selectedOptionCostValue,
        "asset_status": "",
        "asset_type": "",
        "asset_grpcode": selectedOptionWorkValue,
        "work_area": "",
        "asset_locn": selectedOptionLocValue,
        "asset_code": selectedOptionValue,
        "ast_lvl": "",
        "ast_sts_typ_cd": "",
        "createby": "",
        "service_type": "",
        "block": "",
        "floor": ""
      };
      
      try {
        setLoading(true);
        setShowdd2(false);
        Swal.fire({
          title: "Loading.... !",
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
        Swal.showLoading();
        const response = await httpCommon.post(
          "/get_assetmaster_select.php",
          JSON.stringify(JsData)
        );
         // console.log("response_____",response);
          if(response.data.status === "SUCCESS"){
            if(response.data.data.length > 0){
              setAllData2(response.data.data);
              setLoading(false);
              Swal.close();
              toast.success(response.data.message);
              setAssetcode("");
              setSelectedOption("");
              setSelectedOptionLoc("");
              setSelectedOptionCost("");
              setSelectedOptionWork("");
            }else{
              Swal.close();
              toast.success("No Result Found");
              setAssetcode("");
              setSelectedOption("");
              setSelectedOptionLoc("");
              setSelectedOptionCost("");
              setSelectedOptionWork("");
            }
            
          }
    
      }catch(error){
        console.error("error",error);
      }
      //.catch(error => console.log('error123', error));

    }else{
     // console.log("Error");
      toast.error(' Please Select One', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
      return false;
    
    }
}

  return (
    <>
    <div>
        <button className="btn btn-dark btn-sm mt-2 mb-4 mr-2" onClick={e =>{e.preventDefault(); AssetPopupClick()}}>Retrieve</button>
        {/* <button className="btn btn-dark btn-sm mt-2 mb-4" disabled={dataAllData2 == '' }onClick={generatePDF}>Generate PDF</button>  */}
    </div>
    <div>
    <AssetPdfCreate pdfDetails={dataAllData2}/>
    </div>
   
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
                  Report Filter Option: Asset List
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
                  <div>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Asset No:"
                            />
                        </Grid>
                        <Grid item xs={8}>
                        <TextField
                            id="outlined-basic"
                            size="small"
                              onChange={(e) => {
                                setAssetNO(e.target.value);
                              }}
                            variant="outlined"
                            className="Extrasize"
                            fullWidth
                            defaultValue=""
                            
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Asset location:"
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Autocomplete
                                options={AssetLocation}
                                defaultValue={selectedOptionLoc} 
                                onChange={(event, value) => {
                                    setSelectedOptionLoc(value);
                                    //setErrorMessage('');
                                }}
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
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Cost Center:"
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Autocomplete
                                options={CostCenter}
                               defaultValue={selectedOptionCost} 
                                onChange={(event, value) => {
                                  setSelectedOptionCost(value);
                                  //  setErrorMessage('');
                                }}
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
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Asset code:"
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Autocomplete
                                options={Assetcode}
                               defaultValue={selectedOption} 
                                onChange={(event, value) => {
                                  setSelectedOption(value);
                                   // setErrorMessage('');
                                }}
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
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4} sx={{ pl: 2 }}>
                            <FormControlLabel
                                control={<div />} // Empty control to avoid rendering checkbox or radio button
                                label="Work Group:"
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Autocomplete
                                options={WorkGroup}
                               defaultValue={selectedOptionWork}  
                                onChange={(event, value) => {
                                  setSelectedOptionWork(value);
                                   // setErrorMessage('');
                                }}
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
              {loading ? (
                      // <Loader /> 
                      <img src={Loader} width="120px" alt="Loader" className="loadrImgCls" />
                    ) : (
                    <div></div>
                    )}  
    {/* <Modal className="dm" show={showdd2} onHide={handleClosedd2} >
             <form onSubmit={handleSubmit} className="AsListDrop">
                  <Modal.Header closeButton>
                  <h5 className="modal-title" id="exampleModalLabel">Report Filter Option: Asset List</h5>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="container-fluid">
                  <div className="row AssetFromFiled">
                    <div className="col-md-12">
                    <div className="form-group row AssetFromRW">
                      <label className="col-sm-4 col-form-label">Asset No : </label>
                      <div className="col-sm-8">
                        <input type="text" name="ast_mst_asset_no" className="form-control-plaintext" onChange={handleInputChange} />
                      </div>
                      
                    </div>
                    <div className="form-group row AssetFromRW">
                      <label className="col-sm-4 col-form-label">Asset location : </label>
                      <div className="col-sm-8">
                      <Select
                      isClearable={true} 
                          options={AssetLocation}
                          value={selectedOptionLoc}
                          onChange={handleInputChangeLoc}
                          placeholder="Select an option"
                        />
                      
                      </div>
                    </div>
                    <div className="form-group row AssetFromRW">
                      <label className="col-sm-4 col-form-label">Cost Center : </label>
                      <div className="col-sm-8">
                        <Select
                         isClearable={true} 
                          options={CostCenter}
                          value={selectedOptionCost}
                          onChange={handleInputChangeCost}
                          placeholder="Select an option"
                        />
                      
                      </div>
                    </div>
                    <div className="form-group row AssetFromRW">
                      <label className="col-sm-4 col-form-label">Asset code : </label>
                      <div className="col-sm-8">
                      <Select
                       isClearable={true} 
                          options={Assetcode}
                          value={selectedOption}
                          onChange={handleInputChange2}
                          placeholder="Select an option"
                        />
                      </div>
                      
                    </div>
                    <div className="form-group row AssetFromRW">
                      <label className="col-sm-4 col-form-label">Work Group : </label>
                      <div className="col-sm-8">
                       
                      <Select
                       isClearable={true} 
                          options={WorkGroup}
                          value={selectedOptionWork}
                          onChange={handleInputChangeWork}
                          placeholder="Select an option"
                        />
                      </div>
                     
                    </div>
                    </div>
                  
                  </div>
                  </div>

                  </Modal.Body>
                  <Modal.Footer>
                  <button type="submit"  className="btn btn-primary"> OK</button>
                  </Modal.Footer>
                  </form>
            </Modal>
            
             {loading ? (
                      <Loader  /> 
                    ) : (
                    <div></div>
                    )}  */}
      
      <ToastContainer />
    </>
  )
}

  
export default AssetListReport;
