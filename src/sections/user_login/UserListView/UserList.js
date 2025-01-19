import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// @mui

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";

import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";

import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";

import { usePopover } from "src/components/custom-popover";
// routes

// hooks
import { useBoolean } from "src/hooks/use-boolean";
// _mock

// components
import { useSettingsContext } from "src/components/settings";

import {
  useTable,
  emptyRows,
  TableEmptyRows,
  getComparator,
  TableSelectedAction,
  TablePaginationCustom,
} from "src/components/table";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { ConfirmDialog } from "src/components/custom-dialog";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";
import { IoSearch } from "react-icons/io5";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import { ThreeCircles } from "react-loader-spinner";
// Toastfy
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { styled } from "@mui/material/styles";

//

import AssetTableFiltersResult from "src/sections/Asset/AssetTableFiltersResult";

import GroupTableRow from "./UserTableRow";

import UserGroupADDDialog from "./UserGroupADDDialog";
import { Button, MenuItem, Typography } from "@mui/material";
import UserListHeadCustom from "./UserListHeadCustom";
import ExportUsersToExcel from "./ExportToExcel/ExportUsersToExcel";
import CustomPopover from "src/components/custom-popover/custom-popover";
import UserTableRow from "./UserTableRow";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "Action", width: 20 },
  { id: "empl_id", label: "User ID", width: 100 },
  { id: "name", label: "Name", width: 150 },
  { id: "sys_admin", label: "System Adminstrator", width: 200 },
  { id: "cf_user_locked", label: "Account Locked", width: 140 },
  {
    id: "cf_user_disable_auto_logout",
    label: "Disable Auto Logout",
    width: 180,
  },
  { id: "cf_user_failed_attempt", label: "Failed Login Attempt", width: 190 },
  { id: "last_login", label: "Last Login", width: 130 },
  { id: "last_pwd_changed", label: "Last Password Changed", width: 210 },
  { id: "expired_date", label: "Expired Date", width: 150 },
  { id: "default_site", label: "Default Site", width: 130 },
  { id: "default_language", label: "Default Language", width: 170 },
];

const defaultFilters = {
  //   col1: "",
  publish: [],
  stock: [],
};
// ----------------------------------------------------------------------

export default function UserList() {
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");
  const AuditUser = localStorage.getItem("emp_mst_login_id");

  const [isLoading, setIsLoading] = useState(true);
  const popover = usePopover();

  const table = useTable();

  const settings = useSettingsContext();
  const [maxHeight, setMaxHeight] = useState("400px");
  const [tableData, setTableData] = useState([]);
  const [totalRow, setTotalRow] = useState();

  const [filters, setFilters] = useState(defaultFilters);

  const confirm = useBoolean();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const numberOfColumns = "71";
  const [FilterShow, setFilterShow] = useState(false);
  const [ResponceStats, setResponceStats] = useState("");

  const [AssetFiledname, setAssetFiledname] = useState([]);

  const [TitleAstReg, setTitleAstReg] = useState("");
  const [assetFilterDpd, setAssetFilterDpd] = useState([]);
  const [DropListIdGet, setDropListIdGet] = useState(
    location.state?.DropListId || []
  );

  const [selectedOptionEmptyErrorQtr, setSelectedOptionEmptyErrorQtr] =
    useState(false);

  const [selectDropRowID, setselectDropRowID] = useState("");
  const [isInputFocused, setInputFocused] = useState(false);
  const [TableSearchData, setTableSearchData] = useState([]);
  const [UserPermission, setUserPermission] = useState([]);
  const [DefineQueryBtn, setDefineQueryBtn] = useState("");
  const [showQrModel, setshowQrModel] = useState(false);
  const [availabilityQRCode, setAvailabilityQRCode] = useState("selected1");
  const [QrCodeRowId, setQrCodeRowId] = useState("");
  const [dataFiltered, setDataFiltered] = useState(tableData ? tableData : []);
  const [refetch, setRefetch] = useState();
  const [dialogNew, setDialogNew] = useState(false);
  const [groupLabel, setGroupLabel] = useState([]);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    //Swal.fire({ title: 'Please Wait!', allowOutsideClick: false });
    //Swal.showLoading();
    setIsLoading(true);

    try {
      const response = await httpCommon.get("/get_user_details.php");
      // console.log("response_____fetcha___",response);
      setTableData(response.data.data.cf_user_data);
      setDataFiltered(response.data.data.cf_user_data);
      const dataLength = response.data.data.cf_user_data;
      setTotalRow(dataLength.length);
      // Swal.close();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage, refetch]);

  useEffect(() => {
    const fetchLabel = async () => {
      try {
        const response = await httpCommon.get(
          "/get_usert_group_mandatoryfiled.php"
        );

        if (response.data.status === "SUCCESS") {
          setGroupLabel(response.data.user_group.MandatoryField);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLabel();
  }, []);

  // export to Excel
  const handleExportClick = () => {
    ExportUsersToExcel({ tableData: tableData });
    popover.onClose();
    Swal.fire({
      title: "Please Wait!",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
      timer: 1000,
    });
    Swal.showLoading();
  };

  const handleEditeRow = (row) => {
    const Rowid = row.rowid;

    if (Rowid !== "") {
      navigate(`/dashboard/user/user-form/?rowID=${Rowid}`, {
        state: {
          currentPage,
          row,
        },
      });
    }
  };

  // customize label
  const findCustomizeLabel = (columnName) => {
    const matchingColumn = groupLabel.find(
      (item) => item.column_name === columnName
    );
    return matchingColumn ? matchingColumn.customize_label : "";
  };

  const findCustomizerequiredLabel = (columnName) => {
    const foundItem = groupLabel.find(
      (item) => item.column_name === columnName
    );
    if (foundItem && foundItem.cf_label_required === "1") {
      return foundItem.cf_label_required;
    }
    return "";
  };

  // Filters
  useEffect(() => {
    // Apply filtering logic whenever table.order or table.orderBy changes
    const filteredData = applyFilter({
      inputData: tableData,
      comparator: getComparator(table.order, table.orderBy),
      filters,
    });

    setDataFiltered(filteredData);
    setTotalRow(filteredData.length);
  }, [table.order, table.orderBy, filters]);

  const fetchFilterSubPopupSavedropdon = async () => {
    // Get dropdown value using api

    try {
      const response = await httpCommon.get(
        `/get_asset_filter_dropdown.php?site_cd=${site_ID}&auditUser=${AuditUser}`
      );
      //  console.log("check__-asset__",response);
      setAssetFilterDpd(response.data);
      // Swal.close();
      if (DropListIdGet !== "" && DropListIdGet !== null) {
        const matchedItem = response.data.find(
          (item) => item.RowID === DropListIdGet
        );
        if (matchedItem) {
          const cfQueryDescValue = matchedItem.cf_query_title;

          setTitleAstReg(cfQueryDescValue);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getb = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await httpCommon.post(
        `/getAssetListSelectOptionData.php?site_cd=${site_ID}&ItemID=${selectDropRowID}&page=${currentPage}&EmpId=${emp_owner}`
      );
      //  console.log("check___api__data__",response);
      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        setTableData(response.data.data.result);
        setTotalRow(response.data.DashbrdCount);
        // Swal.close();
        setIsLoading(false);
      } else {
        setTableData("");
        setTotalRow("");
        setIsLoading(false);
        Swal.fire({
          title: "Opps..!",
          text: "No Record Found!",
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage, selectDropRowID]);

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
    inputRef.current.value = "";
    fetchData();
  }, [fetchData, refetch]);

  useEffect(() => {
    if (refetch) {
      fetchData();
      setRefetch(false);
    }
  }, [refetch]);

  // set screen revolation set
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      // Adjust maxHeight based on window height
      const newMaxHeight = Math.floor(windowHeight * 0.6) + "px"; // Adjust this value as needed
      setMaxHeight(newMaxHeight);
    };

    // Call handleResize on initial mount
    handleResize();
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter funcation
  const [rows, setRows] = useState([
    {
      selectedOption: "",
      operator: "",
      logical: "AND",
      prompt: "0",
      valuept: "",
      siteCd: site_ID,
      queryTypedd: "F",
    },
  ]);
  // Short By State
  const [rowsort, setRowsort] = useState([
    {
      selectedOptionShort: "",
      promptAsd: "ASC",
      siteCd: site_ID,
      queryType: "S",
    },
  ]);

  const FilterhandleClose = () => {
    // Call your custom logic here before closing the filter
    if (rows.length > 1) {
      const newRows = [rows[0]]; // Keep only the first row
      setRows(newRows);
    }

    // Call handleDeleteRowShort to remove all rowsort except the first one
    if (rowsort.length > 1) {
      const newRowsort = [rowsort[0]]; // Keep only the first row
      setRowsort(newRowsort);
    }

    // Close the filter
    setFilterShow(false);
  };

  const rowOptions = AssetFiledname.map((row) => ({
    value: row.column_name,
    label: `${row.default_label}`,
  }));

  const RetriveData = useCallback(async () => {
    let hasEmptyOperator = false;
    let hasEmptyValuept = false;
    let hasEmptyLogical = false;
    // console.log("rowrowrow___",rows);
    for (const row of rows) {
      if (!row.operator) {
        hasEmptyOperator = true;
      }
      if (!row.valuept) {
        hasEmptyValuept = true;
      }
    }
    if (DefineQueryBtn === "") {
      console.log("Enter this code_____");
      if (hasEmptyOperator || hasEmptyValuept) {
        let fieldName = "";
        if (hasEmptyOperator && hasEmptyValuept && hasEmptyLogical) {
          fieldName = "Operator and Value";
        } else if (hasEmptyOperator) {
          fieldName = "Operator";
        } else if (hasEmptyValuept) {
          fieldName = "Value";
        }
        Swal.close();
        toast.error(`Please fill the required field: ${fieldName}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          style: {
            width: "400px",
          },
        });
        return false;
      }
    }
    //  console.log("currentPage____",currentPage);
    // setCurrentPage(1);
    Swal.fire({
      title: "Please Wait !",
      allowOutsideClick: false,
      customClass: {
        container: "swalcontainercustom",
      },
    });
    Swal.showLoading();
    try {
      const response = await httpCommon.post(
        "/get_retrive_popup_asset_filed_data.php?page=" + currentPage,
        {
          rows: rows,
          rowsort: rowsort,
          SiteCD: site_ID,
          admin: emp_owner,
        }
      );

      if (
        response.data.data &&
        response.data.data.result &&
        response.data.data.result.length > 0
      ) {
        setTableData(response.data.data.result);
        setTotalRow(response.data.total_count);
        setTitleAstReg(response.data.titleName);
        setDefineQueryBtn("RetriveData");

        Swal.close();
        FilterhandleClose();
      } else {
        Swal.fire({
          title: "Opps..!",
          text: "No Record Found!",
          icon: "success",
          customClass: {
            container: "swalcontainercustom",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage, rows, rowsort]);

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const inputValue2 = inputRef.current.value;
      const newValue = inputValue2.slice(0, -1);
      inputRef.current.value = newValue;
      if (newValue === "") {
        handleResetFilters();
      }
    }
  };
  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  const fetchDataCallback = useCallback(fetchData, [site_ID, currentPage]);
  const getbCallback = useCallback(getb, [selectDropRowID]);
  const retriveDataCallback = useCallback(RetriveData, [
    DefineQueryBtn,
    currentPage,
  ]);

  useEffect(() => {
    if (selectDropRowID != "" && selectDropRowID != null) {
      // getb();
      getbCallback();
    } else if (TableSearchData != "" && TableSearchData != null) {
      //   handelSearchButton();
    } else if (DefineQueryBtn !== "" && DefineQueryBtn === "RetriveData") {
      retriveDataCallback();
    } else {
      fetchDataCallback();
    }
    fetchFilterSubPopupSavedropdon();
  }, [
    site_ID,
    currentPage,
    selectDropRowID,
    fetchDataCallback,
    getbCallback,
    retriveDataCallback,
  ]);

  const handelSearchButton = async () => {
    const inputValueGet = inputRef.current.value;

    const searchTerm = inputValueGet.toLowerCase();

    const filteredData = tableData.filter((item) => {
      const name = item.name.toLowerCase();
      const eId = item.empl_id.toLowerCase();
      const site = item.default_site.toLowerCase();
      const dlanguage = item.default_language.toLowerCase();
      return (
        name.includes(searchTerm) ||
        eId.includes(searchTerm) ||
        site.includes(searchTerm) ||
        dlanguage.includes(searchTerm)
      );
    });

    setDataFiltered(filteredData);
  };

  const handleClickNew = (e, result) => {
    navigate("/dashboard/user/user-form");
  };

  return (
    <>
      {/* <UserGroupADDDialog
        open={dialogNew}
        handleClose={handleClickNew}
        setRefetch={setRefetch}
        tableData={tableData}
      /> */}
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
            heading="User List"
            links={[]}
            action={
              <Button
                variant="contained"
                className="AddNewButton"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleClickNew}
              >
                New
              </Button>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>

        {/* Search Input */}
        <div className="workReqpage">
          <Card>
            <Stack
              spacing={2}
              alignItems={{ xs: "flex-end", md: "center" }}
              direction={{
                xs: "column",
                md: "row",
              }}
              sx={{
                p: 2.5,
                pr: { xs: 2.5, md: 1 },
                marginTop: "20px",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                flexGrow={1}
              >
                <div className="wordkOrdersearchInput serchInputW">
                  <input
                    type="text"
                    className="Seachrinput"
                    placeholder="Search.."
                    ref={inputRef}
                    onChange={handelSearchButton}
                  />
                  <div style={{ padding: "2px" }}>
                    <IoSearch
                      size={26}
                      style={{ color: "gray", marginTop: "2px" }}
                    />
                  </div>
                </div>
                <IconButton onClick={popover.onOpen}>
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              </Stack>
            </Stack>
            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow="right-top"
              sx={{ width: 180 }}
            >
              <MenuItem
                onClick={() => {
                  handleExportClick();
                }}
              >
                <Iconify icon="solar:export-bold" />
                Export to Excel
              </MenuItem>
            </CustomPopover>

            {canReset && (
              <AssetTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                //
                onResetFilters={handleResetFilters}
                //
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            {/* Tabel */}
            <TableContainer sx={{ position: "relative" }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
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
                  <UserListHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    setDataFiltered={setDataFiltered}
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
                            {/* Data mapping */}

                            {dataFiltered
                              .slice(
                                currentPage * table.rowsPerPage -
                                  table.rowsPerPage,
                                currentPage * table.rowsPerPage
                              )
                              .map((row) => (
                                <UserTableRow
                                  key={row.id}
                                  row={row}
                                  setRefetch={setRefetch}
                                  rowStats={ResponceStats}
                                  selected={table.selected.includes(row.col61)}
                                  groupLabel={groupLabel}
                                  onEditRow={() => handleEditeRow(row)}
                                  onSelectRow={() =>
                                    table.onSelectRow(row.col61)
                                  }
                                />
                              ))}
                          </>
                        )}
                      </>
                    )}
                    <TableEmptyRows
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        tableData.length
                      )}
                    />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={totalRow > 0 ? totalRow : dataFiltered.length}
              page={currentPage - 1}
              rowsPerPage={table.rowsPerPage}
              onPageChange={(event, newPage) => {
                setCurrentPage(newPage + 1);
                table.onChangePage(event, newPage);
              }}
              currentPage={currentPage}
              //  onRowsPerPageChange={table.onChangeRowsPerPage}
              onRowsPerPageChange={(rowsPerPage) => {
                table.onChangeRowsPerPage(rowsPerPage);
              }}
              // dense={table.dense}
              //  onChangeDense={table.onChangeDense}
            />
          </Card>
        </div>
      </Container>
    </>
  );
}
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
