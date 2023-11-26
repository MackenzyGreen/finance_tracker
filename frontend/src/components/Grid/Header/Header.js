import React, { useState } from 'react';
import './Header.css';
import Modal from '../../Modal/Modal';

function Header({ updateData }) {
  const [showModal, setShowModal] = useState(false);
  const handleClick = () => {
    setShowModal(true);
  }

  const yearLimit = new Date();
  const year = yearLimit.getFullYear();
  yearLimit.setFullYear(yearLimit.getFullYear() - 2);

  return (
    <div className='header-container'>
        <h3 className='header-title'>{`${yearLimit.getFullYear()} - ${year}`} Transactions</h3>
        <button className='add-button' onClick={handleClick}>New</button>
        <Modal show={showModal} toggleShow={setShowModal} updateData={updateData}/>
    </div>
  )
}

export default Header