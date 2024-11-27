import React, { Component } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { RefreshCcw, X } from "lucide-react";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class ExpenseChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frequency: "monthly", // Default frequency
    };
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
    this.changeFrequency = this.changeFrequency.bind(this);
  }

  toggleDataSeries(e) {
    e.dataSeries.visible =
      typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible
        ? false
        : true;
    this.chart.render();
  }

  changeFrequency(event) {
    this.setState({ frequency: event.target.value });
  }

  generateData() {
    const data = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // December is month 11

    // Generate data for December 2023
    for (let day = 1; day <= 31; day++) {
      const date = new Date(currentYear, currentMonth, day);
      if (date.getMonth() === currentMonth) {
        // Only include days in December
        data.push({
          date: date.toISOString().split("T")[0], // Format YYYY-MM-DD
          collections: Math.floor(Math.random() * 30000), // Random collections
          expenses: Math.floor(Math.random() * 20000), // Random expenses
          fees: Math.floor(Math.random() * 10000), // Random fees
        });
      }
    }
    return data;
  }

  render() {
    const jsonData = this.generateData(); // Generate dataset

    // Aggregate data based on frequency
    const { frequency } = this.state;
    let aggregatedData = {};

    jsonData.forEach((data) => {
      const date = new Date(data.date);
      let key;
      if (frequency === "monthly") {
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      } else if (frequency === "annual") {
        key = `${date.getFullYear()}`;
      } else {
        key = data.date; // daily
      }

      if (!aggregatedData[key]) {
        aggregatedData[key] = { collections: 0, expenses: 0, fees: 0 };
      }
      aggregatedData[key].collections += data.collections;
      aggregatedData[key].expenses += data.expenses;
      aggregatedData[key].fees += data.fees;
    });

    const dataPointsCollections = Object.entries(aggregatedData).map(
      ([key, value]) => ({
        x: frequency === "daily" ? new Date(key) : new Date(`${key}-01`),
        y: value.collections,
      })
    );

    const dataPointsExpenses = Object.entries(aggregatedData).map(
      ([key, value]) => ({
        x: frequency === "daily" ? new Date(key) : new Date(`${key}-01`),
        y: value.expenses,
      })
    );

    const dataPointsFees = Object.entries(aggregatedData).map(
      ([key, value]) => ({
        x: frequency === "daily" ? new Date(key) : new Date(`${key}-01`),
        y: value.fees,
      })
    );

    const options = {
      theme: "light2",
      animationEnabled: true,
      title: {
        text: "Collections, Expenses, and Fees Over Time (NPR)",
      },
      subtitles: [
        {
          text: "Click Legend to Hide or Unhide Data Series",
        },
      ],
      axisX: {
        title: "Date",
        valueFormatString: frequency === "daily" ? "DD MMM YYYY" : "MMM YYYY",
      },
      axisY: {
        title: "Amount in NPR",
        titleFontColor: "#6D78AD",
        lineColor: "#6D78AD",
        labelFontColor: "#6D78AD",
        tickColor: "#6D78AD",
      },
      toolTip: {
        shared: true,
        content: (e) => {
          let content = `<strong>${e.entries[0].dataPoint.x.toLocaleDateString()}</strong><br/>`;
          e.entries.forEach((entry) => {
            content += `${entry.dataSeries.name
              }: ${entry.dataPoint.y.toLocaleString()} NPR<br/>`;
          });
          return content;
        },
      },
      legend: {
        cursor: "pointer",
        itemclick: this.toggleDataSeries,
      },
      data: [
        {
          type: "spline",
          name: "Collections",
          showInLegend: true,
          xValueFormatString:
            frequency === "daily" ? "DD MMM YYYY" : "MMM YYYY",
          yValueFormatString: "NPR #,##0",
          dataPoints: dataPointsCollections,
        },
        {
          type: "spline",
          name: "Expenses",
          showInLegend: true,
          xValueFormatString:
            frequency === "daily" ? "DD MMM YYYY" : "MMM YYYY",
          yValueFormatString: "NPR #,##0",
          dataPoints: dataPointsExpenses,
        },
        {
          type: "spline",
          name: "Fees",
          showInLegend: true,
          xValueFormatString:
            frequency === "daily" ? "DD MMM YYYY" : "MMM YYYY",
          yValueFormatString: "NPR #,##0",
          dataPoints: dataPointsFees,
        },
      ],
    };

    return (
      <div className="h-full bg-white p-4 rounded-lg shadow-md">
        <div className="flex  sticky top-0 justify-between px-4 p-2 border-b-2 ">
          <select className="bg-white" onChange={this.changeFrequency}>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
        <CanvasJSChart options={options} onRef={(ref) => (this.chart = ref)} />
      </div>
    );
  }
}

export default ExpenseChart;
