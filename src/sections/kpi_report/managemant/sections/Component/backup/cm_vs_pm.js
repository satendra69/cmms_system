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
  Tooltip as T
} from "@mui/material";
import { width } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { FormControl, Stack } from "react-bootstrap";
import { Grid } from "react-loader-spinner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSettingsContext } from "src/components/settings";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";

function PreventiveAndComperitive({seriesData,seriesDataLoc}) {
  const [kpiData, setKpiData] = useState([]);
  const [kpiPieData, setKpiPieData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [PiefilterData, setPieFilterData] = useState([]);

  const [CorrectiveToatal, setCorrectiveToatal] = useState(0);
  const [PreventiveToatal, setPreventiveToatal] = useState(0);
  const [CorrectiveToatalPie, setCorrectiveToatalPie] = useState(0);
  const [PreventiveToatalPie, setPreventiveToatalPie] = useState(0);
  const [selectedGraph, setSelectedGraph] = useState("default");
  const [selectedPie, setSelectedPie] = useState("default");

  const [seriesData2, setSeriesData2] = useState("Yearly");
 
  const popover = usePopover();
  const popover2 = usePopover();
  const popoverloc = usePopover();
  const [activeBar, setActiveBar] = useState(null);
  const [clciked, setClicked] = useState(false);
  const [clciked2, setClicked2] = useState(false);

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
  const colors = ["#15786B", "#FFAB00", "#ef4444", "#00b8d9","#a3e635","#14b8a6","#db2777","#a16207","#a1a1aa","#67e8f9","#ccfbf1"];

  useEffect(() => {
    const fetchKpi = async () => {
      // const sort = selectedsortBy.value;
      let loc = seriesDataLoc ? seriesDataLoc : "All Location";
      const year = seriesData ? seriesData : "2023";
      const response = await httpCommon.get(
        `/get_kpi_maintence_data.php?site_cd=${site_ID}&year=${
          year ? year : "2024"
        }&sortBy=${sort ? sort : "Monthly"}&location=${loc}`
      );

      console.log("responseKPI", response);
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
      console.log("response", response);
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
    if (!active || !payload || payload.length === 0) {
      return null; // Do not render if not active or no payload
    }
  
    const newD = payload[0];
    let monthName = '';
  
    if (newD) {
      const month = newD.payload;
      if (month && month.MonthName) {
        monthName = month.MonthName;
      }
    }
  
    return (
      <div className="custom-tooltip" style={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <p className="label" style={{ margin: 0, fontWeight: 'bold' }}>{monthName}</p>
        {payload.filter(item => item.value > 0).map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ height: '8px', width: '8px', background: `${item.color}`, borderRadius: '50%' }}></div>
            <p className="label" style={{ margin: 0, fontSize: '12px', color: `${item.color}` }}>
              Total {item.value} WOs for {formatTitle(item.name)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
   
    },
    [popover]
  );

  const handleChangeLocation = useCallback(
    (newValue) => {
      popoverloc.onClose();
     
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
     

        {/* pichart */}

        <div className="kpi_report" style={{ marginTop: "10px" }}>
          <Card style={{  height: "420px",padding:"0 20px" }}>
            <div className="title">
              <div>
              <h3
                  style={{
                    fontStyle: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    fontSize: "16px",
                    marginTop:"3px",
                    paddingBottom:"8px"
                  }}
                  className="h2mob"
                >
                  CM vs PM Work Order Analysis
                </h3>
             
                <div className="middle -mt100" style={{ marginTop: "-28px"}}>
                  <div
                    className="corrective"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor:"pointer"
                    }}
                    onClick={() => {
                      if (clciked && clciked2) {
                        setSelectedPie("Corrective");
                        setClicked(false);
                      } else if (clciked) {
                        if (!clciked2) {
                          setSelectedPie("default");
                          setClicked(false);
                        } else {
                          setSelectedPie("Corrective");
                        }
                      } else if (clciked2) {
                        setSelectedPie("");
                        setClicked(true);
                      } else {
                        setClicked(true);
                        setSelectedPie("Preventive");
                      }
                    }}

                  >
                    <div
                      className="corrective_title"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                        width:"100%",
                    
                      }}

                      



                      // onMouseEnter={() => setSelectedPie("Corrective")}
                      // onMouseLeave={() => setSelectedPie("default")}
                    >
                      <span
                        style={{
                          height: "10px",
                          width: "10px",
                          background: clciked?"#a7f3d0":"#16786A",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      ></span>
                      
                      <p style={{fontSize:"12px", cursor: "pointer",fontWeight:"bold",color:"rgb(99, 115, 129)"}}>Corrective</p>
                
                    </div>
                    <div
                      className="corrective_no"
                      style={{ whiteSpace: "nowrap", marginTop: "-14px" }}
                    >
                      <Typography
                        style={{ fontSize: "14px", fontWeight: "700",color:"rgb(99, 115, 129)" }}
                      >
                        {CorrectiveToatal}
                      </Typography>
                    </div>
                  </div>

                  <div
                    className="premitive"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginLeft:"-40px",
                    
                       
                    }}

                  



                    // onMouseEnter={() => setSelectedPie("Preventive")}
                    // onMouseLeave={() => setSelectedPie("default")}
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
                      onClick={() => {
                        if (clciked && clciked2) {
                          setSelectedPie("Preventive");
                          setClicked2(false);
                        } else if (clciked2) {
                          if (!clciked) {
                            setSelectedPie("default");
                            setClicked2(false);
                          } else {
                            setSelectedPie("Preventive");
                          }
                        } else if (clciked) {
                          setSelectedPie("");
                          setClicked2(true);
                        } else {
                          setClicked2(true);
                          setSelectedPie("Corrective");
                        }
                      }}
                    >
                      <span
                        style={{
                          height: "10px",
                          width: "10px",
                          background: clciked2?"#fed7aa":"#FFAB00" ,
                          borderRadius: "50%",
                    
                        }}
                      ></span>
                    
                      <p style={{fontSize:"12px",fontWeight:"bold",color:"rgb(99, 115, 129)"}}>Preventive</p>
                    </div>
                    <div
                      className="corrective_no"
                      style={{
                        marginLeft: "70px",
                        whiteSpace: "nowrap",
                        marginTop: "-14px",
                      }}
                    >
                     <Typography style={{fontSize:"14px",fontWeight:"700",color:"rgb(99, 115, 129)"}}> {PreventiveToatal} </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>

     
            <div
              style={{
           
                display: "flex",
                justifyContent: "center",
          
              }}
              className="cont_chart"
            >
              <div style={{width:"10%",marginLeft:"-30px",}}>
              <h2 className="vertical_text op"style={{marginTop:"10rem"}} >Total Work Order</h2>
              </div>
              <div
              className="chart mlneg2 mtag"
              style={{
                width: "150%",
                marginLeft: "-50px",
                marginTop: "10px",
                position:"relative"
              }}
            >
                
    <div style={{ width: "10%", marginLeft: "-50px" }} className="mltotal mtegmob2">
              <h2 className="vertical_text" style={{fontSize:"8px"}}>Total Work Order</h2>
            </div>
                
                
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                  
                    data={filterData}
                    // margin={{ top: 10, right: 70, left: 10, bottom: 20 }} 
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
        </div>

      
    </div>
  );
}

export default PreventiveAndComperitive;
