import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useRef } from 'react';
// @mui

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
// utils

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import httpCommon from 'src/http-common';

// ----------------------------------------------------------------------

export default function InventoryMasterTableRow({
 
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onDuplicateRow,
  onPrintQrCode,
}) {
  
  const {
    col1,
    col2,
    col3,
    col4,
    col5,
    col6,
    col7,
    col8,
    col9,
    col10,
    col11,
    col12,
    col14,
    col15,
    col16,
    col17,
    col18,
    col19,
    col20,
    col21,
    col22,
    col23,
    col24,
    col25,
    col26,
    col27,
    col28,
    col29,
    col30,
    col31,
    col32,
    col33,
    col34,
    col35,
    col36,
    col37,
    col38,
    col39,
    col40,
    col41,
    col42,
    col43,
    col44,
    col45,
    col46,
    col47,
    col48,
    col49,
    col50,
    col51,
    col52,
    col53,
    col54,
    
  } = row;
  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const confirm = useBoolean();

  const popover = usePopover();
  const formatDate = (dateString) => {
    
    if (!dateString || typeof dateString !== 'string' || dateString.startsWith('1900-01-01')) {
      return '';
    }
  
    // Parse the date string
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
const [UserPermission, setUserPermission] = useState([]);
// get User Permission 
const getUserPermission = async () => {
  try {
    const response = await httpCommon.get(`/getAssetUserPermission.php?login_id=${AuditUser}`);
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

  return (
    <>
      <TableRow hover selected={selected}>
      
        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

       
        <TableCell>
          {(() => {
            if (col1 === 'P') {
              return (
                <div>
                  <span
                  >
                    Stock ({col1})
                  </span>
                </div>
              );
            }
            if (col1 === 'T') {
              return (
                <div>
                  <span
                  >
                    Tool ({col1})
                  </span>
                </div>
              );
            }
            if (col1 === 'S') {
              return (
                <div>
                  <span
                  >
                    Serialize ({col1})
                  </span>
                </div>
              );
            }
            if (col1 === 'Z') {
              return (
                <div>
                  <span
                  >
                   Serialize With Asset ({col1})
                  </span>
                </div>
              );
            }
            return null; // Return null if none of the conditions match
          })()}
          </TableCell>
        <TableCell>{col2}</TableCell>
        <TableCell>{col3}</TableCell>
        <TableCell>{col4}</TableCell>
        <TableCell>{col5}</TableCell>
        <TableCell>{col6}</TableCell>
        <TableCell>{col7}</TableCell>
        <TableCell>{col8}</TableCell>
        <TableCell>{col9}</TableCell>
        <TableCell>{col10}</TableCell>
        <TableCell>{col11}</TableCell>
        <TableCell>{col12}</TableCell>
        <TableCell>{col14}</TableCell>
        <TableCell>{col15}</TableCell>
        <TableCell>{col16}</TableCell>
        <TableCell>{col17}</TableCell>
        <TableCell>{col18}</TableCell>
        <TableCell>{col19}</TableCell>
        <TableCell>{col20}</TableCell>
        <TableCell>{col21}</TableCell>
        <TableCell>{col22}</TableCell>
        <TableCell>{col23}</TableCell>
        <TableCell>{col24}</TableCell>
        <TableCell>{col25}</TableCell>
        <TableCell>{col26}</TableCell>
        <TableCell>{col27}</TableCell>
        <TableCell>{col28}</TableCell>
        <TableCell>{col29}</TableCell>
        <TableCell>{col30}</TableCell>
        <TableCell>{col31}</TableCell>
        <TableCell>{col32}</TableCell>
        <TableCell>{col33}</TableCell>
        <TableCell>{col34}</TableCell>
        <TableCell>{col35}</TableCell>
        <TableCell>{col36}</TableCell>
        <TableCell>{col37}</TableCell>
        <TableCell>{col38}</TableCell>
        <TableCell>{col39}</TableCell>
        <TableCell>{col40}</TableCell>
        <TableCell>{col41}</TableCell>
        <TableCell>{col42}</TableCell>
        <TableCell>{col43}</TableCell>
        <TableCell>{col44}</TableCell>
        <TableCell>{col45}</TableCell>
        <TableCell>{col46}</TableCell>
        <TableCell>{col47}</TableCell>
        <TableCell>{formatDate(col48)}</TableCell>
        <TableCell>{formatDate(col49)}</TableCell>
        <TableCell>{formatDate(col50)}</TableCell>
        <TableCell> {formatDate(col51)}</TableCell>
        <TableCell>{formatDate(col52)}</TableCell>
        <TableCell>{col53}</TableCell>
        <TableCell>{formatDate(col54)} </TableCell>
      
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
           // onViewRow();
            popover.onClose();
          }}
          disabled={!UserPermission.every(item => item.edit_flag === "1")}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
          disabled={!UserPermission.every(item => item.edit_flag === "1")}
        >
           
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDuplicateRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:copy-bold" />
          Duplicate
        </MenuItem>

        <MenuItem
          onClick={() => {
            onPrintQrCode();
            popover.onClose();
          }}
        >
          <Iconify icon="f7:qrcode-viewfinder" />
          Print QR Code
        </MenuItem>
     
        <MenuItem
          onClick={() => {
            onDeleteRow();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
          disabled={!UserPermission.every(item => item.edit_flag === "1")}
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
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

InventoryMasterTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDuplicateRow:PropTypes.func,
  onPrintQrCode:PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
