import React from "react";
import { useEffect, useState } from "react";
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
        },
      },
      y: {
        min: 0,
        border: { dash: [4, 4] }, // for the grid lines
        grid: {
          color: "#aaa",
          tickColor: "#000",
          tickBorderDash: [2, 3],
          tickLength: 10,
          tickWidth: 1,
          offset: false,
          drawTicks: false,
          drawOnChartArea: true,
        },
        max: Math.max(...taskCounts) + 2,
        ticks: {
          font: {
            size: 17,
          },
          count: Math.max(...taskCounts) + 3,

          callback: function (value: number) {
            if (value % 2 === 0) {
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
    gridLines: {
      color: "rgba(0, 0, 0, 0.1)", // Màu đường kẻ của trục Ox
    },
    afterTickToLabelConversion: function (data: any) {
      // Đặt đậm giá trị 0 trên trục Ox
      const chartInstance = data.chart;
      const ctx = chartInstance.ctx;
      const scale = chartInstance.scales["x-axis-0"];

      // Kiểm tra xem có trục Ox không
      if (scale) {
        const ticks = scale.ticks;
        const firstTick = ticks[0];

        // Kiểm tra xem giá trị 0 có tồn tại trong ticks không
        if (firstTick === 0) {
          const zeroLine = scale.getPixelForTick(0) - 0.5;
          ctx.save();
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.moveTo(zeroLine, chartInstance.chartArea.top);
          ctx.lineTo(zeroLine, chartInstance.chartArea.bottom);
          ctx.strokeStyle = "#000";
          ctx.stroke();
          ctx.restore();
        }
      }
    },
  };
  return (
    <div>
      <h3>Số thẻ mỗi danh sách</h3>
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
        },
      },
      y: {
        min: 0,
        border: { dash: [4, 4] }, // for the grid lines
        grid: {
          color: "#aaa",
          tickColor: "#000",
          tickBorderDash: [2, 3],
          tickLength: 10,
          tickWidth: 2,
          offset: false,
          drawTicks: false,
          drawOnChartArea: true,
        },
        beginAtZero: true,
        max: Math.max(...Result.map((item) => item.total)) + 1,
        ticks: {
          font: {
            size: 17, //this change the font size
          },
          count: Math.max(...Result.map((item) => item.total)) + 2,

          callback: function (value: number) {
            if (value % 2 === 0) {
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

interface Task {
  id: number;
  content: string;
  member: Member[];
  tags: any;
  date: any;
}

interface Member {
  id: string;
  tk: string;
  email: string;
  color: string;
  img: string | false;
  position: string;
}

interface MemberTask {
  id: string;
  name: string;
  total: number;
}

const BarChartTaskOfMember: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const updatedMemberTasks: MemberTask[] = [];
  let noMemberTasks: MemberTask = {
    id: "-1",
    name: "Không được giao",
    total: 0,
  };

  for (const taskKey in tasks) {
    const task = tasks[taskKey];
    if (task.member && Array.isArray(task.member)) {
      for (const member of task.member) {
        const memberTask = updatedMemberTasks.find(
          (item) => item.id === member.id
        );

        if (memberTask) {
          memberTask.total += 1;
        } else {
          updatedMemberTasks.push({
            id: member.id,
            name: member.tk,
            total: 1,
          });
        }
      }
    } else {
      noMemberTasks.total += 1;
    }
  }

  if (noMemberTasks.total > 0) {
    updatedMemberTasks.push(noMemberTasks);
  }

  const data = {
    labels: updatedMemberTasks.map((item) => item.name),
    datasets: [
      {
        data: updatedMemberTasks.map((item) => item.total),
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
          borderDash: [5, 5],
        },
        ticks: {
          font: {
            size: 15, //this change the font size
          },
        },
      },
      y: {
        min: 0,
        border: { dash: [4, 4] }, // for the grid lines
        grid: {
          color: "#aaa",
          tickColor: "#000",
          tickBorderDash: [2, 3],
          tickLength: 10,
          tickWidth: 2,
          offset: false,
          drawTicks: false,
          drawOnChartArea: true,
        },
        beginAtZero: true,
        max: Math.max(...updatedMemberTasks.map((item) => item.total)) + 1,
        ticks: {
          font: {
            size: 17, //this change the font size
          },
          count: Math.max(...updatedMemberTasks.map((item) => item.total)) + 2,

          callback: function (value: number) {
            if (value % 2 === 0) {
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
};

export default BarChartTaskOfMember;

export function BarChartDate({ tasks }: any) {
  interface ResultItem {
    name: string;
    total: number;
  }
  const dateCounts: Record<string, number> = {
    "Hoàn thành": 0,
    "Đang làm": 0,
    "Quá hạn": 0,
    "Không có ngày": 0,
  };

  for (const taskKey in tasks) {
    const task = tasks[taskKey];
    if (task.date.time != 0) {
      
      if (task.date.status) {
        dateCounts["Hoàn thành"] += 1;
      } else if (task.date.status == false) {
        dateCounts["Đang làm"] += 1;
      } else {
        dateCounts["Quá hạn"] += 1;
      }
    } else {
      dateCounts["Không có ngày"] += 1;
    }
  }

  const Result: ResultItem[] = Object.keys(dateCounts).map((status, index) => ({
    name: status,
    total: dateCounts[status],
  }));

  const colorLabels: string[] = ["#22a06b", "#d97008", "#e34935", "#dcdfe4"];
console.log(Result);

  const data = {
    labels: Result.map((item) => item.name), // Danh sách các color
    datasets: [
      {
        data: Result.map((item) => item.total),
        backgroundColor: colorLabels.map((item) => item),
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
        },
      },
      y: {
        min: 0,
        border: { dash: [4, 4] }, // for the grid lines
        grid: {
          color: "#aaa",
          tickColor: "#000",
          tickBorderDash: [2, 3],
          tickLength: 10,
          tickWidth: 2,
          offset: false,
          drawTicks: false,
          drawOnChartArea: true,
        },
        beginAtZero: true,
        max: Math.max(...Result.map((item) => item.total)) + 1,
        ticks: {
          font: {
            size: 17, //this change the font size
          },
          count: Math.max(...Result.map((item) => item.total)) + 2,

          callback: function (value: number) {
            if (value % 2 === 0) {
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