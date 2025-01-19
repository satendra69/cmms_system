import React from "react";
import ExcelJS from "exceljs";

const ExportUserGroupToExcel = ({ tableData }) => {
  if (tableData !== "" && tableData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asset Group Code");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Group Code", key: "ast_grp_grp_cd", width: 15 },
      { header: "Description", key: "ast_grp_desc", width: 40 },
      { header: "Auto Number", key: "ast_grp_option", width: 15 },
      { header: "Generate Serialize Stock", key: "ast_grp_serial", width: 15 },
      { header: "Disable", key: "ast_grp_disable_flag", width: 15 },
      { header: "Seprator", key: "ast_grp_separator", width: 15 },
      { header: "Counter", key: "ast_grp_counter", width: 15 },
      { header: "Sample Format", key: "Sample_Format", width: 15 },
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
      link.download = "Asset_Group_Code_list_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportUserGroupToExcel;
