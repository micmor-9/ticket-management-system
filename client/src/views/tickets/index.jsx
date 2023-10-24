import {Box, Typography, Tooltip, useTheme} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../theme";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import Header from "../../components/Header";
import {useNavigate} from "react-router-dom";
import TicketsAPI from "../../api/tickets/ticketsApi";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../utils/AuthContext";
import {dataGridStyles} from "../../styles/dataGridStyles";

const Tickets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [currentUser] = useContext(AuthContext);
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                let ticketsData = [];
                    console.log(currentUser.role + " " + currentUser.id + " " + currentUser.email);
                if (currentUser.role === "Client"){
                    ticketsData = await TicketsAPI.getTicketsByCustomer(currentUser.email);}
                if (currentUser.role === "Expert")
                    ticketsData = await TicketsAPI.getTicketsByExpert(currentUser.id);
                if (currentUser.role === "Manager")
                    ticketsData = await TicketsAPI.getTickets();
                setTickets(ticketsData);
            } catch (error) {
                // Gestisci gli errori, ad esempio mostrando un messaggio di errore
            }
        };

        fetchTickets();
    }, [currentUser.id, currentUser.role]);

    const columns = [
        {field: "id", headerName: "ID"},
        {
            field: "creationTimestamp",
            headerName: "Creation Date",
            flex: 1,
            type: "dateTime",
            valueGetter: ({value}) => value && new Date(value),
            cellClassName: "creationTimestamp-column--cell",
        },
        {
            field: "issueDescription",
            headerName: "Issue Description",
            flex: 1,
            cellClassName: "issueDescription-column--cell",
        },
        {
            field: "priority",
            headerName: "Priority",
            cellClassName: "priority-column--cell",
            renderCell: ({row: {priority}}) => {
                return (
                    <Box
                        width="60%"
                        m="0 auto 0 0"
                        p="5px"
                        display="flex"
                        backgroundColor={"transparent"}
                    >
                        <Tooltip
                            title={
                                priority === "LOW"
                                    ? "Low"
                                    : priority === "MEDIUM"
                                        ? "Medium"
                                        : "High"
                            }
                        >
                            <Typography color={colors.priority[priority]}>
                                {priority === "LOW" ? (
                                    <SouthOutlinedIcon/>
                                ) : priority === "MEDIUM" ? (
                                    <EastOutlinedIcon/>
                                ) : (
                                    <NorthOutlinedIcon/>
                                )}
                            </Typography>
                        </Tooltip>
                    </Box>
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            cellClassName: "status-column--cell",
            renderCell: ({row: {status}}) => {
                return (
                    <Box
                        width="60%"
                        m="0 auto 0 0"
                        p="5px"
                        display="flex"
                        justifyContent={"center"}
                        backgroundColor={colors.status[status]}
                        borderRadius={"5px"}
                    >
                        <Typography color={colors.primary[400]}>
                            {status.replace("_", " ")}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: "expert",
            headerName: "Expert",
            flex: 1,
            cellClassName: "expert-column--cell",
            valueGetter: ({value}) => value && value.name + " " + value.surname,
        },
        {
            field: "product",
            headerName: "Product",
            flex: 1,
            cellClassName: "product-column--cell",
            valueGetter: ({value}) => value && value.name,
        },
        {
            field: "customer",
            headerName: "Customer",
            flex: 1,
            cellClassName: "customer-column--cell",
            valueGetter: ({value}) => value && value.name + " " + value.surname,
        },
    ];

    return (
        <Box m="20px">
            <Header title="TICKETS" subtitle="Manage tickets"/>
            <Box m="40px 0 0 0" sx={dataGridStyles(theme)}>
                <DataGrid
                    rows={tickets}
                    columns={columns}
                    loading={!tickets.length}
                    getRowId={(row) => row.id}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    sx={{
                        height: "70vh",
                    }}
                    onRowClick={(row) => navigate(`/tickets/${row.id}`)}
                />
            </Box>
        </Box>
    );
};

export default Tickets;
