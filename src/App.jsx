import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Panel,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import graphData from "./graph.json";

const NODE_W = 180;
const NODE_H = 50;
const COL_WIDTH = 480;
const ROW_HEIGHT = 120;
const FONT = "'JetBrains Mono', monospace";
const TEXT_COLOR = "#1e3a8a";

function MindMapNode({ data }) {
  return (
    <div
      style={{
        borderRadius: 8,
        padding: "8px 10px",
        border: data.border,
        background: data.background,
        fontSize: 11,
        width: NODE_W,
        textAlign: "center",
        fontWeight: data.fontWeight,
        fontFamily: FONT,
        color: TEXT_COLOR,
        boxSizing: "border-box",
      }}
    >
      <Handle type="target" position={Position.Left}   id="left-in"    style={{ background: "#94a3b8" }} />
      <Handle type="source" position={Position.Right}  id="right-out"  style={{ background: "#94a3b8" }} />
      <Handle type="source" position={Position.Left}   id="left-out"   style={{ background: "#94a3b8", top: "70%" }} />
      <Handle type="target" position={Position.Right}  id="right-in"   style={{ background: "#94a3b8", top: "70%" }} />
      {data.label}
    </div>
  );
}

const nodeTypes = { mindmap: MindMapNode };

function buildChildrenMap(edges) {
  const m = new Map();
  edges.forEach((e) => {
    if (!m.has(e.source)) m.set(e.source, []);
    m.get(e.source).push(e.target);
  });
  return m;
}

function visibleNodeIds(rootId, expanded, childrenMap) {
  const visible = new Set([rootId]);
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop();
    if (!expanded.has(id)) continue;
    (childrenMap.get(id) || []).forEach((k) => {
      visible.add(k);
      stack.push(k);
    });
  }
  return visible;
}

export default function App() {
  const { root, nodes: rawNodes, edges: rawEdges } = graphData;
  const childrenMap = useMemo(() => buildChildrenMap(rawEdges), [rawEdges]);

  const [expanded, setExpanded] = useState(new Set([root]));
  // lastClicked: always the last node clicked, never toggled off
  const [lastClicked, setLastClicked] = useState(null);

  const posCache = useRef((() => {
    const m = new Map([[root, { x: 0, y: 0 }]]);
    const grcId = rawNodes.find((n) => n.label.includes("Gobernanza"))?.id;
    if (grcId) m.set(grcId, { x: -COL_WIDTH, y: 0 });
    const sgsiId = rawNodes.find((n) => n.label === "SGSI")?.id;
    if (sgsiId) m.set(sgsiId, { x: -COL_WIDTH, y: ROW_HEIGHT });
    return m;
  })());

  const { nodes, edges } = useMemo(() => {
    const visibleIds = visibleNodeIds(root, expanded, childrenMap);
    const vNodes = rawNodes.filter((n) => visibleIds.has(n.id));
    const vEdges = rawEdges.filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target)
    );

    // Assign positions to new nodes via BFS (cached — never move)
    const queue = [root];
    const visited = new Set([root]);
    while (queue.length) {
      const id = queue.shift();
      const children = (childrenMap.get(id) || []).filter((c) => visibleIds.has(c));
      const parentPos = posCache.current.get(id) || { x: 0, y: 0 };
      children.forEach((cid, idx) => {
        if (!posCache.current.has(cid)) {
          const offset = (idx - (children.length - 1) / 2) * ROW_HEIGHT;
          posCache.current.set(cid, {
            x: parentPos.x + COL_WIDTH,
            y: parentPos.y + offset,
          });
        }
        if (!visited.has(cid)) {
          visited.add(cid);
          queue.push(cid);
        }
      });
    }

    // Nodes and edges connected to the last clicked node
    const connectedNodes = new Set();
    const connectedEdgeIdxs = new Set();
    if (lastClicked) {
      vEdges.forEach((e, i) => {
        if (e.source === lastClicked || e.target === lastClicked) {
          connectedEdgeIdxs.add(i);
          connectedNodes.add(e.source === lastClicked ? e.target : e.source);
        }
      });
    }

    const flowNodes = vNodes.map((n) => {
      const hasChildren = (childrenMap.get(n.id) || []).length > 0;
      const isExpanded = expanded.has(n.id);
      const isRoot = n.id === root;
      const isLastClicked = n.id === lastClicked;
      const isConnected = connectedNodes.has(n.id);
      const pos = posCache.current.get(n.id) || { x: 0, y: 0 };

      let background = "white";
      let border = "1px solid #94a3b8";

      if (isLastClicked) {
        background = "#dbeafe";
        border = "2px solid #1e40af";
      } else if (isConnected) {
        background = "#fee2e2";
        border = "2px solid #dc2626";
      } else if (isExpanded && hasChildren) {
        background = "#fef9c3";
        border = "1px solid #ca8a04";
      } else if (isRoot) {
        background = "#eff6ff";
        border = "2px solid #1e40af";
      }

      return {
        id: n.id,
        type: "mindmap",
        data: {
          label: `${n.label.replace(/\n/g, " ")}${
            hasChildren ? (isExpanded ? "  ▾" : "  ▸") : ""
          }`,
          background,
          border,
          fontWeight: isRoot ? 600 : 400,
        },
        position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
      };
    });

    const flowEdges = vEdges.map((e, i) => {
      const isConnected = connectedEdgeIdxs.has(i);
      const sPos = posCache.current.get(e.source) || { x: 0, y: 0 };
      const tPos = posCache.current.get(e.target) || { x: 0, y: 0 };
      const goesLeft = tPos.x < sPos.x;
      let sourceHandle = goesLeft ? "left-out" : "right-out";
      let targetHandle = goesLeft ? "right-in" : "left-in";
      return {
        id: `e${i}`,
        source: e.source,
        target: e.target,
        sourceHandle,
        targetHandle,
        label: e.label || "",
        labelStyle: {
          fontSize: 9,
          fill: isConnected ? "#dc2626" : "#111827",
          fontFamily: FONT,
        },
        labelBgStyle: { fill: "#f8fafc" },
        style: {
          stroke: isConnected ? "#ef4444" : "#cbd5e1",
          strokeWidth: isConnected ? 2 : 1.2,
        },
        type: "smoothstep",
      };
    });

    // Connected edges rendered last so they appear on top
    const sortedEdges = [
      ...flowEdges.filter((_, i) => !connectedEdgeIdxs.has(i)),
      ...flowEdges.filter((_, i) => connectedEdgeIdxs.has(i)),
    ];

    return { nodes: flowNodes, edges: sortedEdges };
  }, [rawNodes, rawEdges, expanded, lastClicked, childrenMap, root]);

  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState(nodes);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(edges);

  useEffect(() => {
    setFlowNodes(nodes);
    setFlowEdges(edges);
  }, [nodes, edges, setFlowNodes, setFlowEdges]);

  const onNodeClick = useCallback((_evt, node) => {
    setLastClicked(node.id);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
  }, []);

  const selectedNode = rawNodes.find((n) => n.id === lastClicked);
  const showPanel = selectedNode && selectedNode.footnotes?.length > 0;

  const [lightbox, setLightbox] = useState(null);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", overflow: "hidden" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
          minZoom={0.1}
          maxZoom={2}
        >
          <Background />
          <Controls />
          <Panel position="bottom-center">
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 11,
                fontFamily: FONT,
                color: "#92400e",
                marginBottom: 8,
                pointerEvents: "none",
              }}
            >
              Recomendación: expande un solo nodo por nivel de profundidad para mantener la claridad del mapa.
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {showPanel && (
        <aside
          style={{
            width: 340,
            flexShrink: 0,
            borderLeft: "1px solid #e2e8f0",
            padding: 20,
            overflowY: "auto",
            overflowX: "hidden",
            background: "#f8fafc",
            fontFamily: FONT,
            color: TEXT_COLOR,
          }}
        >
          <h3 style={{ marginTop: 0, fontFamily: FONT, color: TEXT_COLOR }}>
            {selectedNode.label}
          </h3>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontFamily: FONT }}>
            {selectedNode.footnotes.length} nota(s) ·{" "}
            {(childrenMap.get(selectedNode.id) || []).length} hijo(s)
          </p>
          {selectedNode.footnotes.map((f, i) => {
            // Evaluamos si la nota actual es un objeto estructurado o un string simple
            const isObject = typeof f === "object" && f !== null;
            const type = isObject ? f.type : "text";
            const content = isObject ? f.content : f;

            return (
              <div
                key={i}
                style={{
                  background: "white",
                  padding: type === "image" ? "8px" : "12px", // Menos padding si es imagen para que luzca mejor
                  marginBottom: 10,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  lineHeight: 1.6,
                  fontFamily: FONT,
                  color: TEXT_COLOR,
                }}
              >
                {type === "image" ? (
                  <img
                    src={content}
                    alt="Footnote adjunto"
                    onClick={() => setLightbox(content)}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 6,
                      display: "block",
                      cursor: "zoom-in",
                    }}
                  />
                ) : (
                  content
                )}
              </div>
            );
          })}
        </aside>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox}
            alt="Vista ampliada"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 10,
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              cursor: "default",
            }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed",
              top: 20,
              right: 24,
              background: "white",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1e3a8a",
              fontFamily: FONT,
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}