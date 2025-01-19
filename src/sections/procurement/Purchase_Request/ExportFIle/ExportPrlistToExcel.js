import React from "react";
import ExcelJS from "exceljs";
import { format } from "date-fns";

const ExportPrlistToExcel = ({ tableData:resultData }) => {
 
  if (resultData !== "" && resultData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Material List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "PR No", key: "col1", width: 25 },
      { header: "Status", key: "col2", width: 25 },
      { header: "Request Date", key: "col3", width: 25 },
      { header: "Required Date", key: "col4", width: 25 },
      { header: "Requested By", key: "col5", width: 25 },
      { header: "Requester Name", key: "col6", width: 25 },
      { header: "Charge Cost Center", key: "col7", width: 25 },
      { header: "Charge Cost Account", key: "col8", width: 25 },

      { header: "Order Point", key: "col9", width: 25 },
      { header: "Release For Approval", key: "col10", width: 25 },
      { header: "Email Requested By", key: "col11", width: 25 },
      { header: "Approval Status", key: "col12", width: 25 },

      { header: "Sub Total", key: "col13", width: 25 },
      { header: "Tax", key: "col14", width: 25 },
      { header: "Total Cost", key: "col15", width: 25 },
      { header: "Approval Status", key: "col16", width: 25 },
      { header: "Converted To PO Status", key: "col17", width: 25 },
      { header: "Entered By", key: "col18", width: 25 },
      { header: "Credit Cost Center", key: "col19", width: 25 },
      { header: "Credit Account", key: "col20", width: 25 },
      { header: "Department", key: "col21", width: 25 },
      { header: "Notes", key: "col22", width: 25 },
      { header: "Project ID", key: "col23", width: 25 },
      { header: "Buyer", key: "col24", width: 25 },
      { header: "Created By", key: "col25", width: 25 },
      { header: "Created Date", key: "col26", width: 25 },
    ];

    // Add data to the worksheet
    resultData.forEach((rowData) => {

      const formattedRow = {
        ...rowData,
        col3:rowData.col3? format(new Date(rowData.col3.date), "yyyy-MM-dd"):"",
        col4:rowData.col4? format(new Date(rowData.col4.date), "yyyy-MM-dd"):"",
        col26:rowData.col26? format(new Date(rowData.col26.date), "yyyy-MM-dd"):"",
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

export default ExportPrlistToExcel;
