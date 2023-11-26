import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Summary from '../components/Summary/Summary';
import Grid from '../components/Grid/Grid';
import Chart from '../components/Chart/Chart';
import axios from 'axios';

function Dashboard() {
  const [filterData, setFilterData] = useState([]);
  const [rawData, setRawData] = useState([]);
  const client = axios.create({
    baseURL: "http://192.168.0.104:1337/getrecords"
  });

  const getData = () => {
    client.get('').then((response) => {
      if (response.status === 200) {
        response.data = response.data.map(element => {
          element.date = new Date(element.date);
          element.amount = Number(element.amount);
          return element;
        });
        setRawData(response.data);
      } else {
        setRawData([]);
      }
    })
  }

  useEffect(() => {
    getData();
    //eslint-disable-next-line
  }, [])

  return (
    <div className='main-container'>
        <div className='top-section'>
            <div className='chart-container'>
              <Chart data={rawData}/>
            </div>
            <Summary rawData={rawData} filterData={filterData}/>
        </div>
        <div className='bottom-section'>
            <div className='grid-container'>
                <Grid data={rawData} gridRef={setFilterData} updateData={getData}/>
            </div>
        </div>
    </div>
  )
}

export default Dashboard