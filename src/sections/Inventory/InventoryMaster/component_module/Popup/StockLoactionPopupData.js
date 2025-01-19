import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";

const StockLoactionPopupData = ({ onRowClick }) => {

  let site_ID = localStorage.getItem("site_ID");
  let emp_Id = localStorage.getItem("emp_mst_empl_id");

  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get( `/get_stock_loc_popup_data.php?site_cd=${site_ID}&empId=${emp_Id}`)
      .then((response) => {
        //console.log("response__NET", response);
        Swal.close();
        setData(response.data.data);
        setTotalData(response.data.data.length);
        //onRowClick(response.data.data);
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
      cellStyle: {
        width: '60px', // Set the width as per your requirement
      },
      render: (rowData) => renderIcon(rowData),
    },
    {
      title: "Description",
      field: "loc_mst_desc",
      cellStyle: {
        width: '350px', // Set the width as per your requirement
      },
      
    },
    { title: "Master Loaction", field: "loc_mst_mst_loc_cd", cellStyle: {
        width: '250px', // Set the width as per your requirement
      },},
    { title: "Area Code", field: "loc_mst_area_loc_cd" },
    { title: "Bin ID OH", field: "loc_mst_bin_id" },
    
  ];

  const renderIcon = (rowData) => {
    if (rowData.loc_mst_stk_loc === selectedRowKeys) {
      return (
        <div>
          <Iconify
            icon="simple-line-icons:check"
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

      onRowClick(rowData.loc_mst_stk_loc,1);
    }
    setSelectedRowKeys(rowData.loc_mst_stk_loc);
    onRowClick(rowData.loc_mst_stk_loc);
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
              pageSize:10,
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
              emptyRowsWhenPaging: false,
            }}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </>
  );
};

export default StockLoactionPopupData;
