import { Container } from '@mui/material';
import React from 'react'
import { useSettingsContext } from 'src/components/settings';

function MainEmp() {

    const settings = useSettingsContext();
  return (
    <Container
    maxWidth={settings.themeStretch ? false : "lg"}
    sx={{ height: "120px" }}
    
  >


    
    <div>MainEmp</div>
    </Container>
  )
}

export default MainEmp