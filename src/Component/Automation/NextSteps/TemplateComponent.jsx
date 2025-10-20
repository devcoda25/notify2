import React from "react";
import TableComponent from "../../TableComponent";
import ButtonComponent from "../../ButtonComponent";
import CheckboxComponent from "../../CheckboxComponent";
import { ContentCopyIcon,RemoveRedEyeOutlinedIcon,DeleteOutlineIcon } from "../../Icon";


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
           
            <TableComponent
                columns={columns}
                data={initialTemplateData}
                showActions={false}
                customRenderCell={customRenderCell}
            />
        </div>
    )
}
export default TemplateComponent;