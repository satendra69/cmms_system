import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useRef } from 'react';
// @mui

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';

import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
// utils

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import httpCommon from 'src/http-common';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export default function MTRTableRow({
 
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
    col13,
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
const getStatusAll = async () => {
  
  try {
    const response = await httpCommon.get(`/get_all_status_type.php?site_cd=${site_ID}`);
    if (response.data.status === "SUCCESS") {
     // setUserPermission(response.data.data.UserPermission);
    setAllStatusType(response.data.data.AllStatusType);
      
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


  useEffect(() => {
   
    getStatusAll();
    getUserPermission();

  }, []);

  const maxCharactersToShow = 35;
  const truncatedShortDescription =
  col9 && col9.length > maxCharactersToShow
      ? `${col9.substring(0, maxCharactersToShow)}...`
      : col9;

    const truncatedDescription =
    col10 && col10.length > maxCharactersToShow
        ? `${col10.substring(0, maxCharactersToShow)}...`
        : col10;  
    

 const formatNumber = (number) => {
    if (number == null) {
      return '';
    }
  
    let [integerPart, decimalPart] = number.toString().split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    decimalPart = decimalPart ? decimalPart.slice(0, 2) : '00';
  
    return `${integerPart}.${decimalPart}`;
  };

  const handleRowClickTable = () => {
    if (onClick) {
     
      onClick(row.id); // Pass the row ID or other relevant data to the onClick handler
    }
  };  

  const getStatus = (status) => {
    return AllStatusType.find(item => item.ast_sts_status === status);
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
        
        <TableCell>{col1}</TableCell>
        <TableCell>{col2}</TableCell>
        <TableCell> {col3 &&  col3.date?format(new Date(col3.date), "dd-MM-yyyy"):""}
         </TableCell>
         <TableCell>
        {col4 &&  col4.date?format(new Date(col4.date), "dd-MM-yyyy"):""}
         </TableCell>
        <TableCell>
        {col5}
         </TableCell>
         <TableCell>
        {col6}
         </TableCell>

         <TableCell>
        {col7}
         </TableCell>

        <TableCell>{col8}</TableCell>

        <TableCell><Checkbox checked={col9} disabled /></TableCell>
        
      <TableCell>
      <Checkbox checked={col10} disabled />
      </TableCell>

        <TableCell>
        <Checkbox checked={col11} disabled />
        </TableCell>

        <TableCell>
       {col12}
        </TableCell>

        <TableCell>
       {col13}
        </TableCell>

        <TableCell>
       {col14}
        </TableCell>
        <TableCell>
       {col15}
        </TableCell>
        <TableCell>
       {col16}
        </TableCell>

      <TableCell>
       {col17}
      </TableCell>
      <TableCell>
       {col18}
      </TableCell>
      <TableCell>
       {col19}
      </TableCell>
      <TableCell>
       {col20}
      </TableCell>
      <TableCell>
       {col21}
      </TableCell>
      <TableCell>
       {col22}
      </TableCell>
      <TableCell>
       {col23}
      </TableCell>
      <TableCell>
       {col24}
      </TableCell>
      <TableCell>
       {col25}
      </TableCell>
      
      <TableCell>
      {col26 && col26.date?format(new Date(col26.date), "dd-MM-yyyy"):""}
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

MTRTableRow.propTypes = {
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

MTRTableRow.defaultProps = {
  order: 'desc', // Set default value if needed
};
