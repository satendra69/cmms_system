import { Card } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { useSettingsContext } from "src/components/settings";
import TopFaultCode from "./TopFaultCode";
import TopCauseCode from "./TopCauseCode";
import TopActionCode from "./TopActionCode";


function Main() {
    const settings = useSettingsContext();
  return (
    <div className="kpi_management">
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <div className="kpi_report" style={{ marginTop: "18px" }}>
          <Card style={{ height: "100vh", padding: "70px 20px" }}>
            {/* <h3 style={{ fontStyle: "bold", marginBottom: "4px" }}>
            Top Ten Categories of Corrective Work Orders
            </h3> */}
            <div style={{marginTop:"-80px"}}>
            <TopFaultCode />
            </div>
            <div style={{marginTop:"-120px"}}>
            <TopCauseCode />
            </div>
            <div style={{marginTop:"-140px"}}>
            <TopActionCode />
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default Main;
