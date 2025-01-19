import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";

const CurrencyCodeData = ({ onRowClick }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_currency_code_data.php?site_cd=" + site_ID)
      .then((response) => {

       // console.log("response__NET", response);

        Swal.close();
        setData(response.data.data);
        setTotalData(response.data.data.length);
        // onRowClick(response.data.data.WorkAssetNo.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Table colums
  const columns = [
    {
      title: "Currency Code",
      field: "cur_mst_cur_code",
      cellStyle: {
        width: '60px', // Set the width as per your requirement
      },
      render: (rowData) => renderIcon(rowData),
    },
    {
      title: "Currency Description",
      field: "cur_mst_desc",
      cellStyle: {
        width: '350px', // Set the width as per your requirement
      },
      render: (rowData) =>
        rowData.cur_mst_desc.length > 40
          ? `${rowData.cur_mst_desc.substring(0, 40)}...`
          : rowData.cur_mst_desc,
    },
    { title: "Exchange Rate", field: "cur_mst_exchange_rate", cellStyle: {
        width: '250px', // Set the width as per your requirement
      },}
    
  ];

  const renderIcon = (rowData) => {
    if (rowData.cur_mst_cur_code === selectedRowKeys) {
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

          {rowData.cur_mst_cur_code}
        </div>
      );
    }
    return <div>{rowData.cur_mst_cur_code}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.cur_mst_cur_code) {
      onRowClick(rowData.cur_mst_cur_code, rowData.cur_mst_exchange_rate, 1);
    }
    setSelectedRowKeys(rowData.cur_mst_cur_code);
    onRowClick(rowData.cur_mst_cur_code, rowData.cur_mst_exchange_rate);
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
                  rowData.cur_mst_cur_code === selectedRowKeys
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

export default CurrencyCodeData;
