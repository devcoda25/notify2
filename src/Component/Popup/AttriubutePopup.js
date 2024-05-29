import React from 'react'
import { RxCross2 } from "react-icons/rx";

const AttriubutePopup = ({onClose}) => {
  return (
    <div className="modal-backdrop">
    <div className="atrrPopup-content">
      <div className='popupNav'>
        <p className='popupNavHead'>Create template message</p>
        <p className="close-button" onClick={onClose}><RxCross2  /></p>
      </div>
    </div>
  </div>
  )
}

export default AttriubutePopup
