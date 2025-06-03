import React, { useState } from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import ButtonComponent from '../ButtonComponent';
import AutocompleteComponent from '../AutocompleteComponent';

const AccountSettings = () => {
    const timeZoneOptions = ['(GMT-11:00)Midway island,samoa', '(GMT-10:00)Hawaii', '(GMT:09:00)Alaska'];
    const languagesOptions = ['English', 'Chinese', 'Spanish', 'Portuguese'];
    const supportbtnOptions = ['Yes', 'No'];
    const contentDirectionOptions = ['Initial', 'Left to right', 'Right to left']
    const [timeZoneContent, setTimeZoneContent] = useState('');
    const [languageContent, setLanguageContent] = useState('');
    const [supportBtnContent, setSupportBtnContent] = useState('');
    const [contentDirection, setContentDirection] = useState('');
    return (
        <>
            <div className="accountsettings_container">
                <div className="company__logo">
                    <div className="company__logo_title">Company Logo</div>
                </div>
                <div className="reportschedule">
                    <div className="reportschedule_title">Send report schedule:</div>
                    {/* <button className="btn btn-success">Create schedule</button> */}
                    <ButtonComponent label='Create schedule' />
                </div>
                <Grid container spacing={2} className='grid__container'>
                    <Grid item xs={12} className='grid__item'>
                        <label className='item__label'>Customer TimeZone</label>

                        <AutocompleteComponent
                            options={timeZoneOptions}
                            value={timeZoneContent}
                            onChange={(event, newValue) => setTimeZoneContent(newValue)}
                        />
                    </Grid>
                    <Grid item xs={6} className='grid__item'>
                        <label className='item__label'>Language</label>
                        <AutocompleteComponent
                            options={languagesOptions}
                            value={languageContent}
                            onChange={(event, newValue) => setLanguageContent(newValue)}
                        />

                    </Grid>
                    <Grid item xs={6} className='grid__item'>
                        <label className='item__label'>Support button enabled</label>
                        <AutocompleteComponent
                            options={supportbtnOptions}
                            value={supportBtnContent}
                            onChange={(event, newValue) => setSupportBtnContent(newValue)}
                        />

                    </Grid>
                    <Grid item xs={6} className='grid__item'>
                        <label className='item__label'>Content direction</label>
                        <AutocompleteComponent
                            options={contentDirectionOptions}
                            value={contentDirection}
                            onChange={(event, newValue) => setContentDirection(newValue)}
                        />

                    </Grid>
                </Grid>
                <div className='twofactorauth_container'>
                    <div className='twofactorauth_title' >Two-Factor Authentication (2FA)</div>
                    <div className='twofactorauth_subtitle'>To enhance security, enforce 2FA for all users in your organisation. Once enabled, users will be required to set up 2FA immediately.</div>
                    <div className='enable_twofactor_container'>
                        <div className='enable_twofactor_text'>Enforce Two-Factor Authentication (2FA) on all users
                            <svg className='twofactor_infoicon'><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-6h2zm0-8h-2V7h2z"></path></svg>
                        </div>
                    </div>
                </div>
                <div className='resetcontainer'>
                    <div className='reset_link'>Reset</div>
                    <button className="btn btn-success savebutton">Save</button>
                </div>
            </div>
        </>
    )
}
export default AccountSettings;