import {BarChart} from "@mui/x-charts";
import {useEffect, useState} from "react";

export default function ExpertsBarChart({experts, tickets}) {
    const [freeData, setFreeData] = useState([]);
    const [busyData, setBusyData] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);

    useEffect(() => {
        if (experts && tickets && experts.length > 0 && tickets.length > 0) {
            const specializationCounts = {};
            experts.forEach(expert => {
                specializationCounts[expert.specialization] = {free: 0, busy: 0};
            });

            experts.forEach(expert => {
                const isExpertBusy = tickets.some(ticket => ticket.expert && ticket.expert.id === expert.id);

                if (isExpertBusy) {
                    specializationCounts[expert.specialization].busy++;
                } else {
                    specializationCounts[expert.specialization].free++;
                }
            });

            const data = Object.keys(specializationCounts).map(specialization => ({
                label: specialization,
                data: [
                    specializationCounts[specialization].free,
                    specializationCounts[specialization].busy
                ]
            }));

            const freeData = data.map(data => data.data[0]);
            const busyData = data.map(data => data.data[1]);
            const labels = Object.keys(specializationCounts);
            setFreeData(freeData);
            setBusyData(busyData);
            setChartLabels(labels);
        }
    }, [experts, tickets]);

    return (
        freeData.length && busyData.length && chartLabels.length && <BarChart
            series={[
                {data: freeData, label: 'Free', id: 'free', stack: 'total'},
                {data: busyData, label: 'Busy', id: 'busy', stack: 'total'},
            ]}
            xAxis={[{data: chartLabels, scaleType: 'band'}]}
            //Set y-axis step to 1
            yAxis={[{min: 0, max: Math.max(...freeData, ...busyData) + 3,}]}
            height={350}
        />
    );
}