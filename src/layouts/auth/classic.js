import PropTypes from "prop-types";
// @mui
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
// auth
import { useAuthContext } from "src/auth/hooks";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
import { useMediaQuery } from '@mui/material';
// theme
import { bgGradient } from "src/theme/css";
// components
import Logo from "src/components/logo";
import BannerImg from "../../assets/illustrations/Banner_img.png";
// ----------------------------------------------------------------------

export default function AuthClassicLayout({ children, image, title }) {
  const { method } = useAuthContext();

  const theme = useTheme();

  const mdUp = useResponsive("up", "md");
  const currentYear = new Date().getFullYear();

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: "absolute",
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: "auto",
        maxWidth: 680,
        px: { xs: 2, md: 8 },
        pt: { xs: 15, md: 20 },
        pb: { xs: 15, md: 0 },
      }}
      className="renderLoginForm"
    >
      
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === "light" ? 0.88 : 0.94
          ),
          imgUrl: "/assets/background/overlay_2.jpg",
        }),
      }}
    >
      <Box
        component="img"
        alt="auth"
        src={BannerImg || "/assets/illustrations/illustration_dashboard.png"}
        sx={{
          maxWidth: {
            xs: 480,
            lg: 460,
            xl: 520,
          },
        }}
      />
    </Stack>
  );
  function Footer() {
    return (
      <Box
        sx={{
          backgroundColor: "background.paper", // Background color for your footer
          padding: 2,
          textAlign: "center",
          position: "relative",
          bottom: 0,
          width: "100%",
        }}
      >
        {/* Footer content */}
        <p className="CSHREF">
          &copy; {currentYear} Evantage Solution Sdn. Bhd. v2.21.3.{" "}
          <a href="https://evantage.com.my/" target="_blank" rel="noreferrer">
            Go to Website
          </a>
        </p>
      </Box>
    );
  }

  return (
    <>
    <div className="dmmd">
      <Stack
        component="main"
        direction="row"
        // sx={{
        //   minHeight: "100vh",
        // }}
      >
        
          {/* {renderLogo} */}
          {mdUp && renderSection}
          <Box
            flexGrow={1} // Allow main content to expand to fill available space
            sx={{
              position: "relative", // Make the container relative for absolute positioning of the footer
            }}
          >
            {renderContent}
          </Box>
       
       
      </Stack>
      <Footer />
      </div>
    
    </>
  );
}

AuthClassicLayout.propTypes = {
  children: PropTypes.node,
  image: PropTypes.string,
  title: PropTypes.string,
};
