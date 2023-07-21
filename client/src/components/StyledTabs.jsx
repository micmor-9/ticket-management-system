import { Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

export const StyledTabs = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Tabs
      {...props}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
      sx={{
        "& .MuiTabs-indicator": {
          display: "flex",
          justifyContent: "center",
          backgroundColor: "transparent",
        },
        "& .MuiTabs-indicatorSpan": {
          maxWidth: 40,
          width: "100%",
          backgroundColor: colors.greenAccent[400],
        },
      }}
    />
  );
};

export const StyledTab = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Tab
      disableRipple
      {...props}
      sx={{
        textTransform: "none",
        fontWeight: (theme) => theme.typography.fontWeightRegular,
        fontSize: (theme) => theme.typography.pxToRem(15),
        marginRight: (theme) => theme.spacing(1),
        color: colors.grey[400],
        "&.Mui-selected": {
          color: colors.grey[100],
        },
        "&.Mui-focusVisible": {
          backgroundColor: "rgba(100, 95, 228, 0.32)",
        },
      }}
    />
  );
};
