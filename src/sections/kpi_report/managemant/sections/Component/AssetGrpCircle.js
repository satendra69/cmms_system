import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector } from "recharts";

// Sample data with different colors
const data = [
  { name: "All Location", value: 400, fill: "#4a90e2" }, // Blue
  { name: "Common Area", value: 300, fill: "#7b92d1" }, // Light Blue
  { name: "Garden", value: 300, fill: "#50e3c2" }, // Teal
  { name: "Grinding Room", value: 200, fill: "#f5a623" }  // Orange
];

// Render active shape for the Pie chart
const ActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ pointerEvents: 'none' }}
        stroke="none" // Ensure no stroke
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
        stroke="none" // Ensure no stroke
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={13}
      >{payload.name}</text>
      {/* <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text> */}
    </g>
  );
};

// Main component
export default function AssetGrpCircle({setLocation,fetchAgainFun}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (data, index) => {
      setActiveIndex(index);
      setLocation(data.name)
      handleLocation(data.name)
    },
    [setActiveIndex]
  );



const myDebounce = (cb,d)=>{
  let timer;

  return (...args)=>{
    if(timer){
      clearTimeout(timer);
    }
    timer =setTimeout(()=>{
      cb(...args);
    },d)
  }
  


}

const handleLocation =myDebounce((arg)=>{

fetchAgainFun(arg);
},2000)




  // Inline styles
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f4f4f9' // Light background for a minimal look
  };

  const chartContainerStyle = {
    borderRadius: '12px', // Rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
    background: '#ffffff', // White background for the chart
    padding: '10px', // Padding around the chart
    width: '300px', // Fixed width for debugging
    height: '300px' // Fixed height for debugging
  };

  return (
    <div style={{marginLeft:"-390px"}}>
     
        <PieChart width={886} height={186}  >
          <Pie
            activeIndex={activeIndex}
            activeShape={ActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={65}
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>

    </div>
  );
}
