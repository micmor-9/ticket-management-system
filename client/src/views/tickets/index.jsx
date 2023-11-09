import {Box, Typography, Tooltip, useTheme, Select, MenuItem, IconButton} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../theme";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import Header from "../../components/Header";
import {useNavigate} from "react-router-dom";
import TicketsAPI from "../../api/tickets/ticketsApi";
import {useContext, useEffect, useState} from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {AuthContext} from "../../utils/AuthContext";
import {dataGridStyles} from "../../styles/dataGridStyles";
import id from "./[id]";

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
                if (currentUser.role === "Client") {
                    ticketsData = await TicketsAPI.getTicketsByCustomer(currentUser.email);
                }
                if (currentUser.role === "Expert")
                    ticketsData = await TicketsAPI.getTicketsByExpert(currentUser.id);
                if (currentUser.role === "Manager")
                    ticketsData = await TicketsAPI.getTickets();
                setTickets(ticketsData);
            } catch (error) {

            }
        };

        fetchTickets();
    }, [currentUser.id, currentUser.role, currentUser.email]);
    const handlePriorityChange = async (event, ticketId) => {
        const newPriority = event.target.value;
        try {
            if (currentUser.role === "Manager" || currentUser.role === "Expert")
                await TicketsAPI.updateTicketPriority(ticketId, newPriority);
            const updatedTickets = tickets.map((ticket) =>
                ticket.id === ticketId ? { ...ticket, priority: newPriority } : ticket
            );
            setTickets(updatedTickets);

        } catch (error) {

        }
    };

    const handleStatusChange = async (event, ticketId) => {
        const newStatus = event.target.value;
        try {
            if (currentUser.role === "Manager" || currentUser.role === "Expert")
                await TicketsAPI.updateTicketStatus(ticketId, newStatus);
            const updatedTickets = tickets.map((ticket) =>
                ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
            );
            setTickets(updatedTickets);

        } catch (error) {

        }
    };


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
            renderCell: ({row: {priority,id}}) => {
                if (currentUser.role == "Manager" || currentUser.role == "Expert") {
                    return (
                        <>
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
                            <Select
                                sx={{ height: "40%", width: "40%" }}
                                native
                                onChange={(event) => handlePriorityChange(event,id)}
                            >

                                <option value={"LOW"}>Low</option>
                                <option value={"MEDIUM"}>Medium</option>
                                <option value={"HIGH"}>High</option>
                            </Select>
                        </>
                    );
                }else {
                    return(
                        <>
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
                        </>
                    );
                }
                }
            ,
            },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            cellClassName: "status-column--cell",
            renderCell: ({row: {status,id}}) => {
                if (currentUser.role == "Manager" || currentUser.role =="Expert") {
                    return (
                        <>
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
                            <Select sx={{height: "40%", width: "20%"}}
                                    native
                                    onChange={(event) => handleStatusChange(event,id)}
                            >
                                <option value={"OPEN"}>Open</option>
                                <option value={"IN_PROGRESS"}>In Progress</option>
                                <option value={"CLOSED"}>Closed</option>
                                <option value={"RESOLVED"}>Resolved</option>
                                <option value={"REOPENED"}>Reopened</option>
                            </Select>
                        </>
                    );
                } else {
                    return(
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
                }
                }
            ,
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
        {
            field: "iconview",
            headerName: "Ticket Details",
            flex: 1,
            cellClassName: "inconview-column--cell",
            renderCell: ({ row: id }) => (

                <IconButton>
                    <VisibilityIcon />
                </IconButton>
            ),
        },
        {
            field: "iconmodify",
            headerName: "Modify Ticket",
            flex: 1,
            cellClassName: "iconmodify-column--cell",
            renderCell: ({ row: id }) => (
                <IconButton>
                    <EditIcon />
                </IconButton>
            ),
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
                    onCellClick={(params) => {
                        if (params.field === "iconview") {
                            navigate(`/tickets/${params.id}`);
                        }
                    }}
                    /*onCellClick={(params) => {
                        if (params.field === "iconview") {
                            navigate(`/tickets/${params.id}`);
                        }
                    }}*/
                />
            </Box>
        </Box>
    );
};

export default Tickets;
