import PropTypes from "prop-types";
import { useState, useEffect } from "react";
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

import AccountingPeriodDialog from "./AccountingPeriodDialog";
import { format } from "date-fns";
import Swal from "sweetalert2";

import { IoDuplicateOutline } from "react-icons/io5";
import AccountingPeriodDuplicateDailog from "./AccountingPeriodDuplicateDailog";

// ----------------------------------------------------------------------

export default function AccountingPeriodRows({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onDuplicateRow,
  onPrintQrCode,
  setRetch,
  tableData,
}) {
  const { prod_year, p1beg, end_of_year } = row;
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const [dialog, setDialog] = useState(false);
  const [dialogNew, setDialogNew] = useState(false);
  const confirm = useBoolean();
  const site_ID = localStorage.getItem("site_ID");

  const popover = usePopover();

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

  const handleClick = (e, result) => {
    if (result !== "backdropClick") {
      setDialog(!dialog);
    }
  };
  const handleClickDuplicate = () => {
    setDialogNew(!dialogNew);
  };

  const handleDelete = async () => {
    popover.onClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await httpCommon.post(
            "/delete_master_accounting_pereiod.php",
            {
              site_ID,
              prod_year: row.prod_year,
              RowID: row.RowID,
            }
          );

          if (response.data.status === "SUCCESS") {
            Swal.fire({
              title: "Sucess",
              text: "Record Deleted Successfully ",
              icon: "success",
              timer: 2000,
            }).then(() => setRetch(true));

            popover.onClose();
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    });
  };

  return (
    <>
      {dialog && (
        <AccountingPeriodDialog
          open={dialog}
          handleClose={handleClick}
          rowData={row}
          setRetch={setRetch}
        />
      )}
      {dialogNew && (
        <AccountingPeriodDuplicateDailog
          tableData={tableData}
          open={dialogNew}
          rowData={row}
          handleClose={handleClickDuplicate}
          setRefetch={setRetch}
        />
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
        <TableCell sx={{ height: "50px" }}>{prod_year}</TableCell>
        <TableCell>
          {p1beg && p1beg.date && format(new Date(p1beg.date), "yyyy-MM-dd")}
        </TableCell>
        <TableCell>
          {end_of_year &&
            end_of_year.date &&
            format(new Date(end_of_year.date), "yyyy-MM-dd")}
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleClickDuplicate();
            popover.onClose();
          }}
          disabled={!UserPermission.every((item) => item.edit_flag === "1")}
        >
          <IoDuplicateOutline size={25} />
          Duplicate
        </MenuItem>
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

        <MenuItem
          onClick={() => {
            handleDelete();
          }}
          sx={{ color: "error.main" }}
          disabled={!UserPermission.every((item) => item.edit_flag === "1")}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}

AccountingPeriodRows.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDuplicateRow: PropTypes.func,
  onPrintQrCode: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  setRetch: PropTypes.func,
};
