import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";


const PmSpecialOrderTaxCodePopupData = ({ onRowClick }) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_Id = localStorage.getItem("emp_mst_empl_id");
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get( `/get_tax_code_pm_special_order.php?site_cd=${site_ID}&empId=${emp_Id}`)
      .then((response) => {
      //  console.log("response__NET_Tax", response);
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
      title: "Tax Code",
      field: "tax_mst_tax_cd",
      cellStyle: {
        width: '60px',
        textAlign:'center' // Set the width as per your requirement
      },
      render: (rowData) => renderIcon(rowData),
    },
    {
      title: "Description",
      field: "tax_mst_desc",
      cellStyle: {
        width: '350px', // Set the width as per your requirement
      },
      render: (rowData) =>
        rowData.tax_mst_desc && rowData.tax_mst_desc.length > 40
          ? `${rowData.tax_mst_desc.substring(0, 40)}...`
          : rowData.tax_mst_desc || "N/A", 
    },
 
      { title: "Tax Rate", field: "tax_mst_tax_rate",
        cellStyle: {
        width: '300px', // Set the width as per your requirement
      }, },

   
  ];

  const renderIcon = (rowData) => {
    if (rowData.tax_mst_tax_cd === selectedRowKeys) {
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

          {rowData.tax_mst_tax_cd}
        </div>
      );
    }
    return <div>{rowData.tax_mst_tax_cd}</div>;
  };
  
  const handleRowClick = (event, rowData) => {
    if (selectedRowKeys && selectedRowKeys === rowData.tax_mst_tax_cd) {
      onRowClick(rowData.tax_mst_tax_cd, rowData.tax_mst_desc, 1);
    }
    setSelectedRowKeys(rowData.tax_mst_tax_cd);
    onRowClick(rowData.tax_mst_tax_cd, rowData.tax_mst_desc);
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
                  rowData.tax_mst_tax_cd === selectedRowKeys
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

export default PmSpecialOrderTaxCodePopupData;
