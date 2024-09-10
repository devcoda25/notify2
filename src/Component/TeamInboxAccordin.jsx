import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

function TeaamInboxAccordion() {
    return (
        <Accordion defaultActiveKey="">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Tasks</Accordion.Header>
                <Accordion.Body>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Collected Fields</Accordion.Header>
                <Accordion.Body>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Linked Tickets</Accordion.Header>
                <Accordion.Body>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <Accordion.Header>Histroy</Accordion.Header>
                <Accordion.Body>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad</p>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default TeaamInboxAccordion;