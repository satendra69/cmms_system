// #006c9c:blue rose:#e11d48
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
import EcommerceYearlySales from "src/sections/overview/e-commerce/ecommerce-yearly-sales";
import { color } from "framer-motion";

function TopActionCode({seriesData,seriesDataLoc}) {
  const [kpiData, setKpiData] = useState([]);
  const [kpiPieData, setKpiPieData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [PiefilterData, setPieFilterData] = useState([]);
  const [brk, setBrk] = useState(0);
  const [stain, setStain] = useState(0);

  const [oo1Pie, setOo1Pie] = useState(0);
  const [oo2Pie, setOo2Pie] = useState(0);
 

  const [PreventiveToatalPie, setPreventiveToatalPie] = useState(0);
  const [selectedGraph, setSelectedGraph] = useState("default");
  const [temp,setTemp] = useState([])
  const [selectedPie, setSelectedPie] = useState("default");
 
  const [seriesData2, setSeriesData2] = useState("Yearly");
  const [totalSum,setTotalSum]=useState([])
  const [totalSumPie,setTotalSumPie]=useState([])
  const [types,setTypes] = useState([])
 
  const popover = usePopover();
  const popover2 = usePopover();
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

  // getting all the year
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
  const year = selectedSortYear ? selectedSortYear.value : "2024";
  // const monthparam = selectedMonth ?selectedMonth.values:"0"

  const site_ID = localStorage.getItem("site_ID");
  const colors = ["#15786B", "#FFAB00", "#ef4444", "#00b8d9"];


  function convertKPIData(kpiResult) {
    // Step 1: Group data by year and month
    const groupedByYearMonth = kpiResult.reduce((acc, item) => {
        const date = new Date(item.wko_mst_org_date.date);
        const year = date.getFullYear();
        const month = item.MonthNo; // Ensure this is 1-based
        const type = item.TotalType;
        const totalWo = item.TotalWO;
       

        // Initialize the nested objects if not present
        if (!acc[year]) acc[year] = {};
        if (!acc[year][month]) acc[year][month] = {};

        if (!acc[year][month][type]) acc[year][month][type] = 0;
        acc[year][month][type] += totalWo;

        return acc;
    }, {});

    // Debugging: Print the grouped data to inspect it
    console.log("Grouped Data:", JSON.stringify(groupedByYearMonth, null, 2));

    // Step 2: Determine all unique TotalType values
    const allTypes = new Set();
    kpiResult.forEach(item => allTypes.add(item.TotalType));
    const typesArray = Array.from(allTypes);



    // Step 3: Transform the data into the desired format
    const series = Object.keys(groupedByYearMonth).map(year => {
        const monthsData = groupedByYearMonth[year];
        return {
            year: year.toString(),
            data: typesArray.map(type => ({
                name: type,
                data: Array.from({ length: 12 }, (_, monthIndex) => {
                   
                    const value = monthsData[monthIndex + 1]?.[type] || 0;
                    return value;
                })
            }))
        };
    });

    // Debugging: Print the final series data
    console.log("Series Data:", JSON.stringify(series, null, 2));

    return { series };
}











  useEffect(() => {
    const fetchKpi = async () => {
      const today = new Date();

      // Get the current year
      const currentYear = today.getFullYear();
      let loc = seriesDataLoc ?seriesDataLoc:"All Location";
      // const sort = selectedsortBy.value;
      const year = seriesData ? seriesData : currentYear;
      const response = await httpCommon.get(
        `/get_kpi_action_code.php?site_cd=${site_ID}&year=${year}&location=${loc}`
      );

      if (response.data.status === "SUCCESS") {
        const data =response.data.kpi_result

        // const formattedData = convertKPIData(data);
        // setTemp(formattedData);
       
        const totalTypes = data.map((item)=>item.TotalType)

        // Step 2: Filter out empty strings if needed
        const filteredTotalTypes = totalTypes.filter(type => type.trim() !== "");
        const uniqueTotalValue = new Set(filteredTotalTypes);

      const uniqueType = Array.from(uniqueTotalValue)

      setTypes(uniqueType)

        setKpiData(response.data.kpi_result);
        const rep = response.data.kpi_result;

        const aggregatedData = rep.reduce((acc, entry) => {
          const key = `${entry.MonthNo}_${entry.MonthName}`;
        
          if (!acc[key]) {
            acc[key] = {
              MonthNo: entry.MonthNo,
              MonthName: entry.MonthName,
              ...uniqueType.reduce((obj, type) => ({ ...obj, [type]: 0 }), {})
            };
          }
          if (entry.TotalType.trim() !== "") {
            acc[key][entry.TotalType] += entry.TotalWO;
          }
        
          return acc;
        }, {});
        
      
        const totalSumByType = uniqueType.reduce((acc, type) => {
          acc[type] = Object.values(aggregatedData).reduce((sum, data) => sum + (data[type] || 0), 0);
          return acc;
        }, {});
        
     
        const totalTypeSummary = Object.keys(totalSumByType).map(type => ({
          TotalType: type,
          TotalSum: totalSumByType[type],
        }));
        
        const aggregatedDataArray = Object.values(aggregatedData);
      
        setTotalSum(totalTypeSummary)
        setFilterData(aggregatedDataArray)     
      }
    };

    fetchKpi();
  }, [
    selectedsortBy,
    selectedSortYear,
    setSelectedsortBy,
    setSelectedSortYear,
    seriesData,
    seriesDataLoc
  ]);

  // pie Chart Data
  useEffect(() => {
    const fetchKpi = async () => {
      let sort = seriesData2 ? seriesData2 : "Yearly";
      
      // const sort = selectedsortBy.value;
      const year =
        seriesData2 && selectedSortYear2.value ? selectedSortYear2.value : "";

      const response = await httpCommon.get(
       `/get_kpi_action_code_pie.php?site_cd=${site_ID}&sortBy=${
          sort ? sort : "Yearly"
        }&year=${year}`
      );
    
      if (response.data.status === "SUCCESS") {
        setKpiPieData(response.data.kpi_result_pie);
        const data = response.data.kpi_result_pie;
        const totalTypes = data.map((item)=>item.TotalType)

        // Step 2: Filter out empty strings if needed
        const filteredTotalTypes = totalTypes.filter(type => type.trim() !== "");
        const uniqueTotalValue = new Set(filteredTotalTypes);

      const uniqueType = Array.from(uniqueTotalValue)
     

        const aggregatedData = data.reduce((acc, entry) => {
          if (seriesData2 === "Monthly") {
            const key = `${entry.MonthNo}_${entry.MonthName}`;

            if (!acc[key]) {
              acc[key] = {
                MonthNo: entry.MonthNo,
                Monthyear: entry.MonthName,
                ...uniqueType.reduce((obj, type) => ({ ...obj, [type]: 0 }), {})
              };
            }

            if (entry.TotalType.trim() !== "") {
              acc[key][entry.TotalType] += entry.TotalWO;
            }
          } else if (seriesData2 === "Yearly") {
            const key = `${entry.Monthyear}`;
            if (!acc[key]) {
              acc[key] = {
                Monthyear: entry.Monthyear,
                ...uniqueType.reduce((obj, type) => ({ ...obj, [type]: 0 }), {})
              };
            }
            if (entry.TotalType.trim() !== "") {
              acc[key][entry.TotalType] += entry.TotalWO;
            }
          } else if (seriesData2 === "Weekly") {
            const key = `${entry.WeekNumber}`;
            if (!acc[key]) {
              acc[key] = {
                MonthNo: entry.MonthNumber,
                Monthyear: `Week ${entry.WeekNumber}`,
                ...uniqueType.reduce((obj, type) => ({ ...obj, [type]: 0 }), {})
              };
            }
            if (entry.TotalType.trim() !== "") {
              acc[key][entry.TotalType] += entry.TotalWO;
            }
        
          } else {
            const key = `${entry.Monthyear}`;
            if (!acc[key]) {
              acc[key] = {
                Monthyear: entry.Monthyear,
                ...uniqueType.reduce((obj, type) => ({ ...obj, [type]: 0 }), {})
              };
            }
            if (entry.TotalType.trim() !== "") {
              acc[key][entry.TotalType] += entry.TotalWO;
            }
          }

          return acc;
        }, {});
        console.log("aggregatedData_Ass", aggregatedData);
        const aggregatedDataArray = Object.values(aggregatedData);
        const totalSumByType = uniqueType.reduce((acc, type) => {
          acc[type] = Object.values(aggregatedData).reduce((sum, data) => sum + (data[type] || 0), 0);
          return acc;
        }, {});
        
     
        const totalTypeSummary = Object.keys(totalSumByType).map(type => ({
          TotalType: type,
          TotalSum: totalSumByType[type],
        }));
      
      
        setTotalSumPie(totalTypeSummary)

        setPieFilterData(aggregatedDataArray);

      
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

  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();

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

  // CustomTootlTip
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
              Total {item.value} WOs for {item.name}
            </p>
          </div>
        ))}
      </div>
    );
  };




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
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        {/* top */}


        {/* <div className="kpi_report">
          <Card style={{ padding: "20px" }}>
            <div className="cardH">
              <div className="title">
                <div>
                  <h3 style={{ fontStyle: "bold", marginBottom: "4px" }}>
                  Top Ten Action Code by Corrective Work Order
                  </h3>
                  <Divider style={{ width: "50%", height: "10px" }} />
                </div>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                {
                  totalSum.map((item,i)=>(

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
                    onMouseEnter={() => setSelectedGraph(item.TotalType)}
                    onMouseLeave={() => setSelectedGraph("default")}
                  >
                   
                    <span
                      style={{
                        height: "20px",
                        width: "20px",
                        background: `${colors[i]}`,
                        borderRadius: "50%",
                      }}
                      className="shadowBt"
                    ></span>
                  
                    <p>{item.TotalType}</p>
                  </div>
                  <div
                    className="corrective_no "
                    style={{ marginLeft: "25px" }}
                  >
                    {item.TotalSum} Work Orders
                  </div>
                </div>


                  ))
                }
                

             
              </div>

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                }}
              >
                <div className="chart" style={{ zIndex: 100 }}>
                  <ResponsiveContainer width="90%" height="90%">
                    <AreaChart
                      width={500}
                      height={500}
                      data={filterData}
                      margin={{
                        top: 10,
                        right: 80,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>

                        {
                          totalSum.map((item,i)=>(
                            <>
                        
                        <linearGradient
                          id={`X${i}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={colors[i]}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={colors[i]}
                            stopOpacity={0}
                          />
                                  
                        </linearGradient>
                            </>
                          ))
                        }
        

                      </defs>
                      <CartesianGrid strokeDasharray="1 5" />
                      <XAxis
                        dataKey="MonthName"
                        stroke="gray"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 14 }}
                      />
                      <YAxis
                        stroke="gray"
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: 'Total Work Orders',
                          angle: -90,
                          position: 'insideLeft',
                          offset: 10,
                          fontSize: 14,
                          fill: 'gray',
                        }}
                        tick={{ fontSize: 14 }}
                      />

                    
                      <Tooltip content={<CustomTooltip />}/>
                   
                      {
                      totalSum.map((item,i)=>
                        <>
                      { selectedGraph === "default" ? (
                        <Area
                          type="monotone"
                          dataKey={item.TotalType}
                          stroke={colors[i]}
                          fillOpacity={1}
                          fill={`url(#X${i})`}
                          strokeWidth={2.5}
                        /> ):selectedGraph === item.TotalType &&(
                          <Area
                          type="monotone"
                          dataKey={item.TotalType}
                          stroke={colors[i]}
                          fillOpacity={1}
                          fill={`url(#X${i})`}
                          strokeWidth={2.5}
                        />
                        ) }
                      

                 
      
                      </>
                      

                      )
                      
                     }


                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>
        </div> */}

  
    {/* pichart */}

    <div className="kpi_report" style={{ marginTop: "18px",height: "320px", padding: "0 20px" }}>
    {/* <Card style={{ height: "450px", padding: "0 20px" }}> */}
      <div className="title">
        <div>
          <h3 style={{ fontStyle: "bold", marginBottom: "4px",fontSize:"13px" }}>
          Top 10 Action Code by Corrective Work Order
          </h3>
          <Divider
                  style={{ width: "50%", height: "10px", marginTop: "-10px" }}
            />
         
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    marginTop: "-10px",
                  }}
                  className="middle -mt100"
                >
                  {totalSum.map((item, i) =>
                    i === 0 ? (
                      <div
                        className="corrective"
                        style={{
                         
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
                          onMouseEnter={() => setSelectedPie(item.TotalType)}
                          onMouseLeave={() => setSelectedPie("default")}
                        >
                          <span
                            style={{
                              height: "14px",
                              width: "14px",
                              background: `${colors[i]}`,
                              borderRadius: "50%",
                            }}
                            className="shadowBt"
                          ></span>
                          {/* corrective wkos */}
                          <p style={{ fontSize: "12px" }}>{item.TotalType}</p>
                        </div>
                        <div
                          className="corrective_no "
                          style={{
                         
                            marginTop: "-17px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Typography style={{ fontSize: "11px" }}>
                            {" "}
                            {item.TotalSum} Work Orders{" "}
                          </Typography>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="corrective"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          marginLeft: "-10px",
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
                          onMouseEnter={() => setSelectedPie(item.TotalType)}
                          onMouseLeave={() => setSelectedPie("default")}
                        >
                          <span
                            style={{
                              height: "14px",
                              width: "14px",
                              background: `${colors[i]}`,
                              borderRadius: "50%",
                            }}
                            className="shadowBt"
                          ></span>
                          {/* corrective wkos */}
                          <p style={{ fontSize: "12px" }}>{item.TotalType}</p>
                        </div>
                        <div
                          className="corrective_no "
                          style={{
                            marginLeft: "25px",
                            marginTop: "-17px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Typography style={{ fontSize: "11px" }}>
                            {" "}
                            {item.TotalSum} Work Orders{" "}
                          </Typography>
                        </div>
                      </div>
                    )
                  )}
                </div>

        
        </div>

  
      </div>

      {/* <Grid Container>
      <Grid items xs={12}> */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop:"-40px"
        }}
      >

              <div style={{ width: "10%", marginLeft: "-50px" }}>
                <h2 className="vertical_text" style={{marginTop:"70px",fontSize:"10px"}}>Total Work Order</h2>
              </div>



              <div
                className="chart"
                style={{ width: "100%", marginLeft: "-50px" }}
              >
           <ResponsiveContainer width="100%" height="60%">
            <BarChart
              data={filterData}
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }} // Adjust margins as needed
              barSize={20}
            >
              <CartesianGrid strokeDasharray="2 4" vertical={false} />
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
              />
              <YAxis
                tickLine={false}
                axisLine={false}
              
                tick={{ fontSize: 14 }}
                stroke="gray"
              />
              
              <Tooltip content={<CustomTooltip />}/>
              {
                totalSum.map((item,i)=>(
                  <>
               {   selectedPie === "default" ? (
                  <Bar
                    dataKey={item.TotalType}
                    fill={colors[i]}
                    barSize={20}
                    stackId="a"
                    shape={<CustomBar />}
                    activeShape={false}
                  /> 
                  
                  
                  ):selectedPie === item.TotalType &&(
                    <Bar
                    dataKey={item.TotalType}
                    fill={colors[i]}
                    barSize={20}
                     stackId="a"
                    shape={<CustomBar />}
                    activeShape={false}
                  /> 
                  )}
              </>
                ))
             }

              

             
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* </Grid>
</Grid> */}
    {/* </Card> */}
  </div>






        {/* <div className="kpi_report" style={{ marginTop: "20px" }}>
          <Card style={{ padding: "40px 20px", height: "100vh" }}>
          <EcommerceYearlySales
            title="Top Ten Cause Code by Corrective Work Order"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series:temp && temp.series ?temp.series :[],
            }}
          />
          </Card>
        </div> */}
      </Container>
    </div>
  );
}

export default TopActionCode;
