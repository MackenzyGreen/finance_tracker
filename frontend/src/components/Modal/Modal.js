import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

function Modal({show, toggleShow, updateData}) {
  const [transType, setTransType] = useState('');
  const [transAmount, setTransAmount] = useState(0);
  const [transLoc, setTransLoc] = useState('');
  const [transDate, setTransDate] = useState('');
  const [expType, setExpType] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [ saveStatus, setSaveStatus ] = useState({show: false, status: false});
  const client = axios.create({
    baseURL: "http://raspberrypi.local:1337/updateform"
  });

  useEffect(() => {
    const typeValid = transType === 'income' || transType === 'expense';
    const amountValid = transAmount > 0;
    const locationValid = transLoc.length > 0;
    const dateValid = transDate.length === 10;
    const expTypeValid = transType === 'expense' ? expType.length > 0 : true;

    setFormValid(typeValid && amountValid && locationValid && dateValid && expTypeValid);
  }, [transType, transAmount, transLoc, transDate, expType]);

  const onSelectChange = (e) => setTransType(e.target.value);
  const onAmountChange = (e) => setTransAmount(Number(e.target.value));
  const onTransLocChange = (e) => setTransLoc(e.target.value);
  const onDateChange = (e) => setTransDate(e.target.value);
  const onExpTypeChange = (e) => setExpType(e.target.value);

  const resetFields = () => {
    setTransType('');
    setTransAmount(0);
    setTransLoc('');
    setTransDate('');
    setExpType('');
    setFormValid(false);
  }

  const onCancelClick = () => {
    toggleShow(false);
    resetFields();
  }

  const handleToast = (show, status ) => {
    setSaveStatus({ show, status });

    setTimeout(() => setSaveStatus({ show: false, status: null }), 5000);
  }

  const handleSave = () => {
    const dateParts = transDate.split('-');
    const data = JSON.stringify({
      flow: transType,
      amount: transAmount,
      location: transLoc,
      date: `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`,
      expenseType: expType
    });
    
    client.post('', {
      headers: {
        'content-type': 'application/json'
      },
      data
    }).then((response) => {
      if (response.status === 200) {
        resetFields();
        handleToast(true, true);
        updateData();
      } else {
        handleToast(true, false);
      }
    });
  }

  return (
    <div className={`new-modal-${show ? 'show' : 'hide'}`}>
        <div className='modal-container'>
            <div className='modal-header'>
              <h2>New Transaction</h2>
            </div>
            <div className='modal-body'>
              <div>
                <label for="trans_type" className='label'>Transaction Type</label>
                <select id="trans_type" className='input_select' value={transType} onChange={onSelectChange}>
                  <option value=""></option>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label for="trans_amount" className='label'>Transaction Amount</label>
                <input 
                  type='number' 
                  id="trans_amount" 
                  className='input_text'
                  min={0}
                  value={transAmount}
                  onChange={onAmountChange}
                />
              </div>
              <div>
                <label for="trans_place" className='label'>Transaction Location</label>
                <input 
                  type='text' 
                  id="trans_place" 
                  className='input_text'
                  value={transLoc}
                  onChange={onTransLocChange}
                />
              </div>
              <div>
                <label for="trans_date" className='label'>Transaction Date</label>
                <input 
                  type='date' 
                  id="trans_date" 
                  className='input_date'
                  value={transDate}
                  onChange={onDateChange}
                />
              </div>
              {transType === 'expense' && (
                <div>
                  <label for="expense_type" className='label'>Expense Type</label>
                  <input 
                    type='text' 
                    id="expense_type" 
                    className='input_text'
                    value={expType}
                    onChange={onExpTypeChange}
                  />
                </div>
              )}
            </div>
            <div className={`modal-footer${saveStatus.show ? ' spacing' : ''}`}>
              <div className={`message-${saveStatus.show ? 'show' : 'hide'} ${saveStatus.status ? 'success' : 'fail'}`}>
                Saved {saveStatus.status ? 'Successfully' : 'Failed'}
              </div>
              <div>
                <button 
                  className='input-button cancel'
                  onClick={onCancelClick}
                >
                  Cancel
                </button>
                <button 
                  className='input-button save'
                  disabled={!formValid}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Modal