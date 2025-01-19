import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
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
import httpCommon from 'src/http-common';
import { format } from 'date-fns';

// ----------------------------------------------------------------------

export default function MrTableRow({
 
  row,
  index,
  selected,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onClick,
  isHighlighted
}) {
  const rowRef = useRef(null);

  useEffect(() => {
   
    if (isHighlighted && index >= 8 && rowRef.current) {
      rowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [isHighlighted, index]);
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


  return (
    <>
      <TableRow  ref={rowRef} hover selected={selected || isHighlighted}  onClick={handleRowClickTable} sx={{ cursor: 'pointer' }}>
      
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
        <TableCell>{col3}</TableCell>
        <TableCell>{col4}</TableCell>
        <TableCell>
        {col5 &&  col5.date?format(new Date(col5.date), "dd-MM-yyyy"):""}
         </TableCell>
         <TableCell>
        Awating ({col6})
         </TableCell>

         <TableCell>
        {formatNumber(col7)}
         </TableCell>

        <TableCell> {col8}</TableCell>
        <Checkbox checked={col9} disabled />
        <TableCell>
      <Checkbox checked={col10} disabled />
     
    </TableCell>
        <TableCell>

        <Checkbox checked={col11} disabled />

        </TableCell>
        <TableCell> {col12}</TableCell>
        <TableCell>{col13 &&  col13.date?format(new Date(col13.date), "dd-MM-yyyy"):""} </TableCell>
        <TableCell> {col14}</TableCell>
        <TableCell> {col15}</TableCell>
        <TableCell> {col16}</TableCell>
        <TableCell> {col17}</TableCell>
        <TableCell> {col18}</TableCell>
        <TableCell>{col19}</TableCell>
        <TableCell> {col20 &&  col20.date?format(new Date(col20.date), "dd-MM-yyyy"):""}</TableCell>
        <TableCell> {col21}</TableCell>
        <TableCell> {col22}</TableCell>
        <TableCell> {col23 &&  col23.date?format(new Date(col23.date), "dd-MM-yyyy"):""}</TableCell>
        <TableCell> {col24}</TableCell>
        <TableCell> {col25 &&  col25.date?format(new Date(col25.date), "dd-MM-yyyy"):""}</TableCell>
        <TableCell> {col26}</TableCell>
        <TableCell> {col27}</TableCell>
        <TableCell> {col28}</TableCell>
        <TableCell> {col29}</TableCell>
        <TableCell> {col30}</TableCell>
        <TableCell> {col31}</TableCell>
        <TableCell> {col32}</TableCell>
        <TableCell> {col33}</TableCell>
        <TableCell> {col34}</TableCell>
        <TableCell> {col35}</TableCell>
        <TableCell> {col36}</TableCell>
        <TableCell> {col37}</TableCell>
        <TableCell> {col38}</TableCell>
        <TableCell> {col39}</TableCell>
        <TableCell> {col40}</TableCell>
        <TableCell> {col41 &&  col41.date?format(new Date(col41.date), "dd-MM-yyyy"):""}</TableCell>
        <TableCell> {col42 &&  col42.date?format(new Date(col42.date), "dd-MM-yyyy"):""}</TableCell>
        <TableCell> {col43 &&  col43.date?format(new Date(col43.date), "dd-MM-yyyy"):""}</TableCell>
        <TableCell> {col44 &&  col44.date?format(new Date(col44.date), "dd-MM-yyyy"):""}</TableCell>
        <TableCell> {col45 &&  col45.date?format(new Date(col45.date), "dd-MM-yyyy"):""}</TableCell>
        <TableCell> {col46}</TableCell>
        <TableCell> {col47}</TableCell>
        <TableCell> {col48}</TableCell>
 
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

MrTableRow.propTypes = {
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
MrTableRow.defaultProps = {
  order: 'desc', // Set default value if needed
};
