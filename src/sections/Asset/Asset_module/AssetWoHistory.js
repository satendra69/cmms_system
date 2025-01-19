import React, { useState, useEffect } from "react";
import {
  TableCell

} from "@mui/material";
import {
  differenceInMilliseconds,
  differenceInDays,
  parseISO,
  format,
} from "date-fns";
import { useLocation } from "react-router-dom";
import httpCommon from "src/http-common";
import { Tooltip, Typography } from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Moment from "moment";
import "moment-timezone";
import { Chrono } from "react-chrono";

import Iconify from "src/components/iconify";

const MySwal = withReactContent(Swal);
const WoHistory = ({ data, onDataFromSecondComponent }) => {
 // console.log("data_____",data);
  let site_ID = localStorage.getItem("site_ID");
  const { RowID } = data;
  const { Asset_No } = data;
  const { WorkOrderNo } = data;

  const location = useLocation();
  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);
  const [show, setShow] = useState(false);

  const [EmployeeID, setEmployeeID] = useState([]);


  const [HourType, setHourType] = useState([]);

  const [ChargeCostCenter, setChargeCostCenter] = useState([]);
 
  const [ChargeAccount, setChargeAccount] = useState([]);
  
  const [CreditCostCenter, setCreditCostCenter] = useState([]);


  const [CreditAccount, setCreditAccount] = useState([]);


  // Get Header Data
  const get_assetwohistory = async (site_ID, RowID) => {
    //console.log("RowID______",RowID);
    try {
      const response = await httpCommon.get(
        `/get_assetwohistory.php?site_cd=${site_ID}&wko_mst_assetno=${Asset_No}&wrk_sts_typ_cd='Open'`
      );
      //  console.log("response_____setupHistory",response);
      if (response.data.status === "SUCCESS") {
        setHeader(response.data.data.header);
        setResult(response.data.data);
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

    get_assetwohistory(site_ID, RowID);

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

 
  const items = Result.map((data) => ({
    title: format(parseISO(data.wko_mst_org_date.date), 'dd-MMM-yy HH:mm'), 
    cardTitle: (
      <div
      style={{
        display: 'flex',
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
        gap: '16px',
        overflow: 'hidden',
        maxWidth: '100%',
      }}
    >
      {/* Left Side */}
      <div
        style={{
          flex: '1',
          minWidth: '250px', 
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          
        }}
        className="ChronoLeftSide"
      >
        {/* Work Order No */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tooltip title="Work Order No" placement="top" arrow>
            <Iconify
              style={{ marginLeft: 5, cursor: 'pointer' }}
              icon="material-symbols-light:order-approve-outline"
            />
          </Tooltip>
          <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
            {data.wko_mst_wo_no}
          </Typography>
        </div>

        {/* Originator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tooltip title="Originator" placement="top" arrow>
            <Iconify
              style={{ marginLeft: 5, cursor: 'pointer' }}
              icon="majesticons:user-line"
            />
          </Tooltip>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ fontWeight: 'bold', fontSize: '12px' }}
          >
            {data.wko_mst_originator}
          </Typography>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tooltip title="Description" placement="top" arrow>
            <Iconify
              style={{ marginLeft: 5, cursor: 'pointer' }}
              icon="material-symbols-light:description-outline"
            />
          </Tooltip>
          <Tooltip title={data.wko_mst_descs} placement="top" arrow>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {data.wko_mst_descs && data.wko_mst_descs.length > 70
                ? `${data.wko_mst_descs.slice(0, 70)}...`
                : data.wko_mst_descs || ''}
            </Typography>
          </Tooltip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tooltip title="Assign" placement="top" arrow>
              <Iconify style={{ marginLeft: 5, cursor: 'pointer' }} icon="fluent-mdl2:assign" />
            </Tooltip>
            <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold',fontSize: '12px' }}>
              {data.wko_det_assign_to} {/* Adjust field name if necessary */}
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tooltip title="Corrective Action" placement="top" arrow>
              <Iconify style={{ marginLeft: 5, cursor: 'pointer' }} icon="healthicons:i-note-action" />
            </Tooltip>
          
            <Tooltip title={data.wko_det_corr_action} placement="top" arrow>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
               
              }}
            >
                   
              {data.wko_det_corr_action && data.wko_det_corr_action.length > 70 
                ? `${data.wko_det_corr_action.slice(0, 70)}...` 
                : data.wko_det_corr_action || ''}
            </Typography>
          </Tooltip>
            
          </div>
      </div>

      {/* Right Side */}
      <div
        className="ChronoRightSide desktopViewOnly"
      >
        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      
          <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
            {data.wko_mst_status_desc}
          </Typography>
          <Tooltip title="Status" placement="top" arrow>
            <Iconify style={{ cursor: 'pointer' }} icon="lets-icons:status" />
          </Tooltip>
        </div>

        {/* Phone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ fontWeight: 'bold', fontSize: '12px' }}
          >
            {data.wko_mst_phone}
          </Typography>
          <Tooltip title="Phone" placement="top" arrow>
            <Iconify style={{ cursor: 'pointer' }} icon="mdi-light:phone" />
          </Tooltip>
        </div>

        {/* Work Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
       
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ fontWeight: 'bold', fontSize: '12px' }}
          >
            {data.wko_det_work_grp}
          </Typography>
          <Tooltip title="Work Group" placement="top" arrow>
            <Iconify
              style={{ cursor: 'pointer' }}
              icon="material-symbols:group-work-outline"
            />
          </Tooltip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
           
            <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold',fontSize: '12px' }}>
           
              {data.wko_det_cmpl_date?.date
            ? format(parseISO(data.wko_det_cmpl_date.date), 'dd-MM-yyyy HH:mm')
            : ''}
            </Typography>
            <Tooltip title="Complete Date" placement="top" arrow>
              <Iconify style={{ cursor: 'pointer' }} icon="fluent-mdl2:date-time" />
            </Tooltip>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            
            <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold',fontSize: '12px' }}>
           
           {data.wko_det_clo_date?.date
            ? format(parseISO(data.wko_det_clo_date.date), 'dd-MM-yyyy HH:mm')
            : ''}
            </Typography>
            <Tooltip title="Close Date" placement="top" arrow>
              <Iconify style={{ cursor: 'pointer' }} icon="fluent-mdl2:date-time" />
            </Tooltip>
          </div>
      </div>

      {/* Right Side for mobile */}
      <div
        className="ChronoRightSide mobileViewOnly"
        
      >
        {/* Status */}
        <div className="ChronomobileDiv" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tooltip title="Status" placement="top" arrow>
            <Iconify style={{ cursor: 'pointer' }} icon="lets-icons:status" />
          </Tooltip>
          <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold' }}>
            {data.wko_mst_status_desc}
          </Typography>
        </div>

        {/* Phone */}
        <div className="ChronomobileDiv" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tooltip title="Phone" placement="top" arrow>
            <Iconify style={{ cursor: 'pointer' }} icon="mdi-light:phone" />
          </Tooltip>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ fontWeight: 'bold', fontSize: '12px' }}
          >
            {data.wko_mst_phone}
          </Typography>
        </div>

        {/* Work Group */}
        <div className="ChronomobileDiv" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tooltip title="Work Group" placement="top" arrow>
            <Iconify
              style={{ cursor: 'pointer' }}
              icon="material-symbols:group-work-outline"
            />
          </Tooltip>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ fontWeight: 'bold', fontSize: '12px' }}
          >
            {data.wko_det_work_grp}
          </Typography>
        </div>
        <div className="ChronomobileDiv" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tooltip title="Complete Date" placement="top" arrow>
              <Iconify style={{ cursor: 'pointer' }} icon="fluent-mdl2:date-time" />
            </Tooltip>
            <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold',fontSize: '12px' }}>
           
              {data.wko_det_cmpl_date?.date
            ? format(parseISO(data.wko_det_cmpl_date.date), 'dd-MM-yyyy HH:mm')
            : ''}
            </Typography>
          </div>
          <div className="ChronomobileDiv" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Tooltip title="Close Date" placement="top" arrow>
              <Iconify style={{ cursor: 'pointer' }} icon="fluent-mdl2:date-time" />
            </Tooltip>
            <Typography variant="body2" color="textSecondary" style={{ fontWeight: 'bold',fontSize: '12px' }}>
           
           {data.wko_det_clo_date?.date
            ? format(parseISO(data.wko_det_clo_date.date), 'dd-MM-yyyy HH:mm')
            : ''}
            </Typography>
          </div>
      </div>

    </div>
    ),
    
  }));
  
  
 
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
                  <div style={{ marginRight: "10px" }}>
                    {/* <img src={logo} style={{ width: "50px", height: "50px" }} /> */}
                    <Iconify
                          icon="icon-park:history-query" 
                          width={30} 
                          height={30}
                          style={{ marginRight: '5px' }}

                        />
                  </div>
                  <div
                    className="template-demo"
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                    WO History
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
            <div >
             
              {/* <Chrono items={items} mode="VERTICAL"/> */}
              {Result.length > 0 && <Chrono items={items} mode="VERTICAL" />}
            </div>
              
            </div>
         
           
          </div>
        </div>
      </div>
    </>
  );
};

export default WoHistory;
