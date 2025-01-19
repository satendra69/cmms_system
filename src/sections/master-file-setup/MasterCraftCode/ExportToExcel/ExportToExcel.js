import React from "react";
import ExcelJS from "exceljs";
import { format } from "date-fns";

const ExportToExcel = ({ tableData }) => {
  if (tableData !== "" && tableData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("CraftCode List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Craft Code", key: "crf_mst_crf_cd", width: 15 },
      { header: "Description", key: "crf_mst_desc", width: 22 },
      { header: "Estimate Rate", key: "crf_mst_crf_est_rate", width: 15 },
      { header: "Change Date", key: "crf_mst_change_date", width: 15 },
      { header: "Disable Flag", key: "crf_mst_disable_flag", width: 15 },
    ];

    // Add data to the worksheet
    tableData.forEach((rowData) => {
      // Ensure date fields are properly formatted before adding to worksheet
      const formattedRow = {
        ...rowData,
        crf_mst_change_date: format(
          new Date(rowData.crf_mst_change_date.date),
          "yyyy-MM-dd"
        ),
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
      link.download = "Craft_Code_list_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportToExcel;
