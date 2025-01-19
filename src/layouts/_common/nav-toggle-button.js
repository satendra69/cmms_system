import PropTypes from "prop-types";
// @mui
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// theme
import { bgBlur } from "src/theme/css";
// components
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
//
import { NAV } from "../config-layout";

// ----------------------------------------------------------------------

export default function NavToggleButton({ sx, ...other }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const lgUp = useResponsive("up", "lg");

  if (!lgUp) {
    return null;
  }

  return (
    <IconButton
      size="small"
      className="MenuToggleBtn"
      onClick={() => {
        const newThemeLayout = settings.themeLayout === "vertical" ? "mini" : "vertical";
        
        // Update the themeLayout setting
        settings.onUpdate("themeLayout", newThemeLayout);
      
        // Store the new themeLayout value in localStorage
        localStorage.setItem("themeLayout", newThemeLayout);
      }}
      sx={{
        p: 0.5,
        top: 32,
        position: "fixed",
        left: NAV.W_VERTICAL - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        "&:hover": {
          bgcolor: "background.default",
        },
        ...sx,
      }}
      {...other}
    >
     
      <Iconify
        width={20}
        icon={
          settings.themeLayout === "vertical"
            ? "pepicons-print:menu"
            : "mdi:menu-close"
        }
      />
    </IconButton>
  );
}

NavToggleButton.propTypes = {
  sx: PropTypes.object,
};
