import { useState } from "react";
import { Box, useTheme } from "@mui/material";
import { StyledTabs, StyledTab } from "../../components/StyledTabs";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockUsers } from "../../data/mockUsers";
/* import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"; */
import Header from "../../components/Header";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "surname",
      headerName: "Surname",
      flex: 1,
      cellClassName: "surname-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      cellClassName: "email-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    { field: "specialization", headerName: "Specialization", flex: 1 },
  ];

  const [roleFilter, setRoleFilter] = useState(0);

  const handleRoleFilterChange = (event, newValue) => {
    setRoleFilter(newValue);
  };

  return (
    <Box m="20px">
      <Header title="USERS" subtitle="Manage users" />
      <Box
        m="40px 0 0 0"
        height="70h"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        {/* TODO: change datagrid content according to the selected tab */}
        <StyledTabs value={roleFilter} onChange={handleRoleFilterChange}>
          <StyledTab label="Managers" />
          <StyledTab label="Experts" />
          <StyledTab label="Customers" />
        </StyledTabs>
        <DataGrid
          rows={mockUsers}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default Users;
