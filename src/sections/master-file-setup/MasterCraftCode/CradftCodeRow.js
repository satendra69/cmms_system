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
import { Checkbox } from "@mui/material";

import AssetNoDialog from "./CraftCodeDialog";
import Swal from "sweetalert2";
import AddNewCraftCode from "./AddNewCraftCode";
import moment from "moment";
import { format } from "date-fns";

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
  setRefetch,
}) {
  const {
    crf_mst_crf_cd,
    crf_mst_desc,
    crf_mst_crf_est_rate,
    crf_mst_change_date,
    crf_mst_disable_flag,
  } = row;
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const [dialog, setDialog] = useState(false);
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
  const [dialogNew, setDialogNew] = useState(false);
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

  const handleClick = (event, result) => {
    if (result !== "backdropClick") {
      setDialog(false);
      setDialogNew(false);
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await httpCommon.post(
            "/delete_new_master_craft_code.php",
            {
              site_cd: row.site_cd,
              row_id: row.RowID,
            }
          );

          if (response.data.status === "SUCCESS") {
            Swal.fire({
              title: "Sucess",
              text: "Record Deleted Successfully ",
              icon: "success",
              timer: 2000,
            }).then(() => setRefetch(true));

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
        <AssetNoDialog
          open={dialog}
          handleClose={handleClick}
          rowData={row}
          setRetch={setRefetch}
        />
      )}
      <AddNewCraftCode
        open={dialogNew}
        handleClose={handleClick}
        rowData={row}
        setRetch={setRefetch}
      />

      <TableRow hover selected={selected} sx={{ paddingLeft: "20px" }}>
        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell sx={{ height: "50px" }}>{crf_mst_crf_cd}</TableCell>
        <TableCell>{crf_mst_desc}</TableCell>
        <TableCell>{crf_mst_crf_est_rate}</TableCell>
        {/* <TableCell>{formatDate(crf_mst_change_date?.date)}</TableCell> */}
        <TableCell>
          {crf_mst_change_date && crf_mst_change_date.date ? format(new Date(crf_mst_change_date.date), "yyyy-MM-dd hh:mm"):""}
        </TableCell>

        <TableCell>
          <div>
            <Checkbox checked={Number(crf_mst_disable_flag)} disabled />
          </div>
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

GroupTableRow.propTypes = {
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
