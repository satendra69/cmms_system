import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const FrequencyCodeList = ({ onRowClick, onChangePage, onSearchChange }) => {
    
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [Headerdata, setHeaderdata] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [clickCount, setClickCount] = useState(1);
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_frequency_code_list_data.php?site_cd=" + site_ID)
      .then((response) => {
       // console.log("response__NETcode__", response);
      
        Swal.close();
       
        setData(response.data.data.frequencyCode);
        setHeaderdata(response.data.data.header);
        onRowClick(response.data.data.frequencyCode.length);
       
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

//Table colums
    const columns = Headerdata.map((item, index) => {
        if (index === 0) {
          
          return {
            title: item.Header,    
            field: item.accessor,  
            render: (rowData) => renderIcon(rowData),
          };
        } else {
         
          return {
            field: item.accessor,
            title: item.Header,
            
          };
        }
      });
  

  const renderIcon = (rowData) => {
    if (rowData.col2 === selectedRowKeys) {
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
          {rowData.col2}
        </div>
      );
    }
    return <div>{rowData.col2}</div>;
  };
  const handleRowClick = (event, rowData) => {
   
    if (selectedRowKeys && selectedRowKeys === rowData.col2 && clickCount === 2) {
      onRowClick(data.length, rowData.col2 +' : '+rowData.col4, 1,rowData.col7);
      setClickCount(1);
    }else{
    setSelectedRowKeys(rowData.col2);
    onRowClick(data.length, rowData.col2 +' : '+rowData.col4,0,rowData.col7);
    setClickCount(clickCount + 1);
    }
    
  };
  const handlePageChange = (page) => {
    const pageSize = 10; // Assuming each page displays 10 rows
    const viewedRowsCount = page * pageSize;
    setViewedRows(viewedRowsCount);
    onChangePage(viewedRowsCount);
  };

  const handleSearch = (searchText) => {
    // Filter the data based on the search text
    const filteredData = data.filter((item) => {
      const frequencyCode = item.col2 ? item.col2.toLowerCase() : "";
      const frequencyType = item.col3 ? item.col3.toLowerCase() : "";
      const description = item.col4 ? item.col4.toLowerCase() : "";
      const usageuOM = item.col5 ? item.col5.toLowerCase() : "";
      const usage = item.col6 ? item.col6.toLowerCase() : "";
      const valueser = item.col7 ? item.col7.toLowerCase() : "";
      const uOMser = item.col8 ? item.col8.toLowerCase() : "";
  
      return (
        frequencyCode.includes(searchText.toLowerCase()) ||
        frequencyType.includes(searchText.toLowerCase()) ||
        description.includes(searchText.toLowerCase()) ||
        usageuOM.includes(searchText.toLowerCase()) ||
        usage.includes(searchText.toLowerCase()) ||
        valueser.includes(searchText.toLowerCase()) ||
        uOMser.includes(searchText.toLowerCase()) 
      );
    });
  

    onSearchChange(filteredData.length);
  };
  

  return (
    <>
      <div>
        <div class="container Ordertbl">
          <MaterialTable
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
                  rowData.col2 === selectedRowKeys
                    ? "#a9ebb9"
                    : "#FFF",
                fontSize: "12px !important",
              }),
            }}
            onRowClick={handleRowClick}
            onChangePage={handlePageChange}
            onSearchChange={(searchText) => handleSearch(searchText)}
          />
        </div>
      </div>
    </>
  );
};

export default FrequencyCodeList;
