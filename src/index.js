import { StrictMode } from "react";
import ReactDOM from "react-dom";

import ForceGraph3D from "react-force-graph-3d";
import App from "./App";
import NameGraph1 from "./NameGraph1";
import NameGraph from "./NameGraph";
import CustomGraph from './CustomGraph';
import CustomJsonGraph from './CustomJsonGraph';
const rootElement = document.getElementById("root");
import leftBar from './leftBar';
import LeftBar from "./leftBar";
import TopBar from "./topBar";
import SideBar from "./sideBar";





ReactDOM.render(
  <StrictMode>
   
    
      <CustomJsonGraph />
    
   
  </StrictMode>,
  rootElement
);
