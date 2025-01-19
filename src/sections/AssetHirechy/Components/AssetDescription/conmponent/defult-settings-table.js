import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import { Button } from "@mui/material";
import { Audio, ThreeCircles } from "react-loader-spinner";

const DefaultSettingsIdList = ({
  onRowClick,
  onChangePage,
  onSearchChange,
  data
}) => {
  let site_ID = localStorage.getItem("site_ID");
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const startTime = window.performance.now();
  const [viewedRows, setViewedRows] = useState(0);

  const [rowData, setRowData] = useState({
    length: "",
    data: "",
  });



  //Table colums

  const columns = [
    {
      title: "Asset No",
      field: "ast_mst_asset_no",
      width: 450,
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Cost Center", field: "ast_mst_cost_center", width: 40 },
    { title: "Asset Type", field: "ast_mst_asset_type", width: 40 },
    { title: "Asset Status", field: "ast_mst_asset_status", width: 40 },
    { title: "Short Description", field: "ast_mst_asset_shortdesc", width: 60 },
    { title: "Long Description", field: "ast_mst_asset_longdesc", width: 40 },
    { title: "Work Area", field: "ast_mst_work_area", width: 40 },
    { title: "Location", field: "ast_mst_asset_locn", width: 40 },
    { title: "Location", field: "ast_mst_perm_id", width: 40 },
  ];

  const renderIcon = (rowData) => {
    if (rowData.ast_mst_asset_no === selectedRowKeys) {
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
          {rowData.ast_mst_asset_no}
        </div>
      );
    }
    return <div>{rowData.ast_mst_asset_no}</div>;
  };
  const handleRowClick = (event, rowData) => {
    setRowData((pre) => ({
      ...pre,
      length: data.length,
      data: rowData.ast_mst_asset_no,
    }));
    if (selectedRowKeys && selectedRowKeys === rowData.ast_mst_asset_no) {
      onRowClick(data.length, rowData.ast_mst_asset_no, 1);
    }

    setSelectedRowKeys(rowData.ast_mst_asset_no);
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
        item.ast_mst_cost_center
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.ast_mst_asset_type
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
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          No Record Found
        </div>
      ) : data && data.length > 0 ? (
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
                    rowData.ast_mst_asset_no === selectedRowKeys ? "#a9ebb9" : "#FFF",
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

export default DefaultSettingsIdList;
