import React from 'react'
import { RxCross2 } from "react-icons/rx";
import { IoIosLink } from "react-icons/io";

const AttriubutePopup = ({onClose}) => {
  return (
    <div className="modal-backdrop">
    <div className="atrrPopup-content">
      <div className='popupNav'>
        <div className='AddNav'>
          <p className='popupNavHead'>Select attributes</p>
          <a href='https://live-6053.wati.io/6053/contacts' target='_blank'><IoIosLink /> Go to contacts</a>
        </div>
        <p className="close-button" onClick={onClose}><RxCross2  /></p>
      </div>
      <div className='AddNavContactCont'>
        <h5>Contact</h5>
        <div className='AttributeContactCont'>
          <p>actual_fare</p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AttriubutePopup
