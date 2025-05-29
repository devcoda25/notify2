import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';
import TextComponent from './NextSteps/TextComponent';
import EditTextModal from './NextSteps/Modal/EditTextModal';
import DocumentComponent from './NextSteps/DocumentComponent';
import ImageComponent from './NextSteps/ImageComponent';
import VideoComponent from './NextSteps/VideoComponent';
import EditCaptionModal from './NextSteps/Modal/EditCaptionModal';
import StickerComponent from './NextSteps/StickerComponent';
import ChatbotsComponent from './NextSteps/ChatbotsComponent';
import SequencesComponent from './NextSteps/SequenceComponent';
import ContactComponent from './NextSteps/ContactComponent';
import EditContactAttributesModal from './NextSteps/Modal/EditContactAttributeModal';
import DeleteModal from '../DeleteModal';
import Cuppysmile from '../Assets/img/01_Cuppy_smile.webp';
import Cuppylol from '../Assets/img/02_Cuppy_lol.webp';
import Cuppyrofl from '../Assets/img/03_Cuppy_rofl.webp';
import Cuppysad from '../Assets/img/04_Cuppy_sad.webp';
import Cuppycry from '../Assets/img/05_Cuppy_cry.webp';
import Cuppylove from '../Assets/img/06_Cuppy_love.webp';
import Cuppyhate from '../Assets/img/07_Cuppy_hate.webp';
import Cuppylovewithmug from '../Assets/img/08_Cuppy_lovewithmug.webp';
import Cuppylovewithcookie from '../Assets/img/09_Cuppy_lovewithcookie.webp';
import Cuppyhmm from '../Assets/img/10_Cuppy_hmm.webp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import SendNotificationComponent from './NextSteps/SendNotificationComponent';
import AssigntoUserComponent from './NextSteps/AssigntoUserComponent';
import AssigntoTeamComponent from './NextSteps/AssigntoTeamComponent';
import CatalogComponent from './NextSteps/CatalogComponent';
import ButtonComponent from '../ButtonComponent';
import SearchboxComponent from '../SearchboxComponent';
import CustomPagination from '../CustomPagination';
import EditNotificationModal from './NextSteps/Modal/EditNotificationModal';
import EditAssigntoUserModal from './NextSteps/Modal/EditAssigntoUserModal';
import EditAssigntoTeamModal from './NextSteps/Modal/EditAssigntoTeamModal';
import CheckboxComponent from '../CheckboxComponent';
import TableComponent from '../TableComponent';
import { DeleteOutlineIcon } from '../Icon';

const initialCardData = [
    {
        title: "Offline_message",
        content: "Dear {{name}} we're unavailable right now"
    },
    {
        title: 'confirmed order',
        content: 'Your Order was confirmed and processed already 😊'
    },
    {
        title: 'Rating',
        content: "Thank you again 🤝 {{Name}}. We hope to serve you again soon. Goodbye ! 👋Incase you havent save this WhatsApp number, kindly add +256393249612 to your address book to avoid inconvinience in your future bookings via WhatsApp Visit www.evzone.app to view our other services"
    }
]
const initialDocumentData = [];
const initialImageData = [];
const initialVideoData = [];
const initialStickerData = [
    {
        title: "01_Cuppy_smile.webp",
        content: Cuppysmile
    },
    {
        title: "02_Cuppy_lol.webp",
        content: Cuppylol
    },
    {
        title: "03_Cuppy_rofl.webp",
        content: Cuppyrofl
    },
    {
        title: "04_Cuppy_sad.webp",
        content: Cuppysad
    },
    {
        title: "05_Cuppy_cry.webp",
        content: Cuppycry
    },
    {
        title: "06_Cuppy_love.webp",
        content: Cuppylove
    },
    {
        title: "07_Cuppy_hate.webp",
        content: Cuppyhate
    },
    {
        title: "08_Cuppy_lovewithmug.webp",
        content: Cuppylovewithmug
    },
    {
        title: "09_Cuppy_lovewithcookie.webp",
        content: Cuppylovewithcookie
    },
    {
        title: "10_Cuppy_hmm.webp",
        content: Cuppyhmm
    }
];
const initialChatbotsData = [
    { title: 'Other_Options' },
    { title: 'Fleet_ownership' },
    { title: 'Chargepoint owner ship' },
    { title: 'Become a driver' },
    { title: 'Charging' },
    { title: 'Investors' },
    { title: 'Agent enrollment' },
    { title: 'Charge point operator' },
    { title: 'Book_for_someone_a_ride_now' },
    { title: 'deliver_a_parcel_now' },
    { title: 'Recieve_parcel(food)' },
    { title: 'EV Market' },
    { title: 'Sell_EV_market' },
    { title: 'Buy_EV_Market' },
    { title: 'soon_to_be_closed' },
    { title: 'rides-flow' },
    { title: 'payment_process' },
    { title: 'dispatch' },
    { title: 'reschedule_order' },
    { title: 'cancel_order' },
    { title: 'ratings' },
    { title: 'Catalog' }
]
const initialSequencesData = [
    { title: 'normal' },
    { title: "incomplete" },
    { title: 'test' },
    { title: 'finish' }
]
const initialContactData = [];
const initialSendNotificationData = [];
const initialAssigntoUserData = [];
const initialAssigntoTeamData = [];

const initialTemplateData = [
    { id: 1, name: 'to_airport_for_someone_later', category: 'Marketing', status: 'Approved', language: 'English', date: "5/8/2023" },
    { id: 2, name: 'from_airport_ride_someone_12', category: 'Marketing', status: 'Approved', language: 'English', date: "5/8/2023" },
    { id: 3, name: 'from_airport_for_me_today', category: 'Utility', status: 'Approved', language: 'English', date: "5/8/2023" },
    { id: 4, name: 'ambulance_ride_later', category: 'Utility', status: 'Approved', language: 'English', date: "5/8/2023" },
    { id: 5, name: 'driver_app', category: 'Marketing', status: 'Approved', language: 'English', date: "5/8/2023" }
]


const TemplateComponent = ({
    isMaterialChecked,
    handleCheckboxToggle,
    showCheckboxes,
}) => {
    // const templateColumn = [
    //     {
    //         id: "checkbox",
    //         label: ""
    //     },
    //     {
    //         id: "name", label: (
    //             <div>
    //                 Template Name
    //                 <div>Category</div>
    //             </div>
    //         )
    //     },
    //     { id: "status", label: "Status" },
    //     { id: "language", label: "Language" },
    //     { id: "date", label: "Last Updated" },
    //     { id: "actions", label: "Actions" },
    // ]
    // const transformedTemplateData = initialTemplateData.map((data, index) => ({

    //     checkbox: (

    //         <CheckboxComponent
    //             checked={isMaterialChecked['Templates']?.includes(data.title)}
    //             onToggle={() => handleCheckboxToggle(data.title, 'Templates')}
    //         />
    //     ),
    //     name: (
    //         <div>
    //             {data.name}
    //             <div className='table_cell_category'>{data.category}</div>
    //         </div>
    //     ),
    //     status: (
    //         <div className='table_status'>{data.status}</div>
    //     ),


    //     actions: (
    //         <>
    //             <div>
    //                 <button className='template_table_btn'><ContentCopyIcon /></button>
    //                 <button className='template_table_btn'><RemoveRedEyeOutlinedIcon /></button>
    //                 <button className='template_table_btn'>
    //                     <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
    //                 </button>
    //                 {!showCheckboxes && (
    //                     <ButtonComponent label='submit' customBtn='template_table_submit_btn' />
    //                 )}
    //             </div>
    //         </>
    //     ),

    // }));
    const columns = [
        ...(showCheckboxes ? [{ id: 'checkbox', label: '',width:'100px' }] : []),
        { id: 'name', label:(
            <div>
                Template name
                <div>Category</div>
            </div>
        ),width:'200px' },
      
        { id: 'status', label: 'Status',width:'150px' },
        { id: 'language', label: 'Language',width:'150px'},
        { id: 'date', label: 'Last Updated',width:'150px' },
        { id: 'actions', label: 'Actions',width:'150px' },
    ];



    const customRenderCell = (row, column) => {
        switch (column.id) {
            case 'checkbox':
                return (
                    <CheckboxComponent
                        checked={isMaterialChecked['Templates']?.includes(row.title)}
                        onToggle={() => handleCheckboxToggle(row.title, 'Templates')}
                    />
                );
            case 'name':
                return (
                    <div className='templatetable_name_category'>
                        {row.name}
                        <div>{row.category}</div>
                    </div>
                );
            case 'status':
                return <div className='template_table_status'>{row.status}</div>;
                case 'language':
                    return <div className='templatetable_name_category'>{row.language}</div>;
                    case 'date':
                        return <div className='templatetable_name_category'>{row.date}</div>;
            case 'actions':
                return (
                    <div>
                        <div className='templatetable_actions'>
                        <button className='template_table_btn'><ContentCopyIcon /></button>
                        <button className='template_table_btn'><RemoveRedEyeOutlinedIcon /></button>
                        <button className='template_table_btn'><DeleteOutlineIcon /></button>
                        </div>
                        {!showCheckboxes && (
                            <ButtonComponent label='Submit' customBtn='template_table_submit_btn' />
                        )}
                    </div>
                );
            default:
                return row[column.id];
        }
    };
    return (
        <div>
            {/* <Table className='templates_table'>
                <TableHead>
                    <TableRow>
                        {showCheckboxes && (
                            <TableCell className='table_heading'></TableCell>
                        )}
                        <TableCell className='table_heading'>Template Name<div>Category</div></TableCell>
                        <TableCell className='table_heading template_table_center_heading'>Status</TableCell>
                        <TableCell className='table_heading'>Language</TableCell>
                        <TableCell className='table_heading'>Last Updated</TableCell>
                        <TableCell className='table_heading template_table_center_heading'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        initialTemplateData.map((data) => (
                            <TableRow key={data.id}>
                                {showCheckboxes && (

                                    <TableCell className='table_body_cell'>
                                        <CheckboxComponent
                                            checked={isMaterialChecked['Templates']?.includes(data.title)}
                                            onToggle={() => handleCheckboxToggle(data.title, 'Templates')}
                                        />

                                    </TableCell>
                                )}
                                <TableCell className='table_body_cell'>{data.name}<div className='table_cell_category'>{data.category}</div></TableCell>
                                <TableCell className='table_body_cell'><div className='table_status'>{data.status}</div></TableCell>
                                <TableCell className='table_body_cell'>{data.language}</TableCell>
                                <TableCell className='table_body_cell'>{data.date}</TableCell>
                                <TableCell className='table_body_cell'>
                                    <button className='template_table_btn'><ContentCopyIcon /></button>
                                    <button className='template_table_btn'> <RemoveRedEyeOutlinedIcon /></button>
                                    <button className='template_table_btn'>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 5.2355C2.15482 5.2355 1.875 5.51532 1.875 5.8605C1.875 6.20567 2.15482 6.4855 2.5 6.4855V5.2355ZM17.5 6.4855C17.8452 6.4855 18.125 6.20567 18.125 5.8605C18.125 5.51532 17.8452 5.2355 17.5 5.2355V6.4855ZM4.16667 5.8605V5.2355H3.54167V5.8605H4.16667ZM15.8333 5.8605H16.4583V5.2355H15.8333V5.8605ZM15.2849 14.0253L15.8853 14.1986L15.2849 14.0253ZM11.4366 17.3795L11.5408 17.9957L11.4366 17.3795ZM8.56334 17.3795L8.66748 16.7632L8.66748 16.7632L8.56334 17.3795ZM8.43189 17.3572L8.32775 17.9735H8.32775L8.43189 17.3572ZM4.71512 14.0252L4.11464 14.1986L4.71512 14.0252ZM11.5681 17.3572L11.464 16.741L11.5681 17.3572ZM6.53545 4.57449L7.10278 4.83672L6.53545 4.57449ZM7.34835 3.48427L6.93124 3.01881V3.01881L7.34835 3.48427ZM8.56494 2.7558L8.78243 3.34174L8.56494 2.7558ZM11.4351 2.7558L11.6526 2.16987V2.16987L11.4351 2.7558ZM13.4645 4.57449L14.0319 4.31226L13.4645 4.57449ZM2.5 6.4855H17.5V5.2355H2.5V6.4855ZM11.464 16.741L11.3325 16.7632L11.5408 17.9957L11.6722 17.9735L11.464 16.741ZM8.66748 16.7632L8.53603 16.741L8.32775 17.9735L8.4592 17.9957L8.66748 16.7632ZM15.2083 5.8605V10.1465H16.4583V5.8605H15.2083ZM4.79167 10.1465V5.8605H3.54167V10.1465H4.79167ZM15.2083 10.1465C15.2083 11.4005 15.0319 12.648 14.6844 13.8519L15.8853 14.1986C16.2654 12.882 16.4583 11.5177 16.4583 10.1465H15.2083ZM11.3325 16.7632C10.4503 16.9123 9.54967 16.9123 8.66748 16.7632L8.4592 17.9957C9.47927 18.1681 10.5207 18.1681 11.5408 17.9957L11.3325 16.7632ZM8.53603 16.741C7.00436 16.4821 5.75131 15.3612 5.3156 13.8519L4.11464 14.1986C4.68231 16.1651 6.31805 17.6339 8.32775 17.9735L8.53603 16.741ZM5.3156 13.8519C4.96808 12.648 4.79167 11.4005 4.79167 10.1465H3.54167C3.54167 11.5177 3.73457 12.8819 4.11464 14.1986L5.3156 13.8519ZM11.6722 17.9735C13.6819 17.6339 15.3177 16.1651 15.8853 14.1986L14.6844 13.8519C14.2487 15.3612 12.9956 16.4821 11.464 16.741L11.6722 17.9735ZM6.875 5.86049C6.875 5.51139 6.95162 5.16374 7.10278 4.83672L5.96813 4.31226C5.74237 4.80066 5.625 5.32698 5.625 5.86049H6.875ZM7.10278 4.83672C7.25406 4.50944 7.47797 4.20734 7.76546 3.94972L6.93124 3.01881C6.52229 3.38529 6.19376 3.82411 5.96813 4.31226L7.10278 4.83672ZM7.76546 3.94972C8.05308 3.69197 8.39813 3.48439 8.78243 3.34174L8.34744 2.16987C7.8218 2.36498 7.34006 2.65246 6.93124 3.01881L7.76546 3.94972ZM8.78243 3.34174C9.16676 3.19908 9.58067 3.125 10 3.125V1.875C9.43442 1.875 8.87306 1.97476 8.34744 2.16987L8.78243 3.34174ZM10 3.125C10.4193 3.125 10.8332 3.19908 11.2176 3.34174L11.6526 2.16987C11.1269 1.97476 10.5656 1.875 10 1.875V3.125ZM11.2176 3.34174C11.6019 3.48439 11.9469 3.69198 12.2345 3.94972L13.0688 3.01881C12.6599 2.65246 12.1782 2.36498 11.6526 2.16987L11.2176 3.34174ZM12.2345 3.94972C12.522 4.20735 12.7459 4.50944 12.8972 4.83672L14.0319 4.31226C13.8062 3.82411 13.4777 3.38529 13.0688 3.01881L12.2345 3.94972ZM12.8972 4.83672C13.0484 5.16374 13.125 5.51139 13.125 5.8605H14.375C14.375 5.32698 14.2576 4.80066 14.0319 4.31226L12.8972 4.83672ZM4.16667 6.4855H15.8333V5.2355H4.16667V6.4855Z" fill="#333333"></path><path d="M8.33203 10V13.3333M11.6654 10V13.3333" stroke="#333333" stroke-width="1.25" stroke-linecap="round"></path></svg>
                                    </button>
                                    {
                                        !showCheckboxes &&
                                        <ButtonComponent label='submit' customBtn='template_table_submit_btn' />
                                    }
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table> */}
            {/* <TableComponent
                columns={templateColumn}
                data={transformedTemplateData}
                showActions={false}
            /> */}
            <TableComponent
                columns={columns}
                data={initialTemplateData}
                //   onEdit={handleEdit}
                //   onDelete={handleDelete}
                showActions={false}
                customRenderCell={customRenderCell}
            />
        </div>
    )
}



const Nextstep = ({
    buttonData,
    InitialLoadingData,
    isOpenEditPage,
    isAddOpenPage,
    selectedEditRow,
    isMaterialCheckedAdd,
    isMaterialCheckedEdit,
    handleDeleteMaterial,
    handleCheckboxToggle,
    handleCancelBtn,
    handleSaveBtn,
    setIsOpenYourTemplate,
    showCheckboxes = true }) => {

    const [cardData, setCardData] = useState(() => {

        const storedData = sessionStorage.getItem('cardData');
        return storedData ? JSON.parse(storedData) : {
            textCards: initialCardData,
            documentCards: initialDocumentData,
            imageCards: initialImageData,
            videoCards: initialVideoData,
            stickerCards: initialStickerData,
            chatbotsCards: initialChatbotsData,
            sequencesCards: initialSequencesData,
            contactCards: initialContactData,
            templateCards: initialTemplateData,
            notificationCards: initialSendNotificationData,
            assigntouserCards: initialAssigntoUserData,
            assigntoteamCards: initialAssigntoTeamData,
        };
    });

    useEffect(() => {

        sessionStorage.setItem('cardData', JSON.stringify(cardData));
    }, [cardData])

    const [searchCardData, setSearchCardData] = useState('');
    const [showDeleteTextModal, setShowDeleteTextModal] = useState(false);
    const [cardTextToDelete, setCardTextToDelete] = useState(null);
    const [editTextModal, setEditTextModal] = useState(false);
    const [selectedTextCard, setSelectedTextCard] = useState(null);
    const [isTextEditing, setTextEditing] = useState(false);
    const [selectedButton, setSelectedButton] = useState(InitialLoadingData);
    const [isOpenEditCaption, setIsOpenEditCaption] = useState(false);
    const [isOpenChatbotsConfirmModal, setOpenChatbotsConfirmModal] = useState(false);
    const [isOpenSequenceConfirmModal, setOpenSequenceConfirmModal] = useState(false);
    const [isOpenContactAttributesModal, setOpenContactAttributesModal] = useState(false);
    const [isOpenNotificationModal, setOpenNotificationModal] = useState(false);
    const [isOpenAssigntoUserModal, setOpenAssigntoUserModal] = useState(false);
    const [isOpenAssigntoTeamModal, setOpenAssigntoTeamModal] = useState(false);
    const [keywordPage, setKeywordPage] = useState(0);
    const [keywordrowsPerPage, setKeywordRowsPerPage] = useState(10);


    const handleChangeKeywordPage = (event, newPage) => {
        setKeywordPage(newPage);
    };

    // Handle rows per page change
    const handleChangeKeywordRowsPerPage = (event) => {
        setKeywordRowsPerPage(parseInt(event.target.value, 10));
        setKeywordPage(0);
    };
    const filtercarddata = (selectedButton === 'Text' ?
        cardData.textCards.filter(data =>
            data.title.toLowerCase().includes(searchCardData.toLowerCase()) ||
            data.content.toLowerCase().includes(searchCardData.toLowerCase())
        )
        :
        selectedButton === 'Document' ?
            cardData.documentCards.filter(data =>
                data.title.toLowerCase().includes(searchCardData.toLowerCase())
            )
            :
            selectedButton === 'Image' ?
                cardData.imageCards.filter(data =>
                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                )
                :
                selectedButton === 'Video' ?
                    cardData.videoCards.filter(data =>
                        data.title.toLowerCase().includes(searchCardData.toLowerCase())
                    )
                    :
                    selectedButton === 'Sticker' ?
                        cardData.stickerCards.filter(data =>
                            data.title.toLowerCase().includes(searchCardData.toLowerCase())
                        )
                        : selectedButton === 'Chatbots' ?
                            cardData.chatbotsCards.filter(data =>
                                data.title.toLowerCase().includes(searchCardData.toLowerCase())
                            )
                            :
                            selectedButton === 'Sequences' ?
                                cardData.sequencesCards.filter(data =>
                                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                )
                                :
                                selectedButton === 'Contact' ?
                                    cardData.contactCards.filter(data =>
                                        data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                    ) :
                                    selectedButton === 'Templates' && cardData.templateCards
                                        ? cardData.templateCards.filter(data =>
                                            data.name.toLowerCase().includes(searchCardData.toLowerCase())
                                        )
                                        :
                                        selectedButton === 'SendNotification' ?
                                            cardData.notificationCards.filter(data =>
                                                data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                            )
                                            :
                                            selectedButton === 'AssigntoUser' ?
                                                cardData.assigntouserCards.filter(data =>
                                                    data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                                )
                                                :
                                                selectedButton === 'AssigntoTeam' ?
                                                    cardData.assigntoteamCards.filter(data =>
                                                        data.title.toLowerCase().includes(searchCardData.toLowerCase())
                                                    )
                                                    :
                                                    []
    );
    const handleDeleteTextCard = (title) => {
        setCardTextToDelete(title);
        setShowDeleteTextModal(true);
    }

    const handleDeleteTextCardConfirm = () => {
        setCardData(prevData => ({
            textCards: prevData.textCards.filter(card => card.title !== cardTextToDelete),
            documentCards: prevData.documentCards.filter(card => card.title !== cardTextToDelete),
            imageCards: prevData.imageCards.filter(card => card.title !== cardTextToDelete),
            videoCards: prevData.videoCards.filter(card => card.title !== cardTextToDelete),
            stickerCards: prevData.stickerCards.filter(card => card.title !== cardTextToDelete),
            contactCards: prevData.contactCards.filter(card => card.title !== cardTextToDelete),
            notificationCards: prevData.notificationCards.filter(card => card.title !== cardTextToDelete),
            assigntouserCards: prevData.assigntouserCards.filter(card => card.title !== cardTextToDelete),
            assigntoteamCards: prevData.assigntoteamCards.filter(card => card.title !== cardTextToDelete)
        }));

        setShowDeleteTextModal(false);
        setCardTextToDelete(null);
    };

    const handleCloseDeleteTextCard = () => {
        setShowDeleteTextModal(false);
        setCardTextToDelete(null);
    }
    const handleEditTextModal = (card) => {
        setSelectedTextCard(card);
        setEditTextModal(true);
        setTextEditing(true);
    }

    const handleCloseEditTextModal = () => {
        setEditTextModal(false);
        setSelectedTextCard(null);
    }
    const handleEditCaptionModal = (card) => {
        setSelectedTextCard(card);
        setIsOpenEditCaption(true);
        setTextEditing(true);
    }

    const handleCloseEditCaptionModal = () => {
        setIsOpenEditCaption(false);
        setSelectedTextCard(null)
    }

    const handleSaveEditText = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                textCards: prevData.textCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                textCards: [...prevData.textCards, { title, content }]
            }));
        }
        handleCloseEditTextModal();
    };

    const handleSaveEditCaption = (newTitle) => {
        setCardData(prevData => {
            let updatedCards;

            if (selectedButton === 'Document') {
                updatedCards = prevData.documentCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    documentCards: updatedCards,
                };
            } else if (selectedButton === 'Image') {
                updatedCards = prevData.imageCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    imageCards: updatedCards,
                };
            } else if (selectedButton === 'Video') {
                updatedCards = prevData.videoCards.map(card => {
                    if (card.title === selectedTextCard.title) {
                        return { ...card, title: newTitle };
                    }
                    return card;
                });
                return {
                    ...prevData,
                    videoCards: updatedCards,
                };
            }

            return prevData;
        });

        handleCloseEditCaptionModal();
    };


    const handleAddTextCard = () => {
        if (selectedButton === 'Text') {
            setSelectedTextCard(null);
            setTextEditing(false);
            setEditTextModal(true);
        } else if (selectedButton === 'Document') {
            document.getElementById('btn-file').click();
        }
        else if (selectedButton === 'Image') {
            document.getElementById('btn-file-img').click();
        }
        else if (selectedButton === 'Video') {
            document.getElementById('btn-file-video').click();
        }
        else if (selectedButton === 'Sticker') {
            document.getElementById('btn-file-stickerimg').click();
        }
        else if (selectedButton === 'Chatbots') {
            setOpenChatbotsConfirmModal(true);
        }
        else if (selectedButton === 'Sequences') {
            setOpenSequenceConfirmModal(true);
        }
        else if (selectedButton === 'Contact') {
            setOpenContactAttributesModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'Templates') {
            setIsOpenYourTemplate(true);
        }
        else if (selectedButton === 'SendNotification') {
            setOpenNotificationModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'AssigntoUser') {
            setOpenAssigntoUserModal(true);
            setSelectedTextCard(null);
            setTextEditing(false);
        }
        else if (selectedButton === 'AssigntoTeam') {
            setSelectedTextCard(null);
            setTextEditing(false);
            setOpenAssigntoTeamModal(true);
        }
    };

    const handleFileChange = (event) => {
        const files = event.target.files;

        const loadedDocuments = Array.from(files).map(file => ({
            title: file.name,
        }));

        setCardData(prevState => ({
            ...prevState,
            documentCards: [...prevState.documentCards, ...loadedDocuments],
        }));
    };

    const handleImageChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0]; //get 1st image file
            const fileName = file.name;
            const fileReader = new FileReader();

            fileReader.onloadend = () => {
                const newImageCard = {
                    title: fileName,
                    content: fileReader.result, // img URL
                };

                // Update the imageCards in state
                setCardData((prevData) => ({
                    ...prevData,
                    imageCards: [...prevData.imageCards, newImageCard],
                }));
            };

            fileReader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const videoFile = files[0];
            const videoTitle = videoFile.name; // fetch the file name as title

            // video url
            const videoURL = URL.createObjectURL(videoFile);


            setCardData(prevData => ({
                ...prevData,
                videoCards: [...prevData.videoCards, { title: videoTitle, content: videoURL }]
            }));
        }
    };
    const handleStickerImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newStickerData = {
                    title: file.name,
                    content: reader.result //image url
                };

                // Updatethe new sticker
                setCardData(prevCardData => ({
                    ...prevCardData,
                    stickerCards: [...prevCardData.stickerCards, newStickerData]
                }));


                event.target.value = '';
            };

            reader.readAsDataURL(file);
        }
    };
    const handleCloseChatbotsConfirm = () => {
        setOpenChatbotsConfirmModal(false);
    }
    const handleEditChatbotsConfirm = () => {
        setOpenChatbotsConfirmModal(true);
    }
    const handleCloseSequenceConfirm = () => {
        setOpenSequenceConfirmModal(false);
    }
    const handleEditSequenceConfirm = () => {
        setOpenSequenceConfirmModal(true);
    }
    const handleCloseContactAttributes = () => {
        setOpenContactAttributesModal(false);
    }
    const handleEditContactAttributes = (card) => {
        setOpenContactAttributesModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);
    }
    const handleCloseAssigntoUser = () => {
        setOpenAssigntoUserModal(false);
    }
    const handleEditAssigntoUser = (card) => {
        setOpenAssigntoUserModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);
    }
    const handleEditAssigntoTeam = (card) => {
        setSelectedTextCard(card);
        setTextEditing(true);
        setOpenAssigntoTeamModal(true);
    }
    const handleCloseAssigntoTeam = () => {
        setOpenAssigntoTeamModal(false);
    }
    const handleSaveAssigntoUser = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                assigntouserCards: prevData.assigntouserCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                assigntouserCards: [...prevData.assigntouserCards, { title, content }]
            }));
        }
        handleCloseAssigntoUser();

    }
    const handleSaveAssigntoTeam = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                assigntoteamCards: prevData.assigntoteamCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                assigntoteamCards: [...prevData.assigntoteamCards, { title, content }]
            }));
        }
        handleCloseAssigntoTeam();
    }
    const handleSaveContactAttributes = ({ title, rows }) => {


        if (isTextEditing) {
            // Update the existing card
            setCardData((prevData) => ({
                ...prevData,
                contactCards: prevData.contactCards.map((card) =>
                    card.title === selectedTextCard.title ? { title, attributes: rows } : card
                ),
            }));
        } else {
            // Add new contact card
            setCardData((prevData) => ({
                ...prevData,
                contactCards: [
                    ...prevData.contactCards,
                    { title, attributes: rows },
                ],
            }));
        }

        handleCloseContactAttributes();
    }
    const handleCloseNotification = () => {
        setOpenNotificationModal(false);
    }
    const handleEditNotification = (card) => {
        setOpenNotificationModal(true);
        setSelectedTextCard(card);
        setTextEditing(true);

    }
    const handleSaveNotification = (title, content) => {
        if (isTextEditing) {
            setCardData(prevData => ({
                ...prevData,
                notificationCards: prevData.notificationCards.map(data =>
                    data.title === selectedTextCard.title ? { title, content } : data
                )
            }));
        } else {
            setCardData(prevData => ({
                ...prevData,
                notificationCards: [...prevData.notificationCards, { title, content }]
            }));
        }
        handleCloseNotification();
    }

    return (
        <div>
            {
                showDeleteTextModal && (<DeleteModal show={showDeleteTextModal} onClose={handleCloseDeleteTextCard}
                    onConfirm={handleDeleteTextCardConfirm} msg='Do you want to remove this card?' />)
            }
            {
                editTextModal && (
                    <EditTextModal show={editTextModal} onClose={handleCloseEditTextModal} onSave={handleSaveEditText}
                        initialTitle={selectedTextCard?.title || ''}
                        initialContent={selectedTextCard?.content || ''} />
                )
            }
            {
                isOpenEditCaption &&
                <EditCaptionModal show={isOpenEditCaption} onClose={handleCloseEditCaptionModal} onSave={handleSaveEditCaption}
                    initialTitle={selectedTextCard?.title} />
            }
            {
                isOpenChatbotsConfirmModal &&
                <DeleteModal show={isOpenChatbotsConfirmModal} onClose={handleCloseChatbotsConfirm} msg='You will lose unsaved changes when you navigate to chatbot builder. Are you sure you want to continue?' />
            }
            {
                isOpenSequenceConfirmModal &&
                <DeleteModal show={isOpenSequenceConfirmModal} onClose={handleCloseSequenceConfirm} msg='Do you want to go to the Sequence Editor and lose not saved settings?' />
            }
            {
                isOpenContactAttributesModal &&
                <EditContactAttributesModal show={isOpenContactAttributesModal} onClose={handleCloseContactAttributes} onSave={handleSaveContactAttributes}
                    initialTitle={selectedTextCard?.title || ''}
                    initialRows={selectedTextCard?.attributes || [{ selectedOption: "", booleanOption: null, inputValue: "" }]} />
            }
            {
                isOpenNotificationModal &&
                <EditNotificationModal show={isOpenNotificationModal} onClose={handleCloseNotification} onSave={handleSaveNotification}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }
            {
                isOpenAssigntoUserModal &&
                <EditAssigntoUserModal show={isOpenAssigntoUserModal} onClose={handleCloseAssigntoUser} onSave={handleSaveAssigntoUser}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }
            {
                isOpenAssigntoTeamModal &&
                <EditAssigntoTeamModal show={isOpenAssigntoTeamModal} onClose={handleCloseAssigntoTeam} onSave={handleSaveAssigntoTeam}
                    initialTitle={selectedTextCard?.title || ''}
                    initialContent={selectedTextCard?.content || ''} />
            }


            <div className='nextstep__editor__container'>
                <div className='nextstep_left_container'>
                    {
                        buttonData.map((btn, index) => (
                            <button key={index} className={`nextstep__btn__container ${selectedButton === btn.value ? 'active' : ''}`} onClick={() => setSelectedButton(btn.value)}>
                                <span class="tab-item__icon">{btn.icon}</span>
                                <span class="tab-item__name">{btn.name}</span>
                            </button>
                        ))
                    }

                </div>
                <div className='nextstep_right_container'>
                    <div className='materials__header'>

                        <div className='materials__search'>
                            <SearchboxComponent value={searchCardData} onChange={(e) => setSearchCardData(e.target.value)} customSearch='custom__search_box' placeholder='Search...' />

                        </div>
                        {showCheckboxes && (
                            <div className='select__material'>
                                <label className='selected__items'>Selected material :</label>

                                {isOpenEditPage && (
                                    <span>
                                        {selectedEditRow && Array.isArray(selectedEditRow.replyMaterial) && selectedEditRow.replyMaterial.length > 0 && (
                                            selectedEditRow.replyMaterial.map((material, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{material}</div>
                                                        <svg
                                                            className='selected_material_delete'
                                                            onClick={() => handleDeleteMaterial(material)}
                                                            aria-hidden="true"
                                                            viewBox="0 0 24 24"
                                                            data-testid="CancelIcon"
                                                        >
                                                            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                        {Object.entries(isMaterialCheckedEdit).map(([type, items]) => (
                                            items.length > 0 && items.map((item, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{`${type}: ${item}`}</div>
                                                        <svg focusable="false" className='selected_material_delete' onClick={() => handleCheckboxToggle(item, type)} aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div> </button>
                                            ))
                                        ))}
                                    </span>
                                )}

                                {isAddOpenPage && (
                                    <span>
                                        {Object.entries(isMaterialCheckedAdd).map(([type, items]) => (
                                            items.length > 0 && items.map((item, index) => (
                                                <button key={index} className='selected_material_chip'>
                                                    <div className='selected_chip_container'>
                                                        <div className='selected_material_chip_label'>{`${type}: ${item}`}</div>
                                                        <svg focusable="false" className='selected_material_delete' onClick={() => handleCheckboxToggle(item, type)} aria-hidden="true" viewBox="0 0 24 24" data-testid="CancelIcon"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"></path></svg>
                                                    </div> </button>
                                            ))
                                        ))}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className='material_btn_container'>
                            {showCheckboxes && (
                                <>
                                    <ButtonComponent customBtn='cancel_button_style' label='cancel' onClick={handleCancelBtn} />
                                    <ButtonComponent label='Save' onClick={handleSaveBtn} disabled={
                                        (isAddOpenPage && (!isMaterialCheckedAdd || Object.keys(isMaterialCheckedAdd).length === 0)) ||
                                        (isOpenEditPage && (!isMaterialCheckedEdit || Object.keys(isMaterialCheckedEdit).length === 0))
                                    } />

                                </>
                            )}
                            {selectedButton !== 'Catalog' && (
                                <ButtonComponent label='Add' onClick={handleAddTextCard} customBtn='keyword__add__btn' />

                            )}
                            <input id="btn-file" type="file" accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, text/plain, application/pdf" hidden
                                onChange={handleFileChange} />
                            <input id="btn-file-img" type="file" accept="image/jpeg, image/png, image/webp" hidden
                                onChange={handleImageChange} />
                            <input id="btn-file-video" type="file" accept="video/m4v, video/mp4, video/3gpp" hidden
                                onChange={handleVideoChange} />
                            <input id="btn-file-stickerimg" type="file" accept="image/webp" hidden onChange={handleStickerImageChange}
                            />
                        </div>

                    </div>

                    {
                        selectedButton === 'Text' && (
                            <TextComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditTextModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}

                            />
                        )
                    }
                    {
                        selectedButton === 'Document' && (
                            <DocumentComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Image' && (
                            <ImageComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Video' && (
                            <VideoComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditCaptionModal}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Sticker' && (
                            <StickerComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Chatbots' && (
                            <ChatbotsComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditChatbotsConfirm}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Sequences' && (
                            <SequencesComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditSequenceConfirm}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Contact' && (
                            <ContactComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditContactAttributes}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {selectedButton === 'Templates' && (
                        <TemplateComponent
                            isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                            handleCheckboxToggle={handleCheckboxToggle}
                            showCheckboxes={showCheckboxes} />
                    )}


                    {
                        selectedButton === 'SendNotification' && (
                            <SendNotificationComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditNotification}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }

                    {
                        selectedButton === 'AssigntoUser' && (
                            <AssigntoUserComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditAssigntoUser}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'AssigntoTeam' && (
                            <AssigntoTeamComponent


                                isMaterialChecked={isOpenEditPage ? isMaterialCheckedEdit : isMaterialCheckedAdd}
                                handleCheckboxToggle={handleCheckboxToggle}
                                filterCardData={filtercarddata}
                                handleEditTextModal={handleEditAssigntoTeam}
                                handleDeleteTextCard={handleDeleteTextCard}
                                showCheckboxes={showCheckboxes}
                            />
                        )
                    }
                    {
                        selectedButton === 'Catalog' && (
                            <CatalogComponent />
                        )
                    }


                </div>
                <div className='keyword__pagination'>
                    <CustomPagination
                        count={5}
                        rowsPerPage={keywordrowsPerPage}
                        page={keywordPage}
                        onPageChange={handleChangeKeywordPage}
                        onRowsPerPageChange={handleChangeKeywordRowsPerPage}
                    />

                </div>
            </div>


        </div>
    )
}
export default Nextstep;