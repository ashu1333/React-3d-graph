import "./styles.css";
import w_new from "./WorkflowNew_1.json";
import ForceGraph3D from "react-force-graph-3d";
import {leftbar} from "./customStyle";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
export default function LeftBar(
  ) {
 
    
   
   
    
   

    return(
        <div style={leftbar.mainDiv}>
            <h2 style={leftbar.heading}>Workflow</h2>
                <div  style={leftbar.slctDiv}>

        <select
          style={leftbar.slct}
          onClick={(e) => {
            if (parseInt(e.target.value) === parseInt(100)) {
              setCheck((check) => !check);
              // window.location.reload(false);
            } else {
              if (nodesGlobal !== null) {
                for (let i = 0; i < nodesGlobal.length; i++) {
                  if (
                    parseInt(e.target.value) === parseInt(nodesGlobal[i].id)
                  ) {
                    console.log("data to be set==>", data);
                   
                    handleClick(nodesGlobal[i]);
                  }
                }
              } else {
                for (let i = 0; i < data.nodes.length; i++) {
                  if (parseInt(e.target.value) === parseInt(data.nodes[i].id)) {
                    console.log("data to be set==>", data);
                   
                    handleClick(data.nodes[i]);
                  }
                }
              }
            }
          }}
        >
          <option>Choose a Workflow</option>
          <option value="100">RESET</option>
          {nodesGlobal !== null
            ? nodesGlobal.map((data) =>
                data.hasOwnProperty("Workflow") ? (
                  <>
                    <option key={data.id} value={data.id}>
                      {data.Name}
                    </option>
                  </>
                ) : (
                  <></>
                )
              )
            : data.nodes.map((data) =>
                data.hasOwnProperty("Workflow") ? (
                  <>
                    <option key={data.id} value={data.id}>
                      {data.Name}
                    </option>
                  </>
                ) : (
                  <></>
                )
              )}
        </select><br /><br />

        <select
          style={leftbar.slct}
          onClick={(e) => {

            if (parseInt(e.target.value) === parseInt(100)) {
              setCheck((check) => !check);
              // window.location.reload(false);
            } else
              for (let i = 0; i < data.nodes.length; i++) {
                if (parseInt(e.target.value) === parseInt(data.nodes[i].id)) {
                  console.log("data to be set==>", data);
                
                  handleClick(data.nodes[i]);
                }
              }
          }}
        >
          <option>Choose Buyer</option>
          <option value="100">RESET</option>
          {data.nodes.map((data) =>
            data.hasOwnProperty("Buyer") ? (
              <>
                <option key={data.id} value={data.id}>
                  {data.Buyer}
                </option>
              </>
            ) : (
              <></>
            )
          )}
        </select><br /><br />

        <select
          style={leftbar.slct}
          onClick={(e) => {
            if (parseInt(e.target.value) === parseInt(100)) {
              setCheck((check) => !check);
              //window.location.reload(false);
            } else
              for (let i = 0; i < data.nodes.length; i++) {
                if (parseInt(e.target.value) === parseInt(data.nodes[i].id)) {
                  console.log("data to be set==>", data);

                  handleClick(data.nodes[i]);
                }
              }
          }}
        >
          <option>Choose Seller</option>
          <option value="100">RESET</option>
          {data.nodes.map((data) =>
            data.hasOwnProperty("Seller") ? (
              <>
                <option key={data.id} value={data.id}>
                  {data.Seller}
                </option>
              </>
            ) : (
              <></>
            )
          )}
        </select><br /><br />
        <select
          style={leftbar.slct}
          onClick={(e) => {
            console.log(e.target.value);
            if (parseInt(e.target.value) === parseInt(100)) {
              setCheck((check) => !check);
              // window.location.reload(false);
            } else {
              handleByStatus(e.target.value);
            }
          }}
        >
          <option value={null}>Choose Status</option>
          <option value="100" key="100">
            RESET
          </option>
          <option value="Live" key="Live">
            Live
          </option>
          <option value="Introduced" key="Introduced">
            Introduced
          </option>
          <option value="Testing" key="Testing">
            Testing
          </option>
        </select><br /><br /><br /><br />
        <button style={leftbar.btn}>Filter....</button>
      </div>
    </div>
    )
}