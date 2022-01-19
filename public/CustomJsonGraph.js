import "./styles.css";
import w_new from "./WorkflowNew_1.json";
import ForceGraph3D from "react-force-graph-3d";
import { Bezier } from "bezier-js";
import ForceGraph2D from "react-force-graph-2d";
import SpriteText from "three-spritetext";
import generateName from "./random.js";
import * as d3 from "d3";
import logo from "./images/logo.png";
import { indexs } from "./customStyle";
import LeftBar from "./leftBar";
import TopBar from "./topBar";
import SideBar from "./sideBar";
import { leftbar } from "./customStyle";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { resolveModuleName } from "typescript";
import { filter } from "d3";

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

export default function CustomJsonGraph() {
  const fgRef = useRef(null);

  const [status, setStatus] = useState(false);
  const [check, setCheck] = useState(false);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [linksGlobal, setLinksGlobal] = useState(null);
  const [nodesGlobal, setNodesGlobal] = useState(null);
  const [first_filter, setFirstFilter] = useState("");
  const [selected, setSelected] = useState("");
  const [selected1, setSelected1] = useState("");

  const Links_State = (links, nodes) => {
    setLinksGlobal(links);
    setNodesGlobal(nodes);
  };

  useEffect(() => {
    if (linksGlobal !== null && nodesGlobal !== null) {
      console.log("UseEffect called");
      console.log(linksGlobal);
      //  filter_graph();
    }
  }, [linksGlobal, nodesGlobal]);

  const filter_graph = (node) => {
    //data.nodes=nodesGlobal;
    if (first_filter !== "Workflow") {
      console.log("Filter from Filtered");
      let flag = 0;
      console.log("____________Second filter");
      console.log(data);
      for (let i = 0; i < data.nodes.length; i++) {
        if (node.id === data.nodes[i].id) {
          flag++;
          console.log("Found_______");
          data.nodes = [];
          data.nodes.push(node);
          data.nodes.push(...node.neighbors);
          console.log(data.nodes);
        } else {
          console.log("Not Found_______");
        }
      }
      if (flag === 0) {
        data.nodes = [];
      }
    } else {
      for (let i = 0; i < nodesGlobal.length; i++) {
        if (node.id === nodesGlobal[i].id) {
          data.nodes = [];
          data.nodes.push(node);
          data.nodes.push(...node.neighbors);
        }
      }
    }

    //   data.links = linksGlobal;
    let links_new = [];
    // FOR CREATING LINK____________________

    if (first_filter !== "Workflow") {
      //data.links = [];
      // data.links.push(linksGlobal);
    }
    for (let i = 0; i < data.links.length; i++) {
      if (node.id === data.links[i].target.id) {
        console.log(data.links[i]);
        links_new.push(data.links[i]);
      }
      if (node.id === data.links[i].source.id) {
        console.log(data.links[i]);
        links_new.push(data.links[i]);
      }
    }

    data.links = [];
    data.links.push(...links_new);

    console.log("new data=>", data);

    // setGData(data || null);
    setHoverNode(node || null);
    const distance = 40;
    const distRatio = 5 + distance / Math.hypot(node.x);

    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      2000 // ms transition duration
    );
  };

  const filter_graph_by_status = (node_status) => {
    //data.nodes=nodesGlobal;
console.log("handleStatus");
console.log(first_filter);
    if (first_filter === "Status") {
      console.log("Filter from Global");
      data.nodes = [];
      for (let i = 0; i < nodesGlobal.length; i++) {
        if (
          nodesGlobal[i].hasOwnProperty("Name") &&
          nodesGlobal[i].Name !== "InsuranceGig"
        ) {
          if (node_status === nodesGlobal[i].Status) {
            data.nodes.push(nodesGlobal[i]);
            data.nodes.push(...nodesGlobal[i].neighbors);
          }
        }
      }
    } else {
      let new_nodes = [];
      let flag = 0;
      for (let i = 0; i < data.nodes.length; i++) {
        if (
          data.nodes[i].hasOwnProperty("Name") &&
          data.nodes[i].Name !== "InsuranceGig"
        ) {
          if (node_status === data.nodes[i].Status) {
            flag++;
            new_nodes.push(data.nodes[i]);
            new_nodes.push(...data.nodes[i].neighbors);
          }
        }
      }

      if (flag === 0) {
        data.nodes = [];
      } else {
        data.nodes = [];
        data.nodes.push(...new_nodes);
      }
    }

    data.links = linksGlobal;
    let links_new = [];
    // FOR CREATING LINK____________________
    for (let i = 0; i < data.nodes.length; i++) {
      for (let j = 0; j < data.links.length; j++) {
        if (data.nodes[i].id === data.links[j].source.id) {
          console.log(data.links[j]);
          links_new.push(data.links[j]);
        }
      }
    }

    data.links = [];
    data.links.push(...links_new);

    console.log("new data=>", data);

    // setGData(data || null);
    setHoverNode(data.nodes || null);
    // const distance = 40;
    // const distRatio = 5 + distance / Math.hypot(data.nodes[0].x);

    // fgRef.current.cameraPosition(
    //   { x: data.nodes[0].x * distRatio, y: data.nodes[0].y * distRatio, z: data.nodes[0].z * distRatio }, // new position
    //   data.nodes[0], // lookAt ({ x, y, z })
    //   2000 // ms transition duration
    // );
  };

  const data = useMemo(() => {
    let nodes = [],
      links = [];

    if (w_new) {
      console.log(w_new);
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
              ) {
                for (
                  let k = 0;
                  k < nodes[j].WorkflowImplementation.length;
                  k++
                ) {
                  if (
                    nodes[i].Name === nodes[j].WorkflowImplementation[k].Name
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
              }
            }
          }
        }
      }
      setStatus(false);
      setLinksGlobal(links);
      setNodesGlobal(nodes);
      console.log(nodes);
      console.log(links);

      //const data = { nodes: nodes, links: links };

      return { nodes: nodes, links: links };
    }
  }, [check]);

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

  const handleClick = (node) => {
    setFirstFilter("Workflow");
    setCheck((check) => check);
  

    console.log("data=>", data);

    if (linksGlobal === null || nodesGlobal === null) {
      Links_State(data.links, data.nodes);
    }

    if (linksGlobal !== null && nodesGlobal !== null) {
      filter_graph(node);
    }
  };

  const handleByStatus = (status) => {
  
    setFirstFilter("Status");
    setCheck((check) => check);
   

   

    if (linksGlobal === null || nodesGlobal === null) {
      Links_State(data.links, data.nodes);
    }

    if (linksGlobal !== null && nodesGlobal !== null) {
      filter_graph_by_status(status);
    }
  };

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
      <div className="rowWrapper">
        <div className="leftbar" style={indexs.leftbar}>
          <div style={leftbar.mainDiv}>
            <h2 style={leftbar.heading}>Workflow</h2>
            <div style={leftbar.slctDiv}>
              <select
                style={leftbar.slct}
                value={selected} onChange={(e) => setSelected(e.target.value)}
                onClick={(e) => {
                  if (parseInt(e.target.value) === parseInt(100)) {
                    setCheck((check) => !check);
                    // window.location.reload(false);
                  } else {
                    if (nodesGlobal !== null) {
                      for (let i = 0; i < nodesGlobal.length; i++) {
                        if (
                          parseInt(e.target.value) ===
                          parseInt(nodesGlobal[i].id)
                        ) {
                          console.log("data to be set==>", data);

                          handleClick(nodesGlobal[i]);
                        }
                      }
                    } else {
                      for (let i = 0; i < data.nodes.length; i++) {
                        if (
                          parseInt(e.target.value) ===
                          parseInt(data.nodes[i].id)
                        ) {
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
              </select>
              <br />
              <br />

              <select
                style={leftbar.slct}
                onClick={(e) => {
                  if (parseInt(e.target.value) === parseInt(100)) {
                    setCheck((check) => !check);
                    // window.location.reload(false);
                  } else
                    for (let i = 0; i < data.nodes.length; i++) {
                      if (
                        parseInt(e.target.value) === parseInt(data.nodes[i].id)
                      ) {
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
              <br />
              <br />

              <select
                style={leftbar.slct}
                onClick={(e) => {
                  if (parseInt(e.target.value) === parseInt(100)) {
                    setCheck((check) => !check);
                    //window.location.reload(false);
                  } else
                    for (let i = 0; i < data.nodes.length; i++) {
                      if (
                        parseInt(e.target.value) === parseInt(data.nodes[i].id)
                      ) {
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
              <br />
              <br />
              <select
                style={leftbar.slct}
                value={selected1} onChange={(e) => setSelected1(e.target.value)}
                onClick={(e) => {
                  console.log(e.target.value);
                  if (parseInt(e.target.value) === parseInt(100)) {
                    setCheck((check) => !check);
                    // window.location.reload(false);
                  } else if (e.target.value === "Choose Status") {
                    return;
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
              <br />
              <br />
              <br />
              <br />
              <button
                style={leftbar.btn}
                onClick={() => {
                  setCheck((check) => !check);
                  setSelected("");
                  setSelected1("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="middlebar" style={indexs.middlebar}>
          <TopBar />

          <ForceGraph3D
            className="react-graph"
            //nodeColor={node => node.id%2===0 ?"red" : "yellow"}
            // nodeColor={(node) => generateName(node)}
            ref={fgRef}
            graphData={data}
            // linkColor={() => "White"}
            nodeAutoColorBy={(d) => d.id % GROUPS}
            //  linkAutoColorBy={() => "white"}
            linkOpacity={0.6}
            linkAutoColorBy={(d) => data.nodes[d.source].id % GROUPS}
            linkWidth={0.6}
            //distRatio="10:4"
            // nodeAutoColorBy="group"
            // nodeRelSize={NODE_R}
            autoPauseRedraw={false}
            // linkWidth={(link) => (highlightLinks.has(link) ? 4 : 2)}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={(link) =>
              highlightLinks.has(link) ? 1 : 0
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
                return `<br/>This is ${
                  node.Buyer
                } , <br/> ${node.WorkflowImplementation.map((n) => {
                  return `Buyer of ${n.Name} and status is ${n.Status} <br/>`;
                })}`;
              } else if (node.hasOwnProperty("Seller")) {
                return `<br/>This is ${
                  node.Seller
                } , <br/> ${node.WorkflowImplementation.map((n) => {
                  return `Seller of ${n.Name} and status is ${n.Status} <br/>`;
                })}`;
              }
            }}
            //nodeLabel ={node  => `<span>${node.id}</span>`}
            nodeCanvasObject={paintRing}
            nodeCanvasObjectMode={(node) =>
              highlightNodes.has(node) ? "before" : undefined
            }
            onNodeHover={handleNodeHover}
            onLinkHover={handleLinkHover}
            // linkOpacity={(node) => {
            //   if (node.hasOwnProperty("Name") && node.Name === "InsuranceGig") {
            //     return 0;
            //   } else {
            //     return 0;
            //   }
            // }}

            nodeVal={(node) => {
              if (node.id < 6) {
                if (node.hasOwnProperty("Name")) {
                  if (node.Name === "InsuranceGig") {
                    return 30;
                  } else return 5;
                }
              } else {
                return 0.5;
              }
            }}
            linkDirectionalArrowLength={5.5}
            // linkDirectionalArrowRelPos={1}
            //  linkDirectionalParticles={5}
            // linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={(d) => 20 * 0.001}
            linkDirectionalParticleColor="red"
            // nodeThreeObject={(node) => {
            //   if (node.hasOwnProperty("Name") && node.Name === "InsuranceGig") {
            //     const imgTexture = new THREE.TextureLoader().load(logo);
            //     const material = new THREE.SpriteMaterial({ map: imgTexture });
            //     const sprite = new THREE.Sprite(material);
            //     sprite.scale.set(30, 30);

            //     return sprite;
            //   }
            // }}
            onNodeClick={handleClick}
          />

          {!data.nodes.length && (
            <h2
              style={{
                position: "absolute",
                top: "50%",
                left: "40%",
                color: "white",
              }}
            >
              Not Result Found Pleasse Reset
            </h2>
          )}
        </div>

        <SideBar />
      </div>
    </>

    //</>//<ForceGraph3d
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
