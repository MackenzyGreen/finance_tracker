import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import './Chart.css';

function Chart({ data }) {
  const [quarterData, setQuarterData] = useState([]);
  const today = new Date();

  const currentQuarter = Math.ceil((today.getMonth() + 1) / 3);
  const currentYear = today.getFullYear();

  useEffect(() => {
    const chartData = [];
    const quarters = {
      1: [0, 1, 2],
      2: [3, 4, 5],
      3: [6, 7, 8],
      4: [9, 10, 11]
    };
    const tempRaw = data.filter((v) => quarters[currentQuarter].includes(v.date.getMonth()) && currentYear === v.date.getFullYear());

    (quarters[currentQuarter]).forEach(element => {
      const format = `${element + 1}/${currentYear}`;
      let tempIncome = 0;
      let tempExpense = 0;

      const monthlyData = tempRaw.filter((v) => format === `${v.date.getMonth() + 1}/${currentYear}`);
      monthlyData.forEach(day => {
        if (day.flow === "income") {
          tempIncome += day.amount;
        } else {
          tempExpense += day.amount;
        }
      })

      chartData.push({
        quarter: format,
        income: tempIncome,
        expense: tempExpense,
      });
    });
    
    setQuarterData(chartData);
    // eslint-disable-next-line
  }, [data]);

  const options = {
    autoSize: true,
    theme: {
      palette: {
        fills: ['rgba(0, 255, 0, 0.9)', 'rgba(255, 0, 0, 0.9)'],
        strokes: ['rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 0.0)'],
      },
    },
    title: {
      text: `${currentYear} Q${currentQuarter}`
    },
    data: quarterData,
    series: [
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'income',
        yName: 'Income'
      },
      {
        type: 'bar',
        xKey: 'quarter',
        yKey: 'expense',
        yName: 'Expense',
      },
    ],
    background: {
      fill: 'rgb(248, 248, 248)'
    }
  }
  

  return (
    <div className='chart-wrapper'>
      <AgChartsReact options={options} />
    </div>
  )
}

export default Chart