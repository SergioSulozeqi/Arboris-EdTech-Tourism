import React, { useState, useRef, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Plus, 
  Minus, 
  RotateCcw, 
  Compass, 
  QrCode, 
  Layers, 
  Info, 
  CheckCircle2, 
  Sparkles,
  Mountain,
  Footprints
} from 'lucide-react';
import { Checkpoint, CheckpointId, UserLocation } from '../types';

interface InteractiveMapProps {
  checkpoints: Checkpoint[];
  activeCheckpointId: CheckpointId | null;
  visitedCheckpoints: CheckpointId[];
  userLocation: UserLocation;
  isRouteActive: boolean;
  activeRouteName?: string;
  onSelectCheckpoint: (checkpoint: Checkpoint) => void;
  onMoveUserLocation: (x: number, y: number) => void;
  onOpenScanner: (targetCheckpoint?: Checkpoint) => void;
  onToggleGps: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  checkpoints,
  activeCheckpointId,
  visitedCheckpoints,
  userLocation,
  isRouteActive,
  activeRouteName,
  onSelectCheckpoint,
  onMoveUserLocation,
  onOpenScanner,
  onToggleGps,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapLayer, setMapLayer] = useState<'topo' | 'satellite' | 'terrain'>('topo');
  const [showElevationProfile, setShowElevationProfile] = useState<boolean>(false);
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState<Checkpoint | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate proximity to nearby checkpoints
  const nearbyCheckpoint = checkpoints.find((cp) => {
    const dx = cp.coordinates.x - userLocation.x;
    const dy = cp.coordinates.y - userLocation.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < 8; // Within 8% map distance
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-control')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMapClick = (e: React.MouseEvent) => {
    // If clicked directly on map background and not dragging, move user location to clicked spot
    if ((e.target as HTMLElement).closest('.checkpoint-node') || (e.target as HTMLElement).closest('.interactive-control')) {
      return;
    }
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left - pan.x;
    const clickY = e.clientY - rect.top - pan.y;
    
    // Normalize to 0-100% inside the zoomed container
    const width = rect.width * zoom;
    const height = rect.height * zoom;
    
    const pctX = Math.max(5, Math.min(95, (clickX / width) * 100));
    const pctY = Math.max(5, Math.min(95, (clickY / height) * 100));

    onMoveUserLocation(Math.round(pctX), Math.round(pctY));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCenterOnUser = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const targetX = -(userLocation.x / 100) * rect.width * (zoom - 1);
    const targetY = -(userLocation.y / 100) * rect.height * (zoom - 1);
    setPan({ x: targetX, y: targetY });
  };

  const handleNextStepTeleport = () => {
    // Move user to the next unvisited checkpoint
    const nextCp = checkpoints.find(c => !visitedCheckpoints.includes(c.id)) || checkpoints[0];
    onMoveUserLocation(nextCp.coordinates.x, nextCp.coordinates.y);
  };

  return (
    <div 
      ref={containerRef}
      id="interactive-map-container"
      className="relative w-full h-[580px] md:h-[650px] lg:h-[720px] bg-[#fcf8f0] rounded-3xl overflow-hidden border border-orange-200/80 shadow-2xl shadow-orange-950/5 select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleMapClick}
    >
      {/* Top Banner Status Info */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-orange-100 pointer-events-auto shadow-lg shadow-orange-950/5">
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse shadow-sm shadow-orange-500/50" />
          <div>
            <div className="text-[11px] text-slate-500 font-medium">Mappa Interattiva Territorio</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span>Monte di Malo & Priabona</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-mono font-bold">5 Totem</span>
            </div>
          </div>
        </div>

        {/* Active route pill if navigation started */}
        {isRouteActive && (
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-orange-400 pointer-events-auto shadow-lg shadow-orange-500/10">
            <Footprints className="w-4 h-4 text-orange-600 animate-bounce" />
            <div className="text-xs font-bold text-orange-600">
              {activeRouteName || 'Percorso Attivo'}
            </div>
            <span className="text-[11px] bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full font-bold">
              {visitedCheckpoints.length}/5 Tappe
            </span>
          </div>
        )}

        {/* Layers & View controls */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 pointer-events-auto shadow-lg shadow-orange-950/5">
          <button
            id="map-layer-topo-btn"
            onClick={(e) => { e.stopPropagation(); setMapLayer('topo'); }}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              mapLayer === 'topo'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
            }`}
          >
            Topografica
          </button>
          <button
            id="map-layer-satellite-btn"
            onClick={(e) => { e.stopPropagation(); setMapLayer('satellite'); }}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              mapLayer === 'satellite'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
            }`}
          >
            Satellitare
          </button>
          <button
            id="map-layer-terrain-btn"
            onClick={(e) => { e.stopPropagation(); setMapLayer('terrain'); }}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              mapLayer === 'terrain'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
            }`}
          >
            Boschi & Rilievi
          </button>
        </div>
      </div>

      {/* SVG Canvas for Map Graphics */}
      <div 
        className="w-full h-full origin-center transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full select-none"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            {/* Vibrant Palette Gradients */}
            <linearGradient id="bgGradientTopo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdfaf3" />
              <stop offset="50%" stopColor="#faf2e3" />
              <stop offset="100%" stopColor="#f6ecda" />
            </linearGradient>

            <linearGradient id="bgGradientSat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0fdf4" />
              <stop offset="40%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#ecfdf5" />
            </linearGradient>

            <linearGradient id="bgGradientTerrain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fefce8" />
              <stop offset="60%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#ecfdf5" />
            </linearGradient>

            <linearGradient id="trailGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.95" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.12" />
            </filter>

            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(249,115,22,0.05)" strokeWidth="1" />
            </pattern>

            <pattern id="contourPattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 Q 25 30 50 50 T 100 50" fill="none" stroke="rgba(249,115,22,0.07)" strokeWidth="1" />
              <path d="M 0 20 Q 35 5 70 20 T 100 20" fill="none" stroke="rgba(249,115,22,0.05)" strokeWidth="1" />
              <path d="M 0 80 Q 20 95 60 80 T 100 80" fill="none" stroke="rgba(249,115,22,0.05)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Layer */}
          <rect 
            width="1000" 
            height="700" 
            fill={mapLayer === 'topo' ? 'url(#bgGradientTopo)' : mapLayer === 'satellite' ? 'url(#bgGradientSat)' : 'url(#bgGradientTerrain)'} 
          />
          <rect width="1000" height="700" fill="url(#grid)" />
          <rect width="1000" height="700" fill="url(#contourPattern)" />

          {/* Mountain & Hill Elevation Shading Regions (Vibrant natural polygons) */}
          <g className="opacity-70">
            {/* Faedo Casaron Ridge */}
            <path
              d="M 280 320 Q 380 250 480 340 T 580 440 T 400 540 Z"
              fill="rgba(16, 185, 129, 0.2)"
              stroke="rgba(16, 185, 129, 0.4)"
              strokeWidth="1.5"
            />
            {/* San Vittore Summit Hill */}
            <path
              d="M 200 100 Q 320 60 420 120 T 360 220 T 180 180 Z"
              fill="rgba(245, 158, 11, 0.22)"
              stroke="rgba(245, 158, 11, 0.45)"
              strokeWidth="1.5"
            />
            {/* Priabona Valley & Formations */}
            <path
              d="M 620 480 Q 750 420 880 500 T 820 650 T 640 620 Z"
              fill="rgba(14, 165, 233, 0.18)"
              stroke="rgba(14, 165, 233, 0.35)"
              strokeWidth="1.5"
            />
            {/* Parco Natura Agane Forest Zone */}
            <path
              d="M 420 180 Q 560 140 640 240 T 580 360 T 440 300 Z"
              fill="rgba(168, 85, 247, 0.15)"
              stroke="rgba(168, 85, 247, 0.3)"
              strokeWidth="1.5"
            />
          </g>

          {/* Contour Lines */}
          <g stroke="rgba(234, 88, 12, 0.2)" strokeWidth="1.2" fill="none">
            <path d="M 120 200 C 250 140, 350 90, 500 140 C 650 190, 750 280, 890 260" />
            <path d="M 150 280 C 290 220, 390 170, 540 210 C 680 250, 770 360, 920 330" />
            <path d="M 180 360 C 310 300, 420 250, 570 300 C 700 340, 800 440, 940 420" />
            <path d="M 220 460 C 350 400, 480 370, 610 400 C 730 430, 820 520, 960 510" />
            <path d="M 260 550 C 390 510, 520 480, 660 500 C 770 520, 850 610, 970 600" />
          </g>

          {/* Secondary Roads & Localities */}
          <g stroke="rgba(100, 116, 139, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" fill="none">
            <path d="M 100 450 L 300 520 L 500 560 L 780 600" />
            <path d="M 320 140 L 480 180 L 680 250 L 850 200" />
            <path d="M 500 560 L 520 380 L 520 250" />
          </g>

          {/* Locality text annotations */}
          <g fill="#475569" fontSize="11" fontWeight="700" letterSpacing="0.06em">
            <text x="320" y="270">LEGUZZANO</text>
            <text x="690" y="280">CAZZOLA</text>
            <text x="560" y="420">MONTE DI MALO CENTRO</text>
            <text x="760" y="470">SANTA LUCIA</text>
            <text x="420" y="640">VIGOLO</text>
            <text x="210" y="380">MIEGHI</text>
            <text x="820" y="580">PRIABONA</text>
            <text x="260" y="130">SAN VITTORE (420m)</text>
            <text x="380" y="440">BUSO DELLA RANA</text>
          </g>

          {/* The Official Arboris Main Trail Connecting 5 Checkpoints */}
          <g id="trail-path-group">
            {/* Trail shadow/halo */}
            <path
              d="M 780 588 L 650 483 L 420 420 L 520 245 L 320 140"
              fill="none"
              stroke="#fb923c"
              strokeWidth="9"
              strokeOpacity="0.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main Trail Line */}
            <path
              d="M 780 588 L 650 483 L 420 420 L 520 245 L 320 140"
              fill="none"
              stroke="url(#trailGlow)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animated Dashed Indicator of Route Movement */}
            <path
              d="M 780 588 L 650 483 L 420 420 L 520 245 L 320 140"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="6 10"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="32;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Intermediate Trail Dots */}
          <g fill="#ea580c" opacity="0.8">
            <circle cx="715" cy="535" r="3.5" />
            <circle cx="535" cy="451" r="3.5" />
            <circle cx="470" cy="332" r="3.5" />
            <circle cx="420" cy="192" r="3.5" />
          </g>

          {/* Render Totem & Checkpoint Markers */}
          {checkpoints.map((cp) => {
            const svgX = (cp.coordinates.x / 100) * 1000;
            const svgY = (cp.coordinates.y / 100) * 700;
            const isSelected = activeCheckpointId === cp.id;
            const isVisited = visitedCheckpoints.includes(cp.id);

            return (
              <g
                key={cp.id}
                id={`marker-${cp.id}`}
                className="checkpoint-node cursor-pointer transition-all group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCheckpoint(cp);
                }}
                onMouseEnter={() => setHoveredCheckpoint(cp)}
                onMouseLeave={() => setHoveredCheckpoint(null)}
              >
                {/* Radar pulse aura for unvisited or active */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r="26"
                  fill="#f97316"
                  fillOpacity={isSelected ? '0.4' : '0.2'}
                  className={isSelected ? 'animate-radar' : ''}
                />

                {/* Outer badge ring */}
                <circle
                  cx={svgX}
                  cy={svgY}
                  r="17"
                  fill="#ffffff"
                  stroke={isSelected ? '#ea580c' : '#f97316'}
                  strokeWidth={isSelected ? '3.5' : '2.5'}
                  filter="url(#cardShadow)"
                />

                {/* Inner status or Checkmark */}
                {isVisited ? (
                  <g transform={`translate(${svgX - 9}, ${svgY - 9})`}>
                    <circle cx="9" cy="9" r="9" fill="#10b981" />
                    <path
                      d="M 5 9 L 8 12 L 13 6"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                ) : (
                  <text
                    x={svgX}
                    y={svgY + 4}
                    textAnchor="middle"
                    fill="#ea580c"
                    fontSize="11"
                    fontWeight="900"
                    fontFamily="Syne, sans-serif"
                  >
                    0{cp.order}
                  </text>
                )}

                {/* Floating Totem Label Card */}
                <g transform={`translate(${svgX}, ${svgY - 26})`}>
                  <rect
                    x="-75"
                    y="-22"
                    width="150"
                    height="22"
                    rx="8"
                    fill="#ffffff"
                    stroke={isSelected ? '#ea580c' : '#fed7aa'}
                    strokeWidth={isSelected ? '2' : '1'}
                    filter="url(#cardShadow)"
                  />
                  <text
                    x="0"
                    y="-8"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {cp.order}. {cp.name.length > 18 ? cp.name.slice(0, 16) + '…' : cp.name}
                  </text>
                </g>

                {/* Totem Altitude Tag */}
                <g transform={`translate(${svgX}, ${svgY + 28})`}>
                  <rect
                    x="-32"
                    y="-8"
                    width="64"
                    height="17"
                    rx="6"
                    fill="#fff7ed"
                    stroke="#fed7aa"
                  />
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    fill="#c2410c"
                    fontSize="9.5"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {cp.altitude} m
                  </text>
                </g>
              </g>
            );
          })}

          {/* User Live Location Marker ("Puntino Blu Pulsante") */}
          <g
            id="user-location-marker"
            transform={`translate(${(userLocation.x / 100) * 1000}, ${(userLocation.y / 100) * 700})`}
            className="cursor-move group"
          >
            {/* Outer animated radar ring */}
            <circle
              cx="0"
              cy="0"
              r="28"
              fill="#38bdf8"
              fillOpacity="0.3"
              className="animate-ping opacity-75"
            />
            {/* Second radar layer */}
            <circle
              cx="0"
              cy="0"
              r="16"
              fill="#0284c7"
              fillOpacity="0.4"
            />
            {/* Solid white border ring */}
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="3"
              filter="url(#cardShadow)"
            />
            {/* Inner pulsating core */}
            <circle
              cx="0"
              cy="0"
              r="3.5"
              fill="#ffffff"
            />
            
            {/* User Tooltip Label */}
            <g transform="translate(0, -18)">
              <rect
                x="-42"
                y="-18"
                width="84"
                height="19"
                rx="6"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="1.5"
                filter="url(#cardShadow)"
              />
              <text
                x="0"
                y="-5.5"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="900"
                letterSpacing="0.05em"
              >
                TU SEI QUI
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Nearby Totem Proximity Alert Toast */}
      {nearbyCheckpoint && (
        <div 
          id="nearby-totem-alert"
          className="absolute bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-4 md:w-96 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border-2 border-orange-500 shadow-2xl shadow-orange-500/20 animate-fade-in"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500 text-white font-black text-xs shrink-0 flex items-center justify-center shadow-md shadow-orange-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-orange-600 font-black tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Totem Rilevato nelle vicinanze!</span>
              </div>
              <div className="text-sm font-black text-slate-900 truncate mt-0.5">
                {nearbyCheckpoint.order}. {nearbyCheckpoint.name}
              </div>
              <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                {nearbyCheckpoint.subtitle}
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <button
                  id="scan-nearby-totem-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenScanner(nearbyCheckpoint);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-md shadow-orange-300 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Inquadra QR Totem</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCheckpoint(nearbyCheckpoint);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Dettagli
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Map Controls Toolbar */}
      <div className="absolute right-4 top-20 z-20 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-1.5 flex flex-col shadow-xl shadow-orange-950/5">
          <button
            id="zoom-in-btn"
            title="Ingrandisci Mappa"
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(2.5, z + 0.25)); }}
            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            id="zoom-out-btn"
            title="Riduci Mappa"
            onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(0.8, z - 0.25)); }}
            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors border-t border-slate-100 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            id="reset-map-view-btn"
            title="Reimposta Vista"
            onClick={(e) => { e.stopPropagation(); handleResetView(); }}
            className="p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors border-t border-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* GPS & Navigation Location Helper Buttons */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-1.5 flex flex-col shadow-xl shadow-orange-950/5">
          <button
            id="center-user-btn"
            title="Centra sulla tua posizione"
            onClick={(e) => { e.stopPropagation(); handleCenterOnUser(); }}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
          </button>
          <button
            id="toggle-real-gps-btn"
            title={userLocation.isRealGps ? 'GPS Reale Attivo' : 'Attiva GPS Reale'}
            onClick={(e) => { e.stopPropagation(); onToggleGps(); }}
            className={`p-2 rounded-xl transition-colors border-t border-slate-100 cursor-pointer ${
              userLocation.isRealGps ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
            }`}
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            id="teleport-next-step-btn"
            title="Avanza alla prossima tappa"
            onClick={(e) => { e.stopPropagation(); handleNextStepTeleport(); }}
            className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-colors border-t border-slate-100 cursor-pointer"
          >
            <Footprints className="w-4 h-4" />
          </button>
        </div>

        {/* Elevation profile toggle */}
        <button
          id="toggle-elevation-profile-btn"
          title="Mostra Profilo Altimetrico"
          onClick={(e) => { e.stopPropagation(); setShowElevationProfile(!showElevationProfile); }}
          className={`p-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-orange-950/5 transition-all cursor-pointer ${
            showElevationProfile ? 'bg-orange-500 text-white font-bold border-orange-500' : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
          }`}
        >
          <Mountain className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Altitude & Elevation Profile Bar */}
      {showElevationProfile && (
        <div 
          id="elevation-profile-drawer"
          className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-orange-200 shadow-2xl shadow-orange-950/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <Mountain className="w-4 h-4 text-orange-500" />
              Profilo Altimetrico del Percorso Arboris (275m ➔ 450m ➔ 420m)
            </span>
            <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">Dislivello +580m</span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {checkpoints.map((cp) => (
              <div 
                key={cp.id}
                onClick={() => onSelectCheckpoint(cp)}
                className="group cursor-pointer bg-orange-50/60 hover:bg-orange-100/70 p-2.5 rounded-2xl border border-orange-100 transition-colors text-center shadow-sm"
              >
                <div className="text-[10px] text-slate-500 font-mono font-medium">Tappa {cp.order}</div>
                <div className="text-xs font-bold text-slate-800 truncate">{cp.name}</div>
                <div className="text-xs font-extrabold text-orange-600 font-mono mt-0.5">{cp.altitude}m</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Left Quick Map Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-orange-100 text-[11px] text-slate-600 shadow-md pointer-events-none">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
          <span>Tu (GPS)</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" />
          <span>Totem Attivo</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span>Tappa Completata</span>
        </div>
      </div>
    </div>
  );
};
