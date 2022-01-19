import "./styles.css";

import ForceGraph3d from "react-force-graph-3d";


// Random data
const N = 70;
const gData = {
  nodes: [...Array(N).keys()].map((i) => ({ id:i })),
  links: [...Array(N).keys()]
    .filter((id) => id)
    .map((id) => ({
      source: id,
      target: Math.round(Math.random() * (id - 1))
    }))
};



export default function App() {
  return (

    <ForceGraph3d
    backgroundColor={"rgba(0,0,0,1)"}
    nodeColor={() => "yellow"}
    linkColor={() => "white"}
    graphData={gData}
  />
  
  
    
  );

 
}
