import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const InventoryMasterTaxCode = ({ onRowClick, onChangePage, onSearchChange }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_inventory_master_form_tax_code.php?site_cd=" + site_ID)
      .then((response) => {
       
        setData(response.data.data.TaxCode);
        onRowClick(response.data.data.TaxCode.length);
        Swal.close();
      })
      .catch((error) => {
        Swal.close();
        console.log(error);
      });
  }, []);
       
  //Table colums
  const columns = [
    {
      title: "Tax Code",
      field: "tax_mst_tax_cd",
      render: (rowData) => renderIcon(rowData),
      cellStyle: { width: 100 },
      headerStyle: { width: 100 },
    },
    { title: "Description", field: "tax_mst_desc", cellStyle: { width: 200 }, },
    { title: "Tax Rate", field: "tax_mst_tax_rate",width: 40 },
   
  ];

  const renderIcon = (rowData) => {
    if (rowData.tax_mst_tax_cd === selectedRowKeys) {
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
          {rowData.tax_mst_tax_cd}
        </div>
      );
    }
    return <div>{rowData.tax_mst_tax_cd}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.tax_mst_tax_cd) {
      onRowClick(data.length, rowData.tax_mst_tax_cd, 1);
    }
    setSelectedRowKeys(rowData.tax_mst_tax_cd);
    onRowClick(data.length, rowData.tax_mst_tax_cd);
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
        (item.tax_mst_tax_cd && item.tax_mst_tax_cd.toLowerCase().includes(searchTextLower)) ||
        (item.tax_mst_desc && item.tax_mst_desc.toLowerCase().includes(searchTextLower)) ||
        (item.tax_mst_tax_rate && item.tax_mst_tax_rate.toLowerCase().includes(searchTextLower)) ||
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
                  rowData.tax_mst_tax_cd === selectedRowKeys
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

export default InventoryMasterTaxCode;
