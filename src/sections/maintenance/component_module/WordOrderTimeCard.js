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
import {
  differenceInMilliseconds,
  differenceInDays,
} from "date-fns";
import Autocomplete from "@mui/material/Autocomplete";
import { useLocation } from "react-router-dom";
import httpCommon from "src/http-common";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Swal from "sweetalert2";


import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Moment from "moment";
import "moment-timezone";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Iconify from "src/components/iconify";
import logo from "../../../assets/img/credit-card.png";

const WorkOrderTimeCard = ({ onRowClick, data, onDataFromSecondComponent ,statusKey}) => {
  let site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_login_id");
    
  const { RowID } = data;
  const { Asset_No } = data;
  const { WorkOrderNo } = data;

   const [FormStatus, setFormStatus] = useState(data.formStatus);

  const location = useLocation();
  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [show, setShow] = useState(false);
 
  const [EmployeeID, setEmployeeID] = useState([]);
  const [selected_EmployeeID, setSelected_EmployeeID] = useState([]);

  const [Craft, setCraft] = useState([]);
  const [selected_Craft, setSelected_Craft] = useState([]);

  const [TimeCardDate, setTimeCardDate] = useState(new Date());
  const [EndTimeCardDate, setEndTimeCardDate] = useState(new Date());

  const [HourType, setHourType] = useState([]);
  const [selected_HourType, setSelected_HourType] = useState([]);
 

  const [ActualHour, setActualHour] = useState("0");

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
  const [selected_ChargeCostCenter, setSelected_ChargeCostCenter] = useState(
    []
  );

  const [ChargeAccount, setChargeAccount] = useState([]);
  const [selected_ChargeAccount, setSelected_ChargeAccount] = useState([]);

  const [CreditCostCenter, setCreditCostCenter] = useState([]);
  const [selected_CreditCostCenter, setSelected_CreditCostCenter] = useState(
    []
  );

  const [CreditAccount, setCreditAccount] = useState([]);
  const [selected_CreditAccount, setSelected_CreditAccount] = useState([]);

  const [Rate, setRate] = useState("");
  const [Multiplier, setMultiplier] = useState("");
  const [Adder, setAdder] = useState("");
  const [ActualCost, setActualCost] = useState("");

  const [wkoMstLabel, setWkoMstLabel] = useState([]);
  const [MaterialMandatoryFiled, setMaterialMandatoryFiled] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(FormStatus !== "" && FormStatus == "NEW" ){
          await get_workordermaster_timecard_header(site_ID);
        }else{
          await get_workordermaster_timecard(site_ID, RowID);
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
  const get_workordermaster_timecard = async (site_ID, RowID) => {
    try {
      const response = await httpCommon.get(
        `/get_workordermaster_timecard.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );
    
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
 
const get_workordermaster_timecard_header = async (site_ID) =>{
  try {
    const response = await httpCommon.get(
      `/get_workordermaster_timecard.php?site_cd=${site_ID}&RowID=${RowID || ""}`
    );
  
    if (response.data.status === "SUCCESS") {
      setHeader(response.data.data.header);
      //setResult(response.data.data.result);
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

        //get_dropdown_ParentFlag(site_ID,selected_asset);
        // get_workordermaster_select(site_ID,selected_asset);
        // New_WorkOrderTimeCard();
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
      // console.error("Error fetching data:", error);
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
     // color:"#000",
       textAlign: "center"
    };
    return (
      <>
        <TableCell key="select"></TableCell>
        {Object.keys(Header).map((attr) => (
          <TableCell key={attr} style={cellStyle}>
            {attr}
          </TableCell>
        ))}
      </>
    );
  };
  const formatDate = (dateObject) => {
    if (!dateObject) {
      return ''; // or any default value you prefer
    }
    const date = new Date(dateObject.date);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

   // return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
   return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const renderTableRows = () => {
    return Result.map((result, index) => (
      <TableRow key={index}
      style={{
        backgroundColor: index % 2 === 0 ? "rgb(242, 242, 242)" : "#ffffff", // Alternate row colors
      }}
      >
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {index + 1}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
            {result.wko_ls8_assetno.split(':')[0]}
        
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_empl_id}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_craft}
        </TableCell>
        <TableCell style={{ padding: "10px 0px", textAlign: "center" }}>
          {formatDate(result.wko_ls8_datetime1)}
        </TableCell>
        <TableCell style={{ padding: "10px 0px", textAlign: "center" }}>
          {formatDate(result.wko_ls8_datetime2)}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_hours_type}
        </TableCell>

        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_hrs}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_rate}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_multiplier}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_adder}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_act_cost}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_chg_costcenter}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_chg_account}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_crd_costcenter}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_crd_account}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
          {result.wko_ls8_time_card_no}
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
  const handleEmployeeIDChange = async (event, value) => {
    let site_ID = localStorage.getItem("site_ID");
    setSelected_EmployeeID(value);
    setSelected_Craft("");
    setCraft("");
    const labelParts = value ? value.label.split(" : ") : [];
    const beforeColonValue = labelParts.length > 0 ? labelParts[0] : "";
      // console.log("value____Empt____",beforeColonValue);
    if (beforeColonValue !== "" && beforeColonValue != null) {
      try {
        const response = await httpCommon.get(
          `get_time_cart_reate_craft.php?site_cd=${site_ID}&empId=${beforeColonValue}`
        );
       // console.log("response____",response);
        if (response.data.data.result.length > 0) {
          let Craft = response.data.data.result.map((item) => ({
            label: item.emp_ls1_craft + " : " + item.crf_mst_desc,
            value: item.emp_ls1_craft,
            rate: item.emp_ls1_charge_rate,
          }));
          setCraft(Craft);

          setSelected_Craft(response.data.data.result[0].emp_ls1_craft + " : " + response.data.data.result[0].crf_mst_desc);
          setRate(response.data.data.result[0].emp_ls1_charge_rate);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Oops get_sitecode...",
          text: error,
        });
      }
    }
  };

  const handleHourTypeChange = async (event, value) => {
    setSelected_HourType(value);
    const labelParts = value ? value.label.split(" : ") : [];
    const beforeColonValue = labelParts.length > 0 ? labelParts[0] : "";
    if (beforeColonValue !== "" && beforeColonValue != null) {
      try {
        const response = await httpCommon.get(
          `TimeCartHourTypeGet.php?site_cd=${site_ID}&hourstype=${beforeColonValue}`
        );
       // console.log("response______houer___",response);
        if (response.data.data.result.length > 0) {
          setAdder(response.data.data.result[0].hours_type_adder);
          setMultiplier(response.data.data.result[0].hours_type_multiplier);

          const start = new Date(TimeCardDate);
          const end = new Date(EndTimeCardDate);
          // const range = new Moment.range(start, end);

          const msDiff = differenceInMilliseconds(end, start);
          const days = differenceInDays(end, start);
          const hours = Math.floor(msDiff / (1000 * 60 * 60)); // Total hours
          const min = Math.floor(msDiff / (1000 * 60));

          const Min = Math.floor(msDiff / (1000 * 60));
          const act_hour = Math.floor(Min / 60);

          const h = parseFloat(hours);
          const r = parseFloat(Rate);
          const a = parseFloat(response.data.data.result[0].hours_type_adder);
          const m = parseFloat(
            response.data.data.result[0].hours_type_multiplier
          );

          const f3 = act_hour * (r + a) * m;
          setActualCost(f3);
         // setActualHour(hours);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);

        Swal.fire({
          icon: "error",
          title: "Oops get_sitecode...",
          text: error,
        });
      }
    }
  };
  const resetData = () => {
    setSelected_ChargeAccount("");
    setSelected_ChargeCostCenter("");
    setSelected_Craft("");
    setSelected_CreditAccount("");
    setSelected_CreditCostCenter("");
    setSelected_EmployeeID("");
    setSelected_HourType("");
    setActualHour("");
    setActualCost("");
    setMultiplier("");
    setAdder("");
    setEndTimeCardDate(new Date());
    setTimeCardDate(new Date());
  };
 
  const handleSubmitTimecard = async () => {
   
    if (selected_EmployeeID == "" || selected_EmployeeID == null) {

      toast.error(`Please fill the required field Employee ID is required`, {
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

    } else if (selected_Craft == "" || selected_Craft == null) {
   
      toast.error(`Please fill the required field Craft is required`, {
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
    } else if (TimeCardDate == "" || TimeCardDate == null) {
     
      toast.error(`Please fill the required field Time Card From is required`, {
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

    } else if ( EndTimeCardDate < TimeCardDate) {
      
      toast.error(`${findCustomizeLabel("wko_ls8_datetime2") || "Time Card End Date"} cannot be less than ${findCustomizeLabel("wko_ls8_datetime1") || "Time Card Start Date"}`, {
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
            width: "400px", 
        }
    });
     } else if (selected_HourType == "" || selected_HourType == null) {
    
      toast.error(`Please fill the required field Hour Type is required`, {
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
    } else {
      let selectedHourType;
      if (
        !selected_HourType ||
        selected_HourType.length === 0 ||
        !selected_HourType.label
      ) {
        selectedHourType = "";
      } else {
        const selectedHourType2 = selected_HourType.label.split(":");
        selectedHourType = selectedHourType2[0].trim();
      }

      let EmptyAsset;
    if (Asset_No == "" || Asset_No == null) {
      EmptyAsset = "";
    } else {
      // Asset_No = selected_Asset_No.label.split(":")
      const EmptyAssetSplit = Asset_No.split(":");
      EmptyAsset = EmptyAssetSplit[0];
    }
   
    let FinalCarft;
    if (!selected_Craft) {
      FinalCarft = '';
    } else if (typeof selected_Craft === 'string') {
      const craftParts = selected_Craft.split(":");
      FinalCarft = craftParts[0].trim();
    } else if (typeof selected_Craft === 'object' && selected_Craft.label) {
      const craftParts = selected_Craft.label.split(":");
      FinalCarft = craftParts[0].trim();
    } else {
      FinalCarft = '';
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
 
      var json_workorderTimeCart = {
        site_cd: site_ID,
        wko_mst_wo_no: WorkOrderNo,
        mst_RowID: RowID,
        assetno: EmptyAsset,
        selectedEmployeeID: selected_EmployeeID.value || "",
        selectedCraft: FinalCarft.trim(),
        TimeCardDate: date_1,
        EndTimeCardDate: date_2,
        selected_HourType: selectedHourType.trim(),
        ActualHour: ActualHour,
        Rate: Rate,
        Multiplier: Multiplier,
        Adder: Adder,
        ActualCost: ActualCost,
        selected_ChargeCostCenter: selected_ChargeCostCenter.value || "",
      
        selected_ChargeAccount: selected_ChargeAccount.value || "",
        selected_CreditCostCenter: selected_CreditCostCenter.value || "",
        selected_CreditAccount: selected_CreditAccount.value || "",
        auditUser: emp_owner,
      };
      //console.log("json_workorderTimeCart____",json_workorderTimeCart);
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
          "/insert_time_card.php",
          JSON.stringify(json_workorderTimeCart)
        );
      
        if (response.data.status == "SUCCESS") {
         
          Swal.close();
          Swal.fire({
            title: "Time Card Request!",
            customClass: {
              container: "swalcontainercustom",
            },
            text: response.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            
            get_workordermaster_timecard(site_ID, RowID);

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
  useEffect(() => {
    const calculateActualHours = () => {
      if (TimeCardDate && EndTimeCardDate) { 
        const startDate = new Date(TimeCardDate);
        const endDate = new Date(EndTimeCardDate);
        const differenceInMilliseconds = endDate - startDate;
        const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

        setActualHour(differenceInHours.toFixed(2)); 
      }
    };

    calculateActualHours();
  }, [TimeCardDate, EndTimeCardDate]);
  
   // Get All Filed label Name
   const getWorkOrderMiscFromLebel = async () => {
    try {
      const response = await httpCommon.get("/get_work_order_time_card_form_lebal.php");
      if (response.data.status === "SUCCESS") {
        setWkoMstLabel(response.data.data.wko_ls8);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const getWorkOrderMiscMandatoryfiled = async () => {
    try {
      const response = await httpCommon.get("/get_work_order_time_card_mandatory_filed.php");
      
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

  const handleShow = () => {
       
    if(FormStatus !== "" && FormStatus == "NEW" ){
      Swal.fire({
        icon: "info",
        customClass: {
          container: "swalcontainercustom",
        },
        title: "Please Wait!",
        allowOutsideClick: false,
        text: "Once the Work Order is created, you can then add detailed Time Card.",
        width:"400px"
      });
      onRowClick("BtnTimeCard");
    }else{
        setShow(true);
       
    }
  };

  const handleTimeCardDateChange = (newDate) => {
    if (newDate && EndTimeCardDate) {
      const newDateMs = newDate.getTime();
      const endDateMs = EndTimeCardDate.getTime();
  
      if (newDateMs > endDateMs) {
        toast.error("Time Card From must be equal to or less then Time Card To", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
          style: { width: "460px" },
        });
        setTimeCardDate(null); // Reset the TimeCardDate
      } else {
        const start = new Date(newDate);
        const end = new Date(EndTimeCardDate);
        // const range = new Moment.range(start, end);

        const msDiff = end - start;
        const totalHours = msDiff / (1000 * 60 * 60);
       
        const act_hour = totalHours.toFixed(2); 

        const h = parseFloat(act_hour); 
        const r = parseFloat(Rate) || 0; 
        const a = parseFloat(Adder) || 0;
        const m = parseFloat(Multiplier) || 1;

        const f3 = h * (r + a) * m;
        setActualCost(f3);
        setTimeCardDate(newDate); // Valid case
      }
    } else {
      setTimeCardDate(newDate); // Set if no EndTimeCardDate
    }
  };
  const handleEndTimeCardDateChange = (newDate) => {
    if (newDate && TimeCardDate) {
      const newDateMs = newDate.getTime();
      const timeCardDateMs = TimeCardDate.getTime();
  
      if (newDateMs < timeCardDateMs) {
        toast.error("Time Card To can't be less than Time Card From", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
          style: { width: "450px" },
        });
        setEndTimeCardDate(null); // Reset the EndTimeCardDate
      } else {
        
        const start = new Date(TimeCardDate);
        const end = new Date(newDate);

        const msDiff = end - start;
        const totalHours = msDiff / (1000 * 60 * 60);
       
        const act_hour = totalHours.toFixed(2); 

        const h = parseFloat(act_hour); 
        const r = parseFloat(Rate) || 0; 
        const a = parseFloat(Adder) || 0;
        const m = parseFloat(Multiplier) || 1;

        const f3 = h * (r + a) * m;
        
        setActualCost(f3);
        setEndTimeCardDate(newDate); // Valid case
      }
    } else {
     
      setEndTimeCardDate(newDate); // Set if no TimeCardDate
    }
  };
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
                  <div style={{ marginRight: "4px" }}>
                    <img src={logo} style={{ width: "35px", height: "35px" }} />
                  </div>
                  <div
                    className="template-demo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                      Time Card
                    </div>
                    <div className="TimeCartPartCosting" >
                     Total Hour {" "}
                      <span style={{ color: "blue" }}>
                        {formattedtotalQty}
                      </span>{" "},
                      Total Time Card Cost {" "}
                      <span style={{ color: "#19d895" }}>
                        ${formattedTotalCost}
                      </span>
                    </div>
                  </div>
                  <div
                      style={{
                        marginLeft: "auto", // Push button to the right
                      }}
                    >
                    
                  <Button
                    type="button"
                   // className="AddNewButton"
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
                  <img src={logo} style={{ width: "30px", height: "30px",marginRight: "2px" }} />
                  Time Card
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
                   // color: (theme) => theme.palette.grey[500],
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
                        
                        <label className={findCustomizerequiredLabel("wko_ls8_empl_id") || "Requiredlabel"}> {findCustomizeLabel("wko_ls8_empl_id") ||
                          "Employee ID:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={EmployeeID}
                          value={selected_EmployeeID}
                          onChange={(event, value) =>
                            handleEmployeeIDChange(event, value)
                          }
                          renderInput={(params) => (
                            <div>
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                className="Extrasize"
                              />
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                       
                        <label className={findCustomizerequiredLabel("wko_ls8_craft") || "Requiredlabel"}> {findCustomizeLabel("wko_ls8_craft") ||
                           "Craft:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={Array.isArray(Craft) ? Craft : []}
                          value={selected_Craft}
                          onChange={(event, value) => {
                            setSelected_Craft(value || null);
                            setRate(value ? value.rate : null);
                          }}
                          renderInput={(params) => (
                            <div>
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                className="Extrasize"
                              />
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                       
                        <label className={findCustomizerequiredLabel("wko_ls8_datetime1") || "Requiredlabel"}> {findCustomizeLabel("wko_ls8_datetime1") ||
                          "Time Card Date:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <DateTimePicker
                          value={TimeCardDate || null}
                          format="dd/MM/yyyy HH:mm"
                          className="Extrasize"
                          sx={{ fontSize: "0.875rem" }}
                          
                           onChange={handleTimeCardDateChange}

                          slotProps={{
                              textField: {
                                fullWidth: true,
                                value: TimeCardDate || "", 
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
                                value={TimeCardDate ? params.value : ""}
                              />
                            )}
                        />
                      </Grid>
                     
                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("wko_ls8_datetime2") || "Requiredlabel"}> {findCustomizeLabel("wko_ls8_datetime2") ||
                          "Time Card End Date:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <DateTimePicker
                          value={EndTimeCardDate}
                          format="dd/MM/yyyy HH:mm"
                          className="Extrasize"
                          sx={{ fontSize: "0.875rem" }}
                         
                          onChange={handleEndTimeCardDateChange}
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
                        
                        <label className={findCustomizerequiredLabel("wko_ls8_hours_type") || "Requiredlabel"}> {findCustomizeLabel("wko_ls8_hours_type") ||
                          "Hour Type:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                       
                        <Autocomplete
                          options={HourType}
                         // defaultValue={HourType[0]}
                          value={selected_HourType}
                          onChange={(event, value) =>
                            handleHourTypeChange(event, value)
                          }
                          getOptionLabel={(option) => option?.label || ""} // Handle undefined labels gracefully
                          isOptionEqualToValue={(option, value) => option?.value === value?.value}
                          renderInput={(params) => (
                            <div>
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                className="Extrasize"
                              />
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("wko_ls8_hrs") || ""}> {findCustomizeLabel("wko_ls8_hrs") ||
                          "Actual Hour:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <TextField
                          variant="outlined"
                          size="small"
                          className="Extrasize"
                          fullWidth
                          disabled
                          value={ActualHour}
                          onChange={(e) => {
                            setActualHour(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("wko_ls8_chg_costcenter") || ""}> {findCustomizeLabel("wko_ls8_chg_costcenter") ||
                          "Charge Cost Center:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={ChargeCostCenter}
                          value={selected_ChargeCostCenter}
                          onChange={(event, value) => {
                            setSelected_ChargeCostCenter(value || null);
                          }}
                          renderInput={(params) => (
                            <div>
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                className="Extrasize"
                              />
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                       
                        <label className={findCustomizerequiredLabel("wko_ls8_chg_account") || ""}> {findCustomizeLabel("wko_ls8_chg_account") ||
                          "Charge Account:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={ChargeAccount}
                          value={selected_ChargeAccount}
                          onChange={(event, value) => {
                            setSelected_ChargeAccount(value || null);
                          }}
                          renderInput={(params) => (
                            <div>
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                className="Extrasize"
                              />
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        
                        <label className={findCustomizerequiredLabel("wko_ls8_crd_costcenter") || ""}> {findCustomizeLabel("wko_ls8_crd_costcenter") ||
                          "Credit Cost Center:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={CreditCostCenter}
                          value={selected_CreditCostCenter}
                          onChange={(event, value) => {
                            setSelected_CreditCostCenter(value || null);
                          }}
                          renderInput={(params) => (
                            <div>
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                className="Extrasize"
                              />
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                       
                        <label className={findCustomizerequiredLabel("wko_ls8_crd_account") || ""}> {findCustomizeLabel("wko_ls8_crd_account") ||
                          "Credit Account:"}</label>
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Autocomplete
                          options={CreditAccount}
                          value={selected_CreditAccount}
                          onChange={(event, value) => {
                            setSelected_CreditAccount(value || null);
                          }}
                          renderInput={(params) => (
                            <div>
                              <TextField
                                {...params}
                                size="small"
                                placeholder="Select..."
                                variant="outlined"
                                className="Extrasize"
                              />
                            </div>
                          )}
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
                        handleSubmitTimecard();
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </DialogActions>
              </Dialog>
            </div>
            {/* <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                type="button"
                className="tabAddButton"
                disabled={data.statusKey === "CLOSE"}
                onClick={handleShow}
              >
                + Add Time Card
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    
    </>
  );
};

export default WorkOrderTimeCard;
