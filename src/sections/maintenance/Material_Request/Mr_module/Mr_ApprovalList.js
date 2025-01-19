import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";
import { useLocation } from "react-router-dom";

import Iconify from "src/components/iconify";

import httpCommon from "src/http-common";

const Mr_ApprovalList = ({ onRowClick, data }) => {
  let site_ID = localStorage.getItem("site_ID");

  const [Header, setHeader] = React.useState([]);
  const [Result, setResult] = React.useState([]);

  const location = useLocation();

  const [RowID, setRowID] = useState(data.RowID);

const [FormStatus, setFormStatus] = useState(data.formStatus);


  // First Api
  const get_mr_approval_list_data = async (site_ID, RowID) => {
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `/get_mr_approval_list_data.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );
    
      if (response.data.status === "SUCCESS") {
        setHeader(response.data.data.header);
        setResult(response.data.data.result);
        Swal.close();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  };
  const get_mr_approval_list_data_header = async (site_ID,RowID) => {
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.get(
        `/get_mr_approval_list_data.php?site_cd=${site_ID}&RowID=${RowID || ""}`
      );
    //  console.log("get_workordermaster_specialorder____22",response);
      if (response.data.status === "SUCCESS") {
        setHeader(response.data.data.header);
        //setResult(response.data.data.result);
        Swal.close();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops get_sitecode...",
        text: error,
      });
    }
  }
  //Header
  const renderTableHeader = () => {
    const cellStyle = {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
       textAlign: "center",
        padding: "5px"
    };
    return (
      <>
         <TableCell key="select"></TableCell>
        {Object.keys(Header).map((attr) => (
          <TableCell key={attr} style={cellStyle}>
            {attr}
          </TableCell>
        ))}
      </>
    );
  };

  const formatNumber = (number) => {
    if (number == null) {
      return '';
    }
  
    let [integerPart, decimalPart] = number.toString().split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
  
    return `${integerPart}.${decimalPart}`;
  };
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleMouseEnter = (index) => setHoveredRow(index);
  const handleMouseLeave = () => setHoveredRow(null);
  //Body
  const formatDate = (dateObject) => {
   
    if (!dateObject) {
      return ''; // or any default value you prefer
    }
    const date = new Date(dateObject.date);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

   return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const renderTableRows = () => {
    const sortedResult = [...Result].sort((a, b) => a.mtr_app_level - b.mtr_app_level);
    return sortedResult.map((result, index) => (
      <TableRow
        key={index}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
       
        style={{
          backgroundColor: hoveredRow === index ? "#f0f8ff" : "white", // Light blue hover color
          cursor: "pointer",
        }}
      >
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.mtr_app_level}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          {result.mtr_app_empl_id}
        </TableCell>

        <TableCell style={{ padding: "5px", textAlign: "center" }}>
           {result.emp_mst_name}
        </TableCell>
        <TableCell style={{ padding: "10px", textAlign: "center" }}>
        {formatDate(result.mtr_app_date)}
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          
          {formatNumber(result.mtr_app_mr_limit)}
        </TableCell>
    
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
          <span
            style={{
              backgroundColor:
                result.mtr_app_status === "P"
                  ? "#FF6258"
                  : result.mtr_app_status === "Y"
                  ? "#19D895"
                  : result.mtr_app_status === "N"
                  ? "#2196F3"
                  : null,
              color: "white",
              padding: "5px",
              borderRadius: "5px",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            {result.mtr_app_status === "P"
              ? "Pending"
              : result.mtr_app_status === "Y"
              ? "Approved"
              : result.mtr_app_status === "N"
              ? "Disapproved"
              : result.mtr_app_status}
          </span>
        </TableCell>
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
         
        {result.mtr_app_desc && result.mtr_app_desc.length > 20 ? (
          <Tooltip title={result.mtr_app_desc} arrow placement="top">
            <span>
              {result.mtr_app_desc.slice(0, 20)}...
            </span>
          </Tooltip>
        ) : (
          result.mtr_app_desc || ""
        )}
        </TableCell>
     
        <TableCell style={{ padding: "5px", textAlign: "center" }}>
           {result.mtr_app_cost_center}
        </TableCell>
       


      
      </TableRow>
    ));
  };
  
 
useEffect(() => {
 
  if(FormStatus !== "" && FormStatus == "NEW" ){
    get_mr_approval_list_data_header(site_ID);
  }else{
    get_mr_approval_list_data(site_ID, RowID);
  }
 
}, [location]);




  return (
    <>
      <div>
        <div style={{ paddingBottom: "0px", backgroundColor: "white" }}>
          <div
            className="template-demo"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ marginRight: "4px",marginTop:"0px" }}>
              
              <Iconify
                icon="material-symbols:order-approve"
                style={{ marginRight: "4px",width: "30px", height: "30px", }}
            />
            </div>
            <div
              className="template-demo"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
              MR Approval List 
              </div>
             
            </div>
            
          </div>
        </div>
        <div className="table-responsive">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>{renderTableHeader()}</TableRow>
              </TableHead>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </TableContainer>
        </div>
       
        
      </div>
    </>
  );
};

export default Mr_ApprovalList;
