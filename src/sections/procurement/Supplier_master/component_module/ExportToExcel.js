import React from "react";
import ExcelJS from "exceljs";
import { format } from "date-fns";

const ExportToExcel = ({ tableData }) => {
  if (tableData && tableData.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Supplier Master");

    // Customize header names and set individual column widths
    worksheet.columns = [
      { header: "Supplier Code", key: "sup_mst_supplier_cd", width: 20 },
      { header: "Status", key: "sup_mst_status", width: 10 },
      { header: "Description", key: "sup_mst_desc", width: 80 },
      { header: "Rating", key: "sup_mst_rating", width: 20 },
      { header: "Currency Code", key: "sup_mst_fid", width: 20 },
      { header: "Company Registration No", key: "wkr_mst_work_area", width: 30 },
      { header: "GST Registration No", key: "sup_mst_tid", width: 25 },
      { header: "GST Tax Code", key: "sup_mst_tax_id", width: 15 },
      { header: "GST Effective Date", key: "sup_mst_gst_effective_date", width: 30 },
      { header: "GST Expire Date", key: "sup_mst_gst_expire_date", width: 30 },
      { header: "Insurance Expire Date", key: "sup_mst_ins_exp", width: 30 },
      { header: "Last PO Date", key: "sup_mst_lp_date", width: 15 },
      { header: "Buyer", key: "sup_mst_buyer", width: 15 },
      { header: "Terms", key: "sup_mst_terms", width: 18 },
      { header: "Freight on Board", key: "sup_mst_fob", width: 20 },
      { header: "Ship Via", key: "sup_mst_shipvia", width: 20 },
      { header: "Phone", key: "wkr_mst_phone", width: 20 },
      { header: "Account No", key: "sup_mst_acct_no", width: 20 },
      { header: "Small Business", key: "sup_mst_smallbu", width: 20 },
      { header: "On Bid List", key: "sup_mst_on_bid_lst", width: 20 },
      { header: "Insurance", key: "sup_mst_insurance", width: 20 },
      { header: "HUB Business", key: "sup_mst_hub", width: 20 },
      { header: "ISO 9000", key: "sup_mst_iso", width: 20 },
      { header: "Blanket PO", key: "sup_mst_blanketpo", width: 20 },
      { header: "Services", key: "sup_mst_services", width: 20 },
      { header: "Created By", key: "sup_mst_create_by", width: 20 },
      { header: "Created Date", key: "sup_mst_create_date", width: 20 },
   
      // Add more columns as needed
    ];

    // Add data to the worksheet
    tableData.forEach((rowData) => {
      // Ensure date fields are properly formatted before adding to worksheet
      const formattedRow = {
        ...rowData,
        sup_mst_gst_expire_date: rowData?.sup_mst_gst_expire_date?.date ? format(new Date(rowData.sup_mst_gst_expire_date.date), "yyyy-MM-dd") : '',
        sup_mst_ins_exp: rowData?.sup_mst_ins_exp?.date ? format(new Date(rowData.sup_mst_ins_exp.date), "yyyy-MM-dd") : '',
        sup_mst_lp_date: rowData?.sup_mst_lp_date?.date ? format(new Date(rowData.sup_mst_lp_date.date), "yyyy-MM-dd") : '',
        sup_mst_create_date: rowData?.sup_mst_create_date?.date ? format(new Date(rowData.sup_mst_create_date.date), "yyyy-MM-dd") : '',
        sup_mst_gst_effective_date: rowData?.sup_mst_gst_effective_date?.date ? format(new Date(rowData.sup_mst_gst_effective_date.date), "yyyy-MM-dd") : '',
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
      link.download = "Supplier_Master_List_Data.xlsx";
      link.click();
    });
  }
  return null; // Return null since there's no specific JSX to render
};

export default ExportToExcel;
