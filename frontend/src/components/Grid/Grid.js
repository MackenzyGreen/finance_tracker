import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Header from './Header/Header';

function Grid({ data, gridRef, updateData }) {
    const oneCondition = { maxNumConditions: 1, buttons: ['reset'] };
    const resetParam = { buttons: ['reset'] };

    const columnDefs = [
        {
            field: 'flow', 
            filter: true,
            filterParams: resetParam
        },
        {
            field: 'amount', 
            filter: 'agNumberColumnFilter',
            filterParams: oneCondition

        },
        {
            field: 'place', 
            filter: true,
            filterParams: resetParam
        },
        {
            field: 'type', 
            filter: true,
            filterParams: resetParam
        },
        {
            field: 'date', 
            filter: 'agDateColumnFilter',
            filterParams: oneCondition,
            sort: 'desc'
        }
    ];

    const onLoad = ({api}) => {
        api.sizeColumnsToFit();
    }

  return (
    <>
        <Header updateData={updateData}/>
        <div className='ag-theme-alpine' style={{height: '100%', width: '100%'}}>
            <AgGridReact
                rowData={data}
                columnDefs={columnDefs}
                onGridReady={onLoad}
                onFilterChanged={(parms) => gridRef(parms.api.rowModel.rowsToDisplay)}
            />
        </div>
    </>
    
  )
}

export default Grid