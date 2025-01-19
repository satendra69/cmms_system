import React from "react";
import ExcelJS from "exceljs";

const ExportWorkOrderlistToExcel = ({ resultData }) => {
  if (resultData !== "" && resultData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Word Order");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Work Order No", key: "col2", width: 15 },
      { header: "Asset No", key: "col3", width: 15 },
      { header: "Parent Wo", key: "col4", width: 15 },
      { header: "PM Group", key: "col5", width: 15 },
      { header: "Status", key: "col6", width: 15 },
      { header: "Description", key: "col7", width: 35 },
      { header: "Charge Cost Center", key: "col8", width: 20 },
      { header: "Origination Date", key: "col9", width: 20 },
      { header: "Due Date", key: "col10", width: 20 },
      { header: "Completion Date", key: "col11", width: 20 },
      { header: "Close Date", key: "col12", width: 20 },
      { header: "Assign To", key: "col13", width: 15 },
      { header: "Planner", key: "col14", width: 15 },
      { header: "Fault Code", key: "col15", width: 18 },
      { header: "Cause Code", key: "col16", width: 20 },
      { header: "Action Code", key: "col17", width: 20 },
      { header: "Corrective Action", key: "col18", width: 20 },
      { header: "Originator", key: "col19", width: 20 },
      { header: "Phone", key: "col20", width: 20 },
      { header: "Project Id", key: "col21", width: 20 },
      { header: "Zone", key: "col22", width: 20 },
      { header: "Asset Location", key: "col23", width: 20 },
      { header: "Asset Level", key: "col24", width: 20 },
      { header: "Asset Group Code", key: "col25", width: 20 },
      { header: "Original Priority", key: "col26", width: 20 },
      { header: "Plan Priority", key: "col27", width: 20 },
      { header: "Temporary Asset", key: "col28", width: 20 },
      { header: "Work Request No", key: "col29", width: 20 },
      { header: "Area", key: "col30", width: 20 },
      { header: "Wr Origination Date", key: "col31", width: 20 },
      { header: "Wr Due Date", key: "col32", width: 20 },
      { header: "Work Type", key: "col33", width: 20 },
      { header: "Work Class", key: "col34", width: 20 },
      { header: "Labor Type", key: "col35", width: 20 },
      { header: "Status Change Date", key: "col36", width: 20 },
      { header: "Schedule Date", key: "col37", width: 20 },
      { header: "Exception Date", key: "col38", width: 20 },
      { header: "Contract No", key: "col39", width: 20 },
      { header: "Wo Category", key: "col40", width: 20 },
      { header: "Customer Code", key: "col41", width: 20 },
      { header: "Supervisor Id", key: "col42", width: 20 },
      { header: "Estimated Contract Cost", key: "col43", width: 20 },
      { header: "Contract Cost", key: "col44", width: 20 },
      { header: "Estimated Material Cost", key: "col45", width: 20 },
      { header: "Material Cost", key: "col46", width: 20 },
      { header: "Estimated Labor Cost", key: "col47", width: 20 },
      { header: "Labor Cost", key: "col48", width: 20 },
      { header: "Eservice No", key: "col49", width: 20 },
      { header: "Export File Directory", key: "col50", width: 20 },
      { header: "Response To Request", key: "col51", width: 20 },
      { header: "Job Id/service No", key: "col52", width: 20 },
      { header: "Wko Det~r~nvarchar5", key: "col53", width: 20 },
      { header: "SERVICE SATISFACTION", key: "col54", width: 20 },
      { header: "Work Location (Udf 7)", key: "col55", width: 20 },
      { header: "Area", key: "col56", width: 20 },
      { header: "Quality Of Service", key: "col57", width: 20 },
      { header: "Eps Purchaser", key: "col58", width: 20 },
      { header: "Labor Cost", key: "col59", width: 20 },
      { header: "Invoice Amt", key: "col60", width: 20 },
      { header: "Total Markup Cost", key: "col61", width: 20 },
      { header: "Down Time (Hour)", key: "col62", width: 20 },
      { header: "Wko Det~r~nnumeric5", key: "col63", width: 20 },
      { header: "Exported Date", key: "col64", width: 20 },
      { header: "Wko Det Datetime2", key: "col65", width: 20 },
      { header: "Acknowledge Date", key: "col66", width: 20 },
      { header: "Wko Det~r~ndatetime4", key: "col67", width: 20 },
      { header: "Wko Det~r~ndatetime5", key: "col68", width: 20 },
      { header: "Created By", key: "col69", width: 20 },
      { header: "Created Date", key: "col70", width: 20 },

      // Add more columns as needed
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
      link.download = "ReportForwordOrder2023.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportWorkOrderlistToExcel;
