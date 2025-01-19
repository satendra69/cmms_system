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
      .get("/AssetFormCustomerCodeList.php?site_cd=" + site_ID)
      .then((response) => {
       // console.log("response__NETCode", response);
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
      title: "Customer Code",
      field: "cus_mst_customer_cd",
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Cus Det Varchar2", field: "cus_det_varchar2" },
    { title: "Cus Mst Acct No", field: "cus_mst_acct_no",width: 40 },
    { title: "Description", field: "cus_mst_desc" },
    { title: "Status", field: "cus_mst_status",width: 150 },
    { title: "Cus Mst Fob ", field: "cus_mst_fob",width: 40 },
    { title: "Cus Mst Shipvia", field: "cus_mst_shipvia",width: 200 },
  ];

  const renderIcon = (rowData) => {
    if (rowData.cus_mst_customer_cd === selectedRowKeys) {
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
          {rowData.cus_mst_customer_cd}
        </div>
      );
    }
    return <div>{rowData.cus_mst_customer_cd}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.cus_mst_customer_cd) {
      onRowClick(data.length, rowData.cus_mst_customer_cd, 1);
    }
    setSelectedRowKeys(rowData.cus_mst_customer_cd);
    onRowClick(data.length, rowData.cus_mst_customer_cd);
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
        item.cus_mst_customer_cd
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.cus_det_varchar2
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.cus_mst_acct_no
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.cus_mst_desc.toLowerCase().includes(searchText.toLowerCase())
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
                  rowData.cus_mst_customer_cd === selectedRowKeys
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
