import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";

const PmLaborCraftPopupData = ({ onRowClick }) => {
  let site_ID = localStorage.getItem("site_ID");
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get("/get_pm_labor_craft_popup_data.php?site_cd=" + site_ID)
      .then((response) => {
      //  console.log("response__NET", response);
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
      title: "Craft Code",
      field: "crf_mst_crf_cd",
      cellStyle: {
        width: '60px', // Set the width as per your requirement
      },
      render: (rowData) => renderIcon(rowData),
    },
    {
      title: "Description",
      field: "crf_mst_desc",
      cellStyle: {
        width: '350px', // Set the width as per your requirement
      },
      render: (rowData) =>
        rowData.crf_mst_desc.length > 40
          ? `${rowData.crf_mst_desc.substring(0, 40)}...`
          : rowData.crf_mst_desc,
    },
  
    { title: "Estimate Rate", field: "crf_mst_crf_est_rate" },
   
  ];

  const renderIcon = (rowData) => {
    if (rowData.crf_mst_crf_cd === selectedRowKeys) {
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

          {rowData.crf_mst_crf_cd}
        </div>
      );
    }
    return <div>{rowData.crf_mst_crf_cd}</div>;
  };
  
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.crf_mst_crf_cd) {
      onRowClick(rowData.crf_mst_crf_cd, rowData.crf_mst_desc, 1);
    }
    setSelectedRowKeys(rowData.crf_mst_crf_cd);
    onRowClick(rowData.crf_mst_crf_cd, rowData.crf_mst_desc);
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
                  rowData.crf_mst_crf_cd === selectedRowKeys
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

export default PmLaborCraftPopupData;
