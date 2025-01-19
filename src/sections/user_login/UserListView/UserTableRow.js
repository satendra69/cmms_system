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
import { Checkbox, TableSortLabel } from "@mui/material";
import UserGroupDialog from "./UserGroupDialog";
import UserGroupADDDialog from "./UserGroupADDDialog";
import { set } from "lodash";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { useNavigate } from "react-router";

// ----------------------------------------------------------------------

export default function UserTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onDuplicateRow,
  onPrintQrCode,
  groupLabel,
  setRefetch,
}) {
  const {
    empl_id,
    name,
    sys_admin,
    cf_user_locked,
    cf_user_disable_auto_logout,
    cf_user_failed_attempt,
    last_login,
    last_pwd_changed,
    expired_date,
    default_site,
    default_language,
  } = row;
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const site_ID = localStorage.getItem("site_ID");
  const [dialog, setDialog] = useState(false);
  const confirm = useBoolean();

  console.log("row", row);
  const popover = usePopover();
  const navigate = useNavigate();
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
  const [dialogNew, setDialogNew] = useState(false);

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

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
    if (result !== "backdropClick") setDialog(!dialog);
  };
  const handleClickNew = () => {
    setDialogNew(!dialogNew);
  };

  const handleDelete = async () => {
    // console.log("rowDelete", row);

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
      customClass: {
        container: "my-swal-container { z-index: 10000; important; }",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await httpCommon.post("/delete_user_Id.php", {
            site_cd: site_ID,
            row_id: row.rowid,
            emp_mst_login_id: row.empl_id,
          });

          console.log("delete", response);

          if (response.data.status === "SUCCESS") {
            Swal.fire({
              title: "Sucess",
              text: "Record Deleted Successfully",
              icon: "success",
              timer: 2000,
            }).then(() => setRefetch(true));
          } else {
            Swal.fire({
              title: "Error",
              text: response.data.message,
              icon: "error",
            });
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    });
  };

  const handleClickAction = () => {
    popover.onOpen();
    console.log("row Data", row);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell sx={{ height: "40px" }}>{empl_id}</TableCell>
        <TableCell sx={{ marginLeft: "-10px" }}>{name}</TableCell>

        <TableCell>
          <div>
            <Checkbox
              checked={Number(sys_admin)}
              disabled
              // style={{
              //   color: "green",
              // }}
            />
          </div>
        </TableCell>
        <TableCell>
          <div>
            <Checkbox
              checked={Number(cf_user_locked)}
              disabled
              // style={{
              //   color: "green",
              // }}
            />
          </div>
        </TableCell>

        {/* auto logout */}
        <TableCell>
          <div>
            <Checkbox
              checked={Number(cf_user_disable_auto_logout)}
              disabled
              // style={{
              //   color: "green",
              // }}
            />
          </div>
        </TableCell>

        {/* fail attemp */}
        <TableCell sx={{ marginLeft: "-10px" }}>
          {cf_user_failed_attempt}
        </TableCell>

        {/* last login */}
        <TableCell sx={{ marginLeft: "-10px" }}>
          {last_login && last_login.date
            ? format(new Date(last_login.date), "dd-MM-yyyy")
            : ""}
        </TableCell>

        {/* last password change */}
        <TableCell sx={{ marginLeft: "-10px" }}>
          {last_pwd_changed && last_pwd_changed.date
            ? format(new Date(last_pwd_changed.date), "dd-MM-yyyy")
            : ""}
        </TableCell>

        {/* expire date */}
        <TableCell sx={{ marginLeft: "-10px" }}>
          {expired_date && expired_date.date
            ? format(new Date(expired_date.date), "dd-MM-yyyy")
            : ""}
        </TableCell>

        {/* default site */}
        <TableCell sx={{ marginLeft: "-10px" }}>{default_site}</TableCell>

        {/* default language */}
        <TableCell sx={{ marginLeft: "-10px" }}>{default_language}</TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
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

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDuplicateRow: PropTypes.func,
  onPrintQrCode: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  setRefetch: PropTypes.func,
};
