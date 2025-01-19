import React from "react";
import ExcelJS from "exceljs";

const ExportAssetlistToExcel = ({ resultData }) => {
  if (resultData !== "" && resultData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Asset List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "PM No", key: "prm_mst_pm_no", width: 15 },
      { header: "PM Type", key: "prm_mst_type", width: 15 },
      { header: "PM Group", key: "prm_mst_pm_grp", width: 15 },
      { header: "Asset No", key: "prm_mst_assetno", width: 15 },
      { header: "Frequency Code", key: "prm_mst_freq_code", width: 20 },
      { header: "LPM Date", key: "prm_mst_lpm_date", width: 20 },
      { header: "LPM Closed Date", key: "prm_mst_lpm_closed_date", width: 20 },
      { header: "Next Create Date", key: "prm_mst_next_create", width: 20 },
      { header: "Next Due", key: "prm_mst_next_due", width: 20 },
      { header: "Lead Day", key: "prm_mst_lead_day", width: 15 },
      { header: "Closed Loop?", key: "prm_mst_closed_loop", width: 15 },
      { header: "PM Schedule Date?", key: "prm_mst_cal_startdate", width: 22 },
      { header: "Disable Flag", key: "prm_mst_disable_flag", width: 15 },
      { header: "Current Work Order", key: "prm_mst_curr_wo", width: 22 },
      { header: "Fault Code", key: "prm_mst_flt_code", width: 15 },
      { header: "Description", key: "prm_mst_desc", width: 20 },
      { header: "Meter ID", key: "prm_mst_meter_id", width: 15 },
      { header: "LPM Usage", key: "prm_mst_lpm_usg", width: 15 },
      { header: "LPM UOM", key: "prm_mst_lpm_uom", width: 15 },
      { header: "Asset/PM Group Description", key: "ast_grp_descs", width: 25 },
      { header: "Shadow Group", key: "prm_mst_shadow_grp", width: 20 },
      { header: "Default WO Status", key: "prm_mst_dflt_status", width: 20 },
      { header: "Plan Priority", key: "prm_mst_plan_priority", width: 20 },
      { header: "Charge Cost Center", key: "prm_det_chg_costcenter", width: 20 },
      { header: "Asset Location", key: "prm_mst_assetlocn", width: 20 },
      { header: "Originator", key: "prm_det_originator", width: 15 },
      { header: "Approver", key: "prm_det_approver", width: 15 },
      { header: "Planner", key: "prm_det_planner", width: 15 },
      { header: "Credit Cost Center", key: "prm_det_crd_costcenter", width: 20 },
      { header: "Labor Account", key: "prm_det_l_account", width: 20 },
      { header: "Material Account", key: "prm_det_m_account", width: 20 },
      { header: "Contract Account", key: "prm_det_c_account", width: 20 },
      { header: "Project ID", key: "prm_det_project_id", width: 15 },
      { header: "Safety", key: "prm_det_safety", width: 15 },
      { header: "Varchar20", key: "prm_det_varchar20", width: 15 },
      { header: "Cause Code", key: "prm_det_cause_code", width: 15 },
      { header: "Action Code", key: "prm_det_act_code", width: 15 },
      { header: "Work Area", key: "prm_det_work_area", width: 15 },
      { header: "Work Location", key: "prm_det_work_locn", width: 15 },
      { header: "Work Group", key: "prm_det_work_grp", width: 14 },
      { header: "Work Type", key: "prm_det_work_type", width: 15 },
      { header: "Work Class", key: "prm_det_work_class", width: 15 },
      { header: "Created By", key: "prm_mst_create_by", width: 15 },
      { header: "Created date", key: "prm_mst_create_date", width: 15 },
      
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
      link.download = "Preventive_Maintenance_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportAssetlistToExcel;
