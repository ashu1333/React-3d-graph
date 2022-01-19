import React from 'react';
import './styles.css';
import {styles} from "./customStyle";
//import "./sideBar.scss";

class sideBar extends React.Component {
    
    constructor(props) {
        super(props);
        console.log("node data",props);
        this.state = {
            rightOpen: true,
            workflow_type: props.type,
            name: props.node.Name,
            status: props.node.Status,
            neighbors: props.node.neighbors,
            type: props.node.Workflow,
            Buyer: props.node.Buyer,
            Seller: props.node.Seller,
            workflow_Implementation: props.node.WorkflowImplementation
        }
    }
    // componentDidMount(){
    //     console.log(this.state.seller);
    //     this.state.seller && this.state.seller.map((data) =>
    //         data.hasOwnProperty("Seller") && console.log(data.Seller)
    //     ) 
    // }
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
                                        <>
                                        { this.state.workflow_type==="workflow" ? 
                                         <div><li> <b>Name</b> -{this.state.name} </li>
                                        <li> <b>Type</b> - {this.state.type} </li>
                                        <li> <b>Status</b> - {this.state.status} </li>
                                        <li> <b>Seller Partner(s)</b> - { this.state.neighbors && this.state.neighbors.map((data) =>
                                                    data.hasOwnProperty("Seller") && data.Seller
                                                ) }</li>
                                        <li> <b>Buyer Partner(s)</b> -  { this.state.neighbors && this.state.neighbors.map((data) =>
                                                    data.hasOwnProperty("Buyer") && data.Buyer
                                                ) } </li></div>  : 
                                         <div><li> <b>Name</b> -{ this.state.Buyer ? this.state.Buyer : this.state.Seller
                                        } </li>
                                        <li> <b>Line Of Business</b> - xxx </li>
                                        <li> <b>Insurance Value Chain</b> - xxx </li>
                                        <li> <b>Insurance Business Type</b> - XXXX</li>
                                        <li> <b>Technology</b> - XXXX</li>
                                        <li> <b>Workflows that they are a part of</b> - { this.state.workflow_Implementation && this.state.workflow_Implementation.map((data) =>
                                                    data.Name
                                                ) }</li>
                                        <li><b>Partners that they integrate with</b>- XXXX</li>
                                        </div>}
                                        </>
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