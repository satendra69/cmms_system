import { Label } from "@material-ui/icons";
import {
  Autocomplete,
  ButtonBase,
  Card,
  Container,
  Divider,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Tooltip as T,
} from "@mui/material";
import { width } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { FormControl, Stack } from "react-bootstrap";
import { Grid } from "react-loader-spinner";
import {
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

function OpenVSClose({ seriesData, seriesDataLoc, setShowTable, setLoading }) {
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

  const calculateBarSize = (dataLength, containerWidth) => {
    // You can adjust the multiplier to fit your needs
    return Math.max(Math.min(containerWidth / (dataLength * 2), 20), 5);
  };

  const containerWidth = 100; // Assume this comes from the actual width of your container
  const barSize = calculateBarSize(filterData.length, containerWidth);

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
  const year = selectedSortYear ? selectedSortYear.value : "2023";
  // const monthparam = selectedMonth ?selectedMonth.values:"0"

  const site_ID = localStorage.getItem("site_ID");
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

  useEffect(() => {
    const fetchKpi = async () => {
      try {
        const today = new Date();
        let loc = seriesDataLoc ? seriesDataLoc : "All Location";
        // Get the current year
        const currentYear = today.getFullYear();

        // const sort = selectedsortBy.value;
        const year = seriesData ? seriesData : currentYear;
        const response = await httpCommon.get(
          `/get_kpi_open_close.php?site_cd=${site_ID}&location=${loc}&year=${
            year ? year : "2024"
          }`
        );

        if (response.data.status === "SUCCESS") {
          setLoading(false);

          setKpiData(response.data.kpi_result);
          const rep = response.data.kpi_result;

          const aggregatedData = rep.reduce((acc, entry) => {
            const key = `${entry.MonthNo}_${entry.MonthName}`;

            if (!acc[key]) {
              acc[key] = {
                MonthNo: entry.MonthNo,
                MonthName: entry.MonthName,
                TotalWO_Closed: 0,
                TotalWO_Open: 0,
              };
            }

            if (entry.TotalType === "Outstanding WOs") {
              acc[key].TotalWO_Open += entry.TotalWo;
            } else if (entry.TotalType === "Closed WOs") {
              acc[key].TotalWO_Closed += entry.TotalWo;
            }
            return acc;
          }, {});

          // Convert the aggregated map back to an array of objects
          const aggregatedDataArray = Object.values(aggregatedData);
          console.log("_aggrited_Data", aggregatedDataArray);
          setFilterData(aggregatedDataArray);

          let closedTotal = 0;
          let openTotal = 0;
          // setSelectedSortYear({
          //   label: year, value: year ,
          // })

          rep.forEach((result) => {
            if (result.TotalType === "Closed WOs") {
              closedTotal += result.TotalWo;
            } else if (result.TotalType === "Outstanding WOs") {
              openTotal += result.TotalWo;
            }
          });

          setCorrectiveToatal(closedTotal);
          setPreventiveToatal(openTotal);
        }
      } catch (error) {
        console.log("error");
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
        `/get_kpi_open_close_data_pie.php?site_cd=${site_ID}&sortBy=${
          sort ? sort : "Yearly"
        }&year=${year}`
      );

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
                TotalWO_Open: 0,
                TotalWO_Close: 0,
              };
            }
            if (entry.WorkOrderType === "Outstanding WOs") {
              acc[key].TotalWO_Open += entry.TotalWO;
            } else if (entry.WorkOrderType === "Closed WOs") {
              acc[key].TotalWO_Close += entry.TotalWO;
            }
          } else if (seriesData2 === "Yearly") {
            const key = `${entry.Monthyear}`;
            if (!acc[key]) {
              acc[key] = {
                Monthyear: entry.Monthyear,
                TotalWO_Open: 0,
                TotalWO_Close: 0,
              };
            }
            if (entry.WorkOrderType === "Outstanding WOs") {
              acc[key].TotalWO_Open += entry.TotalWO;
            } else if (entry.WorkOrderType === "Closed WOs") {
              acc[key].TotalWO_Close += entry.TotalWO;
            }
          } else if (seriesData2 === "Weekly") {
            const key = `${entry.WeekNumber}`;
            if (!acc[key]) {
              acc[key] = {
                MonthNo: entry.MonthNumber,
                Monthyear: `Week ${entry.WeekNumber}`,
                TotalWO_Open: 0,
                TotalWO_Close: 0,
              };
            }
            if (entry.WorkOrderType === "Outstanding WOs") {
              acc[key].TotalWO_Open += entry.TotalWO;
            } else if (entry.WorkOrderType === "Closed WOs") {
              acc[key].TotalWO_Close += entry.TotalWO;
            }
          } else {
            const key = `${entry.Monthyear}`;
            if (!acc[key]) {
              acc[key] = {
                Monthyear: entry.Monthyear,
                TotalWO_Open: 0,
                TotalWO_Close: 0,
              };
            }
            if (entry.WorkOrderType === "Outstanding WOs") {
              console.log("Outstanding_WOs", entry);
              acc[key].TotalWO_Open += entry.TotalWO;
            } else if (entry.WorkOrderType === "Closed WOs") {
              acc[key].TotalWO_Close += entry.TotalWO;
            }
          }

          return acc;
        }, {});
        console.log("aggregatedData", aggregatedData);
        const aggregatedDataArray = Object.values(aggregatedData);

        setPieFilterData(aggregatedDataArray);

        let correctiveTotal = 0;
        let preventiveTotal = 0;

        rep.forEach((result) => {
          if (result.WorkOrderType === "Closed WOs") {
            correctiveTotal += result.TotalWO;
          } else if (result.WorkOrderType === "Outstanding WOs") {
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

  const formatTitle = (title) => {
    if (title == "TotalWO_Open") return "Outstanding";
    else {
      const ta = title.split("_");
      return ta[1];
    }
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
                Total {item.value} WOs for {formatTitle(item.name)}
              </p>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="kpi_management">
      {/* pichart */}

      <div className="kpi_report" style={{ marginTop: "10px", width: "100%" }}>
        <Card style={{ height: "420px", padding: "0px 20px", width: "100%" }}>
          <div className="title">
            <div style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h3
                  style={{
                    fontStyle: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    fontSize: "16px",
                    marginTop: "-1px",
                    paddingBottom: "8px",
                  }}
                  className="h2mob"
                >
                  Open vs Closed Work Order Analysis
                  <T
                    title="Table View"
                    arrow
                    onClick={() => setShowTable(true)}
                  >
                    <IconButton>
                      <Iconify
                        icon="material-symbols:table-eye-outline"
                        color="#16a34a"
                        width="24"
                        height="24"
                      />
                    </IconButton>
                  </T>
                </h3>
              </div>
              <div className="middle -mt100" style={{ marginTop: "-35px" }}>
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
                    <span
                      style={{
                        height: "10px",
                        width: "10px",
                        background: clciked ? "#fecaca" : "#ef4444",
                        borderRadius: "50%",
                      }}
                      className="shadowBt"
                    ></span>

                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        color: "rgb(99, 115, 129)",
                      }}
                    >
                      Closed WO
                    </p>
                  </div>
                  <div
                    className="corrective_no"
                    style={{ whiteSpace: "nowrap", marginTop: "-14px" }}
                  >
                    <Typography
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "rgb(99, 115, 129)",
                      }}
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
                    marginLeft: "16px",
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
                  <div
                    className="premitive"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,

                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        height: "10px",
                        width: "10px",
                        background: clciked2 ? "#a7f3d0" : "#15786B",

                        borderRadius: "50%",
                      }}
                      className="shadowBt"
                    ></span>

                    <p
                      style={{
                        whiteSpace: "nowrap",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "rgb(99, 115, 129)",
                      }}
                    >
                      Outstanding WO
                    </p>
                  </div>
                  <div
                    className="corrective_no"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <Typography
                      style={{
                        fontSize: "14px",
                        marginLeft: "-20px",
                        marginTop: "-14px",
                        fontWeight: "700",
                        color: "rgb(99, 115, 129)",
                      }}
                    >
                      {PreventiveToatal}
                    </Typography>
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
            <div style={{ width: "10%", marginLeft: "-30px" }}>
              <h2 className="vertical_text op" style={{ marginTop: "10rem" }}>
                Total Work Order
              </h2>
            </div>

            <div
              className="chart mlneg2 mtag"
              style={{
                width: "150%",
                marginLeft: "-50px",
                marginTop: "10px",
                position: "relative",
              }}
            >
              <div
                style={{ width: "10%", marginLeft: "-50px" }}
                className="mltotal mtegmob2"
              >
                <h2 className="vertical_text" style={{ fontSize: "8px" }}>
                  Total Work Order
                </h2>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filterData}
                  // margin={{ top: 10, right: 70, left: 10, bottom: 20 }}
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
                  {selectedPie === "default" && (
                    <>
                      <Bar
                        dataKey="TotalWO_Open"
                        fill="#0f766e"
                        barSize={20}
                        shape={<CustomBar />}
                        stackId="a"
                        activeShape={false}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      />
                      <Bar
                        dataKey="TotalWO_Closed"
                        fill="#dc2626"
                        barSize={barSize}
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
                      dataKey="TotalWO_Open"
                      fill="#0f766e"
                      stackId="a"
                      barSize={20}
                      shape={<CustomBar />}
                    />
                  )}

                  {selectedPie === "Corrective" && (
                    <Bar
                      dataKey="TotalWO_Closed"
                      stackId="a"
                      fill="#dc2626"
                      barSize={20}
                      shape={<CustomBar />}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* </Grid>
</Grid> */}
        </Card>
      </div>
    </div>
  );
}

export default OpenVSClose;
