import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Icon, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { FaUserFriends } from 'react-icons/fa'
import Iconify from 'src/components/iconify'
import Template from './Template'
import httpCommon from 'src/http-common'

function TemplateDialog({open,handleClose}) {

const [defaultSettings,setDefaultSettings] = useState({
    privalgeTemp:[]

})

  // Privalge Template DRP
  const [privalageDrp, setPrivalageDrp] = useState([{}]);
  const [selectedPrivalage, setSelectedPrivalage] = useState("");


  // fetchDefalut Settings
  const fetchDefalutSettings = async () => {
    try {
      const response = await httpCommon.get("/get_user_default_settigs.php");

      if (response.data) {
        const data = response.data.data;
        if (data) {
          setDefaultSettings((prevState) => ({
            ...prevState,
            privalgeTemp: data.privilege,
          }));
        }

        const privalage = data.privilege;
        

        // Formatted privalge
        const formattedPrivalge = privalage.map((item) => ({
          label: `${item.template_cd} : ${item.template_descs}`,
          value: `${item.template_cd} : ${item.template_descs}`,
        }));
        setPrivalageDrp(formattedPrivalge);
      }
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  };

useEffect(()=>{
    fetchDefalutSettings();
},[])




  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            width: '50vw',
            height: '50vh',
            maxWidth: 'none', 
            maxHeight: 'none', 
          },
        }}
      >
      <DialogTitle
        id="alert-dialog-title"
        style={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}
      >
        <div style={{display:"flex",alignItems:"center",gap:2}}>
        <Iconify icon="bi:menu-up" height="22px" width="22px" />
       Apply Menu Template
 
        </div>
        <div style={{cursor:"pointer"}} onClick={handleClose}>
        <IconButton color="error">
        <Iconify icon="system-uicons:cross-circle" />
        </IconButton>
        </div>
      </DialogTitle>
      <Divider />
        <DialogContent>
       <Template privalageDrp={privalageDrp} selectedPrivalage={selectedPrivalage} setSelectedPrivalage={setSelectedPrivalage} />
        </DialogContent>

        <Divider style={{ marginTop: "10px" }} />
        <DialogActions>
          
        </DialogActions>
      </Dialog>
  )
}

export default TemplateDialog