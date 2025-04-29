import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const ApexChartsComponent = ({ seriesParent }) => {
  useEffect(() => {
    const options = {
      chart: {
        type: 'line',
      },
      series: seriesParent,
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
      tooltip: {
        enabled: true,
        theme: 'dark', // Change theme to dark/light
        style: {
          fontSize: '14px', // Customize font size
          fontFamily: 'Arial, sans-serif',
        },
        y: {
          formatter: (value) => `${value}`, // Custom formatting of values
        },
        marker: {
          show: true, // Show/hide the tooltip marker
        },
      },
    };

    const chart = new ApexCharts(document.querySelector('#chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [seriesParent]);

  return <div id="chart" className="text-white"></div>;
};

export default ApexChartsComponent;