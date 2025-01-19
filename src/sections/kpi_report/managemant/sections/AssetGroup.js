// #006c9c:blue rose:#e11d48
import { Label } from "@material-ui/icons";
import {
  Card,
  Tab,
  Tabs,
  TextField,
  Typography,
  Tooltip as T,
  styled
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

function CauseCode({ seriesData, seriesDataLoc }) {
  const [kpiData, setKpiData] = useState([]);
  const [kpiPieData, setKpiPieData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [PiefilterData, setPieFilterData] = useState([]);
  const [brk, setBrk] = useState(0);
  const [stain, setStain] = useState(0);

  const [oo1Pie, setOo1Pie] = useState(0);
  const [oo2Pie, setOo2Pie] = useState(0);

  const [PreventiveToatalPie, setPreventiveToatalPie] = useState(0);
  const [selectedGraph, setSelectedGraph] = useState("default");
  const [temp, setTemp] = useState([]);
  const [selectedPie, setSelectedPie] = useState("default");
  // const [seriesData, setSeriesData] = useState("2024");
  const [seriesData2, setSeriesData2] = useState("Yearly");
  const [totalSum, setTotalSum] = useState([]);
  const [totalSumPie, setTotalSumPie] = useState([]);
  const [types, setTypes] = useState([]);
  const [location, setLocation] = useState([]);

  const popover = usePopover();
  const popover2 = usePopover();
  const [activeBar, setActiveBar] = useState(null);
  
  const [clickedTabs, setClickedTabs] = useState([]);

  const handleMouseEnter = (data, index) => {
    setActiveBar(index);
  };

  const handleMouseLeave = () => {
    setActiveBar(null);
  };

  const CustomTooltipT = styled(({ className, color, ...props }) => (
    <T {...props} classes={{ popper: className }} />
  ))((props) => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: props.color, // Use the passed color or fallback to default
      color: 'white', // Text color
      fontSize: '14px', // Text size
      borderRadius: '4px', // Tooltip border radius
      padding: '10px', // Tooltip padding
    
    },
    [`& .MuiTooltip-arrow`]: {
      color: props.color || 'rgba(0, 0, 0, 0.87)', 
    },
  }));
  

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
  const colors = [
    "#15786B",
    "#FFAB00",
    "#ef4444",
    "#00b8d9",
    "#a3e635",
    "#14b8a6",
    "#db2777",
    "#a16207",
    "#a1a1aa",
    "#67e8f9",
    "#ccfbf1",
  ];

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

    // Step 2: Determine all unique TotalType values
    const allTypes = new Set();
    kpiResult.forEach((item) => allTypes.add(item.TotalType));
    const typesArray = Array.from(allTypes);

    // Step 3: Transform the data into the desired format
    const series = Object.keys(groupedByYearMonth).map((year) => {
      const monthsData = groupedByYearMonth[year];
      return {
        year: year.toString(),
        data: typesArray.map((type) => ({
          name: type,
          data: Array.from({ length: 12 }, (_, monthIndex) => {
            const value = monthsData[monthIndex + 1]?.[type] || 0;
            return value;
          }),
        })),
      };
    });

    return { series };
  }

  useEffect(() => {
    const fetchKpi = async () => {
      const today = new Date();

      // Get the current year
      const currentYear = today.getFullYear();

      // const sort = selectedsortBy.value;
      const year = seriesData ? seriesData : currentYear;
      let loc = seriesDataLoc ? seriesDataLoc : "All Location";
      const response = await httpCommon.get(
        `/get_kpi_asset_data.php?site_cd=${site_ID}&year=${year}&location=${loc}`
      );

      if (response.data.status === "SUCCESS") {
        const data = response.data.kpi_result;

        // const formattedData = convertKPIData(data);
        // setTemp(formattedData);

        const totalTypes = data.map((item) => item.TotalType);

        const filteredTotalTypes = totalTypes.filter(
          (type) => type.trim() !== ""
        );
        const uniqueTotalValue = new Set(filteredTotalTypes);

        const uniqueType = Array.from(uniqueTotalValue);

        setTypes(uniqueType);

        setKpiData(response.data.kpi_result);
        const rep = response.data.kpi_result;

        const aggregatedData = rep.reduce((acc, entry) => {
          const key = `${entry.MonthNo}_${entry.MonthName}`;

          if (!acc[key]) {
            acc[key] = {
              MonthNo: entry.MonthNo,
              MonthName: entry.MonthName,
              ...uniqueType.reduce((obj, type) => ({ ...obj, [type]: 0 }), {}),
            };
          }
          if (entry.TotalType.trim() !== "") {
            acc[key][entry.TotalType] += entry.TotalWO;
          }

          return acc;
        }, {});

        const totalSumByType = uniqueType.reduce((acc, type) => {
          acc[type] = Object.values(aggregatedData).reduce(
            (sum, data) => sum + (data[type] || 0),
            0
          );
          return acc;
        }, {});

        const totalTypeSummary = Object.keys(totalSumByType).map((type) => ({
          TotalType: type,
          TotalSum: totalSumByType[type],
        }));

        const aggregatedDataArray = Object.values(aggregatedData);

        setTotalSum(totalTypeSummary);
        setFilterData(aggregatedDataArray);
        setOriginalData(aggregatedDataArray);
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

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  // function truncateText(text, charLimit) {
  //   if (text.length > charLimit) {
  //     return text.slice(0, charLimit) + "..";
  //   }
  //   return text;
  // }




  const truncateText = (text) => {
    let charLimit;
    console.log("screenWidth",screenWidth)
    if (screenWidth < 576) {
      charLimit = 8;
    } else if (screenWidth >= 576 && screenWidth < 768) {
      charLimit = 8;
    } else if (screenWidth >= 768 && screenWidth < 992) {
      charLimit = 8;
    } else if (screenWidth >= 992 && screenWidth < 1300) {
      charLimit = 8;
    } else {
      charLimit = 12;
    }

    if (text.length > charLimit) {
      return text.slice(0, charLimit) + "..";
    }
    return text;
  };
  


  // pie Chart Data
  useEffect(() => {
    const fetchKpi = async () => {
      let sort = seriesData2 ? seriesData2 : "Yearly";

      // const sort = selectedsortBy.value;
      const year =
        seriesData2 && selectedSortYear2.value ? selectedSortYear2.value : "";

      const response = await httpCommon.get(
        `/get_kpi_asset_grp_pie.php?site_cd=${site_ID}&sortBy=${
          sort ? sort : "Yearly"
        }&year=${year}`
      );
      console.log("aggregatedDataArray",response)
      if (response.data.status === "SUCCESS") {
        setKpiPieData(response.data.kpi_result_pie);
        const data = response.data.kpi_result_pie;
        const totalTypes = data.map((item) => item.TotalType);

        // Step 2: Filter out empty strings if needed
        const filteredTotalTypes = totalTypes.filter(
          (type) => type.trim() !== ""
        );
        const uniqueTotalValue = new Set(filteredTotalTypes);

        const uniqueType = Array.from(uniqueTotalValue);

        const aggregatedData = data.reduce((acc, entry) => {
          if (seriesData2 === "Monthly") {
            const key = `${entry.MonthNo}_${entry.MonthName}`;

            if (!acc[key]) {
              acc[key] = {
                MonthNo: entry.MonthNo,
                Monthyear: entry.MonthName,
                ...uniqueType.reduce(
                  (obj, type) => ({ ...obj, [type]: 0 }),
                  {}
                ),
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
                ...uniqueType.reduce(
                  (obj, type) => ({ ...obj, [type]: 0 }),
                  {}
                ),
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
                ...uniqueType.reduce(
                  (obj, type) => ({ ...obj, [type]: 0 }),
                  {}
                ),
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
                ...uniqueType.reduce(
                  (obj, type) => ({ ...obj, [type]: 0 }),
                  {}
                ),
              };
            }
            if (entry.TotalType.trim() !== "") {
              acc[key][entry.TotalType] += entry.TotalWO;
            }
          }

          return acc;
        }, {});
   
        const aggregatedDataArray = Object.values(aggregatedData);
        const totalSumByType = uniqueType.reduce((acc, type) => {
          acc[type] = Object.values(aggregatedData).reduce(
            (sum, data) => sum + (data[type] || 0),
            0
          );
          return acc;
        }, {});

        const totalTypeSummary = Object.keys(totalSumByType).map((type) => ({
          TotalType: type,
          TotalSum: totalSumByType[type],
        }));

        setTotalSumPie(totalTypeSummary);

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




const handleTabClick = (item, index) => {
  let updatedData;

  if (filterData && filterData.length > 0) {
      // Remove the key when the tab is clicked
      updatedData = filterData.map((entry) => {
          const { [item.TotalType]: _, ...rest } = entry;
          return rest;
      });
  }

  if (clickedTabs.includes(index)) {
      // If the tab is already clicked (disabled), remove it from clickedTabs array
      const remainingTabs = clickedTabs.filter((i) => i !== index);

      // Restore the specific data for this tab only
      updatedData = originalData.map((entry) => {
          const originalEntry = originalData.find((orig) => orig.TotalType === item.TotalType && orig.id === entry.id); // Assuming there is a unique `id` to match entries
          return originalEntry ? { ...entry, [item.TotalType]: originalEntry[item.TotalType] } : entry;
      });

      // Further filter out the data related to the remaining disabled tabs
      remainingTabs.forEach((tabIndex) => {
          const tabItem = totalSum[tabIndex]; // Assume totalSum holds your tab data
          updatedData = updatedData.map((entry) => {
              const { [tabItem.TotalType]: _, ...rest } = entry;
              return rest;
          });
      });

      // Update states
      setClickedTabs(remainingTabs);
      setFilterData(updatedData);
  } else {
      // If the tab is not yet clicked, add it to the clickedTabs array and update the filter
      setClickedTabs([...clickedTabs, index]);
      setFilterData(updatedData);
  }
};


  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      // setSeriesData(newValue);
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

  const [value, setValue] = useState(0);
  const handleChangeValue = (event, newValue) => {
    setValue(newValue);
  };




  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) {
      return null; // Do not render if not active or no payload
    }

    const newD = payload[0];
    let monthName = "";

    if (newD) {
      const month = newD.payload;
      if (month && month.MonthName) {
        monthName = month.MonthName;
      }
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
          {monthName}
        </p>
        {payload
          .filter((item) => item.value > 0)
          .map((item) => (
            <div
              key={item.name}
              style={{ display: "flex", alignItems: "center", gap: "4px" }}
            >
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
      {/* pichart */}
      <div className="kpi_report" style={{ marginTop: "10px", width: "100%" }}>
        <Card style={{ height:"400px",minHeight:"400px",maxHeight:"600px", padding: "0 20px", width: "100%" }}>
          <div className="title" style={{ width: "100%", marginTop: "20px" }}>
            <div style={{ width: "100%" }}>
              <h3
                style={{
                  fontStyle: "bold",
                  marginBottom: "12px",
                  marginTop:"-5px",
                  fontSize: "16px"
                 
                }}
              className="h2mob"
              >
                  Top 10 Asset Group Code by Corrective Work Order
              </h3>

              {/* desktop */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:"space-between",
              
                  width: "100%",
                  marginTop: "-10px",
              

              
                }}
                className="middle -mt100 desktop"
              >
                {totalSum.map((item, index) => (
                        <div>
                     
                        <div
                          className="custom-tab-content"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >

        
                          <div
                            className="custom-tab-title"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              cursor: "pointer"
                     
                    
                            }}
                            onClick={() => {
                              handleTabClick(item, index)
                            }}
                          >
                            <span
                              style={{
                                height: "10px",
                                width: "10px",
                                background: colors[index % colors.length],
                                opacity: clickedTabs.includes(index)
                                  ? "0.4"
                                  : "1", 
                                borderRadius: "50%",
                              }}
                              className="shadowBt bgRound"
                            ></span>
                            {
                              item.TotalType.length>10?      <CustomTooltipT 
                              color={colors[index % colors.length]}
                              title={item.TotalType} arrow placement="top">
                              <p style={{ fontSize: "12px",  color: "rgb(99, 115, 129)",fontWeight:"bold" }}>{truncateText(item.TotalType,10)}</p>
                              </CustomTooltipT>:<p style={{ fontSize: "12px",  color: "rgb(99, 115, 129)" }}>{truncateText(item.TotalType,10)}</p>
                            }
                     
                       
                          </div>
                          <div
                            className="custom-tab-summary"
                            style={{
                              marginTop: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Typography
                              style={{
                                fontSize: "14px",
                                marginTop: "-20px",
                                fontWeight: "700",
                                color: "rgb(99, 115, 129)",
                              }}
                            >
                              {item.TotalSum}
                            </Typography>
                          </div>
                        </div>
                      
                        </div>
                  ))}





              </div>
              {/* desktopEnd */}







            {/* mobile */}
              <div
                style={{
                 

                  width: "100%",
                  marginTop: "-10px",

                  // marginLeft: totalSum.length < 8 ? "-2px" : "-40px",
                }}
                className="middle -mt100 mobileView"
              >
                <Tabs
               value={value}
               onChange={handleChangeValue}
               variant="scrollable"
               scrollButtons="auto"
               aria-label="scrollable auto tabs example"
               className="custom-tabs"
               style={{ width: "120%" }}
                >
                  {totalSum.map((item, index) => (
                    <Tab
                      key={index}
                      label={
                        <div
                          className="custom-tab-content"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div
                            className="custom-tab-title"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              cursor: "pointer"
                     
                    
                            }}
                            onClick={() => {
                              handleTabClick(item, index)
                            }}
                          >
                            <span
                              style={{
                                height: "12px",
                                width: "12px",
                                background: colors[index % colors.length],
                                opacity: clickedTabs.includes(index)
                                  ? "0.4"
                                  : "1", 
                                borderRadius: "50%",
                              }}
                              className="shadowBt bgRound"
                            ></span>
                            <p style={{ fontSize: "12px",  color: "rgb(99, 115, 129)" }}>{item.TotalType}</p>
                          </div>
                          <div
                            className="custom-tab-summary"
                            style={{
                              marginTop: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Typography
                              style={{
                                fontSize: "14px",
                                marginTop: "-20px",
                                fontWeight: "700",
                                color: "rgb(99, 115, 129)",
                              }}
                            >
                              {item.TotalSum}
                            </Typography>
                          </div>
                        </div>
                      }
                      value={index}
            
                    />
                  ))}
                </Tabs>
              </div>

            {/* mobile end */}
            </div>
          </div>

          {/* chart grid */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "10%", marginLeft: "-50px",marginTop:"-11px" }} className="mltotal">
              <h2 className="vertical_text">Total Work Order</h2>
            </div>

            <div
              className="chart mlneg mtag"
              style={{  width: "150%", marginLeft: "-80px" }}
            
            >
                <div style={{ width: "10%", marginLeft: "-50px" }} className="mltotal mtegmob">
              <h2 className="vertical_text">Total Work Order</h2>
            </div>
              <ResponsiveContainer width="100%" height="100%">
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

                  <Tooltip content={<CustomTooltip />} />
                  {totalSum.map((item, i) => (
                    <>
                      {selectedPie === "default" ? (
                        <Bar
                          dataKey={item.TotalType}
                          fill={colors[i]}
                          barSize={20}
                          stackId="a"
                          shape={<CustomBar />}
                          activeShape={false}
                        />
                      ) : (
                        selectedPie === item.TotalType && (
                          <Bar
                            dataKey={item.TotalType}
                            fill={colors[i]}
                            barSize={20}
                            stackId="a"
                            shape={<CustomBar />}
                            activeShape={false}
                          />
                        )
                      )}
                    </>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
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
    </div>
  );
}

export default CauseCode;
