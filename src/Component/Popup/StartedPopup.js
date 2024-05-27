// Popup.js
import React from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { GoCircle } from "react-icons/go";

const Popup = ({ onClose }) => {
  return (
    <div className="StartedPopup">
      <div className="StartedPopup-content">
       <div className='startedBasicBg'>
           <div className='startedBasic'>
                <div className='startedBasicI'>
                    i
                </div>
                <div className='startedBasicCont'>
                    Let's start with the basics
                </div>
                <div>
                    <IoIosArrowDown />
                </div>
           </div>
           <div className='startedBasicBgCont'>
                Click on any step to learn more about that featurel
           </div>
           <div className='progress'>
               <p style={{color:'white', textAlign:'end'}}>0%</p>
               <progress id="file" value="8" max="100"> 32% </progress>
           </div>
       </div>
       <div className='startedLists'>
        <div className='startedList startedListHr'>
            <GoCircle />
            <p>Create template messages</p>
        </div>
        <div className='startedList startedListHr'>
            <GoCircle />
            <p>How to add WhatsApp contacts</p>
        </div>
        <div className='startedList startedListHr'>
            <GoCircle />
            <p>Send your first broadcast</p>
        </div>
        <div className='startedList startedListHr'>
            <GoCircle />
            <p>Build a WhatsApp bot withour coding</p>
        </div>
        <div className='startedList'>
            <GoCircle />
            <p>Integration options with WATI</p>
        </div>
       </div>
       <div className='startedDismiss'>
        <p onClick={onClose}>Dismiss checklist</p>
       </div>
      </div>
    </div>
  );
};

export default Popup;
