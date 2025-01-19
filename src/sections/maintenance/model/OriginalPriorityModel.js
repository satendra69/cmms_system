import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import { debounce } from "lodash";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const OriginalPriorityModel = ({ onRowClick, onChangePage, onSearchChange }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [viewedRows, setViewedRows] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
 
  
  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_original_priority_list_data.php?site_cd=" + site_ID)
      .then((response) => {
        console.log("response__NET", response);
        Swal.close();
        setData(response.data.data.originalPriority);
      
        setRenderKey((prev) => prev + 1);
        setIsLoaded(true);
        onRowClick(response.data.data.WorkAssetNo.length);
    
      })
      .catch((error) => {
        console.log(error);
        Swal.close();
      });
  }, []);

  //Table colums
  const columns = [
    {
      title: "Priority Code",
      field: "wrk_pri_pri_cd",
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Description", field: "wrk_pri_desc" },
    {
        title: "Due Date Calculation",
        field: "",
        render: (rowData) => {
          // Assuming wrk_pri_due_date_count is in minutes
          const totalMinutes = rowData.wrk_pri_due_date_count;
          if (!totalMinutes) return "";
    
          // Calculate days, hours, and minutes
          const days = Math.floor(totalMinutes / 1440); // 1440 minutes in a day
          const hours = Math.floor((totalMinutes % 1440) / 60); // Remaining hours
          const minutes = totalMinutes % 60; // Remaining minutes
    
          // Create the formatted string
          let result = "";
          if (days > 0) result += `${days}d:`;
          if (hours > 0 || days > 0) result += `${hours}h:`;
          result += `${minutes}m`;
    
          return result;
        },
      },
    { title: "Due Date Count", field: "wrk_pri_due_date_count" },
    { title: "Due Type", field: "wrk_pri_due_type" },
    { title: "Start of the Week", field: "wrk_pri_start_day" },
  ];

  const renderIcon = (rowData) => {
    if (rowData.wrk_pri_pri_cd === selectedRowKeys) {
      return (
        <div>
          <Iconify
            icon="mingcute:save-fill"
            style={{
              marginRight: "0px",
              marginTop: "2px",
              float: "left",
              fontSize: "16px",
              color: "#289e49",
            }}
          />
          {rowData.wrk_pri_pri_cd}
        </div>
      );
    }
    return <div>{rowData.wrk_pri_pri_cd}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.wrk_pri_pri_cd) {
      onRowClick(data.length, rowData.wrk_pri_pri_cd+' : '+rowData.wrk_pri_desc, rowData.wrk_pri_due_date_count,1);
    }
    setSelectedRowKeys(rowData.wrk_pri_pri_cd);
    onRowClick(data.length, rowData.wrk_pri_pri_cd+' : '+rowData.wrk_pri_desc,rowData.wrk_pri_due_date_count);
  };
  const handlePageChange = (page) => {
    const pageSize = 10; // Assuming each page displays 10 rows
    const viewedRowsCount = page * pageSize;
    setViewedRows(viewedRowsCount);
    onChangePage(viewedRowsCount);
  };

  const handleSearch = (searchText) => {
    const filteredData = data.filter((item) => {
      return (
        (item.wrk_pri_pri_cd &&
          item.wrk_pri_pri_cd.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.wrk_pri_desc &&
          item.wrk_pri_desc.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.wrk_pri_due_type &&
          item.wrk_pri_due_type.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.wrk_pri_start_day &&
          item.wrk_pri_start_day.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
    onSearchChange(filteredData.length);
  };
  

  return (
    <>
      <div>
        <div class="container Ordertbl">
        {isLoaded ? (
          <MaterialTable
          key={renderKey}
            title=""
            data={data}
            columns={columns}
            options={{
              search: true,
              paging: true,
              pageSize: 10,
              pageSizeOptions: false,
              overflowY: "auto",
              paginationPosition: "top",
              toolbarButtonAlignment: "right",
              paginationType: "normal",
              emptyRowsWhenPaging: false,
              rowStyle: (rowData) => ({
                backgroundColor:
                  rowData.wrk_pri_pri_cd === selectedRowKeys
                    ? "#a9ebb9"
                    : "#FFF",
                fontSize: "12px !important",
              }),
            }}
            onRowClick={handleRowClick}
            onChangePage={handlePageChange}
            onSearchChange={(searchText) => handleSearch(searchText)}
          />
        ) : (
          <p>Loading...</p> // Or some loading indicator
        )}
        </div>
      </div>
    </>
  );
};

export default OriginalPriorityModel;
