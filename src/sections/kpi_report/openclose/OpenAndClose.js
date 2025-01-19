import { Label } from '@material-ui/icons';
import { Autocomplete, ButtonBase, Card, Container, Divider, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography,Tooltip as T, } from '@mui/material';
import { width } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react'
import { FormControl, Stack } from 'react-bootstrap';
import { Grid } from 'react-loader-spinner';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSettingsContext } from "src/components/settings";
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import httpCommon from "src/http-common";
import Iconify from 'src/components/iconify';

function OpenAndClose() {
    const [kpiData,setKpiData]=useState([])
    const [kpiPieData,setKpiPieData]=useState([])
    const [filterData,setFilterData]=useState([])
    const [PiefilterData,setPieFilterData]=useState([])
    const [CorrectiveToatal,setCorrectiveToatal]=useState(0)
    const [PreventiveToatal,setPreventiveToatal]=useState(0)
    const [CorrectiveToatalPie,setCorrectiveToatalPie]=useState(0)
    const [PreventiveToatalPie,setPreventiveToatalPie]=useState(0)
    const [selectedGraph,setSelectedGraph]=useState("default")
    const [selectedPie,setSelectedPie]=useState("default")
    const [seriesData, setSeriesData] = useState('2024');
    const [seriesData2, setSeriesData2] = useState('Yearly');
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


// getting all the year
useEffect(()=>{
  const fetchYear =async()=>{
try {
  const response =await httpCommon.get(`/get_kpi_yr.php?site_cd=${site_ID}`)
  if(response.data.status === "SUCCESS"){


const uniqueData = Array.from(new Set(response.data.data.map(item => item.Monthyear)))
  .map(monthyear => ({
    label: monthyear,
    value: monthyear
  }));

    setSortYear(uniqueData)
  }
} catch (error) {
  console.log("error",error)
}
  }
  fetchYear();
},[])


const [sortYear, setSortYear] = useState([

  
]);
const [selectedSortYear, setSelectedSortYear] = useState(
  { label: "2024", value: "2024" },
);




const [selectedSortYear2, setSelectedSortYear2] = useState(
  { label: "2023", value: "2023" },
);
const sort =selectedsortBy ? selectedsortBy.value : "Yearly" ;
const sort2 =selectedsortBy ? selectedsortBy.value : "" ;
const year =selectedSortYear? selectedSortYear.value : "2023" ;
// const monthparam = selectedMonth ?selectedMonth.values:"0"

    const site_ID = localStorage.getItem("site_ID");
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];


    useEffect(() => {
      const fetchKpi = async () => {
      
          try {
            const today = new Date();
            let loc =  "All Location";
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
            console.log("error")
          }
  
      
       
  
      
      };
  
      fetchKpi();
    }, [
      selectedsortBy,
      selectedSortYear,
      setSelectedsortBy,
      setSelectedSortYear,
      seriesData,
    
    ]);




// pie Chart Data
useEffect(()=>{

  const fetchKpi=async()=>{
  let sort =seriesData2 ? seriesData2  : "Yearly" ;  

      // const sort = selectedsortBy.value;
      const year=seriesData2 && selectedSortYear2.value ? selectedSortYear2.value:""

  const response = await httpCommon.get(`/get_kpi_open_close_data_pie.php?site_cd=${site_ID}&sortBy=${sort? sort :"Yearly"}&year=${year}`)
  console.log("response_report_week",response)
  if(response.data.status === "SUCCESS"){
    setKpiPieData(response.data.kpi_result_pie)
      const rep =response.data.kpi_result_pie;
      const aggregatedData = rep.reduce((acc, entry) => {
        if (seriesData2 === "Monthly") {
           
        const key = `${entry.MonthNo}_${entry.MonthName}`;
        
        if (!acc[key]) {
          acc[key] = {
            MonthNo: entry.MonthNo,
            Monthyear: entry.MonthName,
            TotalWO_Open: 0,
            TotalWO_Close: 0
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
            TotalWO_Close: 0
          };
        }
        if (entry.WorkOrderType === "Outstanding WOs") {
          acc[key].TotalWO_Open += entry.TotalWO;
        } else if (entry.WorkOrderType === "Closed WOs") {
          acc[key].TotalWO_Close += entry.TotalWO;
        }
      }
      else if (seriesData2 === "Weekly") {
        
        const key = `${entry.WeekNumber}`;
        if (!acc[key]) {
            acc[key] = {
                MonthNo: entry.MonthNumber,
                Monthyear: `Week ${entry.WeekNumber}`,
                TotalWO_Open: 0,
                TotalWO_Close: 0
              };
          }
          if (entry.WorkOrderType === "Outstanding WOs") {
        
            acc[key].TotalWO_Open += entry.TotalWO;
          } else if (entry.WorkOrderType === "Closed WOs") {
            acc[key].TotalWO_Close += entry.TotalWO;
          }
    }
      else{
        const key = `${entry.Monthyear}`;
        if (!acc[key]) {
          acc[key] = {
            Monthyear: entry.Monthyear,
            TotalWO_Open: 0,
            TotalWO_Close: 0
          };
        }
        if (entry.WorkOrderType === "Outstanding WOs") {
            console.log("Outstanding_WOs",entry)
          acc[key].TotalWO_Open += entry.TotalWO;
        } else if (entry.WorkOrderType === "Closed WOs") {
          acc[key].TotalWO_Close += entry.TotalWO;
        }
      }
      
      return acc;
    }, {});
 
    const aggregatedDataArray = Object.values(aggregatedData);



  
      setPieFilterData(aggregatedDataArray)

 
  
    let correctiveTotal = 0;
    let preventiveTotal = 0;
    
   
    rep.forEach(result => {
      if (result.WorkOrderType === "Closed WOs") {
        correctiveTotal += result.TotalWO;
      
      } else if (result.WorkOrderType === "Outstanding WOs") {
        preventiveTotal += result.TotalWO;
      }
    });
    
   
    setCorrectiveToatalPie(correctiveTotal)
    setPreventiveToatalPie(preventiveTotal)
 
  }
  }
  
  fetchKpi();
  
    },[selectedsortBy,selectedSortYear,setSelectedsortBy,setSelectedSortYear,selectedSortYear2,setSelectedSortYear2,seriesData2])



    const settings = useSettingsContext();
 
    const handleChangeSeries = useCallback(
      (newValue) => {
        popover.onClose();
        setSeriesData(newValue);
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

    // custom ToolTip
    const CustomTooltip = ({ active, payload }) => {
        console.log("month",payload)
        if(payload){
       
          const newD = payload[0];
          let month;
          let monthname;
          if(newD){
            month=newD.payload;
            monthname=month.MonthName
            
          }
      
            return (
             
         
                <div className="custom-tooltip" style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              }}>
      
              <p className="label" style={{ margin: 0, fontWeight: 'bold' }}>{monthname}</p>
                {payload.map((item)=>(
                  <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
                    <div style={{height:"8px",width:"8px",background:`${item.color}`,borderRadius:"50%"}}></div>
                  <p className="label" style={{ margin: 0, fontSize:"12px",color:`${item.color}` }}> Total {item.value} WOs for {item.name}</p>
      
                  </div>
                ))}
           
              </div>
                
      
          
              
            );
        }
      
      };


    // custom bar
    const CustomBar = ({ fill, x, y, width, height }) => (
      <g >
          <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#888888" floodOpacity="0.5" />
              </filter>
          </defs>
          <rect
              x={x}
              y={y}
              width={width}
              height={height}
              fill={fill}
              filter="url(#shadow)"
              rx={5}
              ry={5}
          />
      </g>
  );
  




  return (
    <div className='kpi_management'>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
          
          {/* top */}
        <div className='kpi_report'>

            <Card style={{padding:"10px"}}>
              <div className='cardH'>
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
                    marginTop:"-1px",
                    paddingBottom:"8px"
                  }}
                  className="h2mob"
                >
                  Open vs Closed Work Order Analysis

                 
             
                </h3>
              </div>
              <div className="middle -mt100" style={{ marginTop: "-25px" }}>
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
                        setSelectedGraph("Corrective");
                        setClicked(false);
                      } else if (clciked) {
                        if (!clciked2) {
                          setSelectedGraph("default");
                          setClicked(false);
                        } else {
                          setSelectedGraph("Corrective");
                        }
                      } else if (clciked2) {
                        setSelectedGraph("");
                        setClicked(true);
                      } else {
                        setClicked(true);
                        setSelectedGraph("Preventive");
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
                      setSelectedGraph("Preventive");
                      setClicked2(false);
                    } else if (clciked2) {
                      if (!clciked) {
                        setSelectedGraph("default");
                        setClicked2(false);
                      } else {
                        setSelectedGraph("Preventive");
                      }
                    } else if (clciked) {
                      setSelectedGraph("");
                      setClicked2(true);
                    } else {
                      setClicked2(true);
                      setSelectedGraph("Corrective");
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
            <div className='select' style={{width:"160px",marginTop:"30px"}}>
                
           
                <Stack spacing={1} sx={{ pb: 1, mt: 2 }}>
                      <Typography
                        variant="subtitle2"
                        
                      >
                        Filter By
                      </Typography>

                      <ButtonBase
          onClick={popover.onOpen}
          sx={{
          
            py: 0.5,
            pr: 0.5,
            borderRadius: 1,
            typography: 'subtitle2',
            bgcolor: 'background.neutral',
            width:"100px"
          }}
        >
         {seriesData}

          <Iconify
            width={16}
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: 0.5 }}
          />
        </ButtonBase>

                    </Stack>
                    <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
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
          </div>
           
    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",marginTop:"40px"}}>
    <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
            className="cont_chart"
          >
              <div style={{ width: "10%", marginLeft: "-30px" }}>
              <h2 className="vertical_text vt_m" style={{ }}>
                Total Work Order
              </h2>
            </div>
            
            <div
              className="chart mlneg2area mtag"
              style={{
                width: "150%",
                height:"400px",
                marginLeft: "-80px",
                marginTop:"-40px",
                position: "relative",
              }}
            >
        <ResponsiveContainer width="100%" height="100%"  >
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
   
  
    <linearGradient id="colorTotalWO" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <CartesianGrid strokeDasharray="1 5" />
  <XAxis dataKey="MonthName" stroke='gray' tickLine={false} axisLine={false}   tick={{ fontSize: 14 }} />
  <YAxis stroke='gray' tickLine={false} axisLine={false}  tick={{ fontSize: 14 }} />
  {/* <CartesianGrid strokeDasharray="3 3" /> */}
  <Tooltip content={<CustomTooltip />} />
{ selectedGraph === "default" && <> <Area type="monotone" dataKey="TotalWO_Open" stroke="#0f766e" fillOpacity={1} fill="url(#colorTotalWO)"  strokeWidth={2.5}  />


  <Area type="monotone" dataKey="TotalWO_Closed" stroke="#ef4444" fillOpacity={1} fill="url(#colorPv)"  strokeWidth={2.5}  curve="natural"  /></>}

{/* preventive */}
{ selectedGraph === "Preventive" && <> <Area type="monotone" dataKey="TotalWO_Open" stroke="#0f766e" fillOpacity={1} fill="url(#colorTotalWO)" strokeWidth={2.5}  />
  </>}


  { selectedGraph === "Corrective" && <>   <Area type="monotone" dataKey="TotalWO_Closed" stroke="#ef4444" fillOpacity={1} fill="url(#colorPv)"  strokeWidth={2.5}  curve="natural" />
  </>}

</AreaChart>
</ResponsiveContainer>
</div>
</div>
</div>
</div>
        </Card>
        </div>



{/* pichart */}

<div className='kpi_report' style={{marginTop:"20px"}}>

<Card style={{padding:"40px 20px"}}>

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
                    marginTop:"-1px",
                    paddingBottom:"8px"
                  }}
                  className="h2mob"
                >
                  Open vs Closed Work Order Analysis

                 
             
                </h3>
              </div>
              <div className="middle -mt100" style={{ marginTop: "-25px" }}>
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
          
      <div className='select' style={{width:"120px"}}>
          {/* 1 */}
        <Stack spacing={1} sx={{ pb: 1, mt: 1 }} direction='row'>
              <Typography
                variant="subtitle2"
                
              >
                Filter By 
              </Typography>


              <ButtonBase
              onClick={popover2.onOpen}
              sx={{
              
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
                width:"100px"
              }}
            >
             {seriesData2}

              <Iconify
                width={16}
                icon={popover2.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
            </Stack>

            <CustomPopover open={popover2.open} onClose={popover2.onClose} sx={{ width: 140 }}>
          {sortBy.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === seriesData}
            onClick={() => handleChangeSeries2(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
</div> 
</div>
{/* mobile text */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
            className="cont_chart"
          >
            <div style={{ width: "10%", marginLeft: "-30px" }}>
              <h2 className="vertical_text  vt_mp">
                Total Work Order
              </h2>
            </div>

  <div className='chart mlneg2pie' style={{zIndex:100,height:"450px", marginLeft: "-100px",}}>
  <ResponsiveContainer width="100%" height="100%">
        <BarChart
         width={500}
         height={500}
            data={PiefilterData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // Adjust margins as needed
            barSize={20}
        >
            <CartesianGrid strokeDasharray="2 4"  vertical={false}/>
          
            <XAxis dataKey="Monthyear" tickLine={false} axisLine={false}    interval={0}  scale="point" tick={{ fontSize: 14 }}  stroke='middle'   padding={{ left: 30, right: 20 }} textAnchor='end' dx={10} />
            <YAxis tickLine={false} axisLine={false}  tick={{ fontSize: 14 }} stroke='gray' />
           <Tooltip content={<CustomTooltip />} />
            {selectedPie === "default" && <>
      <Bar dataKey="TotalWO_Open" fill="#0f766e" barSize={20}  shape={<CustomBar />} activeShape={false} onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave} 
         
       />
      <Bar dataKey="TotalWO_Close" fill="#dc2626"  barSize={20} shape={<CustomBar />} activeShape={false}  onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave} 
         
      />
      
 </>
  }

  {
  selectedPie === "Preventive" &&
  <Bar dataKey="TotalWO_Open" fill="#0f766e" barSize={20} shape={<CustomBar />}   />
  }

{
  selectedPie === "Corrective" &&
  <Bar dataKey="TotalWO_Close" fill="#dc2626"  barSize={20} shape={<CustomBar />}  />
  }
  </BarChart>
  </ResponsiveContainer>
</div>
</div>
{/* </Grid>
</Grid> */}
</Card>
    </div>
      </Container>
    </div>
  )
}

export default OpenAndClose