// @mui
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import { Link, useNavigate } from "react-router-dom";
// hooks
import { useMockedUser } from "src/hooks/use-mocked-user";
// _mock
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from "src/_mock";
// components
import { useSettingsContext } from "src/components/settings";
// assets
import { SeoIllustration } from "src/assets/illustrations";
//
import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
//import AppWidgetSummary from '../app-widget-summary';
import AppWidgetSummary2 from "../app-widget-summary2";
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';
import { display } from "@mui/system";

// ----------------------------------------------------------------------

export default function DashboardSummary() {
  let site_ID = localStorage.getItem("site_ID");
  let emp_mst_loginID = localStorage.getItem("emp_mst_empl_id");

  const navigate = useNavigate();
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
    <Grid container spacing={3}>
      <Grid xs={12} md={8} style ={{display: "none"}}>
        <AppWelcome
          title={`Welcome back 👋 \n ${user?.displayName}`}
          description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
          img={<SeoIllustration />}
          action={
            <Button variant="contained" color="primary">
              Go Now
            </Button>
          }
        />
      </Grid>

      <Grid xs={12} md={4} style ={{display: "none"}}>
        <AppFeatured list={_appFeatured} />
      </Grid>

      <Grid xs={12} md={4}>
        <AppWidgetSummary2
          title="Total Work Order"
          percent={2.6}
          total={18765}
          chart={{
            series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
          }}
        />
      </Grid>

      <Grid xs={12} md={4}>
        <AppWidgetSummary2
          title="Pending Work Order"
          percent={0.2}
          total={1253}
          chart={{
            colors: [theme.palette.info.light, theme.palette.info.main],
            series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
          }}
        />
      </Grid>

      <Grid xs={12} md={4}>
        <AppWidgetSummary2
          title="Completed Work Order"
          percent={-0.1}
          total={17512}
          chart={{
            colors: [theme.palette.warning.light, theme.palette.warning.main],
            series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <AppCurrentDownload
          title="Work Type"
          chart={{
            series: [
              { label: 'Breakdown ', value: 1326 },
              { label: 'Overhaul', value: 2580 },
              { label: 'Preventive', value: 8569 },
              { label: 'Inspection', value: 6290 },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={8}>
        <AppAreaInstalled
          title="Work Order Trending"
          subheader="(+43%) than last year"
          chart={{
            categories: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            series: [
              {
                year: '2019',
                data: [
                  {
                    name: 'Corrective ',
                    data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                  },
                  {
                    name: 'Preventive',
                    data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                  },
                ],
              },
              {
                year: '2020',
                data: [
                  {
                    name: 'Corrective',
                    data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                  },
                  {
                    name: 'Preventive',
                    data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                  },
                ],
              },
            ],
          }}
        />
      </Grid>

      <Grid xs={12} lg={8}>
        <AppNewInvoice
          title="Critical Work Order"
          tableData={_appInvoices}
          tableLabels={[
            { id: 'id', label: 'WO  No' },
            { id: 'category', label: 'Asset No' },
            { id: 'price', label: 'Status' },
            {id : 'datet', label: 'WO Date'},
            { id: 'desc', label: 'Description' },
            { id: '' },
          ]}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <AppTopRelated title="Top Asset/Machine BreackDown" list={_appRelated} />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        {/* <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} /> */}
        <AppTopAuthors title="Top Work Order Performer" list={_appAuthors} />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
      <Stack spacing={3}>
          <AppWidget
            title="Total Spare Parts Cost"
            total="RM 250,590"
            icon="solar:user-rounded-bold"
            chart={{
              series: 48,
            }}
          />

          <AppWidget
            title="Total Outsource Services Cost"
            total="RM 5,460"
            icon="fluent:mail-24-filled"
            color="info"
            chart={{
              series: 75,
            }}
          />
        </Stack>
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <Stack spacing={3}>
          <AppWidget
            title="Average Maintance Cost"
            total="RM 183,656"
            icon="solar:user-rounded-bold"
            chart={{
              series: 48,
            }}
          />

          <AppWidget
            title="Spare Part Cost"
            total="RM 58,389"
            icon="fluent:mail-24-filled"
            color="info"
            chart={{
              series: 75,
            }}
          />
        </Stack>
      </Grid>
    </Grid>
  </Container>
  );
}
