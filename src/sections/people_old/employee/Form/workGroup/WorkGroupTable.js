import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import { Button } from "@mui/material";
import { ThreeCircles } from "react-loader-spinner";

const WorkGroupTable = ({ onRowClick, onChangePage, onSearchChange }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const startTime = window.performance.now();
  const [viewedRows, setViewedRows] = useState(0);
  const [rowData, setRowData] = useState({
    length: "",
    data: "",
  });

  useEffect(() => {
    httpCommon
      .get("/get_emp_work_group.php?site_cd=" + site_ID)
      .then((response) => {
     
        const endTime = window.performance.now();
        const loadTime = endTime - startTime;
      

        setData(response.data.emp_work_group);
      
        setPageSize(Math.max(10, response.data.emp_status.length));
      
        const endTime2 = window.performance.now();
        const loadTime2 = endTime2 - startTime;
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Table colums

  const columns = [
    { title: "Group Code", field: "wrk_grp_grp_cd", width: 40,
      render:(rowData)=>renderIcon(rowData)
     },
    { title: "Description", field: "wrk_grp_desc", width: 40 },
  
  ];

  const renderIcon = (rowData) => {
    if (rowData.wrk_grp_grp_cd === selectedRowKeys) {
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
          {rowData.wrk_grp_grp_cd}
        </div>
      );
    }
    return <div>{rowData.wrk_grp_grp_cd}</div>;
  };
  const handleRowClick = (event, rowData) => {
    setRowData((pre) => ({
      ...pre,
      length: data.length,
      data: rowData.wrk_grp_grp_cd + " : " + rowData.wrk_grp_desc,
    }));
    if (selectedRowKeys && selectedRowKeys === rowData.wrk_grp_grp_cd) {
      onRowClick(
        data.length,
        rowData.wrk_grp_grp_cd + " : " + rowData.wrk_grp_desc,
        1
      );
    }

    setSelectedRowKeys(rowData.wrk_grp_grp_cd);
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
        item.ast_mst_asset_no
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.ast_mst_asset_longdesc
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.ast_mst_work_area
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.ast_mst_asset_type.toLowerCase().includes(searchText.toLowerCase())
    );

    // setData(filteredData);
    //setSearchedDataCount(filteredData.length);
    onSearchChange(filteredData.length);
  };

  return (
    <>
      {data && data.length ? (
        <div>
          <div class="container Ordertbl">
            <MaterialTable
              title=""
              data={data}
              columns={columns}
              options={{
                search: true,
                paging: true,
                pageSize: data.length < 10 ? data.length : 10,
                pageSizeOptions: false,
                overflowY: "auto",
                paginationPosition: "top",
                toolbarButtonAlignment: "right",
                paginationType: "normal",
                rowStyle: (rowData) => ({
                  backgroundColor:
                    rowData.wrk_grp_grp_cd === selectedRowKeys
                      ? "#a9ebb9"
                      : "#FFF",
                  fontSize: "12px !important",
                }),
                emptyRowsWhenPaging: false,
              }}
              onRowClick={handleRowClick}
            />
          </div>
          <div
            className="mlauto"
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              variant="primary"
              onClick={() => onRowClick(rowData.length, rowData.data, 1)}
            >
              Select
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThreeCircles
            radius="9"
            visible={true}
            ariaLabel="three-circles-loading"
            color="green"
          />
        </div>
      )}
    </>
  );
};

export default WorkGroupTable;
