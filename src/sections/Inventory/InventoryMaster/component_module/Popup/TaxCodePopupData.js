import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import MaterialTable from "material-table";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";

const TaxCodePopupData = ({ onRowClick }) => {

    let site_ID = localStorage.getItem("site_ID");
    let emp_Id = localStorage.getItem("emp_mst_empl_id");
  
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState(null);
    const [viewedRows, setViewedRows] = useState(0);



    useEffect(() => {
        Swal.fire({ title: "Please Wait !", allowOutsideClick: false });
        Swal.showLoading();
        httpCommon .get( `/get_taxcode_popup_data.php?site_cd=${site_ID}`)
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
        title: "Supplier code",
        field: "tax_mst_tax_cd",
        cellStyle: {
            width: '20px', // Set the width as per your requirement
        },
        render: (rowData) => renderIcon(rowData),
        },
        {
        title: "Description",
        field: "tax_mst_desc",
        cellStyle: {
            width: '520px', // Set the width as per your requirement
        },
        
        },
        { title: "Status", 
          field: "tax_mst_tax_rate", cellStyle: {
          width: '120px', // Set the width as per your requirement
        },
        },
    
        
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
    
          onRowClick(rowData.tax_mst_tax_cd,1);
        }
        setSelectedRowKeys(rowData.tax_mst_tax_cd);
        onRowClick(rowData.tax_mst_tax_cd);
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


export default TaxCodePopupData;