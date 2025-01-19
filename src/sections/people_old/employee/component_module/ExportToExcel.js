import React from "react";
import ExcelJS from "exceljs";
import { format } from "date-fns";

const ExportToExcel = ({ tableData }) => {
  if (tableData && tableData.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee List");

    // Customize header names and set individual column widths
    worksheet.columns = [
        { header: "Employee ID", key: "emp_mst_empl_id", width: 40 },
        { header: "Login ID", key: "emp_mst_login_id", width: 40, padding: 10 },
        { header: "User Group", key: "emp_mst_usr_grp", width: 40 },
        { header: "Name", key: "emp_mst_name", width: 40 },
        { header: "Title", key: "emp_mst_title", width: 40 },
        { header: "Status", key: "emp_mst_status", width: 40 },
        { header: "Contact No", key: "emp_mst_homephone", width: 60 },
        { header: "Emergency Name", key: "emp_mst_emg_name", width: 40 },
        { header: "Emergency Phone", key: "emp_mst_emg_phone", width: 140 },
        { header: "Date of Hire", key: "emp_mst_dateofhire", width: 60 },
        { header: "Sex", key: "emp_mst_sex", width: 60 },
        { header: "Date of Birth", key: "emp_mst_date_of_birth", width: 60 },
        { header: "Marital Status", key: "emp_mst_marital_status", width: 40 },
        { header: "Pay Rate", key: "emp_mst_payrate", width: 40 },
        { header: "Pay Period", key: "emp_mst_pay_period", width: 40 },
        { header: "Remarks", key: "emp_mst_remarks", width: 80 },
        { header: "Privilege Template", key: "emp_mst_privilege_template", width: 40 },
        { header: "Supervisor Name", key: "emp_supervisor_name", width: 40 },
        { header: "Created By", key: "emp_mst_create_by", width: 40 },
        { header: "Created Date", key: "emp_mst_create_date", width: 40 },
        { header: "Audit User", key: "audit_user", width: 40 },
        { header: "Audit Date", key: "audit_date", width: 40 },
        { header: "Column 1", key: "column1", width: 40 },
        { header: "Column 2", key: "column2", width: 40 },
        { header: "Column 3", key: "column3", width: 40 },
        { header: "Column 4", key: "column4", width: 40 },
        { header: "Column 5", key: "column5", width: 40 },
        { header: "MR Approver / Global Limit", key: "emp_det_mr_approver", width: 40 },
        { header: "Material Request Limit", key: "emp_det_mr_limit", width: 40 },
        { header: "WO Budget Approver / Limit", key: "emp_det_wo_budget_approver", width: 40 },
        { header: "WO Approval Limit", key: "emp_det_wo_approval_limit", width: 40 },
        { header: "PR Approver", key: "emp_det_pr_approver", width: 40 },
        { header: "PR Approval Limit", key: "emp_det_pr_approval_limit", width: 40 },
        { header: "WR Approver", key: "emp_det_wr_approver", width: 40 },
        { header: "Planner", key: "emp_det_planner", width: 40 },
        { header: "Request Parts && Services", key: "emp_det_wo_gen_mr_pr", width: 40 },
        { header: "PM Generator", key: "emp_det_pm_generator", width: 40 },
        { header: "Time Card Enter", key: "emp_det_time_card_enter", width: 40 },
        { header: "Time Card Void", key: "emp_det_time_card_void", width: 40 },
        { header: "Schedule Work Order", key: "emp_det_wo_sched", width: 40 },
        { header: "PO Buyer", key: "emp_det_po_buyer", width: 40 },
        { header: "Supervisor", key: "emp_det_supervisor", width: 40 },
        { header: "Technician", key: "emp_det_foreman", width: 40 },
        { header: "Asset Tag Posting", key: "emp_det_asset_tag_flag", width: 40 },
        { header: "Add/Delete Checklist", key: "emp_det_checklist", width: 40 },
        { header: "Email ID", key: "emp_det_email_id", width: 40 },
        { header: "Craft", key: "emp_det_craft", width: 40 },
        { header: "Work Area", key: "emp_det_work_area", width: 40 },
        { header: "Work Group", key: "emp_det_work_grp", width: 40 },
        { header: "Shift", key: "emp_det_shift", width: 40 },
        { header: "Supervisor ID", key: "emp_det_supervisor_id", width: 40 },
        { header: "Varchar 1", key: "emp_det_varchar1", width: 40 },
        { header: "Varchar 2", key: "emp_det_varchar2", width: 40 },
        { header: "Varchar 3", key: "emp_det_varchar3", width: 40 },
        { header: "Varchar 4", key: "emp_det_varchar4", width: 40 },
        { header: "Varchar 5", key: "emp_det_varchar5", width: 40 },
        { header: "Varchar 6", key: "emp_det_varchar6", width: 40 },
        { header: "Varchar 7", key: "emp_det_varchar7", width: 40 },
        { header: "Varchar 8", key: "emp_det_varchar8", width: 40 },
        { header: "Varchar 9", key: "emp_det_varchar9", width: 40 },
        { header: "Varchar 10", key: "emp_det_varchar10", width: 40 },
        { header: "Varchar 11", key: "emp_det_varchar11", width: 40 },
        { header: "Varchar 12", key: "emp_det_varchar12", width: 40 },
        { header: "Varchar 13", key: "emp_det_varchar13", width: 40 },
        { header: "Varchar 14", key: "emp_det_varchar14", width: 40 },
        { header: "Varchar 15", key: "emp_det_varchar15", width: 40 },
        { header: "Varchar 16", key: "emp_det_varchar16", width: 40 },
        { header: "Varchar 17", key: "emp_det_varchar17", width: 40 },
        { header: "Varchar 18", key: "emp_det_varchar18", width: 40 },
        { header: "Varchar 19", key: "emp_det_varchar19", width: 40 },
        { header: "Varchar 20", key: "emp_det_varchar20", width: 40 },
        { header: "Numeric 1", key: "emp_det_numeric1", width: 40 },
        { header: "Numeric 2", key: "emp_det_numeric2", width: 40 },
        { header: "Numeric 3", key: "emp_det_numeric3", width: 40 },
        { header: "Numeric 4", key: "emp_det_numeric4", width: 40 },
        { header: "Numeric 5", key: "emp_det_numeric5", width: 40 },
        { header: "Numeric 6", key: "emp_det_numeric6", width: 40 },
        { header: "Numeric 7", key: "emp_det_numeric7", width: 40 },
        { header: "Numeric 8", key: "emp_det_numeric8", width: 40 },
        { header: "Numeric 9", key: "emp_det_numeric9", width: 40 },
        { header: "Numeric 10", key: "emp_det_numeric10", width: 40 },
        { header: "Datetime 1", key: "emp_det_datetime1", width: 40 },
        { header: "Datetime 2", key: "emp_det_datetime2", width: 40 },
        { header: "Datetime 3", key: "emp_det_datetime3", width: 40 },
        { header: "Datetime 4", key: "emp_det_datetime4", width: 40 },
        { header: "Datetime 5", key: "emp_det_datetime5", width: 40 },
        { header: "Datetime 6", key: "emp_det_datetime6", width: 40 },
        { header: "Datetime 7", key: "emp_det_datetime7", width: 40} ,    
        { header: "Datetime 8", key: "emp_det_datetime8", width: 40 },
        { header: "Datetime 9", key: "emp_det_datetime9", width: 40 },
        { header: "Datetime 10", key: "emp_det_datetime10", width: 40 },
        { header: "Note 1", key: "emp_det_note1", width: 40 },
        { header: "Note 2", key: "emp_det_note2", width:40 }
      ];

    // Add data to the worksheet
    tableData.forEach((rowData) => {
      // Ensure date fields are properly formatted before adding to worksheet
      const formattedRow = {
        ...rowData,
        emp_det_datetime1: rowData?.emp_det_datetime1?.date ? format(new Date(rowData.emp_det_datetime1.date), "yyyy-MM-dd") : '',
        emp_det_datetime2: rowData?.emp_det_datetime2?.date ? format(new Date(rowData.emp_det_datetime2.date), "yyyy-MM-dd") : '',
        emp_det_datetime3: rowData?.emp_det_datetime3?.date ? format(new Date(rowData.emp_det_datetime3.date), "yyyy-MM-dd") : '',
        emp_det_datetime4: rowData?.emp_det_datetime4?.date ? format(new Date(rowData.emp_det_datetime4.date), "yyyy-MM-dd") : '',
        emp_det_datetime5: rowData?.emp_det_datetime5?.date ? format(new Date(rowData.emp_det_datetime5.date), "yyyy-MM-dd") : '',
        emp_det_datetime6: rowData?.emp_det_datetime6?.date ? format(new Date(rowData.emp_det_datetime6.date), "yyyy-MM-dd") : '',
        emp_det_datetime7: rowData?.emp_det_datetime7?.date ? format(new Date(rowData.emp_det_datetime7.date), "yyyy-MM-dd") : '',
        emp_det_datetime8: rowData?.emp_det_datetime8?.date ? format(new Date(rowData.emp_det_datetime8.date), "yyyy-MM-dd") : '',
        emp_det_datetime9: rowData?.emp_det_datetime9?.date ? format(new Date(rowData.emp_det_datetime9.date), "yyyy-MM-dd") : '',
        emp_det_datetime10: rowData?.emp_det_datetime10?.date ? format(new Date(rowData.emp_det_datetime10.date), "yyyy-MM-dd") : '',
        audit_date: rowData?.audit_date ? format(new Date(rowData.audit_date.date), "yyyy-MM-dd") : '',
        emp_mst_create_date: rowData?.emp_mst_create_date ? format(new Date(rowData.emp_mst_create_date.date), "yyyy-MM-dd") : '',
        emp_mst_dateofhire: rowData?.emp_mst_dateofhire ? format(new Date(rowData.emp_mst_dateofhire.date), "yyyy-MM-dd") : '',
        emp_mst_date_of_birth: rowData?.emp_mst_date_of_birth ? format(new Date(rowData.emp_mst_date_of_birth.date), "yyyy-MM-dd") : '',
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
      link.download = "Employee_list_Data.xlsx";
      link.click();
    });
  }
  return null; // Return null since there's no specific JSX to render
};

export default ExportToExcel;
