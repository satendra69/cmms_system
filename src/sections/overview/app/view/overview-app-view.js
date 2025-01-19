// @mui
import React, { useState, useEffect, useRef,useCallback } from "react";
import { useTheme } from "@mui/material/styles";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate,useLocation  } from "react-router-dom";
// hooks
import { useMockedUser } from "src/hooks/use-mocked-user";
// _mock
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from "src/_mock";
// components
import { useSettingsContext } from "src/components/settings";
// assets
//import { SeoIllustration } from "src/assets/illustrations";
//
import AppWidget from "../app-widget";
// import AppWelcome from "../app-welcome";
// import AppFeatured from "../app-featured";
//import AppNewInvoice from "../app-new-invoice";
//import AppTopAuthors from "../app-top-authors";
//import AppTopRelated from "../app-top-related";
//import AppAreaInstalled from "../app-area-installed";
import AppWidgetSummary from "../app-widget-summary";
//import AppCurrentDownload from "../app-current-download";
//import AppTopInstalledCountries from "../app-top-installed-countries";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
//import WorkOrderList from "src/sections/maintenance/WorkOrderList";
import Iconify from "src/components/iconify";
// ----------------------------------------------------------------------

export default function OverviewAppView() {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_loginID = localStorage.getItem("emp_mst_empl_id");

  const navigate = useNavigate();
  const { user } = useMockedUser();
  const location = useLocation();
  const intervalRef = useRef(null);

  const theme = useTheme();

  const settings = useSettingsContext();

  const [GetAllDashbordData, setDashbordData] = useState([]);
  const [GetAllDashbordDataFltrBy, setDashbordDataFltrBy] = useState([]);
  const [GetAllDashbordDataSortBy, setDashbordDataSortBy] = useState([]);
  const [GetDashbordDataPrmMst, setDashbordDataPrmMst] = useState([]);
  const [GetPRM_MST, setGetPRM_MST] = useState([]);
  const [DashbordTotalNumber, setDashbordTotalNumber] = useState([]);
  const [EditFlagStatus, setEditFlagStatus] = useState(0);

  const [lastRefreshTime,setLastRefesh] = useState("");
  const [refreshTime, setRefreshTime] = useState(null);
  const [count, setCount] = useState(0);

  // const fetchDashBordDataRefresh = async () => {
   
  //   try {
  //     const response = await httpCommon.get(
  //       "/get_gauge_dashbord_data.php?site_cd=" +
  //         site_ID +
  //         "&admin=" +
  //         emp_mst_loginID
  //     );
  //    // console.log("response____dashboard",response);
  //     if (response.data.status === "SUCCESS") {
  //       setDashbordData(response.data.data);
  //       setGetPRM_MST(response.data.PRM_MST);
  //       setDashbordTotalNumber(response.data.DashbrdCount);
  //       setDashbordDataFltrBy(response.data.RowDataFltBy);
  //       setDashbordDataSortBy(response.data.RowDataSortBy);
  //       setDashbordDataPrmMst(response.data.RowDataSortPrm_mst);
  //       // Swal.close();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchDashBordRefshTime = async () => {
    try {
      const response = await httpCommon.get(
        "/get_dashboardRefshTime.php?site_cd=" + site_ID
      );
     //  console.log("response____dash", response);
       if (response.data.status === "SUCCESS" && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const refreshTimeInMillis = response.data.data[0].RefshTime * 60000;
        setRefreshTime(refreshTimeInMillis);
     
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const fetchDashBordEditFlagStatus = async () => {
    try {
      const response = await httpCommon.get( 
        "/get_dashboard_edit_flag_status.php?site_cd=" + site_ID
      );
     // console.log("response____refreshEditFlag", response);
      if (response.data.status === "SUCCESS" && Array.isArray(response.data.data) && response.data.data.length > 0) {
        const refreshEditFlag = response.data.data[0].EditFlag;
        setEditFlagStatus(refreshEditFlag);
      
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 
  // Get Dashbord Data Api
  const fetchDashBordData = async () => {
   // console.log("refresh button___click___");
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
        "/get_gauge_dashbord_data.php?site_cd=" +
          site_ID +
          "&admin=" +
          emp_mst_loginID
      );
      //  console.log("response____dash__",response);
      if (response.data.status === "SUCCESS") {
        setDashbordData(response.data.data);
        setGetPRM_MST(response.data.PRM_MST);
        setDashbordTotalNumber(response.data.DashbrdCount);
        setDashbordDataFltrBy(response.data.RowDataFltBy);
        setDashbordDataSortBy(response.data.RowDataSortBy);
        setDashbordDataPrmMst(response.data.RowDataSortPrm_mst);
        Swal.close();
      }else{
        Swal.close();
      }
    } catch (error) {
      
      console.error("Error fetching data:", error);
    }
  };

  const handleOnClickDB = async (cfQueryRowID) => {
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    const cfRowID = cfQueryRowID;

    let newArrayFltr = null;
    let newArraySort = null;
    let newArrayPrm = null;

    Object.keys(GetAllDashbordDataFltrBy).map((key) => {
      if (cfRowID === key) {
        newArrayFltr = GetAllDashbordDataFltrBy[key];
      }
      return null;
    });

    Object.keys(GetAllDashbordDataSortBy).map((key) => {
      if (cfRowID === key) {
        newArraySort = GetAllDashbordDataSortBy[key];
      }
      return null;
    });
    Object.keys(GetDashbordDataPrmMst).map((key) => {
      if (cfRowID === key) {
        newArrayPrm = GetDashbordDataPrmMst[key];
      }
      return null;
    });

    Swal.showLoading();
    //console.log("newArrayFltr____",newArrayFltr);
    if (newArrayFltr && newArrayFltr.length > 0) {

      const firstItem = newArrayFltr[0];
      //console.log("firstItem____",firstItem);
    
      if(firstItem.cf_query_list_table === "ast_mst" || firstItem.cf_query_list_table === "ast_det"){
        navigate(`/dashboard/asset/list`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }else if(firstItem.cf_query_list_table === "wko_mst" || firstItem.cf_query_list_table === "wko_det"){
        navigate(`/dashboard/work/order`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }else if(firstItem.cf_query_list_table === "wkr_mst" || firstItem.cf_query_list_table === "wkr_det"){
        navigate(`/dashboard/work/list`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }else if(firstItem.cf_query_list_table === "itm_mst" || firstItem.cf_query_list_table === "itm_det"){
        navigate(`/dashboard/InventoryMaster/list`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }else if(firstItem.cf_query_list_table === "prm_mst" || firstItem.cf_query_list_table === "prm_det"){
        
        Swal.close();
        Swal.fire({
          icon:"warning",
          title: "Opps !",
          html: '<b>This Module Is Not Ready To View!</b>',
          allowOutsideClick: false,
          customClass: {
            container: "swalcontainercustom",
          },
        });
      
      }
      else if(firstItem.cf_query_list_table === "mtr_mst" || firstItem.cf_query_list_table === "mtr_det"){
        navigate(`/dashboard/MaterialRequest/list`, {
          state: {
            GaugeDashbordData: newArrayFltr,
            GaugeDashbordDataSort: newArraySort,
            DropListId: cfRowID,
          },
        });
        Swal.close();
      }
      
    } else if (newArrayPrm && newArrayPrm.length > 0) {
      navigate(`/dashboard/work/order`, {
        state: {
          GaugeDashbordData: newArrayFltr,
          GaugeDashbordDataSort: newArraySort,
          GetDashbordDataPrmMst: newArrayPrm,
          DropListId: cfRowID,
        },
      });
    }
  };

  const fetchLastRefshTime = async () => {
   // console.log("fetchLastRefshTime____");
    try {
      const response = await httpCommon.post(
        "/update_dashbord_last_refresh_time.php?site_cd=" + site_ID
      );
     
      if (response.data.status === "SUCCESS" && response.data.EndTime && response.data.EndTime.dsh_mst_last_refresh_time) {
        const responseTime = new Date(response.data.EndTime.dsh_mst_last_refresh_time.date);
        const day = String(responseTime.getDate()).padStart(2, '0');
        const month = String(responseTime.getMonth() + 1).padStart(2, '0');
        const year = responseTime.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // Convert hours to 12-hour format with AM/PM
        let hours = responseTime.getHours();
        const minutes = String(responseTime.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

        // Combine date and time
        const formattedDateTime = `${formattedDate} ${formattedTime}`;
        setLastRefesh(formattedDateTime);
        triggerIntervalFetch();

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const triggerIntervalFetch = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear the previous interval if it exists
    }
    const fetchDataAndSetInterval = async () => {
      await fetchDashBordRefshTime();
      await fetchLastRefshTime();
      await fetchDashBordData();
      await fetchDashBordEditFlagStatus();
    };
    intervalRef.current = setInterval(fetchDataAndSetInterval, refreshTime || 60000); // Set new interval
  }, [refreshTime]);



  useEffect(() => {
    const initialFetch = async () => {
      await fetchDashBordData(); 
      await fetchDashBordEditFlagStatus();
      await fetchLastRefshTime();
      await triggerIntervalFetch(); 
    };
  
    initialFetch(); 
  
    // Cleanup the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [triggerIntervalFetch]);

  useEffect(() => {
    // Cleanup interval when navigating away
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [location]);
  

  const handleOnClickGetdata = () => {
    fetchDashBordData();
    fetchLastRefshTime();
  };
  const sortedData = [...GetAllDashbordData].sort((a, b) => {
    return (
      parseInt(a.dsh_mst_display_order) - parseInt(b.dsh_mst_display_order)
    );
  });


  return (
    <Container maxWidth={settings.themeStretch ? false : "xl"}>
      <Grid container justifyContent="flex-end" alignItems="center" rowSpacing={0}>
      <Grid item>
      <span style={{ fontSize: '12px', fontWeight: 'bold', display: 'block' }}>
          Last Refresh
          <span style={{ display: 'block',marginBottom:'4px' }}>
            {lastRefreshTime ? lastRefreshTime : ""}
          </span>
        </span>
      </Grid>
      <Grid item>
        <Tooltip title="Refresh Data" placement="top" arrow>
          <button className="RefshBtn" onClick={() => handleOnClickGetdata()}>
            <Iconify
              icon="ic:sharp-refresh"
              width={24}
              height={24}
              style={{ fontSize: "22px", marginLeft: "8px" }} // Adjust margin as needed
            />
          </button>
        </Tooltip>
      </Grid>
    </Grid>

      <Grid
        container
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        mb={2}
      >
      
        {sortedData.map((item, index) => (
          <Grid item xs={12} md={4} key={index} className={EditFlagStatus === "1" ? "gaugeDBDisable" : EditFlagStatus === "0" ? "gaugeDB" : "gaugeDB"}>
            <AppWidgetSummary
              data={item}
              total={parseInt(DashbordTotalNumber[item.cf_query_RowID])}
              description={item.dsh_mst_desc}
             // onClick={() => handleOnClickDB(item.cf_query_RowID)}
              onClick={EditFlagStatus === "1" ? undefined : () => handleOnClickDB(item.cf_query_RowID)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
