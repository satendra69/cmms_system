import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import { Button } from "@mui/material";
import { Audio, ThreeCircles } from "react-loader-spinner";

const DefaultSiteCodeTable = ({
  onRowClick,
  onChangePage,
  onSearchChange,
}) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const startTime = window.performance.now();
  const [viewedRows, setViewedRows] = useState(0);

  const [rowData, setRowData] = useState({
    length: "",
    data: "",
  });

  useEffect(() => {
    // Swal.fire({
    //   title: "Please Wait !",
    //   allowOutsideClick: false,
    //   timer: 2000,
    // });
    // Swal.showLoading();
    httpCommon
      .get("/get_sitecode.php")
      .then((response) => {
        console.log("response__siteCode", response);
        if (response.data.status === "ERROR") {
          setLoading(true);
          setData([]);
        } else {
          const endTime = window.performance.now();
          const loadTime = endTime - startTime;

          setData(response.data.data);
          setLoading(false);
          
          const endTime2 = window.performance.now();
          const loadTime2 = endTime2 - startTime;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Table colums

  const columns = [
    {
      title: "Site Code",
      field: "site_cd",
      width: 450,
      render: (rowData) => renderIcon(rowData),
    },
    

    { title: "Site Name", field: "site_name", width: 40 },
  ];

  const renderIcon = (rowData) => {
    if (rowData.site_cd === selectedRowKeys) {
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
          {rowData.site_cd}
        </div>
      );
    }
    return <div>{rowData.site_cd}</div>;
  };
  const handleRowClick = (event, rowData) => {
    setRowData((pre) => ({
      ...pre,
      length: data.length,
      data: rowData.site_cd + " : " + rowData.site_name,
    }));
    if (selectedRowKeys && selectedRowKeys === rowData.site_cd) {
      onRowClick(data.length, rowData.site_cd + " : " + rowData.site_name, 1);
    }

    setSelectedRowKeys(rowData.site_cd);
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
  console.log("loading", loading);

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
                    rowData.site_cd === selectedRowKeys ? "#a9ebb9" : "#FFF",
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

export default DefaultSiteCodeTable;
