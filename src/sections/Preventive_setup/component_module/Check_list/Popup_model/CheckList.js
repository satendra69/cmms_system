import React, { useState, useEffect } from "react";
import Iconify from "src/components/iconify";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";

const CheckList = ({ onRowClick,dataId }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get( `/get_all_check_list_header.php?site_cd=${site_ID}&mst_RowID=${dataId}`) 
      .then((response) => {
       // console.log("response__NET", response);
        if (response.data.status === "SUCCESS") {
            const responseData = response.data.data.HeaderData;
            setData(responseData);
        }
        Swal.close();
        //setData(response.data.data.result);
       // onRowClick(response.data.data.WorkAssetNo.length);
        // setTotalData(response.data.data.WorkAssetNo.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Table colums
  const columns = [
    {
      title: "Check List Code",
      field: "job_mst_job_cd",
      render: (rowData) => renderIcon(rowData),
    },
    { title: "Check List Description", field: "job_mst_desc" },
   
  ];

  const renderIcon = (rowData) => {
    if (rowData.job_mst_job_cd === selectedRowKeys) {
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
          {rowData.job_mst_job_cd}
        </div>
      );
    }
    return <div>{rowData.job_mst_job_cd}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.job_mst_job_cd) {
      onRowClick(rowData.job_mst_job_cd,rowData.job_mst_desc,1);
    }
    setSelectedRowKeys(rowData.job_mst_job_cd);
    onRowClick( rowData.job_mst_job_cd,rowData.job_mst_desc);
  };


  const handleSearch = (searchText) => {
    // Filter the data based on the search text
    const filteredData = data.filter(
      (item) =>
        item.job_mst_job_cd
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        item.job_mst_desc
          .toLowerCase()
          .includes(searchText.toLowerCase())
    );

    // setData(filteredData);
    //setSearchedDataCount(filteredData.length);
  //  onSearchChange(filteredData.length);
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
              emptyRowsWhenPaging: false,
              rowStyle: (rowData) => ({
                backgroundColor:
                  rowData.job_mst_job_cd === selectedRowKeys
                    ? "#a9ebb9"
                    : "#FFF",
                fontSize: "12px !important",
              }),
            }}
            
            onRowClick={handleRowClick}
          //  onChangePage={handlePageChange}
            onSearchChange={(searchText) => handleSearch(searchText)}
          />
        </div>
      </div>
    </>
  );
};

export default CheckList;
