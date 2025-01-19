import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const InventoryMasterLocation = ({ onRowClick, onChangePage, onSearchChange }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_inventoryMasterFormMasterLocation.php?site_cd=" + site_ID)
      .then((response) => {
        Swal.close();
        setData(response.data.data.MasterLocation);
        onRowClick(response.data.data.MasterLocation.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Table colums
  const columns = [
    {
      title: "Stock Location",
      field: "loc_mst_stk_loc",
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Description", field: "loc_mst_desc" },
    { title: "Master Location", field: "loc_mst_mst_loc_cd",width: 40 },
    { title: "Area Code", field: "loc_mst_area_loc_cd" },
    { title: "Bin ID", field: "loc_mst_bin_id",width: 150 },
  ];

  const renderIcon = (rowData) => {
    if (rowData.loc_mst_stk_loc === selectedRowKeys) {
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
          {rowData.loc_mst_stk_loc}
        </div>
      );
    }
    return <div>{rowData.loc_mst_stk_loc}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.loc_mst_stk_loc) {
      onRowClick(data.length, rowData.loc_mst_stk_loc, 1);
    }
    setSelectedRowKeys(rowData.loc_mst_stk_loc);
    onRowClick(data.length, rowData.loc_mst_stk_loc);
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
      const searchTextLower = searchText.toLowerCase();
  
      return (
        (item.loc_mst_stk_loc && item.loc_mst_stk_loc.toLowerCase().includes(searchTextLower)) ||
        (item.loc_mst_desc && item.loc_mst_desc.toLowerCase().includes(searchTextLower)) ||
        (item.loc_mst_mst_loc_cd && item.loc_mst_mst_loc_cd.toLowerCase().includes(searchTextLower)) ||
        (item.loc_mst_area_loc_cd && item.loc_mst_area_loc_cd.toLowerCase().includes(searchTextLower)) ||
        (item.loc_mst_bin_id && item.loc_mst_bin_id.toLowerCase().includes(searchTextLower))
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
              rowStyle: (rowData) => ({
                backgroundColor:
                  rowData.loc_mst_stk_loc === selectedRowKeys
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

export default InventoryMasterLocation;
