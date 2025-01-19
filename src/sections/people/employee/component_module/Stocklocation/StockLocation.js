import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";


import { useLocation } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Iconify from "src/components/iconify";


import httpCommon from "src/http-common";

import { ToastContainer } from "react-toastify";
import StockLocationHirechy from "./component/StockLocationHirechy";

const StockLocation = ({
  RowID,
  stockLocationData,
  setStockLocationData,
  handleStock

}) => {

  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_login_id = localStorage.getItem("emp_mst_login_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const [listAndChange,setListAndChange] = useState([])
  const [listData,setListData] = useState([])
  const [changeData,setChangeData] = useState([])
  const [notAssigned,setNotAssigned] = useState([])





// fetch differnt Stocks based on condition
const fetchStock =()=>{
  
    const list = stockLocationData.filter((item)=>item.usg_itm_list == 1 && item. usg_itm_change == 0 ) 
    const change = stockLocationData.filter((item)=>item.usg_itm_change == 1 && item.usg_itm_list == 0)
    const notAssign = stockLocationData.filter((item)=>item.usg_itm_change == 0 && item.usg_itm_list == 0)
    const listAndChange = stockLocationData.filter((item)=>item.usg_itm_change == 1 && item.usg_itm_list == 1)
    setListData(list)
    setChangeData(change)
    setNotAssigned(notAssign)
    setListAndChange(listAndChange)
  }
  
  
  
  useEffect(()=>{
  fetchStock();
  },[stockLocationData])
  

  const renderTableHeader = () => {
    return (
      // <>
      //   <TableCell sx={{ width: { xs: "80px", md: "180px" }, textAlign: "center", whiteSpace:{ md:"nowrap",
      //     xs:"normal"
      //   }, overflow: "hidden", textOverflow: "ellipsis" }}>
      //     Stock Location
      //   </TableCell>
      //   <TableCell sx={{ width: { xs: "90px", md: "600px" }, textAlign: "center", whiteSpace:{ md:"nowrap",
      //     xs:"normal"
      //   }, overflow: "hidden", textOverflow: "ellipsis" }}>
      //     Location Description
      //   </TableCell>
      //   <TableCell sx={{ width: { xs: "50px", md: "150px" }, textAlign: "center" }}>
      //     List
      //   </TableCell>
      //   <TableCell sx={{ width: { xs: "50px", md: "100px" }, textAlign: "center" }}>
      //     Change
      //   </TableCell>
      // </>

               <>
                <div
                style={{
                  
                  width: "100%",
                  padding: "2px 14px",
                  background:"#f4f6f8",
                

                
                
                }}
              >
                <div style={{width:"98%",display: "flex",
                  alignItems: "center",padding: "10px"}}>
                {/* Stock Location */}
                <Typography
                  sx={{
                    width: { xs: "50px", md: "180px" },
                    fontSize: { xs: "10px", md: "13px" },
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    mr: { xs: 1 },
                      fontSize:"14px",
                  fontWeight:"bold",
                  color:"#697886",
             
                  }}
                >
                  Stock Location
                </Typography>

                {/* Location Description */}
                <Typography
                  sx={{
                    width: { xs: "120px", md: "700px" },
                    fontSize: { xs: "10px", md: "13px" },
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize:"14px",
                    fontWeight:"bold",
                    color:"#697886"
                  }}
                >
                  Location Description
                </Typography>

                {/* List Checkbox */}
                <Typography
              sx={{
                width: { xs: "80px", md: "150px" },
                textAlign: "center",
                fontSize:"14px",
                fontWeight:"bold",
                color:"#697886"
              }}
                >
                     List
                </Typography>

                {/* Change Checkbox */}
                <Typography
                 sx={{
                  width: { xs: "50px", md: "100px" },
                  textAlign: "center",
                  fontWeight:"bold",
                color:"#697886",
                fontSize:"14px"
                }}
                >
                  Change
                </Typography>
                </div>
              </div>
      </>

    );
  };
  
  




  //Header


  //Table rows
//   const renderTableRows = () => {
// if(MaintenceResult && MaintenceResult.length >0 ){
//   return  MaintenceResult.map((item) => (
//     <>
//       <TableRow>
//         <TableCell>{item.emp_ls1_craft}</TableCell>
//         <TableCell>{item.emp_ls1_supervisor_id}</TableCell>
//         <TableCell>{item.emp_ls1_pay_rate}</TableCell>
//         <TableCell>{item.emp_ls1_charge_rate}</TableCell>
//       </TableRow>
//     </>
//   ));
// }
// };

  return (
    <>
       <ToastContainer />
      <div style={{ width: "100%", backgroundColor: "white",marginTop:"-20px" }} className="w001">
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            width: "100%",
          }}
          className="CustomBreadAssetSave MuiBox-root mom"
        >
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center",marginTop:"10px" }}
          >
            <div style={{height:"100%",width:"100%",display:"flex",alignItems:"center",gap:2}}>
                      <Iconify
                        icon="ep:location-filled"
                        style={{ marginRight: "4px" }}
                        height="26px"
                        width="26px"
                      />
              <Typography style={{ marginRight: "10px", fontWeight: "bold"}}>
               Stock Location
              </Typography>
            </div>
           
           
          </div>
        </div>

        {/* Table start here */}
        {/* <ToastContainer /> */}
        {/* className="table-responsive" */}
        <div >
          {/* <TableContainer component={Paper}>
            <Table>
              <TableHead >
                <TableRow></TableRow>
              </TableHead>
              <TableBody>{renderTableRows()}</TableBody>
           
            </Table>
          </TableContainer> */}
         { renderTableHeader()}
        </div>

          
        <div style={{padding:"10px",marginLeft:"-10px"}}>
          {/* list And Change */}
         {listAndChange && listAndChange.length>0 &&  <StockLocationHirechy name="listAndChange" dataH={listAndChange} stockLocationData={stockLocationData} setStockLocationData={setStockLocationData} handleStock={handleStock} />}

        {/* list only */}
    
         {listData && listData.length>0 && <div style={{marginTop:"7px"}}> <StockLocationHirechy name="listOnly" dataH={listData} stockLocationData={stockLocationData} setStockLocationData={setStockLocationData} handleStock={handleStock} /></div>}

         {/* Change Only */}
         {changeData && changeData.length>0 && <div style={{marginTop:"7px"}}> <StockLocationHirechy name="changeOnly" dataH={changeData} stockLocationData={stockLocationData} setStockLocationData={setStockLocationData} handleStock={handleStock} /> </div>}


          {/* Not Assigned */}
          {notAssigned && notAssigned.length>0 && <div style={{marginTop:"7px"}}>  <StockLocationHirechy name="notAssigned" dataH={notAssigned} stockLocationData={stockLocationData} setStockLocationData={setStockLocationData} handleStock={handleStock} /> </div>}


        </div>

      </div>


    
    </>
  );
};

export default StockLocation;
