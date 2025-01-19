import { useEffect,  useRef } from 'react';
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";

import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

// utils
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

export default function WorkReqTableRow({
  row,
  selected,
  index,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onApprove,
  onDisApprove,
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
 
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();
  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; 
    }
    dateString = dateString.toString();
    if (dateString.startsWith("1900-01-01")) {
      return ""; 
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const maxCharactersToShow = 30;
  const truncatedDescription =
  col3 && col3.length > maxCharactersToShow
      ? `${col3.substring(0, maxCharactersToShow)}...`
      : col3;

  const handleRowClickTable = () => {
    if (onClick) {
      
      onClick(row.id); // Pass the row ID or other relevant data to the onClick handler
    }
  };
  return (
    <>
      <TableRow ref={rowRef} hover selected={selected || isHighlighted} onClick={handleRowClickTable} sx={{ cursor: 'pointer' }}>
        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={(event) => {
              event.stopPropagation(); // Stop the click event from bubbling up to the TableRow
              popover.onOpen(event); // Pass the event to popover.onOpen if necessary
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell>{col2}</TableCell>
        <TableCell>
        <Tooltip title={col3} placement="top" arrow >
              <span>{truncatedDescription}</span>
            </Tooltip>
        </TableCell>

        <TableCell>
          {(() => {
            if (col4 === "A") {
              return (
                <div>
                  <span
                    style={{
                      backgroundColor: "rgb(0 167 111)",
                      color: "white",
                      padding: "2px 7px 6px 7px",
                      borderRadius: "5px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Approve ({col4})
                  </span>
                </div>
              );
            }
            if (col4 === "D") {
              return (
                <div>
                  <span
                    style={{
                      backgroundColor: "#FF6258",
                      color: "white",
                      padding: "2px 7px 6px 7px",
                      borderRadius: "5px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Disapprove ({col4})
                  </span>
                </div>
              );
            }
            if (col4 === "W") {
              return (
                <div>
                  <span
                    style={{
                      backgroundColor: "#2196F3",
                      color: "white",
                      padding: "2px 7px 6px 7px",
                      borderRadius: "5px",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    Awaiting ({col4})
                  </span>
                </div>
              );
            }
            return null; // Return null if none of the conditions match
          })()}
        </TableCell>

        <TableCell>{col5}</TableCell>
        <TableCell>{col6}</TableCell>
        <TableCell>{col7}</TableCell>
        <TableCell>{col8}</TableCell>
        <TableCell>{col9}</TableCell>
        <TableCell>
          <Checkbox
            checked={col10 === '1'}
            
            inputProps={{ 'aria-label': 'disabled checkbox' }}
              color="primary" 
            />
        </TableCell>
        
        <TableCell> <Checkbox
            checked={col11 === '1'}
            
            inputProps={{ 'aria-label': 'disabled checkbox' }}
              color="primary" 
            />
        </TableCell>
       
        <TableCell>{col12}</TableCell>
        <TableCell>{col13}</TableCell>
        <TableCell>{col14}</TableCell>
        <TableCell>{col15}</TableCell>
        <TableCell>{col16}</TableCell>
        <TableCell>{col17}</TableCell>
        <TableCell>{col18}</TableCell>
        <TableCell>{col19}</TableCell>
        <TableCell>{col20}</TableCell>
       
        <TableCell> {formatDate(col21)}</TableCell>
       
        <TableCell>{col22}</TableCell>
        <TableCell>{col23}</TableCell>
        <TableCell>
        {formatDate(col24)}
        </TableCell>
        <TableCell>{col25}</TableCell>
        
        <TableCell>{formatDate(col26)}</TableCell>
        <TableCell>{formatDate(col27)}</TableCell>
        <TableCell>{col28}</TableCell>
        <TableCell>{col29}</TableCell>
        <TableCell>{formatDate(col30)}</TableCell>
      </TableRow>

     
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {(col4 === "A" || col4 === "D") ? (
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="icon-park-outline:list-view" />
            View
          </MenuItem>
        ) : (
          <>
            <MenuItem
              onClick={() => {
                onApprove();
                popover.onClose();
              }}
              sx={{ color: "green" }}
            >
              <Iconify icon="material-symbols:order-approve" />
              Approve
            </MenuItem>

            <MenuItem
              onClick={() => {
                onDisApprove();
                popover.onClose();
              }}
              sx={{ color: "error.main" }}
            >
              <Iconify icon="fluent:text-change-reject-20-filled" />
              Disapprove
            </MenuItem>

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
                onDeleteRow();
                popover.onClose();
              }}
              sx={{ color: "error.main" }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </>
        )}
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

WorkReqTableRow.propTypes = {
  order: PropTypes.string,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
