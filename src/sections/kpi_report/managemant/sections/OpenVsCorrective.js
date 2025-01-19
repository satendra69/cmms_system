import { Label } from '@material-ui/icons';
import { Autocomplete, ButtonBase, Card, Container, Divider, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { width } from '@mui/system';
import React, { useCallback, useEffect, useState } from 'react'
import { FormControl, Stack } from 'react-bootstrap';
import { Grid } from 'react-loader-spinner';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSettingsContext } from "src/components/settings";
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import httpCommon from "src/http-common";
import Iconify from 'src/components/iconify';

function OpenVsCorrective() {
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


 useEffect(()=>{
const fetchKpi=async()=>{
    const today = new Date();

    // Get the current year
    const currentYear = today.getFullYear();
  
     
    // const sort = selectedsortBy.value;
    const year = seriesData ? seriesData :currentYear
const response = await httpCommon.get(`/get_kpi_open_close.php?site_cd=${site_ID}&year=${year? year :"2024"}`)

if(response.data.status === "SUCCESS"){
    setKpiData(response.data.kpi_result)
    const rep =response.data.kpi_result;
 

const aggregatedData = rep.reduce((acc, entry) => {
  const key = `${entry.MonthNo}_${entry.MonthName}`;
 
  if (!acc[key]) {
    acc[key] = {
      MonthNo: entry.MonthNo,
      MonthName: entry.MonthName,
      TotalWO_Closed: 0,
      TotalWO_Open: 0
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


setFilterData(aggregatedDataArray)


  let closedTotal = 0;
  let openTotal = 0;
  // setSelectedSortYear({
  //   label: year, value: year ,
  // })
  
 
  rep.forEach(result => {
    if (result.TotalType === "Closed WOs") {
       
        closedTotal += result.TotalWo;
    
    } else if (result.TotalType === "Outstanding WOs") {

        openTotal += result.TotalWo;
    }
  });
  

 
  setCorrectiveToatal(closedTotal)
  setPreventiveToatal(openTotal)
}
}

fetchKpi();

  },[selectedsortBy,selectedSortYear,setSelectedsortBy,setSelectedSortYear,seriesData])




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
    console.log("aggregatedData",aggregatedData)
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

            <Card style={{padding:"20px"}}>
              <div className='cardH'>
            <div className='title'>
                <div>
            <h3 style={{fontStyle:"bold",marginBottom:"4px"}}>Open vs Closed Work Order Analysis</h3> 
            <Divider style={{width:"50%",height:"10px"}}/> 
            </div>

            <div className='select' style={{width:"200px",marginTop:"30px"}}>
                
           
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
            <div className='middle'>
                <div className='corrective' style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
<div className='corrective_title' style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}} 
onMouseEnter={()=>setSelectedGraph("corrective")}
  onMouseLeave={()=>setSelectedGraph("default")}
  >
    <span style={{height:"20px",width:"20px",background:"#ef4444",borderRadius:"50%"}} className='shadowBt'></span>
    {/* corrective wkos */}
    <p>Closed WO</p>

</div>
<div className='corrective_no ' style={{marginLeft:"25px"}} >
    {CorrectiveToatal} Work Orders
     </div>
</div>

<div className='premitive' style={{display:"flex",flexDirection:"column",alignItems:"center"}}
onMouseEnter={()=>setSelectedGraph("preventive")}
onMouseLeave={()=>setSelectedGraph("default")}

>
<div className='premitive' style={{display:"flex",alignItems:"center",gap:4,marginLeft: "50px",cursor:"pointer"}}


>
<span style={{height:"20px",width:"20px",background:"#15786B",borderRadius:"50%"}} className='shadowBt'></span>
{/* prentive */}
<p style={{whiteSpace:"nowrap"}}>Outstanding WO</p>
</div>
<div className='corrective_no' style={{marginLeft:"70px"}}>
   {PreventiveToatal} Work Orders
     </div>

 </div>
 </div>


    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",marginTop:"40px"}}>
    <div className='chart' style={{zIndex:100}}>
    <ResponsiveContainer width="90%" height="90%" >
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
  <YAxis stroke='gray' tickLine={false} axisLine={false}  tick={{ fontSize: 14 }}  label={{
                          value: 'Total Work Orders',
                          angle: -90,
                          position: 'insideLeft',
                          offset: 10,
                          fontSize: 14,
                          fill: 'gray',
                        }} />
  {/* <CartesianGrid strokeDasharray="3 3" /> */}
  <Tooltip contentStyle={{ backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}/>
{ selectedGraph === "default" && <> <Area type="monotone" dataKey="TotalWO_Open" stroke="#0f766e" fillOpacity={1} fill="url(#colorTotalWO)"  strokeWidth={2.5}  />


  <Area type="monotone" dataKey="TotalWO_Closed" stroke="#ef4444" fillOpacity={1} fill="url(#colorPv)"  strokeWidth={2.5}  curve="natural"  /></>}

{/* preventive */}
{ selectedGraph === "preventive" && <> <Area type="monotone" dataKey="TotalWO_Open" stroke="#0f766e" fillOpacity={1} fill="url(#colorTotalWO)" strokeWidth={2.5}  />
  </>}


  { selectedGraph === "corrective" && <>   <Area type="monotone" dataKey="TotalWO_Closed" stroke="#ef4444" fillOpacity={1} fill="url(#colorPv)"  strokeWidth={2.5}  curve="natural" />
  </>}

</AreaChart>
</ResponsiveContainer>
</div>
</div>
</div>
        </Card>
        </div>



{/* pichart */}

<div className='kpi_report' style={{marginTop:"20px"}}>

<Card style={{padding:"40px 20px",height:"80vh"}}>
<div className='title'>
    <div>
<h3 style={{fontStyle:"bold",marginBottom:"4px"}}>Open vs Closed Work Order Analysis</h3> 
<Divider style={{width:"50%",height:"10px"}}/> 
<div className='middle -mt100'>
                <div className='corrective' style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
<div className='corrective_title' style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}} 
onMouseEnter={()=>setSelectedPie("Corrective")}
  onMouseLeave={()=>setSelectedPie("default")}
  >
    <span style={{height:"20px",width:"20px",background:"#ef4444",borderRadius:"50%"}} className='shadowBt'></span>
    <p>Closed WO</p>

</div>
<div className='corrective_no' style={{marginLeft:"25px",whiteSpace:"nowrap"}} >
    {CorrectiveToatalPie} Work Orders
     </div>
</div>

<div className='premitive' style={{display:"flex",flexDirection:"column",alignItems:"center"}}
onMouseEnter={()=>setSelectedPie("Preventive")}
onMouseLeave={()=>setSelectedPie("default")}

>
<div className='premitive' style={{display:"flex",alignItems:"center",gap:4,marginLeft: "50px",cursor:"pointer"}}


>
<span style={{height:"20px",width:"20px",background:"#15786B",borderRadius:"50%"}} className='shadowBt'></span>
<p style={{whiteSpace:"nowrap"}}>Outstanding WO</p>
</div>
<div className='corrective_no' style={{marginLeft:"70px",whiteSpace:"nowrap"}}>

   {PreventiveToatalPie} Work Orders
     </div>

 </div>
 </div>
</div>



<div className='select' style={{width:"200px"}}>
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


{/* <Grid Container>
<Grid items xs={12}> */}
<div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",marginTop:"40px"}}>
<div className='chart'>
<ResponsiveContainer width="90%" height="90%">
        <BarChart
            data={PiefilterData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }} // Adjust margins as needed
            barSize={20}
        >
            <CartesianGrid strokeDasharray="2 4"  vertical={false}/>
          
            <XAxis dataKey="Monthyear" tickLine={false} axisLine={false}    interval={0}  scale="point" tick={{ fontSize: 14 }}  stroke='middle'   padding={{ left: 30, right: 20 }} textAnchor='end' dx={10} />
            <YAxis tickLine={false} axisLine={false}  tick={{ fontSize: 14 }} stroke='gray'  label={{
                          value: 'Total Work Orders',
                          angle: -90,
                          position: 'insideLeft',
                          offset: 10,
                          fontSize: 14,
                          fill: 'gray',
                        }} />
            <Tooltip  />
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

export default OpenVsCorrective