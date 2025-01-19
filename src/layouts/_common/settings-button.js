import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
// components
import Iconify from 'src/components/iconify';
import { UserProfileView } from 'src/sections/user/view';
import { varHover } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function SettingsButton({ sx }) {
  const settings = useSettingsContext();
  
  const handleButtonClick = () => {
    
    settings.onToggle();
    
  };

  return (
    <>
    
    <div className='UserSetting'>
    <Badge
      color="error"
      variant="dot"
      invisible={!settings.canReset}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          top: 8,
          right: 8,
        },
        ...sx,
      }}
    >
      <Box
        component={m.div}
        animate={{
          rotate: [0, settings.open ? 0 : 360],
        }}
        transition={{
          duration: 12,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          aria-label="settings"
         // onClick={settings.onToggle}
          onClick={handleButtonClick}
          sx={{
            width: 40,
            height: 40,
          }}
        >
          <Iconify icon="solar:settings-bold-duotone" width={26} />
        </IconButton>
      </Box>
      
    </Badge>
    </div>
    </>
  );
}

SettingsButton.propTypes = {
  sx: PropTypes.object,
};
