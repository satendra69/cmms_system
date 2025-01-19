import {
  Autocomplete,
  Button,
  Card,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSettingsContext } from "src/components/settings";
import { FaDollarSign } from "react-icons/fa";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Container from "@mui/material/Container";
import { FcImport, FcSettings } from "react-icons/fc";

import Iconify from "src/components/iconify";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { LuLayoutDashboard } from "react-icons/lu";
import DefaultTabMaster from "./DefaultTabMaster";
import EmailMaster from "./EmailMaster";
import SettingsMaster from "./SettingsMaster";
import { HiOutlineMail } from "react-icons/hi";
function SystemDefaultSetup() {
  const [Tabvalue, setTabValue] = useState(0);
  const settings = useSettingsContext();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Grid container spacing={0}>
        <Grid xs={12} md={12} className="CompleteDiv">
          <Card sx={{ p: 3 }}>
            <div
            // style={{
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "space-between",
            // }}
            >
              <Tabs
                value={Tabvalue}
                onChange={handleChange}
                aria-label="Basic tabs"
                defaultValue={0}
              >
                <Tab
                  label={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <LuLayoutDashboard size={24} color="gray" />
                      Default
                    </div>
                  }
                />

                <Tab
                  label={
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 3 }}
                    >
                      <FcSettings size={24} />
                      Settings
                    </div>
                  }
                />
                <Tab
                  label={
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 3 }}
                    >
                      <HiOutlineMail size={28} />
                      Email
                    </div>
                  }
                />
              </Tabs>
            </div>

            {Tabvalue === 0 && <DefaultTabMaster />}
            {Tabvalue === 1 && <SettingsMaster />}
            {Tabvalue === 2 && <EmailMaster />}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SystemDefaultSetup;
