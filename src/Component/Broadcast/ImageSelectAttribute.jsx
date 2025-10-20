import React from "react";
import {  IconButton, Tooltip,Chip } from '@mui/material';
import { Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import HelpIcon from '@mui/icons-material/Help';

const styles = {
   
    chipAttributes: {
        height: "34px",
        margin: " 0px 20px 20px 0px",
        padding: "0px 13px",
        border: "1px solid rgb(35, 164, 85)",
        borderRadius: " 100px",
        color: " rgb(35, 164, 85)",
        fontSize: "13px",
        fontWeight: " 500",
    }

}
const ImageSelectAttribute = ({ show, onClose }) => {

    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="image_select_attribute_modal">
                <div className='image_attribute_main_content'>
                    <Modal.Header className='select_attribute_header' closeButton>
                        <Modal.Title >Select attribute</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='select_attribute_body_content'>
                        <h4 className="attribute_title">Shopify
                            <Tooltip title="This attribute is to be used to include product image for Shopify abandoned cart, Cash On Delivery & Order Confirmation automated message" placement="right-start">
                                <IconButton>
                                    <HelpIcon />
                                </IconButton>
                            </Tooltip>
                        </h4>
                        <Chip

                            label="product_image_url"
                            variant="outlined"
                            sx={styles.chipAttributes}

                        />
                        <h4 className="attribute_title">Woocommerce
                            <Tooltip title="This attribute is to be used to include product image for Shopify abandoned cart, Cash On Delivery & Order Confirmation automated message" placement="right-start">
                                <IconButton>
                                    <HelpIcon />
                                </IconButton>
                            </Tooltip></h4>
                        <Chip

                            label="product_image_url"
                            variant="outlined"
                            sx={styles.chipAttributes}

                        />
                    </Modal.Body>

                </div>
            </Modal>
        </>
    )
}
export default ImageSelectAttribute;