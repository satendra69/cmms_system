import { Card, Container, Divider, Typography } from "@mui/material";

import React, { useCallback, useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSettingsContext } from "src/components/settings";

import httpCommon from "src/http-common";
import MasterAssetCode from "./MasterAssetCode";
import { usePopover } from "src/components/custom-popover";

function OpenVsCloseRoot({ seriesData, seriesDataLoc,setShowTable }) {
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
  const year = selectedSortYear ? selectedSortYear.value : "2023";
  // const monthparam = selectedMonth ?selectedMonth.values:"0"

  const site_ID = localStorage.getItem("site_ID");
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];

  // useEffect(() => {
  //   const fetchKpi = async () => {
  //     const today = new Date();
  //     let loc = seriesDataLoc ? seriesDataLoc : "All Location";
  //     // Get the current year
  //     const currentYear = today.getFullYear();

  //     // const sort = selectedsortBy.value;
  //     const year = seriesData ? seriesData : currentYear;
  //     const response = await httpCommon.get(
  //       `/get_kpi_open_close.php?site_cd=${site_ID}&location=${loc}&year=${
  //         year ? year : "2024"
  //       }`
  //     );

  //     if (response.data.status === "SUCCESS") {
  //       setKpiData(response.data.kpi_result);
  //       const rep = response.data.kpi_result;

  //       const aggregatedData = rep.reduce((acc, entry) => {
  //         const key = `${entry.MonthNo}_${entry.MonthName}`;

  //         if (!acc[key]) {
  //           acc[key] = {
  //             MonthNo: entry.MonthNo,
  //             MonthName: entry.MonthName,
  //             TotalWO_Closed: 0,
  //             TotalWO_Open: 0,
  //           };
  //         }

  //         if (entry.TotalType === "Outstanding WOs") {
  //           acc[key].TotalWO_Open += entry.TotalWo;
  //         } else if (entry.TotalType === "Closed WOs") {
  //           acc[key].TotalWO_Closed += entry.TotalWo;
  //         }
  //         return acc;
  //       }, {});

  //       // Convert the aggregated map back to an array of objects
  //       const aggregatedDataArray = Object.values(aggregatedData);
  //       console.log("_aggrited_Data", aggregatedDataArray);
  //       setFilterData(aggregatedDataArray);

  //       let closedTotal = 0;
  //       let openTotal = 0;
  //       // setSelectedSortYear({
  //       //   label: year, value: year ,
  //       // })

  //       rep.forEach((result) => {
  //         if (result.TotalType === "Closed WOs") {
  //           closedTotal += result.TotalWo;
  //         } else if (result.TotalType === "Outstanding WOs") {
  //           openTotal += result.TotalWo;
  //         }
  //       });

  //       setCorrectiveToatal(closedTotal);
  //       setPreventiveToatal(openTotal);
  //     }
  //   };

  //   fetchKpi();
  // }, [
  //   selectedsortBy,
  //   selectedSortYear,
  //   setSelectedsortBy,
  //   setSelectedSortYear,
  //   seriesData,
  //   seriesDataLoc,
  // ]);

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

  return (
    <div className="kpi_management">
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        {/* pichart */}

        <div className="kpi_report" style={{ marginTop: "10px" }}>
          <Card style={{ height: "420px", padding: "0 20px", width: "100%" }}>
        
   

        <div>
        <MasterAssetCode seriesData={seriesData} seriesDataLoc={seriesDataLoc}  setShowTable={setShowTable}/>
        </div>


     
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default OpenVsCloseRoot;
