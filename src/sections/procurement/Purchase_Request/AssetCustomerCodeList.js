import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const AssetCustomerCodeList = ({ onRowClick, onChangePage, onSearchChange }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const startTime = window.performance.now();
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_mr_asset_no_list.php?site_cd=" + site_ID)
      .then((response) => {
        console.log("response__NETCode", response);
        const endTime = window.performance.now();
        const loadTime = endTime - startTime;
       // console.log(`API load time: ${loadTime} milliseconds`);
        Swal.close();
        //setData(response.data.data.result);
        setData(response.data.data.AssetCustomerCode);
        onRowClick(response.data.data.AssetCustomerCode.length);
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
      field: "ast_mst_asset_no",width: 70,
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Cost Center", field: "ast_mst_cost_center",width: 150 },
    { title: "Asset Type", field: "ast_mst_asset_type",width: 80 },
    { title: "Asset Group Code", field: "ast_mst_asset_grpcode" },
    { title: "Short Description", field: "ast_mst_asset_shortdesc",width: 150 },
    { title: "Status ", field: "ast_mst_asset_status",width: 40 },
    { title: "Long Description", field: "ast_mst_asset_longdesc",width: 200 },
    { title: "Work Area", field: "ast_mst_work_area",width: 200 },
    { title: "Asset Location", field: "ast_mst_asset_locn",width: 200 },
    { title: "Permanent ID", field: "ast_mst_perm_id",width: 200 },
    { title: "Customer Code", field: "ast_det_cus_code",width: 200 },
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
    if (selectedRowKeys && selectedRowKeys === rowData.ast_mst_asset_no) {
      onRowClick(data.length, rowData.ast_mst_asset_no, 1);
    }
    setSelectedRowKeys(rowData.ast_mst_asset_no);
    onRowClick(data.length, rowData.ast_mst_asset_no);
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
        item.ast_mst_asset_grpcode.toLowerCase().includes(searchText.toLowerCase())
        ||
        item.ast_mst_asset_shortdesc.toLowerCase().includes(searchText.toLowerCase())
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
                  rowData.ast_mst_asset_no === selectedRowKeys
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

export default AssetCustomerCodeList;
