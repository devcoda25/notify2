import React, { useEffect, useState } from 'react'
import DefaultAction from '../../src/Component/Automation/DefaultAction';
import KeyboardAction from '../../src/Component/Automation/KeyboardAction';
import Replymaterial from '../../src/Component/Automation/Replymaterial';
import Routing from '../../src/Component/Automation/Routing';
import Rules from '../../src/Component/Automation/Rules';
import Sequence from '../../src/Component/Automation/Sequence';
import Chatbots from '../../src/Component/Automation/Chatbots';
import Whatsappflows from '../../src/Component/Automation/Whatsappflows';
const Automations = () => {

    const [activeContent,setActiveContent]=useState('defaultaction');
    const handleNavigationClick = (e, content) => {
        e.preventDefault();
        setActiveContent(content);
      };
    
    const renderContent=()=>{
        switch(activeContent){
            case 'defaultaction':
                return <DefaultAction/>
            case 'keyboardaction':
                return <KeyboardAction/>
            case 'replymaterial':
                return <Replymaterial/>
            case 'routing':
                return <Routing/>
            case 'chatbots':
                    return <Chatbots/>
            case 'sequence':
                        return <Sequence/>
            case 'rules':
                return <Rules/>
           case 'whatsappflows':
            return <Whatsappflows/>

            default:
                return <DefaultAction/>
        }
    }
   
    return (

        <div className='maincontent'>
            <div className='msgCont'>

                <div className='msgContL automation__left__content'>
                    <li className='solo'><a href='#' onClick={(e)=>handleNavigationClick(e,'defaultaction')}><svg  width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_1_Default_action" data-name="1_Default action"><path d="M28.08,33H7.92A6.92,6.92,0,0,1,1,26.08V9.92A6.92,6.92,0,0,1,7.92,3H28.08A6.92,6.92,0,0,1,35,9.92V26.08A6.92,6.92,0,0,1,28.08,33ZM7.92,5A4.93,4.93,0,0,0,3,9.92V26.08A4.93,4.93,0,0,0,7.92,31H28.08A4.93,4.93,0,0,0,33,26.08V9.92A4.93,4.93,0,0,0,28.08,5Z" fill="#309e69"/><path d="M18,19a1,1,0,0,1-.64-.23l-11-9.1A1,1,0,1,1,7.56,8.13L18,16.71,28.45,8.13a1,1,0,0,1,1.26,1.54l-11.12,9.1A1,1,0,0,1,18,19Z" fill="#309e69"/></g></svg><span className='leftbar__item__title' >Default Action</span></a></li>
                    <li ><a href='#'  onClick={(e)=>handleNavigationClick(e,'keyboardaction')}><svg width="20" height="20"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_2_Keyword_Action" data-name="2_Keyword Action"><path d="M29,35H7a6,6,0,0,1-6-6V7A6,6,0,0,1,7,1H29a6,6,0,0,1,6,6V29A6,6,0,0,1,29,35ZM7,3A4,4,0,0,0,3,7V29a4,4,0,0,0,4,4H29a4,4,0,0,0,4-4V7a4,4,0,0,0-4-4Z" fill="#777"/><path d="M26.36,17h-8a5.66,5.66,0,1,0,0,2h3.27v3.66a1,1,0,0,0,2,0V19h2.7a.47.47,0,0,1,.47.47v3.19a1,1,0,0,0,2,0V19.47A2.48,2.48,0,0,0,26.36,17ZM12.83,21.66A3.66,3.66,0,1,1,16.49,18,3.66,3.66,0,0,1,12.83,21.66Z" fill="#777"/></g></svg><span className='leftbar__item__title'>Keyboard Action</span></a></li>
                    <li ><a href='#' onClick={(e)=>handleNavigationClick(e,'replymaterial')}><svg width="20" height="20"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_3_Reply_material" data-name="3_Reply material"><path d="M18,3A15,15,0,0,0,3,18a14.82,14.82,0,0,0,1.75,7s0,.05,0,.07a1,1,0,0,1,.07.25.29.29,0,0,1,0,.09.85.85,0,0,1,0,.32l-1.2,6.33,6.12-1.16a1.13,1.13,0,0,1,.18,0h.16a1.25,1.25,0,0,1,.19,0l.08,0s0,0,.06,0l.12,0A15,15,0,1,0,18,3Z" fill="none"/><path d="M18,1A17,17,0,0,0,2.82,25.63L1.39,33.15a1,1,0,0,0,1,1.18h.18l7.34-1.4A17,17,0,1,0,18,1Zm0,32a15,15,0,0,1-7.46-2l-.12,0s0,0-.06,0l-.08,0a1.25,1.25,0,0,0-.19,0H9.93a1.13,1.13,0,0,0-.18,0L3.63,32.08l1.2-6.33a.85.85,0,0,0,0-.32.29.29,0,0,0,0-.09,1,1,0,0,0-.07-.25s0-.05,0-.07A14.82,14.82,0,0,1,3,18,15,15,0,1,1,18,33Z" fill="#777"/><circle cx="11.9" cy="18" r="2" fill="#777"/><circle cx="18" cy="18" r="2" fill="#777"/><circle cx="24.1" cy="18" r="2" fill="#777"/></g></svg><span  className='leftbar__item__title'>Reply Material</span></a></li>
                    <li ><a href='#' onClick={(e)=>handleNavigationClick(e,'routing')}><svg width="20" height="20"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_4_Routing" data-name="4_Routing"><path d="M9.74,28.23a2.39,2.39,0,1,0,2.38,2.38A2.39,2.39,0,0,0,9.74,28.23Z" fill="none"/><path d="M25,1.24a1,1,0,0,0-1.31,1.52l2.77,2.39H21.55a4.08,4.08,0,0,0-4.07,4.08V27.54a2.08,2.08,0,0,1-2.08,2.07H14a4.39,4.39,0,1,0,0,2h1.4a4.08,4.08,0,0,0,4.08-4.07V9.23a2.08,2.08,0,0,1,2.07-2.08h4.88l-2.77,2.4a1,1,0,0,0-.1,1.41,1,1,0,0,0,.75.34,1,1,0,0,0,.66-.24l5.68-4.91ZM9.74,33a2.39,2.39,0,1,1,2.38-2.39A2.39,2.39,0,0,1,9.74,33Z" fill="#777"/></g></svg><span className='leftbar__item__title'>Routing</span></a></li>
                    <li ><a href='#' onClick={(e)=>handleNavigationClick(e,'chatbots')}><svg width="20" height="20"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_5_Chatbots" data-name="5_Chatbots"><path d="M20,35H16A15,15,0,0,1,1,20V16A15,15,0,0,1,16,1h4A15,15,0,0,1,35,16v4A15,15,0,0,1,20,35ZM16,3A13,13,0,0,0,3,16v4A13,13,0,0,0,16,33h4A13,13,0,0,0,33,20V16A13,13,0,0,0,20,3Z" fill="#777"/><path d="M12.3,26a1,1,0,0,1-1-1V15.71a1,1,0,0,1,2,0V25A1,1,0,0,1,12.3,26Z" fill="#777"/><path d="M18,21.29a1,1,0,0,1-1-1V11a1,1,0,1,1,2,0v9.28A1,1,0,0,1,18,21.29Z" fill="#777"/><path d="M23.7,26a1,1,0,0,1-1-1V15.71a1,1,0,1,1,2,0V25A1,1,0,0,1,23.7,26Z" fill="#777"/></g></svg><span className='leftbar__item__title'>Chatbots</span></a></li>
                    <li ><a href='#' onClick={(e)=>handleNavigationClick(e,'sequence')}><svg width="20" height="20"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_6_Sequence" data-name="6_Sequence"><path d="M7.33,17.68a1,1,0,0,1-1-1V2a1,1,0,0,1,2,0V16.68A1,1,0,0,1,7.33,17.68Z" fill="#777"/><path d="M28.67,17.68a1,1,0,0,1-1-1V2a1,1,0,0,1,2,0V16.68A1,1,0,0,1,28.67,17.68Z" fill="#777"/><path d="M18.14,35a1,1,0,0,1-1-1V17.36a1,1,0,0,1,2,0V34A1,1,0,0,1,18.14,35Z" fill="#777"/><path d="M12.69,19.92H2a1,1,0,0,0,0,2H6.33V34a1,1,0,0,0,2,0V21.94s0,0,0,0h4.37a1,1,0,0,0,0-2Z" fill="#777"/><path d="M34,19.92H23.31a1,1,0,0,0,0,2h4.37s0,0,0,0V34a1,1,0,0,0,2,0V21.92H34a1,1,0,0,0,0-2Z" fill="#777"/><path d="M23.37,10.69H19V2a1,1,0,0,0-2,0v8.69H12.63a1,1,0,0,0,0,2H23.37a1,1,0,0,0,0-2Z" fill="#777"/></g></svg><span className='leftbar__item__title' >Sequence</span></a></li>
                    <li ><a href='#' onClick={(e)=>handleNavigationClick(e,'rules')}><svg  width="20" height="20"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_7_Rules" data-name="7_Rules"><path d="M18,25.09a1,1,0,0,1-.55-.17l-16-10.6a1,1,0,0,1,0-1.67L17.45,2a1,1,0,0,1,1.1,0l16,10.61a1,1,0,0,1,0,1.67l-16,10.6A1,1,0,0,1,18,25.09ZM3.81,13.48,18,22.89l14.19-9.41L18,4.08Z" fill="#777"/><path d="M18,29.61a1,1,0,0,1-.55-.17l-16-10.61a1,1,0,0,1,1.1-1.66L18,27.41,33.45,17.17a1,1,0,1,1,1.1,1.66l-16,10.61A1,1,0,0,1,18,29.61Z" fill="#777"/><path d="M18,34.12a1,1,0,0,1-.55-.16l-16-10.61a1,1,0,0,1,1.1-1.67L18,31.92,33.45,21.68a1,1,0,0,1,1.38.28,1,1,0,0,1-.28,1.39L18.55,34A1,1,0,0,1,18,34.12Z" fill="#777"/></g></svg><span className='leftbar__item__title' >Rules</span></a></li>
                    <li ><a href='#' onClick={(e)=>handleNavigationClick(e,'whatsappflows')}><svg width="20" height="20"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="11.12" cy="30.22" r="3.78" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width="2"/><circle cx="24.88" cy="30.22" r="3.78" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width="2"/><circle cx="18" cy="5.78" r="3.78" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width="2"/><path d="M11.12,26.76V19.69c0-1.67,1.73-3,3.85-3H21c2.12,0,3.85,1.37,3.85,3v7.07" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width="2"/><line x1="18" y1="10.12" x2="18" y2="16.65" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width="2"/><g id="_8_Whatsapp_flows" data-name="8_Whatsapp flows"><path d="M25.88,25.55V19.69c0-2.23-2.18-4-4.85-4H19v-5.2a4.78,4.78,0,1,0-2,0v5.2H15c-2.67,0-4.85,1.81-4.85,4v5.86a4.78,4.78,0,1,0,2,0V19.69c0-1.1,1.31-2,2.85-2H21c1.54,0,2.85.94,2.85,2v5.86a4.78,4.78,0,1,0,2,0ZM15.22,5.78A2.78,2.78,0,1,1,18,8.56,2.79,2.79,0,0,1,15.22,5.78ZM13.9,30.22a2.78,2.78,0,1,1-2.78-2.78A2.79,2.79,0,0,1,13.9,30.22Zm11,2.78a2.78,2.78,0,1,1,2.78-2.78A2.79,2.79,0,0,1,24.88,33Z" fill="#777"/></g></svg><span className='leftbar__item__title__whatsapp'>Whastapp Flows</span><div class="whatsapp__new">New</div></a></li>
                </div>
                <div className='msgContR automation__right__content'>
                  
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
export default Automations;