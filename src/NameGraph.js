import "./styles.css";
import w1 from "./WorkflowImplementation.json";
import w2 from "./WorkflowImplementationBuyer.json";
import w3 from "./WorkflowImplementationSeller.json";
import ForceGraph3D from "react-force-graph-3d";
import { Bezier } from "bezier-js";
import ForceGraph2D from "react-force-graph-2d";
import SpriteText from "three-spritetext";
import generateName from "./random.js";
import * as d3 from "d3";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { resolveModuleName } from "typescript";

function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? "target" : "source"]: id,
        [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
      })),
  };
}

const NODE_R = 5;

export default function NameGraph() {
  const fgRef = useRef(null);
  let Dummy = {};
  const [reset1, setReset1] = useState(false);
  const [g_Data, setGData] = useState(null);
  const [check, setCheck] = useState(false);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  // const [w1, setW1] = useState(null);
  // const [w2, setW2] = useState(null);
  // const [w3, setW3] = useState(null);
  const [workflowData, setWorkflowData] = useState(null);

  useEffect(() => {
  
    // setW1(workflowdata);
    // setW2(workflowdataBuyer);
    // setW3(workflowdataSeller);

    
  }, []);
  
  const data = useMemo(() => {
    let nodes = [],
      links = [];
    if (w1 && w2 && w3) {
    
      nodes.push(...w1, ...w2, ...w3);

      nodes = nodes.map((obj, i) => ({ id: i, ...obj, neighbors: [] ,links :[]}));
     

      for (let i = 0; i < w1.length; i++) {
        //Loop for Buyers
        for (let j = w1.length; j < w2.length + w1.length; j++) {
          if (w1[i].Name === nodes[j].WorkflowImplementation) {
            nodes[i].neighbors.push(nodes[j]);
            nodes[j].neighbors.push(nodes[i]);
            let obj = {
              source : nodes[j].id,
              target : nodes[i].id
            }
           // console.log(obj);
          nodes[i].links.push(obj);
          }
        }
        //Loop for sellers
        for(let j=w1.length+w2.length ; j<nodes.length ; j++){
          if (w1[i].Name === nodes[j].WorkflowImplementation) {
            nodes[i].neighbors.push(nodes[j]);
            nodes[j].neighbors.push(nodes[i]);
            console.log(`${nodes[j].Seller} Seller ${w1[i].Name}`);
           //console.log(nodes[j]);
            let obj = {
              source : nodes[j].id,
              target : nodes[i].id
            }
            console.log(nodes[i]);
          nodes[i].links.push(obj);
          }
        }
      }


      for(let i=0 ; i<4 ; i++){
        let len = nodes[i].neighbors.legth;
       
        let target = i;
        for(let j=0; j<2 ;j++){
         
          let obj = {
            source : nodes[i].neighbors[j].id,
            target : target
          }
          links.push(obj);


        }

      }

    
      console.log(nodes);
console.log(links);
      const data = { nodes: nodes, links: links };

      return data;
    }
  },[]);
  // refined_Data();
  const dataa = useMemo(() => {
    const gData = genRandomTree(10);
    console.log("gData=>", genRandomTree(10));
    // cross-link node objects
    gData.links.forEach((link) => {
      const a = gData.nodes[link.source];
      const b = gData.nodes[link.target];
      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });
    console.log(gData);
    setGData(gData);
    return gData;
  }, []);

  useEffect(() => {
   // console.log("RE-RENDER");
  });

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
      node.links.forEach((link) => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const handleClick = useCallback(
    (node) => {
      for (let i = 0; i < data.nodes.length; i++) {
        if (node.id === data.nodes[i].id) {
          data.nodes = [];
          data.nodes.push(node);
          data.nodes.push(...node.neighbors);

          //  var foundValue = nodes.links.filter(obj=>obj.source.id===);
        }
        //  console.log("Refined Data=>", data);
      }

      let neighbour = [];
      // data.links = [];
      // data.links.push(g_Data.links);
      for (let j = 0; j < data.links.length; j++) {
        for (let l = 0; l < data.nodes.length; l++) {
          if (data?.links[j]?.source?.id === data.nodes[l].id) {
            for (let m = 0; m < data.nodes.length; m++) {
              if (data?.links[j]?.target?.id === data.nodes[m].id) {
                neighbour.push(data.links[j]);
              }
            }
          }
        }
      }

      //   console.log("neighbour=>", neighbour);
      data.links = [];
      data.links.push(...neighbour);
      //  console.log("new data=>", data);

      // setGData(data || null);
      setHoverNode(node || null);
      const distance = 40;
      const distRatio = 5 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        2000 // ms transition duration
      );
    },
    [fgRef, data]
  );

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const paintRing = useCallback(
    (node, ctx) => {
      // add ring just for highlighted nodes
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = node === hoverNode ? "red" : "red";
      ctx.fill();
    },
    [hoverNode]
  );

  const handleFilter = (e) => {
    for (let i = 0; i < data.nodes.length; i++) {
      if (parseInt(e.target.value) === parseInt(data.nodes[i].id)) {
        let node2 = data.nodes[i];
        let nbr = data.nodes[i].neighbors;
        //  node2.push(nbr);
        //data.nodes = node2;
        data.nodes = node2;

        // console.log(node2);
        // console.log(nbr);
        //   data.nodes.push(node2);
        //   data.nodes.push(nbr);

        //  var foundValue = nodes.links.filter(obj=>obj.source.id===);
      }
    }
  };

  return (
    <>
      <div>
        <select
          style={{
            position: "absolute",
            top: "20px",
            zIndex: "1",
            left: "20px",
            width: "130px",
            height: "20px",
          }}
          onClick={(e) => {
            if (parseInt(e.target.value) === parseInt(100)) {
              window.location.reload(false);
            } else
              for (let i = 0; i < data.nodes.length; i++) {
                if (parseInt(e.target.value) === parseInt(data.nodes[i].id)) {
                  console.log("data to be set==>", data);
                
                  handleClick(data.nodes[i]);
                }
              }
          }}
        >
          <option>Choose a Workflow</option>
          <option value="100">RESET</option>
          {data.nodes.map((data) => (
            data.hasOwnProperty("Workflow")
            ?
            <>
              <option key={data.id} value={data.id}>
                 {data.Name}
              </option>
            </> :
            <></>
          ))}
        </select>

        <select
          style={{
            position: "absolute",
            top: "20px",
            zIndex: "1",
            left: "170px",
            width: "130px",
            height: "20px",
          }}
          onClick={(e) => {
            if (parseInt(e.target.value) === parseInt(100)) {
              window.location.reload(false);
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
          {data.nodes.map((data) => (
            data.hasOwnProperty("Buyer")
            ?
            <>
              <option key={data.id} value={data.id}>
                 {data.Buyer}
              </option>
            </> :
            <></>
          ))}
        </select>

        <select
          style={{
            position: "absolute",
            top: "20px",
            zIndex: "1",
            left: "320px",
            width: "130px",
            height: "20px",
          }}
          onClick={(e) => {
            if (parseInt(e.target.value) === parseInt(100)) {
              window.location.reload(false);
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
          {data.nodes.map((data) => (
            data.hasOwnProperty("Seller")
            ?
            <>
              <option key={data.id} value={data.id}>
                 {data.Seller}
              </option>
            </> :
            <></>
          ))}
        </select>

        <select
          style={{
            position: "absolute",
            top: "30px",
            zIndex: "1",
            left: "550px",
            width: "130px",
            height: "20px",
          }}
          onClick={(e) => {
            if (parseInt(e.target.value) === parseInt(100)) {
              window.location.reload(false);
            } else
              for (let i = 0; i < data.nodes.length; i++) {
                if (parseInt(e.target.value) === parseInt(data.nodes[i].id)) {
                  console.log("data to be set==>", data);
                
                  handleClick(data.nodes[i]);
                }
              }
          }}
        >
          <option>Choose Status</option>
          <option value="100">RESET</option>
          {data.nodes.map((data) => (
            data.hasOwnProperty("Seller")
            ?
            <>
              <option key={data.id} value={data.id}>
                 {data.Status}
              </option>
            </> :
            <></>
          ))}
        </select>

      </div>
      <ForceGraph3D
        className="react-graph"
         nodeColor={node => node.id%2===0 ?"red" : "yellow"}
       // nodeColor={(node) => generateName(node)}
        ref={fgRef}
        graphData={data}
        linkColor={() => "White"}
        // nodeAutoColorBy="group"
        nodeRelSize={NODE_R}
        autoPauseRedraw={false}
        linkWidth={(link) => (highlightLinks.has(link) ? 7 : 1)}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link) =>
          highlightLinks.has(link) ? 3 : 0
        }
        nodeLabel=
        {
          (node) =>
          {
            if(node.hasOwnProperty('Workflow'))
            {
              return `Workflow : ${node.Name} 
              <br/>
              Status : ${node.Status}
              ${
                node.neighbors.map(
                n => {
                return  n.hasOwnProperty('Buyer') ? `<br/>Buyer :
                  ${n.Buyer}` 
                   : `<br/>Seller :
                   ${n.Seller}`
                })
                
              } 
             `
          }
          else if(node.hasOwnProperty('Buyer')){
             
            return `This is a Buyer of ${node.WorkflowImplementation} <br/>
            Status : ${node.Status}`;
          }
          else if(node.hasOwnProperty('Seller')){
             
            return `This is a Seller of ${node.WorkflowImplementation} <br/>
            
            Status : ${node.Status}`;
          }
          
        }
      }
    
        
        //nodeLabel ={node  => `<span>${node.id}</span>`}
        nodeCanvasObject={paintRing}
        nodeCanvasObjectMode={(node) =>
          highlightNodes.has(node) ? "before" : undefined
        }
        onNodeHover={handleNodeHover}
        onLinkHover={handleLinkHover}
        linkOpacity={0.8}
        nodeVal={(node) => {
          if (node.id < 4 ) {
            return 3;
          } else {
            return 0.5 ;
          }
        }}
        // linkDirectionalArrowLength={5.5}
        // linkDirectionalArrowRelPos={1}
        // linkDirectionalParticles={5}
        // linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={(d) => 20 * 0.001}
        linkDirectionalParticleColor="red"
        // nodeThreeObject={(node) => {
        //   const sprite = new SpriteText(`Node${node.id}`);
        //   sprite.color = node.id % 2 == 0 ? "red" : "white";
        //   sprite.textHeight = 8;
        //   return sprite;
        // }}
        onNodeClick={handleClick}
      />
    </>
    // <ForceGraph3d
    // ref={fgRef}
    //       graphData={nodes_data}
    //      // nodeAutoColorBy="group"
    //      className="graph"
    //      backgroundColor={"rgba(0, 0, 0, 1)"}
    //       nodeColor={() => "red"}
    //       linkColor={() => "white"}
    //       nodeThreeObject={node => {
    //         const sprite = new SpriteText(node.id);
    //         sprite.color = node.color || "red";
    //         sprite.textHeight = 8;
    //         return sprite;
    //       }}
    //       onNodeClick={handleClick}
    //     />
  );
}
