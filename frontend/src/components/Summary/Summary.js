import React, { useEffect, useState } from 'react';
import './Summary.css';

function Summary({ rawData, filterData }) {
  let ytdIncome = 0;
  let ytdExpnese = 0;
  const [filteredIncome, setFilteredIncome] = useState(0);
  const [filteredExpnese, setFilteredExpnese] = useState(0);

  const estTax = .2;
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  // setting ytd values
  rawData.forEach(entry => {
    if (entry.flow === "income" && entry.date >= yearAgo) {
      ytdIncome += entry.amount;
    } else if (entry.flow === "expense" && entry.date >= yearAgo) {
      ytdExpnese += entry.amount;
    }
  });

  // setting filtered values
  useEffect(() => {
    if (filterData.length === 0) {
      setFilteredExpnese(ytdExpnese);
      setFilteredIncome(ytdIncome);
    } else {
      let income = 0;
      let expense = 0;
      filterData.forEach(entry => {
        if (entry.data.flow === "expense") {
          expense += entry.data.amount;
        } else if (entry.data.flow === "income") {
          income += entry.data.amount;
        }
      });
      setFilteredExpnese(expense);
      setFilteredIncome(income);
    }
  }, [filterData, ytdExpnese, ytdIncome]);

  return (
    <div className='summary-container'>
        <h2 className='sum-title'>Summary</h2>
        <div className='split-container'>
            <div className='sum-section divider-right'>
                <p className='sum-item'>Year To Date</p>
                <p className='sum-item'><b>Revenue:</b> {`$${ytdIncome}`}</p>
                <p className='sum-item'><b>Expenses:</b> {`$${ytdExpnese}`}</p>
                <p className='sum-item'><b>Est Taxes:</b> ${((ytdIncome-ytdExpnese) * estTax).toFixed(2)}</p>
            </div>
            <div className='sum-section'>
                <p className='sum-item'>Filtered</p>
                <p className='sum-item'><b>Revenue:</b> ${filteredIncome}</p>
                <p className='sum-item'><b>Expenses:</b> ${filteredExpnese}</p>
                <p className='sum-item'><b>Est Taxes:</b> ${((filteredIncome - filteredExpnese) * estTax).toFixed(2)}</p>
            </div>
        </div>
    </div>
  )
}

export default Summary