import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const MrWorkOrderList = ({ onRowClick, onChangePage, onSearchChange }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const startTime = window.performance.now();
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_mr_work_order_list.php?site_cd=" + site_ID)
      .then((response) => {
       // console.log("response__NETCode", response);
        const endTime = window.performance.now();
        const loadTime = endTime - startTime;
       // console.log(`API load time: ${loadTime} milliseconds`);
        Swal.close();
        //setData(response.data.data.result);
        setData(response.data.data.mr_work_order);
        onRowClick(response.data.data.mr_work_order.length);
        // setTotalData(response.data.data.WorkAssetNo.length);
        const endTime2 = window.performance.now();
        const loadTime2 = endTime2 - startTime;
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Table colums
  const columns = [
    {
      title: "Work Order No",
      field: "wko_mst_wo_no",
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Asset No", field: "wko_mst_assetno" },
    { title: "Description", field: "wko_mst_descs" },
  ];

  const renderIcon = (rowData) => {
    if (rowData.wko_mst_wo_no === selectedRowKeys) {
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
          {rowData.wko_mst_wo_no}
        </div>
      );
    }
    return <div>{rowData.wko_mst_wo_no}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.wko_mst_wo_no) {
       
      onRowClick(data.length, rowData.wko_mst_wo_no, 1,rowData.wko_mst_assetno);
    }
    
    setSelectedRowKeys(rowData.wko_mst_wo_no,rowData.wko_mst_assetno);
    onRowClick(data.length, rowData.wko_mst_wo_no,0,rowData.wko_mst_assetno);
  };
  const handlePageChange = (page) => {
    const pageSize = 10; // Assuming each page displays 10 rows
    const viewedRowsCount = page * pageSize;
    setViewedRows(viewedRowsCount);
    onChangePage(viewedRowsCount);
  };

  const handleSearch = (searchText) => {
    // Filter the data based on the search text
    const filteredData = data.filter(
      (item) =>
        item.wko_mst_wo_no
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.wko_mst_assetno
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.wko_mst_descs
          .toLowerCase()
          .includes(searchText.toLowerCase()) 
        
    );

    // setData(filteredData);
    //setSearchedDataCount(filteredData.length);
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
              rowStyle: (rowData) => ({
                backgroundColor:
                  rowData.wko_mst_wo_no === selectedRowKeys
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

export default MrWorkOrderList;
