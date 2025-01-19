import { Card, Grid, TextField, Typography } from "@mui/material";
import { Container, Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { format } from "date-fns";
import httpCommon from "src/http-common";
import Iconify from "src/components/iconify";

function BudgetADDDialog() {
  const site_ID = localStorage.getItem("site_ID");
  const [DefaultModal, setModalDefault] = useState(false);
  const [textField, setTextField] = useState("");
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const [budgetYear, setBudgetYear] = useState([]);

  const [costCenter, setCostCenter] = useState([]);
  const [account, setAccount] = useState([]);
  const rows = [
    createData("Heading", 159, 6.0, 24, 4.0),
    createData("Formula", 237, 150.0, 37, 4.3),
  ];

  const settings = useSettingsContext();

  // fetch Cost center
  useEffect(() => {
    const fetchCost = async () => {
      try {
        const response = await httpCommon.get(
          "/get_master_cost_center.php?site_cd=" + site_ID
        );
        setCostCenter(response.data.data.Cost_Center);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCost();
  }, []);

  // fetch account
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await httpCommon.get(
          "/get_masterfile_account.php?site_cd=" + site_ID
        );

        setAccount(response.data.data.Account);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAccount();
  }, []);

  // budget Year
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await httpCommon.get(
          "/getMasterAccountingPeroid.php?site_cd=" + site_ID
        );

        setBudgetYear(response.data.cf_acct_period);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBudget();
  }, []);


 
  const handleCancelClick = (name) => {
    // setModalDefault(false);
    // setData((pre) => ({
    //   ...pre,
    //   [name]: "",
    // }));
  };

  const handleEditClick = (e) => {
    setModalDefault(!DefaultModal);
    setTextField(e);
  };

  return (
    <div>
      {/* <MasterDialog
        setData={setData}
        handleClose={handleClose}
        open={DefaultModal}
        name={textField}
      /> */}
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div className="CustomBreadAsset">
          <CustomBreadcrumbs
            heading="Add New Budget"
            links={[]}
            sx={{ mb: { xs: 3, md: 5 } }}
          />
        </div>
        <Card
          sx={{
            p: 2.5,
            pr: { xs: 2.5, md: 1 },
            marginTop: "20px",
          }}
        >
          <Grid container spacing={10}>
            <Grid item xs={12} md={6} lg={6}>
              <div className="left" style={{ width: "100%" }}>
                <Stack spacing={1} sx={{ pb: 1.5 }}>
                  <Typography variant="subtitle2" style={{ color: "red" }}>
                    {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                    Budget Year:
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="budgetYear"
                      size="small"
                      placeholder="Select Budget Year..."
                      // value={data.costcenter}
                      // onChange={handleData}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#637381",
                              gap: 5,
                            }}
                          >
                            <Iconify
                              icon="material-symbols:close"
                              onClick={() =>
                                handleCancelClick("MaterialAccount")
                              }
                              style={{ cursor: "pointer" }}
                            />

                            <Iconify
                              icon="tabler:edit"
                              onClick={() => handleEditClick("budgetYear")}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        ),
                      }}
                    />
                  </div>
                  {/* {error && (
                        <p
                          style={{
                            color: "red",
                            marginTop: "-5px",
                            fontSize: "14px",
                          }}
                        >
                          {error}
                        </p>
                      )} */}
                </Stack>

                {/* cost center */}
                <Stack spacing={1} sx={{ pb: 1.5 }}>
                  <Typography variant="subtitle2" style={{ color: "red" }}>
                    {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                    Cost Center:
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="costcenter"
                      size="small"
                      placeholder="Select Cost Center..."
                      // value={data.costcenter}
                      // onChange={handleData}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#637381",
                              gap: 5,
                            }}
                          >
                            <Iconify
                              icon="material-symbols:close"
                              onClick={() =>
                                handleCancelClick("MaterialAccount")
                              }
                              style={{ cursor: "pointer" }}
                            />

                            <Iconify
                              icon="tabler:edit"
                              onClick={() => handleEditClick("costcenter")}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        ),
                      }}
                    />
                  </div>
                  {/* {error && (
                        <p
                          style={{
                            color: "red",
                            marginTop: "-5px",
                            fontSize: "14px",
                          }}
                        >
                          {error}
                        </p>
                      )} */}
                </Stack>

                {/* account */}
                <Stack spacing={1} sx={{ pb: 1.5 }}>
                  <Typography variant="subtitle2" style={{ color: "red" }}>
                    {/* {findCustomizeLabel("usr_grp_usr_grp") || "loading..."} */}
                    Account:
                  </Typography>
                  <div>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      name="account"
                      size="small"
                      placeholder="Account..."
                      // value={data.costcenter}
                      // onChange={handleData}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              color: "#637381",
                              gap: 5,
                            }}
                          >
                            <Iconify
                              icon="material-symbols:close"
                              onClick={() =>
                                handleCancelClick("MaterialAccount")
                              }
                              style={{ cursor: "pointer" }}
                            />

                            <Iconify
                              icon="tabler:edit"
                              onClick={() => handleEditClick("MaterialAccount")}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        ),
                      }}
                    />
                  </div>
                  {/* {error && (
                        <p
                          style={{
                            color: "red",
                            marginTop: "-5px",
                            fontSize: "14px",
                          }}
                        >
                          {error}
                        </p>
                      )} */}
                </Stack>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div
                className="right"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                  width: "100%",
                  borderRadius: "8px",
                  height: "100%",
                  padding: "16px",
                }}
              >
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 200 }} aria-label="simple table">
                    {/* <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead> */}
                    <TableBody>
                      {/* first Row */}
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ paddingRight: 0 }}
                        >
                          Actual
                        </TableCell>
                        <TableCell align="right" sx={{ paddingLeft: 0 }}>
                          Charge - Credit
                        </TableCell>
                      </TableRow>

                      {/* Second Row */}

                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ paddingRight: 0 }}
                        >
                          Varience
                        </TableCell>
                        <TableCell align="right" sx={{ paddingLeft: 0 }}>
                          (Budget - Actual) (AWA Pr + APR PR + PO)
                        </TableCell>
                      </TableRow>

                      {/* Third Row */}

                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ paddingRight: 0 }}
                        >
                          Approved By
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ paddingLeft: 0 }}
                        ></TableCell>
                      </TableRow>

                      {/* fourst Row */}

                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ paddingRight: 0 }}
                        >
                          Approve Date
                        </TableCell>
                        <TableCell align="right" sx={{ paddingLeft: 0 }}>
                          {format(new Date(), "yyy-MM-dd")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </div>
  );
}

export default BudgetADDDialog;
