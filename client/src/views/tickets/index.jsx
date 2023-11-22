import {
  Box,
  Typography,
  Tooltip,
  useTheme,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import SouthOutlinedIcon from "@mui/icons-material/SouthOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import TicketsAPI from "../../api/tickets/ticketsApi";
import { useEffect, useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { dataGridStyles } from "../../styles/dataGridStyles";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import AddIcon from "@mui/icons-material/Add";
import HeaderActions from "../../components/HeaderActions";
import { useDialog } from "../../utils/DialogContext";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ProfilesAPI from "../../api/profiles/profilesApi";
import Button from "@mui/material/Button";

const Tickets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tickets, setTickets] = useState([]);
  const [experts, setExperts] = useState([]);
  const [ticketUpdated, setTicketUpdated] = useState(false);
  const [currentUser] = useAuth();
  const navigate = useNavigate();
  const { showDialog } = useDialog();

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
        if (currentUser.role === "Expert")
          ticketsData = await TicketsAPI.getTicketsByExpert(currentUser.id);
        if (currentUser.role === "Manager") {
          ticketsData = await TicketsAPI.getTickets();
          expertsData = await ProfilesAPI.getAllExperts();
        }
        console.log("ticketsData", ticketsData);
        setExperts(expertsData);
        setTickets(ticketsData);
      } catch (error) {
        showDialog("Error while fetching tickets", "error");
      }
    };
    fetchTickets();
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

    const ticketToUpdate = {
      id: row.id,
      creationTimestamp: row.creationTimestamp,
      issueDescription: row.issueDescription,
      priority: row.priority,
      status: row.status,
      expertId: expertId,
      productId: row.product.id,
      customerId: row.customer.id,
      category: row.category,
    };

    TicketsAPI.updateTicketExpert(ticketToUpdate.id, ticketToUpdate.expertId)
      .then((response) => {
        console.log("Ticket aggiornato con successo");
        setTicketUpdated(() => !ticketUpdated);
      })
      .catch((error) => {
        console.error("Errore nell'aggiornamento del ticket", error);
        alert("Errore nell'aggiornamento del ticket");
      });
  };

  const handlePriorityChange = async (event, ticketId) => {
    const newPriority = event.target.value;
    try {
      if (currentUser.role === "Manager" || currentUser.role === "Expert")
        await TicketsAPI.updateTicketPriority(ticketId, newPriority);
      const updatedTickets = tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, priority: newPriority } : ticket
      );
      setTickets(updatedTickets);
    } catch (error) {}
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
    } catch (error) {}
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "creationTimestamp",
      headerName: "Creation Date",
      flex: 1,
      type: "date",
      valueGetter: ({ value }) => value && new Date(value),
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
      flex: 0.5,
      cellClassName: "priority-column--cell",
      renderCell: ({ row: { priority, id } }) => {
        if (currentUser.role === "Manager" || currentUser.role === "Expert") {
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
                      <SouthOutlinedIcon />
                    ) : priority === "MEDIUM" ? (
                      <EastOutlinedIcon />
                    ) : (
                      <NorthOutlinedIcon />
                    )}
                  </Typography>
                </Tooltip>
              </Box>
              <Select
                sx={{ height: "40%", width: "40%" }}
                native
                onChange={(event) => handlePriorityChange(event, id)}
              >
                <option value={"LOW"}>Low</option>
                <option value={"MEDIUM"}>Medium</option>
                <option value={"HIGH"}>High</option>
              </Select>
            </>
          );
        } else {
          return <PriorityBadge priority={priority} />;
        }
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellClassName: "status-column--cell",
      renderCell: ({ row: { status, id } }) => {
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
              <Select
                sx={{ height: "40%", width: "20%" }}
                native
                onChange={(event) => handleStatusChange(event, id)}
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
          return <StatusBadge statusValue={status} />;
        }
      },
    },
    {
      field: "expert",
      headerName: "Expert",
      flex: 1,
      cellClassName: "expert-column--cell",
      renderCell: ({ row }) => {
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
            {currentUser.role === "Client" || currentUser.role === "Expert" ? (
                row.expert ? (row.expert.name + " " + row.expert.surname) : "Not assigned yet"
            ) : (
              <Select
                onChange={(event) => handleExpertChange(event, row)}
                disabled={row.status === "RESOLVED" || row.status === "CLOSED"}
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
                {experts.map((expert) => (
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
            )}
          </FormControl>
        );
      },
    },
    {
      field: "product",
      headerName: "Product",
      flex: 1,
      cellClassName: "product-column--cell",
      valueGetter: ({ value }) => value && value.description,
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 0.7,
      cellClassName: "customer-column--cell",
      valueGetter: ({ value }) => value && value.name + " " + value.surname,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      cellClassName: "action-column--cell",
      renderCell: ({ row }) => {
        return (
          <Button sx={{ color: colors.greenAccent[400] }}>
            <CreateOutlinedIcon fontSize="small" />
          </Button>
        );
      },
    },
    {
      field: "view",
      headerName: "View Details",
      flex: 0.5,
      cellClassName: "view-column--cell",
      renderCell: ({ row }) => {
        return (
          <Button>
            <VisibilityOutlinedIcon
              fontSize="small"
              sx={{ color: colors.greenAccent[400] }}
              onClick={() => {
                navigate(`/tickets/${row.id}`);
              }}
            />
          </Button>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="TICKETS" subtitle="Manage tickets">
        {(currentUser.role === "Client" || currentUser.role === "Manager") && (
            <HeaderActions>
              <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    navigate(`/tickets/create`);
                  }}
                  sx={{ marginLeft: "15px" }}
              >
                New Ticket
              </Button>
            </HeaderActions>)}
      </Header>
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
            "& .MuiSelect-select": {
              whiteSpace: "break-spaces !important",
            },
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: "creationTimestamp", sort: "desc" }],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Tickets;
