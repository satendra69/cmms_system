import React, { useState, useEffect, useCallback } from 'react';
import Swal from "sweetalert2";
import {
    Checkbox,
    TextField,
    Typography,
    Button,
    Switch,
    Box,
  } from "@mui/material";
  
  import Grid from "@mui/material/Unstable_Grid2";
  import Autocomplete from "@mui/material/Autocomplete";
  import Tooltip from "@mui/material/Tooltip";
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

  import Iconify from "src/components/iconify";

  import httpCommon from "src/http-common";
  


const CheckListForm = ({ dataId ,onRowClick, workOrderId,getEmptyData}) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [getWorkOrderId, setWorkOrderId] = useState(workOrderId || "");
  const [switchStates, setSwitchStates] = useState([]);
 
  const [viewedRows, setViewedRows] = useState(0);
  const [inputValues, setInputValues] = useState([]);
  
  const [ZoomData,setZoomData] = useState([]);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get( `/get_check_list_by_id.php?site_cd=${site_ID}&Chk_name=${dataId}`) 
      .then((response) => {
       // console.log("response__add__", response);
        if (response.data.status === "SUCCESS") {
            const responseData = response.data.data.FormData;
            getEmptyData(responseData);
            let Get_Zoom = response.data.data.ZoomData.map(
                (item) => ({
                  label: item.stp_zom_data,
                  value: item.stp_zom_data,
                })
              );
            setData(responseData);
            setZoomData(Get_Zoom);
           
            setInputValues(
                responseData.map((item) => ({
                  ...item,
                  wko_isp_varchar1: '',
                  wko_isp_numeric1: '',
                  wko_isp_varchar2: '',
                  wko_isp_dropdown1: null,
                  wko_isp_checkbox1: false,
                  wko_isp_varchar3: true,
                  remark: '',
                }))
              );
        }
        Swal.close();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setSwitchStates(data.map(() => true)); 
  }, [data]);

  const renderFileIcon = (fileName) => {
    const fileExtension = fileName?.split('.').pop().toLowerCase();

    if (fileExtension === 'pdf') {
      return <Iconify icon="fluent:document-pdf-32-regular" />;     
    } else if(fileExtension === 'jpg') {
      return <Iconify icon="lets-icons:img-box-duotone-line" />;
    }
  };
  const handleFileClick = (innerRes) => {
    Swal.fire({
        title: `Please save the Check List first to view the attachment`,
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
  
  };

  // Handler for input changes
  const handleInputChange = useCallback((e, fieldType, index,innerRes) => {
    const value = parseFloat(e.target.value); 
    if (fieldType === "wko_isp_numeric1") {
        const minThreshold = parseFloat(innerRes.stp_mst_min_thr); 
        const maxThreshold = parseFloat(innerRes.stp_mst_max_thr);
        if (value < minThreshold || value > maxThreshold) {
            // Show alert message
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Invalid Input',
            //     text: `Value must be between ${minThreshold} and ${maxThreshold}`,
            //     allowOutsideClick: false,
            //     customClass: {
            //         container: "swalcontainercustom",
            //     },
            //     width: '350px', 
            //     didOpen: () => {
            //       const titleElement = Swal.getTitle();
            //       titleElement.style.fontSize = '14px'; 
            //     },
            // });

            // Highlight the Min/Max Typography components (you can adjust the styling as needed)
           
            if(value < minThreshold){
                document.querySelector('.checklist_Min').style.backgroundColor = 'red';
            }else{
                document.querySelector('.checklist_Max').style.backgroundColor = 'red';
            }
           
           
        } else {
            // Reset the highlight if the value is valid
            document.querySelector('.checklist_Max').style.backgroundColor = 'transparent';
            document.querySelector('.checklist_Min').style.backgroundColor = 'transparent';
        }
    }
    setInputValues(prev => {
      const newValues = [...prev];
      newValues[index] = {
        ...newValues[index],
        [fieldType]: e.target.value,
      };
      onRowClick(newValues); 
      return newValues;
    });
    // Pass the updated inputValues state
  }, [onRowClick]);
  
  const handleDropdownChange = (event, value, index) => {
    setInputValues(prev => {
      const newValues = [...prev];
      newValues[index] = {
        ...newValues[index],
        wko_isp_dropdown1: value,
      };
      onRowClick(newValues);
      return newValues;
    });
   
  };

  const handleCheckboxChange = (e, index) => {
    const { checked } = e.target;
    setInputValues(prev => {
      const newValues = [...prev];
      newValues[index] = {
        ...newValues[index],
        wko_isp_checkbox1: checked,
      };
      onRowClick(newValues);
      return newValues;
    });
   
  };
  const handleInputChangeDate = (e, fieldName, index) => {
    const { value } = e.target;

    setInputValues(prev => {
        const updatedValues = [...prev];
        updatedValues[index] = {
            ...updatedValues[index],
            [fieldName]: value, // This should now correctly handle the date value
        };
        onRowClick(updatedValues);
        return updatedValues;
    });
};

// Handle switch change
const handleSwitchChange = (event, index) => {
  const updatedSwitchStates = [...switchStates];
  updatedSwitchStates[index] = event.target.checked;
  setSwitchStates(updatedSwitchStates);

  // Update the input values state if needed
  setInputValues((prev) => {
    const newValues = [...prev];
    newValues[index] = {
      ...newValues[index],
      wko_isp_varchar3: event.target.checked, // Add this property to track the switch state
    };
    onRowClick(newValues);
    return newValues;
  });
};

  return (
    <>
    <div className="table-responsive">
    <Box ml={2} className="chkTabldiv">
  {data.map((innerRes, index) => {
    // Define border color based on some property
    
    const isFieldEmpty = !inputValues[index]?.wko_isp_varchar1 && !inputValues[index]?.remark;
    const isFieldEmptyNumeric = !inputValues[index]?.wko_isp_numeric1 && !inputValues[index]?.remark;
    const isFieldEmptyDate = !inputValues[index]?.wko_isp_datetime1 && !inputValues[index]?.remark;
    const isFieldEmptyCheckBox = !inputValues[index]?.wko_isp_checkbox1 && !inputValues[index]?.remark;
    const isFieldEmptyDropdown = !inputValues[index]?.wko_isp_dropdown1 && !inputValues[index]?.remark;
    const isDisabled = !switchStates[index]; // Disable if the switch is off
    
    let borderColor1;
    if (isDisabled) {
      borderColor1 = "5px solid gray"; // Gray border if disabled
    } else if (isFieldEmpty) {
      borderColor1 = "5px solid #E65100"; // Red border if fields are empty
    } else if (isFieldEmptyNumeric) {
      borderColor1 = "5px solid #E65100"; // Red border if fields are empty
    }else if (isFieldEmptyDate) {
      borderColor1 = "5px solid #E65100"; // Red border if fields are empty
    }else if (isFieldEmptyCheckBox) {
      borderColor1 = "5px solid #E65100"; // Red border if fields are empty
    }else if (isFieldEmptyDropdown) {
      borderColor1 = "5px solid #E65100"; // Red border if fields are empty
    } else {
      borderColor1 = "5px solid #2Ecc71"; // Green border if fields are not empty
    }
   
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
      <Box mb={1} key={index}>
        {innerRes.stp_datatype === "T" && (
      <div 
        className={`checkList_border Add `} 
        style={{ borderLeft: borderColor1 }}
      >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={10}>
                  <Typography>{`${innerRes.sec_no}.${innerRes.stp_no}: ${innerRes.stp_desc}`}</Typography>
                </Grid>

                <Grid item onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                    <Tooltip
                            title= {innerRes.stp_mst_file_name}
                            placement="top"
                            arrow
                        >
                            {renderFileIcon(innerRes.stp_mst_file_name)}
                        </Tooltip> 
                 </Grid>

                <Grid item>
                <Switch
                    checked={switchStates[index] || false} // Bind to switch state
                    onChange={(event) => handleSwitchChange(event, index)} // Handle change
                  />

                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Text"
                type="text"
                fullWidth
                value={inputValues[index]?.wko_isp_varchar1 || ""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                //onChange={(e) => handleInputChange(e, 'wko_isp_varchar1', index)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 255) {
                    handleInputChange(e, 'wko_isp_varchar1', index);
                  }
                }}
                disabled={isDisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Remark"
                fullWidth
                value={inputValues[index]?.remark || ""}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
               // onChange={(e) => handleInputChange(e, 'remark', index)}
               onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 255) {
                  handleInputChange(e, 'remark', index);
                }
              }}
                disabled={isDisabled}
              />
            </Grid>
          </Grid>

        </div>
        )}
      {innerRes.stp_datatype === "N" && (
        <div className="checkList_border Add" style={{ borderLeft: borderColor1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={10} >
                        <Typography>{`${innerRes.sec_no}.${innerRes.stp_no}: ${innerRes.job_mst_desc}`}</Typography>
                    </Grid>

                    <Grid item onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                    
                    <Tooltip
                            title= {innerRes.stp_mst_file_name}
                            placement="top"
                            
                            arrow
                        >
                            {renderFileIcon(innerRes.stp_mst_file_name)}
                        </Tooltip>
                        
                    </Grid>

                    <Grid item>
                      <Switch
                        checked={switchStates[index] || false} // Bind to switch state
                        onChange={(event) => handleSwitchChange(event, index)} // Handle change
                      />
                    </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    label="Number"
                    type="number"
                    fullWidth
                    value={inputValues[index]?.wko_isp_numeric1 || ""}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                  //  onChange={(e) => handleInputChange(e, 'wko_isp_numeric1', index,innerRes)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 11) {
                        handleInputChange(e, 'wko_isp_numeric1', index,innerRes);
                      }
                    }}
                    disabled={isDisabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    label="Remark"
                    fullWidth
                    value={inputValues[index]?.remark || ""}
                    margin="normal"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 255) {
                        handleInputChange(e, 'remark', index);
                      }
                    }}
                    //onChange={(e) => handleInputChange(e, 'remark', index)}
                    disabled={isDisabled}
                />
                </Grid>
                </Grid>

            <Grid container justifyContent="space-between" className="checklist_Min_max">
            <Grid item>
                <Typography className="checklist_Min">Min: {parseFloat(innerRes.stp_mst_min_thr).toString().replace(/\.0+$/, '')}</Typography>
            </Grid>
            <Grid item>
                <Typography className="checklist_Max">Max: {parseFloat(innerRes.stp_mst_max_thr).toString().replace(/\.0+$/, '')}</Typography>
            </Grid>
            <Grid item>
                <Typography>UOM: {innerRes.stp_mst_uom }</Typography>
            </Grid>
            </Grid>
        </div>
        )}
         {innerRes.stp_datatype === "D" && (
            <div className="checkList_border Add" style={{ borderLeft: borderColor1 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={10}>
                    <Typography>{`${innerRes.sec_no}.${innerRes.stp_no}: ${innerRes.stp_desc}`}</Typography>
                </Grid>

                <Grid item onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                
                <Tooltip
                    title= {innerRes.file_name}
                    placement="top"
                    
                    arrow
                    >
                        {renderFileIcon(innerRes.stp_mst_file_name)}
                    </Tooltip>
                </Grid>

                <Grid item>
                  <Switch
                    checked={switchStates[index] || false} // Bind to switch state
                    onChange={(event) => handleSwitchChange(event, index)} // Handle change
                  />
                </Grid>
                </Grid>
                <Grid item xs={12} mt={1.5}>
                 
                    <DateTimePicker
                        label="Date"
                        value={inputValues[index]?.wko_isp_datetime1 || "dd/MM/yyyy HH:mm"}
                        format="dd/MM/yyyy HH:mm"
                         className="Extrasize"
                         disabled={isDisabled}
                       onChange={(newValue) => handleInputChangeDate({ target: { value: newValue } }, 'wko_isp_datetime1', index)}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            fullWidth
                            sx={{ width: '100%' }}
                            margin="normal"
                            slotProps={{
                                textField: {
                                  fullWidth: true,
                                },
                              }}
                            />
                        )}
                        />
                </Grid>
            </Grid>
            <Grid item xs={12}>
            <TextField
                label="Remark"
                fullWidth
                value={inputValues[index]?.remark || ""}
                margin="normal"
                InputLabelProps={{
                shrink: true,
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 255) {
                    handleInputChange(e, 'remark', index);
                  }
                }}
               // onChange={(e) => handleInputChange(e, 'remark', index)}
                disabled={isDisabled}
                />
            </Grid>
            </Grid>
            
        </div>
        )}
            {innerRes.stp_datatype === "C" && (
                <div className="checkList_border Add" style={{ borderLeft: borderColor1 }}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={10}>
                        <Typography>{`${innerRes.sec_no}.${innerRes.stp_no}: ${innerRes.sec_desc}`}</Typography>
                    </Grid>

                    <Grid item onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                        <Tooltip
                        title= {innerRes.stp_mst_file_name }
                        placement="top"
                        
                        arrow
                        >
                            {renderFileIcon(innerRes.stp_mst_file_name)}
                        </Tooltip>
                    </Grid>

                    <Grid item>
                      <Switch
                        checked={switchStates[index] || false} // Bind to switch state
                        onChange={(event) => handleSwitchChange(event, index)} // Handle change
                      />
                    </Grid>
                    </Grid>
                    <Checkbox
                    checked={inputValues[index]?.wko_isp_checkbox1 || false}
                    onChange={(e) => handleCheckboxChange(e, index)}
                    disabled={isDisabled}
                    />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    label="Remark"
                    fullWidth
                    value={inputValues[index]?.remark || ""}
                    margin="normal"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 255) {
                        handleInputChange(e, 'remark', index);
                      }
                    }}
                   // onChange={(e) => handleInputChange(e, 'remark', index)}
                    disabled={isDisabled}
                />
                </Grid>
                </Grid>
            </div>
            )}
            {innerRes.stp_datatype === "Z" && (
                                          
                <div className="checkList_border Add" style={{ borderLeft: borderColor1 }}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={10}>
                        <Typography>{`${innerRes.sec_no}.${innerRes.stp_no}: ${innerRes.sec_desc}`}</Typography>
                    </Grid>
                    <Grid item onClick={handleFileClick} style={{ cursor: 'pointer' }}>
                        <Tooltip
                        title= {innerRes.stp_mst_file_name}
                        placement="top"
                        
                        arrow
                        >
                            {renderFileIcon(innerRes.stp_mst_file_name)}
                        </Tooltip>
                    </Grid>

                    <Grid item >
                      <Switch
                        checked={switchStates[index] || false} 
                        onChange={(event) => handleSwitchChange(event, index)} // Handle change
                      />
                    </Grid>
                    </Grid>
                        <Grid item xs={12} mt={1}>
                    <Autocomplete
                        options={ZoomData} // Ensure this is an array of objects
                        value={inputValues[index]?.wko_isp_dropdown1 || null}
                        onChange={(event, value) => handleDropdownChange(event, value, index)}
                        //disabled // Conditionally disable
                        disabled={isDisabled}
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
                    value={inputValues[index]?.remark || ""}
                    margin="normal"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    disabled={isDisabled}
                   // onChange={(e) => handleInputChange(e, 'remark', index)}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 255) {
                        handleInputChange(e, 'remark', index);
                      }
                    }}
                />
                </Grid>
                </Grid>
            </div>
            
            )}
           
      </Box>
     
       
    );
   
  })}
   
</Box>

    </div>
    
  </>
  );
};

export default CheckListForm;
