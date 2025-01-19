// @mui
import * as React from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// routes
import PropTypes from "prop-types";
import { paths } from "src/routes/paths";
// _mock
import { _userCards } from "src/_mock";
// components
import Iconify from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { Card, Tab, Tabs, Typography } from "@mui/material";
import AssetDescription from "./Components/AssetDescription";
import AssetLocation from "./Components/AssetLocation";
import AssetSystem from "./Components/AssetSystem";
import { styled } from "@mui/system";
//

// Custom styled components
const CustomTabs = styled(Tabs)({
  borderRadius: "8px",
  // minHeight: '40px',
  padding: "10px",
  "& .MuiTabs-indicator": {
    display: "none",
  },
});

const CustomTab = styled(Tab)({
  textTransform: "none",
  minHeight: "auto",

  fontWeight: 600,
  borderRadius: "8px",

  transition: "0.5s",
  padding: "8px 16px",
  margin: "0 1px",
  "&.Mui-selected": {
    backgroundColor: "rgb(115, 147, 179,0.2)",
    color: "#6082B6",
  },
  "&:hover": {
    backgroundColor: "rgb(115, 147, 179,0.2)",
    color: "#6082B6",
  },
});

function HirechyMain() {
  const settings = useSettingsContext();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <Card className="cardXY">
        <Typography style={{ fontWeight: "bold", fontSize: "20px" }} className="mlmneg">
          Asset Hierarchy
        </Typography>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <CustomTabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <CustomTab label="Asset Description" sx={{ marginLeft: "20px" }} />
            <CustomTab label="Asset Location" style={{ marginLeft: "-10px" }} />
            <CustomTab label="Asset System" style={{ marginLeft: "-10px" }} />
          </CustomTabs>
        </div>
      </Card>
      <Card sx={{ mt: 2, minHeight: "100vh", padding: "40px 8px" }}>
        {value === 0 ? (
          <div>
            <AssetDescription />
          </div>
        ) : value === 1 ? (
          <div>
            <AssetLocation />
          </div>
        ) : (
          <div>
            <AssetSystem />
          </div>
        )}
      </Card>
    </Container>
  );
}

export default HirechyMain;
