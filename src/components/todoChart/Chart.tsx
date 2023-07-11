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

export function BarChart({ columns }: TaskChartProps) {
  const columnTitles = Object.keys(columns).map((key) => columns[key].title);
  const taskCounts = Object.keys(columns).map(
    (key) => columns[key].taskIds.length
  );
  const data = {
    labels: columnTitles,
    datasets: [
      {
        label: "",
        data: taskCounts,
        backgroundColor: "#44546f",
        barBorderRadius: 5,
      },
    ],
  };
  const options: {} = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 15, 
          },
        }
      },
      y: {
        min: 0,
        border:{dash: [4, 4]}, // for the grid lines
        grid: {
            color: '#aaa', 
            tickColor: '#000', 
            tickBorderDash: [2, 3],
            tickLength: 10, 
            tickWidth: 2,
            offset: false,
            drawTicks: false, 
            drawOnChartArea: true 
        },
        max: Math.max(...taskCounts) + 2,
        ticks: {
          font: {
            size: 17, 
          },
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
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div>
      <h3>Số thẻ mỗi thành viên</h3>
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
export function BarChartTags({ tasks }: any) {
  interface ResultItem {
    id: number;
    color: string;
    total: number;
  }

  const colorCounts: Record<string, number> = {};

  for (const taskKey in tasks) {
    const task = tasks[taskKey];

    for (const tag of task.tags) {
      if (tag.status === true) {
        if (colorCounts[tag.color]) {
          colorCounts[tag.color] += 1;
        } else {
          colorCounts[tag.color] = 1;
        }
      }
    }
  }

  const Result: ResultItem[] = Object.keys(colorCounts).map((color, index) => ({
    id: index,
    color: color,
    total: colorCounts[color],
  }));
  const colorLabels: Record<string, string> = {
    "#4bce97": "xanh lá cây",
    "#e2b203": "vàng",
    "#faa53d": "da cam",
    "#f87462": "đỏ",
    "#9f8fef": "tía",
    "#579dff": "xanh nước biển",
  };
  
  const data = {
    labels: Result.map((item) => colorLabels[item.color]), // Danh sách các color
    datasets: [
      {
        data: Result.map((item) => item.total),
        backgroundColor: Result.map((item) => item.color),
        barBorderRadius: 5,
      },
    ],
  };

  const options: {} = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
          borderDash: [5, 5],
        },
        ticks: {
          font: {
            size: 15, //this change the font size
          },
        }
      },
      y: {
        min: 0,
        border:{dash: [4, 4]}, // for the grid lines
        grid: {
            color: '#aaa', 
            tickColor: '#000', 
            tickBorderDash: [2, 3],
            tickLength: 10, 
            tickWidth: 2,
            offset: false,
            drawTicks: false, 
            drawOnChartArea: true 
        },
        beginAtZero: true,
        max: Math.max(...Result.map((item) => item.total)) + 1,
        ticks: {
            font: {
              size: 17, //this change the font size
            },
          count: Math.max(...Result.map((item) => item.total)) + 2,

          callback: function (value: number) {
            if (value % 1 === 0) {
              return value.toString();
            }
            return "";
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div>
      <h3>Số thẻ mỗi nhãn</h3>
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
