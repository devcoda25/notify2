import React,{useState,useRef,useEffect} from "react";


const Card = ({ title, onTitleClick, content, width, height, headerBackgroundColor, titleColor, borderColor, onDelete, onCopy, showEditButton }) => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isShowStartNode, setIsShowStartNode] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuVisible((prev) => !prev);
    };
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuVisible(false);
        }
    };

  
    const handleCopyClick = (e) => {
        e.stopPropagation();
        onCopy();
        setMenuVisible(false);
    };
    const handleEditClick = () => {
        onTitleClick();
        setMenuVisible(false)
    }
    const handleStartNodeClick = (e) => {
        e.stopPropagation();
        setMenuVisible(false);
        setIsShowStartNode(!isShowStartNode);
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <>
            {isShowStartNode && (
                <div className='nodestart'>Starting Step</div>
            )}
            <div className="chatbot_card" style={{
                border: borderColor,
                minHeight: height,
                width: width
            }}

                onClick={() => {

                    if (typeof onTitleClick === 'function') {
                        onTitleClick();
                    }
                }}>

                <div className='chatbot_card_header' style={{ backgroundColor: headerBackgroundColor }}>
                    <span className='chatbot_card_title' style={{ color: titleColor }} >{title}</span>
                    <button className='chatbot_menu_button' onClick={toggleMenu}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17C10.9 17 10 17.9 10 19Z" fill={titleColor}></path><path d="M10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3C10.9 3 10 3.9 10 5Z" fill={titleColor}></path><path d="M10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10C10.9 10 10 10.9 10 12Z" fill={titleColor}></path></svg>
                    </button>
                </div>
                <div className='message_list' >
                    {content}
                </div>
                {isMenuVisible && (
                    <div ref={menuRef} className='chatbotcard_menu_container'>
                        {showEditButton &&
                            <div className='chatbot_card_menu_itemconainer' onClick={handleEditClick} >
                                <svg className='chatbotmenu_item_icon' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.3753 9.16041C12.6078 9.74959 10.2511 7.39287 10.8402 5.62533M11.5664 4.89913L7.75841 8.70716C6.10291 10.3627 4.92846 12.437 4.36063 14.7083L4.17663 15.4443C4.11929 15.6736 4.32702 15.8814 4.55635 15.824L5.29236 15.64C7.56369 15.0722 9.638 13.8977 11.2935 12.2422L15.1015 8.43421C15.5703 7.96543 15.8337 7.32963 15.8337 6.66667C15.8337 5.28614 14.7145 4.16699 13.334 4.16699C12.671 4.16699 12.0352 4.43035 11.5664 4.89913Z" stroke="#333" stroke-width="1.25"></path></svg>
                                Edit
                            </div>
                        }
                        <div className='chatbot_card_menu_itemconainer' onClick={handleCopyClick}>
                            <svg className='chatbotmenu_item_icon' width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.80745 11.2459C6.47571 9.8316 6.47571 8.35976 6.80745 6.9455C7.2668 4.98721 8.79585 3.45816 10.7541 2.9988C12.1684 2.66707 13.6402 2.66707 15.0545 2.9988C17.0128 3.45816 18.5418 4.98721 19.0012 6.94551C19.3329 8.35976 19.3329 9.8316 19.0012 11.2459C18.5418 13.2041 17.0128 14.7332 15.0545 15.1926C13.6402 15.5243 12.1684 15.5243 10.7541 15.1926M6.80745 11.2459C7.2668 13.2041 8.79586 14.7332 10.7541 15.1926M6.80745 11.2459C6.59857 10.3554 6.52121 9.44208 6.57537 8.53469C6.49878 8.55032 6.42237 8.56708 6.34615 8.58496C4.66761 8.97869 3.35699 10.2893 2.96326 11.9678C2.67891 13.1801 2.67891 14.4416 2.96326 15.6539C3.35699 17.3324 4.66761 18.643 6.34615 19.0367C7.55837 19.3211 8.81994 19.3211 10.0322 19.0367C11.7107 18.643 13.0213 17.3324 13.415 15.6539C13.4329 15.5776 13.4497 15.5012 13.4653 15.4246C12.5579 15.4788 11.6446 15.4014 10.7541 15.1926" stroke="#666666" stroke-width="1.5"></path></svg>
                            Copy </div>
                        <div className='chatbot_card_menu_itemconainer' onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        >
                            <svg className='chatbotmenu_item_icon' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
                            Delete
                        </div>
                        <div className='chatbot_card_menu_itemconainer' onClick={handleStartNodeClick}>
                            <svg className='chatbotmenu_item_icon' width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 13.2565H14.8417C16.1394 13.2565 16.9326 11.7088 16.2489 10.5108L15.8001 9.72448C15.3584 8.95063 15.3584 7.97186 15.8001 7.19801L16.2489 6.41165C16.9326 5.21373 16.1394 3.66602 14.8417 3.66602L5.5 3.66602L5.5 13.2565ZM5.5 13.2565L5.5 18.3327" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            {isShowStartNode ? 'Unset Start Node' : 'Set Start Node'} </div>
                    </div>
                )}

            </div>
        </>
    );
};
export default Card;