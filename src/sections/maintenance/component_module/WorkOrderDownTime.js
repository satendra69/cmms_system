import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";


import { useLocation } from "react-router-dom";
import httpCommon from "src/http-common";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Swal from "sweetalert2";

import { Menu, MenuItem } from "@mui/material";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { styled } from "@mui/material/styles";

import Moment from "moment";
import "moment-timezone";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Iconify from "src/components/iconify";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useSwalCloseContext } from "src/sections/ContextApi/SwalCloseContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));


const WorkOrderDownTime = ({ onRowClick, data, onDataFromSecondComponent }) => {
  let site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const { RowID } = data;
  const { Asset_No } = data;
  const { WorkOrderNo } = data;
  const { OrigiDate } = data;
  const {swalCloseTime} = useSwalCloseContext();

  const [FormStatus, setFormStatus] = useState(data.formStatus);

  const location = useLocation();
  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [show, setShow] = useState(false);
  //const [showModal, setShowModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  
  const [EmployeeID, setEmployeeID] = useState([]);
  const [selected_EmployeeID, setSelected_EmployeeID] = useState([]);

  const [Craft, setCraft] = useState([]);
  const [selected_Craft, setSelected_Craft] = useState([]);


  const [TimeCardDate, setTimeCardDate] = useState(OrigiDate);
  const [EndTimeCardDate, setEndTimeCardDate] = useState(null);
  const [RepairFromDate, setRepairFromDate] = useState();
  const [RepairToDate, setRepairToDate] = useState();
  const [DownTimeData, setDownTimeData] = useState();
  const [RepairTimeData, setRepairTimeData] = useState();
  const [RemarkData, setRemarkData] = useState();
  const [UnplannedDowntime, setUnplannedDowntime] = useState("0");


  const [HourType, setHourType] = useState([]);
  //const [selected_HourType, setSelected_HourType] = useState([]);

  //const [ActualHour, setActualHour] = useState("0");

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  //const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState([]);

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  const [CreditCostCenter, setCreditCostCenter] = useState([]);
  //const [selected_CreditCostCenter, setSelected_CreditCostCenter] = useState([]);

  const [CreditAccount, setCreditAccount] = useState([]);
  //const [selected_CreditAccount, setSelected_CreditAccount] = useState([]);


  const [wkoMstLabel, setWkoMstLabel] = useState([]);
  const [MaterialMandatoryFiled, setMaterialMandatoryFiled] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRowIndex, setMenuRowIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const [EditRowId,setEditRowId] = useState("");
  const [EditAssetNo,setEditAssetNo] = useState("");
  const [EditOutServiceDate,setEditOutServiceDate] = useState();
  const [EditReturntoServiceDate,setEditReturntoServiceDate] = useState();
  const [EditDownTime,setEditDownTime] = useState("");
  const [EditRepairFrom,setEditRepairFrom] = useState();
  const [EditRepairTo,setEditRepairTo] = useState();
  const [EditRepairTime,setEditRepairTime] = useState("");
  const [EditRemark,setEditRemark] = useState("");
  const [EditUnplannedDowntime,setEditUnplannedDowntime] = useState("");

  const handleMenuClick = (event, index) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpen(true);
    setMenuRowIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
    setMenuRowIndex(null);
  };

  const handleEdit = (data) => {
    // Handle edit logic here
   // console.log("Edit row:",data);
    setEditRowId(data.RowID);
    setEditAssetNo(data.ast_dwntime_asset_no);
    setEditOutServiceDate(formatDateToPicker(data.ast_dwntime_out_date));
    setEditReturntoServiceDate(formatDateToPicker(data.ast_dwntime_rts_date));
    setEditDownTime(convertMinutesToDHMS(data.ast_dwntime_downtime));
    setEditRepairFrom(formatDateToPicker(data.ast_dwntime_repair_from));
    setEditRepairTo(formatDateToPicker(data.ast_dwntime_repair_to));
    setEditRepairTime(convertMinutesToDHMS(data.ast_dwntime_repairtime));
    setEditRemark(data.ast_dwntime_remark);
    setEditUnplannedDowntime(data.ast_dwntime_sched_flag);
  
    setShowModal(true);
    handleMenuClose();
  };
  
  const handleDelete = async (data) => {
    // Handle delete logic here
  //  console.log(`Delete row: ${data.RowID}`);
    const dltId = data.RowID;
    handleMenuClose();
    if(dltId !== ""){
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => { 
        if (result.isConfirmed) {
         
          try {
            const response = await httpCommon.get(
              `/delete_work_order_down_time.php?site_cd=${site_ID}&RowID=${dltId}`
            );
        
         if (response.data && response.data.status === "SUCCESS") {
          Swal.fire({
            title: "Deleted!",
            text: response.data.message,
            icon: "success"
          });
          // fetchData(); // Uncomment if needed
        
            get_workorder_downTime(site_ID, WorkOrderNo);
        } else if (response.data && response.data.status === "ERROR") {
          Swal.fire({
            title: "Oops!",
            text: response.data.message,
            icon: "error"
          });
        }
          
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          
        }
      });
  
    }
  }; 

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        if(FormStatus !== "" && FormStatus == "NEW" ){
          await get_workorder_downTime_header(site_ID);
        }else{
          await get_workorder_downTime(site_ID, WorkOrderNo);
        }
        get_workorder_status(site_ID, "All");
        await getWorkOrderMiscMandatoryfiled();
        await getWorkOrderMiscFromLebel();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    fetchData();
  }, [site_ID, RowID, location]);

  // Get Header Data
  const get_workorder_downTime = async (site_ID, WorkOrderNo) => {
    try {
      const response = await httpCommon.get(
        `/get_workorder_downTime.php?site_cd=${site_ID}&workOrderNo=${WorkOrderNo || ""}`
      );
    //     console.log("responce___gettime___",response);
      if (response.data.status === "SUCCESS") {
      
        setHeader(response.data.data.header);
        setResult(response.data.data.result);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };
 
  const get_workorder_downTime_header = async (site_ID,WorkOrderNo) =>{
    try {
      const response = await httpCommon.get(
        `/get_workorder_downTime.php?site_cd=${site_ID}&workOrderNo=${WorkOrderNo || ""}`
      );
    //     console.log("responce___gettime___",response);
      if (response.data.status === "SUCCESS") {
      
        setHeader(response.data.data.header);
       // setResult(response.data.data.result);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  }
  const get_workorder_status = async (site_ID, type) => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `get_dropdown.php?site_cd=${site_ID}&type=${type}`
      );
     // console.log("TimeCard Responce____",response);
      if (response.data.status === "SUCCESS") {
        let EmployeeID = response.data.data.Employee_List_Supervisor_Id.map(
          (item) => ({
            label: item.emp_mst_empl_id + " : " + item.emp_mst_name,
            value: item.emp_mst_empl_id,
          })
        );
        setEmployeeID(EmployeeID);

        let Craft = response.data.data.Employee_Primary_Craft.map((item) => ({
          label: item.crf_mst_crf_cd + " : " + item.crf_mst_desc,
          value: item.crf_mst_crf_cd,
        }));
        // setCraft(Craft);

        let HourType = response.data.data.HoursType.map((item) => ({
          label: item.hours_type_cd,
          value: item.hours_type_cd,
        }));
        setHourType(HourType);

        let ChargeCostCenter = response.data.data.CostCenter.map((item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.costcenter,
        }));
        setChargeCostCenter(ChargeCostCenter);

        let ChargeAccount = response.data.data.account.map((item) => ({
          label: item.account + " : " + item.descs,
          value: item.account,
        }));
        setChargeAccount(ChargeAccount);

        let CreditCostCenter = response.data.data.CostCenter.map((item) => ({
          label: item.costcenter + " : " + item.descs,
          value: item.costcenter,
        }));
        setCreditCostCenter(CreditCostCenter);

        let CreditAccount = response.data.data.account.map((item) => ({
          label: item.account + " : " + item.descs,
          value: item.account,
        }));
        setCreditAccount(CreditAccount);

        Swal.close();
      } else {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };

  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      //color:"#000",
       textAlign: "center"
    };
    return (
      <>
       <TableCell key="action" style={cellStyle}>
                Action
            </TableCell>
        {Object.keys(Header).map((attr) => (
          <TableCell key={attr} style={cellStyle}>
            {attr}
          </TableCell>
        ))}
      </>
    );
  };
 
  const formatDateToPicker = (dateObject) => {
    if (!dateObject || !dateObject.date) {
      return null; // Return null for invalid inputs
    }
  
    try {
      // Remove fractional seconds
      const dateString = dateObject.date.split(".")[0]; // "2024-11-12 10:49:47"
  
      // Replace space with 'T' to make it ISO-compatible
      const normalizedDateString = dateString.replace(" ", "T"); // "2024-11-12T10:49:47"
  
      // Create a Date object
      return new Date(normalizedDateString);
    } catch (error) {
      console.error("Error formatting date for DateTimePicker:", error);
      return null; // Return null for errors
    }
  };
  
  const formatDate = (dateObject) => {
   
    if (!dateObject) {
      return ''; // or any default value you prefer
    }
    const date = new Date(dateObject.date);
//console.log("date_____",date);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");


    //console.log("day_____",day);
    //console.log("month_____",month);
   // console.log("year_____",year);
    //console.log("hours_____",hours);
   // return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
   return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const convertMinutesToDHMS = (totalMinutes) => {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
  
    return `${days}d:${hours}h:${minutes}m`;
  };
 
  const renderTableRows = () => {
    return Result.map((result, index) => (
      <TableRow key={index}
     
      style={{ cursor: "pointer", transition: "background-color 0.3s" }}
      onMouseEnter={(event) => event.currentTarget.style.backgroundColor = "#f0f0f0"}
      onMouseLeave={(event) => event.currentTarget.style.backgroundColor = "transparent"}
      >
         <TableCell style={{ padding: "5px", textAlign: "center" }}>
            <IconButton 
                    onClick={(event) => {
                        event.stopPropagation(); // Prevent the event from bubbling up to the TableRow
                        handleMenuClick(event, index);
                    }}
                >
                   <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={menuRowIndex === index}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem key={index}
            onClick={(event) => {
              event.stopPropagation(); 
              handleEdit(result, event);
            }}

            > <Iconify icon="solar:pen-bold" width="15px" height="15px" marginRight="5px"/> Edit</MenuItem>
            <MenuItem 
            onClick={(event) => {
              event.stopPropagation(); 
              handleDelete(result, event);
            }}
            > <Iconify icon="solar:trash-bin-trash-bold" width="15px" height="20px" marginRight="5px"/> Delete</MenuItem>
          </Menu>
        </TableCell>
       
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
            {result.ast_dwntime_asset_no}
        </TableCell>

        <TableCell style={{ padding: "10px", textAlign: "center" }}>
        {formatDate(result.ast_dwntime_out_date)}
        </TableCell>

        <TableCell style={{ padding: "10px", textAlign: "center" }}>
        {formatDate(result.ast_dwntime_rts_date)}
        </TableCell>

        <TableCell style={{ padding: "10px 0px", textAlign: "center" }}>
        {convertMinutesToDHMS(result.ast_dwntime_downtime)}
        </TableCell>

        <TableCell style={{ padding: "10px 0px", textAlign: "center" }}>
         {formatDate(result.ast_dwntime_repair_from)}
        </TableCell>

        <TableCell style={{ padding: "10px", textAlign: "center" }}>
         {formatDate(result.ast_dwntime_repair_to)}
        </TableCell>

        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {convertMinutesToDHMS(result.ast_dwntime_repairtime)}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.ast_dwntime_remark}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          <FormControlLabel
            value="top"
            
            control={
              <Checkbox
                checked={result.ast_dwntime_sched_flag === "1"}
                
              />
            }
          />
        </TableCell>
        
      </TableRow>
    ));
  };

  const totalQty = Result.reduce(
    (acc, item) => acc + (parseFloat(item.wko_ls8_hrs) || 0),
    0
  );
  const totalCost = Result.reduce(
    (acc, item) =>
      acc +
      (parseFloat(item.wko_ls8_hrs) || 0) *
        (parseFloat(item.wko_ls8_act_cost) || 0),
    0
  );
  const formattedTotalCost = totalCost.toLocaleString('en-US');
  const formattedtotalQty  = totalQty.toLocaleString('en-US');

  const resetData = () => {

    setEndTimeCardDate(null);
    setRepairFromDate("");
    setRepairToDate("");
    setDownTimeData("");
    setRepairTimeData("");
    setRemarkData("");
    setUnplannedDowntime("0");
  
  };
 
  const handleChange = (checked) => {
    setUnplannedDowntime(checked ? "1" : "0");
  };

  const handleChangeEdit = (checked) => {
    setEditUnplannedDowntime(checked ? "1" : "0");
  };

 
  const handleTimeCardDate = (newDate) =>{
    const newDateMs = newDate?.getTime();
    if (EndTimeCardDate) {
      const timeCardDateMs = EndTimeCardDate.getTime();
  
      if (!isNaN(timeCardDateMs)) {

        const differenceMs = timeCardDateMs - newDateMs;
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
    
        const formattedDownTime = `${days}d:${hours}h:${minutes}m`;
        setDownTimeData(formattedDownTime);
        setTimeCardDate(newDate);

      } else {
       
        setTimeCardDate(newDate); 
      }
    } else {
     
      setTimeCardDate(newDate); 
    }
   
  }
  const handleEndTimeChange = (newDate) => {
  
    const timeCardDateMs = TimeCardDate?.getTime();
    const newDateMs = newDate?.getTime();

    if (newDateMs <= timeCardDateMs) {
    
      toast.error(`Return to service Date must greater then Out Service Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
            width: "450px", 
        }
    });
    setDownTimeData(""); 
    setEndTimeCardDate(null);
   
    } else {
    
      const differenceMs = newDateMs - timeCardDateMs;
      // Calculate days, hours, and minutes
      const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
  
      // Format the result as "1d:0h:0m"
      const formattedDownTime = `${days}d:${hours}h:${minutes}m`;
      setDownTimeData(formattedDownTime);
      setEndTimeCardDate(newDate);
    }
  };

  // const handleRePairFromChange = (newDate) => {

  //   if (newDate <= TimeCardDate) {
      
  //     toast.error(`Repair From must greater then Out Service Date`, {
  //       position: "top-center",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //       transition: Bounce,
  //       style: {
  //           width: "450px", 
  //       }
  //   });
  //     setRepairFromDate(newDate);
  //   }else{
  //     setRepairFromDate(newDate);
  //   }
    
  // };  

  const handleRePairFromChange = (newDate) => {
    if (newDate <= TimeCardDate) {
     
      toast.error(`Repair From must be greater than Out Service Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "450px",
        },
      });
      setRepairFromDate(null); // Clear the value
    } else if (EndTimeCardDate && newDate >= EndTimeCardDate) {
     
      toast.error(`Repair From must be less than Return to Service Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "450px",
        },
      });
      setRepairFromDate(null); // Clear the value
    } else {
      // Set the value if within the valid range
      setRepairFromDate(newDate);
    }
  };

  
  const handleReairToFromChange = (newDate) => {

    const newDateTime = new Date(newDate).getTime(); // Convert to timestamp
    const repairFromDateTime = new Date(RepairFromDate).getTime();
    const endTimeCardDateTime = EndTimeCardDate ? new Date(EndTimeCardDate).getTime() : null;

    if (newDateTime <= repairFromDateTime) {
     
      toast.error(`Repair To must be greater than Repair From Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "450px",
        },
      });
      setRepairTimeData(""); 
      setRepairToDate(null);
    }else if (endTimeCardDateTime && newDateTime >= endTimeCardDateTime) {
     
      toast.error(`Repair To must be less than Return to Service Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "450px",
        },
      });
      setRepairTimeData(""); 
      setRepairToDate(null);
    }else {
      
      const differenceMs = newDate - RepairFromDate;
  
      // Calculate days, hours, and minutes
      const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
  
      // Format the result as "1d:0h:0m"
      const formattedDownTime = `${days}d:${hours}h:${minutes}m`;
      setRepairTimeData(formattedDownTime);
      setRepairToDate(newDate);
    }
   
}

function convertToMinutes(timeString) {
  const regex = /(\d+)d:(\d+)h:(\d+)m/;
  const match = timeString.match(regex);

  if (match) {
    const days = parseInt(match[1], 10);
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    // Convert days, hours, and minutes to milliseconds
    
    const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
    return totalMinutes;
  }

  return 0; // Return 0 if the string is not in the correct format
}
  //onChange={handlePeairFromChange}  setRepairFromDate(newDate); 

  const handleSubmitDownTime = async () => {
    
      if (EndTimeCardDate && EndTimeCardDate <= TimeCardDate) {
       // console.log("EndTimeCardDate is not greater than TimeCardDate");
        toast.error(`Return to service Date must greater then Out Service Date`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          style: {
              width: "450px", 
          }
      });
    } else if (RepairFromDate && RepairFromDate <= TimeCardDate) {
     
        toast.error(`Repair From must greater then Out Service Date`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          style: {
              width: "450px", 
          }
      });
        
      
   
    } else if (RepairToDate && RepairToDate <= RepairFromDate) {
      
        toast.error(`Repair To must greater then Repair From`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          style: {
              width: "450px", 
          }
      });
        
      

    }  else {
    
      let EmptyAsset;
    if (Asset_No == "" || Asset_No == null) {
      EmptyAsset = "";
    } else {
      // Asset_No = selected_Asset_No.label.split(":")
      const EmptyAssetSplit = Asset_No.split(":");
      EmptyAsset = EmptyAssetSplit[0];
    }
  
    let downTimeMilliseconds;
    if (DownTimeData == "" || DownTimeData == null) {
      downTimeMilliseconds = "";
    } else {
     
      downTimeMilliseconds = convertToMinutes(DownTimeData);
    }

    let repairTimeMilliseconds;
    if (RepairTimeData == "" || RepairTimeData == null) {
      repairTimeMilliseconds = "";
    } else {
     
      repairTimeMilliseconds = convertToMinutes(RepairTimeData);
    }


      let date_1 = "";
      if (TimeCardDate == "" || TimeCardDate == null) {
        date_1 = "";
      } else {
        date_1 = Moment(TimeCardDate).format("yyyy-MM-DD HH:mm:ss").trim();
      }

      let date_2 = "";
      if (EndTimeCardDate == "" || EndTimeCardDate == null) {
        date_2 = "";
      } else {
        date_2 = Moment(EndTimeCardDate).format("yyyy-MM-DD HH:mm:ss").trim();
      }

      let date_3 = "";
      if (RepairFromDate == "" || RepairFromDate == null) {
        date_3 = "";
      } else {
        date_3 = Moment(RepairFromDate).format("yyyy-MM-DD HH:mm:ss").trim();
      }

      let date_4 = "";
      if (RepairToDate == "" || RepairToDate == null) {
        date_4 = "";
      } else {
        date_4 = Moment(RepairToDate).format("yyyy-MM-DD HH:mm:ss").trim();
      }
 
      var json_workorderTimeCart = {
        site_cd: site_ID,
        wko_mst_wo_no: WorkOrderNo,
        mst_RowID: RowID,
        assetno: EmptyAsset,
        downTimeData: downTimeMilliseconds,
        repairTimeData:repairTimeMilliseconds,
    
        TimeCardDate: date_1,
        EndTimeCardDate: date_2,
        RepairFromDate:date_3,
        RepairToDate:date_4,
        RemarkData:RemarkData ? RemarkData :"",
        UnplannedDowntime: UnplannedDowntime,
        auditUser: emp_owner,
      };
     
      try {
        Swal.fire({
          title: "Please Wait!",
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
        Swal.showLoading();
        const response = await httpCommon.post(
          "/insert_work_order_asset_downtime.php",
          JSON.stringify(json_workorderTimeCart)
        );
    //   console.log("response___downtime_insert_",response);
        if (response.data.status == "SUCCESS") {
         
          Swal.close();
          Swal.fire({
            title: "Down Time!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            
            get_workorder_downTime(site_ID, WorkOrderNo);

            if (result.isConfirmed) {
              
              handleClose();
            }
          });
         
        }
      } catch (error) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops get_sitecode...",
          text: error,
        });
      }
    }
  
  };
  const handleClose = () => {
    setShow(false);
    resetData();
  };
 
   // Get All Filed label Name
   const getWorkOrderMiscFromLebel = async () => {
    try {
      const response = await httpCommon.get("/get_work_order_down_time_form_labal.php");
      if (response.data.status === "SUCCESS") {
        setWkoMstLabel(response.data.data.wko_ls8);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const getWorkOrderMiscMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_work_order_down_time_mandatory_filed.php");
      
      if (response.data && response.data.data && response.data.data.MandatoryField) {
  
        if (response.data.data.MandatoryField.length > 0) {
          
          setMaterialMandatoryFiled(response.data.data.MandatoryField);
  
        }
  
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const findCustomizeLabel = (columnName) => {
    if (!Array.isArray(wkoMstLabel)) return "";
    const matchingColumn = wkoMstLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  
  };
 
  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = MaterialMandatoryFiled.find(item => item.column_name === columnName);
    if (foundItem && foundItem.cf_label_required === "1") {
        return "Requiredlabel";
    }
    return "";
  };

  const handleEditTimeCardDate = (newDate) =>{
    const newDateMs = newDate?.getTime();
    if (EditReturntoServiceDate) {
      const timeCardDateMs = EditReturntoServiceDate.getTime();
  
      if (!isNaN(timeCardDateMs)) {

        const differenceMs = timeCardDateMs - newDateMs;
        const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
    
        const formattedDownTime = `${days}d:${hours}h:${minutes}m`;
        setEditDownTime(formattedDownTime);
        setEditOutServiceDate(newDate);

      } else {
       
        setEditOutServiceDate(newDate); 
      }
    } else {
     
      setEditOutServiceDate(newDate); 
    }
   
  }

  const handleEndTimeChangeEdit = (newDate) => {

    const EdittimeCardDateMs = EditOutServiceDate?.getTime();
    const newDateMs = newDate?.getTime();

    if (newDateMs <= EdittimeCardDateMs) {
      
      toast.error(`Return to service Date must greater then Out Service Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
            width: "450px", 
        }
    });
      setEditDownTime(""); 
      setEditReturntoServiceDate(null);
     
    } else {
    
      const differenceMs = newDateMs - EdittimeCardDateMs;
  
      // Calculate days, hours, and minutes
      const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
  
      // Format the result as "1d:0h:0m"
      const formattedDownTime = `${days}d:${hours}h:${minutes}m`;
      setEditDownTime(formattedDownTime);
      setEditReturntoServiceDate(newDate);
    }
  };

  const handlePeairFromChangeEdit = (newDate) => {
    
    if (newDate <= EditOutServiceDate) {
      
      toast.error(`Repair From must be greater than Out Service Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "450px",
        },
      });
      setEditRepairFrom(null);
    }else if (EditReturntoServiceDate && newDate >= EditReturntoServiceDate) {
     
      toast.error(`Repair From must be less than Return to Service Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "450px",
        },
      });
      setEditRepairFrom(null); // Clear the value
    }else{
      setEditRepairFrom(newDate);
    }
    
  }; 

  const handleReairToFromChangeEdit = (newDate) => {
  
    const newDateTime = new Date(newDate).getTime(); 
    const repairFromDateTime = new Date(EditRepairFrom).getTime();
    const endTimeCardDateTime = EditReturntoServiceDate ? new Date(EditReturntoServiceDate).getTime() : null;

    if (newDateTime <= repairFromDateTime) {
     
      toast.error(`Repair To must be greater than Repair From Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "450px",
        },
      });
      setEditRepairTime(""); 
      setEditRepairTo(null);
    }else if (endTimeCardDateTime && newDateTime >= endTimeCardDateTime) {
     
      toast.error(`Repair To must be less than Return to Service Date`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        style: {
          width: "450px",
        },
      });
      setEditRepairTime(""); 
      setEditRepairTo(null);
    }else {
       
      const differenceMs = newDate - EditRepairFrom;
  
      // Calculate days, hours, and minutes
      const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
  
      // Format the result as "1d:0h:0m"
      const formattedDownTime = `${days}d:${hours}h:${minutes}m`;
      setEditRepairTime(formattedDownTime);
      setEditRepairTo(newDate);
    }
  
 }

   // Handel Update button click
   const handleUpdateButtonClick = async (e) =>{
    Swal.fire({
      title: "Loading.... !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();

   let downTimeMilliseconds;
   if (EditDownTime == "" || EditDownTime == null) {
     downTimeMilliseconds = "";
   } else {
    
     downTimeMilliseconds = convertToMinutes(EditDownTime);
   }

   let repairTimeMilliseconds;
   if (EditRepairTime == "" || EditRepairTime == null) {
     repairTimeMilliseconds = "";
   } else {
    
     repairTimeMilliseconds = convertToMinutes(EditRepairTime);
   }

     let date_1 = "";
     if (EditOutServiceDate == "" || EditOutServiceDate == null) {
       date_1 = "";
     } else {
       date_1 = Moment(EditOutServiceDate).format("yyyy-MM-DD HH:mm:ss").trim();
     }

     let date_2 = "";
     if (EditReturntoServiceDate == "" || EditReturntoServiceDate == null) {
       date_2 = "";
     } else {
       date_2 = Moment(EditReturntoServiceDate).format("yyyy-MM-DD HH:mm:ss").trim();
     }

     let date_3 = "";
     if (EditRepairFrom == "" || EditRepairFrom == null) {
       date_3 = "";
     } else {
       date_3 = Moment(EditRepairFrom).format("yyyy-MM-DD HH:mm:ss").trim();
     }

     let date_4 = "";
     if (EditRepairTo == "" || EditRepairTo == null) {
       date_4 = "";
     } else {
       date_4 = Moment(EditRepairTo).format("yyyy-MM-DD HH:mm:ss").trim();
     }


    var json_UpdateDownTime = {
      site_cd: site_ID,
      EditAssetNo:EditAssetNo.trim(),
      EditOutServiceDate:date_1,
      EditReturntoServiceDate:date_2,
      EditDownTime:downTimeMilliseconds,
      EditRepairFrom:date_3,
      EditRepairTo:date_4,
      EditRepairTime:repairTimeMilliseconds,
      EditRemark:EditRemark ? EditRemark :"",
      EditUnplannedDowntime:EditUnplannedDowntime,
      RowID:EditRowId,
      wko_mst_wo_no: WorkOrderNo,
      auditUser:emp_owner,
    }
  // console.log("json_UpdateAsset_____",json_UpdateDownTime);
    //update_asset_Specification
    try {
      const response = await httpCommon.post(
        "/update_word_order_down_time.php",
        JSON.stringify(json_UpdateDownTime)
      );
    //  console.log("json_Asset Data", response);
      if (response.data.status === "SUCCESS") {
         Swal.close();
        
         Swal.fire({
           icon: "success",
           customClass: {
             container: "swalcontainercustom",
           },
           title: response.data.status,
           text: response.data.message,
           timer: swalCloseTime, 
          timerProgressBar: true, 
          willClose: () => {
            
           // setResult([...Result, inputFields]);
            get_workorder_downTime(site_ID, WorkOrderNo);
      
           
               handleCloseModal();
            
          },
         }).then((result) => {
          if (result.dismiss !== Swal.DismissReason.timer) {
        //  setResult([...Result, inputFields]);
          get_workorder_downTime(site_ID, WorkOrderNo);
    
          if (result.isConfirmed) {
             handleCloseModal();
          }
        }
        });
       }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops somthing is wrong...",
        text: error,
      });
    }
  }
  const handleShow = () => {
         
    if(FormStatus !== "" && FormStatus == "NEW" ){
      Swal.fire({
        icon: "info",
        customClass: {
          container: "swalcontainercustom",
        },
        title: "Please Wait!",
        allowOutsideClick: false,
        text: "Once the Work Order is created, you can then add detailed DownTime.",
        width:"400px"
      });
      onRowClick("BtnDownTime");
    }else{
        setShow(true);
       
    }
  };
  //  console.log("OrigiDate_____",Asset_No);
  return (
    <>
      <div>
        <div className="card">
          <div
            className="card-body"
            style={{
              borderRadius: "8px",
              boxShadow: "2px 2px 15px 2px #f0f0f0",
              paddingBottom: "10px",
            }}
          >
            <div>
              <div style={{ backgroundColor: "white" }}>
                <div
                  className="template-demo"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div style={{ marginRight: "0px",marginTop:"5px" }}>
                   
                    <Iconify
                    icon="guidance:time"
                    style={{ marginRight: '4px',width: "20px", height: "20px" }}
                  />
                  </div>
                  <div
                    className="template-demo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ marginRight: "0px", fontWeight: "bold" }}>
                      DownTime
                    </div>
                    {/* <div className="TimeCartPartCosting">
                     Total Hour {" "}
                      <span style={{ color: "blue" }}>
                        {formattedtotalQty}
                      </span>{" "},
                      Total Time Card Cost {" "}
                      <span style={{ color: "#19d895" }}>
                        ${formattedTotalCost}
                      </span>
                    </div> */}
                  </div>
                  <div
                      style={{
                        marginLeft: "auto", // Push button to the right
                        marginTop:"3px",
                        marginBottom:"7px"
                      }}
                    >
                     
                  <Button
                    type="button"
                   className="SubmoduleAddNewButton"
                    disabled={data.statusKey === "CLO"}
                    onClick={handleShow}
                    >
                    + Add
                  </Button>

                  
                    </div>

                    
                </div>
              </div>
            </div>
           
            <div className="table-responsive ">
            <TableContainer component={Paper} className={Result && Result.length > 0 ? "tablesubModule" : ""}>
                <Table>
                  <TableHead>
                    <TableRow>{renderTableHeader()}</TableRow>
                  </TableHead>
                  <TableBody>{renderTableRows()}</TableBody>
                </Table>
              </TableContainer>
            </div>
           
            <div>
              <Dialog
              
                onClose={(event, reason) => {
                  if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleClose(event, reason);
                  }
                }}
                aria-labelledby="customized-dialog-title"
                open={show}
                maxWidth="sm"
                fullWidth
                disableBackdropClick
                sx={{
                  width: "100vw",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "20px",
                }}
              >
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                
                  <Iconify
                    icon="guidance:time"
                    style={{ marginRight: '4px',width: "20px", height: "20px" }}
                  />
                  DownTime
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    padding:"0px !important",
                    margin:"5px !important"
                    //color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <Iconify icon="carbon:close-outline" className="modelCloseBtn" />
                </IconButton>
                <DialogContent dividers>
                  <div
                    style={{
                      width: "100%",
                      marginTop: "15px",
                    }}
                  >
                    <Grid
                      container
                      spacing={1.5}
                      className="timeCartPopuplabel"
                    >
                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("ast_dwntime_asset_no")}> {findCustomizeLabel("ast_dwntime_asset_no") ||
                          "Asset No:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          variant="outlined"
                          size="small"
                          className="Extrasize"
                          fullWidth
                          disabled
                          value={Asset_No ? Asset_No.split(' ')[0] :""}
                          
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                       
                        <label className={findCustomizerequiredLabel("ast_dwntime_out_date") || "Requiredlabel"}> {findCustomizeLabel("ast_dwntime_out_date") ||
                          "Out Service Date:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <DateTimePicker
                          value={OrigiDate}
                          format="dd/MM/yyyy HH:mm"
                          className="Extrasize"
                          sx={{ fontSize: "0.875rem" }}
                         
                          onChange={handleTimeCardDate}
                          
                          slotProps={{
                            textField: {
                              fullWidth: true,
                            },
                            desktopPaper: {
                              sx: {
                                top: '50% !important', 
                                left: '50% !important',
                                transform: 'translate(-35%, -22%) !important',
                              },
                            },
                          }}
                        />
                      </Grid>
                     
                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("ast_dwntime_rts_date")}> {findCustomizeLabel("ast_dwntime_rts_date") ||
                          "Return to Service Date:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                    
                        <DateTimePicker
                         value={EndTimeCardDate || null}
                          format="dd/MM/yyyy HH:mm"
                          className="Extrasize"
                          sx={{ fontSize: "0.875rem" }}
                         
                          onChange={handleEndTimeChange}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              value: EndTimeCardDate || "", 
                            },
                            desktopPaper: {
                              sx: {
                                top: '50% !important', 
                                left: '50% !important',
                                transform: 'translate(-35%, -22%) !important',
                              },
                            },
                          }}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              value={EndTimeCardDate ? params.value : ""}
                            />
                          )}
                          
                        />
                       
                      </Grid>

                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("wko_ls8_hrs") || ""}> {findCustomizeLabel("wko_ls8_hrs") ||
                          "Down Time "}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          variant="outlined"
                          size="small"
                          className="Extrasize"
                          fullWidth
                          disabled
                          value={DownTimeData}
                         
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("ast_dwntime_repair_from")}> {findCustomizeLabel("ast_dwntime_repair_from") ||
                          "Repair From:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>

                        <DateTimePicker
                          value={RepairFromDate || null}
                          format="dd/MM/yyyy HH:mm"
                          className="Extrasize"
                          sx={{ fontSize: "0.875rem" }}
                          onChange={handleRePairFromChange}  
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              value: RepairFromDate || "", 
                            },
                            desktopPaper: {
                              sx: {
                                top: '50% !important', 
                                left: '50% !important',
                                transform: 'translate(-35%, -22%) !important',
                              },
                            },
                          }}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              value={RepairFromDate ? params.value : ""}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("ast_dwntime_repair_to")}> {findCustomizeLabel("ast_dwntime_repair_to") ||
                          "Repair To:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>

                        <DateTimePicker
                          value={RepairToDate || null}
                          format="dd/MM/yyyy HH:mm"
                          className="Extrasize"
                          sx={{ fontSize: "0.875rem" }}
                          onChange={handleReairToFromChange}  
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              value: RepairToDate || "", 
                            },
                            desktopPaper: {
                              sx: {
                                top: '50% !important', 
                                left: '50% !important',
                                transform: 'translate(-35%, -22%) !important',
                              },
                            },
                          }}
                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              value={RepairToDate ? params.value : ""}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("wko_ls8_hrs") || ""}> {findCustomizeLabel("wko_ls8_hrs") ||
                          "Repair Time "}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          variant="outlined"
                          size="small"
                          className="Extrasize"
                          fullWidth
                          disabled
                          value={RepairTimeData}
                         
                        />
                      </Grid>


                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("ast_dwntime_remark")}> {findCustomizeLabel("ast_dwntime_remark") ||
                          "Remark:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          variant="outlined"
                          size="small"
                          className="Extrasize"
                          fullWidth
                          value={RemarkData}
                          // onChange={(e) => {
                          //   setRemarkData(e.target.value);
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 64) {
                              setRemarkData(value);
                            }
                          }}
                         
                        />
                      </Grid>
                     
                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("ast_dwntime_sched_flag") || ""}> {findCustomizeLabel("ast_dwntime_sched_flag") ||
                          "Unplanned Downtime?"}</label>
                      </Grid>
                      
                      <Grid
                              item
                              xs={12}
                              md={8}
                              style={{ textAlign: "right" }}
                            >

                              <FormControlLabel
                                  value="top"
                                  control={
                                    <Checkbox
                                      defaultChecked={false}
                                      onChange={(event) => handleChange(event.target.checked)}
                                    />
                                  }
                                 
                                />
                            </Grid>
                    </Grid>
                  </div>
                </DialogContent>
                <ToastContainer />
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "10px",
                  }}
                >
                  <div className="timeCartSubmit">
                    <Button
                      variant="contained"
                      color="primary"
                      type="button" // Remove this line
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmitDownTime();
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </DialogActions>
              </Dialog>
            </div>

            {/*  Row Click to open model popup */}
              <BootstrapDialog
                onClose={handleCloseModal}
                aria-labelledby="customized-dialog-title"
                open={showModal}
                fullWidth
              >
                <DialogTitle
                  sx={{ m: 0, p: 2, display: "flex", alignItems: "center" }}
                  id="customized-dialog-title"
                  className="dailogTitWork"
                >
                  <Iconify
                  icon="guidance:time"
                  style={{ marginRight: '4px',width: "20px", height: "20px" }}
                />
                  <div>Update DownTime</div> {/* Title */}
                </DialogTitle>

                <IconButton
                  aria-label="close"
                  onClick={handleCloseModal}
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
                  <div
                    style={{
                      width: "100%",
                      marginTop: "15px",
                    }}
                  >
                    <div className="row">
                      <div className="col-sm-12 WrkOdrMtb">
                
                        
                            <div className="row my-3 tb">
                            
                              <Grid
                                container
                                spacing={1.5}
                                className="timeCartPopuplabel"
                              >
                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("ast_dwntime_asset_no")}> {findCustomizeLabel("ast_dwntime_asset_no") ||
                                  "Asset No:"}</label>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    className="Extrasize"
                                    fullWidth
                                    disabled
                                    value={EditAssetNo}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("ast_dwntime_out_date") || "Requiredlabel"}> {findCustomizeLabel("ast_dwntime_out_date") ||
                                  "Out Service Date:"}</label>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                  <DateTimePicker
                                    value={EditOutServiceDate}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    sx={{ fontSize: "0.875rem" }}
                                    onChange={handleEditTimeCardDate}
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                      },
                                      desktopPaper: {
                                        sx: {
                                          top: '50% !important', 
                                          left: '50% !important',
                                          transform: 'translate(-35%, -22%) !important',
                                        },
                                      },
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("ast_dwntime_rts_date")}> {findCustomizeLabel("ast_dwntime_rts_date") ||
                                  "Return to Service Date:"}</label>
                                </Grid>
                                
                                <Grid item xs={12} md={8}>
                                <DateTimePicker
                                  value={EditReturntoServiceDate || null}
                                  format="dd/MM/yyyy HH:mm"
                                  className="Extrasize"
                                  sx={{ fontSize: "0.875rem" }}
                                
                                  onChange={handleEndTimeChangeEdit}
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                      value: EditReturntoServiceDate || "", 
                                    },
                                    desktopPaper: {
                                      sx: {
                                        top: '50% !important', 
                                        left: '50% !important',
                                        transform: 'translate(-35%, -22%) !important',
                                      },
                                    },
                                  }}
                                  renderInput={(params) => (
                                    <TextField 
                                      {...params} 
                                      value={EditReturntoServiceDate ? params.value : ""}
                                    />
                                  )}
                                  
                                />
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("wko_ls8_hrs") || ""}> {findCustomizeLabel("wko_ls8_hrs") ||
                                  "Down Time "}</label>
                                </Grid>
                                
                                <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  disabled
                                  value={EditDownTime}
                                
                                />
                                
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("ast_dwntime_repair_from")}> {findCustomizeLabel("ast_dwntime_repair_from") ||
                                  "Repair From:"}</label>
                                </Grid>
                                
                                <Grid item xs={12} md={8}>
                                  <DateTimePicker
                                    value={EditRepairFrom || null}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    sx={{ fontSize: "0.875rem" }}
                                    onChange={handlePeairFromChangeEdit}  
                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                        value: EditRepairFrom || "", 
                                      },
                                      desktopPaper: {
                                        sx: {
                                          top: '50% !important', 
                                          left: '50% !important',
                                          transform: 'translate(-35%, -22%) !important',
                                        },
                                      },
                                    }}
                                    renderInput={(params) => (
                                      <TextField 
                                        {...params} 
                                        value={EditRepairFrom ? params.value : ""}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("ast_dwntime_repair_to")}> {findCustomizeLabel("ast_dwntime_repair_to") ||
                                  "Repair To:"}</label>
                                </Grid>
                                
                                <Grid item xs={12} md={8}>
                                  <DateTimePicker
                                    value={EditRepairTo || null}
                                    format="dd/MM/yyyy HH:mm"
                                    className="Extrasize"
                                    sx={{ fontSize: "0.875rem" }}
                                    onChange={handleReairToFromChangeEdit}

                                    slotProps={{
                                      textField: {
                                        fullWidth: true,
                                        value: EditRepairTo || "", 
                                      },
                                      desktopPaper: {
                                        sx: {
                                          top: '50% !important', 
                                          left: '50% !important',
                                          transform: 'translate(-35%, -22%) !important',
                                        },
                                      },
                                    }}
                                    renderInput={(params) => (
                                      <TextField 
                                        {...params} 
                                        value={EditRepairTo ? params.value : ""}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("wko_ls8_hrs") || ""}> {findCustomizeLabel("wko_ls8_hrs") ||
                                  "Repair Time "}</label>
                                </Grid>
                                
                                <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  disabled
                                  value={EditRepairTime}
                                
                                />
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("ast_dwntime_remark")}> {findCustomizeLabel("ast_dwntime_remark") ||
                                  "Remark:"}</label>
                                </Grid>
                                
                                <Grid item xs={12} md={8}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  className="Extrasize"
                                  fullWidth
                                  value={EditRemark}
                                  onChange={(e) => {
                                    setEditRemark(e.target.value);
                                  }}
                                
                                />
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: "10px" }}>
                                <label className={findCustomizerequiredLabel("ast_dwntime_sched_flag") || ""}> {findCustomizeLabel("ast_dwntime_sched_flag") ||
                                  "Unplanned Downtime?"}</label>
                                </Grid>
                                
                                <Grid item xs={12} md={8}  style={{ textAlign: "right" }}>
                                <FormControlLabel
                                          value="top"
                                          control={
                                            <Checkbox
                                              checked={EditUnplannedDowntime === "1"} // Checkbox is checked if the value is "1"
                                              onChange={(event) => handleChangeEdit(event.target.checked)}
                                            />
                                          }
                                        
                                        />
                                </Grid>
                              </Grid>
                            </div>
                          
                      
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <ToastContainer />
                <DialogActions
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <Button
                    variant="soft"
                    color="error"
                    className="CloseButton"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCloseModal();
                    }}
                    startIcon={<Iconify icon="jam:close" />}
                  >
                    Close
                  </Button>

                  <div
                    className="timeCartSubmit"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Button
                      variant="contained"
                      className="SaveButton assetSpares"
                      startIcon={<Iconify icon="mingcute:save-fill" />}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        marginRight: "10px",
                      }}
                      onClick={handleUpdateButtonClick}
                    >
                      Save
                    </Button>
                  
                  </div>
                </DialogActions>
              </BootstrapDialog>
     
          </div>
        </div>
      </div>
    
    </>
  );
};

export default WorkOrderDownTime;
