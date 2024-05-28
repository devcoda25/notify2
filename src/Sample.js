import React from 'react'
import './Sample.css'
import { RxCross2 } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";

const Sample = ({onClose}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div>
          <div className='sampleTemplateHead'>
            <p className='sampleTemplateHeadP'>Use a sample</p>
            <p className="close-button" onClick={onClose}><RxCross2  /></p>
          </div>  
          <div className='sampleTemplateSubNavs'>
            <div className='sampleTemplateSubNav1'>
              <p>All</p>
              <p>Festival</p>
            </div>
            <div className='sampleTemplateSubNav2'>
              <div className="sampleTemplateSearchInput">
                <input type="text" placeholder="Search..." className="sampleTemplateSearch" />
                <CiSearch className="icon2" />
              </div>
              <div>
                <button className='sampleTemplatebtn'>Create my own template</button>
              </div>
            </div>
          </div>
          <div className='choose-template__list'>
            <div className='choose-template__item'>
              <div className='item__top'>
                <div className='item__name-container'>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H13C14.1046 0 15 0.895431 15 2V13C15 14.1046 14.1046 15 13 15H2C0.89543 15 0 14.1046 0 13V2ZM2 2.66626C2 2.11398 2.44772 1.66626 3 1.66626H12C12.5523 1.66626 13 2.11398 13 2.66626V3.16626C13 3.71854 12.5523 4.16626 12 4.16626H3C2.44772 4.16626 2 3.71854 2 3.16626V2.66626ZM3 4.99878C2.44772 4.99878 2 5.44649 2 5.99878V6.49878C2 7.05106 2.44772 7.49878 3 7.49878H12C12.5523 7.49878 13 7.05106 13 6.49878V5.99878C13 5.44649 12.5523 4.99878 12 4.99878H3ZM2 9.33594C2 8.78365 2.44772 8.33594 3 8.33594H6C6.55228 8.33594 7 8.78365 7 9.33594V12.1659C7 12.7182 6.55228 13.1659 6 13.1659H3C2.44772 13.1659 2 12.7182 2 12.1659V9.33594ZM9 8.33594C8.44771 8.33594 8 8.78365 8 9.33594V12.1659C8 12.7182 8.44771 13.1659 9 13.1659H12C12.5523 13.1659 13 12.7182 13 12.1659V9.33594C13 8.78365 12.5523 8.33594 12 8.33594H9Z" fill="#666666"></path></svg>
                  <h5 className='sc-hQVuKf UapIP item__name'>valentines_day</h5>
                </div>
                <div className='item__category'>Festival</div>
              </div>
              <div className='item__bottom'>
                <div className='item__body-preview'>
                🌹 Valentine's Day Special Deal! 🌹
Celebrate love with exclusive offers just for you! 💕

🎁 Get [X]% off on all Valentine's Day gifts! 💝 Explore our curated collection of romantic surprises. 🛍️ Shop now and make this Valentine's Day unforgettable!

Hurry, offer valid until [End Date]!

Spread love, shop smart, and cherish every moment.
[Your name]
                </div>
                <button className='sc-jIBlqr kZhSXp sc-gvcVbs eUNntY'>Use this sample</button>
              </div>
            </div>
            <div className='choose-template__item'>
              <div className='item__top'>
                <div className='item__name-container'>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H13C14.1046 0 15 0.895431 15 2V13C15 14.1046 14.1046 15 13 15H2C0.89543 15 0 14.1046 0 13V2ZM2 2.66626C2 2.11398 2.44772 1.66626 3 1.66626H12C12.5523 1.66626 13 2.11398 13 2.66626V3.16626C13 3.71854 12.5523 4.16626 12 4.16626H3C2.44772 4.16626 2 3.71854 2 3.16626V2.66626ZM3 4.99878C2.44772 4.99878 2 5.44649 2 5.99878V6.49878C2 7.05106 2.44772 7.49878 3 7.49878H12C12.5523 7.49878 13 7.05106 13 6.49878V5.99878C13 5.44649 12.5523 4.99878 12 4.99878H3ZM2 9.33594C2 8.78365 2.44772 8.33594 3 8.33594H6C6.55228 8.33594 7 8.78365 7 9.33594V12.1659C7 12.7182 6.55228 13.1659 6 13.1659H3C2.44772 13.1659 2 12.7182 2 12.1659V9.33594ZM9 8.33594C8.44771 8.33594 8 8.78365 8 9.33594V12.1659C8 12.7182 8.44771 13.1659 9 13.1659H12C12.5523 13.1659 13 12.7182 13 12.1659V9.33594C13 8.78365 12.5523 8.33594 12 8.33594H9Z" fill="#666666"></path></svg>
                  <h5 className='sc-hQVuKf UapIP item__name'>christmas_greetings</h5>
                </div>
                <div className='item__category'>Festival</div>
              </div>
              <div className='item__bottom'>
                <div className='item__body-preview'>
                Hello 🎄🎅

Wishing you a joyful and magical Christmas season!

May this festive season bring you and your loved ones endless happiness and countless blessings. 
Thank you for being our beloved customer!

Merry Christmas and a Happy New Year! 🎉✨
Warmest wishes, 
[shop name]
                </div>
                <button className='sc-jIBlqr kZhSXp sc-gvcVbs eUNntY'>Use this sample</button>
              </div>
            </div>
            <div className='choose-template__item'>
              <div className='item__top'>
                <div className='item__name-container'>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H13C14.1046 0 15 0.895431 15 2V13C15 14.1046 14.1046 15 13 15H2C0.89543 15 0 14.1046 0 13V2ZM2 2.66626C2 2.11398 2.44772 1.66626 3 1.66626H12C12.5523 1.66626 13 2.11398 13 2.66626V3.16626C13 3.71854 12.5523 4.16626 12 4.16626H3C2.44772 4.16626 2 3.71854 2 3.16626V2.66626ZM3 4.99878C2.44772 4.99878 2 5.44649 2 5.99878V6.49878C2 7.05106 2.44772 7.49878 3 7.49878H12C12.5523 7.49878 13 7.05106 13 6.49878V5.99878C13 5.44649 12.5523 4.99878 12 4.99878H3ZM2 9.33594C2 8.78365 2.44772 8.33594 3 8.33594H6C6.55228 8.33594 7 8.78365 7 9.33594V12.1659C7 12.7182 6.55228 13.1659 6 13.1659H3C2.44772 13.1659 2 12.7182 2 12.1659V9.33594ZM9 8.33594C8.44771 8.33594 8 8.78365 8 9.33594V12.1659C8 12.7182 8.44771 13.1659 9 13.1659H12C12.5523 13.1659 13 12.7182 13 12.1659V9.33594C13 8.78365 12.5523 8.33594 12 8.33594H9Z" fill="#666666"></path></svg>
                  <h5 className='sc-hQVuKf UapIP item__name'>new_years_greetings</h5>
                </div>
                <div className='item__category'>Festival</div>
              </div>
              <div className='item__bottom'>
                <div className='item__body-preview'>
                Hey 🎉🎆 

As we bid farewell to the old year and welcome the new one, we wanted to take a moment to thank you for your support and trust.

Wishing you a joyful and prosperous New Year filled with laughter, love, and exciting adventures!🥳✨ 

Best wishes, 
[shop name]
                </div>
                <button className='sc-jIBlqr kZhSXp sc-gvcVbs eUNntY'>Use this sample</button>
              </div>
            </div>
            <div className='choose-template__item'>
              <div className='item__top'>
                <div className='item__name-container'>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 2C0 0.89543 0.895431 0 2 0H13C14.1046 0 15 0.895431 15 2V13C15 14.1046 14.1046 15 13 15H2C0.89543 15 0 14.1046 0 13V2ZM2 2.66626C2 2.11398 2.44772 1.66626 3 1.66626H12C12.5523 1.66626 13 2.11398 13 2.66626V3.16626C13 3.71854 12.5523 4.16626 12 4.16626H3C2.44772 4.16626 2 3.71854 2 3.16626V2.66626ZM3 4.99878C2.44772 4.99878 2 5.44649 2 5.99878V6.49878C2 7.05106 2.44772 7.49878 3 7.49878H12C12.5523 7.49878 13 7.05106 13 6.49878V5.99878C13 5.44649 12.5523 4.99878 12 4.99878H3ZM2 9.33594C2 8.78365 2.44772 8.33594 3 8.33594H6C6.55228 8.33594 7 8.78365 7 9.33594V12.1659C7 12.7182 6.55228 13.1659 6 13.1659H3C2.44772 13.1659 2 12.7182 2 12.1659V9.33594ZM9 8.33594C8.44771 8.33594 8 8.78365 8 9.33594V12.1659C8 12.7182 8.44771 13.1659 9 13.1659H12C12.5523 13.1659 13 12.7182 13 12.1659V9.33594C13 8.78365 12.5523 8.33594 12 8.33594H9Z" fill="#666666"></path></svg>
                  <h5 className='sc-hQVuKf UapIP item__name'>iwd</h5>
                </div>
                <div className='item__category'>Festival</div>
              </div>
              <div className='item__bottom'>
                <div className='item__body-preview'>
                Hi,

Happy International Women's Day!

To all the amazing women out there: keep rocking your awesomeness, breaking barriers, and shining bright! Here's to you! ✨💪🎉
                </div>
                <button className='sc-jIBlqr kZhSXp sc-gvcVbs eUNntY'>Use this sample</button>
              </div>
            </div>
          </div>

        </div>      
      </div>
    </div>
  )
}

export default Sample
