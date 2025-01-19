import PropTypes from "prop-types";
import { format } from "date-fns";
// @mui
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
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


// ----------------------------------------------------------------------

export default function EmployeRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  setRefetch,
  onViewRow,
  onApprove,
  onDisApprove,
  selectedOption
}) {
  const {
    emp_mst_empl_id,
    emp_mst_login_id,
    emp_mst_usr_grp,
    emp_mst_name,
    emp_mst_title,
    emp_mst_status,
    emp_mst_homephone,
    emp_mst_emg_name,
    emp_mst_emg_phone,
    emp_mst_dateofhire,
    emp_mst_sex,
    emp_mst_date_of_birth,
    emp_mst_marital_status,
    emp_mst_payrate,
    emp_mst_pay_period,
    emp_mst_remarks,
    emp_mst_privilege_template,
    emp_supervisor_name,
    emp_mst_create_by,
    emp_mst_create_date,
    audit_user,
    audit_date,
    column1,
    column2,
    column3,
    column4,
    column5,
    emp_det_mr_approver,
    emp_det_mr_limit,
    emp_det_wo_budget_approver,
    emp_det_wo_approval_limit,
    emp_det_pr_approver,
    emp_det_pr_approval_limit,
    emp_det_wr_approver,
    emp_det_planner,
    emp_det_wo_gen_mr_pr,
    emp_det_pm_generator,
    emp_det_time_card_enter,
    emp_det_time_card_void,
    emp_det_wo_sched,
    emp_det_po_buyer,
    emp_det_supervisor,
    emp_det_foreman,
    emp_det_asset_tag_flag,
    emp_det_msetup_mobile_user,
    emp_det_email_id,
    emp_det_craft,
    emp_det_work_area,
    emp_det_work_grp,
    emp_det_shift,
    emp_det_supervisor_id,
    emp_det_varchar1,
    emp_det_varchar2,
    emp_det_varchar3,
    emp_det_varchar4,
    emp_det_varchar5,
    emp_det_varchar6,
    emp_det_varchar7,
    emp_det_varchar8,
    emp_det_varchar9,
    emp_det_varchar10,
    emp_det_varchar11,
    emp_det_varchar12,
    emp_det_varchar13,
    emp_det_varchar14,
    emp_det_varchar15,
    emp_det_varchar16,
    emp_det_varchar17,
    emp_det_varchar18,
    emp_det_varchar19,
    emp_det_varchar20,
    emp_det_numeric1,
    emp_det_numeric2,
    emp_det_numeric3,
    emp_det_numeric4,
    emp_det_numeric5,
    emp_det_numeric6,
    emp_det_numeric7,
    emp_det_numeric8,
    emp_det_numeric9,
    emp_det_numeric10,
    emp_det_datetime1,
    emp_det_datetime2,
    emp_det_datetime3,
    emp_det_datetime4,
    emp_det_datetime5,
    emp_det_datetime6,
    emp_det_datetime7,
    emp_det_datetime8,
    emp_det_datetime9,
    emp_det_datetime10,
    emp_det_note1,
    emp_det_note2,
    emp_det_checklist,
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

    const id = row.RowID;
    navigate(`/dashboard/people/employe-new?rowID=${id}`,{
      state: {
        row,
        selectedOption
      },
    })
   
  }



  return (
    <>
      <TableRow hover selected={selected} sx={{cursor:"pointer"}} onClick={handleRowClick} >
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

        <TableCell>{emp_mst_empl_id}</TableCell>
        <TableCell>{emp_mst_login_id}</TableCell>
        <TableCell>{emp_mst_usr_grp}</TableCell>
        <TableCell>{emp_mst_name}</TableCell>
        <TableCell>{emp_mst_title}</TableCell>
        <TableCell>{emp_mst_status}</TableCell>
        <TableCell>{emp_mst_homephone}</TableCell>
        <TableCell>{emp_mst_emg_name}</TableCell>
        <TableCell>{emp_mst_emg_phone}</TableCell>
        <TableCell>
          {emp_mst_dateofhire &&  emp_mst_dateofhire.date?format(new Date(emp_mst_dateofhire.date), "dd-MM-yyyy"):""}
        </TableCell>
  
        <TableCell>{emp_mst_sex === "M" ?"Male":emp_mst_sex === "F"?"Female":""}</TableCell>

        <TableCell>
          {emp_mst_date_of_birth &&  emp_mst_date_of_birth.date?format(new Date(emp_mst_date_of_birth.date), "dd-MM-yyyy"):""}
        </TableCell>

        <TableCell>{emp_mst_marital_status==="S"?"Single":emp_mst_marital_status==="M"?"Married":""}</TableCell>
        <TableCell>{emp_mst_payrate}</TableCell>
        <TableCell>{emp_mst_pay_period}</TableCell>
        <TableCell>{emp_mst_remarks}</TableCell>
        <TableCell>{emp_mst_privilege_template}</TableCell>
        <TableCell>{emp_supervisor_name}</TableCell>
        <TableCell>{emp_mst_create_by}</TableCell>
        <TableCell>
          {emp_mst_create_date &&  emp_mst_create_date.date?format(new Date(emp_mst_create_date.date), "dd-MM-yyyy"):""}
        </TableCell>
       
    
        <TableCell>{audit_user}</TableCell>
        <TableCell>{audit_date &&  audit_date.date?format(new Date(audit_date.date), "dd-MM-yyyy"):""}</TableCell>

     
        <TableCell>{column1}</TableCell>
        <TableCell>{column2}</TableCell>
        <TableCell>{column3}</TableCell>
        <TableCell>{column4}</TableCell>
        <TableCell>{column5}</TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_mr_approver)} disabled />
        </TableCell>
        <TableCell>{emp_det_mr_limit}</TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_wo_budget_approver)} disabled />
        </TableCell>
        <TableCell>{emp_det_wo_approval_limit}</TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_pr_approver)} disabled />
        </TableCell>
        <TableCell>{emp_det_pr_approval_limit}</TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_wr_approver)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_planner)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_wo_gen_mr_pr)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_pm_generator)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_time_card_enter)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_time_card_void)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_wo_sched)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_po_buyer)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_supervisor)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_foreman)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_asset_tag_flag)} disabled />
        </TableCell>
        <TableCell>
          <Checkbox checked={Number(emp_det_checklist)} disabled />
        </TableCell>

        <TableCell>{emp_det_email_id}</TableCell>
        <TableCell>{emp_det_craft}</TableCell>
        <TableCell>{emp_det_work_area}</TableCell>
        <TableCell>{emp_det_work_grp}</TableCell>
        <TableCell>{emp_det_shift}</TableCell>
        <TableCell>{emp_det_supervisor_id}</TableCell>
        <TableCell>{emp_det_varchar1}</TableCell>
        <TableCell>{emp_det_varchar2}</TableCell>
        <TableCell>{emp_det_varchar3}</TableCell>
        <TableCell>{emp_det_varchar4}</TableCell>
        <TableCell>{emp_det_varchar5}</TableCell>
        <TableCell>{emp_det_varchar6}</TableCell>
        <TableCell>{emp_det_varchar7}</TableCell>
        <TableCell>{emp_det_varchar8}</TableCell>
        <TableCell>{emp_det_varchar9}</TableCell>
        <TableCell>{emp_det_varchar10}</TableCell>
        <TableCell>{emp_det_varchar11}</TableCell>
        <TableCell>{emp_det_varchar12}</TableCell>
        <TableCell>{emp_det_varchar13}</TableCell>
        <TableCell>{emp_det_varchar14}</TableCell>
        <TableCell>{emp_det_varchar15}</TableCell>
        <TableCell>{emp_det_varchar16}</TableCell>
        <TableCell>{emp_det_varchar17}</TableCell>
        <TableCell>{emp_det_varchar18}</TableCell>
        <TableCell>{emp_det_varchar19}</TableCell>
        <TableCell>{emp_det_varchar20}</TableCell>
        <TableCell>{emp_det_numeric1}</TableCell>
        <TableCell>{emp_det_numeric2}</TableCell>
        <TableCell>{emp_det_numeric3}</TableCell>
        <TableCell>{emp_det_numeric4}</TableCell>
        <TableCell>{emp_det_numeric5}</TableCell>
        <TableCell>{emp_det_numeric6}</TableCell>
        <TableCell>{emp_det_numeric7}</TableCell>
        <TableCell>{emp_det_numeric8}</TableCell>
        <TableCell>{emp_det_numeric9}</TableCell>
        <TableCell>{emp_det_numeric10}</TableCell>
        <TableCell>
         {emp_det_datetime1 &&  emp_det_datetime1.date?format(new Date(emp_det_datetime1.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime2 &&  emp_det_datetime2.date?format(new Date(emp_det_datetime2.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime3 &&  emp_det_datetime3.date?format(new Date(emp_det_datetime3.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime4 &&  emp_det_datetime4.date?format(new Date(emp_det_datetime4.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime5 &&  emp_det_datetime5.date?format(new Date(emp_det_datetime5.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime6 &&  emp_det_datetime6.date?format(new Date(emp_det_datetime6.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime7 &&  emp_det_datetime7.date?format(new Date(emp_det_datetime7.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime8 &&  emp_det_datetime8.date?format(new Date(emp_det_datetime8.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime9 &&  emp_det_datetime9.date?format(new Date(emp_det_datetime9.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>
          {emp_det_datetime10 &&  emp_det_datetime10.date?format(new Date(emp_det_datetime10.date), "dd-MM-yyyy"):""}
        </TableCell>
        <TableCell>{emp_det_note1}</TableCell>
        <TableCell>{emp_det_note2}</TableCell>
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

EmployeRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
