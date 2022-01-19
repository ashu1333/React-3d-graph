import React from 'react';
import './styles.css';
import {styles} from "./customStyle";
//import "./sideBar.scss";

class sideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rightOpen: true
        }
    }

    toggleSidebar = (event) => {
        let key = `${event.currentTarget.parentNode.id}Open`;
        this.setState({ [key]: !this.state[key] });
    }

    render() {
        let rightOpen = this.state.rightOpen ? 'true' : 'false';

        return (
            <>
                {rightOpen ? <div className={`sidebaar ${rightOpen}`} style={styles.sidebar}>
                    <div id='layout' style={ styles.layout }>
                        <div id='right' className={rightOpen} >
                            <div className='icon'
                                onClick={this.toggleSidebar} style={ styles.closeIcon }>
                                <span class="close">&#10006;</span>
                            </div>
                            <div>
                                <div className='content'>
                                    <ul style={ styles.workflowList }>
                                        <li> <b>Workflow</b> - Hawksoft-BP </li>
                                        <li> <b>Name</b> - XXXX </li>
                                        <li> <b>Type</b> - XXXXX </li>
                                        <li> <b>Status</b> - XXXX </li>
                                        <li> <b>Seller Partner(s)</b> - XXXX</li>
                                        <li> <b>Buyer Partner(s)</b> - XXXX</li>
                                        <li> <b>Relationship</b> - XXXXX</li>
                                        <li> <b>Name</b> - XXXXX</li>
                                        <li> <b>Seller Partner</b> - XXXXX</li>
                                        <li> <b>Buyer Partner</b> - XXXXX</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div></div> : ''}
            </>
        );
    }
}

export default sideBar;