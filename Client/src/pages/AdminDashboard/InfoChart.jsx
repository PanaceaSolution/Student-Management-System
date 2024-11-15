import React, { Component } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { RefreshCcw, X } from "lucide-react";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class InfoChart extends Component {
  render() {
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "dark2", // "light1", "dark1", "dark2"
      title: {
        text: "Distribution of Students, Teachers, and Staff",
      },
      data: [
        {
          type: "pie",
          indexLabel: "{label}: {y}%",
          startAngle: -90,
          dataPoints: [
            { y: 50, label: "Students" }, // Example data
            { y: 30, label: "Teachers" }, // Example data
            { y: 15, label: "Staff" }, // Example data
            { y: 5, label: "Others" }, // Example data
          ],
        },
      ],
    };

    return (
      <div>
        <div className="flex  sticky top-0 justify-between px-4 p-2 border-b-2 ">
        <p className="text-lg text-black font-semibold">Info</p>
          <div className="flex space-x-2 cursor-pointer">
            <RefreshCcw size={20} className="text-green-600" />

            <X size={20} className="text-red-700" />
          </div>
        </div>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}

export default InfoChart;
