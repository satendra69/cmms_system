import React from "react";
import ExcelJS from "exceljs";
import { format } from "date-fns";

const ExportUsersToExcel = ({ tableData }) => {
  if (tableData !== "" && tableData !== undefined) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users List");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "User ID", key: "empl_id", width: 20 },
      { header: "Name", key: "name", width: 20 },
      { header: "System Adminstrator", key: "sys_admin", width: 30 },
      { header: "Account Locked", key: "cf_user_locked", width: 30 },
      { header: "Disable Auto Logout", key: "cf_user_disable_auto_logout", width: 30 },
      { header: "Failed Login Attemp", key: "cf_user_disable_auto_logout", width: 30 },
      { header: "Last Login", key: "last_login", width: 30 },
      { header: "Last Password Changed", key: "last_pwd_changed", width: 30 },
      { header: "Expired Date", key: "expired_date", width: 30 },
      { header: "Default Site", key: "default_site", width: 30 },
      { header: "Default Language", key: "default_language", width: 30 },
    ];

    // Add data to the worksheet
    tableData.forEach((rowData) => {
      const formattedRow = {
        ...rowData,
        last_login:rowData.last_login && rowData.last_login.date ?format(new Date(rowData.last_login.date), "yyyy-MM-dd"):"",
        last_pwd_changed: rowData.last_pwd_changed && rowData.last_pwd_changed.date ? format(new Date(rowData.last_pwd_changed.date), "yyyy-MM-dd"):"",
        expired_date:rowData.expired_date && rowData.expired_date.date ? format(new Date(rowData.expired_date.date), "yyyy-MM-dd"):"",
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
      link.download = "Users_list_Data.xlsx";
      link.click();
    });
  }
  return <div>{/* Your export component JSX */}</div>;
};

export default ExportUsersToExcel;
