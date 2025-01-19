import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";


const PmToolPopupData = ({ onRowClick }) => {
  let site_ID = localStorage.getItem("site_ID");
  let emp_Id = localStorage.getItem("emp_mst_empl_id");
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState(null);
  

  useEffect(() => {
    Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
    Swal.showLoading();
    httpCommon
      .get( `/get_pm_tool_popup_data.php?site_cd=${site_ID}&empId=${emp_Id}`)
      .then((response) => {
      //  console.log("response__NET_SUP", response);
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
      title: "Stock No",
      field: "itm_mst_stockno",
      cellStyle: {
        width: '60px',
        textAlign:'center' // Set the width as per your requirement
      },
      render: (rowData) => renderIcon(rowData),
    },
    {
      title: "Description",
      field: "sup_mst_desc",
      cellStyle: {
        width: '350px', // Set the width as per your requirement
      },
      render: (rowData) =>
        rowData.itm_mst_desc && rowData.itm_mst_desc.length > 40
          ? `${rowData.itm_mst_desc.substring(0, 40)}...`
          : rowData.itm_mst_desc || "", 
    },
    {
        title: "Extended Description",
        field: "itm_mst_ext_desc",
        cellStyle: {
          width: '350px',
        },
        render: (rowData) =>
          rowData.itm_mst_ext_desc && rowData.itm_mst_ext_desc.length > 40
            ? `${rowData.itm_mst_ext_desc.substring(0, 40)}...`
            : rowData.itm_mst_ext_desc || "", 
      },
 
      { title: "Part No", field: "itm_mst_partno",
        cellStyle: {
        width: '300px', 
      }, },
      { title: "Total OH", field: "itm_mst_ttl_oh",
        cellStyle: {
        width: '300px', 
      }, },
      { title: "Type", field: "itm_mst_type",
        cellStyle: {
        width: '300px', 
      }, },
      { title: "Commodity Code", field: "itm_mst_com_code",
        cellStyle: {
        width: '300px', 
      }, },
      { title: "Stock Group", field: "itm_mst_itm_grp",
        cellStyle: {
        width: '300px', 
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
              pageSize:10,
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
              emptyRowsWhenPaging: false,
            }}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </>
  );
};

export default PmToolPopupData;
