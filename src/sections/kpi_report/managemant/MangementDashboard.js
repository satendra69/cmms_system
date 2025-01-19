import { Label } from "@material-ui/icons";
import {
  Autocomplete,
  ButtonBase,
  Card,
  Container,
  Divider,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Tooltip as T,
  Button
} from "@mui/material";
import { width } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { FormControl, Stack } from "react-bootstrap";
import { Grid } from "react-loader-spinner";
import Loader from "../spinner.gif"

import { useSettingsContext } from "src/components/settings";

import CustomPopover, { usePopover } from "src/components/custom-popover";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";
import AssetGroup from "./sections/AssetGroup";
import FaultCode from "./sections/Component/FaultCode";
import CauseCode from "./sections/Component/CauseCode";
import ActionCode from "./sections/Component/ActionCode";
import ReportCard from "./sections/Component/ReportCard";

import CustomBreadcrumbsKpi from "./sections/Component/custom-breadcrumbs-kpi/custom-breadcrumbs"; 

function MangementDashboard() {
  const [kpiData, setKpiData] = useState([]);
  const [kpiPieData, setKpiPieData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [PiefilterData, setPieFilterData] = useState([]);
  const [refetch,setReftch] = useState(false)
  const [loading,setLoading] = useState(true)
 
  const [CorrectiveToatal, setCorrectiveToatal] = useState(0);
  const [PreventiveToatal, setPreventiveToatal] = useState(0);
  const [CorrectiveToatalPie, setCorrectiveToatalPie] = useState(0);
  const [PreventiveToatalPie, setPreventiveToatalPie] = useState(0);
  const [selectedGraph, setSelectedGraph] = useState("default");
  const [selectedPie, setSelectedPie] = useState("default");
  const [seriesData, setSeriesData] = useState("2024");
  const [seriesData2, setSeriesData2] = useState("Yearly");
  const [seriesDataLoc, setSeriesDataLoc] = useState("All Location");
  const popover = usePopover();
  const popover2 = usePopover();
  const popoverloc = usePopover();
  const [activeBar, setActiveBar] = useState(null);

  const handleMouseEnter = (data, index) => {
    setActiveBar(index);
  };

  const handleMouseLeave = () => {
    setActiveBar(null);
  };

  // monthly weekly filter
  const [sortBy, setSortBy] = useState([
    { label: "Monthly", value: "Monthly" },
    { label: "Yearly", value: "Yearly" },
    { label: "Weekly", value: "Weekly" },
  ]);
  const [selectedsortBy, setSelectedsortBy] = useState([
    { label: "Monthly", value: "Monthly" },
  ]);

  const [sortLocation, setSortLocation] = useState([
    {
      label: "All Location",
      value: "All Location",
    },
    {
      label: "Common Area",
      value: "Common Area",
    },
    {
      label: "Garden",
      value: "Garden",
    },
    {
      label: "Grinding Room",
      value: "Grinding Room",
    },
  ]);

  useEffect(() => {
    const fetchYear = async () => {
      try {
        const response = await httpCommon.get(
          `/get_kpi_yr.php?site_cd=${site_ID}`
        );
        if (response.data.status === "SUCCESS") {
          const uniqueData = Array.from(
            new Set(response.data.data.map((item) => item.Monthyear))
          ).map((monthyear) => ({
            label: monthyear,
            value: monthyear,
          }));

          setSortYear(uniqueData);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchYear();
  }, []);

  const [sortYear, setSortYear] = useState([]);
  const [selectedSortYear, setSelectedSortYear] = useState({
    label: "2024",
    value: "2024",
  });

  const [selectedSortYear2, setSelectedSortYear2] = useState({
    label: "2023",
    value: "2023",
  });
  const sort = selectedsortBy ? selectedsortBy.value : "Yearly";
  const sort2 = selectedsortBy ? selectedsortBy.value : "";
  const year = selectedSortYear ? selectedSortYear.value : "2023";
  // const monthparam = selectedMonth ?selectedMonth.values:"0"

  const site_ID = localStorage.getItem("site_ID");
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

  useEffect(() => {
    const fetchKpi = async () => {
      setReftch(false)
      // const sort = selectedsortBy.value;
      let loc = seriesDataLoc ? seriesDataLoc : "All Location";
      const year = seriesData ? seriesData : "2023";
      const response = await httpCommon.get(
        `/get_kpi_maintence_data.php?site_cd=${site_ID}&year=${
          year ? year : "2024"
        }&sortBy=${sort ? sort : "Monthly"}&location=${loc}`
      );

      if (response.data.status === "SUCCESS") {
        setKpiData(response.data.kpi_result);
        const rep = response.data.kpi_result;
        const formattedData = rep.map((item) => {
          let sumPreventive =
            item.WorkOrderType === "Preventive" ? item.TotalWO : 0;
          let sumCorrective =
            item.WorkOrderType === "Corrective" ? item.TotalWO : 0;

          return {
            name: item.MonthName,
            Preventive: item.WorkOrderType === "Preventive" ? item.TotalWO : "",
            Corrective: item.WorkOrderType === "Corrective" ? item.TotalWO : "",
            TotalWoPSum: item.WorkOrderType === "Preventive" ? item.TotalWO : 0,
            TotalWoCSum: item.WorkOrderType === "Corrective" ? item.TotalWO : 0,
          };
        });

        const aggregatedData = rep.reduce((acc, entry) => {
          const key = `${entry.MonthNo}_${entry.MonthName}`;
          console.log("key", key);
          if (!acc[key]) {
            acc[key] = {
              MonthNo: entry.MonthNo,
              MonthName: entry.MonthName,
              TotalWO_Preventive: 0,
              TotalWO_Corrective: 0,
            };
          }

          if (entry.WorkOrderType === "Preventive") {
            acc[key].TotalWO_Preventive += entry.TotalWO;
          } else if (entry.WorkOrderType === "Corrective") {
            acc[key].TotalWO_Corrective += entry.TotalWO;
          }
          return acc;
        }, {});

        // Convert the aggregated map back to an array of objects
        const aggregatedDataArray = Object.values(aggregatedData);

        setFilterData(aggregatedDataArray);

        let correctiveTotal = 0;
        let preventiveTotal = 0;
        // setSelectedSortYear({
        //   label: year, value: year ,
        // })

        rep.forEach((result) => {
          if (result.WorkOrderType === "Corrective") {
            correctiveTotal += result.TotalWO;
          } else if (result.WorkOrderType === "Preventive") {
            preventiveTotal += result.TotalWO;
          }
        });

        setCorrectiveToatal(correctiveTotal);
        setPreventiveToatal(preventiveTotal);
      }
    };

    fetchKpi();
  }, [
    selectedsortBy,
    selectedSortYear,
    setSelectedsortBy,
    setSelectedSortYear,
    seriesData,
    seriesDataLoc,
    refetch
  ]);

  // pie Chart Data
  useEffect(() => {
    const fetchKpi = async () => {
      let sort = seriesData2 ? seriesData2 : "Yearly";

      // const sort = selectedsortBy.value;
      const year =
        seriesData2 && selectedSortYear2.value ? selectedSortYear2.value : "";

      const response = await httpCommon.get(
        `/get_kpi_maintence_data_pie.php?site_cd=${site_ID}&sortBy=${
          sort ? sort : "Yearly"
        }&year=${year}`
      );
    //  console.log("response", response);
      if (response.data.status === "SUCCESS") {
        setKpiPieData(response.data.kpi_result_pie);
        const rep = response.data.kpi_result_pie;

        const aggregatedData = rep.reduce((acc, entry) => {
          if (seriesData2 === "Monthly") {
            const key = `${entry.MonthNo}_${entry.MonthName}`;
            if (!acc[key]) {
              acc[key] = {
                MonthNo: entry.MonthNo,
                Monthyear: entry.MonthName,
                TotalWO_Preventive: 0,
                TotalWO_Corrective: 0,
              };
            }
            if (entry.WorkOrderType === "Preventive") {
              acc[key].TotalWO_Preventive += entry.TotalWO;
            } else if (entry.WorkOrderType === "Corrective") {
              acc[key].TotalWO_Corrective += entry.TotalWO;
            }
          } else if (seriesData2 === "Yearly") {
            const key = `${entry.Monthyear}`;
            if (!acc[key]) {
              acc[key] = {
                Monthyear: entry.Monthyear,
                TotalWO_Preventive: 0,
                TotalWO_Corrective: 0,
              };
            }
            if (entry.WorkOrderType === "Preventive") {
              acc[key].TotalWO_Preventive += entry.TotalWO;
            } else if (entry.WorkOrderType === "Corrective") {
              acc[key].TotalWO_Corrective += entry.TotalWO;
            }
          } else if (seriesData2 === "Weekly") {
            const key = `${entry.MonthNumber}`;

            // Initialize acc[key] if it doesn't exist
            if (!acc[key]) {
              acc[key] = {
                Week1: {
                  Monthyear: "Week 1",
                  TotalWO_Preventive: 0,
                  TotalWO_Corrective: 0,
                },
                Week2: {
                  Monthyear: "Week 2",
                  TotalWO_Preventive: 0,
                  TotalWO_Corrective: 0,
                },
                Week3: {
                  Monthyear: "Week 3",
                  TotalWO_Preventive: 0,
                  TotalWO_Corrective: 0,
                },
                Week4: {
                  Monthyear: "Week 4",
                  TotalWO_Preventive: 0,
                  TotalWO_Corrective: 0,
                },
              };
            }

            // Update totals based on entry.WorkOrderType
            switch (entry.WeekNumber % 4) {
              case 1:
                acc[key].Week1.TotalWO_Preventive +=
                  entry.WorkOrderType === "Preventive" ? entry.TotalWO : 0;
                acc[key].Week1.TotalWO_Corrective +=
                  entry.WorkOrderType === "Corrective" ? entry.TotalWO : 0;
                break;
              case 2:
                acc[key].Week2.TotalWO_Preventive +=
                  entry.WorkOrderType === "Preventive" ? entry.TotalWO : 0;
                acc[key].Week2.TotalWO_Corrective +=
                  entry.WorkOrderType === "Corrective" ? entry.TotalWO : 0;
                break;
              case 3:
                acc[key].Week3.TotalWO_Preventive +=
                  entry.WorkOrderType === "Preventive" ? entry.TotalWO : 0;
                acc[key].Week3.TotalWO_Corrective +=
                  entry.WorkOrderType === "Corrective" ? entry.TotalWO : 0;
                break;
              case 0:
              case 4:
                acc[key].Week4.TotalWO_Preventive +=
                  entry.WorkOrderType === "Preventive" ? entry.TotalWO : 0;
                acc[key].Week4.TotalWO_Corrective +=
                  entry.WorkOrderType === "Corrective" ? entry.TotalWO : 0;
                break;
              default:
                break;
            }
          } else {
            const key = `${entry.Monthyear}`;
            if (!acc[key]) {
              acc[key] = {
                Monthyear: entry.Monthyear,
                TotalWO_Preventive: 0,
                TotalWO_Corrective: 0,
              };
            }
            if (entry.WorkOrderType === "Preventive") {
              acc[key].TotalWO_Preventive += entry.TotalWO;
            } else if (entry.WorkOrderType === "Corrective") {
              acc[key].TotalWO_Corrective += entry.TotalWO;
            }
          }

          return acc;
        }, {});
        const aggregatedDataArray = Object.values(aggregatedData);

        if (sort === "Weekly") {
          const aggregatedDataArray2 = Object.values(aggregatedDataArray[0]);
          setPieFilterData(aggregatedDataArray2);
        } else {
          setPieFilterData(aggregatedDataArray);
        }

        let correctiveTotal = 0;
        let preventiveTotal = 0;

        rep.forEach((result) => {
          if (result.WorkOrderType === "Corrective") {
            correctiveTotal += result.TotalWO;
          } else if (result.WorkOrderType === "Preventive") {
            preventiveTotal += result.TotalWO;
          }
        });

        setCorrectiveToatalPie(correctiveTotal);
        setPreventiveToatalPie(preventiveTotal);
      }
    };

    fetchKpi();
  }, [
    selectedsortBy,
    selectedSortYear,
    setSelectedsortBy,
    setSelectedSortYear,
    selectedSortYear2,
    setSelectedSortYear2,
    seriesData2,
  ]);

  const settings = useSettingsContext();

  const formatTitle = (title) => {
    const ta = title.split("_");
    return ta[1];
  };

  const CustomTooltip = ({ active, payload }) => {
    console.log("month", payload);
    if (payload) {
      const newD = payload[0];
      let month;
      let monthname;
      if (newD) {
        month = newD.payload;
        monthname = month.MonthName;
      }

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p className="label" style={{ margin: 0, fontWeight: "bold" }}>
            {monthname}
          </p>
          {payload.map((item) => (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div
                style={{
                  height: "8px",
                  width: "8px",
                  background: `${item.color}`,
                  borderRadius: "50%",
                }}
              ></div>
              <p
                className="label"
                style={{ margin: 0, fontSize: "12px", color: `${item.color}` }}
              >
                {" "}
                Total {item.value} WOs for {formatTitle(item.name)}
              </p>
            </div>
          ))}
        </div>
      );
    }
  };

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      setSeriesData(newValue);
    },
    [popover]
  );

  const handleChangeLocation = useCallback(
    (newValue) => {
      popoverloc.onClose();
      setSeriesDataLoc(newValue);
    },
    [popover]
  );

  const handleChangeSeries2 = useCallback(
    (newValue) => {
      popover2.onClose();
      setSeriesData2(newValue);
    },
    [popover2]
  );

  // custom bar
  const CustomBar = ({ fill, x, y, width, height }) => (
    <g>
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="1"
            dy="2"
            stdDeviation="2"
            floodColor="#888888"
            floodOpacity="0.5"
          />
        </filter>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        filter="url(#shadow)"
        rx={0}
        ry={5}
      />
    </g>
  );

  return (
    <div className="kpi_management">
      <Container maxWidth={settings.themeStretch ? false : "lg"} className="cont">

      <div
          className="CustomBreadAssetSave asset kpi"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "500px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
        
          }}
        >
          <CustomBreadcrumbsKpi
            heading={`Work Order Analysis ${seriesDataLoc} ${seriesData}`}
            links={[]}
            action={
              <div className="headerAction">
              <div className="select" style={{  }}>
                <Stack spacing={1} sx={{ pb: 1, mt: 2 }} style={{marginRight:"8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}} className="filterBox">
                  <Typography variant="subtitle2" sx={{whiteSpace:"nowrap"}} >Filter By</Typography>

                  <ButtonBase
                    onClick={popover.onOpen}
                    sx={{
                      py: 0.5,
                      pr: 0.5,
                      borderRadius: 1,
                      typography: "subtitle2",
                      bgcolor: "background.neutral",
                      width: "100px",
                    }}
                  >
                    {seriesData}

                    <Iconify
                      width={16}
                      icon={
                        popover.open
                          ? "eva:arrow-ios-upward-fill"
                          : "eva:arrow-ios-downward-fill"
                      }
                      sx={{ ml: 0.5 }}
                    />
                  </ButtonBase>
                  </div>
                </Stack>
                <CustomPopover
                  open={popover.open}
                  onClose={popover.onClose}
                  sx={{ width: 140 }}
                >
                  {sortYear.map((option) => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === seriesData}
                      onClick={() => handleChangeSeries(option.value)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </CustomPopover>
              </div>

              {/* filter by location */}
              {/* style={{  }} */}
              <div className="select byloc"  >
                <Stack spacing={1} sx={{ pb: 1, mt: 2 }}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}} className="filterBox">
                  <Typography variant="subtitle2">
                    Filter By Location
                  </Typography>

                  <ButtonBase
                    onClick={popoverloc.onOpen}
                    sx={{
                      py: 0.5,
                      pr: 0.5,
                      borderRadius: 1,
                      typography: "subtitle2",
                      bgcolor: "background.neutral",
                      width: "150px",
                    }}
                  >
                    {seriesDataLoc}

                    <Iconify
                      width={16}
                      icon={
                        popoverloc.open
                          ? "eva:arrow-ios-upward-fill"
                          : "eva:arrow-ios-downward-fill"
                      }
                      sx={{ ml: 0.5 }}
                    />
                  </ButtonBase>
                  </div>
                </Stack>

                <CustomPopover
                  open={popoverloc.open}
                  onClose={popoverloc.onClose}
                  sx={{ width: 140 }}
                >
                  {sortLocation.map((option) => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === seriesDataLoc}
                      onClick={() => handleChangeLocation(option.value)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </CustomPopover>
              </div>
            </div>
            }
            
            sx={{ mb: { xs: 3, md: 5, } }}
          />
        </div>

        {/* pichart */}

        {/* <div className="kpi_report" style={{ marginTop: "70px" }}>
          <Card style={{  height: "450px",padding:"0 20px" }}>
            <div className="title" style={{marginTop:"20px"}}>
              <div>
                <h3 style={{ fontStyle: "bold" }}>
                  Corrective vs Preventive Maintenance Work Order Analysis
                </h3>
                <Divider
                  style={{ width: "50%", height: "10px", marginTop: "-25px" }}
                />
                <div className="middle -mt100" style={{ marginTop: "-10px" }}>
                  <div
                    className="corrective"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      
                    }}
                  >
                    <div
                      className="corrective_title"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setSelectedPie("Corrective")}
                      onMouseLeave={() => setSelectedPie("default")}
                    >
                      <span
                        style={{
                          height: "14px",
                          width: "14px",
                          background: "#16786A",
                          borderRadius: "50%",
                        }}
                      ></span>
                      <p style={{fontSize:"14px"}}>Corrective</p>
                    </div>
                    <div
                      className="corrective_no"
                      style={{
                        marginLeft: "25px",
                        whiteSpace: "nowrap",
                        marginTop: "-17px",
                      }}
                    >
                 <Typography style={{fontSize:"13px"}}>   {CorrectiveToatal} Work Orders </Typography>  
                    </div>
                  </div>

                  <div
                    className="premitive"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginLeft:"-50px"
                       
                    }}
                    onMouseEnter={() => setSelectedPie("Preventive")}
                    onMouseLeave={() => setSelectedPie("default")}
                  >
                    <div
                      className="premitive"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginLeft: "50px",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          height: "14px",
                          width: "14px",
                          background: "#FFAB00",
                          borderRadius: "50%",
                    
                        }}
                      ></span>
                      <p style={{fontSize:"14px"}}>Preventive</p>
                    </div>
                    <div
                      className="corrective_no"
                      style={{
                        marginLeft: "70px",
                        whiteSpace: "nowrap",
                        marginTop: "-17px",
                      }}
                    >
                     <Typography style={{fontSize:"13px"}}> {PreventiveToatal} Work Orders</Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>

     
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
          
              }}
            >
              <div style={{width:"10%",marginLeft:"-50px"}}>
              <h2 className="vertical_text" >Total Work Order</h2>
              </div>
              <div className="chart" style={{width:"90%",marginLeft:"-50px"}}>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart
                   height={500} // Increase or decrease height to manage spacing
                   width={800} 
                    data={filterData}
                    margin={{ top: 10, right: 70, left: 10, bottom: 20 }} // Adjust margins as needed
                    padding={{left:10}}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="2 4" vertical={false} interval={0} />

                    <XAxis
                      dataKey="MonthName"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      scale="point"
                      tick={{ fontSize: 14 }}
                      stroke="gray"
                      padding={{ left: 30, right: 20 }}
                      textAnchor="end"
                      dx={10}
                      tickSize={10}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 14 }}
                      stroke="gray"
                      tickSize={10}
                     
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {selectedPie === "default" && (
                      <>
                        <Bar
                          dataKey="TotalWO_Preventive"
                          fill="#FFAB00"
                          barSize={20}
                          stackId="a"
                          shape={<CustomBar />}
                          activeShape={false}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        />
                        <Bar
                          dataKey="TotalWO_Corrective"
                          fill="#15786B"
                          barSize={20}
                          stackId="a"
                          shape={<CustomBar />}
                          activeShape={false}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        />
                      </>
                    )}

                    {selectedPie === "Preventive" && (
                      <Bar
                        dataKey="TotalWO_Preventive"
                        fill="#FFAB00"
                        stackId="a"
                        barSize={20}
                        shape={<CustomBar />}
                      />
                    )}

                    {selectedPie === "Corrective" && (
                      <Bar
                        dataKey="TotalWO_Corrective"
                        fill="#15786B"
                        stackId="a"
                        barSize={20}
                        shape={<CustomBar />}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div> */}

        {/*  card */}
 <> 
 
        <div  className="mtRep">
          <ReportCard seriesData={seriesData} seriesDataLoc={seriesDataLoc} setLoading={setLoading} />
        </div>


        <div style={{ flex: "1 1 calc(50% - 20px)", boxSizing: "border-box" }}>
          <AssetGroup seriesData={seriesData} seriesDataLoc={seriesDataLoc} setLoading={setLoading} />
        </div>

 
        <div style={{ flex: "1 1 calc(50% - 20px)", boxSizing: "border-box" }}>
          <FaultCode seriesData={seriesData} seriesDataLoc={seriesDataLoc} setLoading={setLoading} />
        </div>


        <div style={{ flex: "1 1 calc(50% - 20px)", boxSizing: "border-box" }}>
          <CauseCode seriesData={seriesData} seriesDataLoc={seriesDataLoc} setLoading={setLoading} />
        </div>


        <div style={{ flex: "1 1 calc(50% - 20px)", boxSizing: "border-box" }}>
          <ActionCode seriesData={seriesData} seriesDataLoc={seriesDataLoc} setLoading={setLoading} />
        </div>
        </>
   

    { loading && (   <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"80vh",background:"white"}}>
          <img src={Loader} alt="loader"/>

        </div>)}
        
      </Container>
  


   
      
      


    </div>
  );
}

export default MangementDashboard;
