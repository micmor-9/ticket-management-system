import {PieChart} from '@mui/x-charts/PieChart';

export default function TicketsPieChart({tickets}) {
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
                        {id: 0, value: ticketsData.open, label: 'OPEN'},
                        {id: 1, value: ticketsData.inProgress, label: 'IN PROGRESS'},
                        {id: 2, value: ticketsData.closed, label: 'CLOSED'},
                        {id: 3, value: ticketsData.resolved, label: 'RESOLVED'},
                        {id: 4, value: ticketsData.reopened, label: 'REOPENED'}
                    ],
                    highlightScope: {faded: 'global', highlighted: 'item'},
                    faded: {innerRadius: 30, additionalRadius: -30, color: 'gray'},
                }
            ]}
            height={300}
        />
    );
}