import React from "react";
import { Chart } from "react-google-charts";

const InfoChart = () => {
  const data = [
    ["Users", "Total"],
    ["Students", 11],
    ["Parents", 2],
    ["Teachers", 2],
    ["Staffs", 2],
  ];

  const options = {
    pieHole: 0.4,
    is3D: true,
    pieStartAngle: 100,
    sliceVisibilityThreshold: 0.02,
    legend: {
      position: "top",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 18,
      },
    },
    colors: ["#8AD1C2", "#9F8AD1", "#D18A99", "#BCD18A"],
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex sticky top-0 justify-between px-4 p-2 border-b-2">
        <p className="text-lg font-semibold">Info Chart</p>
      </div>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
};

export default InfoChart;
