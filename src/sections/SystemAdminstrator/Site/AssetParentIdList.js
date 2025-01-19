import React, { useState, useEffect, useRef } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const AssetParentIdList = ({ onRowClick, onChangePage, onSearchChange,asset  }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const startTime = window.performance.now();
  const [viewedRows, setViewedRows] = useState(0);
  const tableRef = useRef(null);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_asset_from_parentId_list.php?site_cd=" + site_ID + "&vlu=" + asset)
      .then((response) => {
       
        const endTime = window.performance.now();
        const loadTime = endTime - startTime;
      
        Swal.close();
      
        setData(response.data.data.WorkAssetNo);
        onRowClick(response.data.data.WorkAssetNo.length);
      
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
      render: (rowData) => renderIcon(rowData),
      cellStyle: { textAlign: "center" },
      headerStyle: { textAlign: "center" },
    },
    { title: "Short Description", field: "ast_mst_asset_shortdesc",width: 450,cellStyle: { textAlign: "center" }, },
    { title: "Level", field: "ast_mst_ast_lvl",width: 40 },
    { title: "Zone", field: "ast_mst_work_area",width: 40 },
    { title: "Asset Location", field: "ast_mst_asset_locn",width: 150 },
    { title: "Cost Center", field: "ast_mst_cost_center",width: 40 },
    { title: "Asset Type", field: "ast_mst_asset_type",width: 200 },
    { title: "Status", field: "ast_mst_asset_status",width: 40 },
    { title: "Customer Code", field: "ast_det_cus_code",width: 40 },
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
      onRowClick(data.length, rowData.ast_mst_asset_no+' : '+rowData.ast_mst_asset_shortdesc, 1);
    }
    setSelectedRowKeys(rowData.ast_mst_asset_no);
    onRowClick(data.length, rowData.ast_mst_asset_no+' : '+rowData.ast_mst_asset_shortdesc);
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
      const assetNo = item.ast_mst_asset_no ? item.ast_mst_asset_no.toLowerCase() : '';
      const assetDesc = item.ast_mst_asset_longdesc ? item.ast_mst_asset_longdesc.toLowerCase() : '';
      const workArea = item.ast_mst_work_area ? item.ast_mst_work_area.toLowerCase() : '';
      const assetType = item.ast_mst_asset_type ? item.ast_mst_asset_type.toLowerCase() : '';
  
      return (
        assetNo.includes(searchText.toLowerCase()) ||
        assetDesc.includes(searchText.toLowerCase()) ||
        workArea.includes(searchText.toLowerCase()) ||
        assetType.includes(searchText.toLowerCase())
      );
    });
  
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

export default AssetParentIdList;
