import {
    Box,
    Typography,
    useTheme,
    Select,
    MenuItem,
    FormControl,
    Tooltip,
} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {tokens} from "../../theme";
import Header from "../../components/Header";
import {useNavigate} from "react-router-dom";
import TicketsAPI from "../../api/tickets/ticketsApi";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../utils/AuthContext";
import {dataGridStyles} from "../../styles/dataGridStyles";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import AddIcon from "@mui/icons-material/Add";
import HeaderActions from "../../components/HeaderActions";
import {useDialog} from "../../utils/DialogContext";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ProfilesAPI from "../../api/profiles/profilesApi";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {SentimentDissatisfiedOutlined} from "@mui/icons-material";

const Tickets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [tickets, setTickets] = useState([]);
    const [experts, setExperts] = useState([]);
    const [ticketUpdated, setTicketUpdated] = useState(false);
    const [currentUser] = useContext(AuthContext);
    const navigate = useNavigate();
    const {showDialog} = useDialog();
    const [modify, setModify] = useState({id: "", active: false});

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                let ticketsData = [];
                let expertsData = [];
                if (currentUser.role === "Client") {
                    ticketsData = await TicketsAPI.getTicketsByCustomer(
                        currentUser.email
                    );
                    expertsData = ticketsData.map((ticket) => ticket.expert);
                }
                if (currentUser.role === "Expert") {
                    ticketsData = await TicketsAPI.getTicketsByExpert(currentUser.id);
                    expertsData = await ProfilesAPI.getAllExperts();
                }
                if (currentUser.role === "Manager") {
                    ticketsData = await TicketsAPI.getTickets();
                    expertsData = await ProfilesAPI.getAllExperts();
                }
                setExperts(expertsData);
                setTickets(ticketsData);
            } catch (error) {
                showDialog("Error while fetching tickets", "error");
            }
        };
        fetchTickets().then(() => {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        });
    }, [
        currentUser.id,
        currentUser.role,
        currentUser.email,
        ticketUpdated,
        showDialog,
    ]);

    const handleExpertChange = (event, row) => {
        const selectedExpertName = event.target.value;
        const expertId = selectedExpertName.split("(")[1].split(")")[0];

        const ticketId = row.id;

        TicketsAPI.updateTicketExpert(ticketId, expertId)
            .then((response) => {
                setTicketUpdated(() => !ticketUpdated);
                showDialog("Ticket Expert updated successfully", "success");
            })
            .catch((error) => {
                showDialog("Error while updating ticket", "error");
            });
    };

    const handlePriorityChange = async (event, ticketId) => {
        const newPriority = event.target.value;

        TicketsAPI.updateTicketPriority(ticketId, newPriority)
            .then(() => {
                setTicketUpdated(() => !ticketUpdated);
                showDialog("Ticket Priority updated successfully", "success");
            })
            .catch((error) => {
                showDialog("Error while updating ticket", "error");
            });
    };

    const handleStatusChange = async (event, ticketId) => {
        const newStatus = event.target.value;
        const checkTicket = tickets.find((ticket) => ticket.id === ticketId);
        if (checkTicket.expert) {
            TicketsAPI.updateTicketStatus(ticketId, newStatus)
                .then(() => {
                    setTicketUpdated(() => !ticketUpdated);
                    showDialog("Ticket Status updated successfully", "success");
                })
                .catch((error) => {
                    showDialog("Error while updating ticket", "error");
                });
        }
    };

    const columns = [
        {field: "id", headerName: "ID", flex: 0.2},
        {
            field: "creationTimestamp",
            headerName: "Creation Date",
            flex: 1,
            type: "date",
            valueGetter: ({value}) => value && new Date(value),
            cellClassName: "creationTimestamp-column--cell",
        },
        {
            field: "issueDescription",
            headerName: "Issue Description",
            flex: 0.7,
            cellClassName: "issueDescription-column--cell",
        },
        {
            field: "priority",
            headerName: "Priority",
            flex: 0.8,
            cellClassName: "priority-column--cell",
            renderCell: ({row}) => {
                if (currentUser.role === "Manager" || currentUser.role === "Expert") {
                    return (
                        <>
                            <Box width="20%" m="0 25px 0 0" p="5px">
                                <PriorityBadge priority={row.priority}/>
                            </Box>
                            {modify.active && modify.id === row.id && (
                                <Select
                                    sx={{
                                        width: "30%",
                                        height: 30,
                                        borderRadius: 6,
                                        color: "transparent",
                                    }}
                                    onChange={(event) => handlePriorityChange(event, row.id)}
                                    value={row.priority ? row.priority : ""}
                                >
                                    <MenuItem value={"LOW"}>LOW</MenuItem>
                                    <MenuItem value={"MEDIUM"}>MEDIUM</MenuItem>
                                    <MenuItem value={"HIGH"}>HIGH</MenuItem>
                                </Select>
                            )}
                        </>
                    );
                } else {
                    return <PriorityBadge priority={row.priority}/>;
                }
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1.2,
            cellClassName: "status-column--cell",
            renderCell: ({row: {status, id}}) => {
                if (currentUser.role === "Manager" || currentUser.role === "Expert") {
                    return (
                        <>
                            <Box
                                width="60%"
                                m="0 25px 0 0"
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
                            {modify.active && modify.id === id && (
                                <Select
                                    sx={{
                                        width: "20%",
                                        height: 30,
                                        borderRadius: 6,
                                        color: "transparent",
                                    }}
                                    value={status}
                                    onChange={(event) => handleStatusChange(event, id)}
                                >
                                    <MenuItem value={"OPEN"}>Open</MenuItem>
                                    <MenuItem value={"IN_PROGRESS"}>In Progress</MenuItem>
                                    <MenuItem value={"CLOSED"}>Closed</MenuItem>
                                    <MenuItem value={"RESOLVED"}>Resolved</MenuItem>
                                    <MenuItem value={"REOPENED"}>Reopened</MenuItem>
                                </Select>
                            )}
                        </>
                    );
                } else {
                    return <StatusBadge statusValue={status}/>;
                }
            },
        },
        {
            field: "expert",
            headerName: "Expert",
            flex: 1.2,
            cellClassName: "expert-column--cell",
            renderCell: ({row}) => {
                if (currentUser.role === "Manager" || currentUser.role === "Expert") {
                    return (
                        <FormControl
                            fullWidth
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "transparent",
                                    },
                                },
                            }}
                        >
                            {modify.active && modify.id === row.id ? (
                                <Select
                                    onChange={(event) => handleExpertChange(event, row)}
                                    disabled={
                                        row.status === "RESOLVED" || row.status === "CLOSED"
                                    }
                                    value={
                                        row.expert
                                            ? row.expert.name +
                                            " " +
                                            row.expert.surname +
                                            " (" +
                                            row.expert.id +
                                            ")"
                                            : ""
                                    }
                                >
                                    {experts
                                        .filter((expert) => expert.specialization === row.category)
                                        .map((expert) => (
                                            <MenuItem
                                                key={expert.id}
                                                value={
                                                    expert.name +
                                                    " " +
                                                    expert.surname +
                                                    " (" +
                                                    expert.id +
                                                    ")"
                                                }
                                            >
                                                {expert.name +
                                                    " " +
                                                    expert.surname +
                                                    " (" +
                                                    expert.id +
                                                    ")"}
                                            </MenuItem>
                                        ))}
                                </Select>
                            ) : (
                                <Typography>
                                    {row.expert
                                        ? row.expert.name + " " + row.expert.surname
                                        : "Not assigned yet"}
                                </Typography>
                            )}
                        </FormControl>
                    );
                } else {
                    return (
                        <Typography>
                            {row.expert ? row.expert.name + " " + row.expert.surname : ""}
                        </Typography>
                    );
                }
            },
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0.7,
            cellClassName: "category-column--cell",
        },
        {
            field: "order",
            headerName: "Product",
            flex: 1,
            cellClassName: "product-column--cell",
            valueGetter: ({value}) => value && value.product.description,
        },
        {
            field: "customer",
            headerName: "Customer",
            flex: 0.7,
            cellClassName: "customer-column--cell",
            valueGetter: ({value}) => value && value.name + " " + value.surname,
        },
        {
            field: "view",
            headerName: "View Details",
            flex: 0.5,
            cellClassName: "view-column--cell",
            renderCell: ({row}) => {
                return (
                    <Button
                        onClick={() => {
                            navigate(`/tickets/${row.id}`);
                        }}>
                        <VisibilityOutlinedIcon
                            fontSize="small"
                            sx={{color: colors.greenAccent[400]}}
                        />
                    </Button>
                );
            },
        },
    ];

    if (currentUser.role === "Manager" || currentUser.role === "Expert") {
        columns.push({
            field: "action",
            headerName: "Action",
            flex: 0.5,
            cellClassName: "action-column--cell",
            renderCell: ({row}) => {
                return (
                    <Button sx={{color: colors.greenAccent[400]}}
                            onClick={() => {
                                setModify({id: row.id, active: !modify.active});
                            }}
                    >
                        {modify.active === false && (
                            <Tooltip title="Modify Ticket">
                                <CreateOutlinedIcon
                                    fontSize="small"
                                />
                            </Tooltip>
                        )}
                        {modify.active === true && modify.id === row.id && (
                            <Tooltip title="Save Changes">
                                <CheckCircleOutlineIcon
                                    fontSize="small"
                                    onClick={() => setModify({id: "", active: !modify.active})}
                                />
                            </Tooltip>
                        )}
                    </Button>
                );
            },
        });
    }

    return (
        <Box m="20px">
            <Header title="TICKETS" subtitle="Manage tickets">
                {(currentUser.role === "Client" || currentUser.role === "Manager") && (
                    <HeaderActions>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon/>}
                            onClick={() => {
                                navigate(`/tickets/create`);
                            }}
                            sx={{marginLeft: "15px"}}
                        >
                            New Ticket
                        </Button>
                    </HeaderActions>)}
            </Header>

            {isLoading ?
                (
                    <Box m="40px 0 0 0" sx={dataGridStyles(theme)}>
                        <DataGrid
                            rows={[]}
                            columns={columns}
                            loading={isLoading}
                            getRowId={(row) => row.id}
                            slots={{
                                toolbar: GridToolbar,
                            }}
                            sx={{
                                height: "70vh",
                                "& .MuiSelect-select": {
                                    whiteSpace: "break-spaces !important",
                                },
                            }}
                            initialState={{
                                sorting: {
                                    sortModel: [{field: "creationTimestamp", sort: "desc"}],
                                },
                            }}
                        />
                    </Box>
                ) : (!isLoading && tickets.length > 0) ? (
                    <Box m="40px 0 0 0" sx={dataGridStyles(theme)}>
                        <DataGrid
                            rows={tickets}
                            columns={columns}
                            loading={isLoading}
                            getRowId={(row) => row.id}
                            slots={{
                                toolbar: GridToolbar,
                            }}
                            sx={{
                                height: "70vh",
                                "& .MuiSelect-select": {
                                    whiteSpace: "break-spaces !important",
                                },
                            }}
                            initialState={{
                                sorting: {
                                    sortModel: [{field: "creationTimestamp", sort: "desc"}],
                                },
                            }}
                        />
                    </Box>
                ) : (!isLoading && tickets.length === 0) ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="400px"
                    >
                        <SentimentDissatisfiedOutlined
                            style={{fontSize: 80, color: "#ff4081"}}
                        />
                        <Typography variant="h3" color="textSecondary">
                            No tickets found
                        </Typography>
                        <Box mt={2}>
                            <Typography variant="body" color="textSecondary">
                                Looks like there are no tickets available.
                            </Typography>
                        </Box>
                    </Box>
                ) : null}
        </Box>
    );
};
export default Tickets;
