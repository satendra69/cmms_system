import PropTypes from 'prop-types';
import { useState, useEffect,  useRef } from 'react';
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

// ----------------------------------------------------------------------

export default function AssetTableRow({
 
  row,
  index,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onDuplicateRow,
  onPrintQrCode,
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
    col49,
    col50,
    col51,
    col52,
    col53,
    col54,
    col55,
    col56,
    col57,
    col58,
    col59,
    col60,
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
   
      <TableRow  ref={rowRef} hover selected={selected || isHighlighted}  onClick={handleRowClickTable} sx={{ cursor: 'pointer' }} >
      
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
        {(() => {
        
          const statusInfo = getStatus(col5);
          
          if (statusInfo) {
            let bgColor = '';
            
          
            switch (statusInfo.ast_sts_typ_cd) {
              case 'IN-SERVICE':
                bgColor = 'RGB(0,166,126)'; 
                break;
              case 'OUT-OF-SERVICE':
                bgColor = 'rgb(255, 98, 88)'; 
                break;
              case 'DISPOSED':
                bgColor = '#343a40'; 
                break;
              case 'AWA-DISPOSED':
                  bgColor = '#17a2b8'; 
                  break;
              default:
                bgColor = 'grey'; 
                break;
            }
            const maxCharactersstatus = 8; 
            const truncatedStatus = statusInfo.ast_sts_desc && statusInfo.ast_sts_desc.length > maxCharactersstatus
              ? `${statusInfo.ast_sts_desc.substring(0, maxCharactersstatus)}...`
              : statusInfo.ast_sts_desc;
      
            // Tooltip content: full ast_sts_desc without truncation
            const tooltipContent = `${statusInfo.ast_sts_desc} (${col5})`;
            return (
              <div>
                <Tooltip title={tooltipContent} placement="top" arrow>
                  <span
                    style={{
                      backgroundColor: bgColor,
                      color: 'white',
                      padding: '5px 7px 5px 6px',
                      borderRadius: '5px',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                     {truncatedStatus}
                  </span>
                </Tooltip>
              </div>
            );
          }
          
          return null;
        })()}
      </TableCell>
        <TableCell>{col6}</TableCell>
        <TableCell>{col7}</TableCell>
        <TableCell>{col8}</TableCell>
        <TableCell>
        <Tooltip title={col9} placement="top" arrow >
              <span>{truncatedShortDescription}</span>
            </Tooltip>
        </TableCell>
        <TableCell>
        <Tooltip title={col10} placement="top" arrow >
              <span>{truncatedDescription}</span>
        </Tooltip>
        </TableCell>
        <TableCell>{col11}</TableCell>
        <TableCell>{col12}</TableCell>
        <TableCell>{col13}</TableCell>
        <TableCell>{col14}</TableCell>
       
        <TableCell>
        
        <Checkbox
           checked={col15 === '1'}
           
           inputProps={{ 'aria-label': 'disabled checkbox' }}
             color="primary" 
          />
        </TableCell>
        <TableCell>{col16}</TableCell>
        <TableCell>{col17}</TableCell>
        <TableCell>{col18}</TableCell>
        <TableCell>{formatNumber(col19)}</TableCell>
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
        <TableCell> {formatDate2(col30)}</TableCell>
        <TableCell>{formatNumber(col31)}</TableCell>
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
        <TableCell>{formatNumber(col46)}</TableCell>
        <TableCell>{formatNumber(col47)}</TableCell>
        <TableCell>{formatNumber(col48)}</TableCell>
        <TableCell>{formatNumber(col49)}</TableCell>
        <TableCell>{formatNumber(col50)}</TableCell>
        <TableCell> {formatDate2(col51)}</TableCell>
        <TableCell>{formatDate2(col52)}</TableCell>
        <TableCell>{formatDate2(col53)}</TableCell>
        <TableCell>{formatDate2(col54)}</TableCell>
        <TableCell>{formatDate2(col55)}</TableCell>
        <TableCell>{col56}</TableCell>
        <TableCell>{col57}</TableCell>
        <TableCell>{col58}</TableCell>
        <TableCell> {formatDate(col59)}</TableCell>
        <TableCell>{col60}</TableCell>

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

AssetTableRow.propTypes = {
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
AssetTableRow.defaultProps = {
  order: 'desc', // Set default value if needed
};
