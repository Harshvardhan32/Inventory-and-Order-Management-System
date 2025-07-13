import { ScatterChart } from "@mui/x-charts/ScatterChart";
import type { MonthlyRevenue } from "../../interfaces/interface";
import { Box } from "@mui/material";

const Graph = ({ data }: { data: MonthlyRevenue[] }) => {
    return (
        <Box style={{ width: "100%", maxWidth: "100%", padding: "1rem" }}>
            <Box style={{ width: "100%", height: "auto" }}>
                <ScatterChart
                    height={300}
                    series={[
                        {
                            data: data?.map((item, index) => ({
                                x: index,
                                y: item.value,
                                id: index,
                            })),
                        },
                    ]}
                    xAxis={[
                        {
                            label: "Month",
                            tickMinStep: 1,
                            valueFormatter: (value: number) =>
                                data[value] ? data[value].label : "",
                            min: -0.5,
                            max: data.length - 0.5,
                            tickLabelInterval: (_, index) => index % 1 === 0,
                        },
                    ]}
                    yAxis={[{ label: "Revenue" }]}
                    margin={{ top: 20, bottom: 40, left: 50, right: 20 }}
                    sx={{
                        width: "100%",
                        maxWidth: "100%",
                        "& .MuiChartsAxis-label": {
                            fontSize: "0.8rem",
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default Graph;
