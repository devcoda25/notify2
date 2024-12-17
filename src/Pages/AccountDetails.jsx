import React,{useState} from 'react';
import AccountSettings from '../Component/AccountDetails/AccountSettings';
import BillingInformation from '../Component/AccountDetails/BillingInformation';
import SwitchPlan from '../Component/AccountDetails/SwitchPlan';
import YourPlan from '../Component/AccountDetails/YourPlan'
const AccountDetails = () => {

    const [activeContent, setActiveContent] = useState('AccountSettings');
    const handleNavigationClick = (e, content) => {
        e.preventDefault();
        setActiveContent(content);
    };
   const renderContent = () => {
        switch (activeContent) {
            case 'AccountSettings':
                return <AccountSettings/>
             case 'BillingInformation':
                return <BillingInformation/>
            case 'YourPlan':
                return <YourPlan/>
            case 'SwitchPlan':
                return <SwitchPlan/>
            default:
                return <AccountSettings/>
        }
    }

    return (
        <>
            <div className='maincontent'>


                <div className='msgCont'>

                    <div className='msgContL analytics__left__content'>
                        <li className='solo'><a href='#' onClick={(e) => handleNavigationClick(e, 'AccountSettings')}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7517 4.69329C13.7517 3.85839 13.1416 3.14883 12.3161 3.0238C12.1066 2.99207 11.8935 2.99207 11.6839 3.0238C10.8584 3.14883 10.2482 3.85839 10.2482 4.6933V5.87397C9.77662 6.00858 9.32734 6.19618 8.90726 6.42992L8.07205 5.59471C7.48168 5.00435 6.54849 4.93407 5.87637 5.42937C5.70578 5.55509 5.55509 5.70578 5.42937 5.87637C4.93407 6.54849 5.00434 7.4817 5.59471 8.07207L6.42992 8.90728C6.19617 9.32735 6.00857 9.77663 5.87397 10.2483H4.6933C3.85839 10.2483 3.14883 10.8584 3.0238 11.6839C2.99207 11.8935 2.99207 12.1066 3.0238 12.3161C3.14883 13.1416 3.85839 13.7518 4.69329 13.7518H5.87396C6.00857 14.2234 6.19617 14.6727 6.42992 15.0927L5.59471 15.9279C5.00434 16.5183 4.93407 17.4515 5.42937 18.1236C5.55509 18.2942 5.70578 18.4449 5.87638 18.5706C6.5485 19.0659 7.48169 18.9957 8.07205 18.4053L8.90726 17.5701C9.32734 17.8038 9.77662 17.9914 10.2482 18.126V19.3067C10.2482 20.1416 10.8584 20.8512 11.6839 20.9762C11.8934 21.0079 12.1066 21.0079 12.3161 20.9762C13.1416 20.8512 13.7517 20.1416 13.7517 19.3067V18.1261C14.2234 17.9914 14.6727 17.8038 15.0927 17.5701L15.9279 18.4053C16.5183 18.9957 17.4515 19.0659 18.1236 18.5706C18.2942 18.4449 18.4449 18.2942 18.5706 18.1236C19.0659 17.4515 18.9957 16.5183 18.4053 15.928L17.5701 15.0928C17.8038 14.6727 17.9914 14.2234 18.1261 13.7518H19.3067C20.1416 13.7518 20.8512 13.1416 20.9762 12.3161C21.0079 12.1066 21.0079 11.8935 20.9762 11.6839C20.8512 10.8584 20.1416 10.2483 19.3067 10.2483H18.126C17.9914 9.77662 17.8038 9.32734 17.5701 8.90726L18.4053 8.07205C18.9957 7.48168 19.0659 6.54849 18.5706 5.87637C18.4449 5.70578 18.2942 5.55509 18.1236 5.42937C17.4515 4.93407 16.5183 5.00434 15.9279 5.59471L15.0927 6.42992C14.6727 6.19617 14.2234 6.00857 13.7517 5.87396V4.69329Z" stroke="#23a455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12Z" stroke="#23a455" stroke-width="1.5"></path></svg><span className='leftbar__item__title' >Account Settings</span></a></li>
                        <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'BillingInformation')}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.747 19.803L11.55 21L10.125 19.575L8.7 21L7.275 19.575L5.85 21L4.425 19.575L3 21V2L4.425 3.425L5.85 2L7.275 3.425L8.7 2L10.125 3.425L11.55 2L12.975 3.425L14.4 2L15.825 3.425L17.25 2L18.675 3.425L20.1 2V12.7825C19.5015 12.5735 18.865 12.45 18.2 12.45V4.85H4.9V18.15H12.5C12.5 18.6915 12.595 19.309 12.747 19.803ZM5.85 14.35V16.25H12.8325C13.0795 15.5375 13.45 14.901 13.963 14.35H5.85ZM5.85 12.45H17.25V10.55H5.85V12.45ZM5.85 8.65H17.25V6.75H5.85V8.65ZM22 16.4685L20.898 15.129L17.4875 18.5395L15.977 17.029L14.875 18.15L17.4875 21" fill="#666"></path></svg><span className='leftbar__item__title'>Billing Information</span></a></li>
                        <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'BillingInformation')}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.747 19.803L11.55 21L10.125 19.575L8.7 21L7.275 19.575L5.85 21L4.425 19.575L3 21V2L4.425 3.425L5.85 2L7.275 3.425L8.7 2L10.125 3.425L11.55 2L12.975 3.425L14.4 2L15.825 3.425L17.25 2L18.675 3.425L20.1 2V12.7825C19.5015 12.5735 18.865 12.45 18.2 12.45V4.85H4.9V18.15H12.5C12.5 18.6915 12.595 19.309 12.747 19.803ZM5.85 14.35V16.25H12.8325C13.0795 15.5375 13.45 14.901 13.963 14.35H5.85ZM5.85 12.45H17.25V10.55H5.85V12.45ZM5.85 8.65H17.25V6.75H5.85V8.65ZM22 16.4685L20.898 15.129L17.4875 18.5395L15.977 17.029L14.875 18.15L17.4875 21" fill="#666"></path></svg><span className='leftbar__item__title'>Billing Details</span></a></li>
                        <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'YourPlan')}><svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.0151 3.38916H2.01514V1.88916H14.0151M14.0151 10.8892H2.01514V6.38916H14.0151M14.0151 0.38916H2.01514C1.18264 0.38916 0.515137 1.05666 0.515137 1.88916V10.8892C0.515137 11.287 0.673172 11.6685 0.954476 11.9498C1.23578 12.2311 1.61731 12.3892 2.01514 12.3892H14.0151C14.413 12.3892 14.7945 12.2311 15.0758 11.9498C15.3571 11.6685 15.5151 11.287 15.5151 10.8892V1.88916C15.5151 1.05666 14.8401 0.38916 14.0151 0.38916Z" fill="#23a455"></path></svg><span className='leftbar__item__title'>Your Plan</span></a></li>
                        <li ><a href='#' onClick={(e) => handleNavigationClick(e, 'SwitchPlan')}><svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.24389 14.3091C8.24389 14.5852 8.02003 14.8091 7.74389 14.8091H4.12654C3.8504 14.8091 3.62654 14.5852 3.62654 14.3091V8.81929C3.62654 7.99086 2.95497 7.31929 2.12654 7.31929H1.00943C0.563976 7.31929 0.340893 6.78072 0.655875 6.46573L5.58166 1.53995C5.77692 1.34469 6.09351 1.34469 6.28877 1.53995L11.2146 6.46574C11.5295 6.78072 11.3065 7.31929 10.861 7.31929H9.74389C8.91546 7.31929 8.24389 7.99086 8.24389 8.81929V14.3091Z" stroke="#666"></path></svg><span className='leftbar__item__title'>Switch Plan</span></a></li>
                    </div>
                    <div className='msgContR'>

                        {renderContent()}
                    </div>
                </div>

            </div>

        </>
    );
}
export default AccountDetails;