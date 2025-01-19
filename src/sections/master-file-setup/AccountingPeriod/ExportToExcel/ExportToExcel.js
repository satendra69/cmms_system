import React from "react";
import ExcelJS from "exceljs";
import { format } from "date-fns";

const ExportToExcel = ({ tableData }) => {
  if (tableData && tableData.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("AccountingPeriod List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Budget Year", key: "prod_year", width: 15 },
      { header: "Begin Date", key: "p1beg", width: 22 },
      { header: "End Date", key: "end_of_year", width: 15 },
    ];

    // Add data to the worksheet
    tableData.forEach((rowData) => {
      // Ensure date fields are properly formatted before adding to worksheet
      const formattedRow = {
        ...rowData,
        p1beg: format(new Date(rowData.p1beg.date), "yyyy-MM-dd"),
        end_of_year: format(new Date(rowData.end_of_year.date), "yyyy-MM-dd"),
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
      link.download = "Accounting_Period_list_Data.xlsx";
      link.click();
    });
  }
  return null; // Return null since there's no specific JSX to render
};

export default ExportToExcel;
