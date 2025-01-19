import {
  Autocomplete,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useCallback, useState } from "react";
import { usePopover } from "src/components/custom-popover";
import CustomPopover from "src/components/custom-popover/custom-popover";
import Iconify from "src/components/iconify";
import TableContainer from "@mui/material/TableContainer";
import { getComparator, TableHeadCustom, TableSelectedAction, useTable } from "src/components/table";
import { ThreeCircles } from "react-loader-spinner";
import Scrollbar from "src/components/scrollbar";
import EmployeRow from "../../EmployeRow";
import Swal from "sweetalert2";
import httpCommon from "src/http-common";
import { useRouter } from "src/routes/hooks";
import { useNavigate } from "react-router";


function applyFilter({ inputData, comparator, filters }) {


    const { name } = filters;
   
    const stabilizedThis = inputData.map((el, index) => [el, index]);
  
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  
    inputData = stabilizedThis.map((el) => el[0]);
  
    //   if (name) {
    //     inputData = inputData.filter(
    //       (tableData) => tableData.col2.toLowerCase().indexOf(col2.toLowerCase()) !== -1
    //     );
    //   }
    return inputData;
  }
  

function Template({ privalageDrp, selectedPrivalage, setSelectedPrivalage }) {
  const popover = usePopover();
  const [RowPerPage,setRowperPage]=useState(100);
  const defaultFilters = {
    col1: "",
    publish: [],
    stock: [],
  };
  const router = useRouter();
  const site_ID = localStorage.getItem("site_ID");
  const [ResponceStats, setResponceStats] = useState("");
  const [fetch, setRefetch] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [tableData, setTableData] = useState([]);
  const [maxHeight, setMaxHeight] = useState("400px");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const table = useTable();
  const numberOfColumns = "71";
  const [apply, setAplly] = useState("Selected User");
  const handleChangeSeries = useCallback(
    (newValue) => {
      popover.onClose();
      setAplly(newValue);
    },
    [popover],
  );
  const dataFiltered = applyFilter({
    inputData: Array.isArray(tableData) ? tableData : [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });


  const CustomizeLable = (name) => {
    const res = tableData.find((item) => item.column_name === name);

    return res ? res.default_header : "";
  };

  const TABLE_HEAD = [
    { id: "", label: "Action", width: 60 },
    {
      id: "emp_mst_empl_id",
      label: CustomizeLable("emp_mst_empl_id") || "Employee ID",
      width: 140,
    },
    {
      id: "emp_mst_login_id",
      label: CustomizeLable("emp_mst_login_id") || "Login ID",
      width: 140,
      padding: 10,
    },
    {
      id: "emp_mst_usr_grp",
      label: CustomizeLable("emp_mst_usr_grp") || "User Group",
      width: 140,
    },
    {
      id: "emp_mst_name",
      label: CustomizeLable("emp_mst_name") || "Name",
      width: 140,
    },
    {
      id: "emp_mst_title",
      label: CustomizeLable("emp_mst_title") || "Title",
      width: 200,
    },
    {
      id: "emp_mst_status",
      label: CustomizeLable("emp_mst_status") || "Status",
      width: 140,
    },
    {
      id: "emp_mst_homephone",
      label: CustomizeLable("emp_mst_homephone") || "Contact No",
      width: 140,
    },
    {
      id: "emp_mst_emg_name",
      label: CustomizeLable("emp_mst_emg_name") || "Emergency Name",
      width: 140,
    },
    {
      id: "emp_mst_emg_phone",
      label: CustomizeLable("emp_mst_emg_phone") || "Emergency Phone",
      width: 140,
    },
    {
      id: "emp_mst_dateofhire",
      label: CustomizeLable("emp_mst_dateofhire") || "Date of Hire",
      width: 140,
    },
    {
      id: "emp_mst_sex",
      label: CustomizeLable("emp_mst_sex") || "Sex",
      width: 140,
    },
    {
      id: "emp_mst_date_of_birth",
      label: CustomizeLable("emp_mst_date_of_birth") || "Date of Birth",
      width: 140,
    },
    {
      id: "emp_mst_marital_status",
      label: CustomizeLable("emp_mst_marital_status") || "Marital Status",
      width: 140,
    },
    {
      id: "emp_mst_payrate",
      label: CustomizeLable("emp_mst_payrate") || "Pay Rate",
      width: 140,
    },
    {
      id: "emp_mst_pay_period",
      label: CustomizeLable("emp_mst_pay_period") || "Pay Period",
      width: 140,
    },
    {
      id: "emp_mst_remarks",
      label: CustomizeLable("emp_mst_remarks") || "Remarks",
      width: 140,
    },
    {
      id: "emp_mst_privilege_template",
      label:
        CustomizeLable("emp_mst_privilege_template") || "Privilege Template",
      width: 170,
    },
    {
      id: "emp_supervisor_name",
      label: CustomizeLable("emp_supervisor_name") || "Supervisor Name",
      width: 140,
    },
    {
      id: "emp_mst_create_by",
      label: CustomizeLable("emp_mst_create_by") || "Created By",
      width: 140,
    },
    {
      id: "emp_mst_create_date",
      label: CustomizeLable("emp_mst_create_date") || "Created Date",
      width: 140,
    },
    {
      id: "audit_user",
      label: CustomizeLable("audit_user") || "Audit User",
      width: 140,
    },
    {
      id: "audit_date",
      label: CustomizeLable("audit_date") || "Audit Date",
      width: 140,
    },
    {
      id: "column1",
      label: CustomizeLable("column1") || "Column 1",
      width: 140,
    },
    {
      id: "column2",
      label: CustomizeLable("column2") || "Column 2",
      width: 140,
    },
    {
      id: "column3",
      label: CustomizeLable("column3") || "Column 3",
      width: 140,
    },
    {
      id: "column4",
      label: CustomizeLable("column4") || "Column 4",
      width: 140,
    },
    {
      id: "column5",
      label: CustomizeLable("column5") || "Column 5",
      width: 140,
    },
    {
      id: "emp_det_mr_approver",
      label:
        CustomizeLable("emp_det_mr_approver") || "MR Approver / Global Limit",
      width: 200,
    },
    {
      id: "emp_det_mr_limit",
      label: CustomizeLable("emp_det_mr_limit") || "Material Request Limit",
      width: 180,
    },
    {
      id: "emp_det_wo_budget_approver",
      label:
        CustomizeLable("emp_det_wo_budget_approver") ||
        "WO Budget Approver / Limit",
      width: 220,
    },
    {
      id: "emp_det_wo_approval_limit",
      label: CustomizeLable("emp_det_wo_approval_limit") || "WO Approval Limit",
      width: 160,
    },
    {
      id: "emp_det_pr_approver",
      label: CustomizeLable("emp_det_pr_approver") || "PR Approver",
      width: 140,
    },
    {
      id: "emp_det_pr_approval_limit",
      label: CustomizeLable("emp_det_pr_approval_limit") || "PR Approval Limit",
      width: 140,
    },
    {
      id: "emp_det_wr_approver",
      label: CustomizeLable("emp_det_wr_approver") || "WR Approver",
      width: 140,
    },
    {
      id: "emp_det_planner",
      label: CustomizeLable("emp_det_planner") || "Planner",
      width: 140,
    },
    {
      id: "emp_det_wo_gen_mr_pr",
      label:
        CustomizeLable("emp_det_wo_gen_mr_pr") || "Request Parts && Services",
      width: 220,
    },
    {
      id: "emp_det_pm_generator",
      label: CustomizeLable("emp_det_pm_generator") || "PM Generator",
      width: 140,
    },
    {
      id: "emp_det_time_card_enter",
      label: CustomizeLable("emp_det_time_card_enter") || "Time Card Enter",
      width: 140,
    },
    {
      id: "emp_det_time_card_void",
      label: CustomizeLable("emp_det_time_card_void") || "Time Card Void",
      width: 140,
    },
    {
      id: "emp_det_wo_sched",
      label: CustomizeLable("emp_det_wo_sched") || "Schedule Work Order",
      width: 200,
    },
    {
      id: "emp_det_po_buyer",
      label: CustomizeLable("emp_det_po_buyer") || "PO Buyer",
      width: 140,
    },
    {
      id: "emp_det_supervisor",
      label: CustomizeLable("emp_det_supervisor") || "Supervisor",
      width: 140,
    },
    {
      id: "emp_det_foreman",
      label: CustomizeLable("emp_det_foreman") || "Technician",
      width: 140,
    },
    {
      id: "emp_det_asset_tag_flag",
      label: CustomizeLable("emp_det_asset_tag_flag") || "Asset Tag Posting",
      width: 140,
    },
    {
      id: "emp_det_checklist",
      label: CustomizeLable("emp_det_checklist") || "Add/Delete Checklist",
      width: 200,
    },

    {
      id: "emp_det_email_id",
      label: CustomizeLable("emp_det_email_id") || "Email ID",
      width: 140,
    },
    {
      id: "emp_det_craft",
      label: CustomizeLable("emp_det_craft") || "Craft",
      width: 140,
    },
    {
      id: "emp_det_work_area",
      label: CustomizeLable("emp_det_work_area") || "Work Area",
      width: 140,
    },
    {
      id: "emp_det_work_grp",
      label: CustomizeLable("emp_det_work_grp") || "Work Group",
      width: 140,
    },
    {
      id: "emp_det_shift",
      label: CustomizeLable("emp_det_shift") || "Shift",
      width: 140,
    },
    {
      id: "emp_det_supervisor_id",
      label: CustomizeLable("emp_det_supervisor_id") || "Supervisor ID",
      width: 140,
    },
    {
      id: "emp_det_varchar1",
      label: CustomizeLable("emp_det_varchar1") || "Varchar 1",
      width: 140,
    },
    {
      id: "emp_det_varchar2",
      label: CustomizeLable("emp_det_varchar2") || "Varchar 2",
      width: 140,
    },
    {
      id: "emp_det_varchar3",
      label: CustomizeLable("emp_det_varchar3") || "Varchar 3",
      width: 140,
    },
    {
      id: "emp_det_varchar4",
      label: CustomizeLable("emp_det_varchar4") || "Varchar 4",
      width: 140,
    },
    {
      id: "emp_det_varchar5",
      label: CustomizeLable("emp_det_varchar5") || "Varchar 5",
      width: 140,
    },
    {
      id: "emp_det_varchar6",
      label: CustomizeLable("emp_det_varchar6") || "Varchar 6",
      width: 140,
    },
    {
      id: "emp_det_varchar7",
      label: CustomizeLable("emp_det_varchar7") || "Varchar 7",
      width: 140,
    },
    {
      id: "emp_det_varchar8",
      label: CustomizeLable("emp_det_varchar8") || "Varchar 8",
      width: 140,
    },
    {
      id: "emp_det_varchar9",
      label: CustomizeLable("emp_det_varchar9") || "Varchar 9",
      width: 140,
    },
    {
      id: "emp_det_varchar10",
      label: CustomizeLable("emp_det_varchar10") || "Varchar 10",
      width: 140,
    },
    {
      id: "emp_det_varchar11",
      label: CustomizeLable("emp_det_varchar11") || "Varchar 11",
      width: 140,
    },
    {
      id: "emp_det_varchar12",
      label: CustomizeLable("emp_det_varchar12") || "Varchar 12",
      width: 140,
    },
    {
      id: "emp_det_varchar13",
      label: CustomizeLable("emp_det_varchar13") || "Varchar 13",
      width: 140,
    },
    {
      id: "emp_det_varchar14",
      label: CustomizeLable("emp_det_varchar14") || "Varchar 14",
      width: 140,
    },
    {
      id: "emp_det_varchar15",
      label: CustomizeLable("emp_det_varchar15") || "Varchar 15",
      width: 140,
    },
    {
      id: "emp_det_varchar16",
      label: CustomizeLable("emp_det_varchar16") || "Varchar 16",
      width: 140,
    },
    {
      id: "emp_det_varchar17",
      label: CustomizeLable("emp_det_varchar17") || "Varchar 17",
      width: 140,
    },
    {
      id: "emp_det_varchar18",
      label: CustomizeLable("emp_det_varchar18") || "Varchar 18",
      width: 140,
    },
    {
      id: "emp_det_varchar19",
      label: CustomizeLable("emp_det_varchar19") || "Varchar 19",
      width: 140,
    },
    {
      id: "emp_det_varchar20",
      label: CustomizeLable("emp_det_varchar20") || "Varchar 20",
      width: 140,
    },
    {
      id: "emp_det_numeric1",
      label: CustomizeLable("emp_det_numeric1") || "Numeric 1",
      width: 140,
    },
    {
      id: "emp_det_numeric2",
      label: CustomizeLable("emp_det_numeric2") || "Numeric 2",
      width: 140,
    },
    {
      id: "emp_det_numeric3",
      label: CustomizeLable("emp_det_numeric3") || "Numeric 3",
      width: 140,
    },
    {
      id: "emp_det_numeric4",
      label: CustomizeLable("emp_det_numeric4") || "Numeric 4",
      width: 140,
    },
    {
      id: "emp_det_numeric5",
      label: CustomizeLable("emp_det_numeric5") || "Numeric 5",
      width: 140,
    },
    {
      id: "emp_det_numeric6",
      label: CustomizeLable("emp_det_numeric6") || "Numeric 6",
      width: 140,
    },
    {
      id: "emp_det_numeric7",
      label: CustomizeLable("emp_det_numeric7") || "Numeric 7",
      width: 140,
    },
    {
      id: "emp_det_numeric8",
      label: CustomizeLable("emp_det_numeric8") || "Numeric 8",
      width: 140,
    },
    {
      id: "emp_det_numeric9",
      label: CustomizeLable("emp_det_numeric9") || "Numeric 9",
      width: 140,
    },
    {
      id: "emp_det_numeric10",
      label: CustomizeLable("emp_det_numeric10") || "Numeric 10",
      width: 140,
    },
    {
      id: "emp_det_datetime1",
      label: CustomizeLable("emp_det_datetime1") || "Datetime 1",
      width: 140,
    },
    {
      id: "emp_det_datetime2",
      label: CustomizeLable("emp_det_datetime2") || "Datetime 2",
      width: 140,
    },
    {
      id: "emp_det_datetime3",
      label: CustomizeLable("emp_det_datetime3") || "Datetime 3",
      width: 140,
    },
    {
      id: "emp_det_datetime4",
      label: CustomizeLable("emp_det_datetime4") || "Datetime 4",
      width: 140,
    },
    {
      id: "emp_det_datetime5",
      label: CustomizeLable("emp_det_datetime5") || "Datetime 5",
      width: 140,
    },
    {
      id: "emp_det_datetime6",
      label: CustomizeLable("emp_det_datetime6") || "Datetime 6",
      width: 140,
    },
    {
      id: "emp_det_datetime7",
      label: CustomizeLable("emp_det_datetime7") || "Datetime 7",
      width: 140,
    },
    {
      id: "emp_det_datetime8",
      label: CustomizeLable("emp_det_datetime8") || "Datetime 8",
      width: 140,
    },
    {
      id: "emp_det_datetime9",
      label: CustomizeLable("emp_det_datetime9") || "Datetime 9",
      width: 140,
    },
    {
      id: "emp_det_datetime10",
      label: CustomizeLable("emp_det_datetime10") || "Datetime 10",
      width: 140,
    },
    {
      id: "emp_det_note1",
      label: CustomizeLable("emp_det_note1") || "Note 1",
      width: 140,
    },
    {
      id: "emp_det_note2",
      label: CustomizeLable("emp_det_note2") || "Note 2",
      width: 140,
    },
  ];


//   delete Row 
  const handleDeleteRow = useCallback(
    async (id, row) => {
      // console.log("row++++++____", row);
      const Rowid = row.RowID;
      // console.log("Rowid____", Rowid);
      if (Rowid !== "") {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          // Add async here if you want to use await inside then
          if (result.isConfirmed) {
            // setIsLoading(true);

            try {
              const response = await httpCommon.post("/delete_employe.php", {
                site_cd: site_ID,
                row_id: row.RowID,
              });

              console.log("response___", response);
              if (response.data.status == "SUCCESS") {
                Swal.fire({
                  title: "Deleted!",
                  text: response.data.message,
                  icon: "success",
                }).then(() => setRefetch(true));
              }
              if (response.data.status == "ERROR") {
                Swal.fire({
                  title: "Oops!",
                  text: response.data.message,
                  icon: "error",
                });
              }
              // setIsLoading(false);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }
        });
      }
    },
    [tableData, router, site_ID],
  );

// handle Edit Row
const handleEditRow = useCallback(
    (id, row) => {
  
      const Rowid = id;

      if (Rowid !== "") {
        navigate(`/dashboard/people/employe-new?rowID=${Rowid}`, {
          state: {
            currentPage,
            // selectedOption,
            row,
          },
        });
      }
    },
    [router, currentPage],
  );


  return (
    <div style={{ width: "100%" }}>
      <Grid container alignItems="center" spacing={5}>
        <Grid item xs={12} md={9}>
          <Stack sx={{ width: "50%" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {/* {findCustomizeLabel("default_language") || "Privalage Template"} */}
              Privalage Template
            </Typography>
            <Autocomplete
              options={privalageDrp}
              value={selectedPrivalage}
              onChange={(event, value) => {
                setSelectedPrivalage(value.label);
              }}
              renderInput={(params) => (
                <div>
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select..."
                    variant="outlined"
                  />
                </div>
              )}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <div className="select" style={{}}>
            <Stack
              spacing={1}
              sx={{ pb: 1, mt: 2 }}
              style={{ marginRight: "8px" }}
            >
              <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
                Filter By
              </Typography>

              <ButtonBase
                onClick={popover.onOpen}
                sx={{
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: "subtitle2",
                  bgcolor: "background.neutral",
                  width: "100px",
                }}
              >
                {/* {seriesData} */}

                <Iconify
                  width={16}
                  icon={
                    popover.open
                      ? "eva:arrow-ios-upward-fill"
                      : "eva:arrow-ios-downward-fill"
                  }
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
            </Stack>
            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              sx={{ width: 140 }}
            >
              <MenuItem
                key={apply}
                selected={apply === "Selected User"}
                onClick={() => handleChangeSeries(apply)}
              >
                Selected User
              </MenuItem>

              <MenuItem
                key={apply}
                selected={apply === "All user"}
                onClick={() => handleChangeSeries(apply)}
              >
                All user
              </MenuItem>
            </CustomPopover>
          </div>
        </Grid>
      </Grid>

    {/* table container */}

            {/* <TableContainer sx={{ position: "relative" }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id),
                  )
                }
                action={
                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                }
              />

              <Scrollbar sx={{ overflowX: "auto", maxHeight: maxHeight }}>
                <Table
                  size={table.dense ? "small" : "medium"}
                  sx={{ minWidth: 960 }}
                >
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    className="stickyheader"
                  />

                  <TableBody className="AssetTable">
                    {isLoading ? ( // Assuming isLoading is a boolean state indicating whether data is loading
                      <TableRow>
                        <TableCell
                          colSpan={numberOfColumns}
                          className="NoRecodcls"
                        >
                          <Dialog
                            open={isLoading}
                            aria-labelledby="loading-dialog-title"
                            PaperProps={{
                              style: {
                                backgroundColor: "transparent", // Set your desired background color here
                              },
                            }}
                            BackdropProps={{
                              className: "yourbackdropclass",
                            }}
                          >
                            <DialogTitle
                              id="loading-dialog-title"
                              style={{ textAlign: "center" }}
                            ></DialogTitle>
                            <DialogContent>
                              <div
                                style={{
                                  textAlign: "center",
                                  paddingTop: "10px",
                                }}
                              >
                                <ThreeCircles
                                  radius="9"
                                  visible={true}
                                  ariaLabel="three-circles-loading"
                                  color="green"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {tableData.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={numberOfColumns}
                              className="NoRecodcls"
                            >
                              No Record Found
                            </TableCell>
                          </TableRow>
                        ) : (
                          <>
                            {dataFiltered.map((row,index) => (
                              index < RowPerPage && (
                              <EmployeRow
                        
                                key={row.id}
                                row={row}
                                setRefetch={setRefetch}
                                rowStats={ResponceStats}
                                selected={table.selected.includes(
                                  row.mst_RowID,
                                )}
                                onSelectRow={() =>
                                  table.onSelectRow(row.mst_RowID)
                                }
                                onDeleteRow={() =>
                                  handleDeleteRow(row.mst_RowID, row)
                                }
                                onEditRow={() => handleEditRow(row.RowID, row)}
                                onDisApprove={() => handleShowDisapprove(row)}
                                onApprove={() =>
                                  handleShowApprove(row.mst_RowID, row)
                                }
                                //  onViewRow={() => handleViewRow(row.id)}
                                //   onCompleteRow={() => handleCompleteRow(row.col71)}
                                //  onCloseRow={() => handleCloseRow(row.col71)}
                              />
                            )
                            ))}
                          </>
                        )}
                      </>
                    )}
                    <TableEmptyRows
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        tableData.length,
                      )}
                    />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer> */}



    </div>
  );
}

export default Template;
