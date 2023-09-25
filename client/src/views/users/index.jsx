import { useContext, useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { StyledTabs, StyledTab } from "../../components/StyledTabs";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockUsers } from "../../data/mockUsers";
/* import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined"; */
import Header from "../../components/Header";
import { AuthContext } from "../../utils/AuthContext";
import ProfilesAPI from "../../api/profiles/profilesApi";


const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentUser] = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let usersData = [];
        let managersData = [];
        let expertsData = [];
        console.log(currentUser.role);
        if (currentUser.role === "Manager" || currentUser.role === "Expert") {
          usersData = await ProfilesAPI.getAllCustomers();
          managersData = await ProfilesAPI.getAllManagers();
          expertsData = await ProfilesAPI.getAllExperts();
        }
        setUsers(usersData);
        setExperts(expertsData);
        setManagers(managersData);
      } catch (error) {
        // Gestisci gli errori, ad esempio mostrando un messaggio di errore
      }
    };
    fetchUsers();
  }, [currentUser.role, currentUser.id]);

  const [roleFilter, setRoleFilter] = useState(0);
  
  const columns = getUsersColumns(roleFilter);

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
          <StyledTab label="Customers" />
          <StyledTab label="Experts" />
          <StyledTab label="Managers" />
        </StyledTabs>
        <DataGrid
          rows={
            roleFilter === 0
              ? users
              : roleFilter === 1
              ? experts
              : managers
          }
          columns={columns}
          loading={!users.length}
          getRowId={(row) => row.id}
          slots={{
            toolbar: GridToolbar,
          }}
          sx={{
            height: "vh",
          }}
        />
      </Box>
    </Box>
  );
};

const getUsersColumns = (roleFilter) => {
  let columns = [
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
  ];
  if (roleFilter === 2) {
    columns.push({
        field: "managedArea",
        headerName: "Managed Area",
        flex: 1,
        cellClassName: "managed_area-column--cell",
      })
  } else if (roleFilter === 1) {
    columns.push({
      field: "specialization",
      headerName: "Specialization",
      flex: 1,
      cellClassName: "specialization-column--cell",
    });
  }
  return columns; 
};

export default Users;
