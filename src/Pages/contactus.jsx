import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
const ContactUs = () => {

    return (
        <>
            <div className='main-wrapper'>
                <div className="main-title-sec">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 column">
                            <div className="heading-profile">
                                <h2>Contacts</h2>
                                <span>Contact list stores the list of numbers that you've interacted with. You can even <br />manually export or import contacts.</span> </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 column">
                            <div className="top-bar-contacts">
                                <ul>
                                    <li className='watch-tut'><i className="fa fa-play-circle" aria-hidden="true"></i> Watch Tutorial</li>
                                    <li><button className='btn btn-success'>+ Add Contact</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="widget bg-f5f6fa p-3">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className='search-input'>
                                <ul>
                                    <li>Sorted by:</li>
                                    <li><Form.Select aria-label="Default select example">
                                        <option>Last Updated</option>
                                        <option value="1">Name</option>
                                        <option value="2">Created Date</option>
                                    </Form.Select></li>
                                    <li><InputGroup className="mb-3">
                                        <Form.Control
                                            placeholder="Username"
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                        />
                                        <InputGroup.Text id="basic-addon1"><i className="fa fa-search" aria-hidden="true"></i>
                                        </InputGroup.Text>
                                    </InputGroup>
                                    </li>
                                    <li> <a className='search-btn'><img src="assets/images/filter-icon.png" alt="" /></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className='search-export'>
                                <ul>
                                    <li><span className='sea-btn-inn'><button className='btn btn-upload'><img src="assets/images/cloud-arrow-up.svg" alt="" /> Export</button><button className='btn btn-download'><img src="assets/images/cloud-download.svg" alt="" /> Import</button></span></li>
                                    <li><a className='red-delete-icon'><img src="assets/images/red-delete-icon.png" alt="" /></a></li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="widget white">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th><Form.Check className='contact-check' aria-label="option 1" /></th>
                                        <th>Basic Info</th>
                                        <th>Phone Number</th>
                                        <th>Contact Attributes</th>
                                        <th>Created Date</th>
                                        <th>Broadcast</th>
                                        <th>SMS</th>
                                        <th>Edit/Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th><Form.Check className='contact-check' aria-label="option 1" /></th>
                                        <td>919941004073</td>
                                        <td>(+91) 9941004073</td>
                                        <td className='contact-arti'><span className='mr-5'>Name:9999999999</span><span>Name:9999999999</span></td>
                                        <td>Aug-31-2024</td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td className='cont-arti-edit-delete'><a href=''><i className="fa fa-pencil" aria-hidden="true"></i>
                                        </a><a href=''><i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a></td>
                                    </tr>
                                    <tr>
                                        <th><Form.Check className='contact-check' aria-label="option 1" /></th>
                                        <td>919941004073</td>
                                        <td>(+91) 9941004073</td>
                                        <td className='contact-arti'><span className='mr-5'>Name:9999999999</span><span>Name:9999999999</span></td>
                                        <td>Aug-31-2024</td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td className='cont-arti-edit-delete'><a href=''><i className="fa fa-pencil" aria-hidden="true"></i>
                                        </a><a href=''><i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a></td>
                                    </tr>

                                    <tr>
                                        <th><Form.Check className='contact-check' aria-label="option 1" /></th>
                                        <td>919941004073</td>
                                        <td>(+91) 9941004073</td>
                                        <td className='contact-arti'><span className='mr-5'>Name:9999999999</span><span>Name:9999999999</span></td>
                                        <td>Aug-31-2024</td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td><img className='check-img' src="assets/images/check.svg" alt="" /></td>
                                        <td className='cont-arti-edit-delete'><a href=''><i className="fa fa-pencil" aria-hidden="true"></i>
                                        </a><a href=''><i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </a></td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ContactUs;