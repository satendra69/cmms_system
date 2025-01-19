import React from "react";
import ExcelJS from "exceljs";

const ExportUserGroupToExcel = ({ tableData }) => {
  if (tableData !== "" && tableData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asset Location");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Asset Location", key: "ast_loc_ast_loc", width: 15 },
      { header: "Description", key: "ast_loc_desc", width: 40 },
      { header: "WR Option", key: "ast_loc_wr_option", width: 15 },
      { header: "WR Prefix", key: "ast_loc_wr_prefix", width: 15 },
      { header: "WR Counter", key: "ast_loc_wr_counter", width: 15 },
      { header: "WO Option", key: "ast_loc_wo_option", width: 15 },
      { header: "WO Prefix", key: "ast_loc_wo_prefix", width: 15 },
      { header: "WO Counter", key: "ast_loc_wo_counter", width: 15 },
      { header: "PM WO Option", key: "ast_loc_pm_option", width: 15 },
      { header: "PM WO Prefix", key: "ast_loc_pm_prefix", width: 15 },
      { header: "PM WO Counter", key: "ast_loc_pm_counter", width: 15 },
      { header: "Disabled", key: "ast_loc_disable_flag", width: 15 },
    ];

    // Add data to the worksheet
    tableData.forEach((rowData) => {
      worksheet.addRow(rowData);
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
      link.download = "Asset_Location_List.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportUserGroupToExcel;
