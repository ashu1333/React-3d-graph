import "./styles.css";
import w1 from "./WorkflowImplementation.json";
import w2 from "./WorkflowImplementationBuyer.json";
import w3 from "./WorkflowImplementationSeller.json";
import w_new from "./WorkflowNew.json";
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

export default function CustomGraph() {
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

    if (w_new) {
      nodes.push(...w_new.nodes);

      nodes = nodes.map((obj, i) => ({
        ...obj,
        id: i,

        neighbors: [],
        links: [],
      }));

      for (let i = 0; i < nodes.length; i++) {
        //For Center Node
        if (nodes[i].hasOwnProperty("Name") === true) {
          if (nodes[i].Name === "InsuranceGig") {
            console.log("InsuranceGig");
            for (let j = 1; j < w_new.nodes.length; j++) {
              if (
                nodes[j].hasOwnProperty("Name") &&
                nodes[j].Name !== "InsuranceGig"
              ) {
                nodes[i].neighbors.push(nodes[j]);
                nodes[j].neighbors.push(nodes[i]);
                let obj = {
                  source: nodes[j].id,
                  target: nodes[i].id,
                };
                // console.log(obj);
                nodes[i].links.push(obj);
                links.push(obj);
              }
            }
          } else {
            for (let j = 0; j < nodes.length; j++) {
              if (
                nodes[j].hasOwnProperty("Buyer") ||
                nodes[j].hasOwnProperty("Seller")
              )
                if (nodes[i].Name === nodes[j].WorkflowImplementation) {
                 nodes[i].neighbors.push(nodes[j]);
                  nodes[j].neighbors.push(nodes[i]);
                  let obj = {
                    source: nodes[j].id,
                    target: nodes[i].id,
                  };
                  // console.log(obj);
                  nodes[i].links.push(obj);
                  links.push(obj);
                  let flag = 0;
                  let nbr = [];
                  for (let k = 0; k < nodes.length; k++) {
                    if (nodes[k].hasOwnProperty("Buyer")) {
                      if (
                        nodes[j].Buyer === nodes[k].Buyer &&
                        nodes[j].id !== nodes[k].id
                      ) {
                        console.log("found duplicate", nodes[j].Buyer);
                        // nbr.push(nodes[i]);
                        // flag++;

                        // if(flag>1){

                        //   console.log(nodes[k].Buyer);
                        //   nodes[k].neighbors.push(nbr);

                        // }
                      }
                    }
                  }
                }
            }
          }
        }
      }
      let duplicates = [];
      nodes.forEach((el, i) => {
        nodes.forEach((element, index) => {
          if (i === index) return null;
          if (element.hasOwnProperty("Buyer") && el.hasOwnProperty("Buyer")) {
            if (element.Buyer === el.Buyer) {
              // console.log("Buyer=>");
              //console.log(element);
            }
          }
          if (element.hasOwnProperty("Seller") && el.hasOwnProperty("Seller")) {
            if (element.Seller === el.Seller) {
              // console.log(element.Seller);
            }
          }
        });
      });
      //  console.log("duplicates", duplicates);

      console.log(nodes);
      console.log(links);

      const data = { nodes: nodes, links: links };

      return data;
    }
  }, []);
  // refined_Data();
  const dataa = useMemo(() => {
    const gData = genRandomTree(10);
    // console.log("gData=>", genRandomTree(10));
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
    // console.log(gData);
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

  const handleByStatus = useCallback(
    (value) => {
      //  console.log(value);
      const filter = [];
      for (let i = 0; i < data.nodes.length; i++) {
        if (value === data.nodes[i].Status) {
          filter.push(data.nodes[i]);

          // data.nodes.push(...node.neighbors);

          //var foundValue = nodes.links.filter(obj=>obj.source.id===);
        }
      }
      //  data.nodes = [];
      // data.nodes.push(filter);
      // console.log("Refined Data=>", data);
      let neighbour = [];
      // data.links = [];
      // data.links.push(g_Data.links);
      // for (let j = 0; j < data.links.length; j++) {
      //   for (let l = 0; l < data.nodes.length; l++) {
      //     if (data?.links[j]?.source?.id === data.nodes[l].id) {
      //       for (let m = 0; m < data.nodes.length; m++) {
      //         if (data?.links[j]?.target?.id === data.nodes[m].id) {
      //           neighbour.push(data.links[j]);
      //         }
      //       }
      //     }
      //   }
      // }

      //   console.log("neighbour=>", neighbour);
      // data.links = [];
      //  data.links.push(...neighbour);
      //  console.log("new data=>", data);

      setGData(null);
      // setHoverNode(node || null);
      // const distance = 40;
      // const distRatio = 5 + distance / Math.hypot(node.x, node.y, node.z);

      // fgRef.current.cameraPosition(
      //   { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      //   node, // lookAt ({ x, y, z })
      //   2000 // ms transition duration
      // );
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

  const GROUPS = 12;

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
          {data.nodes.map((data) =>
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
        </select>
        <select
          style={{
            position: "absolute",
            top: "20px",
            zIndex: "1",
            left: "470px",
            width: "130px",
            height: "20px",
          }}
          onClick={(e) => {
            console.log(e.target.value);
            if (parseInt(e.target.value) === parseInt(100)) {
              window.location.reload(false);
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
        </select>
      </div>
      <ForceGraph3D
        className="react-graph"
        //nodeColor={node => node.id%2===0 ?"red" : "yellow"}
        // nodeColor={(node) => generateName(node)}
        ref={fgRef}
        graphData={data}
        // linkColor={() => "White"}
        nodeAutoColorBy={(d) => d.id % GROUPS}
        linkAutoColorBy={(d) => data.nodes[d.source].id % GROUPS}
        linkWidth={2}
        // nodeAutoColorBy="group"
        nodeRelSize={NODE_R}
        autoPauseRedraw={false}
        linkWidth={(link) => (highlightLinks.has(link) ? 4 : 1)}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={(link) =>
          highlightLinks.has(link) ? 3 : 0
        }
        nodeLabel={(node) => {
          if (node.hasOwnProperty("Workflow")) {
            if (node.Name === "InsuranceGig") {
              return `_________INSURANCE GIG________ <br/>
            
              ${node.neighbors.map((n) => {
                return `<br/>Worflow :
                  ${n.Name}`;
              })} 
              `;
            }
            return `Workflow : ${node.Name} 
              <br/>
              Status : ${node.Status}
              ${node.neighbors.map((n) => {
                return n.hasOwnProperty("Buyer")
                  ? `<br/>Buyer :
                  ${n.Buyer}`
                  : `<br/>Seller :
                   ${n.Seller}`;
              })} 
             `;
          } else if (node.hasOwnProperty("Buyer")) {
            return `This is ${node.Buyer} , Buyer of ${node.WorkflowImplementation.map(n=>n.Name)} <br/>
            Status : ${node.WorkflowImplementation.map(n=>n.Status)}`;
          } else if (node.hasOwnProperty("Seller")) {
            return `This is ${node.Seller} , Seller of ${node.WorkflowImplementation.map(n=>n.Name)} <br/>
            
            Status : ${node.Status}`;
          }
        }}
        //nodeLabel ={node  => `<span>${node.id}</span>`}
        nodeCanvasObject={paintRing}
        nodeCanvasObjectMode={(node) =>
          highlightNodes.has(node) ? "before" : undefined
        }
        onNodeHover={handleNodeHover}
        onLinkHover={handleLinkHover}
        linkOpacity={0.8}
        nodeVal={(node) => {
          if (node.id < 5) {
            if (node.hasOwnProperty("Name")) {
              if (node.Name === "InsuranceGig") {
                return 30;
              } else return 5;
            }
          } else {
            return 0.5;
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
