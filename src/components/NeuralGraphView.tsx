import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GraphNode, NodeCategory } from '../types';
import { INITIAL_GRAPH_NODES, CATEGORY_COLORS } from '../data/graphNodes';
import { audioEngine } from '../services/audioEngine';
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Plus, 
  Sliders, 
  Layers, 
  Share2, 
  BookOpen, 
  Sparkles, 
  Compass,
  Filter
} from 'lucide-react';

interface NeuralGraphViewProps {
  onSelectNodeForSynthesis?: (node: GraphNode) => void;
  onOpenVaultNote?: (nodeId: string) => void;
}

export const NeuralGraphView: React.FC<NeuralGraphViewProps> = ({
  onSelectNodeForSynthesis,
  onOpenVaultNote
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_GRAPH_NODES);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<NodeCategory | 'all'>('all');
  const [showControls, setShowControls] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [is3DMode, setIs3DMode] = useState(false);

  // Force simulation parameters
  const [repulsion, setRepulsion] = useState(480);
  const [linkDistance, setLinkDistance] = useState(130);
  const [gravity, setGravity] = useState(0.04);
  const [friction, setFriction] = useState(0.88);

  // Camera transform
  const transformRef = useRef({ x: 0, y: 0, scale: 1.0 });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const draggedNodeRef = useRef<GraphNode | null>(null);

  // New Node Form
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeCategory, setNewNodeCategory] = useState<NodeCategory>('semiotics');
  const [newNodeSummary, setNewNodeSummary] = useState('');
  const [newNodeWeight, setNewNodeWeight] = useState(8);

  // Initialize node positions in a circular topology if unset
  useEffect(() => {
    const initialized = INITIAL_GRAPH_NODES.map((node, i) => {
      const angle = (i / INITIAL_GRAPH_NODES.length) * Math.PI * 2;
      const radius = 220 + (i % 3) * 60;
      return {
        ...node,
        x: node.x || 450 + Math.cos(angle) * radius,
        y: node.y || 350 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });
    setNodes(initialized);
  }, []);

  // Filtered nodes
  const filteredNodes = nodes.filter(n => {
    const matchesCategory = activeCategory === 'all' || n.category === activeCategory;
    const matchesSearch = !searchQuery || 
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Center camera to nodes
  const resetCamera = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    transformRef.current = {
      x: canvas.width / 2 - 450,
      y: canvas.height / 2 - 350,
      scale: 0.85
    };
    audioEngine.playNodeBlip(750);
  }, []);

  useEffect(() => {
    resetCamera();
  }, [resetCamera]);

  // Main Canvas Rendering Loop & Force Physics Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle pulses along edges
    const dataPackets: { sourceId: string; targetId: string; progress: number; speed: number; color: string }[] = [];
    for (let i = 0; i < 24; i++) {
      const srcNode = nodes[Math.floor(Math.random() * nodes.length)];
      if (srcNode && srcNode.connections.length > 0) {
        const targetId = srcNode.connections[Math.floor(Math.random() * srcNode.connections.length)];
        dataPackets.push({
          sourceId: srcNode.id,
          targetId,
          progress: Math.random(),
          speed: 0.004 + Math.random() * 0.008,
          color: srcNode.hexColor || '#10b981'
        });
      }
    }

    const runPhysics = () => {
      const currentNodes = nodes;
      const nodeMap = new Map<string, GraphNode>();
      currentNodes.forEach(n => nodeMap.set(n.id, n));

      const cx = 450;
      const cy = 350;

      // 1. Repulsion between all node pairs (Coulomb force)
      for (let i = 0; i < currentNodes.length; i++) {
        const n1 = currentNodes[i];
        if (n1.x === undefined || n1.y === undefined) continue;

        // Center gravity
        const gx = cx - n1.x;
        const gy = cy - n1.y;
        n1.vx = (n1.vx || 0) + gx * gravity * 0.05;
        n1.vy = (n1.vy || 0) + gy * gravity * 0.05;

        for (let j = i + 1; j < currentNodes.length; j++) {
          const n2 = currentNodes[j];
          if (n2.x === undefined || n2.y === undefined) continue;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy + 100;
          const dist = Math.sqrt(distSq);

          if (dist < 500) {
            const force = repulsion / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggedNodeRef.current?.id !== n1.id) {
              n1.vx = (n1.vx || 0) - fx;
              n1.vy = (n1.vy || 0) - fy;
            }
            if (draggedNodeRef.current?.id !== n2.id) {
              n2.vx = (n2.vx || 0) + fx;
              n2.vy = (n2.vy || 0) + fy;
            }
          }
        }
      }

      // 2. Spring force along links (Hooke's Law)
      for (const n1 of currentNodes) {
        if (n1.x === undefined || n1.y === undefined) continue;
        for (const targetId of n1.connections) {
          const n2 = nodeMap.get(targetId);
          if (!n2 || n2.x === undefined || n2.y === undefined) continue;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const displacement = dist - linkDistance;
          const springForce = displacement * 0.025;

          const fx = (dx / dist) * springForce;
          const fy = (dy / dist) * springForce;

          if (draggedNodeRef.current?.id !== n1.id) {
            n1.vx = (n1.vx || 0) + fx;
            n1.vy = (n1.vy || 0) + fy;
          }
          if (draggedNodeRef.current?.id !== n2.id) {
            n2.vx = (n2.vx || 0) - fx;
            n2.vy = (n2.vy || 0) - fy;
          }
        }
      }

      // 3. Update positions with friction
      for (const n of currentNodes) {
        if (draggedNodeRef.current?.id === n.id) continue;
        n.vx = (n.vx || 0) * friction;
        n.vy = (n.vy || 0) * friction;
        n.x = (n.x || 0) + (n.vx || 0);
        n.y = (n.y || 0) + (n.vy || 0);
      }
    };

    const render = () => {
      runPhysics();

      const { x: tx, y: ty, scale } = transformRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(tx, ty);
      ctx.scale(scale, scale);

      const nodeMap = new Map<string, GraphNode>();
      nodes.forEach(n => nodeMap.set(n.id, n));

      // Draw all connections / edges
      ctx.lineWidth = 1.0;
      for (const n1 of nodes) {
        if (n1.x === undefined || n1.y === undefined) continue;
        const isN1Selected = selectedNode?.id === n1.id;
        const isN1Hovered = hoveredNode?.id === n1.id;

        for (const targetId of n1.connections) {
          const n2 = nodeMap.get(targetId);
          if (!n2 || n2.x === undefined || n2.y === undefined) continue;

          const isConnectedToSelected = isN1Selected || selectedNode?.id === n2.id;
          const isConnectedToHovered = isN1Hovered || hoveredNode?.id === n2.id;

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);

          if (isConnectedToSelected) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.2;
            ctx.globalAlpha = 0.9;
          } else if (isConnectedToHovered) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.8;
            ctx.globalAlpha = 0.7;
          } else {
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.22)';
            ctx.lineWidth = 0.9;
            ctx.globalAlpha = 0.35;
          }
          ctx.stroke();
        }
      }

      // Draw dynamic traveling synaptic data packets
      for (const packet of dataPackets) {
        packet.progress += packet.speed;
        if (packet.progress >= 1) {
          packet.progress = 0;
          const randSrc = nodes[Math.floor(Math.random() * nodes.length)];
          if (randSrc && randSrc.connections.length > 0) {
            packet.sourceId = randSrc.id;
            packet.targetId = randSrc.connections[Math.floor(Math.random() * randSrc.connections.length)];
            packet.color = randSrc.hexColor || '#10b981';
          }
        }

        const src = nodeMap.get(packet.sourceId);
        const tgt = nodeMap.get(packet.targetId);
        if (src && tgt && src.x !== undefined && src.y !== undefined && tgt.x !== undefined && tgt.y !== undefined) {
          const px = src.x + (tgt.x - src.x) * packet.progress;
          const py = src.y + (tgt.y - src.y) * packet.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = packet.color;
          ctx.globalAlpha = 0.85;
          ctx.shadowColor = packet.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw all nodes
      for (const n of nodes) {
        if (n.x === undefined || n.y === undefined) continue;

        const isSelected = selectedNode?.id === n.id;
        const isHovered = hoveredNode?.id === n.id;
        const isHighlightedBySearch = searchQuery && 
          (n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
           n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

        const baseRadius = 6 + (n.cognitiveWeight || 7) * 1.5;
        const radius = isSelected ? baseRadius * 1.4 : isHovered ? baseRadius * 1.25 : baseRadius;

        const catTheme = CATEGORY_COLORS[n.category] || CATEGORY_COLORS.semiotics;

        // Outer glow halo for selected / active
        if (isSelected || isHovered || isHighlightedBySearch) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(16, 185, 129, 0.25)' : catTheme.glow;
          ctx.fill();
        }

        // Main node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#10b981' : isHovered ? '#38bdf8' : catTheme.bg;
        ctx.globalAlpha = 0.95;
        ctx.fill();

        // Node border
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.strokeStyle = isSelected ? '#ffffff' : catTheme.border;
        ctx.stroke();

        // Node center core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Label typography
        ctx.font = isSelected ? 'bold 12px "JetBrains Mono", monospace' : '11px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#ffffff' : isHovered ? '#67e8f9' : '#cbd5e1';
        ctx.globalAlpha = isSelected || isHovered || isHighlightedBySearch ? 1.0 : 0.8;
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + radius + 14);

        // Subtext category indicator
        if (isSelected || isHovered) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = catTheme.text;
          ctx.fillText(`[${n.category.toUpperCase()}]`, n.x, n.y + radius + 26);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [nodes, selectedNode, hoveredNode, searchQuery, repulsion, linkDistance, gravity, friction]);

  // Coordinate conversion helpers
  const getCanvasCoords = (clientX: number, clientY: number): { worldX: number; worldY: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { worldX: 0, worldY: 0 };
    const rect = canvas.getBoundingClientRect();
    const { x: tx, y: ty, scale } = transformRef.current;
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;
    const worldX = (canvasX - tx) / scale;
    const worldY = (canvasY - ty) / scale;
    return { worldX, worldY };
  };

  const findNodeAt = (worldX: number, worldY: number) => {
    for (const n of nodes) {
      if (n.x === undefined || n.y === undefined) continue;
      const dx = n.x - worldX;
      const dy = n.y - worldY;
      const radius = 12 + (n.cognitiveWeight || 7) * 1.5;
      if (dx * dx + dy * dy <= radius * radius * 1.8) {
        return n;
      }
    }
    return null;
  };

  // Mouse / Pan / Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const { worldX, worldY } = getCanvasCoords(e.clientX, e.clientY);
    const clickedNode = findNodeAt(worldX, worldY);

    if (clickedNode) {
      draggedNodeRef.current = clickedNode;
      setSelectedNode(clickedNode);
      audioEngine.playNodeBlip(800 + (clickedNode.cognitiveWeight ?? 7) * 40);
    } else {
      isPanningRef.current = true;
      panStartRef.current = {
        x: e.clientX - transformRef.current.x,
        y: e.clientY - transformRef.current.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { worldX, worldY } = getCanvasCoords(e.clientX, e.clientY);

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = worldX;
      draggedNodeRef.current.y = worldY;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
    } else if (isPanningRef.current) {
      transformRef.current.x = e.clientX - panStartRef.current.x;
      transformRef.current.y = e.clientY - panStartRef.current.y;
    } else {
      const node = findNodeAt(worldX, worldY);
      if (node !== hoveredNode) {
        setHoveredNode(node);
        if (node) audioEngine.playSynapticClick(1600);
      }
    }
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
    draggedNodeRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.max(0.3, Math.min(2.8, transformRef.current.scale * zoomFactor));
    
    // Zoom centered on cursor
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    transformRef.current.x = mouseX - (mouseX - transformRef.current.x) * (newScale / transformRef.current.scale);
    transformRef.current.y = mouseY - (mouseY - transformRef.current.y) * (newScale / transformRef.current.scale);
    transformRef.current.scale = newScale;
  };

  // Add custom node function
  const handleAddNewNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;

    const canvas = canvasRef.current;
    const cx = canvas ? canvas.width / 2 : 450;
    const cy = canvas ? canvas.height / 2 : 350;

    const catTheme = CATEGORY_COLORS[newNodeCategory] || CATEGORY_COLORS.semiotics;

    const newNode: GraphNode = {
      id: `custom-node-${Date.now()}`,
      label: newNodeLabel,
      category: newNodeCategory,
      summary: newNodeSummary || 'Custom synthetic node formulated by the polymath architect.',
      epistemicContext: 'Synthesized via Noosphere OS Neural Editor.',
      cognitiveWeight: newNodeWeight,
      tags: ['custom', newNodeCategory, 'synthetic'],
      connections: selectedNode ? [selectedNode.id] : ['deleuzian-rhizome', 'shannon-entropy'],
      hexColor: catTheme.bg,
      x: cx + (Math.random() - 0.5) * 100,
      y: cy + (Math.random() - 0.5) * 100,
      vx: 0,
      vy: 0,
      quote: 'Novel concept forged in the alchemical reactor.'
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNode(newNode);
    setShowAddModal(false);
    setNewNodeLabel('');
    setNewNodeSummary('');
    audioEngine.playEurekaChord();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#05070d] text-zinc-100 relative overflow-hidden font-mono-code">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-2.5 bg-zinc-950/80 border-b border-zinc-800/80 z-10 gap-2 text-xs">
        {/* Left: Search & Category Filter */}
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 80+ neural concepts, tags, axioms..."
              className="w-full pl-8 pr-3 py-1 bg-zinc-900/90 border border-zinc-800 rounded text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as NodeCategory | 'all')}
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Domains ({nodes.length})</option>
              <option value="semiotics">Semiotics & Philosophy</option>
              <option value="hypergrowth">Hypergrowth & GTM</option>
              <option value="cybernetics">Cybernetics & Systems</option>
              <option value="biomimicry">Biomimicry & Nature</option>
              <option value="avantgarde">Avant-Garde Aesthetics</option>
              <option value="quantum">Quantum & Entropy</option>
              <option value="memetics">Memetics & Warfare</option>
              <option value="ai-orchestration">AI Orchestration</option>
              <option value="esoteric">Hermetic & Esoteric</option>
            </select>
          </div>
        </div>

        {/* Right: Graph Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Node</span>
          </button>

          <button
            onClick={() => setShowControls(!showControls)}
            title="Physics Parameters"
            className={`p-1.5 rounded border transition-colors ${
              showControls ? 'bg-zinc-800 text-emerald-400 border-emerald-500/40' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              transformRef.current.scale = Math.min(2.5, transformRef.current.scale * 1.2);
              audioEngine.playSynapticClick(1100);
            }}
            title="Zoom In"
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              transformRef.current.scale = Math.max(0.3, transformRef.current.scale * 0.8);
              audioEngine.playSynapticClick(900);
            }}
            title="Zoom Out"
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetCamera}
            title="Center Graph"
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Physics Sliders Drawer */}
      {showControls && (
        <div className="absolute top-12 right-3 z-20 w-72 p-3.5 rounded-lg glass-panel text-xs space-y-3 shadow-2xl border border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sliders className="w-3 h-3" /> Force Physics Dynamics
            </span>
            <button onClick={() => setShowControls(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
              <span>Repulsion (Coulomb)</span>
              <span className="font-mono text-emerald-400">{repulsion}</span>
            </div>
            <input
              type="range"
              min="100"
              max="1200"
              step="20"
              value={repulsion}
              onChange={(e) => setRepulsion(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
              <span>Link Tension Distance</span>
              <span className="font-mono text-cyan-400">{linkDistance}px</span>
            </div>
            <input
              type="range"
              min="50"
              max="350"
              step="10"
              value={linkDistance}
              onChange={(e) => setLinkDistance(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-zinc-800 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
              <span>Center Gravity Force</span>
              <span className="font-mono text-purple-400">{(gravity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.01"
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
              className="w-full accent-purple-500 h-1 bg-zinc-800 rounded"
            />
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Floating Node Inspector Card when selected */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 z-20 w-84 max-w-[calc(100vw-32px)] p-4 rounded-lg glass-panel glass-glow-emerald border border-emerald-500/40 text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-3">
            <div className="flex items-start justify-between pb-2 mb-2 border-b border-zinc-800">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                  {selectedNode.category}
                </span>
                <h4 className="text-sm font-bold text-zinc-100 mt-1 font-display tracking-wide">
                  {selectedNode.label}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-zinc-300 text-[11px] leading-relaxed mb-2.5">
              {selectedNode.summary}
            </p>

            {selectedNode.quote && (
              <blockquote className="border-l-2 border-emerald-500/60 pl-2 py-0.5 my-2 text-[10px] italic text-zinc-400 bg-emerald-950/20">
                "{selectedNode.quote}"
              </blockquote>
            )}

            {selectedNode.applicationVector && (
              <div className="text-[10px] bg-zinc-900/90 border border-zinc-800 rounded p-2 mb-3 text-zinc-300">
                <span className="text-emerald-400 font-semibold block mb-0.5">Tactical GTM Vector:</span>
                {selectedNode.applicationVector}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {selectedNode.tags.map(t => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  #{t}
                </span>
              ))}
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800">
              <button
                onClick={() => {
                  audioEngine.playEurekaChord();
                  if (onSelectNodeForSynthesis) {
                    onSelectNodeForSynthesis(selectedNode);
                  }
                }}
                className="flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:brightness-110 shadow-lg shadow-emerald-900/30 transition-all text-[10px]"
              >
                <Sparkles className="w-3 h-3" />
                <span>Collide Concept</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playNodeBlip(950);
                  if (onOpenVaultNote) {
                    onOpenVaultNote(selectedNode.id);
                  }
                }}
                className="flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors text-[10px]"
              >
                <BookOpen className="w-3 h-3 text-cyan-400" />
                <span>Open Note Vault</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom stats overlay */}
        <div className="absolute bottom-2 right-3 pointer-events-none text-[9px] text-zinc-500 font-mono flex items-center space-x-3">
          <span>Active Nodes: {nodes.length}</span>
          <span>Synapses: {nodes.reduce((acc, n) => acc + n.connections.length, 0)}</span>
          <span>Entropy: 0.94 bits/sym</span>
        </div>
      </div>

      {/* Modal: Add Node */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-5 rounded-lg glass-panel border border-emerald-500/40 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4" /> Inject New Cognitive Node
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
            </div>

            <form onSubmit={handleAddNewNode} className="space-y-3">
              <div>
                <label className="block text-zinc-400 text-[10px] uppercase font-bold mb-1">Concept Label</label>
                <input
                  type="text"
                  required
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="e.g. Baudrillardian Hyperstition Loop"
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] uppercase font-bold mb-1">Disciplinary Domain</label>
                <select
                  value={newNodeCategory}
                  onChange={(e) => setNewNodeCategory(e.target.value as NodeCategory)}
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="semiotics">Semiotics & Philosophy</option>
                  <option value="hypergrowth">Hypergrowth & Funnels</option>
                  <option value="cybernetics">Cybernetics & Systems</option>
                  <option value="biomimicry">Biomimicry & Natural Law</option>
                  <option value="avantgarde">Avant-Garde Aesthetics</option>
                  <option value="quantum">Quantum & Information Theory</option>
                  <option value="memetics">Memetics & Mythopoetics</option>
                  <option value="ai-orchestration">AI Orchestration</option>
                  <option value="esoteric">Esoteric & Polymathic</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] uppercase font-bold mb-1">Epistemic Summary & Thesis</label>
                <textarea
                  rows={3}
                  value={newNodeSummary}
                  onChange={(e) => setNewNodeSummary(e.target.value)}
                  placeholder="Describe the cognitive mechanism and how it fractures legacy market consensus..."
                  className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Cognitive Density Weight</span>
                  <span className="font-mono text-emerald-400">{newNodeWeight} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newNodeWeight}
                  onChange={(e) => setNewNodeWeight(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-zinc-800 rounded"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                >
                  Spawn Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
