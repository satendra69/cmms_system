import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useRef } from "react";
// @mui

import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";

import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
// utils

// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components

import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import httpCommon from "src/http-common";
import { Checkbox } from "@mui/material";
import UserGroupDialog from "./AutoNoDialog";
import { MdOutlineRateReview } from "react-icons/md";
import AssetNoDialog from "./AutoNoDialog";
import AutoAddAdialog from "./AutoAddAdialog";

// ----------------------------------------------------------------------

export default function GroupTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onDuplicateRow,
  onPrintQrCode,
  setReFetch,
}) {
  const {
    cf_module_desc,
    cnt_mst_desc,
    cnt_mst_module_cd,
    cnt_mst_numbering,
    cnt_mst_prefix,
    cnt_mst_counter,
  } = row;
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const [dialog, setDialog] = useState(false);
  const [dialogNew, setDialogNew] = useState(false);
  const confirm = useBoolean();

  const popover = usePopover();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const [UserPermission, setUserPermission] = useState([]);
  // get User Permission
  const getUserPermission = async () => {
    try {
      const response = await httpCommon.get(
        `/getAssetUserPermission.php?login_id=${AuditUser}`
      );
      if (response.data.status == "SUCCESS") {
        setUserPermission(response.data.data.UserPermission);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getUserPermission();
  }, []);

  const handleClick = (e, r) => {
    if (r !== "backdropClick") setDialog(!dialog);
  };
  const handleClickNew = (e, r) => {
    if (r !== "backdropClick") setDialogNew(!dialogNew);
  };
  return (
    <>
      {dialog && (
        <AssetNoDialog
          open={dialog}
          handleClose={handleClick}
          rowData={row}
          setReFetch={setReFetch}
        />
      )}
      {dialogNew && (
        <AutoAddAdialog open={dialogNew} handleClose={handleClickNew} />
      )}
      <TableRow hover selected={selected} sx={{ paddingLeft: "20px" }}>
        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell sx={{ height: "50px" }}>
          {cnt_mst_module_cd == "AST" && "Asset"}
          {cnt_mst_module_cd == "WKR" && "Work Request "}
          {cnt_mst_module_cd == "WKO" && "Corrective Work Order"}
          {cnt_mst_module_cd == "CON" && "Contract"}
          {cnt_mst_module_cd == "TM" && "Time Card"}
          {cnt_mst_module_cd == "INV" && "Customer Invoice"}
          {cnt_mst_module_cd == "SIV" && "Supplier Invoice"}
          {cnt_mst_module_cd == "PM" && "Preventive"}
          {cnt_mst_module_cd == "WKP" && "Preventive Work Order"}
          {cnt_mst_module_cd == "WKD" && "Demand Task Work Order"}
          {cnt_mst_module_cd == "PR" && "Purchase Request"}
          {cnt_mst_module_cd == "PO" && "Purchase Order"}
          {cnt_mst_module_cd == "ITM" && "Stock No"}
          {cnt_mst_module_cd == "MTR" && "Material Request"}
          {cnt_mst_module_cd == "QOT" && "Quotation"}
          {cnt_mst_module_cd == "SOP" && "Sales Order"}
          {cnt_mst_module_cd == "CRR" && "Contract Release Request"}
          {cnt_mst_module_cd == "DTS" && "Demand Task"}
          {cnt_mst_module_cd == "SUP" && "Supplier Master"}
          {cnt_mst_module_cd == "LOG" && "Shift Logbook"}
          {cnt_mst_module_cd == "TRN" && "TRN"}
        </TableCell>
        <TableCell>{cnt_mst_desc}</TableCell>
        <TableCell>{cnt_mst_numbering == "A" ? "Auto" : "Manual"}</TableCell>
        <TableCell>{cnt_mst_prefix}</TableCell>
        <TableCell>{cnt_mst_counter}</TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            setDialog(!dialog);
            popover.onClose();
          }}
          disabled={!UserPermission.every((item) => item.edit_flag === "1")}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error">
            Delete
          </Button>
        }
      />
    </>
  );
}

GroupTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDuplicateRow: PropTypes.func,
  onPrintQrCode: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
