import PropTypes from "prop-types";
import { useState, useEffect,  useRef } from 'react';
import { format } from "date-fns";
// @mui


import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import LinearProgress from "@mui/material/LinearProgress";
// utils
import { fCurrency } from "src/utils/format-number";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";
import { useNavigate } from "react-router";
import { Tooltip } from "antd";


// ----------------------------------------------------------------------

export default function ProRow({
  row,
  index,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
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
    sup_mst_supplier_cd,
    sup_mst_status,
    sup_mst_desc,
    sup_mst_rating,
    sup_mst_curr_code,
    sup_mst_fid,
    sup_mst_tid,
    sup_mst_tax_id,
    sup_mst_gst_effective_date,
    sup_mst_gst_expire_date,
    sup_mst_ins_exp,
    sup_mst_lp_date,
    sup_mst_buyer,
    sup_mst_terms,
    sup_mst_fob,
    sup_mst_shipvia,
    sup_mst_acct_no,
    sup_mst_smallbu,
    sup_mst_on_bid_lst,
    sup_mst_insurance,
    sup_mst_hub,
    sup_mst_iso,
    sup_mst_blanketpo,
    sup_mst_services,
    sup_mst_create_by,
    sup_mst_create_date
  } = row;

  
  const confirm = useBoolean();
  const navigate = useNavigate();

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

  const handleRowClick = ()=>{

    if (onClick) {
     
      onClick(row.id); 
    }
    // const id = row.RowID;
    // navigate(`/dashboard/Procurement/editsupplier`,{
    //   state: {
    //     row,
    //     selectedOption,
    //     RowID:id
    //   },
    // })
   
  }



  return (
    <>

      <TableRow  ref={rowRef} hover selected={selected || isHighlighted}  onClick={handleRowClick} sx={{ cursor: 'pointer' }} >
        <TableCell align="right">
          <IconButton
            color={popover.open ? "primary" : "default"}
            onClick={(event)=>{
              event.stopPropagation();
              popover.onOpen(event)}}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        <TableCell>{sup_mst_supplier_cd}</TableCell>
        <TableCell>{sup_mst_status}</TableCell>

    <TableCell>
  <Tooltip title={sup_mst_desc} placement="top" arrow>
    <span
      style={{
        display: 'inline-block',
        maxWidth: '200px',  
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {sup_mst_desc}
    </span>
  </Tooltip>
</TableCell>


        <TableCell>{sup_mst_rating}</TableCell>
        <TableCell>{sup_mst_curr_code}</TableCell>
        <TableCell>{sup_mst_fid}</TableCell>
        <TableCell>{sup_mst_tid}</TableCell>
        <TableCell>{sup_mst_tax_id}</TableCell>
        <TableCell>
          {sup_mst_gst_effective_date &&  sup_mst_gst_effective_date.date?format(new Date(sup_mst_gst_effective_date.date), "dd-MM-yyyy"):""}
        </TableCell>

        <TableCell>
          {sup_mst_gst_expire_date &&  sup_mst_gst_expire_date.date?format(new Date(sup_mst_gst_expire_date.date), "dd-MM-yyyy"):""}
        </TableCell>
  

        <TableCell>
          {sup_mst_ins_exp &&  sup_mst_ins_exp.date?format(new Date(sup_mst_ins_exp.date), "dd-MM-yyyy"):""}
        </TableCell>


        <TableCell>
          {sup_mst_lp_date &&  sup_mst_lp_date.date?format(new Date(sup_mst_lp_date.date), "dd-MM-yyyy"):""}
        </TableCell>

        <TableCell>{sup_mst_buyer}</TableCell>

        <TableCell>{sup_mst_terms}</TableCell>

        <TableCell>{sup_mst_fob}</TableCell>

        <TableCell>{sup_mst_shipvia}</TableCell>

        <TableCell>{sup_mst_acct_no}</TableCell>
       
        <TableCell>
          <Checkbox checked={Number(sup_mst_smallbu)} disabled />
        </TableCell>

        <TableCell>
          <Checkbox checked={Number(sup_mst_on_bid_lst)} disabled />
        </TableCell>
       
        <TableCell>
          <Checkbox checked={Number(sup_mst_insurance)} disabled />
        </TableCell>

        <TableCell>
          <Checkbox checked={Number(sup_mst_hub)} disabled />
        </TableCell>

        <TableCell>
          <Checkbox checked={Number(sup_mst_iso)} disabled />
        </TableCell>

        <TableCell>
          <Checkbox checked={Number(sup_mst_blanketpo)} disabled />
        </TableCell>

        <TableCell>{sup_mst_services}</TableCell>       

        <TableCell>{sup_mst_create_by}</TableCell>  

        <TableCell>
          {sup_mst_create_date &&  sup_mst_create_date.date?format(new Date(sup_mst_create_date.date), "dd-MM-yyyy"):""}
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

ProRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
