import PropTypes from 'prop-types';
import { useState,useEffect,useRef} from 'react';
// @mui
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';


// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PreventiveTableRow({
 
  row,
  index,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onCheckboxChange,
  onViewRow,
  shouldReset,
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
    prm_mst_pm_no,
    prm_mst_type,
    prm_mst_pm_grp,
    prm_mst_assetno,
    prm_mst_freq_code,
    prm_mst_lpm_date,
    prm_mst_lpm_closed_date,
    prm_mst_next_create,
    prm_mst_next_due,
    prm_mst_lead_day,
    prm_mst_closed_loop,
    prm_mst_cal_startdate,
    prm_mst_disable_flag,
    prm_mst_curr_wo,
    prm_mst_flt_code,
    prm_mst_desc,
    prm_mst_meter_id,
    prm_mst_lpm_usg,
    prm_mst_lpm_uom,
    ast_grp_descs,
    prm_mst_shadow_grp,
    prm_mst_dflt_status,
    prm_mst_plan_priority,
    prm_det_chg_costcenter,
    prm_mst_assetlocn,
    prm_det_originator,
    prm_det_approver,
    prm_det_planner,
    prm_det_crd_costcenter,
    prm_det_l_account,
    prm_det_m_account,
    prm_det_c_account,
    prm_det_project_id,
    prm_det_safety,
    prm_det_varchar20,
    prm_det_cause_code,
    prm_det_act_code,
    prm_det_work_area,
    prm_det_work_locn,
    prm_det_work_grp,
    prm_det_work_type,
    prm_det_work_class,
    prm_mst_create_by,
    prm_mst_create_date,
    
  } = row;

 // console.log("Preventive Maintenance____",row);
  const confirm = useBoolean();

  const popover = usePopover();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
      // Reset the checkbox if shouldReset is true
      if (shouldReset) {
        setIsChecked(false);
      }
    }, [shouldReset]);

    const handleCheckboxChange = (event) => {
      const checked = event.target.checked;
      setIsChecked(checked); // Update local state
      onCheckboxChange(row, checked);
    };
    

  return (
    <>
      <TableRow ref={rowRef} hover selected={selected || isHighlighted}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>

        {/* Add Checkbox */}
        <TableCell padding="checkbox">
          <Checkbox
            checked={isChecked}
            onChange={handleCheckboxChange} 
          />
        </TableCell>

        <TableCell>{prm_mst_pm_no}</TableCell>
        <TableCell>
          {(() => {
            if (prm_mst_type === 'G') {
              return (
                <div>
                  {' '}
                  <span
                    style={{
                      backgroundColor: '#2196F3',
                      color: 'white',
                      padding: '2px 7px 6px 7px',
                      borderRadius: '5px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                    }}
                  >
                    Group ({prm_mst_type})
                  </span>
                </div>
              );
            }
            if (prm_mst_type === 'A') {
              return (
                <div>
                  {' '}
                  <span
                    style={{
                      backgroundColor: '#19D895',
                      color: 'white',
                      padding: '2px 7px 6px 7px',
                      borderRadius: '5px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                    }}
                  >
                   Asset ({prm_mst_type})
                  </span>
                </div>
              );
            }
            return null; // Return null if none of the conditions match
          })()}
        </TableCell>
        <TableCell>{prm_mst_pm_grp}</TableCell>
        <TableCell>{prm_mst_assetno}</TableCell>
        <TableCell>{prm_mst_freq_code}</TableCell>
        <TableCell>{formatDate(prm_mst_lpm_date)}</TableCell>
        <TableCell>{formatDate(prm_mst_lpm_closed_date)}</TableCell>
        <TableCell>{formatDate(prm_mst_next_create)}</TableCell>
        <TableCell>{formatDate(prm_mst_next_due)}</TableCell>
        <TableCell>{prm_mst_lead_day}</TableCell>
        <TableCell>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {(() => {
            if (prm_mst_closed_loop === '0' || prm_mst_closed_loop === null) {
              return (
                <div>
                 
                  <span
    
                  >
                      <FormControlLabel disabled control={<Checkbox />} />
                  </span>
                </div>
              );
            }
            if (prm_mst_closed_loop === '1') {
              return (
                <div className='CheckBoxColor'>
                 
                  <span
                  >
                  <FormControlLabel disabled  control={<Checkbox defaultChecked /> } />
                  </span>
                </div>
              );
            }
            return null; // Return null if none of the conditions match
          })()}
          </div>
        </TableCell>
        <TableCell>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {(() => {
            if (prm_mst_cal_startdate === '0' || prm_mst_cal_startdate === null) {
              return (
                <div>
                 
                  <span
    
                  >
                      <FormControlLabel disabled control={<Checkbox />} />
                  </span>
                </div>
              );
            }
            if (prm_mst_cal_startdate === '1') {
              return (
                <div className='CheckBoxColor'>
                 
                  <span
                  >
                  <FormControlLabel disabled  control={<Checkbox defaultChecked /> } />
                  </span>
                </div>
              );
            }
            return null; // Return null if none of the conditions match
          })()}
          </div>
        </TableCell>
        <TableCell>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {(() => {
            if (prm_mst_disable_flag === '0' || prm_mst_disable_flag === null) {
              return (
                <div>
                 
                  <span
    
                  >
                      <FormControlLabel disabled control={<Checkbox />} />
                  </span>
                </div>
              );
            }
            if (prm_mst_disable_flag === '1') {
              return (
                <div className='CheckBoxColor'>
                 
                  <span
                  >
                  <FormControlLabel disabled  control={<Checkbox defaultChecked /> } />
                  </span>
                </div>
              );
            }
            return null; // Return null if none of the conditions match
          })()}
          </div>
        </TableCell>
        <TableCell>{prm_mst_curr_wo}</TableCell>
        <TableCell>{prm_mst_flt_code}</TableCell>
        <TableCell>{prm_mst_desc}</TableCell>
        <TableCell>{prm_mst_meter_id}</TableCell>
        <TableCell>{prm_mst_lpm_usg}</TableCell>
        <TableCell>{prm_mst_lpm_uom}</TableCell>
        <TableCell>{ast_grp_descs}</TableCell>
        <TableCell>{prm_mst_shadow_grp}</TableCell>
        <TableCell>{prm_mst_dflt_status}</TableCell>
        <TableCell>{prm_mst_plan_priority}</TableCell>
        <TableCell>{prm_det_chg_costcenter}</TableCell>
        <TableCell>{prm_mst_assetlocn}</TableCell>
        <TableCell>{prm_det_originator}</TableCell>
        <TableCell>{prm_det_approver}</TableCell>
        <TableCell>{prm_det_planner}</TableCell>
     
        <TableCell>{prm_det_crd_costcenter}</TableCell>
        <TableCell>{prm_det_l_account}</TableCell>
        <TableCell>{prm_det_m_account}</TableCell>
        <TableCell>{prm_det_c_account}</TableCell>
        <TableCell>{prm_det_project_id}</TableCell>
        <TableCell>{prm_det_safety}</TableCell>
        <TableCell>{prm_det_varchar20}</TableCell>
        <TableCell>{prm_det_cause_code}</TableCell>
        <TableCell>{prm_det_act_code}</TableCell>
        <TableCell>{prm_det_work_area}</TableCell>
        <TableCell>{prm_det_work_locn}</TableCell>
        <TableCell>{prm_det_work_grp}</TableCell>
        <TableCell>{prm_det_work_type}</TableCell>
        <TableCell>{prm_det_work_class}</TableCell>
        <TableCell>{prm_mst_create_by}</TableCell>
        <TableCell>{formatDate(prm_mst_create_date)}</TableCell>
       
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
       
        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
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
          sx={{ color: 'error.main' }}
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

PreventiveTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
