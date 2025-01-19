import React from "react";
import ExcelJS from "exceljs";

const ExportWorkReqlistToExcel = ({ resultData }) => {
  //  console.log("resultData___excel",resultData);
  if (resultData !== "" && resultData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Word Order");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Work Request No", key: "wkr_mst_wr_no", width: 20 },
      { header: "Description", key: "wkr_mst_wr_descs", width: 50 },
      { header: "Approval Status", key: "wkr_mst_wr_status", width: 15 },
      { header: "Asset No", key: "wkr_mst_assetno", width: 15 },
      { header: "Charge Cost Center", key: "wkr_mst_chg_costcenter", width: 15 },
      { header: "Work Area", key: "wkr_mst_work_area", width: 20 },
      { header: "Asset Location", key: "wkr_mst_assetlocn", width: 20 },
      { header: "Level", key: "wkr_mst_location", width: 15 },
      { header: "Temporary Asset", key: "wkr_mst_temp_asset", width: 20 },
      { header: "Email Notification", key: "wkr_mst_email_notification", width: 20 },
      { header: "Work Type", key: "wkr_mst_work_type", width: 15 },
      { header: "Work Class", key: "wkr_mst_work_class", width: 15 },
      { header: "Work Group", key: "wkr_mst_work_group", width: 15 },
      { header: "WR Status", key: "wkr_mst_wo_status", width: 18 },
      { header: "Project ID", key: "wkr_mst_projectid", width: 20 },
      { header: "Requestor", key: "wkr_mst_originator", width: 20 },
      { header: "Phone", key: "wkr_mst_phone", width: 20 },
      { header: "Work Order No", key: "wkr_det_wo", width: 20 },
      { header: "Approved By", key: "wkr_det_approver", width: 20 },
      { header: "Approved Date", key: "wkr_det_appr_date", width: 20 },
      { header: "Rejected Description", key: "wkr_det_reject_desc", width: 20 },
      { header: "Rejected By", key: "wkr_det_reject_by", width: 20 },
      { header: "Rejected Date", key: "wkr_det_reject_date", width: 20 },
      { header: "Original Priority", key: "wkr_mst_orig_priority", width: 20 },
      { header: "Origination Date", key: "wkr_mst_org_date", width: 20 },
      { header: "Due Date", key: "wkr_mst_due_date", width: 20 },
      { header: "Fault Code", key: "wkr_mst_fault_code", width: 20 },
      { header: "Created By", key: "wkr_mst_create_by", width: 20 },
      { header: "Create Date", key: "wkr_mst_create_date", width: 20 },
    

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
      link.download = "WorkRequestReport.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportWorkReqlistToExcel;
