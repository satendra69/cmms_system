import React from "react";
import ExcelJS from "exceljs";

const ExportAssetlistToExcel = ({ resultData }) => {
  if (resultData !== "" && resultData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asset List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Asset No", key: "col1", width: 15 },
      { header: "Asset Group Code", key: "col2", width: 22 },
      { header: "Asset Type", key: "col3", width: 15 },
      { header: "Asset Code", key: "col4", width: 15 },
      { header: "Status", key: "col5", width: 15 },
      { header: "Critical Factor", key: "col6", width: 15 },
      { header: "Cost Center", key: "col7", width: 15 },
      { header: "Work Group", key: "col8", width: 15 },
      { header: "Short Description", key: "col9", width: 60 },
      { header: "Long Description", key: "col10", width: 60 },
      { header: "Block", key: "col11", width: 10 },
      { header: "Asset Location", key: "col12", width: 15 },
      { header: "Level", key: "col13", width: 15 },
      { header: "Barcode No", key: "col14", width: 18 },
      { header: "Parent Flag", key: "col15", width: 10 },
      { header: "Parent ID", key: "col16", width: 10 },
      { header: "Barcode Print Count", key: "col17", width: 10 },
      { header: "Safety Requirement", key: "col18", width: 20 },
      { header: "Asset Cost", key: "col19", width: 20 },
      { header: "MTD Labor Cost", key: "col20", width: 20 },
      { header: "MTD Material Cost", key: "col21", width: 20 },
      { header: "MTD Contract Cost", key: "col22", width: 20 },
      { header: "YTD Labor Cost", key: "col23", width: 20 },
      { header: "YTD Material Cost", key: "col24", width: 20 },
      { header: "YTD Contract Cost", key: "col25", width: 20 },
      { header: "LTD Labor Cost", key: "col26", width: 20 },
      { header: "LTD Material Cost", key: "col27", width: 20 },
      { header: "LTD Contract Cost", key: "col28", width: 20 },
      { header: "Residual Value", key: "col29", width: 20 },
      { header: "Warranty Date", key: "col30", width: 20 },
      { header: "Expected Life (Year)", key: "col31", width: 20 },
      { header: "Labor Account", key: "col32", width: 20 },
      { header: "Material Account", key: "col33", width: 20 },
      { header: "Contract Account", key: "col34", width: 20 },
      { header: "Equipment Desc Code", key: "col35", width: 20 },
      { header: "Serial Number", key: "col36", width: 20 },
      { header: "Brand", key: "col37", width: 20 },
      { header: "Model", key: "col38", width: 20 },
      { header: "Capacity", key: "col39", width: 20 },
      { header: "Year Installed", key: "col40", width: 20 },
      { header: "Support to Tenant", key: "col41", width: 20 },
      { header: "Remarks", key: "col42", width: 20 },
      { header: "Dept", key: "col43", width: 20 },
      { header: "UDF Text 9", key: "col44", width: 20 },
      { header: "UDF Text 10", key: "col45", width: 20 },
      { header: "UDF Numeric 1", key: "col46", width: 20 },
      { header: "UDF Numeric 2", key: "col47", width: 20 },
      { header: "UDF Numeric 3", key: "col48", width: 20 },
      { header: "UDF Numeric 4", key: "col49", width: 20 },
      { header: "UDF Numeric 5", key: "col50", width: 20 },
      { header: "UDF Date1", key: "col51", width: 20 },
      { header: "UDF Date2", key: "col52", width: 20 },
      { header: "UDF Date3", key: "col53", width: 20 },
      { header: "UDF Date4", key: "col54", width: 20 },
      { header: "UDF Date5", key: "col55", width: 20 },
      { header: "UDF Note1", key: "col56", width: 20 },
      { header: "UDF Note2", key: "col57", width: 20 },
      { header: "Created By", key: "col58", width: 20 },
      { header: "Created Date", key: "col59", width: 20 },
      { header: "Assigned To", key: "col60", width: 20 },
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
      link.download = "Asset_list_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportAssetlistToExcel;
