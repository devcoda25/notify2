import React,{useState,useEffect} from "react";
import AutocompleteComponent from "../../../AutocompleteComponent";
import TextfieldComponent from "../../../TextfieldComponent";
import ButtonComponent from "../../../ButtonComponent";
import { Table, TableBody, TableCell, TableRow} from '@mui/material';
import { Modal, ModalBody } from 'react-bootstrap';
import {DeleteOutlineIcon} from '../../../Icon';
import style from "../../../MuiStyles/muiStyle";

const options = ["Allow Broadcast", "Allow SMS", "Actual Fare"];

const EditContactAttributesModal = ({ show, onClose, onSave, initialTitle, initialRows }) => {
    const [title, setTitle] = useState(initialTitle);
 
    const [rows, setRows] = useState(initialRows);

    useEffect(() => {
        setTitle(initialTitle);
        setRows(initialRows);
    }, [initialTitle, initialRows]);

    const handleEditSave = () => {
        onSave({ title, rows });
    };

    const addRow = () => {
        setRows([...rows, { selectedOption: "", booleanOption: null, inputValue: "" }]);
    };

    const handleChange = (index, key, value) => {
        const updatedRows = [...rows];
        updatedRows[index][key] = value;
        setRows(updatedRows);
    };
    const deleteRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };


    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="edit__text__modal">
                <div className='edit_text_material_content'>
                    <Modal.Header className='edit_text_material_header' closeButton>
                        <Modal.Title className='edit_text_style'>Contact Attributes Material</Modal.Title>
                    </Modal.Header>
                    <ModalBody className='edittext__body__content'>
                        <div>
                            <div className='edit__text__label'>Material name</div>
                            <TextfieldComponent type='text' placeholder="Please input" customStyle='custom_textfield' value={title} onChange={(e) => setTitle(e.target.value)} />

                        </div>
                        <div>
                            <Table className='contact_attr_table'>
                                <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className='contact_attr_cell firstchild'>
                                                {index === 0 && <div>Attributes</div>}
                                            </TableCell>
                                            <TableCell className='contact_attr_cell attr_type'>
                                                <AutocompleteComponent
                                                    options={options}
                                                    value={row.selectedOption}
                                                    placeholder="Attributes"
                                                    onChange={(event, newValue) => {
                                                        handleChange(index, "selectedOption", newValue);
                                                        handleChange(index, "booleanOption", null);
                                                    }}
                                                    customStyles={{ backgroundColor: row.selectedOption ? 'white' : 'rgb(245, 246, 250)' }}
                                                />
                                            
                                            </TableCell>
                                            <TableCell className='contact_attr_cell attr_type'>
                                                {row.selectedOption === "Allow Broadcast" || row.selectedOption === "Allow SMS" ? (
                                                    <AutocompleteComponent
                                                        options={["True", "False"]}
                                                        value={row.booleanOption}
                                                        placeholder="Value"
                                                        onChange={(event, newValue) => handleChange(index, "booleanOption", newValue)}
                                                        customStyles={{ backgroundColor: row.selectedOption ? 'white' : 'rgb(245, 246, 250)' }}
                                                    />
                                                 
                                                ) : (
                                                    <TextfieldComponent type='text' value={row.inputValue} onChange={(e) => handleChange(index, "inputValue", e.target.value)} placeholder='Value'
                                                        customStyle='attr_textfield' />

                                                )}
                                            </TableCell>
                                            <TableCell className='contact_attr_cell'>
                                                <DeleteOutlineIcon sx={[style.tableIconBtn, style.tabledeleteHover]} onClick={() => deleteRow(index)} />

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className='contact_attr_addsegment'>
                                <ButtonComponent label='Add segment +' customBtn='cancel_button_style' onClick={addRow} />

                            </div>
                        </div>
                        <div className='edit__text__save'>
                            <ButtonComponent label='Save' onClick={handleEditSave} />

                        </div>
                    </ModalBody>
                </div>
            </Modal>
        </>
    );
};
export default EditContactAttributesModal;