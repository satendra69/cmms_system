// @mui
import React, { useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
// theme
import { paper } from 'src/theme/css';
//
import Iconify from '../../iconify';
import Scrollbar from '../../scrollbar';
//
import { useSettingsContext } from '../context';
import BaseOptions from './base-option';
import LayoutOptions from './layout-options';
import PresetsOptions from './presets-options';
import StretchOptions from './stretch-options';
import FullScreenOption from './fullscreen-option';

// ----------------------------------------------------------------------

export default function SettingsDrawer() {
  const theme = useTheme();

  const settings = useSettingsContext();
  
  const classNamesToHide = ['.hideProfleNav', '.hideProfleNav1'];

  const labelStyles = {
    mb: 1.5,
    color: 'text.disabled',
    fontWeight: 'fontWeightSemiBold',
  };

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Settings
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={settings.onReset} className="ResetSettingBtn">
          <Badge color="error" variant="dot" invisible={!settings.canReset}>
            <Iconify icon="solar:restart-bold" className="ResetSettingBtnIconfy"/>
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={settings.onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderMode = (
    <div>
      <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
        Mode
      </Typography>

      <BaseOptions
        value={settings.themeMode}
        onChange={(newValue) => settings.onUpdate('themeMode', newValue)}
       // options={['light', 'dark']}
       options={['light']}
       icons={['sun']}
       // icons={['sun', 'moon']}
      />
    </div>
  );

  const renderContrast = (
    <div>
      <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
        Contrast
      </Typography>

      <BaseOptions
        value={settings.themeContrast}
        onChange={(newValue) => settings.onUpdate('themeContrast', newValue)}
        options={['default', 'bold']}
        icons={['contrast', 'contrast_bold']}
      />
    </div>
  );

  const renderDirection = (
    <div>
      <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
        Direction
      </Typography>

      <BaseOptions
        value={settings.themeDirection}
        onChange={(newValue) => settings.onUpdate('themeDirection', newValue)}
        options={['ltr', 'rtl']}
        icons={['align_left', 'align_right']}
      />
    </div>
  );

  const renderLayout = (
    <div>
      <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
        Layout
      </Typography>

      <LayoutOptions
        value={settings.themeLayout}
        onChange={(newValue) => settings.onUpdate('themeLayout', newValue)}
       // options={['vertical', 'horizontal', 'mini']}
       options={['vertical',  'mini']}
      />
    </div>
  );

  const renderStretch = (
    <div>
      <Typography
        variant="caption"
        component="div"
        sx={{
          ...labelStyles,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        Stretch
        <Tooltip title="Only available at large resolutions > 1600px (xl)">
          <Iconify icon="eva:info-outline" width={16} sx={{ ml: 0.5 }} />
        </Tooltip>
      </Typography>

      <StretchOptions
        value={settings.themeStretch}
        onChange={() => settings.onUpdate('themeStretch', !settings.themeStretch)}
      />
    </div>
  );

  const renderPresets = (
    <div>
      <Typography variant="caption" component="div" sx={{ ...labelStyles }}>
        Presets
      </Typography>

      <PresetsOptions
        value={settings.themeColorPresets}
        onChange={(newValue) => settings.onUpdate('themeColorPresets', newValue)}
      />
    </div>
  );

  useEffect(() => {
    // Function to toggle the visibility of elements with specified class names
    const toggleElementsVisibility = () => {
      classNamesToHide.forEach(className => {
        const elements = document.querySelectorAll(className);
        elements.forEach(element => {
          if (settings.open) {
            element.style.display = 'none'; // Hide elements
          } else {
            element.style.display = 'block'; // Show elements
          }
        });
      });
    };
  
    toggleElementsVisibility(); // Initial execution
  }, [settings.open]);
  return (
    <Drawer
      anchor="right"
      open={settings.open}
      onClose={settings.onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          ...paper({ theme, bgcolor: theme.palette.background.default }),
          width: 280,
        },
      }}
    >
       <div className={settings.open ? 'showWhenDrawerOpen' : 'hideWhenDrawerOpen'}>
      
      </div>
      {renderHead}
      <Divider sx={{ borderStyle: 'dashed' }} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {renderMode}

          {renderContrast}

          {/* {renderDirection} */}

          {renderLayout}

          {renderStretch}

          {renderPresets}
        </Stack>
      </Scrollbar>

      <FullScreenOption />
    </Drawer>
  );
}
