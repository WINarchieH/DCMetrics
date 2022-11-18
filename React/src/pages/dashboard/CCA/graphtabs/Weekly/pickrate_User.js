import React from "react";
import { Bar } from "react-chartjs-2";

const Chart = () => {
  const barChartData = {
    labels: ["7th Mar", "9th Mar", "8th Mar"],
    datasets: [
      {
        data: [8137119, 9431691, 10266674],
        label: "Aspen Harris",
        borderColor: "#3333ff",
      
        fill: false
      },
      {
        data: [1216410, 1371390, 1477380],
        label: "Deaths People",
        borderColor: "#ff3333",
       
        fill: true
      },
      {
        data: [8137119, 9431691, 10266674],
        label: "Aspen Harris",
        borderColor: "#3333ff",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        fill: false
      },
      {
        data: [8137119, 9431691, 10266674],
        label: "Aspen Harris",
        borderColor: "#3333ff",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        fill: false
      },

    ]
  };

  const barChart = (
    <Bar
      type="bar"
      width={350}
      height={100}
      options={{
        title: {
          display: true,
          text: "COVID-19 Cases of Last 3 Months",
          fontSize: 15
        },
        legend: {
          display: true, //Is the legend shown?
          position: "top" //Position of the legend.
        }
      }}
      data={barChartData}
    />
  );
  return barChart;
};

export default Chart;