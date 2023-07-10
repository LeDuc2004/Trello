import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface TaskChartProps {
  columns: {
    [key: string]: {
      id: string;
      title: string;
      taskIds: string[];
    };
  };
}

export default function BarChart({ columns }: TaskChartProps) {
  const columnTitles = Object.keys(columns).map((key) => columns[key].title);
  const taskCounts = Object.keys(columns).map(
    (key) => columns[key].taskIds.length
  );
  const data = {
    labels: columnTitles,
    datasets: [
      {
        label: "Tasks",
        data: taskCounts,
        backgroundColor: "#44546f",
        barBorderRadius: 5,
      },
    ],
  };
  const options: {} = {
    responsive: true,
    animation: {
      duration: 500, // Thời gian diễn ra của animation (500 mili giây)
    },

    scales: {
      x: {
        grid: {
          display: false,
          borderDash: [5, 5],
        },
      },
      y: {
        min: 0,
        grid: {
          display: true,
          borderDash: [5, 5],
        },
        beginAtZero: true,
        max: Math.max(...taskCounts) + 2,
        
        ticks: {
          count: Math.max(...taskCounts) + 3,

          callback: function (value: number) {
            if (value % 1 === 0) {
              return value.toString();
            }
            return "";
          },
        },
      },
    },
  };
  return (
    <div>
      <Bar
        style={{
          backgroundColor: "white",
        }}
        options={options}
        data={data}
      />
    </div>
  );
}
