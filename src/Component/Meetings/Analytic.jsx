import React, { useState } from "react";
import { Tabs, Tab, Button, Grid, Card, CardContent, Typography } from "@mui/material";
import analyticsEventsimage from '../Assets/img/analytics_events_side.svg'
import analyticsRoutingImage from '../Assets/img/analytics_routing_side.svg'

const Analytic = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleChange = (event, newIndex) => {
        setTabIndex(newIndex);
    }

    return (
        <>
            <div className="calendar_analytic">
                <h1>Analytics</h1>
                <Tabs value={tabIndex} onChange={handleChange}>
                    <Tab label="Events" />
                    <Tab label="Routing" />
                </Tabs>
                {tabIndex === 0 && (
                    <div className="analytic_events">
                        <div className="no_analytic_container">
                            <div className="left_container">
                                <h1>No analytic yet</h1>
                                <p>Improve team scheduling using trends from booked meetings</p>
                                <ul>
                                    <li>Easily understand how scheduling impacts your business.</li>
                                    <li>Demonstrate the value of proposed scheduling changes.</li>
                                    <li>Get crucial buy-in from leaders and stakeholders.</li>

                                </ul>
                                <a><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" role="img"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 9.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 5a1.25 1.25 0 1 0-1-2"></path><path stroke="currentColor" d="M5 7.625a.375.375 0 1 1 0-.75M5 7.625a.375.375 0 1 0 0-.75"></path></svg><span>Learn more <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.51941 15.9941C6.1602 15.6529 6.1602 15.0998 6.51941 14.7586L11.5294 10L6.51941 5.24142C6.1602 4.90024 6.1602 4.34707 6.51941 4.00589C6.87862 3.66471 7.46101 3.66471 7.82022 4.00589L13.4806 9.38223C13.8398 9.72342 13.8398 10.2766 13.4806 10.6178L7.82022 15.9941C7.46101 16.3353 6.87862 16.3353 6.51941 15.9941Z" fill="currentColor"></path></svg></span></a>
                                <Button variant="contained" className='book_first_meet'>+ Book Your First Meeting</Button>

                            </div>
                            <div>
                                <img src={analyticsEventsimage} alt="Analytics Events" />
                            </div>

                        </div>
                        <div className="main_container">
                            <h1>EVENT DATA</h1>
                            <Grid container spacing={2}>
                                {["Created events", "Completed events", "Rescheduled events", "Canceled events"].map(
                                    (label, index) => (
                                        <Grid item xs={12} sm={6} md={3} key={index}>
                                            <Card className="card_contents" sx={{ boxShadow: 2 }}>
                                                <CardContent>
                                                    <div>
                                                        {label}
                                                    </div>
                                                    <div className="item_count">
                                                        0
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                    )
                                )}
                            </Grid>
                            <Grid container spacing={2} className="events_grid">
                                {/* Completed Events Trend */}
                                <Grid item xs={12} md={6}>
                                    <Card className="card_contents" sx={{ boxShadow: 2, height: '150px' }}>
                                        <CardContent>
                                            <div >
                                                Completed events trend
                                            </div>
                                            {/* Placeholder for Graph */}
                                            {/* <div sx={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    [Graph Placeholder]
                                                </Typography>
                                            </div> */}
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Event Distribution by Duration */}
                                <Grid item xs={12} md={6}>
                                    <Card className="card_contents" sx={{ boxShadow: 2, height: '150px' }}>
                                        <CardContent>
                                            <div>
                                                Event distribution by duration
                                            </div>
                                            {/* Placeholder for No Data */}

                                            <p>
                                                No data available
                                            </p>

                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} className="events_grid">
                                {/* popular events */}
                                <Grid item xs={12} md={6}>
                                    <Card className="card_contents" sx={{ boxShadow: 2, height: '150px' }}>
                                        <CardContent>
                                            <div>
                                                Popular events
                                            </div>
                                            <p>
                                                No data available
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* popular times */}
                                <Grid item xs={12} md={6}>
                                    <Card className="card_contents" sx={{ boxShadow: 2, height: '150px' }}>
                                        <CardContent>
                                            <div>
                                                Popular times
                                            </div>
                                            {/* Placeholder for No Data */}
                                            <div>
                                                <p>
                                                    No data available
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <div>
                                <h1>USER DATA</h1>
                                <Grid container spacing={2} className="events_grid">
                                {/* Users with the most events */}
                                    <Grid item xs={12} md={6}>
                                        <Card className="card_contents" sx={{ boxShadow: 2, height: '150px' }}>
                                            <CardContent>
                                                <div>
                                                Users with the most events
                                                </div>
                                                <p>
                                                    No data available
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Users with the least events */}
                                    <Grid item xs={12} md={6}>
                                        <Card className="card_contents" sx={{ boxShadow: 2, height: '150px' }}>
                                            <CardContent>
                                                <div>
                                                  Users with the least events
                                                </div>
                                                {/* Placeholder for No Data */}
                                                <div>
                                                    <p>
                                                        No data available
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>

                )}
                {tabIndex === 1 && (
                    <div className="no_analytic_container">
                        <div className="left_container">
                            <h1>No analytic yet</h1>
                            <p>Tools to increase routing form performance</p>
                            <ul>
                                <li>Report on meeting conversation rates</li>
                                <li>Discover booked meeting trends week to week.</li>
                                <li>Track and evaluate the customer journey</li>

                            </ul>
                            <a><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" role="img"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 9.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5 5a1.25 1.25 0 1 0-1-2"></path><path stroke="currentColor" d="M5 7.625a.375.375 0 1 1 0-.75M5 7.625a.375.375 0 1 0 0-.75"></path></svg><span>Learn more <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.51941 15.9941C6.1602 15.6529 6.1602 15.0998 6.51941 14.7586L11.5294 10L6.51941 5.24142C6.1602 4.90024 6.1602 4.34707 6.51941 4.00589C6.87862 3.66471 7.46101 3.66471 7.82022 4.00589L13.4806 9.38223C13.8398 9.72342 13.8398 10.2766 13.4806 10.6178L7.82022 15.9941C7.46101 16.3353 6.87862 16.3353 6.51941 15.9941Z" fill="currentColor"></path></svg></span></a>
                            <Button variant="contained" className='book_first_meet'>+ Add routing form</Button>

                        </div>
                        <div>
                            <img src={analyticsRoutingImage} alt="Analytics Events" />
                        </div>
                    </div>

                )}

            </div>
        </>
    )
}
export default Analytic;