import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";

const WorkStockNoPopupData = ({ onRowClick }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  const [viewedRows, setViewedRows] = useState(0);

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/Get_StockNoPopupData.php?site_cd=" + site_ID)
      .then((response) => {
        //console.log("response__NET", response);
        Swal.close();
        setData(response.data.data);
        // onRowClick(response.data.data.WorkAssetNo.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //Table colums
  const columns = [
    {
      title: "Stock No",
      field: "itm_mst_stockno",
      cellStyle: {
        width: '60px', // Set the width as per your requirement
      },
      render: (rowData) => renderIcon(rowData),
    },
    {
      title: "Description",
      field: "itm_mst_desc",
      cellStyle: {
        width: '350px', // Set the width as per your requirement
      },
      render: (rowData) =>
        rowData.itm_mst_desc.length > 40
          ? `${rowData.itm_mst_desc.substring(0, 40)}...`
          : rowData.itm_mst_desc,
    },
    { title: "Extended Description", field: "itm_mst_ext_desc", cellStyle: {
        width: '250px', // Set the width as per your requirement
      },},
    { title: "Part No", field: "itm_mst_partno" },
    { title: "Total OH", field: "itm_mst_ttl_oh" },
    { title: "Type", field: "itm_mst_type" },
    { title: "Commodity Code", field: "itm_mst_com_code", cellStyle: {
        width: '250px', // Set the width as per your requirement
      }, },
    { title: "Stock Group", field: "itm_mst_itm_grp",cellStyle: {
        width: '200px', // Set the width as per your requirement
      }, },
  ];

  const renderIcon = (rowData) => {
    if (rowData.itm_mst_stockno === selectedRowKeys) {
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

          {rowData.itm_mst_stockno}
        </div>
      );
    }
    return <div>{rowData.itm_mst_stockno}</div>;
  };
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.itm_mst_stockno) {
      onRowClick(rowData.itm_mst_stockno, rowData.itm_mst_desc, 1);
    }
    setSelectedRowKeys(rowData.itm_mst_stockno);
    onRowClick(rowData.itm_mst_stockno, rowData.itm_mst_desc);
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
                  rowData.itm_mst_stockno === selectedRowKeys
                    ? "#a9ebb9"
                    : "#FFF",
                fontSize: "12px !important",
              }),
            }}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </>
  );
};

export default WorkStockNoPopupData;
