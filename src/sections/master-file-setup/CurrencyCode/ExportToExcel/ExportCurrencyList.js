import React from "react";
import ExcelJS from "exceljs";
import { format } from "date-fns";

const ExportUserGroupToExcel = ({ tableData }) => {
  if (tableData !== "" && tableData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("CurrencyCode List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Currency Code", key: "cur_mst_cur_code", width: 15 },
      { header: "Currency Description", key: "cur_mst_desc", width: 22 },
      { header: "Currency Label", key: "cur_mst_label", width: 15 },
      { header: "Base Currency", key: "cur_mst_base_cur", width: 15 },
      { header: "Exchange Rate", key: "cur_mst_exchange_rate", width: 15 },
      {
        header: "Exchange Rate Date",
        key: "cur_mst_exchange_rate_date",
        width: 15,
      },
      {
        header: "Format String",
        key: "cur_mst_format_string",
        width: 15,
      },
    ];

    // Add data to the worksheet
    tableData.forEach((rowData) => {
      const formattedRow = {
        ...rowData,
        cur_mst_exchange_rate_date: format(
          new Date(rowData.cur_mst_exchange_rate_date.date),
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
      link.download = "Currency_Code_list_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportUserGroupToExcel;
