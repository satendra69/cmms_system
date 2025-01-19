import { Container, Grid, Tabs,Tab, Tooltip, Button } from '@mui/material'
import { Box } from '@mui/system';
import React, { useState } from 'react'
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { RouterLink } from 'src/routes/components';

function WorkFlowSettings() {
  const settings = useSettingsContext();
  const [Tabvalue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
    setTabValue(newValue);
  };

const onClickChange=()=>{

}
const onClickCancel = ()=>{

}


  return (
  
 <Container maxWidth={settings.themeStretch ? false : "lg"}>
            <div
          className="CustomBreadAssetSave asset cb"
          style={{
            position: "-webkit-sticky",
            position: "sticky",
            top: "55px",
            backgroundColor: "white",
            zIndex: 1000,
            borderBottom: "1px solid #00000021",
          }}
        >
          <CustomBreadcrumbs
            heading="System Settings - Work Flow"
            // links={[
            //   {
            //     name: "Employee",
            //   },
            //   { name: RowID ? "Update" : "Create" },
            // ]}
            action={
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <Button
                    component={RouterLink}
                    onClick={onClickChange}
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:save-fill" />}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      marginRight: "10px",
                    }}
                  
                  >
                  Save
                  </Button>
                  <Button
                    variant="soft"
                    color="error"
                    startIcon={<Iconify icon="jam:close" />}
                    onClick={onClickCancel}
                  >
                    Close
                  </Button>
                </div>
              </div>
            }
            
            
            sx={{ mb: { xs: 5, md: 5} }}
          />
          {/* Tabs  Section   */}
       
              <Tabs
                value={Tabvalue}
                onChange={handleChange}
                aria-label="Basic tabs"
                defaultValue={0}
                sx={{
                  background: "#8080800d",
                  borderRadius: "5px",
                  marginTop: "10px",
               
                  "& .MuiTab-root": {
                    textTransform: "none",
                  },
                  "& .Mui-selected": {
                    color: "#000",
                    fontWeight: "bold",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "blue",
                  },
                }}
                className="emp"
              >
                {/* 0 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="carbon:vegetation-asset"
                        style={{ marginRight: "4px" }}
                      />
                      <Tooltip title="Asset Work Flow" arrow placement='top'>
                      Asset Work
                     </Tooltip>
                    </div>
                  }
       
                />

                {/* 1 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="mdi:worker-outline"
                        style={{ marginRight: "4px" }}
                      />
                      <Tooltip title="Work Order Work Flow & Assignment" arrow placement='top'>
                     Work Order
                     </Tooltip>
                    </div>
                  }
      
                />

                {/* 2 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="arcticons:autotools"
                        style={{ marginRight: "4px" }}
                      />
                     
                       <Tooltip title="Material Request Work Flow(MR Status)" arrow placement='top'>
                       Material Request
                       </Tooltip>
                    </div>
                  }
            
                />

                {/* 3 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="material-symbols:order-approve-outline"
                        style={{ marginRight: "4px" }}
                      />
                       <Tooltip title="MR Approval List Cost Center" arrow placement='top'>
                         MR Approval List
                      </Tooltip>
                    </div>
                  }
          
                />

                {/* 4 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="wpf:maintenance"
                        style={{ marginRight: "4px" }}
                      />
                    <Tooltip title=" Purchase Request Work Flow (PR Status)" arrow placement='top'>
                     Purchase Request
                  </Tooltip>
                    </div>
      
                  }
                />

                {/* 5 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="clarity:employee-group-solid"
                        style={{ marginRight: "4px" }}
                      />
                      <Tooltip title=" PR Approver List (Cost Center)" arrow placement='top'>
                       PR Approver List
                    </Tooltip>
                    </div>
                  }
             
                />

                {/* 6 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="ep:location-filled"
                        style={{ marginRight: "4px" }}
                      />

              <Tooltip title=" Purchase Order Work Flow (PO Status)" arrow placement='top'>
                     Purchase Order
                     </Tooltip>
                    </div>
                  }
                />

                {/* 7 */}
                <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="codicon:references"
                        style={{ marginRight: "4px" }}
                      />
                      <Tooltip title="Contract Work Flow (Contract Status)" arrow placement='top'>
                      Contract
                      </Tooltip>
                    </div>
                  }
                />

                  {/* 7 */}
               <Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Iconify
                        icon="codicon:references"
                        style={{ marginRight: "4px" }}
                      />
                       <Tooltip title="Inventory Work Flow (Stock Location)" arrow placement='top'>
                      Inventory
                      </Tooltip>
                    </div>
                  }
                />
              
              </Tabs>


             


              
            
        </div>
    {/* 2 pr approve */}

    <Box
                role="tabpanel"
                hidden={Tabvalue !== 2}
                sx={{ marginTop: "16px" }}
              >
               
              </Box>
              
 </Container>


  )
}

export default WorkFlowSettings