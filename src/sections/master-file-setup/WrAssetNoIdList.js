import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import { Button } from "@mui/material";
import { ThreeCircles } from "react-loader-spinner";

const WrAssetNoIdList = ({ onRowClick, onChangePage, onSearchChange }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const startTime = window.performance.now();
  const [loading, setLoading] = useState(false);
  const [viewedRows, setViewedRows] = useState(0);
  const [rowData, setRowData] = useState({
    length: "",
    data: "",
  });

  useEffect(() => {
    setLoading(true);
    httpCommon
      .get("/WrAssetNoId.php?site_cd=" + site_ID)
      .then((response) => {
        // console.log("response__NET", response);
        const endTime = window.performance.now();
        const loadTime = endTime - startTime;
        // console.log(`API load time: ${loadTime} milliseconds`);
        // setData(response.data.data.result);
        setData(response.data.data.WorkAssetNo);
        setLoading(false);
        // onRowClick(response.data.data.WorkAssetNo.length);
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
      title: "Asset No",
      field: "ast_mst_asset_no",
      width: 450,
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Long Description", field: "ast_mst_asset_longdesc", width: 40 },
    {
      title: "Level",
      field: "ast_mst_ast_lvl",
      width: 40,
    },
    {
      title: "Zone",
      field: "ast_mst_work_area",
      width: 40,
    },
    {
      title: "Asset Location",
      field: "aast_mst_asset_locn",
      width: 40,
    },
    {
      title: "Cost Center",
      field: "ast_mst_cost_center",
      width: 40,
    },
    {
      title: "Asset Type",
      field: "ast_mst_asset_type",
      width: 40,
    },
    {
      title: "Status",
      field: "ast_mst_asset_status",
      width: 40,
    },
    {
      title: "Customer Code",
      field: "ast_det_cus_code",
      width: 40,
    },
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
    // + " : " + rowData.ast_mst_asset_shortdesc
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
                    rowData.ast_mst_asset_no === selectedRowKeys
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

export default WrAssetNoIdList;
