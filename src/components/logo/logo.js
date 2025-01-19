import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { forwardRef } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useRouter } from "src/routes/hooks";
// routes
import { RouterLink } from "src/routes/components";
import LogoMain from "../../assets/illustrations/LogoMain.ico";
// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();
  const router = useRouter();
  const navigate = useNavigate();
  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );
  const handleClickRow = useCallback(
    () => {
      //router.push(paths.dashboard.product.edit(id));
      navigate(`/dashboard`);
    },
    [router]
  );
  const logo = (
    <Box
      component="div"
      sx={{
        width: 40,
        height: 40,
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      <img src={LogoMain} alt="logo" onClick={handleClickRow} className="MailLogo"/>
     
      
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return <>{logo}</>;
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
