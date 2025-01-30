import { useEffect, useCallback,useState,useRef  } from "react";
import PropTypes from "prop-types";
// @mui

import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
// components
import Iconify from "src/components/iconify";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

export default function WorkOrderTableRow({
  row,
  rowStats,
  index,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onCompleteRow,
  onCloseRow,
  onClick,
  isHighlighted,
}) {
  const empl_site_cd = localStorage.getItem("site_ID");
  const [TableStatus, setTableStatus] = useState([]);
  const hasFetchedStatus = useRef(false);
 
    // Get Status data 
    const fetchStatus = useCallback(async () => {
      Swal.fire({
        title: "Please Wait!",
        allowOutsideClick: false,
        customClass: {
          container: "swalcontainercustom",
        },
      });
      Swal.showLoading();
  
      try {
        const response = await httpCommon.get(
          `/get_site_cd_login_user.php?empl_site_cd=${empl_site_cd}`
        );
      //  console.log("response____",response)
       setTableStatus(response.data.default_site);
        Swal.close();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, [empl_site_cd]);

    useEffect(() => {
      if (!hasFetchedStatus.current) {
       
        fetchStatus();
        hasFetchedStatus.current = true; // Set to true after fetching
      }
    }, []);

 
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
    col61,
    col62,
    col63,
    col64,
    col65,
    col66,
    col67,
    col68,
    col69,
    col70,
  } = row;

  const confirm = useBoolean();

  const popover = usePopover();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Check for specific date or null
    
    if (dateString === "1900-01-01 00:00:00" || dateString === null) {
      
      return (
        <>
        <span style={{width: "110px", display: "inline-block"}}>
        01-01-1900 00:00
        </span>
        <Tooltip
          title="Due Date Not Set"
          placement="top"
          arrow
        >
          <span className="SpecialDateClass" style={{ color: '#fff',width: "25px", textAlign:'center',display: "inline-block"  }}>
        
           0
          </span>
        </Tooltip>
        </>
      );
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
    
    
    // Set the time zone to UTC
    const today = new Date().toLocaleString("en-US", { timeZone: "UTC" });
  
    // Calculate the time difference in days
    const timeDifference = date - new Date(today);
    const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    let textColor = "black";
    let textClass = "";
    let text = "";
  
    // Update styles based on the total number of days
    if (totalDays > 0) {
      textColor = "#fff";
      textClass = "FutureDateClass";
      text = "Days Left to Due Date";
    } else if (totalDays <= 0) {
      textColor = "#fff";
      textClass = "PastDateClass";
      text = "Days Past Due";
    }
  
    return (
      <span >
        <span style={{width: "120px", display: "inline-block"  }}>
        {formattedDate}{" "}
        </span>
        <Tooltip
          title={` ${Math.abs(totalDays)} ${text} `}
          placement="top"
          arrow
        >
          <span
            className={`DueDtCls ${textClass}`}
            style={{ width: "25px", display: "inline-block", textAlign:'center', color: textColor}}
          >
            {Math.abs(totalDays)}
          </span>
        </Tooltip>
      </span>
    );
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
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so add 1
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const filteredData = TableStatus.filter(item => item.site_cd === empl_site_cd && item.wrk_sts_status === col4);

  const maxCharactersToShow = 30;
  const truncatedDescription =
  col5 && col5.length > maxCharactersToShow
      ? `${col5.substring(0, maxCharactersToShow)}...`
      : col5;

      const truncatedCorrective_action =
      col16 && col16.length > maxCharactersToShow
      ? `${col16.substring(0, maxCharactersToShow)}...`
      : col16;
       
      const handleRowClickTable = () => {
        if (onClick) {
         
          onClick(row.id); // Pass the row ID or other relevant data to the onClick handler
        }
      };
     
  return (
    <>
      {rowStats === "PrmMstTable" ? (
        // Render PrmMstTable
        <TableRow hover selected={selected}>
          <TableCell align="right">
            <IconButton
              color={popover.open ? "primary" : "default"}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
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
          <TableCell>{col13}</TableCell>
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
        </TableRow>
      ) : (
        // Render other table
        <TableRow ref={rowRef} 
        hover 
       // selected={selected || isHighlighted} 
        selected={selected === true || isHighlighted} 
         onClick={handleRowClickTable} 
         sx={{ cursor: 'pointer' }} >
          <TableCell align="right">
            <IconButton
              color={popover.open ? "primary" : "default"}
            
             onClick={(event) => {
              event.stopPropagation(); 
              popover.onOpen(event);
            }}
              disableRipple 
              sx={{ "&:active": { backgroundColor: "transparent" } }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>

          <TableCell>{col2}</TableCell>
          <TableCell>{col3}</TableCell>
          
          <TableCell>{(() => {
             if (filteredData.length > 0) {
              const wrk_sts_typ_cd = filteredData[0].wrk_sts_typ_cd;
              if(wrk_sts_typ_cd === "OPEN"){
                return (
                  <div>
                    <span
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        padding: "2px 7px 6px 7px",
                        borderRadius: "5px",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <Tooltip
                        title={filteredData[0].wrk_sts_desc}
                        placement="top"
                        arrow
                      >
                        <span>{col4}</span>
                      </Tooltip>
                    </span>
                  </div>
                );
              }
              if(wrk_sts_typ_cd === "CLOSE"){
                return (
                  <div>
                    <span
                      style={{
                        backgroundColor: "gray",
                        color: "white",
                        padding: "2px 7px 6px 7px",
                        borderRadius: "5px",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <Tooltip
                        title={filteredData[0].wrk_sts_desc}
                        placement="top"
                        arrow
                      >
                        <span>{col4}</span>
                      </Tooltip>
                    </span>
                  </div>
                );
              }
              if(wrk_sts_typ_cd === "CANCEL"){
                return (
                  <div>
                    <span
                      style={{
                        backgroundColor: "#566573",
                        color: "white",
                        padding: "2px 7px 6px 7px",
                        borderRadius: "5px",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <Tooltip
                        title={filteredData[0].wrk_sts_desc}
                        placement="top"
                        arrow
                      >
                        <span>{col4}</span>
                      </Tooltip>
                    </span>
                  </div>
                );
              }
              if(wrk_sts_typ_cd === "COMPLETE"){
                return (
                  <div>
                    <span
                      style={{
                        backgroundColor: "#0000ffa3",
                        color: "white",
                        padding: "2px 7px 6px 7px",
                        borderRadius: "5px",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                    
                     <Tooltip
                        title={filteredData[0].wrk_sts_desc}
                        placement="top"
                        arrow
                      >
                      <span>{col4}</span>
                      </Tooltip>
                    </span>
                  </div>
                );
              }
              return null;
             }
            })()}
            </TableCell>
            <TableCell>
            <Tooltip title={col5} placement="top" arrow >
              <span>{truncatedDescription}</span>
            </Tooltip>
          </TableCell>
          <TableCell>{col6}</TableCell>
        
          <TableCell>{col7 ? formatDate2(col7) : ""}</TableCell>
          <TableCell>{col8 ? formatDate(col8) : ""}</TableCell>
          <TableCell>{col9 ? formatDate2(col9) : ""}</TableCell>
          <TableCell>{col10 ? formatDate2(col10) : ""}</TableCell>
          <TableCell>{col11}</TableCell>
          <TableCell>{col12}</TableCell>
          <TableCell>{col13}</TableCell>
          <TableCell>{col14}</TableCell>
          <TableCell>{col15}</TableCell>
          <TableCell>
            <Tooltip title={col16} placement="top" arrow >
              <span>{truncatedCorrective_action}</span>
            </Tooltip>
            </TableCell>
          <TableCell>{col17}</TableCell>
          <TableCell>{col18}</TableCell>
          <TableCell>{col19}</TableCell>
          {/* <TableCell>{wkr_appr_date ? formatDate(wkr_appr_date.date) : ''}</TableCell> */}
          <TableCell>{col20}</TableCell>
          <TableCell>{col21}</TableCell>
          {/* <TableCell>{wkr_reject_date ? formatDate(wkr_reject_date) : ''}</TableCell> */}
          <TableCell>{col22}</TableCell>
          {/* <TableCell>{formatDate(wkr_mst_due_date.date)}</TableCell> */}
          <TableCell>{col23}</TableCell>
          <TableCell>{col24}</TableCell>
          <TableCell>{col25}</TableCell>
          <TableCell>{col26}</TableCell>
          <TableCell>{col27}</TableCell>
          <TableCell>
            <Checkbox
            checked={col28 === '1'}
            
            inputProps={{ 'aria-label': 'disabled checkbox' }}
              color="primary" 
            />
            </TableCell>
          <TableCell>{col29}</TableCell>
          <TableCell>{col30}</TableCell>

          <TableCell>{col31 ? formatDate2(col31) : ""}</TableCell>
          <TableCell>{col32 ? formatDate2(col32) : ""}</TableCell>
          <TableCell>{col33}</TableCell>
          <TableCell>{col34}</TableCell>
          <TableCell>{col35}</TableCell>
          <TableCell>{col36 ? formatDate2(col36) : ""}</TableCell>
          <TableCell>{col37 ? formatDate2(col37) : ""}</TableCell>
          <TableCell>{col38 ? formatDate2(col38) : ""}</TableCell>
          <TableCell>{col39}</TableCell>
          <TableCell>{col40}</TableCell>
          <TableCell>{col41}</TableCell>
          <TableCell>{col42}</TableCell>
          <TableCell>{col43}</TableCell>
          <TableCell>{col44}</TableCell>
          <TableCell>{col45}</TableCell>
          <TableCell>{col46}</TableCell>
          <TableCell>{col47}</TableCell>
          <TableCell sx={{textAlign: "center"}}>{col48}</TableCell>
          <TableCell>{col49}</TableCell>
          <TableCell>{col50}</TableCell>
          <TableCell>{col51}</TableCell>
          <TableCell>{col52}</TableCell>
          <TableCell>{col53}</TableCell>
          <TableCell>{col54}</TableCell>
          <TableCell>{col55}</TableCell>
          <TableCell>{col56}</TableCell>
          <TableCell>{col57}</TableCell>
          <TableCell>{col58}</TableCell>
          <TableCell>{col59}</TableCell>
          <TableCell>{col60}</TableCell>
          <TableCell>{col61}</TableCell>
          <TableCell>{col62}</TableCell>
          <TableCell>{col63}</TableCell>

          <TableCell>{col64 ? formatDate2(col64) : ""}</TableCell>
          <TableCell>{col65 ? formatDate2(col65) : ""}</TableCell>
          <TableCell>{col66 ? formatDate2(col66) : ""}</TableCell>
          <TableCell>{col67 ? formatDate2(col67) : ""}</TableCell>
          <TableCell>{col68 ? formatDate2(col68) : ""}</TableCell>
          <TableCell>{col69}</TableCell>
          <TableCell>{col70 ? formatDate2(col70) : ""}</TableCell>
        </TableRow>
      )}
      

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onCompleteRow();
            popover.onClose();
          }}
          sx={{ color: "green" }}
        >
          <Iconify icon="material-symbols:order-approve" />
          Complete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onCloseRow();
            popover.onClose();
          }}
          sx={{ color: "green" }}
        >
          <Iconify icon="fluent:text-change-reject-20-filled" />
          Close
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
            // onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="teenyicons:print-solid" />
          Print
        </MenuItem>
        <MenuItem
          onClick={() => {
           // confirm.onTrue();
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

WorkOrderTableRow.propTypes = {
  order: PropTypes.string,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onCompleteRow: PropTypes.func,
  onCloseRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
