import {
  Box,
  Typography,
  Tooltip,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import TicketsAPI from "../../api/tickets/ticketsApi";
import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../utils/AuthContext";
import {dataGridStyles} from "../../styles/dataGridStyles";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import AddIcon from "@mui/icons-material/Add";
import HeaderActions from "../../components/HeaderActions";
import {useDialog} from "../../utils/DialogContext";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

const Tickets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tickets, setTickets] = useState([]);
  const [experts, setExperts] = useState([]);
  const [ticketUpdated, setTicketUpdated] = useState(false);
  const [currentUser] = useContext(AuthContext);
  const navigate = useNavigate();
  const {showDialog} = useDialog();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let ticketsData = [];
        let expertsData = [];
        if (currentUser.role === "Client") {
          ticketsData = await TicketsAPI.getTicketsByCustomer(
            currentUser.email
          );
        }
        if (currentUser.role === "Expert")
          ticketsData = await TicketsAPI.getTicketsByExpert(currentUser.id);
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
    fetchTickets();
  }, [currentUser.id, currentUser.role, currentUser.email, ticketUpdated]);

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

    TicketsAPI.updateTicket(ticketToUpdate.id, ticketToUpdate)
      .then((response) => {
        console.log("Ticket aggiornato con successo");
        setTicketUpdated(() => !ticketUpdated);
      })
      .catch((error) => {
        console.error("Errore nell'aggiornamento del ticket", error);
        alert("Errore nell'aggiornamento del ticket");
      });
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "creationTimestamp",
      headerName: "Creation Date",
      flex: 1,
      type: "dateTime",
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
      renderCell: ({ row: { priority } }) => {
        return <PriorityBadge priority={priority} />;
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      cellClassName: "status-column--cell",
      renderCell: ({ row: { status } }) => {
        return <StatusBadge statusValue={status} />;
      },
    },
    {
      field: "category",
      headerName: "Category",
      cellClassName: "category-column--cell",
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
                  borderColor: "transparent", // Rimuove il colore del bordo della cella
                },
              },
            }}
          >
            <Select
              renderValue={(value) => {
                if (!value) return "Not Assigned";
                return value;
              }}
              onChange={(event) => handleExpertChange(event, row)}
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
                    expert.name + " " + expert.surname + " (" + expert.id + ")"
                  }
                >
                  {expert.name + " " + expert.surname + " (" + expert.id + ")"}
                </MenuItem>
              ))}
            </Select>
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
        flex: 0.4,
        cellClassName: "action-column--cell",
        renderCell: ({ row }) => {
          return (
            <Button sx={{color: colors.greenAccent[400]}}>
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
                />
              </Button>
            );
        }
    }
  ];

  return (
    <Box m="20px">
      <Header title="TICKETS" subtitle="Manage tickets" >
      <HeaderActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon/>}
                        onClick={() => {
                            navigate(`/tickets/create`)
                        }}
                        sx={{marginLeft: "15px"}}
                    >New Ticket
                    </Button>
                </HeaderActions>
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
          onRowClick={(row) => navigate(`/tickets/${row.id}`)}
        />
      </Box>
    </Box>
  );
};

export default Tickets;
