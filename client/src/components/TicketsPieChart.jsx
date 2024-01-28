import {PieChart} from '@mui/x-charts/PieChart';
import {useTheme} from "@mui/material";
import {tokens} from "../theme";

export default function TicketsPieChart({tickets}) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const ticketsData = {
        open: tickets.filter(ticket => ticket.status === 'OPEN').length,
        inProgress: tickets.filter(ticket => ticket.status === 'IN_PROGRESS').length,
        closed: tickets.filter(ticket => ticket.status === 'CLOSED').length,
        resolved: tickets.filter(ticket => ticket.status === 'RESOLVED').length,
        reopened: tickets.filter(ticket => ticket.status === 'REOPENED').length,
    };
    return (
        <PieChart
            series={[
                {
                    data: [
                        {id: 0, value: ticketsData.open, label: 'OPEN', color: colors.status.OPEN},
                        {id: 1, value: ticketsData.inProgress, label: 'IN PROGRESS', color: colors.status.IN_PROGRESS},
                        {id: 2, value: ticketsData.closed, label: 'CLOSED', color: colors.status.CLOSED},
                        {id: 3, value: ticketsData.resolved, label: 'RESOLVED', color: colors.status.RESOLVED},
                        {id: 4, value: ticketsData.reopened, label: 'REOPENED', color: colors.status.REOPENED}
                    ],
                    highlightScope: {faded: 'global', highlighted: 'item'},
                    faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                }
            ]}
            height={300}
        />
    );
}