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
  differenceInHours,
  differenceInMinutes,
} from "date-fns";
import Autocomplete from "@mui/material/Autocomplete";
import { useLocation } from "react-router-dom";
import httpCommon from "src/http-common";
import { format, setHours } from "date-fns";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Moment from "moment";
import "moment-timezone";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Iconify from "src/components/iconify";
import logo from "../../../assets/img/work-time.png";

const MySwal = withReactContent(Swal);
const MrHistory = ({ data, onDataFromSecondComponent }) => {
  let site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const { RowID } = data;
  const { Asset_No } = data;
  const { WorkOrderNo } = data;

  const location = useLocation();
  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
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
  const [EmpDropData, setEmpDropData] = useState([]);
  const [CreditAccount, setCreditAccount] = useState([]);
  const [selected_CreditAccount, setSelected_CreditAccount] = useState([]);

  const [Button_save, setButton_save] = useState("");

  const [RowID2, setRowID2] = useState("");

  const [AssetNo, setAssetNo] = useState("");
  const [Rate, setRate] = useState("");
  const [Multiplier, setMultiplier] = useState("");
  const [Adder, setAdder] = useState("");
  const [ActualCost, setActualCost] = useState("");
  const [TimeCardNo, setTimeCardNo] = useState("");
  const [isEmpNoEmpty, setIsEmpEmpty] = useState(false);
  // Get Header Data
  const get_assetmSetup = async (site_ID, RowID) => {
    try {
      const response = await httpCommon.get(
        `/get_mr_history_data.php?site_cd=${site_ID}&RowID=${RowID}&wko_mst_assetno=${Asset_No}`
      );
      //  console.log("response_____PMsetup",response);
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
  useEffect(() => {
    let site_ID = localStorage.getItem("site_ID");

    get_assetmSetup(site_ID, RowID);

    get_workorder_status(site_ID, "All");
  }, [location]);

 
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

      if (response.data.status === "SUCCESS") {
        let EmployeeID = response.data.data.Employee_Supervisor_Id.map(
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
    };
    return (
      <>
       
          <TableCell style={cellStyle}>
          Material Request No:
          </TableCell>

          <TableCell style={cellStyle}>
          Line No:
          </TableCell>

          <TableCell style={cellStyle}>
             Required Date:
          </TableCell>

          <TableCell style={cellStyle}>
           Requester:
          </TableCell>

          <TableCell style={cellStyle}>
           Requester Name:
          </TableCell>
          <TableCell style={cellStyle}>
           Stock No:
          </TableCell>
          <TableCell style={cellStyle}>
           Description:
          </TableCell>
          <TableCell style={cellStyle}>
          Required Quantity:
          </TableCell>
          <TableCell style={cellStyle}>
          Actual Quantity:
          </TableCell>

          
        
      </>
    );
  };

  const renderTableRows = () => {
    return Result.map((result, index) => (
      <TableRow key={index}>
       
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.mtr_mst_mtr_no}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.mtr_ls1_mtr_lineno}
        </TableCell>
        
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
         {formatDate(result.mtr_mst_req_date)}
        </TableCell>


        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.mtr_mst_requester}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
         
          {result.requester_name}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          
              {result.mtr_ls1_stockno}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.mtr_ls1_desc}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.mtr_ls1_req_qty}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.mtr_ls1_rcv_qty}
        </TableCell>

      </TableRow>
    ));
  };
  const formatDate = (dateObject) => {

    if (!dateObject || !dateObject.date) {
      return ""; // or a default value like "N/A"
    }
    const date = new Date(dateObject.date);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

  //  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return `${day}-${month}-${year}`;
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
                  <div style={{ marginRight: "5px" }}>
                    {/* <img src={logo} style={{ width: "50px", height: "50px" }} /> */}
                    <Iconify
                          icon="carbon:request-quote"  
                            width={35} 
                            height={35}
                            style={{ marginRight: '5px' }}

                          />

                  </div>
                  <div
                    className="template-demo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                    MR History 
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>{renderTableHeader()}</TableRow>
                  </TableHead>
                  <TableBody>{renderTableRows()}</TableBody>
                </Table>
              </TableContainer>
            </div>
        
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
           
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MrHistory;
