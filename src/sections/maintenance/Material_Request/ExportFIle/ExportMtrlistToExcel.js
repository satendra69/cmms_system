import React from "react";
import ExcelJS from "exceljs";
import { format } from "date-fns";

const ExportMtrlistToExcel = ({ tableData:resultData }) => {
 
  console.log("_Data_export",resultData)
  if (resultData !== "" && resultData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Material List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Material Request No", key: "col1", width: 15 },
      { header: "Work Order No", key: "col2", width: 22 },
      { header: "Asset No", key: "col3", width: 15 },
      { header: "MR Status", key: "col4", width: 15 },
      { header: "Origination Date", key: "col5", width: 25 },
      { header: "MR Approval Status", key: "col6", width: 15 },
      { header: "Total Cost", key: "col7", width: 15 },
      { header: "Issue Status", key: "col8", width: 15 },

      { header: "Release For Approval", key: "col9", width: 15 },
      { header: "Email Notification", key: "col10", width: 60 },
      { header: "Email Requested By", key: "col11", width: 60 },
      { header: "Approval Status", key: "col12", width: 10 },
      { header: "Required Date", key: "col13", width: 25 },
      { header: "Cost Center", key: "col14", width: 10 },
      { header: "Account", key: "col15", width: 10 },
      { header: "Entered By", key: "col16", width: 10 },
      { header: "Requester", key: "col17", width: 10 },
      { header: "Note", key: "col18", width: 10 },
      { header: "Created By", key: "col19", width: 10 },
      { header: "Created Date", key: "col20", width: 25 },
      { header: "Rejected By", key: "col21", width: 10 },
      { header: "Rejected Reason", key: "col22", width: 10 },
      { header: "Rejected Date", key: "col23", width: 25 },
      { header: "Approved By", key: "col24", width: 10 },
      { header: "Approved Date", key: "col25", width: 25 },
      { header: "Varchar1", key: "col26", width: 10 },
      { header: "Varchar2", key: "col27", width: 10 },
      { header: "Varchar3", key: "col28", width: 10 },
      { header: "Varchar4", key: "col29", width: 10 },
      { header: "Varchar5", key: "col30", width: 10 },
      { header: "Varchar6", key: "col31", width: 10 },
      { header: "Varchar7", key: "col32", width: 10 },
      { header: "Varchar8", key: "col33", width: 10 },
      { header: "Varchar9", key: "col34", width: 10 },
      { header: "Varchar10", key: "col35", width: 10 },
      { header: "Numeric1", key: "col36", width: 10 },
      { header: "Numeric2", key: "col37", width: 10 },
      { header: "Numeric3", key: "col38", width: 10 },
      { header: "Numeric4", key: "col39", width: 10 },
      { header: "Numeric5", key: "col40", width: 10 },
      { header: "Datetime1", key: "col41", width: 25 },
      { header: "Datetime2", key: "col42", width: 25 },
      { header: "Datetime3", key: "col43", width: 25 },
      { header: "Datetime4", key: "col44", width: 25 },
      { header: "Datetime5", key: "col45", width: 25 },
      { header: "Note1", key: "col46", width: 10 },
      { header: "Note2", key: "col47", width: 10 },
      { header: "Note3", key: "col48", width: 10 },
 
    ];

    // Add data to the worksheet
    resultData.forEach((rowData) => {

      const formattedRow = {
        ...rowData,
        col5:rowData.col5? format(new Date(rowData.col5.date), "yyyy-MM-dd"):"",
        col13:rowData.col13? format(new Date(rowData.col13.date), "yyyy-MM-dd"):"",
        col20:rowData.col20? format(new Date(rowData.col20.date), "yyyy-MM-dd"):"",
        col23:rowData.col23? format(new Date(rowData.col23.date), "yyyy-MM-dd"):"",
        col25: rowData.col25?format(new Date(rowData.col25.date), "yyyy-MM-dd"):"",
        col41:rowData.col41? format(new Date(rowData.col41.date), "yyyy-MM-dd"):"",
        col42:rowData.col42? format(new Date(rowData.col42.date), "yyyy-MM-dd"):"",
        col43:rowData.col43? format(new Date(rowData.col43.date), "yyyy-MM-dd"):"",
        col44:rowData.col44? format(new Date(rowData.col44.date), "yyyy-MM-dd"):"",
        col45:rowData.col45? format(new Date(rowData.col45.date), "yyyy-MM-dd"):"",
      
        
      };


      worksheet.addRow(formattedRow);
    });

    const headerRow = worksheet.getRow(1);
    // Apply styling to header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { size: 12, bold: true, color: { argb: "FFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2F5597" },
      };
      cell.alignment = { horizontal: "center", vertical: "center" };
    });

    // Apply styling to data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.font = { size: 11, color: { argb: "#000" } }; // Customize font for data rows
        row.alignment = { horizontal: "center", vertical: "middle" }; // Center data text
      }
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Material_list_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportMtrlistToExcel;
