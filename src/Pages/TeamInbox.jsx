import React, { useEffect } from 'react'
import BurgerSidebar from '../Component/humburgerdiv';
// import { Navbar } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

const TeamInbox = () => {
    return (
        <>
            <div id="outer-container">
                <BurgerSidebar></BurgerSidebar>
                <main id="page-wrap">
                    <div className="main-content">
                        <div className="panel-content">
                            <div className="row">
                                <div className="col-lg-8 col-md-8 col=sm-12">
                                    <div className="widget">
                                        <div className="widget-title">
                                            <h3>Tickets Title</h3>
                                            <p className='mail-create-date'><span><i className="fa fa-bug" aria-hidden="true"></i></span><span>TKT-02 NOFg000000000</span><span className='mail-time'>Created 31/08/24 10:57 PST</span></p>
                                            <div className="widget-controls inbox-control"> <span className="close-content"><i className="fa fa-envelope-o"></i></span> <span className="expand-content"><i className="fa fa-eye"></i> 5</span> <span className="refresh-content"><i className="fa fa-ellipsis-h"></i></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" /></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/friend-avatar2.jpg" alt="" /></span><span className='team-hum-avator'><img src="assets/teaminbox/images/resource/ok.jpg" alt="" /></span></div>
                                        </div>
                                        {/* Widget title end */}

                                        <div className="support-ticket-sec">
                                            <div className="status-upload">
                                                <form>
                                                    <div className="inline-form">
                                                        <label className="c-label">CC</label>
                                                        <input className="input-style" type="text" placeholder="To" />
                                                    </div>
                                                    <textarea placeholder="What are you doing right now?"></textarea>
                                                    <ul>
                                                        <li><a title="Audio" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-bold"></i></a></li>
                                                        <li><a title="Video" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-italic"></i></a></li>
                                                        <li><a title="Sound Record" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-underline"></i></a></li>
                                                        <li><a title="Picture" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-picture-o"></i></a></li>
                                                        <li><a title="Picture" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-paperclip"></i></a></li>
                                                        <li><a title="Picture" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-file-archive-o"></i></a></li>
                                                        <li><a title="Picture" data-toggle="tooltip" data-placement="bottom"><i className="fa fa-comment-o"></i></a></li>
                                                    </ul>
                                                    <div className='mail-send-btn'><span><label>Ask to KB <input type='checkbox' /></label></span>
                                                        <button type="submit" className="green-bg"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        {/* Widget end */}
                                    </div>
                                    <div className="widget no-padding blank">
                                        <div className="timeline-sec">
                                            <ul>
                                                <li>
                                                    <div className="timeline">
                                                        <div className="user-timeline"> <span><img src="assets/teaminbox/images/resource/user1.jpg" alt="" /></span> </div>
                                                        <div className="timeline-detail">
                                                            <div className="timeline-head white-bg">
                                                                <h3 className='color-222 feed-tittle'>Jonathan Gardel <span>Aug/31/24 14:30</span></h3>
                                                                <div className="social-share p-0"> <a title=""><i className="fa fa-chevron-down" aria-hidden="true"></i>                                                                </a></div>
                                                            </div>
                                                            <div className="timeline-content pt-0">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="timeline">
                                                        <div className="user-timeline"> <span><img src="assets/teaminbox/images/resource/user1.jpg" alt="" /></span> </div>
                                                        <div className="timeline-detail">
                                                            <div className="timeline-head white-bg">
                                                                <h3 className='color-222 feed-tittle'>Jonathan Gardel <span>Aug/31/24 14:30</span></h3>
                                                                <div className="social-share p-0"> <a title=""><i className="fa fa-chevron-down" aria-hidden="true"></i>                                                                </a></div>
                                                            </div>
                                                            <div className="timeline-content pt-0">
                                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                    {/* Left column end */}
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12">
                                    <div className="widget">
                                        <div className="widget-title">
                                            <div className="btn-group">
                                                <button data-original-title="" type="button" className="btn-primary mini">To Do</button>
                                                <button data-original-title="" type="button" className="btn-primary mini dropdown-toggle" data-toggle="dropdown"> <span className="caret"></span> </button>
                                                <ul className="dropdown-menu" role="menu">
                                                    <li><a data-original-title="" href="#">Action</a></li>
                                                    <li><a data-original-title="" href="#">Another action</a></li>
                                                    <li><a data-original-title="" href="#">Something else here</a></li>
                                                    <li className="divider"></li>
                                                    <li><a data-original-title="" href="#">Separated link</a></li>
                                                </ul>
                                            </div>
                                            <div className="widget-controls"> <span className="close-content"><i className="fa fa-times"></i></span></div>
                                        </div>
                                        <div className="support-ticket-sec w-90">
                                            <div id="contact">
                                                <div className="contact-form">
                                                    <form >
                                                        <div className="row">
                                                            <div className="col-lg-12 col-md-12">
                                                                <h6>Priority</h6>
                                                                <i className="fa fa-minus-circle green-color"></i>
                                                                <input type="text" placeholder="Medium" />
                                                                <span className='down-arrow-btn'><i className="fa fa-chevron-down" aria-hidden="true"></i>
                                                                </span>
                                                                <div className='divider'>&nbsp;</div>
                                                                <h6>Assigned</h6>
                                                                <img src="assets/teaminbox/images/resource/friend-avatar.jpg" alt="" />
                                                                <input type="text" placeholder="Medium" />
                                                                <span className='down-arrow-btn'><i className="fa fa-chevron-down" aria-hidden="true"></i>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
export default TeamInbox;