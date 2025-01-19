import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useRef, Fragment } from 'react';
// @mui

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Checkbox from "@mui/material/Checkbox";

// utils

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

export default function TableRowMui({
 
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onDuplicateRow,
  onPrintQrCode,
  onClick,
}) {
  
  const {
    site_cd,
  site_name,
  disable_flag


  } = row;



  const AuditUser = localStorage.getItem("emp_mst_login_id");
  const site_ID = localStorage.getItem('site_ID');

  const confirm = useBoolean();

  const popover = usePopover();
  const formatDate = (dateString) => {
   
    if (!dateString) {
      return ""; // Return empty string if dateString is undefined or null
    }
    // Check if dateString starts with "1900-01-01"
    if (dateString.startsWith("1900-01-01")) {
      return ""; // Return empty string if dateString matches the condition
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const formatDate2 = (dateString) => {
   
    if (!dateString) {
      return ""; // Return empty string if dateString is undefined or null
    }
  
    // Check if dateString starts with "1900-01-01"
    if (dateString.startsWith("1900-01-01")) {
      return ""; // Return empty string if dateString matches the condition
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
const [UserPermission, setUserPermission] = useState([]);
const [AllStatusType,setAllStatusType ] = useState([]);
// get User Permission 






    


  const handleRowClickTable = () => {
    if (onClick) {
     
      onClick(row.id); // Pass the row ID or other relevant data to the onClick handler
    }
  };  


  return (
    <>
      <TableRow hover selected={selected} onClick={handleRowClickTable} sx={{ cursor: 'pointer' }}>
      
        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} 
           onClick={(event) => {
            event.stopPropagation(); 
            popover.onOpen(event); 
          }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      


   
      
        <TableCell>{site_cd}</TableCell>
        <TableCell>{site_name}</TableCell>
        <TableCell>
        <Checkbox checked={parseInt(site_name)} disabled />
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

TableRowMui.propTypes = {
  order: PropTypes.string,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDuplicateRow:PropTypes.func,
  onPrintQrCode:PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
TableRowMui.defaultProps = {
  order: 'desc', // Set default value if needed
};
