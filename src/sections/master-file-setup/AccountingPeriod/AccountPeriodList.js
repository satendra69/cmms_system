import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import React from "react";

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

// hooks
import { useBoolean } from "src/hooks/use-boolean";
// _mock

// components
import { useSettingsContext } from "src/components/settings";

import {
  useTable,
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  getComparator,
} from "src/components/table";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import httpCommon from "src/http-common";
import Swal from "sweetalert2";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import { FaPlus } from "react-icons/fa6";
import { ThreeCircles } from "react-loader-spinner";
// Toastfy
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AssetTableFiltersResult from "src/sections/Asset/AssetTableFiltersResult";

import AccountingPeriodRows from "./AccountingPeriodRows";
import AccountingPeriodAddDailog from "./AccountingPeriodAddDailog";
import { Button, MenuItem, Typography } from "@mui/material";
import { IoSearch } from "react-icons/io5";
import CustomPopover from "src/components/custom-popover/custom-popover";
import ExportToExcel from "./ExportToExcel/ExportToExcel";

const TABLE_HEAD = [
  { id: "", label: "Actions", width: 10 },
  { id: "prod_year", label: "Budget Year", width: 80 },
  { id: "p1beg", label: "Begin Date", width: 90 },
  { id: "end_of_year", label: "End Date", width: 610 },
];

const defaultFilters = {
  //   col1: "",
  publish: [],
  stock: [],
};
// ----------------------------------------------------------------------

export default function AccountPeriodList() {
  const site_ID = localStorage.getItem("site_ID");
  const emp_owner = localStorage.getItem("emp_mst_empl_id");

  const [refetch, setRetch] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const popover = usePopover();

  const table = useTable();

  const settings = useSettingsContext();
  const [maxHeight, setMaxHeight] = useState("400px");
  const [tableData, setTableData] = useState([]);
  const [totalRow, setTotalRow] = useState();

  const [filters, setFilters] = useState(defaultFilters);

  const confirm = useBoolean();

  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef(null);
  const numberOfColumns = "71";

  const [selectDropRowID, setselectDropRowID] = useState("");

  const [TableSearchData, setTableSearchData] = useState([]);

  const [DefineQueryBtn, setDefineQueryBtn] = useState("");

  const [dialogNew, setDialogNew] = useState(false);
  const [dataFiltered, setDataFiltered] = useState(tableData ? tableData : []);
  const fetchData = useCallback(async () => {
    //Swal.fire({ title: 'Please Wait!', allowOutsideClick: false });
    //Swal.showLoading();
    setIsLoading(true);

    try {
      const response = await httpCommon.get(
        "/getMasterAccountingPeroid.php?site_cd=" + site_ID
      );
      if (response.data.status === "SUCCESS") {
        setTableData(response.data.cf_acct_period);
        setDataFiltered(response.data.cf_acct_period);
        const dataLength = response.data.cf_acct_period;
        setTotalRow(dataLength.length);
        Swal.close();
        setIsLoading(false);
      }
      if (response.data.status === "ERROR") {
        setTableData(response.data.data);
        setDataFiltered(response.data.data);
        setIsLoading(false);
        // setRetch(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [site_ID, currentPage, refetch]);

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
      setRetch(false); // Reset refetch flag after fetching data
    }
  }, [fetchData, refetch]);

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

  // export to Excel
  const handleExportClick = () => {
    ExportToExcel({ tableData: tableData });
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
  };

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
      const prod = item.prod_year.toString();
      const prod_year = prod.toLowerCase();
      const p1beg = item.p1beg.date.toLowerCase();
      const end_of_year = item.end_of_year.date.toLowerCase();

      return (
        prod_year.includes(searchTerm) ||
        p1beg.includes(searchTerm) ||
        end_of_year.includes(searchTerm)
      );
    });
    setDataFiltered(filteredData);
  };
  const handleClickNew = (e, result) => {
    if (result !== "backdropClick") {
      setDialogNew(!dialogNew);
    }
  };

  return (
    <>
      <AccountingPeriodAddDailog
        open={dialogNew}
        handleClose={handleClickNew}
        setRetch={setRetch}
        dataFiltered={tableData}
      />
      <Helmet>
        <title>Master Accounting Peroid</title>
        <meta name="description" content="Master Accounting Peroid" />
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
            heading="Master Accounting Period"
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
                  <div style={{ padding: "2px",paddingRight:"4px" }}>
                    <IoSearch
                      size={23}
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
                rowCount={tableData?.length}
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
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData?.length}
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
                            {/* Data mapping */}

                            {dataFiltered
                              .slice(
                                currentPage * table.rowsPerPage -
                                  table.rowsPerPage,
                                currentPage * table.rowsPerPage
                              )
                              .map((row) => (
                                <AccountingPeriodRows
                                  key={row.id}
                                  setRetch={setRetch}
                                  row={row}
                                  tableData={tableData}
                                  selected={table.selected.includes(row.col61)}
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
                        tableData?.length
                      )}
                    />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={totalRow > 0 ? totalRow : dataFiltered?.length}
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
