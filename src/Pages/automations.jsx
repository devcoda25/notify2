import React, { useEffect, useState, useRef, useCallback } from 'react'
import DefaultAction from '../../src/Component/Automation/DefaultAction';
import KeywordAction from '../Component/Automation/KeywordAction';
import Replymaterial from '../../src/Component/Automation/Replymaterial';
import Routing from '../../src/Component/Automation/Routing';
import Rules from '../../src/Component/Automation/Rules';
import Sequence from '../../src/Component/Automation/Sequence';
import Chatbots from '../../src/Component/Automation/Chatbots';
import Whatsappflows from '../../src/Component/Automation/Whatsappflows';
import FlowBuilder from '../../src/Component/Automation/Chatbots/FlowBuilder';



const Automations = () => {
    //chatbot -->edit page
    const [showEditChatbot, setShowEditChatbot] = useState(false);
    const handleEditChatbotbutton = () => {
        setShowEditChatbot(true);
    }

    const [activeContent, setActiveContent] = useState('defaultaction');
    const handleNavigationClick = (e, content) => {
        e.preventDefault();
        setActiveContent(content);
    };
    
    const renderContent = () => {
        switch (activeContent) {
            case 'defaultaction':
                return <DefaultAction />
            case 'keywordaction':
                return <KeywordAction />
            case 'replymaterial':
                return <Replymaterial />
            case 'routing':
                return <Routing />
            case 'chatbots':
                return <Chatbots handleEditChatbotbutton={handleEditChatbotbutton} />
            case 'sequence':
                return <Sequence />
            case 'rules':
                return <Rules />
            case 'whatsappflows':
                return <Whatsappflows />

            default:
                return <DefaultAction />
        }
    }

    return (
        <>
            <div className='maincontent'>
                {showEditChatbot ? (
                    <FlowBuilder />

                ) :

                    <div className='msgCont'>

                        <div className='msgContL automation__left__content'>
                            <li className={`${activeContent === 'defaultaction' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'defaultaction')}>
                                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8287 6.30469L10.9187 9.45277C10.1788 10.0329 9.14151 10.0329 8.40156 9.45277L4.45801 6.30469" stroke="#666666" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.31392 1.20996H13.9562C15.2023 1.22394 16.3883 1.75073 17.238 2.66765C18.0878 3.58456 18.527 4.81157 18.4535 6.0629V12.0468C18.527 13.2981 18.0878 14.5251 17.238 15.442C16.3883 16.359 15.2023 16.8858 13.9562 16.8997H5.31392C2.63734 16.8997 0.833374 14.7222 0.833374 12.0468V6.0629C0.833374 3.38745 2.63734 1.20996 5.31392 1.20996Z" stroke="#666666" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                <span className='leftbar__item__title' >Default Action</span></a></li>
                            <li className={`${activeContent === 'keywordaction' ? 'active' : ''}`} ><a onClick={(e) => handleNavigationClick(e, 'keywordaction')}><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_2_Keyword_Action" data-name="2_Keyword Action"><path d="M29,35H7a6,6,0,0,1-6-6V7A6,6,0,0,1,7,1H29a6,6,0,0,1,6,6V29A6,6,0,0,1,29,35ZM7,3A4,4,0,0,0,3,7V29a4,4,0,0,0,4,4H29a4,4,0,0,0,4-4V7a4,4,0,0,0-4-4Z" fill="#777" /><path d="M26.36,17h-8a5.66,5.66,0,1,0,0,2h3.27v3.66a1,1,0,0,0,2,0V19h2.7a.47.47,0,0,1,.47.47v3.19a1,1,0,0,0,2,0V19.47A2.48,2.48,0,0,0,26.36,17ZM12.83,21.66A3.66,3.66,0,1,1,16.49,18,3.66,3.66,0,0,1,12.83,21.66Z" fill="#777" /></g></svg><span className='leftbar__item__title'>Keyword Action</span></a></li>
                            <li className={`${activeContent === 'replymaterial' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'replymaterial')}> <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.05386 11.2734C5.46282 11.2734 4.98267 10.7933 4.98267 10.2023C4.98267 9.61297 5.46282 9.13281 6.05386 9.13281C6.64489 9.13281 7.12505 9.61297 7.12505 10.2023C7.12505 10.7933 6.64489 11.2734 6.05386 11.2734ZM10.2182 11.2741C9.62716 11.2741 9.147 10.7939 9.147 10.2029C9.147 9.61362 9.62716 9.13346 10.2182 9.13346C10.8092 9.13346 11.2894 9.61362 11.2894 10.2029C11.2894 10.7939 10.8092 11.2741 10.2182 11.2741ZM13.3114 10.2029C13.3114 10.7939 13.7915 11.2741 14.3826 11.2741C14.9736 11.2741 15.4538 10.7939 15.4538 10.2029C15.4538 9.61362 14.9736 9.13346 14.3826 9.13346C13.7915 9.13346 13.3114 9.61362 13.3114 10.2029Z" fill="#666"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.0184 0.833008C4.69254 0.833008 0.833374 5.18362 0.833374 10.0134C0.833374 11.5558 1.28254 13.1431 2.07087 14.5936C2.21754 14.8332 2.23587 15.1352 2.13504 15.4207L1.52087 17.4771C1.38337 17.9729 1.80504 18.3392 2.27254 18.1923L4.12421 17.6424C4.62837 17.4771 5.02254 17.6874 5.49004 17.9729C6.82837 18.7615 8.49671 19.1663 10 19.1663C14.5467 19.1663 19.1667 15.6502 19.1667 9.9859C19.1667 5.10099 15.225 0.833008 10.0184 0.833008Z" stroke="#666" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"></path></svg><span className='leftbar__item__title'>Reply Material</span></a></li>
                            <li className={`${activeContent === 'routing' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'routing')}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.215 1.03522C16.152 0.967676 16.0761 0.913499 15.9918 0.875923C15.9075 0.838347 15.8164 0.818142 15.7241 0.816513C15.6318 0.814885 15.5401 0.831865 15.4545 0.866443C15.3689 0.901021 15.2911 0.952486 15.2259 1.01777C15.1606 1.08305 15.1091 1.16082 15.0745 1.24642C15.0399 1.33203 15.023 1.42372 15.0246 1.51603C15.0262 1.60835 15.0464 1.69938 15.084 1.78372C15.1216 1.86805 15.1758 1.94395 15.2433 2.00689L16.82 3.58356H11.1458C10.4772 3.58356 9.83605 3.84914 9.3633 4.32189C8.89056 4.79464 8.62497 5.43582 8.62497 6.10439V14.81C8.62497 15.4425 8.11164 15.9558 7.47914 15.9558H6.2948C6.1826 15.2962 5.83374 14.7001 5.31359 14.2792C4.79344 13.8583 4.13768 13.6415 3.46915 13.6694C2.80062 13.6972 2.16519 13.9679 1.6819 14.4306C1.1986 14.8934 0.900594 15.5165 0.843703 16.1832C0.786812 16.8498 0.974941 17.5144 1.37285 18.0523C1.77075 18.5903 2.35113 18.9647 3.00527 19.1054C3.65941 19.2462 4.34243 19.1436 4.92637 18.8169C5.51031 18.4903 5.95512 17.9619 6.17747 17.3308H7.47914C8.1477 17.3308 8.78889 17.0652 9.26163 16.5925C9.73438 16.1197 9.99997 15.4785 9.99997 14.81V6.10439C9.99997 5.47189 10.5133 4.95856 11.1458 4.95856H16.82L15.2433 6.53522C15.1219 6.66555 15.0558 6.83792 15.0589 7.01603C15.062 7.19414 15.1342 7.36408 15.2602 7.49004C15.3861 7.616 15.556 7.68816 15.7342 7.6913C15.9123 7.69444 16.0846 7.62833 16.215 7.50689L18.965 4.75689C19.0937 4.62798 19.166 4.45324 19.166 4.27106C19.166 4.08887 19.0937 3.91413 18.965 3.78522L16.215 1.03522ZM2.2083 16.4169C2.2083 16.0522 2.35317 15.7025 2.61103 15.4446C2.86889 15.1868 3.21863 15.0419 3.5833 15.0419C3.94797 15.0419 4.29771 15.1868 4.55557 15.4446C4.81344 15.7025 4.9583 16.0522 4.9583 16.4169C4.9583 16.7816 4.81344 17.1313 4.55557 17.3892C4.29771 17.647 3.94797 17.7919 3.5833 17.7919C3.21863 17.7919 2.86889 17.647 2.61103 17.3892C2.35317 17.1313 2.2083 16.7816 2.2083 16.4169Z" fill="#666"></path></svg><span className='leftbar__item__title'>Routing</span></a></li>
                            <li className={`${activeContent === 'chatbots' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'chatbots')}><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_5_Chatbots" data-name="5_Chatbots"><path d="M20,35H16A15,15,0,0,1,1,20V16A15,15,0,0,1,16,1h4A15,15,0,0,1,35,16v4A15,15,0,0,1,20,35ZM16,3A13,13,0,0,0,3,16v4A13,13,0,0,0,16,33h4A13,13,0,0,0,33,20V16A13,13,0,0,0,20,3Z" fill="#777" /><path d="M12.3,26a1,1,0,0,1-1-1V15.71a1,1,0,0,1,2,0V25A1,1,0,0,1,12.3,26Z" fill="#777" /><path d="M18,21.29a1,1,0,0,1-1-1V11a1,1,0,1,1,2,0v9.28A1,1,0,0,1,18,21.29Z" fill="#777" /><path d="M23.7,26a1,1,0,0,1-1-1V15.71a1,1,0,1,1,2,0V25A1,1,0,0,1,23.7,26Z" fill="#777" /></g></svg><span className='leftbar__item__title'>Chatbots</span></a></li>
                            <li className={`${activeContent === 'sequence' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'sequence')}><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_6_Sequence" data-name="6_Sequence"><path d="M7.33,17.68a1,1,0,0,1-1-1V2a1,1,0,0,1,2,0V16.68A1,1,0,0,1,7.33,17.68Z" fill="#777" /><path d="M28.67,17.68a1,1,0,0,1-1-1V2a1,1,0,0,1,2,0V16.68A1,1,0,0,1,28.67,17.68Z" fill="#777" /><path d="M18.14,35a1,1,0,0,1-1-1V17.36a1,1,0,0,1,2,0V34A1,1,0,0,1,18.14,35Z" fill="#777" /><path d="M12.69,19.92H2a1,1,0,0,0,0,2H6.33V34a1,1,0,0,0,2,0V21.94s0,0,0,0h4.37a1,1,0,0,0,0-2Z" fill="#777" /><path d="M34,19.92H23.31a1,1,0,0,0,0,2h4.37s0,0,0,0V34a1,1,0,0,0,2,0V21.92H34a1,1,0,0,0,0-2Z" fill="#777" /><path d="M23.37,10.69H19V2a1,1,0,0,0-2,0v8.69H12.63a1,1,0,0,0,0,2H23.37a1,1,0,0,0,0-2Z" fill="#777" /></g></svg><span className='leftbar__item__title' >Sequence</span></a></li>
                            <li className={`${activeContent === 'rules' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'rules')}><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g id="_7_Rules" data-name="7_Rules"><path d="M18,25.09a1,1,0,0,1-.55-.17l-16-10.6a1,1,0,0,1,0-1.67L17.45,2a1,1,0,0,1,1.1,0l16,10.61a1,1,0,0,1,0,1.67l-16,10.6A1,1,0,0,1,18,25.09ZM3.81,13.48,18,22.89l14.19-9.41L18,4.08Z" fill="#777" /><path d="M18,29.61a1,1,0,0,1-.55-.17l-16-10.61a1,1,0,0,1,1.1-1.66L18,27.41,33.45,17.17a1,1,0,1,1,1.1,1.66l-16,10.61A1,1,0,0,1,18,29.61Z" fill="#777" /><path d="M18,34.12a1,1,0,0,1-.55-.16l-16-10.61a1,1,0,0,1,1.1-1.67L18,31.92,33.45,21.68a1,1,0,0,1,1.38.28,1,1,0,0,1-.28,1.39L18.55,34A1,1,0,0,1,18,34.12Z" fill="#777" /></g></svg><span className='leftbar__item__title' >Rules</span></a></li>
                            <li className={`${activeContent === 'whatsappflows' ? 'active' : ''}`}><a onClick={(e) => handleNavigationClick(e, 'whatsappflows')}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Frame"><path id="Vector" d="M14.9987 13.4867V11.9442C14.9987 10.3358 13.6904 9.0275 12.082 9.0275C11.3929 9.0275 10.832 8.46666 10.832 7.7775V6.51333C11.318 6.34191 11.739 6.02436 12.0374 5.60424C12.3358 5.18411 12.4969 4.68197 12.4987 4.16666C12.4987 2.78833 11.377 1.66666 9.9987 1.66666C8.62036 1.66666 7.4987 2.78833 7.4987 4.16666C7.4987 5.25166 8.19786 6.1675 9.16536 6.5125V7.7775C9.16536 8.46666 8.60453 9.0275 7.91536 9.0275C6.30703 9.0275 4.9987 10.3358 4.9987 11.9442V13.4867C4.51274 13.6581 4.0917 13.9756 3.79332 14.3958C3.49493 14.8159 3.3338 15.318 3.33203 15.8333C3.33203 17.2117 4.4537 18.3333 5.83203 18.3333C7.21036 18.3333 8.33203 17.2117 8.33203 15.8333C8.33026 15.318 8.16913 14.8159 7.87075 14.3958C7.57236 13.9756 7.15132 13.6581 6.66536 13.4867V11.9442C6.66536 11.255 7.2262 10.6942 7.91536 10.6942C8.7312 10.6942 9.4687 10.355 9.9987 9.8125C10.2694 10.0913 10.5932 10.313 10.951 10.4644C11.3089 10.6158 11.6935 10.694 12.082 10.6942C12.7712 10.6942 13.332 11.255 13.332 11.9442V13.4867C12.8461 13.6581 12.425 13.9756 12.1266 14.3958C11.8283 14.8159 11.6671 15.318 11.6654 15.8333C11.6654 17.2117 12.787 18.3333 14.1654 18.3333C15.5437 18.3333 16.6654 17.2117 16.6654 15.8333C16.6636 15.318 16.5025 14.8159 16.2041 14.3958C15.9057 13.9756 15.4847 13.6581 14.9987 13.4867ZM5.83203 16.6667C5.61746 16.6571 5.41487 16.5651 5.26643 16.4098C5.11799 16.2546 5.03514 16.0481 5.03514 15.8333C5.03514 15.6185 5.11799 15.412 5.26643 15.2568C5.41487 15.1016 5.61746 15.0096 5.83203 15C6.0466 15.0096 6.24919 15.1016 6.39763 15.2568C6.54608 15.412 6.62892 15.6185 6.62892 15.8333C6.62892 16.0481 6.54608 16.2546 6.39763 16.4098C6.24919 16.5651 6.0466 16.6571 5.83203 16.6667ZM9.9987 3.33333C10.1638 3.33317 10.3251 3.38197 10.4624 3.47357C10.5998 3.56516 10.7068 3.69543 10.77 3.84789C10.8333 4.00035 10.8499 4.16814 10.8177 4.33003C10.7855 4.49192 10.7061 4.64063 10.5894 4.75734C10.4727 4.87405 10.324 4.95352 10.1621 4.98568C10.0002 5.01784 9.83238 5.00125 9.67992 4.93801C9.52747 4.87477 9.3972 4.76772 9.3056 4.63042C9.214 4.49311 9.1652 4.33172 9.16536 4.16666C9.16536 3.7075 9.5387 3.33333 9.9987 3.33333ZM14.1654 16.6667C13.9508 16.6571 13.7482 16.5651 13.5998 16.4098C13.4513 16.2546 13.3685 16.0481 13.3685 15.8333C13.3685 15.6185 13.4513 15.412 13.5998 15.2568C13.7482 15.1016 13.9508 15.0096 14.1654 15C14.3799 15.0096 14.5825 15.1016 14.731 15.2568C14.8794 15.412 14.9623 15.6185 14.9623 15.8333C14.9623 16.0481 14.8794 16.2546 14.731 16.4098C14.5825 16.5651 14.3799 16.6571 14.1654 16.6667Z" fill="#666"></path></g></svg><span className='leftbar__item__title__whatsapp'>Whastapp Flows</span><div class="whatsapp__new">New</div></a></li>
                        </div>
                        <div className='msgContR'>

                            {renderContent()}
                        </div>
                    </div>
                }
            </div>

        </>
    );
}
export default Automations;