import React from "react";
import ExcelJS from "exceljs";

const ExportInventoryMasterlistToExcel = ({ resultData }) => {
  if (resultData !== "" && resultData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventory Master List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Type", key: "col1", width: 15 },
      { header: "Stock No", key: "col2", width: 22 },
      { header: "Master Location", key: "col3", width: 15 },
      { header: "Cost Center", key: "col4", width: 15 },
      { header: "Account", key: "col5", width: 15 },
      { header: "Description", key: "col6", width: 60 },
      { header: "Issue Price", key: "col7", width: 15 },
      { header: "Total OH", key: "col8", width: 15 },
      { header: "Order Rule", key: "col9", width: 15},
      { header: "Part No", key: "col10", width: 15 },
      { header: "Commodity Code", key: "col11", width: 10 },
      { header: "Stock Group", key: "col12", width: 15 },
      { header: "Serialize Counter", key: "col13", width: 15 },
      { header: "Issue UOM", key: "col14", width: 18 },
      { header: "Receive UOM", key: "col15", width: 10 },
      { header: "Auto Spare", key: "col16", width: 10 },
      { header: "Critical Spare", key: "col17", width: 10 },
      { header: "ABC Class", key: "col18", width: 20 },
      { header: "Storage Type", key: "col19", width: 20 },
      { header: "Tax Code", key: "col20", width: 20 },
      { header: "Part Deac Status", key: "col21", width: 20 },
      { header: "Order Point", key: "col22", width: 20 },
      { header: "Maximum", key: "col23", width: 20 },
      { header: "YTD Usage", key: "col24", width: 20 },
      { header: "Standard Cost", key: "col25", width: 20 },
      { header: "Average Cost", key: "col26", width: 20 },
      { header: "Last Cost", key: "col27", width: 20 },
      { header: "Total Hard Reserve", key: "col28", width: 20 },
      { header: "Total Short", key: "col29", width: 20 },
      { header: "PO Outstanding", key: "col30", width: 20 },
      { header: "PR Outstanding", key: "col31", width: 20 },
      { header: "Total Repair", key: "col32", width: 20 },
      { header: "Asset NO", key: "col33", width: 20 },
      { header: "Weight", key: "col34", width: 20 },
      { header: "UDF Text3", key: "col35", width: 20 },
      { header: "UDF Text4", key: "col36", width: 20 },
      { header: "UDF Text5", key: "col37", width: 20 },
      { header: "UDF Text6", key: "col38", width: 20 },
      { header: "UDF Text7", key: "col39", width: 20 },
      { header: "UDF Text8", key: "col40", width: 20 },
      { header: "Manufacturer", key: "col41", width: 20 },
      { header: "Mode In", key: "col42", width: 20 },
      { header: "Billable Cost", key: "col43", width: 20 },
      { header: "UDF Numeric2", key: "col44", width: 20 },
      { header: "UDF Numeric3", key: "col45", width: 20 },
      { header: "UDF Numeric4", key: "col46", width: 20 },
      { header: "UDF Numeric5", key: "col47", width: 20 },
      { header: "UDF Date1", key: "col48", width: 20 },
      { header: "UDF Date2", key: "col49", width: 20 },
      { header: "UDF Date3", key: "col50", width: 20 },
      { header: "UDF Date4", key: "col51", width: 20 },
      { header: "UDF Date5", key: "col52", width: 20 },
      { header: "Created By", key: "col53", width: 20 },
      { header: "Created Date", key: "col54", width: 20 },
    ];

    // Add data to the worksheet
    resultData.forEach((rowData) => {
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
      link.download = "InventoryMaster_list_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportInventoryMasterlistToExcel;
