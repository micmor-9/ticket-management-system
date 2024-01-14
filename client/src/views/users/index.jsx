import {useContext, useEffect, useState} from "react";
import {Box, Button, useTheme} from "@mui/material";
import {StyledTabs, StyledTab} from "../../components/StyledTabs";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Header from "../../components/Header";
import {AuthContext} from "../../utils/AuthContext";
import ProfilesAPI from "../../api/profiles/profilesApi";
import {dataGridStyles} from "../../styles/dataGridStyles";
import {useNavigate} from "react-router-dom";
import HeaderActions from "../../components/HeaderActions";
import AddIcon from "@mui/icons-material/Add";
import {tokens} from "../../theme";
import {useDialog} from "../../utils/DialogContext";


const Users = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentUser] = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [experts, setExperts] = useState([]);
    const navigate = useNavigate();
    const {showDialog} = useDialog();

    const userRole = {
        Customer: 0,
        Expert: 1,
        Manager: 2,
    };
    const [roleFilter, setRoleFilter] = useState(userRole.Customer);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let usersData = [];
                let managersData = [];
                let expertsData = [];
                if (currentUser.role === "Manager" || currentUser.role === "Expert") {
                    usersData = await ProfilesAPI.getAllCustomers();
                    managersData = await ProfilesAPI.getAllManagers();
                    expertsData = await ProfilesAPI.getAllExperts();
                }
                setUsers(usersData);
                setExperts(expertsData);
                setManagers(managersData);
            } catch (error) {
                showDialog("Error while fetching users", "error");
            }
        };
        fetchUsers();
    }, [currentUser.role, currentUser.id]);


    const columns = getUsersColumns(roleFilter, userRole);

    const handleRoleFilterChange = (event, newValue) => {
        setRoleFilter(newValue);
    };

    return (
        <Box m="20px" sx={{position: "relative"}}>
            <Header title="USERS" subtitle="Manage users">
                {currentUser.role === "Manager" && (<HeaderActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon/>}
                        onClick={() => {

                            switch (roleFilter) {
                                case userRole.Customer:
                                    navigate("/users/create");
                                    break;
                                case userRole.Expert:
                                    navigate("/experts/create");
                                    break;
                                default:
                                    break;
                            }
                        }}
                        sx={{
                            marginLeft: "15px",
                        }}
                    >
                        {roleFilter === userRole.Expert ? "New Expert" : "New User"}
                        </Button>
                    </HeaderActions>)
                }
            </Header>

            <Box height="70vh" sx={dataGridStyles(theme)}>
                <StyledTabs value={roleFilter} onChange={handleRoleFilterChange}>
                    <StyledTab label="Customers"/>
                    <StyledTab label="Experts"/>
                    <StyledTab label="Managers"/>
                </StyledTabs>
                <DataGrid
                    rows={
                        roleFilter === userRole.Customer
                            ? users
                            : roleFilter === userRole.Expert
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
                        height: "70vh",
                    }}
                />
            </Box>
        </Box>
    );
};

const getUsersColumns = (roleFilter, userRole) => {
    let columns = [
        {field: "id", headerName: "ID"},
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
            field: "contact",
            headerName: "Contact",
            flex: 1,
            cellClassName: "contact-column--cell",

        },
        {
            field: "address",
            headerName: "Address",
            flex: 1,
            cellClassName: "address2-column--cell",
            valueGetter: (params) => {

                if (params.row.address2) {
                    return `${params.row.address1}, ${params.row.address2}`;
                }
                return params.row.address1;
            },
        }
    ];
    if (roleFilter === userRole.Manager) {
        columns.push({
            field: "managedArea",
            headerName: "Managed Area",
            flex: 1,
            cellClassName: "managed_area-column--cell",
        });
    } else if (roleFilter === userRole.Expert) {
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
