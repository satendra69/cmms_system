import React, { useState, useEffect } from "react";
import {
  Checkbox,
  TextField,
  Typography,
  Button,
  Switch,
  Box,
} from "@mui/material";

import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import CheckList from "./Popup_model/CheckList";
import AddCheckListForm from "./Popup_model/AddCheckListForm";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Iconify from "src/components/iconify";

import httpCommon from "src/http-common";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const PmCheckList = ({ onRowClick, data }) => {

  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [AllImg, setAllImg] = React.useState([]);
  const [totalCount, setTotalCount] = useState("");
  const [ZoomData,setZoomData] = useState([]);


  const location = useLocation();
  const [RowID, setRowID] = useState(data ? data.RowID : '');
 
  const [AssetNo, setAssetNo] = useState(data && data.Asset_No ? data.Asset_No.split(' : ')[0] : '');
  const [FormStatus, setFormStatus] = useState(data.formStatus);
  // First Api
  const get_CheckList_header = async (site_ID, RowID) => {
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
   
    try {
      const response = await httpCommon.get(
        `/get_check_list_header.php?site_cd=${site_ID}&mst_RowID=${RowID || ""}`
      );
       console.log("response____checklist___",response);
      if (response.data.status === "SUCCESS") {
        const responseData = response.data.data.HeaderData;
        const responseResult = response.data.data.FormData;
        const responseResultImg = response.data.data.imgData.AllRef;
       
       
        let Get_Zoom = response.data.data.ZoomData.map(
            (item) => ({
              label: item.stp_zom_data,
              value: item.stp_zom_data,
            })
          );
         
          setResult(responseResult);
          setAllImg(responseResultImg);
          setZoomData(Get_Zoom);
        if (Array.isArray(responseData) && responseData.length > 0) {
            const total = responseData.reduce((accumulator, currentItem) => {
              return accumulator + currentItem.total;
            }, 0);
    
            setTotalCount(total);
            setHeader(responseData);
          } else {
          //  console.warn("Response data is empty or not an array");
            setTotalCount("");
            setHeader("");
            
          }
    
          Swal.close();
        } else {
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data.message,
            });
        }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const get_CheckList_header_get = async (site_ID) =>{
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
   
    try {
      const response = await httpCommon.get(
        `/get_check_list_header.php?site_cd=${site_ID}&mst_RowID=${RowID ||""}`
      );
       console.log("response____checklist___rrrr",response);
      if (response.data.status === "SUCCESS") {
        const responseData = response.data.data.HeaderData;
        const responseResult = response.data.data.FormData;
        const responseResultImg = response.data.data.imgData.AllRef;
       
       
        let Get_Zoom = response.data.data.ZoomData.map(
            (item) => ({
              label: item.stp_zom_data,
              value: item.stp_zom_data,
            })
          );
         
          setResult(responseResult);
          setAllImg(responseResultImg);
          setZoomData(Get_Zoom);
        if (Array.isArray(responseData) && responseData.length > 0) {
            const total = responseData.reduce((accumulator, currentItem) => {
              return accumulator + currentItem.total;
            }, 0);
    
            setTotalCount(total);
            setHeader(responseData);
          } else {
          //  console.warn("Response data is empty or not an array");
            setTotalCount("");
            setHeader("");
            
          }
    
          Swal.close();
        } else {
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data.message,
            });
        }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {

    if(FormStatus !== "" && FormStatus == "NEW" ){
    //  get_CheckList_header_get(site_ID);
    }else{
      get_CheckList_header(site_ID, RowID);
    }

    
    // get_workorder_status(site_ID, "All", location.state.select);
  }, [site_ID, RowID]);


  const [levelOneVisible, setLevelOneVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [nestedVisibleSections, setNestedVisibleSections] = useState({});
  const [innermostVisibleSections, setInnermostVisibleSections] = useState({});
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [selectedCheckList, setSelectedCheckList] = useState ("");
  const [switchStates, setSwitchStates] = useState([]);
  const toggleLevelOne = () => {
    setLevelOneVisible((prev) => !prev);
  };

  const toggleVisibility = (key) => {
    setVisibleSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleNestedVisibility = (key) => {
    setNestedVisibleSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleInnermostVisibility = (key) => {
    setInnermostVisibleSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFileClick = (innerRes) => {
  
    if (!innerRes) {
    //  console.error('innerRes is undefined or null');
      return;
    }
  
    if (!innerRes.file_name) {
     // console.error('File name is undefined or missing in innerRes:', innerRes);
      return;
    }
  
    const fileExtension = innerRes.file_name.split('.').pop().toLowerCase();
  
    if (fileExtension === 'pdf') {
      // Logic to display PDF
     // console.log('Display PDF:', innerRes.file_name);
      window.open(innerRes.file_name, '_blank');
    } else if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
      // Logic to display JPEG
    //  console.log('Display JPEG:', innerRes.file_name);
      window.open(innerRes.file_name, '_blank');
    } else {
    //  console.log('Unsupported file type');
    }
  };
  
  const renderFileIcon = (fileName,attachment) => {
    const fileExtension = fileName?.split('.').pop().toLowerCase();

    if (fileExtension === 'pdf') {
      return (
        <a href={`${httpCommon.defaults.baseURL}${attachment}`} target="_blank" rel="noopener noreferrer">
          <Iconify icon="fluent:document-pdf-32-regular" />
        </a>
      );    
    } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
      return (
        <a href={`${httpCommon.defaults.baseURL}${attachment}`} target="_blank" rel="noopener noreferrer">
          <Iconify icon="lets-icons:img-box-duotone-line" />
        </a>
      );
    } else {
      return null; // Handle other file types as needed
    }
  };

  const DeleteChecklist = async (jobId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this check list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
  
    if (result.isConfirmed) {
      Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      Swal.showLoading();
  
      try {
        const json_checkList_delete = {
          site_cd: site_ID,
          jobId: jobId.trim(),
        };
  
        const response = await httpCommon.post(
          "/delete_checkList.php",
          JSON.stringify(json_checkList_delete)
        );
  
        if (response.data.status === "SUCCESS") {
          Swal.close();
          await Swal.fire({
            icon: "success",
            customClass: {
              container: "swalcontainercustom",
            },
            title: response.data.status,
            text: response.data.message,
          });
  
          // Assuming get_CheckList_header is an async function
          await get_CheckList_header(site_ID, RowID);
        } else {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.data.message,
          });
        }
      } catch (error) {
        console.error("Error deleting checklist:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    }
  };
  
  const [modalOpen, setModalOpen] = useState(false);
  const [AddNewModalOpen, setModalOpenAddNew] = useState(false);
  const [AddFormData, setAddFormData] = useState([]);
  const [StorEmptyFromData, setStorEmptyFromData] = useState([]);
   
  function handleCloseModal() {
    setModalOpen(false);
  //  handleShowAddNew();
  }

  const handleShowAddNew = () =>{
    setModalOpenAddNew(true);
  }

  function handleCloseModalAddNew() {
    setModalOpenAddNew(false);
  }

  const handleRowData2 = (dataa, secondData) => {
  
    // Check if Header array is empty
    if (Header.length === 0) {
      //console.log("Header is empty, saving dataa:", dataa);
      setSelectedCheckList(dataa);
    } else {
      // If Header is not empty, proceed with the existing logic
      let dataExists = false;
  
      Header.forEach((res) => {
        if (res.wko_isp_job_cd === dataa) {
          dataExists = true;
          Swal.fire({
            title: `The ${dataa} Already Exists in The Current Work Order`,
            icon: "warning",
            allowOutsideClick: false,
            customClass: {
              container: "swalcontainercustom",
            },
            width: '350px', 
            didOpen: () => {
              const titleElement = Swal.getTitle();
              titleElement.style.fontSize = '14px'; 
            },
          });
        }
      });
  
      // If data does not exist, save it
      if (!dataExists) {
        //console.log("Saving dataa as it doesn't exist in Header:", dataa);
        setSelectedCheckList(dataa);
      }
    }
  
    // Handle secondData logic at the end
    if (secondData === "1") {
    //  console.log("secondData is 1, closing modal and showing add new");
      handleCloseModal();
      handleShowAddNew();
    }
  };
  
  const handleClose_Modal = () =>{
    if(selectedCheckList != ""){
      handleShowAddNew();
      handleCloseModal();
    }
  }
  const handleRowData3 = (dataaForm) => {
    setAddFormData(dataaForm);
   
  }
  const EmptyFormData = (DataEmptyGet) =>{
   // console.log("DataEmptyGet____",DataEmptyGet);
    setStorEmptyFromData(
      DataEmptyGet.map(item => ({
        ...item,
        wko_isp_varchar1: "",
        wko_isp_numeric1: "",
        wko_isp_varchar2: "",
        wko_isp_dropdown1: "",
        wko_isp_checkbox1: "",
        wko_isp_varchar3: "1",
        remark: "",
      }))
    );
  }
const SaveChkList = async () =>{
//  if(AddFormData.length === 0){
//   Swal.fire({
//     icon: "warning",
//     title: "Please wait.... !",
//     text:"Please filed the one first",
//     allowOutsideClick: false,
//     customClass: {
//       container: "swalcontainercustom",
//     },
//   })
//   return;
//  }

//console.log("StorEmptyFromData____",StorEmptyFromData);
const formDataToSend = AddFormData.length === 0 ? StorEmptyFromData : AddFormData;

  var json_workorder_checkList = {
    site_cd: site_ID,
    mst_rowid:RowID,
    AssetNo:AssetNo,
    AuditUser: emp_mst_login_id,
    FormData:formDataToSend,
    
  }
  try {
    const response = await httpCommon.post(
      "/insert_check_list_data.php",
      JSON.stringify(json_workorder_checkList)
    );
     console.log("json_workordchecklist Data", response);

    if (response.data.status === "SUCCESS") {
      // console.log("responseJson", response.data.ROW_ID);
      Swal.close();
      Swal.fire({
        icon: "success",
        customClass: {
          container: "swalcontainercustom",
        },
        title: response.data.status,
        text: response.data.message,
      }).then(() => {
        setAddFormData("");
        handleCloseModalAddNew();
        get_CheckList_header(site_ID, RowID);
        
      });
    } else {
      Swal.close();
      handleCloseModalAddNew();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: response.data,
      });
    }
  } catch (error) {
    Swal.close();

    Swal.fire({
      icon: "error",
      title: "Oops get_WorkOrder_select...",
      text: error,
    });
  }
}

useEffect(() => {
  setSwitchStates(Result.map(() => true)); 
}, [Result]);

const handleInputChange = (e, RowID, field) => {
  const { value } = e.target;
  const currentItem = Result.find(item => item.RowID === RowID);

  if (field === "wko_isp_numeric1") {
    const minThreshold = parseFloat(currentItem.stp_mst_min_thr); 
    const maxThreshold = parseFloat(currentItem.stp_mst_max_thr);

    if (value < minThreshold || value > maxThreshold) {
        // Show alert message
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: `Value must be between ${minThreshold} and ${maxThreshold}`,
            allowOutsideClick: false,
            customClass: {
                container: "swalcontainercustom",
            },
            width: '350px', 
            didOpen: () => {
              const titleElement = Swal.getTitle();
              titleElement.style.fontSize = '14px'; 
            },
        });

        // Highlight the Min or Max Typography components based on the validation
        if (value < minThreshold) {
           
            document.querySelector('.checklist_Min').style.backgroundColor = 'red';
        } else if (value > maxThreshold) {
          document.querySelector('.checklist_Max').style.backgroundColor = 'red';
        }

    } else {
        // Reset the highlight if the value is valid
        document.querySelector('.checklist_Max').style.backgroundColor = 'transparent';
        document.querySelector('.checklist_Min').style.backgroundColor = 'transparent';
    }
  }

  const updatedResults = Result.map((item) => 
    item.RowID === RowID ? { ...item, [field]: value } : item
  );
  setResult(updatedResults);
  onRowClick(updatedResults);
};

const handleCheckboxChange = (e, RowID, field) => {
  const { checked } = e.target;
  const updatedResults = Result.map((item) => 
    item.RowID === RowID ? { ...item, [field]: checked } : item
  );
  setResult(updatedResults);
  onRowClick(updatedResults);
};

const handleInputChangeDate = (newValue, RowID, field) => {
 
  const updatedResults = Result.map((item) =>
    item.RowID === RowID ? { ...item, [field]: newValue } : item
  );
  setResult(updatedResults);
  onRowClick(updatedResults);

};

const handleDropdownChange = (event, value, RowID, field) => {
  const updatedResults = Result.map((item) =>
    item.RowID === RowID ? { ...item, [field]: value } : item
  );
  setResult(updatedResults);
  onRowClick(updatedResults);
 
};

const formatDateString = (dateString) => {
  if (!dateString) return ''; // Handle undefined or null dateString
  
  // Ensure dateString is a string before applying replace
  const formattedDateString = typeof dateString === 'string'
    ? dateString.replace('T', ' ').replace('.000000', '')
    : '';

  return formattedDateString;
};

const handleSwitchChange = (event, RowID) => {
  const checked = event.target.checked ? '1' : '0'; // Convert switch state to '1' or '0'
  const updatedResults = Result.map((item) =>
    item.RowID === RowID ? { ...item, wko_isp_varchar3: checked } : item
  );
  setResult(updatedResults);
  onRowClick(updatedResults); // Call any function to handle updated result if needed
};
const handleShow = () => {
         
  if(FormStatus !== "" && FormStatus == "NEW" ){
    Swal.fire({
      icon: "info",
      customClass: {
        container: "swalcontainercustom",
      },
      title: "Please Wait!",
      allowOutsideClick: false,
      text: "Once the Work Order is created, you can then add detailed Check List.",
      width:"400px"
    });
    onRowClick("BtnCheckList");
  }else{
    setModalOpen(true);
     
  }
};
  return (
    <>
      <div>
        <div style={{ paddingBottom: "20px", backgroundColor: "white" }}>
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginRight: "5px" }}>
              <Iconify icon="mdi:planner-outline" style={{ width: "40px", height: "40px" }}/>
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                Check List
              </div>
              <div>
                
                Total Check List :
                <span style={{ color: "blue" }}>
                 {} {totalCount ? totalCount : ""}
                </span>
              </div>
            </div>
          </div>
          
        </div>
        <div className="table-responsive">
        <Box>
        
        {FormStatus !== "" && FormStatus === "NEW" ? null : (
        <Button onClick={toggleLevelOne} className="checkListBtn">
          {levelOneVisible ? (
            <Iconify icon="iconamoon:arrow-down-2-light" />
          ) : (
            <Iconify icon="iconamoon:arrow-right-2-light" />
          )}{" "}
          {AssetNo}
        </Button>
      )}

      {/* <Button onClick={toggleLevelOne} className="checkListBtn">
        {levelOneVisible ? <Iconify icon="iconamoon:arrow-down-2-light"/> : <Iconify icon="iconamoon:arrow-right-2-light"/>} {AssetNo}
      </Button> */}
   
      {levelOneVisible && (
        <Box ml={2}>
         {Array.isArray(Header) && Header.length > 0 && Header.map((item, index) => {
            const key = String.fromCharCode(65 + index); // Convert index to corresponding letter (A, B, C, ...)
            const filteredResults = Result.filter(res => res.wko_isp_job_cd === item.wko_isp_job_cd);
      
            const displayedSections = new Set();
           
            return (
              <Box key={item.mst_rowid}>
               
                <Button onClick={() => toggleVisibility(key)} className="checkListBtn" 
                  onMouseEnter={() => setHoveredButtonId(index)}
                  onMouseLeave={() => setHoveredButtonId(null)}
                  style={{ position: 'relative',transition: 'all 0.1s ease' }}
                  >
                  {visibleSections[key] ? <Iconify icon="iconamoon:arrow-down-2-light"/> : <Iconify icon="iconamoon:arrow-right-2-light"/> } {item.wko_isp_job_cd} ({item.wko_isp_job_desc})
                  {hoveredButtonId === index && (
                  <div className="innerBtnChkList">
                  
                  <Tooltip
                   title="Delete"
                    placement="top"
                    arrow
                   >
                      <IconButton 
                        className="innerBtnChkList1" 
                        onClick={(event) => {
                          event.stopPropagation(); // Prevents the toggleVisibility from being called
                          DeleteChecklist(item.wko_isp_job_cd);
                        }}
                      >
                        <Iconify icon="mdi:delete-outline" /> {/* Delete Icon */}
                      </IconButton>
                  </Tooltip>
                
                  <Tooltip
                   title={`Completed  ${item.done}  Total ${item.total}`}
                    placement="top"
                    
                    arrow
                   >
                       {item.done + ' / ' + item.total}
                  </Tooltip>
                </div>
                  )}
                </Button>
              
                {visibleSections[key] && (
                  <Box ml={2}>
                     
                    {filteredResults.map((res, resIndex) => {
                     
                      const sectionKey = `${res.wko_isp_sec_no}-${res.wko_isp_sec_desc}`;
                    
                      if (displayedSections.has(sectionKey)) {
                        return null; // Skip duplicate sections
                      }
                      displayedSections.add(sectionKey);
                      const filteredImgResults = AllImg.filter(img => img.sec_rowid === res.wko_isp_stp_rowid || img.stp_desc == res.wko_isp_stp_desc );

                      return (
                        <Box key={res.RowID} mb={1}>
                          
                          <Button onClick={() => toggleInnermostVisibility(`${key}-${resIndex}`)} className="checkListBtn">
                            {innermostVisibleSections[`${key}-${resIndex}`] ? <Iconify icon="iconamoon:arrow-down-2-light"/> : <Iconify icon="iconamoon:arrow-right-2-light"/>} <Typography >{res.wko_isp_sec_no}: {res.wko_isp_sec_desc}</Typography>
                          </Button>
                          {innermostVisibleSections[`${key}-${resIndex}`] && (
                            <Box ml={2}>
                             
                              {filteredResults
                                .filter(r => r.wko_isp_sec_no === res.wko_isp_sec_no && r.wko_isp_sec_desc === res.wko_isp_sec_desc)
                                .map((innerRes) => {
                                 
                                    const borderColor = innerRes.wko_isp_varchar1 ? '5px solid #2Ecc71' : '5px solid #E65100';
                                    const borderColor1 = innerRes.wko_isp_numeric1 ? '5px solid #2Ecc71' : '5px solid #E65100';
                                    const borderColor2 = innerRes.wko_isp_datetime1 ? '5px solid #2Ecc71' : '5px solid #E65100';
                                    const borderColor3 = innerRes.wko_isp_checkbox1 ? '5px solid #2Ecc71' : '5px solid #E65100';
                                    const borderColor4 = innerRes.wko_isp_dropdown1 ? '5px solid #2Ecc71' : '5px solid #E65100';
                                    
                                    const { date } = innerRes.wko_isp_datetime1 || {};
                                    const formattedDate = date ? new Date(date).toLocaleString('en-US', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                    }) : '';
                                  
                                  return (
                                    
                                    <Box key={innerRes.RowID} mb={1}>
                                   {innerRes.wko_isp_stp_datatype === "N" && (
                                        // <div className="checkList_border" style={{ borderLeft: borderColor1 }}>
                                        <div
                                              className="checkList_border"
                                              style={{
                                                borderLeft: innerRes.wko_isp_varchar3 === '0' ? '5px solid gray' : borderColor1,
                                              }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item xs={4} >
                                                        <Typography>{`${innerRes.wko_isp_sec_no}.${innerRes.wko_isp_stp_no}: ${innerRes.wko_isp_stp_desc}`}</Typography>
                                                    </Grid>

                                                    <Grid item xs={4} onClick={handleFileClick} style={{ cursor: 'pointer' }}  >
                                                   
                                                    <Tooltip
                                                          title={
                                                            filteredImgResults.length > 0 &&
                                                            filteredImgResults.some((res) => res.stp_datatype === "N")
                                                              ? filteredImgResults.find((res) => res.stp_datatype === "N").stp_mst_file_name
                                                              : ''
                                                          }
                                                          placement="top"
                                                          arrow
                                                        >
                                                          {filteredImgResults.some((res) => res.stp_datatype === "N")
                                                            ? renderFileIcon(
                                                                filteredImgResults.find((res) => res.stp_datatype === "N").stp_mst_file_name,
                                                                filteredImgResults.find((res) => res.stp_datatype === "N").attachment
                                                              )
                                                            : null}
                                                        </Tooltip>
                                                     
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                    <Switch
                                                        checked={innerRes.wko_isp_varchar3 === '1'} // Set Switch state based on wko_isp_varchar3
                                                        onChange={(event) => handleSwitchChange(event, innerRes.RowID)}
                                                      />
                                                </Grid>
                                                    
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                    label="Number"
                                                    type="number"
                                                    fullWidth
                                                    value={parseFloat(innerRes.wko_isp_numeric1).toString().replace(/\.0+$/, '')}
                                                  //  onChange={(e) => handleInputChange(e, innerRes.RowID,'wko_isp_numeric1')}
                                                    onChange={(e) => {
                                                      const value = e.target.value;
                                                      if (value.length <= 11) {
                                                        handleInputChange(e, innerRes.RowID,'wko_isp_numeric1');
                                                      }
                                                    }}

                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    disabled={innerRes.wko_isp_varchar3 === '0'}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                    label="Remark"
                                                    fullWidth
                                                    value={innerRes.wko_isp_varchar2}
                                                    //onChange={(e) => handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2')}
                                                    onChange={(e) => {
                                                      const value = e.target.value;
                                                      if (value.length <= 255) {
                                                        handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2');
                                                      }
                                                    }}
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    disabled={innerRes.wko_isp_varchar3 === '0'}
                                                    />
                                                </Grid>
                                                </Grid>

                                            <Grid container justifyContent="space-between" className="checklist_Min_max">
                                            <Grid item>
                                                <Typography className="checklist_Min" >Min: {parseFloat(innerRes.wko_isp_min_thr).toString().replace(/\.0+$/, '')}</Typography>
                                              
                                            </Grid>
                                            <Grid item>
                                                <Typography className="checklist_Max">Max: {parseFloat(innerRes.wko_isp_max_thr).toString().replace(/\.0+$/, '')}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography>UOM: {innerRes.wko_isp_uom }</Typography>
                                            </Grid>
                                            </Grid>
                                        </div>
                                        )}

                                        {innerRes.wko_isp_stp_datatype === "T" && (
                                         
                                            <div
                                              className="checkList_border"
                                              style={{
                                                borderLeft: innerRes.wko_isp_varchar3 === '0' ? '5px solid gray' : borderColor,
                                              }}>
                                            <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between">
                                                <Grid item xs={4}>
                                                    <Typography>{`${innerRes.wko_isp_sec_no}.${innerRes.wko_isp_stp_no}: ${innerRes.wko_isp_stp_desc}`}</Typography>
                                                </Grid>
                                                <Grid item xs={4} onClick={handleFileClick} style={{ cursor: 'pointer' }} alignItems="center" justifyContent="center" >
                                                
                                                <Tooltip
                                                    title={
                                                      filteredImgResults.length > 0 &&
                                                      filteredImgResults.some((res) => res.stp_datatype === "T")
                                                        ? filteredImgResults.find((res) => res.stp_datatype === "T").stp_mst_file_name
                                                        : ''
                                                    }
                                                    placement="top"
                                                    arrow
                                                  >
                                                    {filteredImgResults.some((res) => res.stp_datatype === "T")
                                                      ? renderFileIcon(
                                                          filteredImgResults.find((res) => res.stp_datatype === "T").stp_mst_file_name,
                                                          filteredImgResults.find((res) => res.stp_datatype === "T").attachment
                                                        )
                                                      : null}
                                                  </Tooltip>

                                                </Grid>
                                                <Grid item xs={4}>
                                                  <Switch
                                                    checked={innerRes.wko_isp_varchar3 === '1'} // Set Switch state based on wko_isp_varchar3
                                                    onChange={(event) => handleSwitchChange(event, innerRes.RowID)}
                                                  />
                                                </Grid>
                                               

                                                </Grid>
                                                <Grid item xs={12} mt={1.5}>
                                                  <TextField
                                                  label="Text"
                                                  type="text"
                                                  fullWidth
                                                  value={innerRes.wko_isp_varchar1 }
                                                  //onChange={(e) => handleInputChange(e, innerRes.RowID, 'wko_isp_varchar1')}
                                                  onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length <= 255) {
                                                      handleInputChange(e, innerRes.RowID, 'wko_isp_varchar1');
                                                    }
                                                  }}
                                                  margin="normal"
                                                  InputLabelProps={{
                                                      shrink: true,
                                                    }}
                                                  disabled={innerRes.wko_isp_varchar3 === '0'}
                                                  />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                label="Remark"
                                                fullWidth
                                                value={innerRes.wko_isp_varchar2 }
                                               // onChange={(e) => handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2')}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (value.length <= 255) {
                                                    handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2');
                                                  }
                                                }}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                  }}
                                                disabled={innerRes.wko_isp_varchar3 === '0'} 
                                                />
                                            </Grid>
                                            </Grid>
                                        </div>
                                        )}

                                        {innerRes.wko_isp_stp_datatype === "D" && (
                                          
                                             <div
                                              className="checkList_border"
                                              style={{
                                                borderLeft: innerRes.wko_isp_varchar3 === '0' ? '5px solid gray' : borderColor2,
                                              }}>

                                            <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between">
                                                <Grid item xs={4}>
                                                    <Typography>{`${innerRes.wko_isp_sec_no}.${innerRes.wko_isp_stp_no}: ${innerRes.wko_isp_stp_desc}`}</Typography>
                                                </Grid>

                                                <Grid item xs={4} onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                                               
                                                <Tooltip
                                                    title={
                                                      filteredImgResults.length > 0 &&
                                                      filteredImgResults.some((res) => res.stp_datatype === "D")
                                                        ? filteredImgResults.find((res) => res.stp_datatype === "D").stp_mst_file_name
                                                        : ''
                                                    }
                                                    placement="top"
                                                    arrow
                                                  >
                                                    {filteredImgResults.some((res) => res.stp_datatype === "D")
                                                      ? renderFileIcon(
                                                          filteredImgResults.find((res) => res.stp_datatype === "D").stp_mst_file_name,
                                                          filteredImgResults.find((res) => res.stp_datatype === "D").attachment
                                                        )
                                                      : null}
                                                  </Tooltip>
                                                </Grid>

                                                <Grid item xs={4} >
                                                    <Switch
                                                        checked={innerRes.wko_isp_varchar3 === '1'} // Set Switch state based on wko_isp_varchar3
                                                        onChange={(event) => handleSwitchChange(event, innerRes.RowID)}
                                                      />
                                                </Grid>
                                                </Grid>
                                                <Grid item xs={12} mt={1.5}>
                                                <div style={{ width: '100%' }}>
                                                <DateTimePicker
                                                  label="Date"
                                                  value={formattedDate ? new Date(formattedDate) : null} 
                                                  format="dd/MM/yyyy HH:mm"
                                                  className="Extrasize chklist"
                                                  onChange={(newValue) => handleInputChangeDate(newValue, innerRes.RowID, 'wko_isp_datetime1')}
                                                  disabled={innerRes.wko_isp_varchar3 === '0'} 
                                                  renderInput={(params) => (
                                                      <TextField
                                                      {...params}
                                                      fullWidth
                                                      placeholder="dd/MM/yyyy"
                                                      sx={{ width: '100%' }}
                                                      margin="normal"
                                                      InputLabelProps={{
                                                        shrink: !!params.inputProps.value, // Shrinks the label only if there's a value
                                                      }}
                                                      slotProps={{
                                                          textField: {
                                                            fullWidth: true,
                                                          },
                                                        }}
                                                      />
                                                  )}
                                                  />
                                                  </div>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                label="Remark"
                                                fullWidth
                                                value={innerRes.wko_isp_varchar2}
                                               // onChange={(e) => handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2')}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (value.length <= 255) {
                                                    handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2');
                                                  }
                                                }}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                  }}
                                                  disabled={innerRes.wko_isp_varchar3 === '0'} 
                                                />
                                            </Grid>
                                            </Grid>
                                            
                                        </div>
                                        )}

                                        {innerRes.wko_isp_stp_datatype === "C" && (
                                          
                                            <div
                                              className="checkList_border"
                                              style={{
                                                borderLeft: innerRes.wko_isp_varchar3 === '0' ? '5px solid gray' : borderColor3,
                                              }}>
                                            <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between">
                                                <Grid item xs={4}>
                                                    <Typography>{`${innerRes.wko_isp_sec_no}.${innerRes.wko_isp_stp_no}: ${innerRes.wko_isp_stp_desc}`}</Typography>
                                                </Grid>

                                               <Grid item xs={4} onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                                               <Tooltip
                                                    title={
                                                      filteredImgResults.length > 0 &&
                                                      filteredImgResults.some((res) => res.stp_datatype === "C")
                                                        ? filteredImgResults.find((res) => res.stp_datatype === "C").stp_mst_file_name
                                                        : ''
                                                    }
                                                    placement="top"
                                                    arrow
                                                  >
                                                    {filteredImgResults.some((res) => res.stp_datatype === "C")
                                                      ? renderFileIcon(
                                                          filteredImgResults.find((res) => res.stp_datatype === "C").stp_mst_file_name,
                                                          filteredImgResults.find((res) => res.stp_datatype === "C").attachment
                                                        )
                                                      : null}
                                                  </Tooltip>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <Switch
                                                        checked={innerRes.wko_isp_varchar3 === '1'} // Set Switch state based on wko_isp_varchar3
                                                        onChange={(event) => handleSwitchChange(event, innerRes.RowID)}
                                                      />
                                                </Grid>
                                                </Grid>
                                                <Checkbox  
                                                    disabled={innerRes.wko_isp_varchar3 === '0'} 
                                                    checked={innerRes.wko_isp_checkbox1}
                                                    onChange={(e) => handleCheckboxChange(e, innerRes.RowID, 'wko_isp_checkbox1')}
                                                   
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                label="Remark"
                                                fullWidth
                                                value={innerRes.wko_isp_varchar2}
                                               // onChange={(e) => handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2')}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (value.length <= 255) {
                                                    handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2');
                                                  }
                                                }}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                  }}
                                                disabled={innerRes.wko_isp_varchar3 === '0'} 
                                                />
                                            </Grid>
                                            </Grid>
                                        </div>
                                        )}

                                        {innerRes.wko_isp_stp_datatype === "Z" && (
                                          
                                          <div
                                          className="checkList_border"
                                          style={{
                                            borderLeft: innerRes.wko_isp_varchar3 === '0' ? '5px solid gray' : borderColor4,
                                          }}>
                                            <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between">
                                                <Grid item xs={4}>
                                                    <Typography>{`${innerRes.wko_isp_sec_no}.${innerRes.wko_isp_stp_no}: ${innerRes.wko_isp_stp_desc}`}</Typography>
                                                </Grid>
                                                <Grid item xs={4} onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                                                 
                                                <Tooltip
                                                    title={
                                                      filteredImgResults.length > 0 &&
                                                      filteredImgResults.some((res) => res.stp_datatype === "Z")
                                                        ? filteredImgResults.find((res) => res.stp_datatype === "Z").stp_mst_file_name
                                                        : 'No file available'
                                                    }
                                                    placement="top"
                                                    arrow
                                                  >
                                                    {filteredImgResults.some((res) => res.stp_datatype === "Z")
                                                      ? renderFileIcon(
                                                          filteredImgResults.find((res) => res.stp_datatype === "Z").stp_mst_file_name,
                                                          filteredImgResults.find((res) => res.stp_datatype === "Z").attachment
                                                        )
                                                      : null}
                                                  </Tooltip>


                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Switch
                                                        checked={innerRes.wko_isp_varchar3 === '1'} // Set Switch state based on wko_isp_varchar3
                                                        onChange={(event) => handleSwitchChange(event, innerRes.RowID)}
                                                      />
                                                </Grid>
                                                </Grid>
                                                 <Grid item xs={12} mt={1}>
                                                <Autocomplete
                                                    options={ZoomData} // Ensure this is an array of objects
                                                    value={innerRes.wko_isp_dropdown1} // Use the correct default value
                                                 //   onChange={(e) => handleInputChange(e, innerRes.RowID, 'wko_isp_dropdown1')}
                                                    onChange={(e, value) => handleDropdownChange(e, value, innerRes.RowID,'wko_isp_dropdown1')}
                                                    //disabled // Conditionally disable
                                                    disabled={innerRes.wko_isp_varchar3 === '0'} 
                                                    renderInput={(params) => (
                                                        <TextField
                                                        {...params}
                                                        size="small"
                                                        placeholder="Select..."
                                                        variant="outlined"
                                                        fullWidth
                                                        className="wko_det_work_grp"
                                                        />
                                                    )}
                                                    />
                                                    </Grid>
                                                
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                label="Remark"
                                                fullWidth
                                                value={innerRes.wko_isp_varchar2}
                                                //onChange={(e) => handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2')}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (value.length <= 255) {
                                                    handleInputChange(e, innerRes.RowID, 'wko_isp_varchar2');
                                                  }
                                                }}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                  }}
                                               disabled={innerRes.wko_isp_varchar3 === '0'}   
                                                />
                                            </Grid>
                                            </Grid>
                                        </div>
                                       
                                        )}
      
                                    </Box>
                                  )
                                   })}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
       
        </div>
       
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            type="button"
            className="tabAddButton"
            disabled={data.statusKey === "CLO"}
            onClick={handleShow}
          >
            + Add Check List
          </Button>
        </div>
      </div>
          {/* Add check list popup model*/}
          <BootstrapDialog
               
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseModal(event, reason);
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={modalOpen}
                maxWidth="sm"
                fullWidth
              
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  Check List Master
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModal}
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
                <DialogContent dividers>
                <div className="TblSelect">
                    <CheckList
                      onRowClick={handleRowData2}
                      dataId = {RowID}
                     
                    />
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "flex-end", 
                  }}
                >
                  <div className="mlauto">
                    <Button variant="primary" className="SaveButton"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "8px",
                            fontSize: "13px",
                          }}
                          onClick={handleClose_Modal}>
                      Select
                    </Button>
                  </div>
                </DialogActions>
               
          </BootstrapDialog>

          {/* Add New check list popup model*/}
            <BootstrapDialog
               // onClose={handleCloseModalAddNew}
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleCloseModalAddNew(event, reason);
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={AddNewModalOpen}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  <Iconify icon="oui:list-add" />  Add  Check List
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseModalAddNew}
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
                <DialogContent dividers>
                <div className="TblSelect">
                    <AddCheckListForm
                      dataId = {selectedCheckList}
                      onRowClick={handleRowData3}
                      workOrderId ={RowID}
                      getEmptyData ={EmptyFormData}
                     
                    />
                  </div>
                </DialogContent>
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "flex-end", 
                  }}
                >
                  <div className="mlauto">
                    <Button variant="primary" className="SaveButton"
                          startIcon={<Iconify icon="mingcute:save-fill" />}
                          style={{
                            backgroundColor: "#4CAF50",
                            color: "white",
                            marginRight: "8px",
                            fontSize: "13px",
                          }}
                          onClick={SaveChkList}
                          //disabled = {AddFormData.length === 0 }
                        
                       >
                      Save
                    </Button>
                  </div>
                </DialogActions>
              </BootstrapDialog>          

    </>
  );
};

export default PmCheckList;
