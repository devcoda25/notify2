import React from 'react';
import { push as Menu } from 'react-burger-menu';

const CustomBurgerIcon = () => <i className="fa fa-bars" aria-hidden="true"></i>;
const TeamBurgerLeftNav = () => {
    var styles = {
        bmBurgerButton: {
            position: 'fixed',
            width: '36px',
            height: '30px',
            left: '27px',
            top: '116px'
        },
        bmBurgerBars: {
            background: '#373a47'
        },
        bmBurgerBarsHover: {
            background: '#a90000'
        },
        bmCrossButton: {
            height: '24px',
            width: '24px'
        },
        bmCross: {
            background: '#bdc3c7'
        },
        bmMenuWrap: {
            position: 'fixed',
            height: '100%'
        },
        bmMenu: {
            background: '#373a47',
            padding: '2em 1em 0',
            fontSize: '1.15em'
        },
        bmMorphShape: {
            fill: '#373a47'
        },
        bmItemList: {
            color: '#b8b7ad',
            padding: '0.8em'
        },
        bmItem: {
            display: 'inline-block'
        },
        bmOverlay: {
            background: 'rgba(0, 0, 0, 0.3)'
        }
    }
    return (
        <Menu noOverlay styles={styles} isOpen={'true'} customBurgerIcon={<CustomBurgerIcon />} width={'320px'} pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
            <h1>Left Nav</h1>
        </Menu>
    );
};

export default TeamBurgerLeftNav;