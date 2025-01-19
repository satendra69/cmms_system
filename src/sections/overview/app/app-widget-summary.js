import PropTypes from "prop-types";
// @mui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
// utils
import { fNumber, fPercent } from "src/utils/format-number";
// components
import Iconify from "src/components/iconify";
import Chart from "src/components/chart";

// ----------------------------------------------------------------------

export default function AppWidgetSummary({
  title,
  description,
  percent,
  total,
  data,
  sx,
  ...other
}) {
  const theme = useTheme();

  const isTarget = total <= parseInt(data.dsh_mst_critical_value);

  const isCritical =
    total > parseInt(data.dsh_mst_critical_value) &&
    total < parseInt(data.dsh_mst_alert_value);

  const isAlert = total > parseInt(data.dsh_mst_alert_value);

  const chartOptions = {
    // colors: colors.map((colr) => colr[1]),
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: "" },
          { offset: 100, color: "" },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "68%",
        borderRadius: 2,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => "",
        },
      },
      marker: { show: false },
    },
  };
  const iconProps = {
    isTarget: { name: "streamline:target", color: "#008135" },
    isCritical: { name: "streamline:target", color: "#fa6b00" },
    isAlert: { name: "ant-design:alert-outlined", color: "#cd0000" },
    defaultIcon: {
      name: "solar:double-alt-arrow-up-bold-duotone",
      color: "green",
    },
  };
  const { name, color } = isTarget
    ? iconProps.isTarget
    : isCritical
    ? iconProps.isCritical
    : isAlert
    ? iconProps.isAlert
    : iconProps.defaultIcon;
  return (
    <Card
      sx={{ display: "flex", alignItems: "center", p: 3, ...sx }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography className="TITLECLS">{title}</Typography>

        <Typography variant="h3">{fNumber(total)}</Typography>
        <Typography className="DESCLS">{description}</Typography>
      </Box>
      <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
        <Iconify
          width={24}
          // icon={
          //   percent < 0
          //     ? "solar:double-alt-arrow-down-bold-duotone"
          //     : "solar:double-alt-arrow-up-bold-duotone"
          // }
          icon={name}
          sx={{
            mr: 1,
            color: color,
            ...(percent < 0 && {
              color: "error.main",
            }),
          }}
        />
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  data: PropTypes.object,
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
  total: PropTypes.number,
};
